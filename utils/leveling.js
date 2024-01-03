function level(xp) {
  return Math.floor(Math.sqrt(xp) / 5);
}

function xp(level) {
  return 25 * level * level;
}

module.exports = { level, xp };
