// sidenotes.inline.ts
function installSidenotes() {
  let disposePage;
  function setupPage() {
    disposePage?.();
    delete document.body.dataset.readingMargin;
    const main = document.querySelector(".center .markdown-preview-view");
    const article = main?.closest("article");
    if (!main || !article) return;
    const wide = matchMedia("(min-width: 1200px)");
    const right = document.querySelector("#quartz-body > .right.sidebar");
    const hasMargin = () => wide.matches && article.closest(".page")?.dataset.frame === "default" && Boolean(right && (right.childElementCount || article.matches(".popover-hint"))) && document.documentElement.getAttribute("reader-mode") !== "on";
    const footnotes = main.querySelector("section[data-footnotes], .footnotes");
    if (footnotes) {
      const contents = /* @__PURE__ */ new Map();
      for (const item of footnotes.querySelectorAll("li[id]")) {
        const clone = item.cloneNode(true);
        for (const backlink of clone.querySelectorAll(
          '.footnote-backref, [data-footnote-backref], a[href^="#user-content-fnref"], a[href^="#fnref"]'
        )) {
          backlink.remove();
        }
        const html = clone.innerHTML.trim().replace(/^<p>(.*?)<\/p>$/is, "$1");
        contents.set(item.id, html);
        contents.set(item.id.replace(/^(user-content-)?fn[:-]?/, ""), html);
      }
      for (const ref of main.querySelectorAll(
        'sup[id*="fnref"], a[data-footnote-ref], sup:has(a[href*="#fn"]), sup:has(a[href*="#user-content-fn"])'
      )) {
        if (!ref.isConnected || ref.closest(".footnote-details, [data-footnotes], .footnotes"))
          continue;
        const link = ref.matches("a") ? ref : ref.querySelector("a");
        const rawId = (link?.getAttribute("href") ?? "").split("#").at(-1) ?? "";
        const id = rawId.replace(/^(user-content-)?fn[:-]?/, "");
        const content = contents.get(rawId) ?? contents.get(id);
        if (!content) continue;
        const target = ref.matches("a") && ref.parentElement?.tagName === "SUP" ? ref.parentElement : ref;
        const label = link?.textContent?.trim() || id;
        const details = document.createElement("details");
        details.className = "footnote-details";
        details.id = target.id || link?.id || "";
        details.open = hasMargin();
        const summary = document.createElement("summary");
        summary.className = "footnote-summary";
        summary.title = "Toggle footnote";
        summary.setAttribute("aria-label", `Footnote ${label}`);
        const number = document.createElement("sup");
        number.className = "footnote-ref-num";
        number.textContent = label;
        summary.append(number);
        const body = document.createElement("span");
        body.className = "footnote-body";
        const bodyNumber = document.createElement("sup");
        bodyNumber.className = "footnote-num";
        bodyNumber.textContent = label;
        body.append(bodyNumber, " ");
        body.insertAdjacentHTML("beforeend", content);
        details.append(summary, body);
        target.replaceWith(details);
      }
      ;
      footnotes.hidden = true;
    }
    for (const toc2 of document.querySelectorAll(".right.sidebar .toc")) {
      const header = toc2.querySelector(".toc-header");
      const content = toc2.querySelector(".toc-content");
      header?.classList.add("collapsed");
      header?.setAttribute("aria-expanded", "false");
      if (content?.id) header?.setAttribute("aria-controls", content.id);
      content?.classList.add("collapsed");
    }
    for (const backlinks of document.querySelectorAll(".right.sidebar .backlinks")) {
      if (backlinks.querySelector(".backlinks-header")) continue;
      const heading = backlinks.querySelector("h3");
      const list = backlinks.querySelector("ul");
      if (!heading || !list) continue;
      const items = list.querySelectorAll("li:not(.overflow-end)");
      const empty = !items.length || items.length === 1 && items[0].textContent?.toLowerCase().includes("no backlinks");
      const header = document.createElement("button");
      header.className = "backlinks-header collapsed";
      header.type = "button";
      header.setAttribute("aria-expanded", "false");
      header.innerHTML = '<h3>Backlinks</h3><div class="backlinks-header-meta">' + (!empty ? `<span class="backlinks-count">${items.length}</span>` : "") + '<svg class="fold" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>';
      heading.replaceWith(header);
      list.classList.add("backlinks-content", "collapsed");
      header.addEventListener("click", () => {
        const collapsed = header.classList.toggle("collapsed");
        header.setAttribute("aria-expanded", String(!collapsed));
        list.classList.toggle("collapsed", collapsed);
      });
    }
    const toc = right?.querySelector(":scope > .toc");
    const tocSlot = toc ? document.createElement("span") : void 0;
    if (toc && tocSlot) {
      tocSlot.className = "reading-toc-slot";
      tocSlot.setAttribute("aria-hidden", "true");
      toc.before(tocSlot);
      toc.classList.add("reading-sticky-toc");
    }
    const reviewSummary = main.querySelector(
      ":scope > .paper-preview-container:has(.coceri-section)"
    );
    function placeToc() {
      if (!toc || !tocSlot) return;
      if (wide.matches) {
        if (toc.parentElement !== right) tocSlot.after(toc);
      } else if (reviewSummary?.isConnected) {
        if (toc.previousElementSibling !== reviewSummary) reviewSummary.after(toc);
      } else if (toc.nextElementSibling !== article) {
        article.before(toc);
      }
    }
    const anchors = /* @__PURE__ */ new Map();
    const observed = /* @__PURE__ */ new WeakSet();
    const listeners = new AbortController();
    const signal = listeners.signal;
    let frame;
    let disposed = false;
    let previousMargin;
    function prepareNotes() {
      let index = anchors.size;
      for (const callout of main.querySelectorAll(":scope > .callout")) {
        if (anchors.has(callout)) continue;
        let kind = (callout.dataset.callout ?? "").toLowerCase().replace(/[\s-]/g, "");
        if (kind === "see" && callout.dataset.calloutMetadata?.trim().toLowerCase() === "also")
          kind = "seealso";
        const title = callout.querySelector(":scope > .callout-title");
        if (!title || !["note", "info", "tip", "todo", "related", "seealso", "question"].includes(kind))
          continue;
        if (callout.textContent.length > 450 || callout.querySelector(
          ".callout, mjx-container[display='true'], .math-display, .katex-display, pre, table, img, video, .footnote-details, a[data-footnote-ref]"
        ))
          continue;
        const existingAnchor = callout.previousElementSibling;
        if (existingAnchor instanceof HTMLElement && existingAnchor.classList.contains("reading-note-anchor")) {
          index++;
          anchors.set(callout, existingAnchor);
          continue;
        }
        let id = `reading-note-${++index}`;
        while (!callout.id && document.getElementById(id)) id += "-note";
        callout.id ||= id;
        const anchor = document.createElement("span");
        anchor.className = "reading-note-anchor";
        anchor.setAttribute("aria-hidden", "true");
        callout.before(anchor);
        callout.classList.add("reading-margin-note");
        anchors.set(callout, anchor);
      }
    }
    function schedule() {
      if (disposed || frame !== void 0) return;
      frame = requestAnimationFrame(layout);
    }
    const sizes = new ResizeObserver(schedule);
    function observe(element) {
      if (element && !observed.has(element)) {
        sizes.observe(element);
        observed.add(element);
      }
    }
    function visible(element) {
      return element.getClientRects().length > 0 && !element.closest("details:not([open]), .callout.is-collapsed .callout-content");
    }
    function layout() {
      frame = void 0;
      if (disposed || !article.isConnected) return;
      placeToc();
      const margin = hasMargin();
      document.body.dataset.readingMargin = String(margin);
      if (margin !== previousMargin) {
        for (const detail of article.querySelectorAll(
          "details.footnote-details"
        )) {
          const open = margin || detail.hasAttribute("data-user-opened");
          if (detail.open !== open) detail.open = open;
        }
        previousMargin = margin;
      }
      prepareNotes();
      observe(main);
      if (!margin) {
        article.style.removeProperty("--reading-article-height");
        return;
      }
      const bounds = article.getBoundingClientRect();
      const items = [...anchors].map(([note, anchor]) => ({ note, anchor }));
      for (const note of article.querySelectorAll(
        "details.footnote-details[open] > .footnote-body"
      )) {
        const anchor = note.parentElement.querySelector("summary");
        items.push({ note, anchor });
      }
      const measured = items.filter(({ note, anchor }) => visible(note) && visible(anchor)).map(({ note, anchor }) => {
        observe(note);
        return {
          note,
          natural: anchor.getBoundingClientRect().top - bounds.top,
          height: note.getBoundingClientRect().height
        };
      }).sort((a, b) => a.natural - b.natural);
      let bottom = 0;
      for (const header of right.querySelectorAll(".toc-header, .backlinks-header")) {
        observe(header);
        if (visible(header)) {
          const reserve = toc?.contains(header) && tocSlot ? tocSlot : header;
          const end = reserve === tocSlot ? reserve.getBoundingClientRect().top + toc.offsetHeight : reserve.getBoundingClientRect().bottom;
          bottom = Math.max(bottom, end - bounds.top + 20);
        }
      }
      for (const item of measured) {
        const top = Math.max(item.natural, bottom);
        item.note.style.setProperty("--reading-note-top", `${top}px`);
        bottom = top + item.height + 22;
      }
      article.style.setProperty(
        "--reading-article-height",
        `${Math.max(main.offsetHeight, bottom)}px`
      );
    }
    const changes = new MutationObserver(schedule);
    changes.observe(article, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["class", "open"]
    });
    const modes = new MutationObserver(schedule);
    modes.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["saved-theme", "reader-mode"]
    });
    for (const event of ["load", "resize"]) window.addEventListener(event, schedule, { signal });
    for (const event of ["render", "transitionend"])
      document.addEventListener(event, schedule, { signal });
    article.addEventListener("load", schedule, { signal, capture: true });
    document.addEventListener(
      "toggle",
      (event) => {
        const target = event.target;
        if (target instanceof HTMLDetailsElement && target.classList.contains("footnote-details") && !hasMargin()) {
          target.toggleAttribute("data-user-opened", target.open);
        }
        schedule();
      },
      { signal, capture: true }
    );
    document.addEventListener(
      "click",
      (event) => {
        const link = event.target instanceof Element ? event.target.closest(".reading-sticky-toc .toc-content a") : null;
        if (!wide.matches && link && toc?.contains(link)) {
          const tocHeader = toc.querySelector(".toc-header");
          if (tocHeader && !tocHeader.classList.contains("collapsed")) tocHeader.click();
        }
        const header = event.target instanceof Element ? event.target.closest(".toc-header, .backlinks-header") : null;
        if (wide.matches && header && !header.classList.contains("collapsed")) {
          for (const other of document.querySelectorAll(
            ".toc-header, .backlinks-header"
          )) {
            if (other !== header && !other.classList.contains("collapsed")) other.click();
          }
        }
        schedule();
      },
      { signal }
    );
    document.fonts.ready.then(schedule);
    document.fonts.addEventListener("loadingdone", schedule, { signal });
    schedule();
    disposePage = () => {
      if (disposed) return;
      disposed = true;
      if (frame !== void 0) cancelAnimationFrame(frame);
      listeners.abort();
      sizes.disconnect();
      changes.disconnect();
      modes.disconnect();
      if (toc && tocSlot?.isConnected) {
        tocSlot.after(toc);
        tocSlot.remove();
        toc.classList.remove("reading-sticky-toc");
      }
    };
  }
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", setupPage, { once: true });
  else setupPage();
  document.addEventListener("prenav", () => disposePage?.());
  document.addEventListener("nav", setupPage);
}

// index.ts
var Sidenotes = () => ({
  name: "Sidenotes",
  htmlPlugins: () => [],
  externalResources: () => ({
    js: [
      {
        script: `(${installSidenotes.toString()})()`,
        loadTime: "afterDOMReady",
        contentType: "inline"
      }
    ]
  })
});
var index_default = Sidenotes;
export {
  Sidenotes,
  index_default as default
};
