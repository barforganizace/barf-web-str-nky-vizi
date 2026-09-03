import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Link, useParams } from "react-router-dom";
import { EditorShell } from "./EditorShell";
import {
  CATEGORIES, errorMessage, loadCatalog, loadProduct, newVersion, photoUrl, productNutrients, saveComponents,
  searchCatalog, updateProduct, updateVersion, uploadPhoto,
  type CatalogItem, type Component, type Nutrients, type Product, type Version,
} from "./api";
import { Button, Card, ErrorText, Field, inputClass, NutrientSummary, SourceBadge, Spinner, StatusBadge } from "./ui";

export const ProductPage = () => (
  <EditorShell>
    <ProductEditor />
  </EditorShell>
);

const SAVE_DELAY_MS = 600;

function ProductEditor() {
  const { id = "" } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [version, setVersion] = useState<Version | null>(null);
  const [components, setComponents] = useState<Component[]>([]);
  const [nutrients, setNutrients] = useState<Nutrients | null>(null);
  const [catalog, setCatalog] = useState<CatalogItem[] | null>(null);
  const [query, setQuery] = useState("");
  const [saving, setSaving] = useState<"idle" | "saving" | "saved">("idle");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  // Složení se ukládá s odstupem po poslední změně; pending drží to, co ještě není v DB.
  const saveTimer = useRef<number>();
  const pending = useRef<Component[] | null>(null);
  const versionRef = useRef<Version | null>(null);
  versionRef.current = version;

  async function reload() {
    const loaded = await loadProduct(id);
    setProduct(loaded.product);
    setVersion(loaded.version);
    setComponents(loaded.components);
    setNutrients(await productNutrients(loaded.version.id));
  }

  useEffect(() => {
    reload().catch((e) => setError(errorMessage(e)));
  }, [id]);

  useEffect(() => {
    loadCatalog().then(setCatalog).catch((e) => setError(errorMessage(e)));
  }, []);

  async function persist(versionId: string, next: Component[]) {
    setSaving("saving");
    try {
      await saveComponents(versionId, next);
      setNutrients(await productNutrients(versionId));
      setSaving("saved");
    } catch (e) {
      setError(errorMessage(e));
      setSaving("idle");
    }
  }

  async function flush() {
    window.clearTimeout(saveTimer.current);
    const next = pending.current;
    pending.current = null;
    if (next && versionRef.current) await persist(versionRef.current.id, next);
  }

  useEffect(() => () => { void flush(); }, []);

  function changeComponents(next: Component[]) {
    setComponents(next);
    pending.current = next;
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => { void flush(); }, SAVE_DELAY_MS);
  }

  const editable = !!version && !version.is_frozen && (product?.status === "draft" || product?.status === "rejected");
  const totalGrams = components.reduce((sum, c) => sum + c.grams, 0);
  const results = catalog && query.trim().length >= 2 ? searchCatalog(catalog, query) : [];

  function addItem(item: CatalogItem) {
    const exists = components.some((c) => (item.kind === "food" ? c.food_id === item.id : c.ingredient_id === item.id));
    setQuery("");
    if (exists) return;
    changeComponents([
      ...components,
      {
        id: crypto.randomUUID(),
        ingredient_id: item.kind === "ingredient" ? item.id : null,
        food_id: item.kind === "food" ? item.id : null,
        grams: 0,
        name: item.name,
        source: item.source,
      },
    ]);
  }

  function setGrams(componentId: string, raw: string) {
    const grams = Math.max(0, Number(raw.replace(",", ".")) || 0);
    changeComponents(components.map((c) => (c.id === componentId ? { ...c, grams } : c)));
  }

  function removeItem(componentId: string) {
    changeComponents(components.filter((c) => c.id !== componentId));
  }

  async function saveProduct(fields: Partial<Pick<Product, "name" | "category" | "description" | "status">>) {
    if (!product) return;
    try {
      await updateProduct(product.id, fields);
      setProduct({ ...product, ...fields });
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  async function saveWeight(raw: string) {
    if (!version) return;
    const grams = Math.round(Number(raw)) || null;
    if (grams === version.net_weight_g) return;
    try {
      await updateVersion(version.id, { net_weight_g: grams });
      setVersion({ ...version, net_weight_g: grams });
    } catch (e) {
      setError(errorMessage(e));
    }
  }

  async function onPhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !product || !version) return;
    setBusy(true);
    try {
      const path = await uploadPhoto(product.org_id, product.id, file);
      const photos = { ...version.photos, front: path };
      await updateVersion(version.id, { photos });
      setVersion({ ...version, photos });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  async function submitForReview() {
    if (!product) return;
    setBusy(true);
    setError("");
    try {
      await flush();
      if (!product.name.trim()) throw new Error("Doplň název produktu.");
      if (components.length === 0 || totalGrams <= 0) throw new Error("Přidej aspoň jednu surovinu a zadej gramy.");
      await updateProduct(product.id, { status: "in_review" });
      await reload();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  async function run(action: () => Promise<void>) {
    setBusy(true);
    setError("");
    try {
      await action();
      await reload();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  if (!product || !version) {
    return error ? (
      <div className="space-y-4">
        <ErrorText>{error}</ErrorText>
        <Link to="/editor" className="text-sm font-bold text-navy hover:underline">← Zpět na produkty</Link>
      </div>
    ) : <Spinner />;
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/editor" className="text-sm font-bold text-fg-5 hover:text-navy">← Moje produkty</Link>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <h1 className="truncate text-[28px] font-extrabold text-fg-1 sm:text-[34px]">{product.name || "Bez názvu"}</h1>
            <StatusBadge status={product.status} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {saving !== "idle" && (
              <span className="text-xs text-fg-5">{saving === "saving" ? "Ukládám…" : "Uloženo"}</span>
            )}
            {editable && (
              <Button variant="lime" onClick={submitForReview} disabled={busy || components.length === 0}>
                Odeslat ke schválení
              </Button>
            )}
            {product.status === "in_review" && (
              <Button variant="secondary" onClick={() => run(() => updateProduct(product.id, { status: "draft" }))} disabled={busy}>
                Vrátit do rozpracovaných
              </Button>
            )}
            {version.is_frozen && (
              <Button variant="secondary" onClick={() => run(() => newVersion(product.id))} disabled={busy}>
                Upravit (nová verze)
              </Button>
            )}
          </div>
        </div>
      </div>

      {product.status === "in_review" && (
        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Produkt čeká na schválení. Dokud ho nezkontrolujeme, nejde upravovat — případně ho vrať do rozpracovaných.
        </p>
      )}
      {product.status === "rejected" && product.review_note && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <p className="font-bold">Vráceno k úpravě</p>
          <p className="mt-1 whitespace-pre-line">{product.review_note}</p>
        </div>
      )}
      {product.status === "published" && (
        <p className="rounded-xl bg-lime-faint px-4 py-3 text-sm text-lime-ink">
          Produkt je schválený a v databázi BarfingApp. Změny uděláš v nové verzi, ta půjde znovu ke schválení.
        </p>
      )}
      <ErrorText>{error}</ErrorText>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.35fr)]">
        <Card title="Základní údaje">
          <div className="space-y-4">
            <Field label="Název">
              <input
                className={inputClass}
                defaultValue={product.name}
                disabled={!editable}
                onBlur={(e) => e.target.value.trim() !== product.name && saveProduct({ name: e.target.value.trim() })}
              />
            </Field>
            <Field label="Typ">
              <select className={inputClass} value={product.category} disabled={!editable} onChange={(e) => saveProduct({ category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </Field>
            <Field label="Popis" hint="Krátce pro zákazníky v appce: pro koho je, co je uvnitř.">
              <textarea
                className={`${inputClass} h-28 resize-y py-3`}
                defaultValue={product.description ?? ""}
                disabled={!editable}
                onBlur={(e) => e.target.value !== (product.description ?? "") && saveProduct({ description: e.target.value })}
              />
            </Field>
            <Field label="Hmotnost balení (g)" hint="Nepovinné. V appce pak půjde přidat do lednice po kusech.">
              <input
                className={inputClass}
                type="number"
                min={0}
                step={1}
                defaultValue={version.net_weight_g ?? ""}
                disabled={!editable}
                onBlur={(e) => saveWeight(e.target.value)}
              />
            </Field>
            <Field label="Fotka produktu">
              <div className="flex items-center gap-4">
                {version.photos?.front ? (
                  <img src={photoUrl(version.photos.front)} alt="" className="h-20 w-20 rounded-xl border border-hairline object-cover" />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-strong text-2xl">📷</div>
                )}
                {editable && (
                  <input type="file" accept="image/*" onChange={onPhoto} disabled={busy} className="text-xs text-fg-5 file:mr-3 file:rounded-full file:border-0 file:bg-app file:px-4 file:py-2 file:text-xs file:font-bold file:text-fg-2" />
                )}
              </div>
            </Field>
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Složení">
            {editable && (
              <div className="relative mb-4">
                <input
                  className={inputClass}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={catalog ? "Hledat surovinu… např. kuřecí krky, hovězí játra" : "Načítám suroviny…"}
                  disabled={!catalog}
                />
                {results.length > 0 && (
                  <ul className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-xl border border-hairline bg-surface py-1 shadow-lifted">
                    {results.map((item) => (
                      <li key={`${item.kind}-${item.id}`}>
                        <button
                          type="button"
                          onClick={() => addItem(item)}
                          className="flex w-full items-center justify-between gap-3 px-4 py-2 text-left text-sm hover:bg-app-2"
                        >
                          <span className="min-w-0">
                            <span className="block truncate font-semibold text-fg-1">{item.name}</span>
                            <span className="text-xs text-fg-5">{item.group}</span>
                          </span>
                          <SourceBadge source={item.source} />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {query.trim().length >= 2 && catalog && results.length === 0 && (
                  <p className="mt-2 text-xs text-fg-5">Nic jsme nenašli. Zkus jiné slovo, třeba jen „kuřecí".</p>
                )}
              </div>
            )}

            {components.length === 0 ? (
              <p className="text-sm text-fg-5">Zatím žádné suroviny.</p>
            ) : (
              <div className="divide-y divide-hairline">
                {components.map((c) => {
                  const share = totalGrams > 0 ? (c.grams / totalGrams) * 100 : 0;
                  return (
                    <div key={c.id} className="grid grid-cols-[minmax(0,1fr)_96px_56px_32px] items-center gap-2 py-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="truncate text-sm font-semibold text-fg-1" title={c.name}>{c.name}</span>
                        <SourceBadge source={c.source} />
                      </div>
                      <div className="relative">
                        <input
                          className={`${inputClass} h-10 pr-7 text-right`}
                          type="number"
                          min={0}
                          step="any"
                          value={c.grams || ""}
                          placeholder="0"
                          disabled={!editable}
                          onChange={(e) => setGrams(c.id, e.target.value)}
                        />
                        <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-fg-6">g</span>
                      </div>
                      <span className="text-right text-sm tabular-nums text-fg-4">{share.toFixed(1)} %</span>
                      {editable ? (
                        <button type="button" onClick={() => removeItem(c.id)} aria-label="Odebrat" className="h-8 w-8 rounded-full text-fg-5 transition hover:bg-red-50 hover:text-red-600">✕</button>
                      ) : <span />}
                    </div>
                  );
                })}
                <div className="flex items-center justify-between pt-3 text-sm">
                  <span className="font-bold text-fg-2">Celkem</span>
                  <span className="font-bold tabular-nums text-fg-1">{totalGrams.toLocaleString("cs-CZ")} g</span>
                </div>
              </div>
            )}
          </Card>

          <Card title="Živiny na 100 g">
            <NutrientSummary nutrients={nutrients} />
          </Card>
        </div>
      </div>
    </div>
  );
}
