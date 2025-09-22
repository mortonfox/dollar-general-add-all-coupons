// jshint esversion: 8

async function clickLoadMore() {
  for (;;) {
    // Find the visible "Load More" button
    let loadMoreBtn = [...document.querySelectorAll('button, a')]
      .find(el => el.innerText.trim().toLowerCase() === 'load more');

    if (!loadMoreBtn) break;

    console.log('Clicking Load More…');

    // Bring button into view to show what we are doing.
    loadMoreBtn.scrollIntoView({ block: 'center' });

    loadMoreBtn.click();

    // Wait for new coupons to load
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log('All coupons loaded');
}

function clickAllCoupons() {
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

async function runSelect(event) {
  event.preventDefault();

  await clickLoadMore();   // ensure all coupons/deals are visible
  clickAllCoupons();       // then clip them all
}

function init() {
  // Don't add button if already added.
  if (document.getElementById('add_all_coupons')) return;

  const newbutton = document.createElement('button');
  newbutton.id = 'add_all_coupons';
  newbutton.style.cssText =
    'background-color: #fff600; color: #000000; font-weight: 700; border: none; padding: 6px 10px; margin: 10px; cursor: pointer; z-index:9999;';
  newbutton.appendChild(document.createTextNode('Add All Coupons/Deals'));
  newbutton.addEventListener('click', runSelect);

  // Look for insertion point. If not found, then insert at top of body as a fallback.
  const target = document.querySelector('.pages, main, body');
  if (target) {
    target.prepend(newbutton);
  } else {
    document.body.prepend(newbutton);
  }
}

init();

