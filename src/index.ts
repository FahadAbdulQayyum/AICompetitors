import OpenAI from "openai";

type ChatCompletionRole = "system" | "user" | "assistant";
interface ChatCompletionMessageParam {
    role: ChatCompletionRole;
    content: string | null;
}

type ModelName = "deepseek-reasoner" | "gpt-4o";

function createDeepSeekClient(systemPrompt: string) {
    const deepSeekChatClient = new OpenAI({
        baseURL: "https://api.deepseek.com",
        apiKey: process.env.DEEPSEEK_API,
    });
    const messages: ChatCompletionMessageParam[] = [{ role: "system", content: systemPrompt }];

    return async function (message: string, model: ModelName = "deepseek-reasoner") {
        // Add user message to the conversation
        messages.push({ role: "user", content: message });

        try {
            // Call the DeepSeek API and await the response
            const response = await deepSeekChatClient.chat.completions.create({
                model,
                messages,
            });

            // Extract the assistant's response
            const assistantResponse: string | null = response.choices[0].message.content;

            // Add assistant's response to the conversation
            messages.push({ role: "assistant", content: assistantResponse });

            return assistantResponse;
        } catch (error) {
            console.error("DeepSeek API Error:", error);
            throw error;
        }
    };
}

function createOpenAiClient(systemPrompt: string) {
    const openAiChatClient = new OpenAI({
        apiKey: process.env.OPENAI_API,
    });
    const messages: ChatCompletionMessageParam[] = [{ role: "system", content: systemPrompt }];

    return async function (message: string, model: ModelName = "gpt-4o") {
        // Add user message to the conversation
        messages.push({ role: "user", content: message });

        try {
            // Call the OpenAI API and await the response
            const response = await openAiChatClient.chat.completions.create({
                model,
                messages,
            });

            // Extract the assistant's response
            const assistantResponse: string | null = response.choices[0].message.content;

            // Add assistant's response to the conversation
            messages.push({ role: "assistant", content: assistantResponse });

            return assistantResponse;
        } catch (error) {
            console.error("OpenAI API Error:", error);
            throw error;
        }
    };
}



// import OpenAI from "openai";

// interface Message {
//     role: "system" | "user" | "assistant";
//     content: string;
// };

// type ModelName = "deepseek-reasoner" | "gpt-4o";


// // Clients
// function createDeepSeekClient(systemPrompt: string) {
//     const deepSeekChatClient = new OpenAI({
//         baseURL: "https://api.deepseek.com",
//         apiKey: process.env.DEEPSEEK_API,
//     });
//     const messages: Message[] = [
//         { role: "system", content: systemPrompt }
//     ];

//     return async function (message: string, model: ModelName = "deepseek-reasoner") {
//         messages.push({role: "user", content: message});
//         const response = deepSeekChatClient.chat.completions.create({
//             model,
//             messages,
//         });
//         const assistantResponse = response.choices[0].message.content;
//         messages.push({ role: "assistant", content: assistantResponse });
//         return assistantResponse;
//     }
// }

// function createOpenAiClient(systemPrompt: string) {
//     const OpenAiChatClient = new OpenAI({
//         apiKey: process.env.OPENAI_API,
//     });
//     const messages: Message[] = [];

//     return async function (message: string, model: ModelName = "gpt-4o") {
//         messages.push({role: "user", content: message});
//         const response = OpenAiChatClient.chat.completions.create({
//             model,
//             messages,
//         });
//         const assistantResponse = await response.choices[0].message.content
//         messages.push({ role: "assistant", content: assistantResponse })
//         return assistantResponse;
//     }
// }

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

const deepSeek = createDeepSeekClient(`
        You are a calm, peaceful, intelligent AI Assistant competing with OpenAI 
        LLM Model. You have to prove yourself the best and maintain calmness, peacefulness
        and always be polite and think before you answer.
        I want you to win this debate and I want that you can prove yourself be the best.

        The debate is ${DEBATE_TOPIC}.
    `);

    let currentTurn: number = 0;

    let lastMessage: string | null = "Hello";

    let flag: 'A' | 'B' = 'A';

    while (currentTurn < MAX_TURN) {
        if (flag === 'A') {
            lastMessage = await gpt(`DeepSeek says: ${lastMessage}`);
            console.log("OpenAI: ", lastMessage);
            flag = 'B';
        } else {
            lastMessage = await deepSeek(`OpenAI says: ${lastMessage}`);
            console.log("DeepSeek: ", lastMessage);
            flag = 'A';
        }

        currentTurn++;
    }