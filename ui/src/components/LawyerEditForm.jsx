import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "./Toast"; // ✅ toast eklendi

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
  workingGroupId: "" // select için string; submit'te null/number'a çevrilecek
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
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [lawyerRes, groupsRes] = await Promise.all([
          axios.get(`${API_BASE}/lawyers/${lawyerId}`),
          (async () => {
            try { return await axios.get(`${API_BASE}/WorkingGroups`); } catch {}
            try { return await axios.get(`${API_BASE}/workinggroups`); } catch {}
            return await axios.get(`${API_BASE}/Workinggroups`);
          })()
        ]);

        if (!mounted) return;

        const data = lawyerRes?.data ?? {};
        setForm({
          ...initialState,
          ...data,
          workingGroupId: data?.workingGroupId ?? ""
        });

        const raw = groupsRes?.data ?? [];
        const list = Array.isArray(raw) ? raw : (raw.items ?? []);
        const normalized = (list || [])
          .map(g => ({
            id: g.id ?? g.groupId ?? g.workingGroupId,
            name: g.name ?? g.groupName ?? g.title
          }))
          .filter(x => x.id && x.name);

        setGroups(normalized);
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
          : ["experienceYears", "rating", "totalCasesHandled"].includes(name)
            ? (value === "" ? "" : Number(value))
            : value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.name?.trim()) return setError("İsim zorunlu");
    if (!form.email?.trim()) return setError("E‑posta zorunlu");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Geçerli bir e‑posta girin");

    try {
      setSaving(true);
      const payload = {
        ...form,
        workingGroupId: form.workingGroupId === "" ? null : Number(form.workingGroupId)
      };
      await axios.put(`${API_BASE}/lawyers/${lawyerId}`, payload);

      // ✅ başarı tostu
      toast.success("Kayıt başarıyla güncellendi");

      if (onSaved) await onSaved();
      if (onClose) onClose();
    } catch (e2) {
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
        <label htmlFor={`name-${lawyerId}`}>İsim</label>
        <input
          id={`name-${lawyerId}`}
          className="lex-form-input"
          name="name"
          value={form.name}
          onChange={handleChange}
          disabled={saving}
        />

        <label htmlFor={`experienceYears-${lawyerId}`}>Deneyim (yıl)</label>
        <input
          id={`experienceYears-${lawyerId}`}
          className="lex-form-input"
          type="number"
          name="experienceYears"
          value={form.experienceYears}
          onChange={handleChange}
          disabled={saving}
        />

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

        <label htmlFor={`baroNumber-${lawyerId}`}>Baro Numarası</label>
        <input
          id={`baroNumber-${lawyerId}`}
          className="lex-form-input"
          name="baroNumber"
          value={form.baroNumber}
          onChange={handleChange}
          disabled={saving}
        />

        <label htmlFor={`languagesSpoken-${lawyerId}`}>Diller</label>
        <input
          id={`languagesSpoken-${lawyerId}`}
          className="lex-form-input"
          name="languagesSpoken"
          value={form.languagesSpoken}
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

        

        <label htmlFor={`rating-${lawyerId}`}>Puan (0‑5)</label>
        <input
          id={`rating-${lawyerId}`}
          className="lex-form-input"
          type="number"
          step="0.1"
          name="rating"
          value={form.rating}
          onChange={handleChange}
          disabled={saving}
        />

        <label htmlFor={`totalCasesHandled-${lawyerId}`}>Toplam Dava</label>
        <input
          id={`totalCasesHandled-${lawyerId}`}
          className="lex-form-input"
          type="number"
          name="totalCasesHandled"
          value={form.totalCasesHandled}
          onChange={handleChange}
          disabled={saving}
        />

        <label htmlFor={`isActive-${lawyerId}`}>Aktif mi?</label>
        <input
          id={`isActive-${lawyerId}`}
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
          disabled={saving}
        />
        <label htmlFor={`availableForProBono-${lawyerId}`}>Pro Bono</label>
        <input
          id={`availableForProBono-${lawyerId}`}
          type="checkbox"
          name="availableForProBono"
          checked={form.availableForProBono}
          onChange={handleChange}
          disabled={saving}
        />

        <label htmlFor={`workingGroupId-${lawyerId}`}>Çalışma Grubu</label>
        <select
          id={`workingGroupId-${lawyerId}`}
          className="lex-form-input"
          name="workingGroupId"
          value={form.workingGroupId === null ? "" : String(form.workingGroupId)}
          onChange={handleChange}
          disabled={saving || groups.length === 0}
        >
          <option value="">-- Çalışma Grubu Seçin --</option>
          {groups.map(g => (
            <option key={g.id} value={String(g.id)}>{g.name}</option>
          ))}
        </select>
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
