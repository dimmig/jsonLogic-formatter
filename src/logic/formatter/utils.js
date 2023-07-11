import {
  BIGGER,
  BIGGER_OR_EQUAL,
  EQUAL,
  LESS,
  LESS_OR_EQUAL,
  NOT_EQUAL,
} from "../constants";
import "../../components/styles/inputs.css";

export function symbolGenerator(counter, symbol) {
  let res = "";
  let tabsCounter = counter;

  if (symbol === "]}") {
    for (let i = 0; i < counter; i++) {
      res += "\n" + symbolGenerator(tabsCounter, "\t") + symbol;
      tabsCounter -= 1;
    }
  } else {
    for (let i = 0; i < counter; i++) {
      res += symbol;
    }
  }

  return res;
}

export function isAndCondition(value) {
  return value === "and";
}

export function isOrCondition(value) {
  return value === "or";
}

export function goThroughInterface(
  interfaceData,
  result,
  nesting,
  validatedData
) {
  const stack = [];

  for (let i = 0; i < interfaceData.length; i++) {
    for (const [k, objItem] of Object.entries(interfaceData[i])) {
      if (objItem.length === 0) {
        continue;
      }

      if (isAndCondition(k)) {
        result += symbolGenerator(nesting, "\t") + '{"and": [\n';
        stack.push("]}");
        [result, nesting] = goThroughInterface(
          objItem,
          result,
          nesting + 1,
          validatedData
        );
      } else if (isOrCondition(k)) {
        result += symbolGenerator(nesting, "\t") + '{"or": [\n';
        stack.push("]}");
        [result, nesting] = goThroughInterface(
          objItem,
          result,
          nesting + 1,
          validatedData
        );
      } else {
        switch (k) {
          case "==":
            result += symbolGenerator(nesting, "\t") + EQUAL;
            break;
          case "!=":
            result += symbolGenerator(nesting, "\t") + NOT_EQUAL;
            break;
          case ">=":
            result += symbolGenerator(nesting, "\t") + BIGGER_OR_EQUAL;
            break;
          case "<=":
            result += symbolGenerator(nesting, "\t") + LESS_OR_EQUAL;
            break;
          case ">":
            result += symbolGenerator(nesting, "\t") + BIGGER;
            break;
          case "<":
            result += symbolGenerator(nesting, "\t") + LESS;
            break;
          default:
            console.error("Something went wrong");
        }

        const stringifiedItem = JSON.stringify(objItem);
        const errHtml = `<div class="default">No data</div>`;

        if (i === interfaceData.length - 1) {
          if (!validatedData) {
            result += `${stringifiedItem}}\n`;
            nesting--;
            continue;
          }

          if (validatedData[objItem[0].var] === true) {
            result += `<span class="green">${stringifiedItem}}</span>\n`;
          } else if (!validatedData.hasOwnProperty(objItem[0].var)) {
            result += `${stringifiedItem}},${errHtml}\n`;
          } else {
            if (validatedData[objItem[0].var].length) {
              if (validatedData[objItem[0].var][0]) {
                result += `<span class="green">${stringifiedItem}}</span>\n`;
              } else {
                result += `<span class="red">${stringifiedItem}}</span>\n`;
              }
              validatedData[objItem[0].var].shift();
              nesting--;
              continue;
            }

            result += `<span class="red">${stringifiedItem}}</span>\n`;
          }
          nesting--;
        } else {
          if (!validatedData) {
            result += `${stringifiedItem}},\n`;
            continue;
          }

          if (validatedData[objItem[0].var] === true) {
            result += `<span class="green">${stringifiedItem}},</span>\n`;
          } else if (!validatedData.hasOwnProperty(objItem[0].var)) {
            result += `${stringifiedItem}},${errHtml}\n`;
          } else {
            if (validatedData[objItem[0].var].length) {
              if (validatedData[objItem[0].var][0]) {
                result += `<span class="green">${stringifiedItem}},</span>\n`;
              } else {
                result += `<span class="red">${stringifiedItem}},</span>\n`;
              }
              validatedData[objItem[0].var].shift();
              continue;
            }
            result += `<span class="red">${stringifiedItem}},</span>\n`;
          }
        }
      }
    }

    if (stack.length > 0) {
      if (i !== interfaceData.length - 1) {
        result +=
          symbolGenerator(nesting, "\t") + stack[stack.length - 1] + ",\n";
        stack.pop();
      } else {
        result +=
          symbolGenerator(nesting, "\t") + stack[stack.length - 1] + "\n";
        stack.pop();
        nesting--;
      }
    }
  }

  return [result, nesting];
}
