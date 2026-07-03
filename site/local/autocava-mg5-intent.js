(function () {
  function normalizeText(value) {
    return String(value || "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  function isMg5VersionIntent(query) {
    var text = normalizeText(query);
    if (text.indexOf("mg5") === -1) return false;
    return [
      "不同版本",
      "版本",
      "车型",
      "配置",
      "车款",
      "款型",
      "对比",
      "比较",
      "区别",
      "version",
      "versions",
      "versiones",
      "modelos",
      "comparacion",
      "comparar"
    ].some(function (term) {
      return text.indexOf(term) !== -1;
    });
  }

  function streamChunks(text, handlers, speed, chunkSize) {
    return new Promise(function (resolve) {
      var index = 0;
      var timer = window.setInterval(function () {
        var chunk = text.slice(index, index + chunkSize);
        index += chunkSize;
        if (chunk && handlers.onAnswer) handlers.onAnswer(chunk);
        if (index >= text.length) {
          window.clearInterval(timer);
          resolve();
        }
      }, speed);
    });
  }

  function cardHtml() {
    return [
      '<div style="display:grid;gap:12px;margin-top:14px">',
      '<a href="/auto/series/332" style="display:grid;gap:9px;padding:12px;border-radius:12px;background:#fff;color:#222;text-decoration:none;box-shadow:0 8px 22px rgb(0 0 0 / 6%)">',
      '<span style="font-size:13px;font-weight:700">MG5</span>',
      '<span style="display:grid;grid-template-columns:84px minmax(0,1fr);align-items:center;gap:12px">',
      '<img src="site/cdn.autocava.com.mx/series/white/0332.png:240x0" alt="MG MG5" style="width:84px;height:54px;object-fit:contain">',
      '<span style="display:grid;gap:3px;font-size:12px;line-height:1.25">',
      '<strong style="font-size:13px;text-transform:uppercase">MG MG5</strong>',
      '<span>Desde: <b style="font-size:16px">$4,411</b> /mes</span>',
      '<em style="color:#666;font-size:11px;font-style:normal">Versiones de la misma serie</em>',
      '</span>',
      '</span>',
      '<span style="display:grid;min-height:28px;place-items:center;border:1.5px solid #b000ff;border-radius:999px;color:#b000ff;font-size:12px;font-weight:700">Ver detalles</span>',
      '</a>',
      '</div>'
    ].join("");
  }

  async function streamMg5VersionComparison(query, handlers) {
    var isChinese = /[\u4e00-\u9fff]/.test(String(query || ""));
    var text = isChinese ? [
      "<p><strong>你问的是 MG5 这个车系下不同车型/版本的对比，不是 MG 品牌整体介绍。</strong></p>",
      "<p>MG5 可以按预算和配置需求来选：如果你更看重入门价格和月供压力，优先看价格更低的版本；如果你想要更完整的舒适、科技和安全配置，再往高配版本看。</p>",
      "<p>从当前车系信息看，MG5 限时价格区间约为 <strong>$264,900 - $344,000</strong>，月供可从 <strong>$4,411/mes</strong> 起。建议进入 MG5 详情页查看同一车系下各车型的价格与配置差异。</p>"
    ].join("") : [
      "<p><strong>Te refieres a comparar las versiones dentro de la serie MG5, no a una introduccion general de la marca MG.</strong></p>",
      "<p>Para elegir entre versiones del MG5, separalo asi: si buscas menor precio y mensualidad, empieza por la version de entrada; si quieres mas comodidad, tecnologia y seguridad, revisa las versiones mas equipadas.</p>",
      "<p>Actualmente el MG5 se mueve aproximadamente entre <strong>$264,900 - $344,000</strong>, con mensualidad desde <strong>$4,411/mes</strong>. Te dejo la ficha del MG5 para revisar sus versiones.</p>"
    ].join("");

    await streamChunks(text, handlers || {}, 34, 20);
    if (handlers && handlers.onAnswer) handlers.onAnswer(cardHtml());
    if (handlers && handlers.onConversationId) handlers.onConversationId("local-mg5-version-comparison");
    if (handlers && handlers.onMessageId) handlers.onMessageId("local-mg5-version-" + Date.now());
    if (handlers && handlers.onDone) handlers.onDone();

    return {
      conversationId: "local-mg5-version-comparison",
      messageId: "local-mg5-version-" + Date.now()
    };
  }

  window.__autocavaMg5VersionLocalAnswer = function (request, handlers) {
    if (!isMg5VersionIntent(request && request.query)) return false;
    return streamMg5VersionComparison(request && request.query, handlers);
  };
})();
