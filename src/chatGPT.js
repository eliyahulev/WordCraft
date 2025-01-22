import { getAPIKey } from "./common.js"
// Constants
const API = {
    CHAT: 'https://api.openai.com/v1/chat/completions',
    MODELS: 'https://api.openai.com/v1/models',
    USAGE: 'https://platform.openai.com/account/usage'
};

const DEFAULT_MODEL = 'gpt-4o-mini';
const REWRITE_PROMPT = 'Rewrite the following text in a casual but slightly professional manner, ensuring correct grammar and spelling.';

// Helper function to make API requests
async function makeRequest(endpoint, options = {}) {
    const apiKey = await getAPIKey();

    if (!apiKey) {
        chrome.runtime.openOptionsPage();
        return null;
    }

    const response = await fetch(endpoint, {
        method: options.method || 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: options.body ? JSON.stringify(options.body) : undefined
    });

    return response.json();
}

// Check if API key is valid
async function checkAPIkey(apiKey) {
    try {
        const response = await makeRequest(API.MODELS);
        return !response.error;
    } catch {
        return false;
    }
}

// Send message to ChatGPT
async function sendMessage(messages, model = DEFAULT_MODEL) {
    return makeRequest(API.CHAT, {
        method: 'POST',
        body: {
            model,
            messages
        }
    });
}

// Rewrite text using ChatGPT
async function rewriteText(input) {
    const messages = [
        { role: 'user', content: REWRITE_PROMPT },
        { role: 'user', content: input }
    ];
    return sendMessage(messages);
}

// Ask ChatGPT a question
async function askChatGPT(input) {
    const messages = [
        { role: 'user', content: input }
    ];
    return sendMessage(messages);
}

// Export functions and constants
export {
    API,
    checkAPIkey,
    rewriteText,
    askChatGPT
};