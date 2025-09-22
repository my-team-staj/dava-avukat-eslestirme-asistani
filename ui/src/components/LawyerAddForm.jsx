// ui/src/components/LawyerAddForm.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "../App.css";

import { TITLES, CITIES, LANGUAGES, RECORD_TYPES } from "../constants";
import SearchableSelect from "./inputs/SearchableSelect";
import SearchableMultiSelect from "./inputs/SearchableMultiSelect";

function LawyerAddForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    isActive: true,
    city: "",
    title: "",
    phone: "",
    email: "",
    startDate: "",
    education: "",
    prmEmployeeRecordType: "",
    workingGroupId: "", // string id
  });

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [workingGroups, setWorkingGroups] = useState([]);
  const [loadingWg, setLoadingWg] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingWg(true);
        const res = await axios.get("https://localhost:60227/api/workinggroups");
        if (!mounted) return;
        const arr = Array.isArray(res?.data) ? res.data : res?.data?.items ?? [];
        setWorkingGroups(arr);
      } catch {
        if (mounted) setWorkingGroups([]);
      } finally {
        if (mounted) setLoadingWg(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const WG_OPTIONS = useMemo(
    () =>
      (workingGroups || [])
        .map((g) => ({
          value: String(g?.id ?? g?.groupId ?? g?.workingGroupId),
          label: String(g?.groupName ?? g?.name ?? g?.title ?? "Grup"),
        }))
        .filter((x) => x.value && x.label),
    [workingGroups]
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const toIsoOrNull = (yyyyMmDd) => (!yyyyMmDd ? null : new Date(`${yyyyMmDd}T00:00:00`).toISOString());

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) return toast.error("İsim Soyisim zorunludur.");
    if (!form.city.trim()) return toast.error("Şehir zorunludur.");
    if (!form.email.trim()) return toast.error("E-posta zorunludur.");

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
      prmEmployeeRecordType: form.prmEmployeeRecordType || "",
      workingGroupId: form.workingGroupId ? Number(form.workingGroupId) : null,
    };

    try {
      await axios.post("https://localhost:60227/api/lawyers", payload);
      toast.success("Avukat başarıyla eklendi!");
      setForm({
        fullName: "",
        isActive: true,
        city: "",
        title: "",
        phone: "",
        email: "",
        startDate: "",
        education: "",
        prmEmployeeRecordType: "",
        workingGroupId: "",
      });
      setSelectedLanguages([]);
      setTimeout(() => navigate("/lawyers"), 800);
    } catch (err) {
      console.error(err);
      toast.error("Kayıt sırasında hata oluştu.");
    }
  };

  return (
    <form className="lex-form" onSubmit={handleSubmit}>
      <h2>Avukat Ekle</h2>

      <div className="lex-form-row">
        <label htmlFor="fullName">İsim Soyisim*</label>
        <input
          id="fullName"
          name="fullName"
          className="lex-form-input"
          placeholder="Örn: Av. Ayşe Demir"
          value={form.fullName}
          onChange={handleChange}
          required
        />
      </div>

      <div className="lex-form-row">
        <label>Şehir*</label>
        <SearchableSelect
          options={CITIES}
          value={form.city}
          onChange={(v) => setForm((p) => ({ ...p, city: v }))}
          placeholder="Şehir seçin…"
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="email">E-Posta*</label>
        <input
          id="email"
          name="email"
          type="email"
          className="lex-form-input"
          value={form.email}
          onChange={handleChange}
          placeholder="avukat@email.com"
          required
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="phone">Telefon</label>
        <input
          id="phone"
          name="phone"
          className="lex-form-input"
          placeholder="05xx xxx xx xx"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      <div className="lex-form-row">
        <label>Unvan</label>
        <SearchableSelect
          options={TITLES}
          value={form.title}
          onChange={(v) => setForm((p) => ({ ...p, title: v }))}
          placeholder="Unvan seçin…"
        />
      </div>

      <div className="lex-form-row">
        <label htmlFor="startDate">Başlangıç Tarihi</label>
        <input
          id="startDate"
          name="startDate"
          type="date"
          className="lex-form-input"
          value={form.startDate}
          onChange={handleChange}
        />
      </div>

      <div className="lex-form-row">
        <label>Konuşulan Diller</label>
        <SearchableMultiSelect
  options={LANGUAGES}
  selected={selectedLanguages}
  onChange={setSelectedLanguages}
  placeholder="Dil seçin…"
  showChips={true}     // 👈 önemli
/>
      </div>

      <div className="lex-form-row">
        <label htmlFor="education">Eğitim</label>
        <input
          id="education"
          name="education"
          className="lex-form-input"
          placeholder="Üniversite/Fakülte"
          value={form.education}
          onChange={handleChange}
        />
      </div>

      <div className="lex-form-row">
        <label>Kayıt Tipi</label>
        <SearchableSelect
          options={RECORD_TYPES}
          value={form.prmEmployeeRecordType}
          onChange={(v) => setForm((p) => ({ ...p, prmEmployeeRecordType: v }))}
          placeholder="Kayıt tipi seçin…"
        />
      </div>

      <div className="lex-form-row">
        <label>Çalışma Grubu</label>
        <SearchableSelect
          options={WG_OPTIONS}
          value={form.workingGroupId}
          onChange={(v) => setForm((p) => ({ ...p, workingGroupId: v }))}
          placeholder={loadingWg ? "Yükleniyor…" : "Çalışma Grubu Seçin"}
        />
      </div>

      <div className="lex-form-row" style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <input
          id="isActive"
          name="isActive"
          type="checkbox"
          checked={form.isActive}
          onChange={handleChange}
        />
        <label htmlFor="isActive" style={{ fontWeight: 500 }}>Aktif</label>
      </div>

      <div className="lex-form-actions">
        <button type="submit" className="lex-form-btn">Ekle</button>
      </div>
    </form>
  );
}

export default LawyerAddForm;
