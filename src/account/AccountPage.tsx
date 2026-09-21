import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { SharedNav } from "../components/SharedNav";
import { AuthForm } from "../components/AuthForm";
import { supabase } from "../lib/supabase";
import { useSession } from "../lib/session";
import { Button, Card, Spinner } from "../editor/ui";
import { BOWL_PARTS, ageMonthsFromBirthDate, formatWeight, type Dog, type UnitSystem } from "./dogs";

function Intro() {
  const { t } = useTranslation();
  return (
    <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
      <div className="pt-4">
        <span className="mb-4 inline-block rounded-full bg-lime-faint px-3 py-1 text-xs font-bold text-lime-ink">{t("account.badge")}</span>
        <h1 className="text-[32px] font-extrabold leading-tight text-fg-1 sm:text-[40px]">{t("account.intro_title")}</h1>
        <p className="mt-4 max-w-[520px] text-base leading-relaxed text-fg-4">{t("account.intro_text")}</p>
        <ul className="mt-6 space-y-3 text-sm text-fg-3">
          {[t("account.point_1"), t("account.point_2"), t("account.point_3")].map((line) => (
            <li key={line} className="flex gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime text-[11px] font-black text-[#191c1d]">✓</span>
              {line}
            </li>
          ))}
        </ul>
      </div>
      <AuthForm redirectPath="/ucet" nameLabel={t("account.name_label")} nameHint={t("account.name_hint")} />
    </div>
  );
}

function DogCard({ dog, units }: { dog: Dog; units: UnitSystem }) {
  const { t } = useTranslation();
  const targets = dog.daily_targets;
  const ageMonths = ageMonthsFromBirthDate(dog.birth_date);
  const facts: [string, string][] = [
    [t("account.breed"), dog.breed || t(`wizard.breed_${dog.breed_size}`)],
    [t("account.weight"), formatWeight(dog.weight_kg, units)],
    [t("account.age"), t("account.age_value", { years: Math.floor(ageMonths / 12), months: ageMonths % 12 })],
    [t("wizard.activity_level"), t(`wizard.activity_${dog.activity_level}`)],
    [t("wizard.body_condition"), t(`wizard.body_${dog.body_condition}`)],
    [t("wizard.castration"), dog.is_neutered ? t("account.yes") : t("account.no")],
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-app">
            {dog.avatar_url
              ? <img src={dog.avatar_url} alt="" className="h-full w-full object-cover" />
              : <img src={`/plemeno-${{ small: "maly", medium: "stredni", large: "velky", giant: "obri" }[dog.breed_size]}-pes.svg`} alt="" className="h-12 w-12" />}
          </div>
          <div>
            <h1 className="text-[28px] font-extrabold leading-tight text-fg-1">{dog.name}</h1>
            {targets && <span className="text-xs font-bold text-fg-5">{t(`wizard.stage_${targets.life_stage}`)}</span>}
          </div>
        </div>
        <dl className="mt-6 text-sm">
          {facts.map(([label, value]) => (
            <div key={label} className="flex items-baseline justify-between gap-2 border-b border-hairline py-2">
              <dt className="text-fg-5">{label}</dt>
              <dd className="font-semibold text-fg-1">{value}</dd>
            </div>
          ))}
        </dl>
        {dog.health_conditions.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {dog.health_conditions.map((h) => (
              <span key={h} className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">{t(`wizard.health_${h}`)}</span>
            ))}
          </div>
        )}
      </Card>

      <Card title={t("wizard.daily_dose")}>
        {targets ? (
          <>
            <p className="text-[52px] font-extrabold leading-tight text-fg-1">
              {targets.ration_g} <span className="text-[28px]">g</span>
            </p>
            <p className="mt-1 text-sm text-fg-5">
              {targets.kcal} kcal · {targets.percent.toFixed(1)} % {t("wizard.weight_share")}
            </p>
            <ul className="mt-5 divide-y divide-hairline text-sm">
              {BOWL_PARTS.map((part) => (
                <li key={part.key} className="flex items-center justify-between py-2">
                  <span className="inline-flex items-center gap-2 text-fg-3">
                    <i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: part.color }} />
                    {t(`wizard.bowl_${part.key}`)} ({dog[part.pct] as number} %)
                  </span>
                  <span className="font-semibold tabular-nums text-fg-1">{targets[part.grams]} g</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p className="text-sm text-fg-5">—</p>
        )}
        <p className="mt-5 text-xs text-fg-6">{t("account.edit_in_app")}</p>
        <a
          href="https://barfing.net"
          target="_blank"
          rel="noopener"
          className="mt-3 inline-flex h-11 items-center justify-center rounded-card bg-navy px-5 text-sm font-bold text-fg-0 transition hover:bg-navy-2"
        >
          {t("account.open_app")}
        </a>
      </Card>
    </div>
  );
}

export function AccountPage() {
  const { t } = useTranslation();
  const { user, loading, dogs, dogsLoading, hasOrg } = useSession();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [units, setUnits] = useState<UnitSystem>("metric");

  useEffect(() => {
    if (!user) return;
    supabase.from("user_preferences").select("unit_system").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => { if (data?.unit_system === "imperial") setUnits("imperial"); });
  }, [user?.id]);

  let body;
  if (loading || (user && dogsLoading)) body = <Spinner />;
  else if (!user) body = <Intro />;
  else if (dogs.length === 0) return <Navigate to="/ucet/pruvodce" replace />;
  else {
    const dog = dogs.find((d) => d.id === activeId) ?? dogs[0];
    body = (
      <>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {dogs.length > 1 && dogs.map((d) => (
              <button
                key={d.id}
                type="button"
                onClick={() => setActiveId(d.id)}
                className={`h-9 rounded-full px-4 text-sm font-bold transition ${d.id === dog.id ? "bg-lime text-[#191c1d]" : "bg-surface text-fg-3 hover:bg-app"}`}
              >
                {d.name}
              </button>
            ))}
            <Link to="/ucet/pruvodce" className="inline-flex h-9 items-center rounded-full border border-strong px-4 text-sm font-bold text-fg-3 transition hover:bg-app">
              + {t("account.add_dog")}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            {hasOrg && (
              <Link to="/editor" className="rounded-full bg-lime-faint px-3 py-1 text-xs font-bold text-lime-ink hover:opacity-80">
                {t("account.editor_link")}
              </Link>
            )}
            <span className="hidden max-w-[220px] truncate text-xs text-fg-5 sm:inline">{user.email}</span>
            <Button variant="secondary" className="h-9 px-4 text-xs" onClick={() => supabase.auth.signOut()}>
              {t("account.logout")}
            </Button>
          </div>
        </div>
        <DogCard dog={dog} units={units} />
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-app-2">
      <SharedNav />
      <main className="mx-auto w-full max-w-[1180px] flex-1 px-5 py-8 sm:px-8">{body}</main>
    </div>
  );
}
