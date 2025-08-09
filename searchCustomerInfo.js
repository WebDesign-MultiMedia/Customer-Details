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
  table.style.background = "white";
  table.style.color = "black";
  table.className = "border-collapse  text-center rounded-xl";

  // Table head (only once)
  table.innerHTML = `
    <thead>
      <tr>
        <th>Id</th>
        <th>Date</th>
        <th>Time</th>
        <th>Name</th>
        <th>Phone</th>
        <th>Address</th>
        <th>Items</th>
        <th>Cost</th>
        <th>Payment</th>
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
    row.style.border = "2px solid white";
    row.style.borderRight = "2px solid white";
    row.className = ' text-center'


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

    // row.querySelectorAll('td').forEach(td =>{
    //   td.style.padding = "10px";
    // })

    row.querySelectorAll('td')[0].style.borderRight = '2px solid white';
    row.querySelectorAll('td')[0].style.background = 'darkred';
    row.querySelectorAll('td')[0].style.width = '3em';
    row.querySelectorAll('td')[5].style.width = '10em';
    



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
