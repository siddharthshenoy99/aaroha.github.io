(function () {
  /* ── Year ── */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ── Mobile nav toggle ── */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });

    nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) setNavOpen(false);
      });
    });
  }

  /* ── Dropdown toggles (mobile) ── */
  document.querySelectorAll(".nav-item.has-dropdown").forEach(function (item) {
    var trigger = item.querySelector(".nav-trigger");
    if (!trigger) return;
    trigger.addEventListener("click", function (e) {
      if (!window.matchMedia("(max-width: 900px)").matches) return;
      e.preventDefault();
      var open = item.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
  });

  /* ── Header scroll state ── */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 24);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ── Scroll reveal (IntersectionObserver) ── */
  var revealEls = document.querySelectorAll("[data-reveal]");

  if (revealEls.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    /* Fallback: show everything immediately */
    revealEls.forEach(function (el) {
      el.classList.add("is-revealed");
    });
  }

  /* ── Animated counters ── */
  var statNumbers = document.querySelectorAll(".stat-number[data-target]");

  function easeOut(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute("data-target"), 10);
    var duration = 1400;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var elapsed = timestamp - start;
      var progress = Math.min(elapsed / duration, 1);
      el.textContent = Math.round(easeOut(progress) * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }

    requestAnimationFrame(step);
  }

  if (statNumbers.length && "IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(function (el) {
      counterObserver.observe(el);
    });
  }
})();
