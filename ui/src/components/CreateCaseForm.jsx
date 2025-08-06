import React, { useState } from "react";
import "../App.css";

function CreateCaseForm() {
  const [form, setForm] = useState({
    title: "",
    caseType: "",
    description: "",
    filedDate: new Date().toISOString().substring(0, 10), // yyyy-mm-dd
    city: "",
    language: "Türkçe",
    urgencyLevel: "Normal",
    requiresProBono: false,
    estimatedDurationInDays: 0,
    requiredExperienceLevel: "Orta",
    isActive: true,
    workingGroupId: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // API isteğini burada yazabilirsin
    alert("Dava başarıyla oluşturuldu!");
    // Burada POST işlemini ekle
    setForm({
      title: "",
      caseType: "",
      description: "",
      filedDate: new Date().toISOString().substring(0, 10),
      city: "",
      language: "Türkçe",
      urgencyLevel: "Normal",
      requiresProBono: false,
      estimatedDurationInDays: 0,
      requiredExperienceLevel: "Orta",
      isActive: true,
      workingGroupId: ""
    });
  };

  return (
    <form className="lex-form" onSubmit={handleSubmit}>
      <h2>Dava Oluştur</h2>

      <div className="lex-form-row">
        <label htmlFor="title">Başlık*</label>
        <input
          type="text"
          className="lex-form-input"
          id="title"
          name="title"
          placeholder="Örn: Miras Davası"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="caseType">Dava Türü*</label>
        <input
          type="text"
          className="lex-form-input"
          id="caseType"
          name="caseType"
          placeholder="Örn: Aile Hukuku"
          value={form.caseType}
          onChange={handleChange}
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="description">Açıklama</label>
        <textarea
          className="lex-form-input"
          id="description"
          name="description"
          placeholder="Dava ile ilgili kısa açıklama"
          value={form.description}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="filedDate">Başvuru Tarihi</label>
        <input
          type="date"
          className="lex-form-input"
          id="filedDate"
          name="filedDate"
          value={form.filedDate}
          onChange={handleChange}
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="city">Şehir*</label>
        <input
          type="text"
          className="lex-form-input"
          id="city"
          name="city"
          placeholder="Örn: Ankara"
          value={form.city}
          onChange={handleChange}
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="language">Dil</label>
        <input
          type="text"
          className="lex-form-input"
          id="language"
          name="language"
          placeholder="Türkçe"
          value={form.language}
          onChange={handleChange}
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="urgencyLevel">Aciliyet</label>
        <select
          className="lex-form-input"
          id="urgencyLevel"
          name="urgencyLevel"
          value={form.urgencyLevel}
          onChange={handleChange}
        >
          <option value="Normal">Normal</option>
          <option value="Acil">Acil</option>
          <option value="Düşük Öncelik">Düşük Öncelik</option>
        </select>
      </div>

      

      <div className="lex-form-row">
        <label htmlFor="estimatedDurationInDays">Tahmini Süre (gün)</label>
        <input
          type="number"
          className="lex-form-input"
          id="estimatedDurationInDays"
          name="estimatedDurationInDays"
          placeholder="Örn: 30"
          value={form.estimatedDurationInDays}
          onChange={handleChange}
          min="0"
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="requiredExperienceLevel">Tecrübe Seviyesi</label>
        <select
          className="lex-form-input"
          id="requiredExperienceLevel"
          name="requiredExperienceLevel"
          value={form.requiredExperienceLevel}
          onChange={handleChange}
        >
          <option value="Başlangıç">Başlangıç</option>
          <option value="Orta">Orta</option>
          <option value="Uzman">Uzman</option>
        </select>
      </div>

      

      <div className="lex-form-row">
        <label htmlFor="workingGroupId">Çalışma Grubu ID</label>
        <input
          type="number"
          className="lex-form-input"
          id="workingGroupId"
          name="workingGroupId"
          placeholder="Varsa"
          value={form.workingGroupId}
          onChange={handleChange}
          min="0"
        />
      </div>
      <div className="lex-form-row">
        <input
          type="checkbox"
          id="requiresProBono"
          name="requiresProBono"
          checked={form.requiresProBono}
          onChange={handleChange}
        />
        <label htmlFor="requiresProBono" style={{ marginLeft: 8, fontWeight: 500 }}>
          Pro Bono (Ücretsiz Hizmet Gerekli mi?)
        </label>
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
