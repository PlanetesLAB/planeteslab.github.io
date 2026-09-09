import { QuartzFilterPlugin } from "@quartz-community/types"

function normalizeStatus(str: unknown): string {
  if (str === null || str === undefined) return ""
  return String(str).toLowerCase().trim()
}

export const ExplicitPublish: QuartzFilterPlugin = () => ({
  name: "ExplicitPublish",
  shouldPublish(_ctx, [_tree, vfile]) {
    const frontmatter = vfile.data?.frontmatter as Record<string, unknown> | undefined
    if (!frontmatter) return false

    const status = normalizeStatus(frontmatter.status)
    return status === "live" || status === "writing" || status === "review"
  },
})

export default ExplicitPublish
