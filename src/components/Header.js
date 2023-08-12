import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import { toggleBookmarksBlock } from "./bookmarks/bookmarksHelper";
import "./assets/styles/header.css";

export const Header = () => {
  const typeRef = useRef(null);

  useEffect(() => {
    const typed_1 = new Typed(typeRef.current, {
      strings: ["easier", "better", "faster"],
      typeSpeed: 50,
      backSpeed: 20,
      cursorChar: "",
    });

    return () => {
      typed_1.destroy();
    };
  }, []);

  return (
    <header className="header">
      <span
        className="hide-tip show-tip invisible"
        onClick={toggleBookmarksBlock}
        title="Show"
      ></span>
      <div>
        <div>
          <span className="auto-type">Json-logic validator</span>
        </div>
        <div className="sub-title">
          <span className="auto-type subtext">Validate your code</span>
          <span ref={typeRef} className="auto-type subtext colored"></span>
        </div>
      </div>
    </header>
  );
};
