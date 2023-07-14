export function validate(jsonLogicString, data) {
  if (data === null || jsonLogicString === null) {
    return null;
  }

  const parsedJson = JSON.parse(jsonLogicString);
  const parsedData = JSON.parse(data);

  const result = {};
  let res;

  for (const [, value] of Object.entries(parsedJson)) {
    res = goThroughtObject(value, parsedData, result);
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
          computedValue
            ? (comparedValue = compare(
                k,
                parsedData[value[0].var],
                computedValue
              ))
            : (comparedValue = null);
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
        if (
          // parsedData.hasOwnProperty(value[0].var) &&
          !result.hasOwnProperty(value[0].var)
        ) {
          if (comparedValue) {
            result[value[0].var] = true;
          } else if (comparedValue !== null) {
            result[value[0].var] = false;
          } else {
            continue;
          }
        } else {
          if (result[value[0].var].length >1) {
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
