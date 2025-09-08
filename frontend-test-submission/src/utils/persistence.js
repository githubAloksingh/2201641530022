const STORAGE_KEY = 'affordmed_urls';

export const loadUrlsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    return [];
  }
};

export const saveUrlsToStorage = (urls) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
    return true;
  } catch (error) {
    return false;
  }
};

export const findUrlByShortcode = (shortcode) => {
  const urls = loadUrlsFromStorage();
  return urls.find(url => url.shortcode === shortcode);
};

export const updateUrlInStorage = (shortcode, updates) => {
  const urls = loadUrlsFromStorage();
  const index = urls.findIndex(url => url.shortcode === shortcode);
  
  if (index !== -1) {
    urls[index] = { ...urls[index], ...updates };
    saveUrlsToStorage(urls);
    return urls[index];
  }
  
  return null;
};

export const addUrlsToStorage = (newUrls) => {
  const existingUrls = loadUrlsFromStorage();
  const allUrls = [...existingUrls, ...newUrls];
  saveUrlsToStorage(allUrls);
  return allUrls;
};

export const getExistingShortcodes = () => {
  const urls = loadUrlsFromStorage();
  return urls.map(url => url.shortcode);
};

export const isExpired = (url) => {
  if (!url.expiryAt) return false;
  return new Date() > new Date(url.expiryAt);
};

export const getCoarseGeo = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
  } catch {
    return 'Unknown';
  }
};