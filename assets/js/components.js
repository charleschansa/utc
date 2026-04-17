(function () {
  const navItems = [
    { href: "index.html", label: "Home", key: "home" },
    { href: "about.html", label: "About Us", key: "about" },
    { href: "services.html", label: "Services", key: "services" },
    { href: "courses.html", label: "Courses", key: "courses" },
    { href: "industries.html", label: "Industries", key: "industries" },
    { href: "why-choose-us.html", label: "Why Choose Us", key: "why-choose-us" },
    { href: "contact.html", label: "Contact", key: "contact" }
  ];

  const defaults = {
    cta: {
      title: "Ready to discuss your project?",
      text: "Tell us your requirements and we will provide a practical plan tailored to your goals.",
      buttonText: "Contact Us",
      buttonHref: "contact.html"
    }
  };

  function headerMarkup(activePage) {
    const links = navItems
      .map((item) => {
        const activeClass = item.key === activePage ? "active" : "";
        return `<a class="${activeClass}" href="${item.href}">${item.label}</a>`;
      })
      .join("");

    return `
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="Ultimate Training Consultants home">
            <img class="brand-logo" src="assets/images/utc%20logo.png" alt="UTC logo" />
          </a>
          <button class="nav-toggle" type="button" aria-label="Toggle menu">
            <span class="nav-toggle-icon" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
          <nav class="site-nav" aria-label="Main navigation">${links}</nav>
        </div>
      </header>
    `;
  }

  function footerMarkup() {
    const year = new Date().getFullYear();
    return `
      <footer class="site-footer">
        <div class="container footer-grid">
          <div class="footer-panel footer-brand-panel">
            <div class="footer-brand-top">
              <img class="footer-brand-logo" src="assets/images/utc%20logo.png" alt="UTC logo" />
              <div>
                <h3>Ultimate Training Consultants</h3>
                <p>Professional, reliable solutions based on your business needs and long-term goals.</p>
              </div>
            </div>
          </div>
          <div class="footer-panel">
            <h4>Quick Links</h4>
            <div class="footer-links footer-links-quick">
              ${navItems.map((item) => `<a href="${item.href}">${item.label}</a>`).join("")}
            </div>
          </div>
          <div class="footer-panel">
            <h4>Contact</h4>
            <div class="footer-links">
              <a href="mailto:info@utc-sa.co.za">info@utc-sa.co.za</a>
              <a href="tel:+27871500724">+27 87 150 0724</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <div class="container footer-bottom-inner">
            <p class="footer-legal">&copy; ${year} Ultimate Training Consultants. All rights reserved.</p>
            <p class="footer-credit">Designed and developed by <a href="http://digitalfingerszm.netlify.app/" target="_blank" rel="noopener noreferrer">Digitalfingers Technologies</a>.</p>
          </div>
        </div>
      </footer>
    `;
  }

  function ctaMarkup(config) {
    const cta = { ...defaults.cta, ...config };
    const supportingText = cta.text ? `<p>${cta.text}</p>` : "";
    return `
      <section class="cta-wrap">
        <div class="container">
          <div class="cta">
            <div>
              <h2>${cta.title}</h2>
              ${supportingText}
            </div>
            <a class="btn btn-primary" href="${cta.buttonHref}">${cta.buttonText}</a>
          </div>
        </div>
      </section>
    `;
  }

  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const nav = document.querySelector(".site-nav");
    if (!toggle || !nav) {
      return;
    }

    toggle.addEventListener("click", function () {
      nav.classList.toggle("open");
    });
  }

  function initStickyHeaderState() {
    const header = document.querySelector(".site-header");
    if (!header) {
      return;
    }

    function updateHeaderState() {
      header.classList.toggle("is-scrolled", window.scrollY > 12);
    }

    updateHeaderState();
    window.addEventListener("scroll", updateHeaderState, { passive: true });
  }

  function initScrollProgress() {
    const existing = document.querySelector(".scroll-progress");
    if (existing) {
      return;
    }

    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    document.body.appendChild(bar);

    function updateProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable <= 0 ? 0 : Math.min(1, Math.max(0, scrollTop / scrollable));
      bar.style.transform = `scaleX(${progress})`;
    }

    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
  }

  function initRevealAnimations() {
    const revealTargets = Array.from(
      document.querySelectorAll("main section, .hero-card, .cta, .value-statement")
    );

    if (revealTargets.length === 0) {
      return;
    }

    revealTargets.forEach((element, index) => {
      element.classList.add("reveal-up");
      element.style.setProperty("--reveal-delay", `${Math.min(index * 55, 420)}ms`);
    });

    if (!("IntersectionObserver" in window)) {
      revealTargets.forEach((element) => element.classList.add("revealed"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -18px 0px" }
    );

    revealTargets.forEach((element) => observer.observe(element));
  }

  function initCardSpotlight(page) {
    if (page !== "home" || window.matchMedia("(max-width: 1024px)").matches) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const groups = [
      ...document.querySelectorAll(".services-grid-home"),
      ...document.querySelectorAll(".card-grid"),
      ...document.querySelectorAll(".events-grid"),
      ...document.querySelectorAll(".events-home-grid")
    ];

    groups.forEach((group) => {
      const cards = Array.from(group.querySelectorAll(".card"));
      if (cards.length < 2) {
        return;
      }

      let active = 0;
      cards[active].classList.add("is-spotlight");

      setInterval(() => {
        cards[active].classList.remove("is-spotlight");
        active = (active + 1) % cards.length;
        cards[active].classList.add("is-spotlight");
      }, 3200);
    });
  }

  function createIconMarkup(type) {
    const icons = {
      home:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 11h3v9h5v-6h4v6h5v-9h3L12 3Z"/></svg>',
      info:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 7h2v2h-2V7Zm0 4h2v6h-2v-6Zm1-9a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z"/></svg>',
      briefcase:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4h6v2h5a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5V4Zm2 2h2V6h-2v2Zm-7 6v6h16v-6h-5v2H9v-2H4Z"/></svg>',
      building:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21h18v-2h-2V3H9v6H5v10H3v2Zm8-16h6v14h-2v-2h-2v2h-2V5Z"/></svg>',
      star:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 6v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V6l-8-4Zm0 3 5 2.4V12c0 3.7-2.2 7.1-5 8.3-2.8-1.2-5-4.6-5-8.3V7.4L12 5Z"/></svg>',
      calendar:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2h2v2h6V2h2v2h3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h3V2Zm13 8H4v10h16V10Z"/></svg>',
      location:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5.4 7 13 7 13s7-7.6 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5Z"/></svg>',
      file:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 2h9l5 5v15a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm8 1.5V8h4.5L14 3.5Z"/></svg>',
      arrow:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4 10.6 5.4l5.6 5.6H4v2h12.2l-5.6 5.6L12 20l8-8-8-8Z"/></svg>',
      training:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 2 8l10 5 8-4v6h2V8L12 3Zm-6 8v4c0 2.7 3.1 5 6 5s6-2.3 6-5v-4l-6 3-6-3Z"/></svg>',
      team:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 11a3 3 0 1 0-2.999-3A3 3 0 0 0 16 11Zm-8 0A3 3 0 1 0 5 8a3 3 0 0 0 3 3Zm0 2c-2.33 0-7 1.17-7 3.5V19h10v-2.5C11 14.17 6.33 13 4 13Zm12 0c-.29 0-.62.02-.97.05A4.77 4.77 0 0 1 21 16.5V19h3v-2.5c0-2.33-4.67-3.5-7-3.5Z"/></svg>',
      digital:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-5l1.5 2h-9L9 18H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm0 2v9h16V7H4Z"/></svg>',
      search:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M10 2a8 8 0 1 0 4.9 14.3l5.4 5.4 1.4-1.4-5.4-5.4A8 8 0 0 0 10 2Zm0 2a6 6 0 1 1 0 12 6 6 0 0 1 0-12Z"/></svg>',
      growth:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19h16v2H2V3h2v16Zm4-4-3.5-3.5 1.4-1.4L8 12.2 12.6 7.6 15 10l4.6-4.6 1.4 1.4L15 13l-2.4-2.4L8 15Z"/></svg>',
      shield:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V5l-8-3Zm0 2.1 6 2.2V11c0 4.1-2.6 8-6 9.2C8.6 19 6 15.1 6 11V6.3l6-2.2Z"/></svg>',
      contact:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2 4h20v16H2V4Zm2 2v.5l8 5 8-5V6H4Zm16 12V8.7l-8 5-8-5V18h16Z"/></svg>',
      phone:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.62 10.79a15.1 15.1 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.24c1.12.37 2.3.56 3.52.56a1 1 0 0 1 1 1V21a1 1 0 0 1-1 1C10.49 22 2 13.51 2 3a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.22.19 2.4.56 3.52a1 1 0 0 1-.24 1l-1.2 1.27Z"/></svg>',
      clock:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm0 2a8 8 0 1 1-8 8 8 8 0 0 1 8-8Zm-1 3h2v6l4 2-1 1.7-5-2.7V7Z"/></svg>',
      mission:
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 3 7v6c0 5.2 3.6 10 9 11 5.4-1 9-5.8 9-11V7l-9-5Zm0 3.2 6 3.3V13c0 3.8-2.4 7.2-6 8.3-3.6-1.1-6-4.5-6-8.3V8.5l6-3.3Z"/></svg>'
    };

    return icons[type] || icons.mission;
  }

  function resolveIconType(title) {
    const normalized = title.toLowerCase();
    if (normalized.includes("training") || normalized.includes("course")) return "training";
    if (normalized.includes("team") || normalized.includes("partner") || normalized.includes("choose")) return "team";
    if (normalized.includes("virtual") || normalized.includes("elearning") || normalized.includes("technology")) return "digital";
    if (normalized.includes("recruit") || normalized.includes("selection") || normalized.includes("industry")) return "search";
    if (normalized.includes("performance") || normalized.includes("growth") || normalized.includes("development")) return "growth";
    if (normalized.includes("risk") || normalized.includes("quality") || normalized.includes("compliance")) return "shield";
    if (normalized.includes("email") || normalized.includes("contact")) return "contact";
    if (normalized.includes("phone") || normalized.includes("call")) return "phone";
    if (normalized.includes("office") || normalized.includes("address") || normalized.includes("map") || normalized.includes("location")) return "location";
    if (normalized.includes("hour") || normalized.includes("time")) return "clock";
    return "briefcase";
  }

  function initCardIcons() {
    const headings = document.querySelectorAll(".card h3");
    headings.forEach((heading) => {
      if (heading.querySelector(".icon-badge")) {
        return;
      }

      const type = resolveIconType(heading.textContent || "");
      const icon = document.createElement("span");
      icon.className = "icon-badge";
      icon.innerHTML = createIconMarkup(type);
      heading.prepend(icon);
    });
  }

  function iconForEyebrow(text) {
    const value = text.toLowerCase();
    if (value.includes("home")) return "home";
    if (value.includes("about")) return "info";
    if (value.includes("service")) return "briefcase";
    if (value.includes("course")) return "calendar";
    if (value.includes("event")) return "calendar";
    if (value.includes("industrie")) return "building";
    if (value.includes("why")) return "shield";
    if (value.includes("contact")) return "contact";
    return "mission";
  }

  function initEyebrowIcons() {
    const eyebrows = document.querySelectorAll(".eyebrow");
    eyebrows.forEach((eyebrow) => {
      if (eyebrow.classList.contains("no-eyebrow-icon")) {
        return;
      }
      if (eyebrow.querySelector(".eyebrow-icon")) {
        return;
      }
      const icon = document.createElement("span");
      icon.className = "eyebrow-icon";
      icon.innerHTML = createIconMarkup(iconForEyebrow(eyebrow.textContent || ""));
      eyebrow.prepend(icon);
    });
  }

  function initButtonIcons() {
    const buttons = document.querySelectorAll(".hero-actions .btn, .cta .btn");
    buttons.forEach((button) => {
      if (button.querySelector(".btn-icon")) {
        return;
      }
      const icon = document.createElement("span");
      icon.className = "btn-icon";
      icon.innerHTML = createIconMarkup("arrow");
      button.prepend(icon);
    });
  }

  function initFooterIcons() {
    const quickLinks = document.querySelectorAll(".footer-links-quick a");
    quickLinks.forEach((link) => {
      if (link.querySelector(".footer-link-icon")) {
        return;
      }
      const label = (link.textContent || "").toLowerCase();
      const type = label.includes("home")
        ? "home"
        : label.includes("about")
          ? "info"
          : label.includes("service")
            ? "briefcase"
            : label.includes("course")
              ? "calendar"
            : label.includes("industr")
              ? "building"
              : label.includes("event")
                ? "calendar"
              : label.includes("why")
                ? "shield"
                : "contact";

      const icon = document.createElement("span");
      icon.className = "footer-link-icon";
      icon.innerHTML = createIconMarkup(type);
      link.prepend(icon);
    });

    const contactLinks = document.querySelectorAll('.site-footer .footer-links a[href^="mailto:"], .site-footer .footer-links a[href^="tel:"]');
    contactLinks.forEach((link) => {
      if (link.querySelector(".footer-link-icon")) {
        return;
      }
      const type = link.getAttribute("href").startsWith("mailto:") ? "contact" : "phone";
      const icon = document.createElement("span");
      icon.className = "footer-link-icon";
      icon.innerHTML = createIconMarkup(type);
      link.prepend(icon);
    });
  }

  function initBackToTop() {
    let button = document.querySelector(".back-to-top");
    if (!button) {
      button = document.createElement("button");
      button.className = "back-to-top";
      button.type = "button";
      button.setAttribute("aria-label", "Back to top of page");
      button.setAttribute("title", "Back to top");
      button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5l-7 7 1.4 1.4L11 8.8V20h2V8.8l4.6 4.6L19 12z"/></svg><span class="back-to-top-label">Back to Top</span>';
      document.body.appendChild(button);
    }

    function toggleVisibility() {
      if (window.scrollY > 380) {
        button.classList.add("visible");
      } else {
        button.classList.remove("visible");
      }
    }

    button.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });

    toggleVisibility();
    window.addEventListener("scroll", toggleVisibility, { passive: true });
  }

  function initConferenceSlider() {
    const root = document.querySelector("[data-conference-slider]");
    if (!root) {
      return;
    }

    const track = root.querySelector(".conference-track");
    const slides = Array.from(root.querySelectorAll(".conference-slide"));
    const dots = Array.from(root.querySelectorAll(".conference-dot"));
    if (!track || slides.length === 0) {
      return;
    }

    let active = 0;

    function render(index) {
      active = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${active * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === active);
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", function () {
        render(idx);
      });
    });

    const nextButton = root.querySelector("[data-slider-next]");
    const prevButton = root.querySelector("[data-slider-prev]");

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        render(active + 1);
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        render(active - 1);
      });
    }

    render(0);
    setInterval(function () {
      render(active + 1);
    }, 4200);
  }

  function initCoursesConferenceCarousel() {
    const root = document.querySelector("[data-courses-conference-carousel]");
    if (!root) {
      return;
    }

    const track = root.querySelector(".courses-conference-track");
    const slides = Array.from(root.querySelectorAll(".courses-conference-slide"));
    const dots = Array.from(root.querySelectorAll(".courses-conference-dot"));
    if (!track || slides.length === 0) {
      return;
    }

    let active = 0;

    function render(index) {
      active = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${active * 100}%)`;
      dots.forEach((dot, idx) => {
        dot.classList.toggle("active", idx === active);
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", function () {
        render(idx);
      });
    });

    const nextButton = root.querySelector("[data-courses-next]");
    const prevButton = root.querySelector("[data-courses-prev]");

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        render(active + 1);
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        render(active - 1);
      });
    }

    render(0);
    setInterval(function () {
      render(active + 1);
    }, 4800);
  }

  function buildCourseRequestHref(card) {
    const title = (card.querySelector("h3")?.textContent || "").trim();
    const metaValues = Array.from(card.querySelectorAll(".event-meta")).map((item) => item.textContent.replace(/^\s+|\s+$/g, ""));
    const date = metaValues.find((text) => text.toLowerCase().startsWith("date:"))?.replace(/^date:\s*/i, "") || "";
    const locationText = metaValues.find((text) => text.toLowerCase().startsWith("location:"))?.replace(/^location:\s*/i, "") || "";
    const courseType = locationText.toLowerCase().includes("physical") ? "Physical" : "Virtual";
    const duration = card.querySelector("p:not(.event-meta)")?.textContent?.trim() || "";
    const price = getCoursePriceForDuration(duration);

    const params = new URLSearchParams();
    if (title) params.set("course", title);
    if (date) params.set("date", date);
    if (locationText) params.set("location", locationText);
    if (courseType) params.set("type", courseType);
    if (duration) params.set("duration", duration);
    if (price) params.set("price", price);
    params.set("source", "courses");
    return `request-training.html?${params.toString()}`;
  }

  function getCoursePriceForDuration(duration) {
    const normalized = String(duration || "").toLowerCase().replace(/\s+/g, " ").trim();
    if (normalized.includes("1 day")) return "R3,500 per person";
    if (normalized.includes("2 day")) return "R7,500 per person";
    if (normalized.includes("3 day")) return "R8,999 per person";
    return "";
  }

  function buildCoursePricingOptions(duration) {
    const price = getCoursePriceForDuration(duration);
    return {
      label: "Package Selection",
      note: "Course pricing is shown below.",
      options: [
        { value: "1 Day - R3,500 per person", label: "1 Day - R3,500 per person" },
        { value: "2 Days - R7,500 per person", label: "2 Days - R7,500 per person" },
        { value: "3 Days - R8,999 per person", label: "3 Days - R8,999 per person" }
      ]
    };
  }

  function initCoursePricingLabels(page) {
    if (page !== "courses") return;

    const cards = Array.from(document.querySelectorAll(".course-schedule-item"));
    cards.forEach((card) => {
      const durationParagraph = Array.from(card.querySelectorAll("p")).find((paragraph) =>
        paragraph.textContent.trim().toLowerCase().startsWith("duration:")
      );
      if (!durationParagraph || card.querySelector(".course-price-label")) {
        return;
      }

      const durationText = durationParagraph.textContent.replace(/^duration:\s*/i, "").trim();
      const price = getCoursePriceForDuration(durationText);
      if (!price) {
        return;
      }

      const priceLine = document.createElement("p");
      priceLine.className = "course-price-label";
      priceLine.textContent = `Price: ${price}`;
      durationParagraph.insertAdjacentElement("afterend", priceLine);
    });

    addCourseBadges(page);
  }

  function addCourseBadges(page) {
    if (page !== "courses") return;

    const cards = Array.from(document.querySelectorAll(".course-schedule-item"));
    cards.forEach((card) => {
      if (card.querySelector(".course-meta-type")) {
        return;
      }

      const locationMeta = Array.from(card.querySelectorAll(".event-meta")).find((el) =>
        el.textContent.toLowerCase().includes("location:")
      );

      if (!locationMeta) {
        return;
      }

      const locationText = locationMeta.textContent.toLowerCase();
      const courseType = locationText.includes("physical") ? "Physical" : "Virtual";
      const badgeClass = courseType === "Physical" ? "physical" : "virtual";

      const metaTypeP = document.createElement("p");
      metaTypeP.className = "course-meta-type";
      metaTypeP.innerHTML = `<span class="course-type-badge ${badgeClass}">${courseType}</span>`;
      locationMeta.insertAdjacentElement("afterend", metaTypeP);
    });
  }

  function initCourseInterestLinks(page) {
    if (page !== "courses") {
      return;
    }

    const heroInterest = document.querySelector(".hero-events .hero-actions .btn.btn-primary[href='request-training.html']");
    if (heroInterest) {
      heroInterest.setAttribute("href", "request-training.html?source=courses-hero");
    }

    const cards = Array.from(document.querySelectorAll(".course-schedule-item, .event-card"));
    cards.forEach((card) => {
      const button = card.querySelector(".event-actions .btn.btn-primary[href='request-training.html']");
      if (!button) return;
      button.setAttribute("href", buildCourseRequestHref(card));
    });

    initCoursePricingLabels(page);
  }

  function initCoursesCalendar() {
    const grid = document.querySelector("[data-course-calendar]");
    const label = document.querySelector("[data-course-cal-label]");
    const popup = document.querySelector("[data-course-calendar-popup]");
    const popupContent = document.querySelector("[data-course-calendar-popup-content]");
    const popupClose = document.querySelector("[data-course-calendar-close]");
    if (!grid || !label || !popup || !popupContent || !popupClose) {
      return;
    }

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September"
    ];

    const courseEntries = [
      { title: "Strategic Planning", date: "2026-05-05", location: "Virtual", duration: "2 Days" },
      { title: "Strategic Planning", date: "2026-05-06", location: "Virtual", duration: "2 Days" },
      { title: "Workplace Ethics", date: "2026-05-12", location: "Virtual", duration: "1 Day" },
      { title: "Supervisory Skills", date: "2026-05-19", location: "Virtual", duration: "2 Days" },
      { title: "Supervisory Skills", date: "2026-05-20", location: "Virtual", duration: "2 Days" },
      { title: "Risk Management", date: "2026-06-02", location: "Virtual", duration: "2 Days" },
      { title: "Risk Management", date: "2026-06-03", location: "Virtual", duration: "2 Days" },
      { title: "Problem Solving & Decision Making", date: "2026-06-09", location: "Virtual", duration: "1 Day" },
      { title: "Negotiation Skills", date: "2026-06-16", location: "Virtual", duration: "1 Day" },
      { title: "Financial Management for Non-Financial Managers", date: "2026-07-07", location: "Virtual", duration: "2 Days" },
      { title: "Financial Management for Non-Financial Managers", date: "2026-07-08", location: "Virtual", duration: "2 Days" },
      { title: "Supply Chain Management", date: "2026-07-14", location: "Virtual", duration: "1 Day" },
      { title: "Procurement Management", date: "2026-07-21", location: "Virtual", duration: "2 Days" },
      { title: "Procurement Management", date: "2026-07-22", location: "Virtual", duration: "2 Days" },
      { title: "Human Resource Management", date: "2026-08-04", location: "Virtual", duration: "2 Days" },
      { title: "Human Resource Management", date: "2026-08-05", location: "Virtual", duration: "2 Days" },
      { title: "Labour Law", date: "2026-08-11", location: "Virtual", duration: "1 Day" },
      { title: "Employee Relations", date: "2026-08-18", location: "Virtual", duration: "1 Day" },
      { title: "Advanced Leadership", date: "2026-09-01", location: "Virtual", duration: "2 Days" },
      { title: "Advanced Leadership", date: "2026-09-02", location: "Virtual", duration: "2 Days" },
      { title: "Coaching & Mentoring", date: "2026-09-08", location: "Virtual", duration: "1 Day" },
      { title: "Workplace Diversity", date: "2026-09-15", location: "Virtual", duration: "1 Day" }
    ];

    const eventsByDate = new Map();
    courseEntries.forEach((entry) => {
      const items = eventsByDate.get(entry.date) || [];
      items.push(entry);
      eventsByDate.set(entry.date, items);
    });

    const eventMonths = Array.from(eventsByDate.keys()).map((dateText) => {
      const [year, month] = dateText.split("-").map(Number);
      return { year, month: month - 1 };
    });

    const current = new Date();
    let displayYear = current.getFullYear();
    let displayMonth = current.getMonth();
    const monthHasEvent = eventMonths.some((item) => item.year === displayYear && item.month === displayMonth);
    if (!monthHasEvent) {
      const next = eventMonths.find((item) => item.year > displayYear || (item.year === displayYear && item.month >= displayMonth));
      const fallback = next || eventMonths[0];
      if (fallback) {
        displayYear = fallback.year;
        displayMonth = fallback.month;
      }
    }

    let selectedDate = null;

    function hidePopup() {
      popup.hidden = true;
    }

    function showPopup(dateKey) {
      const entries = eventsByDate.get(dateKey) || [];
      const dateObj = new Date(`${dateKey}T00:00:00`);
      const prettyDate = `${dateObj.getDate()} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()}`;

      if (entries.length === 0) {
        popupContent.innerHTML = "<h4>No courses on this date</h4><p>Select another highlighted date to view course details.</p>";
        popup.hidden = false;
        return;
      }

      const list = entries
        .map((item) => `<li><strong>${item.title}</strong><br />Location: ${item.location}<br />Duration: ${item.duration}</li>`)
        .join("");
      popupContent.innerHTML = `<h4>${prettyDate}</h4><ul>${list}</ul>`;
      popup.hidden = false;
    }

    function renderCalendar() {
      grid.innerHTML = "";
      label.textContent = `${monthNames[displayMonth]} ${displayYear}`;

      const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      weekdays.forEach((day) => {
        const weekdayCell = document.createElement("div");
        weekdayCell.className = "courses-calendar-weekday";
        weekdayCell.textContent = day;
        grid.appendChild(weekdayCell);
      });

      const firstOfMonth = new Date(displayYear, displayMonth, 1);
      const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

      for (let i = 0; i < firstOfMonth.getDay(); i += 1) {
        const empty = document.createElement("div");
        empty.className = "courses-calendar-day is-empty";
        grid.appendChild(empty);
      }

      for (let day = 1; day <= daysInMonth; day += 1) {
        const dateKey = `${displayYear}-${String(displayMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        const button = document.createElement("button");
        button.type = "button";
        button.className = "courses-calendar-day";
        button.textContent = String(day);

        if (eventsByDate.has(dateKey)) {
          button.classList.add("has-course");
          button.setAttribute("aria-label", `View courses for ${day} ${monthNames[displayMonth]} ${displayYear}`);
          button.addEventListener("click", function () {
            selectedDate = dateKey;
            renderCalendar();
            showPopup(dateKey);
          });
        } else {
          button.setAttribute("aria-label", `No courses on ${day} ${monthNames[displayMonth]} ${displayYear}`);
        }

        if (selectedDate === dateKey) {
          button.classList.add("is-selected");
        }

        grid.appendChild(button);
      }

      if (selectedDate) {
        const selected = new Date(`${selectedDate}T00:00:00`);
        if (selected.getFullYear() !== displayYear || selected.getMonth() !== displayMonth) {
          selectedDate = null;
        }
      }
    }

    const prevButton = document.querySelector("[data-course-cal-prev]");
    const nextButton = document.querySelector("[data-course-cal-next]");

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        displayMonth -= 1;
        if (displayMonth < 0) {
          displayMonth = 11;
          displayYear -= 1;
        }
        selectedDate = null;
        hidePopup();
        renderCalendar();
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        displayMonth += 1;
        if (displayMonth > 11) {
          displayMonth = 0;
          displayYear += 1;
        }
        selectedDate = null;
        hidePopup();
        renderCalendar();
      });
    }

    popupClose.addEventListener("click", hidePopup);
    popup.addEventListener("click", function (event) {
      if (event.target === popup) {
        hidePopup();
      }
    });

    renderCalendar();
    hidePopup();
  }

  function initCoursesMonthJumps() {
    const jumpLinks = Array.from(document.querySelectorAll(".courses-month-jump a"));
    if (jumpLinks.length === 0) {
      return;
    }

    jumpLinks.forEach((link) => {
      link.addEventListener("click", function () {
        jumpLinks.forEach((item) => item.classList.remove("is-active"));
        link.classList.add("is-active");
      });
    });
  }

  function initBackgroundEffects() {
    if (document.querySelector(".site-bg-effects")) {
      return;
    }

    const body = document.body;
    const pageTheme = body.classList.contains("services-page")
      ? "theme-services"
      : body.classList.contains("courses-page")
        ? "theme-courses"
        : body.classList.contains("industries-page")
          ? "theme-industries"
          : body.classList.contains("about-page")
            ? "theme-about"
            : body.classList.contains("why-page")
              ? "theme-why"
              : body.classList.contains("contact-page")
                ? "theme-contact"
                : "theme-home";

    const layer = document.createElement("div");
    layer.className = `site-bg-effects ${pageTheme}`;
    layer.setAttribute("aria-hidden", "true");

    const baseShapes = [
      { type: "is-circle", size: 180, left: "6%", top: "14%", duration: "32s", delay: "0s", rotate: "0deg", opacity: 0.14 },
      { type: "is-diamond", size: 120, left: "22%", top: "70%", duration: "28s", delay: "-6s", rotate: "45deg", opacity: 0.12 },
      { type: "is-icon", size: 96, left: "42%", top: "18%", duration: "26s", delay: "-4s", rotate: "8deg", opacity: 0.13 },
      { type: "is-circle", size: 140, left: "62%", top: "74%", duration: "34s", delay: "-8s", rotate: "0deg", opacity: 0.12 },
      { type: "is-diamond", size: 110, left: "78%", top: "24%", duration: "30s", delay: "-3s", rotate: "45deg", opacity: 0.14 },
      { type: "is-icon", size: 88, left: "90%", top: "66%", duration: "24s", delay: "-10s", rotate: "-8deg", opacity: 0.11 },
      { type: "is-circle", size: 100, left: "34%", top: "46%", duration: "29s", delay: "-7s", rotate: "0deg", opacity: 0.1 },
      { type: "is-diamond", size: 92, left: "12%", top: "44%", duration: "27s", delay: "-5s", rotate: "45deg", opacity: 0.11 }
    ];

    const paletteByTheme = {
      "theme-home": baseShapes,
      "theme-about": baseShapes.map((item, index) => ({
        ...item,
        opacity: Math.min(0.24, item.opacity + 0.04),
        duration: `${30 + (index % 5) * 2}s`
      })),
      "theme-services": baseShapes.map((item, index) => ({
        ...item,
        size: item.size + (index % 2 === 0 ? 12 : -6),
        opacity: Math.min(0.26, item.opacity + 0.06)
      })),
      "theme-courses": baseShapes.map((item, index) => ({
        ...item,
        opacity: Math.min(0.28, item.opacity + 0.08),
        rotate: index % 3 === 0 ? "12deg" : item.rotate
      })),
      "theme-industries": baseShapes.map((item, index) => ({
        ...item,
        opacity: Math.min(0.24, item.opacity + 0.05),
        left: index % 2 === 0 ? item.left : `${Math.max(4, Number.parseInt(item.left, 10) - 4)}%`
      })),
      "theme-why": baseShapes.map((item) => ({ ...item, opacity: Math.min(0.24, item.opacity + 0.05) })),
      "theme-contact": baseShapes.map((item, index) => ({
        ...item,
        size: item.size + (index % 3 === 1 ? 8 : 0),
        opacity: Math.min(0.23, item.opacity + 0.04)
      }))
    };

    const shapes = paletteByTheme[pageTheme] || baseShapes;

    shapes.forEach((shape) => {
      const node = document.createElement("span");
      node.className = `site-bg-shape ${shape.type}`;
      node.style.setProperty("--shape-size", `${shape.size}px`);
      node.style.setProperty("--shape-left", shape.left);
      node.style.setProperty("--shape-top", shape.top);
      node.style.setProperty("--shape-duration", shape.duration);
      node.style.setProperty("--shape-delay", shape.delay);
      node.style.setProperty("--shape-rotate", shape.rotate);
      node.style.setProperty("--shape-opacity", String(shape.opacity));
      layer.appendChild(node);
    });

    document.body.prepend(layer);
  }

  function initImagePerformance() {
    const images = Array.from(document.querySelectorAll("img"));
    if (images.length === 0) {
      return;
    }

    images.forEach((img, index) => {
      img.decoding = "async";

      if (index === 0) {
        img.loading = "eager";
        img.fetchPriority = "high";
      } else {
        img.loading = "lazy";
        img.fetchPriority = "low";
      }
    });
  }

  function initPage(options) {
    const config = options || {};
    const page = config.page || "";

    const headerTarget = document.getElementById("site-header");
    const footerTarget = document.getElementById("site-footer");
    const ctaTarget = document.getElementById("site-cta");

    if (headerTarget) {
      headerTarget.innerHTML = headerMarkup(page);
    }

    if (ctaTarget) {
      ctaTarget.innerHTML = ctaMarkup(config.cta || {});
    }

    if (footerTarget) {
      footerTarget.innerHTML = footerMarkup();
    }

    initMobileNav();
    initStickyHeaderState();
    initScrollProgress();
    initRevealAnimations();
    initCardSpotlight(page);
    initCardIcons();
    initEyebrowIcons();
    initButtonIcons();
    initFooterIcons();
    initBackToTop();
    initConferenceSlider();
    initCoursesConferenceCarousel();
    initCoursesCalendar();
    initCoursesMonthJumps();
    initImagePerformance();
    initBackgroundEffects();
    initContactForm(page);
    initGalaRegistrationForm(page);
    initCourseInterestLinks(page);
  }

  function initContactForm(page) {
    if (page !== 'contact') return;

    const form = document.querySelector('[data-contact-form]');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Get form elements
      const submitBtn = form.querySelector('[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      // Disable button and show loading state
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Create FormData from form
      const formData = new FormData(form);

      try {
        // Submit form via fetch
        const response = await fetch(form.action, {
          method: 'POST',
          body: formData
        });

        const data = await response.json();

        if (data.success) {
          // Show success message
          showFormFeedback(form, 'success', data.message);
          
          // Reset form
          form.reset();
          
          // Scroll to feedback
          const feedback = form.querySelector('[data-form-feedback]');
          if (feedback) {
            feedback.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        } else {
          // Show error messages
          const errorList = data.errors ? data.errors.join(', ') : data.message;
          showFormFeedback(form, 'error', errorList);
        }
      } catch (error) {
        showFormFeedback(form, 'error', 'An error occurred. Please try again.');
      } finally {
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  function showFormFeedback(form, type, message) {
    // Remove existing feedback
    const existing = form.querySelector('[data-form-feedback]');
    if (existing) {
      existing.remove();
    }

    // Create feedback element
    const feedback = document.createElement('div');
    feedback.setAttribute('data-form-feedback', type);
    feedback.className = `form-feedback form-feedback-${type}`;
    feedback.textContent = message;
    feedback.setAttribute('role', 'alert');
    feedback.setAttribute('aria-live', 'polite');

    // Insert after form
    form.parentNode.insertBefore(feedback, form.nextSibling);

    // Auto-remove success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        feedback.remove();
      }, 5000);
    }
  }

  function initGalaRegistrationForm(page) {
    if (page !== "request-training") return;

    const form = document.querySelector("[data-registration-form]");
    if (!form) return;

    const steps = Array.from(form.querySelectorAll(".registration-step"));
    const progressItems = Array.from(document.querySelectorAll("[data-registration-progress] li"));
    const nextButton = form.querySelector("[data-step-next]");
    const backButton = form.querySelector("[data-step-back]");
    const submitButton = form.querySelector("[data-step-submit]");
    const submitLabel = form.querySelector("[data-submit-text]");
    const packageField = form.querySelector("#package_selection");
    const tableCountWrap = form.querySelector("[data-table-count-wrap]");
    const tableCountInput = form.querySelector("#table_count");
    const termsCheckbox = form.querySelector("#terms_accepted");
    const summaryBox = form.querySelector("[data-registration-summary]");
    const sourceField = form.querySelector("[data-registration-source]");
    const eventField = form.querySelector("[data-registration-event]");
    const courseNameField = form.querySelector("[data-course-name]");
    const courseDateField = form.querySelector("[data-course-date]");
    const courseLocationField = form.querySelector("[data-course-location]");
    const courseDurationField = form.querySelector("[data-course-duration]");
    const courseTypeField = form.querySelector("[data-course-type]");
    const selectedCoursePanel = form.querySelector("[data-selected-course-panel]");
    const selectedCourseTitle = form.querySelector("[data-selected-course-title]");
    const selectedCourseSummary = form.querySelector("[data-selected-course-summary]");
    const packageLabel = form.querySelector("[data-package-label]");
    const pricingNote = form.querySelector("[data-package-pricing-note]");

    if (!steps.length || !nextButton || !backButton || !submitButton || !packageField || !tableCountWrap || !tableCountInput || !termsCheckbox || !summaryBox) {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    const initialEventKey = params.get("event") || "";
    const initialCourseName = params.get("course") || "";
    const initialCourseDate = params.get("date") || "";
    const initialCourseLocation = params.get("location") || "";
    const initialCourseDuration = params.get("duration") || "";
    const initialCourseType = params.get("type") || "";
    const initialSource = params.get("source") || "manual";
    const initialCoursePrice = params.get("price") || getCoursePriceForDuration(initialCourseDuration);

    const eventPricingOptions = {
      "hr-gala": {
        label: "Pricing Option",
        note: "HR Leadership Gala pricing is shown below.",
        options: [
          { value: "Standard Ticket - R1,800.00 per attendee", label: "Standard Ticket - R1,800.00 per attendee" },
          { value: "VIP Ticket - R2,500.00 per attendee", label: "VIP Ticket - R2,500.00 per attendee" },
          { value: "Table Booking - R16,000.00 (Seats 10)", label: "Table Booking - R16,000.00 (Seats 10)" }
        ]
      },
      "secretarial-symposium": {
        label: "Pricing Option",
        note: "Symposium pricing is shown below.",
        options: [
          { value: "Investment - R13,500.00 per delegate", label: "Investment - R13,500.00 per delegate" }
        ]
      }
    };

    const coursePricingOptions = buildCoursePricingOptions(initialCourseDuration);
    const selectedPricing = initialEventKey 
      ? (eventPricingOptions[initialEventKey] || coursePricingOptions) 
      : coursePricingOptions;

    let currentStep = 1;

    function renderPackageOptions() {
      if (!packageField) return;

      packageField.innerHTML = ["<option value=\"\">Select package</option>", ...selectedPricing.options.map((option) => `<option value="${option.value}">${option.label}</option>`)].join("");

      if (initialCourseDuration) {
        const durationText = initialCourseDuration.toLowerCase().replace("duration: ", "").trim();
        const matchingOption = selectedPricing.options.find((opt) => opt.value.toLowerCase().includes(durationText));
        if (matchingOption) {
          packageField.value = matchingOption.value;
        }
      }

      if (packageLabel) {
        packageLabel.textContent = selectedPricing.label;
      }

      if (pricingNote) {
        pricingNote.textContent = selectedPricing.note;
      }
    }

    function updateCourseContext() {
      if (sourceField) sourceField.value = initialSource;
      if (eventField) eventField.value = initialEventKey;
      if (courseNameField) courseNameField.value = initialCourseName;
      if (courseDateField) courseDateField.value = initialCourseDate;
      if (courseLocationField) courseLocationField.value = initialCourseLocation;
      if (courseDurationField) courseDurationField.value = initialCourseDuration;
      if (courseTypeField) courseTypeField.value = initialCourseType;

      if (!selectedCoursePanel || !selectedCourseSummary) {
        return;
      }

      if (initialCourseName) {
        const lines = [initialCourseName];
        if (initialCourseType) lines.push(`[${initialCourseType}]`);
        if (initialCourseDate) lines.push(initialCourseDate);
        if (initialCourseDuration) lines.push(initialCourseDuration);
        selectedCourseSummary.textContent = lines.join(" · ");
        if (selectedCourseTitle) {
          selectedCourseTitle.textContent = initialEventKey ? "Selected Event" : "Selected Course";
        }
        selectedCoursePanel.classList.add("has-course");
      } else {
        selectedCourseSummary.textContent = initialEventKey
          ? "No event selected yet. Open an event from the Events page to prefill details."
          : "No course selected yet. Open a course from the Courses page to prefill details.";
        if (selectedCourseTitle) {
          selectedCourseTitle.textContent = initialEventKey ? "Selected Event" : "Selected Course";
        }
        selectedCoursePanel.classList.remove("has-course");
      }
    }

    function updatePackageFields() {
      const isTable = /table/i.test(packageField.value);
      tableCountWrap.hidden = !isTable;
      tableCountInput.required = isTable;
      if (!isTable) {
        tableCountInput.value = "";
      }
    }

    function updateSummary() {
      const data = new FormData(form);
      const rows = [
        ["Course/Program", data.get("course_name") || "-"],
        ["Course Date", data.get("course_date") || "-"],
        ["Course Location", data.get("course_location") || "-"],
        ["Course Duration", data.get("course_duration") || "-"],
        ["Company", data.get("company_name") || "-"],
        ["Company Email", data.get("company_email") || "-"],
        ["Company Phone", data.get("company_phone") || "-"],
        ["Delegates", data.get("delegate_count") || "-"],
        ["Package", data.get("package_selection") || "-"],
        ["Tables", data.get("table_count") || "-"],
        ["Authorising Manager", data.get("manager_name") || "-"],
        ["Manager Email", data.get("manager_email") || "-"],
        ["Manager Phone", data.get("manager_phone") || "-"],
        ["Designation", data.get("manager_designation") || "-"]
      ];

      summaryBox.innerHTML = rows
        .map(([label, value]) => `<p><strong>${label}:</strong> ${value}</p>`)
        .join("");
    }

    function showStep(step) {
      currentStep = step;

      steps.forEach((panel, idx) => {
        const active = idx + 1 === step;
        panel.hidden = !active;
        panel.classList.toggle("is-active", active);
      });

      progressItems.forEach((item, idx) => {
        item.classList.toggle("is-active", idx + 1 === step);
        item.classList.toggle("is-complete", idx + 1 < step);
      });

      backButton.hidden = step === 1;
      nextButton.hidden = step === steps.length;
      submitButton.hidden = step !== steps.length;

      if (step === steps.length) {
        updateSummary();
      }

      submitButton.disabled = !(termsCheckbox.checked && step === steps.length);
    }

    function validateCurrentStep() {
      const panel = steps[currentStep - 1];
      const fields = Array.from(panel.querySelectorAll("input, select, textarea"));
      for (const field of fields) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return false;
        }
      }
      return true;
    }

    renderPackageOptions();
    packageField.addEventListener("change", updatePackageFields);
    termsCheckbox.addEventListener("change", () => {
      submitButton.disabled = !(termsCheckbox.checked && currentStep === steps.length);
    });

    nextButton.addEventListener("click", () => {
      updatePackageFields();
      if (!validateCurrentStep()) return;
      showStep(Math.min(steps.length, currentStep + 1));
    });

    backButton.addEventListener("click", () => {
      showStep(Math.max(1, currentStep - 1));
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!validateCurrentStep()) return;
      if (!termsCheckbox.checked) {
        termsCheckbox.reportValidity();
        return;
      }

      submitButton.disabled = true;
      if (submitLabel) submitLabel.textContent = "Submitting...";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form)
        });
        const data = await response.json();

        if (data.success) {
          showFormFeedback(form, "success", data.message || "Registration submitted successfully.");
          form.reset();
          updatePackageFields();
          showStep(1);
        } else {
          const errorText = data.errors ? data.errors.join(", ") : (data.message || "Unable to submit registration.");
          showFormFeedback(form, "error", errorText);
          submitButton.disabled = false;
        }
      } catch (error) {
        showFormFeedback(form, "error", "An error occurred while submitting your registration.");
        submitButton.disabled = false;
      } finally {
        if (submitLabel) submitLabel.textContent = "Submit Registration";
      }
    });

    updatePackageFields();
    updateCourseContext();
    showStep(1);
  }

  window.UTCComponents = {
    initPage
  };
})();

