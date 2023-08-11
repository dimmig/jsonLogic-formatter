import React, { useState } from "react";
import { BookmarkMenu } from "./components/bookmarks/BookmarkMenu";
import { BookmarksHeader } from "./components/bookmarks/BookmarksHeader";
import { ErrorBlock } from "./components/ErrorBlock";
import { Forms } from "./components/Form";
import { Header } from "./components/Header";
import { Result } from "./components/subcomponents/Result";
import "./index.css";

function App() {
  const [parsedJson, setParsedJson] = useState(null);

  return (
    <div>
      <div className="application">
        <div className="bookmarks-part" id="bookmarks-part">
          <BookmarksHeader />
          <BookmarkMenu />
        </div>
        <div className="main-app" id="main-app">
          <Header />
          <div className="forms">
            <Forms setParsedJson={setParsedJson} />
            <ErrorBlock jsonData={parsedJson} />
          </div>
        </div>
      </div>
      <div id="result" className="result-block">
        <Result jsonData={parsedJson} />
      </div>
    </div>
  );
}

export default App;
