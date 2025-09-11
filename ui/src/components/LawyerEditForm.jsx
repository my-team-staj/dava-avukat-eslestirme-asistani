// ui/src/components/LawyerEditForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useToast } from "./Toast";

import { TITLES, CITIES, LANGUAGES, RECORD_TYPES } from "../constants";
import SearchableSelect from "./inputs/SearchableSelect";
import SearchableMultiSelect from "./inputs/SearchableMultiSelect";

const API_BASE = "https://localhost:60227/api";

const initialState = {
  fullName: "",
  isActive: true,
  city: "",
  title: "",
  phone: "",
  email: "",
  startDate: "",              // input için YYYY-MM-DD
  education: "",
  prmEmployeeRecordType: "",
  workGroupId: "",            // string (submit'te number/null'a çevrilecek)
};

// CSV → dizi
function csvToArray(v) {
  if (!v) return [];
  if (Array.isArray(v)) return v;
  return String(v)
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// YYYY-MM-DD → ISO/null
function toIsoOrNull(yyyyMmDd) {
  if (!yyyyMmDd) return null;
  const d = new Date(`${yyyyMmDd}T00:00:00`);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

// ISO → YYYY-MM-DD
function toYyyyMmDd(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export default function LawyerEditForm({ lawyerId, onClose, onSaved }) {
  const toast = useToast();

  const [form, setForm] = useState(initialState);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [wgOptions, setWgOptions] = useState([]); // {value,label}
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Sabit listeleri {value,label}'e çevir
  const titleOptions = useMemo(
    () => TITLES.map((t) => ({ value: t, label: t })),
    []
  );
  const cityOptions = useMemo(
    () => CITIES.map((c) => ({ value: c, label: c })),
    []
  );
  const recordTypeOptions = useMemo(
    () => RECORD_TYPES.map((r) => ({ value: r, label: r })),
    []
  );
  const languageOptions = useMemo(
    () => LANGUAGES.map((l) => ({ value: l, label: l })),
    []
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        // Avukat + Çalışma Grubu listesi (endpoint isim varyasyonlarına tolerans)
        const [lawyerRes, wgRes] = await Promise.all([
          axios.get(`${API_BASE}/lawyers/${lawyerId}`),
          (async () => {
            try { return await axios.get(`${API_BASE}/working-groups`); } catch {}
            try { return await axios.get(`${API_BASE}/workinggroups`); } catch {}
            try { return await axios.get(`${API_BASE}/workinggroup`); } catch {}
            return await axios.get(`${API_BASE}/groups`);
          })(),
        ]);

        if (!mounted) return;

        // ----- Lawyer → form
        const data = lawyerRes?.data ?? {};
        setForm({
          fullName: data.fullName ?? "",
          isActive: data.isActive ?? true,
          city: data.city ?? "",
          title: data.title ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          startDate: toYyyyMmDd(data.startDate),
          education: data.education ?? "",
          prmEmployeeRecordType: data.prmEmployeeRecordType ?? "",
          workGroupId: data.workGroupId ?? "",
        });
        setSelectedLanguages(csvToArray(data.languages));

        // ----- Working groups → options
        const payload = wgRes?.data;
        const items = Array.isArray(payload)
          ? payload
          : Array.isArray(payload?.items)
          ? payload.items
          : Array.isArray(payload?.data)
          ? payload.data
          : [];

        const opts = items
          .map((g) => {
            const id = g?.id ?? g?.groupId ?? g?.wgId ?? g?.workingGroupId;
            const name =
              g?.groupName ?? g?.name ?? g?.title ?? g?.displayName ?? String(id);
            return id != null && name
              ? { value: String(id), label: String(name) }
              : null;
          })
          .filter(Boolean);

        setWgOptions(opts);
      } catch (e) {
        setError("Veriler yüklenemedi");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [lawyerId]);

  function handleInput(e) {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.fullName?.trim()) return setError("İsim Soyisim zorunlu");
    if (!form.city?.trim()) return setError("Şehir zorunlu");
    if (!form.email?.trim()) return setError("E-posta zorunlu");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Geçerli bir e-posta girin");

    try {
      setSaving(true);

      const payload = {
        fullName: form.fullName.trim(),
        isActive: !!form.isActive,
        city: form.city.trim(),
        title: form.title?.trim() || "",
        phone: form.phone?.trim() || "",
        email: form.email.trim(),
        startDate: toIsoOrNull(form.startDate),
        languages: selectedLanguages.join(", "),
        education: form.education?.trim() || "",
        prmEmployeeRecordType: form.prmEmployeeRecordType?.trim() || "",
        workGroupId: form.workGroupId === "" ? null : Number(form.workGroupId),
      };

      await axios.put(`${API_BASE}/lawyers/${lawyerId}`, payload);

      toast.success("Kayıt başarıyla güncellendi");
      await onSaved?.();
      onClose?.();
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        e2?.response?.data?.error ||
        "Güncelleme başarısız";
      setError(msg);
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
        {/* İsim */}
        <label htmlFor={`fullName-${lawyerId}`}>İsim Soyisim</label>
        <input
          id={`fullName-${lawyerId}`}
          className="lex-form-input"
          name="fullName"
          value={form.fullName}
          onChange={handleInput}
          disabled={saving}
          placeholder="Örn: Av. Ayşe Demir"
        />

        {/* Şehir (aramalı) */}
        <label>Şehir</label>
        <SearchableSelect
          options={cityOptions}
          value={form.city}
          onChange={(v) => setForm((p) => ({ ...p, city: v }))}
          placeholder="Şehir seçin…"
        />

        {/* E-posta */}
        <label htmlFor={`email-${lawyerId}`}>E-posta</label>
        <input
          id={`email-${lawyerId}`}
          className="lex-form-input"
          type="email"
          name="email"
          value={form.email}
          onChange={handleInput}
          disabled={saving}
          placeholder="avukat@email.com"
        />

        {/* Telefon */}
        <label htmlFor={`phone-${lawyerId}`}>Telefon</label>
        <input
          id={`phone-${lawyerId}`}
          className="lex-form-input"
          name="phone"
          value={form.phone}
          onChange={handleInput}
          disabled={saving}
          placeholder="05xx xxx xx xx"
        />

        {/* Unvan (aramalı) */}
        <label>Unvan</label>
        <SearchableSelect
          options={titleOptions}
          value={form.title}
          onChange={(v) => setForm((p) => ({ ...p, title: v }))}
          placeholder="Unvan seçin…"
        />

        {/* Başlangıç Tarihi */}
        <label htmlFor={`startDate-${lawyerId}`}>Başlangıç Tarihi</label>
        <input
          id={`startDate-${lawyerId}`}
          className="lex-form-input"
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleInput}
          disabled={saving}
        />

        {/* Diller (aramalı – checkbox, çip gösterimi) */}
        <label>Konuşulan Diller</label>
        <SearchableMultiSelect
          options={languageOptions}
          selected={selectedLanguages}
          onChange={setSelectedLanguages}
          placeholder="Dil seçin…"
        />

        {/* Eğitim */}
        <label htmlFor={`education-${lawyerId}`}>Eğitim</label>
        <input
          id={`education-${lawyerId}`}
          className="lex-form-input"
          name="education"
          value={form.education}
          onChange={handleInput}
          disabled={saving}
          placeholder="Üniversite/Fakülte"
        />

        {/* Kayıt Tipi (aramalı) */}
        <label>Kayıt Tipi</label>
        <SearchableSelect
          options={recordTypeOptions}
          value={form.prmEmployeeRecordType}
          onChange={(v) =>
            setForm((p) => ({ ...p, prmEmployeeRecordType: v }))
          }
          placeholder="Kayıt tipi seçin…"
        />

        {/* Çalışma Grubu (aramalı) */}
        <label>Çalışma Grubu</label>
        <SearchableSelect
          options={wgOptions}
          value={form.workGroupId === null ? "" : String(form.workGroupId)}
          onChange={(v) => setForm((p) => ({ ...p, workGroupId: v }))}
          placeholder="Çalışma Grubu seçin…"
        />

        {/* Aktif mi? */}
        <label htmlFor={`isActive-${lawyerId}`}>Aktif mi?</label>
        <input
          id={`isActive-${lawyerId}`}
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleInput}
          disabled={saving}
        />
      </div>

      <div className="form-actions">
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          disabled={saving}
        >
          Vazgeç
        </button>
        <button type="submit" className="btn-primary" disabled={saving}>
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </button>
      </div>
    </form>
  );
}
