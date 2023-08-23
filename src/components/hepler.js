import { apply } from "json-logic-js";
import {
  NOT_VALID_DATA,
  NOT_VALID_OPTIONS,
  NOT_VALID_RULE,
  VALID_OPTIONS,
} from "../logic/constants";
import { formatJSON } from "../logic/formatter/formatter";
import { validate } from "../logic/validator";

export const isValid = (type, jsonStr) => {
  try {
    type === "rule"
      ? document
          .getElementById("rule-textarea")
          .classList.remove("invalid-input")
      : document
          .getElementById("data-textarea")
          .classList.remove("invalid-input");

    JSON.parse(jsonStr);

    if (areInputsFilled()) {
      document.getElementById("bookmark-button").classList.remove("disabled");
      document.getElementById("url-button").classList.remove("disabled");
    }

    sessionStorage.setItem(type, JSON.stringify(jsonStr));

    return true;
  } catch (e) {
    document.getElementById("bookmark-button").classList.add("disabled");
    document.getElementById("url-button").classList.add("disabled");
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

export const renderDecodedUrl = () => {
  const url = new URL(window.location.href);

  const decodedRule = url.searchParams.get("rule")
    ? atob(url.searchParams.get("rule"))
    : "";
  const decodedData = url.searchParams.get("data")
    ? atob(url.searchParams.get("data"))
    : "";

  save(decodedRule, decodedData);

  document.getElementById("rule-textarea").value = decodedRule;
  document.getElementById("data-textarea").value = decodedData;

  if (document.getElementById("validation-button") !== null && isSaved()) {
    document.getElementById("validation-button").click();
  }
};

export const encodeUrl = (
  rule = null,
  data = null,
  bookmarkName = null,
  section = null,
  isFile = false
) => {
  const url = removeUrlParams(new URL(window.location.href));

  if (rule !== null && data !== null && !isFile) {
    rule = JSON.parse(sessionStorage.getItem("rule"));
    data = JSON.parse(sessionStorage.getItem("data"));
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
    if (url.searchParams.get("section")) {
      url.searchParams.delete("section");
    }
  }
  if (isFile) {
    if (rule !== null) {
      url.searchParams.set("rule", btoa(JSON.stringify(rule)));
    }

    if (data !== null) {
      url.searchParams.set("data", btoa(JSON.stringify(data)));
    }

    if (section !== null) {
      url.searchParams.set("section", btoa(JSON.stringify(section)));
    }
  }

  if (bookmarkName !== null) {
    url.searchParams.set("bookmarkName", bookmarkName);
  }

  return url;
};

export const renderResult = (setParsedJson, needToValidate) => {
  let validatedData = validate(
    JSON.parse(sessionStorage.getItem("rule")),
    JSON.parse(sessionStorage.getItem("data"))
  );

  if (areInputsClear()) {
    setParsedJson(formatJSON(JSON.parse(sessionStorage.getItem("rule")), null));
    document.getElementById("rule-textarea").classList.add("invalid-input");
    document.getElementById("data-textarea").classList.add("invalid-input");
    return;
  }

  let formattedResult = null;
  needToValidate
    ? (formattedResult = formatJSON(
        JSON.parse(sessionStorage.getItem("rule")),
        validatedData
      ))
    : (formattedResult = formatJSON(
        JSON.parse(sessionStorage.getItem("rule")),
        false
      ));

  if (formattedResult === NOT_VALID_RULE) {
    return document
      .getElementById("rule-textarea")
      .classList.add("invalid-input");
  } else if (formattedResult === NOT_VALID_DATA) {
    return document
      .getElementById("data-textarea")
      .classList.add("invalid-input");
  }

  setParsedJson(formattedResult);
  const resultElement = document.getElementById("result");

  if (resultElement !== null) {
    if (window.innerWidth > 800) {
      document.getElementById("main-app").style.width = "50vw";
    } else {
      document.getElementById("main-app").style.width = "100vw";
    }

    resultElement.classList.remove("invisible");

    if (
      !document.getElementById("bookmarks-part").classList.contains("invisible")
    ) {
      resultElement.classList.add("short-result-area");
    }

    document.querySelectorAll(".textarea").forEach((el) => {
      el.classList.add("short-width-textarea");
      el.classList.remove("result-off");
    });

    if (needToValidate) {
      const rule = JSON.parse(sessionStorage.getItem("rule"));
      const data = JSON.parse(sessionStorage.getItem("data"));
      const isValid = fullValidation(rule, data);

      const animationOptions = isValid ? VALID_OPTIONS : NOT_VALID_OPTIONS;
      const resultClassToAdd = isValid ? "green-border" : "red-border";
      const resultClassToRemove = isValid ? "red-border" : "green-border";
      resultElement.animate(animationOptions, { duration: 1000 });

      resultElement.classList.remove(resultClassToRemove);
      resultElement.classList.add(resultClassToAdd);
    }

    if (window.innerWidth <= 800) {
      scrollToBottom("result");
    }
  }
};

export const scrollToBottom = (id) => {
  if (document.getElementById(id)) {
    setTimeout(() => {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth",
      });
    }, 0);
  }
};

export const fullValidation = (rule, data) => {
  return apply(JSON.parse(rule), JSON.parse(data));
};

export const save = (rule, data) => {
  sessionStorage.setItem("rule", JSON.stringify(rule));
  sessionStorage.setItem("data", JSON.stringify(data));
}

export const isSaved = () => {
  return (
    sessionStorage.getItem("rule") !== null &&
    sessionStorage.getItem("data") !== null
  );
};

function filterData(rule, data) {
  const result = {};
  let parsedData;

  try {
    parsedData = JSON.parse(data);
  } catch (e) {
    return data;
  }

  const keysArray = Object.keys(parsedData);

  for (let i = 0; i < keysArray.length; i++) {
    if (rule.includes(keysArray[i])) {
      result[keysArray[i]] = JSON.parse(data)[keysArray[i]];
    }
  }
  return result;
}

function removeUrlParams(url) {
  url.searchParams.delete("rule");
  url.searchParams.delete("data");
  url.searchParams.delete("bookmarkName");
  url.searchParams.delete("section");
  return url;
}
