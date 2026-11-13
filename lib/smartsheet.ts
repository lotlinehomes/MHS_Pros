/**
 * Smartsheet integration — writes each quote request as a row in the "MHS Pros" sheet.
 *
 * Setup: set SMARTSHEET_ACCESS_TOKEN in Vercel (Settings → Environment Variables).
 * On the first request the sheet is found by name, or created with the columns below
 * if it doesn't exist yet. Optional env vars:
 *   SMARTSHEET_SHEET_ID    pin a specific sheet (skips the lookup by name)
 *   SMARTSHEET_SHEET_NAME  defaults to "MHS Pros"
 *   SMARTSHEET_API_BASE    defaults to https://api.smartsheet.com/2.0 (EU: https://api.smartsheet.eu/2.0)
 *
 * Server-only: the token is never sent to the browser.
 */

type ColumnType = "TEXT_NUMBER" | "CHECKBOX" | "DATE" | "PICKLIST";
type ColumnDef = { title: string; type: ColumnType; primary?: true; options?: string[]; width?: number };
export type RowValues = Record<string, string | number | boolean | null | undefined>;

/** Column layout of the "MHS Pros" sheet. Titles are how rows are matched — keep them stable. */
export const COLUMNS: ColumnDef[] = [
  { title: "Name", type: "TEXT_NUMBER", primary: true, width: 180 },
  { title: "Status", type: "PICKLIST", options: ["New", "Contacted", "Quote sent", "Won", "Lost"], width: 110 },
  { title: "Submitted (UTC)", type: "TEXT_NUMBER", width: 150 },
  { title: "Estimate Low", type: "TEXT_NUMBER", width: 110 },
  { title: "Estimate High", type: "TEXT_NUMBER", width: 110 },
  { title: "Estimate Per Home", type: "TEXT_NUMBER", width: 170 },
  { title: "Needs Review", type: "CHECKBOX", width: 90 },
  { title: "Review Notes", type: "TEXT_NUMBER", width: 280 },
  { title: "Line Items", type: "TEXT_NUMBER", width: 360 },
  { title: "Phone", type: "TEXT_NUMBER", width: 130 },
  { title: "Email", type: "TEXT_NUMBER", width: 200 },
  { title: "Customer Type", type: "TEXT_NUMBER", width: 130 },
  { title: "Street", type: "TEXT_NUMBER", width: 180 },
  { title: "City", type: "TEXT_NUMBER", width: 120 },
  { title: "State", type: "TEXT_NUMBER", width: 70 },
  { title: "ZIP", type: "TEXT_NUMBER", width: 80 },
  { title: "Home Type", type: "TEXT_NUMBER", width: 140 },
  { title: "# Homes", type: "TEXT_NUMBER", width: 80 },
  { title: "Home Size", type: "TEXT_NUMBER", width: 110 },
  { title: "Home Status", type: "TEXT_NUMBER", width: 160 },
  { title: "Pad Needed", type: "TEXT_NUMBER", width: 100 },
  { title: "Foundation", type: "TEXT_NUMBER", width: 170 },
  { title: "Installation", type: "CHECKBOX", width: 90 },
  { title: "Trim Out", type: "CHECKBOX", width: 80 },
  { title: "Skirting", type: "TEXT_NUMBER", width: 90 },
  { title: "Deck", type: "CHECKBOX", width: 70 },
  { title: "Grading / Landscaping", type: "CHECKBOX", width: 110 },
  { title: "Driveway", type: "CHECKBOX", width: 80 },
  { title: "Mechanical", type: "CHECKBOX", width: 90 },
  { title: "Electrical", type: "CHECKBOX", width: 90 },
  { title: "Plumbing", type: "CHECKBOX", width: 90 },
  { title: "Demolition", type: "CHECKBOX", width: 90 },
  { title: "Demolition Sq Ft", type: "TEXT_NUMBER", width: 110 },
  { title: "Target Setup Date", type: "DATE", width: 120 },
  { title: "Notes", type: "TEXT_NUMBER", width: 280 },
  { title: "SMS Consent", type: "CHECKBOX", width: 90 },
  { title: "Price List", type: "TEXT_NUMBER", width: 200 },
  { title: "Source", type: "TEXT_NUMBER", width: 150 },
];

const API = () => (process.env.SMARTSHEET_API_BASE || "https://api.smartsheet.com/2.0").replace(/\/$/, "");
const SHEET_NAME = () => process.env.SMARTSHEET_SHEET_NAME || "MHS Pros";

export const smartsheetConfigured = () => Boolean(process.env.SMARTSHEET_ACCESS_TOKEN);

async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.SMARTSHEET_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    signal: AbortSignal.timeout(10_000),
    cache: "no-store",
  });
  const body = (await res.json().catch(() => ({}))) as { message?: string; errorCode?: number };
  if (!res.ok) throw new Error(`Smartsheet ${init.method || "GET"} ${path} failed: ${res.status} ${body.errorCode ?? ""} ${body.message ?? ""}`.trim());
  return body as T;
}

type Column = { id: number; title: string };
type SheetTarget = { sheetId: number; columns: Map<string, number> };

// Cached per server instance so we only look the sheet up once.
let target: Promise<SheetTarget> | null = null;

async function resolveSheet(): Promise<SheetTarget> {
  let sheetId = Number(process.env.SMARTSHEET_SHEET_ID) || 0;

  if (!sheetId) {
    const list = await api<{ data: { id: number; name: string }[] }>("/sheets?includeAll=true");
    sheetId = list.data.find((s) => s.name === SHEET_NAME())?.id ?? 0;
  }

  if (!sheetId) {
    const created = await api<{ result: { id: number; permalink?: string; columns: Column[] } }>("/sheets", {
      method: "POST",
      body: JSON.stringify({ name: SHEET_NAME(), columns: COLUMNS }),
    });
    console.log(`[smartsheet] created sheet "${SHEET_NAME()}" id=${created.result.id} ${created.result.permalink ?? ""}`);
    return { sheetId: created.result.id, columns: new Map(created.result.columns.map((c) => [c.title, c.id])) };
  }

  // Existing sheet: map titles → ids and add any of our columns that are missing.
  const existing = await api<{ data: Column[] }>(`/sheets/${sheetId}/columns?includeAll=true`);
  const columns = new Map(existing.data.map((c) => [c.title, c.id]));
  const missing = COLUMNS.filter((c) => !columns.has(c.title) && !c.primary);
  if (missing.length) {
    const added = await api<{ result: Column[] }>(`/sheets/${sheetId}/columns`, {
      method: "POST",
      body: JSON.stringify(missing.map((c, i) => ({ ...c, index: existing.data.length + i }))),
    });
    for (const c of added.result) columns.set(c.title, c.id);
  }
  return { sheetId, columns };
}

/** Append one row (newest at the top). Values are matched to columns by title. */
export async function addRow(values: RowValues): Promise<void> {
  if (!smartsheetConfigured()) throw new Error("SMARTSHEET_ACCESS_TOKEN is not set");
  target ??= resolveSheet().catch((err) => {
    target = null; // let the next request retry
    throw err;
  });
  const { sheetId, columns } = await target;

  const cells = Object.entries(values)
    .filter(([title, v]) => columns.has(title) && v !== undefined && v !== null && v !== "")
    .map(([title, value]) => ({ columnId: columns.get(title)!, value: typeof value === "string" ? value.slice(0, 4000) : value }));

  await api(`/sheets/${sheetId}/rows`, { method: "POST", body: JSON.stringify([{ toTop: true, cells }]) });
}
