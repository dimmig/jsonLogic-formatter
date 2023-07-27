import React, { useEffect, useRef, useState } from "react";
import { areInputsFilled, encodeUrl, scrollToBottom } from "./hepler";
import { AiOutlineMenu } from "react-icons/ai";
import { ImBin } from "react-icons/im";
import "./styles/inputs.css";
import "./styles/bookmark.css";

export const BookmarkMenu = () => {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

  const listRef = useRef(null);
  const menuRef = useRef(null);
  const errorRef = useRef(null);
  const [stateBookmarks, setStateBookmarks] = useState(bookmarks || []);
  const [bookmarkName, setBookmarkName] = useState(null);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(stateBookmarks));
  }, [stateBookmarks]);

  function addBookmark() {
    const rule = document.getElementById("rule-textarea");
    const data = document.getElementById("data-textarea");

    if (areInputsFilled()) {
      if (isDublicate(stateBookmarks, bookmarkName)) {
        return document
          .getElementById("name-input")
          .classList.add("invalid-input");
      }

      if (document.getElementById("bookmark-error")) {
        document.getElementById("bookmark-error").classList.add("invisible");
      }

      document.getElementById("bookmark-button").classList.remove("invisible");
      document.getElementById("name-input").classList.add("invisible");
      document.getElementById("name-input").classList.remove("invalid-input");
      document.getElementById("menu-circle").classList.add("active");

      const link = encodeUrl(rule.value, data.value, bookmarkName);
      const updatedBookmarks = [{ [bookmarkName]: link }, ...stateBookmarks];
      setStateBookmarks(updatedBookmarks);
    }
  }

  function deleteBookmark(id) {
    if (stateBookmarks.length === 1) {
      setStateBookmarks([]);
      document.getElementById("list").classList.add("invisible");
      return document.getElementById("menu-circle").classList.remove("active");
    }
    const result = stateBookmarks.filter((el) => Object.keys(el)[0] !== id);
    setStateBookmarks(result);
  }

  function isDublicate(bookmarks, item) {
    for (const bookmark of bookmarks) {
      if (Object.keys(bookmark)[0] === item) {
        return true;
      }
    }
    return false;
  }

  function showListComponent(list) {
    if (list === null || stateBookmarks.length === 0) {
      return false;
    }
    list.classList.toggle("invisible");
    return true;
  }

  function swithActiveMenuStatus(list) {
    const result = document.getElementById("result-area");
    const menuCircle = document.getElementById("menu-circle");

    if (result.classList.contains("invisible")) {
      if (!list.classList.contains("invisible")) {
        menuCircle.classList.add("active");
        scrollToBottom(listRef, false);
      } else {
        menuCircle.classList.remove("active");
        scrollToBottom(menuRef, false);
      }
    } else if (!result.classList.contains("invisible")) {
      if (!list.classList.contains("invisible")) {
        menuCircle.classList.add("active");
      } else {
        menuCircle.classList.remove("active");
      }
    }
  }

  function renderList() {
    if (document.getElementById("list") !== null) {
      if (stateBookmarks.length > 5) {
        document.getElementById("list").classList.add("scrollable");
      } else {
        document.getElementById("list").classList.remove("scrollable");
      }
    }

    return stateBookmarks.map((el) => {
      const name = Object.keys(el)[0];
      const link = Object.values(el)[0];

      if (name.length === 0) {
        return null;
      }
      return (
        <div className="li-block" key={name} title={name}>
          <a target="_blank" rel="noreferrer" href={link}>
            <li>{name}</li>
          </a>
          <ImBin className="bin-icon" onClick={() => deleteBookmark(name)} />
        </div>
      );
    });
  }

  return (
    <div className="bookmark-list" ref={menuRef}>
      <div className="bookmark-button">
        <div
          className="menu-circle"
          id="menu-circle"
          onClick={() => {
            const list = document.getElementById("list");
            if (!showListComponent(list)) {
              if (
                document
                  .getElementById("result-area")
                  .classList.contains("invisible") &&
                document
                  .getElementById("error-message")
                  .classList.contains("invisible")
              ) {
                scrollToBottom(errorRef, false);
              }
              return document
                .getElementById("bookmark-error")
                .classList.toggle("invisible");
            }
            swithActiveMenuStatus(list);
          }}
        >
          <AiOutlineMenu className="menu-icon" />
        </div>
        <div className="bookmark-input">
          <button
            className="default-button test-button bookmark-btn disabled"
            id="bookmark-button"
            onClick={() => {
              if (areInputsFilled()) {
                document
                  .getElementById("bookmark-button")
                  .classList.add("invisible");
                document
                  .getElementById("name-input")
                  .classList.toggle("invisible");
                document.getElementById("name-input").value = "";
              }
            }}
          >
            Add bookmark
          </button>
          <input
            className="name-input invisible"
            id="name-input"
            placeholder="Type and press Enter"
            value={bookmarkName !== null ? bookmarkName : ""}
            onChange={(e) => setBookmarkName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const list = document.getElementById("list");
                const result = document.getElementById("result-area");
                e.preventDefault();
                addBookmark();

                if (list.classList.contains("invisible")) {
                  list.classList.remove("invisible");

                  if (result.classList.contains("invisible")) {
                    scrollToBottom(listRef);
                  }
                }
              }
            }}
          />
        </div>
      </div>
      <div
        className="error bookmark-error invisible"
        id="bookmark-error"
        ref={errorRef}
      >
        <h2>No bookmarks</h2>
      </div>
      <ul className="list invisible" id="list" ref={listRef}>
        {renderList()}
      </ul>
    </div>
  );
};
