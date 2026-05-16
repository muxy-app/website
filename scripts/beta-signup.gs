/**
 * Google Apps Script that backs the /ios-beta signup form.
 *
 * SETUP
 * 1. Create a new Google Sheet. Make the first row these headers in order:
 *    timestamp | name | email | device | iosVersion | usage | userAgent | spot
 * 2. Extensions → Apps Script. Paste this file in as Code.gs.
 * 3. Set the SHEET_ID constant below to the ID in the sheet's URL
 *    (https://docs.google.com/spreadsheets/d/<SHEET_ID>/edit).
 * 4. Deploy → New deployment → type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 *    Copy the /exec URL it gives you. That's NEXT_PUBLIC_BETA_SIGNUP_URL.
 * 5. Each time you change CAPACITY or this script, redeploy as a new version.
 *
 * The form posts JSON as text/plain (no CORS preflight). The script
 * deduplicates by lowercased email and caps signups at CAPACITY (50).
 */

const SHEET_ID = "REPLACE_WITH_YOUR_SHEET_ID";
const SHEET_NAME = "Sheet1";
const CAPACITY = 50;

function doGet() {
  return jsonResponse({
    ok: true,
    count: getCount(),
    capacity: CAPACITY,
  });
}

function doPost(e) {
  let payload;
  try {
    payload = JSON.parse(e.postData.contents);
  } catch (err) {
    return jsonResponse({ ok: false, message: "invalid payload" });
  }

  const name = String(payload.name || "").trim().slice(0, 200);
  const email = String(payload.email || "").trim().toLowerCase().slice(0, 200);
  const device = String(payload.device || "").trim().slice(0, 200);
  const iosVersion = String(payload.iosVersion || "").trim().slice(0, 50);
  const usage = String(payload.usage || "").trim().slice(0, 2000);
  const userAgent = String(payload.userAgent || "").trim().slice(0, 500);

  if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse({ ok: false, message: "name and a valid email are required" });
  }

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = SpreadsheetApp
      .openById(SHEET_ID)
      .getSheetByName(SHEET_NAME);
    const values = sheet.getDataRange().getValues();
    // values[0] is the header row; existing entries start at index 1.
    const count = Math.max(0, values.length - 1);

    if (count >= CAPACITY) {
      return jsonResponse({
        ok: false,
        message: "full",
        count: count,
        capacity: CAPACITY,
      });
    }

    // Reject duplicates by email (column index 2 — third column).
    for (let i = 1; i < values.length; i++) {
      const existing = String(values[i][2] || "").toLowerCase();
      if (existing === email) {
        return jsonResponse({
          ok: true,
          duplicate: true,
          count: count,
          capacity: CAPACITY,
        });
      }
    }

    const spot = count + 1;
    sheet.appendRow([
      new Date(),
      name,
      email,
      device,
      iosVersion,
      usage,
      userAgent,
      spot,
    ]);

    return jsonResponse({
      ok: true,
      count: spot,
      capacity: CAPACITY,
    });
  } finally {
    lock.releaseLock();
  }
}

function getCount() {
  const sheet = SpreadsheetApp
    .openById(SHEET_ID)
    .getSheetByName(SHEET_NAME);
  // Subtract the header row.
  return Math.max(0, sheet.getLastRow() - 1);
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
