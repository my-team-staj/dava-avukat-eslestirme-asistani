import React, { useState } from "react";
import "../App.css";

function LawyerAddForm() {
  const [form, setForm] = useState({
    name: "",
    specialization: "",
    experienceYears: 0,
    city: "",
    email: "",
    phone: "",
    baroNumber: "",
    languagesSpoken: "",
    availableForProBono: false,
    rating: 0, // Genellikle kullanıcıdan alınmaz, istersek readonly veya default bırakırız
    totalCasesHandled: 0,
    education: "",
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
    // API isteği burada
    alert("Avukat başarıyla eklendi!");
    setForm({
      name: "",
      specialization: "",
      experienceYears: 0,
      city: "",
      email: "",
      phone: "",
      baroNumber: "",
      languagesSpoken: "",
      availableForProBono: false,
      rating: 0,
      totalCasesHandled: 0,
      education: "",
      isActive: true,
      workingGroupId: ""
    });
  };

  return (
    <form className="lex-form" onSubmit={handleSubmit}>
      <h2>Avukat Ekle</h2>
      <div className="lex-form-row">
        <label htmlFor="name">İsim Soyisim*</label>
        <input
          type="text"
          className="lex-form-input"
          id="name"
          name="name"
          placeholder="Örn: Av. Ayşe Demir"
          value={form.name}
          onChange={handleChange}
          required
        />
      </div>
      <div className="lex-form-row">
        <label htmlFor="specialization">Uzmanlık Alanı*</label>
        <input
          type="text"
          className="lex-form-input"
          id="specialization"
          name="specialization"
          placeholder="Örn: Ceza Hukuku"
          value={form.specialization}
          onChange={handleChange}
          required
        />
      </div>
      <div className="lex-form-row">
        <label htmlFor="experienceYears">Deneyim Yılı</label>
        <input
          type="number"
          className="lex-form-input"
          id="experienceYears"
          name="experienceYears"
          placeholder="Örn: 5"
          value={form.experienceYears}
          onChange={handleChange}
          min="0"
        />
      </div>
      <div className="lex-form-row">
        <label htmlFor="city">Şehir*</label>
        <input
          type="text"
          className="lex-form-input"
          id="city"
          name="city"
          placeholder="Örn: İstanbul"
          value={form.city}
          onChange={handleChange}
          required
        />
      </div>
      <div className="lex-form-row">
        <label htmlFor="email">E-Posta</label>
        <input
          type="email"
          className="lex-form-input"
          id="email"
          name="email"
          placeholder="avukat@email.com"
          value={form.email}
          onChange={handleChange}
        />
      </div>
      <div className="lex-form-row">
        <label htmlFor="phone">Telefon</label>
        <input
          type="tel"
          className="lex-form-input"
          id="phone"
          name="phone"
          placeholder="05xx xxx xx xx"
          value={form.phone}
          onChange={handleChange}
        />
      </div>
      <div className="lex-form-row">
        <label htmlFor="baroNumber">Baro No</label>
        <input
          type="text"
          className="lex-form-input"
          id="baroNumber"
          name="baroNumber"
          placeholder="Örn: 34521"
          value={form.baroNumber}
          onChange={handleChange}
        />
      </div>
      <div className="lex-form-row">
        <label htmlFor="languagesSpoken">Konuşulan Diller</label>
        <input
          type="text"
          className="lex-form-input"
          id="languagesSpoken"
          name="languagesSpoken"
          placeholder="Türkçe, İngilizce"
          value={form.languagesSpoken}
          onChange={handleChange}
        />
      </div>
      <div className="lex-form-row">
        <input
          type="checkbox"
          id="availableForProBono"
          name="availableForProBono"
          checked={form.availableForProBono}
          onChange={handleChange}
        />
        <label htmlFor="availableForProBono" style={{ marginLeft: 8, fontWeight: 500 }}>
          Pro Bono Hizmet Verebilir
        </label>
      </div>
      <div className="lex-form-row">
        <label htmlFor="rating">Puan (0-5)</label>
        <input
          type="number"
          className="lex-form-input"
          id="rating"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          min="0"
          max="5"
          step="0.1"
        />
      </div>
      <div className="lex-form-row">
        <label htmlFor="totalCasesHandled">Toplam Dava</label>
        <input
          type="number"
          className="lex-form-input"
          id="totalCasesHandled"
          name="totalCasesHandled"
          placeholder="Örn: 42"
          value={form.totalCasesHandled}
          onChange={handleChange}
          min="0"
        />
      </div>
      <div className="lex-form-row">
        <label htmlFor="education">Eğitim</label>
        <input
          type="text"
          className="lex-form-input"
          id="education"
          name="education"
          placeholder="Üniversite/Fakülte"
          value={form.education}
          onChange={handleChange}
        />
      </div>
      <div className="lex-form-row">
        <input
          type="checkbox"
          id="isActive"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
        />
        <label htmlFor="isActive" style={{ marginLeft: 8, fontWeight: 500 }}>
          Avukat Aktif Mi?
        </label>
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
      <div className="lex-form-actions">
        <button type="submit" className="lex-form-btn">
          Ekle
        </button>
      </div>
    </form>
  );
}

export default LawyerAddForm;
