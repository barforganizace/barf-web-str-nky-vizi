import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  ArrowUp,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  Home,
  Menu,
  Pencil,
  Plus,
  Refrigerator,
  Settings,
  X,
} from "lucide-react";

/* Náhledy obrazovek aplikace pro marketingový web.
 *
 * Nejsou to screenshoty ani exporty z Figmy — jsou to živé komponenty, takže
 * se texty berou z i18n (klíče `screens.*`) a s přepnutím jazyka se překreslí.
 *
 * Barvy jsou schválně natvrdo, ne přes tokeny webu: tohle je obrázek telefonu
 * s appkou, takže musí zůstat světlý i v tmavém režimu webu. Hodnoty jsou
 * převzané z `src/index.css` aplikace (--category-*, --surface-*).
 */
const MEAT = "#e66c6c";
const BONE = "#e6dcc5";
const ORGAN = "#b886f7";
const LIVER = "#c4b5fd";
const OTHER = "#58d37e";
const LIME = "#c3e366";
const LIME_INK = "#506600";
const INK = "#1f2937";
const CARD = "#f2f4f7";

/** Obrazovky se kreslí v rozměrech skutečného telefonu a do stránky se zmenší
 *  jedním `scale()`. Díky tomu se uvnitř píšou normální pixelové velikosti
 *  a nemusí se nic přepočítávat podle toho, kde je náhled zasazený. */
const W = 390;
const H = 844;

export function PhoneFrame({
  width,
  label,
  children,
}: {
  width: number;
  label: string;
  children: ReactNode;
}): JSX.Element {
  const scale = width / W;
  return (
    // Tmavý rámeček je stejný jako u dřívějších obrázků telefonu (p-2 = 8 px
    // na každé straně), aby náhled zapadl do už hotového layoutu sekcí.
    <div
      // Ne `role="img"` s aria-hidden obsahem: uvnitř jsou ovladatelná tlačítka
      // a fokusovatelný prvek ve skryté oblasti je přístupnostní chyba.
      role="group"
      aria-label={label}
      className="mx-auto rounded-screen bg-fg-1 p-2 shadow-modal"
      style={{ width: width + 16 }}
    >
      <div className="overflow-hidden rounded-[32px]" style={{ width, height: H * scale }}>
        <div className="origin-top-left" style={{ width: W, height: H, transform: `scale(${scale})` }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function StatusBar(): JSX.Element {
  return (
    <div className="flex h-[44px] shrink-0 items-center justify-between px-7 pt-1">
      <span className="text-[15px] font-semibold text-gray-900">9:41</span>
      <div className="flex items-center gap-1.5">
        <svg width="17" height="11" viewBox="0 0 17 11" fill="currentColor" className="text-gray-900">
          <rect x="0" y="7" width="3" height="4" rx="1" />
          <rect x="4.5" y="5" width="3" height="6" rx="1" />
          <rect x="9" y="2.5" width="3" height="8.5" rx="1" />
          <rect x="13.5" y="0" width="3" height="11" rx="1" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="text-gray-900">
          <path d="M8 9.6 9.8 7.7a2.6 2.6 0 0 0-3.6 0L8 9.6Z" fill="currentColor" />
          <path d="M3.7 5.1a6.3 6.3 0 0 1 8.6 0M1.2 2.5a9.9 9.9 0 0 1 13.6 0" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.2" stroke="currentColor" strokeOpacity="0.35" className="text-gray-900" />
          <rect x="2" y="2" width="18" height="8" rx="2" fill="currentColor" className="text-gray-900" />
          <path d="M23 4v4a2 2 0 0 0 0-4Z" fill="currentColor" fillOpacity="0.4" className="text-gray-900" />
        </svg>
      </div>
    </div>
  );
}

/** Kořen každé obrazovky — status bar a plocha pod ním.
 *  `overlayStatus` ho místo toho položí přes obsah, což potřebují obrazovky
 *  s fotkou vytaženou až k hornímu okraji. */
function Screen({ children, overlayStatus = false }: { children: ReactNode; overlayStatus?: boolean }): JSX.Element {
  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden"
      style={{ backgroundColor: CARD, fontFamily: "'Manrope', ui-sans-serif, system-ui, sans-serif" }}
    >
      {overlayStatus ? <div className="absolute inset-x-0 top-0 z-30"><StatusBar /></div> : <StatusBar />}
      {children}
    </div>
  );
}

/** Řádek „snědeno / cíl" s barevným pruhem. Stejný prvek jako v appce. */
function ProgressRow({
  label,
  value,
  target,
  color,
  nested = false,
}: {
  label: string;
  value: number;
  target: number;
  color: string;
  nested?: boolean;
}): JSX.Element {
  const pct = Math.min(100, (value / target) * 100);
  return (
    <div className={nested ? "pl-6" : undefined}>
      <div className="mb-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {!nested && <span className="h-3.5 w-3.5 shrink-0 rounded-full" style={{ backgroundColor: color }} />}
          <span className={`text-[15px] ${nested ? "text-gray-500" : "font-semibold text-gray-900"}`}>{label}</span>
        </div>
        <span>
          <span className={`text-[15px] font-bold ${nested ? "text-gray-600" : "text-gray-900"}`}>{value}</span>
          <span className="text-[13px] font-medium text-gray-400"> / {target} g</span>
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: nested ? "#e9ecf1" : "#e4e8ee" }}>
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

/* ── 1. Dashboard — nutriční přehled ─────────────────────────────────────── */

export function DashboardScreen(): JSX.Element {
  const { t } = useTranslation();
  // Náhled je schválně živý, ne obrázek: Den/Týden opravdu přepočítá čísla (×7)
  // a rozkliknutí jména psa přepne profil včetně fotky.
  const [week, setWeek] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [dog, setDog] = useState(0);
  const m = week ? 7 : 1;

  // Fotky se berou z už existujících obrázků v public/ (používá je kalkulačka),
  // takže náhled nepřidává do buildu žádný nový asset.
  const dogs = [
    { name: t("screens.dash.dog"), photo: "/dog-medium.jpg" },
    { name: t("screens.dash.dog2"), photo: "/dog-small.jpg" },
  ];

  const days = [
    { key: "mon", n: 18 },
    { key: "tue", n: 19 },
    { key: "wed", n: 20 },
    { key: "thu", n: 21 },
    { key: "fri", n: 22 },
    { key: "sat", n: 23 },
    { key: "sun", n: 24 },
  ];

  return (
    <Screen>
      <div className="flex flex-1 flex-col px-4">
        <div className="relative z-20 flex items-center justify-between py-3">
          <button
            type="button"
            onClick={() => setProfileOpen((v) => !v)}
            className="flex items-center gap-3 rounded-2xl px-1 py-1 transition-colors hover:bg-white/60"
          >
            <img
              src={dogs[dog].photo}
              alt=""
              className="h-11 w-11 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
            />
            <div className="flex items-center gap-1.5">
              <span className="text-[21px] font-extrabold text-gray-900">{dogs[dog].name}</span>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`}
              />
            </div>
          </button>
          <Settings className="h-7 w-7 text-gray-700" />

          {profileOpen && (
            <div className="absolute left-0 top-full w-[260px] overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
              <div className="py-2">
                <p className="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">
                  {t("screens.dash.my_dogs")}
                </p>
                {dogs.map((d, i) => (
                  <button
                    key={d.name}
                    type="button"
                    onClick={() => {
                      setDog(i);
                      setProfileOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50"
                  >
                    <img src={d.photo} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                    <span className={`flex-1 text-[15px] ${i === dog ? "font-bold text-gray-900" : "font-medium text-gray-600"}`}>
                      {d.name}
                    </span>
                    {i === dog && <Check className="h-4 w-4 shrink-0 text-gray-800" />}
                  </button>
                ))}
              </div>
              <div className="border-t border-gray-100 py-2">
                <button type="button" className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-gray-50">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100">
                    <Plus className="h-4 w-4 text-gray-600" />
                  </span>
                  <span className="text-[15px] font-medium text-gray-600">{t("screens.dash.add_dog")}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="rounded-[20px] bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-gray-800">{t("screens.dash.month")}</h2>
              <div className="flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1.5">
                <span className="text-[13px]">🔥</span>
                <span className="text-[13px] font-bold text-gray-900">26</span>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 pb-1 pt-3">
              {days.map(({ key, n }) => {
                const active = n === 20;
                return (
                  <div key={key} className={`flex flex-col items-center gap-2 ${active ? "" : "opacity-40"}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                      {t(`screens.dash.day_${key}`)}
                    </span>
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-[14px] text-gray-800 ${
                        active ? "font-bold shadow-md" : "bg-white font-medium shadow-sm"
                      }`}
                      style={active ? { backgroundColor: LIME } : undefined}
                    >
                      {n}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="rounded-[20px] bg-white px-5 pb-6 pt-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="h-3 w-3 rounded-full bg-gray-800" />
                <span className="h-3 w-3 rounded-full bg-gray-200" />
                <span className="h-3 w-3 rounded-full bg-gray-200" />
              </div>
              <div className="flex items-center rounded-full bg-[#f2f4f7] p-0.5">
                {[false, true].map((isWeek) => (
                  <button
                    key={String(isWeek)}
                    type="button"
                    onClick={() => setWeek(isWeek)}
                    className={`rounded-full px-3.5 py-1 text-[14px] transition-colors ${
                      week === isWeek ? "font-bold text-gray-800" : "font-normal text-gray-400"
                    }`}
                    style={week === isWeek ? { backgroundColor: LIME } : undefined}
                  >
                    {isWeek ? t("screens.dash.week") : t("screens.dash.day")}
                  </button>
                ))}
              </div>
            </div>

            <div className="my-5 h-px bg-gray-800/20" />

            <div className="flex flex-col gap-5">
              <ProgressRow label={t("screens.bucket.muscle")} value={350 * m} target={500 * m} color={MEAT} />
              <ProgressRow label={t("screens.bucket.bones")} value={60 * m} target={100 * m} color={BONE} />
              <div className="flex flex-col gap-2">
                <ProgressRow label={t("screens.bucket.organs")} value={80 * m} target={120 * m} color={ORGAN} />
                <ProgressRow label={t("screens.bucket.liver")} value={20 * m} target={40 * m} color={LIVER} nested />
              </div>
              <ProgressRow label={t("screens.bucket.other")} value={40 * m} target={80 * m} color={OTHER} />
            </div>
          </div>
        </div>
      </div>

      <div className="relative shrink-0">
        <div className="absolute -top-7 left-1/2 flex h-[58px] w-[58px] -translate-x-1/2 items-center justify-center rounded-full shadow-lg" style={{ backgroundColor: INK }}>
          <Plus className="h-7 w-7 text-white" strokeWidth={2.5} />
        </div>
        <div className="flex items-center justify-around bg-white px-6 pb-7 pt-5">
          <Home className="h-6 w-6" style={{ color: LIME_INK }} />
          <Refrigerator className="h-6 w-6 text-gray-300" />
          <span className="w-10" />
          <CalendarDays className="h-6 w-6 text-gray-300" />
          <Menu className="h-6 w-6 text-gray-300" />
        </div>
      </div>
    </Screen>
  );
}

/* ── 2. AI kouč ──────────────────────────────────────────────────────────── */

export function CoachScreen(): JSX.Element {
  const { t } = useTranslation();

  return (
    <Screen>
      <div className="flex items-center gap-2 px-5 pb-3 pt-1">
        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: OTHER }} />
        <span className="text-[15px] font-bold text-gray-900">{t("screens.coach.title")}</span>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-hidden px-4">
        <div className="max-w-[74%] self-end rounded-[18px_18px_4px_18px] px-4 py-3" style={{ backgroundColor: INK }}>
          <p className="text-[15px] leading-snug text-white">{t("screens.coach.q")}</p>
        </div>

        <div className="max-w-[80%] self-start rounded-[18px_18px_18px_4px] bg-white px-4 py-3 shadow-sm">
          <p className="text-[15px] leading-snug text-gray-800">{t("screens.coach.a")}</p>
        </div>

        <div className="rounded-[20px] bg-white p-4 shadow-sm">
          <p className="mb-3 text-[13px] font-bold uppercase tracking-[0.1em] text-gray-400">
            {t("screens.coach.plan_label")}
          </p>
          <div className="flex flex-col gap-2.5">
            {[
              { label: t("screens.coach.i1"), gram: 300, color: MEAT },
              { label: t("screens.coach.i2"), gram: 90, color: BONE },
              { label: t("screens.coach.i3"), gram: 40, color: ORGAN },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className="h-4 w-4 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
                <span className="flex-1 truncate text-[15px] text-gray-900">{row.label}</span>
                <span className="text-[15px] font-bold text-gray-900">{row.gram} g</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" className="h-10 flex-1 rounded-2xl bg-[#f2f4f7] text-[14px] font-bold text-gray-500">
              {t("screens.coach.reject")}
            </button>
            <button type="button" className="h-10 flex-1 rounded-2xl text-[14px] font-bold text-white" style={{ backgroundColor: INK }}>
              {t("screens.coach.confirm")}
            </button>
          </div>
        </div>
      </div>

      <div className="shrink-0 px-4 pb-8 pt-3">
        <div className="mb-3 flex gap-2 overflow-hidden">
          {[t("screens.coach.chip1"), t("screens.coach.chip2")].map((chip) => (
            <span key={chip} className="shrink-0 whitespace-nowrap rounded-full bg-white px-3.5 py-2 text-[12px] font-bold text-gray-600 shadow-sm">
              {chip}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-4 pr-1.5 shadow-md">
          <span className="flex-1 truncate text-[15px] text-gray-400">{t("screens.coach.placeholder")}</span>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: LIME }}>
            <ArrowUp className="h-5 w-5" style={{ color: LIME_INK }} strokeWidth={2.5} />
          </span>
        </div>
      </div>
    </Screen>
  );
}

/* ── 3. Detail potraviny ─────────────────────────────────────────────────── */

/** Prstenec složení misky. Segmenty se kreslí jedním kruhem přes stroke-dasharray,
 *  takže přidání složky je jen další položka v poli — žádná trigonometrie. */
function CompositionRing({ parts }: { parts: { pct: number; color: string }[] }): JSX.Element {
  const R = 58;
  const C = 2 * Math.PI * R;
  let offset = 0;

  return (
    <svg viewBox="0 0 160 160" className="h-[160px] w-[160px] -rotate-90">
      {parts.map((p) => {
        const len = (p.pct / 100) * C;
        const dash = <circle key={p.color} cx="80" cy="80" r={R} fill="none" stroke={p.color} strokeWidth="24" strokeDasharray={`${len} ${C - len}`} strokeDashoffset={-offset} />;
        offset += len;
        return dash;
      })}
    </svg>
  );
}

/* Barvy a rozměry níž jsou z Figmy (node 2462:8111). Kategorie sedí na tokeny,
 * které už appka má (--brand/meat/500 = MEAT, --brand/bone/500 = BONE), texty
 * mají vlastní odstíny. Písmo návrhu je Outfit; mockup zůstává na Manrope jako
 * zbytek webu, aby si kvůli náhledu nemusel stahovat další webfont. */
const FIG_HEADING = "#172739";
const FIG_MUTED = "#4d5b6a";
const FIG_DIVIDER = "#eceef1";
const FIG_CARD_BORDER = "#f2f4f7";

export function FoodDetailScreen(): JSX.Element {
  const { t } = useTranslation();
  const [tab, setTab] = useState<"overview" | "detail">("overview");
  const [editing, setEditing] = useState(false);
  // „Upravit" není jen ozdoba — posuvník opravdu mění poměr masa a kostí
  // a proužek i popisky se přepočítají.
  const [muscle, setMuscle] = useState(70);

  const parts = [
    { pct: 50, color: MEAT, label: t("screens.bucket.muscle") },
    { pct: 25, color: BONE, label: t("screens.bucket.bones") },
    { pct: 15, color: ORGAN, label: t("screens.bucket.organs") },
    { pct: 10, color: OTHER, label: t("screens.bucket.other") },
  ];

  const nutrients = [
    { label: t("screens.food.calcium"), value: "0.6 mg" },
    { label: t("screens.food.vitA"), value: "29 mg" },
    { label: t("screens.food.vitD"), value: "1.0 mg" },
  ];

  const tabs = [
    { id: "overview" as const, label: t("screens.food.tab_overview") },
    { id: "detail" as const, label: t("screens.food.tab_detail") },
  ];

  return (
    <Screen overlayStatus>
      {/* Hero s fotkou. Ořez (výška 148,57 %, posun -27,85 %) je převzatý
          z návrhu, aby zůstalo vidět totéž místo fotky. */}
      <div className="relative h-[260px] shrink-0 overflow-hidden">
        <img
          src="/screen-food-hero.jpg"
          alt=""
          className="absolute left-0 w-full"
          style={{ height: "148.57%", top: "-27.85%", maxWidth: "none" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/45" />

        <div className="absolute inset-x-0 top-0 flex items-center gap-6 px-8 pt-12">
          <ChevronLeft className="h-6 w-6 shrink-0 text-white" strokeWidth={2.5} />
          <span className="text-[20px] font-semibold text-white">{t("screens.food.title")}</span>
        </div>

        <div className="absolute inset-x-0 bottom-0 px-6 py-7">
          <h1 className="text-[36px] font-extrabold leading-[40px] text-white">{t("screens.food.title")}</h1>
        </div>
      </div>

      {/* Bílá plocha přetéká přes fotku o 24 px, stejně jako v návrhu. */}
      <div className="relative -mt-6 flex flex-1 flex-col gap-4 rounded-t-[32px] bg-white px-4 pt-5">
        <div className="flex" style={{ borderBottom: `1px solid ${FIG_DIVIDER}` }}>
          {tabs.map((item) => {
            const active = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={`flex-1 pb-3 text-center text-[18px] transition-colors ${active ? "font-bold" : "font-medium"}`}
                style={{
                  color: active ? FIG_HEADING : FIG_MUTED,
                  boxShadow: active ? `inset 0 -2px 0 0 ${FIG_HEADING}` : undefined,
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {tab === "overview" ? (
          <>
            <div className="flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <img src="/icon-muscle.svg" alt="" width={14} height={14} />
                <span className="text-[18px] font-semibold" style={{ color: FIG_HEADING }}>
                  {t("screens.bucket.muscle")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <img src="/icon-bone.svg" alt="" width={15} height={15} />
                <span className="text-[18px] font-semibold" style={{ color: FIG_HEADING }}>
                  {t("screens.bucket.bones")}
                </span>
              </div>
            </div>

            <div className="rounded-[32px] p-4" style={{ border: `1px solid ${FIG_CARD_BORDER}` }}>
              <div className="flex items-center justify-between pb-1">
                <h3 className="text-[20px] font-bold" style={{ color: "#191c1e" }}>
                  {t("screens.food.ratio")}
                </h3>
                <button
                  type="button"
                  onClick={() => setEditing((v) => !v)}
                  className="flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-gray-100"
                >
                  <Pencil className="h-4 w-4" style={{ color: "#585f6b" }} />
                  <span className="text-[11px] font-medium" style={{ color: "#585f6b" }}>
                    {editing ? t("screens.food.done") : t("screens.food.edit")}
                  </span>
                </button>
              </div>

              <div className="mt-2 flex h-3 overflow-hidden rounded-[6px]">
                <div className="h-full rounded-[6px]" style={{ width: `${muscle}%`, backgroundColor: MEAT }} />
                <div className="h-full rounded-[6px]" style={{ width: `${100 - muscle}%`, backgroundColor: BONE }} />
              </div>

              {editing && (
                <input
                  type="range"
                  min={10}
                  max={90}
                  step={5}
                  value={muscle}
                  onChange={(e) => setMuscle(Number(e.target.value))}
                  aria-label={t("screens.food.ratio")}
                  className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-[#e66c6c]"
                />
              )}

              <div className="mt-2 flex items-center justify-between text-[14px]" style={{ color: "#45483b" }}>
                <span>
                  {t("screens.bucket.muscle")} {muscle} %
                </span>
                <span>
                  {t("screens.bucket.bones")} {100 - muscle} %
                </span>
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-6" style={{ border: `1px solid ${FIG_CARD_BORDER}` }}>
              <h3 className="text-[20px] font-bold" style={{ color: FIG_HEADING }}>
                {t("screens.food.about_title")}
              </h3>
              <p className="mt-3 text-[16px] leading-[24px]" style={{ color: FIG_MUTED }}>
                {t("screens.food.about_text")}
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="rounded-[32px] px-4 py-4" style={{ border: `1px solid ${FIG_CARD_BORDER}` }}>
              <div className="relative flex justify-center">
                <CompositionRing parts={parts} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[24px] font-extrabold" style={{ color: FIG_HEADING }}>
                    400 g
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
                    {t("screens.food.portion")}
                  </span>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2">
                {parts.map((p) => (
                  <div key={p.label} className="flex items-center gap-2">
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="truncate text-[13px]" style={{ color: FIG_MUTED }}>
                      {p.label} ({p.pct} %)
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {nutrients.map((n) => (
                <div key={n.label} className="rounded-[18px] px-2 py-3 text-center" style={{ border: `1px solid ${FIG_CARD_BORDER}` }}>
                  <p className="truncate text-[12px]" style={{ color: FIG_MUTED }}>
                    {n.label}
                  </p>
                  <p className="mt-1 text-[15px] font-extrabold" style={{ color: FIG_HEADING }}>
                    {n.value}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Plovoucí sheet — v návrhu leží přes obsah a je poloprůhledný. */}
      <div
        className="absolute inset-x-0 bottom-0 rounded-t-[32px] p-6 backdrop-blur-sm"
        style={{
          backgroundColor: "rgba(255,255,255,0.85)",
          border: `1px solid ${FIG_CARD_BORDER}`,
          boxShadow: "0px -4px 5.3px 0px rgba(0,0,0,0.03)",
        }}
      >
        <p className="text-[14px] font-bold uppercase tracking-[1.4px]" style={{ color: FIG_HEADING }}>
          {t("screens.food.add_portion")}
        </p>
        <div className="mt-4 flex gap-2">
          {[
            { label: t("screens.food.amount"), value: "150" },
            { label: t("screens.food.unit"), value: "g" },
          ].map((field) => (
            <div key={field.label} className="flex flex-1 flex-col gap-2">
              <span className="text-[14px] font-medium" style={{ color: FIG_MUTED }}>
                {field.label}
              </span>
              <div
                className="flex items-center justify-center rounded-[24px] bg-white py-4"
                style={{ border: `1px solid ${FIG_CARD_BORDER}`, boxShadow: "0px 1px 2px 0px rgba(0,0,0,0.05)" }}
              >
                <span className="text-[20px] font-bold" style={{ color: FIG_HEADING }}>
                  {field.value}
                </span>
              </div>
            </div>
          ))}
        </div>
        <div
          className="mt-4 flex items-center justify-center rounded-[24px] py-4 text-[18px] font-bold text-white"
          style={{ backgroundColor: "#9da3a9" }}
        >
          {t("screens.food.feed")}
        </div>
      </div>
    </Screen>
  );
}

/* ── 4. Krmení — výběr z lednice do misky ────────────────────────────────── */

export function FeedingScreen(): JSX.Element {
  const { t } = useTranslation();

  const stock = [
    { name: t("screens.feed.s1"), sub: t("screens.bucket.muscle"), color: MEAT },
    { name: t("screens.feed.s2"), sub: t("screens.bucket.muscle"), color: MEAT },
    { name: t("screens.feed.s3"), sub: t("screens.bucket.organs"), color: ORGAN },
    { name: t("screens.feed.s4"), sub: t("screens.bucket.bones"), color: BONE },
  ];

  return (
    <Screen>
      <div className="flex flex-1 flex-col overflow-hidden px-4">
        <div className="flex items-center rounded-full bg-white p-1 shadow-sm">
          <span className="flex-1 rounded-full py-2.5 text-center text-[15px] font-medium text-gray-400">
            {t("screens.feed.manual")}
          </span>
          <span className="flex-1 rounded-full py-2.5 text-center text-[15px] font-bold text-gray-800" style={{ backgroundColor: LIME }}>
            {t("screens.feed.fridge")}
          </span>
        </div>

        <h1 className="py-4 text-center text-[21px] font-extrabold text-gray-900">{t("screens.feed.title")}</h1>

        <div className="flex justify-center gap-2.5 pb-4">
          {[MEAT, BONE, ORGAN, OTHER].map((c) => (
            <span key={c} className="h-6 w-6 rounded-full" style={{ backgroundColor: c }} />
          ))}
          <span className="h-6 w-6 rounded-full ring-2 ring-offset-2" style={{ backgroundColor: INK, boxShadow: `0 0 0 2px ${LIME}` }} />
        </div>

        <div className="rounded-[20px] bg-white p-4 shadow-sm">
          {stock.map((item, i) => (
            <div key={item.name} className={`flex items-center gap-3 ${i === 0 ? "pb-3" : "py-3"}`}>
              <span className="h-6 w-6 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[16px] font-bold text-gray-900">{item.name}</span>
                <span className="truncate text-[13px] text-gray-400">{item.sub}</span>
              </div>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full" style={{ backgroundColor: "#eaf5d4" }}>
                <Plus className="h-4 w-4" style={{ color: LIME_INK }} strokeWidth={2.5} />
              </span>
            </div>
          ))}
        </div>

        <div className="mt-3 rounded-[20px] bg-white p-4 shadow-sm">
          <div className="flex items-baseline justify-between pb-3">
            <h2 className="text-[19px] font-extrabold text-gray-900">{t("screens.feed.bowl")}</h2>
            <span className="text-[13px] font-medium text-gray-400">{t("screens.feed.total")}: 350 g</span>
          </div>
          {[
            { name: t("screens.feed.s1"), sub: t("screens.bucket.muscle"), color: MEAT, amount: "300", unit: "g" },
            { name: t("screens.feed.s5"), sub: t("screens.feed.mix"), color: OTHER, amount: "1", unit: t("screens.feed.unit_pcs") },
          ].map((row) => (
            <div key={row.name} className="flex items-center gap-3 py-2">
              <span className="h-6 w-6 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[15px] font-bold text-gray-900">{row.name}</span>
                <span className="truncate text-[13px] text-gray-400">{row.sub}</span>
              </div>
              <span className="flex shrink-0 items-baseline gap-1 rounded-lg bg-[#f2f4f7] px-2.5 py-1.5">
                <span className="text-[15px] font-extrabold text-gray-900">{row.amount}</span>
                <span className="text-[12px] text-gray-400">{row.unit}</span>
              </span>
              <X className="h-4 w-4 shrink-0" style={{ color: MEAT }} />
            </div>
          ))}
        </div>
      </div>

      <div className="shrink-0 px-4 pb-8 pt-4">
        <div className="flex h-[58px] items-center justify-center rounded-[20px] text-[17px] font-bold text-white" style={{ backgroundColor: INK }}>
          {t("screens.feed.cta")}
        </div>
      </div>
    </Screen>
  );
}
