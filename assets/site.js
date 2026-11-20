(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const STORAGE_KEY = "otoyayin_theme_v1";

  const PRESETS = {
    cyber: { name: "Siber Turkuaz", cyan: "#45d5ff", orange: "#ff913d" },
    emerald: { name: "Zümrüt & Altın", cyan: "#10b981", orange: "#f59e0b" },
    stab: { name: "STAB Neon", cyan: "#a855f7", orange: "#ec4899" },
    cobalt: { name: "Safir Buz", cyan: "#38bdf8", orange: "#818cf8" }
  };

  const hexToRgb = (hex) => {
    const clean = hex.replace("#", "").trim();
    const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
    const num = parseInt(full, 16);
    if (Number.isNaN(num)) return "69, 213, 255";
    return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
  };

  let themeState = {
    preset: "cyber",
    mode: "navy",
    cyan: "#45d5ff",
    orange: "#ff913d"
  };

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && saved.cyan && saved.orange) {
      themeState = { ...themeState, ...saved };
    }
  } catch (_) {}

  const applyTheme = (state, persist = true) => {
    themeState = state;
    const root = document.documentElement;
    root.style.setProperty("--cyan", state.cyan);
    root.style.setProperty("--cyan-rgb", hexToRgb(state.cyan));
    root.style.setProperty("--orange", state.orange);
    root.style.setProperty("--orange-rgb", hexToRgb(state.orange));

    if (state.mode && state.mode !== "navy") {
      root.setAttribute("data-mode", state.mode);
    } else {
      root.removeAttribute("data-mode");
    }

    document.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.preset === state.preset);
    });
    document.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === state.mode);
    });
    const picker = document.getElementById("custom-accent-picker");
    if (picker) picker.value = state.cyan;

    if (persist) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (_) {}
    }
  };

  // İlk yüklemede kayıtlı temayı uygula
  applyTheme(themeState, false);

  // 1. Arka Plan Katmanları ve İlerleme Çubuğu
  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  document.body.prepend(progressBar);

  const gridLayer = document.createElement("div");
  gridLayer.className = "bg-grid";
  document.body.prepend(gridLayer);

  const auroraLayer = document.createElement("div");
  auroraLayer.className = "bg-aurora";
  document.body.prepend(auroraLayer);

  const canvas = document.createElement("canvas");
  canvas.id = "bg-canvas";
  document.body.prepend(canvas);

  // 2. Tema Ayar Paneli & Mobil Menü Etkileşimleri
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const themePopover = document.getElementById("theme-popover");
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const navCenter = document.getElementById("nav-center");

  if (themeToggleBtn && themePopover) {
    themeToggleBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      themePopover.classList.toggle("open");
      if (navCenter) navCenter.classList.remove("open");
    });

    themePopover.addEventListener("click", (e) => e.stopPropagation());

    document.addEventListener("click", () => {
      themePopover.classList.remove("open");
      if (navCenter) navCenter.classList.remove("open");
    });

    themePopover.querySelectorAll(".preset-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const key = btn.dataset.preset;
        const p = PRESETS[key];
        if (p) {
          applyTheme({ ...themeState, preset: key, cyan: p.cyan, orange: p.orange });
        }
      });
    });

    themePopover.querySelectorAll(".mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        applyTheme({ ...themeState, mode: btn.dataset.mode });
      });
    });

    const picker = document.getElementById("custom-accent-picker");
    if (picker) {
      picker.addEventListener("input", (e) => {
        applyTheme({ ...themeState, preset: "custom", cyan: e.target.value });
      });
    }

    const resetBtn = document.getElementById("theme-reset-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        applyTheme({
          preset: "cyber",
          mode: "navy",
          cyan: PRESETS.cyber.cyan,
          orange: PRESETS.cyber.orange
        });
      });
    }
  }

  if (mobileMenuBtn && navCenter) {
    mobileMenuBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      navCenter.classList.toggle("open");
      if (themePopover) themePopover.classList.remove("open");
    });
  }

  // 3. E-posta Kopyalama Butonu
  document.querySelectorAll("[data-copy-email]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const email = btn.getAttribute("data-copy-email");
      const original = btn.innerHTML;
      try {
        await navigator.clipboard.writeText(email);
        btn.textContent = "✓ E-posta kopyalandı";
        setTimeout(() => {
          btn.innerHTML = original;
        }, 2000);
      } catch (_) {}
    });
  });

  // 4. Kaydırma İlerleme Çubuğu & Yapışkan Header
  const header = document.querySelector(".top");
  const updateScrollUI = () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0;
    progressBar.style.width = `${pct}%`;

    if (header) {
      header.classList.toggle("scrolled", scrollTop > 18);
    }
  };
  window.addEventListener("scroll", updateScrollUI, { passive: true });
  updateScrollUI();

  // 5. Kademeli Scroll Reveal
  const revealTargets = document.querySelectorAll(
    ".reveal, .card, .step, .notice, .support-box, .faq-item"
  );

  revealTargets.forEach((el, idx) => {
    el.classList.add("reveal");
    if (!el.style.getPropertyValue("--delay")) {
      el.style.setProperty("--delay", `${(idx % 6) * 0.06}s`);
    }
  });

  if ("IntersectionObserver" in window && !prefersReduced) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  // 6. İmleç Takipli Spotlight Kartlar
  document.querySelectorAll(".card, .step").forEach((item) => {
    item.addEventListener("pointermove", (e) => {
      const rect = item.getBoundingClientRect();
      item.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      item.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });
  });

  // 7. Hero 3D Konsol Tilt Efekti
  const heroStage = document.querySelector(".hero-stage");
  const heroConsole = document.querySelector(".hero-console");
  if (heroStage && heroConsole && !prefersReduced) {
    heroStage.addEventListener("pointermove", (e) => {
      const rect = heroStage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      heroConsole.style.animation = "none";
      heroConsole.style.transform = `rotateX(${(-relY * 12).toFixed(2)}deg) rotateY(${(relX * 12).toFixed(2)}deg) scale(1.015)`;
    });

    heroStage.addEventListener("pointerleave", () => {
      heroConsole.style.transform = "";
      heroConsole.style.animation = "";
    });
  }

  // 8. Adım Kartları Otomatik Vurgulama
  const steps = document.querySelectorAll(".step");
  if (steps.length > 0 && !prefersReduced) {
    let activeStep = 0;
    let paused = false;

    steps.forEach((step, index) => {
      step.addEventListener("mouseenter", () => {
        paused = true;
        steps.forEach((s) => s.classList.remove("is-active"));
        step.classList.add("is-active");
      });
      step.addEventListener("mouseleave", () => {
        paused = false;
        activeStep = index;
      });
    });

    setInterval(() => {
      if (paused) return;
      steps.forEach((s) => s.classList.remove("is-active"));
      steps[activeStep].classList.add("is-active");
      activeStep = (activeStep + 1) % steps.length;
    }, 2400);
  }

  // 9. Dinamik Tema Renkli Parçacık Ağı Canvas
  if (!prefersReduced && canvas.getContext) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationId = null;

    const mouse = { x: -9999, y: -9999 };
    window.addEventListener(
      "pointermove",
      (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
      },
      { passive: true }
    );

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const count = Math.min(52, Math.floor((width * height) / 27000));
    const particles = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.8 + 0.9,
      isOrange: i % 5 === 0
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const cyanRgb = getComputedStyle(document.documentElement)
        .getPropertyValue("--cyan-rgb")
        .trim() || "69, 213, 255";
      const orangeRgb = getComputedStyle(document.documentElement)
        .getPropertyValue("--orange-rgb")
        .trim() || "255, 145, 61";

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        const dxMouse = p.x - mouse.x;
        const dyMouse = p.y - mouse.y;
        const distMouse = Math.hypot(dxMouse, dyMouse);
        if (distMouse < 140 && distMouse > 0) {
          p.x += (dxMouse / distMouse) * 0.6;
          p.y += (dyMouse / distMouse) * 0.6;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.isOrange ? `rgba(${orangeRgb}, 0.52)` : `rgba(${cyanRgb}, 0.5)`;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const alpha = (1 - dist / 130) * 0.14;
            ctx.strokeStyle =
              p.isOrange || p2.isOrange
                ? `rgba(${orangeRgb}, ${alpha})`
                : `rgba(${cyanRgb}, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden && animationId) {
        cancelAnimationFrame(animationId);
      } else if (!document.hidden) {
        render();
      }
    });
  }
})();