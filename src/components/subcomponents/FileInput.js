import React, { useState, useEffect } from "react";
import { readFile } from "./subcomponentsHelper";
import { addBookmark, onTimeoutEnd } from "../bookmarks/bookmarksHelper";
import "../assets/styles/bookmark.css";
import "../assets/styles/inputs.css";

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
    readFile(fileData, setArrayLength);
  }, [fileData]);

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
        setSearchBookmarks(resultedBookmarks);

        localStorage.setItem(
          "bookmarks-before-search",
          JSON.stringify(resultedBookmarks)
        );
        localStorage.setItem("bookmarks", JSON.stringify(resultedBookmarks));

        document
          .getElementById("name-input-wrapper")
          .classList.remove("invisible");
        document
          .getElementById("add-bookmark-button")
          .classList.add("none-border");
        document.getElementById("name-input").classList.add("invisible");
        document
          .getElementById("add-bookmark-cancel")
          .classList.add("invisible");
        document.getElementById("button-file-input").classList.add("invisible");

        setTimeout(() => {
          setCompleted(false);
          onTimeoutEnd();
          document.getElementById("label").classList.add("disabled-file-input");
          document
            .getElementById("import-export-block")
            .classList.add("flex-column");
          document
            .getElementById("add-bookmark-button")
            .classList.remove("none-border");
        }, 1000);

        return true;
      };

      reader.readAsText(file);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    setFileName(file ? file.name : "");
    setFileData(file);
    handleFileUpload(file);
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
