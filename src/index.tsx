import { StrictMode, Suspense, lazy } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./i18n";
import { PageLoader } from "./components/PageLoader";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { ScrollToHash } from "./components/ScrollToHash";
import { initAnalytics } from "./lib/analytics";

initAnalytics();

const Container = lazy(() => import("./screens/Container").then(m => ({ default: m.Container })));
const ObchodniPodminky = lazy(() => import("./pages/ObchodniPodminky").then(m => ({ default: m.ObchodniPodminky })));
const ZasadyOchrany = lazy(() => import("./pages/ZasadyOchrany").then(m => ({ default: m.ZasadyOchrany })));
const KalkulackaPage = lazy(() => import("./pages/KalkulackaPage").then(m => ({ default: m.KalkulackaPage })));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage").then(m => ({ default: m.NotFoundPage })));

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToHash />
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Container />} />
            <Route path="/kalkulacka" element={<KalkulackaPage />} />
            <Route path="/obchodni-podminky" element={<ObchodniPodminky />} />
            <Route path="/zasady-ochrany-osobnich-udaju" element={<ZasadyOchrany />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
);
