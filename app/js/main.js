const badgeSelect = document.getElementById('badgeSelect');
const badgeImage = document.getElementById('badgeImage');
const flashButton = document.getElementById('flashButton');
const badgeDescriptions = {
  basicQACode25: "For QA of the base baord",
  cactuscon2025: "Official badge for CactusCon 2025, featuring ESP32-s3",
  bsideskc25: "BSidesKC 2025 badge: Available after the event",
  wifiMarauder: "ESP32Marauder port for the BadgePirates ESP32-S3 badge: WiFi/BLE scanning and pentest tools (v1.1.0)",
  wifiMarauderCC13: "ESP32Marauder port for CC13 / BSidesKC25 hardware: same WiFi/BLE/pentest tools as the CC14 build, with a display/touch orientation fix for the earlier badge revision (v1.1.0)",
  qacode27: "BadgePirates QA test badge: the current-generation hardware rig, LoRa range-test kit included",
  bsideskc26: "Official badge for BSidesKC 2026",
  deskConsole: "A small screen for your desk. Pairs with free host software on your computer to show live cards you choose: AI usage and spend, stock prices, weather, sports scores, smart-home status, and more. Guided Wi-Fi setup walks you through connecting it, and it checks for firmware updates on its own."
};

// Per-badge hardware caveats shown in their own callout, separate from the
// one-line description above — a warning buried in a description reads as
// flavor text, not a "your screen will stay blank" fact (Nexus ad948451/
// d0e8e075). Leave a key out (or empty string) for badges with nothing to flag.
const badgeCompatNotes = {
  wifiMarauder: "Built for CC14 / BSidesKC26 hardware only. On CC13 / BSidesKC25 badges the display will be " +
    "upside-down and touch will be mirrored; use the separate \"WiFi Marauder (CC13 / BSidesKC25)\" entry instead.",
  wifiMarauderCC13: "Built for CC13 / BSidesKC25 hardware: includes a 180-degree display flip and mirrored touch " +
    "to correct for that generation's panel orientation. The touch-mirroring fix hasn't been confirmed on physical " +
    "hardware yet; the display flip is implemented but still pending real-world testing. WiFi, BLE, and the " +
    "buttons are unaffected. Use the plain \"WiFi Marauder\" entry for CC14 / BSidesKC26 badges instead.",
  deskConsole: "Uses the same circuit board as our QA Test Badge, but it's different firmware for a different " +
    "product. Don't flash this image onto a QA Test Badge, or the QA Test Badge image onto this one, even though " +
    "they share hardware. Flashing over the browser (WebSerial) from this page hasn't been confirmed yet on a " +
    "physical unit, though the firmware build itself has been verified."
};
// Always S3 — there used to be a parallel localhost:8080/firmware/ fixture
// for local dev, but it silently rotted (last touched 2026-04-07) while S3
// kept moving, and its staleness is exactly what made a from-disk audit of
// firmware.badgepirates.com report 3 of 4 options as broken when production
// (this file, live) was fine (Nexus ad948451). One source of truth.
const manifestUrls = {
  basicQACode25: "https://badgepirates-firmware.s3.amazonaws.com/basicQACode25/manifest.json",
  cactuscon2025: "https://badgepirates-firmware.s3.amazonaws.com/cactuscon2025/manifest.json",
  bsideskc25: "https://badgepirates-firmware.s3.amazonaws.com/bsideskc25/manifest.json",
  wifiMarauder: "https://badgepirates-firmware.s3.amazonaws.com/wifiMarauder/manifest.json",
  wifiMarauderCC13: "https://badgepirates-firmware.s3.amazonaws.com/wifiMarauderCC13/manifest.json",
  qacode27: "https://badgepirates-firmware.s3.amazonaws.com/qacode27/manifest.json",
  bsideskc26: "https://badgepirates-firmware.s3.amazonaws.com/bsideskc26/manifest.json",
  deskConsole: "https://badgepirates-firmware.s3.amazonaws.com/deskConsole/manifest.json"
};

const badgeImages = {
  basicQACode25: "https://badgepirates-firmware.s3.amazonaws.com/basicQACode25/badge.jpg",
  cactuscon2025: "https://badgepirates-firmware.s3.amazonaws.com/cactuscon2025/badge.jpg",
  bsideskc25: "https://badgepirates-firmware.s3.amazonaws.com/bsideskc25/badge.jpg",
  wifiMarauder: "https://badgepirates-firmware.s3.amazonaws.com/wifiMarauder/badge.jpg",
  wifiMarauderCC13: "https://badgepirates-firmware.s3.amazonaws.com/wifiMarauderCC13/badge.jpg",
  qacode27: "https://badgepirates-firmware.s3.amazonaws.com/qacode27/badge.jpg",
  bsideskc26: "https://badgepirates-firmware.s3.amazonaws.com/bsideskc26/badge.jpg",
  deskConsole: "https://badgepirates-firmware.s3.amazonaws.com/deskConsole/badge.jpg"
};

// esp-web-tools has no visibility into the target's burned-in partition table — it
// will happily write an oversized app image into an undersized OTA slot and the
// badge just never boots, with no error surfaced during the flash itself (Nexus
// 6c6d8abc, CC13 web-flasher brick). Each badge's known-good app-slot ceiling below
// is checked client-side against the real Content-Length of the fetched binary
// *before* the flash button is armed, so a size mismatch fails fast with a readable
// message instead of a silent 45-minute hang.
const APP_SLOT_MAX_BYTES = {
  // ota_0 on the standard 4MB ESP32 partition table (0x10000..0x150000).
  // Confirmed from a live customer brick — the CC13 build currently in S3 is
  // oversized for this. Update once a rebuilt/re-partitioned image ships.
  basicQACode25: 1310720,
  cactuscon2025: 1310720,
  // bsideskc25 ships bootloader+partition-table+app and uses a 16MB flash layout
  // (app0/app1 = 0x640000 each) — no slot-size risk from this check today.
  bsideskc25: 6553600,
  // wifiMarauder: default_8MB.csv app0 slot (0x10000..0x340000). Built firmware.bin
  // is ~1.44MB against a 3,342,336B (0x330000) ceiling — comfortable margin.
  wifiMarauder: 3342336,
  // wifiMarauderCC13: env:bsideskc-badge-cc13 extends env:bsideskc-badge and
  // inherits the same default_8MB.csv app0 slot — confirmed from this build's
  // own size report (1,451,293B used against 3,342,336B ceiling).
  wifiMarauderCC13: 3342336,
  // qacode27: bp_cc15_n16r2 board (16MB flash, 2MB PSRAM), default_16MB.csv
  // app0/app1 = 0x640000 each — same layout as bsideskc25.
  qacode27: 6553600,
  // bsideskc26: same default_8MB.csv-style app0 slot as wifiMarauder even
  // though the underlying board_build.flash_size is set to 16MB — the repo
  // doesn't override board_build.partitions, so PlatformIO still picks the
  // 8MB-family table. Real chip is bigger, so this only wastes headroom, it
  // doesn't risk an oversized write.
  bsideskc26: 3342336,
  // deskConsole: same bp_cc15_n16r2 board as qacode27, same default_16MB.csv
  // app0/app1 = 0x640000 slot — confirmed from this build's own PlatformIO
  // size report (1,424,848B used, Nexus 71d79183).
  deskConsole: 6553600
};

let badgeReady = false;

badgeSelect.addEventListener('change', () => {
  const selected = badgeSelect.value;
  badgeReady = false;
  flashButton.style.display = 'none';

  if (!selected) {
    badgeImage.style.display = 'none';
    badgeDescription.style.display = 'none';
    badgeCompatNote.style.display = 'none';
    return;
  }

  badgeImage.src = badgeImages[selected];
  badgeImage.style.display = 'block';

  badgeDescription.innerText = badgeDescriptions[selected] || "";
  badgeDescription.style.display = 'block';

  const compatNote = badgeCompatNotes[selected];
  if (compatNote) {
    badgeCompatNote.innerText = `⚠ ${compatNote}`;
    badgeCompatNote.style.display = 'block';
  } else {
    badgeCompatNote.style.display = 'none';
  }

  checkFirmwareFits(selected);
});

async function checkFirmwareFits(badgeKey) {
  const manifestUrl = manifestUrls[badgeKey];
  const limit = APP_SLOT_MAX_BYTES[badgeKey];

  let manifest;
  try {
    const manifestResp = await fetch(manifestUrl);
    if (!manifestResp.ok) {
      throw new Error(`manifest fetch failed: HTTP ${manifestResp.status}`);
    }
    manifest = await manifestResp.json();
  } catch (err) {
    badgeReady = false;
    flashButton.style.display = 'none';
    showFlasherError(badgeKey, err.message);
    return;
  }

  const parts = manifest.builds?.[0]?.parts || [];

  // A GET with a 1-byte Range is the size precheck, not HEAD: S3 (and most
  // CDNs) only ever CORS-cleared GET, so a HEAD request gets no
  // Access-Control-Allow-Origin on its response and the browser blocks it
  // outright, taking down the whole flasher before Install even shows up
  // (Nexus 07f29487). This check is a safety net on top of the real flash,
  // not a gate on it, so any failure here just logs a warning and lets
  // Install proceed instead of blocking the badge entirely.
  for (const part of parts) {
    try {
      const rangeResp = await fetch(part.path, { headers: { Range: 'bytes=0-0' } });
      if (!rangeResp.ok) {
        throw new Error(`size check failed: HTTP ${rangeResp.status} for ${part.path}`);
      }

      let size = NaN;
      const contentRange = rangeResp.headers.get('content-range'); // "bytes 0-0/12345"
      const match = contentRange && contentRange.match(/\/(\d+)$/);
      if (match) {
        size = parseInt(match[1], 10);
      } else {
        size = parseInt(rangeResp.headers.get('content-length'), 10);
      }

      if (limit && !Number.isNaN(size) && size > limit) {
        showFlasherError(badgeKey,
          `Firmware image (${size.toLocaleString()} B) at offset 0x${part.offset.toString(16)} ` +
          `is larger than this badge's flash partition (${limit.toLocaleString()} B). ` +
          `Flashing would brick the badge. This build needs to be fixed before it can be flashed. ` +
          `Reported to #firmware; do not proceed with a manual esptool flash of this file either.`
        );
        badgeReady = false;
        flashButton.style.display = 'none';
        return;
      }
    } catch (err) {
      console.warn(`[flasher] size precheck skipped for ${part.path}: ${err.message}`);
    }
  }

  badgeReady = true;
  flashButton.manifest = manifestUrl;
  flashButton.style.display = 'inline-block';
}

function showFlasherError(badgeKey, message) {
  let el = document.getElementById('flasherError');
  if (!el) {
    el = document.createElement('p');
    el.id = 'flasherError';
    el.style.color = '#e05252';
    el.style.fontWeight = '600';
    badgeDescription.insertAdjacentElement('afterend', el);
  }
  el.innerText = `⚠ Can't flash "${badgeKey}": ${message}`;
  el.style.display = 'block';
}
