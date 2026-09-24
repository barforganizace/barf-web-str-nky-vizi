import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n";
import { PageLoader } from "./components/PageLoader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToHash } from "./components/ScrollToHash";
import { LangHead } from "./components/LangHead";
import { initAnalytics } from "./lib/analytics";
import { DEFAULT_LANG, basenameOf, langFromPath, resolveLang } from "./lib/lang";
import { SessionProvider } from "./lib/session";

initAnalytics();

// Adresa bez prefixu patří češtině. Kdo si dřív zvolil jiný jazyk, jde rovnou na svou verzi;
// Googlebot nic uloženého nemá, takže české adresy zůstávají české.
const lang = resolveLang();
if (lang !== DEFAULT_LANG && !langFromPath(location.pathname)) {
  location.replace(`${basenameOf(lang)}${location.pathname}${location.search}${location.hash}`);
}

const Container = lazy(() => import("./screens/Container").then(m => ({ default: m.Container })));
const ObchodniPodminky = lazy(() => import("./pages/ObchodniPodminky").then(m => ({ default: m.ObchodniPodminky })));
const ZasadyOchrany = lazy(() => import("./pages/ZasadyOchrany").then(m => ({ default: m.ZasadyOchrany })));
const Cookies = lazy(() => import("./pages/Cookies").then(m => ({ default: m.Cookies })));
const BlogListPage = lazy(() => import("./pages/BlogListPage").then(m => ({ default: m.BlogListPage })));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage").then(m => ({ default: m.BlogPostPage })));
const SurovinyPage = lazy(() => import("./pages/SurovinyPage").then(m => ({ default: m.SurovinyPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));
const Editor = lazy(() => import("./editor/Editor").then(m => ({ default: m.Editor })));
const Account = lazy(() => import("./account/Account").then(m => ({ default: m.Account })));

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={basenameOf(lang)}>
        <SessionProvider>
        <ScrollToHash />
        <LangHead />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Container />} />
            <Route path="/blog" element={<BlogListPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/suroviny" element={<SurovinyPage />} />
            <Route path="/obchodni-podminky" element={<ObchodniPodminky />} />
            <Route path="/zasady-ochrany-osobnich-udaju" element={<ZasadyOchrany />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/editor/*" element={<Editor />} />
            <Route path="/ucet/*" element={<Account />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
        </SessionProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
