// index.ts
var htmlEntities = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" };
function escapeHtml(value) {
  return value.replace(/[&<>"]/g, (char) => htmlEntities[char]);
}
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
              const bibliography = file.data.bibliographyReview;
              const manualAuthors = frontmatter?.authors;
              const authors = Array.isArray(manualAuthors) && manualAuthors.length > 0 ? manualAuthors : bibliography?.authors;
              const volume = frontmatter?.volume || (bibliography?.volume ? `Vol. ${bibliography.volume}` : "");
              const issue = frontmatter?.issue || (bibliography?.issue ? `Issue ${bibliography.issue}` : "");
              const volumeIssue = [volume, issue].filter(Boolean).join(", ");
              const published = frontmatter?.published || bibliography?.published || "";
              const doi = typeof frontmatter?.doi === "string" ? frontmatter.doi.trim().replace(/^https?:\/\/(?:dx\.)?doi\.org\/|^doi:\s*/i, "") : "";
              const journalLogoValue = frontmatter?.journal_logo || "";
              const journalLogo = journalLogoValue === "oja" ? "/images/assets/ojap-light.svg" : journalLogoValue;
              const headerTag = doi ? "a" : "div";
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
                authorsHTML = `<div class="authors-list">${escapeHtml(authorNames.join(", "))}</div>`;
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
                    <${headerTag} class="paper-preview${doi ? " paper-preview-link" : ""}"${doi ? ` href="https://doi.org/${escapeHtml(doi)}" target="_blank" rel="noopener noreferrer"` : ""}>
                      ${journalLogo ? `
                      <div class="journal-logo">
                        <img src="${journalLogo}" alt="Journal Logo">
                      </div>` : ""}
                      
                      ${authorsHTML}
                      
                      ${volumeIssue || published ? `
                      <div class="metadata">
                        <div class="metadata-row">
                          ${volumeIssue ? `
                          <div class="metadata-item">
                            <span class="metadata-label">Volume/Issue:</span>
                            <span class="metadata-value">${escapeHtml(volumeIssue)}</span>
                          </div>` : ""}
                          ${published ? `
                          <div class="metadata-item">
                            <span class="metadata-label">Published:</span>
                            <span class="metadata-value">${escapeHtml(String(published))}</span>
                          </div>` : ""}
                        </div>
                      </div>` : ""}
                    </${headerTag}>
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
