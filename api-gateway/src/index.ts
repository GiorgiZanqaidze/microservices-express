import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';
import Joi from 'joi';

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  USER_SERVICE_URL: Joi.string().uri().required(),
  PRODUCT_SERVICE_URL: Joi.string().uri().required(),
}).unknown();

const { error, value: env } = envSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const app = express();
const PORT = env.PORT;

// Health check endpoints
app.get('/health', (req, res) => {
  res.send('API Gateway is healthy');
});

// Proxy setup
app.use(
  '/users',
  createProxyMiddleware({
    target: env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/users': '' },
  }),
);

app.use(
  '/products',
  createProxyMiddleware({
    target: env.PRODUCT_SERVICE_URL,
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
