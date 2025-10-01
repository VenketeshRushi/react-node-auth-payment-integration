export const validateIndianMobile = (value: string): boolean => {
  const phoneRegex = /^(\+91[\-\s]?|91[\-\s]?|0)?[6-9]\d{9}$/;
  if (!phoneRegex.test(value)) {
    throw new Error('Invalid Indian mobile number');
  }
  return true;
};

export const formatPhoneNumber = (
  number: string,
  countryCode = '91'
): string => {
  // Remove all non-digits
  number = number.replace(/\D/g, '');

  // Add country code if not present
  if (!number.startsWith(countryCode)) {
    number = countryCode + number;
  }

  return `+${number}`;
};
