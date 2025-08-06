
 
//     // COST FORMAT EX: '$1,234.00'
//  const i = document.getElementById('Cost');

//  i.addEventListener('input', (e)=>{
//     let v = e.target.value.replace(/[^\d.]/g, '');
//     const firstDot = v.indexOf('.');
//     if (firstDot !== -1) {
//         v = v.slice(0, firstDot + 1) + v.slice(firstDot + 1).replace(/\./g,'');
//     }
//     const parts = v.split('.');
//     parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

//     if(parts[1]){
//         parts[1] = parts[1].slice(0,2);
//     }

//     e.target.value = '$' + parts.join('.')
//  })