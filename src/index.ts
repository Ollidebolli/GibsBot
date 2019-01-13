import Telegraf, { ContextMessageUpdate } from 'telegraf'

import { generateCharge, createQrCode, getPaidCharges } from './api'
import { TelegramInvoice } from './types'

const config = require('../config')

const bot = new Telegraf(config.TELEGRAM_TOKEN)

const telegramInvoices: TelegramInvoice[] = []
const memorizedPayments: { telegramUserId: number, chargeId: string }[] = []

bot.telegram.getMe().then((info) => {
  bot.options.username = info.username
  console.log(`Running ${info.username}`)
})

const generate = async (ctx: ContextMessageUpdate, amount: number, currency?: string | any) => {
  const telegramUser = ctx.update.message!.from!
  const currencyText = currency ? `${amount} ${currency}` : `${(amount / 100000000).toFixed(8)} BTC`
  const description = `Hello please gib me ${currencyText} 😀`
  const charge = await generateCharge({
    amount,
    description,
    currency,
  })

  const dataUrl = createQrCode(charge.lightning_invoice.payreq)
  const buffer = Buffer.from(dataUrl.split(',')[1], 'base64')

  ctx.reply(description)
  ctx.replyWithPhoto({ source: buffer }, { caption: charge.lightning_invoice.payreq })

  telegramInvoices.push({
    telegramUserId: telegramUser.id,
    chargeId: charge.id,
    successCallback: (charge, total) => {
      ctx.reply(`Thank you ${telegramUser.first_name} for the ${currencyText}! 🎉\nNow I have $${total}! 😍`)
    }
  })
}

bot.command('/gibdollar', (ctx) => generate(ctx, 1, 'USD'))
bot.command('/gibcent', (ctx) => generate(ctx, 0.01, 'USD'))
bot.command('/gibsatoshi', (ctx) => generate(ctx, 1))

bot.startPolling()

// instead of webhook this will check for new payments every 10 seconds
;(() => {
  const check = async () => {
    const charges = await getPaidCharges()
    const newPayments = charges.filter(s => memorizedPayments.findIndex(m => m.chargeId === s.id) === -1)
    const totalDollars = charges.reduce((amount, charge) => amount + charge.fiat_value / 100, 0)
    newPayments.forEach((charge) => {
      const invoice = telegramInvoices.find((inv) => inv.chargeId === charge.id)
      if (invoice) {
        console.log(`Charge ${invoice.chargeId} paid by ${invoice.telegramUserId}`)
        invoice.successCallback(charge, totalDollars)
        memorizedPayments.push({
          telegramUserId: invoice.telegramUserId,
          chargeId: charge.id,
        })
      }
    })
    setTimeout(check, 10000)
  }
  check()
})()
