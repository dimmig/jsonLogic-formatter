import { areInputsFilled, encodeUrl } from "../hepler";

export function showListComponent(list, state) {
  if (list === null || state.length === 0) {
    return false;
  }
  list.classList.toggle("invisible");
  return true;
}

export function addBookmark(stateBookmarks, bookmarkName, object) {
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
    if (document.getElementById("bookmark-error")) {
      document.getElementById("bookmark-error").classList.add("invisible");
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

    document.getElementById("clear-all-button").classList.add("invisible");
    document.getElementById("export-button").classList.add("invisible");
    document.getElementById("name-input").classList.add("invisible");
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
}

function isDublicate(bookmarks, item) {
  for (let i = 0; i < bookmarks.length; i++) {
    if (Object.keys(bookmarks[i])[0] === item) {
      return bookmarks.indexOf(bookmarks[i]);
    }
  }
  return false;
}

export function editBookmark(id, stateBookmarks, editedName) {
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

  if (id === document.title) {
    document.title = editedName;
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
}

export function removeNameInput() {
  document.getElementById("name-input").classList.add("invisible");
  document.getElementById("add-bookmark-button").classList.add("invisible");
  document.getElementById("add-bookmark-cancel").classList.add("invisible");
  document.getElementById("file-input").classList.remove("invisible");
  document.getElementById("bookmark-button").classList.remove("invisible");
  document.getElementById("export-button").classList.remove("invisible");
}

export function handleSearch(e) {
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
}

export function deleteBookmark(id, stateBookmarks) {
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
}

export function handleDataForExport(bookmarks) {
  if (!bookmarks || bookmarks.length === 0) {
    return;
  }
  const result = [];

  for (let i = 0; i < bookmarks.length; i++) {
    const name = Object.keys(bookmarks[i])[0];
    const link = Object.values(bookmarks[i])[0];

    if (!name || !link) {
      return [];
    }

    let expression;
    let sample_data;
    let subpart;

    try {
      new URL(link);
    } catch (_) {
      result.push({
        subpart: "",
        section: "",
        expression: "",
        sample_data: "",
      });
    }

    expression = atob(new URL(link).searchParams.get("rule"));
    if (!new URL(link).searchParams.get("rule")) {
      expression = "";
    }

    sample_data = atob(new URL(link).searchParams.get("data"));
    if (!new URL(link).searchParams.get("data")) {
      sample_data = "";
    }

    let section = new URL(link).searchParams.get("section");
    if (!section) {
      section = "";
    } else {
      section = JSON.parse(atob(section));
    }

    if (section.length === 0) {
      subpart = name;
    } else {
      const index = name.indexOf(section);
      subpart = name.substring(0, index);
    }

    result.push({
      subpart,
      section,
      expression,
      sample_data,
    });
  }
  return result;
}

export function toggleAddingBookmark() {
  if (areInputsFilled()) {
    document.getElementById("bookmark-button").classList.add("invisible");
    document.getElementById("name-input").classList.toggle("invisible");
    document
      .getElementById("add-bookmark-button")
      .classList.remove("invisible");
    document
      .getElementById("add-bookmark-cancel")
      .classList.remove("invisible");
    document.getElementById("file-input").classList.add("invisible");
    document.getElementById("export-button").classList.add("invisible");
    document.getElementById("clear-all-button").classList.add("invisible");

    document.getElementById("name-input").value = "";
  }
}

export function toggleBookmarksBlock() {
  document.getElementById("bookmarks-part").classList.toggle("invisible");
  document.getElementById("main-app").classList.toggle("full-screen");
  document
    .querySelectorAll(".textarea")
    .forEach((el) => el.classList.toggle("full-width-textarea"));
  document.querySelector(".show-tip").classList.toggle("invisible");
}
