/**
 * Grade Simulator Application
 * Main application logic and UI management
 */

class GradeSimulator {
    constructor() {
        // Configuration
        this.minSubjects = 2;
        this.maxSubjects = 10; // Increased from 4 to 10
        this.minGrade = 0;
        this.maxGrade = 20; // Changed from 100 to 20
        
        // State
        this.subjects = [];
        this.calculationMode = 'arithmetic';
        this.subjectCount = 2;
        this.freezeMode = false;
        this.targetGrade = null;
        this.isUpdatingFromFreeze = false; // Flag to prevent infinite loops
        
        // Default subject names
        this.defaultNames = ['Théorie', 'Laboratoire', 'Projet', 'Examen', 'TP', 'Stage', 'Mémoire', 'Oral', 'Pratique', 'Contrôle'];
        
        // DOM elements
        this.elements = {
            subjectCountInput: document.getElementById('subject-count'),
            decreaseBtn: document.getElementById('decrease-subjects'),
            increaseBtn: document.getElementById('increase-subjects'),
            calculationModeSelect: document.getElementById('calculation-mode'),
            subjectsContainer: document.getElementById('subjects-container'),
            totalWeightDisplay: document.getElementById('total-weight'),
            weightStatus: document.getElementById('weight-status'),
            weightValidation: document.getElementById('weight-validation'),
            resultInput: document.getElementById('result-input'),
            freezeBtn: document.getElementById('freeze-btn'),
            freezeIcon: document.getElementById('freeze-icon'),
            freezeText: document.getElementById('freeze-text'),
            resultSection: document.querySelector('.result-section'),
            resultInfo: document.getElementById('result-info')
        };
        
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        this.initializeSubjects();
        this.attachEventListeners();
        this.renderSubjects();
        this.updateCalculation();
    }
    
    /**
     * Initialize subjects with default values
     */
    initializeSubjects() {
        this.subjects = [];
        for (let i = 0; i < this.subjectCount; i++) {
            this.subjects.push({
                id: this.generateId(),
                name: this.defaultNames[i] || `Matière ${i + 1}`,
                weight: i < 2 ? 50 : 25, // Default: 50% each for first two
                grade: 15, // Default grade on /20 scale (was 75 on /100)
                locked: false, // Individual lock state
                manualInput: false
            });
        }
    }
    
    /**
     * Generate unique ID for subjects
     */
    generateId() {
        return `subject-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Attach event listeners to controls
     */
    attachEventListeners() {
        // Subject count controls
        this.elements.decreaseBtn.addEventListener('click', () => {
            this.changeSubjectCount(-1);
        });
        
        this.elements.increaseBtn.addEventListener('click', () => {
            this.changeSubjectCount(1);
        });
        
        // Calculation mode
        this.elements.calculationModeSelect.addEventListener('change', (e) => {
            this.calculationMode = e.target.value;
            this.updateCalculation();
        });

        // Freeze button
        this.elements.freezeBtn.addEventListener('click', () => {
            this.toggleFreezeMode();
        });

        // Result input
        this.elements.resultInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value) && value >= this.minGrade && value <= this.maxGrade) {
                if (this.freezeMode) {
                    // In freeze mode, update target and redistribute
                    this.targetGrade = value;
                    // Trigger redistribution from the first unlocked subject
                    const firstUnlocked = this.subjects.find(s => !s.locked);
                    if (firstUnlocked) {
                        // Force a tiny change to trigger redistribution
                        const currentGrade = firstUnlocked.grade;
                        this.updateSubjectGrade(firstUnlocked.id, currentGrade + 0.001, false, false);
                        this.updateSubjectGrade(firstUnlocked.id, currentGrade, false, false);
                    }
                } else {
                    // Manual result change: reverse engineer all unlocked subjects
                    this.reverseEngineerGrades(value);
                }
            }
        });

        this.elements.resultInput.addEventListener('focus', () => {
            if (!this.freezeMode) {
                // Suggest what will happen
                this.elements.resultInfo.textContent = 
                    'Modifier cette valeur ajustera toutes les notes déverrouillées';
            }
        });
    }
    
    /**
     * Toggle freeze mode (target grade simulation)
     */
    toggleFreezeMode() {
        this.freezeMode = !this.freezeMode;

        // Update UI
        if (this.freezeMode) {
            // Activate freeze mode
            this.elements.freezeBtn.classList.add('active');
            this.elements.freezeIcon.textContent = '🔒';
            this.elements.freezeText.textContent = 'Déverrouiller';
            this.elements.resultInput.classList.add('frozen');
            this.elements.resultSection.classList.add('frozen');

            // Get current result as target
            const currentResult = Calculator.calculate(this.subjects, this.calculationMode);
            if (currentResult !== null) {
                this.targetGrade = currentResult;
                this.elements.resultInput.value = Calculator.formatNumber(currentResult, 2);
            }

            this.elements.resultInfo.textContent = 
                'Mode simulation : modifiez une matière pour voir l\'impact sur les autres';

        } else {
            // Deactivate freeze mode
            this.elements.freezeBtn.classList.remove('active');
            this.elements.freezeIcon.textContent = '🔓';
            this.elements.freezeText.textContent = 'Bloquer';
            this.elements.resultInput.classList.remove('frozen');
            this.elements.resultSection.classList.remove('frozen');
            this.targetGrade = null;

            // Return to normal calculation
            this.updateCalculation();
        }
    }

    /**
     * Apply target grade by calculating inverse
     */
    applyTargetGrade() {
        if (!this.freezeMode || this.targetGrade === null) {
            return;
        }

        const validation = Calculator.validateWeights(this.subjects);
        if (!validation.isValid) {
            this.elements.resultInfo.textContent = 
                'Les pondérations doivent égaler 100% pour la simulation';
            return;
        }

        // For 2 subjects: use the last one as adjustment variable
        // For 3+ subjects: use the last one as adjustment variable
        const adjustIndex = this.subjects.length - 1;

        const requiredGrade = Calculator.calculateInverse(
            this.targetGrade,
            this.subjects,
            this.calculationMode,
            adjustIndex
        );

        if (requiredGrade === null) {
            this.elements.resultInfo.textContent = 
                'Impossible de calculer (notes géométriques doivent être > 0)';
            return;
        }

        // Check if required grade is within bounds
        if (requiredGrade < this.minGrade || requiredGrade > this.maxGrade) {
            const subjectName = this.subjects[adjustIndex].name;
            this.elements.resultInfo.textContent = 
                `Note requise pour ${subjectName} : ${Calculator.formatNumber(requiredGrade, 2)} (hors limites)`;
            
            // Clamp to limits
            const clampedGrade = Calculator.clamp(requiredGrade, this.minGrade, this.maxGrade);
            this.updateSubjectGrade(this.subjects[adjustIndex].id, clampedGrade, false, true);
            return;
        }

        // Update the adjustment subject
        this.updateSubjectGrade(this.subjects[adjustIndex].id, requiredGrade, false, true);

        const subjectName = this.subjects[adjustIndex].name;
        this.elements.resultInfo.textContent = 
            `Pour obtenir ${this.targetGrade.toFixed(2)}, ${subjectName} doit être ${Calculator.formatNumber(requiredGrade, 2)}`;
    }

    /**
     * Reverse engineer grades when user manually changes the final result
     * Adjusts all unlocked subjects proportionally to achieve the target
     */
    reverseEngineerGrades(targetResult) {
        const validation = Calculator.validateWeights(this.subjects);
        if (!validation.isValid) {
            this.elements.resultInfo.textContent = 
                'Les pondérations doivent égaler 100% pour ajuster les notes';
            return;
        }

        // Find unlocked subjects
        const unlockedSubjects = this.subjects.filter(s => !s.locked);
        
        if (unlockedSubjects.length === 0) {
            this.elements.resultInfo.textContent = 
                'Impossible : toutes les matières sont verrouillées';
            return;
        }

        // Calculate current result with only locked subjects
        const lockedSubjects = this.subjects.filter(s => s.locked);
        
        if (this.calculationMode === 'geometric') {
            // For geometric mean: target^totalW = product(grade^weight)
            // We need to find what the unlocked subjects should multiply to
            const totalWeight = this.subjects.reduce((sum, s) => sum + s.weight, 0);
            const unlockedWeight = unlockedSubjects.reduce((sum, s) => sum + s.weight, 0);
            
            // Calculate contribution from locked subjects
            let lockedLogSum = 0;
            for (const subject of lockedSubjects) {
                if (subject.grade <= 0) {
                    this.elements.resultInfo.textContent = 
                        'Notes géométriques : toutes doivent être > 0';
                    return;
                }
                lockedLogSum += subject.weight * Math.log(subject.grade);
            }
            
            // Required log sum from unlocked subjects
            const targetLogSum = Math.log(targetResult) * totalWeight;
            const requiredUnlockedLogSum = targetLogSum - lockedLogSum;
            
            // Distribute proportionally to weights
            this.isUpdatingFromFreeze = true;
            for (const subject of unlockedSubjects) {
                const proportion = subject.weight / unlockedWeight;
                const subjectLogValue = requiredUnlockedLogSum * proportion;
                const newGrade = Math.exp(subjectLogValue / subject.weight);
                
                const clampedGrade = Calculator.clamp(newGrade, this.minGrade, this.maxGrade);
                subject.grade = clampedGrade;
                this.updateSubjectUI(subject.id, clampedGrade);
            }
            this.isUpdatingFromFreeze = false;
            
        } else {
            // For arithmetic mean: target = sum(grade * weight) / totalWeight
            const totalWeight = this.subjects.reduce((sum, s) => sum + s.weight, 0);
            const unlockedWeight = unlockedSubjects.reduce((sum, s) => sum + s.weight, 0);
            
            // Calculate contribution from locked subjects
            let lockedWeightedSum = 0;
            for (const subject of lockedSubjects) {
                lockedWeightedSum += subject.grade * subject.weight;
            }
            
            // Required weighted sum from unlocked subjects
            const targetWeightedSum = targetResult * totalWeight;
            const requiredUnlockedWeightedSum = targetWeightedSum - lockedWeightedSum;
            
            // Average grade needed for unlocked subjects
            const averageUnlockedGrade = requiredUnlockedWeightedSum / unlockedWeight;
            
            // Set all unlocked subjects to this average (simple proportional distribution)
            this.isUpdatingFromFreeze = true;
            for (const subject of unlockedSubjects) {
                const clampedGrade = Calculator.clamp(averageUnlockedGrade, this.minGrade, this.maxGrade);
                subject.grade = clampedGrade;
                this.updateSubjectUI(subject.id, clampedGrade);
            }
            this.isUpdatingFromFreeze = false;
        }
        
        // Verify the result
        const newResult = Calculator.calculate(this.subjects, this.calculationMode);
        this.elements.resultInfo.textContent = 
            `Notes ajustées pour atteindre ${targetResult.toFixed(2)} (résultat: ${Calculator.formatNumber(newResult, 2)})`;
    }

    /**
     * Change the number of subjects
     */
    changeSubjectCount(delta) {
        const newCount = this.subjectCount + delta;
        
        if (newCount < this.minSubjects || newCount > this.maxSubjects) {
            return;
        }

        // Disable freeze mode when changing subject count
        if (this.freezeMode) {
            this.toggleFreezeMode();
        }
        
        if (delta > 0) {
            // Add new subject
            const newSubject = {
                id: this.generateId(),
                name: this.defaultNames[this.subjects.length] || `Matière ${this.subjects.length + 1}`,
                weight: 0, // Will be recalculated
                grade: 15, // Default grade on /20 scale
                locked: false,
                manualInput: false
            };
            this.subjects.push(newSubject);
        } else {
            // Remove last subject
            this.subjects.pop();
        }
        
        this.subjectCount = newCount;
        this.elements.subjectCountInput.value = newCount;
        
        // Auto-balance weights equally
        this.autoBalanceWeights();
        
        // Update button states
        this.updateSubjectCountButtons();
        
        // Re-render subjects
        this.renderSubjects();
        this.updateCalculation();
    }

    /**
     * Auto-balance weights equally across all subjects to total 100%
     */
    autoBalanceWeights() {
        const equalWeight = 100 / this.subjects.length;
        
        for (const subject of this.subjects) {
            subject.weight = parseFloat(equalWeight.toFixed(2));
        }
        
        // Adjust last subject to account for rounding errors
        const totalWeight = this.subjects.reduce((sum, s) => sum + s.weight, 0);
        const roundingError = 100 - totalWeight;
        
        if (Math.abs(roundingError) > 0.001 && this.subjects.length > 0) {
            this.subjects[this.subjects.length - 1].weight += roundingError;
            this.subjects[this.subjects.length - 1].weight = parseFloat(
                this.subjects[this.subjects.length - 1].weight.toFixed(2)
            );
        }
    }
    
    /**
     * Update subject count button states
     */
    updateSubjectCountButtons() {
        this.elements.decreaseBtn.disabled = this.subjectCount <= this.minSubjects;
        this.elements.increaseBtn.disabled = this.subjectCount >= this.maxSubjects;
    }
    
    /**
     * Render all subjects to the DOM
     */
    renderSubjects() {
        this.elements.subjectsContainer.innerHTML = '';
        
        this.subjects.forEach((subject, index) => {
            const subjectCard = this.createSubjectCard(subject, index);
            this.elements.subjectsContainer.appendChild(subjectCard);
        });
        
        this.updateSubjectCountButtons();
    }
    
    /**
     * Create a subject card element
     */
    createSubjectCard(subject, index) {
        const card = document.createElement('div');
        card.className = 'subject-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        card.innerHTML = `
            <div class="subject-row">
                <div class="subject-name-input">
                    <label class="input-label" for="name-${subject.id}">Matière</label>
                    <input 
                        type="text" 
                        id="name-${subject.id}" 
                        class="input-field" 
                        value="${subject.name}"
                        data-subject-id="${subject.id}"
                        data-field="name"
                    >
                </div>
                
                <div class="subject-weight-input">
                    <label class="input-label" for="weight-${subject.id}">Poids %</label>
                    <input 
                        type="number" 
                        id="weight-${subject.id}" 
                        class="input-field" 
                        value="${subject.weight}"
                        min="0"
                        max="100"
                        step="1"
                        data-subject-id="${subject.id}"
                        data-field="weight"
                    >
                </div>
                
                <div class="subject-grade-controls">
                    <div class="grade-slider-compact">
                        <label class="input-label" for="slider-${subject.id}">Note</label>
                        <input 
                            type="range" 
                            class="grade-slider" 
                            id="slider-${subject.id}"
                            value="${subject.grade}"
                            min="${this.minGrade}"
                            max="${this.maxGrade}"
                            step="0.25"
                            data-subject-id="${subject.id}"
                            data-field="grade-slider"
                        >
                    </div>
                    
                    <div class="grade-number-input">
                        <label class="input-label" for="manual-${subject.id}">Valeur</label>
                        <input 
                            type="number" 
                            class="manual-input" 
                            id="manual-${subject.id}"
                            value="${subject.grade}"
                            min="${this.minGrade}"
                            max="${this.maxGrade}"
                            step="0.25"
                            data-subject-id="${subject.id}"
                            data-field="manual-grade"
                        >
                    </div>
                    
                    <button 
                        class="subject-lock-btn" 
                        id="lock-${subject.id}"
                        data-subject-id="${subject.id}"
                        data-field="lock"
                        aria-label="Verrouiller cette matière"
                        title="Verrouiller cette matière"
                    >🔓</button>
                </div>
            </div>
        `;
        
        // Attach event listeners to inputs
        this.attachSubjectEventListeners(card, subject);
        
        return card;
    }
    
    /**
     * Attach event listeners to subject inputs
     */
    attachSubjectEventListeners(card, subject) {
        // Name input
        const nameInput = card.querySelector(`[data-field="name"]`);
        nameInput.addEventListener('input', (e) => {
            this.updateSubjectField(subject.id, 'name', e.target.value);
        });
        
        // Weight input
        const weightInput = card.querySelector(`[data-field="weight"]`);
        weightInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value) || 0;
            this.updateSubjectField(subject.id, 'weight', value);
        });
        
        // Manual grade input
        const manualInput = card.querySelector(`[data-field="manual-grade"]`);
        manualInput.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
                subject.manualInput = true;
                this.updateSubjectGrade(subject.id, value, true);
            }
        });
        
        manualInput.addEventListener('focus', () => {
            subject.manualInput = true;
        });
        
        // Grade slider
        const slider = card.querySelector(`[data-field="grade-slider"]`);
        slider.addEventListener('input', (e) => {
            const value = parseFloat(e.target.value);
            subject.manualInput = false;
            this.updateSubjectGrade(subject.id, value, false);
        });

        // Lock button
        const lockBtn = card.querySelector(`[data-field="lock"]`);
        lockBtn.addEventListener('click', () => {
            this.toggleSubjectLock(subject.id);
        });
    }
    
    /**
     * Update a subject field
     */
    updateSubjectField(subjectId, field, value) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;
        
        subject[field] = value;
        
        if (field === 'weight') {
            this.updateWeightValidation();
        }
        
        this.updateCalculation();
    }
    
    /**
     * Toggle lock state for an individual subject
     */
    toggleSubjectLock(subjectId) {
        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        subject.locked = !subject.locked;

        // Update lock button UI
        const lockBtn = document.getElementById(`lock-${subjectId}`);
        const slider = document.getElementById(`slider-${subjectId}`);
        const manualInput = document.getElementById(`manual-${subjectId}`);

        if (subject.locked) {
            lockBtn.textContent = '🔒';
            lockBtn.classList.add('locked');
            lockBtn.title = 'Déverrouiller cette matière';
            
            // Disable inputs when locked
            if (slider) slider.disabled = true;
            if (manualInput) manualInput.disabled = true;
        } else {
            lockBtn.textContent = '🔓';
            lockBtn.classList.remove('locked');
            lockBtn.title = 'Verrouiller cette matière';
            
            // Enable inputs when unlocked
            if (slider) slider.disabled = false;
            if (manualInput) manualInput.disabled = false;
        }
    }

    /**
     * Update a subject's grade with proportional redistribution in freeze mode
     */
    updateSubjectGrade(subjectId, value, fromManual, skipRedistribution = false) {
        // Prevent infinite loops during redistribution
        if (this.isUpdatingFromFreeze) {
            return;
        }

        const subject = this.subjects.find(s => s.id === subjectId);
        if (!subject) return;

        // Don't allow modification if subject is locked
        if (subject.locked && this.freezeMode) {
            return;
        }

        const oldGrade = subject.grade;
        const newGrade = Calculator.clamp(value, this.minGrade, this.maxGrade);
        
        // Calculate the delta (change in grade)
        const gradeDelta = newGrade - oldGrade;

        // Update the subject's grade
        subject.grade = newGrade;
        this.updateSubjectUI(subjectId, newGrade);

        // If in freeze mode and result is locked, redistribute the delta
        if (this.freezeMode && !skipRedistribution && this.targetGrade !== null && Math.abs(gradeDelta) > 0.001) {
            this.redistributeDelta(subjectId, gradeDelta);
        } else if (!this.freezeMode) {
            // Normal mode: just recalculate
            this.updateCalculation();
        }
    }

    /**
     * Redistribute grade delta proportionally across unlocked subjects
     * This maintains the target average when one subject changes
     */
    redistributeDelta(changedSubjectId, gradeDelta) {
        const validation = Calculator.validateWeights(this.subjects);
        if (!validation.isValid) {
            this.elements.resultInfo.textContent = 
                'Les pondérations doivent égaler 100% pour la simulation';
            return;
        }

        // Find unlocked subjects (excluding the one that changed)
        const unlockedSubjects = this.subjects.filter(s => 
            s.id !== changedSubjectId && !s.locked
        );

        if (unlockedSubjects.length === 0) {
            // No unlocked subjects to redistribute to - block the change
            this.elements.resultInfo.textContent = 
                'Impossible : toutes les autres matières sont verrouillées';
            
            // Revert the change
            const changedSubject = this.subjects.find(s => s.id === changedSubjectId);
            if (changedSubject) {
                const revertedGrade = changedSubject.grade - gradeDelta;
                changedSubject.grade = revertedGrade;
                this.updateSubjectUI(changedSubjectId, revertedGrade);
            }
            return;
        }

        const changedSubject = this.subjects.find(s => s.id === changedSubjectId);
        
        if (this.calculationMode === 'geometric') {
            // GEOMETRIC MEAN REDISTRIBUTION
            // Formula: Result = (∏ grade_i^weight_i)^(1/totalWeight)
            // To maintain Result when one grade changes:
            // New_Product = Target^totalWeight = Old_Product * (newGrade/oldGrade)^weight_changed
            
            const totalWeight = this.subjects.reduce((sum, s) => sum + s.weight, 0);
            const unlockedWeight = unlockedSubjects.reduce((sum, s) => sum + s.weight, 0);
            
            if (unlockedWeight === 0) {
                this.elements.resultInfo.textContent = 
                    'Erreur : pondération nulle pour les matières déverrouillées';
                return;
            }

            // Check for zero or negative grades
            if (this.targetGrade <= 0 || changedSubject.grade <= 0) {
                this.elements.resultInfo.textContent = 
                    'Moyenne géométrique : toutes les notes doivent être > 0';
                return;
            }

            // Calculate what the product of unlocked grades must be
            // target^totalW = changed^wChanged * locked^wLocked * unlocked^wUnlocked
            // unlocked^wUnlocked = target^totalW / (changed^wChanged * locked^wLocked)
            
            let fixedLogProduct = changedSubject.weight * Math.log(changedSubject.grade);
            
            // Add locked subjects
            for (const subject of this.subjects) {
                if (subject.id !== changedSubjectId && subject.locked) {
                    if (subject.grade <= 0) {
                        this.elements.resultInfo.textContent = 
                            'Moyenne géométrique : toutes les notes doivent être > 0';
                        return;
                    }
                    fixedLogProduct += subject.weight * Math.log(subject.grade);
                }
            }
            
            // Required log product from unlocked subjects
            const targetLogProduct = Math.log(this.targetGrade) * totalWeight;
            const requiredUnlockedLogProduct = targetLogProduct - fixedLogProduct;
            
            // Distribute proportionally to weights among unlocked subjects
            this.isUpdatingFromFreeze = true;
            
            let allWithinBounds = true;
            const adjustments = [];
            
            for (const subject of unlockedSubjects) {
                // Each subject gets its proportional share of the log product
                const proportion = subject.weight / unlockedWeight;
                const subjectLogValue = requiredUnlockedLogProduct * proportion;
                const newGrade = Math.exp(subjectLogValue / subject.weight);
                
                // Check bounds
                if (newGrade < this.minGrade || newGrade > this.maxGrade) {
                    allWithinBounds = false;
                    adjustments.push({
                        subject: subject,
                        newGrade: Calculator.clamp(newGrade, this.minGrade, this.maxGrade),
                        clamped: true
                    });
                } else {
                    adjustments.push({
                        subject: subject,
                        newGrade: newGrade,
                        clamped: false
                    });
                }
            }
            
            // Apply adjustments
            for (const adj of adjustments) {
                adj.subject.grade = adj.newGrade;
                this.updateSubjectUI(adj.subject.id, adj.newGrade);
            }
            
            this.isUpdatingFromFreeze = false;
            
            // Update info message
            if (!allWithinBounds) {
                this.elements.resultInfo.textContent = 
                    `Résultat bloqué à ${this.targetGrade.toFixed(2)} — Certaines notes plafonnées`;
            } else {
                const adjustedNames = unlockedSubjects.map(s => s.name).join(', ');
                this.elements.resultInfo.textContent = 
                    `Résultat bloqué à ${this.targetGrade.toFixed(2)} — Ajusté: ${adjustedNames}`;
            }
            
        } else {
            // ARITHMETIC MEAN REDISTRIBUTION (original logic - already correct)
            const totalWeight = this.subjects.reduce((sum, s) => sum + s.weight, 0);
            const weightedDelta = gradeDelta * changedSubject.weight;
            const totalUnlockedWeight = unlockedSubjects.reduce((sum, s) => sum + s.weight, 0);

            if (totalUnlockedWeight === 0) {
                this.elements.resultInfo.textContent = 
                    'Erreur : pondération nulle pour les matières déverrouillées';
                return;
            }

            // Redistribute proportionally to weights
            this.isUpdatingFromFreeze = true;

            let allWithinBounds = true;
            const adjustments = [];

            for (const subject of unlockedSubjects) {
                const proportion = subject.weight / totalUnlockedWeight;
                const adjustment = -(weightedDelta / subject.weight) * proportion;
                
                const newGrade = subject.grade + adjustment;
                
                if (newGrade < this.minGrade || newGrade > this.maxGrade) {
                    allWithinBounds = false;
                    adjustments.push({
                        subject: subject,
                        newGrade: Calculator.clamp(newGrade, this.minGrade, this.maxGrade),
                        clamped: true
                    });
                } else {
                    adjustments.push({
                        subject: subject,
                        newGrade: newGrade,
                        clamped: false
                    });
                }
            }

            // Apply adjustments
            for (const adj of adjustments) {
                adj.subject.grade = adj.newGrade;
                this.updateSubjectUI(adj.subject.id, adj.newGrade);
            }

            this.isUpdatingFromFreeze = false;

            // Update info message
            if (!allWithinBounds) {
                this.elements.resultInfo.textContent = 
                    `Résultat bloqué à ${this.targetGrade.toFixed(2)} — Certaines notes plafonnées`;
            } else {
                const adjustedNames = unlockedSubjects.map(s => s.name).join(', ');
                this.elements.resultInfo.textContent = 
                    `Résultat bloqué à ${this.targetGrade.toFixed(2)} — Ajusté: ${adjustedNames}`;
            }
        }
    }

    /**
     * Update all UI elements for a subject's grade
     */
    updateSubjectUI(subjectId, grade) {
        // Update slider
        const slider = document.getElementById(`slider-${subjectId}`);
        if (slider) {
            slider.value = grade;
        }

        // Update manual input
        const manualInput = document.getElementById(`manual-${subjectId}`);
        if (manualInput) {
            manualInput.value = this.formatGrade(grade);
        }
    }
    
    /**
     * Format grade for display
     */
    formatGrade(grade) {
        if (grade === null || grade === undefined) return '—';
        return grade % 1 === 0 ? grade.toFixed(0) : grade.toFixed(1);
    }
    
    /**
     * Update weight validation display
     */
    updateWeightValidation() {
        const validation = Calculator.validateWeights(this.subjects);
        
        this.elements.totalWeightDisplay.textContent = `${validation.total.toFixed(1)}%`;
        
        if (validation.isValid) {
            this.elements.weightStatus.textContent = '✓ Valide';
            this.elements.weightStatus.className = 'validation-status valid';
            this.elements.weightValidation.classList.add('valid');
            this.elements.weightValidation.classList.remove('invalid');
            
            // Enable result section
            this.elements.resultSection.classList.remove('invalid');
        } else {
            this.elements.weightStatus.textContent = '⚠ Doit égaler 100%';
            this.elements.weightStatus.className = 'validation-status invalid';
            this.elements.weightValidation.classList.add('invalid');
            this.elements.weightValidation.classList.remove('valid');
            
            // Visually gray out result section
            this.elements.resultSection.classList.add('invalid');
        }
    }
    
    /**
     * Update the final calculation and display
     */
    updateCalculation() {
        this.updateWeightValidation();
        
        const validation = Calculator.validateWeights(this.subjects);

        // In freeze mode, don't update the result input (it's the target)
        if (this.freezeMode) {
            return;
        }
        
        // Calculate result
        const result = Calculator.calculate(this.subjects, this.calculationMode);
        
        // Update display
        if (result !== null && validation.isValid) {
            this.elements.resultInput.value = Calculator.formatNumber(result, 2);
            
            // Add context info
            const modeText = this.calculationMode === 'arithmetic' ? 
                'Moyenne Arithmétique' : 'Moyenne Géométrique';
            this.elements.resultInfo.textContent = `Calculé avec : ${modeText}`;
            
            // Special case for geometric mean with zero grades
            if (this.calculationMode === 'geometric') {
                const hasZero = this.subjects.some(s => s.grade <= 0);
                if (hasZero) {
                    this.elements.resultInput.value = '';
                    this.elements.resultInput.placeholder = '—';
                    this.elements.resultInfo.textContent = 
                        'La moyenne géométrique nécessite des notes > 0';
                }
            }
        } else {
            this.elements.resultInput.value = '';
            this.elements.resultInput.placeholder = '—';
            if (!validation.isValid) {
                this.elements.resultInfo.textContent = 
                    'Ajustez les pondérations pour égaler 100%';
            } else {
                this.elements.resultInfo.textContent = '';
            }
        }
    }
}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gradeSimulator = new GradeSimulator();
});
