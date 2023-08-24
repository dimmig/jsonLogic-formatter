import React from "react";
import { AiOutlineFileDone } from "react-icons/ai";
import "../assets/styles/header.css";

export const ResultHeader = () => {
  return (
    <header className="header result-header" id="result-header">
      <span className="auto-type bookmarks-header"></span>
      <AiOutlineFileDone
        style={{ height: "1.5rem", width: "1.5em", color: "#fff" }}
      />
    </header>
  );
};
