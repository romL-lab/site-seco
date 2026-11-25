import markdownIt from "markdown-it";

const md = markdownIt({ html: true, linkify: true, typographer: false });

const MOIS = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/assets");
  eleventyConfig.addPassthroughCopy("src/fichiers");
  eleventyConfig.addPassthroughCopy("src/admin");

  // Texte Markdown saisi dans l'administration -> HTML
  eleventyConfig.addFilter("md", (s) => (s ? md.render(String(s)) : ""));
  eleventyConfig.addFilter("mdInline", (s) => (s ? md.renderInline(String(s)) : ""));

  // Dates en français, sans décalage de fuseau
  const iso = (d) => (d instanceof Date ? d.toISOString().slice(0, 10) : String(d).slice(0, 10));
  eleventyConfig.addFilter("dateFr", (d) => {
    const [y, m, j] = iso(d).split("-").map(Number);
    return `${j === 1 ? "1er" : j} ${MOIS[m - 1]} ${y}`;
  });
  eleventyConfig.addFilter("dateCourte", (d) => {
    const [y, m, j] = iso(d).split("-");
    return `${j}/${m}/${y}`;
  });
  eleventyConfig.addFilter("iso", iso);
  eleventyConfig.addFilter("head", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("themeNom", (id, themes) => (themes.find((t) => t.id === id) || {}).nom || id);
  eleventyConfig.addFilter("isFuture", (d) => iso(d) >= new Date().toISOString().slice(0, 10));

  // Lien externe ou fichier du site
  eleventyConfig.addFilter("lienRessource", function (r) {
    if (r.fichier) return eleventyConfig.getFilter("url")(r.fichier);
    if (r.lien && r.lien.startsWith("/")) return eleventyConfig.getFilter("url")(r.lien);
    return r.lien || "";
  });

  // Les liens saisis dans l'administration commencent par « / » : on ajoute le préfixe GitHub Pages.
  eleventyConfig.addTransform("prefixe", function (content) {
    if (!(this.page.outputPath || "").endsWith(".html")) return content;
    const prefix = (process.env.PATH_PREFIX || "/site-seco/").replace(/\/$/, "");
    if (!prefix) return content;
    return content.replace(/(href|src)="\/(fichiers|ressources|agenda|actualites|contact|comprendre|cyber|reglementation|se-tester|incident)([\/"?#])/g, `$1="${prefix}/$2$3`);
  });

  const byDateDesc = (a, b) => iso(b.data.date).localeCompare(iso(a.data.date));
  eleventyConfig.addCollection("actus", (api) => api.getFilteredByGlob("src/actus/*.md").sort(byDateDesc));
  eleventyConfig.addCollection("agenda", (api) => api.getFilteredByGlob("src/agenda/*.md").sort(byDateDesc));
  // Flash DGSI : du plus récent au plus ancien, regroupés par année
  eleventyConfig.addCollection("flashParAnnee", (api) => {
    const items = api.getFilteredByGlob("src/flash/*.md").sort((a, b) => iso(b.data.date).localeCompare(iso(a.data.date)) || (b.data.numero || 0) - (a.data.numero || 0));
    const annees = [];
    for (const it of items) {
      const y = iso(it.data.date).slice(0, 4);
      let g = annees.find((x) => x.annee === y);
      if (!g) annees.push((g = { annee: y, items: [] }));
      g.items.push(it);
    }
    return annees;
  });
  eleventyConfig.addFilter("moisAnnee", (d) => {
    const [y, m] = iso(d).split("-").map(Number);
    return `${MOIS[m - 1]} ${y}`;
  });
  eleventyConfig.addCollection("ressources", (api) =>
    api.getFilteredByGlob("src/ressources/*.md").sort((a, b) => (a.data.ordre ?? 99) - (b.data.ordre ?? 99) || a.data.title.localeCompare(b.data.title, "fr"))
  );

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    // Adresse GitHub Pages : https://roml-lab.github.io/site-seco/
    pathPrefix: process.env.PATH_PREFIX || "/site-seco/",
  };
}
