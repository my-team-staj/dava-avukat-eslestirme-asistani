import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";

function CreateCaseForm() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    filedDate: new Date().toISOString().substring(0, 10),
    city: "",
    language: "Türkçe",
    urgencyLevel: "Normal",
    requiresProBono: false,
    estimatedDurationInDays: 0,
    requiredExperienceLevel: "Orta",
    workingGroupId: ""
  });

  const [workingGroups, setWorkingGroups] = useState([]);

  useEffect(() => {
    axios
      .get("https://localhost:60227/api/workinggroups")
      .then((res) => setWorkingGroups(res.data))
      .catch((err) =>
        console.error("Çalışma grupları alınırken hata oluştu", err)
      );
  }, []);

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
      const response = await axios.post(
        "https://localhost:60227/api/cases",
        form
      );
      alert(`✅ Dava başarıyla oluşturuldu. ID: ${response.data.id}`);
      setForm({
        title: "",
        caseType: "",
        description: "",
        filedDate: new Date().toISOString().substring(0, 10),
        city: "",
        language: "Türkçe",
        urgencyLevel: "Normal",
        requiresProBono: false,
        estimatedDurationInDays: 0,
        requiredExperienceLevel: "Orta",
        workingGroupId: ""
      });
    } catch (error) {
      console.error(error);
      alert("❌ Kayıt sırasında bir hata oluştu.");
    }
  };

  return (
    <form className="lex-form" onSubmit={handleSubmit}>
      <h2>Dava Oluştur</h2>

      <div className="lex-form-row">
        <label htmlFor="title">Başlık*</label>
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
  <label htmlFor="description">Açıklama <span style={{color:"red"}}>*</span></label>
  <textarea
    className="lex-form-input"
    id="description"
    name="description"
    placeholder="Dava ile ilgili kısa açıklama"
    value={form.description}
    onChange={handleChange}
    rows={2}
    required // ZORUNLU alan için ekledik
  />
</div>


      <div className="lex-form-row">
        <label htmlFor="filedDate">Dava Tarihi*</label>
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
        <label htmlFor="city">Şehir*</label>
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
          required
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
            <option key={group.id} value={group.id}>
              {group.groupName}
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
