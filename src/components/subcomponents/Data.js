import React, { useState } from "react";
import { isValid } from "../hepler";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { renderEncodingUrl } from "./subcomponentsHelper";
import "../assets/styles/inputs.css";
import "../assets/styles/form.css";
import "../assets/styles/bookmark.css";

export const Data = () => {
  const [copied, setCopied] = useState(null);

  return (
    <div>
      <div className="rule-button-block">
        <h2 className="heading">Data</h2>
        <button
          className="default-button url-button disabled"
          id="url-button"
          onClick={() => renderEncodingUrl(setCopied)}
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
        onChange={(e) => isValid("data", e.target.value)}
      />
    </div>
  );
};
