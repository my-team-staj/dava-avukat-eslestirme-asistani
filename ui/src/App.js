import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LawyerAddForm from "./components/LawyerAddForm";
import LawyerList from "./components/LawyerList";   // YENİ: Listeleme sayfasını ekledik
import CreateCaseForm from "./components/CreateCaseForm";
import CaseListPage from "./components/CaseListPage";

import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-bg">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/lawyer-add" element={<LawyerAddForm />} />
            <Route path="/lawyers" element={<LawyerList />} /> {/* YENİ: Avukat Listesi */}
            <Route path="/case-add" element={<CreateCaseForm />} />
            <Route path="/cases" element={<CaseListPage />} /> {/* YENİ: Dava Listesi */}
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
