const header = document.querySelector("[data-header]");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const contactForm = document.querySelector("#contact-form");
const serviceSelect = contactForm?.querySelector("select[name='service']");

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 24);
};

const closeMenu = () => {
  menuButton?.setAttribute("aria-expanded", "false");
  navigation?.classList.remove("open");
  header?.classList.remove("menu-active");
  document.body.classList.remove("menu-open");
};

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  navigation?.classList.toggle("open", !open);
  header?.classList.toggle("menu-active", !open);
  document.body.classList.toggle("menu-open", !open);
});

navigation?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});
updateHeader();

document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    if (serviceSelect) serviceSelect.value = link.dataset.service || "";
  });
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
}

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(contactForm);
  const name = String(data.get("name") || "").trim();
  const phone = String(data.get("phone") || "").trim();
  const email = String(data.get("email") || "").trim();
  const service = String(data.get("service") || "General inquiry").trim();
  const message = String(data.get("message") || "").trim();

  const subject = encodeURIComponent(`Website inquiry: ${service}`);
  const body = encodeURIComponent(
    [`Name: ${name}`, `Email: ${email}`, `Phone: ${phone || "Not provided"}`, `Service: ${service}`, "", message].join("\n")
  );

  window.location.href = `mailto:info@coastalcalmorganizingandconcierge.com?subject=${subject}&body=${body}`;
});

const year = document.querySelector("#year");
if (year) year.textContent = String(new Date().getFullYear());

const showcase = document.querySelector("[data-showcase]");

if (showcase) {
  const slides = [...showcase.querySelectorAll("[data-showcase-slide]")];
  const dots = [...showcase.querySelectorAll("[data-showcase-dot]")];
  const previousButton = showcase.querySelector("[data-showcase-prev]");
  const nextButton = showcase.querySelector("[data-showcase-next]");
  const toggleButton = showcase.querySelector("[data-showcase-toggle]");
  const status = showcase.querySelector("[data-showcase-status]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let activeSlide = 0;
  let intervalId = null;
  let userPaused = reducedMotion;

  const renderSlide = (nextIndex, announce = true) => {
    activeSlide = (nextIndex + slides.length) % slides.length;

    slides.forEach((slide, index) => {
      const isActive = index === activeSlide;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
      slide.querySelectorAll("a").forEach((link) => link.setAttribute("tabindex", isActive ? "0" : "-1"));
    });

    dots.forEach((dot, index) => dot.setAttribute("aria-current", String(index === activeSlide)));
    if (status && announce) status.textContent = `Graphic ${activeSlide + 1} of ${slides.length}`;
  };

  const stopRotation = () => {
    window.clearInterval(intervalId);
    intervalId = null;
  };

  const startRotation = () => {
    stopRotation();
    if (!userPaused && document.visibilityState === "visible") {
      intervalId = window.setInterval(() => renderSlide(activeSlide + 1, false), 5500);
    }
  };

  const moveToSlide = (nextIndex) => {
    renderSlide(nextIndex);
    startRotation();
  };

  previousButton?.addEventListener("click", () => moveToSlide(activeSlide - 1));
  nextButton?.addEventListener("click", () => moveToSlide(activeSlide + 1));
  dots.forEach((dot) => dot.addEventListener("click", () => moveToSlide(Number(dot.dataset.showcaseDot))));

  toggleButton?.addEventListener("click", () => {
    userPaused = !userPaused;
    toggleButton.textContent = userPaused ? "Play" : "Pause";
    toggleButton.setAttribute("aria-label", userPaused ? "Play automatic slideshow" : "Pause automatic slideshow");
    startRotation();
  });

  showcase.addEventListener("mouseenter", stopRotation);
  showcase.addEventListener("mouseleave", startRotation);
  showcase.addEventListener("focusin", stopRotation);
  showcase.addEventListener("focusout", (event) => {
    if (!showcase.contains(event.relatedTarget)) startRotation();
  });
  document.addEventListener("visibilitychange", startRotation);

  if (reducedMotion && toggleButton) {
    toggleButton.textContent = "Play";
    toggleButton.setAttribute("aria-label", "Play automatic slideshow");
  }

  renderSlide(0, false);
  startRotation();
}
