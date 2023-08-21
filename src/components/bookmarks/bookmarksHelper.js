import { areInputsFilled, encodeUrl, isSaved } from "../hepler";

export const addBookmark = (stateBookmarks, bookmarkName, object) => {
  const rule = document.getElementById("rule-textarea");
  const data = document.getElementById("data-textarea");
  let expression = null;
  let sampleData = null;

  if (object) {
    expression = object.expression;
    sampleData = object.sample_data;
  }

  if (areInputsFilled() || expression !== null) {
    if (
      expression !== null &&
      isDublicate(stateBookmarks, bookmarkName) !== false
    ) {
      const index = isDublicate(stateBookmarks, bookmarkName);
      let link;
      sampleData && sampleData.length > 0
        ? (link = encodeUrl(
            JSON.parse(expression),
            JSON.parse(sampleData),
            bookmarkName,
            object.section,
            true
          ))
        : (link = encodeUrl(
            JSON.parse(expression),
            null,
            bookmarkName,
            object.section,
            true
          ));
      stateBookmarks.splice(index, 1, {
        [bookmarkName]: link,
      });

      return stateBookmarks;
    }

    if (
      isDublicate(stateBookmarks, bookmarkName) !== false ||
      bookmarkName.length === 0
    ) {
      document.getElementById("name-input").classList.add("invalid-input");
      document.getElementById("name-input").focus();
      return stateBookmarks;
    }

    let link;
    if (expression !== null) {
      sampleData && sampleData.length > 0
        ? (link = encodeUrl(
            JSON.parse(expression),
            JSON.parse(sampleData),
            bookmarkName,
            object.section,
            true
          ))
        : (link = encodeUrl(
            JSON.parse(expression),
            null,
            bookmarkName,
            object.section,
            true
          ));
      stateBookmarks.push({
        [bookmarkName]: link,
      });
      return stateBookmarks;
    }

    document.getElementById("button-file-input").classList.add("invisible");
    document.getElementById("name-input-wrapper").classList.add("invisible");
    document.getElementById("name-input").classList.remove("invalid-input");
    document.getElementById("list").classList.remove("invisible-list");

    link = encodeUrl(rule.value, JSON.parse(data.value), bookmarkName);

    return [
      {
        [bookmarkName]: link,
      },
      ...stateBookmarks,
    ];
  }
};

export const editBookmark = (id, stateBookmarks, editedName) => {
  let target = null;
  for (let i = 0; i < stateBookmarks.length; i++) {
    if (Object.keys(stateBookmarks[i])[0] === id) {
      target = stateBookmarks[i];
    }
  }

  if (target === null) {
    return [];
  }

  const index = stateBookmarks.indexOf(target);
  let result = [...stateBookmarks];
  const url = new URL(Object.values(target)[0]);
  url.searchParams.set("bookmarkName", editedName);

  if (url.searchParams.get("section")) {
    url.searchParams.delete("section");
  }

  const currentWindowUrl = new URL(window.location.href);
  if (
    currentWindowUrl.searchParams.get("bookmarkName") &&
    id === currentWindowUrl.searchParams.get("bookmarkName")
  ) {
    const href = new URL(window.location.href);
    href.searchParams.set("bookmarkName", editedName);
    window.location.replace(href);
  }

  if (document.getElementById("search-input").value.length > 0) {
    result = JSON.parse(localStorage.getItem("bookmarks-before-search")) || [];
    result.splice(index, 1, { [editedName]: url });
    localStorage.setItem("bookmarks-before-search", JSON.stringify(result));
    document.getElementById("search-input").value = "";
    return result;
  }

  result.splice(index, 1, { [editedName]: url });
  return result;
};

export const removeNameInput = () => {
  document.getElementById("name-input-wrapper").classList.add("invisible");
  document.getElementById("button-file-input").classList.remove("invisible");
};

export const clearAllBookmarks = (setSearchBookmarks, setStateBookmarks) => {
  if (window.confirm("Do you want to delete ALL the bookmars")) {
    localStorage.clear();
    setSearchBookmarks([]);
    setStateBookmarks([]);
  }
};

export const handleSearch = (e) => {
  const state = JSON.parse(localStorage.getItem("bookmarks-before-search"));

  if (!state || state.length === 0) {
    return [];
  }

  const text = e.target.value.trim().toLowerCase();
  if (!text) {
    return state;
  }

  return state.filter((bookmark) => {
    const keys = Object.keys(bookmark);
    for (let i = 0; i < keys.length; i++) {
      const name = String(keys[i]).toLowerCase();
      if (name.includes(text)) {
        return true;
      }
    }
    return false;
  });
};

export const deleteBookmark = (id, stateBookmarks) => {
  let result;
  if (
    !document.getElementById("search-input").classList.contains("invisible") // if search input is open
  ) {
    const storage =
      JSON.parse(localStorage.getItem("bookmarks-before-search")) || [];
    result = storage.filter((el) => Object.keys(el)[0] !== id);
    localStorage.setItem("bookmarks-before-search", JSON.stringify(result));
    document.getElementById("search-input").value = "";

    if (stateBookmarks.length === 1) {
      document.getElementById("list").classList.add("invisible-list");
      localStorage.clear();
      return [];
    }

    return result;
  }

  if (stateBookmarks.length === 1) {
    document.getElementById("list").classList.add("invisible-list");
    localStorage.clear();
    return [];
  }

  result = stateBookmarks.filter((el) => Object.keys(el)[0] !== id);
  document.getElementById("search-input").value = "";

  return result;
};

export const handleDataForExport = (bookmarks) => {
  const result = [];

  for (const bookmark of bookmarks) {
    const name = Object.keys(bookmark)[0];
    const link = Object.values(bookmark)[0];

    if (!name || !link) {
      return [];
    }

    try {
      const url = new URL(link);
      const expression = parseURLParameter(url, "rule");
      const sample_data = parseURLParameter(url, "data");
      const sectionParam = parseURLParameter(url, "section");
      const section = sectionParam ? JSON.parse(sectionParam) : "";
      const subpart =
        section.length === 0 ? name : name.substring(0, name.indexOf(section));

      result.push({
        subpart,
        section,
        expression,
        sample_data,
      });
    } catch (error) {
      result.push({
        subpart: "",
        section: "",
        expression: "",
        sample_data: "",
      });
    }
  }

  return result;
};

export const toggleAddingBookmark = () => {
  if (areInputsFilled() && isSaved()) {
    document.getElementById("name-input-wrapper").classList.remove("invisible");
    document.getElementById("name-input").classList.remove("invisible");
    document
      .getElementById("add-bookmark-cancel")
      .classList.remove("invisible");
    document.getElementById("button-file-input").classList.add("invisible");
    document.getElementById("name-input").value = "";
  }
};

export const onTimeoutEnd = () => {
  document.getElementById("name-input-wrapper").classList.add("invisible");
  document.getElementById("name-input").classList.add("invisible");
  document.getElementById("add-bookmark-cancel").classList.add("invisible");
  document.getElementById("button-file-input").classList.remove("invisible");
  document
    .getElementById("add-bookmark-button")
    .classList.remove("none-border");
  document.getElementById("add-bookmark-button").classList.add("bookmark-btn");
};

export const toggleBookmarksBlock = () => {
  const openKeyFrames = [
    { width: 0, opacity: 0 },
    { width: "30vw", opacity: 1 },
  ];
  const closeKeyFrames = [
    { width: "30vw", opacity: 1 },
    { width: 0, opacity: 0 },
  ];
  const bookmarks = document.getElementById("bookmarks-part");
  const resultBlock = document.getElementById("result");
  if (bookmarks.classList.contains("invisible")) {
    bookmarks.classList.remove("invisible");
    bookmarks.animate(openKeyFrames, { duration: 50 });
    resultBlock.classList.add("short-result-area");
    document
      .querySelectorAll(".textarea")
      .forEach((el) => el.classList.add("short-width-textarea"));
  } else {
    bookmarks.animate(closeKeyFrames, { duration: 50 });
    resultBlock.classList.remove("short-result-area");
    document
      .querySelectorAll(".textarea")
      .forEach((el) => el.classList.remove("short-width-textarea"));
    setTimeout(() => {
      bookmarks.classList.add("invisible");
    }, 50);
  }
};

export const resizeBookmarksPart = () => {
  const list = document.getElementById("list");
  const formsComponent = document.getElementById("forms");
  const label = document.getElementById("label");

  if (list && formsComponent) {
    const bookmarkHeight = formsComponent.clientHeight;
    if (label.classList.contains("disabled-file-input")) {
      list.style.height = `${bookmarkHeight - 400}px`;
    } else {
      list.style.height = `${bookmarkHeight - 300}px`;
    }
  }
};

function isDublicate(bookmarks, item) {
  for (let i = 0; i < bookmarks.length; i++) {
    if (Object.keys(bookmarks[i])[0] === item) {
      return bookmarks.indexOf(bookmarks[i]);
    }
  }
  return false;
}

function parseURLParameter(url, paramName) {
  const paramValue = url.searchParams.get(paramName);
  return paramValue ? atob(paramValue) : "";
}
