import React, { useMemo, useRef, useState } from "react";
import { AiOutlineCopy, AiOutlineCheckCircle } from "react-icons/ai";
import { NOT_VALID_DATA, NOT_VALID_RULE } from "../../logic/constants";
import { scrollToBottom } from "../hepler";
import { addFocusEvent, addHoverEvent, copy } from "./subcomponentsHelper";
import "../assets/styles/inputs.css";

export const Result = (props) => {
  const [isCopied, setIsCopied] = useState(false);
  const resultRef = useRef(null);

  useMemo(() => {
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
      document.getElementById("error-message").classList.add("invisible");
      document.getElementById("copy-button").classList.remove("invisible");
      resultArea.classList.remove("invisible");

      const varData = document.querySelectorAll("#var-data");
      if (varData !== null) {
        window.innerWidth > 1023
          ? addHoverEvent(varData)
          : addFocusEvent(varData);
      }

      scrollToBottom(resultRef);
    } else if (document.getElementById("error-message") !== null) {
      document.getElementById("error-message").classList.remove("invisible");
      document.getElementById("result-area").classList.add("invisible");
      document.getElementById("copy-button").classList.add("invisible");

      const bookmarksList = document.getElementById("list");
      if (
        bookmarksList &&
        !bookmarksList.classList.contains("invisible-list")
      ) {
        bookmarksList.classList.add("max-list-height");
      }
      scrollToBottom(resultRef);
    }
  }, [props.jsonData]);

  return (
    <div>
      <div className="textarea-block" ref={resultRef}>
        <button
          id="copy-button"
          className="copy-button invisible"
          onClick={() => copy("result-p", setIsCopied)}
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
    </div>
  );
};
