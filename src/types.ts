type Currency = 'USD' | 'EUR' | 'GBP' | 'MXN' | 'BRL' | 'AUD'
type ChargeStatus = 'unpaid' | 'paid' | 'processing'

export interface TelegramInvoice {
  telegramUserId: number
  chargeId: string
  successCallback: (charge: SettledChargeResponse, total: number) => void
}

export interface GenerateChargeResponse {
  id: string
  name: string | null
  description: string
  created_at: number
  status: ChargeStatus
  amount: number
  callback_url: string | null
  success_url: string
  order_id: string
  notes: string
  currency: string
  source_fiat_value: number
  fiat_value: number
  auto_settle: boolean
  lightning_invoice: {
    expires_at: number
    payreq: string
  }
  chain_invoice: {
    address: string
  }
}

export interface GenerateChargeRequest {
  amount: number
  description?: string
  currency?: Currency
  order_id?: string
  customer_email?: string
  customer_name?: string
  callback_url?: string
  success_url?: string
  auto_settle?: boolean
}

export interface SettledChargeResponse {
  id: string
  name: string
  description: string
  status: ChargeStatus
  created_at: number
  fee: number
  fiat_value: number
  notes: string
  amount: number
  auto_settle: boolean
  lightning_invoice: {
    settled_at: number
    payreq: string
  }
}
