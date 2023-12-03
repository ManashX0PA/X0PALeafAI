const getX0PAJobListAPI = (args = {}) => {
  try {
    console.log("@args", args);
    return { ...args, name: "SilvenLEAF" };
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getX0PAJobListAPI,
}