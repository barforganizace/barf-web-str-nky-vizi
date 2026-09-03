import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSession } from "./session";
import { EditorShell } from "./EditorShell";
import {
  CATEGORIES, categoryLabel, createOrganization, createProduct, errorMessage, listProducts, myOrganization,
  type Organization, type Product,
} from "./api";
import { Button, Card, ErrorText, Field, inputClass, Spinner, StatusBadge } from "./ui";

export const ProductsPage = () => (
  <EditorShell>
    <Products />
  </EditorShell>
);

function Products() {
  const { user } = useSession();
  const [org, setOrg] = useState<Organization | null | undefined>(undefined);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState("");

  const load = async () => {
    const found = await myOrganization(user!.id);
    setOrg(found);
    if (found) setProducts(await listProducts(found.id));
  };

  useEffect(() => {
    load().catch((e) => setError(errorMessage(e)));
  }, [user?.id]);

  if (error) return <ErrorText>{error}</ErrorText>;
  if (org === undefined) return <Spinner />;
  if (org === null) return <OrgSetup onDone={() => load().catch((e) => setError(errorMessage(e)))} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-fg-5">{org.name}</p>
          <h1 className="text-[28px] font-extrabold text-fg-1 sm:text-[34px]">Moje produkty</h1>
        </div>
        <NewProductForm orgId={org.id} />
      </div>

      {products.length === 0 ? (
        <Card>
          <p className="text-sm text-fg-4">
            Zatím tu nic není. Založ první produkt — třeba mix, kompletní menu nebo balíček masitých kostí.
          </p>
        </Card>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {products.map((p) => (
            <li key={p.id}>
              <Link
                to={`/editor/produkt/${p.id}`}
                className="block rounded-panel border border-hairline bg-surface p-5 shadow-soft transition hover:border-strong hover:shadow-lifted"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-extrabold text-fg-1">{p.name || "Bez názvu"}</h2>
                    <p className="text-xs text-fg-5">{categoryLabel(p.category)}</p>
                  </div>
                  <StatusBadge status={p.status} />
                </div>
                {p.status === "rejected" && p.review_note && (
                  <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{p.review_note}</p>
                )}
                <p className="mt-3 text-xs text-fg-6">
                  Upraveno {new Date(p.updated_at).toLocaleDateString("cs-CZ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function NewProductForm({ orgId }: { orgId: string }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("mix");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const id = await createProduct(orgId, name.trim(), category);
      navigate(`/editor/produkt/${id}`);
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  }

  if (!open) return <Button variant="lime" onClick={() => setOpen(true)}>+ Nový produkt</Button>;

  return (
    <form onSubmit={submit} className="flex w-full flex-col gap-3 rounded-panel border border-hairline bg-surface p-4 shadow-soft sm:w-auto sm:flex-row sm:items-end">
      <Field label="Název">
        <input className={`${inputClass} sm:w-56`} value={name} onChange={(e) => setName(e.target.value)} placeholder="Např. Kuřecí mix s játry" required autoFocus />
      </Field>
      <Field label="Typ">
        <select className={`${inputClass} sm:w-48`} value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </Field>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading || !name.trim()}>Založit</Button>
        <Button type="button" variant="secondary" onClick={() => setOpen(false)}>Zrušit</Button>
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </form>
  );
}

/** První přihlášení: uživatel nemá firmu, založí si profil. */
function OrgSetup({ onDone }: { onDone: () => void }) {
  const { user } = useSession();
  const [name, setName] = useState((user?.user_metadata?.display_name as string | undefined) ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [website, setWebsite] = useState("");
  const [ico, setIco] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await createOrganization({ name: name.trim(), email: email.trim(), website: website.trim(), ico: ico.trim() });
      onDone();
    } catch (err) {
      setError(errorMessage(err));
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-[560px]">
      <h1 className="text-[28px] font-extrabold text-fg-1">Ještě profil</h1>
      <p className="mt-2 text-sm text-fg-4">
        Pod tímhle názvem se produkty objeví v appce. Firma i jednotlivec — stačí název, zbytek je nepovinný.
      </p>
      <Card className="mt-6">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Název firmy nebo jméno">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} required autoFocus />
          </Field>
          <Field label="Kontaktní e-mail">
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Web">
              <input className={inputClass} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
            </Field>
            <Field label="IČO">
              <input className={inputClass} value={ico} onChange={(e) => setIco(e.target.value)} />
            </Field>
          </div>
          <ErrorText>{error}</ErrorText>
          <Button type="submit" variant="lime" className="w-full" disabled={loading || !name.trim()}>
            {loading ? "Ukládám…" : "Pokračovat do editoru"}
          </Button>
        </form>
      </Card>
    </div>
  );
}
