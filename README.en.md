# 🎓 Academic Grade Simulator

> An interactive web tool to calculate and simulate your academic averages with intelligent redistribution

[![Français](https://img.shields.io/badge/langue-français-blue.svg)](README.md)
[![Language](https://img.shields.io/badge/lang-english-red.svg)](README.en.md)
[![Nederlands](https://img.shields.io/badge/taal-nederlands-orange.svg)](README.nl.md)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [License](#license)

---

## 🎯 Overview

The **Academic Grade Simulator** is a pure web application (HTML/CSS/JavaScript) designed for students and teachers who want to:

- Calculate weighted averages (arithmetic or geometric)
- Simulate the impact of a grade on the final result
- Plan required grades to achieve a target
- Manage up to 10 subjects simultaneously with custom weights

**Grading scale**: /20 (French/Belgian system)

---

## ✨ Features

### 🧮 Advanced Calculations

- **Arithmetic Mean**: `Result = Σ(Grade × Weight) / Σ(Weight)`
- **Geometric Mean**: `Result = ⁿ√(∏ Grade^Weight)`
- Real-time weight validation (sum = 100%)
- Mathematical precision with edge case handling

### 🔒 Intelligent Locking System

#### Global Lock (Final Result)
- Lock your target average
- All unlocked grades adjust automatically
- Proportional redistribution based on weights

#### Individual Lock (Per Subject)
- Lock grades you've already earned
- Other subjects compensate for changes
- Protection against accidental modifications

**Practical Example**:
```
Target: 12.0/20 (locked)
Theory (50%): 14/20 → I change to 16/20
Lab (30%): Automatically adjusts to 10.67/20
Project (20%): Locked at 10/20 → Stays fixed
✅ Final result remains exactly 12.0/20
```

### 🎛️ User Interface

- **Modern design**: Clean flat design with academic color palette
- **Responsive**: Mobile, tablet, and desktop friendly
- **Interactive sliders**: Wide sliders (180px) for precision
- **Dual control**: Slider + numeric input synchronized
- **Visual feedback**: 
  - Weight validation (green/red)
  - Grayed state if weights invalid
  - Lock indicators (🔒/🔓)

### ⚙️ Flexible Configuration

- **2 to 10 subjects** dynamically configurable
- **Auto-balance weights**: Add/remove = equal redistribution
- **Custom names**: Rename your subjects
- **Free weights**: Choose the importance of each course

---

## 🎬 Demo

### Normal Mode
1. Enter your grades and weights
2. Final result calculates in real-time
3. Adjust sliders to see the impact

### Simulation Mode (Freeze)
1. Lock the final result to your target
2. Modify a subject
3. Others adjust automatically to maintain the average

### Reverse Engineering Mode
1. Type your target directly in "Final Result"
2. All unlocked grades adjust to reach it

---

## 📦 Installation

### Option 1: Direct Use
```bash
# Clone the repository
git clone https://github.com/your-username/grade-simulator.git
cd grade-simulator

# Open index.html in your browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Option 2: Local Server
```bash
# With Python 3
python -m http.server 8000

# With Node.js
npx http-server

# Access http://localhost:8000
```

### No Dependencies!
✅ No build required  
✅ No npm install  
✅ No heavy framework  
✅ 100% Vanilla JavaScript

---

## 🚀 Usage

### Quick Start

1. **Configure your subjects**
   - Click +/− to add/remove subjects
   - Weights are auto-balanced

2. **Enter your grades**
   - Use sliders or type directly
   - Grades on /20 scale

3. **Choose calculation mode**
   - Arithmetic (default): classic average
   - Geometric: for multiplicative grades

4. **Simulate a target**
   - Type your target in "Final Result"
   - OR lock with the padlock 🔒
   - Adjust one subject → others compensate

### Advanced Use Cases

#### Exam Planning
```
Situation: I have 14/20 in Theory (50%), 12/20 in Lab (30%)
Question: What do I need in Project (20%) to get 13/20?

Solution:
1. Lock Theory and Lab
2. Type 13.0 in Final Result
3. Read required grade in Project: 11.5/20 ✅
```

#### Portfolio Management
```
Goal: Maintain 15/20 average
3 completed courses → lock them
2 ongoing courses → adjust to see impact
```

---

## 🏗️ Architecture

### File Structure
```
grade-simulator/
├── index.html          # HTML structure
├── styles.css          # Design & layout
├── calculator.js       # Pure mathematical logic
├── app.js             # Application management
├── README.md          # Documentation (FR)
├── README.en.md       # Documentation (EN)
└── README.nl.md       # Documentation (NL)
```

### Software Architecture

```
┌─────────────────┐
│   index.html    │  ← User interface
└────────┬────────┘
         │
    ┌────▼────┐
    │ app.js  │  ← Main controller
    └────┬────┘     • State management
         │          • UI events
         │          • Redistribution
    ┌────▼─────────┐
    │calculator.js │  ← Calculation engine
    └──────────────┘   • Averages
                       • Validation
                       • Inversion
```

### Main Modules

#### `calculator.js` - Math Engine
```javascript
Calculator.arithmeticMean(subjects)    // Arithmetic mean
Calculator.geometricMean(subjects)     // Geometric mean
Calculator.calculateInverse(...)       // Inverse calculation
Calculator.validateWeights(subjects)   // Weight validation
```

#### `app.js` - Application Management
```javascript
GradeSimulator.updateSubjectGrade()    // Update grade
GradeSimulator.redistributeDelta()     // Freeze redistribution
GradeSimulator.reverseEngineerGrades() // Reverse engineering
GradeSimulator.autoBalanceWeights()    // Auto-balancing
```

### Key Algorithms

#### Geometric Redistribution (Freeze Mode)
```javascript
// Maintains: target^totalW = ∏(grade^weight)
// For each unlocked subject:
newGrade = exp((requiredLogProduct × proportion) / weight)
```

#### Arithmetic Redistribution (Freeze Mode)
```javascript
// Maintains: target = Σ(grade × weight) / totalWeight
// Proportional compensation of weighted delta
adjustment = -(weightedDelta / weight) × proportion
```

---

## 🛠️ Technologies

- **HTML5**: Semantic structure
- **CSS3**: 
  - Flexbox for layouts
  - CSS Grid for configuration
  - CSS variables for consistent theme
  - Smooth transitions
- **JavaScript ES6+**:
  - Object-oriented classes
  - Arrow functions
  - Template literals
  - Destructuring
- **Fonts**: 
  - DM Serif Display (headings)
  - IBM Plex Sans (body)

**Compatibility**: Modern browsers (Chrome, Firefox, Safari, Edge)

---

## 📄 License

This project is licensed under the License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Acknowledgments

- Design inspired by Material Design and Flat UI principles
- DM Serif Display font by Google Fonts
- IBM Plex Sans font by IBM

---

## 📞 Contact

Created with ❤️ to make academic life easier

**Available languages**: [🇫🇷 Français](README.md) | [🇬🇧 English](README.en.md) | [🇳🇱 Nederlands](README.nl.md)

---

<div align="center">

**If this project helped you, feel free to give it a ⭐!**

</div>
