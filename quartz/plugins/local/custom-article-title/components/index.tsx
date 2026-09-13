import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const styledStatuses = new Set(["draft", "review", "writing", "transient"]);

const CustomArticleTitleComponent: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const frontmatter = fileData.frontmatter as { title?: string, page_title?: string, status?: unknown } | undefined;
  // If page_title exists, use it. Otherwise fallback to regular title.
  const title = frontmatter?.page_title ?? frontmatter?.title;
  const status = String(frontmatter?.status ?? "").trim().toLowerCase();
  const statusClass = styledStatuses.has(status) ? `status-${status}` : undefined;
  
  if (title) {
    return <h1 class={classNames(displayClass, "article-title", statusClass)}>{title}</h1>;
  } else {
    return null;
  }
};

CustomArticleTitleComponent.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`;

export const CustomArticleTitle = (() => CustomArticleTitleComponent) satisfies QuartzComponentConstructor;
