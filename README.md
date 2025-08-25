
# Climapp

Climapp is a lightweight weather web application that shows current weather, hourly forecasts and air quality using the OpenWeather API. It's a static frontend with a small serverless proxy (Netlify Functions) to keep the API key secure.

## Tech Stack

- Client: HTML, CSS, JavaScript (ES Modules)
- Serverless: Netlify Functions (Node)

## Live Demo

Available on Netlify: https://miclimapp.netlify.app/

## Features

- Current weather card with description and icon
- 24-hour and 5-day forecasts
- Air quality and environment highlights
- Search by city (geocoding) and current location support
- Serverless proxy to avoid exposing API keys in the browser

## Quick start (development)

1. Install dependencies:

```powershell
npm install
```

2. Create a local `.env` for development (do not commit it):

```powershell
# .env
OPENWEATHER_API_KEY=your_openweather_api_key_here
```

3. Start Netlify local dev (requires `netlify-cli`):

```powershell
# optional: set env for the session
$Env:OPENWEATHER_API_KEY="your_openweather_api_key_here"
netlify dev
```

The client will call the serverless function at `/.netlify/functions/openweather` which forwards requests to OpenWeather.

## Deployment (Netlify)

1. Add `OPENWEATHER_API_KEY` as an Environment Variable in your Netlify Site settings (Build & deploy → Environment).
2. Push to your repository and let Netlify build and deploy the site. The `netlify/functions` folder contains the serverless proxy function.

## Security notes

- Never commit `.env` or your API keys to the repository. Use environment variables in Netlify for production keys.
- If an API key is ever exposed in a public repo, rotate it immediately.

## Author

Made by Ever Loza (GitHub: @never130)

Portfolio: https://everloza-porfolio.netlify.app/

Ever Loza — Software & AI Developer

## License

MIT