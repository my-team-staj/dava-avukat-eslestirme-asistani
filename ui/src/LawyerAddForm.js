import React, { useState } from "react";
import axios from "axios";

const LawyerAddForm = ({ onSuccess }) => {
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
    rating: 0,
    totalCasesHandled: 0,
    education: "",
    isActive: true,
    workingGroupId: 0
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : (type === "number" ? Number(value) : value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/Lawyers", form);
      const id = response.data.id;
      setMessage(`Avukat başarıyla eklendi! (ID: ${id})`);
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
        workingGroupId: 0
      });
      onSuccess?.();
    } catch (err) {
      setMessage("Hata oluştu: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: "30px auto" }}>
      <h2>Avukat Ekle</h2>
      <input name="name" placeholder="İsim Soyisim" value={form.name} onChange={handleChange} required style={{ width: "100%", marginBottom: 10 }} />
      <input name="specialization" placeholder="Uzmanlık Alanı" value={form.specialization} onChange={handleChange} required style={{ width: "100%", marginBottom: 10 }} />
      <input name="experienceYears" type="number" placeholder="Deneyim (Yıl)" value={form.experienceYears} onChange={handleChange} min="0" style={{ width: "100%", marginBottom: 10 }} />
      <input name="city" placeholder="Şehir" value={form.city} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />
      <input name="email" type="email" placeholder="E-posta" value={form.email} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />
      <input name="phone" placeholder="Telefon" value={form.phone} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />
      <input name="baroNumber" placeholder="Baro No" value={form.baroNumber} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />
      <input name="languagesSpoken" placeholder="Konuşulan Diller" value={form.languagesSpoken} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />
      <label>
        Pro Bono? <input name="availableForProBono" type="checkbox" checked={form.availableForProBono} onChange={handleChange} />
      </label>
      <input name="rating" type="number" step="0.01" placeholder="Puan" value={form.rating} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />
      <input name="totalCasesHandled" type="number" placeholder="Toplam Dava" value={form.totalCasesHandled} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />
      <input name="education" placeholder="Eğitim" value={form.education} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />
      <label>
        Aktif Mi? <input name="isActive" type="checkbox" checked={form.isActive} onChange={handleChange} />
      </label>
      <input name="workingGroupId" type="number" placeholder="Çalışma Grubu ID (opsiyonel)" value={form.workingGroupId} onChange={handleChange} style={{ width: "100%", marginBottom: 10 }} />
      <button type="submit" style={{ width: "100%", marginTop: 10 }}>Ekle</button>
      <div style={{ marginTop: 10, color: message.includes("Hata") ? "red" : "green" }}>{message}</div>
    </form>
  );
};

export default LawyerAddForm;
