import request from 'superagent'
import qrcode from 'qrcode-generator'

import { GenerateChargeRequest, GenerateChargeResponse, SettledChargeResponse } from './types';

const config = require('../config')

export const createQrCode = (data: string) => {
  const qr = qrcode(0, 'L')
  qr.addData(data)
  qr.make()
  return qr.createDataURL()
}

export const generateCharge = async (body: GenerateChargeRequest) => {
  const res = await request
    .post(`https://api.opennode.co/v1/charges`)
    .set({
      'Content-Type': 'application/json',
      'Authorization': config.OPENNODE_TOKEN,
    })
    .send(body)

  return res.body.data as GenerateChargeResponse
}

export const getPaidCharges = async () => {
  const res = await request
    .get(`https://api.opennode.co/v1/charges`)
    .set({
      'Content-Type': 'application/json',
      'Authorization': config.OPENNODE_TOKEN,
    })

  return res.body.data as SettledChargeResponse[]
}
