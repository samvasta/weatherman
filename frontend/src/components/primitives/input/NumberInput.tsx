const validCharTest = /^[0-9\b\.\-]+$/;
const allowedKeys = [
  "Backspace",
  "ArrowLeft",
  "ArrowRight",
  "ArrowDown",
  "ArrowUp",
  "Delete",
  "Tab",
  "Home",
  "End",
];

export function isValidNumberInput(
  event: React.KeyboardEvent<HTMLInputElement>
) {
  if (!event || event.currentTarget?.value === undefined) {
    return false;
  }

  const { key, ctrlKey, metaKey } = event;

  // Allow for stuff like copy/paste
  if (ctrlKey || metaKey) {
    return true;
  }

  if (!allowedKeys.includes(key) && !validCharTest.test(key)) {
    return false;
  }

  const currentStr = event.currentTarget.value;
  const selStart = event.currentTarget.selectionStart;
  const selEnd = event.currentTarget.selectionEnd;

  const nextValue =
    currentStr.slice(0, selStart ?? currentStr.length) +
    key +
    currentStr.slice(selEnd ?? currentStr.length);

  if (nextValue.lastIndexOf("-") > 0) {
    // "-" can only be at the start of the string
    return false;
  }

  // "." is only allowed one time per string
  if (nextValue.split(".").length > 2) {
    return false;
  }

  return true;
}

// Strips leading zeros
const leadingZerosTest = /(-?)(0*)([^.\s]+\.?\S*)/;
//                        (-?)                      captures the optional - sign
//                            (0*)                  captures leading zeros
//                                ([^.\s]+          is all the digits before the .
//                                        \.?\S*)   is all the optional stuff after the .

export function formatSafeNumberInput(input: string): string {
  // Add a leading 0 to make things nice
  if (input[0] === ".") {
    return "0" + input;
  } else if (input.startsWith("-.")) {
    // Add a 0 between - and .
    return "-0." + input.slice(2);
  }

  if (leadingZerosTest.test(input)) {
    // Only keep group 1 and 3 because group 2 is the leading 0s
    return input.replace(leadingZerosTest, "$1$3");
  }

  return input;
}
