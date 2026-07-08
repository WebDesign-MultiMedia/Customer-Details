

const SHEETDB_URL = "https://sheetdb.io/api/v1/knvxv3inyom8t"; // your endpoint

// Load by invoice Id (SheetDB "Id" column)
async function loadInvoiceById(invoiceId) {
  try {
    const res = await fetch(`${SHEETDB_URL}/search?Id=${encodeURIComponent(invoiceId)}`);
    const rows = await res.json();
    if (!rows || !rows.length) {
      console.warn("No invoice found for Id:", invoiceId);
      return;
    }
    const row = rows[0];

    // Fill header info
    const byId = (id) => document.getElementById(id);
    if (byId("invCustomer")) byId("invCustomer").textContent = row.Name || "";
    if (byId("invDate")) byId("invDate").textContent = row.Date || "";
    if (byId("invNumber")) byId("invNumber").textContent = row.Id || "";
    if (byId("invType")) byId("invType").textContent = row.PickupDelivery || "—";
    if (byId("invAddress")) byId("invAddress").textContent = row.Address || "";
    if (byId("invPhoneNum")) byId("invPhoneNum").textContent = row.Contact || "";

    // Line item (Qty / Description / Unit Price / Amount)
    const tbody = byId("lineItemsBody");
    if (tbody) {
      tbody.innerHTML = ""; // clear any demo row
      const qty = toNumber(row.Quantity) || 1;
      const cost = toNumber(row.Cost) || 0;
      const unitPrice = qty ? cost / qty : cost;
      const tr = document.createElement("tr");
      tr.className = "border-b border-brand-navydeep/10";
      tr.innerHTML = `
        <td class="py-2 pr-2">${row.Quantity || 1}</td>
        <td class="py-2 pr-2">${row.Items || ""}</td>
        <td class="py-2 pr-2 text-right">${formatMoney(unitPrice)}</td>
        <td class="py-2 text-right font-semibold">${formatMoney(cost)}</td>
      `;
      tbody.appendChild(tr);
    }

    // Summary: subtotal, deposit (if any), balance/total due
    const summaryBlock = byId("summaryBlock");
    if (summaryBlock) {
      const cost = toNumber(row.Cost);
      const deposit = toNumber(row.Deposit);
      const hasDeposit = !isNaN(deposit) && deposit > 0;
      const totalDue = hasDeposit ? Math.max(cost - deposit, 0) : cost;
      summaryBlock.innerHTML = `
        <div class="flex justify-between py-1 text-brand-navydeep/70"><span>Subtotal</span><span>${formatMoney(cost)}</span></div>
        ${hasDeposit ? `<div class="flex justify-between py-1 text-brand-navydeep/70"><span>Deposit paid</span><span>-${formatMoney(deposit)}</span></div>` : ""}
        <div class="flex justify-between py-2 mt-1 border-t-2 border-brand-navydeep/20 font-bold text-base text-brand-navydeep"><span>${hasDeposit ? "Balance Due" : "Total Due"}</span><span>${formatMoney(totalDue)}</span></div>
      `;
    }
  } catch (err) {
    console.error("Error loading invoice:", err);
  }
}

// Helpers
function toNumber(v) {
  if (v == null) return NaN;
  // strip $ and commas if present
  const cleaned = String(v).replace(/[^0-9.\-]/g, "");
  return Number(cleaned);
}
function formatMoney(v) {
  const n = toNumber(v);
  if (isNaN(n)) return "";
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

  // PopUp Invoice search 

  // POP UP SEARCH
const popUp = document.getElementById('popUp');
const h2 = document.getElementById('invoiSrch');

// Create the element once
const popUpDiv = document.createElement('div');
popUpDiv.className = 'no-print absolute z-20 top-full mt-2 left-1/2 -translate-x-1/2 glass-card !bg-white/95 p-3 flex flex-col gap-2 items-center shadow-depth-md';
popUpDiv.innerHTML = `
  <input type="text" class="w-28 text-black text-center placeholder:text-gray-500 rounded-lg border border-black/10 px-2 py-1" placeholder="Invoice #">
  <button type="submit" id='btnInvoice' class="btn-3d !py-1.5 !px-4 text-sm">Load</button>
`;
popUpDiv.style.display = 'none'; // Hidden by default
h2.appendChild(popUpDiv);

// Toggle on click
popUp.addEventListener('click', () => {
  popUpDiv.style.display = (popUpDiv.style.display === 'none') ? 'block' : 'none';
});

document.getElementById('btnInvoice').addEventListener('click', ()=>{
  let invIn = popUpDiv.querySelector('input').value.trim()

  if (invIn) {
    loadInvoiceById(invIn);
    popUpDiv.style.display = 'none';
  }else{
    alert("Invoice Number!")
  }

})

// PRINT — scale the invoice down (if needed) so it always prints on a single
// page, no matter how much content it holds. `transform: scale()` alone only
// changes how the card *looks*; the browser still reserves the card's full
// unscaled height in the page flow (which is what print pagination measures),
// so the wrapper is also resized to the scaled-down box the card is shrunk
// into. Runs on beforeprint/afterprint so it applies whether print is
// triggered by this button, Ctrl/Cmd+P, or the browser menu.
const PRINT_PAGE = { widthIn: 8.5, heightIn: 11, marginIn: 0.4 };

function fitInvoiceToOnePage() {
  const wrap = document.getElementById('invoiceCardWrap');
  const card = document.getElementById('invoiceCard');
  if (!wrap || !card) return;

  // Clear any previous scaling and the entrance animation (which, having
  // already played on load, would otherwise permanently pin `transform` via
  // its `forwards` fill-mode and block our own transform from applying).
  card.style.animation = 'none';
  card.style.transform = 'none';
  wrap.style.width = '';
  wrap.style.height = '';

  const cardWidth = card.offsetWidth;
  const cardHeight = card.offsetHeight;
  const usableWidthPx = (PRINT_PAGE.widthIn - PRINT_PAGE.marginIn * 2) * 96;
  const usableHeightPx = (PRINT_PAGE.heightIn - PRINT_PAGE.marginIn * 2) * 96;
  const scale = Math.min(usableWidthPx / cardWidth, usableHeightPx / cardHeight, 1);

  card.style.transformOrigin = 'top left';
  card.style.transform = `scale(${scale})`;
  wrap.style.width = `${cardWidth * scale}px`;
  wrap.style.height = `${cardHeight * scale}px`;
}

function restoreInvoiceScale() {
  const wrap = document.getElementById('invoiceCardWrap');
  const card = document.getElementById('invoiceCard');
  if (!wrap || !card) return;
  card.style.animation = '';
  card.style.transform = '';
  card.style.transformOrigin = '';
  wrap.style.width = '';
  wrap.style.height = '';
}

window.addEventListener('beforeprint', fitInvoiceToOnePage);
window.addEventListener('afterprint', restoreInvoiceScale);

const printBtn = document.getElementById('printBtn');
if (printBtn) {
  printBtn.addEventListener('click', () => window.print());
}

// SAVE AS IMAGE
const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
  downloadBtn.addEventListener('click', async () => {
    const card = document.getElementById('invoiceCard');
    if (!card || !window.html2canvas) return;
    const canvas = await html2canvas(card, { backgroundColor: '#fdf8ee', scale: 2 });
    const link = document.createElement('a');
    const invoiceId = document.getElementById('invNumber')?.textContent?.trim();
    link.download = `invoice-${invoiceId || 'order'}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
}

// Auto-load an invoice when linked from search.html (invoice.html?id=123)
const urlParams = new URLSearchParams(window.location.search);
const preselectedId = urlParams.get('id');
if (preselectedId) {
  loadInvoiceById(preselectedId);
}

// SHARE (read-only) — a link with &share=1 hides everything that lets the
// viewer browse other invoices or reach the internal order/search tools, so
// a customer can only view/print/save the one invoice they were sent.
const isShareView = urlParams.get('share') === '1';
if (isShareView) {
  const lookupIcon = document.getElementById('popUp');
  const internalNav = document.getElementById('internalNav');
  const shareBtn = document.getElementById('shareBtn');
  const viewOnlyBadge = document.getElementById('viewOnlyBadge');
  if (lookupIcon) lookupIcon.style.display = 'none';
  if (internalNav) internalNav.style.display = 'none';
  if (shareBtn) shareBtn.style.display = 'none';
  if (viewOnlyBadge) viewOnlyBadge.classList.remove('hidden');
}

// Build a read-only share link for the currently loaded invoice and copy it
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
  shareBtn.addEventListener('click', async () => {
    const invoiceId = document.getElementById('invNumber')?.textContent?.trim();
    if (!invoiceId) {
      if (window.Swal) {
        Swal.fire({ title: 'Load an invoice first', icon: 'warning', theme: 'dark', timer: 1600, showConfirmButton: false });
      } else {
        alert('Load an invoice first (search its number using the icon next to "Receipt #").');
      }
      return;
    }

    const shareUrl = `${window.location.origin}${window.location.pathname}?id=${encodeURIComponent(invoiceId)}&share=1`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      if (window.Swal) {
        Swal.fire({ title: 'Read-only link copied!', text: shareUrl, icon: 'success', theme: 'dark', timer: 2200, showConfirmButton: false });
      } else {
        alert(`Read-only link copied:\n${shareUrl}`);
      }
    } catch (err) {
      // Clipboard API can be blocked (permissions, insecure context, etc.)
      if (window.Swal) {
        Swal.fire({ title: 'Copy this link', text: shareUrl, icon: 'info', theme: 'dark' });
      } else {
        prompt('Copy this read-only link:', shareUrl);
      }
    }
  });
}

