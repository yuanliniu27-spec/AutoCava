(function () {
  if (window.__autocavaApiBridgeInstalled) return;
  window.__autocavaApiBridgeInstalled = true;

  var API_ORIGIN = "https://api.autocava.com.mx";
  var DEMO_ORIGIN = "https://demo.autocava.com.mx";
  var GITHUB_BASE = "/AutoCava";
  var API_ROOTS = /^(api|car|news|user|activity|quotes|dealer|i18n|_nuxt_icon)(\/|$)/;
  var API_PATH = /^\/(api|car|news|user|activity|quotes|dealer|i18n|_nuxt_icon)(\/|$)/;

  function stripGithubBase(path) {
    if (path === GITHUB_BASE) return "/";
    if (path.indexOf(GITHUB_BASE + "/") === 0) return path.slice(GITHUB_BASE.length) || "/";
    return path;
  }

  function normalizeApiPath(path) {
    path = stripGithubBase(path || "");
    if (path.indexOf("/api/") === 0) path = path.slice(4);
    if (path === "/api") return "";
    return API_PATH.test(path) ? path : "";
  }

  function rewriteUrl(input) {
    if (!input) return "";

    var raw = "";
    if (typeof input === "string") raw = input;
    else if (typeof URL !== "undefined" && input instanceof URL) raw = input.href;
    else if (typeof Request !== "undefined" && input instanceof Request) raw = input.url;
    else return "";

    if (!raw) return "";

    if (raw.charAt(0) !== "/" && !/^[a-z][a-z0-9+.-]*:/i.test(raw) && API_ROOTS.test(raw)) {
      return API_ORIGIN + normalizeApiPath("/" + raw);
    }

    try {
      var url = new URL(raw, window.location.href);
      if (url.origin === API_ORIGIN) return "";
      if (url.origin !== window.location.origin && url.origin !== DEMO_ORIGIN) return "";

      var apiPath = normalizeApiPath(url.pathname);
      if (!apiPath) return "";
      return API_ORIGIN + apiPath + url.search + url.hash;
    } catch (error) {
      return "";
    }
  }

  var nativeFetch = window.fetch && window.fetch.bind(window);
  if (nativeFetch) {
    window.fetch = function (input, init) {
      var nextUrl = rewriteUrl(input);
      if (!nextUrl) return nativeFetch(input, init);

      if (typeof Request !== "undefined" && input instanceof Request) {
        return nativeFetch(new Request(nextUrl, input), init);
      }

      return nativeFetch(nextUrl, init);
    };
  }

  var NativeXMLHttpRequest = window.XMLHttpRequest;
  if (NativeXMLHttpRequest) {
    window.XMLHttpRequest = function () {
      var xhr = new NativeXMLHttpRequest();
      return new Proxy(xhr, {
        get: function (target, prop) {
          if (prop === "open") {
            return function (method, url, async, user, password) {
              var nextUrl = rewriteUrl(url) || url;
              return target.open.call(target, method, nextUrl, async, user, password);
            };
          }
          var value = target[prop];
          return typeof value === "function" ? value.bind(target) : value;
        },
        set: function (target, prop, value) {
          target[prop] = value;
          return true;
        }
      });
    };
    Object.keys(NativeXMLHttpRequest).forEach(function (key) {
      try {
        window.XMLHttpRequest[key] = NativeXMLHttpRequest[key];
      } catch (error) {}
    });
    window.XMLHttpRequest.prototype = NativeXMLHttpRequest.prototype;
  }

  window.__autocavaRewriteApiUrl = rewriteUrl;
})();
