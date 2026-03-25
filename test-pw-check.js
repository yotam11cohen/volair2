// Quick test to see which playwright version matches the installed browser
const path = require('path');

// The 1.59.0-alpha version that matches chromium-1208
const PW_ALPHA = 'C:\\Users\\me\\AppData\\Local\\npm-cache\\_npx\\9833c18b2d85bc59\\node_modules\\playwright';
// The 1.58.2 version
const PW_STABLE = 'C:\\Users\\me\\AppData\\Local\\npm-cache\\_npx\\e41f203b7505f1fb\\node_modules\\playwright';

async function test(pwPath, label) {
  try {
    const pw = require(pwPath);
    console.log(`${label}: loaded`);
    const b = await pw.chromium.launch({ headless: true });
    console.log(`${label}: browser launched!`);
    await b.close();
    return true;
  } catch(e) {
    console.log(`${label}: FAILED — ${e.message.split('\n')[0]}`);
    return false;
  }
}

(async () => {
  const r1 = await test(PW_ALPHA, '1.59-alpha');
  if (!r1) await test(PW_STABLE, '1.58.2');
})();
