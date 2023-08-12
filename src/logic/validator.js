export function validate(jsonLogicString, data) {
  if (data === null || jsonLogicString === null) {
    return null;
  }

  try {
    const parsedJson = JSON.parse(jsonLogicString);
    const parsedData = JSON.parse(data);

    const result = {};
    let validatedResult;

    for (const [, value] of Object.entries(parsedJson)) {
      validatedResult = goThroughtObject(value, parsedData, result);
    }
    return validatedResult;
  } catch (e) {
    return null;
  }
}

function goThroughtObject(array, parsedData, result) {
  let comparedValue;
  for (let i = 0; i < array.length; i++) {
    for (const [key, value] of Object.entries(array[i])) {
      const firstValue = value[0];
      const secondValue = value[1];
      if (key !== "or" && key !== "and") {
        if (
          typeof secondValue !== "boolean" &&
          typeof secondValue !== "number" &&
          typeof secondValue === "object" &&
          !secondValue.var
        ) {
          const computedValue = computingHandler(secondValue, parsedData);
          computedValue || computedValue === 0
            ? (comparedValue = compare(
                key,
                parsedData[firstValue.var],
                computedValue
              ))
            : (comparedValue = null);
        } else if (
          typeof firstValue !== "boolean" &&
          typeof firstValue !== "number" &&
          typeof firstValue === "object" &&
          typeof secondValue === "number" &&
          !firstValue.var
        ) {
          const computedValue = computingHandler(firstValue, parsedData);
          computedValue || computedValue === 0
            ? (comparedValue = compare(key, computedValue, secondValue))
            : (comparedValue = null);

          for (const innerValue of Object.values(firstValue)[0]) {
            writeResult(result, innerValue.var, comparedValue);
          }
          continue;
        } else if (
          typeof secondValue === "object" &&
          !Array.isArray(secondValue)
        ) {
          parsedData.hasOwnProperty(firstValue.var)
            ? (comparedValue = compare(
                key,
                parsedData[firstValue.var],
                parsedData[secondValue.var]
              ))
            : (comparedValue = null);
        } else {
          parsedData.hasOwnProperty(firstValue.var)
            ? (comparedValue = compare(
                key,
                parsedData[firstValue.var],
                secondValue
              ))
            : (comparedValue = null);
        }

        writeResult(result, firstValue.var, comparedValue);

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

function computingHandler(value, parsedData) {
  for (const [innerkey, innerVal] of Object.entries(value)) {
    if (Array.isArray(innerVal)) {
      const gotValues = computeArray(innerVal, parsedData);
      if (gotValues.includes(null)) {
        continue;
      }
      return computeValue(innerkey, gotValues);
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
