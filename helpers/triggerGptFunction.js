const OpenAI = require('openai');
const config = require('config');
const xhelpers = require("./xhelpers");
const { triggerAnyGptFunction } = require('../triggerAnyGptFunction');

/* --------------------------------- open ai -------------------------------- */
const openAIConfig = config.get('openAI');
const openai = new OpenAI({ apiKey: openAIConfig.secretKey });
/* -------------------------------------------------------------------------- */

const triggerGptFunction = async ({ threadId, gptResponse } = {}) => {
  try {
    if (!gptResponse) return null;
    const actionList = gptResponse.required_action.submit_tool_outputs.tool_calls || [];

    const responseToReturn = [];
    for (let action of actionList) {
      const functionName = action.function.name;
      const argJson = action.function.arguments;

      const functionArgument = xhelpers.parseJson(argJson) || {};
      const funcResp = await triggerAnyGptFunction({ functionName, functionArgument }) || {}

      responseToReturn.push({
        tool_call_id: action.id,
        output: JSON.stringify(funcResp, null, 2),
      })
    }
    const gptResponseId = gptResponse.id;
    
    
    // const gptFuncResp = await openai.beta.threads.runs.submit_tool_outputs(threadId, gptResponseId, { tool_outputs: responseToReturn });
    const gptFuncResp = await openai.beta.threads.runs.submitToolOutputs(threadId, gptResponseId, { tool_outputs: responseToReturn });
    console.log("@gptFuncResp", gptFuncResp);
    return gptFuncResp;
  } catch (error) {
    console.error(error);
  }
}


module.exports = {
  triggerGptFunction,
}