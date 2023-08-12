import React, { useEffect } from "react";
import { Data } from "./subcomponents/Data";
import { Rule } from "./subcomponents/Rule";
import {
  renderDecodedUrl,
  renderFormattedResult,
  renderValidatedResult,
} from "./hepler";
import "./assets/styles/form.css";

export const Forms = ({ setParsedJson }) => {
  useEffect(() => {
    if (
      window.location.href.includes("rule") ||
      window.location.href.includes("data")
    ) {
      const url = new URL(window.location.href);
      if (window.location.href.includes("bookmarkName")) {
        document.title = url.searchParams.get("bookmarkName");
      }

      renderDecodedUrl();
      document.getElementById("url-button").classList.remove("disabled");
      document.getElementById("bookmark-button").classList.remove("disabled");
    }
  }, []);

  return (
    <div className="app" id="app">
      <div className="form">
        <Rule />
        <Data />
      </div>
      <div className="buttons-wrapper">
        <div className="buttons" id="buttons">
          <button
            className="default-button"
            id="validation-button"
            onClick={() => renderValidatedResult(setParsedJson)}
          >
            Validate
          </button>

          <button
            className="default-button"
            onClick={() => renderFormattedResult(setParsedJson)}
          >
            Format
          </button>
        </div>
      </div>
    </div>
  );
};
