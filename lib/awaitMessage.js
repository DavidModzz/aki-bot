/*
    NOTA: esta es una version modificada del codigo de https://discord.com/channels/725839806084546610/1162620517749112873
*\

/**
 * @typedef {Object} awaitMessageOptions
 * @property {Number} [timeout] - The time in milliseconds to wait for a message
 * @property {String} sender - The sender to wait for
 * @property {String} chatJid - The chat to wait for
 * @property {(message: Baileys.proto.IWebMessageInfo) => Boolean} [filter] - The filter to use
*/
/**
 * 
 * @param {awaitMessageOptions} options 
 * @returns {Promise<Baileys.proto.IWebMessageInfo>}
 */
async function awaitMessage(options = {}, socket) {
    return new Promise((resolve, reject) => {
        if (typeof options !== 'object') reject(new Error('Options must be an object'));
        if (typeof options.sender !== 'string') reject(new Error('Sender must be a string'));
        if (typeof options.chatJid !== 'string') reject(new Error('ChatJid must be a string'));
        if (options.timeout && typeof options.timeout !== 'number') reject(new Error('Timeout must be a number'));
        if (options.filter && typeof options.filter !== 'function') reject(new Error('Filter must be a function'));

        const timeout = options?.timeout || undefined;
        const filter = options?.filter || (() => true);
        const expectedMessages = options?.expectedMessages || [];

        let interval = undefined;

        let listener = (data) => {
            let { type, messages } = data;
            if (type == "notify") {
                for (let message of messages) {
                    const fromMe = message.key.fromMe;
                    const chatId = message.key.remoteJid;
                    const isGroup = chatId.endsWith('@g.us');
                    const isStatus = chatId == 'status@broadcast';

                    const sender = fromMe ? socket.user.id.replace(/:.*@/g, '@') : (isGroup || isStatus) ? message.key.participant.replace(/:.*@/g, '@') : chatId;

                    if (sender == options.sender && chatId == options.chatJid && filter(message) && expectedMessages.includes(message.message?.conversation)) {
                        socket.ev.off('messages.upsert', listener);
                        clearTimeout(interval);
                        resolve(message);
                    }
                }
            }
        };

        socket.ev.on('messages.upsert', listener);

        if (timeout) {
            interval = setTimeout(() => {
                socket.ev.off('messages.upsert', listener);
                reject(new Error('Timeout'));
            }, timeout);
        }
    });
}

module.exports = {
    awaitMessage
}