// index.ts
function normalizeStatus(str) {
  if (str === null || str === void 0) return "";
  return String(str).toLowerCase().trim();
}
var rehypeUnlisted = () => {
  return () => (_tree, file) => {
    const frontmatter = file.data?.frontmatter;
    const status = normalizeStatus(frontmatter?.status);
    if (status === "writing" || status === "review") {
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
