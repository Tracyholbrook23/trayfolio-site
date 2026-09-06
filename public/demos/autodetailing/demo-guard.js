(() => {
  const blockedProtocols = /^(tel:|sms:|mailto:)/i;
  const isBlockedLink = (link) =>
    blockedProtocols.test(link.getAttribute("href") || "") ||
    /instagram\.com/i.test(link.getAttribute("href") || "");

  const disableLink = (link) => {
    if (!isBlockedLink(link)) return;
    link.setAttribute("aria-disabled", "true");
    link.setAttribute("title", "Contact actions are disabled in this demo");
  };

  document.querySelectorAll("a").forEach(disableLink);

  document.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest("a");
      if (!link || !isBlockedLink(link)) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );

  document.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    },
    true,
  );

  window.addEventListener("load", () => {
    const back = document.createElement("a");
    back.href = "/";
    back.textContent = "← Back to Trayfolio";
    back.setAttribute("aria-label", "Leave the demo and return to Trayfolio");
    back.style.cssText = [
      "position:fixed",
      "top:16px",
      "left:16px",
      "z-index:2147483647",
      "padding:10px 14px",
      "border:1px solid rgba(255,255,255,.45)",
      "background:rgba(8,9,11,.84)",
      "backdrop-filter:blur(10px)",
      "color:#f2f5f8",
      "font:700 12px/1 Arial,sans-serif",
      "letter-spacing:.04em",
      "text-decoration:none",
      "text-transform:uppercase",
    ].join(";");
    document.body.append(back);
  });
})();
