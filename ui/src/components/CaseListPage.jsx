import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

function CaseListPage() {
  const [cases, setCases] = useState([]);
  const [cities, setCities] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCases();
    fetchCities();
  }, [query]);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://localhost:60227/api/cases", {
        params: query,
      });
      setCases(response.data.items);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Veri çekme hatası:", error);
    }
    setLoading(false);
  };

  const fetchCities = async () => {
    try {
      const response = await axios.get("https://localhost:60227/api/cases", {
        params: { page: 1, pageSize: 100 },
      });
      const items = response.data.items || [];
      const uniqueCities = [...new Set(items.map((item) => item.city).filter(Boolean))];
      setCities(uniqueCities);
    } catch (error) {
      console.error("Şehirleri alırken hata oluştu:", error);
    }
  };

  const handlePageChange = (page) => {
    setQuery((prev) => ({ ...prev, page }));
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const handleSortByDate = () => {
    setQuery((prev) => {
      if (prev.sortBy === "filedDate") {
        if (prev.sortOrder === "desc") {
          return { ...prev, sortOrder: "asc", page: 1 };
        } else if (prev.sortOrder === "asc") {
          return { ...prev, sortBy: "", sortOrder: "", page: 1 };
        } else {
          return { ...prev, sortOrder: "desc", page: 1 };
        }
      } else {
        return { ...prev, sortBy: "filedDate", sortOrder: "desc", page: 1 };
      }
    });
  };

  return (
    <div className="container">
      <h2>Dava Listesi</h2>

      {/* Filtreleme Alanı */}
      <div className="filters">
        <select
          value={query.city}
          onChange={(e) => setQuery((prev) => ({ ...prev, city: e.target.value, page: 1 }))}>
          <option value="">Tüm Şehirler</option>
          {cities.map((city, idx) => (
            <option key={idx} value={city}>{city}</option>
          ))}
        </select>

        <select
          value={query.urgencyLevel}
          onChange={(e) => setQuery((prev) => ({ ...prev, urgencyLevel: e.target.value, page: 1 }))}>
          <option value="">Tüm Aciliyetler</option>
          <option value="Normal">Normal</option>
          <option value="Acil">Acil</option>
          <option value="Düşük Öncelik">Düşük Öncelik</option>
        </select>

        <select
          value={query.isActive}
          onChange={(e) => setQuery((prev) => ({ ...prev, isActive: e.target.value, page: 1 }))}>
          <option value="">Tümü</option>
          <option value="true">Aktif</option>
          <option value="false">Pasif</option>
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            checked={query.requiresProBono === "true"}
            onChange={(e) =>
              setQuery((prev) => ({
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
      ) : (
        <table className="case-table">
          <thead>
            <tr>
              <th>Başlık</th>
              <th>Şehir</th>
              <th>Aciliyet</th>
              <th>Çalışma Grubu</th>
              <th>Pro Bono</th>
              <th onClick={handleSortByDate} style={{ cursor: "pointer" }}>
                Tarih{" "}
                {query.sortBy === "filedDate" &&
                  (query.sortOrder === "asc" ? "▲" : query.sortOrder === "desc" ? "▼" : "")}
              </th>
              <th>Detay</th>
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
                  <td>{new Date(c.filedDate).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => toggleExpand(c.id)}>
                      {expandedRows.includes(c.id) ? "Kapat" : "Aç"}
                    </button>
                  </td>
                </tr>

                {expandedRows.includes(c.id) && (
                  <tr>
                    <td colSpan="7">
                      <div style={{ background: "#f2f5fa", padding: "12px", borderRadius: "10px" }}>
                        <strong>Açıklama:</strong> {c.description} <br />
                        <strong>Tecrübe:</strong> {c.requiredExperienceLevel} yıl <br />
                        <strong>Dil:</strong> {c.language} <br />
                        <strong>Tahmini Süre:</strong> {c.estimatedDurationInDays} gün <br />
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
        {[...Array(totalPages).keys()].map((i) => (
          <button
            key={i}
            onClick={() => handlePageChange(i + 1)}
            className={query.page === i + 1 ? "active" : ""}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default CaseListPage;
