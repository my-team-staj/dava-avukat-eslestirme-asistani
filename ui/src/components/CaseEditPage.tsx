// ui/src/components/CaseEditPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import CaseFormTabs from "./CaseFormTabs.tsx";

export default function CaseEditPage() {
  const { id } = useParams<{ id: string }>();
  const caseId = id ? parseInt(id, 10) : undefined;

  if (!caseId) {
    return (
      <div className="container">
        <div className="error-message">
          <h2>Hata</h2>
          <p>Geçersiz dava ID'si</p>
        </div>
      </div>
    );
  }

  return <CaseFormTabs mode="edit" caseId={caseId} />;
}
