import React, { useState, useEffect } from 'react';
import apiClient, { API_CONFIG } from '../config/api';

const MatchHistory = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    fetchMatchHistory();
  }, []);

  const fetchMatchHistory = async () => {
    try {
      const response = await apiClient.get(API_CONFIG.ENDPOINTS.MATCH_HISTORY);
      setHistory(response.data);
    } catch (error) {
      console.error('Error fetching match history:', error);
    }
  };

  return (
    <div className="match-history">
      <h2>Eşleştirme Geçmişi</h2>
      <ul className="history-list">
        {history.map((item) => (
          <li key={item.id} className="history-item">
            <p>Dava: {item.caseTitle}</p>
            <p>Avukat: {item.lawyerName}</p>
            <p>Tarih: {new Date(item.date).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MatchHistory;
