$target = "Mini-Projects/weather-app-main"

git add "$target/.gitignore" "$target/package.json" "$target/package-lock.json"
git commit -m "Initialize weather app project and dependencies"

git add "$target/server.js" "$target/Procfile"
git commit -m "Set up basic Express server and MongoDB connection"

git add "$target/index.html"
git commit -m "Add index page"

git add "$target/login.html" "$target/signup.html"
git commit -m "Add authentication pages (login & signup)"

git add "$target/homepage.html" "$target/homepage.js"
git commit -m "Create main dashboard for weather data"

git add "$target/forcast.html"
git commit -m "Implement forecast page"

git add "$target/alerts.html"
git commit -m "Add weather alerts page"

git add "$target/locales"
git commit -m "Add internationalization support (locales)"

git add "$target/public"
git commit -m "Add static assets (public folder)"

git add "$target/weatherWorker.js"
git commit -m "Add service worker for background weather tasks"

git add "$target/test"
git commit -m "Add test cases"

git add "$target/README.md" "$target/.gitattributes"
git commit -m "Update documentation and git attributes"

git push
