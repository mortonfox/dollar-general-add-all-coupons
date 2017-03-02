function runSelect(event) {
  event.preventDefault();

  var pods = document.getElementsByClassName('pod');

  // Click on every item.
  for (var pod of pods) {
    pod.click();
  }
}

function init() {
  // Make a new button for our action.
  var newbutton = document.createElement('button');
  newbutton.name = 'add_all_coupons';
  newbutton.id = 'add_all_coupons';
  newbutton.style.cssText = 'background-color: #fff600; color: #000000; font-weight: 700; border: none; padding: 6px 10px; margin: 0 0 15px 20px; cursor: pointer;';
  newbutton.appendChild(document.createTextNode('Add All Coupons'));
  newbutton.addEventListener('click', runSelect);

  // Try inserting the button after stacking-message
  var stacking_message = document.getElementsByClassName('stacking-message')[0];
  if (stacking_message)
    stacking_message.parentNode.insertBefore(newbutton, stacking_message.nextSibling);
  else {
    // On some coupon pages, stacking_message does not exist.
    // Try inserting the button before pages.
    var pages = document.getElementsByClassName('pages')[0];
    pages.parentNode.insertBefore(newbutton, pages);
  }
}

init();

// -- The End --
