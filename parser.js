// Full-featured Chen ER DSL parser
function parseDSL(dsl) {
    const lines = dsl.split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#'));
    const entities = [];
    const weakEntities = [];
    const attributes = [];
    const relationships = [];
    const isa = [];
    const edges = [];

    lines.forEach(line => {
        let m;
        // ISA
        if (m = line.match(/^ISA\s+(\w+)\s*{(.+)}$/)) {
            const superEntity = m[1];
            const subs = m[2].split(',').map(s => s.trim());
            isa.push({superEntity, subs});
        }
        // Entities
        else if (m = line.match(/^entity\s+(\w+)$/)) entities.push(m[1]);
        else if (m = line.match(/^weak entity\s+(\w+)$/)) weakEntities.push(m[1]);
        // Attributes
        else if (m = line.match(/^attribute\s+(\w+)(?:\s+(PK|MULTI|DERIVED))?/)) {
            attributes.push({name: m[1], type: m[2] || null});
        }
        // Relationships
        else if (m = line.match(/^relationship\s+(\w+)/)) relationships.push({name:m[1]});
        else if (m = line.match(/^identifying relationship\s+(\w+)/)) relationships.push({name:m[1], identifying:true});
        // Entity-relationship edges
        else if (m = line.match(/^(\w+)\s+\((\d+|N|M)\)\s+--\s+\((\d+|N|M)\)\s+(\w+)/)) {
            edges.push({from:m[1], fromCard:m[2], to:m[4], toCard:m[3]});
        }
    });

    // DOT generation
    let dot = 'digraph ER {\n';
    dot += 'graph [splines=true, rankdir=LR, fontsize=12];\n';
    dot += 'node [fontname="Helvetica"];\n';

    // Entities
    entities.forEach(e => dot += `  ${e} [shape=rectangle];\n`);
    weakEntities.forEach(e => dot += `  ${e} [shape=rectangle, peripheries=2];\n`);

    // Attributes
    attributes.forEach(a => {
        let label = a.name;
        if(a.type==='PK') label = `<u>${a.name}</u>`;
        let style = 'ellipse';
        if(a.type==='MULTI') style += ', peripheries=2';
        if(a.type==='DERIVED') style += ', style=dashed';
        dot += `  ${a.name} [shape=${style}, label="${label}"];\n`;
    });

    // Relationships
    relationships.forEach(r => {
        let style = 'diamond';
        if(r.identifying) style += ', penwidth=3';
        dot += `  ${r.name} [shape=${style}];\n`;
    });

    // ISA triangles
    isa.forEach(i => {
        const triName = `ISA_${i.superEntity}`;
        dot += `  ${triName} [shape=triangle, label="ISA"];\n`;
        dot += `  ${triName} -> ${i.superEntity} [arrowhead=none];\n`;
        i.subs.forEach(s => dot += `  ${triName} -> ${s} [arrowhead=none];\n`);
    });

    // Edges
    edges.forEach(e => {
        dot += `  ${e.from} -> ${e.to} [label="${e.fromCard}:${e.toCard}", arrowhead=none];\n`;
    });

    dot += '}';
    return dot;
}
