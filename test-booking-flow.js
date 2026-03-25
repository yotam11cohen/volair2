/**
 * VolAir Airlines — End-to-End Booking Flow Test
 * Playwright script that walks through all 6 steps:
 * flights.html → results.html → seats.html → summary.html → payment.html → confirmation.html
 *
 * Note: the `serve` static server strips .html extensions (301 redirect),
 * so actual URLs are /flights, /results, /seats, /summary, /payment, /confirmation.
 * All URL checks use pageName() which handles both forms.
 */

'use strict';

// Playwright 1.58.2 — matches the installed chromium_headless_shell-1208
const PLAYWRIGHT_MODULE =
  'C:\\Users\\me\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright';
const { chromium } = require(PLAYWRIGHT_MODULE);

const path = require('path');
const fs   = require('fs');

const BASE_URL    = 'http://localhost:8080';
const SCREENSHOTS = path.join(__dirname, 'test-screenshots');

if (!fs.existsSync(SCREENSHOTS)) fs.mkdirSync(SCREENSHOTS, { recursive: true });

// Returns true if the URL corresponds to the given page name.
// Handles both /seats and /seats.html (serve strips .html extensions).
function onPage(url, pageName) {
  const stem = pageName.replace(/\.html$/, '');
  return url.includes(`/${stem}`);
}

async function shot(page, name) {
  const file = path.join(SCREENSHOTS, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log(`  [screenshot] saved: ${name}.png`);
}

// Click something and wait for the URL to change to a target page.
// Uses a glob that matches both /page and /page.html.
async function clickAndNavigate(page, clickFn, targetStem, timeoutMs = 8000) {
  const navPromise = page.waitForURL(`**/${targetStem}{,.html}`, { timeout: timeoutMs })
    .catch(() => null);
  await clickFn();
  await navPromise;
  return page.url();
}

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page    = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => { if (msg.type() === 'error') consoleErrors.push(msg.text()); });
  page.on('pageerror', err => consoleErrors.push(`[pageerror] ${err.message}`));

  const results = { steps: [], issues: [], success: false };

  function log(msg)            { console.log(`  ${msg}`); }
  function issue(msg)          { console.warn(`  [ISSUE] ${msg}`); results.issues.push(msg); }
  function stepOK(name, msg)   { results.steps.push({ step: name, status: 'OK',   detail: msg }); }
  function stepFAIL(name, msg) { results.steps.push({ step: name, status: 'FAIL', detail: msg }); issue(msg); }

  // ── STEP 1 — FLIGHTS PAGE ──────────────────────────────────────────────────
  console.log('\n=== STEP 1: flights.html ===');
  try {
    await page.goto(`${BASE_URL}/flights.html`, { waitUntil: 'networkidle' });

    if (!onPage(page.url(), 'flights')) {
      throw new Error(`Did not land on flights page — got: ${page.url()}`);
    }

    const title   = await page.title();
    const heading = await page.locator('h1').first().textContent();
    const fromVal = await page.locator('#from-city').inputValue();
    const destOpts = await page.locator('#to-city option').count();

    log(`Title: ${title}`);
    log(`H1: ${heading}`);
    log(`From field: "${fromVal}"`);
    log(`Destination options: ${destOpts}`);

    if (destOpts !== 4) issue(`Expected 4 destination options, found ${destOpts}`);

    await shot(page, '01-flights-initial');

    const destValue = await page.locator('#to-city').inputValue();
    log(`Destination selected: ${destValue}`);

    // Set departure date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    await page.locator('#departure-date').fill(dateStr);
    await page.locator('#departure-date').dispatchEvent('change');
    log(`Departure date set: ${dateStr}`);

    const adultCount = await page.locator('[data-val="adults"]').textContent();
    log(`Adults: ${adultCount}`);

    await shot(page, '02-flights-filled');

    const finalUrl = await clickAndNavigate(
      page,
      () => page.locator('#search-btn').click(),
      'results'
    );
    log(`After search click, URL: ${finalUrl}`);

    if (!onPage(finalUrl, 'results')) {
      throw new Error(`Expected results page, got: ${finalUrl}`);
    }

    stepOK('flights → results', `Date: ${dateStr}, dest: ${destValue}, adults: ${adultCount}`);
  } catch (err) {
    stepFAIL('flights.html', err.message);
    await shot(page, '01-flights-FAIL');
    await browser.close();
    printResults(results, consoleErrors);
    return;
  }

  // ── STEP 2 — RESULTS PAGE ──────────────────────────────────────────────────
  console.log('\n=== STEP 2: results.html ===');
  try {
    await page.waitForLoadState('networkidle');
    log(`Title: ${await page.title()}`);

    await page.locator('.flight-card').first().waitFor({ timeout: 5000 });
    const flightCards = await page.locator('.flight-card').count();
    log(`Flight cards: ${flightCards}`);
    if (flightCards !== 3) issue(`Expected 3 flight cards, found ${flightCards}`);

    const flightNums = await page.locator('.flight-number').allTextContents();
    log(`Flight numbers: ${flightNums.join(', ')}`);

    const prices = await page.locator('.amount').allTextContents();
    log(`Prices: ${prices.join(', ')}`);

    const extraItems = await page.locator('.extra-item').count();
    log(`Extra items shown: ${extraItems}`);

    await shot(page, '03-results-initial');

    // Select VA203 (€95 — middle flight)
    const va203Card = page.locator('.flight-card[data-id="VA203"]');
    const va203Btn  = page.locator('.select-flight-btn[data-id="VA203"]');
    if (await va203Btn.count() === 0) throw new Error('VA203 select button not found');

    await va203Btn.click();
    log('Clicked Select on VA203');

    const isSelected = await va203Card.evaluate(el => el.classList.contains('selected'));
    log(`VA203 card has "selected" class: ${isSelected}`);
    if (!isSelected) issue('VA203 card did not get "selected" class after click');

    const btnText = await va203Btn.textContent();
    log(`VA203 button text after select: "${btnText.trim()}"`);

    const extrasTotal = await page.locator('#extras-total').textContent().catch(() => 'N/A');
    log(`Extras total (no extras selected): ${extrasTotal}`);
    if (extrasTotal !== '€95.00') issue(`Expected extras-total €95.00, got "${extrasTotal}"`);

    await shot(page, '04-results-selected');

    const finalUrl = await clickAndNavigate(
      page,
      () => page.locator('#next-btn').click(),
      'seats'
    );
    log(`After next click, URL: ${finalUrl}`);
    if (!onPage(finalUrl, 'seats')) throw new Error(`Expected seats page, got: ${finalUrl}`);

    stepOK('results → seats', `Selected VA203 (€95.00), extras-total: ${extrasTotal}`);
  } catch (err) {
    stepFAIL('results.html', err.message);
    await shot(page, '03-results-FAIL');
    await browser.close();
    printResults(results, consoleErrors);
    return;
  }

  // ── STEP 3 — SEATS PAGE ────────────────────────────────────────────────────
  console.log('\n=== STEP 3: seats.html ===');
  try {
    await page.waitForLoadState('networkidle');
    log(`Title: ${await page.title()}`);

    await page.locator('.seat').first().waitFor({ timeout: 5000 });

    const totalSeats    = await page.locator('.seat').count();
    const takenSeats    = await page.locator('.seat.taken').count();
    const availSeats    = await page.locator('.seat.available').count();
    const businessSeats = await page.locator('.seat.first-class').count();

    log(`Total seats: ${totalSeats}  (expected 120)`);
    log(`Taken seats: ${takenSeats}  (expected 29)`);
    log(`Available:   ${availSeats}`);
    log(`Business/first-class: ${businessSeats}  (expected 18 = rows 1–3, 6 cols)`);

    if (totalSeats !== 120)   issue(`Seat count: expected 120, got ${totalSeats}`);
    if (takenSeats !== 29)    issue(`Taken seats: expected 29, got ${takenSeats}`);
    if (businessSeats !== 18) issue(`Business class seats: expected 18, got ${businessSeats}`);

    const seatInfoBefore = await page.locator('.selected-seats-info').textContent().catch(() => 'N/A');
    log(`Seat info before selection: "${seatInfoBefore.trim()}"`);

    await shot(page, '05-seats-initial');

    // Select seat 5A (not in the TAKEN list)
    const seat5A = page.locator('.seat[data-seat="5A"]');
    const classBefore = await seat5A.getAttribute('class');
    log(`Seat 5A class before click: "${classBefore}"`);
    if (classBefore.includes('taken')) throw new Error('Seat 5A is incorrectly marked as taken');

    await seat5A.click();
    await page.waitForTimeout(200);

    const classAfter = await seat5A.getAttribute('class');
    log(`Seat 5A class after click: "${classAfter}"`);
    if (!classAfter.includes('selected')) issue('Seat 5A did not become selected after click');

    const seatInfoAfter = await page.locator('.selected-seats-info').textContent().catch(() => 'N/A');
    log(`Seat info after selection: "${seatInfoAfter.trim()}"`);
    if (!seatInfoAfter.includes('5A')) issue(`Seat info does not show "5A": "${seatInfoAfter.trim()}"`);

    await shot(page, '06-seats-selected');

    const finalUrl = await clickAndNavigate(
      page,
      () => page.locator('#next-btn').click(),
      'summary'
    );
    log(`After next click, URL: ${finalUrl}`);
    if (!onPage(finalUrl, 'summary')) throw new Error(`Expected summary page, got: ${finalUrl}`);

    stepOK('seats → summary', `Selected 5A (1/1 passengers), info: "${seatInfoAfter.trim()}"`);
  } catch (err) {
    stepFAIL('seats.html', err.message);
    await shot(page, '05-seats-FAIL');
    await browser.close();
    printResults(results, consoleErrors);
    return;
  }

  // ── STEP 4 — SUMMARY PAGE ─────────────────────────────────────────────────
  console.log('\n=== STEP 4: summary.html ===');
  try {
    await page.waitForLoadState('networkidle');
    log(`Title: ${await page.title()}`);

    const sumFlight     = await page.locator('#sum-flight').textContent().catch(() => 'N/A');
    const sumSeats      = await page.locator('#sum-seats').textContent().catch(() => 'N/A');
    const sumPassengers = await page.locator('#sum-passengers').textContent().catch(() => 'N/A');
    const sumExtras     = await page.locator('#sum-extras').textContent().catch(() => 'N/A');
    const sumBase       = await page.locator('#sum-base').textContent().catch(() => 'N/A');
    const sumExtrasCost = await page.locator('#sum-extras-cost').textContent().catch(() => 'N/A');
    const sumTotal      = await page.locator('#sum-total').textContent().catch(() => 'N/A');

    log(`Flight: ${sumFlight}  Seats: ${sumSeats}  Passengers: ${sumPassengers}`);
    log(`Extras: ${sumExtras}  Base: ${sumBase}  Extras cost: ${sumExtrasCost}  Total: ${sumTotal}`);

    if (sumFlight !== 'VA203')  issue(`Flight should be VA203, got "${sumFlight}"`);
    if (sumSeats  !== '5A')     issue(`Seats should be "5A", got "${sumSeats}"`);
    if (sumPassengers !== '1')  issue(`Passengers should be 1, got "${sumPassengers}"`);
    if (sumBase !== '€95.00')   issue(`Base price should be €95.00, got "${sumBase}"`);
    if (sumTotal !== '€95.00')  issue(`Total should be €95.00, got "${sumTotal}"`);

    await shot(page, '07-summary-initial');

    await page.locator('#contact-email').fill('test@volair.com');
    await page.locator('#contact-phone').fill('+972501234567');
    log('Filled email: test@volair.com, phone: +972501234567');

    await shot(page, '08-summary-filled');

    const finalUrl = await clickAndNavigate(
      page,
      () => page.locator('#contact-form').evaluate(f => f.requestSubmit()),
      'payment'
    );
    log(`After submit, URL: ${finalUrl}`);
    if (!onPage(finalUrl, 'payment')) throw new Error(`Expected payment page, got: ${finalUrl}`);

    stepOK('summary → payment', `VA203, seat 5A, 1 pax, no extras, total ${sumTotal}`);
  } catch (err) {
    stepFAIL('summary.html', err.message);
    await shot(page, '07-summary-FAIL');
    await browser.close();
    printResults(results, consoleErrors);
    return;
  }

  // ── STEP 5 — PAYMENT PAGE ─────────────────────────────────────────────────
  console.log('\n=== STEP 5: payment.html ===');
  try {
    await page.waitForLoadState('networkidle');
    log(`Title: ${await page.title()}`);

    const payFlight    = await page.locator('#pay-flight').textContent().catch(() => 'N/A');
    const paySeats     = await page.locator('#pay-seats').textContent().catch(() => 'N/A');
    const payExtras    = await page.locator('#pay-extras').textContent().catch(() => 'N/A');
    const payTotalSide = await page.locator('#pay-total-side').textContent().catch(() => 'N/A');

    log(`Sidebar — flight: ${payFlight}, seats: ${paySeats}, extras: ${payExtras}, total: ${payTotalSide}`);

    if (payFlight !== 'VA203')     issue(`Sidebar flight: expected VA203, got "${payFlight}"`);
    if (paySeats  !== '5A')        issue(`Sidebar seats: expected "5A", got "${paySeats}"`);
    if (payTotalSide !== '€95.00') issue(`Sidebar total: expected €95.00, got "${payTotalSide}"`);

    const cardSelected    = await page.locator('.payment-option[data-method="card"]')
                                      .evaluate(el => el.classList.contains('selected'));
    const cardFormVisible = await page.locator('#card-details').isVisible();
    log(`Card option selected: ${cardSelected},  card form visible: ${cardFormVisible}`);
    if (!cardSelected)    issue('Credit card option is not selected by default');
    if (!cardFormVisible) issue('Card details form is not visible');

    const payBtnText = await page.locator('#pay-btn').textContent();
    log(`Pay button text: "${payBtnText.trim()}"`);
    if (!payBtnText.includes('€95.00')) issue(`Pay button should show €95.00, got: "${payBtnText.trim()}"`);

    await shot(page, '09-payment-initial');

    // Fill card details
    await page.locator('#card-name').fill('YOTAM COHEN');
    await page.locator('#card-number').click();
    await page.locator('#card-number').type('4111111111111111', { delay: 20 });
    await page.waitForTimeout(300);

    const formattedCard = await page.locator('#card-number').inputValue();
    log(`Card number (auto-formatted): "${formattedCard}"`);
    if (formattedCard !== '4111 1111 1111 1111') {
      issue(`Card number formatting: expected "4111 1111 1111 1111", got "${formattedCard}"`);
    }

    await page.locator('#card-expiry').fill('12 / 27');
    await page.locator('#card-cvv').fill('123');
    log('Filled expiry: 12 / 27, CVV: 123');

    await shot(page, '10-payment-filled');

    // Click Pay — app sets button to disabled + "Processing…" for 1500ms then redirects
    await page.locator('#pay-btn').click();
    log('Clicked pay button — waiting for 1.5s processing then redirect...');

    try {
      await page.locator('#pay-btn:disabled').waitFor({ timeout: 1200 });
      const processingText = await page.locator('#pay-btn').textContent().catch(() => '');
      log(`Pay button processing state: "${processingText.trim()}"`);
    } catch {
      log('Pay button processing state not captured (redirect may have already started)');
    }

    await page.waitForURL(`**/{confirmation,confirmation.html}`, { timeout: 6000 });
    const finalUrl = page.url();
    log(`Navigated to: ${finalUrl}`);
    if (!onPage(finalUrl, 'confirmation')) throw new Error(`Expected confirmation page, got: ${finalUrl}`);

    stepOK('payment → confirmation', `Card payment submitted, total: ${payTotalSide}`);
  } catch (err) {
    stepFAIL('payment.html', err.message);
    await shot(page, '09-payment-FAIL');
    await browser.close();
    printResults(results, consoleErrors);
    return;
  }

  // ── STEP 6 — CONFIRMATION PAGE ────────────────────────────────────────────
  console.log('\n=== STEP 6: confirmation.html ===');
  try {
    await page.waitForLoadState('networkidle');
    log(`Title: ${await page.title()}`);

    const confRef        = await page.locator('#conf-ref').textContent().catch(() => 'N/A');
    const confFlight     = await page.locator('#conf-flight').textContent().catch(() => 'N/A');
    const confSeats      = await page.locator('#conf-seats').textContent().catch(() => 'N/A');
    const confPassengers = await page.locator('#conf-passengers').textContent().catch(() => 'N/A');
    const confEmail      = await page.locator('#conf-email').textContent().catch(() => 'N/A');
    const confTotal      = await page.locator('#conf-total').textContent().catch(() => 'N/A');
    const confDate       = await page.locator('#conf-date').textContent().catch(() => 'N/A');
    const confExtras     = await page.locator('#conf-extras').textContent().catch(() => 'N/A');

    log(`Booking Ref:  ${confRef}`);
    log(`Flight:       ${confFlight}`);
    log(`Seats:        ${confSeats}`);
    log(`Passengers:   ${confPassengers}`);
    log(`Email:        ${confEmail}`);
    log(`Total:        ${confTotal}`);
    log(`Date:         ${confDate}`);
    log(`Extras:       ${confExtras}`);

    // Booking ref must be "VA" + 6 chars from the generateRef() alphabet
    if (/^VA[A-Z2-9]{6}$/.test(confRef)) {
      log(`Booking ref format: VALID`);
    } else {
      issue(`Booking ref format invalid: "${confRef}" — expected VA + 6 uppercase alphanumerics`);
    }

    if (confFlight     !== 'VA203')           issue(`Conf flight: expected VA203, got "${confFlight}"`);
    if (confSeats      !== '5A')              issue(`Conf seats: expected "5A", got "${confSeats}"`);
    if (confPassengers !== '1')               issue(`Conf passengers: expected 1, got "${confPassengers}"`);
    if (confTotal      !== '€95.00')          issue(`Conf total: expected €95.00, got "${confTotal}"`);
    if (confEmail      !== 'test@volair.com') issue(`Conf email: expected test@volair.com, got "${confEmail}"`);

    const printExists  = await page.locator('#print-btn').count() > 0;
    const saveExists   = await page.locator('#save-btn').count() > 0;
    const newBkgExists = await page.locator('#new-booking-btn').count() > 0;
    log(`Action buttons — Print: ${printExists}, Save: ${saveExists}, New Booking: ${newBkgExists}`);
    if (!printExists)  issue('Print button (#print-btn) not found');
    if (!saveExists)   issue('Save button (#save-btn) not found');
    if (!newBkgExists) issue('New booking button (#new-booking-btn) not found');

    await shot(page, '11-confirmation-final');

    results.success = results.issues.length === 0;
    stepOK('confirmation.html', `Ref: ${confRef}, Flight: ${confFlight}, Seats: ${confSeats}, Total: ${confTotal}`);
  } catch (err) {
    stepFAIL('confirmation.html', err.message);
    await shot(page, '11-confirmation-FAIL');
  }

  await browser.close();
  printResults(results, consoleErrors);
}

function printResults(results, consoleErrors) {
  console.log('\n' + '═'.repeat(68));
  console.log('VOLAIR BOOKING FLOW — TEST RESULTS');
  console.log('═'.repeat(68));

  results.steps.forEach(s => {
    const icon = s.status === 'OK' ? '✓' : '✗';
    console.log(`\n  ${icon} [${s.status}] ${s.step}`);
    console.log(`      ${s.detail}`);
  });

  if (consoleErrors.length > 0) {
    console.log('\nBROWSER CONSOLE ERRORS:');
    consoleErrors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
  }

  if (results.issues.length > 0) {
    console.log('\nISSUES FOUND:');
    results.issues.forEach((iss, i) => console.log(`  ${i + 1}. ${iss}`));
  }

  const hasFail = results.steps.some(s => s.status === 'FAIL');
  console.log('\n' + '═'.repeat(68));
  if (hasFail) {
    console.log(`OVERALL: FAIL — booking flow did not complete (${results.issues.length} issue(s))`);
  } else if (results.issues.length > 0) {
    console.log(`OVERALL: PASS WITH WARNINGS — flow completed, ${results.issues.length} issue(s) found`);
  } else {
    console.log('OVERALL: PASS — Full booking flow completed successfully with no issues!');
  }
  console.log('═'.repeat(68));
}

run().catch(err => {
  console.error('\nFatal error:', err.message);
  process.exit(1);
});
