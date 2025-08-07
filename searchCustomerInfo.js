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
    const results = data.filter(row => regex.test(row.Contact));

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

  results.forEach(order => {
    const orderEl = document.createElement("div");
    orderEl.className = "border p-2 m-2 bg-gray-100 rounded";
    orderEl.innerHTML = `
      <p><strong>Date:</strong> ${order.Date}</p>
      <p><strong>Time:</strong> ${order.Time}</p>
      <p><strong>Name:</strong> ${order.Name}</p>
      <p><strong>Phone:</strong> ${order.Contact}</p>
      <p><strong>Address:</strong> ${order.Address}</p>
      <p><strong>Pickup/Delivery:</strong> ${order.PickupDelivery}</p>
      <p><strong>Items:</strong> ${order.Items}</p>
      <p><strong>Cost:</strong> $${order.Cost}</p>
      <p><strong>Payment:</strong> ${order.Payment}</p>
    `;
    displayDiv.appendChild(orderEl);
  });
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
