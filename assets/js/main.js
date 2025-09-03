// ================= main.js =================
import { initI18n, getLang } from './i18n.js';
import { initTabs } from './tabs.js';
import { initReveal } from './reveal.js';
import { initWeather } from './weather.js';
import { initGallery } from './gallery.js';

(async function boot(){
  const y = document.getElementById('y'); if (y) y.textContent = new Date().getFullYear();

  await initI18n();
  initTabs();
  initReveal();
  initWeather(getLang);

  // Initialize gallery: put your filenames here
  initGallery({
    basePath: "images/gallery/",
    items: [
      { file:"living_1.jpg",  cap:"Living room" },
      { file:"kitchen_1.jpg", cap:"Kitchen" },
      { file:"bedroom_1.jpg", cap:"Bedroom" },
      { file:"bathroom_1.jpg",cap:"Bathroom" },
      { file:"balcony_1.jpg", cap:"Balcony view" },
      { file:"neighborhood_1.jpg", cap:"Neighborhood" },
    ]
  });
})();
