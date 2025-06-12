const badgeSelect = document.getElementById('badgeSelect');
const badgeImage = document.getElementById('badgeImage');
const flashButton = document.getElementById('flashButton');
const badgeDescriptions = {
  basicQACode25: "For QA of the base baord",
  cactuscon2025: "Official badge for CactusCon 2025, featuring ESP32-s3",
  bsideskc25: "BSidesKC 2025 badge: Available after the event"
};
// Dynamically build URLs based on environment config
const baseUrl = window.APP_CONFIG?.BASE_URL || '/firmware';
const imageUrl = window.APP_CONFIG?.IMAGE_URL || '/firmware';
const env = window.APP_CONFIG?.ENV || 'local';

const manifestUrls = {
  basicQACode25: `${baseUrl}/basicQACode25/manifest.json`,
  cactuscon2025: `${baseUrl}/cactuscon2025/manifest.json`,
  bsideskc25: `${baseUrl}/bsideskc25/manifest.json`
};

const badgeImages = {
  basicQACode25: `${imageUrl}/basicQACode25/badge.jpg`,
  cactuscon2025: `${imageUrl}/cactuscon2025/badge.jpg`,
  bsideskc25: `${imageUrl}/bsideskc25/badge.jpg`
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
