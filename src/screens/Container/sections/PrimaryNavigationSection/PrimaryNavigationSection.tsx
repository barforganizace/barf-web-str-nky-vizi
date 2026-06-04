import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui/button";

const anchorItems = [
  { label: "Funkce", href: "#funkce" },
  { label: "Stažení", href: "#stazeni" },
];

export const PrimaryNavigationSection = (): JSX.Element => {
  return (
    <header className="relative self-stretch w-full border-b border-[#1f29370f] bg-[#f2f4f7d9] backdrop-blur-[7px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(7px)_brightness(100%)]">
      <div className="mx-auto flex h-[68px] w-full max-w-[1200px] items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
        <a href="#" className="inline-flex shrink-0 items-center gap-2.5">
          <div className="h-7 w-7 shrink-0 bg-[url(/Vector-4.png)] bg-cover bg-[50%_50%]" />
          <span className="[font-family:'Inter',Helvetica] text-[17px] font-bold leading-[normal] tracking-[-0.17px] text-textprimary">
            BarfingApp
          </span>
        </a>
        <nav aria-label="Primary" className="flex items-center justify-center">
          <ul className="flex items-center gap-6 lg:gap-[31.8px]">
            {anchorItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="inline-flex items-center [font-family:'Inter',Helvetica] text-sm font-medium leading-[normal] tracking-[0] text-textsecondary transition-colors hover:text-textprimary"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <Link
                to="/faq"
                className="inline-flex items-center [font-family:'Inter',Helvetica] text-sm font-medium leading-[normal] tracking-[0] text-textsecondary transition-colors hover:text-textprimary"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </nav>
        <Button
          asChild
          className="h-auto rounded-full bg-textdark px-[18px] py-[10px] [font-family:'Inter',Helvetica] text-sm font-bold leading-[normal] tracking-[0] text-textwhite hover:bg-textdark/90"
        >
          <a href="#stazeni" className="inline-flex items-center gap-2">
            <span>Stáhnout</span>
            <svg className="h-3 w-3 shrink-0" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6 1v8M2.5 6l3.5 3.5L9.5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
          </a>
        </Button>
      </div>
    </header>
  );
};
