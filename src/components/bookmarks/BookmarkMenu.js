import React, { useEffect, useRef, useState } from "react";
import { ImBin } from "react-icons/im";
import { BiSolidEditAlt } from "react-icons/bi";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { MdCancel } from "react-icons/md";
import { LiaSearchSolid } from "react-icons/lia";
import {
  addBookmark,
  deleteBookmark,
  editBookmark,
  handleDataForExport,
  handleSearch,
  removeNameInput,
  showEditInput,
  showSearchInput,
  toggleAddingBookmark,
} from "./bookmarksHelper";
import { FileInput } from "../subcomponents/FileInput";
import "../styles/inputs.css";
import "../styles/bookmark.css";
import "../styles/form.css";
import { ExportButton } from "../subcomponents/ExportButton";
import { useDispatch, useSelector } from "react-redux";
import { addItem, deleteItem, editItem } from "../../app/storeSlice";

export const BookmarkMenu = () => {
  const dispatch = useDispatch();

  const listRef = useRef(null);
  const errorRef = useRef(null);
  const cancelInput = useRef(null);
  const inputRef = useRef();
  const [searchBookmarks, setSearchBookmarks] = useState([]);
  const [bookmarkName, setBookmarkName] = useState("");
  const [editedName, setEditedName] = useState(null);
  const [completed, setCompleted] = useState(false);

  const stateBookmarks = useSelector((state) => state.bookmarks.value);

  useEffect(() => {
    localStorage.setItem("bookmarks", JSON.stringify(stateBookmarks));
    if (stateBookmarks.length > 0) {
      document.getElementById("clear-all-button").classList.remove("disabled");
      document.getElementById("export-button").classList.remove("disabled");
      if (
        document.getElementById("search-input").classList.contains("invisible")
      ) {
        document
          .getElementById("bookmarks-length")
          .classList.remove("invisible");
      }
    } else {
      document.getElementById("clear-all-button").classList.add("disabled");
      document.getElementById("export-button").classList.add("disabled");
      document.getElementById("bookmarks-length").classList.add("invisible");
    }
  }, [searchBookmarks, stateBookmarks]);

  function renderList() {
    if (stateBookmarks === null) {
      return;
    }
    if (document.getElementById("list") !== null) {
      if (
        document.getElementById("list").clientWidth >
          window.screen.width * 0.6 &&
        window.screen.width > 767
      ) {
        document.getElementById("list").classList.add("scrollable");
      } else if (
        document.getElementById("list").clientWidth >
          window.screen.width * 0.6 &&
        window.screen.width > 767
      ) {
        document.getElementById("list").classList.remove("scrollable");
      } else if (stateBookmarks.length > 2 && window.screen.width < 767) {
        document.getElementById("list").classList.add("mobile-scrollable");
      } else {
        document.getElementById("list").classList.remove("mobile-scrollable");
      }
    }
    let acceptedBookmarks = stateBookmarks;
    console.log("SEAECH", searchBookmarks);
    if (document.getElementById("search-input") !== null) {
      acceptedBookmarks = document
        .getElementById("search-input")
        .classList.contains("invisible")
        ? stateBookmarks
        : searchBookmarks;
    }
    
    return acceptedBookmarks.map((el) => {
      const name = Object.keys(el)[0];
      const link = Object.values(el)[0];

      const inputId = `input_${name}`;
      const cancelId = `cancel_${name}`;
      const editButtonId = `editButton_${name}`;

      if (name.length === 0) {
        return null;
      }
      return (
        <div className="li-block" key={name} ref={cancelInput}>
          <div className="item" id={name}>
            <a target="_blank" rel="noreferrer" href={link}>
              <li title={name}>{name}</li>
            </a>
            <ImBin
              className="icon"
              onClick={() => {
                dispatch(deleteItem(JSON.stringify({ name, stateBookmarks })));
                setSearchBookmarks(deleteBookmark(name, stateBookmarks));
              }}
            />
            <BiSolidEditAlt
              className="icon"
              onClick={() => showEditInput(name, true)}
            />
          </div>
          <MdCancel
            className="icon cancel-icon invisible"
            id={cancelId}
            onClick={() => {
              showEditInput(name, false);
            }}
          />
          <input
            ref={inputRef}
            className="name-input edit-input invisible"
            id={inputId}
            placeholder="Type your new name"
            onChange={(e) => setEditedName(e.target.value)}
            onKeyDown={(e) => {
              editValue(e, inputId, name);
            }}
          />
          <button
            className="invisible bookmark-btn edit-button"
            id={editButtonId}
            onClick={() => {
              const event = new KeyboardEvent("keydown", {
                key: "Enter",
              });
              editValue(event, inputId, name);
            }}
          >
            Edit
          </button>
        </div>
      );
    });
  }

  function editValue(e, inputId, name) {
    if (e.key === "Enter") {
      const duplicate = stateBookmarks.filter(
        (el) => Object.keys(el)[0] === editedName
      );
      if (duplicate.length !== 0 || editedName === null) {
        document.getElementById(inputId).classList.add("invalid-input");
        document.getElementById(inputId).focus();
        return;
      }
      document.getElementById(inputId).classList.remove("invalid-input");
      const data = JSON.stringify({ name, stateBookmarks, editedName });
      dispatch(editItem(data));
      setSearchBookmarks(editBookmark(name, stateBookmarks, editedName));
    }
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
        .classList.add("completed-button");

      dispatch(addItem(JSON.stringify(resultedBookmarks)));
      return true;
    }
    return false;
  }

  function handleFileUpload(file) {
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const fileContent = JSON.parse(event.target.result);
        const stateCopy = [...stateBookmarks];
        for (const object of fileContent) {
          const bookmarkName = object.subpart + object.section;
          let resultedBookmarks;
          resultedBookmarks = addBookmark(stateCopy, bookmarkName, object);

          dispatch(addItem(JSON.stringify(resultedBookmarks)));
        }
        setCompleted(true);

        document
          .getElementById("add-bookmark-button")
          .classList.remove("invisible");
        document
          .getElementById("add-bookmark-button")
          .classList.add("completed-button");
        document.getElementById("file-input").classList.add("invisible");
        document.getElementById("bookmark-button").classList.add("invisible");
        document.getElementById("search-icon").classList.add("invisible");
        document.getElementById("export-button").classList.add("invisible");
        document.getElementById("clear-all-button").classList.add("invisible");

        setTimeout(() => {
          setCompleted(false);
          document
            .getElementById("add-bookmark-button")
            .classList.remove("completed-button");
          document.getElementById("file-input").classList.remove("invisible");
          document
            .getElementById("bookmark-button")
            .classList.remove("invisible");
          document
            .getElementById("add-bookmark-button")
            .classList.add("invisible");
          document.getElementById("search-icon").classList.remove("invisible");
          document
            .getElementById("export-button")
            .classList.remove("invisible");
          document
            .getElementById("export-button")
            .classList.remove("invisible", "disabled");
          document
            .getElementById("clear-all-button")
            .classList.remove("invisible", "disabled");
        }, 1000);

        return true;
      };
      reader.readAsText(file);
    }
  }

  return (
    <div className="bookmark-wrapper">
      <div className="bookmark-button">
        <div className="bookmark-input">
          <div className="bookmark-search">
            <div className="button-file-input">
              <div className="button-search-wrapper">
                <button
                  className="bookmark-btn disabled"
                  id="bookmark-button"
                  onClick={() => toggleAddingBookmark()}
                >
                  Add bookmark
                </button>
                <LiaSearchSolid
                  className="search-icon"
                  id="search-icon"
                  onClick={() =>
                    setSearchBookmarks(showSearchInput(true, stateBookmarks))
                  }
                />
              </div>
              <div className="import-export-block" id="import-export-block">
                <FileInput onChange={handleFileUpload} />
                <div className="impot-export-row">
                  <button
                    className="bookmark-btn reset-all-button"
                    id="clear-all-button"
                    onClick={() => {
                      localStorage.clear();
                      setSearchBookmarks([]);
                      dispatch(addItem("[]"));
                    }}
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
          </div>
          <div className="name-input-wrapper">
            <MdCancel
              className="icon cancel-icon search-cancel invisible"
              id="search-cancel"
              onClick={() => dispatch(addItem(showSearchInput(false)))}
            />
            <input
              className="name-input search-input invisible"
              placeholder="Search"
              onChange={(e) =>
                setSearchBookmarks(handleSearch(e, stateBookmarks))
              }
              id="search-input"
            />
            <MdCancel
              className="icon cancel-icon search-cancel invisible"
              id="add-bookmark-cancel"
              onClick={removeNameInput}
            />
            <input
              className="name-input invisible"
              id="name-input"
              placeholder="Type your name"
              value={bookmarkName !== null ? bookmarkName : ""}
              onChange={(e) => setBookmarkName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (validateAndAddBookmark(e)) {
                    document
                      .getElementById("bookmark-button")
                      .classList.add("invisible");
                    document
                      .getElementById("add-bookmark-cancel")
                      .classList.add("invisible");

                    setTimeout(() => {
                      document
                        .getElementById("add-bookmark-button")
                        .classList.remove("completed-button");
                      document
                        .getElementById("add-bookmark-button")
                        .classList.add("invisible");
                      setCompleted(false);
                      document
                        .getElementById("bookmark-button")
                        .classList.remove("invisible");
                      document
                        .getElementById("file-input")
                        .classList.remove("invisible");
                      document
                        .getElementById("search-icon")
                        .classList.remove("invisible");
                      document
                        .getElementById("export-button")
                        .classList.remove("invisible");
                      document
                        .getElementById("clear-all-button")
                        .classList.remove("invisible");
                    }, 1000);
                  }
                }
              }}
            />

            <button
              className="bookmark-btn invisible"
              id="add-bookmark-button"
              onClick={(e) => {
                if (validateAndAddBookmark(e)) {
                  document
                    .getElementById("add-bookmark-cancel")
                    .classList.add("invisible");
                  setTimeout(() => {
                    setCompleted(false);
                    if (document.getElementById("completed-icon"))
                      document
                        .getElementById("add-bookmark-button")
                        .classList.remove("completed-button");
                    document
                      .getElementById("add-bookmark-button")
                      .classList.add("invisible");
                    document
                      .getElementById("bookmark-button")
                      .classList.remove("invisible");
                    document
                      .getElementById("file-input")
                      .classList.remove("invisible");
                    document
                      .getElementById("search-icon")
                      .classList.remove("invisible");
                    document
                      .getElementById("export-button")
                      .classList.remove("invisible");
                    document
                      .getElementById("clear-all-button")
                      .classList.remove("invisible");
                  }, 1000);
                }
              }}
            >
              {completed ? (
                <span className="completed-span">
                  Added
                  <AiOutlineCheckCircle
                    style={{ width: "2rem", height: "2rem" }}
                    id="completed-icon"
                  />
                </span>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </div>

        <div
          className="error bookmark-error invisible"
          id="bookmark-error"
          ref={errorRef}
        >
          <h2>No bookmarks</h2>
        </div>
      </div>
      <div className="bookmark-block">
        <div
          className="error bookmark-error invisible"
          id="bookmark-error"
          ref={errorRef}
        >
          <h2>No bookmarks</h2>
        </div>

        <div className="list-length-block">
          <span
            className="length-bookmarks-block invisible"
            id="bookmarks-length"
          >
            <p className="bookmarks-length-text">Bookmarks:</p>
            <p className="bookmarks-length">{stateBookmarks.length}</p>
          </span>
          <ul className="list scrollable" id="list" ref={listRef}>
            {renderList()}
          </ul>
        </div>
      </div>
    </div>
  );
};
