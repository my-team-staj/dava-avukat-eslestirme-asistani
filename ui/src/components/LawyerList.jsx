import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // ✅ eklendi
import "../App.css";

function LawyerList() {
  const [lawyers, setLawyers] = useState([]);
  const [cities, setCities] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({
    page: 1,
    pageSize: 5,
    city: "",
    isActive: "",
    availableForProBono: "",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLawyers();
    fetchCities();
  }, [query]);

  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://localhost:60227/api/lawyers", {
        params: query,
      });
      setLawyers(res.data.items);
      setTotalPages(res.data.totalPages);
    } catch (error) {
      console.error("Avukat verileri alınamadı:", error);
    }
    setLoading(false);
  };

  const fetchCities = async () => {
    try {
      const res = await axios.get("https://localhost:60227/api/lawyers", {
        params: { page: 1, pageSize: 100 },
      });
      const items = res.data.items || [];
      const uniqueCities = [...new Set(items.map((item) => item.city).filter(Boolean))];
      setCities(uniqueCities);
    } catch (error) {
      console.error("Şehir listesi alınamadı:", error);
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

  const handleSortByName = () => {
    setQuery((prev) => {
      if (prev.sortBy === "name") {
        if (prev.sortOrder === "asc") {
          return { ...prev, sortOrder: "desc", page: 1 };
        } else if (prev.sortOrder === "desc") {
          return { ...prev, sortBy: "", sortOrder: "", page: 1 };
        } else {
          return { ...prev, sortOrder: "asc", page: 1 };
        }
      } else {
        return { ...prev, sortBy: "name", sortOrder: "asc", page: 1 };
      }
    });
  };

  return (
    <div className="container">
      <h2>Avukat Listesi</h2>

      {/* Filtreleme Alanı */}
      <div className="filters">
        <select
          value={query.city}
          onChange={(e) => setQuery((prev) => ({ ...prev, city: e.target.value, page: 1 }))}
        >
          <option value="">Tüm Şehirler</option>
          {cities.map((city, idx) => (
            <option key={idx} value={city}>
              {city}
            </option>
          ))}
        </select>

        <select
          value={query.isActive}
          onChange={(e) => setQuery((prev) => ({ ...prev, isActive: e.target.value, page: 1 }))}
        >
          <option value="">Tümü</option>
          <option value="true">Aktif</option>
          <option value="false">Pasif</option>
        </select>

        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            checked={query.availableForProBono === "true"}
            onChange={(e) =>
              setQuery((prev) => ({
                ...prev,
                availableForProBono: e.target.checked ? "true" : "",
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
              <th onClick={handleSortByName} style={{ cursor: "pointer" }}>
                İsim{" "}
                {query.sortBy === "name" &&
                  (query.sortOrder === "asc" ? "▲" : query.sortOrder === "desc" ? "▼" : "")}
              </th>
              <th>Şehir</th>
              <th>E-posta</th>
              <th>Telefon</th>
              <th>Baro No</th>
              <th>Pro Bono</th>
              <th>Puan</th>
              <th>Durum</th>
              <th>İşlemler</th> {/* ✅ başlık değişti */}
            </tr>
          </thead>
          <tbody>
            {lawyers.map((l) => (
              <React.Fragment key={l.id}>
                <tr>
                  <td>{l.name}</td>
                  <td>{l.city}</td>
                  <td>{l.email}</td>
                  <td>{l.phone}</td>
                  <td>{l.baroNumber}</td>
                  <td>{l.availableForProBono ? "Evet" : "Hayır"}</td>
                  <td>{l.rating}</td>
                  <td>{l.isActive ? "Aktif" : "Pasif"}</td>
                  <td>
                    <button onClick={() => toggleExpand(l.id)}>
                      {expandedRows.includes(l.id) ? "Kapat" : "Aç"}
                    </button>{" "}
                    <Link to={`/lawyers/edit/${l.id}`}>
                      <button style={{ backgroundColor: "#1976d2", color: "#fff" }}>
                        Düzenle
                      </button>
                    </Link>
                  </td>
                </tr>

                {expandedRows.includes(l.id) && (
                  <tr>
                    <td colSpan="9">
                      <div style={{ background: "#f2f5fa", padding: "12px", borderRadius: "10px" }}>
                        <strong>Eğitim:</strong> {l.education || "-"} <br />
                        <strong>Toplam Dava:</strong> {l.totalCasesHandled || 0} <br />
                        <strong>Diller:</strong> {l.languagesSpoken || "-"} <br />
                        <strong>Pro Bono:</strong> {l.availableForProBono ? "Evet" : "Hayır"}
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
            className={query.page === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LawyerList;
