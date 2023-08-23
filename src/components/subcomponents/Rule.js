import React from "react";
import { isValid } from "../hepler";
import { renderExampleData } from "./subcomponentsHelper";
import "../assets/styles/inputs.css";

export const Rule = () => {
  return (
    <div>
      <div className="rule-button-block">
        <h2 className="heading">Rule</h2>
        <button
          className="default-button test-button"
          onClick={renderExampleData}
        >
          Example data
        </button>
      </div>
      <textarea
        spellCheck="false"
        placeholder="Type your rule here"
        className="textarea full-width-textarea"
        id="rule-textarea"
        onChange={(e) => isValid("rule", e.target.value)}
      />
    </div>
  );
};
