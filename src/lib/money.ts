import Decimal from 'decimal.js'

const D = Decimal.clone({ precision: 34, rounding: Decimal.ROUND_HALF_UP })

export type Eth = string

export const parseEth = (v: Eth): Decimal => new D(v)

export const zeroEth = (): Eth => '0'

export const addEth = (a: Eth, b: Eth): Eth => formatEth(parseEth(a).add(b))

export const subEth = (a: Eth, b: Eth): Eth => formatEth(parseEth(a).sub(b))

export const cmpEth = (a: Eth, b: Eth): number => parseEth(a).cmp(parseEth(b))

export const mulQty = (price: Eth, qty: number): Eth => formatEth(parseEth(price).mul(qty))

export const percentOf = (amount: Eth, percent: number): Eth =>
  formatEth(parseEth(amount).mul(percent).div(100))

export function formatEth(v: Eth | Decimal, maxDecimals = 18): Eth {
  const s = (v instanceof D ? v : parseEth(v)).toDecimalPlaces(maxDecimals).toFixed()
  return s.includes('.') ? s.replace(/0+$/, '').replace(/\.$/, '') : s
}
