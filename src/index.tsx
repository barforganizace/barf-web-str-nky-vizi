import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n";
import { ThemeProvider } from "./components/ThemeProvider";
import { PageLoader } from "./components/PageLoader";
import { ErrorBoundary } from "./components/ErrorBoundary";

const Container = lazy(() => import("./screens/Container").then(m => ({ default: m.Container })));
const ObchodniPodminky = lazy(() => import("./pages/ObchodniPodminky").then(m => ({ default: m.ObchodniPodminky })));
const ZasadyOchrany = lazy(() => import("./pages/ZasadyOchrany").then(m => ({ default: m.ZasadyOchrany })));
const FaqPage = lazy(() => import("./pages/FaqPage").then(m => ({ default: m.FaqPage })));
const StazeniPage = lazy(() => import("./pages/StazeniPage").then(m => ({ default: m.StazeniPage })));
const NovinkyPage = lazy(() => import("./pages/NovinkyPage").then(m => ({ default: m.NovinkyPage })));
const ArticlePage = lazy(() => import("./pages/ArticlePage").then(m => ({ default: m.ArticlePage })));
const KalkulackaPage = lazy(() => import("./pages/KalkulackaPage").then(m => ({ default: m.KalkulackaPage })));
const ZabavaPage = lazy(() => import("./pages/ZabavaPage").then(m => ({ default: m.ZabavaPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Container />} />
              <Route path="/stazeni" element={<StazeniPage />} />
              <Route path="/novinky" element={<NovinkyPage />} />
              <Route path="/novinky/:id" element={<ArticlePage />} />
              <Route path="/kalkulacka" element={<KalkulackaPage />} />
              <Route path="/zabava" element={<ZabavaPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/obchodni-podminky" element={<ObchodniPodminky />} />
              <Route path="/zasady-ochrany-osobnich-udaju" element={<ZasadyOchrany />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
