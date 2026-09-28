export const INBOX_DOMAIN = 'inbox.dealbox.app'

export const GMAIL_FILTER_QUERY =
  'has:attachment filename:pdf (contract OR agreement OR "statement of work" OR SOW OR "influencer agreement" OR "creator agreement")'

function slug(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '')
}

/** Builds a unique-looking forwarding address, e.g. jane.doe.k7q2@inbox.dealbox.app */
export function generateInboxAddress(first: string, last: string) {
  const base = slug(`${first} ${last}`) || 'creator'
  const suffix = Math.random().toString(36).slice(2, 6)
  return `${base}.${suffix}@${INBOX_DOMAIN}`
}

/** Fake 9-digit code in the format Gmail's forwarding confirmation uses. */
export function fakeGmailConfirmationCode() {
  return String(Math.floor(100_000_000 + Math.random() * 900_000_000))
}

export function ageFromDob(dob: string): number | null {
  if (!dob) return null
  const d = new Date(dob)
  if (Number.isNaN(d.getTime())) return null
  const now = new Date()
  let age = now.getFullYear() - d.getFullYear()
  const m = now.getMonth() - d.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--
  return age
}
