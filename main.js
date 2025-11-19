// jshint esversion: 8

// Debug mode - set to false once working
const DEBUG = true;

function log(...args) {
  if (DEBUG) console.log('[DG Extension]', ...args);
}

function waitForPageReady() {
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      setTimeout(resolve, 3000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(resolve, 3000);
      });
    }
  });
}

async function clickLoadMore() {
  let attempts = 0;
  const maxAttempts = 100;
  
  for (;;) {
    if (attempts++ > maxAttempts) {
      log('Max load attempts reached');
      break;
    }

    // Look for "Load More" button
    let loadMoreBtn = [...document.querySelectorAll('button, a, div[role="button"], span')]
      .find(el => {
        const text = (el.innerText || el.textContent || '').trim().toLowerCase();
        return text === 'load more' || text === 'show more' || text === 'see more' || text.includes('load more');
      });
    
    if (!loadMoreBtn) {
      log('No more "Load More" buttons found');
      break;
    }
    
    log('Clicking Load More…');
    loadMoreBtn.scrollIntoView({ block: 'center', behavior: 'smooth' });
    await new Promise(r => setTimeout(r, 500));
    loadMoreBtn.click();
    await new Promise(r => setTimeout(r, 2000));
  }
  
  log('All coupons loaded');
}

function findCouponButtons() {
  const buttons = [];
  
  // Strategy 1: Find buttons by aria-label "Clip this deal"
  const clipButtons = document.querySelectorAll('button[aria-label*="Clip"]');
  log(`Found ${clipButtons.length} buttons with "Clip" in aria-label`);
  
  for (const btn of clipButtons) {
    const ariaLabel = btn.getAttribute('aria-label') || '';
    // Skip if already clipped
    if (ariaLabel.toLowerCase().includes('clipped') || ariaLabel.toLowerCase().includes('remove')) {
      log(`Skipping already clipped button: ${ariaLabel}`);
      continue;
    }
    buttons.push(btn);
    log(`Found clip button: aria-label="${ariaLabel}" class="${btn.className}"`);
  }
  
  // Strategy 2: Find buttons by class name pattern (clipButton_*)
  if (buttons.length === 0) {
    log('Strategy 1 found 0 buttons, trying Strategy 2 (class name)...');
    const classButtons = document.querySelectorAll('button[class*="clipButton"]');
    log(`Found ${classButtons.length} buttons with "clipButton" in class`);
    
    for (const btn of classButtons) {
      const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
      // Skip if already clipped
      if (ariaLabel.includes('clipped') || ariaLabel.includes('remove')) {
        continue;
      }
      buttons.push(btn);
    }
  }
  
  // Strategy 3: Find by SVG scissors icon
  if (buttons.length === 0) {
    log('Strategy 2 found 0 buttons, trying Strategy 3 (SVG scissors)...');
    const scissors = document.querySelectorAll('svg.scissors');
    log(`Found ${scissors.length} scissor icons`);
    
    for (const svg of scissors) {
      // Get parent button
      const btn = svg.closest('button');
      if (btn) {
        const ariaLabel = (btn.getAttribute('aria-label') || '').toLowerCase();
        if (!ariaLabel.includes('clipped') && !ariaLabel.includes('remove')) {
          buttons.push(btn);
        }
      }
    }
  }
  
  log(`Total clip buttons found: ${buttons.length}`);
  return buttons;
}

function clickAllCoupons() {
  const buttons = findCouponButtons();
  
  if (buttons.length === 0) {
    alert('No coupon buttons found!\n\nPossible reasons:\n1. All coupons are already clipped\n2. The page structure changed\n3. Try refreshing the page\n\nCheck console (F12) for details.');
    return;
  }
  
  let clicked = 0;
  const delay = 150;
  
  for (let i = 0; i < buttons.length; i++) {
    const btn = buttons[i];
    
    setTimeout(() => {
      try {
        // Check if visible
        const rect = btn.getBoundingClientRect();
        const isVisible = rect.width > 0 && rect.height > 0;
        
        if (isVisible) {
          btn.scrollIntoView({ block: 'center', behavior: 'smooth' });
          
          setTimeout(() => {
            const ariaLabel = btn.getAttribute('aria-label') || 'Unknown';
            log(`Clicking button ${clicked + 1}: "${ariaLabel}"`);
            btn.click();
          }, 100);
          
          clicked++;
        } else {
          log(`Button ${i + 1} not visible, skipping`);
        }
      } catch (e) {
        log(`Error clicking button: ${e.message}`);
      }
    }, i * delay);
  }
  
  setTimeout(() => {
    alert(`✅ Successfully clicked ${clicked} coupon buttons!`);
  }, (buttons.length + 1) * delay);
}

async function runSelect(event) {
  event.preventDefault();
  
  const btn = event.target;
  const originalText = btn.textContent;
  btn.textContent = '⏳ Loading all coupons...';
  btn.disabled = true;
  
  try {
    await clickLoadMore();
    btn.textContent = '✂️ Clipping coupons...';
    await new Promise(r => setTimeout(r, 1000));
    clickAllCoupons();
  } catch (error) {
    console.error('Error:', error);
    alert('An error occurred: ' + error.message);
  } finally {
    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 3000);
  }
}

async function init() {
  await waitForPageReady();
  
  if (document.getElementById('add_all_coupons')) {
    log('Button already exists');
    return;
  }
  
  log('Initializing extension...');
  log('Current URL:', window.location.href);
  
  const newbutton = document.createElement('button');
  newbutton.id = 'add_all_coupons';
  newbutton.style.cssText = `
    background: linear-gradient(135deg, #fff600 0%, #ffed4e 100%);
    color: #000000; 
    font-weight: 700; 
    border: 2px solid #000;
    border-radius: 8px;
    padding: 12px 24px; 
    margin: 10px; 
    cursor: pointer; 
    z-index: 99999;
    font-size: 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    transition: all 0.3s ease;
    position: fixed;
    top: 80px;
    right: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;
  
  newbutton.onmouseenter = () => {
    newbutton.style.transform = 'scale(1.05)';
    newbutton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
  };
  newbutton.onmouseleave = () => {
    newbutton.style.transform = 'scale(1)';
    newbutton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  };
  
  newbutton.appendChild(document.createTextNode('✂️ Clip All Coupons'));
  newbutton.addEventListener('click', runSelect);
  
  document.body.appendChild(newbutton);
  log('Button added successfully');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}