import React, { useEffect } from "react";
import { formatJSON } from "../logic/formatter/formatter";
import { validate } from "../logic/validator";
import { Data } from "./subcomponents/Data";
import { Rule } from "./subcomponents/Rule";
import { apply } from "json-logic-js";
import { areInputsClear, renderDecodedUrl } from "./hepler";
import "./styles/form.css";

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

  const valid_options = [
    { backgroundColor: "rgba(118, 219, 145, 0)" },
    { backgroundColor: "rgba(118, 219, 145, 0.6)" },
    { backgroundColor: "rgba(118, 219, 145, 0)" },
  ];

  const notValid_options = [
    { backgroundColor: "rgba(250, 105, 73, 0)" },
    { backgroundColor: "rgba(250, 105, 73, 0.6)" },
    { backgroundColor: "rgba(250, 105, 73, 0)" },
  ];

  function fullValidation(rule, data) {
    return apply(JSON.parse(rule), JSON.parse(data));
  }

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
            onClick={() => {
              let validatedData = validate(
                JSON.parse(sessionStorage.getItem("rule-data")),
                JSON.parse(sessionStorage.getItem("data"))
              );

              if (areInputsClear()) {
                setParsedJson(
                  formatJSON(
                    JSON.parse(sessionStorage.getItem("rule-data")),
                    null
                  )
                );
                return;
              }
              setParsedJson(
                formatJSON(
                  JSON.parse(sessionStorage.getItem("rule-data")),
                  validatedData
                )
              );
              if (
                document.getElementById("result-p") !== null &&
                validatedData
              ) {
                if (
                  fullValidation(
                    JSON.parse(sessionStorage.getItem("rule-data")),
                    JSON.parse(sessionStorage.getItem("data"))
                  )
                ) {
                  document
                    .getElementById("result-p")
                    .animate(valid_options, { duration: 1000 });

                  document
                    .getElementById("result-p")
                    .classList.remove("red-border");

                  document
                    .getElementById("result-p")
                    .classList.add("green-border");
                } else {
                  document
                    .getElementById("result-p")
                    .animate(notValid_options, { duration: 1000 });

                  document
                    .getElementById("result-p")
                    .classList.remove("green-border");
                  document
                    .getElementById("result-p")
                    .classList.add("red-border");
                }
              }
            }}
          >
            Validate
          </button>

          <button
            className="default-button"
            onClick={() => {
              if (areInputsClear()) {
                setParsedJson(
                  formatJSON(
                    JSON.parse(sessionStorage.getItem("rule-data")),
                    null
                  )
                );
                return;
              }
              setParsedJson(
                formatJSON(
                  JSON.parse(sessionStorage.getItem("rule-data")),
                  false
                )
              );
            }}
          >
            Format
          </button>
        </div>
      </div>
    </div>
  );
};
