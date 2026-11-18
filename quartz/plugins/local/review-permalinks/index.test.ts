import test from "node:test"
import assert from "node:assert/strict"
import fs from "node:fs/promises"
import os from "node:os"
import path from "node:path"
import { visit } from "unist-util-visit"
import type { BuildCtx } from "../../../util/ctx"
import type { FilePath } from "../../../util/path"
import { Frontmatter } from "../../builtins/frontmatter"
import { Links } from "../../builtins/links"
import {
  createFileParser,
  createMdProcessor,
  createHtmlProcessor,
  createMarkdownParser,
} from "../../../processors/parse"
import ReviewPermalinks, { planReviewSlugs, reviewSlug, SourcePage } from "./index"

const page = (fp: string, data: Record<string, unknown> = {}): SourcePage => ({
  path: fp as FilePath,
  data,
})

test("shortens scientific titles and bounds punctuation and DOI identifiers", () => {
  assert.equal(
    reviewSlug(
      "The ALMA View of the Edge-on Gomez’s Hamburger System: A Highly Dynamic Disk",
      "https://doi.org/10.3847/1538-4357/aea566",
      "reviews/long.md",
    ),
    "reviews/alma-view-edge-gomez-hamburger-system-aea566",
  )
  assert.match(
    reviewSlug("padé: C/O & turbulence", "10.1/" + "a".repeat(100), "reviews/x.md"),
    /^reviews\/pade-c-o-turbulence-[a-f0-9]{10}$/,
  )
  assert.ok(reviewSlug("x".repeat(1000), undefined, "reviews/x.md").length <= 67)
})

test("automatically plans every review, respects overrides, and resolves reserved addresses", () => {
  const pages = [
    page("reviews/A Disk.md", { doi: "10.1/abc" }),
    page("reviews/The Disk.md", { doi: "10.2/abc" }),
    page("journal/Reserved.md", { aliases: ["reviews/disk-abc"] }),
    page("reviews/Manual.md", { permalink: "reviews/hand-picked" }),
    page("reviews/Opt Out.md", { permalink: "" }),
    page("reviews/Without DOI.md"),
    page("reviews/index.md"),
    page("reviews/reviews.md"),
    page("reviews/sub/sub.md"),
    page("journal/Other.md"),
    { path: "reviews/Invalid.md" as FilePath },
  ]
  const addresses = planReviewSlugs(pages)
  assert.ok(addresses["reviews/A Disk.md"])
  assert.notEqual(addresses["reviews/A Disk.md"], "reviews/disk-abc")
  assert.notEqual(addresses["reviews/A Disk.md"], addresses["reviews/The Disk.md"])
  assert.equal(addresses["reviews/Manual.md"], "reviews/hand-picked")
  assert.ok(addresses["reviews/Without DOI.md"])
  for (const fp of [
    "reviews/Opt Out.md",
    "reviews/index.md",
    "reviews/reviews.md",
    "reviews/sub/sub.md",
    "journal/Other.md",
    "reviews/Invalid.md",
  ]) {
    assert.equal(addresses[fp], undefined)
  }
  assert.deepEqual(planReviewSlugs(pages.toReversed()), addresses)
  const copy = structuredClone(pages)
  copy[0].data!.title = "A new display title"
  assert.deepEqual(planReviewSlugs(copy), addresses)
  assert.ok(!Object.hasOwn(pages[0].data!, "permalink"))
})

test("reserves file paths and explicit permalinks before generating review addresses", () => {
  for (const reserved of [
    page("reviews/disk-abc.md", { permalink: "" }),
    page("journal/Manual.md", { permalink: "reviews/disk-abc" }),
  ]) {
    assert.notEqual(
      planReviewSlugs([page("reviews/A Disk.md", { doi: "10.1/abc" }), reserved])[
        "reviews/A Disk.md"
      ],
      "reviews/disk-abc",
    )
  }
})

test("existing processor hooks generate URLs and internal links in independent workers without writing notes", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "review-urls-readonly-"))
  t.after(() => fs.rm(directory, { recursive: true, force: true }))
  const sources: Record<string, string> = {
    "index.md": "---\ntitle: Home\n---\n[Review](reviews/Long%20Title.md)\n",
    "reviews/Long Title.md":
      "---\ntitle: Full Display Title\ndoi: 10.1/abc\naliases: [reviews/previous]\n---\n# Body\n",
    "reviews/index.md": "Reviews\n",
    "journal/Other.md": "Ordinary note\n",
  }
  for (const [fp, source] of Object.entries(sources)) {
    await fs.mkdir(path.dirname(path.join(directory, fp)), { recursive: true })
    await fs.writeFile(path.join(directory, fp), source)
  }
  const plugin = ReviewPermalinks()
  const cfg = {
    configuration: { ignorePatterns: [] },
    plugins: {
      transformers: [
        Frontmatter(),
        {
          name: "LegacyNoteProperties",
          markdownPlugins: () => [
            () => (_tree: unknown, file: import("vfile").VFile) => {
              // The enabled old note-properties transform replaces the built-in alias list.
              if (file.data.relativePath === "reviews/Long Title.md")
                file.data.aliases = ["reviews/previous"] as typeof file.data.aliases
            },
          ],
        },
        plugin,
        Links({ markdownLinkResolution: "shortest" }),
      ],
    },
  }
  const context = (buildId = "1") =>
    ({
      buildId,
      argv: { directory },
      cfg,
      allFiles: Object.keys(sources) as FilePath[],
      allSlugs: [],
    }) as unknown as BuildCtx
  const before = await fs.stat(path.join(directory, "reviews/Long Title.md"))
  const markdownCtx = context()
  const fps = Object.keys(sources).map((fp) => path.join(directory, fp) as FilePath)
  const markdown = await createFileParser(markdownCtx, fps)(createMdProcessor(markdownCtx))
  const htmlCtx = context() // deliberately no address map transferred from the Markdown worker
  const result = await createMarkdownParser(htmlCtx, markdown)(createHtmlProcessor(htmlCtx))
  const review = result.find(([, file]) => file.data.relativePath === "reviews/Long Title.md")!
  assert.equal(review[1].data.slug, "reviews/long-title-abc")
  assert.deepEqual(review[1].data.aliases, ["reviews/previous", "reviews/long-title"])
  assert.equal(review[1].data.frontmatter!.title, "Full Display Title")
  assert.equal(review[1].data.frontmatter!.permalink, undefined)
  const home = result.find(([, file]) => file.data.relativePath === "index.md")!
  let href: unknown
  visit(home[0], "element", (node) => {
    if (node.tagName === "a") href = node.properties.href
  })
  assert.equal(href, "./reviews/long-title-abc")
  assert.equal(htmlCtx.permalinks!["reviews/Long Title.md"], "reviews/long-title-abc")
  assert.equal(markdownCtx.permalinks!["reviews/Long Title.md"], "reviews/long-title-abc")
  for (const [fp, source] of Object.entries(sources))
    assert.equal(await fs.readFile(path.join(directory, fp), "utf8"), source)
  assert.equal(
    (await fs.stat(path.join(directory, "reviews/Long Title.md"))).mtimeMs,
    before.mtimeMs,
  )
  assert.equal(home[1].data.slug, "index")

  // A subsequent watch rebuild discovers a new review even if core allFiles is still stale.
  await fs.writeFile(path.join(directory, "reviews/New Review.md"), "New review\n")
  const next = context("2")
  plugin.markdownPlugins!(next)
  assert.ok(next.permalinks!["reviews/New Review.md"])
  assert.equal(
    await fs.readFile(path.join(directory, "reviews/New Review.md"), "utf8"),
    "New review\n",
  )
})
