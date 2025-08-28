import { QuartzConfig } from "./quartz/cfg";
import * as Plugin from "./quartz/plugins";
import renameFootnotesHeading from './quartz/plugins/rename-footnotes-heading';

/**
 * Quartz 4 Configuration
 *
 * See https://quartz.jzhao.xyz/configuration for more information.
 */
const config: QuartzConfig = {
  configuration: {
    pageTitle: "Research Notes",
    pageTitleSuffix: "",
    enableSPA: true,
    enablePopovers: true,
    analytics: {
      provider: "plausible",
    },
    locale: "en-US",
    baseUrl: "kmaitreys.github.io/notes",
    ignorePatterns: ["private", "templates", ".obsidian"],
    defaultDateType: "modified",
    theme: {
      fontOrigin: "googleFonts",
      cdnCaching: true,
      typography: {
        header: "IBM Plex Sans",
        body: "IBM Plex Sans",
        code: "JetBrains Mono",
      },
      colors: {
        lightMode: {
          light: "#eff1f5",       // Base
          lightgray: "#ccd0da",   // Surface1
          gray: "#9ca0b0",        // Overlay1
          darkgray: "#4c4f69",    // Text
          dark: "#1e1e2e",        // Mantle (darkest in Latte)
          secondary: "#1e66f5",   // Blue
          tertiary: "#40a02b",    // Green
          highlight: "rgba(30, 102, 245, 0.15)", // Blue @ 15% opacity
          textHighlight: "#dc8a78aa", // Rosewater with alpha
        },
        darkMode: {
          light: "#11111b",        // Crust - deepest background
          lightgray: "#1e1e2e",    // Base - elevated surfaces, cards  
          gray: "#313244",         // Surface0 - borders, subtle dividers
          darkgray: "#9399b2",     // Overlay2 - muted text, placeholders
          dark: "#cdd6f4",         // Text - main readable text
          secondary: "#89b4fa",    // Blue - primary accent color
          tertiary: "#94e2d5",     // Teal - supporting accent color
          highlight: "rgba(6, 18, 39, 0.08)", // Blue with lower opacity for hover/selection
          textHighlight: "rgba(249, 226, 175, 0.20)", // Peach tint for text highlights
        },

      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      Plugin.CreatedModifiedDate({
        priority: ["filesystem", "git", "frontmatter"],
      }),
      Plugin.SyntaxHighlighting({
        theme: {
          light: "github-light",
          dark: "github-dark",
        },
        keepBackground: false,
      }),
      Plugin.ObsidianFlavoredMarkdown({ enableInHtmlEmbed: true, wikilinks: true }),
      Plugin.GitHubFlavoredMarkdown(),
      Plugin.TableOfContents(),
      Plugin.CrawlLinks({ markdownLinkResolution: "shortest", prettyLinks: true }),
      Plugin.Description(),
      Plugin.Latex({ renderEngine: "mathjax" }),
      Plugin.Citations({
        linkCitations: true,
      }),
      renameFootnotesHeading(),
    ],
    filters: [Plugin.RemoveDrafts()],
    emitters: [
      Plugin.AliasRedirects(),
      Plugin.ComponentResources(),
      Plugin.ContentPage(),
      Plugin.FolderPage(),
      Plugin.TagPage(),
      Plugin.ContentIndex({
        enableSiteMap: true,
        enableRSS: true,
      }),
      Plugin.Assets(),
      Plugin.Static(),
      Plugin.Favicon(),
      Plugin.NotFoundPage(),
      // Comment out CustomOgImages to speed up build time
      Plugin.CustomOgImages(),
    ],

  },
}

export default config
