(function () {
  "use strict";

  var nav = document.getElementById("nav");
  var menuBtn = document.getElementById("menuBtn");
  var navLinks = document.getElementById("navLinks");
  var links = navLinks.querySelectorAll("a");

  // Mobile menu
  menuBtn.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    menuBtn.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
  });

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      menuBtn.classList.remove("open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });

  // Nav shadow + scroll progress bar
  var progress = document.getElementById("progress");
  var ticking = false;
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 20);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ")";
    }
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  // Reveal on scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  // Active nav link
  var sections = document.querySelectorAll("main section[id]");
  if ("IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          links.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("href") === "#" + entry.target.id);
          });
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { spy.observe(s); });
  }

  // Count-up stats
  var counters = document.querySelectorAll("[data-count]");
  function runCounter(el) {
    var target = parseInt(el.dataset.count, 10);
    var suffix = el.dataset.suffix || "";
    var current = 0;
    var step = Math.max(1, Math.ceil(target / 20));
    var timer = setInterval(function () {
      current += step;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = current + suffix;
    }, 60);
  }
  if ("IntersectionObserver" in window) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          countObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (c) { countObserver.observe(c); });
  } else {
    counters.forEach(function (c) { c.textContent = c.dataset.count + (c.dataset.suffix || ""); });
  }

  // Avatar: fall back to initials if the photo is missing
  var avatar = document.querySelector(".avatar");
  var avatarImg = avatar && avatar.querySelector("img");
  if (avatarImg) {
    var showFallback = function () { avatar.classList.add("no-photo"); };
    avatarImg.addEventListener("error", showFallback);
    if (avatarImg.complete && avatarImg.naturalWidth === 0) showFallback();
  }

  // Spotlight glow follows the cursor
  document.querySelectorAll(".card, .fact, .cert").forEach(function (el) {
    el.classList.add("spot");
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // Copy email
  var copyBtn = document.getElementById("copyMail");
  var copyLabel = document.getElementById("copyLabel");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.dataset.email;
      var done = function () {
        copyBtn.classList.add("copied");
        copyLabel.textContent = "Copied to clipboard ✓";
        setTimeout(function () {
          copyBtn.classList.remove("copied");
          copyLabel.textContent = email;
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, function () { window.location.href = "mailto:" + email; });
      } else {
        window.location.href = "mailto:" + email;
      }
    });
  }

  // Spotlight glow follows the cursor
  document.querySelectorAll(".card, .fact, .cert, .t-item, .stat").forEach(function (el) {
    el.classList.add("spot");
    el.addEventListener("pointermove", function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty("--mx", e.clientX - r.left + "px");
      el.style.setProperty("--my", e.clientY - r.top + "px");
    });
  });

  // Copy email
  var copyBtn = document.getElementById("copyMail");
  var copyLabel = document.getElementById("copyLabel");
  if (copyBtn) {
    copyBtn.addEventListener("click", function () {
      var email = copyBtn.dataset.email;
      var done = function () {
        copyBtn.classList.add("copied");
        copyLabel.textContent = "Copied to clipboard ✓";
        setTimeout(function () {
          copyBtn.classList.remove("copied");
          copyLabel.textContent = email;
        }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(email).then(done, function () { window.location.href = "mailto:" + email; });
      } else {
        window.location.href = "mailto:" + email;
      }
    });
  }



  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
