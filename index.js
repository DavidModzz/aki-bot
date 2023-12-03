/*
    Creditos: https://github.com/DavidModzz
    Nota: No tengo problema con que "tomes prestado" mi codigo, pero se considerado y dejame creditos
    contacto: wa.me/595994966449
*/

const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, proto, DisconnectReason } = require("@whiskeysockets/baileys");
const { Boom } = require("@hapi/boom");
const pino = require("pino");
const { Aki } = require('aki-api');
const clc = require("cli-color");
const NodeCache = require("node-cache");
const readline = require("readline");

const prefix = ".";
const msgRetryCounterCache = new NodeCache();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (text) => new Promise((resolve) => rl.question(text, resolve));

const { awaitMessage, awaitGroupMessage } = require("./lib/awaitMessage");

async function startAki() {
  const { state, saveCreds } = await useMultiFileAuthState('./Baileys-Session');

  const client = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: false,
    mobile: false,
    browser: ["FireFox (linux)"],
    auth: state,
    msgRetryCounterCache,
  });

  if (!client.authState.creds.registered) {
    const phoneNumber = await question(
      `\nEscribe tú número de WhatsApp:\nEjemplo: ${clc.bold("14154758639")}\n/> `
    );
    const code = await client.requestPairingCode(phoneNumber);
    console.log(`Tu codigo de conexión es: ${clc.bold(code)}\n`);
    console.log(
      `Abre tu WhatsApp, ve a ${clc.bold(
        "Dispositivos vinculados >  vincular un dispositivo > vincular usando el numero de teléfono."
      )}`
    );
  }

  client.ev.on('creds.update', saveCreds);

  client.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;

      console.log(
        "Conexión cerrada debido a",
        lastDisconnect.error + ", reconectando...",
        shouldReconnect
      );

      if (shouldReconnect) {
        await startAki();
      }
    } else if (connection === "open") {
      console.log("conectado");
    }
  });

  client.ev.on("messages.upsert", async (msg) => {
    try {
      const info = msg.messages[0];
      if (!info.message) return;
      if (info.key && info.key.remoteJid == "status@broadcast") return;
      const type =
        Object.keys(info.message)[0] == "senderKeyDistributionMessage"
          ? Object.keys(info.message)[2]
          : Object.keys(info.message)[0] == "messageContextInfo"
          ? Object.keys(info.message)[1]
          : Object.keys(info.message)[0];
      const content = JSON.stringify(info.message);
      const altpdf = Object.keys(info.message);
      const from = info.key.remoteJid;
      var body =
        type === "conversation"
          ? info.message.conversation
          : type == "imageMessage"
          ? info.message.imageMessage.caption
          : type == "videoMessage"
          ? info.message.videoMessage.caption
          : type == "extendedTextMessage"
          ? info.message.extendedTextMessage.text
          : type == "buttonsResponseMessage"
          ? info.message.buttonsResponseMessage.selectedButtonId
          : type == "listResponseMessage"
          ? info.message.listResponseMessage.singleSelectReply.selectedRowId
          : type == "templateButtonReplyMessage"
          ? info.message.templateButtonReplyMessage.selectedId
          : "";
      const budy =
        type === "conversation"
          ? info.message.conversation
          : type === "extendedTextMessage"
          ? info.message.extendedTextMessage.text
          : "";
      var pes =
        type === "conversation" && info.message.conversation
          ? info.message.conversation
          : type == "imageMessage" && info.message.imageMessage.caption
          ? info.message.imageMessage.caption
          : type == "videoMessage" && info.message.videoMessage.caption
          ? info.message.videoMessage.caption
          : type == "extendedTextMessage" && info.message.extendedTextMessage.text
          ? info.message.extendedTextMessage.text
          : "";
      const args = body
        .trim()
        .split(/ +/)
        .slice(1);
      const isCmd = body.startsWith(prefix);
      const command = isCmd
        ? body
            .slice(1)
            .trim()
            .split(/ +/)
            .shift()
            .toLocaleLowerCase()
        : null;
      bidy = budy.toLowerCase();

      const messagesC = pes
        .slice(0)
        .trim()
        .split(/ +/)
        .shift()
        .toLowerCase();
      const arg = body.substring(body.indexOf(" ") + 1);
      const botNum = client.user.id.split(":")[0];
      const argss = body.split(/ +/g);
      const isGroup = info.key.remoteJid.endsWith("@g.us");
      const q = args.join(" ");
      const sender = isGroup ? info.key.participant : info.key.remoteJid;
      const pushname = info.pushName ? info.pushName : "Bot";
      const enviar = (texto) => {
        client.sendMessage(from, { text: texto }, { quoted: info });
      };
      const quoted = info.quoted ? info.quoted : info;
      const mime = (quoted.info || quoted).mimetype || "";
      const isBot = info.key.fromMe ? true : false;

      switch (command) {
        case "akinator":
          enviar(
            '🧞‍♂️ 𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁 🧞‍♂️\n\n𝚛𝚎𝚜𝚙𝚘𝚗𝚍𝚎 𝚊 𝚕𝚊𝚜 𝚙𝚛𝚎𝚐𝚞𝚗𝚝𝚊𝚜 𝚌𝚘𝚗:\n- 𝚜𝚒\n- 𝚗𝚘\n- 𝚗𝚘 𝚕𝚘 𝚜𝚎\n- 𝚙𝚛𝚘𝚋𝚊𝚋𝚕𝚎𝚖𝚎𝚗𝚝𝚎 𝚜𝚒\n- 𝚙𝚛𝚘𝚋𝚊𝚋𝚕𝚎𝚖𝚎𝚗𝚝𝚎 𝚗𝚘\n\n𝙽𝙾𝚃𝙰:\n- 𝚂𝚒 𝚚𝚞𝚒𝚎𝚛𝚎𝚜 𝚟𝚘𝚕𝚟𝚎𝚛 𝚊 𝚞𝚗𝚊 𝚙𝚛𝚎𝚐𝚞𝚗𝚝𝚊 𝚊𝚗𝚝𝚎𝚛𝚒𝚘𝚛 𝚎𝚜𝚌𝚛𝚒𝚋𝚎 "𝚊𝚗𝚝𝚎𝚛𝚒𝚘𝚛" 𝚜𝚒𝚗 𝚕𝚊𝚜 𝚌𝚘𝚖𝚒𝚕𝚕𝚊𝚜.\n- 𝚁𝚎𝚜𝚙𝚘𝚗𝚍𝚎 𝚊 𝚕𝚊𝚜 𝚙𝚛𝚎𝚐𝚞𝚗𝚝𝚊𝚜 𝚎𝚡𝚊𝚌𝚝𝚊𝚖𝚎𝚗𝚝𝚎 𝚌𝚘𝚗 𝚕𝚊𝚜 𝚙𝚊𝚕𝚊𝚋𝚛𝚊𝚜 𝚚𝚞𝚎 𝚜𝚎 𝚖𝚘𝚜𝚝𝚛𝚊𝚛𝚘𝚗 𝚊𝚗𝚝𝚎𝚛𝚒𝚘𝚛𝚖𝚎𝚗𝚝𝚎.\n- 𝙴𝚕 𝚓𝚞𝚎𝚐𝚘 𝚝𝚎𝚛𝚖𝚒𝚗𝚊 𝚊𝚞𝚝𝚘𝚖𝚊𝚝𝚒𝚌𝚊𝚖𝚎𝚗𝚝𝚎 𝚍𝚎𝚜𝚙𝚞𝚎́𝚜 𝚍𝚎 𝟻 𝚖𝚒𝚗𝚞𝚝𝚘𝚜 𝚍𝚎 𝚒𝚗𝚊𝚌𝚝𝚒𝚟𝚒𝚍𝚊𝚍.');
          try {
            const region = 'es';
            const akinatorGame = new Aki({ region });
            await akinatorGame.start();

            for (;;) {
              const { currentStep, question } = akinatorGame;
              const answerChoices = [
                'si',
                'no',
                "no lo se",
                'probablemente si',
                'probablemente no',
              ];

              enviar(
                `🧞‍♂️ 𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁 🧞‍♂️\n𝙿𝚛𝚎𝚐𝚞𝚗𝚝𝚊 #${currentStep + 1}: ${question}`
              );

              let userResponse = await awaitMessage({
                chatJid: from,
                sender: sender,
                expectedMessages:
                  currentStep > 0
                    ? [...answerChoices, 'anterior']
                    : answerChoices,
                filter: (info) =>
                  info?.message?.extendedTextMessage?.text ||
                  info?.message?.conversation,
              }, client);

              let userAnswer =
                userResponse?.message?.extendedTextMessage?.text ||
                userResponse?.message?.conversation;

              if (userAnswer === 'anterior') {
                await akinatorGame.back();
                continue;
              }

              await akinatorGame.step(answerChoices.indexOf(userAnswer));
              if (!(akinatorGame.currentStep > 78 || akinatorGame.progress > 76))
                continue;

              await akinatorGame.win();
              if (!akinatorGame.answers[0]) continue;

              client.sendMessage(from, {
                image: {
                  url: akinatorGame.answers[0].absolute_picture_path,
                },
                caption: `🧞‍♂️ 𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁 🧞‍♂️\n𝚃𝚞 𝚙𝚎𝚛𝚜𝚘𝚗𝚊𝚓𝚎 𝚎𝚜 ${JSON.stringify(
                  akinatorGame.answers[0].name
                )}?\n- si\n- no`,
              }, { quoted: info });

              let confirmationResponse = await awaitMessage({
                chatJid: from,
                sender: sender,
                expectedMessages: ["si", "no"],
                filter: (info) =>
                  info?.message?.extendedTextMessage?.text ||
                  info?.message?.conversation,
              }, client);

              let confirmationAnswer =
                confirmationResponse?.message?.extendedTextMessage?.text ||
                confirmationResponse?.message?.conversation;

              if (confirmationAnswer === "si") {
                return enviar(
                  "🧞‍♂️ 𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁 🧞‍♂️\n𝙾𝚝𝚛𝚊 𝚟𝚒𝚌𝚝𝚘𝚛𝚒𝚊 𝚙𝚊𝚛𝚊 𝚖𝚒."
                );
              }

              enviar(
                "🧞‍♂️ 𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁 🧞‍♂️\n¡𝙾𝚑, 𝚚𝚞𝚎 𝚕𝚊𝚜𝚝𝚒𝚖𝚊! ¿𝚀𝚞𝚒𝚎𝚛𝚎𝚜 𝚌𝚘𝚗𝚝𝚒𝚗𝚞𝚊𝚛?\n- si \n- no"
              );

              let continueResponse = await awaitMessage({
                chatJid: from,
                sender: sender,
                expectedMessages: ["si", "no"],
                filter: (info) =>
                  info?.message?.extendedTextMessage?.text ||
                  info?.message?.conversation,
              }, client);

              let continueAnswer =
                continueResponse?.message?.extendedTextMessage?.text ||
                continueResponse?.message?.conversation;

              if (continueAnswer === "no") {
                return enviar(
                  "🧞‍♂️ 𝙰𝙺𝙸𝙽𝙰𝚃𝙾𝚁 🧞‍♂️\n𝙻𝚊 𝚙𝚛𝚘𝚡𝚒𝚖𝚊 𝚜𝚎𝚛𝚊."
                );
              }
            }
          } catch (err) {
            enviar("Ocurrió un error en el juego");
            console.error(err);
          }
          break;

        default:
         
      }
    } catch (err) {
      console.log(err);
    }
  });
}

startAki();