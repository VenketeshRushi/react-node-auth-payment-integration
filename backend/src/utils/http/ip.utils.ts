import type { Request } from 'express';

export const extractIpAddress = (req: Request): string => {
  // Priority order for IP extraction
  const possibleIps = [
    req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim(),
    req.headers['x-real-ip']?.toString(),
    req.headers['cf-connecting-ip']?.toString(),
    req.ip,
    req.connection?.remoteAddress,
    req.socket?.remoteAddress,
    (req.connection as any)?.socket?.remoteAddress,
  ];

  for (const ip of possibleIps) {
    if (ip && typeof ip === 'string') {
      let cleanIp = ip;

      // Handle IPv6-mapped IPv4 addresses
      if (cleanIp.startsWith('::ffff:')) {
        cleanIp = cleanIp.substring(7);
      }

      if (isValidIp(cleanIp)) {
        return cleanIp;
      }
    }
  }

  return '::1'; // Fallback to localhost IPv6
};

const isValidIp = (ip: string): boolean => {
  // Allow localhost IPs for development
  if (ip === '::1' || ip === '127.0.0.1') {
    return true;
  }

  // IPv4 validation
  const ipv4Regex =
    /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

  // IPv6 validation
  const ipv6Regex =
    /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
};
