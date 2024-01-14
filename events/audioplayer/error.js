module.exports = {
  name: "error",
  execute(guildId, error) {
    console.log("Audio player is in the Error state!");
    console.error(error);
  },
};
