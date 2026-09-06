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
})();
