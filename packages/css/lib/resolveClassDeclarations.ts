import { flatten, flattenDeep } from "lodash";
import { Variants } from "../types";
import { isObject } from "../utils";
import { resolveObject } from "./resolveObject";
import { resolveString } from "./resolveString";
import { resolveBody } from "./resolveBody";

export function resolveClassDeclarations(
  prefix: string,
  className: string,
  property: string,
  theme: any,
  variant: Variants
): string[] {
  const arr = Object.keys(theme).map((classSet) => {
    //classSet = keys in object: red,blue, sm,md,lg etc
    const value = theme[classSet]; // value (could be object if a color)

    const variantVal: Variants | undefined =
      variant !== "responsive" ? variant : undefined;

    if (isObject(value)) {
      const resolvedObject = resolveObject(classSet, value); // {"red-000" : #FFF3F3, etc...}
      const obj = Object.keys(resolvedObject).map((key) => {
        const body = resolveBody(property, resolvedObject[key]);
        return prefix + resolveString(className, body, key, variantVal);
      });

      return flatten(obj);
    }

    const body = resolveBody(property, value);

    return [prefix + resolveString(className, body, classSet, variantVal)];
  });

  return flattenDeep(arr);
}
