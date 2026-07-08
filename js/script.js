(() => {
  "use strict";

  /* ============================================================
     Configuración de contacto — reemplazar con los datos reales.
     ============================================================ */
  const CONFIG = {
    whatsappNumber: "9195139191",
    whatsappDefaultMessage: "Hola Vans Coach, necesito información sobre la Visa de Emergencia.",
  };

  const buildWhatsAppUrl = (message) =>
    `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;

  /* ============================================================
     Pantalla de carga
     ============================================================ */
  const initLoadingScreen = () => {
    const loadingScreen = document.getElementById("loading-screen");
    if (!loadingScreen) return;

    const MIN_VISIBLE_MS = 1100;
    const start = Date.now();

    const hide = () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        loadingScreen.classList.add("is-hidden");
        document.body.classList.remove("is-loading");
        window.setTimeout(() => loadingScreen.remove(), 800);
      }, wait);
    };

    if (document.readyState === "complete") {
      hide();
    } else {
      window.addEventListener("load", hide, { once: true });
      // Fallback por si "load" tarda demasiado (imágenes externas lentas).
      window.setTimeout(hide, 4000);
    }
  };

  /* ============================================================
     Header: fondo sólido al hacer scroll + menú móvil
     ============================================================ */
  const initHeader = () => {
    const header = document.getElementById("site-header");
    const toggle = document.getElementById("nav-toggle");
    const nav = document.getElementById("site-nav");
    if (!header || !toggle || !nav) return;

    const onScroll = () => {
      header.classList.toggle("is-scrolled", window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const closeNav = () => {
      nav.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    nav.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeNav();
    });

    document.addEventListener("click", (e) => {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });
  };

  /* ============================================================
     Scrollspy: resalta el enlace activo del menú
     ============================================================ */
  const initScrollSpy = () => {
    const links = Array.from(document.querySelectorAll(".nav-link"));
    if (!links.length) return;

    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!sections.length) return;

    const setActive = (id) => {
      links.forEach((link) => {
        link.classList.toggle("is-active", link.getAttribute("href") === `#${id}`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));
  };

  /* ============================================================
     Reveal on scroll
     ============================================================ */
  const initReveal = () => {
    const items = document.querySelectorAll("[data-reveal]");
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    items.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
      observer.observe(item);
    });
  };

  /* ============================================================
     Contadores animados (hero stats)
     ============================================================ */
  const initCounters = () => {
    const counters = document.querySelectorAll(".counter");
    if (!counters.length) return;

    const animate = (el) => {
      const target = Number(el.dataset.target || "0");
      const duration = 1400;
      const start = performance.now();

      const step = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(target * eased).toString();
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );

    counters.forEach((counter) => observer.observe(counter));
  };

  /* ============================================================
     Acordeón FAQ
     ============================================================ */
  const initAccordion = () => {
    const triggers = document.querySelectorAll(".accordion-trigger");
    if (!triggers.length) return;

    triggers.forEach((trigger) => {
      const panel = trigger.nextElementSibling;

      trigger.addEventListener("click", () => {
        const isOpen = trigger.getAttribute("aria-expanded") === "true";

        triggers.forEach((other) => {
          if (other !== trigger) {
            other.setAttribute("aria-expanded", "false");
            other.nextElementSibling.style.maxHeight = null;
          }
        });

        trigger.setAttribute("aria-expanded", String(!isOpen));
        panel.style.maxHeight = isOpen ? null : `${panel.scrollHeight}px`;
      });
    });
  };

  /* ============================================================
     Botón volver arriba
     ============================================================ */
  const initBackToTop = () => {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    window.addEventListener(
      "scroll",
      () => btn.classList.toggle("is-visible", window.scrollY > 600),
      { passive: true }
    );

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  };

  /* ============================================================
     WhatsApp: botón flotante + formulario de contacto
     ============================================================ */
  const initWhatsApp = () => {
    const links = [
      document.getElementById("whatsapp-float"),
      document.getElementById("contact-whatsapp-link"),
      document.getElementById("footer-whatsapp-link"),
    ];
    links.forEach((link) => {
      if (link) link.setAttribute("href", buildWhatsAppUrl(CONFIG.whatsappDefaultMessage));
    });

    const form = document.getElementById("contact-form");
    const note = document.getElementById("form-note");
    if (!form || !note) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nombre = form.nombre.value.trim();
      const telefono = form.telefono.value.trim();
      const situacion = form.situacion.value.trim();

      if (!nombre || !telefono || !situacion) {
        note.textContent = "Por favor complete todos los campos para continuar.";
        note.style.color = "#c0392b";
        return;
      }

      const message = [
        `Hola Vans Coach, mi nombre es ${nombre}.`,
        `Teléfono de contacto: ${telefono}.`,
        `Mi situación: ${situacion}`,
      ].join(" ");

      note.textContent = "Abriendo WhatsApp para enviar su solicitud…";
      note.style.color = "var(--navy-800)";

      window.open(buildWhatsAppUrl(message), "_blank", "noopener");
      form.reset();
    });
  };

  /* ============================================================
     Año actual en el footer
     ============================================================ */
  const initYear = () => {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear().toString();
  };

  /* ============================================================
     Parallax sutil del hero (respeta reduced-motion)
     ============================================================ */
  const initParallax = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const heroImg = document.querySelector(".hero .hero-img");
    if (!heroImg) return;

    window.addEventListener(
      "scroll",
      () => {
        const offset = Math.min(window.scrollY * 0.15, 80);
        heroImg.style.transform = `scale(1.06) translateY(${offset}px)`;
      },
      { passive: true }
    );
  };

  document.addEventListener("DOMContentLoaded", () => {
    document.body.classList.add("is-loading");
    initLoadingScreen();
    initHeader();
    initScrollSpy();
    initReveal();
    initCounters();
    initAccordion();
    initBackToTop();
    initWhatsApp();
    initYear();
    initParallax();
  });
})();
