// Formatting for an event's date range, shared by the list and anywhere else a range is shown.
const time = (d) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
const day = (d, withYear) =>
  d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', ...(withYear && { year: 'numeric' }) })

export const sameDay = (a, b) => a.toDateString() === b.toDateString()

// "Tue, Mar 3 · 9:00 AM – 10:30 AM"  or, across days,  "Tue, Mar 3, 9:00 AM → Thu, Mar 5, 5:00 PM".
// The year is only shown when it isn't the current one.
export function formatRange(start, end) {
  const withYear = start.getFullYear() !== new Date().getFullYear() || end.getFullYear() !== start.getFullYear()
  if (sameDay(start, end)) return `${day(start, withYear)} · ${time(start)} – ${time(end)}`
  return `${day(start, withYear)}, ${time(start)} → ${day(end, withYear)}, ${time(end)}`
}

// "1h 30m", "45m", "2 days"
export function formatDuration(start, end) {
  const mins = Math.round((end - start) / 60000)
  if (mins >= 24 * 60) {
    const days = Math.round(mins / (24 * 60))
    return `${days} day${days === 1 ? '' : 's'}`
  }
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return [h && `${h}h`, m && `${m}m`].filter(Boolean).join(' ')
}

// 2026-03-03 in local time, for URLs and <input type="date">
export const toYmd = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
export const fromYmd = (s) => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}
