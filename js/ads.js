import { AD_CONFIG } from './ad-config.js?v=1';

const banner = document.querySelector('#ad-banner');
const slot = document.querySelector('#bottom-ad');
const status = document.querySelector('#ad-status');

if (banner && slot && status) {
  const clientIsValid = /^ca-pub-\d{16}$/.test(AD_CONFIG.client);
  const slotIsValid = /^\d{4,20}$/.test(AD_CONFIG.slot);

  if (!clientIsValid || !slotIsValid) {
    banner.classList.add('ad-banner--setup');
    status.textContent = 'Advertisement space is ready. Add your AdSense publisher and ad-unit IDs to activate it.';
  } else {
    slot.dataset.adClient = AD_CONFIG.client;
    slot.dataset.adSlot = AD_CONFIG.slot;
    slot.dataset.adFormat = 'auto';
    slot.dataset.fullWidthResponsive = 'true';
    slot.style.display = 'block';
    status.hidden = true;

    const requestAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (error) {
        console.error('AdSense could not initialize:', error);
        status.hidden = false;
        status.textContent = 'Advertisement unavailable.';
      }
    };

    const existingScript = document.querySelector('script[data-last-signal-adsense]');
    if (existingScript) {
      requestAd();
    } else {
      const script = document.createElement('script');
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.dataset.lastSignalAdsense = 'true';
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${encodeURIComponent(AD_CONFIG.client)}`;
      script.addEventListener('load', requestAd, { once: true });
      script.addEventListener('error', () => {
        status.hidden = false;
        status.textContent = 'Advertisement blocked or unavailable.';
      }, { once: true });
      document.head.append(script);
    }
  }
}
