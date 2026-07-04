(function () {
  if (window.__autocavaCaviNavInstalled) return;
  window.__autocavaCaviNavInstalled = true;

  function sitePath(path) {
    var cleanPath = String(path || "").replace(/^\/+/, "");
    var base = location.hostname.indexOf("github.io") !== -1 && location.pathname.indexOf("/AutoCava") === 0 ? "/AutoCava/" : "/";
    return base + cleanPath;
  }

  var ICON_SRC = sitePath("site/local/cavi-nav.svg");
  var DESKTOP_ID = "autocava-cavi-nav-desktop";
  var MOBILE_ID = "autocava-cavi-nav-mobile";
  var MG3_SERIES_URL = "/auto/series/336";

  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isMg3ComparisonIntent(query) {
    var text = normalizeText(query);
    if (text.indexOf("mg3") === -1) return false;

    var hasCompetitor = [
      "renault kwid",
      "hyundai grand i10",
      "grand i10",
      "nissan march",
      "chevrolet aveo",
      "aveo",
      "kwid",
      "march"
    ].some(function (term) {
      return text.indexOf(term) !== -1;
    });

    var asksComparison = [
      "cual es mejor",
      "cual conviene",
      "que conviene",
      "compar",
      "competidor",
      "competencia",
      "versus",
      "vs"
    ].some(function (term) {
      return text.indexOf(term) !== -1;
    });

    return hasCompetitor && asksComparison;
  }

  function mg3RecommendationCardsHtml() {
    return [
      '<div class="autocava-mg3-card-list">',
      '<a class="autocava-mg3-card autocava-mg3-card-primary" href="' + MG3_SERIES_URL + '">',
      '<span class="autocava-mg3-rank">#1</span>',
      '<span class="autocava-mg3-body">',
      '<img src="' + sitePath("site/cdn.autocava.com.mx/series/white/0336.png:240x0") + '" alt="MG MG3">',
      '<span class="autocava-mg3-copy">',
      '<strong>MG MG3</strong>',
      '<span>Desde: <b>$4,146</b> /mes</span>',
      '<em>Recomendado por valor general</em>',
      '</span>',
      '</span>',
      '<span class="autocava-mg3-cta">Ver detalles</span>',
      '</a>',
      '<a class="autocava-mg3-card" href="/auto/series/354">',
      '<span class="autocava-mg3-rank">#2</span>',
      '<span class="autocava-mg3-body">',
      '<img src="' + sitePath("site/cdn.autocava.com.mx/series/white/0354.png:240x0") + '" alt="Nissan March">',
      '<span class="autocava-mg3-copy">',
      '<strong>Nissan March</strong>',
      '<span>Desde: <b>$4,927</b> /mes</span>',
      '<em>Buena opcion conservadora</em>',
      '</span>',
      '</span>',
      '<span class="autocava-mg3-cta">Ver detalles</span>',
      '</a>',
      '</div>'
    ].join("");
  }

  function streamChunks(text, handlers, speed, chunkSize) {
    return new Promise(function (resolve) {
      var index = 0;
      var timer = window.setInterval(function () {
        var chunk = text.slice(index, index + chunkSize);
        index += chunkSize;
        if (chunk) handlers.onAnswer && handlers.onAnswer(chunk);
        if (index >= text.length) {
          window.clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  async function streamMg3Comparison(handlers) {
    var intro = [
      "<p><strong>Si lo quieres resolver rapido: entre MG3, Renault Kwid, Hyundai Grand i10, Nissan March y Chevrolet Aveo, mi recomendacion principal es el MG3.</strong></p>",
      "<p>Por precio, mensualidad y equipamiento, el MG3 suele convenir mas si buscas una compra inteligente sin sacrificar seguridad ni espacio.</p>",
      "<p>Renault Kwid y Hyundai Grand i10 son opciones muy urbanas; Nissan March sigue siendo una alternativa confiable; Chevrolet Aveo puede ser practico. Pero si tu prioridad es pagar menos y llevarte mas valor, ve primero por MG3.</p>"
    ].join("");

    await streamChunks(intro, handlers || {}, 34, 20);
    if (handlers && handlers.onAnswer) handlers.onAnswer(mg3RecommendationCardsHtml());
    if (handlers && handlers.onConversationId) handlers.onConversationId("local-mg3-recommendation");
    if (handlers && handlers.onMessageId) handlers.onMessageId("local-mg3-" + Date.now());
    if (handlers && handlers.onDone) handlers.onDone();

    return {
      conversationId: "local-mg3-recommendation",
      messageId: "local-mg3-" + Date.now()
    };
  }

  window.__autocavaMg3LocalAnswer = function (request, handlers) {
    if (!isMg3ComparisonIntent(request && request.query)) return false;
    return streamMg3Comparison(handlers);
  };

  function isChatOpen() {
    var chatBox = document.querySelector(".ai-chat-box,[data-vaul-drawer][data-vaul-drawer-direction='right']");
    if (!chatBox) return false;
    var styles = window.getComputedStyle(chatBox);
    return styles.display !== "none" && styles.visibility !== "hidden" && styles.opacity !== "0";
  }

  function openCaviChatbot() {
    if (isChatOpen()) return;

    var bubble = document.getElementById("dify-chatbot-bubble-button");
    if (bubble) {
      triggerUserClick(bubble);
      window.setTimeout(function () {
        if (!isChatOpen()) openFallbackDrawer();
      }, 650);
      return;
    }

    openFallbackDrawer();
  }

  function triggerUserClick(element) {
    var eventInit = {
      bubbles: true,
      cancelable: true,
      composed: true,
      view: window
    };
    ["pointerdown", "mousedown", "pointerup", "mouseup", "click"].forEach(function (type) {
      var EventCtor = type.indexOf("pointer") === 0 && window.PointerEvent ? window.PointerEvent : window.MouseEvent;
      element.dispatchEvent(new EventCtor(type, eventInit));
    });
  }

  function makeButton(id) {
    var button = document.createElement("button");
    button.type = "button";
    button.id = id || "";
    button.className = "autocava-cavi-button";
    button.setAttribute("aria-label", "Abrir Cavi AI");
    button.title = "Cavi AI";
    button.addEventListener("click", openCaviChatbot);

    var img = document.createElement("img");
    img.className = "autocava-cavi-icon";
    img.src = ICON_SRC;
    img.alt = "Cavi";
    img.width = 78;
    img.height = 35;
    button.appendChild(img);

    var text = document.createElement("span");
    text.className = "autocava-cavi-label";
    text.textContent = "Cavi";
    button.appendChild(text);

    return button;
  }

  function installDesktopButton() {
    var list = document.querySelector("#page-header nav ul[data-slot='list'], #page-header nav ul");
    if (!list || list.children.length < 2) return;

    var current = document.getElementById(DESKTOP_ID);
    if (current && current.querySelector(".autocava-cavi-button")) return;

    if (current) {
      current.removeAttribute("id");
      current.removeAttribute("data-autocava-cavi");
    }

    var item = document.createElement("li");
    item.id = DESKTOP_ID;
    item.setAttribute("data-autocava-cavi", "true");
    item.className = "min-w-0 py-2";
    item.appendChild(makeButton(""));

    var target = Array.from(list.children).find(function (child) {
      return child.textContent.trim() === "Autos";
    }) || list.children[2] || null;
    list.insertBefore(item, target);
  }

  function installMobileButton() {
    if (document.getElementById(MOBILE_ID)) return;

    var headerRow = document.querySelector("#page-header .h-14.bg-ffcf20.flex.items-center");
    if (!headerRow) return;

    var menuArea = headerRow.querySelector(".shrink-0.h-full");
    var button = makeButton(MOBILE_ID);
    headerRow.insertBefore(button, menuArea || null);
  }

  function installLogoChatbotClick() {
    var logoLink = document.querySelector('#page-header a.shrink-0.flex[href="/"]');
    if (!logoLink || logoLink.dataset.autocavaLogoChatbot === "true") return;

    logoLink.dataset.autocavaLogoChatbot = "true";
    logoLink.setAttribute("aria-label", "Abrir Cavi AI");
    logoLink.title = "Cavi AI";
    logoLink.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      openCaviChatbot();
    }, true);
  }

  function ensureFallbackDrawer() {
    if (document.getElementById("autocava-cavi-fallback-drawer")) return;

    var overlay = document.createElement("div");
    overlay.id = "autocava-cavi-fallback-overlay";
    overlay.addEventListener("click", closeFallbackDrawer);

    var drawer = document.createElement("aside");
    drawer.id = "autocava-cavi-fallback-drawer";
    drawer.setAttribute("aria-label", "Cavi AI");
    drawer.innerHTML = [
      '<div class="autocava-cavi-drawer-header">',
      '<img src="' + ICON_SRC + '" alt="Cavi" width="78" height="35">',
      '<button type="button" class="autocava-cavi-drawer-close" aria-label="Cerrar">x</button>',
      '</div>',
      '<div class="autocava-cavi-drawer-body">',
      '<div class="autocava-cavi-thread" aria-live="polite">',
      '<div class="autocava-cavi-message">Hola, soy Cavi. Estoy aqui para ayudarte a encontrar el coche perfecto para ti.</div>',
      '<div class="autocava-cavi-options">',
      '<button type="button">Quiero comprar un auto</button>',
      '<button type="button">Ver autos dentro de mi presupuesto</button>',
      '<button type="button">Comparar modelos</button>',
      '</div>',
      '</div>',
      '<form class="autocava-cavi-composer">',
      '<input type="text" name="message" placeholder="Escribe tu mensaje..." maxlength="2000" autocomplete="off">',
      '<button type="submit" aria-label="Enviar">➤</button>',
      '</form>',
      '</div>'
    ].join("");

    drawer.querySelector(".autocava-cavi-drawer-close").addEventListener("click", closeFallbackDrawer);
    drawer.querySelector(".autocava-cavi-options").addEventListener("click", function (event) {
      var button = event.target.closest("button");
      if (button) sendFallbackMessage(button.textContent.trim());
    });
    drawer.querySelector(".autocava-cavi-composer").addEventListener("submit", function (event) {
      event.preventDefault();
      var input = event.currentTarget.querySelector("input");
      var value = input.value.trim();
      if (!value) return;
      input.value = "";
      sendFallbackMessage(value);
    });
    document.body.appendChild(overlay);
    document.body.appendChild(drawer);
  }

  function appendFallbackBubble(role, html) {
    var thread = document.querySelector("#autocava-cavi-fallback-drawer .autocava-cavi-thread");
    if (!thread) return null;
    var bubble = document.createElement("div");
    bubble.className = "autocava-cavi-message autocava-cavi-message-" + role;
    bubble.innerHTML = html;
    thread.appendChild(bubble);
    thread.scrollTop = thread.scrollHeight;
    return bubble;
  }

  function escapeHtml(value) {
    return String(value || "").replace(/[&<>"']/g, function (char) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[char];
    });
  }

  function sendFallbackMessage(message) {
    appendFallbackBubble("user", escapeHtml(message));
    var assistant = appendFallbackBubble("assistant", "");
    var handlers = {
      onAnswer: function (chunk) {
        if (!assistant) return;
        assistant.innerHTML += chunk;
        assistant.scrollIntoView({ block: "end" });
      },
      onError: function () {
        if (assistant) assistant.textContent = "Lo siento, intenta de nuevo en unos segundos.";
      },
      onDone: function () {}
    };
    var handled = false;
    try {
      handled = window.__autocavaMg5VersionLocalAnswer && window.__autocavaMg5VersionLocalAnswer({ query: message }, handlers);
      if (!handled) handled = window.__autocavaMg3LocalAnswer && window.__autocavaMg3LocalAnswer({ query: message }, handlers);
    } catch (error) {
      handlers.onError(error);
      return;
    }
    if (!handled && assistant) {
      assistant.innerHTML = "Claro. Puedo ayudarte a comparar modelos, revisar financiamiento o encontrar autos por presupuesto. Cuéntame qué modelo o rango de precio te interesa.";
    }
  }

  function openFallbackDrawer() {
    ensureFallbackDrawer();
    document.body.classList.add("autocava-cavi-fallback-open");
  }

  function closeFallbackDrawer() {
    document.body.classList.remove("autocava-cavi-fallback-open");
  }

  function installCaviNav() {
    installDesktopButton();
    installMobileButton();
    installLogoChatbotClick();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", installCaviNav, { once: true });
  } else {
    installCaviNav();
  }

  window.setTimeout(installCaviNav, 250);
  window.setTimeout(installCaviNav, 1200);

  var observer = new MutationObserver(function () {
    window.requestAnimationFrame(installCaviNav);
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
})();
