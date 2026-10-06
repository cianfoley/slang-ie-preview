/* slang.ie portrait reader — swipe, arrows, letter jump */
(function () {
  const page = document.querySelector(".page");
  const prev = document.querySelector("[data-nav='prev']");
  const next = document.querySelector("[data-nav='next']");
  if (!page) return;

  function go(el) {
    if (!el || el.getAttribute("aria-disabled") === "true") return;
    const href = el.getAttribute("href");
    if (!href || href === "#") return;
    page.classList.add(el.dataset.nav === "next" ? "swipe-left" : "swipe-right");
    setTimeout(function () { window.location.href = href; }, 160);
  }

  document.addEventListener("keydown", function (e) {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      go(next);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      go(prev);
    }
  });

  let startX = 0, startY = 0, tracking = false;
  page.addEventListener("touchstart", function (e) {
    if (!e.touches || e.touches.length !== 1) return;
    tracking = true;
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  }, { passive: true });

  page.addEventListener("touchend", function (e) {
    if (!tracking) return;
    tracking = false;
    const t = e.changedTouches[0];
    const dx = t.clientX - startX;
    const dy = t.clientY - startY;
    if (Math.abs(dx) < 56 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) go(next);
    else go(prev);
  }, { passive: true });

  // Keep letter rail scrolled to current
  const cur = document.querySelector('.letter-rail a[aria-current="true"]');
  if (cur && cur.scrollIntoView) {
    try { cur.scrollIntoView({ inline: "center", block: "nearest", behavior: "instant" }); } catch (_) {
      cur.scrollIntoView(false);
    }
  }
})();
