import { QuartzFilterPlugin } from "@quartz-community/types"

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

export const ExplicitPublish: QuartzFilterPlugin = () => ({
  name: "ExplicitPublish",
  shouldPublish(_ctx, [_tree, vfile]) {
    const frontmatter = vfile.data?.frontmatter as Record<string, unknown> | undefined
    if (!frontmatter) return false

    // 1. Explicitly published
    if (frontmatter.publish === true || frontmatter.publish === "true") {
      return true
    }

    // 2. Explicitly marked unlisted
    if (frontmatter.unlisted === true || frontmatter.unlisted === "true") {
      return true
    }

    // 3. Status is WIP / Writing / In Progress / Review
    if (isUnlistedStatus(frontmatter.status)) {
      return true
    }

    return false
  },
})

export default ExplicitPublish
