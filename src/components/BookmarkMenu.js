import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import "./styles/inputs.css"
import "./styles/bookmark.css"

export const BookmarkMenu = () => {
  return (
    <div className="bookmark-list">
      <div className="bookmark-button">
        <div className="menu-circle" onClick={() => {
            document.getElementById("bookmark-list").classList.toggle("invisible")
        }}>
          <AiOutlineMenu className="menu-icon" />
        </div>
        <button className="default-button test-button">Add bookmark</button>
      </div>
      <ul className="list invisible" id="bookmark-list">
        <li>Hello</li>
      </ul>
    </div>
  );
};
