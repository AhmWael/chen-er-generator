# Chen ER Diagram Generator

A web-based Chen ER diagram generator that lets you write a simple DSL (Domain Specific Language) and instantly generate ER diagrams as SVGs. Powered by [Graphviz](https://graphviz.org/) compiled to WebAssembly (`@hpcc-js/wasm-graphviz`).

This project is designed to run **entirely in the browser** and works on GitHub Pages — no installation or backend required.

---

## **Features**

* Create entities, weak entities, attributes, relationships, and ISA hierarchies using a simple DSL.
* Automatic generation of SVG diagrams.
* Compile button to refresh diagram based on DSL.
* Download button to save the diagram as `SVG`.
* Starter DSL included to demonstrate functionality.
* Fully client-side; powered by [Graphviz WASM](https://github.com/hpcc-systems/hpcc-js-wasm).
* Syntax help section included.

---

## **DSL Syntax Overview**

Basic Chen ER DSL example:

```
entity Book
attribute isbn PK
attribute title

entity Author
attribute auth_id PK
attribute auth_name

relationship Written_By
Book (N) -- (M) Author

entity User
attribute u_id PK
attribute username

relationship Places
User (1) -- (N) Book

ISA User { Admin, Customer }

weak entity CartItem
attribute quantity
relationship Contains
CartItem (1) -- (1) Book
CartItem (1) -- (1) Cart
```

* **entity <name>**: declares an entity
* **weak entity <name>**: declares a weak entity
* **attribute <name> [PK]**: declares an attribute; add `PK` for primary key
* **relationship <name>**: declares a relationship
* **<Entity> (card) -- (card) <Entity>**: defines relationships with cardinality
* **ISA <Entity> { Sub1, Sub2 }**: defines specialization/inheritance

---

## **Getting Started**

1. Clone this repository:

```bash
git clone https://github.com/ahmwael/chen-er-generator.git
```

2. Open `index.html` in your browser **or deploy to GitHub Pages**.

   * The app is fully client-side; no backend required.
   * Uses Graphviz WASM from CDN, so it works immediately.

3. Write your DSL in the editor, click **Compile**, and view the diagram.

4. Click **Download** to save the diagram as SVG.

---

## **Folder Structure**

```
chen-er-generator/
├─ index.html           # Main HTML page
├─ style.css            # Styles for page
├─ parser.js            # DSL → DOT parser
├─ app.js               # Application logic (Graphviz rendering)
├─ README.md
└─ LICENSE
```

> No backend needed — all rendering happens in the browser.

---

## **Credits**

* Uses [Graphviz](https://graphviz.org/) compiled to WebAssembly via [`@hpcc-js/wasm-graphviz`](https://github.com/hpcc-systems/hpcc-js-wasm).
* Inspired by [PlantUML](https://plantuml.com/) for code-to-diagram generation.

---

## **Future Features**

* Support for multiple diagrams in one page.
* Live syntax checking in the DSL editor.
* Export as PNG in addition to SVG.
* More complete Chen ER features like composite attributes, multi-attribute keys, and optional relationships.

---

## **Contact**

Developed by **Ahmad Wael** 

For issues, suggestions, or contributions, open a GitHub issue or submit a PR.
