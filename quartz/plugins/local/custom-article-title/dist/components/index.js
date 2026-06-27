import { createRequire } from 'module'; const require = createRequire(import.meta.url);

// components/index.tsx
import { jsx } from "preact/jsx-runtime";
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}
var CustomArticleTitleComponent = ({ fileData, displayClass }) => {
  const frontmatter = fileData.frontmatter;
  const title = frontmatter?.page_title ?? frontmatter?.title;
  if (title) {
    return /* @__PURE__ */ jsx("h1", { class: classNames(displayClass, "article-title"), children: title });
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
