export const isValidRule = (jsonStr) => {
  try {
    JSON.parse(jsonStr);
    sessionStorage.setItem("rule-data", JSON.stringify(jsonStr));
    return true;
  } catch (e) {
    sessionStorage.removeItem("rule-data");
    return false;
  }
};

export const isValidData = (jsonStr) => {
  try {
    JSON.parse(jsonStr);
    sessionStorage.setItem("data", JSON.stringify(jsonStr));
    return true;
  } catch (e) {
    sessionStorage.removeItem("data");
    return false;
  }
};

export const areInputsClear = () => {
  return (
    document.getElementById("rule-textarea").value.length === 0 &&
    document.getElementById("data-textarea").value.length === 0
  );
};
