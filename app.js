// -------------------------
// Select DOM elements
// -------------------------
const compileBtn = document.getElementById('compileBtn');
const downloadBtn = document.getElementById('downloadBtn');
const svgContainer = document.getElementById('svgContainer');
const dslInput = document.getElementById('dslInput');

// -------------------------
// Starter DSL for Chen ER
// -------------------------
const starterDSL = `# Starter Chen ER example
entity Student
entity Course
weak entity Enrollment

attribute Student id PK
attribute Student phone MULTI
attribute Student age DERIVED

composite Student address { street, city, zip }

relationship Enrolls
identifying relationship HasEnrollment

Enrolls Student (1) TOTAL -- (N) PARTIAL Course
`;

dslInput.value = starterDSL;

// -------------------------
// Function to render SVG
// -------------------------
async function renderSVG(dot) {
    try {
        // Load Graphviz WASM module (local index.js + graphviz.wasm)
        const graphviz = await window.GraphvizModule.load(); 
        const svg = graphviz.dot(dot);
        svgContainer.innerHTML = svg;
    } catch (err) {
        svgContainer.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
        console.error(err);
    }
}

// -------------------------
// Compile button
// -------------------------
compileBtn.addEventListener('click', async () => {
    try {
        const dot = parseDSL(dslInput.value); // parse DSL → DOT
        await renderSVG(dot);
    } catch (err) {
        svgContainer.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
});

// -------------------------
// Download button
// -------------------------
downloadBtn.addEventListener('click', () => {
    const svg = svgContainer.querySelector('svg');
    if (!svg) return alert('No SVG to download');
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chen_er_diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});

// -------------------------
// Auto-render on page load
// -------------------------
window.addEventListener('load', async () => {
    const dot = parseDSL(dslInput.value);
    await renderSVG(dot);
});
