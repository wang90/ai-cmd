import axios from 'axios';

export default async function translateWord(text, config) {
  const { from, to } = config;
  try {
    const res = await axios.post('https://libretranslate.de/translate', {
      q: text,
      source: from,
      target: to,
      format: 'text',
    }, {
      headers: { 'accept': 'application/json' },
    });
    console.log(res)
    return res.data.translatedText;
  } catch (err) {
    console.error('❌ 翻译出错:', err.message);
    return '';
  }
}
