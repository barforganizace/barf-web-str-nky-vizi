/**
 * Cover blog článku. S `image` renderuje skutečnou fotku (alt kvůli SEO),
 * bez ní brandový gradient + emoji. Obalující karta musí mít class "group",
 * aby fungoval hover efekt.
 */
const gradients: Record<string, string> = {
  lime: "linear-gradient(135deg, rgb(234,246,199) 0%, rgb(195,233,107) 55%, rgb(168,200,80) 100%)",
  navy: "linear-gradient(135deg, rgb(52,63,80) 0%, rgb(28,35,46) 60%, rgb(19,24,33) 100%)",
  mist: "linear-gradient(135deg, rgb(240,242,246) 0%, rgb(219,224,233) 100%)",
};

export const BlogCover = ({
  emoji,
  accent,
  image,
  imageAlt,
  imagePosition = "50% 22%",
  className = "",
  badgeClassName = "h-20 w-20 rounded-[24px] text-[38px]",
}: {
  emoji: string;
  accent: string;
  image?: string;
  imageAlt?: string;
  /** Ořez fotky (CSS object-position) — např. "50% 80%" pro spodní část snímku. */
  imagePosition?: string;
  className?: string;
  badgeClassName?: string;
}): JSX.Element => {
  if (image) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <img
          src={image}
          alt={imageAlt ?? ""}
          loading="lazy"
          style={{ objectPosition: imagePosition }}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className={`relative flex items-center justify-center overflow-hidden ${className}`}
      style={{ background: gradients[accent] ?? gradients.lime }}
    >
      <span className="pointer-events-none absolute -right-5 -top-7 rotate-12 text-[92px] opacity-10 select-none">🐾</span>
      <span className="pointer-events-none absolute -left-7 -bottom-8 -rotate-[20deg] text-[76px] opacity-[0.07] select-none">🐾</span>
      <span
        className={`flex items-center justify-center bg-white/90 shadow-soft backdrop-blur-sm transition-transform duration-300 ease-out group-hover:scale-105 ${badgeClassName}`}
      >
        {emoji}
      </span>
    </div>
  );
};
