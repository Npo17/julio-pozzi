(function () {
  "use strict";

  function getReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  function launchCvCelebration() {
    if (getReducedMotion()) return;

    var root = document.getElementById("cv-celebration-root");
    if (!root) return;

    root.innerHTML = "";
    var frag = document.createDocumentFragment();

    for (var i = 0; i < 24; i++) {
      var el = document.createElement("span");
      el.className = "cv-mini-doc";
      el.setAttribute("aria-hidden", "true");
      el.style.left = Math.random() * 100 + "%";
      el.style.animationDelay = Math.random() * 0.45 + "s";
      el.style.animationDuration = 1.95 + Math.random() * 0.95 + "s";
      el.style.setProperty("--cv-rot", (Math.random() - 0.5) * 52 + "deg");
      el.style.setProperty("--cv-drift", (Math.random() - 0.5) * 110 + "px");
      frag.appendChild(el);
    }

    root.appendChild(frag);
    window.setTimeout(function () {
      root.innerHTML = "";
    }, 3600);
  }

  function initDownloadCv() {
    var downloadBtn = document.getElementById("download-cv");
    var downloadThanks = document.getElementById("download-thanks");
    if (!downloadBtn || !downloadThanks) return;

    if (!getReducedMotion()) {
      downloadBtn.addEventListener("mouseenter", function () {
        var btnText = this.querySelector(".btn-text");
        var hoverText = this.querySelector(".btn-hover-text");
        if (btnText) btnText.classList.add("hidden");
        if (hoverText) hoverText.classList.remove("hidden");
      });

      downloadBtn.addEventListener("mouseleave", function () {
        var btnText = this.querySelector(".btn-text");
        var hoverText = this.querySelector(".btn-hover-text");
        if (btnText) btnText.classList.remove("hidden");
        if (hoverText) hoverText.classList.add("hidden");
      });
    }

    downloadBtn.addEventListener("click", function () {
      downloadThanks.classList.remove("hidden");
      launchCvCelebration();
      window.setTimeout(function () {
        downloadThanks.classList.add("hidden");
      }, 3200);
    });
  }

  function initExperienceCards() {
    document.querySelectorAll(".toggle-details").forEach(function (button) {
      button.addEventListener("click", function () {
        var card = button.closest(".experience-card");
        if (!card) return;
        var open = !card.classList.contains("active");
        card.classList.toggle("active", open);
        button.setAttribute("aria-expanded", open ? "true" : "false");
        var panel = document.getElementById(button.getAttribute("aria-controls"));
        if (panel) panel.setAttribute("aria-hidden", open ? "false" : "true");
      });
    });
  }

  function initNav() {
    var nav = document.getElementById("site-nav");
    var toggle = document.getElementById("nav-toggle");
    var menu = document.getElementById("nav-menu");
    if (!nav || !toggle || !menu) return;

    function closeNav() {
      nav.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Abrir menú");
    }

    toggle.addEventListener("click", function () {
      var open = !nav.classList.contains("nav-open");
      nav.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    });

    menu.querySelectorAll('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 900px)").matches) closeNav();
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  function initScrollSpy() {
    var nav = document.getElementById("site-nav");
    var links = document.querySelectorAll(".nav-link[href^='#']");
    if (!links.length) return;

    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      var section = document.querySelector(id);
      if (section && sections.indexOf(section) === -1) sections.push(section);
    });

    if (!sections.length) return;

    var headerOffset = nav ? nav.offsetHeight + 12 : 80;

    var observer = new IntersectionObserver(
      function (entries) {
        var visible = entries
          .filter(function (e) {
            return e.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });
        if (!visible[0] || !visible[0].target.id) return;
        var activeId = "#" + visible[0].target.id;
        links.forEach(function (link) {
          var match = link.getAttribute("href") === activeId;
          link.classList.toggle("active", match);
          if (match) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      {
        rootMargin: "-" + headerOffset + "px 0px -55% 0px",
        threshold: [0.08, 0.2, 0.35],
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });

    window.addEventListener(
      "scroll",
      function () {
        if (nav) nav.classList.toggle("is-scrolled", window.scrollY > 24);
      },
      { passive: true }
    );
  }

  function initRevealOnScroll() {
    if (getReducedMotion()) return;

    var sections = document.querySelectorAll("main > section");
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.06 }
    );

    sections.forEach(function (section) {
      section.classList.add("reveal-on-scroll");
      if (section.getBoundingClientRect().top < window.innerHeight * 0.92) {
        section.classList.add("is-visible");
      }
      obs.observe(section);
    });
  }

  initDownloadCv();
  initExperienceCards();
  initNav();
  initScrollSpy();
  initRevealOnScroll();
})();
