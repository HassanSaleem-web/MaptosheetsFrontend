import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // States
  const [docxFile, setDocxFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [excelDownloadLink, setExcelDownloadLink] = useState("");
  const [csvDownloadLink, setCsvDownloadLink] = useState("");
  const [mappings, setMappings] = useState([]);

  // Handle file changes
  const handleDocxChange = (e) => setDocxFile(e.target.files[0]);
  const handleExcelChange = (e) => setExcelFile(e.target.files[0]);

  // Fetch mappings from JSON file
  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const response = await axios.get("/mappings.json"); // Assuming mappings.json is in the public folder
        setMappings(Object.entries(response.data)); // Convert object to array for rendering
      } catch (error) {
        console.error("Error fetching mappings:", error);
      }
    };
    fetchMappings();
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    if (!docxFile || !excelFile) {
      alert("Please upload both DOCX and Excel files.");
      return;
    }

    const formData = new FormData();
    formData.append("docxFile", docxFile);
    formData.append("excelFile", excelFile);

    try {
      // Post data to the backend
      const response = await axios.post(
        "https://mapstosheetsackend-1.onrender.com/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Handle success response
      if (response.data.status === "success") {
        setExcelDownloadLink(response.data.downloadExcel);
        setCsvDownloadLink(response.data.downloadCsv); // Link for CSV debugging
      } else {
        alert("Failed to process files.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading files. Please try again.");
    }
  };

  return (
    <div className="App" style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center" }}>Excel Mapping and Formatting Tool</h1>

      {/* File Upload Inputs */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Upload Files:</h3>
        <label>DOCX File:</label>
        <input type="file" accept=".docx" onChange={handleDocxChange} />
        <br />
        <label>Excel File:</label>
        <input type="file" accept=".xlsx" onChange={handleExcelChange} />
      </div>

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        style={{
          padding: "10px 20px",
          margin: "20px 0",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Upload and Process
      </button>

      {/* Download Links */}
      <div style={{ marginTop: "20px" }}>
        {excelDownloadLink && (
          <div>
            <h3>Download Updated Excel:</h3>
            <a
              href={excelDownloadLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Download Excel File
            </a>
          </div>
        )}

        {csvDownloadLink && (
          <div style={{ marginTop: "10px" }}>
            <h3>Download CSV Debug File:</h3>
            <a
              href={csvDownloadLink}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "blue", textDecoration: "underline" }}
            >
              Download CSV File
            </a>
          </div>
        )}
      </div>

      {/* Mappings Table */}
      <h2 style={{ marginTop: "30px" }}>Mappings Table</h2>
      <table
        border="1"
        style={{
          width: "100%",
          marginTop: "20px",
          textAlign: "left",
          borderCollapse: "collapse",
        }}
      >
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th style={{ padding: "10px" }}>Heading</th>
            <th style={{ padding: "10px" }}>Cell Number</th>
          </tr>
        </thead>
        <tbody>
          {mappings.length > 0 ? (
            mappings.map(([key, value], index) => (
              <tr key={index}>
                <td style={{ padding: "10px" }}>{key}</td>
                <td style={{ padding: "10px" }}>{value}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ padding: "10px", textAlign: "center" }}>
                No mappings available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
