// Mengecek saldo akun testnet Cube. Butuh .env dan koneksi internet.
import { Account, JsonRpcProvider, yoctoToNear } from "near-api-js";

const id = process.env.NEAR_ACCOUNT_ID;
const key = process.env.NEAR_PRIVATE_KEY;
if (!id || !key) {
  console.log("Isi .env dulu (jalankan: node scripts/new-account.js)");
  process.exit(1);
}
const provider = new JsonRpcProvider({ url: "https://test.rpc.fastnear.com" });
const account = new Account(id, provider, key);

try {
  const balance = yoctoToNear(await account.getBalance(), 4);
  console.log(`Akun: ${id}\nSaldo: ${balance} NEAR`);
} catch (err) {
  console.log("Gagal membaca saldo. Kemungkinan akun belum diisi dari faucet.");
  console.log("Detail:", err.message);
}
