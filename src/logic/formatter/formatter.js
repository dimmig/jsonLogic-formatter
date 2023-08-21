import { NOT_VALID_RULE, NOT_VALID_DATA } from "../constants";
import { isAndCondition, goThroughInterface } from "./utils";

export function formatJSON(data, validatedData) {
  if (data === null) {
    return NOT_VALID_RULE;
  }

  if (validatedData === null) {
    return NOT_VALID_DATA;
  }

  const parsedData = JSON.parse(data);

  if (!parsedData.hasOwnProperty("or") && !parsedData.hasOwnProperty("and")) {
    return NOT_VALID_RULE;
  }

  let result = "";
  let nesting = 1;

  for (const [k, value] of Object.entries(parsedData)) {
    if (value.length === 0) {
      continue;
    }

    if (isAndCondition(k)) {
      result += '\n{"and": [\n';
    } else {
      result += '\n{"or": [\n';
    }
    [result, nesting] = goThroughInterface(
      value,
      result,
      nesting,
      validatedData
    );
  }

  result += "]}";
  return result;
}
