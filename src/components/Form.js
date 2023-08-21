import React, { useEffect, useState } from "react";
import { Data } from "./subcomponents/Data";
import { Rule } from "./subcomponents/Rule";
import {
  renderDecodedUrl,
  renderFormattedResult,
  renderValidatedResult,
} from "./hepler";
import "./assets/styles/form.css";

export const Forms = ({ setParsedJson }) => {
  const [headingBookmarkName, setHeadingBookmarkName] = useState(null);

  useEffect(() => {
    if (
      window.location.href.includes("rule") ||
      window.location.href.includes("data")
    ) {
      const url = new URL(window.location.href);
      if (window.location.href.includes("bookmarkName")) {
        setHeadingBookmarkName(url.searchParams.get("bookmarkName"));
      }

      renderDecodedUrl();
      document.getElementById("url-button").classList.remove("disabled");
      document.getElementById("bookmark-button").classList.remove("disabled");
    }
  }, []);

  return (
    <div className="app" id="app">
      {headingBookmarkName ? (
        <h1 className="heading">
          Bookmark: {" "} 
          <span className="bookmarks-length">{headingBookmarkName}</span>
        </h1>
      ) : (
        <></>
      )}
      <div className="form" id="rule-data-inputs">
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
