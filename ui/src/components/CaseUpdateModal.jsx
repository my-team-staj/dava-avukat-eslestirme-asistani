import { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

export default function CaseUpdateModal({ caseData, onClose, onUpdated }) {
  const [formData, setFormData] = useState({});
  const [workingGroups, setWorkingGroups] = useState([]);

  // mini toast
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

  // Çalışma grupları
  useEffect(() => {
    axios
      .get("https://localhost:60227/api/workinggroups")
      .then((r) => setWorkingGroups(Array.isArray(r.data) ? r.data : []))
      .catch(() => setWorkingGroups([]));
  }, []);

  // Modal açılışında formu doldur
  useEffect(() => {
    if (!caseData) return;
    setFormData({
      title: caseData.title ?? "",
      city: caseData.city ?? "",
      language: caseData.language ?? "",
      urgencyLevel: caseData.urgencyLevel ?? "",
      estimatedDurationInDays:
        caseData.estimatedDurationInDays ?? 0,
      requiredExperienceLevel: caseData.requiredExperienceLevel ?? "",
      filedDate: caseData.filedDate
        ? String(caseData.filedDate).substring(0, 10)
        : "",
      isActive:
        typeof caseData.isActive === "boolean" ? caseData.isActive : true,
      workingGroupId:
        caseData.workingGroupId != null
          ? String(caseData.workingGroupId)
          : "",
      requiresProBono: !!caseData.requiresProBono,
      description: caseData.description ?? "",
    });
  }, [caseData]);

  // backdrop tıklayınca kapat
  const handleBackdrop = (e) => {
    if (e.target.classList.contains("modal-overlay")) onClose();
  };

  // ortak change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((p) => ({ ...p, [name]: checked }));
      return;
    }
    if (name === "isActive") {
      setFormData((p) => ({ ...p, [name]: value === "true" }));
      return;
    }
    if (name === "estimatedDurationInDays") {
      setFormData((p) => ({
        ...p,
        [name]: value === "" ? "" : Number(value),
      }));
      return;
    }
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      isActive: !!formData.isActive,
      requiresProBono: !!formData.requiresProBono,
      estimatedDurationInDays:
        formData.estimatedDurationInDays === ""
          ? 0
          : Number(formData.estimatedDurationInDays),
      workingGroupId:
        formData.workingGroupId === "" ? null : Number(formData.workingGroupId),
    };

    try {
      await axios.put(
        `https://localhost:60227/api/cases/${caseData.id}`,
        payload
      );
      notify("Dava başarıyla güncellendi");
      onUpdated?.();
      onClose();
    } catch (err) {
      notify("Güncelleme başarısız oldu");
      // istersen burada validation hatasını da gösterebiliriz
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={handleBackdrop}>
      <div
        className="modal-card"
        style={{ maxWidth: 720 }} // Avukat modalıyla aynı genişlik
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Dava Güncelle</h3>
          <button
            type="button"
            className="modal-close"
            aria-label="Kapat"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="form-card">
          {/* Avukat modalındaki grid ile aynı: 2 kolonlu */}
          <form onSubmit={handleSubmit} className="form-grid">
            {/* 1. satır */}
            <label htmlFor="title">Başlık</label>
            <input
              id="title"
              name="title"
              className="lex-form-input"
              placeholder="Örn: Miras Davası"
              value={formData.title || ""}
              onChange={handleChange}
            />

            {/* 2. satır */}
            <label htmlFor="city">Şehir</label>
            <input
              id="city"
              name="city"
              className="lex-form-input"
              placeholder="Örn: Konya"
              value={formData.city || ""}
              onChange={handleChange}
            />

            {/* 3. satır */}
            <label htmlFor="language">Dil</label>
            <input
              id="language"
              name="language"
              className="lex-form-input"
              placeholder="Örn: Türkçe"
              value={formData.language || ""}
              onChange={handleChange}
            />

            {/* 4. satır */}
            <label htmlFor="urgencyLevel">Aciliyet</label>
            <select
              id="urgencyLevel"
              name="urgencyLevel"
              className="lex-form-input"
              value={formData.urgencyLevel || ""}
              onChange={handleChange}
            >
              <option value="">Seçiniz</option>
              <option value="Düşük Öncelik">Düşük Öncelik</option>
              <option value="Normal">Normal</option>
              <option value="Acil">Acil</option>
            </select>

            {/* 5. satır */}
            <label htmlFor="estimatedDurationInDays">
              Tahmini Süre (gün)
            </label>
            <input
              id="estimatedDurationInDays"
              type="number"
              min="0"
              name="estimatedDurationInDays"
              className="lex-form-input"
              value={formData.estimatedDurationInDays}
              onChange={handleChange}
            />

            {/* 6. satır */}
            <label htmlFor="requiredExperienceLevel">
              Tecrübe Seviyesi
            </label>
            <select
              id="requiredExperienceLevel"
              name="requiredExperienceLevel"
              className="lex-form-input"
              value={formData.requiredExperienceLevel || ""}
              onChange={handleChange}
            >
              <option value="">Seçiniz</option>
              <option value="Başlangıç">Başlangıç</option>
              <option value="orta">orta</option>
              <option value="Uzman">Uzman</option>
            </select>

            {/* 7. satır */}
            <label htmlFor="filedDate">Dava Tarihi</label>
            <input
              id="filedDate"
              type="date"
              name="filedDate"
              className="lex-form-input"
              value={formData.filedDate || ""}
              onChange={handleChange}
            />

            {/* 8. satır */}
            <label htmlFor="isActive">Aktif</label>
            <select
              id="isActive"
              name="isActive"
              className="lex-form-input"
              value={String(!!formData.isActive)}
              onChange={handleChange}
            >
              <option value="true">Aktif</option>
              <option value="false">Pasif</option>
            </select>

            {/* 9. satır */}
            <label htmlFor="workingGroupId">Çalışma Grubu</label>
            <select
              id="workingGroupId"
              name="workingGroupId"
              className="lex-form-input"
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

            {/* 10. satır */}
            <label htmlFor="requiresProBono">Pro Bono</label>
            <div className="lex-form-input" style={{ display: "flex", alignItems: "center" }}>
              <input
                id="requiresProBono"
                type="checkbox"
                name="requiresProBono"
                checked={!!formData.requiresProBono}
                onChange={handleChange}
              />
              <label htmlFor="requiresProBono" style={{ marginLeft: 8 }}>
                Evet
              </label>
            </div>

            {/* 11. satır - geniş alan */}
            <label htmlFor="description" style={{ alignSelf: "start" }}>
              Açıklama
            </label>
            <textarea
              id="description"
              name="description"
              className="lex-form-input"
              placeholder="Dava ile ilgili kısa açıklama"
              value={formData.description || ""}
              onChange={handleChange}
              rows={3}
              style={{ width: "100%" }}
            />

            {/* Aksiyonlar */}
            <div className="form-actions" style={{ gridColumn: "1 / -1" }}>
              <button type="button" className="btn-secondary" onClick={onClose}>
                Vazgeç
              </button>
              <button type="submit" className="btn-primary">
                Kaydet
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
