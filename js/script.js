/* ==========================================================================
   js/script.js — JHON MARK L. LUMIBAO · PERSONAL SPACE
   --------------------------------------------------------------------------
   Plain JavaScript, no libraries. Each feature is its own small function so
   one broken piece can never take the whole site down, and so you can delete
   a feature by deleting its init call at the bottom.

   WHAT LIVES HERE
   ---------------
   01. Helpers
   02. Theme (light / dark) + localStorage
   03. Preloader
   04. Mobile menu
   05. Smooth in-page scrolling
   06. Scroll state: nav shadow, reading progress, active link, back-to-top
   07. Typing animation in the hero
   08. Scroll-reveal animations (IntersectionObserver)
   09. Gallery filters
   10. Gallery lightbox (keyboard, swipe, focus trap)
   11. Copy-to-clipboard + toast
   12. Footer year
   13. Time-of-day greeting
   14. Calm mode (the manual "fewer effects" switch)
   15. Small performance guards (pause work that is off-screen)

   LOOKING FOR SOMETHING TO CHANGE?
   --------------------------------
   • Typing phrases .............. ROLES in initTyping()
   • Theme storage name ......... THEME_KEY in initTheme()
   • Calm storage name .......... CALM_KEY in initCalmMode()
   • Reveal speed/stagger ....... REVEAL_STAGGER below
   • Animation timings .......... css/style.css, section 20
   ========================================================================== */
(function () {
  "use strict";

  /* ========================================================================
     01. HELPERS
     ======================================================================== */
  var $ = function (selector, context) {
    return (context || document).querySelector(selector);
  };

  var $$ = function (selector, context) {
    return Array.prototype.slice.call((context || document).querySelectorAll(selector));
  };

  var root = document.documentElement;

  /* A live check, so changes to the OS setting are respected immediately */
  var motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  var prefersReducedMotion = function () {
    return motionQuery.matches;
  };

  /* Calm mode is a manual preference, so it counts alongside the OS setting */
  var calmEnabled = function () {
    return root.getAttribute("data-calm") === "true";
  };

  /* Run an init function safely: an error is logged, never thrown globally */
  var safe = function (name, init) {
    try {
      init();
    } catch (error) {
      console.warn("[personal-space] " + name + " could not start:", error);
    }
  };

  /* ========================================================================
     02. THEME
     ------------------------------------------------------------------------
     The <head> applies the saved theme before first paint to avoid a flash.
     Here we keep the toggle button, the meta theme-color and localStorage in
     sync, and follow the OS setting while the visitor has not chosen yet.
     ======================================================================== */
  var THEME_KEY = "jml-theme";

  function initTheme() {
    var toggle = $("#theme-toggle");
    var metaTheme = $('meta[name="theme-color"]');
    var media = window.matchMedia("(prefers-color-scheme: dark)");

    function readSaved() {
      try {
        return window.localStorage.getItem(THEME_KEY);
      } catch (error) {
        return null;
      }
    }

    function save(theme) {
      try {
        window.localStorage.setItem(THEME_KEY, theme);
      } catch (error) {
        /* Private mode can block storage — the theme still works this visit. */
      }
    }

    function apply(theme, persist) {
      var isDark = theme === "dark";

      root.setAttribute("data-theme", theme);

      if (toggle) {
        toggle.setAttribute("aria-pressed", String(isDark));
        toggle.setAttribute(
          "aria-label",
          isDark ? "Switch to light mode" : "Switch to dark mode"
        );
        toggle.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
      }

      if (metaTheme) {
        metaTheme.setAttribute("content", isDark ? "#050b17" : "#eef5ff");
      }

      if (persist) {
        save(theme);
      }
    }

    /* The inline head script has already decided the first theme. */
    apply(root.getAttribute("data-theme") === "dark" ? "dark" : "light", false);

    if (toggle) {
      toggle.addEventListener("click", function () {
        var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        apply(next, true);
      });
    }

    /* If the visitor has no saved choice, follow their system preference. */
    var onSystemChange = function (event) {
      if (!readSaved()) {
        apply(event.matches ? "dark" : "light", false);
      }
    };

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", onSystemChange);
    } else if (typeof media.addListener === "function") {
      media.addListener(onSystemChange);
    }
  }

  /* ========================================================================
     03. PRELOADER
     ======================================================================== */
  function initPreloader() {
    var preloader = $("#preloader");
    if (!preloader) return;

    var removed = false;

    function remove() {
      if (removed) return;
      removed = true;
      preloader.classList.add("is-done");
      window.setTimeout(function () {
        if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
      }, 700);
    }

    if (prefersReducedMotion()) {
      remove();
      return;
    }

    var startedAt = Date.now();
    var MIN_VISIBLE = 700; // just enough to feel intentional, never sluggish

    function finish() {
      var elapsed = Date.now() - startedAt;
      window.setTimeout(remove, Math.max(0, MIN_VISIBLE - elapsed));
    }

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    /* Hard safety net: never keep a visitor behind the curtain */
    window.setTimeout(remove, 4000);
  }

  /* ========================================================================
     04. MOBILE MENU
     ======================================================================== */
  function initMobileMenu() {
    var toggle = $("#menu-toggle");
    var menu = $("#mobile-menu");
    var header = $("#site-nav");
    if (!toggle || !menu || !header) return;

    var isOpen = false;

    function focusables() {
      return $$("a[href], button:not([disabled])", menu);
    }

    function setOpen(open, returnFocus) {
      isOpen = open;

      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      header.classList.toggle("menu-open", open);
      document.body.classList.toggle("no-scroll", open);

      if (open) {
        menu.hidden = false;
        var first = focusables()[0];
        if (first) {
          window.setTimeout(function () {
            first.focus({ preventScroll: true });
          }, 60);
        }
      } else {
        menu.hidden = true;
        if (returnFocus) toggle.focus({ preventScroll: true });
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!isOpen, false);
    });

    /* Any link inside the menu closes it and lets the anchor do its job */
    $$("a", menu).forEach(function (link) {
      link.addEventListener("click", function () {
        setOpen(false, false);
      });
    });

    document.addEventListener("click", function (event) {
      if (!isOpen) return;
      if (!header.contains(event.target)) setOpen(false, false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen) {
        setOpen(false, true);
      }
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 980 && isOpen) setOpen(false, false);
    });
  }

  /* ========================================================================
     05. SMOOTH IN-PAGE SCROLLING
     ------------------------------------------------------------------------
     Native smooth scrolling does the heavy lifting; this also moves keyboard
     focus to the target heading so screen-reader users land in the right
     place, and updates the address bar without a second jump.
     ======================================================================== */
  function initSmoothScroll() {
    $$('a[href^="#"]').forEach(function (link) {
      link.addEventListener("click", function (event) {
        var hash = link.getAttribute("href");
        if (!hash || hash === "#") return;

        var target;
        try {
          target = document.querySelector(hash);
        } catch (error) {
          return; // Ignore malformed selectors
        }
        if (!target) return;

        event.preventDefault();

        var reduce = prefersReducedMotion();
        target.scrollIntoView({
          behavior: reduce ? "auto" : "smooth",
          block: "start"
        });

        /* Move focus after the jump so it does not scroll a second time */
        var heading = target.querySelector("h1, h2, h3");
        var focusTarget = heading || target;
        if (!focusTarget.hasAttribute("tabindex")) {
          focusTarget.setAttribute("tabindex", "-1");
        }
        window.setTimeout(
          function () {
            focusTarget.focus({ preventScroll: true });
          },
          reduce ? 0 : 450
        );

        try {
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, "", hash);
          }
        } catch (error) {
          /* Some browsers block history changes on file:// — not important. */
        }
      });
    });

    /* Any element with data-scroll-top returns to the top */
    $$("[data-scroll-top]").forEach(function (button) {
      button.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth"
        });
      });
    });
  }

  /* ========================================================================
     06. SCROLL STATE — nav shadow, reading progress, active link, to-top
     ======================================================================== */
  function initScrollState() {
    var nav = $("#site-nav");
    var navProgress = $("#nav-progress");
    var toTop = $("#to-top");
    var toTopRing = $("#to-top-ring");
    var navLinks = $$(".nav__link");
    var mobileLinks = $$(".mobile-menu__links a");
    var circleLength = 2 * Math.PI * 20; // r = 20 in the SVG

    var sections = navLinks
      .map(function (link) {
        var id = link.getAttribute("href");
        var section = id && id.charAt(0) === "#" ? $(id) : null;
        if (!section) return null;

        var sectionId = id.slice(1);
        var twins = mobileLinks.filter(function (mobileLink) {
          return mobileLink.getAttribute("href") === id;
        });

        return { id: sectionId, section: section, links: [link].concat(twins) };
      })
      .filter(Boolean);

    var ticking = false;

    function setActive(id) {
      sections.forEach(function (entry) {
        var active = entry.id === id;

        entry.links.forEach(function (link) {
          link.classList.toggle("is-active", active);
          if (active) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }

    function update() {
      ticking = false;

      var scrollY = window.scrollY || window.pageYOffset;
      var viewport = window.innerHeight;
      var docHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      );

      if (nav) {
        nav.classList.toggle("is-scrolled", scrollY > 8);
      }

      var maxScroll = docHeight - viewport;
      var progress = maxScroll > 0 ? Math.min(1, Math.max(0, scrollY / maxScroll)) : 0;

      if (navProgress) {
        navProgress.style.transform = "scaleX(" + progress.toFixed(4) + ")";
      }

      if (toTop) {
        toTop.classList.toggle("is-visible", scrollY > 620);
      }

      if (toTopRing) {
        toTopRing.style.strokeDashoffset = String(circleLength * (1 - progress));
      }

      /* Active section: whichever section starts above the reading line */
      if (sections.length) {
        var line = scrollY + viewport * 0.34;
        var current = sections[0].id;

        sections.forEach(function (entry) {
          if (entry.section.offsetTop <= line) {
            current = entry.id;
          }
        });

        /* Near the bottom, the last section wins even if it is short */
        if (maxScroll > 0 && scrollY >= maxScroll - 4) {
          current = sections[sections.length - 1].id;
        }

        setActive(current);
      }
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    window.addEventListener("load", requestUpdate);

    if (toTop) {
      toTop.addEventListener("click", function () {
        window.scrollTo({
          top: 0,
          behavior: prefersReducedMotion() ? "auto" : "smooth"
        });
      });
    }

    update();
  }

  /* ========================================================================
     07. TYPING ANIMATION
     ------------------------------------------------------------------------
     [EDIT] Change the list below to whatever describes you best.
     ======================================================================== */
  function initTyping() {
    var element = $("#typed");
    if (!element) return;

    var ROLES = [
      "a BSIT student",
      "an aspiring developer",
      "a technology enthusiast",
      "a creative soul"
    ];

    var TYPE_MS = 62;
    var DELETE_MS = 30;
    var HOLD_MS = 2100;
    var GAP_MS = 420;

    var roleIndex = 0;
    var charIndex = ROLES[0].length;
    var deleting = false;
    var timer = null;
    var stopped = false;

    element.textContent = ROLES[0];

    function schedule(delay) {
      timer = window.setTimeout(tick, delay);
    }

    function tick() {
      if (stopped) return;

      var word = ROLES[roleIndex];

      if (!deleting) {
        charIndex += 1;
        element.textContent = word.slice(0, charIndex);

        if (charIndex >= word.length) {
          deleting = true;
          schedule(HOLD_MS);
          return;
        }
        schedule(TYPE_MS + Math.random() * 40);
        return;
      }

      charIndex -= 1;
      element.textContent = word.slice(0, Math.max(0, charIndex));

      if (charIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % ROLES.length;
        schedule(GAP_MS);
        return;
      }
      schedule(DELETE_MS);
    }

    function start() {
      if (timer) window.clearTimeout(timer);
      stopped = false;
      if (prefersReducedMotion() || calmEnabled()) {
        stopped = true;
        element.textContent = ROLES[0];
        return;
      }
      schedule(HOLD_MS);
    }

    start();

    var onMotionChange = function () {
      if (timer) window.clearTimeout(timer);
      if (prefersReducedMotion()) {
        stopped = true;
        element.textContent = ROLES[0];
      } else {
        start();
      }
    };

    if (typeof motionQuery.addEventListener === "function") {
      motionQuery.addEventListener("change", onMotionChange);
    }

    document.addEventListener("calmchange", start);

    /* Stop the timer while the hero is off-screen. The effect is invisible
       there, so there is no reason to keep updating text every 60ms. */
    if ("IntersectionObserver" in window) {
      var hero = $("#home");
      if (hero) {
        new IntersectionObserver(
          function (entries) {
            if (entries[0].isIntersecting) {
              start();
            } else if (timer) {
              window.clearTimeout(timer);
              stopped = true;
            }
          },
          { threshold: 0.02 }
        ).observe(hero);
      }
    }
  }

  /* ========================================================================
     08. SCROLL REVEALS
     ------------------------------------------------------------------------
     Elements with [data-reveal] fade/blur up when they enter the viewport.
     Children of [data-reveal-group] are staggered slightly.
     The .js class is only added once this function is ready, so if the script
     fails the content stays visible instead of being stuck at opacity 0.
     ======================================================================== */
  var REVEAL_STAGGER = 70; // milliseconds between grouped cards

  function initReveals() {
    var items = $$("[data-reveal]");
    if (!items.length) return;

    var canObserve = "IntersectionObserver" in window;

    /* Reduced motion, or an old browser: show everything immediately */
    if (!canObserve || prefersReducedMotion()) {
      root.classList.add("js");
      items.forEach(function (item) {
        item.classList.add("is-revealed");
      });
      return;
    }

    root.classList.add("js");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          var item = entry.target;
          var group = item.closest("[data-reveal-group]");
          var delay = 0;

          if (group) {
            var siblings = $$("[data-reveal]", group);
            var index = siblings.indexOf(item);
            delay = Math.min(index, 8) * REVEAL_STAGGER;
          }

          window.setTimeout(function () {
            item.classList.add("is-revealed");
          }, delay);

          observer.unobserve(item);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    items.forEach(function (item) {
      observer.observe(item);
    });

    /* If the page opens mid-way down (a bookmark), reveal what is visible */
    window.setTimeout(function () {
      items.forEach(function (item) {
        var rect = item.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          item.classList.add("is-revealed");
        }
      });
    }, 600);
  }

  /* ========================================================================
     09. GALLERY FILTERS
     ======================================================================== */
  function initGalleryFilters() {
    var grid = $("#gallery-grid");
    if (!grid) return;

    var items = $$(".gallery__item", grid);
    var buttons = $$(".filter");
    var status = $("#gallery-status");
    if (!items.length || !buttons.length) return;

    var counts = { all: items.length };

    items.forEach(function (item) {
      var category = item.getAttribute("data-category") || "other";
      counts[category] = (counts[category] || 0) + 1;
    });

    /* Keep the little numbers in the filter buttons accurate */
    $$("[data-count-for]").forEach(function (element) {
      var key = element.getAttribute("data-count-for");
      element.textContent = String(counts[key] || 0);
    });

    var currentFilter = "all";
    var firstRun = true;

    function apply(filter) {
      currentFilter = filter;
      var visible = 0;

      items.forEach(function (item) {
        var show = filter === "all" || item.getAttribute("data-category") === filter;
        item.classList.toggle("is-hidden", !show);

        if (show) {
          visible += 1;

          /* Items hidden during the initial reveal still need to appear */
          if (!item.classList.contains("is-revealed") && !firstRun) {
            item.classList.add("is-revealed");
          }

          if (!firstRun) {
            item.classList.remove("is-appearing");
            /* Reading offsetWidth restarts the CSS animation */
            void item.offsetWidth;
            item.classList.add("is-appearing");
          }
        }
      });

      buttons.forEach(function (button) {
        var active = button.getAttribute("data-filter") === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      if (status) {
        status.textContent =
          "Showing " + visible + (visible === 1 ? " item" : " items") +
          (filter === "all" ? "." : " in " + filter + ".");
      }

      firstRun = false;
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        apply(button.getAttribute("data-filter") || "all");
      });
    });

    /* Set the initial counts/labels without re-animating everything */
    buttons.forEach(function (button) {
      var active = button.getAttribute("data-filter") === currentFilter;
      button.setAttribute("aria-pressed", String(active));
    });
  }

  /* ========================================================================
     10. LIGHTBOX
     ======================================================================== */
  function initLightbox() {
    var lightbox = $("#lightbox");
    if (!lightbox) return;

    var dialog = $(".lightbox__dialog", lightbox);
    var image = $("#lightbox-image");
    var title = $("#lightbox-title");
    var caption = $("#lightbox-caption");
    var category = $("#lightbox-cat");
    var indexLabel = $("#lightbox-index");
    var totalLabel = $("#lightbox-total");
    var closeButton = $(".lightbox__close", lightbox);
    var prevButton = $("#lightbox-prev");
    var nextButton = $("#lightbox-next");

    var items = $$(".gallery__item");
    if (!items.length || !image || !title || !caption) return;

    var visibleItems = [];
    var currentIndex = 0;
    var lastFocused = null;
    var isOpen = false;

    var pageRegions = [$("#main"), $("#site-nav"), $(".footer")];

    function collectVisible() {
      visibleItems = items.filter(function (item) {
        return !item.classList.contains("is-hidden");
      });
    }

    function render(index) {
      if (!visibleItems.length) return;

      currentIndex = (index + visibleItems.length) % visibleItems.length;
      var item = visibleItems[currentIndex];
      var thumb = $("img", item);

      var src = item.getAttribute("href");
      var label = item.getAttribute("data-title") || "";
      var description = item.getAttribute("data-caption") || "";
      var itemCategory = item.getAttribute("data-category") || "";

      image.classList.add("is-swapping");
      image.src = src;
      image.alt = thumb ? thumb.getAttribute("alt") || label : label;
      image.onload = function () {
        image.classList.remove("is-swapping");
      };
      image.onerror = function () {
        image.classList.remove("is-swapping");
      };

      title.textContent = label;
      caption.textContent = description;
      category.textContent =
        itemCategory.charAt(0).toUpperCase() + itemCategory.slice(1);

      if (indexLabel) indexLabel.textContent = String(currentIndex + 1);
      if (totalLabel) totalLabel.textContent = String(visibleItems.length);

      var single = visibleItems.length < 2;
      if (prevButton) prevButton.disabled = single;
      if (nextButton) nextButton.disabled = single;
    }

    function trapFocus(event) {
      var focusables = [];
      if (closeButton) focusables.push(closeButton);
      if (prevButton && !prevButton.disabled) focusables.push(prevButton);
      if (nextButton && !nextButton.disabled) focusables.push(nextButton);
      if (!focusables.length) return;

      var first = focusables[0];
      var last = focusables[focusables.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    function onKeydown(event) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        render(currentIndex + 1);
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        render(currentIndex - 1);
        return;
      }

      if (event.key === "Tab") {
        trapFocus(event);
      }
    }

    function lockPage(lock) {
      document.body.classList.toggle("no-scroll", lock);
      pageRegions.forEach(function (region) {
        if (!region) return;
        if (lock) {
          region.setAttribute("inert", "");
        } else {
          region.removeAttribute("inert");
        }
      });
    }

    function open(item, trigger) {
      collectVisible();
      var index = visibleItems.indexOf(item);
      if (index < 0) index = 0;

      lastFocused = trigger || document.activeElement;
      isOpen = true;

      render(index);

      lightbox.hidden = false;
      lockPage(true);

      window.requestAnimationFrame(function () {
        lightbox.classList.add("is-open");
      });

      window.setTimeout(function () {
        if (closeButton) closeButton.focus({ preventScroll: true });
      }, 80);

      document.addEventListener("keydown", onKeydown);
    }

    function close() {
      if (!isOpen) return;
      isOpen = false;

      lightbox.classList.remove("is-open");
      document.removeEventListener("keydown", onKeydown);

      var delay = prefersReducedMotion() ? 0 : 280;

      window.setTimeout(function () {
        lightbox.hidden = true;
        lockPage(false);
        if (lastFocused && typeof lastFocused.focus === "function") {
          lastFocused.focus({ preventScroll: true });
        }
      }, delay);
    }

    /* Open from any gallery tile (the href is a no-JS fallback) */
    items.forEach(function (item) {
      item.addEventListener("click", function (event) {
        event.preventDefault();
        open(item, item);
      });
    });

    $$("[data-lightbox-close]", lightbox).forEach(function (element) {
      element.addEventListener("click", close);
    });

    if (prevButton) {
      prevButton.addEventListener("click", function () {
        render(currentIndex - 1);
      });
    }

    if (nextButton) {
      nextButton.addEventListener("click", function () {
        render(currentIndex + 1);
      });
    }

    /* Swipe left/right on touch screens */
    if (dialog) {
      var startX = null;
      var startY = null;

      dialog.addEventListener(
        "pointerdown",
        function (event) {
          if (event.pointerType === "mouse") return;
          if (event.target.closest("button")) return;
          startX = event.clientX;
          startY = event.clientY;
        },
        { passive: true }
      );

      dialog.addEventListener(
        "pointerup",
        function (event) {
          if (startX === null || startY === null) return;

          var dx = event.clientX - startX;
          var dy = event.clientY - startY;
          startX = null;
          startY = null;

          if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.3) {
            render(dx < 0 ? currentIndex + 1 : currentIndex - 1);
          }
        },
        { passive: true }
      );
    }

    /* Someone might filter the gallery while the lightbox is closed */
    $$(".filter").forEach(function (button) {
      button.addEventListener("click", collectVisible);
    });
  }

  /* ========================================================================
     11. COPY TO CLIPBOARD + TOAST
     ======================================================================== */
  function initToast() {
    var toast = $("#toast");
    var message = $("#toast-message");
    if (!toast || !message) return null;

    var timer = null;

    return function showToast(text) {
      message.textContent = text;
      toast.classList.add("is-on");

      if (timer) window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        toast.classList.remove("is-on");
      }, 2800);
    };
  }

  function initCopyButtons(showToast) {
    var buttons = $$("[data-copy]");
    if (!buttons.length) return;

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        var value = button.getAttribute("data-copy") || "";
        if (!value) return;

        function done() {
          if (typeof showToast === "function") {
            showToast("Email copied to your clipboard");
          }
        }

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(value).then(done).catch(function () {
            legacyCopy(value, done);
          });
        } else {
          legacyCopy(value, done);
        }
      });
    });

    /* Fallback for browsers without the Clipboard API */
    function legacyCopy(value, done) {
      var field = document.createElement("textarea");
      field.value = value;
      field.setAttribute("readonly", "");
      field.className = "clipboard-helper";
      document.body.appendChild(field);
      field.select();

      try {
        var copied = document.execCommand("copy");
        if (copied) done();
        else if (typeof showToast === "function") showToast("Copy this address: " + value);
      } catch (error) {
        if (typeof showToast === "function") showToast("Copy this address: " + value);
      }

      document.body.removeChild(field);
    }
  }

  /* ========================================================================
     12. FOOTER YEAR
     ======================================================================== */
  function initYear() {
    var year = $("#year");
    if (year) year.textContent = String(new Date().getFullYear());
  }

  /* ========================================================================
     13. TIME-OF-DAY GREETING
     ------------------------------------------------------------------------
     A small human touch in the hero eyebrow. The static HTML says
     "Welcome to my little corner of the internet", so this is an upgrade,
     never a requirement.
     ======================================================================== */
  function initGreeting() {
    var target = $("#greeting");
    if (!target) return;

    var hour = new Date().getHours();
    var text = "Good evening — welcome in";

    if (hour < 5) text = "Still awake? Welcome in";
    else if (hour < 12) text = "Good morning — welcome in";
    else if (hour < 18) text = "Good afternoon — welcome in";

    target.textContent = text;
  }

  /* ========================================================================
     14. CALM MODE
     ------------------------------------------------------------------------
     Sets data-calm="true" on <html>. The CSS in section 23 stops the
     background motion, the grain and the glass blur. The choice is remembered
     in localStorage, and the <head> applies it before first paint so the page
     never flashes back into "full effects".
     ======================================================================== */
  var CALM_KEY = "jml-calm";

  function initCalmMode(showToast) {
    var button = $("#calm-toggle");
    if (!button) return;

    function apply(on, announce) {
      if (on) {
        root.setAttribute("data-calm", "true");
      } else {
        root.removeAttribute("data-calm");
      }

      button.classList.toggle("is-on", on);
      button.setAttribute("aria-pressed", String(on));

      if (typeof CustomEvent === "function") {
        document.dispatchEvent(new CustomEvent("calmchange", { detail: { calm: on } }));
      }

      if (announce && typeof showToast === "function") {
        showToast(on ? "Calm mode on — fewer effects" : "Calm mode off — full effects back");
      }
    }

    var stored = null;
    try {
      stored = localStorage.getItem(CALM_KEY);
    } catch (error) {
      /* Blocked storage: fall back to whatever the <head> managed to apply */
    }

    apply(stored === "true" || calmEnabled(), false);

    button.addEventListener("click", function () {
      var next = !calmEnabled();

      try {
        localStorage.setItem(CALM_KEY, String(next));
      } catch (error) {
        /* The switch still works for this visit; it just won't be remembered */
      }

      apply(next, true);
    });
  }

  /* ========================================================================
     15. SMALL PERFORMANCE GUARDS
     ------------------------------------------------------------------------
     The ticker is one long transform animation. When it scrolls out of view
     there is no point in keeping the compositor busy, so it is paused and
     resumed. The same applies when the tab is in the background.
     ======================================================================== */
  function initTicker() {
    var ticker = $(".ticker");
    if (!ticker) return;

    var track = $(".ticker__track", ticker);
    if (!track) return;

    if ("IntersectionObserver" in window) {
      new IntersectionObserver(
        function (entries) {
          track.classList.toggle("is-paused", !entries[0].isIntersecting);
        },
        { rootMargin: "120px 0px" }
      ).observe(ticker);
    }

    document.addEventListener("visibilitychange", function () {
      track.classList.toggle("is-asleep", document.hidden);
    });
  }

  /* ========================================================================
     START EVERYTHING
     ======================================================================== */
  safe("theme", initTheme);
  safe("copy + calm mode", function () {
    var toast = initToast();
    initCopyButtons(toast);
    initCalmMode(toast);
  });
  safe("greeting", initGreeting);
  safe("ticker", initTicker);
  safe("preloader", initPreloader);
  safe("mobile menu", initMobileMenu);
  safe("smooth scroll", initSmoothScroll);
  safe("scroll state", initScrollState);
  safe("typing", initTyping);
  safe("reveals", initReveals);
  safe("gallery filters", initGalleryFilters);
  safe("lightbox", initLightbox);
  safe("year", initYear);
})();
