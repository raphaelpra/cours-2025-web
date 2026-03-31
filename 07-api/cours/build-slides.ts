const baseDir = new URL("./", import.meta.url);
const templatePath = new URL("template.html", baseDir);
const template = await Bun.file(templatePath).text();

const slideshows: Array<{ md: string; title: string }> = [
    { md: "slides1.md", title: "07 — API modernes avec Hono (1/1)" },
    { md: "slides-annexe.md", title: "07 — Annexe : sécurité, cookies et sessions" },
];

for (const { md, title } of slideshows) {
    const outputPath = new URL(md.replace(".md", ".html"), baseDir);
    const html = template
        .replaceAll("__TITLE__", title)
        .replaceAll("__MD_FILE__", md);

    await Bun.write(outputPath, html);
    console.log(`Generated ${outputPath.pathname}`);
}
