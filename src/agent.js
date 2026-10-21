// Agen Cube: memeriksa aturan, lalu membayar sendiri jika diizinkan.
import { evaluate, spentToday } from "./rules.js";

export class CubeAgent {
  constructor({ policy, live = false }) {
    this.policy = policy;
    this.live = live;
    this.ledger = [];
    this.account = null;
    this.NEAR = null;
  }

  // Hanya dipanggil pada mode --live (butuh akun testnet)
  async connect() {
    const { Account, JsonRpcProvider } = await import("near-api-js");
    const { NEAR } = await import("near-api-js/tokens");
    const id = process.env.NEAR_ACCOUNT_ID;
    const key = process.env.NEAR_PRIVATE_KEY;
    if (!id || !key) {
      throw new Error("NEAR_ACCOUNT_ID dan NEAR_PRIVATE_KEY belum diisi di file .env");
    }
    const provider = new JsonRpcProvider({ url: "https://test.rpc.fastnear.com" });
    this.account = new Account(id, provider, key);
    this.NEAR = NEAR;
  }

  async pay(request) {
    const decision = evaluate(this.policy, this.ledger, request);
    if (!decision.approved) {
      return { ...request, status: "DITOLAK", note: decision.reason };
    }

    let txInfo = "simulasi (tidak ada uang bergerak)";
    if (this.live) {
      const result = await this.account.transfer({
        token: this.NEAR,
        amount: this.NEAR.toUnits(String(request.amount)),
        receiverId: request.to,
      });
      txInfo =
        result?.transaction?.hash ?? result?.transaction_outcome?.id ?? "terkirim";
    }

    this.ledger.push({ to: request.to, amount: request.amount, time: Date.now() });
    return { ...request, status: "DIBAYAR", note: txInfo };
  }

  summary() {
    return {
      terpakaiHariIni: Number(spentToday(this.ledger).toFixed(4)),
      batasHarian: this.policy.dailyLimit,
    };
  }
}
