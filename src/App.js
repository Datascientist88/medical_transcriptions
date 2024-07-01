import React, { useState } from "react";
import axios from "axios";
import { ReactMic } from "react-mic";
import Loader from "./Loader";
import "./App.css";
import { Link } from "react-router-dom";

function App({ fields, setFields }) {
  const [record, setRecord] = useState(false);
  const [loading, setLoading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const startRecording = () => {
    setRecord(true);
  };

  const stopRecording = () => {
    setRecord(false);
  };

  const onStop = async (recordedBlob) => {
    setLoading(true);

    const audioFile = new File([recordedBlob.blob], "temp.wav", {
      type: "audio/wav",
    });
    const formData = new FormData();
    formData.append("audio_data", audioFile);

    try {
      const response = await axios.post(
        "http://localhost:5000/transcribe",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const transcriptText = response.data.transcript;
      setTranscript(transcriptText);

      const fieldsResponse = await axios.post(
        "http://localhost:5000/extract_fields",
        { transcript: transcriptText }
      );
      setFields(fieldsResponse.data);
    } catch (error) {
      console.error("Error during transcription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setFields((prevFields) => ({
      ...prevFields,
      [name]: value,
    }));
  };

  const handleNewRecording = () => {
    setTranscript("");
    setFields({
      personalHistory: "",
      chiefComplaint: "",
      presentIllness: "",
      medicationHistory: "",
      pastHistory: "",
      familyHistory: "",
      requiredLabTestsAndProcedures: "",
    });
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

  return (
    <div className={`App ${theme}`}>
      <div className="sidebar">
        <h1>Medical Voice Transcription</h1>
        <div className="theme-toggle">
          <label className="toggle-switch">
            <input type="checkbox" checked={theme === "dark"} onChange={toggleTheme} />
            <span className="slider"></span>
          </label>
        </div>
        <div className="record-buttons">
          <button onClick={startRecording} disabled={record}>
            Start Recording
          </button>
          <button onClick={stopRecording} disabled={!record}>
            Stop Recording
          </button>
        </div>
        <div className="buttons-container">
          <button onClick={handleNewRecording}>New Recording</button>
          <Link to={`/case-analysis/${encodeURIComponent(transcript)}`}>
            <button disabled={!transcript}>Case Analysis</button>
          </Link>
        </div>
        <ReactMic
          record={record}
          className="sound-wave"
          onStop={onStop}
          strokeColor="#ff38bf"
          visualSetting="frequencyBars"
          backgroundColor="#FFFFFF"
        />
        {loading && (
          <div className="loader-container">
            <Loader />
          </div>
        )}
      </div>
      <div className="main-content">
        <div className="fields-section">
          <h2>Extracted Fields:</h2>
          <div className="field-container">
            <label htmlFor="personalHistory">Personal History:</label>
            <div className="textarea-container">
              <textarea
                name="personalHistory"
                value={fields.personalHistory}
                onChange={handleFieldChange}
              />
              <div className="copy-icon-container" onClick={() => copyToClipboard(fields.personalHistory)}>
                <span className="copy-label">Copy</span>
                <i className="fas fa-copy copy-icon"></i>
              </div>
            </div>
          </div>
          <div className="field-container">
            <label htmlFor="chiefComplaint">Chief Complaint:</label>
            <div className="textarea-container">
              <textarea
                name="chiefComplaint"
                value={fields.chiefComplaint}
                onChange={handleFieldChange}
              />
              <div className="copy-icon-container" onClick={() => copyToClipboard(fields.chiefComplaint)}>
                <span className="copy-label">Copy</span>
                <i className="fas fa-copy copy-icon"></i>
              </div>
            </div>
          </div>
          <div className="field-container">
            <label htmlFor="presentIllness">Present Illness:</label>
            <div className="textarea-container">
              <textarea
                name="presentIllness"
                value={fields.presentIllness}
                onChange={handleFieldChange}
              />
              <div className="copy-icon-container" onClick={() => copyToClipboard(fields.presentIllness)}>
                <span className="copy-label">Copy</span>
                <i className="fas fa-copy copy-icon"></i>
              </div>
            </div>
          </div>
          <div className="field-container">
            <label htmlFor="medicationHistory">Medication History:</label>
            <div className="textarea-container">
              <textarea
                name="medicationHistory"
                value={fields.medicationHistory}
                onChange={handleFieldChange}
              />
              <div className="copy-icon-container" onClick={() => copyToClipboard(fields.medicationHistory)}>
                <span className="copy-label">Copy</span>
                <i className="fas fa-copy copy-icon"></i>
              </div>
            </div>
          </div>
          <div className="field-container">
            <label htmlFor="pastHistory">Past History:</label>
            <div className="textarea-container">
              <textarea
                name="pastHistory"
                value={fields.pastHistory}
                onChange={handleFieldChange}
              />
              <div className="copy-icon-container" onClick={() => copyToClipboard(fields.pastHistory)}>
                <span className="copy-label">Copy</span>
                <i className="fas fa-copy copy-icon"></i>
              </div>
            </div>
          </div>
          <div className="field-container">
            <label htmlFor="familyHistory">Family History:</label>
            <div className="textarea-container">
              <textarea
                name="familyHistory"
                value={fields.familyHistory}
                onChange={handleFieldChange}
              />
              <div className="copy-icon-container" onClick={() => copyToClipboard(fields.familyHistory)}>
                <span className="copy-label">Copy</span>
                <i className="fas fa-copy copy-icon"></i>
              </div>
            </div>
          </div>
          <div className="field-container">
            <label htmlFor="requiredLabTestsAndProcedures">Required Lab Tests and Procedures:</label>
            <div className="textarea-container">
              <textarea
                name="requiredLabTestsAndProcedures"
                value={fields.requiredLabTestsAndProcedures}
                onChange={handleFieldChange}
              />
              <div className="copy-icon-container" onClick={() => copyToClipboard(fields.requiredLabTestsAndProcedures)}>
                <span className="copy-label">Copy</span>
                <i className="fas fa-copy copy-icon"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
