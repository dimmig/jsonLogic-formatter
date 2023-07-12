import React from "react";
import { isValidRule } from "../hepler";
import { EXAMPLE_DATA, EXAMPLE_RULE } from "../../logic/constants";
import "../styles/inputs.css";

export const Rule = () => {
  function save(rule, data) {
    sessionStorage.setItem("rule-data", JSON.stringify(rule));
    sessionStorage.setItem("data", JSON.stringify(data));
  }

  return (
    <div>
      <div className="rule-button-block">
        <h2 className="heading">Rule</h2>
        <button
          className="default-button test-button"
          onClick={() => {
            document.getElementById("rule-textarea").value = EXAMPLE_RULE;
            document.getElementById("data-textarea").value = EXAMPLE_DATA;
            save(EXAMPLE_RULE, EXAMPLE_DATA);
          }}
        >
          Example data
        </button>
      </div>
      <textarea
        spellCheck="false"
        placeholder="Type your rule here"
        className="textarea"
        id="rule-textarea"
        onChange={(e) => isValidRule(e.target.value)}
      />
    </div>
  );
};
