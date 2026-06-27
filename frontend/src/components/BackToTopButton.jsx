import { useEffect, useState } from "react";

function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setIsVisible(window.scrollY > 650);
    }

    handleScroll();

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  function scrollBackToTop() {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth"
    });
  }

  return (
    <button
      className={isVisible ? "back-to-top-btn show-back-to-top" : "back-to-top-btn"}
      type="button"
      onClick={scrollBackToTop}
      aria-label="Back to top"
    >
      ↑
    </button>
  );
}

export default BackToTopButton;