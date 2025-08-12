import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const API_BASE = "https://localhost:60227/api";

const initialState = {
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
  workingGroupId: "" // input'ta boş göstermek için string; gönderirken null/number'a çevireceğiz
};

export default function LawyerEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/lawyers/${id}`);
        const data = res.data || {};
        setForm({
          ...initialState,
          ...data,
          workingGroupId: data.workingGroupId ?? ""
        });
      } catch {
        setError("Avukat bilgisi alınamadı");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : ["experienceYears", "rating", "totalCasesHandled"].includes(name)
          ? (value === "" ? "" : Number(value))
          : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name?.trim()) return setError("İsim zorunlu");
    if (!form.email?.trim()) return setError("E-posta zorunlu");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Geçerli bir e-posta girin");

    try {
      setSaving(true);

      const payload = {
        ...form,
        // 0 veya "" geldiyse null gönder → FK hatası önlenir
        workingGroupId:
          form.workingGroupId === "" || Number(form.workingGroupId) === 0
            ? null
            : Number(form.workingGroupId)
      };

      await axios.put(`${API_BASE}/lawyers/${id}`, payload);
      navigate("/lawyers");
    } catch (e) {
      setError(e.response?.data?.message || "Güncelleme başarısız");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="container">Yükleniyor...</div>;

  return (
    <div className="container">
      <h2>Avukat Güncelle</h2>
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="form-card">
        <div className="form-grid">
          <label htmlFor="name">İsim</label>
          <input id="name" className="lex-form-input" name="name" value={form.name} onChange={handleChange} />

          <label htmlFor="experienceYears">Deneyim (yıl)</label>
          <input id="experienceYears" className="lex-form-input" type="number" name="experienceYears" value={form.experienceYears} onChange={handleChange} />

          <label htmlFor="city">Şehir</label>
          <input id="city" className="lex-form-input" name="city" value={form.city} onChange={handleChange} />

          <label htmlFor="email">E-posta</label>
          <input id="email" className="lex-form-input" type="email" name="email" value={form.email} onChange={handleChange} />

          <label htmlFor="phone">Telefon</label>
          <input id="phone" className="lex-form-input" name="phone" value={form.phone} onChange={handleChange} />

          <label htmlFor="baroNumber">Baro Numarası</label>
          <input id="baroNumber" className="lex-form-input" name="baroNumber" value={form.baroNumber} onChange={handleChange} />

          <label htmlFor="languagesSpoken">Diller</label>
          <input id="languagesSpoken" className="lex-form-input" name="languagesSpoken" value={form.languagesSpoken} onChange={handleChange} />

          <label htmlFor="education">Eğitim</label>
          <input id="education" className="lex-form-input" name="education" value={form.education} onChange={handleChange} />

          <label htmlFor="availableForProBono">Pro Bono</label>
          <input id="availableForProBono" type="checkbox" name="availableForProBono" checked={form.availableForProBono} onChange={handleChange} />

          <label htmlFor="rating">Rating</label>
          <input id="rating" className="lex-form-input" type="number" step="0.1" name="rating" value={form.rating} onChange={handleChange} />

          <label htmlFor="totalCasesHandled">Toplam Dosya</label>
          <input id="totalCasesHandled" className="lex-form-input" type="number" name="totalCasesHandled" value={form.totalCasesHandled} onChange={handleChange} />

          <label htmlFor="isActive">Aktif mi?</label>
          <input id="isActive" type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />

          <label htmlFor="workingGroupId">Çalışma Grubu (opsiyonel)</label>
          <input
            id="workingGroupId"
            className="lex-form-input"
            type="number"
            name="workingGroupId"
            value={form.workingGroupId}
            onChange={handleChange}
            placeholder="Boş bırakılabilir"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
          <button type="button" className="btn-secondary" onClick={() => navigate("/lawyers")}>
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
