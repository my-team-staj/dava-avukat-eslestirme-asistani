import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../App.css";

const API_BASE = "https://localhost:60227/api";

const initialForm = {
  title: "",
  description: "",
  filedDate: new Date().toISOString().substring(0, 10),
  city: "",
  language: "Türkçe",
  urgencyLevel: "Normal",
  requiresProBono: false,
  estimatedDurationInDays: 0,
  requiredExperienceLevel: "Orta",
  workingGroupId: "" // select için string; submit'te null/number'a çevrilecek
};

function CreateCaseForm() {
  const [form, setForm] = useState(initialForm);
  const [workingGroups, setWorkingGroups] = useState([]);

  // Çalışma gruplarını güvenli şekilde çek
  useEffect(() => {
    (async () => {
      try {
        // Farklı casing denemeleri (IIS vs Kestrel)
        let res;
        try { res = await axios.get(`${API_BASE}/workinggroups`); } catch {}
        if (!res) { try { res = await axios.get(`${API_BASE}/WorkingGroups`); } catch {} }
        if (!res) { res = await axios.get(`${API_BASE}/Workinggroups`); }

        const raw = res?.data ?? [];
        const list = Array.isArray(raw) ? raw : (raw.items ?? []);
        const normalized = (list || [])
          .map(g => ({
            id: g.id ?? g.workingGroupId ?? g.groupId,
            name: g.groupName ?? g.name ?? g.title
          }))
          .filter(x => x.id && x.name);

        setWorkingGroups(normalized);
      } catch (err) {
        console.error("Çalışma grupları alınırken hata oluştu", err);
        toast.error("Çalışma grupları yüklenemedi.");
      }
    })();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // sayısal alanları sayıya çevir
    const numberFields = ["estimatedDurationInDays"];
    const nextValue =
      type === "checkbox"
        ? checked
        : numberFields.includes(name)
        ? (value === "" ? "" : Number(value))
        : value;

    setForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basit zorunlu alan kontrolleri
    if (!form.title.trim()) {
      toast.warn("Başlık zorunlu");
      return;
    }
    if (!form.description.trim()) {
      toast.warn("Açıklama zorunlu");
      return;
    }
    if (!form.city.trim()) {
      toast.warn("Şehir zorunlu");
      return;
    }
    if (!form.filedDate) {
      toast.warn("Dava tarihi zorunlu");
      return;
    }

    const payload = {
      ...form,
      // boş string ise null gönder
      workingGroupId:
        form.workingGroupId === "" ? null : Number(form.workingGroupId),
    };

    try {
      await axios.post(`${API_BASE}/cases`, payload);
      toast.success("✅ Dava başarıyla oluşturuldu!");
      setForm(initialForm);
    } catch (error) {
      console.error(error);
      // BE message varsa göster
      const msg = error?.response?.data?.message || "❌ Kayıt sırasında bir hata oluştu.";
      toast.error(msg);
    }
  };

  return (
    <form className="lex-form" onSubmit={handleSubmit}>
      <h2>Dava Oluştur</h2>

      <div className="lex-form-row">
        <label htmlFor="title">Başlık<span style={{color:"red"}}>*</span></label>
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
        <label htmlFor="description">Açıklama<span style={{color:"red"}}>*</span></label>
        <textarea
          className="lex-form-input"
          id="description"
          name="description"
          placeholder="Dava ile ilgili kısa açıklama"
          value={form.description}
          onChange={handleChange}
          rows={2}
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="filedDate">Dava Tarihi<span style={{color:"red"}}>*</span></label>
        <input
          type="date"
          className="lex-form-input"
          id="filedDate"
          name="filedDate"
          value={form.filedDate}
          onChange={handleChange}
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="city">Şehir<span style={{color:"red"}}>*</span></label>
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
          min="1"
          max="365"
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
            <option key={group.id} value={String(group.id)}>
              {group.name}
            </option>
          ))}
        </select>
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
