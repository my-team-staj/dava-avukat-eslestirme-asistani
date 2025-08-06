import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function LawyerAddForm() {
  const [form, setForm] = useState({
    name: "",
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

  const [workingGroups, setWorkingGroups] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:60227/api/workinggroups")
      .then((res) => setWorkingGroups(res.data))
      .catch((err) => console.error("Çalışma grupları alınamadı", err));
  }, []);

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
      await axios.post("https://localhost:60227/api/lawyers", form);
      alert("✅ Avukat başarıyla eklendi!");
      setForm({
        name: "",
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
    } catch (err) {
      console.error(err);
      alert("❌ Hata oluştu.");
    }
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
        <label htmlFor="workingGroupId">Çalışma Grubu</label>
        <select
          className="lex-form-input"
          id="workingGroupId"
          name="workingGroupId"
          value={form.workingGroupId}
          onChange={handleChange}
        >
          <option value="">-- Çalışma Grubu Seçin --</option>
          {workingGroups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.groupName}
            </option>
          ))}
        </select>
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

      <div className="lex-form-actions">
        <button type="submit" className="lex-form-btn">
          Ekle
        </button>
      </div>
    </form>
  );
}

export default LawyerAddForm;
