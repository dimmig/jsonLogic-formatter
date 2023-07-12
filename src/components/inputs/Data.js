import React from "react";
import { isValidData } from "../hepler";
import "../styles/inputs.css";

export const Data = () => {
  return (
    <div>
      <h2 className="heading">Data</h2>
      <textarea
        spellCheck="false"
        placeholder="Type your data here"
        className="textarea"
        id="data-textarea"
        onChange={(e) => isValidData(e.target.value)}
      />
    </div>
  );
};
