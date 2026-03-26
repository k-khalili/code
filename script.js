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
