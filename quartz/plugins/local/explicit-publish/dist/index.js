// quartz/plugins/local/explicit-publish/index.ts
function normalizeStatus(str) {
  if (str === null || str === void 0) return "";
  return String(str).toLowerCase().replace(/['"\-_ ]/g, "").trim();
}
function isUnlistedStatus(status) {
  const norm = normalizeStatus(status);
  return norm === "wip" || norm === "writing" || norm === "inprogress" || norm === "review" || norm === "inreview" || norm === "revising" || norm === "polish";
}
var ExplicitPublish = () => ({
  name: "ExplicitPublish",
  shouldPublish(_ctx, [_tree, vfile]) {
    const frontmatter = vfile.data?.frontmatter;
    if (!frontmatter) return false;
    if (frontmatter.publish === true || frontmatter.publish === "true") {
      return true;
    }
    if (frontmatter.unlisted === true || frontmatter.unlisted === "true") {
      return true;
    }
    if (isUnlistedStatus(frontmatter.status)) {
      return true;
    }
    return false;
  }
});
var index_default = ExplicitPublish;
export {
  ExplicitPublish,
  index_default as default
};
