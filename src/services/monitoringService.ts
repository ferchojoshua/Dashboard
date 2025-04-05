import axios from 'axios';
import type { AxiosResponse } from 'axios';

declare global {
  interface Window {
    env?: {
      REACT_APP_API_URL?: string;
    };
  }
}

// Obtener la URL base de la variable de entorno o usar un valor por defecto
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7000/api';

// Configurar axios para desarrollo
if (import.meta.env.DEV) {
  axios.defaults.baseURL = API_BASE_URL;
}

export interface TransactionData {
  id: string;
  title: string;
  count: number;
  type: 'ring' | 'circular' | 'bar' | 'indicator';
  segments: {
    label: string;
    value: number;
    color: string;
  }[];
}

export interface MonitoringDevice {
  id: string;
  name: string;
  type: 'computer' | 'server' | 'workstation' | 'transfers';
  status: 'online' | 'offline' | 'warning';
  lastCheck: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: string;
}

class MonitoringService {
  // Obtener estadísticas de transacciones
  async getTransactionStats(): Promise<TransactionData[]> {
    try {
      console.log('Intentando obtener estadísticas de transacciones desde:', API_BASE_URL);
      const response = await axios.get<TransactionData[]>(`${API_BASE_URL}/monitoring/transactions`);
      console.log('Respuesta recibida:', response.data);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error de red:', {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
          url: error.config?.url
        });
      } else {
        console.error('Error inesperado:', error);
      }
      throw error;
    }
  }

  // Obtener dispositivos monitoreados
  async getMonitoredDevices(): Promise<MonitoringDevice[]> {
    try {
      const response: AxiosResponse<MonitoringDevice[]> = await axios.get(`${API_BASE_URL}/monitoring/devices`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener dispositivos monitoreados:', error);
      throw error;
    }
  }

  // Obtener transacciones por hora
  async getHourlyTransactions(): Promise<TransactionData> {
    try {
      const response: AxiosResponse<TransactionData> = await axios.get(`${API_BASE_URL}/monitoring/hourly-transactions`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener transacciones por hora:', error);
      throw error;
    }
  }

  // Obtener tasa de éxito
  async getSuccessRate(): Promise<TransactionData> {
    try {
      const response: AxiosResponse<TransactionData> = await axios.get(`${API_BASE_URL}/monitoring/success-rate`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener tasa de éxito:', error);
      throw error;
    }
  }

  // Obtener nivel de servicio
  async getServiceLevel(): Promise<TransactionData> {
    try {
      const response: AxiosResponse<TransactionData> = await axios.get(`${API_BASE_URL}/monitoring/service-level`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener nivel de servicio:', error);
      throw error;
    }
  }

  // Actualizar estado de dispositivo
  async updateDeviceStatus(deviceId: string, status: string): Promise<void> {
    try {
      await axios.put(`${API_BASE_URL}/monitoring/devices/${deviceId}/status`, { status });
    } catch (error) {
      console.error('Error al actualizar estado del dispositivo:', error);
      throw error;
    }
  }

  // Agregar nuevo dispositivo
  async addDevice(device: Omit<MonitoringDevice, 'id'>): Promise<MonitoringDevice> {
    try {
      const response = await axios.post<MonitoringDevice>(`${API_BASE_URL}/monitoring/devices`, device);
      return response.data;
    } catch (error) {
      console.error('Error al agregar nuevo dispositivo:', error);
      throw error;
    }
  }
}

export const monitoringService = new MonitoringService(); 