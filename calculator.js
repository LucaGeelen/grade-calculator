/**
 * Calculator Module
 * Handles mathematical calculations for grade averaging
 */

const Calculator = {
    /**
     * Calculate arithmetic mean (weighted average)
     * Formula: Σ(grade * weight) / Σ(weight)
     * 
     * @param {Array} subjects - Array of subject objects with grade and weight
     * @returns {number|null} - Calculated average or null if invalid
     */
    arithmeticMean(subjects) {
        // Filter out subjects with invalid data
        const validSubjects = subjects.filter(s => 
            s.grade !== null && 
            s.grade !== undefined && 
            s.weight > 0 &&
            !isNaN(s.grade) &&
            !isNaN(s.weight)
        );

        if (validSubjects.length === 0) {
            return null;
        }

        // Calculate sum of (grade * weight)
        const weightedSum = validSubjects.reduce((sum, subject) => {
            return sum + (subject.grade * subject.weight);
        }, 0);

        // Calculate sum of weights
        const totalWeight = validSubjects.reduce((sum, subject) => {
            return sum + subject.weight;
        }, 0);

        // Prevent division by zero
        if (totalWeight === 0) {
            return null;
        }

        return weightedSum / totalWeight;
    },

    /**
     * Calculate geometric mean (weighted)
     * Formula: (grade₁^weight₁ * grade₂^weight₂ * ... * gradeₙ^weightₙ)^(1/Σweight)
     * Equivalent to: Σweight√(∏(gradeᵢ^weightᵢ))
     * 
     * @param {Array} subjects - Array of subject objects with grade and weight
     * @returns {number|null} - Calculated geometric mean or null if invalid
     */
    geometricMean(subjects) {
        // Filter out subjects with invalid data
        const validSubjects = subjects.filter(s => 
            s.grade !== null && 
            s.grade !== undefined && 
            s.weight > 0 &&
            !isNaN(s.grade) &&
            !isNaN(s.weight)
        );

        if (validSubjects.length === 0) {
            return null;
        }

        // Check for zero or negative grades (geometric mean undefined)
        const hasInvalidGrades = validSubjects.some(s => s.grade <= 0);
        if (hasInvalidGrades) {
            return null; // Geometric mean undefined for non-positive numbers
        }

        // Calculate sum of weights
        const totalWeight = validSubjects.reduce((sum, subject) => {
            return sum + subject.weight;
        }, 0);

        if (totalWeight === 0) {
            return null;
        }

        // Calculate using logarithms to avoid overflow with large exponents
        // log(geometric mean) = Σ(weight * log(grade)) / Σ(weight)
        // geometric mean = exp(log(geometric mean))
        const logSum = validSubjects.reduce((sum, subject) => {
            return sum + (subject.weight * Math.log(subject.grade));
        }, 0);

        const logMean = logSum / totalWeight;
        const geometricMean = Math.exp(logMean);

        return geometricMean;
    },

    /**
     * Calculate final result based on selected mode
     * 
     * @param {Array} subjects - Array of subject objects
     * @param {string} mode - Calculation mode ('arithmetic' or 'geometric')
     * @returns {number|null} - Calculated result
     */
    calculate(subjects, mode = 'arithmetic') {
        if (!Array.isArray(subjects) || subjects.length === 0) {
            return null;
        }

        switch (mode) {
            case 'geometric':
                return this.geometricMean(subjects);
            case 'arithmetic':
            default:
                return this.arithmeticMean(subjects);
        }
    },

    /**
     * Validate total weight sum
     * 
     * @param {Array} subjects - Array of subject objects
     * @returns {Object} - Validation result with total and isValid flag
     */
    validateWeights(subjects) {
        const total = subjects.reduce((sum, subject) => {
            const weight = parseFloat(subject.weight) || 0;
            return sum + weight;
        }, 0);

        return {
            total: total,
            isValid: Math.abs(total - 100) < 0.01 // Allow small floating point errors
        };
    },

    /**
     * Calculate required grade for subject B to achieve target mean (Arithmetic)
     * Given: target mean, grade A, weight A, weight B
     * Find: grade B
     * 
     * Formula: B = (target * totalWeight - A * weightA) / weightB
     * 
     * @param {number} targetMean - Desired final average
     * @param {number} gradeA - Known grade for subject A
     * @param {number} weightA - Weight of subject A
     * @param {number} weightB - Weight of subject B
     * @returns {number|null} - Required grade for B or null if impossible
     */
    inverseArithmeticMean(targetMean, gradeA, weightA, weightB) {
        if (weightB === 0) {
            return null;
        }

        const totalWeight = weightA + weightB;
        const requiredGradeB = (targetMean * totalWeight - gradeA * weightA) / weightB;

        return requiredGradeB;
    },

    /**
     * Calculate required grade for subject B to achieve target geometric mean
     * Given: target mean, grade A, weight A, weight B
     * Find: grade B
     * 
     * Formula (from geometric mean):
     * target = (A^wA * B^wB)^(1/(wA+wB))
     * target^(wA+wB) = A^wA * B^wB
     * B^wB = target^(wA+wB) / A^wA
     * B = (target^(wA+wB) / A^wA)^(1/wB)
     * 
     * @param {number} targetMean - Desired final geometric mean
     * @param {number} gradeA - Known grade for subject A
     * @param {number} weightA - Weight of subject A
     * @param {number} weightB - Weight of subject B
     * @returns {number|null} - Required grade for B or null if impossible
     */
    inverseGeometricMean(targetMean, gradeA, weightA, weightB) {
        // Check for invalid inputs
        if (weightB === 0 || targetMean <= 0 || gradeA <= 0) {
            return null;
        }

        const totalWeight = weightA + weightB;

        // Using logarithms for numerical stability
        // log(B) = [log(target) * totalWeight - log(A) * weightA] / weightB
        const logB = (Math.log(targetMean) * totalWeight - Math.log(gradeA) * weightA) / weightB;
        const requiredGradeB = Math.exp(logB);

        return requiredGradeB;
    },

    /**
     * Calculate inverse (target grade mode) for multi-subject case
     * Adjusts the last subject to maintain target mean
     * 
     * @param {number} targetMean - Desired final average
     * @param {Array} subjects - Array of subject objects
     * @param {string} mode - Calculation mode ('arithmetic' or 'geometric')
     * @param {number} adjustSubjectIndex - Index of subject to adjust (default: last)
     * @returns {number|null} - Required grade for adjust subject
     */
    calculateInverse(targetMean, subjects, mode = 'arithmetic', adjustSubjectIndex = -1) {
        if (!Array.isArray(subjects) || subjects.length < 2) {
            return null;
        }

        // Use last subject by default
        const adjustIndex = adjustSubjectIndex === -1 ? subjects.length - 1 : adjustSubjectIndex;
        
        if (adjustIndex < 0 || adjustIndex >= subjects.length) {
            return null;
        }

        // Special optimized case for 2 subjects
        if (subjects.length === 2) {
            const indexA = adjustIndex === 0 ? 1 : 0;
            const indexB = adjustIndex;
            
            const gradeA = subjects[indexA].grade;
            const weightA = subjects[indexA].weight;
            const weightB = subjects[indexB].weight;

            if (mode === 'geometric') {
                return this.inverseGeometricMean(targetMean, gradeA, weightA, weightB);
            } else {
                return this.inverseArithmeticMean(targetMean, gradeA, weightA, weightB);
            }
        }

        // General case for 3+ subjects
        // Keep all subjects except the one to adjust
        const otherSubjects = subjects.filter((_, idx) => idx !== adjustIndex);
        const adjustWeight = subjects[adjustIndex].weight;

        if (mode === 'geometric') {
            // For geometric: target^totalW = A^wA * B^wB * ... * X^wX
            // Solve for X: X = (target^totalW / (A^wA * B^wB * ...))^(1/wX)
            const totalWeight = subjects.reduce((sum, s) => sum + s.weight, 0);
            
            let logProduct = 0;
            for (const subject of otherSubjects) {
                if (subject.grade <= 0) return null;
                logProduct += subject.weight * Math.log(subject.grade);
            }

            const logX = (Math.log(targetMean) * totalWeight - logProduct) / adjustWeight;
            return Math.exp(logX);

        } else {
            // For arithmetic: target = (A*wA + B*wB + ... + X*wX) / totalW
            // Solve for X: X = (target * totalW - A*wA - B*wB - ...) / wX
            const totalWeight = subjects.reduce((sum, s) => sum + s.weight, 0);
            
            let weightedSum = 0;
            for (const subject of otherSubjects) {
                weightedSum += subject.grade * subject.weight;
            }

            return (targetMean * totalWeight - weightedSum) / adjustWeight;
        }
    },

    /**
     * Format number to specified decimal places
     * 
     * @param {number} value - Number to format
     * @param {number} decimals - Number of decimal places
     * @returns {string} - Formatted number
     */
    formatNumber(value, decimals = 2) {
        if (value === null || value === undefined || isNaN(value)) {
            return '—';
        }
        return value.toFixed(decimals);
    },

    /**
     * Clamp a value between min and max
     * 
     * @param {number} value - Value to clamp
     * @param {number} min - Minimum value
     * @param {number} max - Maximum value
     * @returns {number} - Clamped value
     */
    clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Calculator;
}
