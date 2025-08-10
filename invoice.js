

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
    if (byId("invAddress")) byId("invAddress").textContent = row.Address || "";
    if (byId("invPhoneNum")) byId("invPhoneNum").textContent = row.Contact || "";
    if (byId("invDeposit")) byId("invDeposit").textContent = row.Deposit || "";

    // Line items table (single line from your sheet fields)
    const tbody = byId("lineItemsBody");
    if (tbody) {
      tbody.innerHTML = ""; // clear any demo row
      const tr = document.createElement("tr");
      tr.className = 'w-full';
      tr.innerHTML = `
        <td>${row.Items || ""}</td>
        <td>${row.Payment || ""}</td>
        <td>${formatMoney(row.Cost)}</td>
      `;
      tr.querySelectorAll('td')[0].style.width = '20em';
      tr.querySelectorAll('td')[0].style.padding = '20px';
      tr.querySelectorAll('td')[1].style.width = '10em';
      tr.querySelectorAll('td')[2].style.width = '10em';

      tbody.appendChild(tr);
    }

    // Optional deposit section if you have a "Deposit" column
    const depositBody = byId("depositBody");
    if (depositBody) {
      depositBody.innerHTML = "";
      const deposit = toNumber(row.Deposit);
      const cost = toNumber(row.Cost);
      if (!isNaN(deposit)) {
        const remaining = Math.max(cost - deposit, 0);
        const trDep = document.createElement("tr");
        trDep.innerHTML = `
          <td>${formatMoney(deposit)}</td>
          <td>${formatMoney(remaining)} Remaining</td>
        `;
        depositBody.appendChild(trDep);
      } else {
        // If no deposit, you can hide the section or show zeros
        // depositBody.parentElement.parentElement.style.display = "none";
      }
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

// EXAMPLE: load invoice #345 (matches your demo)
loadInvoiceById("707");

// If you prefer to load the latest invoice instead, use this:
// loadLatestInvoice();
// async function loadLatestInvoice() {
//   const res = await fetch(SHEETDB_URL);
//   const data = await res.json();
//   // sort by Id numerically descending; adjust if your Id is text
//   data.sort((a, b) => Number(b.Id) - Number(a.Id));
//   if (data.length) loadInvoiceById(data[0].Id);
// }

  // PopUp Invoice search 

  // POP UP SEARCH
const popUp = document.getElementById('popUp');
const h2 = document.getElementById('invoiSrch');

// Create the element once
const popUpDiv = document.createElement('div');
popUpDiv.innerHTML = `
  <input type="text" class="w-20 placeholder:text-center placeholder:text-gray-500 mb-2" placeholder="Invoice #">
  <button type="submit" id='btnInvoice' class="bg-red-500 border-2 border-white text-white w-20 rounded-lg p-2">Invoice</button>
`;
popUpDiv.style.display = 'none'; // Hidden by default
h2.appendChild(popUpDiv);

// Toggle on click
popUp.addEventListener('click', () => {
  popUpDiv.style.display = (popUpDiv.style.display === 'none') ? 'block' : 'none';
});
