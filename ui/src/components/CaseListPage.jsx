// ui/src/components/CaseListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";
import { toast } from "react-toastify";
import CaseUpdateModal from "./CaseUpdateModal";
import ConfirmDialog from "./ConfirmDialog";

const API_BASE = "https://localhost:60227/api";

// 🔐 Kelime bazlı maskeleme:
// - 3'ten uzun kelimelerde: ilk 3 harf + geri kalanı * (ör. "Ahmet" -> "Ahm**")
// - 3 veya daha kısa kelimelerde: sadece SON harf * (ör. "Ali" -> "Al*", "Ay" -> "A*", "A" -> "*")
function maskName(input) {
  if (!input) return "-";
  // Çoklu boşlukları tek boşluğa indir
  return String(input)
    .trim()
    .split(/\s+/)
    .map((word) => {
      const len = [...word].length; // Türkçe karakterleri doğru sayabilmek için
      if (len === 0) return "";
      if (len <= 3) {
        // son harfi yıldızla
        const chars = [...word];
        chars[len - 1] = "*";
        return chars.join("");
      }
      const chars = [...word];
      const head = chars.slice(0, 3).join("");
      const masked = "*".repeat(len - 3);
      return head + masked;
    })
    .join(" ");
}

export default function CaseListPage() {
  const navigate = useNavigate();
  const [cases, setCases] = useState([]);
  const [cities, setCities] = useState([]);
  const [expandedRows, setExpandedRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  // Yeni query: sadece city + search + sort + paging
  const [query, setQuery] = useState({
    page: 1,
    pageSize: 5,
    city: "",
    sortBy: "filesubject", // filesubject | city | contactclient | istobeinvoiced
    sortOrder: "desc",     // asc | desc
    searchTerm: "",
  });
  const [searchInput, setSearchInput] = useState("");

  const [selectedCase, setSelectedCase] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Silme için modal state
  const [confirm, setConfirm] = useState({ open: false, id: null });

  useEffect(() => {
    fetchCases();
    fetchFiltersMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // Debounce arama
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setQuery((prev) => ({ ...prev, searchTerm: searchInput, page: 1 }));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchInput]);

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
      const res = await axios.get(`${API_BASE}/cases`, { params: { page: 1, pageSize: 200 } });
      const items = res.data?.items ?? [];
      setCities([...new Set(items.map((i) => i.city || i.City).filter(Boolean))]);
    } catch (err) {
      console.error("Filtre metaları alınamadı:", err);
    }
  }

  const handlePageChange = (page) => setQuery((prev) => ({ ...prev, page }));
  const toggleExpand = (id) =>
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // Dosya Konusu üzerinden sıralama
  const handleSortByFileSubject = () => {
    setQuery((prev) => {
      if (prev.sortBy === "filesubject") {
        if (prev.sortOrder === "desc") return { ...prev, sortOrder: "asc", page: 1 };
        if (prev.sortOrder === "asc") return { ...prev, sortBy: "", sortOrder: "", page: 1 };
        return { ...prev, sortOrder: "desc", page: 1 };
      }
      return { ...prev, sortBy: "filesubject", sortOrder: "desc", page: 1 };
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

  // Silme — onay modalı
  const askDelete = (id) => setConfirm({ open: true, id });
  const doDelete = async () => {
    const id = confirm.id;
    setConfirm({ open: false, id: null });
    try {
      await axios.delete(`${API_BASE}/cases/${id}`);
      toast.success("Dava silindi");
      fetchCases();
    } catch (err) {
      console.error(err);
      toast.error("Dava silinirken bir hata oluştu");
    }
  };

  return (
    <div className="container">
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--space-6)'
      }}>
        <h2 style={{ 
          fontSize: 'var(--font-size-3xl)',
          fontWeight: 'var(--font-weight-bold)',
          color: 'var(--text-primary)',
          margin: 0
        }}>
          Davalar
        </h2>
        <button
          className="btn btn-primary-flat btn-compact"
          aria-label="Yeni dava ekle"
          onClick={() => navigate("/davalar/yeni")}
        >
          Yeni Dava Ekle
        </button>
      </div>

      {/* Filtreler */}
      <div className="filters">
        <div className="filter-item search-item">
          <label>Arama</label>
          <div className="search-input-container">
            <input
              type="text"
              placeholder="Dosya konusu veya açıklama ile ara..."
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
            onChange={(e) => setQuery((prev) => ({ ...prev, city: e.target.value, page: 1 }))}
          >
            <option value="">Tüm Şehirler</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
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
              <th
                onClick={handleSortByFileSubject}
                style={{ cursor: "pointer", whiteSpace: "nowrap" }}
              >
                Dosya Konusu{" "}
                {query.sortBy === "filesubject" &&
                  (query.sortOrder === "asc" ? "▲" : query.sortOrder === "desc" ? "▼" : "")}
              </th>
              <th>Şehir</th>
              <th>Müvekkil</th>
              <th>Faturalı mı?</th>
              <th>İşlem</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => {
              // API camel/Pascal farkını tolere et
              const id = c.id ?? c.Id;
              const fileSubject = c.fileSubject ?? c.FileSubject ?? "-";
              const city = c.city ?? c.City ?? "-";
              const contactClientRaw = c.contactClient ?? c.ContactClient ?? "-";
              const contactClient = maskName(contactClientRaw); // 🔐 burada maskeleniyor
              const isToBeInvoiced = (c.isToBeInvoiced ?? c.IsToBeInvoiced) ? "Evet" : "Hayır";

              const isOpen = expandedRows.includes(id);

              return (
                <React.Fragment key={id}>
                  <tr>
                    <td>{fileSubject}</td>
                    <td>{city}</td>
                    <td>{contactClient}</td>
                    <td>{isToBeInvoiced}</td>
                    <td className="actions-cell">
                      <button
                        className="btn-details"
                        onClick={() => toggleExpand(id)}
                        aria-expanded={isOpen}
                        aria-label={isOpen ? "Detayı kapat" : "Detay aç"}
                      >
                        {isOpen ? "Detayı Kapat" : "Detay Aç"}
                      </button>{" "}
                      <button
                        className="btn-update"
                        onClick={() => handleEditClick(id)}
                        aria-label="Davayı güncelle"
                      >
                        Güncelle
                      </button>{" "}
                      <button
                        className="btn-delete"
                        onClick={() => askDelete(id)}
                        aria-label="Davayı sil"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>

                  {isOpen && (
                    <tr>
                      <td colSpan={5}>
                        <div style={{ background: "#f2f5fa", padding: 12, borderRadius: 10 }}>
                          <strong>Açıklama:</strong>{" "}
                          {c.description ?? c.Description ?? "-"} <br />
                          <strong>Konu Açıklaması:</strong>{" "}
                          {c.subjectMatterDescription ?? c.SubjectMatterDescription ?? "-"} <br />
                          <strong>Adres:</strong>{" "}
                          {(c.address ?? c.Address) || (c.county ?? c.County)
                            ? `${c.address ?? c.Address ?? ""} ${c.county ?? c.County ?? ""}`.trim()
                            : "-"}
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

      {/* Silme Onayı Modalı */}
      <ConfirmDialog
        open={confirm.open}
        title="Bu davayı silmek istiyor musun?"
        message="Bu işlem geri alınamaz. Dava kalıcı olarak silinecek."
        confirmText="Sil"
        cancelText="Vazgeç"
        onConfirm={doDelete}
        onCancel={() => setConfirm({ open: false, id: null })}
      />
    </div>
  );
}
