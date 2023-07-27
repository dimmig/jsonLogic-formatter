import React, { useEffect, useRef, useState } from "react";
import { areInputsFilled, encodeUrl, scrollToBottom } from "./hepler";
import { AiOutlineMenu } from "react-icons/ai";
import { ImBin } from "react-icons/im";
import { BiSolidEditAlt } from "react-icons/bi";
import { MdCancel } from "react-icons/md";
import "./styles/inputs.css";
import "./styles/bookmark.css";

export const BookmarkMenu = () => {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

  const listRef = useRef(null);
  const menuRef = useRef(null);
  const errorRef = useRef(null);
  const cancelInput = useRef(null);
  const [stateBookmarks, setStateBookmarks] = useState(bookmarks || []);
  const [bookmarkName, setBookmarkName] = useState(null);
  const [editedName, setEditedName] = useState(null);

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

  function editBookmark(id) {
    const target = stateBookmarks.filter((el) => Object.keys(el)[0] === id);
    const index = stateBookmarks.indexOf(target[0]);
    const result = [...stateBookmarks];
    const obj = {};
    const url = Object.values(target[0])[0];
    url.searchParams.set("bookmarkName", editedName);
    obj[editedName] = url;
    result.splice(index, 1, obj);
    setStateBookmarks(result);
    showEditInput(id, false);
  }

  function showEditInput(id, needToShow) {
    if (needToShow) {
      document.getElementById(id).classList.add("invisible");
      document.getElementById(`cancel_${id}`).classList.remove("invisible");
      document.getElementById(`input_${id}`).classList.remove("invisible");
    } else {
      document.getElementById(id).classList.remove("invisible");
      document.getElementById(`cancel_${id}`).classList.add("invisible");
      document.getElementById(`input_${id}`).classList.add("invisible");
    }
    scrollToBottom(cancelInput, false);
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

      const inputId = `input_${name}`;
      const cancelId = `cancel_${name}`;

      if (name.length === 0) {
        return null;
      }
      return (
        <div className="li-block" key={name} ref={cancelInput}>
          <a target="_blank" rel="noreferrer" href={link}>
            <li id={name} title={name}>
              {name}
            </li>
          </a>
          <MdCancel
            className="icon invisible"
            id={cancelId}
            onClick={() => {
              document.getElementById(inputId).classList.add("invisible");
              document.getElementById(cancelId).classList.add("invisible");
              document.getElementById(name).classList.remove("invisible");
            }}
          />
          <input
            className="name-input edit-input invisible"
            id={inputId}
            placeholder="Type your new name"
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const duplicate = stateBookmarks.filter(
                  (el) => Object.keys(el)[0] === editedName
                );
                if (duplicate.length !== 0) {
                  return document
                    .getElementById(inputId)
                    .classList.add("invalid-input");
                }
                document
                  .getElementById(inputId)
                  .classList.remove("invalid-input");
                editBookmark(name);
              }
            }}
          />

          <ImBin className="icon" onClick={() => deleteBookmark(name)} />
          <BiSolidEditAlt
            className="icon"
            onClick={() => showEditInput(name, true)}
          />
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
                if (document.getElementById("name-input").value.length === 0) {
                  return document
                    .getElementById("name-input")
                    .classList.add("invalid-input");
                }

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
