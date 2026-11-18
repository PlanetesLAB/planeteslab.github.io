# Automatic review URLs

This local transformer computes short URLs during each build. It does not write
`permalink` properties, rename notes, maintain a registry, or modify Quartz core.
New reviews work automatically when placed under `content/reviews/`.

For example, the long Gomez’s Hamburger review is published at:

```text
/reviews/alma-view-edge-gomez-hamburger-system-aea566
```

The rule takes up to six meaningful words from the filename (at most 48
characters), cleans punctuation and accents, and adds a short DOI identifier.
Long DOI identifiers or absent DOIs use a ten-character SHA-256 digest. File
paths, explicit permalinks, and aliases are reserved before resolving collisions.
No AI calls or external shortening service are used.

The full display title and the source file remain intact. Display-title edits do
not change the generated URL because its description comes from the filename.
Renaming the file or changing its DOI recomputes its address; add an old short
address to `aliases` if it must survive that change. Any explicit `permalink`
continues to override generation; an empty property opts out. Folder landing
notes (`index.md` and folder-name notes such as `reviews.md`) are excluded.

The plugin initializes its address map through the normal `markdownPlugins`
and `htmlPlugins` factories in each parser worker. It scans current input files
on each build, including newly added notes during watch rebuilds. It sets only
in-memory page data and the link-resolution map. Keep its order at 6, after the
legacy note-properties transformer at 5, so original-path redirects are retained
and self aliases are removed. The existing alias-redirects plugin emits redirects
from the original long filename URLs. Lists, search, and sitemap use the short
addresses as the actual page addresses.

Rebuild the tracked package entry after source edits:

```sh
npm --prefix quartz/plugins/local/review-permalinks run build
```

Run the focused checks from the repository root:

```sh
node --import tsx --test quartz/plugins/local/review-permalinks/index.test.ts
```

Disable its entry in `quartz.config.yaml` to return to ordinary filename URLs.
