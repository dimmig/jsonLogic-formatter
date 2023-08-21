import React from "react";
import { BsBookmarkFill } from "react-icons/bs";
import "../assets/styles/header.css";
import "../../index.css";

export const BookmarksHeader = () => {
  return (
    <header className="header bookmarks-header-block">
      <span className="auto-type bookmarks-header">
        <BsBookmarkFill />
      </span>
    </header>
  );
};
