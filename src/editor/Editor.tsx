import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { SessionProvider } from "./session";
import { ProductsPage } from "./ProductsPage";
import { ProductPage } from "./ProductPage";
import { AdminPage } from "./AdminPage";

/** /editor — mini platforma pro výrobce: registrace, produkty, složení, schvalování. */
export const Editor = () => {
  useEffect(() => {
    const previous = document.title;
    document.title = "Editor produktů — BarfingApp";
    return () => { document.title = previous; };
  }, []);

  return (
    <SessionProvider>
      <Routes>
        <Route index element={<ProductsPage />} />
        <Route path="produkt/:id" element={<ProductPage />} />
        <Route path="admin" element={<AdminPage />} />
        <Route path="*" element={<Navigate to="/editor" replace />} />
      </Routes>
    </SessionProvider>
  );
};
