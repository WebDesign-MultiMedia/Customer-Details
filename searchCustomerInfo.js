// === Config ===
const SHEETDB_URL = "https://sheetdb.io/api/v1/knvxv3inyom8t";

document.addEventListener("DOMContentLoaded", () => {
  const phoneInput = document.getElementById("phoneSearch");
  const searchBtn = document.getElementById("searchBtn");
  const resultsDiv = document.getElementById("searchResults");

  async function searchByPhone(phoneQuery) {
    // Build a forgiving phone matcher: ignores spaces/dashes/() between digits
    const digits = (phoneQuery || "").replace(/\D/g, "");
    if (!digits) {
      resultsDiv.textContent = "Please enter a phone number to search.";
      return;
    }
    const pattern = digits.split("").join("\\D*"); // e.g. 347 -> /3\D*4\D*7/i
    const phoneRegex = new RegExp(pattern, "i");

    resultsDiv.textContent = "Loading...";

    try {
      const res = await fetch(SHEETDB_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Filter rows whose Contact matches the flexible regex
      const results = data.filter((row) =>
        phoneRegex.test(String(row?.Contact ?? ""))
      );

      if (!results.length) {
        resultsDiv.textContent = "No matches found.";
        return;
      }

      renderOrdersTable(results, resultsDiv);
    } catch (err) {
      console.error("Error fetching data:", err);
      resultsDiv.textContent = "Error fetching data. Try again.";
    }
  }

  function renderOrdersTable(results, displayDiv) {
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

      // Safely pull values
      const id = order?.Id ?? "";
      const date = order?.Date ?? "";
      const time = order?.Time ?? "";
      const name = order?.Name ?? "";
      const contact = order?.Contact ?? "";
      const address = order?.Address ?? "";
      const items = order?.Items ?? "";
      const cost = order?.Cost ?? "";
      const payment = order?.Payment ?? "";
      const pd = order?.PickupDelivery ?? "";

      row.innerHTML = `
        <td class="px-3 py-2 border border-slate-700 font-semibold">${id}</td>
        <td class="px-3 py-2 border border-slate-700 whitespace-nowrap">${date}</td>
        <td class="px-3 py-2 border border-slate-700 whitespace-nowrap">${time}</td>
        <td class="px-3 py-2 border border-slate-700">${name}</td>
        <td class="px-3 py-2 border border-slate-700">${contact}</td>
        <td class="px-3 py-2 border border-slate-700 max-w-[240px] truncate" title="${escapeAttr(address)}">${address}</td>
        <td class="px-3 py-2 border border-slate-700">${items}</td>
        <td class="px-3 py-2 border border-slate-700 whitespace-nowrap">${formatUSD(cost)}</td>
        <td class="px-3 py-2 border border-slate-700">${payment}</td>
        <td class="px-3 py-2 border border-slate-700">${pd}</td>
      `;

      // Highlight certain cells (via classes, not inline styles)
      row.children[0].classList.add("bg-rose-200", "text-rose-900"); // Id
      row.children[7].classList.add("bg-sky-200", "text-slate-900", "w-[10%]"); // Cost
      row.children[8].classList.add("bg-green-200", "text-slate-900"); // Payment
      row.children[9].classList.add("bg-rose-200", "text-slate-900"); // P/D

      tbody.appendChild(row);
    });

    wrapper.appendChild(table);
    displayDiv.innerHTML = "";
    displayDiv.appendChild(wrapper);
  }

  function formatUSD(v) {
    const n = Number(String(v).replace(/[^\d.-]/g, ""));
    if (Number.isNaN(n)) return v ? String(v) : "";
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
  }

  function escapeAttr(s) {
    return String(s).replace(/"/g, "&quot;");
  }

  function handleSearch() {
    const q = phoneInput.value.trim();
    searchByPhone(q);
  }

  searchBtn.addEventListener("click", handleSearch);
  phoneInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  });
});