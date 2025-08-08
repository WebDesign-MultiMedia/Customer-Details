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

// Function to display matching results in HTML
function displayResults(results) {
  const displayDiv = document.getElementById("searchResults");
  displayDiv.innerHTML = "";

  if (results.length === 0) {
    displayDiv.innerHTML = `<p>No matches found</p>`;
    return;
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

  // Append the table to the display div
  displayDiv.appendChild(table);
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
