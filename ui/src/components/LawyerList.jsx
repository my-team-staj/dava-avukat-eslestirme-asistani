// ui/src/components/LawyerList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../App.css";
import LawyerEditForm from "./LawyerEditForm";
import { toast } from "react-toastify";
import ConfirmDialog from "./ConfirmDialog";

const API_BASE = "https://localhost:60227/api";

function LawyerList() {
  const [lawyers, setLawyers] = useState([]);
  const [cities, setCities] = useState([]);
  const [workingGroups, setWorkingGroups] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [editingLawyerId, setEditingLawyerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({
    page: 1,
    pageSize: 5,
    city: "",
    isActive: "true",
    workGroup: "",
    sortBy: "FullName",
    sortOrder: "asc",
    searchTerm: "",
  });
  const [searchInput, setSearchInput] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // ⬇️ Silme için modal state
  const [confirm, setConfirm] = useState({ open: false, id: null });
  useEffect(() => {
    fetchLawyers();
    fetchCities();
    fetchWorkingGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Debounce arama için useEffect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQuery(prev => ({ ...prev, searchTerm: searchInput, page: 1 }));
    }, 500); // 500ms gecikme

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  async function fetchLawyers() {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/lawyers`, { params: query });
      setLawyers(res.data.items || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Avukat verileri alınamadı:", err);
      setLawyers([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }

  async function fetchCities() {
    try {
      const res = await axios.get(`${API_BASE}/lawyers`, {
        params: { page: 1, pageSize: 200 },
      });
      const items = res.data.items || [];
      const uniqueCities = [...new Set(items.map(x => x.city).filter(Boolean))];
      setCities(uniqueCities);
    } catch (err) {
      console.error("Şehir listesi alınamadı:", err);
    }
  }

  async function fetchWorkingGroups() {
    try {
      const res = await axios.get(`${API_BASE}/workinggroups`);
      setWorkingGroups(res.data || []);
    } catch (err) {
      console.error("Çalışma grupları alınamadı:", err);
    }
  }

  const handlePageChange = (page) => setQuery(prev => ({ ...prev, page }));

  const toggleExpand = (id) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSortByFullName = () => {
    setQuery(prev => {
      if (prev.sortBy === "FullName") {
        if (prev.sortOrder === "asc")  return { ...prev, sortOrder: "desc", page: 1 };
        if (prev.sortOrder === "desc") return { ...prev, sortBy: "", sortOrder: "", page: 1 };
        return { ...prev, sortOrder: "asc", page: 1 };
      }
      return { ...prev, sortBy: "FullName", sortOrder: "asc", page: 1 };
    });
  };

  const openEditModal = (id) => setEditingLawyerId(id);
  const closeEditModal = () => setEditingLawyerId(null);
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) closeEditModal();
  };

  const groupNameFor = (l) => {
    // WorkingGroupId varsa workingGroups'dan isim bul, yoksa workGroup string'ini kullan
    if (l?.workingGroupId) {
      const wg = workingGroups.find(g => g.id === l.workingGroupId);
      return wg?.groupName || l?.workGroup || "-";
    }
    return l?.workGroup || "-";
  };

  // ⬇️ Silme — modern onay modalı
  const askDelete = (id) => setConfirm({ open: true, id });
  const doDelete = async () => {
    const id = confirm.id;
    setConfirm({ open: false, id: null });
    try {
      await axios.delete(`${API_BASE}/lawyers/${id}`);
      toast.success("Avukat silindi");
      fetchLawyers();
    } catch (e) {
      console.error(e);
      toast.error("Avukat silinirken bir hata oluştu");
    }
  };

  return (
    <div className="container">
      <h2 style={{ display: "flex", alignItems: "center", gap: 12 }}>
        Avukat Listesi
      </h2>

      {/* Filtre Barı */}
      <div className="filters">
        <div className="filter-item search-item">
          <label>Arama</label>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Avukat adı, e-posta veya baro no ile ara..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>

        <div className="filter-item">
          <label>Şehir</label>
          <select
            value={query.city}
            onChange={(e) => setQuery(prev => ({ ...prev, city: e.target.value, page: 1 }))}
          >
            <option value="">Tüm Şehirler</option>
            {cities.map((city, idx) => (
              <option key={idx} value={city}>{city}</option>
            ))}
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

        <div className="filter-item">
          <label>Çalışma Grubu</label>
          <select
            value={query.workGroup}
            onChange={(e) => setQuery(prev => ({ ...prev, workGroup: e.target.value, page: 1 }))}
          >
            <option value="">Tüm Gruplar</option>
            {workingGroups.map(wg => (
              <option key={wg.id} value={wg.groupName}>{wg.groupName}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Liste */}
      {loading ? (
        <p>Yükleniyor...</p>
      ) : lawyers.length === 0 ? (
        <div className="form-card" style={{ textAlign: "center", marginTop: 16 }}>
          Bu filtrelerle eşleşen avukat bulunamadı.
        </div>
      ) : (
        <table className="case-table">
          <thead>
            <tr>
              <th onClick={handleSortByFullName} style={{ cursor: "pointer" }}>
                Ad Soyad{" "}
                {query.sortBy === "FullName" &&
                  (query.sortOrder === "asc" ? "▲" : query.sortOrder === "desc" ? "▼" : "")}
              </th>
              <th>Durum</th>
              <th>Şehir</th>
              <th>Çalışma Grubu</th>
              <th>Ünvan</th>
              <th>Telefon</th>
              <th>E-posta</th>
              <th>İşe Başlama</th>
              <th>Diller</th>
              <th>Eğitim</th>
              <th>Kıdem</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {lawyers.map((l) => {
              const isOpen = expandedRows.includes(l.id);
              return (
                <React.Fragment key={l.id}>
                  <tr>
                    <td>{l.fullName}</td>
                    <td>{l.isActive ? "Aktif" : "Pasif"}</td>
                    <td>{l.city}</td>
                    <td>{groupNameFor(l)}</td>
                    <td>{l.title}</td>
                    <td>{l.phone}</td>
                    <td>{l.email}</td>
                    <td>{l.startDate ? new Date(l.startDate).toLocaleDateString('tr-TR') : "-"}</td>
                    <td>{l.languages}</td>
                    <td>{l.education}</td>
                    <td>{l.prmEmployeeRecordType}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-details"
                        onClick={() => toggleExpand(l.id)}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? "Detayı kapat" : "Detay aç"}
                      >
                        {isOpen ? "Detayı Kapat" : "Detay Aç"}
                      </button>{" "}
                      <button
                        className="btn-update"
                        onClick={() => openEditModal(l.id)}
                        aria-label="Avukatı güncelle"
                      >
                        Güncelle
                      </button>{" "}
                      <button
                        className="btn-delete"
                        onClick={() => askDelete(l.id)}
                        aria-label="Avukatı sil"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr>
                      <td colSpan="12">
                        <div style={{ background: "#f2f5fa", padding: "12px", borderRadius: "10px" }}>
                          <strong>Eğitim:</strong> {l.education || "-"} <br />
                          <strong>Diller:</strong> {l.languages || "-"} <br />
                          <strong>Çalışma Grubu:</strong> {groupNameFor(l)} <br />
                          <strong>Ünvan:</strong> {l.title || "-"} <br />
                          <strong>İşe Başlama:</strong> {l.startDate ? new Date(l.startDate).toLocaleDateString('tr-TR') : "-"} <br />
                          <strong>Kıdem:</strong> {l.prmEmployeeRecordType || "-"}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
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

      {/* Modal (merkezde kutucuk) */}
      {editingLawyerId !== null && (
        <div className="modal-overlay" onClick={handleOverlayClick}>
          <div className="modal-card">
            <div className="modal-header">
              <h3>Avukat Güncelle</h3>
              <button className="modal-close" onClick={closeEditModal}>×</button>
            </div>
            <LawyerEditForm
              lawyerId={editingLawyerId}
              onClose={closeEditModal}
              onSaved={fetchLawyers}
            />
          </div>
        </div>
      )}

      {/* ✅ Silme Onayı Modalı */}
      <ConfirmDialog
        open={confirm.open}
        title="Bu avukatı silmek istiyor musun?"
        message="Bu işlem geri alınamaz. Avukat kaydı kalıcı olarak silinecek."
        confirmText="Sil"
        cancelText="Vazgeç"
        onConfirm={doDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
    </div>
  );
}

export default LawyerList;
