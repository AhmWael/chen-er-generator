// ================================
// Chen ER DSL Parser → Graphviz DOT
// ================================
function parseDSL(dsl) {
    const lines = dsl
        .split("\n")
        .map(l => l.trim())
        .filter(l => l && !l.startsWith("#"));

    const entities = {};
    const relationships = {};
    const attributes = [];
    const composites = [];
    const edges = [];

    // -------------------------
    // Parse DSL
    // -------------------------
    for (const line of lines) {
        let m;

        // Entity
        if (m = line.match(/^entity\s+(\w+)$/)) {
            entities[m[1]] = { weak: false };
        }

        // Weak Entity
        else if (m = line.match(/^weak entity\s+(\w+)$/)) {
            entities[m[1]] = { weak: true };
        }

        // Relationship
        else if (m = line.match(/^relationship\s+(\w+)$/)) {
            relationships[m[1]] = { identifying: false };
        }

        // Identifying Relationship
        else if (m = line.match(/^identifying relationship\s+(\w+)$/)) {
            relationships[m[1]] = { identifying: true };
        }

        // Attribute (entity OR relationship)
        else if (m = line.match(
            /^attribute\s+(\w+)\s+(\w+)(?:\s+(PK|MULTI|DERIVED))?$/
        )) {
            attributes.push({
                owner: m[1],
                name: m[2],
                type: m[3] || null
            });
        }

        // Composite Attribute
        else if (m = line.match(
            /^composite\s+(\w+)\s+(\w+)\s*{(.+)}$/
        )) {
            composites.push({
                owner: m[1],
                name: m[2],
                parts: m[3].split(",").map(p => p.trim())
            });
        }

        // Relationship edge with cardinality & participation
        else if (m = line.match(
            /^(\w+)\s+(\w+)\s+\((1|N|M)\)\s+(TOTAL|PARTIAL)\s+--\s+\((1|N|M)\)\s+(TOTAL|PARTIAL)\s+(\w+)$/
        )) {
            edges.push({
                rel: m[1],
                from: m[2],
                fromCard: m[3],
                fromPart: m[4],
                toCard: m[5],
                toPart: m[6],
                to: m[7]
            });
        }
    }

    // -------------------------
    // DOT helpers
    // -------------------------
    function drawEdge(from, to, label, isTotal) {
        const penwidth = isTotal ? 3 : 1;
        return `  ${from} -> ${to} [label="${label}", penwidth=${penwidth}];\n`;
    }

    // -------------------------
    // DOT generation
    // -------------------------
    let dot = `digraph ER {
graph [
    rankdir=LR,
    splines=true,
    nodesep=1.1
];
node [fontname="Helvetica"];
edge [arrowhead=none];
`;

    // -------------------------
    // Entities
    // -------------------------
    for (const [name, e] of Object.entries(entities)) {
        dot += `  ${name} [shape=rectangle${e.weak ? ", peripheries=2" : ""}];\n`;
    }

    // -------------------------
    // Relationships
    // -------------------------
    for (const [name, r] of Object.entries(relationships)) {
        dot += `  ${name} [shape=diamond${r.identifying ? ", peripheries=2" : ""}];\n`;
    }

    // -------------------------
    // Attributes (entities & relationships)
    // -------------------------
    for (const a of attributes) {
        let extra = [];
        if (a.type === "MULTI") extra.push("peripheries=2");
        if (a.type === "DERIVED") extra.push("style=dashed");

        const label =
            a.type === "PK"
                ? `< <u>${a.name}</u> >`
                : `"${a.name}"`;

        const nodeName = `${a.owner}_${a.name}`;

        dot += `  ${nodeName} [shape=ellipse, label=${label}${extra.length ? ", " + extra.join(",") : ""}];\n`;
        dot += `  ${a.owner} -> ${nodeName};\n`;
    }

    // -------------------------
    // Composite Attributes
    // -------------------------
    for (const c of composites) {
        const root = `${c.owner}_${c.name}`;
        dot += `  ${root} [shape=ellipse, label="${c.name}"];\n`;
        dot += `  ${c.owner} -> ${root};\n`;

        for (const p of c.parts) {
            const partNode = `${root}_${p}`;
            dot += `  ${partNode} [shape=ellipse, label="${p}"];\n`;
            dot += `  ${root} -> ${partNode};\n`;
        }
    }

    // -------------------------
    // Relationship connections
    // -------------------------
    for (const e of edges) {
        dot += drawEdge(
            e.rel,
            e.from,
            e.fromCard,
            e.fromPart === "TOTAL"
        );

        dot += drawEdge(
            e.rel,
            e.to,
            e.toCard,
            e.toPart === "TOTAL"
        );
    }

    dot += "}";
    return dot;
}