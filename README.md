# 🤖 DelyBot — Assistente de Coletas e Entregas 🚚

O **DelyBot** é um bot para **WhatsApp**, desenvolvido em **Node.js** com a biblioteca [`whatsapp-web.js`](https://github.com/pedroslopez/whatsapp-web.js).  
Ele automatiza o atendimento de clientes, registra **pedidos de coleta e entrega**, além de permitir o envio de **alertas de blitz** para motoboys em um grupo configurado.

---

## ⚠️ Aviso Legal

Este projeto foi desenvolvido com o objetivo de **automatizar pedidos e alertas de trânsito** (como blitz e fiscalizações).

O desenvolvedor **não se responsabiliza** pelo uso indevido desta funcionalidade.

A função de *blitz* é **meramente informativa**, e deve ser utilizada **com responsabilidade e respeito às leis de trânsito**.

Qualquer uso que vá contra a legislação vigente é de inteira responsabilidade do usuário.

---

## 🚀 Funcionalidades

✅ **Atendimento automático** via WhatsApp  
✅ Registro completo de **pedidos de coleta e entrega**  
✅ Envio automático de **alertas de blitz** para motoboys  
✅ Sistema de **aceitação de pedidos** (motoboy responde “aceito”, “vou”, etc.)  
✅ **Aviso automático ao cliente** quando um motoboy aceita a rota  
✅ **Alteração dinâmica do grupo** pelo terminal  
✅ Persistência do **ID do grupo** em `config.json`  

---

## ⚙️ Tecnologias utilizadas

- [Node.js](https://nodejs.org)
- [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [qrcode-terminal](https://www.npmjs.com/package/qrcode-terminal)
- [fs (File System)](https://nodejs.org/api/fs.html)
- [readline](https://nodejs.org/api/readline.html)

---

## 📦 Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/delybot.git

2. Acesse a Pasta do Projeto:
    ```bash
    cd delybot

3. Instale as Dependências:
    ```bash
    npm install whatsapp-web.js qrcode-terminal

4. Execute o Bot:
    ```bash
    node index.js

---

## 🔄 Configuração do grupo

Ao iniciar o bot, será perguntado:
    ````
    🔄 Deseja alterar o grupo configurado? (s/n):

*Se responder “s”, o bot abrirá um QR Code temporário.
Após escanear e enviar uma mensagem em um grupo, ele capturará automaticamente o ID do grupo e salvará no arquivo config.json.

*Se responder “n”, ele usará o grupo salvo anteriormente.

---

## 💬 Comandos e fluxos principais

👋 Início do atendimento

O cliente envia “oi”, “olá”, “bom dia” etc.
O bot responde com o menu principal:

1️⃣ Fazer pedido de coleta/entrega
2️⃣ Informar blitz

---

## 🚚 Pedido de coleta e entrega

O cliente escolhe 1 e informa:

Endereço de *coleta*

Endereço de *entrega*

O bot envia a mensagem no grupo configurado e mostra a tabela de preços fixa.
Se um motoboy responder com **“aceito”, “vou”, “levo”,** etc., o bot:

**Edita a mensagem no grupo** ✅

**Envia uma mensagem ao cliente confirmando o motoboy.**

---

## 🚨 Aviso de blitz

O cliente escolhe *2 e envia o local*.
O bot *envia automaticamente uma mensagem* no grupo com o formato:

🚨 *Alerta de Blitz!*
📍 Local: [mensagem do cliente]
👤 Enviado por: [nome]
📞 [número]

---

## 🧠 Estrutura do projeto
📁 delybot/
├── index.js          # Código principal do bot
├── config.json       # Grupo configurado (salvo automaticamente)
├── package.json      # Dependências e metadados do projeto
└── README.md         # Documentação do projeto

---

## ⚠️ Observações importantes

É **necessário escaneamento do QR Code ao iniciar pela primeira vez.**

Use o bot em ambientes seguros — o *WhatsApp pode desconectar* se a sessão for usada em outro local.

O arquivo **config.json** é criado automaticamente ao configurar o grupo.

---

## 💡 Futuras melhorias (roadmap)
    ☐ Suporte a Múltiplos Grupos
    ☐ Integração com mapa para cálculo de distâncias
    ☐ Interface Web de ADM

---

## 👨‍💻 Autor

**Ígor Pietroski Camargo**
Desenvolvedor e criador do DelyBot 🚀
📍 Passo Fundo — RS

---