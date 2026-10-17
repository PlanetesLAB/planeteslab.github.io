import { cloneElement, isValidElement, toChildArray } from "preact"
import NotFound from "../../../components/pages/404"
import type { QuartzComponent, QuartzComponentConstructor } from "../../../components/types"
// @ts-expect-error Quartz loads inline scripts as bundled source strings.
import randomEntryScript from "./random-entry.inline"
import style from "./style.scss"

const DefaultNotFound = NotFound()

const LostInSpace: QuartzComponent = (props) => {
  const url = new URL(`https://${props.cfg.baseUrl ?? "example.com"}`)
  const baseDir = props.ctx.argv.serve ? "/" : `${url.pathname.replace(/\/$/, "")}/`
  const entries = [
    ...new Set(
      props.allFiles.flatMap(({ slug, relativePath }) =>
        slug &&
        relativePath?.endsWith(".md") &&
        slug !== "404" &&
        slug !== "index" &&
        !slug.endsWith("/index") &&
        !slug.startsWith("tags/")
          ? [`${baseDir}${slug.split("/").map(encodeURIComponent).join("/")}`]
          : [],
      ),
    ),
  ]

  // Keep Quartz's message and redirect, wrapping only its home link.
  const content = DefaultNotFound(props)
  const contentWithActions = cloneElement(
    content,
    {},
    toChildArray(content.props.children).map((child) =>
      isValidElement(child) && child.type === "a" ? (
        <nav class="not-found-actions" aria-label="Explore the site">
          {entries.length > 0 && (
            <a
              class="not-found-lucky"
              href={entries[0]}
              data-random-entries={JSON.stringify(entries)}
              title="Open a random entry on the site"
            >
              I'm feeling lucky
            </a>
          )}
          {child}
        </nav>
      ) : (
        child
      ),
    ),
  )

  return (
    <main class="not-found-page">
      <style dangerouslySetInnerHTML={{ __html: style }} />
      <div class="not-found-artwork" aria-hidden="true">
        <img
          src={`${baseDir}images/cards/wallpaper_55cancri.jpeg`}
          alt=""
          width="1920"
          height="1080"
          fetchPriority="high"
          decoding="async"
        />
      </div>
      {props.cfg.locale.startsWith("en") && <p class="not-found-heading">Lost in space.</p>}
      {contentWithActions}
      <script dangerouslySetInnerHTML={{ __html: randomEntryScript }} />
    </main>
  )
}

export default (() => LostInSpace) satisfies QuartzComponentConstructor
