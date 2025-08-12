import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

export default function CaseUpdateModal({ caseData, onClose, onUpdated }) {
  const [formData, setFormData] = useState({});
  const [workingGroups, setWorkingGroups] = useState([]);

  // basit toast
  const notify = (msg) => {
    const el = document.createElement("div");
    el.className = "toast";
    el.textContent = msg;
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      setTimeout(() => el.remove(), 300);
    }, 2000);
  };

  // body scroll kilidi + ESC
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onEsc);
    };
  }, [onClose]);

  useEffect(() => {
    axios
      .get("https://localhost:60227/api/workinggroups")
      .then((r) => setWorkingGroups(r.data || []))
      .catch(() => setWorkingGroups([]));
  }, []);

  useEffect(() => {
    if (!caseData) return;
    setFormData({
      title: caseData.title ?? "",
      description: caseData.description ?? "",
      city: caseData.city ?? "",
      language: caseData.language ?? "",
      urgencyLevel: caseData.urgencyLevel ?? "",
      requiresProBono: !!caseData.requiresProBono,
      estimatedDurationInDays: caseData.estimatedDurationInDays ?? 0,
      requiredExperienceLevel: caseData.requiredExperienceLevel ?? "",
      filedDate: caseData.filedDate ? String(caseData.filedDate).substring(0, 10) : "",
      isActive: typeof caseData.isActive === "boolean" ? caseData.isActive : true,
      workingGroupId: caseData.workingGroupId != null ? String(caseData.workingGroupId) : ""
    });
  }, [caseData]);

  const handleBackdrop = (e) => {
    if (e.target.classList.contains("modal-backdrop")) onClose();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") return setFormData((p) => ({ ...p, [name]: checked }));
    if (name === "isActive") return setFormData((p) => ({ ...p, [name]: value === "true" }));
    if (name === "estimatedDurationInDays")
      return setFormData((p) => ({ ...p, [name]: value === "" ? "" : Number(value) }));
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      requiresProBono: !!formData.requiresProBono,
      isActive: !!formData.isActive,
      estimatedDurationInDays:
        formData.estimatedDurationInDays === "" ? 0 : Number(formData.estimatedDurationInDays),
      workingGroupId: formData.workingGroupId === "" ? null : Number(formData.workingGroupId),
    };
    await axios.put(`https://localhost:60227/api/cases/${caseData.id}`, payload);
    notify("Başarıyla güncellendi");
    onUpdated?.();
    onClose();
  };

  return (
    <div className="modal-backdrop" onMouseDown={handleBackdrop}>
      <div className="modal modal-centered modal-fixed" onMouseDown={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Dava Güncelle</h3>
          <button type="button" className="modal-close" aria-label="Kapat" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form modal-grid">
          {/* sol sütun */}
          <div className="form-item">
            <label>Başlık</label>
            <input name="title" value={formData.title || ""} onChange={handleChange} />
          </div>

          <div className="form-item">
            <label>Şehir</label>
            <input name="city" value={formData.city || ""} onChange={handleChange} />
          </div>

          <div className="form-item">
            <label>Dil</label>
            <input name="language" value={formData.language || ""} onChange={handleChange} />
          </div>

          <div className="form-item">
            <label>Aciliyet</label>
            <select name="urgencyLevel" value={formData.urgencyLevel || ""} onChange={handleChange}>
              <option value="">Seçiniz</option>
              <option value="Normal">Normal</option>
              <option value="Acil">Acil</option>
              <option value="Düşük Öncelik">Düşük Öncelik</option>
            </select>
          </div>

          <div className="form-item">
            <label>Tahmini Süre (gün)</label>
            <input
              type="number"
              name="estimatedDurationInDays"
              value={formData.estimatedDurationInDays}
              onChange={handleChange}
              min="0"
            />
          </div>

          <div className="form-item">
            <label>Tecrübe Seviyesi</label>
            <input
              name="requiredExperienceLevel"
              value={formData.requiredExperienceLevel || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-item">
            <label>Dava Tarihi</label>
            <input type="date" name="filedDate" value={formData.filedDate || ""} onChange={handleChange} />
          </div>

          <div className="form-item">
            <label>Aktif</label>
            <select name="isActive" value={String(!!formData.isActive)} onChange={handleChange}>
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>
          </div>

          <div className="form-item">
            <label>Çalışma Grubu</label>
            <select
              id="workingGroupId"
              name="workingGroupId"
              value={formData.workingGroupId ?? ""}
              onChange={handleChange}
            >
              <option value="">-- Çalışma Grubu Seçin --</option>
              {workingGroups.map((g) => (
                <option key={g.id} value={String(g.id)}>
                  {g.groupName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-item form-item-inline">
            <input
              id="requiresProBono"
              type="checkbox"
              name="requiresProBono"
              checked={!!formData.requiresProBono}
              onChange={handleChange}
            />
            <label htmlFor="requiresProBono">Pro Bono</label>
          </div>

          {/* açıklama tüm genişlik */}
          <div className="form-item form-item-full">
            <label>Açıklama</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Vazgeç</button>
            <button type="submit" className="btn btn-primary">Kaydet</button>
          </div>
        </form>
      </div>
    </div>
  );
}
