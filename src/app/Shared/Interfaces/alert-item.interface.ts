export interface AlertItem {
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}