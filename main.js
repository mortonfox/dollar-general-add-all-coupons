function runSelect(event) {
  event.preventDefault();

  // Look for buttons with text like "Clip", "Add", "Add Deal"
  const buttons = Array.from(document.querySelectorAll('button, a'))
    .filter(el => {
      const txt = el.innerText.trim().toLowerCase();
      return txt === 'clip' || txt === 'add' || txt.includes('add deal');
    });

  let clicked = 0;
  for (const btn of buttons) {
    btn.click();
    clicked++;
  }

  alert(`Clicked ${clicked} coupon/deal buttons`);
}

function init() {
  // Avoid injecting twice
  if (document.getElementById('add_all_coupons')) return;

  const newbutton = document.createElement('button');
  newbutton.id = 'add_all_coupons';
  newbutton.style.cssText =
    'background-color: #fff600; color: #000000; font-weight: 700; border: none; padding: 6px 10px; margin: 10px; cursor: pointer; z-index:9999;';
  newbutton.appendChild(document.createTextNode('Add All Coupons/Deals'));
  newbutton.addEventListener('click', runSelect);

  // Insert button at top of body if no specific container is found
  const target = document.querySelector('.pages, main, body');
  if (target) {
    target.prepend(newbutton);
  } else {
    document.body.prepend(newbutton);
  }
}

init();

