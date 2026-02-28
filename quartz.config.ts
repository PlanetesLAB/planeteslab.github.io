import { QuartzConfig } from "./quartz/cfg";
import * as Plugin from "./quartz/plugins";

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
          light: "#eff1f5",       // Base - main background
          lightgray: "#e6e9ef",   // Mantle - elevated surfaces, cards
          gray: "#5c5f77",        // Overlay0 - much stronger contrast for secondary text
          darkgray: "#4c4f69",    // Text - main readable text (keep this strong)
          dark: "#1e1e2e",        // Crust - highest contrast for important text
          secondary: "#1e66f5",   // Blue - primary accent color
          tertiary: "#fab387",    // Green - supporting accent color  
          highlight: "rgba(30, 102, 245, 0.12)", // Blue with reduced opacity
          textHighlight: "rgba(220, 138, 120, 0.25)", // Rosewater for text highlights
        },
        darkMode: {
          light: "#11111b",        // Crust - deepest background
          lightgray: "#1e1e2e",    // Base - elevated surfaces, cards  
          gray: "#313244",         // Surface0 - borders, subtle dividers
          darkgray: "#9399b2",     // Overlay2 - muted text, placeholders
          dark: "#cdd6f4",         // Text - main readable text
          secondary: "#89b4fa",    // Blue - primary accent color
          tertiary: "#fab387",     // Teal - supporting accent color
          highlight: "rgba(6, 18, 39, 0.08)", // Blue with lower opacity for hover/selection
          textHighlight: "rgba(249, 226, 175, 0.20)", // Peach tint for text highlights
        },

      },
    },
  },
  plugins: {
    transformers: [
      Plugin.FrontMatter(),
      // Plugin.CreatedModifiedDate({
      //   priority: ["filesystem", "git", "frontmatter"],
      // }),
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
      // Plugin.FootnotesToReferences(),
      Plugin.PaperPreviewInjector(),
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
