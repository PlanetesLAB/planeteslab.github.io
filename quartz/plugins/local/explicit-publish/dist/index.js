// index.ts
function normalizeStatus(str) {
  if (str === null || str === void 0) return "";
  return String(str).toLowerCase().trim();
}
var ExplicitPublish = () => ({
  name: "ExplicitPublish",
  shouldPublish(_ctx, [_tree, vfile]) {
    const frontmatter = vfile.data?.frontmatter;
    if (!frontmatter) return false;
    const status = normalizeStatus(frontmatter.status);
    return status === "live" || status === "writing" || status === "review";
  }
});
var index_default = ExplicitPublish;
export {
  ExplicitPublish,
  index_default as default
};
