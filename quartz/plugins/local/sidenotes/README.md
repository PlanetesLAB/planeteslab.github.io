# Reading notes and shared presentation

The approved reading scheme is in `quartz/styles/reading.scss`, included from
`custom.scss`. It uses the existing Work Sans body and Zalando Sans Expanded
headings. Draft uses a faded header grid, Review uses faded dots, Writing a blue
wash, and ordinary live pages remain neutral. The custom 404 is excluded.

This local plugin supplies footnote disclosures and the shared desktop margin
for short notes. Quartz's Markdown parser, callout DOM, and fold listeners remain
unchanged. Notes stay in source order; narrow screens and reader mode use inline
content. Long, nested, media, table, code, and display-math callouts stay inline.

One layout controller positions visible notes relative to their text and keeps
them clear of one another and the footer. Desktop navigation lists overlay the
margin; only their fixed headers reserve space. Opening a list therefore does
not move notes. The TOC stays sticky while reading: below 1200px the original
Quartz component moves above the article, or directly after the paper metadata
and CoCERI summary when an article review includes one. Backlinks stays after the
content. On desktop the TOC returns to its stretched right rail. A stationary rail slot reserves
its initial position, so clicking the sticky menu after scrolling cannot push
notes away from their text. Lists overlay content rather than expanding the page.
Narrow wrappers use horizontal clipping so they do not trap sticky positioning.
Selecting a heading closes the narrow dropdown before the native hash navigation;
its heading targets keep enough scroll offset to clear the collapsed pill.

Resize, theme, disclosure, image, and font changes recalculate positions. Observers
and listeners are disposed when navigation replaces a page; the original TOC is
restored before Quartz's SPA morph. No component, heading, or link is cloned.

Rebuild this local plugin after editing its source:

```sh
npm --prefix quartz/plugins/local/sidenotes run build
```

Then use the normal Quartz build or development server. The generated
`dist/index.js` is tracked because the plugin loader reads the package entry.
There is no separate design-preview script, route, or content fixture.

Journal logo sizing is controlled by the `$widths` map in
`quartz/styles/journal-logos.scss`. Set a filename to a CSS width such as `300px`;
the shared height cap is then removed and the image keeps its proportions.
`null` retains the current default. No Markdown or paper-preview changes are needed.
