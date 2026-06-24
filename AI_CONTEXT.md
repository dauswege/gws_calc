# AI Context – gws_calc

## Projektübersicht

`gws_calc` ist eine mobile-first Webapplikation auf Basis von Angular.  
Die Anwendung dient zur Erfassung von Speisen und Getränken für mehrere Tische.  
Die App soll als Progressive Web App (PWA) funktionieren und auf Smartphones besonders gut bedienbar sein.

## Hauptziel der Anwendung

Die App unterstützt beim schnellen Erfassen von Bestellungen in einer gastronomischen Umgebung, z. B. bei einem Fest, Vereinsbetrieb oder einer Veranstaltung.

Wichtige Ziele:

- schnelle Bedienung auf Mobilgeräten
- möglichst wenige Klicks
- übersichtliche Darstellung von Produkten
- Erfassung getrennt nach Tischen
- klare Checkout-Ansicht vor Abschluss
- PWA-fähig für Home-Screen-Nutzung und gute mobile Performance

## Fachlicher Kontext

Die App verwaltet:

- **Produkte**: Speisen und Getränke
- **Preise**: Preislisten bzw. produktbezogene Preise
- **Warenkorb/Bestellung**: aktuell erfasste Positionen
- **Tische**: Bestellungen können verschiedenen Tischen zugeordnet werden
- **Checkout**: Übersicht aller erfassten Positionen vor Abschluss

## Erwartete Kernfunktionen

### 1. Produkterfassung
- Benutzer sollen Speisen und Getränke schnell auswählen können
- Produkte sollen gut lesbar und auf kleinen Displays leicht antippbar sein
- Die Eingabe muss für Touch-Bedienung optimiert sein

### 2. Tischbezogene Erfassung
- Bestellungen werden für einen ausgewählten Tisch erfasst
- Ein Wechsel zwischen Tischen soll einfach möglich sein
- Die App muss klar anzeigen, für welchen Tisch aktuell erfasst wird

### 3. Warenkorb / Bestellübersicht
- Ausgewählte Produkte werden in einer Bestellliste gesammelt
- Mengen und Summen sollen nachvollziehbar angezeigt werden
- Änderungen an Mengen oder das Entfernen von Positionen sollen einfach möglich sein

### 4. Checkout-Seite
- Vor dem Abschluss gibt es eine Checkout-Ansicht
- Dort werden alle Positionen eines Tisches oder einer aktuellen Bestellung nochmals übersichtlich aufgelistet
- Die Ansicht soll für eine schnelle visuelle Kontrolle optimiert sein

### 5. Progressive Web App
- Die Anwendung ist eine PWA
- Sie soll auf mobilen Geräten installierbar sein
- Grundfunktionen und Navigation sollen PWA-freundlich umgesetzt sein
- Performance und responsive Darstellung haben hohe Priorität

## UX- und UI-Prinzipien

## Mobile First
Die Anwendung wird primär für Smartphones entwickelt. Desktop ist zweitrangig.

Daher gilt:

- zuerst für kleine Bildschirme denken
- große Buttons und Touch-Ziele verwenden
- wenig Text, klare Hierarchie
- wichtige Aktionen im sichtbaren Bereich platzieren
- keine überladenen Layouts
- Formulare und Listen für schnelle Bedienung optimieren

## Bedienprinzipien
- wenige Interaktionen pro Bestellung
- klare visuelle Rückmeldung nach jeder Aktion
- aktuelle Auswahl und aktiver Tisch müssen immer erkennbar sein
- Checkout muss sofort verständlich sein
- wichtige Aktionen dürfen nicht versteckt sein

## Designleitlinien
- klare Trennung zwischen Speisen und Getränken
- gute Lesbarkeit auch bei hellem Umgebungslicht
- konsistente Farb- und Komponentenlogik
- kompakte, aber gut antippbare Karten und Buttons
- Summen, Mengen und Tischinformationen visuell hervorheben

## Technischer Kontext

## Framework / Stack
- Angular
- TypeScript
- SCSS
- Progressive Web App
- Firebase-Kontext ist im Projekt vorhanden

## Relevante Bereiche im Projekt
- `src/app/core/models/` enthält die zentralen Datenmodelle
- `src/app/core/services/` enthält die Geschäftslogik und Datenzugriffe
- `src/app/features/products/` enthält die Produktauswahl
- `src/app/features/cart/` enthält Warenkorb-/Bestelllogik
- `src/app/features/orders/` enthält Tisch-/Order-bezogene UI
- `src/app/features/prices/` enthält Preisdarstellung oder Preislogik

## Fachliche Begriffe
Verwende im Projekt konsistent folgende Begriffe:

- **Produkt** = Speise oder Getränk
- **Tisch** = Zuordnung einer Bestellung zu einem Tisch
- **Warenkorb** = aktuelle Sammlung ausgewählter Positionen
- **Bestellung** = erfasste Positionen für einen Tisch
- **Checkout** = finale Übersichtsseite vor Abschluss
- **Preis** = Preis eines Produkts
- **Order Item / Cart Item** = einzelne Position mit Menge und Produktbezug

## Erwartungen an generierten Code

Wenn Code für dieses Projekt vorgeschlagen oder erzeugt wird, dann bitte:

- mobile-first umsetzen
- bestehende Angular-Struktur respektieren
- vorhandene Modelle und Services wiederverwenden
- wiederverwendbare Komponenten bevorzugen
- keine unnötig komplexen State-Management-Lösungen einführen
- klare, wartbare TypeScript-Typen verwenden
- UI-Elemente touchfreundlich gestalten
- Accessibility mitdenken
- PWA-Aspekte nicht verschlechtern
- Performance auf mobilen Geräten beachten

## Erwartungen an generierte UI

Neue UI-Komponenten sollen:

- auf Smartphone-Bildschirmen zuerst gut funktionieren
- vertikale Layouts bevorzugen
- große Touch-Flächen haben
- wichtige Informationen priorisieren:
  1. aktiver Tisch
  2. Produkte
  3. Anzahl/Menge
  4. Zwischensumme/Gesamtsumme
  5. Checkout-Aktion

## Nicht-Ziele

Folgendes hat aktuell niedrigere Priorität:

- komplexe Desktop-Optimierung
- übermäßig dekorative Animationen
- stark verschachtelte Formulare
- unnötig tiefe Navigationsstrukturen
- zu technische Oberfläche für Endanwender

## Beispielhafte Produktvision

Die Anwendung soll sich anfühlen wie ein schnelles mobiles Kassenerfassungs- oder Bestellwerkzeug für Servicekräfte.  
Wichtiger als Funktionsvielfalt ist eine schnelle, robuste und verständliche Bedienung auf dem Smartphone.

## Arbeitsanweisung für KI-Assistenten

Bei Vorschlägen, Refactorings oder neuen Features bitte immer prüfen:

1. Ist die Lösung mobile-first?
2. Ist die Bedienung für Touch optimiert?
3. Bleibt die Erfassung pro Tisch klar verständlich?
4. Ist die Checkout-Ansicht übersichtlich?
5. Passt die Lösung in die bestehende Angular-Struktur?
6. Unterstützt die Lösung das PWA-Ziel?
7. Ist die Lösung eher einfach und pragmatisch statt überengineert?

Falls unklar ist, wie etwas umgesetzt werden soll, bevorzuge:
- einfache UI
- klare Datenmodelle
- geringe Klickzahl
- gute Lesbarkeit auf kleinen Displays
- nachvollziehbare Bestell- und Tischlogik
