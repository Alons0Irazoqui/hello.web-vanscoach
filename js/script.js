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

    const MIN_VISIBLE_MS = 1900;
    const CIRCUMFERENCE = 2 * Math.PI * 52;
    const ring = document.getElementById("loading-ring-progress");
    const percentEl = document.getElementById("loading-percent-value");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = Date.now();
    let rafId = null;

    const paint = (fraction) => {
      if (ring) ring.style.strokeDashoffset = String(CIRCUMFERENCE * (1 - fraction));
      if (percentEl) percentEl.textContent = Math.round(fraction * 100).toString();
    };

    if (reduceMotion) {
      paint(1);
    } else {
      const tick = () => {
        const progress = Math.min((Date.now() - start) / MIN_VISIBLE_MS, 1);
        paint(1 - Math.pow(1 - progress, 2));
        if (progress < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }

    const hide = () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => {
        if (rafId) cancelAnimationFrame(rafId);
        paint(1);
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
      window.setTimeout(hide, 5500);
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
     Partículas de fondo del hero (canvas, red de nodos sutil)
     ============================================================ */
  const initHeroParticles = () => {
    const canvas = document.getElementById("hero-particles");
    const hero = document.querySelector(".hero");
    if (!canvas || !hero) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    const MAX_DIST = 130;
    const DOT_COLORS = ["255, 255, 255", "245, 185, 63"];

    let w = 0;
    let h = 0;
    let particles = [];
    let rafId = null;
    let running = false;

    const createParticle = () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.6 + 0.6,
      color: DOT_COLORS[Math.random() < 0.85 ? 0 : 1],
    });

    const setup = () => {
      const rect = hero.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(70, Math.min(170, Math.round((w * h) / 8000)));
      particles = Array.from({ length: count }, createParticle);
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = w;
        else if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        else if (p.y > h) p.y = 0;
      });

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.14 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.color}, 0.55)`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const loop = () => {
      draw();
      rafId = requestAnimationFrame(loop);
    };

    const start = () => {
      if (running) return;
      running = true;
      rafId = requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };

    setup();
    start();

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 150);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });

    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? start() : stop()));
      },
      { threshold: 0 }
    ).observe(hero);
  };

  /* ============================================================
     Efecto máquina de escribir en el titular del hero
     ============================================================ */
  const initHeroTypewriter = () => {
    const el = document.getElementById("hero-type-word");
    if (!el) return;

    const words = ["rapidez", "humanidad", "transparencia", "urgencia", "cercanía"];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = words[0];
      return;
    }

    const TYPE_SPEED = 75;
    const DELETE_SPEED = 40;
    const HOLD_MS = 1600;
    const GAP_MS = 400;

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    const tick = () => {
      const word = words[wordIndex];

      if (!deleting) {
        charIndex++;
        el.textContent = word.slice(0, charIndex);
        if (charIndex === word.length) {
          deleting = true;
          window.setTimeout(tick, HOLD_MS);
          return;
        }
        window.setTimeout(tick, TYPE_SPEED);
        return;
      }

      charIndex--;
      el.textContent = word.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        window.setTimeout(tick, GAP_MS);
        return;
      }
      window.setTimeout(tick, DELETE_SPEED);
    };

    tick();
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
    initHeroParticles();
    initHeroTypewriter();
  });
})();
