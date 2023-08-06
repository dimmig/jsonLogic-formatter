export function validate(jsonLogicString, data) {
  if (data === null || jsonLogicString === null) {
    return null;
  }

  try {
    JSON.parse(jsonLogicString);
    JSON.parse(data);
  } catch (e) {
    return null;
  }

  const parsedJson = JSON.parse(jsonLogicString);
  const parsedData = JSON.parse(data);

  const result = {};
  let res;

  const entriesArray = Object.entries(parsedJson);

  for (let i = 0; i < entriesArray.length; i++) {
    res = goThroughtObject(entriesArray[i], parsedData, result);
  }
  return res;
}

function goThroughtObject(array, parsedData, result) {
  let comparedValue;
  for (let i = 0; i < array.length; i++) {
    for (const [k, value] of Object.entries(array[i])) {
      if (k !== "or" && k !== "and") {
        if (
          typeof value[1] !== "boolean" &&
          typeof value[1] !== "number" &&
          typeof value[1] == "object" &&
          !value[1].var
        ) {
          let computedValue;
          for (const [innerKey, innerVal] of Object.entries(value[1])) {
            if (Array.isArray(innerVal)) {
              const gotValues = computeArray(innerVal, parsedData);
              if (gotValues.includes(null)) {
                continue;
              }
              computedValue = computeValue(innerKey, gotValues);
            }
          }
          computedValue || computedValue === 0
            ? (comparedValue = compare(
                k,
                parsedData[value[0].var],
                computedValue
              ))
            : (comparedValue = null);
        } else if (
          typeof value[0] !== "boolean" &&
          typeof value[0] !== "number" &&
          typeof value[0] == "object" &&
          !value[0].var &&
          typeof value[1] === "number"
        ) {
          let computedValue;
          for (const [innerKey, innerVal] of Object.entries(value[0])) {
            if (Array.isArray(innerVal)) {
              const gotValues = computeArray(innerVal, parsedData);
              if (gotValues.includes(null)) {
                continue;
              }
              computedValue = computeValue(innerKey, gotValues);
            }
          }
          computedValue || computedValue === 0
            ? (comparedValue = compare(k, computedValue, value[1]))
            : (comparedValue = null);
          for (const innerValue of Object.values(value[0])[0]) {
            writeResult(result, innerValue.var, comparedValue);
          }
          continue;
        } else if (typeof value[1] === "object" && !Array.isArray(value[1])) {
          parsedData.hasOwnProperty(value[0].var)
            ? (comparedValue = compare(
                k,
                parsedData[value[0].var],
                parsedData[value[1].var]
              ))
            : (comparedValue = null);
        } else {
          parsedData.hasOwnProperty(value[0].var)
            ? (comparedValue = compare(k, parsedData[value[0].var], value[1]))
            : (comparedValue = null);
        }
        if (!result.hasOwnProperty(value[0].var)) {
          if (comparedValue) {
            result[value[0].var] = true;
          } else if (comparedValue !== null) {
            result[value[0].var] = false;
          } else {
            continue;
          }
        } else {
          if (result[value[0].var].length > 1) {
            comparedValue
              ? (result[value[0].var] = [...result[value[0].var], true])
              : (result[value[0].var] = [...result[value[0].var], false]);
          } else {
            comparedValue
              ? (result[value[0].var] = [...[result[value[0].var]], true])
              : (result[value[0].var] = [...[result[value[0].var]], false]);
          }
        }

        continue;
      }
      goThroughtObject(value, parsedData, result);
    }
  }
  return result;
}

function writeResult(result, varName, comparedValue) {
  if (!result.hasOwnProperty(varName)) {
    if (comparedValue) {
      result[varName] = true;
    } else if (comparedValue !== null) {
      result[varName] = false;
    }
  } else {
    if (result[varName].length > 1) {
      comparedValue
        ? (result[varName] = [...result[varName], true])
        : (result[varName] = [...result[varName], false]);
    } else {
      comparedValue
        ? (result[varName] = [...[result[varName]], true])
        : (result[varName] = [...[result[varName]], false]);
    }
  }
}

function computeArray(value, data) {
  return value.map((obj) => {
    if (obj.var && data.hasOwnProperty(obj.var)) {
      return data[obj.var];
    } else if (typeof obj === "number") {
      return obj;
    } else {
      return null;
    }
  });
}

function computeValue(sign, values) {
  switch (sign) {
    case "+":
      return values.reduce((acc, value) => acc + value);

    case "-":
      return values.reduce((acc, value) => acc - value);

    case "*":
      return values.reduce((acc, value) => acc * value);

    case "/":
      return values.reduce((acc, value) => acc / value);

    default:
      return "UNKNOWN OPERATOR";
  }
}

function compare(sign, got, wanted) {
  switch (sign) {
    case "==":
      return got === wanted;

    case "!=":
      return got !== wanted;

    case ">=":
      return got >= wanted;

    case ">":
      return got > wanted;

    case "<=":
      return got <= wanted;

    case "<":
      return got < wanted;

    default:
      return "UNKNOWN OPERATOR";
  }
}
