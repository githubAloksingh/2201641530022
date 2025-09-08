export const isValidUrl = (url) => {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

export const isValidValidity = (validity) => {
  if (!validity) return true; // Optional field
  const num = parseInt(validity, 10);
  return !isNaN(num) && num > 0;
};

export const validateUrlEntry = (entry) => {
  const errors = {};

  if (!entry.originalUrl || !entry.originalUrl.trim()) {
    errors.originalUrl = 'Original URL is required';
  } else if (!isValidUrl(entry.originalUrl.trim())) {
    errors.originalUrl = 'Must be a valid http:// or https:// URL';
  }

  if (entry.validity && !isValidValidity(entry.validity)) {
    errors.validity = 'Validity must be a positive number';
  }

  if (entry.preferredShortcode && !/^[A-Za-z0-9]+$/.test(entry.preferredShortcode)) {
    errors.preferredShortcode = 'Shortcode must be alphanumeric';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};