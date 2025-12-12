import { useEffect } from 'react';
import { useSettings } from '../context/SettingsContext';

const YandexMetrika = () => {
  const { settings } = useSettings();
  const metrikaId = settings?.yandex_metrika_id;

  useEffect(() => {
    if (!metrikaId || metrikaId.trim() === '') return;

    // Check if already loaded
    if ((window as any).ym) return;

    // Load Yandex.Metrika
    (function(m: any, e: any, t: any, r: any, i: any, k: any, a: any) {
      m[i] = m[i] || function() { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * (new Date() as any);
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');

    (window as any).ym(metrikaId, 'init', {
      clickmap: true,
      trackLinks: true,
      accurateTrackBounce: true,
      webvisor: true,
    });
  }, [metrikaId]);

  if (!metrikaId || metrikaId.trim() === '') return null;

  return (
    <noscript>
      <div>
        <img
          src={`https://mc.yandex.ru/watch/${metrikaId}`}
          style={{ position: 'absolute', left: '-9999px' }}
          alt=""
        />
      </div>
    </noscript>
  );
};

export default YandexMetrika;
