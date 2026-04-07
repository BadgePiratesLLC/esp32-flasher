# esp32-flasher

Web-based ESP32 firmware flasher served at [firmware.badgepirates.com](https://firmware.badgepirates.com). Built on [esp-web-tools](https://esphome.github.io/esp-web-tools/) — users plug in their badge and flash directly from the browser, no install required.

## Repo layout

```
app/
  index.html       # the flasher UI
  style.css        # component styles (theme tokens come from main site)
  js/main.js       # badge → manifest mapping
firmware/
  <badge-key>/
    manifest.json  # esp-web-tools manifest
    *.bin          # binaries (when not S3-hosted)
```

Most binaries live in S3 (`s3://badgepirates-firmware/`); only the BSidesKC 25 build is checked into this repo.

## Local development

```bash
cd app
python3 -m http.server 8080
# → http://localhost:8080
```

`main.js` auto-detects localhost and uses local manifest paths instead of S3.

## Adding a new badge

See the runbook: [`badges/firmware-flasher-add-badge.md`](https://github.com/BPDocs/runbooks/blob/main/badges/firmware-flasher-add-badge.md) in BPDocs/runbooks.

## Operations

This site is served directly by nginx on WebServer02 from `/var/www/firmware/`. To deploy: push to `main`, then `ssh webserver "cd /var/www/firmware && git pull"`.

For the rest, see [BPDocs/runbooks](https://github.com/BPDocs/runbooks).
