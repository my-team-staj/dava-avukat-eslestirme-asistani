import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import LawyerAddForm from "./components/LawyerAddForm";
import LawyerList from "./components/LawyerList";
import CreateCaseForm from "./components/CreateCaseForm";
import CaseListPage from "./components/CaseListPage";
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
              <Route path="/lawyer-add" element={<LawyerAddForm />} />
              <Route path="/lawyers" element={<LawyerList />} />
              <Route path="/case-add" element={<CreateCaseForm />} />
              <Route path="/cases" element={<CaseListPage />} />
            </Routes>
          </main>
          <Footer />

          {/* Toastify Container - Ortada Göster */}
         <ToastContainer
  autoClose={3000}
  theme="colored"
  hideProgressBar
  closeOnClick
  pauseOnHover
  draggable
  containerClassName="toast-center-screen"
/>


        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
