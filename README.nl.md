# 🎓 Academische Cijfer Simulator

> Een interactieve webtool om je academische gemiddelden te berekenen en te simuleren met intelligente herverdeling

[![Français](https://img.shields.io/badge/langue-français-blue.svg)](README.md)
[![English](https://img.shields.io/badge/lang-english-red.svg)](README.en.md)
[![Taal](https://img.shields.io/badge/taal-nederlands-orange.svg)](README.nl.md)

---

## 📋 Inhoudsopgave

- [Overzicht](#overzicht)
- [Functies](#functies)
- [Demo](#demo)
- [Installatie](#installatie)
- [Gebruik](#gebruik)
- [Architectuur](#architectuur)
- [Technologieën](#technologieën)
- [Licentie](#licentie)

---

## 🎯 Overzicht

De **Academische Cijfer Simulator** is een pure webapplicatie (HTML/CSS/JavaScript) ontworpen voor studenten en docenten die willen:

- Gewogen gemiddelden berekenen (rekenkundig of meetkundig)
- Het effect van een cijfer op het eindresultaat simuleren
- Benodigde cijfers plannen om een doel te bereiken
- Tot 10 vakken tegelijk beheren met aangepaste wegingen

**Cijferschaal**: /20 (Frans/Belgisch systeem)

---

## ✨ Functies

### 🧮 Geavanceerde Berekeningen

- **Rekenkundig Gemiddelde**: `Resultaat = Σ(Cijfer × Gewicht) / Σ(Gewicht)`
- **Meetkundig Gemiddelde**: `Resultaat = ⁿ√(∏ Cijfer^Gewicht)`
- Real-time validatie van wegingen (som = 100%)
- Wiskundige precisie met randgevallen

### 🔒 Intelligent Vergrendelingssysteem

#### Globale Vergrendeling (Eindresultaat)
- Vergrendel je streefgemiddelde
- Alle ontgrendelde cijfers passen zich automatisch aan
- Proportionele herverdeling op basis van gewichten

#### Individuele Vergrendeling (Per Vak)
- Vergrendel cijfers die je al hebt behaald
- Andere vakken compenseren voor wijzigingen
- Bescherming tegen onbedoelde aanpassingen

**Praktisch Voorbeeld**:
```
Doel: 12.0/20 (vergrendeld)
Theorie (50%): 14/20 → Ik wijzig naar 16/20
Labo (30%): Past automatisch aan naar 10.67/20
Project (20%): Vergrendeld op 10/20 → Blijft vast
✅ Eindresultaat blijft exact 12.0/20
```

### 🎛️ Gebruikersinterface

- **Modern ontwerp**: Strak flat design met academisch kleurenpalet
- **Responsive**: Mobiel, tablet en desktop vriendelijk
- **Interactieve sliders**: Brede sliders (180px) voor precisie
- **Dubbele besturing**: Slider + numerieke invoer gesynchroniseerd
- **Visuele feedback**: 
  - Gewichtsvalidatie (groen/rood)
  - Grijze status bij ongeldige gewichten
  - Vergrendelingsindicatoren (🔒/🔓)

### ⚙️ Flexibele Configuratie

- **2 tot 10 vakken** dynamisch configureerbaar
- **Auto-balans gewichten**: Toevoegen/verwijderen = gelijke herverdeling
- **Aangepaste namen**: Hernoem je vakken
- **Vrije gewichten**: Kies het belang van elk vak

---

## 🎬 Demo

### Normale Modus
1. Voer je cijfers en gewichten in
2. Eindresultaat wordt real-time berekend
3. Pas sliders aan om het effect te zien

### Simulatiemodus (Freeze)
1. Vergrendel het eindresultaat op je doel
2. Wijzig een vak
3. Anderen passen zich automatisch aan om het gemiddelde te behouden

### Reverse Engineering Modus
1. Typ je doel direct in "Eindresultaat"
2. Alle ontgrendelde cijfers passen zich aan om het te bereiken

---

## 📦 Installatie

### Optie 1: Direct Gebruik
```bash
# Kloon de repository
git clone https://github.com/jouw-gebruikersnaam/cijfer-simulator.git
cd cijfer-simulator

# Open index.html in je browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Optie 2: Lokale Server
```bash
# Met Python 3
python -m http.server 8000

# Met Node.js
npx http-server

# Ga naar http://localhost:8000
```

### Geen Dependencies!
✅ Geen build vereist  
✅ Geen npm install  
✅ Geen zwaar framework  
✅ 100% Vanilla JavaScript

---

## 🚀 Gebruik

### Snelstart

1. **Configureer je vakken**
   - Klik op +/− om vakken toe te voegen/verwijderen
   - Gewichten worden automatisch gebalanceerd

2. **Voer je cijfers in**
   - Gebruik sliders of typ direct
   - Cijfers op /20 schaal

3. **Kies berekeningsmodus**
   - Rekenkundig (standaard): klassiek gemiddelde
   - Meetkundig: voor multiplicatieve cijfers

4. **Simuleer een doel**
   - Typ je doel in "Eindresultaat"
   - OF vergrendel met het hangslot 🔒
   - Pas een vak aan → anderen compenseren

### Geavanceerde Gebruiksscenario's

#### Examenplanning
```
Situatie: Ik heb 14/20 in Theorie (50%), 12/20 in Labo (30%)
Vraag: Wat moet ik halen in Project (20%) voor 13/20?

Oplossing:
1. Vergrendel Theorie en Labo
2. Typ 13.0 in Eindresultaat
3. Lees vereist cijfer in Project: 11.5/20 ✅
```

#### Portfolio Beheer
```
Doel: 15/20 gemiddelde behouden
3 afgeronde vakken → vergrendel ze
2 lopende vakken → pas aan om effect te zien
```

---

## 🏗️ Architectuur

### Bestandsstructuur
```
cijfer-simulator/
├── index.html          # HTML structuur
├── styles.css          # Design & layout
├── calculator.js       # Zuivere wiskundige logica
├── app.js             # Applicatiebeheer
├── README.md          # Documentatie (FR)
├── README.en.md       # Documentatie (EN)
└── README.nl.md       # Documentatie (NL)
```

### Software Architectuur

```
┌─────────────────┐
│   index.html    │  ← Gebruikersinterface
└────────┬────────┘
         │
    ┌────▼────┐
    │ app.js  │  ← Hoofdcontroller
    └────┬────┘     • Statusbeheer
         │          • UI events
         │          • Herverdeling
    ┌────▼─────────┐
    │calculator.js │  ← Berekeningsmotor
    └──────────────┘   • Gemiddelden
                       • Validatie
                       • Inversie
```

### Hoofdmodules

#### `calculator.js` - Wiskundige Motor
```javascript
Calculator.arithmeticMean(subjects)    // Rekenkundig gemiddelde
Calculator.geometricMean(subjects)     // Meetkundig gemiddelde
Calculator.calculateInverse(...)       // Inverse berekening
Calculator.validateWeights(subjects)   // Gewichtsvalidatie
```

#### `app.js` - Applicatiebeheer
```javascript
GradeSimulator.updateSubjectGrade()    // Cijfer bijwerken
GradeSimulator.redistributeDelta()     // Freeze herverdeling
GradeSimulator.reverseEngineerGrades() // Reverse engineering
GradeSimulator.autoBalanceWeights()    // Auto-balancering
```

### Belangrijkste Algoritmes

#### Meetkundige Herverdeling (Freeze Modus)
```javascript
// Behoudt: target^totalW = ∏(cijfer^gewicht)
// Voor elk ontgrendeld vak:
newGrade = exp((requiredLogProduct × proportie) / gewicht)
```

#### Rekenkundige Herverdeling (Freeze Modus)
```javascript
// Behoudt: target = Σ(cijfer × gewicht) / totaalGewicht
// Proportionele compensatie van gewogen delta
aanpassing = -(gewogenDelta / gewicht) × proportie
```

---

## 🛠️ Technologieën

- **HTML5**: Semantische structuur
- **CSS3**: 
  - Flexbox voor layouts
  - CSS Grid voor configuratie
  - CSS variabelen voor consistent thema
  - Vloeiende transities
- **JavaScript ES6+**:
  - Object-georiënteerde klassen
  - Arrow functies
  - Template literals
  - Destructuring
- **Lettertypen**: 
  - DM Serif Display (koppen)
  - IBM Plex Sans (body)

**Compatibiliteit**: Moderne browsers (Chrome, Firefox, Safari, Edge)

---

## 📄 Licentie

Dit project is gelicentieerd onder de licentie - zie het [LICENSE](LICENSE) bestand voor details.

---

## 🌟 Erkenningen

- Ontwerp geïnspireerd door Material Design en Flat UI principes
- DM Serif Display lettertype door Google Fonts
- IBM Plex Sans lettertype door IBM

---

## 📞 Contact

Gemaakt met ❤️ om het academische leven makkelijker te maken

**Beschikbare talen**: [🇫🇷 Français](README.md) | [🇬🇧 English](README.en.md) | [🇳🇱 Nederlands](README.nl.md)

---

<div align="center">

**Als dit project je geholpen heeft, geef het dan gerust een ⭐!**

</div>
