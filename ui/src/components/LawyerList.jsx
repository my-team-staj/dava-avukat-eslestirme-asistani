import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://localhost:60227/api/lawyers";

const LawyerList = () => {
  const [lawyers, setLawyers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Arama/filtreleme parametreleri
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [isActive, setIsActive] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Avukatları getir
  const fetchLawyers = async () => {
    setLoading(true);
    try {
      const params = {
        search: search || undefined,
        city: city || undefined,
        isActive: isActive === "" ? undefined : isActive,
        page,
        pageSize,
      };
      const res = await axios.get(API_URL, { params });
      setLawyers(res.data.data);
      setTotalCount(res.data.totalCount);
    } catch (error) {
      alert("Liste getirilemedi!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLawyers();
    // eslint-disable-next-line
  }, [search, city, isActive, page, pageSize]);

  return (
    <div>
      <h2>Avukat Listesi</h2>

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="İsim, şehir veya dil ara"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Şehir"
          value={city}
          onChange={(e) => { setCity(e.target.value); setPage(1); }}
          style={{ marginRight: 8 }}
        />
        <select
          value={isActive}
          onChange={(e) => { setIsActive(e.target.value); setPage(1); }}
          style={{ marginRight: 8 }}
        >
          <option value="">Tümü</option>
          <option value="true">Aktif</option>
          <option value="false">Pasif</option>
        </select>
        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>

      {loading ? (
        <div>Yükleniyor...</div>
      ) : (
        <>
          <table border={1} cellPadding={8} style={{ width: "100%" }}>
            <thead>
              <tr>
                <th>#</th>
                <th>İsim</th>
                <th>Şehir</th>
                <th>E-posta</th>
                <th>Telefon</th>
                <th>Baro No</th>
                <th>Pro Bono</th>
                <th>Puan</th>
                <th>Durum</th>
              </tr>
            </thead>
            <tbody>
              {lawyers.map((l, i) => (
                <tr key={l.id}>
                  <td>{(page - 1) * pageSize + i + 1}</td>
                  <td>{l.name}</td>
                  <td>{l.city}</td>
                  <td>{l.email}</td>
                  <td>{l.phone}</td>
                  <td>{l.baroNumber}</td>
                  <td>{l.availableForProBono ? "✔️" : ""}</td>
                  <td>{l.rating}</td>
                  <td>{l.isActive ? "Aktif" : "Pasif"}</td>
                </tr>
              ))}
              {lawyers.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ textAlign: "center" }}>Kayıt bulunamadı.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Sayfalama */}
          <div style={{ marginTop: 16 }}>
            {Array.from({ length: Math.ceil(totalCount / pageSize) }, (_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setPage(idx + 1)}
                style={{
                  marginRight: 4,
                  fontWeight: page === idx + 1 ? "bold" : "normal",
                  padding: "4px 8px"
                }}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LawyerList;
