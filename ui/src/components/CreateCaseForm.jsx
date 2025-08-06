import React, { useState } from 'react';
import axios from 'axios';

const CreateCaseForm = () => {
  const [formData, setFormData] = useState({
    title: '',
    caseType: '',
    description: '',
    city: '',
    language: 'Türkçe',
    urgencyLevel: 'Normal',
    requiresProBono: false,
    estimatedDurationInDays: 0,
    requiredExperienceLevel: 'Orta',
    workingGroupId: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post('https://localhost:60227/api/cases', formData);
      console.log('Sunucu yanıtı:', response); // 🔍 Burada log geliyor olmalı!

      const caseId = response.data.id;
      setMessage(`✅ Dava başarıyla oluşturuldu. ID: ${caseId}`);

      setFormData({
        title: '',
        caseType: '',
        description: '',
        city: '',
        language: 'Türkçe',
        urgencyLevel: 'Normal',
        requiresProBono: false,
        estimatedDurationInDays: 0,
        requiredExperienceLevel: 'Orta',
        workingGroupId: ''
      });
    } catch (error) {
      console.error('Hata:', error);
      const errMsg = error.response?.data?.error || '❌ Hata oluştu.';
      setMessage(errMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '400px' }}>
      <h2>Dava Oluştur</h2>
      <input name="title" value={formData.title} onChange={handleChange} placeholder="Başlık" required />
      <input name="caseType" value={formData.caseType} onChange={handleChange} placeholder="Dava Türü" required />
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Açıklama" required />
      <input name="city" value={formData.city} onChange={handleChange} placeholder="Şehir" required />
      <input name="language" value={formData.language} onChange={handleChange} placeholder="Dil" />
      <input name="urgencyLevel" value={formData.urgencyLevel} onChange={handleChange} placeholder="Aciliyet" />
      <label>
        <input type="checkbox" name="requiresProBono" checked={formData.requiresProBono} onChange={handleChange} />
        Ücretsiz Hizmet (Pro Bono)
      </label>
      <input
        name="estimatedDurationInDays"
        type="number"
        value={formData.estimatedDurationInDays}
        onChange={handleChange}
        placeholder="Tahmini Süre (gün)"
      />
      <input name="requiredExperienceLevel" value={formData.requiredExperienceLevel} onChange={handleChange} placeholder="Deneyim Seviyesi" />
      <input
        name="workingGroupId"
        type="number"
        value={formData.workingGroupId}
        onChange={handleChange}
        placeholder="Çalışma Grubu ID (örn: 1)"
      />
      <button type="submit">Kaydet</button>
      {message && <p>{message}</p>}
    </form>
  );
};

export default CreateCaseForm;
