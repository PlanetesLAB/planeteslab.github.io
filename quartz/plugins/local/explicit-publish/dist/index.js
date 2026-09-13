// index.ts
function normalizeStatus(str) {
  if (str === null || str === void 0) return "";
  return String(str).toLowerCase().trim();
}
var ExplicitPublish = () => ({
  name: "ExplicitPublish",
  shouldPublish(_ctx, [_tree, vfile]) {
    const frontmatter = vfile.data?.frontmatter;
    if (!frontmatter) return true;
    const status = normalizeStatus(frontmatter.status);
    const isCiBuild = process.env.CI === "true" || process.env.GITHUB_ACTIONS === "true";
    return status !== "transient" || !isCiBuild;
  }
});
var index_default = ExplicitPublish;
export {
  ExplicitPublish,
  index_default as default
};
