// Membuat akun testnet BERNAMA (xxx.testnet) dan mengisinya lewat faucet resmi NEAR,
// memakai kunci yang sudah ada di .env. Setelah berhasil, .env diperbarui otomatis.
// Pemakaian: node scripts/fund-testnet.js [nama.testnet]
import * as near from "@fastnear/api";
import { randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

if (!existsSync(".env")) {
  console.log("File .env belum ada. Jalankan dulu: node scripts/new-account.js");
  process.exit(1);
}

const envText = readFileSync(".env", "utf8");
const keyMatch = envText.match(/^NEAR_PRIVATE_KEY=(.+)$/m);
if (!keyMatch) {
  console.log("NEAR_PRIVATE_KEY tidak ditemukan di .env");
  process.exit(1);
}
const privateKey = keyMatch[1].trim();

const newAccountId = process.argv[2] || `cube-${randomBytes(3).toString("hex")}.testnet`;
if (!/^[a-z0-9_-]+\.testnet$/.test(newAccountId)) {
  console.log("Nama harus huruf kecil/angka/-/_ dan berakhiran .testnet (contoh: cube-demo.testnet)");
  process.exit(1);
}

near.config({ networkId: "testnet" });
const publicKey = near.utils.publicKeyFromPrivate(privateKey);

console.log(`Membuat akun ${newAccountId} lewat faucet testnet...`);
try {
  const result = await near.createFundedTestnetAccount({ newAccountId, publicKey });
  console.log("Jawaban faucet:", JSON.stringify(result));
} catch (err) {
  console.log("Gagal membuat akun:", err.message);
  console.log("Coba lagi dengan nama lain, atau tunggu beberapa menit (faucet bisa dibatasi).");
  process.exit(1);
}

const updated = envText.replace(/^NEAR_ACCOUNT_ID=.*$/m, `NEAR_ACCOUNT_ID=${newAccountId}`);
writeFileSync(".env", updated, { mode: 0o600 });
console.log(`\nBerhasil. Akun Cube sekarang: ${newAccountId}`);
console.log("Cek saldo: node --env-file=.env scripts/balance.js");
