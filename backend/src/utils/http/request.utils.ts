export const parseUserAgent = (userAgent: string): string => {
  if (!userAgent) return 'Unknown Device';

  // Mobile detection
  const isMobile =
    /Mobile|Android|iPhone|iPad|iPod|BlackBerry|Opera Mini|IEMobile|Windows Phone/i.test(
      userAgent
    );

  if (isMobile) {
    if (userAgent.includes('Chrome') || userAgent.includes('CriOS'))
      return 'Mobile Chrome';
    if (userAgent.includes('Safari') && !userAgent.includes('Chrome'))
      return 'Mobile Safari';
    if (userAgent.includes('Firefox') || userAgent.includes('FxiOS'))
      return 'Mobile Firefox';
    if (userAgent.includes('Edge') || userAgent.includes('EdgiOS'))
      return 'Mobile Edge';
    if (userAgent.includes('Opera')) return 'Mobile Opera';
    return 'Mobile Device';
  }

  // Desktop browsers
  if (userAgent.includes('Chrome') && !userAgent.includes('Chromium'))
    return 'Desktop Chrome';
  if (userAgent.includes('Firefox')) return 'Desktop Firefox';
  if (userAgent.includes('Safari') && !userAgent.includes('Chrome'))
    return 'Desktop Safari';
  if (userAgent.includes('Edge')) return 'Desktop Edge';
  if (userAgent.includes('Opera')) return 'Desktop Opera';

  return 'Desktop Browser';
};
