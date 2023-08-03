import React, { useState, useEffect } from "react";
import "../styles/bookmark.css";
import "../styles/inputs.css";

export const FileInput = ({ onChange }) => {
  const [fileName, setFileName] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [arrayLength, setArrayLength] = useState(null);

  useEffect(() => {
    if (fileData) {
      // Read the content of the file
      const reader = new FileReader();
      reader.readAsText(fileData);

      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result);
          if (Array.isArray(jsonData)) {
            // Set the array length in the state
            setArrayLength(jsonData.length);
          }
        } catch (error) {
          // Handle any JSON parsing errors
          console.error("Error parsing JSON file:", error);
        }
      };
    }
  }, [fileData]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
    setFileData(file);
    document.getElementById("label").classList.add("disabled-file-input");
    document.getElementById("import-export-block").classList.add("flex-column");
  }

  function handleReset() {
    setFileName(null);
    document.getElementById("label").classList.remove("disabled-file-input");
    document
      .getElementById("import-export-block")
      .classList.remove("flex-column");
  }

  return (
    <div className="custom-file-input" id="file-input">
      <label htmlFor="file-upload" className="file-label" id="label">
        {fileName ? (
          <div className="file-wrapper">
            <div className="file-block">
              <span className="file-span">File selected:</span>
              <span className="file-name-span">{fileName}</span>
            </div>

            <span className="file-span">
              length: <span className="length-span">{arrayLength}</span>
            </span>
          </div>
        ) : (
          "Choose a file..."
        )}
      </label>
      <input
        id="file-upload"
        type="file"
        onChange={handleFileChange}
        className="file-input"
        accept=".json"
      />

      {fileName && (
        <div className="file-input-buttons">
          <button
            onClick={() => onChange(fileData)}
            className="file-input-btn upload-button"
          >
            Upload
          </button>
          <button onClick={handleReset} className="file-input-btn reset-button">
            Reset
          </button>
        </div>
      )}
    </div>
  );
};
