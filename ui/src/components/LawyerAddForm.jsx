import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../App.css";

function LawyerAddForm() {
  const navigate = useNavigate();
  const [workingGroups, setWorkingGroups] = useState([]);
  const [form, setForm] = useState({
    fullName: "",
    isActive: true,
    city: "",
    workGroup: "",
    title: "",
    phone: "",
    email: "",
    startDate: new Date().toISOString().split('T')[0],
    languages: "",
    education: "",
    prmEmployeeRecordType: ""
  });


  useEffect(() => {
    fetchWorkingGroups();
  }, []);

  async function fetchWorkingGroups() {
    try {
      const res = await axios.get("https://localhost:60227/api/workinggroups");
      setWorkingGroups(res.data || []);
    } catch (err) {
      console.error("Çalışma grupları alınamadı:", err);
    }
  }

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
      console.log("Gönderilen form verisi:", form);
      const response = await axios.post("https://localhost:60227/api/lawyers", form);
      console.log("API yanıtı:", response.data);
      toast.success("✅ Avukat başarıyla eklendi!");
      
      // Formu temizle
      setForm({
        fullName: "",
        isActive: true,
        city: "",
        workGroup: "",
        title: "",
        phone: "",
        email: "",
        startDate: new Date().toISOString().split('T')[0],
        languages: "",
        education: "",
        prmEmployeeRecordType: ""
      });

      // Başarılı kayıt sonrası avukat listesine yönlendir
      setTimeout(() => {
        navigate("/lawyers");
      }, 1500); // 1.5 saniye bekle ki kullanıcı başarı mesajını görebilsin
      
    } catch (err) {
      console.error("Avukat eklenirken hata oluştu:", err);
      console.error("Hata detayları:", err.response?.data);
      toast.error("❌ Avukat eklenirken hata oluştu: " + (err.response?.data?.message || err.message));
      // Hata durumunda yönlendirme yapma
    }
  };

  return (
    <form className="lex-form" onSubmit={handleSubmit}>
      <h2>Avukat Ekle</h2>

      <div className="lex-form-row">
        <label htmlFor="fullName">Ad Soyad*</label>
        <input
          type="text"
          className="lex-form-input"
          id="fullName"
          name="fullName"
          placeholder="Örn: Av. Ayşe Demir"
          value={form.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="title">Ünvan</label>
        <select
          className="lex-form-input"
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
        >
          <option value="">-- Ünvan Seçin --</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="Stajyer Avukat">Stajyer Avukat</option>
          <option value="Yaz Stajyeri">Yaz Stajyeri</option>
        </select>
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
        <label htmlFor="email">E-Posta*</label>
        <input
          type="email"
          className="lex-form-input"
          id="email"
          name="email"
          placeholder="avukat@email.com"
          value={form.email}
          onChange={handleChange}
          required
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
        <label htmlFor="workGroup">Çalışma Grubu</label>
        <select
          className="lex-form-input"
          id="workGroup"
          name="workGroup"
          value={form.workGroup}
          onChange={handleChange}
        >
          <option value="">-- Çalışma Grubu Seçin --</option>
          {workingGroups.map(wg => (
            <option key={wg.id} value={wg.groupName}>{wg.groupName}</option>
          ))}
        </select>
      </div>


      <div className="lex-form-row">
        <label htmlFor="languages">Diller</label>
        <input
          type="text"
          className="lex-form-input"
          id="languages"
          name="languages"
          placeholder="Türkçe, İngilizce"
          value={form.languages}
          onChange={handleChange}
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="startDate">İşe Başlama Tarihi</label>
        <input
          type="date"
          className="lex-form-input"
          id="startDate"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="prmEmployeeRecordType">Kıdem</label>
        <select
          className="lex-form-input"
          id="prmEmployeeRecordType"
          name="prmEmployeeRecordType"
          value={form.prmEmployeeRecordType}
          onChange={handleChange}
        >
          <option value="">-- Kıdem Seçin --</option>
          <option value="Associate-Level 1">Associate-Level 1</option>
          <option value="Associate-Level 2">Associate-Level 2</option>
          <option value="Associate-Level 3">Associate-Level 3</option>
          <option value="Associate-Level 4">Associate-Level 4</option>
          <option value="Trainee-All trainees">Trainee-All trainees</option>
        </select>
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
          Aktif
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
