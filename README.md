# Chen ER Diagram Generator

A web-based Chen ER diagram generator that lets you write a simple DSL (Domain Specific Language) and instantly generate ER diagrams as SVGs. Powered by [Graphviz](https://graphviz.org/) compiled to WebAssembly (`@hpcc-js/wasm-graphviz`).

This project runs **entirely in the browser** and works on GitHub Pages — no installation or backend required.

---

## **Features**

* Create **entities** and **weak entities**.
* Add **attributes** to entities or relationships, including:

  * **Primary Key** (`PK`)
  * **Multivalued attributes** (`MULTI`)
  * **Derived attributes** (`DERIVED`)
  * **Composite attributes** (with sub-attributes)
* Define **relationships**, including:

  * Regular and **identifying relationships**.
  * Cardinality and participation (`(1|N|M) (TOTAL|PARTIAL)`).
* Define **ISA / inheritance hierarchies**.
* Automatic generation of **SVG diagrams**.
* Pan and zoom support for diagram preview.
* Compile button to refresh diagram based on DSL.
* Download diagram as **SVG** or **PNG**.
* Starter DSL included to demonstrate functionality.
* Fully client-side; powered by [Graphviz WASM](https://github.com/hpcc-systems/hpcc-js-wasm).
* Syntax help section included.

---

## **DSL Syntax Overview**

### Entities

```text
entity EntityName
weak entity WeakEntityName
```

**Examples:**

```text
entity Student
weak entity Enrollment
```

---

### Attributes

* Attributes can belong to **entities** or **relationships**.
* Syntax is identical for both.

```text
attribute OwnerName attributeName
attribute OwnerName attributeName PK       # primary key
attribute OwnerName attributeName MULTI    # multivalued
attribute OwnerName attributeName DERIVED  # derived
```

**Examples:**

```text
attribute Student id PK
attribute Student phone MULTI
attribute Student age DERIVED

attribute Enrolls role
```

---

### Composite Attributes

```text
composite OwnerName attributeName { sub1, sub2, sub3 }
```

**Example:**

```text
composite Student address { street, city, zip }
```

---

### Relationships

```text
relationship RelationshipName
identifying relationship RelationshipName
```

**Examples:**

```text
relationship Enrolls
identifying relationship HasEnrollment
```

---

### Cardinality & Participation

```text
RelationshipName EntityA (1|N|M) (TOTAL|PARTIAL) -- (1|N|M) (TOTAL|PARTIAL) EntityB
```

**Notes:**

* `TOTAL` = total participation (double line)
* `PARTIAL` = partial participation (single line)

**Examples:**

```text
Enrolls Student (1) TOTAL -- (N) PARTIAL Course
HasEnrollment Enrollment (1) TOTAL -- (1) TOTAL Student
```

---

### Comments

* Any line starting with `#` is ignored.

---

## **Getting Started**

1. Clone this repository:

```bash
git clone https://github.com/ahmwael/chen-er-generator.git
```

2. Open `index.html` in your browser **or deploy to GitHub Pages**.

   * Fully client-side; no backend required.
   * Uses Graphviz WASM from CDN, so it works immediately.

3. Write your DSL in the editor, click **Compile**, and view the diagram.

4. Click **Download** to save the diagram as SVG or PNG.

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

---

## **Contact**

Developed by **Ahmad Wael**

For issues, suggestions, or contributions, open a GitHub issue or submit a PR.







