import React from "react";
import { handleSearch } from "./bookmarksHelper";

export const BookmarksList = ({
  searchInput,
  stateBookmarks,
  inputDisabled,
  searchBookmarks,
  listRef,
  setSearchBookmarks,
  renderList
}) => {
  return (
    <div className="list-length-block" id="list-lenght-block">
      <div className="search-bookmarks">
        <input
          className="name-input search-input"
          placeholder="Search"
          onChange={(e) => setSearchBookmarks(handleSearch(e, stateBookmarks))}
          ref={searchInput}
          disabled={inputDisabled}
          id="search-input"
        />
        <span className="length-bookmarks-block" id="bookmarks-length">
          <p className="bookmarks-length-text">Bookmarks:</p>
          <p className="bookmarks-length">
            {searchBookmarks.length > 0 ? (
              searchBookmarks.length
            ) : (
              <>
                {document.activeElement === searchInput.current
                  ? 0
                  : stateBookmarks.length}
              </>
            )}
          </p>
        </span>
      </div>
      <ul className="list scrollable" id="list" ref={listRef}>
        {renderList()}
      </ul>
    </div>
  );
};
