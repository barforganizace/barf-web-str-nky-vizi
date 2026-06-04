import { Link, useNavigate } from "react-router-dom";
import { SharedNav } from "../components/SharedNav";

const quickLinks = [
  { label: "Kalkulačka", to: "/kalkulacka", emoji: "🧮" },
  { label: "Novinky", to: "/novinky", emoji: "📰" },
  { label: "Zábava", to: "/zabava", emoji: "🎮" },
  { label: "FAQ", to: "/faq", emoji: "❓" },
];

export const NotFoundPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col bg-[#f2f4f7]">
      <SharedNav />

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center">
        {/* big 404 */}
        <div className="relative mb-6 select-none">
          <span className="[font-family:'Inter',Helvetica] text-[120px] font-bold leading-none text-[#e5e7eb] sm:text-[160px]">
            404
          </span>
          <span className="absolute inset-0 flex items-center justify-center text-5xl sm:text-6xl">
            🐾
          </span>
        </div>

        <h1 className="mb-3 [font-family:'Inter',Helvetica] text-[28px] font-semibold leading-tight text-textprimary sm:text-[36px]">
          Tuhle stránku jsme nenašli
        </h1>
        <p className="mb-10 max-w-[420px] text-base leading-relaxed text-gray-500">
          Odkaz možná expiroval, nebo stránka nikdy neexistovala. Pes ji možná sežral.
        </p>

        {/* quick links */}
        <div className="mb-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-4 transition-all hover:border-[#c3e366] hover:shadow-sm"
            >
              <span className="text-2xl">{l.emoji}</span>
              <span className="text-sm font-medium text-gray-700">{l.label}</span>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-6 py-2.5 text-sm font-medium text-gray-600 transition hover:border-gray-300 hover:text-gray-900"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Zpět
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-full bg-textdark px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-80"
          >
            Domovská stránka
          </Link>
        </div>
      </main>
    </div>
  );
};
