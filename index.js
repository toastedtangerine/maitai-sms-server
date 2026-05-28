const express = require('express');
const twilio = require('twilio');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.post('/send', async (req, res) => {
  try {
    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
    const { to, body } = req.body;
    await client.messages.create({ from: process.env.TWILIO_PHONE, to, body });
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server ready'));
