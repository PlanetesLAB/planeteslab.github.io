# Local 404 page

`quartz.ts` selects this body component for the built-in `404` page type. It adds the
55 Cancri artwork as a full-page background, fading into the site theme at the edges.
It styles Quartz's original 404 component, retaining its
localized message, home link, and case-correction redirect. No upstream files are
modified.

The "I'm feeling lucky" link appears before the home link and selects a random
published Markdown entry on each click. Its destinations come from the filtered
build content, excluding home, section indexes, and tag listings. It also has a
working entry link before JavaScript loads, and honors the site's base path.

Styles are rendered only on this page and scoped to `.not-found-page`. To restore
the default page, remove the `LostInSpace` import and page-type override from
`quartz.ts`.
