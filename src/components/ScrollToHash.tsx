import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Doskrolování na kotvu z URL. Stránky se načítají lazy, takže cíl
 * v DOM ještě nemusí být — chvíli na něj počkáme.
 */
export const ScrollToHash = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = hash.slice(1);
    let attempts = 0;

    const timer = window.setInterval(() => {
      const target = document.getElementById(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        window.clearInterval(timer);
      } else if (++attempts > 40) {
        window.clearInterval(timer);
      }
    }, 50);

    return () => window.clearInterval(timer);
  }, [pathname, hash]);

  return null;
};
