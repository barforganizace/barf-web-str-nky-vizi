import { ReactNode, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getGlossaryEntry } from "../lib/glossary";

type GlossaryTermProps = {
  slug: string;
  children: ReactNode;
};

/**
 * Pojem v textu článku s vysvětlením v bublině. Otevírá se klikem
 * (funguje i na mobilu), zavírá klikem mimo nebo Escape. Renderuje
 * jen spany, protože sedí uvnitř <p> z markdownu.
 */
export const GlossaryTerm = ({ slug, children }: GlossaryTermProps): JSX.Element => {
  const { i18n } = useTranslation();
  const entry = getGlossaryEntry(i18n.language, slug);
  const [open, setOpen] = useState(false);
  const [shift, setShift] = useState(0);
  const wrapRef = useRef<HTMLSpanElement>(null);
  const popRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  // Bublina je centrovaná pod pojmem; u kraje obrazovky ji posuneme dovnitř.
  useEffect(() => {
    if (!open || !popRef.current) return;
    const rect = popRef.current.getBoundingClientRect();
    const margin = 16;
    if (rect.left < margin) setShift((s) => s + (margin - rect.left));
    else if (rect.right > window.innerWidth - margin)
      setShift((s) => s + (window.innerWidth - margin - rect.right));
  }, [open]);

  if (!entry) return <span>{children}</span>;

  const toggle = () => {
    setShift(0);
    setOpen((o) => !o);
  };

  return (
    <span ref={wrapRef} className="glossary-wrap">
      <button type="button" className="glossary-term" aria-expanded={open} onClick={toggle}>
        {children}
      </button>
      {open && (
        <span
          ref={popRef}
          role="note"
          className="glossary-pop"
          style={{ transform: `translateX(calc(-50% + ${shift}px))` }}
        >
          <span className="glossary-pop-term">{entry.term}</span>
          {entry.definition}
        </span>
      )}
    </span>
  );
};
