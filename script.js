(function () {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function initLoader() {
    const loader = $("[data-loader]");
    if (!loader) return;
    window.setTimeout(() => loader.classList.add("hidden"), reducedMotion ? 120 : 820);
  }

  function initHeader() {
    const header = $("[data-header]");
    const button = $("[data-menu-button]");
    const menu = $("[data-mobile-menu]");
    if (!header || !button || !menu) return;

    const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 16);
    const closeMenu = () => {
      document.body.classList.remove("menu-open");
      menu.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
    };

    button.addEventListener("click", () => {
      const open = !menu.classList.contains("open");
      document.body.classList.toggle("menu-open", open);
      menu.classList.toggle("open", open);
      button.setAttribute("aria-expanded", String(open));
    });

    $$(".mobile-menu a").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });
    onScroll();
  }

  function initParticles() {
    if (reducedMotion) return;
    $$("[data-particles]").forEach((field) => {
      for (let index = 0; index < 30; index += 1) {
        const particle = document.createElement("span");
        particle.className = "particle";
        particle.style.setProperty("--x", `${(index * 37) % 100}%`);
        particle.style.setProperty("--y", `${(index * 53) % 100}%`);
        particle.style.setProperty("--size", `${(index % 4) + 2}px`);
        particle.style.setProperty("--duration", `${7 + (index % 6)}s`);
        particle.style.setProperty("--delay", `${(index % 9) * -0.55}s`);
        field.appendChild(particle);
      }
    });
  }

  function initReveal() {
    const items = $$(".reveal");
    const skills = $$(".skill");

    skills.forEach((skill) => {
      skill.style.setProperty("--level", `${skill.getAttribute("data-level") || 0}%`);
    });

    if (!("IntersectionObserver" in window) || reducedMotion) {
      items.forEach((item) => item.classList.add("visible"));
      skills.forEach((skill) => skill.classList.add("visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -80px 0px" }
    );

    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index * 28, 260)}ms`;
      observer.observe(item);
    });
  }

  function initFilters() {
    const buttons = $$(".filter");
    const projects = $$(".project");
    if (!buttons.length || !projects.length) return;

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach((item) => item.classList.toggle("active", item === button));
        projects.forEach((project) => {
          project.classList.toggle("hidden", filter !== "All" && project.dataset.category !== filter);
        });
      });
    });
  }

  function initTilt() {
    if (reducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
    $$(".project").forEach((project) => {
      project.addEventListener("pointermove", (event) => {
        const rect = project.getBoundingClientRect();
        const rotateX = ((event.clientY - rect.top) / rect.height - 0.5) * -5;
        const rotateY = ((event.clientX - rect.left) / rect.width - 0.5) * 5;
        project.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      project.addEventListener("pointerleave", () => {
        project.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg)";
      });
    });
  }

  function initCursor() {
    if (reducedMotion || window.matchMedia("(pointer: coarse)").matches) return;
    const cursor = $("[data-cursor]");
    const dot = $("[data-cursor-dot]");
    if (!cursor || !dot) return;

    let cursorX = -40;
    let cursorY = -40;
    let dotX = -40;
    let dotY = -40;

    window.addEventListener("pointermove", (event) => {
      cursorX = event.clientX - 9;
      cursorY = event.clientY - 9;
      dotX = event.clientX - 2;
      dotY = event.clientY - 2;
    });

    const render = () => {
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;
      window.requestAnimationFrame(render);
    };
    render();
  }

  function initYear() {
    const year = $("[data-year]");
    if (year) year.textContent = new Date().getFullYear();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    initHeader();
    initParticles();
    initReveal();
    initFilters();
    initTilt();
    initCursor();
    initYear();
  });
})();
