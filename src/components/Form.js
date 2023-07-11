import React, { useState } from "react";
import { formatJSON } from "../logic/formatter/formatter";
import { validate } from "../logic/validator";
import { Data } from "./inputs/Data";
import { Result } from "./inputs/Result";
import { Rule } from "./inputs/Rule";
import "./styles/form.css";

export const Forms = () => {
  const [parsedJson, setParsedJson] = useState(null);
  const [needToValidate, setNeedToValidate] = useState(false);

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
            setNeedToValidate(true);
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
            setNeedToValidate(false);
          }}
        >
          Format
        </button>
      </div>
      <div id="result">
        <Result jsonData={parsedJson} needToValidate={needToValidate} />
      </div>
    </div>
  );
};
