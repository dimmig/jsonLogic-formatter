import React from "react";
import { NOT_VALID_RULE } from "../logic/constants";
import "./assets/styles/inputs.css";

export const ErrorBlock = (props) => {
  return (
    <div className="error invisible" id="error-message">
      {props.jsonData === NOT_VALID_RULE ? (
        <h2>Not valid rule provided</h2>
      ) : (
        <h2>Not valid data provided</h2>
      )}
    </div>
  );
};
