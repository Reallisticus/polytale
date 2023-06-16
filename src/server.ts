import express from 'express';
import cors from 'cors';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/translate', async (req, res) => {
  const { text, targetLang } = req.body;

  try {
    const response = await axios.post(
      'https://api-free.deepl.com/v2/translate',
      `text=${encodeURIComponent(text)}&target_lang=${targetLang}`,
      {
        headers: {
          Authorization:
            'DeepL-Auth-Key 81887306-e2bd-bcdc-3a90-e98f1346c55d:fx',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    if (
      response.data &&
      response.data.translations &&
      response.data.translations.length > 0
    ) {
      return res.json({ translatedText: response.data.translations[0].text });
    }

    throw new Error('No translation found');
  } catch (error) {
    console.error(`Error translating text: ${(error as Error).message}`);
    res.status(500).send({ error: 'Failed to translate text' });
  }
});

app.listen(3000, () => {
  console.log('Translation server started on port 3000');
});
