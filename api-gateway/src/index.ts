import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for logging, security, etc., can be added here

// Proxy setup: Routes incoming requests to the respective services
app.use(
  '/users',
  createProxyMiddleware({
    target: 'http://user-service:4000',
    changeOrigin: true,
    pathRewrite: { '^/users': '' }, // Optional: Removes '/users' from the request path
  }),
);

app.use(
  '/products',
  createProxyMiddleware({
    target: 'http://product-service:5000',
    changeOrigin: true,
    pathRewrite: { '^/products': '' },
  }),
);

app.get('/', (req, res) => {
  res.send('API Gateway is running');
});

// Global error handler
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error(err);
    res.status(500).send('Internal Server Error');
  },
);

app.listen(PORT, () => {
  console.log(`API Gateway listening on port ${PORT}`);
});
