import { createHash } from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { globbySync } from "globby"
import type { VFile } from "vfile"
import type { QuartzTransformerPlugin } from "../../types"
import type { BuildCtx } from "../../../util/ctx"
import { readFrontmatterData } from "../../builtins/frontmatter"
import { FilePath, FullSlug, slugifyFilePath } from "../../../util/path"
import { collectPermalinks, normalizePermalink } from "../../../util/permalinks"

const STOP_WORDS = new Set(
  "a an and as at by for from in into of on or the to with using".split(" "),
)

function words(value: string): string[] {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[’']s\b/g, "")
      .replace(/[’']/g, "")
      .match(/[a-z0-9]+/g) ?? []
  )
}

function hash(value: string): string {
  return createHash("sha256").update(value).digest("hex").slice(0, 10)
}

/** A bounded, deterministic description plus a paper identifier (not AI-generated). */
export function reviewSlug(title: string, doi: unknown, relativePath: string): string {
  const tokens = words(title)
    .filter((word) => !STOP_WORDS.has(word))
    .slice(0, 6)
  while (tokens.join("-").length > 48) {
    if (tokens.length === 1) {
      tokens[0] = tokens[0].slice(0, 48)
      break
    }
    tokens.pop()
  }
  const description = tokens.join("-") || "article"
  const normalizedDoi =
    typeof doi === "string"
      ? doi
          .trim()
          .replace(/^(?:https?:\/\/(?:dx\.)?doi\.org\/|doi:\s*)/i, "")
          .toLowerCase()
      : ""
  const tail = words(normalizedDoi.split("/").at(-1) ?? "").join("-")
  const identifier = normalizedDoi
    ? tail && tail.length <= 16
      ? tail
      : hash(normalizedDoi)
    : hash(relativePath)
  return `reviews/${description}-${identifier}`
}

export interface SourcePage {
  path: FilePath
  /** Undefined for assets or invalid frontmatter. Empty properties are valid. */
  data?: Record<string, unknown>
}

/** Pure build-time address planning. No source properties or registry are written. */
export function planReviewSlugs(pages: SourcePage[]): Record<string, FullSlug> {
  const sorted = [...pages].sort((a, b) => a.path.localeCompare(b.path, "en"))
  const data = new Map(sorted.map((page) => [page.path, page.data]))
  const addresses = collectPermalinks({
    files: sorted.filter((page) => page.path.endsWith(".md")).map((page) => page.path),
    permalinkOf: (fp) => data.get(fp as FilePath)?.permalink,
  })
  const occupied = new Set<string>(sorted.map((page) => slugifyFilePath(page.path)))
  for (const page of sorted) {
    const explicit = normalizePermalink(page.data?.permalink)
    if (explicit) occupied.add(explicit)
    const aliases = page.data?.aliases ?? page.data?.alias
    const list = Array.isArray(aliases)
      ? aliases
      : typeof aliases === "string"
        ? aliases.split(",")
        : []
    for (const alias of list) {
      if (typeof alias !== "string") continue
      const slug = normalizePermalink(alias.replace(/\.md$/, ""))
      if (slug) occupied.add(slug)
    }
  }
  for (const { path: fp, data } of sorted) {
    if (!data || !fp.startsWith("reviews/") || !fp.endsWith(".md")) continue
    if (
      path.posix.basename(fp) === "index.md" ||
      path.posix.basename(fp, ".md") === path.posix.basename(path.posix.dirname(fp)) ||
      Object.hasOwn(data, "permalink")
    )
      continue
    // Use the filename rather than the editable display title to keep title-only edits stable.
    const base = reviewSlug(path.posix.basename(fp, ".md"), data.doi, fp)
    let slug = base
    if (occupied.has(slug)) slug = `${base}-${hash(fp)}`
    const disambiguated = slug
    let counter = 2
    while (occupied.has(slug)) slug = `${disambiguated}-${counter++}`
    occupied.add(slug)
    addresses[fp] = slug as FullSlug
  }
  return addresses
}

export const ReviewPermalinks: QuartzTransformerPlugin = () => {
  let snapshot:
    | { id: string; directory: string; addresses: Record<string, FullSlug>; files: FilePath[] }
    | undefined

  function initialize(ctx: BuildCtx) {
    const config = ctx.cfg.configuration.frontmatter
    if (config === false || (typeof config === "object" && config.enabled === false)) return
    if (!snapshot || snapshot.id !== ctx.buildId || snapshot.directory !== ctx.argv.directory) {
      // Scan the current files, including notes added during watch mode. The core's allFiles
      // list is updated after parsing during a rebuild, so it cannot discover those notes here.
      const files = globbySync("**/*.*", {
        cwd: ctx.argv.directory,
        ignore: ctx.cfg.configuration.ignorePatterns,
        gitignore: true,
      }).map((fp) => fp.split(path.sep).join("/") as FilePath)
      const pages = files.map((fp): SourcePage => {
        if (!fp.endsWith(".md")) return { path: fp }
        try {
          return {
            path: fp,
            data: readFrontmatterData(
              fs.readFileSync(path.join(ctx.argv.directory, fp)),
              typeof config === "object" ? config : {},
            ),
          }
        } catch {
          return { path: fp } // leave invalid/unreadable files to Quartz's normal diagnostics
        }
      })
      snapshot = {
        id: ctx.buildId,
        directory: ctx.argv.directory,
        files,
        addresses: planReviewSlugs(pages),
      }
    }
    // Ordinary processor factories run before any file is parsed. Each worker initializes
    // its own context through these same public plugin hooks; no core lifecycle hook is needed.
    ctx.permalinks = snapshot.addresses
    const known = new Set(ctx.allSlugs)
    for (const slug of [
      ...snapshot.files.map((fp) => slugifyFilePath(fp)),
      ...Object.values(snapshot.addresses),
    ]) {
      if (!known.has(slug)) {
        ctx.allSlugs.push(slug)
        known.add(slug)
      }
    }
  }

  return {
    name: "ReviewPermalinks",
    markdownPlugins(ctx) {
      initialize(ctx)
      return [
        () => (_tree: unknown, file: VFile) => {
          const fp = file.data.relativePath
          if (!fp?.startsWith("reviews/")) return
          const target = ctx.permalinks?.[fp]
          if (!target) return
          file.data.slug = target
          // Restore the original-path redirect after legacy note-properties processes aliases.
          file.data.aliases = [
            ...new Set([...(file.data.aliases ?? []), slugifyFilePath(fp)]),
          ].filter((alias) => alias !== target)
        },
      ]
    },
    htmlPlugins(ctx) {
      // HTML parsing runs in a separate worker context; initialize its link-resolution map too.
      initialize(ctx)
      return []
    },
  }
}

export default ReviewPermalinks
