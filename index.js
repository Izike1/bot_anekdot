const parse = require('node-html-parser').parse;
const axios = require('axios').default;


const telegramApi = require('node-telegram-bot-api');
const token = '5254025372:AAFx9LUHBQuBG10fxxYLrbBBrKSOcG-1dUw';
const bot = new telegramApi(token, {polling: true});
const chats = {};
const gameOptions = [
    [
        {
            text: 'Получить анекдот',
            callback_data: '/letsgo'
        }
    ]
];



const parser = async () => {

    const response = await axios.get('https://all-anekdoty.ru/nacionalnosti/evrei/');
    const hui = response.data;
    const root = parse(hui);
    const post = root.querySelector('.post-small > p');
    return post.innerHTML.replace(/<br>/gm,'\n');

}


const start = () => {
    bot.setMyCommands([
        {command: '/start', description:'Приветствие'},
        {command: '/letsgo', description:'Анекдот'},
        {command: '/secret', description:'На свой страх и риск'}
    ])

    bot.on('message',  async (msg, gameOptins) => {
        const text = msg.text;
        const chatId = msg.chat.id;

        switch (text) {
            case '/start' :
                await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/9.webp')
                await bot.sendMessage(chatId, 'Если хочешь анекдот введи - /letsgo');
                break
            case '/letsgo':
                const funny_text = await parser();
                await  bot.sendMessage(chatId, `Анекдот:\n ${funny_text}\n`, {
                    reply_markup: {
                        inline_keyboard: gameOptions
                    }
                });
                break
            case '/secret':
                await bot.sendMessage(chatId, 'Лупа и Пупа пошли получать зарплату. В бухгалтерии все перепутали. В итоге, Лупа получил за Пупу, а Пупа за лупу');
                break
            default :
                await bot.sendMessage(chatId, 'Пошёл на хуй, такой команды нет');
                break
        }
    })
    bot.on('callback_query', async query => {
        if (query.data === '/letsgo') {
            const funny_text = await parser();
            await  bot.sendMessage(query.message.chat.id, `Анекдот:\n ${funny_text}\n`, {
                reply_markup: {
                    inline_keyboard: gameOptions
                }
            });
        } else {}
    })
}
start();

