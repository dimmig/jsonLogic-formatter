import { EXAMPLE_DATA, EXAMPLE_RULE } from "../../logic/constants";
import { areInputsClear, encodeUrl, save } from "../hepler";

export const renderExampleData = () => {
  document.getElementById("rule-textarea").value = EXAMPLE_RULE;
  document.getElementById("data-textarea").value = EXAMPLE_DATA;

  document.getElementById("rule-textarea").classList.remove("invalid-input");
  document.getElementById("data-textarea").classList.remove("invalid-input");

  if (!window.location.href.includes("bookmarkName")) {
    document.getElementById("bookmark-button").classList.remove("disabled");
    document.getElementById("url-button").classList.remove("disabled");
  }

  save(EXAMPLE_RULE, EXAMPLE_DATA);
};

export const addHoverEvent = (data) => {
  data.forEach((el) => {
    el.addEventListener("mouseover", () => {
      const data = JSON.parse(JSON.parse(sessionStorage.getItem("data")));
      const varName = el.textContent.split('"')[1];
      if (data !== null) {
        const tooltip = findTooltip(el);
        tooltip.classList.add("active-tooltip");
        tooltip.textContent = data[varName];
      }
    });

    el.addEventListener("mouseout", () => {
      const tooltip = findTooltip(el);
      tooltip.classList.remove("active-tooltip");
    });
  });
};

export const addFocusEvent = (data) => {
  data.forEach((el) => {
    el.addEventListener("touchstart", () => {
      const data = JSON.parse(JSON.parse(sessionStorage.getItem("data")));
      const varName = el.textContent.split('"')[1];
      if (data !== null) {
        const tooltip = findTooltip(el);
        tooltip.classList.add("active-tooltip");
        tooltip.classList.add("tooltip-mobile-color");
        tooltip.textContent = data[varName];
      }
    });
    el.addEventListener("touchend", () => {
      const tooltip = findTooltip(el);
      tooltip.classList.remove("active-tooltip");
      tooltip.classList.remove("tooltip-mobile-color");
    });
  });
};

export const copy = (id, setIsCopied) => {
  const range = document.createRange();

  range.selectNode(document.getElementById(id));
  window.getSelection().removeAllRanges();
  window.getSelection().addRange(range);
  document.execCommand("copy");
  window.getSelection().removeAllRanges();

  const copyButton = document.getElementById("copy-button");
  copyButton.classList.add("completed");

  setIsCopied(true);
  setTimeout(() => {
    setIsCopied(false);
    copyButton.classList.remove("completed");
  }, 1000);
};

export const handleExport = (data, fileName) => {
  if (!data || !fileName) {
    return;
  }

  const blob = new Blob([JSON.stringify(data)], {
    type: "application/octet-stream",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName + ".json";
  a.click();
  URL.revokeObjectURL(url);
};

export const readFile = (fileData, setArrayLength) => {
  if (fileData) {
    const reader = new FileReader();
    reader.readAsText(fileData);

    reader.onload = () => {
      try {
        const jsonData = JSON.parse(reader.result);
        if (Array.isArray(jsonData)) {
          setArrayLength(jsonData.length);
        }
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };
  }
};

export const renderEncodingUrl = (setCopied) => {
  const rule = sessionStorage.getItem("rule");
  const data = sessionStorage.getItem("data");
  const bookmarkName = new URL(window.location.href).searchParams.get(
    "bookmarkName"
  );
  let url;
  if (rule !== null && data !== null && !areInputsClear()) {
    if (bookmarkName) {
      url = encodeUrl(rule, data, bookmarkName);
    } else {
      url = encodeUrl(rule, data);
    }

    navigator.clipboard.writeText(url);
    document.getElementById("url-button").classList.add("completed");
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
      document.getElementById("url-button").classList.remove("completed");
    }, 1000);
  }
};

function findTooltip(el) {
  if (!el) {
    return null;
  }
  const closestSpan = el.children[0];
  if (closestSpan.id !== "tooltip") {
    return findTooltip(closestSpan);
  } else {
    return closestSpan;
  }
}
