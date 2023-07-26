import React, { useEffect, useRef, useState } from "react";
import { formatJSON } from "../logic/formatter/formatter";
import { validate } from "../logic/validator";
import { Data } from "./inputs/Data";
import { Result } from "./inputs/Result";
import { Rule } from "./inputs/Rule";
import { BookmarkMenu } from "./BookmarkMenu";
import { apply } from "json-logic-js";
import { areInputsClear, renderDecodedUrl, scrollToBottom } from "./hepler";
import "./styles/form.css";

export const Forms = () => {
  const [parsedJson, setParsedJson] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (window.location.href.includes("bookmarkName")) {
      const url = new URL(window.location.href);
      document.title = url.searchParams.get("bookmarkName");
    }
    if (renderDecodedUrl()) {
      document.getElementById("buttons").classList.add("buttons-custom");
      document.getElementById("url-button").classList.add("invisible");
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
    <div className="app" id="app" ref={bottomRef}>
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
                scrollToBottom(bottomRef, true);
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

                scrollToBottom(bottomRef, true);
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
                scrollToBottom(bottomRef, true);
                return;
              }
              setParsedJson(
                formatJSON(
                  JSON.parse(sessionStorage.getItem("rule-data")),
                  false
                )
              );

              scrollToBottom(bottomRef, true);
            }}
          >
            Format
          </button>
        </div>
        {new URL(window.location.href).searchParams.get("rule") === null ||
        new URL(window.location.href).searchParams.get("data") === null ? (
          <BookmarkMenu />
        ) : (
          <></>
        )}
      </div>

      <div id="result">
        <Result jsonData={parsedJson} />
      </div>
    </div>
  );
};
