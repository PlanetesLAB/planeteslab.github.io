// index.ts
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { globbySync } from "globby";

// ../../builtins/frontmatter.ts
import matter from "gray-matter";
import remarkFrontmatter from "remark-frontmatter";
import yaml from "js-yaml";
import toml from "toml";

// ../../../util/pluginErrors.ts
var ContentError = class extends Error {
  quartzContent = true;
  constructor(message, options) {
    super(message, options);
    this.name = "ContentError";
  }
};

// ../../../util/path.ts
import {
  isFilePath,
  isFullSlug,
  isSimpleSlug,
  isRelativeURL,
  isAbsoluteURL,
  getFullSlug,
  slugifyFilePath,
  simplifySlug,
  joinSegments,
  endsWith,
  trimSuffix,
  stripSlashes,
  getFileExtension,
  isFolderPath,
  getAllSegmentPrefixes,
  pathToRoot,
  resolveRelative,
  splitAnchor,
  slugTag,
  transformInternalLink,
  linkPathDecodes,
  transformLink,
  normalizeHastElement
} from "@quartz-community/utils";

// ../../builtins/frontmatter.ts
var frontmatterDefaults = {
  delimiters: "---",
  language: "yaml"
};
var refuseJavaScript = () => {
  throw new ContentError(
    "JavaScript frontmatter (---js / ---javascript) is not supported: Quartz does not execute code from content. Use YAML or TOML frontmatter."
  );
};
function readFrontmatterData(source, options = {}) {
  const language = options.language ?? frontmatterDefaults.language;
  if (language !== "yaml" && language !== "toml") {
    throw new Error(
      `Frontmatter: unsupported \`language\` option ${JSON.stringify(language)} (use "yaml" or "toml")`
    );
  }
  try {
    const { data } = matter(Buffer.isBuffer(source) ? source : Buffer.from(source), {
      delimiters: options.delimiters ?? frontmatterDefaults.delimiters,
      language,
      engines: {
        yaml: (s) => yaml.load(s, { schema: yaml.JSON_SCHEMA }),
        toml: (s) => toml.parse(s),
        javascript: refuseJavaScript,
        js: refuseJavaScript
      }
    });
    if (typeof data !== "object" || data === null || Array.isArray(data)) {
      const kind = Array.isArray(data) ? "list" : typeof data;
      throw new ContentError(
        `Invalid frontmatter: expected properties (\`key: value\` lines), got a ${kind} (${JSON.stringify(data)})`
      );
    }
    return data;
  } catch (err) {
    if (err instanceof ContentError) throw err;
    throw new ContentError(`Invalid frontmatter: ${err instanceof Error ? err.message : err}`, {
      cause: err
    });
  }
}

// ../../../util/permalinks.ts
function normalizePermalink(raw) {
  if (raw === null || raw === void 0) return void 0;
  const value = String(raw).trim().replace(/\\/g, "/").replace(/^\/+|\/+$/g, "");
  if (value === "" || value === ".") return void 0;
  return slugifyFilePath(`${value}.md`);
}
function collectPermalinks({
  files,
  permalinkOf,
  warn = () => {
  }
}) {
  const pathSlugs = new Map(files.map((f) => [slugifyFilePath(f), f]));
  const taken = /* @__PURE__ */ new Map();
  const permalinks = {};
  for (const file of files) {
    const slug = normalizePermalink(permalinkOf(file));
    if (!slug) continue;
    const own = slugifyFilePath(file);
    if (slug === own) continue;
    const owner = pathSlugs.get(slug) ?? taken.get(slug);
    if (owner !== void 0) {
      warn(
        `${file}: permalink "${slug}" is already the address of ${owner}; the note keeps its own path.`
      );
      continue;
    }
    taken.set(slug, file);
    permalinks[file] = slug;
  }
  return permalinks;
}

// index.ts
var STOP_WORDS = new Set(
  "a an and as at by for from in into of on or the to with using".split(" ")
);
function words(value) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[’']s\b/g, "").replace(/[’']/g, "").match(/[a-z0-9]+/g) ?? [];
}
function hash(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 10);
}
function reviewSlug(title, doi, relativePath) {
  const tokens = words(title).filter((word) => !STOP_WORDS.has(word)).slice(0, 6);
  while (tokens.join("-").length > 48) {
    if (tokens.length === 1) {
      tokens[0] = tokens[0].slice(0, 48);
      break;
    }
    tokens.pop();
  }
  const description = tokens.join("-") || "article";
  const normalizedDoi = typeof doi === "string" ? doi.trim().replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:\s*)/i, "").toLowerCase() : "";
  const tail = words(normalizedDoi.split("/").at(-1) ?? "").join("-");
  const identifier = normalizedDoi ? tail && tail.length <= 16 ? tail : hash(normalizedDoi) : hash(relativePath);
  return `reviews/${description}-${identifier}`;
}
function planReviewSlugs(pages) {
  const sorted = [...pages].sort((a, b) => a.path.localeCompare(b.path, "en"));
  const data = new Map(sorted.map((page) => [page.path, page.data]));
  const addresses = collectPermalinks({
    files: sorted.filter((page) => page.path.endsWith(".md")).map((page) => page.path),
    permalinkOf: (fp) => data.get(fp)?.permalink
  });
  const occupied = new Set(sorted.map((page) => slugifyFilePath(page.path)));
  for (const page of sorted) {
    const explicit = normalizePermalink(page.data?.permalink);
    if (explicit) occupied.add(explicit);
    const aliases = page.data?.aliases ?? page.data?.alias;
    const list = Array.isArray(aliases) ? aliases : typeof aliases === "string" ? aliases.split(",") : [];
    for (const alias of list) {
      if (typeof alias !== "string") continue;
      const slug = normalizePermalink(alias.replace(/\.md$/, ""));
      if (slug) occupied.add(slug);
    }
  }
  for (const { path: fp, data: data2 } of sorted) {
    if (!data2 || !fp.startsWith("reviews/") || !fp.endsWith(".md")) continue;
    if (path.posix.basename(fp) === "index.md" || path.posix.basename(fp, ".md") === path.posix.basename(path.posix.dirname(fp)) || Object.hasOwn(data2, "permalink"))
      continue;
    const base = reviewSlug(path.posix.basename(fp, ".md"), data2.doi, fp);
    let slug = base;
    if (occupied.has(slug)) slug = `${base}-${hash(fp)}`;
    const disambiguated = slug;
    let counter = 2;
    while (occupied.has(slug)) slug = `${disambiguated}-${counter++}`;
    occupied.add(slug);
    addresses[fp] = slug;
  }
  return addresses;
}
var ReviewPermalinks = () => {
  let snapshot;
  function initialize(ctx) {
    const config = ctx.cfg.configuration.frontmatter;
    if (config === false || typeof config === "object" && config.enabled === false) return;
    if (!snapshot || snapshot.id !== ctx.buildId || snapshot.directory !== ctx.argv.directory) {
      const files = globbySync("**/*.*", {
        cwd: ctx.argv.directory,
        ignore: ctx.cfg.configuration.ignorePatterns,
        gitignore: true
      }).map((fp) => fp.split(path.sep).join("/"));
      const pages = files.map((fp) => {
        if (!fp.endsWith(".md")) return { path: fp };
        try {
          return {
            path: fp,
            data: readFrontmatterData(
              fs.readFileSync(path.join(ctx.argv.directory, fp)),
              typeof config === "object" ? config : {}
            )
          };
        } catch {
          return { path: fp };
        }
      });
      snapshot = {
        id: ctx.buildId,
        directory: ctx.argv.directory,
        files,
        addresses: planReviewSlugs(pages)
      };
    }
    ctx.permalinks = snapshot.addresses;
    const known = new Set(ctx.allSlugs);
    for (const slug of [
      ...snapshot.files.map((fp) => slugifyFilePath(fp)),
      ...Object.values(snapshot.addresses)
    ]) {
      if (!known.has(slug)) {
        ctx.allSlugs.push(slug);
        known.add(slug);
      }
    }
  }
  return {
    name: "ReviewPermalinks",
    markdownPlugins(ctx) {
      initialize(ctx);
      return [
        () => (_tree, file) => {
          const fp = file.data.relativePath;
          if (!fp?.startsWith("reviews/")) return;
          const target = ctx.permalinks?.[fp];
          if (!target) return;
          file.data.slug = target;
          file.data.aliases = [
            .../* @__PURE__ */ new Set([...file.data.aliases ?? [], slugifyFilePath(fp)])
          ].filter((alias) => alias !== target);
        }
      ];
    },
    htmlPlugins(ctx) {
      initialize(ctx);
      return [];
    }
  };
};
var index_default = ReviewPermalinks;
export {
  ReviewPermalinks,
  index_default as default,
  planReviewSlugs,
  reviewSlug
};
