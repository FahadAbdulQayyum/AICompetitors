import OpenAI from "openai";

// Clients
function createDeepSeekClient(systemPrompt: string) {
    const deepSeekChatClient = new OpenAI({
        baseURL: "https://api.deepseek.com",
        apiKey: process.env.DEEPSEEK_API,
    });
    const messages = [
        { role: "system", content: systemPrompt }
    ];

    return async function (message: string, model = "deepseek-reasoner") {
        messages.push({role: "user", content: message});
        const response = deepSeekChatClient.chat.completions.create({
            model,
            messages,
        });
        const assistantResponse = response.choices[0].message.content;
        messages.push({ role: "assistance", content: assistantResponse });
        return assistantResponse;
    }
}

function createOpenAiClient(systemPrompt: string) {
    const OpenAiChatClient = new OpenAI({
        apiKey: process.env.OPENAI_API,
    });
    const messages = [];

    return async function (message: string, model = "gpt-4o") {
        messages.push({role: "user", content: message});
        const response = OpenAiChatClient.chat.completions.create({
            model,
            messages,
        });
        const assistantResponse = response.choices[0].message.content
        messages.push({ role: "assistance", content: assistantResponse })
        return assistantResponse;
    }
}

const MAX_TURN: number = 12;
const DEBATE_TOPIC: string = "Which number is greater 9.11 and 9.8?"

const gpt = createOpenAiClient(`
        You are an aggressive AI assistant competing with DeepSeek R1 Model
        You have to prove yourself the best because you're.
        You are very aggressive and egoistic in nature. You always try to prove
        yourself the best and your response tone is angry. Always try to prove
        why you are always right.

        The debate is ${DEBATE_TOPIC}.
    `);

const deepseek = createDeepSeekClient(`
        You are a calm, peaceful, intelligent AI Assistant competing with OpenAI 
        LLM Model. You have to prove yourself the best and maintain calmness, peacefulness
        and always be polite and think before you answer.
        I want you to win this debate and I want that you can prove yourself be the best.

        The debate is ${DEBATE_TOPIC}.
    `);