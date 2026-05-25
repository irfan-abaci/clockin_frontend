/**
 * ISO-8601 datetime with the browser's local offset (not UTC `Z`).
 * Matches what the user picks in date/time inputs. Backend may normalize to UTC (`Z`); `Moments` displays in local time.
 */
const pad2 = (n) => String(n).padStart(2, '0');

export const toLocalOffsetIsoString = (date) => {
	const y = date.getFullYear();
	const mo = pad2(date.getMonth() + 1);
	const d = pad2(date.getDate());
	const h = pad2(date.getHours());
	const mi = pad2(date.getMinutes());
	const s = pad2(date.getSeconds());
	const offsetMin = -date.getTimezoneOffset();
	const sign = offsetMin >= 0 ? '+' : '-';
	const abs = Math.abs(offsetMin);
	const oh = pad2(Math.floor(abs / 60));
	const om = pad2(abs % 60);
	return `${y}-${mo}-${d}T${h}:${mi}:${s}${sign}${oh}:${om}`;
};

/**
 * @param {string} dateStr YYYY-MM-DD
 * @param {string} timeStr HH:mm or HH:mm:ss from `<input type="time">`
 * @param {Date} [fallback]
 */
export const buildLocalIsoTimestamp = (dateStr, timeStr, fallback = new Date()) => {
	const raw = timeStr && String(timeStr).trim() !== '' ? String(timeStr).trim() : toLocalOffsetIsoString(fallback).slice(11, 19);
	if (!dateStr) return toLocalOffsetIsoString(fallback);

	const parts = raw.split(':').map((p) => Number.parseInt(p, 10));
	const hours = parts[0];
	const minutes = Number.isFinite(parts[1]) ? parts[1] : 0;
	const seconds = Number.isFinite(parts[2]) ? parts[2] : 0;
	if (!Number.isFinite(hours) || !Number.isFinite(minutes) || !Number.isFinite(seconds)) {
		return toLocalOffsetIsoString(fallback);
	}

	const local = new Date(`${dateStr}T${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`);
	if (Number.isNaN(local.getTime())) return toLocalOffsetIsoString(fallback);
	return toLocalOffsetIsoString(local);
};

export default buildLocalIsoTimestamp;
