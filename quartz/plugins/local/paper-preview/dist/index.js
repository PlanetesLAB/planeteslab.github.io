// index.ts
var PaperPreviewInjector = () => {
  return {
    name: "PaperPreviewInjector",
    markdownPlugins() {
      return [
        () => {
          return (tree, file) => {
            const frontmatter = file.data.frontmatter;
            const tags = frontmatter?.tags || [];
            const hasReviewTag = tags.some(
              (tag) => tag.toLowerCase() === "review" || tag.toLowerCase() === "#review"
            );
            if (hasReviewTag) {
              const authors = frontmatter?.authors || [];
              const volume = frontmatter?.volume || "";
              const issue = frontmatter?.issue || "";
              const published = frontmatter?.published || "";
              const doi = frontmatter?.doi || "";
              const journalLogo = frontmatter?.journal_logo || "";
              const coceriEntries = [
                { key: "Co", label: "Context", slug: "co" },
                { key: "C", label: "Claim", slug: "c" },
                { key: "E", label: "Evidence", slug: "e" },
                { key: "R", label: "Reasoning", slug: "r" },
                { key: "I", label: "Implications", slug: "i" }
              ];
              let authorsHTML = "";
              if (Array.isArray(authors) && authors.length > 0) {
                const authorNames = authors.map((author) => {
                  return typeof author === "string" ? author : author.name || author;
                });
                authorsHTML = `<div class="authors-list">${authorNames.join(", ")}</div>`;
              }
              const coceriRows = [];
              for (const entry of coceriEntries) {
                const raw = frontmatter?.[entry.key];
                const value = Array.isArray(raw) ? raw.join("\n") : raw;
                if (value) {
                  coceriRows.push(`
                    <tr class="coceri-row" data-entry="${entry.slug}">
                      <td class="coceri-label">${entry.label}</td>
                      <td class="coceri-value">${value}</td>
                    </tr>`);
                }
              }
              let coceriHTML = "";
              if (coceriRows.length > 0) {
                coceriHTML = `
                  <div class="coceri-section">
                    <table class="coceri-table"><tbody>${coceriRows.join("")}</tbody></table>
                  </div>`;
              }
              tree.children.unshift({
                type: "html",
                value: `
                  <div class="paper-preview-container">
                    <div class="paper-preview">
                      ${journalLogo ? `
                      <div class="journal-logo">
                        <img src="${journalLogo}" alt="Journal Logo">
                      </div>` : ""}
                      
                      ${authorsHTML}
                      
                      ${volume || issue || published || doi ? `
                      <div class="metadata">
                        ${volume || issue || published ? `
                        <div class="metadata-row">
                          ${volume || issue ? `
                          <div class="metadata-item">
                            <span class="metadata-label">Volume/Issue:</span>
                            <span class="metadata-value">${volume}${issue ? ", " + issue : ""}</span>
                          </div>` : ""}
                          ${published ? `
                          <div class="metadata-item">
                            <span class="metadata-label">Published:</span>
                            <span class="metadata-value">${published}</span>
                          </div>` : ""}
                        </div>` : ""}
                        ${doi ? `
                        <div class="metadata-row">
                          <div class="metadata-item">
                            <span class="metadata-label">DOI:</span>
                            <span class="metadata-value">
                              <a href="https://doi.org/${doi}" target="_blank">${doi}</a>
                            </span>
                          </div>
                        </div>` : ""}
                      </div>` : ""}
                    </div>
                    ${coceriHTML}
                  </div>
                `
              });
            }
          };
        }
      ];
    }
  };
};
var index_default = PaperPreviewInjector;
export {
  PaperPreviewInjector,
  index_default as default
};
