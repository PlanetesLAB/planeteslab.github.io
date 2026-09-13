import { createRequire } from 'module'; const require = createRequire(import.meta.url);

// components/index.tsx
import { jsx } from "preact/jsx-runtime";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
var styledStatuses = /* @__PURE__ */ new Set(["draft", "review", "writing", "transient"]);
var CustomArticleTitleComponent = ({ fileData, displayClass }) => {
  const frontmatter = fileData.frontmatter;
  const title = frontmatter?.page_title ?? frontmatter?.title;
  const status = String(frontmatter?.status ?? "").trim().toLowerCase();
  const statusClass = styledStatuses.has(status) ? `status-${status}` : void 0;
  if (title) {
    return /* @__PURE__ */ jsx("h1", { class: classNames(displayClass, "article-title", statusClass), children: title });
  } else {
    return null;
  }
};
CustomArticleTitleComponent.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`;
var CustomArticleTitle = (() => CustomArticleTitleComponent);
export {
  CustomArticleTitle
};
