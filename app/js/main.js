const badgeSelect = document.getElementById('badgeSelect');
const badgeImage = document.getElementById('badgeImage');
const flashButton = document.getElementById('flashButton');
const badgeDescriptions = {
  basicQACode25: "For QA of the base baord",
  cactuscon2025: "Official badge for CactusCon 2025, featuring ESP32-s3",
  bsideskc25: "BSidesKC 2025 badge: Available after the event"
};
// Map of badge to manifest URLs (switch between S3 and localhost for local testing)
const useLocalhost = window.location.hostname === "localhost";
const localPort = 8080;
const manifestUrls = {
  basicQACode25: useLocalhost
    ? `http://localhost:${localPort}/firmware/basicQACode25/manifest.json`
    : "https://badgepirates-firmware.s3.amazonaws.com/basicQACode25/manifest.json",
  cactuscon2025: useLocalhost
    ? `http://localhost:${localPort}/firmware/cactuscon2025/manifest.json`
    : "https://badgepirates-firmware.s3.amazonaws.com/cactuscon2025/manifest.json",
  bsideskc25: useLocalhost
    ? `http://localhost:${localPort}/firmware/bsideskc25/manifest.json`
    : "https://badgepirates-firmware.s3.amazonaws.com/bsideskc25/manifest.json"
};

const badgeImages = {
  basicQACode25: "https://badgepirates-firmware.s3.amazonaws.com/basicQACode25/badge.jpg",
  cactuscon2025: "https://badgepirates-firmware.s3.amazonaws.com/cactuscon2025/badge.jpg",
  bsideskc25: "https://badgepirates-firmware.s3.amazonaws.com/bsideskc25/badge.jpg"
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
  bsideskc25: 6553600
};

let badgeReady = false;

badgeSelect.addEventListener('change', () => {
  const selected = badgeSelect.value;
  badgeReady = false;
  flashButton.style.display = 'none';

  if (!selected) {
    badgeImage.style.display = 'none';
    badgeDescription.style.display = 'none';
    return;
  }

  badgeImage.src = badgeImages[selected];
  badgeImage.style.display = 'block';

  badgeDescription.innerText = badgeDescriptions[selected] || "";
  badgeDescription.style.display = 'block';

  checkFirmwareFits(selected);
});

async function checkFirmwareFits(badgeKey) {
  const manifestUrl = manifestUrls[badgeKey];
  const limit = APP_SLOT_MAX_BYTES[badgeKey];

  try {
    const manifestResp = await fetch(manifestUrl);
    if (!manifestResp.ok) {
      throw new Error(`manifest fetch failed: HTTP ${manifestResp.status}`);
    }
    const manifest = await manifestResp.json();
    const parts = manifest.builds?.[0]?.parts || [];

    for (const part of parts) {
      const headResp = await fetch(part.path, { method: 'HEAD' });
      if (!headResp.ok) {
        throw new Error(`binary fetch failed: HTTP ${headResp.status} for ${part.path}`);
      }
      const size = parseInt(headResp.headers.get('content-length'), 10);
      if (limit && !Number.isNaN(size) && size > limit) {
        throw new Error(
          `Firmware image (${size.toLocaleString()} B) at offset 0x${part.offset.toString(16)} ` +
          `is larger than this badge's flash partition (${limit.toLocaleString()} B). ` +
          `Flashing would brick the badge — this build needs to be fixed before it can be flashed. ` +
          `Reported to #firmware — do not proceed with a manual esptool flash of this file either.`
        );
      }
    }

    badgeReady = true;
    flashButton.manifest = manifestUrl;
    flashButton.style.display = 'inline-block';
  } catch (err) {
    badgeReady = false;
    flashButton.style.display = 'none';
    showFlasherError(badgeKey, err.message);
  }
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
