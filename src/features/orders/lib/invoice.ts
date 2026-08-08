import type { Order, OrderStatus } from "../types/order-types";
import { formatDateTime, formatMoney } from "./format";

export interface InvoiceLabels {
  brand: string;
  title: string;
  print: string;
  order: string;
  placed: string;
  customer: string;
  phone: string;
  address: string;
  notes: string;
  status: string;
  items: string;
  product: string;
  quantity: string;
  unitPrice: string;
  lineTotal: string;
  total: string;
  noItems: string;
  noAddress: string;
  footer: string;
}

const STATUS_COLORS: Record<
  OrderStatus,
  { bg: string; text: string; border: string }
> = {
  pending: { bg: "#fef3c7", text: "#b45309", border: "#fcd34d" },
  confirmed: { bg: "#e0f2fe", text: "#0369a1", border: "#7dd3fc" },
  shipped: { bg: "#eff6ff", text: "#1d4ed8", border: "#93c5fd" },
  delivered: { bg: "#d1fae5", text: "#047857", border: "#6ee7b7" },
  cancelled: { bg: "#fef2f2", text: "#dc2626", border: "#fca5a5" },
};

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char] as string,
  );
}

const LOGO_SVG = `
<svg viewBox="0 0 24 24" width="44" height="44" style="display:block;flex:none" aria-hidden="true">
  <defs>
    <linearGradient id="swg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0066d6"/>
      <stop offset="1" stop-color="#06b6d4"/>
    </linearGradient>
  </defs>
  <rect width="24" height="24" rx="6.5" fill="url(#swg)"/>
  <path d="M9 9.4a3 3 0 0 1 6 0" fill="none" stroke="#ffffff" stroke-width="1.9" stroke-linecap="round"/>
  <path d="M6.7 11.2h10.6l-1 7.6a1.5 1.5 0 0 1-1.48 1.2H9.18a1.5 1.5 0 0 1-1.48-1.2l-1-7.6Z" fill="none" stroke="#ffffff" stroke-width="1.9" stroke-linejoin="round"/>
  <path d="M6.2 17.3c1.4 0 1.4-1 2.8-1s1.4 1 2.8 1 1.4-1 2.8-1 1.4 1 2.8 1 1.4-1 2.8-1 1.4 1 2.8 1" fill="none" stroke="#ffffff" stroke-width="1.7" stroke-linecap="round"/>
</svg>`;

export function printOrderInvoice(
  order: Order,
  labels: InvoiceLabels,
  dir: "ltr" | "rtl" = "ltr",
) {
  const address = order.shippingAddress;
  const addressLines = address
    ? [
        address.street,
        `${address.city}, ${address.state} ${address.postalCode}`.trim(),
        address.country,
      ].filter(Boolean)
    : [];

  const itemRows = (order.items ?? [])
    .map(
      (item) => `
        <tr>
          <td>${escapeHtml(item.productName)}</td>
          <td class="num">${item.quantity}</td>
          <td class="num">${formatMoney(item.unitPrice)}</td>
          <td class="num">${formatMoney(
            Number(item.unitPrice) * item.quantity,
          )}</td>
        </tr>`,
    )
    .join("");

  const statusColor = STATUS_COLORS[order.status] ?? STATUS_COLORS.pending;

  const addressBlock = addressLines.length
    ? `${addressLines.map(escapeHtml).join("<br/>")}`
    : escapeHtml(labels.noAddress);

  const win = window.open("about:blank", "_blank", "width=840,height=960");
  if (!win) return;

  win.document.write(`<!doctype html>
<html lang="${dir === "rtl" ? "ar" : "en"}" dir="${dir}">
<head>
<meta charset="utf-8"/>
<title>${escapeHtml(labels.title)} ${order.id}</title>
<style>
  * { box-sizing: border-box; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  html, body { margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
    color: #1a1a1a;
    background: #f4f6f8;
    -webkit-font-smoothing: antialiased;
    overflow-wrap: break-word;
    word-break: break-word;
  }
  @page { size: auto; margin: 10mm; }
  .sheet {
    max-width: 760px;
    margin: 32px auto;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 14px;
    box-shadow: 0 4px 24px rgba(15, 23, 42, 0.06);
    overflow: hidden;
  }
  .toolbar {
    position: sticky; top: 0; z-index: 10;
    display: flex; align-items: center; justify-content: center; gap: 14px;
    padding: 14px; background: #f4f6f8; border-bottom: 1px solid #e5e7eb;
  }
  .toolbar button {
    font-family: inherit; font-size: 14px; font-weight: 600;
    padding: 10px 22px; border: none; border-radius: 10px;
    background: #0066d6; color: #ffffff; cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 102, 214, 0.25);
  }
  .toolbar button:hover { background: #0056b8; }
  .toolbar .hint { font-size: 12px; color: #64748b; }
  @media print { .toolbar { display: none; } }
  .inner { padding: 40px 44px 32px; }
  .head { display: flex; align-items: flex-start; justify-content: space-between; gap: 24px; border-bottom: 2px solid rgba(0, 102, 214, 0.45); padding-bottom: 24px; }
  .brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
  .logo {
    display: flex; align-items: center; justify-content: center;
    width: 44px; height: 44px; border-radius: 12px; flex: none;
    box-shadow: 0 4px 10px rgba(0, 102, 214, 0.25);
  }
  .brand-name { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: -0.01em; }
  .brand-tag { margin: 2px 0 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; }
  .doc { text-align: end; min-width: 0; }
  .doc-title { margin: 0; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.14em; color: #0066d6; }
  .doc-id { margin: 4px 0 0; font-size: 26px; font-weight: 800; letter-spacing: -0.02em; }
  .pill {
    display: inline-block; margin-top: 10px; padding: 4px 12px;
    font-size: 12px; font-weight: 600; border-radius: 999px; border: 1px solid;
  }
  .meta { display: flex; gap: 16px; margin-top: 24px; flex-wrap: wrap; }
  .box { flex: 1 1 220px; min-width: 0; border: 1px solid #e5e7eb; border-radius: 10px; padding: 14px 16px; background: #fafbfc; }
  .box h2 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #0066d6; margin: 0 0 8px; }
  .box p { margin: 0; font-size: 13px; line-height: 1.7; overflow-wrap: anywhere; word-break: break-word; }
  .box .note { margin-top: 8px; padding-top: 8px; border-top: 1px dashed #e5e7eb; }
  table { width: 100%; border-collapse: collapse; margin-top: 28px; font-size: 14px; }
  thead th {
    padding: 10px 12px; border-bottom: 2px solid rgba(0, 102, 214, 0.45); background: #f8fafc;
    font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #0066d6; text-align: start;
  }
  td { padding: 12px; border-bottom: 1px solid #f1f5f9; vertical-align: top; overflow-wrap: anywhere; word-break: break-word; }
  td.num { text-align: end; white-space: nowrap; }
  tbody tr:last-child td { border-bottom: none; }
  .total-row td {
    border-top: 2px solid #e5e7eb; border-bottom: none;
    padding-top: 14px; font-weight: 700;
  }
  .total-row .total-label { text-align: start; font-size: 13px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; }
  .total-row .total-amount { font-size: 20px; color: #0066d6; text-align: end; }
  .footer { margin-top: 36px; padding-top: 18px; border-top: 1px solid #f1f5f9; text-align: center; color: #475569; font-size: 12px; }
  .footer b { color: #0066d6; font-weight: 700; }
  @media print {
    body { background: #ffffff; }
    .sheet { margin: 0; border: none; border-radius: 0; box-shadow: none; max-width: none; }
    .inner { padding: 28px 32px 20px; }
    thead { display: table-header-group; }
    tr { break-inside: avoid; }
  }
</style>
</head>
<body>
  <div class="toolbar">
    <button onclick="window.print()">${escapeHtml(labels.print)}</button>
    <span class="hint">Ctrl+P</span>
  </div>
  <div class="sheet">
    <div class="inner">
      <header class="head">
        <div class="brand">
          <span class="logo">${LOGO_SVG}</span>
          <div>
            <p class="brand-name">${escapeHtml(labels.brand)}</p>
            <p class="brand-tag">${escapeHtml(labels.title)}</p>
          </div>
        </div>
        <div class="doc">
          <p class="doc-title">${escapeHtml(labels.title)}</p>
          <p class="doc-id">#${order.id}</p>
          <span class="pill" style="background:${statusColor.bg};color:${statusColor.text};border-color:${statusColor.border}">
            ${escapeHtml(labels.status)}
          </span>
        </div>
      </header>

      <div class="meta">
        <div class="box">
          <h2>${escapeHtml(labels.customer)}</h2>
          <p>
            ${escapeHtml(order.customerName)}<br/>
            ${escapeHtml(order.customerEmail)}
            ${order.phone ? `<br/>${escapeHtml(order.phone)}` : ""}
          </p>
        </div>
        <div class="box">
          <h2>${escapeHtml(labels.address)}</h2>
          <p>${addressBlock}</p>
          ${order.notes
            ? `<p class="note"><strong>${escapeHtml(labels.notes)}</strong><br/>${escapeHtml(order.notes)}</p>`
            : ""}
        </div>
        <div class="box">
          <h2>${escapeHtml(labels.order)}</h2>
          <p>
            ${escapeHtml(labels.placed)}: ${formatDateTime(order.createdAt)}<br/>
            ${escapeHtml(labels.total)}: <strong>${formatMoney(order.total)}</strong>
          </p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>${escapeHtml(labels.product)}</th>
            <th class="num">${escapeHtml(labels.quantity)}</th>
            <th class="num">${escapeHtml(labels.unitPrice)}</th>
            <th class="num">${escapeHtml(labels.lineTotal)}</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows ||
          `<tr><td colspan="4">${escapeHtml(labels.noItems)}</td></tr>`}
        </tbody>
        <tfoot>
          <tr class="total-row">
            <td class="total-label" colspan="3">${escapeHtml(labels.total)}</td>
            <td class="total-amount">${formatMoney(order.total)}</td>
          </tr>
        </tfoot>
      </table>

      <p class="footer"><b>${escapeHtml(labels.brand)}</b> · ${escapeHtml(
        labels.footer,
      )}</p>
    </div>
  </div>
  <script>
    window.addEventListener("load", function () {
      setTimeout(function () {
        window.focus();
        window.print();
      }, 700);
    });
  </script>
</body>
</html>`);
  win.document.close();
  win.focus();
}
