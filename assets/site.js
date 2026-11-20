(() => {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 1. Arka Plan Katmanları ve İlerleme Çubuğu Enjeksiyonu
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

  // 2. Kaydırma İlerleme Çubuğu & Yapışkan Header Efekti
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

  // 3. Kademeli Scroll Reveal (IntersectionObserver)
  const revealTargets = document.querySelectorAll(
    ".reveal, .card, .step, .notice, .support-box, .faq-item"
  );

  revealTargets.forEach((el, idx) => {
    el.classList.add("reveal");
    if (!el.style.getPropertyValue("--delay")) {
      const stagger = (idx % 6) * 0.06;
      el.style.setProperty("--delay", `${stagger}s`);
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

  // 4. İmleç Takipli Radial Spotlight Kartlar
  const spotlightItems = document.querySelectorAll(".card, .step");
  spotlightItems.forEach((item) => {
    item.addEventListener("pointermove", (e) => {
      const rect = item.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      item.style.setProperty("--mouse-x", `${x}px`);
      item.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // 5. Hero 3D Perspektif Tilt Efekti
  const heroStage = document.querySelector(".hero-stage");
  const heroCard3D = document.querySelector(".hero-card-3d");
  if (heroStage && heroCard3D && !prefersReduced) {
    heroStage.addEventListener("pointermove", (e) => {
      const rect = heroStage.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;
      const rotateY = relX * 16;
      const rotateX = -relY * 16;
      heroCard3D.style.animation = "none";
      heroCard3D.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale(1.02)`;
    });

    heroStage.addEventListener("pointerleave", () => {
      heroCard3D.style.transform = "";
      heroCard3D.style.animation = "";
    });
  }

  // 6. Adım Kartları Otomatik Vurgulama Döngüsü
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

  // 7. İnteraktif Parçacık & Sinyal Ağı Canvas Animasyonu
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

    const count = Math.min(54, Math.floor((width * height) / 26000));
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
        ctx.fillStyle = p.isOrange
          ? "rgba(255, 145, 61, 0.55)"
          : "rgba(69, 213, 255, 0.52)";
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
                ? `rgba(255, 145, 61, ${alpha})`
                : `rgba(69, 213, 255, ${alpha})`;
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