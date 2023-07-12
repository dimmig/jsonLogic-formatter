import React, { useState } from "react";
import { formatJSON } from "../logic/formatter/formatter";
import { validate } from "../logic/validator";
import { Data } from "./inputs/Data";
import { Result } from "./inputs/Result";
import { Rule } from "./inputs/Rule";
import { apply } from "json-logic-js";
import "./styles/form.css";

export const Forms = () => {
  const [parsedJson, setParsedJson] = useState(null);

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

  window.onload = () => {
    sessionStorage.clear();
  };

  return (
    <div className="app" id="app">
      <div className="form">
        <Rule />
        <Data />
      </div>
      <div className="buttons">
        <button
          onClick={() => {
            window.scrollTo({
              top: document.getElementById("result").offsetTop,
              behavior: "smooth",
            });

            const validatedData = validate(
              JSON.parse(sessionStorage.getItem("rule-data")),
              JSON.parse(sessionStorage.getItem("data"))
            );
            setParsedJson(
              formatJSON(
                JSON.parse(sessionStorage.getItem("rule-data")),
                validatedData
              )
            );
            if (document.getElementById("result-p") !== null && validatedData) {
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
                document.getElementById("result-p").classList.add("red-border");
              }
            }
          }}
        >
          Validate
        </button>
        <button
          onClick={() => {
            window.scrollTo({
              top: document.getElementById("result").offsetTop,
              behavior: "smooth",
            });
            setParsedJson(
              formatJSON(JSON.parse(sessionStorage.getItem("rule-data")), false)
            );
          }}
        >
          Format
        </button>
      </div>
      <div id="result">
        <Result jsonData={parsedJson} />
      </div>
    </div>
  );
};
