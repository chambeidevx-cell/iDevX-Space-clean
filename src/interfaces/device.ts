export interface Device {
  id: string;
  type: 'Mobile' | 'Desktop';
  macAddress: string;
  ipAddress: string;
  os: string;
  browser: string;
  lastLogin: string;
}
