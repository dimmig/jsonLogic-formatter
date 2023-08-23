import React, { useEffect, useState } from "react";
import { BookmarkMenu } from "./components/bookmarks/BookmarkMenu";
import { BookmarksHeader } from "./components/bookmarks/BookmarksHeader";
import { Forms } from "./components/Form";
import { Header } from "./components/Header";
import { Result } from "./components/subcomponents/Result";
import { ResultHeader } from "./components/subcomponents/ResultHeader";
import "./index.css";

function App() {
  const [parsedJson, setParsedJson] = useState(null);
  const [bookmarksClass, setBookmarksClass] = useState("");

  useEffect(() => {
    const isBookmarksActive = JSON.parse(
      localStorage.getItem("bookmarks-active")
    );
    if (!isBookmarksActive) {
      setBookmarksClass("invisible");
      return document
        .getElementById("result")
        .classList.remove("short-result-area");
    }

    document.querySelectorAll(".textarea").forEach((el) => {
      if (!document.getElementById("result").classList.contains("invisible")) {
        el.classList.add("short-width-textarea");
      } else {
        el.classList.add("result-off");
      }
    });
    document.getElementById("result").classList.add("short-result-area");
  }, []);

  window.addEventListener("resize", () => {
    if (
      window.innerWidth > 800 &&
      !document.getElementById("result").classList.contains("invisible")
    ) {
      document.getElementById("main-app").style.width = "50vw";
    } else {
      document.getElementById("main-app").style.width = "100vw";
    }
  });

  return (
    <div>
      <div className="application">
        <div className={bookmarksClass + " bookmarks-part"} id="bookmarks-part">
          <BookmarksHeader />
          <BookmarkMenu />
        </div>
        <div className="main-app" id="main-app">
          <Header />
          <div className="forms" id="forms">
            <Forms setParsedJson={setParsedJson} />
          </div>
        </div>
        <div id="result" className="result-block invisible">
          <ResultHeader />
          <Result jsonData={parsedJson} />
        </div>
      </div>
    </div>
  );
}

export default App;
