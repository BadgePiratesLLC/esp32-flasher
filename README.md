# ESP32 Flasher

This project provides a web-based interface for flashing firmware to ESP32 devices. It uses Docker and Nginx to serve the frontend and manage firmware files.

## Features
- Web UI for selecting and flashing firmware
- Multiple firmware options (see `firmware/` directory)
- Dockerized deployment for easy setup
- Nginx reverse proxy configuration

## Project Structure
```
.
├── app/                # Frontend web application (HTML, CSS, JS)
│   ├── index.html
│   ├── style.css
│   └── js/
│       └── main.js
├── firmware/           # Firmware images and manifests
│   ├── basicQACode25/
│   │   └── manifest.json
│   ├── bsideskc25/
│   │   └── manifest.json
│   └── cactuscon2025/
│       └── manifest.json
├── nginx.conf          # Nginx configuration for serving the app
├── Dockerfile          # Dockerfile for building the app image
├── docker-compose.yml  # Docker Compose for multi-container setup
```

## Getting Started

### Prerequisites
- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/)

### Quick Start
1. Clone this repository:
   ```sh
   git clone <repo-url>
   cd esp32-flasher
   ```
2. Start the application using Docker Compose:
   ```sh
   docker compose up
   ```
3. Open your browser and go to [http://localhost:8080](http://localhost:8080)

### Stopping the Application
To stop the containers:
```sh
docker compose down
```

## Customizing Firmware
- Add new firmware directories under `firmware/`.
- Each firmware should have a `manifest.json` describing the firmware files.

## Nginx Configuration
- The `nginx.conf` file configures static file serving and reverse proxy rules.
- Modify as needed for custom domains or SSL.

## License
MIT
