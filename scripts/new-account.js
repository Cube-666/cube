// Membuat kunci baru untuk akun testnet NEAR (akun "implisit").
// Kunci rahasia ditulis ke file .env dan TIDAK ditampilkan di layar.
import { generateKeyPairSync } from "node:crypto";
import { existsSync, writeFileSync } from "node:fs";

const ALPHABET = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

function base58(bytes) {
  let n = BigInt("0x" + Buffer.from(bytes).toString("hex"));
  let out = "";
  while (n > 0n) {
    out = ALPHABET[Number(n % 58n)] + out;
    n /= 58n;
  }
  for (const b of bytes) {
    if (b === 0) out = "1" + out;
    else break;
  }
  return out;
}

if (existsSync(".env")) {
  console.log("File .env sudah ada. Tidak ditimpa. Hapus dulu kalau memang ingin membuat ulang.");
  process.exit(1);
}

const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const pub = Buffer.from(publicKey.export({ format: "jwk" }).x, "base64url");
const seed = Buffer.from(privateKey.export({ format: "jwk" }).d, "base64url");

const accountId = pub.toString("hex"); // akun implisit = kunci publik dalam hex
const secret = "ed25519:" + base58(Buffer.concat([seed, pub]));

writeFileSync(".env", `NEAR_ACCOUNT_ID=${accountId}\nNEAR_PRIVATE_KEY=${secret}\n`, { mode: 0o600 });

console.log("Akun testnet dibuat. Kunci rahasia disimpan di .env (jangan dibagikan).");
console.log("\nAlamat akun (aman dibagikan):\n" + accountId);
console.log("\nLangkah berikutnya: isi akun ini dengan token uji dari faucet.");
