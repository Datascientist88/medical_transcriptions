import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import CaseAnalysis from "./CaseAnalysis";

function AppRoutes() {
  const [fields, setFields] = useState({
    personalHistory: "",
    chiefComplaint: "",
    presentIllness: "",
    medicationHistory: "",
    pastHistory: "",
    familyHistory: "",
    requiredLabTestsAndProcedures: "",
  });

  return (
    <Router>
      <Routes>
        <Route path="/" element={<App fields={fields} setFields={setFields} />} />
        <Route path="/case-analysis/:transcript" element={<CaseAnalysis fields={fields} />} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
