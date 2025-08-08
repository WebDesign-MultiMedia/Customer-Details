// === SheetDB phone search + Tailwind table (JUST JS) ===

const SHEETDB_URL = "https://sheetdb.io/api/v1/knvxv3inyom8t";

// DOM
const phoneInputEl = document.getElementById("phoneSearch");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("searchResults");

// Load all on start (optional). Comment this out if you only want searches.
window.addEventListener("DOMContentLoaded", async () => {
  const data = await fetchAll();
  renderOrdersTable(data, resultsDiv);
});

// Click + Enter to search
searchBtn.addEventListener("click", runSearch);
phoneInputEl.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    runSearch();
  }
});

async function runSearch() {
  const phonePattern = phoneInputEl.value.trim();
  if (!phonePattern) {
    toast("Please enter a phone number to search.");
    return;
  }

  try {
    setLoading(resultsDiv, true);
    const data = await fetchAll();

    const regex = safeUserRegex(phonePattern, "i");

    const results = data.filter((row) => {
      const contact = String(row.Contact ?? "");
      // Match either raw (regex) or digits-only "contains" for convenience
      const rawMatch = regex.test(contact);
      const digitsMatch = stripNonDigits(contact).includes(stripNonDigits(phonePattern));
      return rawMatch || digitsMatch;
    });

    renderOrdersTable(results, resultsDiv);
  } catch (err) {
    console.error(err);
    toast("Error searching. Check console.");
  } finally {
    setLoading(resultsDiv, false);
  }
}

// Fetch all rows from SheetDB
async function fetchAll() {
  const res = await fetch(SHEETDB_URL);
  if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
  return res.json();
}

// Tailwind table renderer
function renderOrdersTable(results, displayDiv) {
  displayDiv.innerHTML = "";

  if (!results || results.length === 0) {
    displayDiv.innerHTML = `
      <div class="p-4 text-center text-slate-700 bg-yellow-50 border border-yellow-200 rounded">
        No matches found.
      </div>`;
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "overflow-x-auto w-full";

  const table = document.createElement("table");
  table.className =
    "min-w-[900px] md:min-w-full w-full border-collapse text-center text-xs sm:text-sm rounded-xl overflow-hidden";

  table.innerHTML = `
    <thead class="bg-slate-800 text-white sticky top-0 z-10">
      <tr>
        <th class="px-3 py-2 font-semibold border border-slate-700">Id</th>
        <th class="px-3 py-2 font-semibold border border-slate-700">Date</th>
        <th class="px-3 py-2 font-semibold border border-slate-700">Time</th>
        <th class="px-3 py-2 font-semibold border border-slate-700">Name</th>
        <th class="px-3 py-2 font-semibold border border-slate-700">Phone</th>
        <th class="px-3 py-2 font-semibold border border-slate-700">Address</th>
        <th class="px-3 py-2 font-semibold border border-slate-700">Items</th>
        <th class="px-3 py-2 font-semibold border border-slate-700">Cost</th>
        <th class="px-3 py-2 font-semibold border border-slate-700">Payment Type</th>
        <th class="px-3 py-2 font-semibold border border-slate-700">P/D</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");

  results.forEach((order) => {
    const row = document.createElement("tr");
    row.className = "odd:bg-blue-900 even:bg-blue-800 text-white";

    row.innerHTML = `
      <td class="px-3 py-2 border border-slate-700 font-semibold">${safe(order.Id)}</td>
      <td class="px-3 py-2 border border-slate-700 whitespace-nowrap">${safe(order.Date)}</td>
      <td class="px-3 py-2 border border-slate-700 whitespace-nowrap">${safe(order.Time)}</td>
      <td class="px-3 py-2 border border-slate-700">${safe(order.Name)}</td>
      <td class="px-3 py-2 border border-slate-700">${safe(order.Contact)}</td>
      <td class="px-3 py-2 border border-slate-700 max-w-[240px] truncate" title="${safe(order.Address)}">${safe(order.Address)}</td>
      <td class="px-3 py-2 border border-slate-700">${safe(order.Items)}</td>
      <td class="px-3 py-2 border border-slate-700 whitespace-nowrap">${formatUSD(order.Cost)}</td>
      <td class="px-3 py-2 border border-slate-700">${safe(order.Payment)}</td>
      <td class="px-3 py-2 border border-slate-700">${safe(order.PickupDelivery)}</td>
    `;

    // Per-cell highlights
    row.children[0].classList.add("bg-rose-200", "text-rose-900"); // Id
    row.children[7].classList.add("bg-sky-200", "text-slate-900", "w-[10%]"); // Cost
    row.children[8].classList.add("bg-green-200", "text-slate-900"); // Payment
    row.children[9].classList.add("bg-rose-200", "text-slate-900"); // P/D

    tbody.appendChild(row);
  });

  wrapper.appendChild(table);
  displayDiv.appendChild(wrapper);
}

// Helpers
function formatUSD(v) {
  if (v == null || v === "") return "";
  const num = Number(String(v).replace(/[^\d.-]/g, ""));
  if (Number.isNaN(num)) return String(v);
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(num);
}

function safe(value) {
  return value == null ? "" : String(value);
}

function stripNonDigits(s) {
  return String(s ?? "").replace(/\D/g, "");
}

function escapeRegex(s) {
  return String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function safeUserRegex(input, flags = "") {
  try {
    return new RegExp(input, flags);
  } catch {
    // fall back to literal match if user typed a broken pattern
    return new RegExp(escapeRegex(input), flags);
  }
}

function setLoading(container, isLoading) {
  if (!isLoading) {
    const ld = container.querySelector("[data-loading]");
    if (ld) ld.remove();
    return;
  }
  container.innerHTML = "";
  const div = document.createElement("div");
  div.setAttribute("data-loading", "true");
  div.className = "p-4 text-center text-slate-700 bg-slate-100 border border-slate-200 rounded";
  div.textContent = "Loading…";
  container.appendChild(div);
}

function toast(msg) {
  alert(msg); // swap with SweetAlert if you like
}