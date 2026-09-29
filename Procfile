# Heroku / Railway / Dokku / any buildpack-style host.
#
# The build itself is driven by the `heroku-postbuild` / `build` npm script;
# this file only declares the web process. `npm start` runs scripts/start.mjs,
# which pins NODE_ENV=production and boots the bundled server on $PORT.
web: npm start
