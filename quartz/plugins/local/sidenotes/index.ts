import type { QuartzTransformerPlugin } from "@quartz-community/types"
import { installSidenotes } from "./sidenotes.inline"

export const Sidenotes: QuartzTransformerPlugin = () => ({
  name: "Sidenotes",
  htmlPlugins: () => [],
  externalResources: () => ({
    js: [
      {
        script: `(${installSidenotes.toString()})()`,
        loadTime: "afterDOMReady",
        contentType: "inline",
      },
    ],
  }),
})

export default Sidenotes
