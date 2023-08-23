import React from "react";
import { toggleBookmarksBlock } from "./bookmarks/bookmarksHelper";
import { LuBraces } from "react-icons/lu";
import menuAnimation from "./assets/icons/menuAnimation.json";
import Lottie from "lottie-react";
import "./assets/styles/header.css";

export const Header = () => {
  return (
    <header className="header">
      <div onClick={toggleBookmarksBlock} className="menu-icon">
        <Lottie animationData={menuAnimation} loop={false} />
      </div>
      <div>
        <span className="auto-type">
          <LuBraces />
        </span>
      </div>
    </header>
  );
};
