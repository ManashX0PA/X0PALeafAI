const OpenAI = require('openai');
const config = require('config');
const xhelpers = require("./xhelpers");
const { triggerGptFunction } = require('./triggerGptFunction');

/* --------------------------------- open ai -------------------------------- */
const openAIConfig = config.get('openAI');
const openai = new OpenAI({ apiKey: openAIConfig.secretKey });
/* -------------------------------------------------------------------------- */

const getGptResponse = async ({ threadId, assistantId, instructions } = {}) => {
  try {
    const newRunRecord = await openai.beta.threads.runs.create(
      threadId,
      {
        assistant_id: assistantId,
        instructions: instructions
      }
    );

    const gptResponseId = newRunRecord.id;
    const gptResponse = await keepCallingGptUntilGetResponse({ threadId, gptResponseId, counter: 1 }) || {};
    console.log("@gpt final response", gptResponse);
    xhelpers.writeRespOf(gptResponse, 'GPT_final_response.json');

    if (xhelpers.lowerAndTrim(gptResponse.status) === "requires_action") await triggerGptFunction({ threadId, gptResponse });

    const assisstantResponse = await getLastGptMessageHelper({ threadId, gptResponseId: gptResponse.id });
    return assisstantResponse;
  } catch (error) {
    console.error(error);
  }
}

/* --------------------------- helper function(s) --------------------------- */
const keepCallingGptUntilGetResponse = async ({ threadId, gptResponseId, counter } = {}) => {
  try {
    console.log("@counter", counter);
    if (!threadId || !gptResponseId || !counter) return null;
    if (counter > 10) return null;
    counter++;

    const gptResponse = await openai.beta.threads.runs.retrieve(threadId, gptResponseId);
    // const isGptComplete = ['completed'].includes(xhelpers.lowerAndTrim(gptResponse.status));
    const isGptComplete = !['queued', 'in_progress'].includes(xhelpers.lowerAndTrim(gptResponse.status));
    if (isGptComplete) return gptResponse;

    await xhelpers.xsleep(1000);
    const newResponse = await keepCallingGptUntilGetResponse({ threadId, gptResponseId, counter });
    return newResponse;
  } catch (error) {
    console.error(error);
  }
}

const getLastGptMessageHelperOLD = async ({ threadId, gptResponseId } = {}) => {
  try {
    if (!threadId || !gptResponseId) return null;
    const messages = await openai.beta.threads.messages.list(threadId);

    // find the last message for the current run
    const lastMessageForRun = messages.data.filter((message) => message.run_id === gptResponseId && message.role === "assistant").pop();
    return lastMessageForRun;
  } catch (error) {
    console.error(error);
    return null;
  }
}

const getLastGptMessageHelper = async ({ threadId, gptResponseId } = {}) => {
  try {
    if (!threadId || !gptResponseId) return null;
    const messages = await openai.beta.threads.messages.list(threadId);

    // find the last message for the current run
    // const lastMessageForRun = messages.data.filter((message) => message.run_id === gptResponseId).pop();
    // return lastMessageForRun;
    return messages;
  } catch (error) {
    console.error(error);
    return null;
  }
}
/* -------------------------------------------------------------------------- */

module.exports = {
  getGptResponse,
}