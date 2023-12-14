
// Round a float number to a given number of decimals with a string as result and add 0 if necessary
function roundString(value, decimals) {
  let result = Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
  result = result + "";
  if (result.indexOf(".") === -1) {
    result = result + ".";
  }
  let expectDecimals = decimals;
  let currentDecimals = result.length - result.indexOf(".") - 1;
  while (currentDecimals < expectDecimals) {
    result = result + "0";
    currentDecimals++;
  }

  return result;
}

roundString(1.005, 2) // 1.01
roundString(1.005, 3) // 1.005
roundString(1.005, 4) // 1.0050
roundString(1.00534434, 4) // 1.0050

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
    newValue = roundString(newValue, 2)
    newValue += "M"
  } else if (number >= 1000) {
    newValue = number / 1000;
    newValue = roundString(newValue, 2)
    newValue += "K"
  } else {
    newValue = roundString(number, 2)
  }
  return newValue
}

export { roundString, value2Number, number2Value };