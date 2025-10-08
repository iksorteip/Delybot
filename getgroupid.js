const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const client = new Client();

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log("✅ Bot pronto! Envie uma mensagem no grupo que deseja vincular...");
});

client.on('message', async msg => {
    if (msg.from.endsWith('@g.us')) {
        const grupoID = msg.from;

        // Salva no config.json
        const config = { grupoID };
        fs.writeFileSync('config.json', JSON.stringify(config, null, 2));

        console.log(`✅ Grupo identificado e salvo: ${grupoID}`);
        console.log("📁 Arquivo config.json atualizado!");

        await client.sendMessage(msg.from, "✅ Este grupo foi vinculado com sucesso ao bot!");
        process.exit(); // Encerra o script automaticamente
    }
});

client.initialize();
