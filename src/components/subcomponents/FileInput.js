import React, { useState, useEffect } from "react";
import "../assets/styles/bookmark.css";
import "../assets/styles/inputs.css";
import { addBookmark } from "../bookmarks/bookmarksHelper";

export const FileInput = ({
  setCompleted,
  setStateBookmarks,
  setSearchBookmarks,
  stateBookmarks,
  setInputDisabled,
}) => {
  const [fileName, setFileName] = useState(null);
  const [fileData, setFileData] = useState(null);
  const [arrayLength, setArrayLength] = useState(null);

  useEffect(() => {
    if (fileData) {
      const reader = new FileReader();
      reader.readAsText(fileData);

      reader.onload = () => {
        try {
          const jsonData = JSON.parse(reader.result);
          if (Array.isArray(jsonData)) {
            setArrayLength(jsonData.length);
          }
        } catch (error) {
          console.error("Error parsing JSON file:", error);
        }
      };
    }
  }, [fileData]);

  function handleFileChange(e) {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
    setFileData(file);
    handleFileUpload(file);
  }

  function handleFileUpload(file) {
    let resultedBookmarks = [];

    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = JSON.parse(event.target.result);

        for (const object of fileContent) {
          const bookmarkName = object.subpart + object.section;
          resultedBookmarks = addBookmark(stateBookmarks, bookmarkName, object);
          if (!resultedBookmarks.length) {
            resultedBookmarks = [...resultedBookmarks, ...stateBookmarks];
          }
        }
        setCompleted(true);
        setInputDisabled(false);
        setStateBookmarks(resultedBookmarks);
        setSearchBookmarks(resultedBookmarks)

        localStorage.setItem(
          "bookmarks-before-search",
          JSON.stringify(resultedBookmarks)
        );
        localStorage.setItem("bookmarks", JSON.stringify(resultedBookmarks));

        document
          .getElementById("add-bookmark-button")
          .classList.remove("invisible");
        document
          .getElementById("add-bookmark-button")
          .classList.add("completed-button");
        document.getElementById("file-input").classList.add("invisible");
        document.getElementById("bookmark-button").classList.add("invisible");
        document.getElementById("export-button").classList.add("invisible");
        document.getElementById("clear-all-button").classList.add("invisible");
        document.getElementById("search-input").value = "";

        setTimeout(() => {
          setCompleted(false);
          document
            .getElementById("add-bookmark-button")
            .classList.remove("completed-button");
          document.getElementById("file-input").classList.remove("invisible");
          document
            .getElementById("bookmark-button")
            .classList.remove("invisible");
          document
            .getElementById("add-bookmark-button")
            .classList.add("invisible");
          document
            .getElementById("export-button")
            .classList.remove("invisible");
          document
            .getElementById("export-button")
            .classList.remove("invisible", "disabled");
          document
            .getElementById("clear-all-button")
            .classList.remove("invisible", "disabled");
          document.getElementById("label").classList.add("disabled-file-input");
          document
            .getElementById("import-export-block")
            .classList.add("flex-column");
        }, 1000);

        return true;
      };

      reader.readAsText(file);
    }
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
    </div>
  );
};
