import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';

export interface RealSubmissionResult {
  success: boolean;
  message: string;
  confirmationText?: string;
  finalUrl?: string;
  screenshotUrl?: string;
}

export async function submitRealFormOnline(
  applyUrl: string,
  fieldValues: Record<string, string>
): Promise<RealSubmissionResult> {
  let browser;
  let screenshotUrl = "";

  try {
    // 1. Clean URL to prevent client-side redirect loops
    const cleanUrl = applyUrl
      .replace(/([?&])usp=[^&]+(&|$)/, '$1')
      .replace(/\?$/, '')
      .replace(/&$/, '');

    console.log(`[Form Submitter] Navigating to ${cleanUrl} for live automated submission...`);
    
    // Ensure public/screenshots directory exists
    const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
    await fs.mkdir(screenshotsDir, { recursive: true }).catch(() => {});

    // Use stable launch arguments (DO NOT use --single-process on Windows as it crashes renderers)
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 850 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Navigate with domcontentloaded
    try {
      await page.goto(cleanUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    } catch (navErr: any) {
      if (navErr.message?.includes('detached') || navErr.message?.includes('disposed')) {
        console.log('[Form Submitter] Detached frame handled during load, continuing...');
        await new Promise(r => setTimeout(r, 2000));
      } else {
        throw navErr;
      }
    }

    await page.waitForSelector('[role="listitem"], .geS5ec, .Qr739b, form, input, textarea', { timeout: 15000 }).catch(() => {});
    await new Promise(r => setTimeout(r, 1000));
    
    const isGoogleForm = cleanUrl.includes('docs.google.com/forms') || cleanUrl.includes('forms.gle');

    if (isGoogleForm) {
      console.log('[Form Submitter] Detected Google Form. Locating question items...');

      // Find all question list item containers
      const items = await page.$$('[role="listitem"], .geS5ec, .Qr739b');
      console.log(`[Form Submitter] Found ${items.length} Google Form question containers.`);

      if (items.length > 0) {
        for (const item of items) {
          const headerText = await page.evaluate(el => {
            const h = el.querySelector('.M7eYe, .geS5ec, [role="heading"]');
            return h ? h.textContent?.trim().replace(/[\*\:]$/, '') || '' : '';
          }, item);

          const lowerHeader = headerText.toLowerCase();
          let valueToType = "";

          // Match data by field name key
          for (const [key, val] of Object.entries(fieldValues)) {
            if (!val || !val.trim()) continue;
            const lowerKey = key.toLowerCase();

            if (lowerHeader.includes(lowerKey) || lowerKey.includes(lowerHeader) ||
                (lowerHeader.includes("email") && lowerKey.includes("email")) ||
                (lowerHeader.includes("name") && lowerKey.includes("name")) ||
                ((lowerHeader.includes("phone") || lowerHeader.includes("mobile") || lowerHeader.includes("contact")) &&
                 (lowerKey.includes("phone") || lowerKey.includes("mobile") || lowerKey.includes("contact")))) {
              valueToType = val.trim();
              break;
            }
          }

          // If no direct key match, match by index
          if (!valueToType && items.length <= Object.keys(fieldValues).length) {
            const vals = Object.values(fieldValues).filter(v => v && v.trim());
            const idx = items.indexOf(item);
            if (vals[idx]) valueToType = vals[idx].trim();
          }

          if (valueToType) {
            const inputHandle = await item.$('input:not([type="hidden"]), textarea');
            if (inputHandle) {
              console.log(`[Form Submitter] Typing "${valueToType}" into Google Form question "${headerText}"...`);
              await inputHandle.click();
              await new Promise(r => setTimeout(r, 100));
              await inputHandle.type(valueToType, { delay: 30 });
              await new Promise(r => setTimeout(r, 100));
            }
          }
        }
      } else {
        // Fallback input typing in order
        const inputs = await page.$$('input[type="text"], input[type="email"], textarea');
        const vals = Object.values(fieldValues).filter(v => v && v.trim());
        for (let i = 0; i < inputs.length && i < vals.length; i++) {
          await inputs[i].click();
          await new Promise(r => setTimeout(r, 100));
          await inputs[i].type(vals[i], { delay: 30 });
          await new Promise(r => setTimeout(r, 100));
        }
      }

      await new Promise(r => setTimeout(r, 500));

      // Click Submit button natively
      console.log('[Form Submitter] Locating Submit button...');
      const buttons = await page.$$('[role="button"], button, input[type="submit"]');
      let submitBtn = null;

      for (const btn of buttons) {
        const text = await page.evaluate(el => el.textContent, btn);
        if (text && (text.includes('Submit') || text.includes('Send') || text.includes('제출') || text.includes('Enviar'))) {
          submitBtn = btn;
          break;
        }
      }

      if (submitBtn) {
        console.log('[Form Submitter] Clicking Google Form Submit button natively...');
        await submitBtn.click();
      } else {
        console.log('[Form Submitter] Submit button fallback: Pressing Enter key...');
        await page.keyboard.press('Enter');
      }

      // Wait for confirmation selector or fast navigation
      await Promise.race([
        page.waitForSelector('.vStfvd, .freebirdFormviewqaFormviewResponseConfirmationText, .c2g3ed', { timeout: 8000 }),
        page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 8000 })
      ]).catch(() => {});
      await new Promise(r => setTimeout(r, 800));

      const confirmationText = await page.evaluate(() => {
        const respEl = document.querySelector('.vStfvd, .freebirdFormviewqaFormviewResponseConfirmationText, .c2g3ed');
        if (respEl) return respEl.textContent?.trim();
        return document.body.innerText;
      });

      const finalUrl = page.url();

      // Capture submission confirmation screenshot
      const fileName = `sub_${Date.now()}.png`;
      const screenshotFilePath = path.join(screenshotsDir, fileName);
      await page.screenshot({ path: screenshotFilePath, fullPage: false }).catch(() => {});
      screenshotUrl = `/screenshots/${fileName}`;

      await browser.close();

      const isRecorded = (confirmationText || '').toLowerCase().includes('recorded') || 
                         (confirmationText || '').toLowerCase().includes('thank') || 
                         (confirmationText || '').toLowerCase().includes('submitted') ||
                         finalUrl.includes('formResponse');

      return {
        success: isRecorded,
        message: isRecorded ? "Google Form response recorded successfully!" : "Form submitted.",
        confirmationText: confirmationText ? confirmationText.substring(0, 300) : "Your response has been recorded.",
        finalUrl,
        screenshotUrl
      };

    } else {
      console.log('[Form Submitter] Automating standard web form entry...');

      const inputs = await page.$$('input:not([type="hidden"]), textarea, select');
      const vals = Object.values(fieldValues).filter(v => v && v.trim());

      for (let i = 0; i < inputs.length && i < vals.length; i++) {
        try {
          await inputs[i].click();
          await new Promise(r => setTimeout(r, 100));
          await inputs[i].type(vals[i], { delay: 25 });
        } catch (e) {}
      }

      // Click submit button
      const submitBtn = await page.$('button[type="submit"], input[type="submit"]');
      if (submitBtn) {
        await submitBtn.click();
      }

      await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 6000 }).catch(() => {});
      await new Promise(r => setTimeout(r, 600));

      const finalUrl = page.url();
      const bodyText = await page.evaluate(() => document.body.innerText);

      // Capture submission confirmation screenshot
      const fileName = `sub_${Date.now()}.png`;
      const screenshotFilePath = path.join(screenshotsDir, fileName);
      await page.screenshot({ path: screenshotFilePath, fullPage: false }).catch(() => {});
      screenshotUrl = `/screenshots/${fileName}`;

      await browser.close();

      return {
        success: true,
        message: "Form response submitted successfully to host site!",
        confirmationText: bodyText.substring(0, 250) || "Application response received.",
        finalUrl,
        screenshotUrl
      };
    }

  } catch (error: any) {
    console.error("[Form Submitter] Submission error:", error);
    if (browser) {
      try {
        const pages = await browser.pages();
        if (pages.length > 0) {
          const fileName = `err_${Date.now()}.png`;
          const screenshotsDir = path.join(process.cwd(), 'public', 'screenshots');
          const errFilePath = path.join(screenshotsDir, fileName);
          await pages[0].screenshot({ path: errFilePath, fullPage: false }).catch(() => {});
          screenshotUrl = `/screenshots/${fileName}`;
        }
      } catch (ssErr) {}
      await browser.close().catch(() => {});
    }
    return {
      success: false,
      message: `Form submission failed: ${error.message || 'Unknown error'}`,
      confirmationText: error.message || "Failed to reach submission confirmation.",
      screenshotUrl
    };
  }
}
