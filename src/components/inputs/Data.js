import React, { useState } from "react";
import { isValidData } from "../hepler";
import { AiOutlineCheckCircle } from "react-icons/ai";
import "../styles/inputs.css";
import "../styles/form.css";

export const Data = () => {
  const [copied, setCopied] = useState(null);

  return (
    <div>
      <div className="rule-button-block">
        <h2 className="heading">Data</h2>
        <button
          className="default-button url-button"
          id="url-button"
          onClick={() => {
            if (
              sessionStorage.getItem("rule-data") !== null &&
              sessionStorage.getItem("data") !== null
            ) {
              const url = new URL(window.location.href);
              url.searchParams.set(
                "rule",
                btoa(JSON.parse(sessionStorage.getItem("rule-data")))
              );
              url.searchParams.set(
                "data",
                btoa(JSON.parse(sessionStorage.getItem("data")))
              );
              navigator.clipboard.writeText(url);
              document.getElementById("url-button").classList.add("completed");
              setCopied(true);

              setTimeout(() => {
                setCopied(false);
                document
                  .getElementById("url-button")
                  .classList.remove("completed");
              }, 2000);
            }
          }}
        >
          {copied ? (
            <span className="url-button-wrapper">
              Copied
              <AiOutlineCheckCircle style={{ width: "1.5rem", height: "1.5rem" }} />
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
        onChange={(e) => isValidData(e.target.value)}
      />
    </div>
  );
};
