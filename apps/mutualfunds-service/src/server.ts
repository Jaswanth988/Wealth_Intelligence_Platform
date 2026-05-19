import dotenv from 'dotenv';

dotenv.config();

import app from './app';

const PORT = process.env.PORT || 5000;

console.log('MF_API_KEY:', process.env.MF_API_KEY);

app.listen(PORT, () => {
  console.log(`MF Service running on ${PORT}`);
});