const pino = require("pino");

const transport = pino.transport({
  targets: [
    {
      target: "pino/file",
      options: { destination: `${__dirname}/app.log` },
    },
    {
      target: "pino-pretty",
    },
  ],
});

module.exports = pino(
  {
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport
);
