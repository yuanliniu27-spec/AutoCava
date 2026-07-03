(function () {
  var GITHUB_BASE = "/AutoCava";
  var isGithubPages = location.hostname.indexOf("github.io") !== -1 && location.pathname.indexOf(GITHUB_BASE) === 0;
  var messagesPromise = null;
  var pending = 0;

  function withBase(path) {
    if (!isGithubPages || !path || path.indexOf("/") !== 0 || path.indexOf(GITHUB_BASE + "/") === 0) return path;
    if (/^\/(api|car|user|activity|live|rank|brand|city|series|model|loan|clue|pk|placement|i18n|_nuxt_icon)\//.test(path)) {
      return path;
    }
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

  function applyFixes(root) {
    fixStaticUrls(root);
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
    document.addEventListener("DOMContentLoaded", function () {
      applyFixes(document);
    }, { once: true });
  } else {
    applyFixes(document);
  }

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
