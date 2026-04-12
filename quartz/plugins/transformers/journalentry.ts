// import { Heading, Root, RootContent } from "mdast"
// import { QuartzTransformerPlugin } from "../types"

// const MONTH_MAP: Record<string, string> = {
//     january: "january", february: "february", march: "march",
//     april: "april", may: "may", june: "june",
//     july: "july", august: "august", september: "september",
//     october: "october", november: "november", december: "december",
// }

// // ISO 8601 week number (Monday = start of week)
// function isoWeekNumber(date: Date): number {
//     const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
//     // Set to nearest Thursday (ISO weeks are defined by their Thursday)
//     d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
//     const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
//     return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
// }

// // Format YYYY-MM-DD → "April 14"
// function prettyDate(dateStr: string): string {
//     // Parse as local date to avoid UTC offset shifting the day
//     const [year, month, day] = dateStr.split("-").map(Number)
//     const date = new Date(year, month - 1, day)
//     return date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
// }

// // Accepts: "2025-04-14", "W15 · 2025-04-14", "2025-04-14 · W15"
// // Returns: { week: "W15", date: Date | null, rawDate: "2025-04-14" }
// function parseEntryHeading(text: string): { week: string; display: string } {
//     // Try to find a YYYY-MM-DD date in the heading
//     const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/)

//     if (dateMatch) {
//         const rawDate = dateMatch[1]
//         const [year, month, day] = rawDate.split("-").map(Number)
//         const date = new Date(year, month - 1, day)
//         const weekNum = isoWeekNumber(date)
//         const week = `W${String(weekNum).padStart(2, "0")}`
//         const display = prettyDate(rawDate)
//         return { week, display }
//     }

//     // Fallback: heading has no parseable date — render as-is, no week badge
//     // Strip any existing W## token and use the rest as display
//     const weekMatch = text.match(/\bW(\d{1,2})\b/i)
//     const week = weekMatch ? `W${weekMatch[1].padStart(2, "0")}` : ""
//     const display = text
//         .replace(/\bW\d{1,2}\b/i, "")
//         .replace(/^\s*[·|,—–]\s*/, "")
//         .replace(/\s*[·|,—–]\s*$/, "")
//         .trim()

//     return { week, display }
// }

// function headingText(node: Heading): string {
//     return node.children
//         .map((c) => ("value" in c ? c.value : ""))
//         .join("")
//         .trim()
// }

// function html(value: string): RootContent {
//     return { type: "html", value }
// }

// export const JournalEntryInjector: QuartzTransformerPlugin = () => {
//     return {
//         name: "JournalEntryInjector",
//         markdownPlugins() {
//             return [
//                 () => {
//                     return (tree: Root, file) => {
//                         const frontmatter = file.data.frontmatter as Record<string, unknown>
//                         const tags = (frontmatter?.tags as string[]) ?? []

//                         const hasJournalTag = tags.some(
//                             (tag) => tag.toLowerCase() === "journal" || tag.toLowerCase() === "#journal"
//                         )

//                         if (!hasJournalTag) return

//                         const newChildren: RootContent[] = []
//                         let insideMonth = false
//                         let insideEntry = false

//                         for (const node of tree.children) {
//                             // ── h1: Month heading ────────────────────────────────────────
//                             if (node.type === "heading" && node.depth === 1) {
//                                 if (insideEntry) { newChildren.push(html("</div>")); insideEntry = false }
//                                 if (insideMonth) { newChildren.push(html("</div>")); insideMonth = false }

//                                 const rawText = headingText(node)
//                                 const words = rawText.split(/\s+/)
//                                 const firstWord = words[0].toLowerCase()
//                                 const monthKey = MONTH_MAP[firstWord] ?? ""
//                                 const yearPart = words.slice(1).join(" ")

//                                 newChildren.push(html(`<div class="journal-month-block" data-month="${monthKey}">`))
//                                 insideMonth = true

//                                 newChildren.push(html(`
//                   <h1 class="journal-month-heading">
//                     <span class="journal-month-pill">${words[0]}</span>
//                     <span class="journal-month-year">${yearPart}</span>
//                   </h1>
//                 `))
//                                 continue
//                             }

//                             // ── h2: Entry heading ────────────────────────────────────────
//                             if (node.type === "heading" && node.depth === 2) {
//                                 if (insideEntry) { newChildren.push(html("</div>")); insideEntry = false }

//                                 const rawText = headingText(node)
//                                 const { week, display } = parseEntryHeading(rawText)

//                                 newChildren.push(html(`<div class="journal-entry-block">`))
//                                 insideEntry = true

//                                 const weekSpan = week ? `<span class="journal-week-num">${week}</span>` : ""
//                                 const sepSpan = week && display ? `<span class="journal-sep">·</span>` : ""
//                                 const displaySpan = display ? `<span class="journal-entry-date">${display}</span>` : ""

//                                 newChildren.push(html(`
//                   <h2 class="journal-entry-heading">
//                     ${weekSpan}${sepSpan}${displaySpan}
//                   </h2>
//                 `))
//                                 continue
//                             }

//                             // ── Everything else: pass through untouched ──────────────────
//                             newChildren.push(node)
//                         }

//                         if (insideEntry) newChildren.push(html("</div>"))
//                         if (insideMonth) newChildren.push(html("</div>"))

//                         tree.children = newChildren
//                     }
//                 },
//             ]
//         },
//     }
// }

import { Heading, Root, RootContent } from "mdast"
import { QuartzTransformerPlugin } from "../types"

const MONTH_MAP: Record<string, string> = {
    january: "january", february: "february", march: "march",
    april: "april", may: "may", june: "june",
    july: "july", august: "august", september: "september",
    october: "october", november: "november", december: "december",
}

function isoWeekNumber(date: Date): number {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7))
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
}

function prettyDate(dateStr: string): string {
    const [year, month, day] = dateStr.split("-").map(Number)
    const date = new Date(year, month - 1, day)
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric" })
}

function parseEntryHeading(text: string): { week: string; display: string } {
    const dateMatch = text.match(/(\d{4}-\d{2}-\d{2})/)
    if (dateMatch) {
        const rawDate = dateMatch[1]
        const [year, month, day] = rawDate.split("-").map(Number)
        const date = new Date(year, month - 1, day)
        const weekNum = isoWeekNumber(date)
        const week = `W${String(weekNum).padStart(2, "0")}`
        const display = prettyDate(rawDate)
        return { week, display }
    }

    const weekMatch = text.match(/\bW(\d{1,2})\b/i)
    const week = weekMatch ? `W${weekMatch[1].padStart(2, "0")}` : ""
    const display = text
        .replace(/\bW\d{1,2}\b/i, "")
        .replace(/^\s*[·|,—–]\s*/, "")
        .replace(/\s*[·|,—–]\s*$/, "")
        .trim()
    return { week, display }
}

function headingText(node: Heading): string {
    return node.children
        .map((c) => ("value" in c ? c.value : ""))
        .join("")
        .trim()
}

function html(value: string): RootContent {
    return { type: "html", value }
}

export const JournalEntryInjector: QuartzTransformerPlugin = () => {
    return {
        name: "JournalEntryInjector",
        markdownPlugins() {
            return [
                () => {
                    return (tree: Root, file) => {
                        const frontmatter = file.data.frontmatter as Record<string, unknown>
                        const tags = (frontmatter?.tags as string[]) ?? []

                        const hasJournalTag = tags.some(
                            (tag) => tag.toLowerCase() === "journal" || tag.toLowerCase() === "#journal"
                        )

                        if (!hasJournalTag) return

                        const newChildren: RootContent[] = []
                        let insideMonth = false
                        let insideEntry = false

                        for (const node of tree.children) {
                            // ── h1: Month heading ────────────────────────────────────────
                            if (node.type === "heading" && node.depth === 1) {
                                if (insideEntry) { newChildren.push(html("</details>")); insideEntry = false }
                                if (insideMonth) { newChildren.push(html("</div>")); insideMonth = false }

                                const rawText = headingText(node)
                                const words = rawText.split(/\s+/)
                                const firstWord = words[0].toLowerCase()
                                const monthKey = MONTH_MAP[firstWord] ?? ""
                                const yearPart = words.slice(1).join(" ")

                                newChildren.push(html(`<div class="journal-month-block" data-month="${monthKey}">`))
                                insideMonth = true

                                newChildren.push(html(`
                  <h1 class="journal-month-heading">
                    <span class="journal-month-pill">${words[0]}</span>
                    <span class="journal-month-year">${yearPart}</span>
                  </h1>
                `))
                                continue
                            }

                            // ── h2: Entry heading → <details> + <summary> ───────────────
                            if (node.type === "heading" && node.depth === 2) {
                                if (insideEntry) { newChildren.push(html("</details>")); insideEntry = false }

                                const rawText = headingText(node)
                                const { week, display } = parseEntryHeading(rawText)

                                const weekSpan = week ? `<span class="journal-week-num">${week}</span>` : ""
                                const sepSpan = week && display ? `<span class="journal-sep">·</span>` : ""
                                const displaySpan = display ? `<span class="journal-entry-date">${display}</span>` : ""

                                // open attribute = expanded by default
                                newChildren.push(html(`
                  <details class="journal-entry-block" open>
                    <summary class="journal-entry-heading">
                      ${weekSpan}${sepSpan}${displaySpan}
                      <span class="journal-entry-chevron"></span>
                    </summary>
                `))
                                insideEntry = true
                                continue
                            }

                            // ── Everything else: pass through untouched ──────────────────
                            newChildren.push(node)
                        }

                        if (insideEntry) newChildren.push(html("</details>"))
                        if (insideMonth) newChildren.push(html("</div>"))

                        tree.children = newChildren
                    }
                },
            ]
        },
    }
}