# 🎓 Simulateur de Notes Académiques

> Un outil web interactif pour calculer et simuler vos moyennes académiques avec redistribution intelligente

[![Langue](https://img.shields.io/badge/langue-français-blue.svg)](README.md)
[![English](https://img.shields.io/badge/lang-english-red.svg)](README.en.md)
[![Nederlands](https://img.shields.io/badge/taal-nederlands-orange.svg)](README.nl.md)

---

## 📋 Table des Matières

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Démonstration](#démonstration)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Architecture](#architecture)
- [Technologies](#technologies)
- [Licence](#licence)

---

## 🎯 Aperçu

Le **Simulateur de Notes Académiques** est une application web pure (HTML/CSS/JavaScript) conçue pour les étudiants et enseignants souhaitant :

- Calculer des moyennes pondérées (arithmétiques ou géométriques)
- Simuler l'impact d'une note sur le résultat final
- Planifier les notes nécessaires pour atteindre un objectif
- Gérer jusqu'à 10 matières simultanément avec pondérations personnalisées

**Échelle de notation** : /20 (système français/belge)

---

## ✨ Fonctionnalités

### 🧮 Calculs Avancés

- **Moyenne Arithmétique** : `Résultat = Σ(Note × Poids) / Σ(Poids)`
- **Moyenne Géométrique** : `Résultat = ⁿ√(∏ Note^Poids)`
- Validation en temps réel des pondérations (somme = 100%)
- Précision mathématique avec gestion des cas limites

### 🔒 Système de Verrouillage Intelligent

#### Verrouillage Global (Résultat Final)
- Bloquez votre objectif de moyenne
- Toutes les notes déverrouillées s'ajustent automatiquement
- Redistribution proportionnelle aux pondérations

#### Verrouillage Individuel (Par Matière)
- Verrouillez certaines notes déjà acquises
- Les autres matières compensent les changements
- Protection contre les modifications accidentelles

**Exemple pratique** :
```
Objectif : 12.0/20 (bloqué)
Théorie (50%) : 14/20 → Je change à 16/20
Laboratoire (30%) : S'ajuste automatiquement à 10.67/20
Projet (20%) : Verrouillé à 10/20 → Ne bouge pas
✅ Résultat final reste exactement 12.0/20
```

### 🎛️ Interface Utilisateur

- **Design moderne** : Flat design épuré avec palette académique
- **Responsive** : Adapté mobile, tablette et desktop
- **Sliders interactifs** : Curseurs larges (180px) pour précision
- **Double contrôle** : Curseur + input numérique synchronisés
- **Feedback visuel** : 
  - Validation des pondérations (vert/rouge)
  - État grisé si pondérations invalides
  - Indicateurs de verrouillage (🔒/🔓)

### ⚙️ Configuration Flexible

- **2 à 10 matières** configurables dynamiquement
- **Auto-balance des poids** : Ajout/suppression = redistribution équitable
- **Noms personnalisables** : Renommez vos matières
- **Pondérations libres** : Choisissez l'importance de chaque cours

---

## 🎬 Démonstration

### Mode Normal
1. Entrez vos notes et pondérations
2. Le résultat final se calcule en temps réel
3. Ajustez les curseurs pour voir l'impact

### Mode Simulation (Freeze)
1. Bloquez le résultat final à votre objectif
2. Modifiez une matière
3. Les autres s'ajustent automatiquement pour maintenir la moyenne

### Mode Reverse Engineering
1. Tapez directement votre objectif dans "Résultat Final"
2. Toutes les notes déverrouillées s'ajustent pour l'atteindre

---

## 📦 Installation

### Option 1 : Utilisation Directe
```bash
# Clonez le repository
git clone https://github.com/votre-username/simulateur-notes.git
cd simulateur-notes

# Ouvrez index.html dans votre navigateur
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Option 2 : Serveur Local
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js
npx http-server

# Accédez à http://localhost:8000
```

### Aucune Dépendance !
✅ Pas de build  
✅ Pas de npm install  
✅ Pas de framework lourd  
✅ 100% Vanilla JavaScript

---

## 🚀 Utilisation

### Démarrage Rapide

1. **Configurez vos matières**
   - Cliquez sur +/− pour ajouter/supprimer des matières
   - Les pondérations sont auto-équilibrées

2. **Entrez vos notes**
   - Utilisez les curseurs ou tapez directement
   - Notes sur /20

3. **Choisissez le mode de calcul**
   - Arithmétique (défaut) : moyenne classique
   - Géométrique : pour notes multiplicatives

4. **Simulez un objectif**
   - Tapez votre objectif dans "Résultat Final"
   - OU bloquez avec le cadenas 🔒
   - Ajustez une matière → les autres compensent

### Cas d'Usage Avancés

#### Planification d'Examen
```
Situation : J'ai 14/20 en Théorie (50%), 12/20 en Labo (30%)
Question : Combien me faut-il en Projet (20%) pour avoir 13/20 ?

Solution :
1. Verrouillez Théorie et Labo
2. Tapez 13.0 dans Résultat Final
3. Lisez la note requise en Projet : 11.5/20 ✅
```

#### Gestion de Portfolio
```
Objectif : Maintenir 15/20 de moyenne
3 cours terminés → verrouillez-les
2 cours en cours → ajustez pour voir l'impact
```

---

## 🏗️ Architecture

### Structure des Fichiers
```
simulateur-notes/
├── index.html          # Structure HTML
├── styles.css          # Design & mise en page
├── calculator.js       # Logique mathématique pure
├── app.js             # Gestion de l'application
├── README.md          # Documentation (FR)
├── README.en.md       # Documentation (EN)
└── README.nl.md       # Documentation (NL)
```

### Architecture Logicielle

```
┌─────────────────┐
│   index.html    │  ← Interface utilisateur
└────────┬────────┘
         │
    ┌────▼────┐
    │ app.js  │  ← Contrôleur principal
    └────┬────┘     • Gestion d'état
         │          • Événements UI
         │          • Redistribution
    ┌────▼─────────┐
    │calculator.js │  ← Moteur de calcul
    └──────────────┘   • Moyennes
                       • Validation
                       • Inversion
```

### Modules Principaux

#### `calculator.js` - Moteur Mathématique
```javascript
Calculator.arithmeticMean(subjects)    // Moyenne arithmétique
Calculator.geometricMean(subjects)     // Moyenne géométrique
Calculator.calculateInverse(...)       // Calcul inverse
Calculator.validateWeights(subjects)   // Validation pondérations
```

#### `app.js` - Gestion Application
```javascript
GradeSimulator.updateSubjectGrade()    // Mise à jour note
GradeSimulator.redistributeDelta()     // Redistribution freeze
GradeSimulator.reverseEngineerGrades() // Reverse engineering
GradeSimulator.autoBalanceWeights()    // Auto-équilibrage
```

### Algorithmes Clés

#### Redistribution Géométrique (Freeze Mode)
```javascript
// Maintien : target^totalW = ∏(grade^weight)
// Pour chaque matière déverrouillée :
newGrade = exp((requiredLogProduct × proportion) / weight)
```

#### Redistribution Arithmétique (Freeze Mode)
```javascript
// Maintien : target = Σ(grade × weight) / totalWeight
// Compensation proportionnelle du delta pondéré
adjustment = -(weightedDelta / weight) × proportion
```

---

## 🛠️ Technologies

- **HTML5** : Structure sémantique
- **CSS3** : 
  - Flexbox pour layouts
  - CSS Grid pour configuration
  - Variables CSS pour thème cohérent
  - Transitions fluides
- **JavaScript ES6+** :
  - Classes orientées objet
  - Arrow functions
  - Template literals
  - Destructuring
- **Fonts** : 
  - DM Serif Display (titres)
  - IBM Plex Sans (corps)

**Compatibilité** : Navigateurs modernes (Chrome, Firefox, Safari, Edge)

---

## 📄 Licence

Ce projet est sous licence - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 🌟 Remerciements

- Design inspiré par les principes de Material Design et Flat UI
- Police DM Serif Display par Google Fonts
- Police IBM Plex Sans par IBM

---

## 📞 Contact

Créé avec ❤️ pour faciliter la vie académique

**Langues disponibles** : [🇫🇷 Français](README.md) | [🇬🇧 English](README.en.md) | [🇳🇱 Nederlands](README.nl.md)

---

<div align="center">

**Si ce projet vous a aidé, n'hésitez pas à lui donner une ⭐ !**

</div>
