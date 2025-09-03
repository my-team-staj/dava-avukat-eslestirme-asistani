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
  const [expandedRows, setExpandedRows] = useState([]);
  const [editingLawyerId, setEditingLawyerId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState({
    page: 1,
    pageSize: 5,
    city: "",
    isActive: "true",
    availableForProBono: "",
    sortBy: "name",
    sortOrder: "asc",
  });
  const [totalPages, setTotalPages] = useState(1);

  const [wgMap, setWgMap] = useState({});
  const [wgReady, setWgReady] = useState(false);

  // ⬇️ Silme için modal state
  const [confirm, setConfirm] = useState({ open: false, id: null });

  const WG_URLS = [
    `${API_BASE}/working-groups`,
    `${API_BASE}/workinggroups`,
    `${API_BASE}/workinggroup`,
    `${API_BASE}/groups`,
  ];

  function extractArray(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.items)) return payload.items;
    if (Array.isArray(payload.data)) return payload.data;
    return [];
  }
  function buildWgMap(arr) {
    const map = {};
    for (const g of arr) {
      const id = g?.id ?? g?.groupId ?? g?.wgId;
      const name = g?.name ?? g?.title ?? g?.groupName ?? g?.displayName;
      if (id != null && name) map[String(id)] = String(name);
    }
    return map;
  }
  async function loadWorkingGroups() {
    for (const url of WG_URLS) {
      try {
        const res = await axios.get(url);
        const arr = extractArray(res?.data);
        if (arr.length) {
          const map = buildWgMap(arr);
          setWgMap(map);
          setWgReady(true);
          return;
        }
      } catch (_) {}
    }
    setWgMap({});
    setWgReady(true);
  }

  useEffect(() => { loadWorkingGroups(); }, []);
  useEffect(() => {
    fetchLawyers();
    fetchCities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

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

  const handlePageChange = (page) => setQuery(prev => ({ ...prev, page }));

  const toggleExpand = (id) => {
    setExpandedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    );
  };

  const handleSortByName = () => {
    setQuery(prev => {
      if (prev.sortBy === "name") {
        if (prev.sortOrder === "asc")  return { ...prev, sortOrder: "desc", page: 1 };
        if (prev.sortOrder === "desc") return { ...prev, sortBy: "", sortOrder: "", page: 1 };
        return { ...prev, sortOrder: "asc", page: 1 };
      }
      return { ...prev, sortBy: "name", sortOrder: "asc", page: 1 };
    });
  };

  const openEditModal = (id) => setEditingLawyerId(id);
  const closeEditModal = () => setEditingLawyerId(null);
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) closeEditModal();
  };

  const groupNameFor = (l) => {
    const inline =
      l?.workingGroup?.name ||
      l?.workingGroupName ||
      l?.workingGroupTitle;
    if (inline) return inline;

    const id = l?.workingGroupId ?? l?.workingGroupID ?? l?.groupId;
    if (id == null) return "-";

    return wgMap[String(id)] ?? (wgReady ? "-" : "Yükleniyor…");
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

        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={query.availableForProBono === "true"}
            onChange={(e) =>
              setQuery(prev => ({
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
      ) : lawyers.length === 0 ? (
        <div className="form-card" style={{ textAlign: "center", marginTop: 16 }}>
          Bu filtrelerle eşleşen avukat bulunamadı.
        </div>
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
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {lawyers.map((l) => {
              const isOpen = expandedRows.includes(l.id);
              return (
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
                      <td colSpan="9">
                        <div style={{ background: "#f2f5fa", padding: "12px", borderRadius: "10px" }}>
                          <strong>Eğitim:</strong> {l.education || "-"} <br />
                          <strong>Toplam Dava:</strong> {l.totalCasesHandled || 0} <br />
                          <strong>Diller:</strong> {l.languagesSpoken || "-"} <br />
                          <strong>Pro Bono:</strong> {l.availableForProBono ? "Evet" : "Hayır"} <br />
                          <strong>Çalışma Grubu:</strong> {groupNameFor(l)}
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
