// ui/src/components/CreateCaseForm.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../App.css";

import { CITIES } from "../constants";
import SearchableSelect from "./inputs/SearchableSelect";

function CreateCaseForm() {
  const navigate = useNavigate();

  const initialForm = {
    // ZORUNLU
    ContactClient: "",
    FileSubject: "",
    PrmNatureOfAssignment: "",
    PrmCasePlaceofUseSubject: "",
    SubjectMatterDescription: "",
    IsToBeInvoiced: false,
    Description: "",
    // YERLEŞİM / OPSİYONEL
    City: "",
    County: "",
    Address: "",
  };

  const [form, setForm] = useState(initialForm);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        CaseResponsible: "Gün Hukuk Bürosu", // sabit
      };

      await axios.post("https://localhost:60227/api/cases", payload);
      toast.success("✅ Dava başarıyla oluşturuldu!");
      setForm(initialForm);
      setTimeout(() => navigate("/cases"), 1500);
    } catch (error) {
      console.error(error.response?.data || error);
      toast.error("❌ Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <form className="lex-form lex-form--wide" onSubmit={handleSubmit}>
      <h2 className="lex-form-title">Dava Oluştur</h2>

      {/* ZORUNLU ALANLAR */}
      <div className="lex-form-row">
        <label htmlFor="ContactClient">Müvekkil*</label>
        <input
          type="text"
          className="lex-form-input"
          id="ContactClient"
          name="ContactClient"
          placeholder="Örn: Ahmet Yılmaz"
          value={form.ContactClient}
          onChange={handleChange}
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="FileSubject">Dosya Konusu*</label>
        <input
          type="text"
          className="lex-form-input"
          id="FileSubject"
          name="FileSubject"
          placeholder="Örn: Miras Davası"
          value={form.FileSubject}
          onChange={handleChange}
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="PrmNatureOfAssignment">Görevin Niteliği*</label>
        <input
          type="text"
          className="lex-form-input"
          id="PrmNatureOfAssignment"
          name="PrmNatureOfAssignment"
          placeholder="Örn: Danışmanlık / Dava Takibi"
          value={form.PrmNatureOfAssignment}
          onChange={handleChange}
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="PrmCasePlaceofUseSubject">Kullanım Yeri Konusu*</label>
        <input
          type="text"
          className="lex-form-input"
          id="PrmCasePlaceofUseSubject"
          name="PrmCasePlaceofUseSubject"
          placeholder="Örn: Ankara Adliyesi / İcra Dairesi"
          value={form.PrmCasePlaceofUseSubject}
          onChange={handleChange}
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="SubjectMatterDescription">Konu Açıklaması*</label>
        <input
          type="text"
          className="lex-form-input"
          id="SubjectMatterDescription"
          name="SubjectMatterDescription"
          placeholder="Örn: Miras paylaşımı ihtilafı"
          value={form.SubjectMatterDescription}
          onChange={handleChange}
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="IsToBeInvoiced">Faturalandırılacak mı?*</label>
        <div className="lex-checkbox-wrap">
          <input
            type="checkbox"
            id="IsToBeInvoiced"
            name="IsToBeInvoiced"
            checked={form.IsToBeInvoiced}
            onChange={handleChange}
          />
          <span>Evet</span>
        </div>
      </div>

      <div className="lex-form-row">
        <label htmlFor="Description">Açıklama*</label>
        <textarea
          className="lex-form-input"
          id="Description"
          name="Description"
          placeholder="Dava ile ilgili kısa açıklama"
          value={form.Description}
          onChange={handleChange}
          rows={4}
          required
        />
      </div>

      {/* YERLEŞİM / OPSİYONEL ALANLAR */}
      <div className="lex-form-row">
        <label>Şehir*</label>
        <SearchableSelect
          options={CITIES}
          value={form.City}
          onChange={(v) => setForm((p) => ({ ...p, City: v }))}
          placeholder="Şehir seçin…"
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="County">İlçe</label>
        <input
          type="text"
          className="lex-form-input"
          id="County"
          name="County"
          value={form.County}
          onChange={handleChange}
          placeholder="Örn: Çankaya"
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="Address">Adres</label>
        <input
          type="text"
          className="lex-form-input"
          id="Address"
          name="Address"
          value={form.Address}
          onChange={handleChange}
        />
      </div>

      <div className="lex-form-actions">
        <button type="submit" className="lex-form-btn">
          Kaydet
        </button>
      </div>
    </form>
  );
}

export default CreateCaseForm;
