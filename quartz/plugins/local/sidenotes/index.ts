import type { QuartzTransformerPlugin } from "@quartz-community/types"

const footnoteScript = `
(function () {
  function initFootnotes() {
    var footnotesContainer = document.querySelector('section[data-footnotes], .footnotes');
    if (!footnotesContainer) return;

    var footnoteItems = footnotesContainer.querySelectorAll('li[id]');
    if (!footnoteItems.length) return;

    var footnoteMap = {};
    footnoteItems.forEach(function (item) {
      var rawId = item.id;
      var fnId = rawId.replace(/^(user-content-)?fn[:-]?/, '');
      var clone = item.cloneNode(true);

      var backlinks = clone.querySelectorAll('.footnote-backref, [data-footnote-backref], a[href^="#user-content-fnref"], a[href^="#fnref"]');
      backlinks.forEach(function (el) { el.remove(); });

      var html = clone.innerHTML.trim();
      html = html.replace(/^<p>(.*?)<\\/p>$/is, '$1');
      footnoteMap[fnId] = html;
      footnoteMap[rawId] = html;
    });

    var isDesktop = window.innerWidth >= 1200;

    var fnRefs = document.querySelectorAll('sup[id*="fnref"], a[data-footnote-ref], sup:has(a[href*="#fn"]), sup:has(a[href*="#user-content-fn"])');

    fnRefs.forEach(function (refNode) {
      if (refNode.closest('.footnote-details')) return;

      var fnId = '';
      var targetNode = refNode;

      if (refNode.id && refNode.id.includes('fnref')) {
        fnId = refNode.id.replace(/^(user-content-)?fnref[:-]?/, '');
      } else {
        const link = refNode.tagName === 'A' ? refNode : refNode.querySelector('a');
        if (link && link.getAttribute('href')) {
          var href = link.getAttribute('href') || '';
          fnId = href.replace(/^#(user-content-)?fn[:-]?/, '');
        } else {
          fnId = refNode.textContent ? refNode.textContent.trim() : '';
        }
      }

      var content = footnoteMap[fnId] || footnoteMap['user-content-fn-' + fnId] || footnoteMap['fn-' + fnId] || footnoteMap['fn:' + fnId];

      if (content) {
        if (refNode.tagName === 'A' && refNode.parentElement && refNode.parentElement.tagName === 'SUP') {
          targetNode = refNode.parentElement;
        }

        var details = document.createElement('details');
        details.className = 'footnote-details';
        if (isDesktop) {
          details.setAttribute('open', '');
        }

        var summary = document.createElement('summary');
        summary.className = 'footnote-summary';
        summary.setAttribute('title', 'Toggle footnote');
        summary.setAttribute('aria-label', 'Footnote ' + fnId);
        summary.innerHTML = '<sup class="footnote-ref-num">' + fnId + '</sup>';

        var body = document.createElement('span');
        body.className = 'footnote-body';
        body.innerHTML = '<sup class="footnote-num">' + fnId + '</sup> ' + content;

        details.appendChild(summary);
        details.appendChild(body);

        if (targetNode.parentNode) {
          targetNode.parentNode.replaceChild(details, targetNode);
        }
      }
    });

    footnotesContainer.style.display = 'none';
  }

  function syncFootnotesState() {
    var isDesktop = window.innerWidth >= 1200;
    var allDetails = document.querySelectorAll('details.footnote-details');
    allDetails.forEach(function (d) {
      if (isDesktop) {
        d.setAttribute('open', '');
      } else {
        if (!d.hasAttribute('data-user-opened')) {
          d.removeAttribute('open');
        }
      }
    });
  }

  function adjustMarginElements() {
    var container = document.querySelector('article') || document.querySelector('.center');
    if (!container) return;

    if (window.innerWidth < 1200) {
      var fnBodies = container.querySelectorAll('.footnote-body');
      fnBodies.forEach(function (el) { el.style.top = ''; });
      return;
    }

    var pageTop = window.scrollY || document.documentElement.scrollTop || 0;
    var containerRect = container.getBoundingClientRect();
    var containerAbsoluteTop = containerRect.top + pageTop;

    var rightElements = Array.from(container.querySelectorAll('details.footnote-details[open] > .footnote-body'));
    if (!rightElements.length) return;

    rightElements.forEach(function (el) { el.style.top = ''; });
    rightElements.sort(function (a, b) {
      var aParent = a.parentElement || a;
      var bParent = b.parentElement || b;
      return aParent.getBoundingClientRect().top - bParent.getBoundingClientRect().top;
    });

    var prevRightBottom = 0;
    var gap = 16;

    var isReaderMode = document.documentElement.getAttribute('reader-mode') === 'on';
    if (!isReaderMode) {
      var sidebarElements = document.querySelectorAll('.sidebar.right .toc, .sidebar.right .backlinks');
      sidebarElements.forEach(function (el) {
        if (el && window.getComputedStyle(el).display !== 'none') {
          var elRect = el.getBoundingClientRect();
          var elBottomRelative = (elRect.bottom + pageTop) - containerAbsoluteTop;
          if (elBottomRelative > prevRightBottom) {
            prevRightBottom = elBottomRelative + gap;
          }
        }
      });
    }

    rightElements.forEach(function (el) {
      var parentRect = (el.parentElement || el).getBoundingClientRect();
      var parentAbsoluteTop = parentRect.top + pageTop;
      var naturalTop = parentAbsoluteTop - containerAbsoluteTop;
      var height = el.offsetHeight || el.getBoundingClientRect().height || 40;

      var actualTop = naturalTop;
      if (actualTop < prevRightBottom) {
        actualTop = prevRightBottom;
      }

      el.style.top = actualTop + 'px';
      prevRightBottom = actualTop + height + gap;
    });
  }

  function setupTocAccordion() {
    var tocs = document.querySelectorAll('.toc');
    tocs.forEach(function (toc) {
      var header = toc.querySelector('.toc-header');
      var content = toc.querySelector('.toc-content');
      if (header && content && !header.classList.contains('collapsed')) {
        header.classList.add('collapsed');
        content.classList.add('collapsed');
        header.setAttribute('aria-expanded', 'false');
      }
    });
  }

  function setupBacklinksAccordion() {
    var backlinksList = document.querySelectorAll('.backlinks');
    backlinksList.forEach(function (bl) {
      if (bl.querySelector('.backlinks-header')) return;
      var h3 = bl.querySelector('h3');
      var ul = bl.querySelector('ul');
      if (!h3 || !ul) return;

      var items = ul.querySelectorAll('li:not(.overflow-end)');
      var count = items.length;
      var isEmpty = count === 0 || (count === 1 && items[0].textContent.toLowerCase().includes('no backlinks'));

      var headerBtn = document.createElement('button');
      headerBtn.className = 'backlinks-header collapsed';
      headerBtn.type = 'button';
      headerBtn.setAttribute('aria-expanded', 'false');
      headerBtn.innerHTML = '<h3>Backlinks</h3><div style="display:flex;align-items:center;gap:0.4rem;">' +
        (!isEmpty ? '<span class="backlinks-count">' + count + '</span>' : '') +
        '<svg class="fold" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg></div>';

      if (h3.parentNode) {
        h3.parentNode.replaceChild(headerBtn, h3);
      }
      ul.classList.add('backlinks-content', 'collapsed');

      headerBtn.addEventListener('click', function (e) {
        e.preventDefault();
        var isCollapsed = headerBtn.classList.contains('collapsed');
        if (isCollapsed) {
          headerBtn.classList.remove('collapsed');
          headerBtn.setAttribute('aria-expanded', 'true');
          ul.classList.remove('collapsed');
        } else {
          headerBtn.classList.add('collapsed');
          headerBtn.setAttribute('aria-expanded', 'false');
          ul.classList.add('collapsed');
        }
        setTimeout(adjustMarginElements, 30);
        setTimeout(adjustMarginElements, 200);
      });
    });
  }

  function setupAll() {
    initFootnotes();
    syncFootnotesState();
    adjustMarginElements();
    setupTocAccordion();
    setupBacklinksAccordion();
    setTimeout(adjustMarginElements, 100);
    setTimeout(adjustMarginElements, 300);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupAll);
  } else {
    setupAll();
  }

  window.addEventListener('load', function () {
    syncFootnotesState();
    adjustMarginElements();
  });

  window.addEventListener('resize', function () {
    syncFootnotesState();
    adjustMarginElements();
  });

  document.addEventListener('nav', setupAll);

  document.addEventListener('toggle', function (e) {
    if (e.target && e.target.classList && e.target.classList.contains('footnote-details')) {
      if (window.innerWidth < 1200) {
        if (e.target.open) {
          e.target.setAttribute('data-user-opened', 'true');
        } else {
          e.target.removeAttribute('data-user-opened');
        }
      }
      adjustMarginElements();
    }
  }, true);

  // Recalculate margins when TOC is clicked
  document.addEventListener('click', function (e) {
    if (e.target && e.target.closest('.toc-header')) {
      setTimeout(adjustMarginElements, 30);
      setTimeout(adjustMarginElements, 200);
    }
  });

  var observer = new MutationObserver(function () {
    adjustMarginElements();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['reader-mode'] });
})();
`

export const Sidenotes: QuartzTransformerPlugin = () => {
  return {
    name: "Sidenotes",
    htmlPlugins() {
      return []
    },
    externalResources() {
      return {
        js: [
          {
            script: footnoteScript,
            loadTime: "afterDOMReady",
            contentType: "inline",
          },
        ],
      }
    },
  }
}

export default Sidenotes
