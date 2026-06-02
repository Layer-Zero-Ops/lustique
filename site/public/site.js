/* LUSTIQUE CO. — shared behavior (no markup injection).
   Header/footer are baked into each page by build.mjs. */
document.addEventListener("DOMContentLoaded", () => {
  // sticky nav shadow
  const nav = document.getElementById("nav");
  if (nav) addEventListener("scroll", () => nav.classList.toggle("scrolled", scrollY > 20), { passive: true });

  // mobile menu
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) toggle.addEventListener("click", () => links.classList.toggle("open"));

  // scroll reveals
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));

  // cookie consent (POPIA) — only fire analytics after "accept" (wired in the live build)
  const banner = document.getElementById("cookieBanner");
  if (banner) {
    let consent = null;
    try { consent = localStorage.getItem("lc_cookie"); } catch (e) {}
    if (!consent) banner.hidden = false;
    const decide = (val) => { try { localStorage.setItem("lc_cookie", val); } catch (e) {} banner.hidden = true; };
    const a = document.getElementById("cookieAccept");
    const d = document.getElementById("cookieDecline");
    if (a) a.addEventListener("click", () => decide("accepted"));
    if (d) d.addEventListener("click", () => decide("declined"));
  }

  // back to top
  const toTop = document.getElementById("toTop");
  if (toTop) {
    addEventListener("scroll", () => toTop.classList.toggle("show", scrollY > 500), { passive: true });
    toTop.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
  }

  // portfolio filters — category + artist, combined
  const catRow = document.getElementById("galleryFilters");
  const artRow = document.getElementById("artistFilters");
  if (catRow || artRow) {
    let activeCat = "all", activeArtist = "all";
    const apply = () => {
      document.querySelectorAll(".gitem").forEach(it => {
        const okCat = activeCat === "all" || it.dataset.cat === activeCat;
        const okArt = activeArtist === "all" || it.dataset.artist === activeArtist;
        it.classList.toggle("hide", !(okCat && okArt));
      });
    };
    const wire = (row, set) => {
      if (!row) return;
      row.addEventListener("click", (e) => {
        const b = e.target.closest("button");
        if (!b) return;
        row.querySelectorAll("button").forEach(x => x.classList.remove("active"));
        b.classList.add("active");
        set(b.dataset.filter);
        apply();
      });
    };
    wire(catRow, (val) => (activeCat = val));
    wire(artRow, (val) => (activeArtist = val));
  }

  // FAQ accordion
  document.querySelectorAll(".faq-q").forEach(q => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const ans = item.querySelector(".faq-a");
      const open = item.classList.toggle("open");
      ans.style.maxHeight = open ? ans.scrollHeight + "px" : "";
    });
  });

  // testimonial slideshow (auto-loop + dots)
  const slider = document.querySelector(".testi-slider");
  if (slider) {
    const slides = Array.from(slider.querySelectorAll(".testi-slide"));
    const dotsWrap = document.querySelector(".testi-dots");
    if (slides.length > 1) {
      let i = 0;
      slides.forEach((_, n) => {
        const b = document.createElement("button");
        b.setAttribute("aria-label", "Review " + (n + 1));
        if (n === 0) b.classList.add("active");
        b.addEventListener("click", () => { go(n); reset(); });
        if (dotsWrap) dotsWrap.appendChild(b);
      });
      const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
      const go = (n) => {
        slides[i].classList.remove("active");
        if (dots[i]) dots[i].classList.remove("active");
        i = (n + slides.length) % slides.length;
        slides[i].classList.add("active");
        if (dots[i]) dots[i].classList.add("active");
      };
      let timer = setInterval(() => go(i + 1), 6000);
      const reset = () => { clearInterval(timer); timer = setInterval(() => go(i + 1), 6000); };
    }
  }
});
