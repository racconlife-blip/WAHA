import express from 'express';
import { create } from '@wppconnect-team/wppconnect';

const app = express();
const port = process.env.PORT || 3000;

let client: any;

app.get('/', (req, res) => {
  res.send('WAHA server iniciado com sucesso!');
});

app.get('/start-session', async (req, res) => {
  const session = req.query.sessionName || 'default';

  client = await create({
    session,
    catchQR: (base64Qr, asciiQR, attempts, urlCode) => {
      console.log('QR Code:', urlCode);
    },
    statusFind: (statusSession, session) => {
      console.log('Status da sessão:', statusSession);
    },
  });

  res.send(`Sessão ${session} iniciada.`);
});

app.get('/qr', async (req, res) => {
  const session = req.query.sessionName || 'default';
  if (!client) {
    return res.status(400).send('Sessão não iniciada. Acesse /start-session primeiro.');
  }
  const qr = await client.getQrCode();
  res.send(`<img src="${qr}" alt="QR Code"/>`);
});

app.listen(port, () => {
  console.log(`WAHA server iniciado com sucesso na porta ${port}`);
});