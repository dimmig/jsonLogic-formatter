import React, {  useState } from "react";
import { BookmarkMenu } from "./components/bookmarks/BookmarkMenu";
import { BookmarksHeader } from "./components/bookmarks/BookmarksHeader";
import { Forms } from "./components/Form";
import { Header } from "./components/Header";
import { Result } from "./components/subcomponents/Result";
import { ResultHeader } from "./components/subcomponents/ResultHeader";
import "./index.css";

function App() {
  const [parsedJson, setParsedJson] = useState(null);

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      document.getElementById("main-app").style.width = "50vw";
    } else {
      document.getElementById("main-app").style.width = "100vw";
    }
  });

  return (
    <div className="main-row">
      <div className="application">
        <div className="bookmarks-part invisible" id="bookmarks-part">
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
