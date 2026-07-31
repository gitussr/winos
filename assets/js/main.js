/* Shared behavior for every page: icons, diagrams, syntax highlight,
   scroll-spy, mobile nav, reveal-on-scroll, and the glossary tooltip system. */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    initIcons();
    initMermaid();
    initPrism();
    initMobileNav();
    initSidebarActiveByPage();
    initScrollSpyTOC();
    initReveal();
    initTooltips();
    initDetailsAutoScroll();
  }

  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  function initMermaid() {
    if (!window.mermaid) return;
    window.mermaid.initialize({
      startOnLoad: true,
      theme: "dark",
      securityLevel: "loose",
      themeVariables: {
        darkMode: true,
        background: "#0b0f1d",
        primaryColor: "#152040",
        primaryTextColor: "#e8ecfb",
        primaryBorderColor: "#3b82f6",
        lineColor: "#5b7bd5",
        secondaryColor: "#1c2747",
        tertiaryColor: "#101833",
        actorBkg: "#152040",
        actorBorder: "#3b82f6",
        actorTextColor: "#e8ecfb",
        signalColor: "#8aa6ff",
        signalTextColor: "#cfd8ff",
        labelBoxBkgColor: "#152040",
        labelBoxBorderColor: "#3b82f6",
        labelTextColor: "#e8ecfb",
        loopTextColor: "#b6c0e0",
        noteBkgColor: "#241a3a",
        noteBorderColor: "#a78bfa",
        noteTextColor: "#e8ecfb",
        fontFamily: "Segoe UI, ui-sans-serif, system-ui, sans-serif",
        fontSize: "14px",
      },
      flowchart: { curve: "basis", htmlLabels: true },
      sequence: { actorMargin: 60, boxMargin: 10, messageMargin: 34, mirrorActors: false },
    });
  }

  function initPrism() {
    if (window.Prism && typeof window.Prism.highlightAll === "function") {
      window.Prism.highlightAll();
    }
  }

  function initMobileNav() {
    var btn = document.getElementById("mobile-nav-toggle");
    var panel = document.getElementById("mobile-nav-panel");
    if (!btn || !panel) return;
    btn.addEventListener("click", function () {
      var isOpen = panel.classList.toggle("flex");
      panel.classList.toggle("hidden");
      btn.setAttribute("aria-expanded", String(isOpen));
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        panel.classList.add("hidden");
        panel.classList.remove("flex");
      });
    });
  }

  // Highlights the current page's entry in the sticky sidebar nav
  function initSidebarActiveByPage() {
    var page = document.body.getAttribute("data-page");
    if (!page) return;
    document.querySelectorAll("[data-nav]").forEach(function (link) {
      if (link.getAttribute("data-nav") === page) {
        link.classList.add("active");
      }
    });
  }

  // Highlights the in-page table-of-contents entry matching the section in view
  function initScrollSpyTOC() {
    var tocLinks = Array.prototype.slice.call(document.querySelectorAll(".toc-link"));
    if (!tocLinks.length) return;
    var sections = tocLinks
      .map(function (link) {
        var id = (link.getAttribute("href") || "").replace("#", "");
        return document.getElementById(id);
      })
      .filter(Boolean);
    if (!sections.length) return;

    var byId = {};
    tocLinks.forEach(function (l) { byId[l.getAttribute("href").replace("#", "")] = l; });

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var link = byId[entry.target.id];
          if (!link) return;
          if (entry.isIntersecting) {
            tocLinks.forEach(function (l) { l.classList.remove("active"); });
            link.classList.add("active");
          }
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach(function (s) { observer.observe(s); });
  }

  function initReveal() {
    var targets = document.querySelectorAll(".reveal, .reveal-scale");
    if (!targets.length) return;
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    targets.forEach(function (t) { observer.observe(t); });
  }

  // Glossary tooltip system: <span class="term" data-term="KEY">KEY</span>
  function initTooltips() {
    var pop = document.getElementById("tooltip-pop");
    if (!pop) {
      pop = document.createElement("div");
      pop.id = "tooltip-pop";
      document.body.appendChild(pop);
    }
    var glossary = window.GLOSSARY || {};

    document.querySelectorAll(".term[data-term]").forEach(function (el) {
      var key = el.getAttribute("data-term");
      var text = glossary[key];
      if (!text) return;

      el.addEventListener("mouseenter", function (e) { showTip(el, key, text); });
      el.addEventListener("focus", function () { showTip(el, key, text); });
      el.addEventListener("mouseleave", hideTip);
      el.addEventListener("blur", hideTip);
      el.addEventListener("mousemove", function (e) { positionTip(e.clientX, e.clientY); });
    });

    function showTip(el, key, text) {
      pop.innerHTML = "<b>" + key + "</b><br>" + text;
      var rect = el.getBoundingClientRect();
      positionTip(rect.left + rect.width / 2, rect.top);
      pop.classList.add("show");
    }
    function positionTip(x, y) {
      var w = 300, pad = 14;
      var left = Math.min(Math.max(pad, x - w / 2), window.innerWidth - w - pad);
      var top = y - 12;
      pop.style.left = left + "px";
      pop.style.top = Math.max(pad, top - 70) + "px";
    }
    function hideTip() { pop.classList.remove("show"); }
  }

  // Smooth-scroll a <details> Q&A item into view when opened
  function initDetailsAutoScroll() {
    document.querySelectorAll("details.qa-item").forEach(function (d) {
      d.addEventListener("toggle", function () {
        if (d.open) {
          setTimeout(function () {
            var rect = d.getBoundingClientRect();
            if (rect.top < 80) {
              window.scrollBy({ top: rect.top - 96, behavior: "smooth" });
            }
          }, 60);
        }
      });
    });
  }
})();
