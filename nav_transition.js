(function () {
  "use strict";

  var TRANSITION_MS = 170;

  function isInternalPageLink(anchor) {
    if (!anchor || anchor.target || anchor.hasAttribute("download")) {
      return false;
    }

    var href = anchor.getAttribute("href") || "";
    if (!href || href.charAt(0) === "#" || href.indexOf("javascript:") === 0) {
      return false;
    }

    try {
      var next = new URL(anchor.href, window.location.href);
      return next.origin === window.location.origin || window.location.protocol === "file:";
    } catch (error) {
      return false;
    }
  }

  function handleClick(event) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    var anchor = event.target.closest ? event.target.closest("a[href]") : null;
    if (!isInternalPageLink(anchor)) {
      return;
    }

    event.preventDefault();
    document.body.classList.add("page-leaving");
    window.setTimeout(function () {
      window.location.href = anchor.href;
    }, TRANSITION_MS);
  }

  window.addEventListener("pageshow", function () {
    document.body.classList.remove("page-leaving");
  });
  document.addEventListener("click", handleClick, true);
})();
