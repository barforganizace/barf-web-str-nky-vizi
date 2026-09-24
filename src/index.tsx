import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n";
import { PageLoader } from "./components/PageLoader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToHash } from "./components/ScrollToHash";
import { initAnalytics } from "./lib/analytics";
import { SessionProvider } from "./lib/session";

initAnalytics();

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
      <BrowserRouter>
        <SessionProvider>
        <ScrollToHash />
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
