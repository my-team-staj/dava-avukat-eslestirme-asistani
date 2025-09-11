// ui/src/components/CaseUpdateModal.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

// Şehir listesi + aramalı seçici (avukat formundaki ile aynı)
import { CITIES } from "../constants";
import SearchableSelect from "./inputs/SearchableSelect";

export default function CaseUpdateModal({ caseData, onClose, onUpdated }) {
  const [formData, setFormData] = useState({});

  // mini toast
  const notify = (msg) => {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, 2000);
  };

  // body scroll kilidi + ESC
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  // Modal açılışında formu doldur (Pascal/camel tolerant)
  useEffect(() => {
    if (!caseData) return;

    const val = (p, c) => caseData?.[p] ?? caseData?.[c] ?? "";

    setFormData({
      // Zorunlu
      ContactClient: val("contactClient", "contactclient"),
      FileSubject: val("fileSubject", "filesubject"),
      PrmNatureOfAssignment: val("prmNatureOfAssignment", "prmnatureofassignment"),
      PrmCasePlaceofUseSubject: val("prmCasePlaceofUseSubject", "prmcaseplaceofusesubject"),
      SubjectMatterDescription: val("subjectMatterDescription", "subjectmatterdescription"),
      IsToBeInvoiced:
        typeof caseData?.IsToBeInvoiced === "boolean"
          ? caseData.IsToBeInvoiced
          : !!caseData?.isToBeInvoiced,
      Description: val("description", "description"),

      // Sorumlu kişi UI’da yok ama payload’da zorunlu → mevcut değer ya da default
      CaseResponsible:
        val("caseResponsible", "caseresponsible") || "Gün Hukuk Bürosu",

      // Yerleşim / opsiyonel
      City: val("city", "city"),
      County: val("county", "county"),
      Address: val("address", "address"),
    });
  }, [caseData]);

  // backdrop tıklayınca kapat
  const handleBackdrop = (e) => {
    if (e.target.classList.contains("modal-overlay")) onClose();
  };

  // ortak change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((p) => ({
      ...p,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // KISA YÖNTEM → yalnızca gerekli alanlar + City/County/Address
    const payload = {
      contactClient: (formData.ContactClient || "").trim(),
      fileSubject: (formData.FileSubject || "").trim(),
      caseResponsible: (formData.CaseResponsible || "Gün Hukuk Bürosu").trim(),
      prmNatureOfAssignment: (formData.PrmNatureOfAssignment || "").trim(),
      prmCasePlaceofUseSubject: (formData.PrmCasePlaceofUseSubject || "").trim(),
      subjectMatterDescription: (formData.SubjectMatterDescription || "").trim(),
      isToBeInvoiced: !!formData.IsToBeInvoiced,
      description: (formData.Description || "").trim(),

      // Yerleşim (opsiyonel)
      city: formData.City || "",
      county: formData.County || "",
      address: formData.Address || "",
    };

    try {
      await axios.put(
        `https://localhost:60227/api/cases/${caseData.id ?? caseData?.Id}`,
        payload
      );
      notify("Dava başarıyla güncellendi");
      onUpdated?.();
      onClose();
    } catch (err) {
      console.error(err);
      notify("Güncelleme başarısız oldu");
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={handleBackdrop}>
      <div
        className="modal-card"
        style={{ maxWidth: 720 }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Dava Güncelle</h3>
          <button
            type="button"
            className="modal-close"
            aria-label="Kapat"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            {/* ZORUNLULAR */}
            <label htmlFor="ContactClient">Müvekkil (ContactClient)</label>
            <input
              id="ContactClient"
              name="ContactClient"
              className="lex-form-input"
              placeholder="Örn: Ahmet Yılmaz"
              value={formData.ContactClient || ""}
              onChange={handleChange}
              required
            />

            <label htmlFor="FileSubject">Dosya Konusu (FileSubject)</label>
            <input
              id="FileSubject"
              name="FileSubject"
              className="lex-form-input"
              placeholder="Örn: Miras Davası"
              value={formData.FileSubject || ""}
              onChange={handleChange}
              required
            />

            {/* Sorumlu kişi UI’da YOK — default/payload içinde set ediliyor */}

            <label htmlFor="PrmNatureOfAssignment">Görevin Niteliği</label>
            <input
              id="PrmNatureOfAssignment"
              name="PrmNatureOfAssignment"
              className="lex-form-input"
              placeholder="Örn: Danışmanlık / Dava Takibi"
              value={formData.PrmNatureOfAssignment || ""}
              onChange={handleChange}
              required
            />

            <label htmlFor="PrmCasePlaceofUseSubject">Kullanım Yeri Konusu</label>
            <input
              id="PrmCasePlaceofUseSubject"
              name="PrmCasePlaceofUseSubject"
              className="lex-form-input"
              placeholder="Örn: Ankara Adliyesi / İcra Dairesi"
              value={formData.PrmCasePlaceofUseSubject || ""}
              onChange={handleChange}
              required
            />

            <label htmlFor="SubjectMatterDescription">Konu Açıklaması</label>
            <input
              id="SubjectMatterDescription"
              name="SubjectMatterDescription"
              className="lex-form-input"
              placeholder="Örn: Miras paylaşımı ihtilafı"
              value={formData.SubjectMatterDescription || ""}
              onChange={handleChange}
              required
            />

            {/* Şehir: aramalı seçici (İlçe/Adres’in üstünde) */}
            <label>Şehir</label>
            <SearchableSelect
              options={CITIES}
              value={formData.City || ""}
              onChange={(v) => setFormData((p) => ({ ...p, City: v }))}
              placeholder="Şehir seçin…"
            />

            <label htmlFor="IsToBeInvoiced">Faturalandırılacak mı?</label>
            <div
              className="lex-form-input"
              style={{ display: "flex", alignItems: "center" }}
            >
              <input
                id="IsToBeInvoiced"
                type="checkbox"
                name="IsToBeInvoiced"
                checked={!!formData.IsToBeInvoiced}
                onChange={handleChange}
              />
              <label htmlFor="IsToBeInvoiced" style={{ marginLeft: 8 }}>
                Evet
              </label>
            </div>

            <label htmlFor="Description" style={{ alignSelf: "start" }}>
              Açıklama
            </label>
            <textarea
              id="Description"
              name="Description"
              className="lex-form-input"
              placeholder="Dava ile ilgili kısa açıklama"
              value={formData.Description || ""}
              onChange={handleChange}
              rows={3}
              style={{ width: "100%" }}
              required
            />

            {/* Ülke alanı kaldırıldı */}

            {/* İlçe / Adres */}
            <label htmlFor="County">İlçe (opsiyonel)</label>
            <input
              id="County"
              name="County"
              className="lex-form-input"
              value={formData.County || ""}
              onChange={handleChange}
              placeholder="Örn: Çankaya"
            />

            <label htmlFor="Address">Adres (opsiyonel)</label>
            <input
              id="Address"
              name="Address"
              className="lex-form-input"
              value={formData.Address || ""}
              onChange={handleChange}
            />

            {/* Avukat 1/2/3 KALDIRILDI */}

            <div className="form-actions" style={{ gridColumn: "1 / -1" }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Vazgeç
              </button>
              <button type="submit" className="btn-primary">
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
