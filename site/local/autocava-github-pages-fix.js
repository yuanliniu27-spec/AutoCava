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

  function hydrateLazyImages(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll("img[data-src]").forEach(function (img) {
      var dataSrc = img.getAttribute("data-src");
      var currentSrc = img.getAttribute("src") || "";
      if (!dataSrc || currentSrc.indexOf("placeholder") === -1) return;
      img.setAttribute("src", dataSrc);
      if (!img.getAttribute("srcset")) {
        img.setAttribute("srcset", dataSrc + ":750x0 750w, " + dataSrc + ":1000x0 1000w");
      }
      img.setAttribute("loading", "eager");
      img.removeAttribute("data-error");
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
      '<path d="M10.9046 15.9356C10.1642 16.6046 9.0325 16.5983 8.29461 15.9266C3.65961 11.7236 0.599609 8.95161 0.599609 5.54961C0.599609 2.77761 2.77761 0.599609 5.54961 0.599609C7.11561 0.599609 8.61861 1.32861 9.59961 2.48061C10.5806 1.32861 12.0836 0.599609 13.6496 0.599609C16.4216 0.599609 18.5996 2.77761 18.5996 5.54961C18.5996 8.95161 15.5396 11.7236 10.9046 15.9356Z" fill="var(--autocava-fav-fill, #fff)" stroke="#222" stroke-width="1.2" stroke-linejoin="round"/>' +
      '</svg>';
  }

  function isSeriesPage() {
    return location.pathname.indexOf("/auto/series/") !== -1 || location.pathname.indexOf(GITHUB_BASE + "/auto/series/") !== -1;
  }

  function seriesIconSvg(name) {
    var icons = {
      back: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M15 5 8 12l7 7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
      home: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 10.8 12 4l8.5 6.8v8.7a1.5 1.5 0 0 1-1.5 1.5h-4.2v-5.7H9.2V21H5a1.5 1.5 0 0 1-1.5-1.5v-8.7Z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>',
      calculator: '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="5" y="3.8" width="14" height="16.4" rx="1.8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.2 8.2h4.4M10.4 6v4.4M15.2 8.2h2.2M8.2 14.8h3.2M14 13.5l3.1 3.1M17.1 13.5 14 16.6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
    };
    return icons[name] || "";
  }

  function normalizeSeriesFavoriteIcons() {
    if (!isSeriesPage()) return;
    document.querySelectorAll(".remove-fav-fly-source").forEach(function (source) {
      var button = source.closest("button,a") || source.parentElement;
      if (!button) return;
      button.classList.add("autocava-series-fav-button");
      button.setAttribute("aria-label", button.getAttribute("aria-label") || "Agregar a favoritos");
      source.classList.add("autocava-series-fav-source-fixed");
      source.innerHTML = favoriteSvg();
      var svg = source.querySelector("svg");
      if (svg) svg.classList.add("autocava-series-fav-icon");
    });
  }

  function findSeriesHeroFavoriteButton() {
    var source = document.querySelector(".remove-fav-fly-source");
    if (!source) return null;
    return source.closest("button,a") || source.parentElement || null;
  }

  function findSeriesActionBar() {
    var visitLinks = Array.prototype.slice.call(document.querySelectorAll('a[href*="/visit"]'));
    var candidates = [];
    visitLinks.forEach(function (link) {
      var node = link.parentElement;
      while (node && node !== document.body) {
        var text = (node.textContent || "").replace(/\s+/g, " ");
        if (text.indexOf("Prueba de manejo") !== -1) {
          var rect = node.getBoundingClientRect();
          if (rect.height > 36 && rect.height < 180 && rect.width > 220) {
            candidates.push({ node: node, area: rect.width * rect.height });
          }
        }
        node = node.parentElement;
      }
    });
    if (!candidates.length) {
      Array.prototype.slice.call(document.querySelectorAll("div")).forEach(function (node) {
        var text = (node.textContent || "").replace(/\s+/g, " ");
        if (text.indexOf("Prueba de manejo") === -1 || text.indexOf("Aplicar préstamo") === -1) return;
        var rect = node.getBoundingClientRect();
        var nearBottom = rect.bottom > window.innerHeight - 180 || rect.top > window.innerHeight - 180;
        if (nearBottom && rect.height > 36 && rect.height < 180 && rect.width > 220) {
          candidates.push({ node: node, area: rect.width * rect.height });
        }
      });
    }
    candidates.sort(function (a, b) { return a.area - b.area; });
    return candidates.length ? candidates[0].node : null;
  }

  function findSeriesActionBarFavoriteSlot(actionBar) {
    if (!actionBar) return null;
    var first = actionBar.firstElementChild;
    if (!first || first.classList.contains("autocava-series-fav-fallback")) return null;
    var text = (first.textContent || "").replace(/\s+/g, " ").trim();
    var rect = first.getBoundingClientRect();
    if (text === "" && rect.width >= 36 && rect.width <= 90 && rect.height >= 36 && rect.height <= 90) return first;
    return null;
  }

  function ensureSeriesFavoriteButton() {
    if (!isSeriesPage()) return;
    normalizeSeriesFavoriteIcons();
    var actionBar = findSeriesActionBar();
    var heroFavoriteButton = findSeriesHeroFavoriteButton();
    document.querySelectorAll("#__MStarApp > .autocava-series-fav-fallback").forEach(function (button) {
      if (window.matchMedia && window.matchMedia("(max-width: 767px)").matches && actionBar) {
        var slot = findSeriesActionBarFavoriteSlot(actionBar);
        if (slot) actionBar.replaceChild(button, slot);
        else actionBar.insertBefore(button, actionBar.firstElementChild);
      } else {
        button.remove();
      }
    });
    if (heroFavoriteButton) {
      heroFavoriteButton.classList.add("autocava-series-hero-fav-button");
    }
    if (!actionBar) return;
    actionBar.classList.add("autocava-series-actionbar");
    if (!actionBar.querySelector(".autocava-series-fav-fallback")) {
      var slot = findSeriesActionBarFavoriteSlot(actionBar);
      var button = slot || document.createElement("button");
      if (button.tagName === "BUTTON") button.type = "button";
      button.className = "autocava-series-fav-fallback autocava-series-fav-button";
      button.setAttribute("aria-label", "Agregar a favoritos");
      button.innerHTML = favoriteSvg();
      if (!button.parentElement) actionBar.insertBefore(button, actionBar.firstElementChild);
    }
  }

  function ensureSeriesCalculatorIcon() {
    if (!isSeriesPage()) return;
    Array.prototype.slice.call(document.querySelectorAll("a,button,div")).forEach(function (node) {
      var text = (node.textContent || "").replace(/\s+/g, " ").trim();
      if (text !== "Calculadora" || node.querySelector(".autocava-series-calculator-icon")) return;
      node.classList.add("autocava-series-calculator-card");
      var icon = document.createElement("span");
      icon.className = "autocava-series-calculator-icon";
      icon.innerHTML = seriesIconSvg("calculator");
      node.insertBefore(icon, node.firstChild);
    });
  }

  function ensureSeriesMobileHeader() {
    if (!isSeriesPage() || !window.matchMedia || !window.matchMedia("(max-width: 767px)").matches) return;
    var headerBox = document.querySelector("#page-header .page-header-box") ||
      document.querySelector("#page-header .h-14") ||
      document.querySelector("#page-header header");
    if (!headerBox || headerBox.querySelector(".autocava-series-header-left")) return;
    headerBox.classList.add("autocava-series-mobile-header");

    var left = document.createElement("span");
    left.className = "autocava-series-header-left";

    var back = document.createElement("button");
    back.type = "button";
    back.className = "autocava-series-header-icon";
    back.setAttribute("aria-label", "Volver");
    back.innerHTML = seriesIconSvg("back");
    back.addEventListener("click", function () {
      if (history.length > 1) history.back();
      else location.href = withBase("/");
    });

    var home = document.createElement("a");
    home.className = "autocava-series-header-icon";
    home.setAttribute("aria-label", "Inicio");
    home.href = withBase("/");
    home.innerHTML = seriesIconSvg("home");

    left.appendChild(back);
    left.appendChild(home);

    var fav = document.createElement("button");
    fav.type = "button";
    fav.className = "autocava-series-header-icon autocava-series-header-fav autocava-series-fav-button";
    fav.setAttribute("aria-label", "Agregar a favoritos");
    fav.innerHTML = favoriteSvg();

    headerBox.insertBefore(left, headerBox.firstChild);
    headerBox.appendChild(fav);
  }

  function bindSeriesFavoriteState() {
    if (document.documentElement.dataset.autocavaFavBound === "true") return;
    document.documentElement.dataset.autocavaFavBound = "true";
    document.addEventListener("click", function (event) {
      var button = event.target && event.target.closest && event.target.closest(".autocava-series-fav-button");
      if (!button) return;
      button.classList.toggle("autocava-fav-active");
    });
  }

  function bottomNavIcon(label) {
    var icons = {
      "Inicio": '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3.5 10.8 12 4l8.5 6.8v8.7a1.5 1.5 0 0 1-1.5 1.5h-4.2v-5.7H9.2V21H5a1.5 1.5 0 0 1-1.5-1.5v-8.7Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>',
      "Financiamiento": '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="4" y="5" width="16" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 9h10M7 13h5M15.5 13.5c1.25 0 2.25.75 2.25 1.7s-1 1.7-2.25 1.7-2.25-.75-2.25-1.7 1-1.7 2.25-1.7Z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
      "Autos": '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5.2 12.2 7 7.8A2 2 0 0 1 8.85 6.5h6.3A2 2 0 0 1 17 7.8l1.8 4.4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M4 12h16v5.2H4V12Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/><path d="M7 17.2v1.3M17 17.2v1.3" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="7.5" cy="14.7" r="1" fill="currentColor"/><circle cx="16.5" cy="14.7" r="1" fill="currentColor"/></svg>',
      "Mi cuenta": '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="3.2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M5.5 20c.8-3.4 3.2-5.2 6.5-5.2s5.7 1.8 6.5 5.2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>'
    };
    return icons[label] || "";
  }

  function findBottomNavRoot() {
    var labels = ["Inicio", "Financiamiento", "Autos"];
    var candidates = Array.prototype.slice.call(document.querySelectorAll("nav,footer,div"));
    return candidates.find(function (node) {
      var text = (node.textContent || "").replace(/\s+/g, " ");
      if (!labels.every(function (label) { return text.indexOf(label) !== -1; })) return false;
      if (text.indexOf("Mi cuenta") === -1 && text.indexOf("Mis favoritos") === -1) return false;
      var rect = node.getBoundingClientRect();
      var style = window.getComputedStyle ? window.getComputedStyle(node) : null;
      var nearBottom = rect.bottom > window.innerHeight - 140 && rect.top > window.innerHeight - 180;
      var fixedLike = style && (style.position === "fixed" || style.position === "sticky" || style.position === "absolute");
      return nearBottom && fixedLike && rect.height > 40 && rect.height < 150;
    });
  }

  function findBottomNavItem(nav, label) {
    var nodes = Array.prototype.slice.call(nav.querySelectorAll("a,button,div,span"));
    var exact = nodes.find(function (node) {
      return (node.textContent || "").replace(/\s+/g, " ").trim() === label;
    });
    var textNode = exact || nodes.find(function (node) {
      var text = (node.textContent || "").replace(/\s+/g, " ").trim();
      return text.indexOf(label) !== -1 && text.length <= label.length + 8;
    });
    if (!textNode) return null;
    return {
      item: textNode.closest("a,button") || textNode.parentElement || textNode,
      textNode: textNode
    };
  }

  function findBottomNavIconHost(item, textNode, label) {
    var node = textNode;
    while (node && node !== item) {
      if (node.nodeType === 1) {
        var text = (node.textContent || "").replace(/\s+/g, " ").trim();
        if (text === label || (text.indexOf(label) !== -1 && text.length <= label.length + 8)) {
          return node;
        }
      }
      node = node.parentElement;
    }
    return item;
  }

  function ensureBottomNavIcons() {
    if (!window.matchMedia || !window.matchMedia("(max-width: 767px)").matches) return;
    var nav = findBottomNavRoot();
    if (!nav) return;
    nav.classList.add("autocava-bottom-nav-fixed");
    ["Inicio", "Financiamiento", "Autos", "Mi cuenta"].forEach(function (label) {
      var found = findBottomNavItem(nav, label);
      if (!found || !found.item) return;
      var item = found.item;
      var iconHost = findBottomNavIconHost(item, found.textNode, label);
      item.classList.add("autocava-bottom-nav-item");
      item.dataset.autocavaBottomLabel = label;
      iconHost.classList.add("autocava-bottom-nav-pill");
      item.querySelectorAll("svg:not(.autocava-bottom-nav-svg),img:not(.autocava-bottom-nav-img)").forEach(function (oldIcon) {
        oldIcon.classList.add("autocava-bottom-nav-native-icon");
      });
      var icon = item.querySelector(".autocava-bottom-nav-icon");
      if (!icon) {
        icon = document.createElement("span");
        icon.className = "autocava-bottom-nav-icon";
      }
      icon.innerHTML = bottomNavIcon(label);
      if (icon.parentElement !== iconHost) {
        iconHost.insertBefore(icon, iconHost.firstChild);
      }
    });
  }

  function applyFixes(root) {
    fixStaticUrls(root);
    hydrateLazyImages(root);
    ensureSeriesFavoriteButton();
    ensureSeriesCalculatorIcon();
    ensureSeriesMobileHeader();
    bindSeriesFavoriteState();
    ensureBottomNavIcons();
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
