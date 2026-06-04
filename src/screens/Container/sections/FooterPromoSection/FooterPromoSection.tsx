import { Link } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const legalLinks = [
  { label: "Obchodní podmínky", href: "/obchodni-podminky" },
  { label: "Zásady ochrany osobních údajů", href: "/zasady-ochrany-osobnich-udaju" },
];

const socialLinks = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/barfingapp/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.267h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/barfingapp/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
      </svg>
    ),
  },
];

const AppleIcon = () => (
  <svg className="h-7 w-7 shrink-0" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M20.5 14.8c0-2.9 2.4-4.3 2.5-4.4-1.4-2-3.5-2.3-4.2-2.3-1.8-.2-3.5 1-4.4 1-.9 0-2.3-1-3.8-1-1.9 0-3.7 1.1-4.7 2.8-2 3.5-.5 8.6 1.4 11.5.9 1.4 2 2.9 3.5 2.8 1.4-.1 1.9-.9 3.6-.9 1.7 0 2.2.9 3.6.9 1.5 0 2.5-1.4 3.4-2.8.7-1 1.2-2.1 1.5-3.2-3.4-1.3-3.4-5.4 0-4.4zM17.7 6.2c.8-1 1.3-2.3 1.1-3.7-1.1.1-2.5.8-3.3 1.8-.7.9-1.3 2.2-1.1 3.5 1.2.1 2.5-.6 3.3-1.6z" fill="white"/>
  </svg>
);

const GooglePlayIcon = () => (
  <svg className="h-7 w-7 shrink-0" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M5.5 4.2a1.5 1.5 0 00-.5 1.1v17.4c0 .45.17.87.5 1.1l.07.06 9.74-9.74v-.23L5.57 4.14l-.07.06z" fill="#4FC3F7"/>
    <path d="M18.57 17.45l-3.26-3.26v-.23l3.26-3.26.07.04 3.87 2.2c1.1.63 1.1 1.65 0 2.27l-3.87 2.2-.07.04z" fill="#FFD54F"/>
    <path d="M18.64 17.41L15.31 14 5.5 23.83c.36.38.95.43 1.6.05l11.54-6.47z" fill="#F06292"/>
    <path d="M18.64 10.59L7.1 4.12c-.65-.38-1.24-.33-1.6.05L15.31 14l3.33-3.41z" fill="#81C784"/>
  </svg>
);

export const FooterPromoSection = (): JSX.Element => {
  return (
    <footer className="w-full bg-textdark px-6 py-6 sm:px-8 lg:px-[72px] lg:py-16">
      <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_220px] lg:gap-16">
        <section className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center lg:gap-7">
          <div className="flex min-w-0 flex-1 flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col items-start">
              <h2 className="pt-[4.8px] [font-family:'Inter',Helvetica] text-3xl font-normal leading-[1.1] tracking-[-0.96px] text-textwhite sm:text-4xl lg:text-5xl lg:leading-[52.8px]">
                Začněte krmit BARF
                <br />s touhle appkou je to ez
              </h2>
            </div>
            <div className="flex flex-col items-start gap-4 lg:items-end">
              {/* sociální sítě */}
              <div className="flex items-center gap-3">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-all hover:bg-white/20 hover:scale-105"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
              {/* právní odkazy */}
              <nav aria-label="Právní odkazy" className="flex flex-wrap items-center gap-x-7 gap-y-2">
                {legalLinks.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="[font-family:'Inter',Helvetica] text-sm font-normal text-[#ffffff60] underline-offset-2 transition-opacity hover:text-white whitespace-nowrap"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </section>
        <aside className="flex w-full flex-col gap-3">
          <Card className="w-full rounded-[14px] border border-solid border-[#ffffff1f] bg-[#ffffff14] shadow-none">
            <CardContent className="p-0">
              <Button
                asChild
                variant="ghost"
                className="h-auto w-full justify-start gap-3 rounded-[14px] px-[22px] py-3 text-left hover:bg-white/10"
              >
                <a href="#" aria-label="App Store">
                  <AppleIcon />
                  <span className="flex flex-col items-start">
                    <span className="[font-family:'Inter',Helvetica] text-[10px] font-normal leading-[11px] tracking-[0.40px] text-[#ffffff99]">
                      STÁHNOUT V
                    </span>
                    <span className="pt-0.5 [font-family:'Inter',Helvetica] text-[17px] font-bold leading-[18.7px] text-textwhite">
                      App Store
                    </span>
                  </span>
                </a>
              </Button>
            </CardContent>
          </Card>
          <Card className="w-full rounded-[14px] border border-solid border-[#ffffff1f] bg-[#ffffff14] shadow-none">
            <CardContent className="p-0">
              <Button
                asChild
                variant="ghost"
                className="h-auto w-full justify-start gap-3 rounded-[14px] px-[22px] py-3 text-left hover:bg-white/10"
              >
                <a href="#" aria-label="Google Play">
                  <GooglePlayIcon />
                  <span className="flex flex-col items-start">
                    <span className="[font-family:'Inter',Helvetica] text-[10px] font-normal leading-[11px] tracking-[0.40px] text-[#ffffff99]">
                      STÁHNOUT NA
                    </span>
                    <span className="pt-0.5 [font-family:'Inter',Helvetica] text-[17px] font-bold leading-[18.7px] text-textwhite">
                      Google Play
                    </span>
                  </span>
                </a>
              </Button>
            </CardContent>
          </Card>
        </aside>
      </div>
    </footer>
  );
};
