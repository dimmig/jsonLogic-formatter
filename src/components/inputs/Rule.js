import React from "react";
import { isValidRule } from "../hepler";
import "../styles/inputs.css";

export const Rule = () => {
  return (
    <div>
      <h2 className="heading">Rule</h2>
      <textarea
        spellCheck="false"
        placeholder="Type your rule here"
        className="textarea"
        onChange={(e) => isValidRule(e.target.value)}
      />
    </div>
  );
};
