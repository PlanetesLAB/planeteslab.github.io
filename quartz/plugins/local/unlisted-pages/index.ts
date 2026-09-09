import type { PluggableList, Plugin } from "unified"
import type { Root as HastRoot } from "hast"
import type { VFile } from "vfile"
import type { QuartzTransformerPlugin } from "@quartz-community/types"

function normalizeStatus(str: unknown): string {
  if (str === null || str === undefined) return ""
  return String(str).toLowerCase().trim()
}

const rehypeUnlisted = (): Plugin<[], HastRoot> => {
  return () => (_tree: HastRoot, file: VFile) => {
    const frontmatter = file.data?.frontmatter as Record<string, unknown> | undefined
    const status = normalizeStatus(frontmatter?.status)
    if (status === "writing" || status === "review") {
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
