import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { Container } from "./screens/Container";
import { ObchodniPodminky } from "./pages/ObchodniPodminky";
import { ZasadyOchrany } from "./pages/ZasadyOchrany";
import { FaqPage } from "./pages/FaqPage";
import { StazeniPage } from "./pages/StazeniPage";
import { NovinkyPage } from "./pages/NovinkyPage";
import { ArticlePage } from "./pages/ArticlePage";
import { KalkulackaPage } from "./pages/KalkulackaPage";
import { ZabavaPage } from "./pages/ZabavaPage";
import { NotFoundPage } from "./pages/NotFoundPage";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
    <BrowserRouter>
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
    </BrowserRouter>
    </ThemeProvider>
  </StrictMode>,
);
