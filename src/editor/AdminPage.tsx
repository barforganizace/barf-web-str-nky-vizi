import { useEffect, useState } from "react";
import { EditorShell } from "./EditorShell";
import {
  approveProduct, categoryLabel, errorMessage, listAllProducts, loadComponents, loadVersion, photoUrl,
  productNutrients, rejectProduct, STATUS_LABEL,
  type Component, type Nutrients, type ReviewProduct, type Version,
} from "./api";
import { Button, Card, ErrorText, NutrientSummary, SourceBadge, Spinner, StatusBadge } from "./ui";

export const AdminPage = () => (
  <EditorShell requireAdmin>
    <Admin />
  </EditorShell>
);

const ORDER = ["in_review", "rejected", "published", "draft", "archived"];

function Admin() {
  const [products, setProducts] = useState<ReviewProduct[] | null>(null);
  const [error, setError] = useState("");

  const load = () => listAllProducts().then(setProducts).catch((e) => setError(errorMessage(e)));
  useEffect(() => { void load(); }, []);

  if (error) return <ErrorText>{error}</ErrorText>;
  if (!products) return <Spinner />;

  const waiting = products.filter((p) => p.status === "in_review");
  const others = products
    .filter((p) => p.status !== "in_review")
    .sort((a, b) => ORDER.indexOf(a.status) - ORDER.indexOf(b.status));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-[28px] font-extrabold text-fg-1 sm:text-[34px]">Schvalování produktů</h1>
        <p className="mt-1 text-sm text-fg-4">
          Schválený produkt se zapíše do tabulky foods a objeví se v katalogu appky. Zamítnutý se vrátí výrobci s poznámkou.
        </p>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-extrabold text-fg-1">Čeká na schválení ({waiting.length})</h2>
        {waiting.length === 0 ? (
          <Card><p className="text-sm text-fg-5">Nic nečeká. 🎉</p></Card>
        ) : (
          <div className="space-y-4">
            {waiting.map((p) => <ProductReview key={p.id} product={p} onChange={load} />)}
          </div>
        )}
      </section>

      {others.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-extrabold text-fg-1">Ostatní produkty</h2>
          <Card>
            <ul className="divide-y divide-hairline text-sm">
              {others.map((p) => (
                <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <div className="min-w-0">
                    <span className="font-semibold text-fg-1">{p.name || "Bez názvu"}</span>
                    <span className="ml-2 text-xs text-fg-5">{p.organizations?.name} · {categoryLabel(p.category)}</span>
                  </div>
                  <StatusBadge status={p.status} />
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </div>
  );
}

function ProductReview({ product, onChange }: { product: ReviewProduct; onChange: () => Promise<void> }) {
  const [version, setVersion] = useState<Version | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [nutrients, setNutrients] = useState<Nutrients | null>(null);
  const [note, setNote] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!product.current_version_id) return;
    const versionId = product.current_version_id;
    Promise.all([loadVersion(versionId), loadComponents(versionId), productNutrients(versionId)])
      .then(([v, c, n]) => { setVersion(v); setComponents(c); setNutrients(n); })
      .catch((e) => setError(errorMessage(e)));
  }, [product.current_version_id]);

  async function act(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
      await onChange();
    } catch (e) {
      setError(errorMessage(e));
      setBusy(false);
    }
  }

  const totalGrams = components.reduce((sum, c) => sum + c.grams, 0);
  const sumsTo100 = nutrients ? Math.abs(nutrients.total_percent - 100) <= 0.5 : false;

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {version?.photos?.front ? (
            <img src={photoUrl(version.photos.front)} alt="" className="h-20 w-20 rounded-xl border border-hairline object-cover" />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-app text-2xl">📦</div>
          )}
          <div>
            <h3 className="text-xl font-extrabold text-fg-1">{product.name || "Bez názvu"}</h3>
            <p className="text-sm text-fg-4">
              {product.organizations?.name ?? "—"}
              {product.organizations?.email && <span className="text-fg-6"> · {product.organizations.email}</span>}
            </p>
            <p className="mt-1 text-xs text-fg-5">
              {categoryLabel(product.category)}
              {version?.net_weight_g ? ` · balení ${version.net_weight_g} g` : ""}
              {version ? ` · verze ${version.version}` : ""}
              {product.food_id ? " · už je v appce (aktualizace)" : ""}
            </p>
            {product.description && <p className="mt-2 max-w-[560px] text-sm text-fg-3">{product.description}</p>}
          </div>
        </div>
        <StatusBadge status={product.status} />
      </div>

      <div className="mt-5 grid gap-6 lg:grid-cols-2">
        <div>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-fg-5">Složení</h4>
          {components.length === 0 ? (
            <p className="text-sm text-fg-5">{version ? "Bez surovin." : "Načítám…"}</p>
          ) : (
            <ul className="divide-y divide-hairline text-sm">
              {components.map((c) => (
                <li key={c.id} className="flex items-center justify-between gap-3 py-1.5">
                  <span className="flex min-w-0 items-center gap-2">
                    <span className="truncate text-fg-1">{c.name}</span>
                    <SourceBadge source={c.source} />
                  </span>
                  <span className="shrink-0 tabular-nums text-fg-4">
                    {c.grams.toLocaleString("cs-CZ")} g · {totalGrams > 0 ? ((c.grams / totalGrams) * 100).toFixed(1) : "0"} %
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-fg-5">Živiny na 100 g</h4>
          <NutrientSummary nutrients={nutrients} />
        </div>
      </div>

      {!sumsTo100 && nutrients && (
        <p className="mt-4 text-xs text-amber-700">Podíly nedávají 100 % — schválení selže, výrobce musí složení opravit.</p>
      )}
      <ErrorText>{error}</ErrorText>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {rejecting ? (
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <textarea
              className="min-h-[44px] flex-1 rounded-xl border border-strong bg-surface px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-lime"
              placeholder="Co je potřeba upravit? Výrobce poznámku uvidí."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              autoFocus
            />
            <Button variant="danger" disabled={busy || !note.trim()} onClick={() => act(() => rejectProduct(product.id, note.trim()))}>
              Zamítnout s poznámkou
            </Button>
            <Button variant="secondary" onClick={() => setRejecting(false)} disabled={busy}>Zpět</Button>
          </div>
        ) : (
          <>
            <Button variant="lime" disabled={busy || !nutrients} onClick={() => act(() => approveProduct(product.id))}>
              {busy ? "Chvilku…" : "Schválit a zapsat do appky"}
            </Button>
            <Button variant="danger" onClick={() => setRejecting(true)} disabled={busy}>Zamítnout</Button>
            <span className="text-xs text-fg-6">{STATUS_LABEL[product.status]}</span>
          </>
        )}
      </div>
    </Card>
  );
}
