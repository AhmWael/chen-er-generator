const compileBtn = document.getElementById('compileBtn');
const downloadBtn = document.getElementById('downloadBtn');
const svgContainer = document.getElementById('svgContainer');
const dslInput = document.getElementById('dslInput');

const starterDSL = `# Starter Chen ER example
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
`;

dslInput.value = starterDSL;

// Compile and render DOT -> SVG
async function renderSVG(dot) {
    const { graphviz } = await Graphviz.load();
    const svg = graphviz.dot(dot);
    svgContainer.innerHTML = svg;
}

// Auto-render on load
window.addEventListener('load', async () => {
    const dot = parseDSL(dslInput.value);
    await renderSVG(dot);
});

compileBtn.addEventListener('click', async () => {
    try {
        const dot = parseDSL(dslInput.value);
        await renderSVG(dot);
    } catch (err) {
        svgContainer.innerHTML = '<p style="color:red;">Error: ' + err.message + '</p>';
    }
});

downloadBtn.addEventListener('click', () => {
    const svg = svgContainer.querySelector('svg');
    if (!svg) return alert('No SVG to download');
    const serializer = new XMLSerializer();
    const source = serializer.serializeToString(svg);
    const blob = new Blob([source], {type: 'image/svg+xml;charset=utf-8'});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'diagram.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
});
