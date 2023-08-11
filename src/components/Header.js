import React, { useEffect, useRef } from "react";
import Typed from "typed.js";
import { toggleBookmarksBlock } from "./bookmarks/bookmarksHelper";
import "./assets/styles/header.css";

export const Header = () => {
  const typeRef1 = useRef(null);

  useEffect(() => {
    const hasAnimationPlayed = sessionStorage.getItem("animationPlayed");

    if (!hasAnimationPlayed) {
      const typed_1 = new Typed(typeRef1.current, {
        strings: ["easier", "better", "faster"],
        typeSpeed: 50,
        backSpeed: 20,
        cursorChar: "",
      });

      return () => {
        typed_1.destroy();
      };
    }
  }, []);

  return (
    <header className="header">
      <span
        className="hide-tip show-tip invisible"
        onClick={toggleBookmarksBlock}
      >
        <p className="show-bookmarks">Show</p>
      </span>
      <div>
        <div>
          <span className="auto-type">Json-logic validator</span>
        </div>
        <div className="sub-title">
          <span className="auto-type subtext">Validate your code</span>
          <span ref={typeRef1} className="auto-type subtext colored"></span>
        </div>
      </div>
    </header>
  );
};
