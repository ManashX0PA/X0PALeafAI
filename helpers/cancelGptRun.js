const OpenAI = require('openai');
const config = require('config');
const xhelpers = require("./xhelpers");
const { triggerAnyGptFunction } = require('../triggerAnyGptFunction');

/* --------------------------------- open ai -------------------------------- */
const openAIConfig = config.get('openAI');
const openai = new OpenAI({ apiKey: openAIConfig.secretKey });
/* -------------------------------------------------------------------------- */

const cancelGptRun = async ({ threadId, gptResponseId } = {}) => {
  try {

    const gptFuncResp = await openai.beta.threads.runs.cancel(threadId, gptResponseId);
    console.log("@gptFuncResp", gptFuncResp);
    return gptFuncResp;
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
  cancelGptRun,
}