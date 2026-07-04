(function () {
  var GITHUB_BASE = "/AutoCava";
  var isGithubPages = location.hostname.indexOf("github.io") !== -1 && location.pathname.indexOf(GITHUB_BASE) === 0;
  var messagesPromise = null;
  var pending = 0;

  function applyMobileMode() {
    var isMobile = window.matchMedia && window.matchMedia("(max-width: 767px)").matches;
    document.documentElement.classList.toggle("desktop", !isMobile);
    document.documentElement.classList.toggle("mobile", !!isMobile);
    document.documentElement.dataset.autocavaViewport = isMobile ? "mobile" : "desktop";
  }

  function withBase(path) {
    if (!isGithubPages || !path || path.indexOf("/") !== 0 || path.indexOf(GITHUB_BASE + "/") === 0) return path;
    return GITHUB_BASE + path;
  }

  function fixUrlAttribute(node, attr) {
    if (!node || !node.getAttribute) return;
    var value = node.getAttribute(attr);
    if (!value || value.indexOf("/") !== 0) return;
    var next = withBase(value);
    if (next !== value) node.setAttribute(attr, next);
  }

  function fixSrcset(value) {
    if (!isGithubPages || !value) return value;
    return value.replace(/(^|,\s*)\/site\//g, "$1" + GITHUB_BASE + "/site/");
  }

  function fixStaticUrls(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll("img[src],script[src],link[href],a[href]").forEach(function (node) {
      fixUrlAttribute(node, node.tagName === "LINK" || node.tagName === "A" ? "href" : "src");
    });
    scope.querySelectorAll("img[srcset],source[srcset]").forEach(function (node) {
      var value = node.getAttribute("srcset");
      var next = fixSrcset(value);
      if (next !== value) node.setAttribute("srcset", next);
    });
    scope.querySelectorAll("link[imagesrcset]").forEach(function (node) {
      var value = node.getAttribute("imagesrcset");
      var next = fixSrcset(value);
      if (next !== value) node.setAttribute("imagesrcset", next);
    });
  }

  function flattenMessages(input, prefix, output) {
    Object.keys(input || {}).forEach(function (key) {
      var value = input[key];
      var nextKey = prefix ? prefix + "." + key : key;
      if (value && typeof value === "object" && !Array.isArray(value)) {
        flattenMessages(value, nextKey, output);
      } else if (typeof value === "string") {
        output[nextKey] = value;
      }
    });
    return output;
  }

  function loadMessages() {
    if (messagesPromise) return messagesPromise;
    messagesPromise = fetch("_i18n/TYa7t2dE/es/messages.json")
      .then(function (response) {
        return response.ok ? response.json() : {};
      })
      .then(function (json) {
        return flattenMessages(json.es || json, "", {});
      })
      .catch(function () {
        return {};
      });
    return messagesPromise;
  }

  function replaceTextNodes(root, messages) {
    if (!root || !messages || !Object.keys(messages).length) return;
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var nodes = [];
    var node;
    while ((node = walker.nextNode())) nodes.push(node);
    nodes.forEach(function (textNode) {
      var raw = textNode.nodeValue || "";
      var trimmed = raw.trim();
      if (!/^(pages|common|components|form|loan|city)\./.test(trimmed)) return;
      var suffix = trimmed.slice(-1) === ":" ? ":" : "";
      var key = suffix ? trimmed.slice(0, -1) : trimmed;
      var translated = messages[key];
      if (!translated) return;
      textNode.nodeValue = raw.replace(trimmed, translated + suffix);
    });
  }

  function favoriteSvg() {
    return '<svg viewBox="0 0 20 18" aria-hidden="true" focusable="false">' +
      '<path d="M10.9046 15.9356C10.1642 16.6046 9.0325 16.5983 8.29461 15.9266C3.65961 11.7236 0.599609 8.95161 0.599609 5.54961C0.599609 2.77761 2.77761 0.599609 5.54961 0.599609C7.11561 0.599609 8.61861 1.32861 9.59961 2.48061C10.5806 1.32861 12.0836 0.599609 13.6496 0.599609C16.4216 0.599609 18.5996 2.77761 18.5996 5.54961C18.5996 8.95161 15.5396 11.7236 10.9046 15.9356Z" fill="none" stroke="#222" stroke-width="1.2" stroke-linejoin="round"/>' +
      '</svg>';
  }

  function ensureSeriesFavoriteButton() {
    if (location.pathname.indexOf("/auto/series/") === -1 && location.pathname.indexOf(GITHUB_BASE + "/auto/series/") === -1) return;
    var bars = Array.prototype.slice.call(document.querySelectorAll("div"));
    var actionBar = bars.find(function (bar) {
      return bar.textContent && bar.textContent.indexOf("Prueba de manejo") !== -1 && bar.querySelector('a[href*="/visit"]');
    });
    if (!actionBar) return;
    actionBar.classList.add("autocava-series-actionbar");
    if (!actionBar.querySelector(".autocava-series-fav-fallback")) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "autocava-series-fav-fallback";
      button.setAttribute("aria-label", "Mis favoritos");
      button.innerHTML = favoriteSvg();
      actionBar.insertBefore(button, actionBar.firstElementChild);
    }
  }

  function applyFixes(root) {
    fixStaticUrls(root);
    ensureSeriesFavoriteButton();
    loadMessages().then(function (messages) {
      replaceTextNodes(document.body, messages);
    });
  }

  function schedule(root) {
    window.clearTimeout(pending);
    pending = window.setTimeout(function () {
      applyFixes(root || document);
    }, 50);
  }

  if (document.readyState === "loading") {
    applyMobileMode();
    document.addEventListener("DOMContentLoaded", function () {
      applyMobileMode();
      applyFixes(document);
    }, { once: true });
  } else {
    applyMobileMode();
    applyFixes(document);
  }

  window.addEventListener("resize", applyMobileMode, { passive: true });

  new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.type === "childList") schedule(mutation.target);
      if (mutation.type === "attributes") schedule(mutation.target.parentNode || document);
      if (mutation.type === "characterData") schedule(document);
    });
  }).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    characterData: true,
    attributeFilter: ["src", "href", "srcset", "imagesrcset"]
  });

  window.setTimeout(function () { applyFixes(document); }, 500);
  window.setTimeout(function () { applyFixes(document); }, 1500);
  window.setTimeout(function () { applyFixes(document); }, 3500);
})();
