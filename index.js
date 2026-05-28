const express = require('express');
const nodemailer = require('nodemailer');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

const CARRIERS = {
  att:       '@txt.att.net',
  verizon:   '@vtext.com',
  tmobile:   '@tmomail.net',
  sprint:    '@messaging.sprintpcs.com',
  boost:     '@sms.myboostmobile.com',
  cricket:   '@sms.cricketwireless.net',
  metropcs:  '@mymetropcs.com',
  uscellular:'@email.uscc.net',
};

app.post('/send', async (req, res) => {
  try {
    const { to, carrier, body } = req.body;
    const domain = CARRIERS[carrier];
    if (!domain) return res.status(400).json({ error: 'Unknown carrier' });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const emailAddress = to.replace(/\D/g, '').slice(-10) + domain;
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: emailAddress,
      subject: '',
      text: body,
    });

    res.json({ ok: true, sent_to: emailAddress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(process.env.PORT || 3000, () => console.log('Server ready'));
