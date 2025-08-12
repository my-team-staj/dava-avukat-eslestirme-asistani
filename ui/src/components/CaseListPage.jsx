// ui/src/components/CaseListPage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";
import CaseUpdateModal from "./CaseUpdateModal"; // 👈 düzeltildi

const API_BASE = "https://localhost:60227/api";

export default function CaseListPage() {
  const [cases, setCases] = useState([]);
  const [cities, setCities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const [query, setQuery] = useState({
    page: 1,
    pageSize: 5,
    city: "",
    language: "",
    urgencyLevel: "",
    isActive: "",
    requiresProBono: "",
    sortBy: "filedDate",
    sortOrder: "desc",
  });

  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCases();
    fetchFiltersMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function fetchCases() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/cases`, { params: query });
      setCases(res.data?.items ?? []);
      setTotalPages(res.data?.totalPages ?? 1);
    } catch (err) {
      console.error("Veri çekme hatası:", err);
      setCases([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  async function fetchFiltersMeta() {
    try {
      const res = await axios.get(`${API_BASE}/cases`, {
        params: { page: 1, pageSize: 200 },
      });
      const items = res.data?.items ?? [];
      setCities([...new Set(items.map(i => i.city).filter(Boolean))]);
      setLanguages([...new Set(items.map(i => i.language).filter(Boolean))]);
    } catch (err) {
      console.error("Filtre metaları alınamadı:", err);
    }
  }

  const handlePageChange = (page) => setQuery(prev => ({ ...prev, page }));

  const toggleExpand = (id) =>
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const handleSortByDate = () => {
    setQuery(prev => {
      if (prev.sortBy === "filedDate") {
        if (prev.sortOrder === "desc") return { ...prev, sortOrder: "asc", page: 1 };
        if (prev.sortOrder === "asc")  return { ...prev, sortBy: "", sortOrder: "", page: 1 };
        return { ...prev, sortOrder: "desc", page: 1 };
      }
      return { ...prev, sortBy: "filedDate", sortOrder: "desc", page: 1 };
    });
  };

  const handleEditClick = async (caseId) => {
    try {
      const res = await axios.get(`${API_BASE}/cases/${caseId}`);
      setSelectedCase(res.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Dava bilgisi alınamadı:", error);
    }
  };

  return (
    <div className="container">
      <h2 style={{ display: "flex", alignItems: "center", gap: 12 }}>
        Dava Listesi
       
      </h2>

      {/* Filtreler */}
      <div className="filters">
        <div className="filter-item">
          <label>Şehir</label>
          <select
            value={query.city}
            onChange={(e) => setQuery(prev => ({ ...prev, city: e.target.value, page: 1 }))}
          >
            <option value="">Tüm Şehirler</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Dil</label>
          <select
            value={query.language}
            onChange={(e) => setQuery(prev => ({ ...prev, language: e.target.value, page: 1 }))}
          >
            <option value="">Tüm Diller</option>
            {languages.map((lang) => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>
        </div>

        <div className="filter-item">
          <label>Aciliyet</label>
          <select
            value={query.urgencyLevel}
            onChange={(e) => setQuery(prev => ({ ...prev, urgencyLevel: e.target.value, page: 1 }))}
          >
            <option value="">Tüm Aciliyetler</option>
            <option value="Normal">Normal</option>
            <option value="Acil">Acil</option>
            <option value="Düşük Öncelik">Düşük Öncelik</option>
          </select>
        </div>

        <div className="filter-item">
          <label>Durum</label>
          <select
            value={query.isActive}
            onChange={(e) => setQuery(prev => ({ ...prev, isActive: e.target.value, page: 1 }))}
          >
            <option value="">Tümü</option>
            <option value="true">Aktif</option>
            <option value="false">Pasif</option>
          </select>
        </div>

        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={query.requiresProBono === "true"}
            onChange={(e) =>
              setQuery(prev => ({
                ...prev,
                requiresProBono: e.target.checked ? "true" : "",
                page: 1,
              }))
            }
          />
          Pro Bono
        </label>
      </div>

      {/* Liste */}
      {loading ? (
        <p>Yükleniyor...</p>
      ) : cases.length === 0 ? (
        <div className="form-card" style={{ textAlign: "center", marginTop: 16 }}>
          Bu filtrelerle eşleşen dava bulunamadı.
        </div>
      ) : (
        <table className="case-table">
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Şehir</th>
              <th>Aciliyet</th>
              <th>Çalışma Grubu</th>
              <th>Pro Bono</th>
              <th onClick={handleSortByDate} style={{ cursor: "pointer", whiteSpace: "nowrap" }}>
                Tarih{" "}
                {query.sortBy === "filedDate" &&
                  (query.sortOrder === "asc" ? "▲" : query.sortOrder === "desc" ? "▼" : "")}
              </th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <React.Fragment key={c.id}>
                <tr>
                  <td>{c.title}</td>
                  <td>{c.city}</td>
                  <td>{c.urgencyLevel}</td>
                  <td>{c.workingGroupName || "-"}</td>
                  <td>{c.requiresProBono ? "Evet" : "Hayır"}</td>
                  <td>{c.filedDate ? new Date(c.filedDate).toLocaleDateString() : "-"}</td>
                  <td>
                    <button onClick={() => toggleExpand(c.id)}>
                      {expandedRows.includes(c.id) ? "Kapat" : "Detay Aç"}
                    </button>{" "}
                    

                    <button 
                    
                    style={{ backgroundColor: "#1976d2", color: "#fff" }}
                    onClick={() => handleEditClick(c.id)}
                    
                    >
                      Güncelle
                    
                    </button>
                  </td>
                
                </tr>

                {expandedRows.includes(c.id) && (
                  <tr>
                    <td colSpan={8}>
                      <div style={{ background: "#f2f5fa", padding: 12, borderRadius: 10 }}>
                        <strong>Açıklama:</strong> {c.description || "-"} <br />
                        <strong>Tecrübe Seviyesi:</strong> {c.requiredExperienceLevel || "-"} <br />
                        <strong>Dil:</strong> {c.language || "-"} <br />
                        <strong>Tahmini Süre:</strong>{" "}
                        {typeof c.estimatedDurationInDays === "number" && c.estimatedDurationInDays > 0
                          ? `${c.estimatedDurationInDays} gün`
                          : "-"}
                        <br />
                        <strong>Aktiflik:</strong> {c.isActive ? "Aktif" : "Pasif"}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}

      {/* Sayfalama */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => handlePageChange(p)}
            className={query.page === p ? "active" : ""}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Güncelleme Modalı */}
      {isModalOpen && (
        <CaseUpdateModal
          caseData={selectedCase}
          onClose={() => setIsModalOpen(false)}
          onUpdated={fetchCases}
        />
      )}
    </div>
  );
}
