// ================= weather.js =================
// Open-Meteo fetch + cache + render
// Depends on i18n.js for language detection events

const WEATHER_TTL_MS = 30 * 60 * 1000;
const WEATHER_KEY = 'patras_weather_payload';

const WEATHER_LABELS = {
  en: { clear:'Clear', partly:'Partly cloudy', fog:'Fog', drizzle:'Drizzle', rain:'Rain', snow:'Snow', showers:'Showers', snow_sh:'Snow showers', thunder:'Thunderstorm', hail:'Thunder w/ hail' },
  gr: { clear:'Αίθριος', partly:'Μερική συννεφιά', fog:'Ομίχλη', drizzle:'Ψιχάλες', rain:'Βροχή', snow:'Χιόνι', showers:'Μπόρες', snow_sh:'Μπόρες χιονιού', thunder:'Καταιγίδα', hail:'Καταιγίδα με χαλάζι' }
};

function bucketFromCode(c){
  if(c===0) return 'clear';
  if(c>=1&&c<=3) return 'partly';
  if(c===45||c===48) return 'fog';
  if(c>=51&&c<=57) return 'drizzle';
  if(c>=61&&c<=67) return 'rain';
  if(c>=71&&c<=77) return 'snow';
  if(c>=80&&c<=82) return 'showers';
  if(c>=85&&c<=86) return 'snow_sh';
  if(c===95) return 'thunder';
  if(c===96||c===99) return 'hail';
  return 'partly';
}

const fmt = (iso, lang) => new Intl.DateTimeFormat(lang==='gr'?'el-GR':'en-GB', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));

function render(data, lang){
  const tempEl = document.querySelector('.temp');
  const lineEl = document.querySelector('.line');
  const sunsetEl = document.querySelector('.sunset');
  const sunriseEl = document.querySelector('.sunrise');
  if(!tempEl||!lineEl||!sunsetEl||!sunriseEl) return;
  if(!data){ tempEl.textContent=lineEl.textContent=sunsetEl.textContent=sunriseEl.textContent='—'; return; }
  const labels = WEATHER_LABELS[lang] || WEATHER_LABELS.en;
  const bucket = bucketFromCode(Number(data.code));
  tempEl.textContent = Math.round(Number(data.temp)) + '°C';
  lineEl.textContent = labels[bucket] || '';
  sunsetEl.textContent = fmt(data.sunset, lang);
  sunriseEl.textContent = fmt(data.sunrise, lang);
}

async function fetchWeather(){
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=38.2466&longitude=21.7346&current_weather=true&daily=sunrise,sunset&timezone=Europe%2FAthens&forecast_days=1';
  const res = await fetch(url, { cache:'no-store' });
  if(!res.ok) throw new Error('weather-network');
  const j = await res.json();
  return { temp:j.current_weather?.temperature, code:j.current_weather?.weathercode, sunrise:j.daily?.sunrise?.[0], sunset:j.daily?.sunset?.[0] };
}

export async function initWeather(getLangFn){
  const getLang = typeof getLangFn === 'function' ? getLangFn : () => (localStorage.getItem('patras_lang') || 'en');

  const now = Date.now();
  let cached = null;
  try { cached = JSON.parse(localStorage.getItem(WEATHER_KEY) || 'null'); } catch {}
  if (cached && (now - cached.ts) < WEATHER_TTL_MS) {
    render(cached.data, getLang());
  } else {
    render(null, getLang());
  }

  try {
    const data = await fetchWeather();
    localStorage.setItem(WEATHER_KEY, JSON.stringify({ ts: now, data }));
    render(data, getLang());
  } catch(e) {
    // keep cached or dashes
  }

  // Re-render on language change
  document.addEventListener('langchange', () => {
    try { cached = JSON.parse(localStorage.getItem(WEATHER_KEY) || 'null'); } catch { cached = null; }
    render(cached?.data, getLang());
  });
}
