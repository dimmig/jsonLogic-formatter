import React, { useMemo, useState } from "react";
import { AiOutlineCopy, AiOutlineCheckCircle } from "react-icons/ai";
import { NOT_VALID_DATA, NOT_VALID_RULE } from "../../logic/constants";
import { addFocusEvent, addHoverEvent, copy } from "./subcomponentsHelper";
import "../assets/styles/inputs.css";

export const Result = (props) => {
  const [isCopied, setIsCopied] = useState(false);

  useMemo(() => {
    if (
      props.jsonData &&
      props.jsonData !== NOT_VALID_RULE &&
      props.jsonData !== NOT_VALID_DATA
    ) {
      const resultArea = document.getElementById("result-area");
      const copyButton = document.getElementById("copy-button");

      if (resultArea !== null) {
        const p = resultArea.children[0];
        p.innerHTML = `<pre><code>${props.jsonData}</code></pre>`;
      }
      resultArea.classList.remove("invisible");
      copyButton.classList.remove("invisible");
      
      const varData = document.querySelectorAll("#var-data");
      if (varData !== null) {
        window.innerWidth > 1023
          ? addHoverEvent(varData)
          : addFocusEvent(varData);
      }
    }
  }, [props.jsonData]);

  return (
    <div>
      <div className="textarea-block">
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
          <p className="result-textarea full-width-textarea" id="result-p"></p>
        </div>
      </div>
    </div>
  );
};
