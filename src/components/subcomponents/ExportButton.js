import React from "react";
import "../assets/styles/inputs.css";
import "../assets/styles/bookmark.css";
import { handleExport } from "./subcomponentsHelper";

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
