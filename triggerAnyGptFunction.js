const { getX0PAJobListAPI } = require("./xpFunctions");

const triggerAnyGptFunction = async args => {
  try {
    if (args.functionName === 'getX0PAJobListAPI') return await getX0PAJobListAPI(args);

    console.log("@unsupported", args);
  } catch (error) {
    console.error(error);
  }
}

module.exports = { triggerAnyGptFunction };