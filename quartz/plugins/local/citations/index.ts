import fs from "fs"
import path from "path"
import rehypeCitation, { Cite } from "rehype-citation"
import type { PluggableList } from "unified"
import { visit } from "unist-util-visit"
import type { QuartzTransformerPlugin } from "@quartz-community/types"

type CslName = {
  family?: string
  given?: string
  literal?: string
}

type CslDate = {
  "date-parts"?: Array<Array<number | string>>
  literal?: string
}

type CslEntry = {
  id?: string
  "citation-key"?: string
  author?: CslName[]
  editor?: CslName[]
  issued?: CslDate
  title?: string
  "container-title"?: string
  publisher?: string
  volume?: string | number
  issue?: string | number
  page?: string | number
  DOI?: string
  URL?: string
}

type CitationMetadata = {
  title: string
  authors: string
  year: string
  container: string
  volume: string
  issue: string
  pages: string
  doi: string
  sourceUrl: string
  link: string
  linkLabel: string
}

export interface Options {
  bibliographyFile: string
  suppressBibliography: boolean
  linkCitations: boolean
  csl: string
  fallbackSearch: "ads" | "google"
}

const defaultOptions: Options = {
  bibliographyFile: "./bibliography.bib",
  suppressBibliography: true,
  linkCitations: true,
  csl: "apa",
  fallbackSearch: "ads",
}

/**
 * rehype-citation parses every field in the bibliography, although this plugin
 * only displays citation metadata. Zotero abstracts can contain TeX constructs
 * that citeproc does not support, so give it a derived bibliography with those
 * non-display fields removed. The user's source bibliography is never changed.
 */
function stripAbstractFields(bibtex: string) {
  const abstractField = /^\s*abstract\s*=\s*([{"])/gim
  let output = ""
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = abstractField.exec(bibtex)) !== null) {
    const opener = match[1]
    let index = abstractField.lastIndex
    let depth = opener === "{" ? 1 : 0

    while (index < bibtex.length) {
      const character = bibtex[index]
      if (character === "\\") {
        index += 2
        continue
      }

      if (opener === "{") {
        if (character === "{") depth += 1
        if (character === "}") {
          depth -= 1
          if (depth === 0) break
        }
      } else if (character === '"') {
        break
      }

      index += 1
    }

    index += 1
    while (index < bibtex.length && /[ \t,]/.test(bibtex[index])) index += 1
    if (bibtex[index] === "\r") index += 1
    if (bibtex[index] === "\n") index += 1
    output += bibtex.slice(cursor, match.index)
    cursor = index
    abstractField.lastIndex = index
  }

  return output + bibtex.slice(cursor)
}

function createCitationBibliography(sourcePath: string) {
  const source = fs.readFileSync(sourcePath, "utf8")
  const cacheDirectory = path.resolve(".quartz-cache")
  const derivedPath = path.join(cacheDirectory, "citations-without-abstracts.bib")

  fs.mkdirSync(cacheDirectory, { recursive: true })
  fs.writeFileSync(derivedPath, stripAbstractFields(source))

  return path.relative(process.cwd(), derivedPath)
}

function initials(given = "") {
  return given
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((part) =>
      part
        .split("-")
        .map((section) => {
          const initial = section.match(/[\p{L}\p{N}]/u)?.[0]
          return initial ? `${initial.toUpperCase()}.` : ""
        })
        .filter(Boolean)
        .join("-"),
    )
    .filter(Boolean)
    .join(" ")
}

function formatName(name: CslName) {
  if (name.literal) return name.literal
  const family = name.family?.trim() ?? ""
  const givenInitials = initials(name.given)
  return [family, givenInitials].filter(Boolean).join(", ")
}

function formatNames(names: CslName[] = []) {
  const formatted = names.map(formatName).filter(Boolean)
  if (formatted.length < 2) return formatted[0] ?? ""
  if (formatted.length === 2) return `${formatted[0]}, & ${formatted[1]}`
  return `${formatted.slice(0, -1).join(", ")}, & ${formatted.at(-1)}`
}

function publicationYear(issued?: CslDate) {
  const year = issued?.["date-parts"]?.[0]?.[0]
  return year ? String(year) : (issued?.literal?.trim() ?? "")
}

function normalizeDoi(value = "") {
  return value
    .trim()
    .replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, "")
    .replace(/^doi:\s*/i, "")
}

function adsSearchUrl(entry: CslEntry) {
  const title = entry.title?.trim() ?? ""
  const firstAuthor = entry.author?.[0]?.family ?? entry.author?.[0]?.literal ?? ""
  const terms = [title && `title:"${title}"`, firstAuthor && `author:"${firstAuthor}"`]
    .filter(Boolean)
    .join(" ")
  return `https://ui.adsabs.harvard.edu/search/q=${encodeURIComponent(terms || entry.id || "")}`
}

function googleSearchUrl(entry: CslEntry) {
  const firstAuthor = entry.author?.[0]?.family ?? entry.author?.[0]?.literal ?? ""
  const terms = [entry.title, firstAuthor].filter(Boolean).join(" ")
  return `https://www.google.com/search?q=${encodeURIComponent(terms || entry.id || "")}`
}

function citationLink(entry: CslEntry, fallbackSearch: Options["fallbackSearch"]) {
  const doi = normalizeDoi(entry.DOI)
  if (doi) return `https://doi.org/${doi}`
  if (entry.URL?.trim()) return entry.URL.trim()
  return fallbackSearch === "google" ? googleSearchUrl(entry) : adsSearchUrl(entry)
}

function parseCitationData(bibliographyPath: string, fallbackSearch: Options["fallbackSearch"]) {
  // Cite is the same BibTeX/BibLaTeX parser used by rehype-citation. Unlike the
  // previous regex parser, it correctly handles bare years, nested braces,
  // LaTeX accents, name particles, and the output produced by Better BibTeX.
  const bibliography = fs.readFileSync(bibliographyPath, "utf8")
  const parsed = new Cite(bibliography, {}).data as CslEntry[]
  const entries: Record<string, CitationMetadata> = {}

  for (const entry of parsed) {
    const key = String(entry["citation-key"] ?? entry.id ?? "").toLowerCase()
    if (!key) continue

    const doi = normalizeDoi(entry.DOI)
    entries[key] = {
      title: entry.title?.trim() ?? "",
      authors: formatNames(entry.author?.length ? entry.author : entry.editor),
      year: publicationYear(entry.issued),
      container: String(entry["container-title"] ?? entry.publisher ?? "").trim(),
      volume: String(entry.volume ?? "").trim(),
      issue: String(entry.issue ?? "").trim(),
      pages: String(entry.page ?? "").trim(),
      doi,
      sourceUrl: entry.URL?.trim() ?? "",
      link: citationLink(entry, fallbackSearch),
      linkLabel: doi
        ? `https://doi.org/${doi}`
        : entry.URL?.trim()
          ? entry.URL.trim()
          : fallbackSearch === "google"
            ? "Search on Google"
            : "Search on NASA ADS",
    }
  }

  return entries
}

function classNames(value: unknown) {
  if (Array.isArray(value)) return value.map(String)
  if (typeof value === "string") return value.split(/\s+/).filter(Boolean)
  return []
}

const popoverScript = String.raw`
(() => {
  let hideTimer
  let activeCitation = null
  let popover = document.querySelector(".citation-popover")

  if (!popover) {
    popover = document.createElement("div")
    popover.className = "citation-popover"
    popover.id = "citation-popover"
    popover.setAttribute("role", "tooltip")
    popover.setAttribute("aria-hidden", "true")
    document.body.appendChild(popover)
  }

  const text = (tag, value, className) => {
    const element = document.createElement(tag)
    if (className) element.className = className
    element.textContent = value
    return element
  }

  const punctuation = (value) => popover.appendChild(document.createTextNode(value))

  const position = (citation) => {
    const gap = 8
    const edge = 12
    const anchor = citation.getBoundingClientRect()
    const card = popover.getBoundingClientRect()
    const left = Math.min(
      Math.max(edge, anchor.left),
      Math.max(edge, window.innerWidth - card.width - edge),
    )
    let top = anchor.bottom + gap
    if (top + card.height > window.innerHeight - edge) {
      top = Math.max(edge, anchor.top - card.height - gap)
    }
    popover.style.transform = "translate(" + Math.round(left) + "px, " + Math.round(top) + "px)"
  }

  const render = (citation) => {
    popover.replaceChildren()
    const data = citation.dataset

    if (data.citeAuthors) {
      popover.appendChild(text("span", data.citeAuthors, "citation-popover-authors"))
    }
    if (data.citeYear) punctuation((data.citeAuthors ? " " : "") + "(" + data.citeYear + ").")
    else if (data.citeAuthors) punctuation(".")
    if (data.citeTitle) {
      const titleEnd = /[.!?]$/.test(data.citeTitle) ? "" : "."
      punctuation((popover.textContent ? " " : "") + data.citeTitle + titleEnd)
    }

    if (data.citeContainer || data.citeVolume) {
      punctuation(" ")
      const publication = [data.citeContainer, data.citeVolume].filter(Boolean).join(", ")
      popover.appendChild(text("em", publication, "citation-popover-publication"))
      if (data.citeIssue) punctuation("(" + data.citeIssue + ")")
      if (data.citePages) punctuation(", " + data.citePages)
      punctuation(".")
    } else if (data.citePages) {
      punctuation(" " + data.citePages + ".")
    }

    const sourceUrl = data.citeDoi
      ? "https://doi.org/" + data.citeDoi
      : data.citeSourceUrl || citation.href
    if (sourceUrl) {
      punctuation(" ")
      const source = text("a", data.citeLinkLabel || sourceUrl, "citation-popover-source")
      source.href = sourceUrl
      source.target = "_blank"
      source.rel = "noopener noreferrer"
      popover.appendChild(source)
    }
  }

  const show = (citation) => {
    window.clearTimeout(hideTimer)
    activeCitation = citation
    render(citation)
    popover.classList.add("is-visible")
    popover.setAttribute("aria-hidden", "false")
    citation.setAttribute("aria-describedby", popover.id)
    position(citation)
  }

  const hide = () => {
    if (activeCitation) activeCitation.removeAttribute("aria-describedby")
    activeCitation = null
    popover.classList.remove("is-visible")
    popover.setAttribute("aria-hidden", "true")
  }

  const scheduleHide = () => {
    window.clearTimeout(hideTimer)
    hideTimer = window.setTimeout(hide, 120)
  }

  const setup = () => {
    document.querySelectorAll("a.citation-link:not([data-citation-ready])").forEach((citation) => {
      citation.dataset.citationReady = "true"
      citation.addEventListener("mouseenter", () => show(citation))
      citation.addEventListener("mouseleave", scheduleHide)
      citation.addEventListener("focus", () => show(citation))
      citation.addEventListener("blur", scheduleHide)
    })
  }

  popover.addEventListener("mouseenter", () => window.clearTimeout(hideTimer))
  popover.addEventListener("mouseleave", scheduleHide)
  window.addEventListener("resize", hide)
  window.addEventListener("scroll", () => {
    const citation = activeCitation
    if (citation) window.requestAnimationFrame(() => position(citation))
  }, true)
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") hide()
  })
  document.addEventListener("nav", setup)
  document.addEventListener("render", setup)
  setup()
})()
`

export const Citations: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  const citationBibliography = createCitationBibliography(path.resolve(opts.bibliographyFile))
  const citationData = parseCitationData(path.resolve(citationBibliography), opts.fallbackSearch)

  return {
    name: "Citations",
    htmlPlugins(ctx) {
      const plugins: PluggableList = []

      let lang = "en-US"
      if (ctx.cfg.configuration.locale !== "en-US") {
        lang = `https://raw.githubusercontent.com/citation-style-language/locales/refs/heads/master/locales-${ctx.cfg.configuration.locale}.xml`
      }

      plugins.push([
        rehypeCitation,
        {
          bibliography: citationBibliography,
          suppressBibliography: opts.suppressBibliography,
          linkCitations: opts.linkCitations,
          csl: opts.csl,
          lang,
        },
      ])

      plugins.push(() => {
        return (tree) => {
          visit(tree, "element", (node: any) => {
            if (node.tagName !== "a" || !node.properties?.href) return

            const href = String(node.properties.href)
            if (!href.startsWith("#bib-")) return

            const key = href.slice("#bib-".length).toLowerCase()
            const entry = citationData[key]
            if (!entry) return

            node.properties.href = entry.link
            node.properties.target = "_blank"
            node.properties.rel = "noopener noreferrer"
            node.properties["data-cite-title"] = entry.title
            node.properties["data-cite-authors"] = entry.authors
            node.properties["data-cite-year"] = entry.year
            node.properties["data-cite-container"] = entry.container
            node.properties["data-cite-volume"] = entry.volume
            node.properties["data-cite-issue"] = entry.issue
            node.properties["data-cite-pages"] = entry.pages
            node.properties["data-cite-doi"] = entry.doi
            node.properties["data-cite-source-url"] = entry.sourceUrl
            node.properties["data-cite-link-label"] = entry.linkLabel
            node.properties.className = [...classNames(node.properties.className), "citation-link"]
          })
        }
      })

      return plugins
    },
    externalResources() {
      return {
        js: [
          {
            script: popoverScript,
            loadTime: "afterDOMReady",
            contentType: "inline",
          },
        ],
      }
    },
  }
}

export default Citations
