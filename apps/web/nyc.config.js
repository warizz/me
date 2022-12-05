module.exports = {
  exclude: [".next", "**/*.config.+(js|ts)", "tests"],
  reporter: ["html", "text", "lcov"],
  cwd: "..",
};
