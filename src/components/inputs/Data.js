import React, { useState } from "react";
import { isValidData } from "../hepler";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { areInputsClear } from "../hepler";
import "../styles/inputs.css";
import "../styles/form.css";

export const Data = () => {
  const [copied, setCopied] = useState(null);

  function filterData(rule, data) {
    const result = {};
    for (const key of Object.keys(JSON.parse(data))) {
      if (rule.includes(key)) {
        result[key] = JSON.parse(data)[key];
      }
    }
    return result;
  }

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
              sessionStorage.getItem("data") !== null &&
              !areInputsClear()
            ) {
              const url = new URL(window.location.href);
              const rule = JSON.parse(sessionStorage.getItem("rule-data"));
              const data = JSON.parse(sessionStorage.getItem("data"));

              const filtredData = filterData(rule, data);

              url.searchParams.set("rule", btoa(rule));
              url.searchParams.set("data", btoa(JSON.stringify(filtredData)));

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
        onChange={(e) => isValidData(e.target.value)}
      />
    </div>
  );
};
