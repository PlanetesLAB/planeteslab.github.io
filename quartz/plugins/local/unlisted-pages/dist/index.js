// quartz/plugins/local/unlisted-pages/index.ts
function normalizeStatus(str) {
  if (str === null || str === void 0) return "";
  return String(str).toLowerCase().replace(/['"\-_ ]/g, "").trim();
}
function isUnlistedStatus(status) {
  const norm = normalizeStatus(status);
  return norm === "wip" || norm === "writing" || norm === "inprogress" || norm === "review" || norm === "inreview" || norm === "revising" || norm === "polish";
}
var rehypeUnlisted = () => {
  return () => (_tree, file) => {
    const frontmatter = file.data?.frontmatter;
    if (typeof frontmatter?.unlisted === "boolean") {
      ;
      file.data.unlisted = frontmatter.unlisted;
    } else if (isUnlistedStatus(frontmatter?.status)) {
      ;
      file.data.unlisted = true;
    }
  };
};
var UnlistedPages = () => {
  return {
    name: "UnlistedPages",
    htmlPlugins() {
      return [rehypeUnlisted()];
    }
  };
};
var index_default = UnlistedPages;
export {
  UnlistedPages,
  index_default as default
};
