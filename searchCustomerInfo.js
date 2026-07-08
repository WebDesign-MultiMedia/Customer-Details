const SHEETDB_URL = "https://sheetdb.io/api/v1/knvxv3inyom8t";

const SEARCH_FIELDS = {
  Contact: { label: "Phone number", icon: "fa-phone", type: "text", placeholder: "e.g. 555-0100" },
  Name: { label: "Customer name", icon: "fa-user", type: "text", placeholder: "e.g. Jane Doe" },
  Address: { label: "Address", icon: "fa-location-dot", type: "text", placeholder: "e.g. 123 Main St" },
  Date: { label: "Order date", icon: "fa-calendar-days", type: "date", placeholder: "" },
  Month: { label: "Order month", icon: "fa-calendar", type: "month", placeholder: "" },
};

// DATE FORMAT MM/DD/YYYY (matches the format sheetDb.js writes to the sheet)
function formatDateForSearch(inputDate) {
  if (!inputDate) return "";
  const [year, month, day] = inputDate.split("-");
  return `${month}/${day}/${year}`;
}

// row.Date is stored as MM/DD/YYYY; returns { month, year } as numbers, or null if unparsable
function parseStoredDate(dateStr) {
  if (!dateStr) return null;
  const [month, , year] = String(dateStr).split("/");
  if (!month || !year) return null;
  return { month: Number(month), year: Number(year) };
}

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Swap the input type/placeholder/label to match the selected search field
function updateSearchFieldUI() {
  const field = document.getElementById("searchField").value;
  const config = SEARCH_FIELDS[field];
  const input = document.getElementById("searchQuery");
  const label = document.getElementById("searchQueryLabel");

  input.type = config.type;
  input.placeholder = config.placeholder;
  input.value = "";
  label.innerHTML = `<i class="fa-solid ${config.icon}"></i> ${config.label}`;
}

// Fetch data & filter by the selected field
async function searchOrders(field, query) {
  const displayDiv = document.getElementById("searchResults");
  displayDiv.innerHTML = `
    <div class="col-span-full flex flex-col items-center gap-3 py-10 text-brand-goldlight/80">
      <i class="fa-solid fa-circle-notch fa-spin text-3xl"></i>
      <p>Searching orders...</p>
    </div>
  `;

  try {
    const res = await fetch(SHEETDB_URL);
    const data = await res.json();

    let results;
    if (field === "Date") {
      results = data.filter((row) => row.Date === query);
    } else if (field === "Month") {
      const [qYear, qMonth] = query.split("-").map(Number);
      results = data.filter((row) => {
        const parsed = parseStoredDate(row.Date);
        return parsed && parsed.month === qMonth && parsed.year === qYear;
      });
    } else {
      const regex = new RegExp(escapeRegex(query), "i");
      results = data.filter((row) => regex.test(row[field] || ""));
    }

    displayResults(results);
  } catch (err) {
    console.error("Error fetching data:", err);
    displayDiv.innerHTML = `
      <div class="col-span-full flex flex-col items-center gap-2 py-10 text-brand-coral">
        <i class="fa-solid fa-triangle-exclamation text-3xl"></i>
        <p>Something went wrong fetching orders. Try again.</p>
      </div>
    `;
  }
}

// Function to display matching results as glass order cards
function displayResults(results) {
  const displayDiv = document.getElementById("searchResults");
  displayDiv.innerHTML = "";

  if (results.length === 0) {
    displayDiv.innerHTML = `
      <div class="col-span-full flex flex-col items-center gap-2 py-10 text-white/70 stagger-in">
        <i class="fa-solid fa-folder-open text-3xl text-brand-goldlight/70"></i>
        <p>No matching orders found</p>
      </div>
    `;
    return;
  }

  results.forEach((order) => {
    const wrap = document.createElement("div");
    wrap.className = "tilt-wrap";

    const card = document.createElement("div");
    card.setAttribute("data-tilt", "");
    card.setAttribute("data-tilt-max", "4");
    card.className = "tilt glass-card p-5 stagger-in";
    card.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <span class="text-brand-goldlight font-semibold"><i class="fa-solid fa-hashtag"></i> ${order.Id ?? ""}</span>
        <span class="text-sm text-white/70"><i class="fa-solid fa-calendar-days"></i> ${order.Date ?? ""}</span>
      </div>
      <div class="space-y-1.5 text-sm">
        <p><i class="fa-solid fa-user text-brand-goldlight w-5"></i> ${order.Name ?? ""}</p>
        <p><i class="fa-solid fa-phone text-brand-teal w-5"></i> ${order.Contact ?? ""}</p>
        <p><i class="fa-solid fa-location-dot text-brand-coral w-5"></i> ${order.Address ?? ""}</p>
        <p><i class="fa-solid fa-clipboard-list text-brand-gold w-5"></i> ${order.Items ?? ""}</p>
      </div>
      <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/10">
        <span class="text-xs uppercase tracking-wide text-white/60"><i class="fa-solid fa-wallet"></i> ${order.Payment ?? ""}</span>
        <span class="text-lg font-bold text-brand-goldlight">$${order.Cost ?? "0"}</span>
      </div>
      <a href="invoice.html?id=${encodeURIComponent(order.Id ?? "")}" target="_blank" rel="noopener" class="btn-3d w-full justify-center mt-4 !py-2 text-sm">
        <i class="fa-solid fa-file-invoice-dollar"></i> Generate Invoice
      </a>
    `;

    wrap.appendChild(card);
    displayDiv.appendChild(wrap);
  });

  if (window.tiltAndStagger) {
    window.tiltAndStagger.applyStagger(displayDiv, "[data-stagger], .stagger-in", 70);
    displayDiv.querySelectorAll("[data-tilt]").forEach(window.tiltAndStagger.bindTilt);
  }
}

document.getElementById("searchField").addEventListener("change", updateSearchFieldUI);
updateSearchFieldUI();

document.getElementById("searchBtn").addEventListener("click", () => {
  const field = document.getElementById("searchField").value;
  const rawQuery = document.getElementById("searchQuery").value.trim();

  if (!rawQuery) {
    if (window.Swal) {
      Swal.fire({ title: `Enter a ${SEARCH_FIELDS[field].label.toLowerCase()}`, icon: "warning", theme: "dark", timer: 1400, showConfirmButton: false });
    } else {
      alert(`Please enter a ${SEARCH_FIELDS[field].label.toLowerCase()} to search`);
    }
    return;
  }

  const query = field === "Date" ? formatDateForSearch(rawQuery) : rawQuery;
  searchOrders(field, query);
});

document.getElementById("searchQuery").addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    document.getElementById("searchBtn").click();
  }
});
