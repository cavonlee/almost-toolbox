function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function value2Number(value) {
  value = value + "";
  value = value.trim();
  value = value.toLowerCase();
  let newValue;
  if (value === "") {
    newValue = ""
  } else if (value.endsWith("k")) {
    newValue = value.slice(0, value.length - 1) * 1000
  } else if (value.endsWith("m")) {
    newValue = value.slice(0, value.length - 1) * 1000000
  } else {
    newValue = value * 1
  }
  return newValue
}

function number2Value(number) {
  let newValue;
  if (number === undefined) {
    newValue = ""
  } else if (typeof number === "string") {
    newValue = number
  } else if (number >= 1000000) {
    newValue = number / 1000000;
    newValue = round(newValue, 2)
    newValue += "M"
  } else if (number >= 1000) {
    newValue = number / 1000;
    newValue = round(newValue, 2)
    newValue += "K"
  } else {
    newValue = round(number, 2)
  }
  return newValue
}

export { round, value2Number, number2Value };