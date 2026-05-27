import { Injectable, UnauthorizedException } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { createHmac, timingSafeEqual } from "crypto"
import type { Request } from "express"

@Injectable()
export class SepayConfigService {
  constructor(private readonly config: ConfigService) {}

  getPaymentCodePrefix() {
    return (this.config.get<string>("SEPAY_PAYMENT_CODE_PREFIX") ?? "DH").toUpperCase()
  }

  getWebhookApiKey() {
    return this.config.get<string>("SEPAY_WEBHOOK_API_KEY") ?? ""
  }

  getBankInfo() {
    return {
      bankName: this.config.get<string>("SEPAY_BANK_NAME") ?? "",
      accountNumber: this.config.get<string>("SEPAY_BANK_ACCOUNT") ?? "",
      accountHolder: this.config.get<string>("SEPAY_ACCOUNT_HOLDER") ?? "",
    }
  }

  /** VietQR image URL — https://developer.sepay.vn/vi/sepay-webhooks/tao-qr-va-form-thanh-toan */
  buildQrImageUrl(params: {
    accountNumber: string
    bankName: string
    amount: number
    description: string
  }) {
    const query = new URLSearchParams({
      acc: params.accountNumber,
      bank: params.bankName,
      amount: String(params.amount),
      des: params.description,
    })
    return `https://qr.sepay.vn/img?${query.toString()}`
  }

  verifyWebhookRequest(req: Request) {
    const configuredKey = this.getWebhookApiKey()
    const hmacSecret = this.config.get<string>("SEPAY_WEBHOOK_HMAC_SECRET") ?? ""
    const strictMode = (this.config.get<string>("NODE_ENV") ?? "development") !== "development"

    if (!configuredKey && !hmacSecret) {
      if (strictMode) {
        throw new UnauthorizedException(
          "SePay webhook auth chưa cấu hình (cần SEPAY_WEBHOOK_API_KEY hoặc SEPAY_WEBHOOK_HMAC_SECRET)",
        )
      }
      return
    }

    if (!configuredKey) {
      const signature = req.headers["x-sepay-signature"]
      if (typeof signature === "string" && this.verifyHmac(req, signature)) return
      throw new UnauthorizedException("SePay webhook không hợp lệ")
    }

    const authorization = req.headers.authorization ?? ""
    const apiKeyMatch = authorization.match(/^Apikey\s+(.+)$/i)
    if (apiKeyMatch?.[1] && this.safeEqual(apiKeyMatch[1], configuredKey)) {
      return
    }

    const signature = req.headers["x-sepay-signature"]
    if (typeof signature === "string" && this.verifyHmac(req, signature)) {
      return
    }

    throw new UnauthorizedException("SePay webhook không hợp lệ")
  }

  private verifyHmac(req: Request, signature: string) {
    const secret = this.config.get<string>("SEPAY_WEBHOOK_HMAC_SECRET")
    if (!secret) return false

    const rawBody = (req as Request & { rawBody?: Buffer }).rawBody
    if (!rawBody) return false

    const expected = createHmac("sha256", secret).update(rawBody).digest("hex")
    return this.safeEqual(signature, expected)
  }

  private safeEqual(a: string, b: string) {
    const bufA = Buffer.from(a)
    const bufB = Buffer.from(b)
    if (bufA.length !== bufB.length) return false
    return timingSafeEqual(bufA, bufB)
  }
}
