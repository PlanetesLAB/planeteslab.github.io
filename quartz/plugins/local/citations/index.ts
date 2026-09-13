import fs from "fs"
import path from "path"
import rehypeCitation from "rehype-citation"
import type { PluggableList } from "unified"
import { visit } from "unist-util-visit"
import type { QuartzTransformerPlugin } from "@quartz-community/types"

function field(body: string, name: string) {
  const r = new RegExp(name + "\\s*=\\s*\\{([^}]+)\\}", "i")
  const m = body.match(r)
  return m ? m[1] : ""
}

function cleanBibTex(str: string) {
  if (!str) return ""

  return str
    // remove outer braces
    .replace(/^\{+|\}+$/g, "")
    // remove remaining braces
    .replace(/[{}]/g, "")
    // convert common LaTeX subscripts
    .replace(/_\{([^}]*)\}/g, "<sub>$1</sub>")
    // convert superscripts
    .replace(/\^\{([^}]*)\}/g, "<sup>$1</sup>")
    // remove math mode $
    .replace(/\$/g, "")
    // collapse whitespace
    .replace(/\s+/g, " ")
    .trim()
}

function formatAuthors(authors: string) {
  const parts = authors.split(" and ")
  if (parts.length === 0) return authors
  if (parts.length === 1) return parts[0]
  return parts[0].split(",")[0] + " et al."
}

function parseBibFile(filePath: string) {
  const text = fs.readFileSync(filePath, "utf8")
  const entries: Record<string, any> = {}

  const entryRegex = /@.+?\{([^,]+),([\s\S]*?)\n\}/g

  let match
  while ((match = entryRegex.exec(text)) !== null) {
    const key = match[1].trim().toLowerCase()
    const body = match[2]

    const doi = field(body, "doi")
    const url = field(body, "url")

    entries[key] = {
      title: cleanBibTex(field(body, "title")),
      author: formatAuthors(cleanBibTex(field(body, "author"))),
      year: cleanBibTex(field(body, "year")),
      journal: normalizeJournal(field(body, "journal") || field(body, "booktitle")),
      link: doi ? `https://doi.org/${doi}` : url
    }
  }

  return entries
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
      if (character === "\\\\") {
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

    // Include the closing delimiter, optional comma, and the line ending.
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

  // rehype-citation resolves local bibliography paths relative to the current
  // working directory, so pass it a relative path rather than an absolute one.
  return path.relative(process.cwd(), derivedPath)
}

export interface Options {
  bibliographyFile: string
  suppressBibliography: boolean
  linkCitations: boolean
  csl: string
}

const defaultOptions: Options = {
  bibliographyFile: "./bibliography.bib",
  suppressBibliography: true,
  linkCitations: true,
  csl: "apa",
}

const journalMacros: Record<string, string> = {
  "\\apj": "The Astrophysical Journal",
  "\\apjl": "The Astrophysical Journal Letters",
  "\\apjs": "The Astrophysical Journal Supplement Series",
  "\\aj": "The Astronomical Journal",
  "\\aap": "Astronomy & Astrophysics",
  "\\aapr": "Astronomy & Astrophysics Review",
  "\\aaps": "Astronomy & Astrophysics Supplement Series",
  "\\mnras": "Monthly Notices of the Royal Astronomical Society",
  "\\nat": "Nature",
  "\\sci": "Science",
  "\\icarus": "Icarus",
  "\\pasp": "Publications of the Astronomical Society of the Pacific",
  "\\pasj": "Publications of the Astronomical Society of Japan"
}

function normalizeJournal(journal: string) {
  if (!journal) return ""

  const cleaned = journal
    .replace(/[{}]/g, "")
    .trim()

  if (journalMacros[cleaned]) {
    return journalMacros[cleaned]
  }

  return cleaned
}

const popoverScript = `
document.addEventListener("DOMContentLoaded", () => {
    const pop = document.createElement("div")
    pop.className = "citation-popover"
    document.body.appendChild(pop)

    document.querySelectorAll("a.citation-link").forEach((el) => {
        el.addEventListener("mouseenter", () => {
            const title = el.dataset.citeTitle || ""
            const author = el.dataset.citeAuthor || ""
            const year = el.dataset.citeYear || ""
            const journal = el.dataset.citeJournal || ""

            pop.innerHTML =
                "<strong>" + title + "</strong><br>" +
                author + " (" + year + ")<br>" +
                journal

            const rect = el.getBoundingClientRect()
            pop.style.left = rect.left + window.scrollX + "px"
            pop.style.top = rect.bottom + window.scrollY + 8 + "px"
            pop.style.display = "block"
        })

        el.addEventListener("mouseleave", () => {
            pop.style.display = "none"
        })
    })
})
`

export const Citations: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  const citationBibliography = createCitationBibliography(path.resolve(opts.bibliographyFile))

  return {
    name: "Citations",
    htmlPlugins(ctx) {
      const plugins: PluggableList = []

      let lang: string = "en-US"
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
        const bibPath = path.resolve(opts.bibliographyFile)
        const citationData = parseBibFile(bibPath)
        return (tree) => {
          visit(tree, "element", (node: any) => {
            if (
              node.tagName === "a" &&
              node.properties?.href
            ) {
              const href = String(node.properties.href)
              if (href.startsWith("#bib-")) {
                const key = node.properties.href.replace("#bib-", "").toLowerCase()
                const entry = citationData[key]

                if (entry?.link) {
                  node.properties.href = entry.link
                  node.properties.target = "_blank"
                  node.properties.rel = "noopener noreferrer"

                  node.properties["data-cite-title"] = entry.title
                  node.properties["data-cite-author"] = entry.author
                  node.properties["data-cite-year"] = entry.year
                  node.properties["data-cite-journal"] = entry.journal

                  node.properties.className = [
                    ...(node.properties.className || []),
                    "citation-link",
                  ]
                }
              }
            }
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
