// Membuat dua akun testnet "penerima" untuk demo live (langganan data dan tagihan listrik).
// Kunci rahasia penerima sengaja dibuang: Cube hanya perlu mengirim uang ke mereka.
// Nama kedua akun ditambahkan ke .env sebagai CUBE_PAYEE_A dan CUBE_PAYEE_B.
import * as near from "@fastnear/api";
import { randomBytes } from "node:crypto";
import { appendFileSync, existsSync, readFileSync } from "node:fs";

if (!existsSync(".env")) {
  console.log("File .env belum ada. Jalankan dulu: node scripts/new-account.js");
  process.exit(1);
}
if (/^CUBE_PAYEE_A=/m.test(readFileSync(".env", "utf8"))) {
  console.log("Penerima sudah ada di .env. Tidak dibuat ulang.");
  process.exit(0);
}

near.config({ networkId: "testnet" });

async function makePayee(label) {
  const id = `cube-${label}-${randomBytes(3).toString("hex")}.testnet`;
  const privateKey = near.utils.privateKeyFromRandom();
  const publicKey = near.utils.publicKeyFromPrivate(privateKey);
  await near.createFundedTestnetAccount({ newAccountId: id, publicKey });
  console.log("Dibuat:", id);
  return id;
}

try {
  const a = await makePayee("data");
  const b = await makePayee("listrik");
  appendFileSync(".env", `CUBE_PAYEE_A=${a}\nCUBE_PAYEE_B=${b}\n`);
  console.log("\nSelesai. Penerima disimpan di .env.");
  console.log("Jalankan demo live: node --env-file=.env src/demo.js --live");
} catch (err) {
  console.log("Gagal:", err.message);
  process.exit(1);
}
