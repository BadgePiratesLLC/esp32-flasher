const badgeSelect = document.getElementById('badgeSelect');
const badgeImage = document.getElementById('badgeImage');
const flashButton = document.getElementById('flashButton');
const badgeDescriptions = {
  basicQACode25: "For QA of the base baord",
  cactuscon2025: "Official badge for CactusCon 2025, featuring ESP32-s3",
  bsideskc25: "BSidesKC 2025 badge: Available after the event"
};

badgeSelect.addEventListener('change', () => {
  const selected = badgeSelect.value;

  if (selected) {
    badgeImage.src = `/firmware/${selected}/badge.jpg`;
    badgeImage.style.display = 'block';

    badgeDescription.innerText = badgeDescriptions[selected] || "";
    badgeDescription.style.display = 'block';

    flashButton.manifest = `/firmware/${selected}/manifest.json`;
    flashButton.style.display = 'inline-block';
  } else {
    badgeImage.style.display = 'none';
    badgeDescription.style.display = 'none';
    flashButton.style.display = 'none';
  }
});
