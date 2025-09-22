import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LawyerAddForm from "./components/LawyerAddForm";
import LawyerList from "./components/LawyerList";
import CreateCaseForm from "./components/CreateCaseForm";
import CaseListPage from "./components/CaseListPage";
import CaseEditPage from "./components/CaseEditPage.tsx";
import CaseDetailPage from "./components/CaseDetailPage.tsx";
import MatchPage from "./components/MatchPage";
import MatchResultsPage from "./components/MatchResultsPage";
import { ToastProvider } from "./components/Toast"; // kendi provider
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

function App() {
  return (
    <ToastProvider>
      <Router>
        <div className="app-bg">
          <Navbar />
          <main className="app-main">
            <Routes>
              <Route path="/" element={<Home />} />
              {/* Yeni sade rotalar */}
              <Route path="/lawyers" element={<LawyerList />} />
              <Route path="/lawyer-add" element={<LawyerAddForm />} />

              <Route path="/davalar" element={<CaseListPage />} />
              <Route path="/davalar/yeni" element={<CreateCaseForm />} />
              <Route path="/davalar/:id/duzenle" element={<CaseEditPage />} />
              <Route path="/davalar/:id/detay" element={<CaseDetailPage />} />

              {/* Eşleştirme sayfaları */}
              <Route path="/match" element={<MatchPage />} />
              <Route path="/match-results" element={<MatchResultsPage />} />

              {/* Geri uyumluluk için eski rotaları koru */}
              <Route path="/cases" element={<CaseListPage />} />
              <Route path="/case-add" element={<CreateCaseForm />} />
            </Routes>
          </main>
          <Footer />

          {/* Toastify Container - Ortada Göster */}
         <ToastContainer
  position="top-right"
  autoClose={3000}
  theme="colored"
  hideProgressBar
  closeOnClick
  pauseOnHover
  draggable
/>


        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
