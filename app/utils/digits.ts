export function toPersianDigits(value: string | number) {
  return String(value).replace(/\d/g, digit => '۰۱۲۳۴۵۶۷۸۹'[Number(digit)] ?? digit)
}
