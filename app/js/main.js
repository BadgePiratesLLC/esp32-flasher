const badgeSelect = document.getElementById('badgeSelect');
const badgeImage = document.getElementById('badgeImage');
const flashButton = document.getElementById('flashButton');

badgeSelect.addEventListener('change', () => {
  const selected = badgeSelect.value;

  if (selected) {
    badgeImage.src = `/firmware/${selected}/badge.jpg`;
    badgeImage.style.display = 'block';

    flashButton.manifest = `/firmware/${selected}/manifest.json`;
    flashButton.style.display = 'inline-block';
  } else {
    badgeImage.style.display = 'none';
    flashButton.style.display = 'none';
  }
});
