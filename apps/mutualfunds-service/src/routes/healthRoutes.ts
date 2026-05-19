import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    service: 'mf-service',
    status: 'UP',
    timestamp: new Date(),
  });
});

export default router;