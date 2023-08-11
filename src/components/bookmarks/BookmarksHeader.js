import React from "react";
import "../assets/styles/header.css";
import "../../index.css";
import { toggleBookmarksBlock } from "./bookmarksHelper";

export const BookmarksHeader = () => {
  return (
    <header className="header bookmarks-header-block">
      <span className="auto-type bookmarks-header">Bookmarks</span>
      <span className="hide-tip" onClick={toggleBookmarksBlock}>
        <p className="hide-bookmark">Hide</p>
      </span>
    </header>
  );
};
