import { useEffect } from "react";

function RevealOnScroll() {
  useEffect(() => {
    const revealElements = document.querySelectorAll(
      [
        ".lux-bento-card",
        ".lux-featured-event",
        ".lux-event-card",
        ".lux-booking-panel",
        ".lux-booking-info-card",
        ".lux-contact-card",
        ".lux-footer",
        ".admin-dashboard-card",
        ".admin-booking-card",
        ".mini-stat-card",
        ".lux-success-card"
      ].join(",")
    );

    revealElements.forEach((element) => {
      element.classList.add("scroll-reveal");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("scroll-reveal-visible");
          }
        });
      },
      {
        threshold: 0.12
      }
    );

    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      revealElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return null;
}

export default RevealOnScroll;