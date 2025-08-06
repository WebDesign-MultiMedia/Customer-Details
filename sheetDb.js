// let form = document.getElementById('sheetdb-form');

// form.addEventListener('submit', (e)=>{
//     e.preventDefault();

//     fetch(form.action,{
//         method: "POST",
//         body: new
//     })
//   .then((response) => response.json())
//   .then((data) => console.log(data));
// })

const inputs = document.querySelectorAll('form input');
const formSelect = document.querySelectorAll('form select');
const formTextarea = document.querySelectorAll('form textarea');

inputs.forEach(input => {
  if (input.value.trim() === '') {
    input.style.border = '2px solid red';
  } else {
    input.style.border = '2px solid green';
  }
});

formSelect.forEach(s => {
  if (s.value.trim() === '') {
    s.style.border = '2px solid red';
  } else {
    s.style.border = '2px solid green';
  }
});
formTextarea.forEach(t => {
  if (t.value.trim() === '') {
    t.style.border = '2px solid red';
  } else {
    t.style.border = '2px solid green';
  }
});



// you can call that on form submit, or on each input's 'input' event:
inputs.forEach(input => {
  input.addEventListener('input', () => {
    if (input.value.trim() === '') {
      input.style.border = '2px solid red';
    } else {
      input.style.border = '2px solid green';
    }
  });
});
formSelect.forEach(s => {
  s.addEventListener('input', () => {
    if (s.value.trim() === '') {
      s.style.border = '2px solid red';
    } else {
      s.style.border = '2px solid green';
    }
  });
});
formTextarea.forEach(t => {
  t.addEventListener('input', () => {
    if (t.value.trim() === '') {
      t.style.border = '2px solid red';
    } else {
      t.style.border = '2px solid green';
    }
  });
});

let smtBtn = document.getElementById('custForm'); 

    // DATE FORMAT MM/DD/YYYY
    function formatDate(inputDate) {
        if (!inputDate) return '';
        const [year, month, day] = inputDate.split('-');
        return `${month}/${day}/${year}`;
    } 

    // TIME FORMAT 12 - HOUR
    function time12Hour(timeStr) {
        if(!timeStr) return '';
        let [hour, mintue] = timeStr.split(':');
        hour = parseInt(hour);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        if (hour === 0 ) {
            hour = 12;
        }
        return `${hour}:${mintue} ${ampm}`;
    }

   smtBtn.addEventListener('submit', async (event)=>{
    event.preventDefault();

    const dateInput = document.getElementById('Date').value;
    const formatteDate = formatDate(dateInput);
    const rawTime = document.getElementById('Time').value;
    const formattedTime = time12Hour(rawTime);


    async function gSheetSubmit() {
        const url = "https://sheetdb.io/api/v1/knvxv3inyom8t";
        const data = {
            Date : formatteDate ,
            Time : formattedTime ,
            Name : document.getElementById("Name").value,
            Contact : document.getElementById("Contact").value,
            Address : document.getElementById("Address").value,
            PickupDelivery: document.getElementById('PickupDelivery').value,
            Items : document.getElementById("Items").value,
            Cost : document.getElementById("Cost").value,
            Payment : document.getElementById("Payment").value,
        }
        try{
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type" : "application/json",
                },
            });
            if(!res.ok){
                throw new Error(`Response status: ${res.status}`);
            }
            const json = await res.json();
            console.log(json);
        } catch(err){
            console.error(err.message);
            
        }
    
        
    }

    await gSheetSubmit();

    

     swal("Submitted Successfully!", "...Keep on tracking!");
     document.getElementById('CustomerDetails').reset();
    setTimeout(() => {
       
    }, 3000);
});



