import { Children, useLayoutEffect, useRef, useState, type ReactNode } from "react";

/* Stránky na jedné ploše: přejetím prstem (nebo klikem na tečku) se přepínají. Stejný princip
 * jako SwipeableCardContainer v appce — scroll-snap a aktivní stránka dopočítaná z pozice
 * scrollu. Výška se řídí aktivní stránkou, protože mikroživiny jsou třikrát delší než složení
 * a společná výška by pod kratšími stránkami nechávala prázdnou plochu. */
export const CardPager = ({ labels, children }: { labels: string[]; children: ReactNode }): JSX.Element => {
  const track = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [height, setHeight] = useState<number>();
  const pages = Children.toArray(children);

  // Bez seznamu závislostí schválně: obsah stránky se mění i bez přepnutí (gramy v misce),
  // a setState se stejnou hodnotou další render nevyvolá.
  useLayoutEffect(() => {
    const page = pageRefs.current[active];
    if (page) setHeight(page.offsetHeight);
  });

  const onScroll = () => {
    const el = track.current;
    if (!el || el.clientWidth <= 0) return;
    setActive(Math.max(0, Math.min(Math.round(el.scrollLeft / el.clientWidth), pages.length - 1)));
  };

  const goTo = (index: number) => {
    const el = track.current;
    el?.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Jediná tečka by slibovala stránky, které tam nejsou. */}
      {pages.length > 1 && (
        <div className="flex justify-center gap-2">
          {pages.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={labels[i]}
              aria-current={i === active}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${i === active ? "bg-navy" : "bg-gray-300"}`}
            />
          ))}
        </div>
      )}
      <div
        ref={track}
        onScroll={onScroll}
        style={{ height }}
        className="flex snap-x snap-mandatory overflow-x-auto overflow-y-hidden transition-[height] duration-200 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {pages.map((page, i) => (
          <div
            key={i}
            ref={(el) => (pageRefs.current[i] = el)}
            className="h-fit w-full shrink-0 snap-start pr-3 last:pr-0"
          >
            {page}
          </div>
        ))}
      </div>
    </div>
  );
};
