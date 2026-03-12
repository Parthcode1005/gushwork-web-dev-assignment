/*
 * script.js
 * Main JS for the Mangalam HDPE Pipes product page.
 * Covers sticky header, hero carousel + zoom, FAQ, carousels,
 * process tabs, modals, mobile nav, and scroll animations.
 */

document.addEventListener("DOMContentLoaded", () => {
  // --- Sticky header ---
  // Shows a compact header bar once user scrolls past the hero,
  // hides it again when they scroll back up
  const stickyHeader = document.getElementById("stickyHeader");
  const mainNav = document.getElementById("mainNav");
  const heroSection = document.getElementById("heroSection");
  let lastScrollY = 0;
  let heroBottom = 0;

  function updateHeroBottom() {
    if (heroSection) {
      heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
    }
  }
  updateHeroBottom();
  window.addEventListener("resize", updateHeroBottom);

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY;

      if (currentScrollY > heroBottom && scrollingDown) {
        stickyHeader.classList.add("visible");
        mainNav.classList.add("nav-hidden");
      } else {
        stickyHeader.classList.remove("visible");
        mainNav.classList.remove("nav-hidden");
      }

      lastScrollY = currentScrollY;
    },
    { passive: true },
  );

  // --- Hero image carousel ---
  const heroImages = [
    "assets/images/hero-product.jpg",
    "assets/images/workers.jpg",
    "assets/images/engineer.jpg",
    "assets/images/hero-product.jpg",
    "assets/images/workers.jpg",
    "assets/images/engineer.jpg",
  ];
  let currentHeroIndex = 0;
  const mainImage = document.getElementById("mainImage");
  const thumbnails = document.querySelectorAll(".thumbnail");
  const heroPrev = document.getElementById("heroPrev");
  const heroNext = document.getElementById("heroNext");

  function updateHeroImage(index) {
    currentHeroIndex = index;

    // quick fade out, swap src, fade back in
    mainImage.style.opacity = "0";
    setTimeout(() => {
      mainImage.src = heroImages[index];
      mainImage.style.opacity = "1";
    }, 150);

    thumbnails.forEach((thumb, i) => {
      thumb.classList.toggle("active", i === index);
    });
  }

  if (heroPrev) {
    heroPrev.addEventListener("click", () => {
      const newIndex =
        (currentHeroIndex - 1 + heroImages.length) % heroImages.length;
      updateHeroImage(newIndex);
    });
  }

  if (heroNext) {
    heroNext.addEventListener("click", () => {
      const newIndex = (currentHeroIndex + 1) % heroImages.length;
      updateHeroImage(newIndex);
    });
  }

  thumbnails.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      const index = parseInt(thumb.dataset.index);
      updateHeroImage(index);
    });
  });

  // --- Image zoom (lens + magnified preview on hover) ---
  const mainImageContainer = document.getElementById("mainImageContainer");
  const imageLens = document.getElementById("imageLens");
  const zoomResult = document.getElementById("zoomResult");

  if (mainImageContainer && imageLens && zoomResult) {
    const ZOOM_LEVEL = 2.5;
    const LENS_SIZE = 120;

    mainImageContainer.addEventListener("mouseenter", () => {
      zoomResult.style.backgroundImage = `url('${mainImage.src}')`;
      imageLens.style.opacity = "1";
      zoomResult.style.display = "block";
    });

    mainImageContainer.addEventListener("mousemove", (e) => {
      const rect = mainImageContainer.getBoundingClientRect();
      let x = e.clientX - rect.left;
      let y = e.clientY - rect.top;

      // keep the lens within image bounds
      const halfLens = LENS_SIZE / 2;
      x = Math.max(halfLens, Math.min(x, rect.width - halfLens));
      y = Math.max(halfLens, Math.min(y, rect.height - halfLens));

      imageLens.style.left = x - halfLens + "px";
      imageLens.style.top = y - halfLens + "px";

      // calculate zoomed bg position for the preview panel
      const bgWidth = rect.width * ZOOM_LEVEL;
      const bgHeight = rect.height * ZOOM_LEVEL;
      const bgX = -(x * ZOOM_LEVEL - zoomResult.offsetWidth / 2);
      const bgY = -(y * ZOOM_LEVEL - zoomResult.offsetHeight / 2);

      zoomResult.style.backgroundSize = bgWidth + "px " + bgHeight + "px";
      zoomResult.style.backgroundPosition = bgX + "px " + bgY + "px";
    });

    mainImageContainer.addEventListener("mouseleave", () => {
      imageLens.style.opacity = "0";
      zoomResult.style.display = "none";
    });
  }

  // --- FAQ accordion ---
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const question = item.querySelector(".faq-question");
    question.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // close all first, then toggle the clicked one
      faqItems.forEach((faq) => {
        faq.classList.remove("active");
        faq.querySelector(".faq-question")?.setAttribute("aria-expanded", "false");
      });

      if (!isActive) {
        item.classList.add("active");
        question.setAttribute("aria-expanded", "true");
      }
    });
  });

  // --- Applications carousel (arrow-based, with touch) ---
  const appCarousel = document.getElementById("applicationsCarousel");
  const appPrev = document.getElementById("appPrev");
  const appNext = document.getElementById("appNext");
  let appOffset = 0;

  function getAppCardWidth() {
    const card = appCarousel?.querySelector(".app-card");
    if (!card) return 324;
    return card.offsetWidth + 24; // card + gap
  }

  function getMaxAppOffset() {
    if (!appCarousel) return 0;
    return Math.max(0, appCarousel.scrollWidth - appCarousel.parentElement.offsetWidth);
  }

  if (appPrev) {
    appPrev.addEventListener("click", () => {
      appOffset = Math.max(0, appOffset - getAppCardWidth());
      appCarousel.style.transform = `translateX(-${appOffset}px)`;
    });
  }

  if (appNext) {
    appNext.addEventListener("click", () => {
      appOffset = Math.min(getMaxAppOffset(), appOffset + getAppCardWidth());
      appCarousel.style.transform = `translateX(-${appOffset}px)`;
    });
  }

  // swipe support
  let appTouchStartX = 0;
  let appTouchEndX = 0;

  if (appCarousel) {
    appCarousel.addEventListener(
      "touchstart",
      (e) => {
        appTouchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    appCarousel.addEventListener(
      "touchend",
      (e) => {
        appTouchEndX = e.changedTouches[0].screenX;
        const diff = appTouchStartX - appTouchEndX;
        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            appOffset = Math.min(getMaxAppOffset(), appOffset + getAppCardWidth());
          } else {
            appOffset = Math.max(0, appOffset - getAppCardWidth());
          }
          appCarousel.style.transform = `translateX(-${appOffset}px)`;
        }
      },
      { passive: true },
    );
  }

  // --- Testimonials carousel ---
  // Uses native scroll so trackpad/touch works out of the box;
  // auto-scrolls every 4s and pauses on hover/touch
  const testCarousel = document.getElementById("testimonialsCarousel");
  const testWrapper = testCarousel?.closest(".testimonials-carousel-wrapper");
  let testAutoplay;

  function getTestCardWidth() {
    const card = testCarousel?.querySelector(".testimonial-card");
    if (!card) return 344;
    return card.offsetWidth + 24;
  }

  function autoScrollTestimonials() {
    testAutoplay = setInterval(() => {
      if (!testWrapper) return;
      const maxScroll = testWrapper.scrollWidth - testWrapper.clientWidth;
      if (testWrapper.scrollLeft >= maxScroll - 5) {
        testWrapper.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        testWrapper.scrollBy({ left: getTestCardWidth(), behavior: "smooth" });
      }
    }, 4000);
  }

  if (testWrapper) {
    autoScrollTestimonials();

    testWrapper.addEventListener("mouseenter", () => clearInterval(testAutoplay));
    testWrapper.addEventListener("mouseleave", () => autoScrollTestimonials());
    testWrapper.addEventListener("touchstart", () => clearInterval(testAutoplay), { passive: true });
    testWrapper.addEventListener("touchend", () => autoScrollTestimonials(), { passive: true });
  }

  // --- Manufacturing process tabs ---
  // clicking a pill or using the arrows switches the tab content + image
  const processTabs = document.querySelectorAll(".process-tab");
  const processImg = document.getElementById("processImg");

  const processData = {
    "raw-material": {
      title: "High-Grade Raw Material Selection",
      desc: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
      features: ["PE100 grade material", "Optimal molecular weight distribution"],
      image: "assets/images/hero-product.jpg",
    },
    extrusion: {
      title: "Precision Extrusion Process",
      desc: "Advanced single and twin-screw extruders melt and homogenize the raw material under carefully controlled temperature profiles.",
      features: ["Consistent melt quality", "Temperature-controlled zones"],
      image: "assets/images/workers.jpg",
    },
    cooling: {
      title: "Controlled Cooling System",
      desc: "Spray and immersion cooling baths gradually reduce pipe temperature to prevent internal stress and ensure dimensional stability.",
      features: ["Uniform cooling distribution", "Stress-free final product"],
      image: "assets/images/engineer.jpg",
    },
    sizing: {
      title: "Vacuum Sizing Technology",
      desc: "Vacuum sizing tanks ensure precise outer diameter while internal pressure maintains perfect roundness and wall thickness uniformity.",
      features: ["Precise diameter control", "Wall thickness uniformity"],
      image: "assets/images/hero-product.jpg",
    },
    "quality-control": {
      title: "Rigorous Quality Testing",
      desc: "Every batch undergoes hydrostatic pressure testing, dimensional verification, and material property analysis per international standards.",
      features: ["100% pressure tested", "IS/ISO compliant testing"],
      image: "assets/images/workers.jpg",
    },
    marking: {
      title: "Laser Marking & Identification",
      desc: "Continuous inkjet and laser marking systems print product details, batch numbers, and standards compliance directly on each pipe.",
      features: ["Permanent identification", "Full traceability"],
      image: "assets/images/engineer.jpg",
    },
    cutting: {
      title: "Precision Cutting Operations",
      desc: "Automated planetary saws deliver clean, burr-free cuts at programmed lengths with minimal material waste.",
      features: ["Automated length control", "Clean cut finish"],
      image: "assets/images/hero-product.jpg",
    },
    packaging: {
      title: "Secure Packaging & Storage",
      desc: "Finished pipes are bundled, strapped, and stored in covered warehouses to protect against UV exposure and physical damage.",
      features: ["UV protection packaging", "Safe handling procedures"],
      image: "assets/images/workers.jpg",
    },
  };

  const processTabOrder = [
    "raw-material", "extrusion", "cooling", "sizing",
    "quality-control", "marking", "cutting", "packaging",
  ];

  function setProcessTab(key) {
    processTabs.forEach((t) => t.classList.remove("active"));
    const tabEl = document.querySelector(`.process-tab[data-tab="${key}"]`);
    if (tabEl) tabEl.classList.add("active");

    const data = processData[key];
    if (!data) return;

    const processText = document.querySelector(".process-text");
    if (processText) {
      processText.querySelector("h3").textContent = data.title;
      processText.querySelector("p").textContent = data.desc;
      processText.querySelector(".process-features").innerHTML = data.features
        .map((f) => `<li><span class="dot blue"></span>${f}</li>`)
        .join("");
    }

    // fade the image out, swap, fade back in
    if (processImg) {
      processImg.style.opacity = "0";
      setTimeout(() => {
        processImg.src = data.image;
        processImg.style.opacity = "1";
      }, 200);
    }
  }

  processTabs.forEach((tab) => {
    tab.addEventListener("click", () => setProcessTab(tab.dataset.tab));
  });

  // arrows also cycle through tabs
  const processPrev = document.getElementById("processPrev");
  const processNext = document.getElementById("processNext");

  if (processPrev) {
    processPrev.addEventListener("click", () => {
      const activeTab = document.querySelector(".process-tab.active");
      const currentKey = activeTab ? activeTab.dataset.tab : processTabOrder[0];
      const idx = processTabOrder.indexOf(currentKey);
      const prevIdx = (idx - 1 + processTabOrder.length) % processTabOrder.length;
      setProcessTab(processTabOrder[prevIdx]);
    });
  }

  if (processNext) {
    processNext.addEventListener("click", () => {
      const activeTab = document.querySelector(".process-tab.active");
      const currentKey = activeTab ? activeTab.dataset.tab : processTabOrder[0];
      const idx = processTabOrder.indexOf(currentKey);
      setProcessTab(processTabOrder[(idx + 1) % processTabOrder.length]);
    });
  }

  // --- Modals ---
  const modalTriggers = document.querySelectorAll("[data-modal]");
  const modalOverlays = document.querySelectorAll(".modal-overlay");
  let lastFocusedElement = null;

  function openModal(modal) {
    lastFocusedElement = document.activeElement;
    modal.classList.add("active");
    document.body.classList.add("modal-open");
    // auto-focus the first input so user can start typing right away
    const firstInput = modal.querySelector("input, button, select, textarea");
    if (firstInput) firstInput.focus();
  }

  function closeModal(modal) {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    if (lastFocusedElement) lastFocusedElement.focus();
  }

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const modal = document.getElementById(trigger.dataset.modal);
      if (modal) openModal(modal);
    });
  });

  modalOverlays.forEach((overlay) => {
    // close when clicking the backdrop
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal(overlay);
    });

    const closeBtn = overlay.querySelector(".modal-close");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => closeModal(overlay));
    }

    const form = overlay.querySelector("form");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        closeModal(overlay);
      });
    }

    // trap focus inside the modal while it's open
    overlay.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;
      const focusable = overlay.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  });

  // esc to close any open modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      modalOverlays.forEach((overlay) => {
        if (overlay.classList.contains("active")) closeModal(overlay);
      });
    }
  });

  // --- Mobile nav (hamburger toggle) ---
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("open");
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("open");
      });
    });
  }

  // --- Contact form ---
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      btn.textContent = "Request Sent!";
      btn.style.background = "#065F46";
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        contactForm.reset();
      }, 2000);
    });
  }

  // --- Scroll-in animations ---
  // fade cards up as they enter the viewport
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" },
    );

    document
      .querySelectorAll(".feature-card, .portfolio-card, .resource-item, .faq-item, .process-card")
      .forEach((el) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        observer.observe(el);
      });
  }

  // reset carousels on resize to avoid stale offsets
  window.addEventListener("resize", () => {
    appOffset = 0;
    if (appCarousel) appCarousel.style.transform = "translateX(0)";
    if (testWrapper) testWrapper.scrollTo({ left: 0 });
  });
});
