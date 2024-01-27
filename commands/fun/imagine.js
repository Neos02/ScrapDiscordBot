const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const logger = require("#logger");

const LIMEWIRE_BASE_URL = "https://api.limewire.com/api";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Generate an AI image")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Description of the image")
        .setRequired(true)
        .setMaxLength(2000)
    ),
  async execute(interaction) {
    const prompt = interaction.options.getString("prompt");

    await interaction.deferReply();

    axios
      .post(
        "/image/generation",
        {
          prompt,
          aspect_ratio: "1:1",
          samples: 1,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.LIMEWIRE_API_KEY}`,
            "X-Api-Version": "v1",
            Accept: "application/json",
          },
          baseURL: LIMEWIRE_BASE_URL,
          validateStatus: (status) => {
            return status >= 200;
          },
        }
      )
      .then(async (res) => {
        if (res.data.status === 403) {
          return await interaction.editReply({
            content: "Only 10 images can be generated per day",
            ephemeral: true,
          });
        }

        const imageUrls = res.data.data.map((image) => image.asset_url);

        await interaction.editReply(imageUrls.join(" "));
      })
      .catch(async (e) => {
        logger.error(e, "An error has occurred");

        await interaction.editReply({
          content: "An unexpected error has occurred",
          ephemeral: true,
        });
      });
  },
};
