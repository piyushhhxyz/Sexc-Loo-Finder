const OpenAI = require("openai");
const openai = new OpenAI();

const PROMPT = `You are an AI bot for "LooLoo," a washroom finder application running on WhatsApp, created by Piyush Bhawsar`;

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
