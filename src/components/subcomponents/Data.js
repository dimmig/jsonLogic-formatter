import React, { useState } from "react";
import { encodeUrl, isValid } from "../hepler";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { areInputsClear } from "../hepler";
import "../styles/inputs.css";
import "../styles/form.css";
import "../styles/bookmark.css";

export const Data = () => {
  const [copied, setCopied] = useState(null);

  return (
    <div>
      <div className="rule-button-block">
        <h2 className="heading">Data</h2>
        <button
          className="default-button url-button disabled"
          id="url-button"
          onClick={() => {
            const rule = sessionStorage.getItem("rule-data");
            const data = sessionStorage.getItem("data");
            const bookmarkName = new URL(window.location.href).searchParams.get(
              "bookmarkName"
            );
            let url;
            if (rule !== null && data !== null && !areInputsClear()) {
              if (bookmarkName) {
                url = encodeUrl(rule, data, bookmarkName);
              } else {
                url = encodeUrl(rule, data);
              }

              navigator.clipboard.writeText(url);
              document.getElementById("url-button").classList.add("completed");
              setCopied(true);

              setTimeout(() => {
                setCopied(false);
                document
                  .getElementById("url-button")
                  .classList.remove("completed");
              }, 1000);
            }
          }}
        >
          {copied ? (
            <span className="url-button-wrapper">
              Copied
              <AiOutlineCheckCircle
                style={{ width: "1.5rem", height: "1.5rem" }}
              />
            </span>
          ) : (
            "Encode url"
          )}
        </button>
      </div>
      <textarea
        spellCheck="false"
        placeholder="Type your data here"
        className="textarea"
        id="data-textarea"
        onChange={(e) => isValid("data", e.target.value)}
      />
    </div>
  );
};
