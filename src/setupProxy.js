const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.singular.net',
      changeOrigin: true,
      secure: false,
      pathRewrite: {
        '^/api': '',
      },
      onProxyReq: function(proxyReq) {
        console.log('Proxying request to Singular:', proxyReq.path);
      },
      onProxyRes: function(proxyRes, req, res) {
        console.log('Received response from Singular:', proxyRes.statusCode);
      },
      onError: function(err, req, res) {
        console.error('Proxy error:', err);
      }
    })
  );
}; 