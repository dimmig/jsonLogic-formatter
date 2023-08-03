import React from "react";
import "../styles/inputs.css";
import "../styles/bookmark.css";

export const ExportButton = ({ data, fileName }) => {
  function handleExport() {
    if (!data || !fileName) {
      return;
    }

    const blob = new Blob([JSON.stringify(data)], {
      type: "application/octet-stream",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <button
      className="bookmark-btn export-button disabled"
      id="export-button"
      onClick={handleExport}
    >
      Export
    </button>
  );
};
