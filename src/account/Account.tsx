import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AccountPage } from "./AccountPage";
import { WizardPage } from "./WizardPage";

/** /ucet — účet majitele psa: přihlášení, průvodce profilem psa, přehled psa. */
export const Account = () => {
  useEffect(() => {
    const previous = document.title;
    document.title = "Můj pes — BarfingApp";
    return () => { document.title = previous; };
  }, []);

  return (
    <Routes>
      <Route index element={<AccountPage />} />
      <Route path="pruvodce" element={<WizardPage />} />
      <Route path="*" element={<Navigate to="/ucet" replace />} />
    </Routes>
  );
};
