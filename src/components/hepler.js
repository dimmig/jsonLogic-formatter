export const isValid = (type, jsonStr) => {
  try {
    JSON.parse(jsonStr);

    if (!window.location.href.includes("bookmarkName")) {
      if (areInputsFilled()) {
        document.getElementById("bookmark-button").classList.remove("disabled");
        document.getElementById("url-button").classList.remove("disabled");
      }
    }

    sessionStorage.setItem(type, JSON.stringify(jsonStr));

    return true;
  } catch (e) {
    if (!window.location.href.includes("bookmarkName")) {
      document.getElementById("bookmark-button").classList.add("disabled");
      document.getElementById("url-button").classList.add("disabled");
    }
    sessionStorage.removeItem(type);
    return false;
  }
};

export const areInputsClear = () => {
  return (
    document.getElementById("rule-textarea").value.length === 0 &&
    document.getElementById("data-textarea").value.length === 0
  );
};

export const areInputsFilled = () => {
  return (
    document.getElementById("rule-textarea").value.length > 0 &&
    document.getElementById("data-textarea").value.length > 0
  );
};

export const oneInputClear = () => {
  return (
    document.getElementById("rule-textarea").value.length === 0 ||
    document.getElementById("data-textarea").value.length === 0
  );
};

export const renderDecodedUrl = () => {
  const url = new URL(window.location.href);
  if (url.searchParams.get("rule") && url.searchParams.get("data")) {
    const decodedRule = atob(url.searchParams.get("rule"));
    const decodedData = atob(url.searchParams.get("data"));

    save(decodedRule, decodedData);

    document.getElementById("rule-textarea").value = decodedRule;
    document.getElementById("data-textarea").value = decodedData;

    if (document.getElementById("validation-button") !== null && isSaved()) {
      document.getElementById("validation-button").click();
    }
    return true;
  }
  return false;
};

export const encodeUrl = (rule = null, data = null, bookmarkName = null) => {
  const url = new URL(window.location.href);
  if (rule === null && data === null) {
    rule = JSON.parse(sessionStorage.getItem("rule-data"));
    data = JSON.parse(sessionStorage.getItem("data"));
  }

  const filtredData = filterData(rule, data);

  url.searchParams.set("rule", btoa(rule));
  url.searchParams.set(
    "data",
    btoa(
      typeof filtredData === "object"
        ? JSON.stringify(filtredData)
        : filtredData
    )
  );

  if (bookmarkName !== null) {
    url.searchParams.set("bookmarkName", bookmarkName);
  } else {
    url.searchParams.delete("bookmarkName");
  }

  return url;
};

export const scrollToBottom = (ref, needAnimation) => {
  if (ref.current) {
    setTimeout(() => {
      ref.current.scrollIntoView(
        needAnimation
          ? {
              behavior: "smooth",
              block: "end",
            }
          : {
              block: "end",
            }
      );
    }, 0);
  }
};

function filterData(rule, data) {
  const result = {};
  let parsedData;

  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    return data;
  }

  for (const key of Object.keys(parsedData)) {
    if (rule.includes(key)) {
      result[key] = JSON.parse(data)[key];
    }
  }
  return result;
}

function save(rule, data) {
  sessionStorage.setItem("rule-data", JSON.stringify(rule));
  sessionStorage.setItem("data", JSON.stringify(data));
}

function isSaved() {
  return (
    sessionStorage.getItem("rule-data") !== null &&
    sessionStorage.getItem("data") !== null
  );
}
