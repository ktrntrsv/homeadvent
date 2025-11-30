const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const srcDir = path.join(rootDir, "src");
const distDir = path.join(rootDir, "dist");
const pagesDir = path.join(srcDir, "pages");
const assetsSrcDir = path.join(srcDir, "assets");
const stylesSrcDir = path.join(srcDir, "styles");
const layoutCache = new Map();

const normalizeBase = (value = ".") => {
  if (!value || value === ".") return ".";
  let base = value.trim();
  if (!base.startsWith("/")) base = `/${base}`;
  return base.replace(/\/$/, "");
};

const basePath = normalizeBase(process.env.BASE_PATH);

const ensureCleanDir = (dir) => {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
};

const copyDir = (from, to) => {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(to, { recursive: true });
  fs.cpSync(from, to, { recursive: true });
};

const parseFrontMatter = (raw) => {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { data: {}, body: raw.trim() };
  }

  const [, block] = match;
  const data = {};

  block
    .split("\n")
    .filter(Boolean)
    .forEach((line) => {
      const [key, ...rest] = line.split(":");
      if (!key) return;
      const normalizedKey = key.trim();
      const value = rest.join(":").trim();
      if (normalizedKey === "aliases") {
        data.aliases = value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        return;
      }
      data[normalizedKey] = value;
    });

  const body = raw.slice(match[0].length).trim();
  return { data, body };
};

const getLayout = (name = "base") => {
  if (layoutCache.has(name)) return layoutCache.get(name);
  const filePath = path.join(srcDir, "layouts", `${name}.html`);
  const layout = fs.readFileSync(filePath, "utf8");
  layoutCache.set(name, layout);
  return layout;
};

const applyBase = (html) => html.replace(/{{base}}/g, basePath);

const renderPage = (layout, data, body) =>
  layout
    .replace(/{{base}}/g, basePath)
    .replace("{{title}}", data.title || data.slug || "Untitled page")
    .replace("{{content}}", body);

const buildPages = () => {
  const files = fs.readdirSync(pagesDir).filter((file) => file.endsWith(".html"));

  files.forEach((file) => {
    const raw = fs.readFileSync(path.join(pagesDir, file), "utf8");
    const { data, body } = parseFrontMatter(raw);
    const baseName = path.parse(file).name;
    const slug = data.slug || baseName;
    const layoutName = data.layout || "base";
    const aliases = Array.isArray(data.aliases) ? data.aliases : [];
    const outputPath = path.join(distDir, `${slug}.html`);
    const html =
      layoutName === "raw"
        ? applyBase(body)
        : renderPage(getLayout(layoutName), { ...data, slug }, body);
    fs.writeFileSync(outputPath, html);
    aliases.forEach((alias) => {
      fs.writeFileSync(path.join(distDir, `${alias}.html`), html);
    });
  });
};

const build = () => {
  ensureCleanDir(distDir);

  copyDir(assetsSrcDir, path.join(distDir, "assets"));
  copyDir(stylesSrcDir, path.join(distDir, "assets", "styles"));
  buildPages();
};

build();
