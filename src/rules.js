// Aturan anggaran Cube: menentukan apakah sebuah pembayaran boleh dilakukan.
// Tidak butuh jaringan, jadi bisa diuji kapan saja.

export const DEFAULT_POLICY = {
  dailyLimit: 0.05, // batas total per hari (NEAR)
  perPaymentLimit: 0.02, // batas per satu pembayaran (NEAR)
  allowedRecipients: ["langganan-data.testnet", "tagihan-listrik.testnet"],
};

function sameUtcDay(a, b) {
  return new Date(a).toISOString().slice(0, 10) === new Date(b).toISOString().slice(0, 10);
}

export function spentToday(ledger, now = Date.now()) {
  return ledger
    .filter((e) => sameUtcDay(e.time, now))
    .reduce((sum, e) => sum + e.amount, 0);
}

// request: { to, amount, reason }
export function evaluate(policy, ledger, request, now = Date.now()) {
  const { to, amount } = request;

  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return { approved: false, reason: "Jumlah tidak valid" };
  }
  if (!policy.allowedRecipients.includes(to)) {
    return { approved: false, reason: `Penerima ${to} tidak ada di daftar yang diizinkan` };
  }
  if (amount > policy.perPaymentLimit) {
    return {
      approved: false,
      reason: `Melebihi batas per pembayaran (${amount} > ${policy.perPaymentLimit} NEAR)`,
    };
  }
  const spent = spentToday(ledger, now);
  if (spent + amount > policy.dailyLimit + 1e-12) {
    return {
      approved: false,
      reason: `Melebihi batas harian (terpakai ${spent.toFixed(3)} dari ${policy.dailyLimit} NEAR)`,
    };
  }
  return { approved: true, reason: "Sesuai aturan" };
}
