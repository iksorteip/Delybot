const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
const readline = require('readline');

const client = new Client();
let pedidos = {}; 
let mensagensPedidos = {}; 

// Interface para perguntar no terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let grupoID = "";

// 🧠 Capturar novo grupo automaticamente
async function capturarNovoGrupo() {
    console.log("\n📲 Escaneie o QR Code para capturar o ID do grupo...");
    const tempClient = new Client();

    tempClient.on('qr', qr => {
        qrcode.generate(qr, { small: true });
    });

    tempClient.on('ready', async () => {
        console.log('✅ Bot temporário conectado! Envie uma mensagem em QUALQUER grupo agora.');

        tempClient.on('message', async msg => {
            if (msg.from.endsWith('@g.us')) {
                grupoID = msg.from;
                console.log(`✅ ID do grupo capturado: ${grupoID}`);

                // Salva no config.json
                fs.writeFileSync('config.json', JSON.stringify({ grupoID }, null, 2));

                console.log("💾 Grupo salvo com sucesso!");
                await tempClient.destroy();
                iniciarBotPrincipal();
            }
        });
    });

    tempClient.initialize();
}

// 🧠 Inicia o bot principal
function iniciarBotPrincipal() {
    try {
        const config = JSON.parse(fs.readFileSync('config.json'));
        grupoID = config.grupoID;
    } catch {
        grupoID = "";
    }

    if (!grupoID) {
        console.log("⚠️ Nenhum grupo configurado ainda!");
        return capturarNovoGrupo();
    }

    console.log(`🚀 Usando grupo salvo: ${grupoID}`);

    client.initialize();
}

// 🔹 Pergunta no início se quer trocar o grupo
rl.question("🔄 Deseja alterar o grupo configurado? (s/n): ", async (resposta) => {
    rl.close();
    if (resposta.toLowerCase() === "s") {
        capturarNovoGrupo();
    } else {
        iniciarBotPrincipal();
    }
});

// === A PARTIR DAQUI É O TEU CÓDIGO ORIGINAL ===

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('✅ Bot conectado com sucesso!');
});

client.on('message', async msg => {
    const user = msg.from;

    // Ignora mensagens que não são PV
    if (
        msg.from.endsWith('@g.us') ||
        msg.from.includes('@newsletter') ||
        msg.from.includes('@broadcast') ||
        msg.author
    ) return;

    const texto = msg.body.toLowerCase();

    // 👋 Saudações e menu
    const saudacoes = ['oi', 'olá', 'ola', 'bom dia', 'boa tarde', 'boa noite', 'e aí', 'ei'];
    if (saudacoes.some(s => texto.includes(s))) {
        await msg.reply(
            '👋 Olá! Sou o *DelyBot*, seu assistente de coletas e entregas em Passo Fundo.\n\n💡 Como posso te ajudar hoje?\n\n1️⃣ Fazer pedido de *coleta/entrega*\n2️⃣ Informar *blitz*\n\n*Responda com o número da opção desejada.*'
        );
        pedidos[user] = { etapa: "menu", coleta: null, entrega: null };
        return;
    }

    // Se o usuário ainda não estiver no fluxo, ignora
    if (!pedidos[user]) return;

    // Menu principal
    if (pedidos[user].etapa === "menu") {
        if (texto === "1") {
            pedidos[user].etapa = "pedido";
            await msg.reply("🚚 Perfeito! Envie separadamente o endereço de *coleta* e o de *entrega*.");
            return;

        } else if (texto === "2") {
            pedidos[user].etapa = "blitz";
            await msg.reply("🚨 Envie a *localização* ou *nome da rua* onde está a blitz.");
            return;

        } else {
            await msg.reply("⚠️ Opção inválida. Responda com *1* ou *2*.");
            return;
        }
    }

    // 🚨 Fluxo blitz
    if (pedidos[user].etapa === "blitz") {
        const chatCliente = await msg.getContact();
        const nomeCliente = chatCliente.pushname || chatCliente.name || "Usuário";
        const numeroCliente = user.replace('@c.us', '');

        const avisoBlitz = `🚨 *Alerta de Blitz!*\n📍 Local: ${msg.body}\n👤 Enviado por: ${nomeCliente}\n📞 ${numeroCliente}`;

        try {
            const chat = await client.getChatById(grupoID);
            await chat.sendMessage(avisoBlitz);
            console.log("📤 Blitz enviada para o grupo.");
        } catch (err) {
            console.error("❌ Erro ao enviar blitz:", err);
        }

        await msg.reply("✅ Alerta enviado para todos os motoboys! 🚦");
        pedidos[user] = null;
        return;
    }

    // 🚚 Fluxo de pedido normal
    if (pedidos[user].etapa === "pedido") {
        if (!pedidos[user].coleta) {
            pedidos[user].coleta = msg.body;
            msg.reply('📍 Endereço de coleta salvo! Agora envie o endereço de ENTREGA.');

        } else if (!pedidos[user].entrega) {
            pedidos[user].entrega = msg.body;

            // 💰 Tabela fixa
            const tabelaValores = `
🏍️ *Tabela de Valores (por distância)*

❗ De 0 a 0,9 km — R$ 10,00  
❗ De 1 a 1,9 km — R$ 11,00  
❗ De 2 a 2,9 km — R$ 12,00  
❗ De 3 a 3,9 km — R$ 14,00  
❗ De 4 a 4,9 km — R$ 16,00
❗ De 5 a 6,9 km — R$ 18,00
❗ De 7 a 8,9 km — R$ 20,00
❗ De 9 a 10,9 km — R$ 23,00
❗ De 11 a 12,9 km — R$ 25,00
❗❗Se a entrega exigir retorno, será cobrado um valor adicional!
            `;

            const chatCliente = await msg.getContact();
            const nomeCliente = chatCliente.pushname || chatCliente.name || "Cliente";
            const numeroCliente = user.replace('@c.us', '');

            const mensagemGrupo = `📦 *Novo Pedido* \n\n🟢 Coleta: ${pedidos[user].coleta}\n🔵 Entrega: ${pedidos[user].entrega}\n👤 *Cliente:* ${nomeCliente}\n📞 *Número:* ${numeroCliente}\n\n${tabelaValores}`;

            try {
                const chat = await client.getChatById(grupoID);
                const msgEnviada = await chat.sendMessage(mensagemGrupo);

                mensagensPedidos[msgEnviada.id._serialized] = {
                    clienteId: user,
                    nomeCliente: nomeCliente,
                    aceito: false
                };

                console.log(`📤 Pedido enviado para o grupo ${grupoID}`);
            } catch (err) {
                console.error("❌ Erro ao enviar para o grupo:", err);
            }

            msg.reply(`✅ Pedido registrado com sucesso!\nSegue nossa tabela:\n${tabelaValores}`);

            pedidos[user] = null;
        }
    }
});

// 🚀 Detectar quando um motoboy responde no grupo
client.on('message_create', async msg => {
    if (!msg.from.endsWith('@g.us')) return;

    if (msg.hasQuotedMsg) {
        const quoted = await msg.getQuotedMessage();
        const quotedId = quoted.id._serialized;

        if (mensagensPedidos[quotedId]) {
            const resposta = msg.body.toLowerCase();
            const palavrasAceite = ['aceito', 'pego', 'vou', 'minha', 'levo', 'tô indo', 'eu vou'];

            if (palavrasAceite.some(p => resposta.includes(p))) {
                const contatoMotoboy = await msg.getContact();
                const nomeMotoboy = contatoMotoboy.pushname || "Motoboy";
                const pedido = mensagensPedidos[quotedId];

                if (pedido.aceito) {
                    await msg.reply("⚠️ Esta rota já foi aceita por outro motoboy!");
                    return;
                }

                pedido.aceito = true;
                pedido.motoboy = nomeMotoboy;

                const textoOriginal = await quoted.body;
                await quoted.edit(`${textoOriginal}\n\n✅ *Aceito por ${nomeMotoboy}*`);
                await msg.reply(`🛵 *Rota aceita por ${nomeMotoboy}!*`);

                try {
                    await client.sendMessage(
                        pedido.clienteId,
                        `✅ Olá, ${pedido.nomeCliente}! Sua rota foi aceita por *${nomeMotoboy}* 🚚`
                    );
                } catch (err) {
                    console.error("❌ Erro ao avisar cliente:", err);
                }

                setTimeout(() => {
                    delete mensagensPedidos[quotedId];
                }, 10000);
            }
        }
    }
});
