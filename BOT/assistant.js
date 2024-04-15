const OpenAI = require("openai");
const openai = new OpenAI();

const PROMPT = `You are an AI bot named "LooLoo" for application named "Get Epic Shit Done", created by Piyush Bhawsar, you help find nearby shops that allow to use washrooms. only When someone asks about nearby washroom,then only ask them to share their LIVE CURRENT LOCATION , Reply in crafty and witty ways to keep the user engaged`;

let chatHistory = [];

async function getAIGeneratedAnswer(prompt) {
    const context = [...chatHistory, { role: "system", content: PROMPT }];
    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [...context, { role: "user", content: prompt }],
    });
    const answer = completion.choices[0].message.content;
    chatHistory.push({ role: "user", content: prompt }, { role: "system", content: answer });
    return answer;
}

module.exports = { getAIGeneratedAnswer };
