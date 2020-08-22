# Cranach Digital Archive (Frontend) – [Finn Nils Gedrath](https://github.com/finnge)

Projekt im Rahmen von

Frontend-Development (FD) – Prof. Christian Noss \
Kurs im Schwerpunktmodul Web-Development \
Medieninformatik Ba. \
Sommersemester 2020

TH Köln, \
Campus Gummersbach


## Das Projekt

Das Pro

### Anforderungen 📋

- [x] wow 

### Addons 🤩

- [x] **Tastensteuerung Single View**
- `RightArrow`: Nächstes Artefakt
- `LeftArrow`: Vorrheriges Artefakt
- `Escape`: Schließen
- [x] **Single View schließt bei klicken auf Hintergrund**
- [x] **Sprache und Artefakt sind über URI ansprechbar ([#7](https://github.com/mi-classroom/miniprojekt-finnge/pull/7), [#15](https://github.com/mi-classroom/miniprojekt-finnge/pull/15))**
- Über den `hash` sind beide Werte beim Neuladen ansprechbar (Permalink).
- So können Nutzer Links von Artefakten teilen oder sich Artefakte als Bookmark speichern.
- Browser-History wird unterstüzt.
- [x] **Neuer modaler Dialog, wenn keine Sprache in URI erkennbar ist ([#16](https://github.com/mi-classroom/miniprojekt-finnge/pull/16))**
- Der Nutzer kann hier zwischen *Deutsch* und *English* auswählen
- Ermöglicht die Sprachauswahl bei kleinem Viewport
- [x] **Filterung von nicht-funktionierenden Bildern ([#14](https://github.com/mi-classroom/miniprojekt-finnge/pull/14))**
- Bilder, die nicht existieren werden zur Build-Time des HTML-Dokuments herausgefiltert. Ich habe hier die Variante gewählt, dass geguckt wird ob die maximale Größe des Bildes gleich 0 ist, um die Zeit des bauens zu veringern und keinen `fetch` zu schicken.

### Bewusste Änderungen gegenüber Style-Guide/Vorgabe 🎨
- Icons sind von [Material Design](https://material.io/resources/icons/) als Schrift eingebunden. \
*GRUND: Größere Auswahl. Die genauen Icons standen nicht zur Verfügung.*

- Schließ-Icon bei Single View wurde auf die linke Seite verschoben. \
*GRUND: So ist kein Platz für den Titel (der sehr lang seien kann) verschwendet.*

- Der Aufbau der Single Card wurde angepasst. \
*GRUND: Mehr Platz für weitere Daten über das Artefakt.*

## NPM Befehle

Lint-Testing

```bash
npm run test
```

Sass/SCSS watchen

```bash
npm run watch
```

Builden des HTML und des Sass/CSS

```bash
npm run build
```