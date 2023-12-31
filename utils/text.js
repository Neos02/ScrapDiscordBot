function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function slugToPascal(str) {
  return str
    .split("-")
    .map((s) => capitalize(s))
    .join("");
}

module.exports = { capitalize, slugToPascal };
