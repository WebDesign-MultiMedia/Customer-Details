const SHEETDB_URL = "https://sheetdb.io/api/v1/knvxv3inyom8t";

// Function to fetch data & filter by phone number using regex
async function searchByPhone(phonePattern) {
  try {
    // 1. Fetch all data from SheetDB
    const res = await fetch(SHEETDB_URL);
    const data = await res.json();

    // 2. Create regex (case-insensitive, partial match)
    const regex = new RegExp(phonePattern, "i");

    // 3. Filter rows where Contact matches regex
    const results = data.filter((row) => regex.test(row.Contact));

    // 4. Display results
    displayResults(results);
  } catch (err) {
    console.error("Error fetching data:", err);
  }
}

// Create the table
  const table = document.createElement("table");
  table.style.background = "gray";
  table.style.color = "white";

  table.className = "border-collapse border w-full text-center rounded-xl";

  // Table head (only once)
  table.innerHTML = `
    <thead class="text-blue-200" id="t">
      <tr class="bg-green-200">
        <th class="bg-pink-200">Id</th>
        <th>Date</th>
        <th>Time</th>
        <th>Name</th>
        <th>Phone</th>
        <th>Address</th>
        <th>Items</th>
        <th>Cost</th>
        <th>Payment Type</th>
        <th>P/D</th>
        </tr>
    </thead>
    <tbody></tbody>
  `;

  const tbody = table.querySelector("tbody");

  // Loop through results to create rows
  results.forEach((order) => {
    const row = document.createElement("tr");
    row.style.background = "#00499c";
    row.style.color = "white";
    row.style.textAlign = "center";
  row.className = ' text-center border-2 border-white'

    row.innerHTML = `
      <td>${order.Id}</td>
      <td >${order.Date}</td>
      <td>${order.Time}</td>
      <td>${order.Name}</td>
      <td>${order.Contact}</td>
      <td>${order.Address}</td>
      <td>${order.Items}</span></td>
      <td>$${order.Cost}</td>
      <td>${order.Payment}</td>
      <td>${order.PickupDelivery}</td>
    `;

    row.querySelectorAll('td').forEach(td =>{
      td.style.padding = "10px";
    })
    row.querySelectorAll('td')[0].style.background = 'lightcoral';
    row.querySelectorAll('td')[0].style.fontWeight = 'bold';

    row.querySelectorAll('td')[7].style.background = 'lightblue';
    row.querySelectorAll('td')[7].style.width = '10%';
    row.querySelectorAll('td')[8].style.background = 'lightgreen';
    row.querySelectorAll('td')[9].style.background = 'lightcoral';


    tbody.appendChild(row);
  });

function renderOrdersTable(results, displayDiv) {
  // scrollable wrapper for mobile
  const wrapper = document.createElement('div');
  wrapper.className = 'overflow-x-auto w-full';

  // table
  const table = document.createElement('table');
  table.className =
    'min-w-[900px] md:min-w-full w-full border-collapse text-center text-xs sm:text-sm rounded-xl overflow-hidden';

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

  const tbody = table.querySelector('tbody');

  results.forEach(order => {
    const row = document.createElement('tr');
    row.className = 'odd:bg-blue-900 even:bg-blue-800 text-white';

    row.innerHTML = `
      <td class="px-3 py-2 border border-slate-700 font-semibold">${order.Id ?? ''}</td>
      <td class="px-3 py-2 border border-slate-700 whitespace-nowrap">${order.Date ?? ''}</td>
      <td class="px-3 py-2 border border-slate-700 whitespace-nowrap">${order.Time ?? ''}</td>
      <td class="px-3 py-2 border border-slate-700">${order.Name ?? ''}</td>
      <td class="px-3 py-2 border border-slate-700">${order.Contact ?? ''}</td>
      <td class="px-3 py-2 border border-slate-700 max-w-[240px] truncate" title="${order.Address ?? ''}">${order.Address ?? ''}</td>
      <td class="px-3 py-2 border border-slate-700">${order.Items ?? ''}</td>
      <td class="px-3 py-2 border border-slate-700 whitespace-nowrap">${formatUSD(order.Cost)}</td>
      <td class="px-3 py-2 border border-slate-700">${order.Payment ?? ''}</td>
      <td class="px-3 py-2 border border-slate-700">${order.PickupDelivery ?? ''}</td>
    `;

    // Per-cell highlights (no inline styles)
    row.children[0].classList.add('bg-rose-200','text-rose-900');         // Id
    row.children[7].classList.add('bg-sky-200','text-slate-900','w-[10%]'); // Cost
    row.children[8].classList.add('bg-green-200','text-slate-900');       // Payment
    row.children[9].classList.add('bg-rose-200','text-slate-900');        // P/D

    tbody.appendChild(row);
  });

  wrapper.appendChild(table);
  displayDiv.innerHTML = '';
  displayDiv.appendChild(wrapper);
}

// Optional: currency formatter
function formatUSD(v) {
  const n = Number(v);
  if (Number.isNaN(n)) return v ? String(v) : '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);
}


// Example: Search on button click
document.getElementById("searchBtn").addEventListener("click", () => {
  const phoneInput = document.getElementById("phoneSearch").value.trim();
  if (phoneInput) {
    searchByPhone(phoneInput);
  } else {
    alert("Please enter a phone number to search");
  }
});
