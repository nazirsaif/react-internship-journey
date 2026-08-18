# Identified Issues (Pre-Refactor)

As part of the end-to-end review of early projects, `weather-app-main` was identified as the weakest in terms of structure and code quality.

## Review Notes
1. **Flat Monolithic Structure:** Frontend HTML files and the backend Express server (`server.js`) are jumbled together in the root directory. 
2. **Lack of Types:** Everything is written in plain JavaScript with no type safety, increasing the likelihood of runtime errors.
3. **No Componentization:** The frontend relies on manual DOM manipulation inside flat scripts (`homepage.js`) with duplicated layout code across multiple HTML files.
4. **Hardcoded Secrets & State:** The MongoDB URI and API keys (e.g., OpenWeather) are hardcoded directly into the codebase.
5. **No Tests or Accessibility:** There is a complete lack of unit testing, and the raw HTML files miss modern accessibility standards (ARIA roles, semantic HTML).

These issues will be addressed via a comprehensive refactor.
