(() => {
  const CONFIG_URL = "/commurank/analytics-config.json";
  const queue = [];
  let ready = false;

  function cleanParams(params = {}) {
    const out = {};
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null || value === "") continue;
      out[key] = typeof value === "string" ? value.slice(0, 120) : value;
    }
    return out;
  }

  function send(name, params = {}) {
    const payload = cleanParams(params);
    if (!ready || typeof window.gtag !== "function") {
      queue.push([name, payload]);
      return;
    }
    window.gtag("event", name, payload);
  }

  window.commURankTrack = send;

  function destinationHost(href) {
    try { return new URL(href, location.href).hostname; }
    catch { return ""; }
  }

  document.addEventListener("click", event => {
    const anchor = event.target.closest("a[href]");
    const keywordButton = event.target.closest("[data-keyword]");

    if (keywordButton) {
      send("keyword_filter", { keyword: keywordButton.dataset.keyword || "" });
    }

    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";

    if (href.includes("/post/?url=")) {
      send("post_analysis_open", { page_path: location.pathname });
    } else if (href.includes("/issue/?id=")) {
      send("issue_open", { page_path: location.pathname });
    }

    if (anchor.id === "originalLink" || anchor.classList.contains("primary-action")) {
      send("original_outbound_click", {
        destination_host: destinationHost(anchor.href),
        source_page: location.pathname
      });
    }
  }, { passive: true });

  document.addEventListener("submit", event => {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) return;
    const input = form.querySelector('input[type="search"], input[name="q"]');
    if (input && input.value.trim()) {
      send("search_submit", {
        search_term: input.value.trim().slice(0, 80),
        source_page: location.pathname
      });
    }
  });

  fetch(CONFIG_URL, { cache: "no-store" })
    .then(r => r.ok ? r.json() : null)
    .then(config => {
      if (!config?.enabled || !/^G-[A-Z0-9]+$/i.test(config.ga4_id || "")) return;

      window.dataLayer = window.dataLayer || [];
      window.gtag = function(){ window.dataLayer.push(arguments); };
      window.gtag("js", new Date());
      window.gtag("config", config.ga4_id, {
        send_page_view: true,
        anonymize_ip: true
      });

      const script = document.createElement("script");
      script.async = true;
      script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(config.ga4_id);
      document.head.appendChild(script);

      ready = true;
      while (queue.length) {
        const [name, params] = queue.shift();
        window.gtag("event", name, params);
      }
    })
    .catch(() => {});
})();