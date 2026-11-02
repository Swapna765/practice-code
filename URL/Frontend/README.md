# Snip frontend

The React/Vite interface for the URL shortener. From this folder, run `npm install` and `npm run dev`. The Vite development server proxies API requests to the backend at `http://localhost:3000`.

## Source layout

- `src/App.jsx` — page state and event handlers; connects the UI to the API.
- `src/components/` — one file per visible part of the page: header, hero, link form, result, account panel, link history, and footer.
- `src/services/api.js` — backend requests in one place.
- `src/App.css` — styles for the page and its components.
- `src/index.css` — global styles and browser defaults.

The flow is: a component reports an action to `App.jsx`, the page calls a function in `services/api.js`, then updates state and passes new values back to the components. Signed-in users can see their long/short URL pairs in link history; guest links are not associated with an account.

For backend setup and the complete feature list, see [the project README](../README.md).
