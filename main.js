function runSelect(event) {
  event.preventDefault();

  // Find all buttons on the page
  const buttons = document.querySelectorAll('button');

  // Filter for buttons that add coupons and click them
  buttons.forEach(button => {
    // Check for "Add Deal" text, but also make sure it's not already added
    const dealText = button.querySelector('span');
    if (dealText && dealText.textContent.trim() === 'Add Deal') {
      button.click();
    }
  });
}

function init() {
  // Make a new button for our action.
  const newButton = document.createElement('button');
  newButton.name = 'add_all_coupons';
  newButton.id = 'add_all_coupons';
  newButton.style.cssText = 'background-color: #fff600; color: #000000; font-weight: 700; border: none; padding: 10px 15px; margin: 20px 0; cursor: pointer; display: block; border-radius: 5px;';
  newButton.appendChild(document.createTextNode('Add All Coupons'));
  newButton.addEventListener('click', runSelect);

  // Find the heading to insert the button after.
  // We'll look for an h2 with "Coupons & Cashback"
  const headings = document.querySelectorAll('h2');
  let insertionPoint = null;

  headings.forEach(heading => {
    if (heading.textContent.trim().toLowerCase() === 'coupons & cashback') {
      insertionPoint = heading;
    }
  });

  if (insertionPoint && insertionPoint.parentNode) {
    // Insert the button after the heading
    insertionPoint.parentNode.insertBefore(newButton, insertionPoint.nextSibling);
  } else {
    // Fallback: if the specific heading isn't found, try to find the main content area.
    // This is a guess, but many sites have a <main> element or a div with id="content".
    const mainContent = document.querySelector('main') || document.getElementById('content');
    if (mainContent) {
      mainContent.prepend(newButton);
    } else {
      // If all else fails, add it to the top of the body.
      document.body.prepend(newButton);
    }
  }
}

// The Dollar General site loads coupons dynamically.
// We need to wait for them to appear on the page before we can interact with them.
// A MutationObserver is the right tool for this.
const observer = new MutationObserver((mutations, obs) => {
  // Look for a button with "Add Deal" text. This is a good sign that coupons have loaded.
  const addDealButton = Array.from(document.querySelectorAll('button span')).find(span => span.textContent.trim() === 'Add Deal');

  if (addDealButton) {
    // Found the coupons, so we can run our script.
    // We only want to run this once.
    if (!document.getElementById('add_all_coupons')) {
        init();
    }
  }
});

// Start observing the document body for changes.
observer.observe(document.body, {
  childList: true,
  subtree: true
});
