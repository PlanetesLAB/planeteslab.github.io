import { QuartzFilterPlugin } from "@quartz-community/types"

function normalizeStatus(str: unknown): string {
  if (str === null || str === undefined) return ""
  return String(str).toLowerCase().trim()
}

export const ExplicitPublish: QuartzFilterPlugin = () => ({
  name: "ExplicitPublish",
  shouldPublish(_ctx, [_tree, vfile]) {
    const frontmatter = vfile.data?.frontmatter as Record<string, unknown> | undefined
    if (!frontmatter) return true

    const status = normalizeStatus(frontmatter.status)

    // Transient notes are useful in a local build, but must never be included
    // in a CI artifact (including the GitHub Pages deployment).
    const isCiBuild = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true"
    return status !== "transient" || !isCiBuild
  },
})

export default ExplicitPublish
