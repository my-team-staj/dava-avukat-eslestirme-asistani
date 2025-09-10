import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "./Toast"; // ✅ toast eklendi

const API_BASE = "https://localhost:60227/api";

const initialState = {
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
};

/**
 * Modal içinde kullanılacak avukat düzenleme formu.
 * Props:
 *  - lawyerId: number (zorunlu)
 *  - onClose?: () => void
 *  - onSaved?: () => Promise<void> | void
 */
export default function LawyerEditForm({ lawyerId, onClose, onSaved }) {
  const toast = useToast(); // ✅
  const [form, setForm] = useState(initialState);
  const [workingGroups, setWorkingGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [lawyerRes, workingGroupsRes] = await Promise.all([
          axios.get(`${API_BASE}/lawyers/${lawyerId}`),
          axios.get(`${API_BASE}/workinggroups`)
        ]);

        if (!mounted) return;

        const data = lawyerRes?.data ?? {};
        setForm({
          ...initialState,
          ...data,
          startDate: data?.startDate ? new Date(data.startDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        });
        setWorkingGroups(workingGroupsRes?.data ?? []);
      } catch {
        setError("Veriler yüklenemedi");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [lawyerId]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.fullName?.trim()) return setError("Ad soyad zorunlu");
    if (!form.email?.trim()) return setError("E‑posta zorunlu");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Geçerli bir e‑posta girin");

    try {
      setSaving(true);
      const payload = {
        ...form,
        startDate: new Date(form.startDate).toISOString()
      };
      console.log("Gönderilen güncelleme verisi:", payload);
      await axios.put(`${API_BASE}/lawyers/${lawyerId}`, payload);

      // ✅ başarı tostu
      toast.success("Kayıt başarıyla güncellendi");

      if (onSaved) await onSaved();
      if (onClose) onClose();
    } catch (e2) {
      console.error("Avukat güncellenirken hata oluştu:", e2);
      console.error("Hata detayları:", e2?.response?.data);
      const msg =
        e2?.response?.data?.message ||
        e2?.response?.data?.error ||
        "Güncelleme başarısız";
      setError(msg);
      // ❌ hata tostu
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div>Yükleniyor...</div>;

  return (
    <form onSubmit={handleSubmit} className="form-card" aria-busy={saving}>
      {error && <div className="error-message">{error}</div>}

      <div className="form-grid">
        <label htmlFor={`fullName-${lawyerId}`}>Ad Soyad</label>
        <input
          id={`fullName-${lawyerId}`}
          className="lex-form-input"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          disabled={saving}
        />

        <label htmlFor={`title-${lawyerId}`}>Ünvan</label>
        <select
          id={`title-${lawyerId}`}
          className="lex-form-input"
          name="title"
          value={form.title}
          onChange={handleChange}
          disabled={saving}
        >
          <option value="">-- Ünvan Seçin --</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="Stajyer Avukat">Stajyer Avukat</option>
          <option value="Yaz Stajyeri">Yaz Stajyeri</option>
        </select>

        <label htmlFor={`city-${lawyerId}`}>Şehir</label>
        <input
          id={`city-${lawyerId}`}
          className="lex-form-input"
          name="city"
          value={form.city}
          onChange={handleChange}
          disabled={saving}
        />

        <label htmlFor={`email-${lawyerId}`}>E‑posta</label>
        <input
          id={`email-${lawyerId}`}
          className="lex-form-input"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          disabled={saving}
        />

        <label htmlFor={`phone-${lawyerId}`}>Telefon</label>
        <input
          id={`phone-${lawyerId}`}
          className="lex-form-input"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          disabled={saving}
        />

        <label htmlFor={`workGroup-${lawyerId}`}>Çalışma Grubu</label>
        <select
          id={`workGroup-${lawyerId}`}
          className="lex-form-input"
          name="workGroup"
          value={form.workGroup}
          onChange={handleChange}
          disabled={saving}
        >
          <option value="">-- Çalışma Grubu Seçin --</option>
          {workingGroups.map(wg => (
            <option key={wg.id} value={wg.groupName}>{wg.groupName}</option>
          ))}
        </select>


        <label htmlFor={`languages-${lawyerId}`}>Diller</label>
        <input
          id={`languages-${lawyerId}`}
          className="lex-form-input"
          name="languages"
          value={form.languages}
          onChange={handleChange}
          disabled={saving}
        />

        <label htmlFor={`education-${lawyerId}`}>Eğitim</label>
        <input
          id={`education-${lawyerId}`}
          className="lex-form-input"
          name="education"
          value={form.education}
          onChange={handleChange}
          disabled={saving}
        />

        

        <label htmlFor={`startDate-${lawyerId}`}>İşe Başlama Tarihi</label>
        <input
          id={`startDate-${lawyerId}`}
          className="lex-form-input"
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          disabled={saving}
        />

        <label htmlFor={`prmEmployeeRecordType-${lawyerId}`}>Kıdem</label>
        <select
          id={`prmEmployeeRecordType-${lawyerId}`}
          className="lex-form-input"
          name="prmEmployeeRecordType"
          value={form.prmEmployeeRecordType}
          onChange={handleChange}
          disabled={saving}
        >
          <option value="">-- Kıdem Seçin --</option>
          <option value="Associate-Level 1">Associate-Level 1</option>
          <option value="Associate-Level 2">Associate-Level 2</option>
          <option value="Associate-Level 3">Associate-Level 3</option>
          <option value="Associate-Level 4">Associate-Level 4</option>
          <option value="Trainee-All trainees">Trainee-All trainees</option>
        </select>

        <label htmlFor={`isActive-${lawyerId}`}>Aktif mi?</label>
        <input
          id={`isActive-${lawyerId}`}
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          disabled={saving}
        />

      </div>

      <div className="form-actions">
         <button type="button" className="btn-secondary" onClick={onClose} disabled={saving}>
          Vazgeç
        </button>
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
       
      </div>
    </form>
  );
}
