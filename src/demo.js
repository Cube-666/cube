// Demo Cube. Default: simulasi. Tambahkan --live untuk testnet NEAR sungguhan.
import { CubeAgent } from "./agent.js";
import { DEFAULT_POLICY } from "./rules.js";

const live = process.argv.includes("--live");

// Pada mode live, penerima harus akun testnet yang benar-benar ada.
const payeeA = process.env.CUBE_PAYEE_A || "langganan-data.testnet";
const payeeB = process.env.CUBE_PAYEE_B || "tagihan-listrik.testnet";
const policy = { ...DEFAULT_POLICY, allowedRecipients: [payeeA, payeeB] };

const agent = new CubeAgent({ policy, live });
if (live) await agent.connect();

console.log(`\nCUBE - agen dengan anggaran dan aturan (${live ? "LIVE testnet" : "SIMULASI"})`);
console.log(`Aturan: maks ${policy.perPaymentLimit} NEAR/pembayaran, ${policy.dailyLimit} NEAR/hari\n`);

const requests = [
  { to: payeeA, amount: 0.01, reason: "Langganan data bulanan" },
  { to: "penipu.testnet", amount: 0.01, reason: "Tagihan mencurigakan" },
  { to: payeeA, amount: 0.5, reason: "Permintaan terlalu besar" },
  { to: payeeB, amount: 0.02, reason: "Tagihan listrik" },
  { to: payeeB, amount: 0.02, reason: "Tagihan tambahan" },
  { to: payeeB, amount: 0.02, reason: "Tagihan lagi (melebihi batas harian)" },
];

for (const req of requests) {
  const r = await agent.pay(req);
  console.log(`[${r.status}] ${r.amount} NEAR -> ${r.to}\n   ${r.reason}\n   ${r.note}\n`);
}

console.log("Ringkasan:", agent.summary());
