# Cranach Digital Archive (Frontend) – [Finn Nils Gedrath](https://github.com/finnge)

Projekt im Rahmen von

Frontend-Development (FD) – Prof. Christian Noss \
Kurs im Schwerpunktmodul Web-Development \
Medieninformatik Ba. \
Sommersemester 2020

TH Köln, \
Campus Gummersbach


## Das Projekt

Die Seiten für die Cranach Digital Archive wird mit Hilfe eines eigenen [Static Page Generator (SPG)](https://github.com/mi-classroom/miniprojekt-finnge/blob/master/helper/static-page-generator.js) erzeugt. So wird ein Großteil der Build-Time ausgelagert und der Browser fordert nur eine statische Seite an. Dies hat den Vorteil, dass die Seite schnell lädt und Artefakte bei Bedarf automatisch ausgetauscht werden können. Die Wahl viel auf einen eigenen Page Builder, da nur eine HTML-Datei auf Grundlage von zwei JSON-Dateien gebaut werden sollte. Der SPG filtert nicht-funktionierende Datensätze, sortiert und gruppiert die Artefakte und baut die HTML-Datei mit Hilfe von [Mustache.js](https://mustache.github.io/) auf.

Alle genauere Daten, die von den Single-View gebraucht werden, werden nach einem erfolgreichen ersten Content Paint des Browsers geladen, indem die JSON per `fetch()` angesprochen werden. Ich habe mich dazu entschieden Pseudo-Permalinks mit Hilfe des Hash-Wertes zu generieren, um Bilder und Sprache direkt anwählbar zu machen. So entsteht auch eine History mit bereits geöffneten Artefakten.

[Deployment anzeigen](https://mi-classroom.github.io/miniprojekt-finnge/)

### Anforderungen 📋

- [x] Lauffähig auf [GitHub.io](https://mi-classroom.github.io/miniprojekt-finnge/)
- [x] valider HTML-Code
- [x] Responsiveness
- [x] Gemäldeübersicht unterteilt in Jahre
- [x] Akkordion
- [x] Schließen aller Jahre bei mobile
- [x] Single View (Detailansicht)
- [x] Navigation über Single View
- [x] Sprachwechsler


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