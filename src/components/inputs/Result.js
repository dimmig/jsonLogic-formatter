import React, { useState } from "react";
import { AiOutlineCopy, AiOutlineCheckCircle } from "react-icons/ai";
import { NOT_VALID_DATA, NOT_VALID_RULE } from "../../logic/constants";
import "../styles/inputs.css";

export const Result = (props) => {
  const [isCopied, setIsCopied] = useState(false);

  function addHoverEvent(data) {
    data.forEach((el) => {
      el.addEventListener("mouseover", () => {
        const data = JSON.parse(JSON.parse(sessionStorage.getItem("data")));
        const varName = el.textContent.split('"')[1];
        if (data !== null) {
          const tooltip = findTooltip(el);
          tooltip.classList.add("active-tooltip");
          tooltip.textContent = data[varName];
        }
      });

      el.addEventListener("mouseout", () => {
        const tooltip = findTooltip(el);
        tooltip.classList.remove("active-tooltip");
      });
    });
  }

  function addFocusEvent(data) {
    data.forEach((el) => {
      el.addEventListener("focus", () => {
        const data = JSON.parse(JSON.parse(sessionStorage.getItem("data")));
        const varName = el.textContent.split('"')[1];
        if (data !== null) {
          const tooltip = findTooltip(el);
          tooltip.classList.add("active-tooltip");
          tooltip.textContent = data[varName];
        }
      });
      el.addEventListener("focusout", () => {
        const tooltip = findTooltip(el);
        tooltip.classList.remove("active-tooltip");
      });
    });
  }

  function findTooltip(el) {
    if (!el) {
      return null;
    }
    const closestSpan = el.children[0];
    if (closestSpan.id !== "tooltip") {
      return findTooltip(closestSpan);
    } else {
      return closestSpan;
    }
  }

  if (
    props.jsonData &&
    props.jsonData !== NOT_VALID_RULE &&
    props.jsonData !== NOT_VALID_DATA
  ) {
    const resultArea = document.getElementById("result-area");

    if (resultArea !== null) {
      const p = resultArea.children[0];
      p.innerHTML = `<pre><code>${props.jsonData}</code></pre>`;
    }

    const errorMessage = document.getElementById("error-message");
    errorMessage.classList.add("invisible");

    resultArea.classList.remove("invisible");

    const copyButton = document.getElementById("copy-button");
    copyButton.classList.remove("invisible");

    const varData = document.querySelectorAll("#var-data");
    if (varData !== null) {
      window.innerWidth > 1023
        ? addHoverEvent(varData)
        : addFocusEvent(varData);
    }
  } else if (document.getElementById("error-message") !== null) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.classList.remove("invisible");

    const resultArea = document.getElementById("result-area");
    resultArea.classList.add("invisible");

    const copyButton = document.getElementById("copy-button");
    copyButton.classList.add("invisible");
  }

  function copy(id) {
    const range = document.createRange();

    range.selectNode(document.getElementById(id));
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
    document.execCommand("copy");
    window.getSelection().removeAllRanges();

    const copyButton = document.getElementById("copy-button");
    copyButton.classList.add("completed");

    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
      copyButton.classList.remove("completed");
    }, 2000);
  }

  return (
    <div>
      <div className="textarea-block">
        <button
          id="copy-button"
          className="copy-button invisible"
          onClick={() => copy("result-p")}
        >
          {isCopied ? (
            <span>
              <AiOutlineCheckCircle />
              Copied
            </span>
          ) : (
            <span>
              <AiOutlineCopy />
              Copy
            </span>
          )}
        </button>
        <div className="invisible" spellCheck="false" id="result-area">
          <p className="result-textarea" id="result-p"></p>
        </div>
      </div>
      <div className="error invisible" id="error-message">
        {props.jsonData === NOT_VALID_RULE ? (
          <h2>Not valid rule provided</h2>
        ) : (
          <h2>Not valid data provided</h2>
        )}
      </div>
    </div>
  );
};
