// -------------------------
// Select DOM elements
// -------------------------
const compileBtn = document.getElementById('compileBtn');
const downloadBtn = document.getElementById('downloadBtn');
const downloadPngBtn = document.getElementById('downloadPngBtn');
const svgContainer = document.getElementById('svgContainer');
const dslInput = document.getElementById('dslInput');

let panZoomInstance = null;
let originalSvgString = null; // Store clean SVG before pan-zoom modifications

// -------------------------
// Starter DSL
// -------------------------
const starterDSL = `# Starter Chen ER example

#colors
entities: #AED6F1
weak_entities: #D6EAF8
relationships: #FFE4B5

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
// Render SVG using Graphviz WASM
// -------------------------
async function renderSVG(dot) {
    try {
        const graphviz = await window.GraphvizModule.load();
        const svgStr = graphviz.dot(dot);

        // Store the original clean SVG string for downloads
        originalSvgString = svgStr;

        // Convert string into DOM element
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgStr, "image/svg+xml");
        const svgElem = svgDoc.documentElement;

        // Clear previous content and append SVG node
        svgContainer.innerHTML = "";
        svgContainer.appendChild(svgElem);

        // Destroy previous pan-zoom instance
        if (panZoomInstance) {
            panZoomInstance.destroy();
            panZoomInstance = null;
        }

        // Initialize new pan-zoom instance
        panZoomInstance = svgPanZoom(svgElem, {
            zoomEnabled: true,
            controlIconsEnabled: true,
            fit: true,
            center: true
        });
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
        const dot = parseDSL(dslInput.value);
        await renderSVG(dot);
    } catch (err) {
        svgContainer.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
    }
});

// -------------------------
// Download SVG (use original, not modified)
// -------------------------
downloadBtn.addEventListener('click', () => {
    if (!originalSvgString) return alert('No SVG to download');

    const blob = new Blob([originalSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'chen_er_diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
});

// -------------------------
// Download PNG (use original SVG, not modified)
// -------------------------
downloadPngBtn.addEventListener('click', () => {
    if (!originalSvgString) return alert('No diagram to export');

    const img = new Image();
    const svgBlob = new Blob([originalSvgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
        const canvas = document.createElement('canvas');

        // Scale for better resolution
        const scale = 2;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext('2d');
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);

        URL.revokeObjectURL(url);

        const pngUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = pngUrl;
        link.download = 'chen_er_diagram.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    img.src = url;
});

// -------------------------
// Auto-render on load
// -------------------------
window.addEventListener('load', async () => {
    const dot = parseDSL(dslInput.value);
    await renderSVG(dot);
});