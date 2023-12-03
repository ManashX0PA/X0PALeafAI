const OpenAI = require('openai');
const config = require('config');
const { getGptResponse } = require('./helpers/getGptResponse');
const { cancelGptRun } = require('./helpers/cancelGptRun');

const openAIConfig = config.get('openAI');
const assistantId = "asst_ckR3z0n75YoJ29rCtx4olqAa";
const openai = new OpenAI({ apiKey: openAIConfig.secretKey });



/* --------------------------- helper function(s) --------------------------- */
const logRespOf = (resp) => console.log("@resp", JSON.stringify(resp, null, 2));
/* -------------------------------------------------------------------------- */


const gptThreadId = "thread_yj1YMo7XKV7FgUCxjXAeJ6GK";


async function main() {
  const assistant = await openai.beta.assistants.retrieve(assistantId);
  // const resp = await openai.beta.threads.create(); // this creates a new thread

  const userInput = "list out for me data scientist jobs from singapore having min salary of 290";

  // const resp = await cancelGptRun({ threadId: gptThreadId, gptResponseId: 'run_OUFRGopWB6e1Epe1HlCzgcpJ' })
  const resp = await getGptResponse({ threadId: gptThreadId, assistantId, instructions: userInput });
  logRespOf(resp);
}

main();