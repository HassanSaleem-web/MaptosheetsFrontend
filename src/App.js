import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  // States
  const [pdfFile, setPdfFile] = useState(null);
  const [docxFile, setDocxFile] = useState(null);
  const [excelFile, setExcelFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState("");
  const [mappings, setMappings] = useState([]);

  // Handle file changes
  const handlePdfChange = (e) => setPdfFile(e.target.files[0]);
  const handleDocxChange = (e) => setDocxFile(e.target.files[0]);
  const handleExcelChange = (e) => setExcelFile(e.target.files[0]);

  // Fetch mappings from JSON file
  useEffect(() => {
    const fetchMappings = async () => {
      try {
        const response = await axios.get("/mappings.json"); // Assuming mappings.json is hosted in public folder
        setMappings(Object.entries(response.data)); // Convert object to array for table rendering
      } catch (error) {
        console.error("Error fetching mappings:", error);
      }
    };
    fetchMappings();
  }, []);

  // Handle file upload
  const handleUpload = async () => {
    if (!pdfFile || !docxFile || !excelFile) {
      alert("Please upload all required files (PDF, DOCX, Excel)");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", pdfFile);
    formData.append("docxFile", docxFile);
    formData.append("excelFile", excelFile);

    try {
      const response = await axios.post("https://mapstosheetsackend-1.onrender.com/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.status === "success") {
        setDownloadLink(response.data.downloadLink);
      } else {
        alert("Failed to process files");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred while uploading files");
    }
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>Excel Mapping and Formatting Tool</h1>

      {/* File Upload Inputs */}
      <div>
        <h3>Upload Files:</h3>
        <input type="file" accept=".pdf" onChange={handlePdfChange} />
        <input type="file" accept=".docx" onChange={handleDocxChange} />
        <input type="file" accept=".xlsx" onChange={handleExcelChange} />
      </div>

      <br />
      <button onClick={handleUpload}>Upload and Process</button>

      <br />
      {downloadLink && (
        <div>
          <h3>Download Updated Excel:</h3>
          <a href={downloadLink} target="_blank" rel="noopener noreferrer">
            Download File
          </a>
        </div>
      )}

      <br />
      <h2>Mappings Table</h2>
      <table border="1" style={{ width: "100%", marginTop: "20px", textAlign: "left" }}>
        <thead>
          <tr>
            <th>Heading</th>
            <th>Cell Number</th>
          </tr>
        </thead>
        <tbody>
          {mappings.length > 0 ? (
            mappings.map(([key, value], index) => (
              <tr key={index}>
                <td>{key}</td>
                <td>{value}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">No mappings available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
