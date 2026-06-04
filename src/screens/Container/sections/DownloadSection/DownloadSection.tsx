import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { WaitlistForm } from "../../../../components/WaitlistForm";

const DOWNLOAD_URL_IOS = "#";
const DOWNLOAD_URL_ANDROID = "#";

const AppleIcon = () => (
  <svg className="h-7 w-7 shrink-0" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M20.5 14.8c0-2.9 2.4-4.3 2.5-4.4-1.4-2-3.5-2.3-4.2-2.3-1.8-.2-3.5 1-4.4 1-.9 0-2.3-1-3.8-1-1.9 0-3.7 1.1-4.7 2.8-2 3.5-.5 8.6 1.4 11.5.9 1.4 2 2.9 3.5 2.8 1.4-.1 1.9-.9 3.6-.9 1.7 0 2.2.9 3.6.9 1.5 0 2.5-1.4 3.4-2.8.7-1 1.2-2.1 1.5-3.2-3.4-1.3-3.4-5.4 0-4.4zM17.7 6.2c.8-1 1.3-2.3 1.1-3.7-1.1.1-2.5.8-3.3 1.8-.7.9-1.3 2.2-1.1 3.5 1.2.1 2.5-.6 3.3-1.6z" fill="currentColor"/>
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

const DownloadButton = ({
  href,
  icon,
  eyebrow,
  label,
  dark,
}: {
  href: string;
  icon: React.ReactNode;
  eyebrow: string;
  label: string;
  dark?: boolean;
}) => (
  <Card
    className={`w-full max-w-[220px] rounded-2xl border shadow-sm transition-transform hover:-translate-y-0.5 ${
      dark
        ? "border-[#ffffff1f] bg-textdark"
        : "border-[#1f29370f] bg-white"
    }`}
  >
    <CardContent className="p-0">
      <Button
        asChild
        variant="ghost"
        className={`h-auto w-full justify-start gap-3 rounded-2xl px-5 py-4 text-left hover:bg-transparent ${
          dark ? "text-textwhite hover:text-textwhite" : "text-textprimary"
        }`}
      >
        <a href={href} aria-label={label}>
          {icon}
          <span className="flex flex-col items-start">
            <span
              className={`text-[10px] font-normal leading-[11px] tracking-[0.40px] [font-family:'Inter',Helvetica] ${
                dark ? "text-[#ffffff80]" : "text-textsecondary"
              }`}
            >
              {eyebrow}
            </span>
            <span className="pt-0.5 [font-family:'Inter',Helvetica] text-[17px] font-bold leading-[18.7px]">
              {label}
            </span>
          </span>
        </a>
      </Button>
    </CardContent>
  </Card>
);

export const DownloadSection = (): JSX.Element => {
  return (
    <section
      id="stazeni"
      className="relative w-full self-stretch overflow-hidden bg-textdark px-6 py-20 sm:px-8 lg:px-12 xl:px-[72px] 2xl:px-[120px]"
    >
      {/* dekorativní blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 -top-32 h-[520px] w-[520px] rounded-full bg-[#c3e96b]/10 blur-[100px]"
      />

      <div className="relative mx-auto flex w-full max-w-[1200px] flex-col items-center gap-14 lg:grid lg:grid-cols-2 lg:items-center lg:gap-16">
        {/* levá strana – text + tlačítka */}
        <div className="flex w-full max-w-[560px] flex-col items-start gap-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c3e96b]/30 bg-[#c3e96b]/10 px-4 py-1.5">
            <span className="h-2 w-2 rounded-full bg-[#c3e96b]" />
            <span className="[font-family:'Inter',Helvetica] text-sm font-semibold text-[#c3e96b]">
              Brzy ke stažení
            </span>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="[font-family:'Inter',Helvetica] text-[40px] font-normal leading-[1] tracking-[-1.2px] text-textwhite sm:text-[52px] lg:text-[56px]">
              Stáhněte si{" "}
              <span className="text-[#c3e96b] font-bold">BarfingApp</span>
              <br />
              <span className="text-[#ffffffb8] font-normal">zdarma</span>
            </h2>
            <p className="[font-family:'Inter',Helvetica] text-base leading-relaxed text-[#ffffffb8] sm:text-lg">
              Dostupná pro iOS i Android. Žádné předplatné,{" "}
              <br className="hidden sm:block" />
              žádné skryté poplatky – prostě stáhnout a jet.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <DownloadButton
              href={DOWNLOAD_URL_IOS}
              icon={<AppleIcon />}
              eyebrow="STÁHNOUT V"
              label="App Store"
              dark
            />
            <DownloadButton
              href={DOWNLOAD_URL_ANDROID}
              icon={<GooglePlayIcon />}
              eyebrow="STÁHNOUT NA"
              label="Google Play"
            />
          </div>

          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-[#c3e96b]">
              Notifikovat mě při vydání
            </p>
            <WaitlistForm dark />
          </div>
        </div>

        {/* pravá strana – mockup */}
        <div className="flex w-full items-center justify-center lg:justify-end">
          <div className="relative flex items-center justify-center">
            {/* placeholder card se stínem */}
            <div className="relative flex h-[420px] w-[220px] items-center justify-center rounded-[36px] border border-[#ffffff1f] bg-gradient-to-b from-[#2a2e2f] to-[#1a1d1e] shadow-[0_32px_80px_-12px_rgba(0,0,0,0.5)]">
              <img
                src="/Mockup_2.svg"
                alt="BarfingApp mockup"
                className="h-full w-full rounded-[36px] object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
              {/* fallback obsah když SVG nefunguje */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[36px] p-6 text-center">
                <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
                  <svg className="h-6 w-6 text-white/30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="12" cy="18" r="1" fill="currentColor"/>
                  </svg>
                </div>
                <span className="[font-family:'Inter',Helvetica] text-sm font-medium text-white/30">
                  App screenshot
                </span>
              </div>
            </div>

            {/* dekorativní druhý telefon v pozadí */}
            <div
              aria-hidden="true"
              className="absolute -right-10 top-8 -z-10 h-[380px] w-[200px] rounded-[36px] border border-[#1f29370f] bg-gradient-to-b from-[#c3e96b]/30 to-[#c3e96b]/5 blur-[1px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
