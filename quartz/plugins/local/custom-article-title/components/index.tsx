import type {
  QuartzComponent,
  QuartzComponentProps,
  QuartzComponentConstructor,
} from "@quartz-community/types";

function classNames(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

const CustomArticleTitleComponent: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const frontmatter = fileData.frontmatter as { title?: string, page_title?: string } | undefined;
  // If page_title exists, use it. Otherwise fallback to regular title.
  const title = frontmatter?.page_title ?? frontmatter?.title;
  
  if (title) {
    return <h1 class={classNames(displayClass, "article-title")}>{title}</h1>;
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
