import React, { useEffect, useRef, useState } from "react";
import { formatJSON } from "../logic/formatter/formatter";
import { validate } from "../logic/validator";
import { Data } from "./inputs/Data";
import { Result } from "./inputs/Result";
import { Rule } from "./inputs/Rule";
import { apply } from "json-logic-js";
import "./styles/form.css";

export const Forms = () => {
  const [parsedJson, setParsedJson] = useState(null);
  const bottomRef = useRef(null);

  function save(rule, data) {
    sessionStorage.setItem("rule-data", JSON.stringify(rule));
    sessionStorage.setItem("data", JSON.stringify(data));
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    if (url.searchParams.get("rule") && url.searchParams.get("data")) {
      const decodedRule = atob(url.searchParams.get("rule"));
      const decodedData = atob(url.searchParams.get("data"));
      setTimeout(() => {
        save(decodedRule, decodedData);
      }, 10);

      document.getElementById("rule-textarea").value = decodedRule;
      document.getElementById("data-textarea").value = decodedData;
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

  function scrollToBottom() {
    if (bottomRef.current) {
      setTimeout(() => {
        bottomRef.current.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }, 0);
    }
  }

  window.onload = () => {
    sessionStorage.clear();
  };

  return (
    <div className="app" id="app" ref={bottomRef}>
      <div className="form">
        <Rule />

        <Data />
      </div>
      <div className="buttons">
        <button
          className="default-button"
          onClick={() => {
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
            scrollToBottom();
          }}
        >
          Validate
        </button>

        <button
          className="default-button"
          onClick={() => {
            setParsedJson(
              formatJSON(JSON.parse(sessionStorage.getItem("rule-data")), false)
            );

            scrollToBottom();
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
