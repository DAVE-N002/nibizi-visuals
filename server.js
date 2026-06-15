const express = require('express');
const compression = require('compression');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(compression());

app.use((req, res, next) => {
  if (req.path === '/' || req.path.endsWith('.html')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
  }
  next();
});

app.use(express.static(path.join(__dirname, 'public'), {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.html')) {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    } else if (/\.(jpe?g|png|webp|gif|svg|ico)$/i.test(filePath)) {
      res.set('Cache-Control', 'public, max-age=31536000, immutable');
    } else if (/\.(css|js|woff2?)$/i.test(filePath)) {
      res.set('Cache-Control', 'public, max-age=604800');
    } else {
      res.set('Cache-Control', 'public, max-age=3600');
    }
  }
}));

app.get('*', (req, res) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
