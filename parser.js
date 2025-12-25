function parseDSL(dsl) {
    const lines = dsl.split("\n").map(l => l.trim()).filter(l => l && !l.startsWith("#"));

    const entities = {};
    const relationships = {};
    const attributes = [];
    const composites = [];
    const edges = [];

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

        // Attribute
        else if (m = line.match(/^attribute\s+(\w+)\s+(\w+)(?:\s+(PK|MULTI|DERIVED))?$/)) {
            attributes.push({
                owner: m[1],
                name: m[2],
                type: m[3] || null
            });
        }

        // Composite Attribute
        else if (m = line.match(/^composite\s+(\w+)\s+(\w+)\s*{(.+)}$/)) {
            composites.push({
                owner: m[1],
                name: m[2],
                parts: m[3].split(",").map(p => p.trim())
            });
        }

        // Relationship
        else if (m = line.match(/^relationship\s+(\w+)$/)) {
            relationships[m[1]] = { identifying: false };
        }

        // Identifying Relationship
        else if (m = line.match(/^identifying relationship\s+(\w+)$/)) {
            relationships[m[1]] = { identifying: true };
        }

        // Relationship edge with cardinality + participation
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

    // DOT
    let dot = `digraph ER {
graph [rankdir=LR, splines=true];
node [fontname="Helvetica"];
edge [arrowhead=none];
`;

    // Entities
    for (const [name, e] of Object.entries(entities)) {
        dot += `  ${name} [shape=rectangle${e.weak ? ", peripheries=2" : ""}];\n`;
    }

    // Relationships
    for (const [name, r] of Object.entries(relationships)) {
        dot += `  ${name} [shape=diamond${r.identifying ? ", penwidth=3" : ""}];\n`;
    }

    // Attributes
    for (const a of attributes) {
        let attrs = [];
        if (a.type === "MULTI") attrs.push("peripheries=2");
        if (a.type === "DERIVED") attrs.push("style=dashed");

        let label = a.type === "PK"
            ? `< <u>${a.name}</u> >`
            : a.name;

        dot += `  ${a.owner}_${a.name} [shape=ellipse, label=${label}${attrs.length ? ", " + attrs.join(",") : ""}];\n`;
        dot += `  ${a.owner} -> ${a.owner}_${a.name};\n`;
    }

    // Composite attributes
    for (const c of composites) {
        dot += `  ${c.owner}_${c.name} [shape=ellipse, label="${c.name}"];\n`;
        dot += `  ${c.owner} -> ${c.owner}_${c.name};\n`;
        for (const p of c.parts) {
            dot += `  ${c.owner}_${c.name}_${p} [shape=ellipse, label="${p}"];\n`;
            dot += `  ${c.owner}_${c.name} -> ${c.owner}_${c.name}_${p};\n`;
        }
    }

    // Relationship edges
    for (const e of edges) {
        dot += `  ${e.rel} -> ${e.from} [label="${e.fromCard}", penwidth=${e.fromPart === "TOTAL" ? 3 : 1}];\n`;
        dot += `  ${e.rel} -> ${e.to} [label="${e.toCard}", penwidth=${e.toPart === "TOTAL" ? 3 : 1}];\n`;
    }

    dot += "}";
    return dot;
}