import React, { useEffect, useRef, useState } from "react";
import { ImBin } from "react-icons/im";
import completedAnimation from "../assets/icons/completedAanimation.json";
import { MdCancel } from "react-icons/md";
import {
  addBookmark,
  clearAllBookmarks,
  deleteBookmark,
  editBookmark,
  handleDataForExport,
  onTimeoutEnd,
  removeNameInput,
  resizeBookmarksPart,
  toggleAddingBookmark,
} from "./bookmarksHelper";
import { FileInput } from "../subcomponents/FileInput";
import { ExportButton } from "../subcomponents/ExportButton";
import "../assets/styles/inputs.css";
import "../assets/styles/bookmark.css";
import "../assets/styles/form.css";
import Lottie from "lottie-react";
import { BookmarksList } from "./BookmarksList";

export const BookmarkMenu = ({ setHeadingBookmarkName }) => {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks"));

  const listRef = useRef(null);
  const wrapperRef = useRef(null);
  const cancelInput = useRef(null);
  const searchInput = useRef(null);
  const [stateBookmarks, setStateBookmarks] = useState(bookmarks || []);
  const [searchBookmarks, setSearchBookmarks] = useState([]);
  const [bookmarkName, setBookmarkName] = useState(null);
  const [editedName, setEditedName] = useState(null);
  const [completed, setCompleted] = useState(false);
  const [inputDisabled, setInputDisabled] = useState(false);

  useEffect(() => {
    localStorage.setItem(
      "bookmarks-before-search",
      JSON.stringify(stateBookmarks)
    );
  }, [stateBookmarks]);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(stateBookmarks));
    if (stateBookmarks.length > 0) {
      setInputDisabled(false);
      document.getElementById("clear-all-button").classList.remove("disabled");
      document.getElementById("export-button").classList.remove("disabled");

      resizeBookmarksPart();
    } else {
      setInputDisabled(true);
      document.getElementById("clear-all-button").classList.add("disabled");
      document.getElementById("export-button").classList.add("disabled");
    }
  }, [stateBookmarks, searchBookmarks]);

  function renderList() {
    if (stateBookmarks === null) {
      return;
    }

    let acceptedBookmarks = stateBookmarks;
    if (searchInput.current && searchInput.current.value.trim().length > 0) {
      acceptedBookmarks = searchBookmarks;
      searchInput.current.classList.add("empty-background");
    }

    if (searchInput.current && searchInput.current.value.trim().length === 0) {
      searchInput.current.classList.remove("empty-background");
    }

    return acceptedBookmarks.map((el) => {
      const name = Object.keys(el)[0];
      const link = Object.values(el)[0];

      const inputId = `input_${name}`;

      if (name.length === 0) {
        return null;
      }

      return (
        <div className="li-block" key={name} ref={cancelInput} id={name}>
          <li>
            <div className="input-open-block">
              <input
                title={name}
                defaultValue={name}
                className="bookmark-name-input"
                id={inputId}
                onChange={(e) => setEditedName(e.target.value)}
                onBlur={() => {
                  editValue(inputId, name, setHeadingBookmarkName);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    editValue(inputId, name, setHeadingBookmarkName);
                  }
                }}
              />
              <div className="open-remove-block">
                <a href={link}>
                  <button className="open-link-btn bookmark-btn">Open</button>
                </a>
                <ImBin
                  className="icon"
                  onClick={() => {
                    setStateBookmarks(deleteBookmark(name, stateBookmarks));
                    setSearchBookmarks(deleteBookmark(name, stateBookmarks));
                  }}
                />
              </div>
            </div>
          </li>
        </div>
      );
    });
  }

  function editValue(inputId, name, setHeadingBookmarkName) {
    if (editedName === null) {
      return;
    }

    const duplicate = stateBookmarks.filter(
      (el) => Object.keys(el)[0] === editedName
    );
    if ((duplicate.length !== 0 && duplicate !== name) || editedName === "") {
      document.getElementById(inputId).value = name;
      return;
    }
    setStateBookmarks(
      editBookmark(name, stateBookmarks, editedName, setHeadingBookmarkName)
    );
    setSearchBookmarks(
      editBookmark(name, stateBookmarks, editedName, setHeadingBookmarkName)
    );
  }

  function validateAndAddBookmark(e) {
    if (document.getElementById("name-input").value.length === 0) {
      document.getElementById("name-input").classList.add("invalid-input");
      document.getElementById("name-input").focus();
      return;
    }
    e.preventDefault();
    const resultedBookmarks = addBookmark(stateBookmarks, bookmarkName);
    if (resultedBookmarks !== stateBookmarks) {
      setCompleted(true);
      document
        .getElementById("add-bookmark-button")
        .classList.remove("bookmark-btn");
      document
        .getElementById("add-bookmark-button")
        .classList.add("none-border");
      document
        .getElementById("name-input-wrapper")
        .classList.remove("invisible");
      document.getElementById("name-input").classList.add("invisible");
      document.getElementById("add-bookmark-cancel").classList.add("invisible");

      setStateBookmarks(resultedBookmarks);
      setSearchBookmarks(resultedBookmarks);
      return true;
    }
    return false;
  }

  return (
    <div className="bookmark-wrapper" ref={wrapperRef} id="bookmark-wrapper">
      <div className="bookmark-button">
        <div className="button-file-input" id="button-file-input">
          <button
            className="bookmark-btn disabled"
            id="bookmark-button"
            onClick={toggleAddingBookmark}
          >
            Add bookmark
          </button>

          <div className="import-export-block" id="import-export-block">
            <FileInput
              setCompleted={setCompleted}
              setStateBookmarks={setStateBookmarks}
              setSearchBookmarks={setSearchBookmarks}
              stateBookmarks={stateBookmarks}
              setInputDisabled={setInputDisabled}
            />
            <div className="import-export-row">
              <button
                className="bookmark-btn reset-all-button"
                id="clear-all-button"
                onClick={() =>
                  clearAllBookmarks(setSearchBookmarks, setStateBookmarks)
                }
              >
                Clear all
              </button>
              <ExportButton
                data={handleDataForExport(stateBookmarks)}
                fileName={new Date().getTime()}
              />
            </div>
          </div>
        </div>
        <div className="name-input-wrapper invisible" id="name-input-wrapper">
          <MdCancel
            className="icon cancel-icon search-cancel"
            id="add-bookmark-cancel"
            onClick={removeNameInput}
          />
          <input
            className="name-input"
            id="name-input"
            placeholder="Type your name"
            value={bookmarkName !== null ? bookmarkName : ""}
            onChange={(e) => setBookmarkName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                if (validateAndAddBookmark(e)) {
                  setTimeout(() => {
                    setCompleted(false);
                    onTimeoutEnd();
                  }, 1000);
                }
              }
            }}
          />

          <button
            className="bookmark-btn"
            id="add-bookmark-button"
            onClick={(e) => {
              if (validateAndAddBookmark(e)) {
                setTimeout(() => {
                  setCompleted(false);
                  onTimeoutEnd();
                }, 1000);
              }
            }}
          >
            {completed ? (
              <Lottie animationData={completedAnimation} loop={false} />
            ) : (
              "Add"
            )}
          </button>
        </div>
      </div>
      <div className="bookmark-block">
        {stateBookmarks.length !== 0 ? (
          <BookmarksList
            searchInput={searchInput}
            stateBookmarks={stateBookmarks}
            inputDisabled={inputDisabled}
            searchBookmarks={searchBookmarks}
            listRef={listRef}
            setSearchBookmarks={setSearchBookmarks}
            renderList={renderList}
          />
        ) : (
          <ul className="invisible-list" id="list" ref={listRef}></ul>
        )}
      </div>
    </div>
  );
};
