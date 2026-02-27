const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const deceasedRoutes = require('./src/routes/deceased');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// 简单健康检查
app.get('/', (req, res) => {
  res.json({ status: 'ok' });
});

// 业务路由
app.use(deceasedRoutes);

// 统一 404
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
  });
});

// 统一错误处理中间件
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error('未捕获错误:', err);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
  });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`服务器已启动，端口: ${port}`);
});

