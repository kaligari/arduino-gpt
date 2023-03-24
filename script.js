import { config } from 'dotenv';
config();

import { Configuration, OpenAIApi } from 'openai'
import readline from 'readline'

const messages = [
    {"role": "system", "content": "You are a MySQL database. Return responses in the same format as MySQL."},
    {"role": "user", "content": "insert into users(name, email) values ('John', 'john@galt.example');"},
    {"role": "user", "content": "select count(*) from users"}
]

console.log(messages);

const openai = new OpenAIApi(new Configuration({
    apiKey: process.env.API_KEY
}))

const userInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})

chatRequest();
userInterface.prompt()

userInterface.on('line', async input => {
    messages.push({
        role: "user",
        content: input
    })
    chatRequest();
    userInterface.prompt();    
})

async function chatRequest() {
    const result = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages
    })
    console.log('Assistant:', result.data.choices[0].message.content);
    messages.push(result.data.choices[0].message);
}