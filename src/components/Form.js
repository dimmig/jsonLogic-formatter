import React, { useEffect, useState } from "react";
import { Data } from "./subcomponents/Data";
import { Rule } from "./subcomponents/Rule";
import { renderDecodedUrl, renderResult } from "./hepler";
import "./assets/styles/form.css";

export const Inputs = ({ setParsedJson }) => {
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
          Bookmark:{" "}
          <span className="bookmarks-length">{headingBookmarkName}</span>
        </h1>
      ) : (
        <></>
      )}
      <div className="form">
        <Rule />
        <Data />
      </div>
      <div className="buttons-wrapper">
        <div className="buttons" id="buttons">
          <button
            className="default-button"
            id="validation-button"
            onClick={() => renderResult(setParsedJson, true)}
          >
            Validate
          </button>

          <button
            className="default-button"
            onClick={() => renderResult(setParsedJson, false)}
          >
            Format
          </button>
        </div>
      </div>
    </div>
  );
};
