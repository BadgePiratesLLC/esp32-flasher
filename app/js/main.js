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

badgeSelect.addEventListener('change', () => {
  const selected = badgeSelect.value;

  if (selected) {
    badgeImage.src = badgeImages[selected];
    badgeImage.style.display = 'block';

    badgeDescription.innerText = badgeDescriptions[selected] || "";
    badgeDescription.style.display = 'block';

    flashButton.manifest = manifestUrls[selected];
    flashButton.style.display = 'inline-block';
  } else {
    badgeImage.style.display = 'none';
    badgeDescription.style.display = 'none';
    flashButton.style.display = 'none';
  }
});
