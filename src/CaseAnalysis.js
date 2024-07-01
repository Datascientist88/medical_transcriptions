import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import CustomLoader from "./CustomLoader"; // Import the CustomLoader component
import "./App.css"; // Import the CSS file for the copy icon
import { jsPDF } from "jspdf"; // Import jsPDF library

function CaseAnalysis() {
  const { transcript } = useParams();
  const [analysisResult, setAnalysisResult] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Add a loading state
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Transcript from URL params:", transcript);
    const fetchAnalysisResult = async () => {
      setLoading(true); // Set loading to true before making the API call
      try {
        const response = await axios.post(
          "http://localhost:5001/api/generate",
          { input: decodeURIComponent(transcript) }
        );
        console.log("API Response:", response.data);
        if (response.data.response) {
          setAnalysisResult(response.data.response);
        } else {
          setError("No response from AI");
        }
      } catch (error) {
        console.error("Error during case analysis:", error);
        setError("An error occurred while analyzing the case.");
      } finally {
        setLoading(false); // Set loading to false after the API call is complete
      }
    };

    if (transcript) {
      fetchAnalysisResult();
    } else {
      setError("No transcript provided");
    }
  }, [transcript]);

  const handleMedicalTranscriptionClick = () => {
    navigate("/");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      function() {
        console.log('Copying to clipboard was successful!');
        // Show a message to the user
        alert('Copied to clipboard!');
      },
      function(err) {
        console.error('Could not copy text: ', err);
      }
    );
  }

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text(analysisResult, 14, 14);
    doc.save("analysis_result.pdf");
  }

  return (
    <div className="case-analysis-page">
      <h1>Case Analysis</h1>
      <div className="case-analysis-content">
        <h2>Analysis Result:
          <strong>AI Second Opinion</strong>
        </h2>
        {loading ? (
          <CustomLoader /> // Render the CustomLoader component while loading
        ) : error ? (
          <pre className="analysis-result">{error}</pre>
        ) : (
          <div className="analysis-result-container">
            <pre className="analysis-result" dangerouslySetInnerHTML={{ __html: analysisResult }}></pre>
            <div className="copy-icon-container" onClick={() => copyToClipboard(analysisResult)}>
              <span className="copy-label">Copy</span>
              <i className="fas fa-copy copy-icon"></i>
            </div>
            <button onClick={downloadPDF}>Download PDF</button>
          </div>
        )}
      </div>
      <button onClick={handleMedicalTranscriptionClick}>
        Medical Transcription
      </button>
    </div>
  );
}

export default CaseAnalysis;
