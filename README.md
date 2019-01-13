## Gibs Bot
### Running the thing:
```npm start```

### Setup

First copy and rename **config.template.json** to **config.json**

#### Lightning Network setup
Go to app.opennode.co and generate an API key with invoice permissions
Set "OPENNODE_TOKEN" to the generated key in the config

#### Telegram bot setup
Go to t.me/BotFather
Create a bot with the `/newbot` command
Follow the instructions and finally set "TELEGRAM_TOKEN" to the generated token in the config
To get inline commands in Telegram, run `/setcommands`, select the new bot and send this command list as a message:
```
gibdollar - Give $1
gibcent - Give $0.01
gibsatoshi - Give 0.00000001 BTC
```
