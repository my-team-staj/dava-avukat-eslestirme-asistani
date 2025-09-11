// Küçük, bağımsız maskeleme yardımcıları

/**
 * İlk n karakteri açık bırakıp geri kalanı yıldızlar:
 *   maskName("Berat Durna") -> "Ber***"
 */
export function maskName(val, visible = 3) {
  if (!val) return "";
  const s = String(val).trim();
  if (s.length <= visible) return "*".repeat(Math.max(1, s.length));
  return s.slice(0, visible) + "*".repeat(s.length - visible);
}

/**
 * Telefonu 05xx *** ** ** formatında döndürür
 *   maskPhone("05321234567") -> "0532 *** ** **"
 *   maskPhone("+90 532 123 45 67") -> "+90 532 *** ** **"
 */
export function maskPhone(val) {
  if (!val) return "";
  const digits = String(val).replace(/[^\d+]/g, "");
  // +90 ile başlıyorsa koru
  const hasCountry = digits.startsWith("+");
  const onlyNums = digits.replace(/[^\d]/g, "");
  // ülke kodunu ayrıştır
  let prefix = "";
  let rest = onlyNums;
  if (hasCountry && onlyNums.startsWith("90") && onlyNums.length > 10) {
    prefix = "+90 ";
    rest = onlyNums.slice(2);
  }
  // 10 haneli TR numarası gibi düşün
  if (rest.length < 10) return prefix + rest.replace(/.(?=.{2,}$)/g, "*");
  return (
    prefix +
    rest.slice(0, 4) + // 05xx
    " *** ** **"
  );
}

/**
 * E-postayı isim kısmını kısmi gizleyerek döndürür
 *   maskEmail("ada.lovelace@example.com") -> "ada*********@example.com"
 */
export function maskEmail(val, visible = 3) {
  if (!val) return "";
  const s = String(val);
  const at = s.indexOf("@");
  if (at < 0) return maskName(s, visible);
  const left = s.slice(0, at);
  const right = s.slice(at);
  const keep = Math.min(left.length, visible);
  return left.slice(0, keep) + "*".repeat(Math.max(1, left.length - keep)) + right;
}

/**
 * Serbest metinleri kısmen gizlemek için basit bir versiyon:
 *   maskText("Gün Hukuk Bürosu", 3) -> "Gün*************"
 */
export function maskText(val, visible = 3) {
  if (!val) return "";
  const s = String(val);
  if (s.length <= visible) return "*".repeat(s.length);
  return s.slice(0, visible) + "*".repeat(s.length - visible);
}
