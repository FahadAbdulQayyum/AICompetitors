import OpenAI from "openai";

// Clients
const deepSeekChatClient = new OpenAI({
    baseURL: "https://api.deepseek.com",
    apiKey: "<DeepSeek API Key>",
})