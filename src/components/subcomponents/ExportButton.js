import React from "react";
import { handleExport } from "./subcomponentsHelper";
import "../assets/styles/inputs.css";
import "../assets/styles/bookmark.css";

export const ExportButton = ({ data, fileName }) => {
  return (
    <button
      className="bookmark-btn export-button disabled"
      id="export-button"
      onClick={() => handleExport(data, fileName)}
    >
      Export
    </button>
  );
};
