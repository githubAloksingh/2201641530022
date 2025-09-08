const BASE62_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateShortcode = (length = 6) => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += BASE62_CHARS.charAt(Math.floor(Math.random() * BASE62_CHARS.length));
  }
  return result;
};

export const ensureUniqueShortcode = (preferredShortcode, existingShortcodes) => {
  if (preferredShortcode) {
    if (existingShortcodes.includes(preferredShortcode)) {
      throw new Error(`Shortcode '${preferredShortcode}' is already in use`);
    }
    return preferredShortcode;
  }

  let shortcode;
  do {
    shortcode = generateShortcode();
  } while (existingShortcodes.includes(shortcode));

  return shortcode;
};

export const isValidShortcode = (shortcode) => {
  if (!shortcode) return true; // Optional field
  return /^[A-Za-z0-9]+$/.test(shortcode) && shortcode.length >= 3 && shortcode.length <= 20;
};