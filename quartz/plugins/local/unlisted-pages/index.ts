import type { PluggableList, Plugin } from "unified"
import type { Root as HastRoot } from "hast"
import type { VFile } from "vfile"
import type { QuartzTransformerPlugin } from "@quartz-community/types"

function normalizeStatus(str: unknown): string {
  if (str === null || str === undefined) return ""
  return String(str).toLowerCase().replace(/['"\-_ ]/g, "").trim()
}

function isUnlistedStatus(status: unknown): boolean {
  const norm = normalizeStatus(status)
  return (
    norm === "wip" ||
    norm === "writing" ||
    norm === "inprogress" ||
    norm === "review" ||
    norm === "inreview" ||
    norm === "revising" ||
    norm === "polish"
  )
}

const rehypeUnlisted = (): Plugin<[], HastRoot> => {
  return () => (_tree: HastRoot, file: VFile) => {
    const frontmatter = file.data?.frontmatter as Record<string, unknown> | undefined
    if (typeof frontmatter?.unlisted === "boolean") {
      ;(file.data as Record<string, unknown>).unlisted = frontmatter.unlisted
    } else if (isUnlistedStatus(frontmatter?.status)) {
      ;(file.data as Record<string, unknown>).unlisted = true
    }
  }
}

export const UnlistedPages: QuartzTransformerPlugin<undefined> = () => {
  return {
    name: "UnlistedPages",
    htmlPlugins(): PluggableList {
      return [rehypeUnlisted()]
    },
  }
}

export default UnlistedPages
