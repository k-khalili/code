/* ============================================================
   SCROLL REVEAL — slow, deliberate
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

  // Stagger items within the same parent container
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
   FOOTER RULE DRAW — animates the horizontal line
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
   NAV — subtle active state on scroll
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
   HERO NAME — word split already in HTML, no JS needed.
   This just ensures the words are wrapped correctly.
   ============================================================ */
(function () {
  const nameEl = document.getElementById("hero-name");
  if (!nameEl) return;
  const words = nameEl.textContent.trim().split(" ");
  nameEl.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(" ");
})();


/* ============================================================
   PROJECT EXPAND (ACCORDION LOGIC)
   ============================================================ */
(function() {
  const items = document.querySelectorAll(".project-item");
  
  items.forEach(item => {
    // Make the entire card organically clickable
    item.addEventListener("click", (e) => {
      // Don't toggle if they clicked an external link (if we ever re-add one)
      if (e.target.tagName && e.target.tagName.toLowerCase() === 'a') return;

      const isExpanded = item.classList.contains("is-expanded");
      
      // Smoothly retract all other projects
      items.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove("is-expanded");
        }
      });
      
      // Toggle the targeted project
      if (isExpanded) {
        item.classList.remove("is-expanded");
      } else {
        item.classList.add("is-expanded");
      }
    });
  });

  // Collapse all projects if clicking anywhere outside of them
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".project-item")) {
      items.forEach(item => item.classList.remove("is-expanded"));
    }
  });

  // Collapse all projects if pressing the Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      items.forEach(item => item.classList.remove("is-expanded"));
    }
  });
})();


/* ============================================================
   PHOTO CAROUSEL (NATIVE SCROLL)
   ============================================================ */
(function () {
  const track = document.querySelector('.carousel-track');
  if (!track) return;

  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  
  // Calculate width of one slide + gap for scrolling
  function scrollBySlide(direction) {
    const firstSlide = track.querySelector('.carousel-slide');
    if (!firstSlide) return;
    
    // We add gap value logic accurately
    const gap = 16; 
    const scrollAmount = firstSlide.offsetWidth + gap;
    
    track.scrollBy({
      left: direction * scrollAmount,
      behavior: 'smooth'
    });
  }

  // Bind controls
  if (prevBtn) prevBtn.addEventListener('click', () => scrollBySlide(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => scrollBySlide(1));

  // Click on slide to center it
  const slides = track.querySelectorAll('.carousel-slide');
  slides.forEach(slide => {
    slide.addEventListener('click', () => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2;
      const trackCenter = track.clientWidth / 2;
      track.scrollTo({
        left: slideCenter - trackCenter,
        behavior: 'smooth'
      });
    });
  });

  // Disable/enable buttons based on scroll position
  function updateButtons() {
    if (!prevBtn || !nextBtn) return;
    const scrollLeft = track.scrollLeft;
    const maxScroll = track.scrollWidth - track.clientWidth;
    
    // Use a small buffer to account for sub-pixel rounding
    prevBtn.disabled = scrollLeft <= 2;
    nextBtn.disabled = scrollLeft >= maxScroll - 2;
  }

  track.addEventListener('scroll', updateButtons, { passive: true });
  window.addEventListener('resize', updateButtons);
  
  // Initial check (give it a tiny delay to ensure layout computation is complete)
  setTimeout(updateButtons, 50);
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
    let baseSpd = Math.random() * 0.3 + 0.05;
    let startX = Math.random() * width;
    let startY = Math.random() * docHeight;

    stars.push({
      anchorX: startX,
      anchorY: startY,
      x: startX,
      y: startY,
      size: Math.random() * 1.5,
      baseSpeed: baseSpd,
      vx: 0,
      vy: 0,
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

      // 1. Update the normal drifting anchor
      star.anchorX += star.baseSpeed * 0.2;
      star.anchorY += star.baseSpeed;

      // Wrap anchors and visual coordinates together to prevent rubber-band snapping across the whole screen length
      if (star.anchorY > docHeight + 50) {
        let offset = star.anchorY - (-10);
        star.anchorY -= offset;
        star.y -= offset;
      } else if (star.anchorY < -50) {
        let offset = (docHeight + 10) - star.anchorY;
        star.anchorY += offset;
        star.y += offset;
      }
      
      if (star.anchorX > width + 50) {
        let offset = star.anchorX - (-10);
        star.anchorX -= offset;
        star.x -= offset;
      } else if (star.anchorX < -50) {
        let offset = (width + 10) - star.anchorX;
        star.anchorX += offset;
        star.x += offset;
      }

      // 2. Calculate Spring Force (pulling them back to their natural even distribution)
      let dxAnchor = star.anchorX - star.x;
      let dyAnchor = star.anchorY - star.y;
      
      const springK = 0.018; // Stiffness of the return rubber banding
      let fx = dxAnchor * springK;
      let fy = dyAnchor * springK;
      
      // Apply net force to velocity
      star.vx += fx;
      star.vy += fy;

      // Apply heavy friction/damping so they settle smoothly into place without oscillating wildly
      star.vx *= 0.82;
      star.vy *= 0.82;

      // Apply the final velocity
      star.x += star.vx;
      star.y += star.vy;

      // Calculate screen Y based on scroll
      let screenY = star.y - scrollY;

      // Only draw if within viewport
      if (screenY >= -5 && screenY <= height + 5) {
        // Hide if below the current trickle line
        if (star.y > trickleY) return;

        let currentAlpha = star.alpha;
        
        // Stars below the hero start slightly transparent and become fully solid at 30s
        if (star.y > heroHeight) {
          currentAlpha = star.alpha * (0.15 + 0.85 * fadeProgress);
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
