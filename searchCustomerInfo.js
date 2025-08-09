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
  // table.style.marginLeft = "1em";
  // table.style.borderRadius = '10px';
  table.style.color = "black";

  // Table head (only once)
  table.innerHTML = `
    <thead>
      <tr>
        <th>Id</th>
        <th>Date</th>
        <th>Phone</th>
        <th>Address</th>
        <th>Items</th>
        <th>Cost</th>
        <th>Payment</th>
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
    row.style.borderBottom = "2px solid white";
    row.className = ' text-center'


    row.innerHTML = `
      <td>${order.Id}</td>
      <td >${order.Date}</td>
      <td>${order.Contact}</td>
      <td>${order.Address}</td>
      <td>${order.Items}</span></td>
      <td>$${order.Cost}</td>
      <td>${order.Payment}</td>
    `;

    // row.querySelectorAll('td').forEach(td =>{
    //   td.style.padding = "10px";
    // })

    // row.querySelectorAll('td')[0].style.borderRight = '2px solid white';
     row.querySelectorAll('td')[0].style.borderBottom = '2px solid white ';
     row.querySelectorAll('td')[0].style.borderRight = '2px solid white';

    // row.querySelectorAll('td')[1].style.background = 'green';
    // row.querySelectorAll('td')[2].style.background = 'blue';
    // row.querySelectorAll('td')[3].style.background = 'lightcoral';
    // row.querySelectorAll('td')[4].style.background = 'yellow';
    // row.querySelectorAll('td')[5].style.background = 'yellow';
    // row.querySelectorAll('td')[6].style.background = 'yellow';
    // row.querySelectorAll('td')[0].style.width = '3em';
    // row.querySelectorAll('td')[5].style.width = '10em';
    



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
