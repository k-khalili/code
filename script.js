/* ============================================================
   SCROLL REVEAL
   ============================================================ */
(function () {
  const els = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
  );

  const parents = new Map();
  els.forEach((el) => {
    const key = el.parentElement;
    if (!parents.has(key)) parents.set(key, []);
    parents.get(key).push(el);
  });

  parents.forEach((children) => {
    children.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.1}s`;
      observer.observe(el);
    });
  });
})();


/* ============================================================
   FOOTER RULE DRAW
   ============================================================ */
(function () {
  const rule = document.querySelector(".footer-rule");
  if (!rule) return;

  rule.style.transform = "scaleX(0)";
  rule.style.transition = "transform 1.2s cubic-bezier(0.25, 0.1, 0.25, 1)";

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        rule.style.transform = "scaleX(1)";
        observer.disconnect();
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(rule);
})();


/* ============================================================
   NAV ACTIVE STATE
   ============================================================ */
(function () {
  const sections = document.querySelectorAll("section[id], footer[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  const activate = () => {
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 100) {
        current = sec.getAttribute("id");
      }
    });
    navLinks.forEach((a) => {
      const isActive = a.getAttribute("href") === `#${current}`;
      a.style.color = isActive ? "var(--text)" : "";
    });
  };

  window.addEventListener("scroll", activate, { passive: true });
  activate();
})();


/* ============================================================
   HERO NAME WORD SPLIT
   ============================================================ */
(function () {
  const nameEl = document.getElementById("hero-name");
  if (!nameEl) return;
  const words = nameEl.textContent.trim().split(" ");
  nameEl.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(" ");
})();


/* ============================================================
   STARFIELD ANIMATION
   ============================================================ */
(function () {
  const canvas = document.getElementById("starfield");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let width, height, docHeight, heroHeight;
  let stars = [];
  let startTime = Date.now();

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    docHeight = Math.max(
      document.body.scrollHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight
    );
    heroHeight = height;

    canvas.width = width;
    canvas.height = height;
  }
  
  window.addEventListener("resize", resize);
  resize();

  // Create stars for the whole document
  // Maintain a nice density based on the document height
  const numStars = Math.floor((docHeight / height) * 200);
  for (let i = 0; i < numStars; i++) {
    stars.push({
      x: Math.random() * width,
      y: Math.random() * docHeight,
      size: Math.random() * 1.5,
      speed: Math.random() * 0.3 + 0.05,
      alpha: Math.random()
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    let elapsed = Date.now() - startTime;
    // Trickle down boundary: starts at hero bottom, reaches document bottom at 10s
    let trickleY = heroHeight + (docHeight - heroHeight) * Math.min(1, elapsed / 10000);
    // Global fade-in: starts at 0, fully visible at 30s
    let fadeProgress = Math.min(1, Math.max(0, elapsed / 30000));
    
    let scrollY = window.scrollY;

    stars.forEach(star => {
      // Twinkle effect
      star.alpha += (Math.random() - 0.5) * 0.05;
      if (star.alpha > 1) star.alpha = 1;
      if (star.alpha < 0.1) star.alpha = 0.1;

      // Move subtle up and right
      star.y -= star.speed;
      star.x += star.speed * 0.2;
      
      if (star.y < 0) {
        star.y = docHeight;
        star.x = Math.random() * width;
      }
      if (star.x > width) {
        star.x = 0;
        star.y = Math.random() * docHeight;
      }

      // Calculate screen Y
      let screenY = star.y - scrollY;

      // Only draw if within viewport
      if (screenY >= -5 && screenY <= height + 5) {
        // Hide if below the trickle line
        if (star.y > trickleY) return;

        let currentAlpha = star.alpha;
        
        // If the star is below the initial hero section, apply the 30-second global fade-in
        if (star.y > heroHeight) {
          currentAlpha = star.alpha * fadeProgress;
        }

        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = "#f0e8d6";
        ctx.beginPath();
        ctx.arc(star.x, screenY, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    requestAnimationFrame(animate);
  }
  animate();
})();
