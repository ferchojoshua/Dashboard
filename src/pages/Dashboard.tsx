import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  useTheme,
  useMediaQuery,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  //LinearProgress,
  CircularProgress,
  Alert,
  Theme,
} from '@mui/material';
import {
  Add as AddIcon,
  Computer as ComputerIcon,
  Storage as ServerIcon,
  Laptop as WorkstationIcon,
  Circle as StatusIcon,
  Timer as TimerIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  AccountBalance as AccountBalanceIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';
import { monitoringService, MonitoringDevice, TransactionData } from '../services/monitoringService';

interface TransactionStats {
  id: string;
  title: string;
  count: number;
  icon: React.ReactElement;
  type: 'ring' | 'circular' | 'bar' | 'indicator';
  segments: {
    label: string;
    value: number;
    color: string;
  }[];
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'online':
      return 'success.main';
    case 'offline':
      return 'error.main';
    case 'warning':
      return 'warning.main';
    default:
      return 'grey.500';
  }
};

const getDeviceIcon = (type: string) => {
  switch (type) {
    case 'computer':
      return <ComputerIcon sx={{ fontSize: 40 }} />;
    case 'server':
      return <ServerIcon sx={{ fontSize: 40 }} />;
    case 'workstation':
      return <WorkstationIcon sx={{ fontSize: 40 }} />;
    default:
      return <ComputerIcon sx={{ fontSize: 40 }} />;
  }
};

const getUsageColor = (usage: number) => {
  if (usage >= 90) return 'error';
  if (usage >= 70) return 'warning';
  return 'success';
};

// Tarjeta principal de cantidad con gráfico circular
const CountCard = ({ title, count, colors, segments }: { 
  title: string; 
  count: number; 
  colors: string[];
  segments: { label: string; value: number; color: string }[];
}) => {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  
  // Calcula total para porcentajes
  const total = segments.reduce((acc, curr) => acc + curr.value, 0);
  
  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 3 },
        height: '100%',
      }}
    >
      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant={isMobile ? "h4" : "h3"} fontWeight="bold" sx={{ mr: 2 }}>
          {count}
        </Typography>
        <Box sx={{ 
          position: 'relative', 
          width: 80, 
          height: 80, 
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `conic-gradient(
            ${segments.map((segment, index, arr) => {
              const prevPercent = arr.slice(0, index).reduce((sum, s) => sum + (s.value / total) * 100, 0);
              const currPercent = (segment.value / total) * 100;
              return `${segment.color} ${prevPercent}% ${prevPercent + currPercent}%`;
            }).join(', ')}
          )`
        }}>
          <Box sx={{ 
            width: 50, 
            height: 50, 
            borderRadius: '50%', 
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}></Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        {segments.map((segment, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ 
              width: 12, 
              height: 12, 
              borderRadius: '2px', 
              bgcolor: segment.color, 
              mr: 1 
            }}/>
            <Typography variant="body2">{segment.label}</Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ ml: 'auto' }}>
              {segment.value}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// Tarjeta de estado con barras
const StatusCard = ({ title, items }: { 
  title: string; 
  items: { label: string; count: number; color: string }[];
}) => {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  
  // Encontrar el valor máximo para escalar las barras
  const maxCount = Math.max(...items.map(item => item.count));
  
  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, height: '100%' }}>
      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
        {title}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '85%', justifyContent: 'flex-end' }}>
        <Box sx={{ display: 'flex', height: '180px', alignItems: 'flex-end', gap: 1, mb: 1 }}>
          {items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="body2" fontWeight="bold">
                {item.count}
              </Typography>
              <Box 
                sx={{ 
                  width: isMobile ? 16 : 30, 
                  height: `${(item.count / maxCount) * 100}%`, 
                  bgcolor: item.color,
                  minHeight: 10,
                }}
              />
              <Box 
                sx={{ 
                  width: isMobile ? 16 : 30, 
                  height: 10,
                  bgcolor: item.color,
                  opacity: 0.3,
                }}
              />
            </Box>
          ))}
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          {items.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box sx={{ 
                width: 8, 
                height: 8, 
                borderRadius: '2px', 
                bgcolor: item.color, 
                mr: 0.5 
              }}/>
              <Typography variant="caption" sx={{ fontSize: isMobile ? '0.6rem' : '0.75rem' }}>
                {item.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

// Tarjeta de dispositivos por tipo
const DeviceTypeCard = ({ title, devices }: { 
  title: string; 
  devices: { label: string; count: number; color: string }[]; 
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
        {title}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography variant="h3" fontWeight="bold">
          {devices.reduce((acc, curr) => acc + curr.count, 0)}
        </Typography>
        
        <Box sx={{ 
          position: 'relative', 
          width: 80, 
          height: 80, 
          borderRadius: '50%',
          overflow: 'hidden',
        }}>
          {devices.map((device, idx, arr) => {
            const percent = device.count / arr.reduce((sum, d) => sum + d.count, 0) * 100;
            const prevPercent = arr.slice(0, idx).reduce((sum, d) => 
              sum + (d.count / arr.reduce((s, dv) => s + dv.count, 0) * 100), 0);
            
            return (
              <Box 
                key={idx}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  background: device.color,
                  clipPath: `polygon(
                    50% 50%,
                    ${50 + 50 * Math.cos(2 * Math.PI * prevPercent / 100)}% ${50 + 50 * Math.sin(2 * Math.PI * prevPercent / 100)}%,
                    ${50 + 50 * Math.cos(2 * Math.PI * (prevPercent + percent / 2) / 100)}% ${50 + 50 * Math.sin(2 * Math.PI * (prevPercent + percent / 2) / 100)}%,
                    ${50 + 50 * Math.cos(2 * Math.PI * (prevPercent + percent) / 100)}% ${50 + 50 * Math.sin(2 * Math.PI * (prevPercent + percent) / 100)}%
                  )`,
                }}
              />
            );
          })}
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '50%',
            height: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            bgcolor: 'background.paper',
          }} />
        </Box>
      </Box>
      
      <Box sx={{ mt: 2 }}>
        {devices.map((device, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ 
              width: 10, 
              height: 10, 
              borderRadius: '2px', 
              bgcolor: device.color, 
              mr: 1 
            }}/>
            <Typography variant="body2">{device.label}</Typography>
            <Typography variant="body2" fontWeight="bold" sx={{ ml: 'auto' }}>
              {device.count}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// Tarjeta para dispositivos no monitoreados
const UnmonitoredDeviceCard = ({ title, subtitle, devices }: { 
  title: string;
  subtitle: string;
  devices: { label: string; count: number; color: string }[];
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="h3" fontWeight="bold">
          {devices.reduce((acc, curr) => acc + curr.count, 0)}
        </Typography>
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
          {devices.map((device, index) => (
            <Box key={index} sx={{ textAlign: 'center' }}>
              <Box sx={{ 
                width: 28, 
                height: 28, 
                borderRadius: '50%', 
                bgcolor: device.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 1
              }}>
                <Typography variant="body2" color="white" fontWeight="bold">
                  {device.count}
                </Typography>
              </Box>
              <Typography variant="caption" display="block">
                {device.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};

// Tarjeta de estado de instalación
const InstallStatusCard = ({ title, subtitle, statuses }: {
  title: string;
  subtitle: string;
  statuses: { label: string; count: number; color: string }[];
}) => {
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down('sm'));
  
  // Encontrar el valor máximo para escalar las barras
  const maxCount = Math.max(...statuses.map(item => item.count));
  
  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 2 }, height: '100%' }}>
      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
        {title}
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
      
      <Box sx={{ display: 'flex', height: 140, alignItems: 'flex-end', gap: 1, mt: 2 }}>
        {statuses.map((status, index) => (
          <Box key={index} sx={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center' }}>
            <Typography variant="caption" fontWeight="bold">
              {status.count}
            </Typography>
            <Box 
              sx={{ 
                width: '100%', 
                height: `${(status.count / maxCount) * 100}%`, 
                bgcolor: status.color,
                minHeight: 10,
              }}
            />
            <Typography variant="caption" sx={{ mt: 1, fontSize: isMobile ? '0.6rem' : '0.75rem' }}>
              {status.label}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

const DeviceCard = ({ device }: { device: MonitoringDevice }) => {
  const getProgressValue = (value: number) => {
    return Math.min(Math.max(value, 0), 100);
  };

  return (
    <Paper
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        minHeight: '280px',
      }}
      elevation={3}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Box sx={{ mr: 2 }}>
          {getDeviceIcon(device.type)}
        </Box>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h2" noWrap>
            {device.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {device.type.charAt(0).toUpperCase() + device.type.slice(1)}
          </Typography>
        </Box>
        <StatusIcon sx={{ color: getStatusColor(device.status) }} />
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, position: 'relative' }}>
        <Box sx={{ position: 'relative', display: 'inline-flex' }}>
          <CircularProgress
            variant="determinate"
            value={getProgressValue(device.cpuUsage)}
            size={120}
            thickness={4}
            sx={{
              color: getUsageColor(device.cpuUsage),
              position: 'absolute',
            }}
          />
          <CircularProgress
            variant="determinate"
            value={getProgressValue(device.memoryUsage)}
            size={100}
            thickness={4}
            sx={{
              color: getUsageColor(device.memoryUsage),
              position: 'absolute',
              top: 10,
              left: 10,
            }}
          />
          <CircularProgress
            variant="determinate"
            value={getProgressValue(device.diskUsage)}
            size={80}
            thickness={4}
            sx={{
              color: getUsageColor(device.diskUsage),
              position: 'absolute',
              top: 20,
              left: 20,
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <TimerIcon sx={{ mb: 1 }} />
            <Typography variant="caption" component="div" color="text.secondary">
              {device.uptime}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">CPU</Typography>
            <Typography variant="body2" color={getUsageColor(device.cpuUsage)}>
              {device.cpuUsage}%
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Memoria</Typography>
            <Typography variant="body2" color={getUsageColor(device.memoryUsage)}>
              {device.memoryUsage}%
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
            <Typography variant="body2">Disco</Typography>
            <Typography variant="body2" color={getUsageColor(device.diskUsage)}>
              {device.diskUsage}%
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ mt: 'auto' }}>
        <Typography variant="body2" color="text.secondary">
          Estado: {device.status.charAt(0).toUpperCase() + device.status.slice(1)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Última verificación: {device.lastCheck}
        </Typography>
      </Box>
    </Paper>
  );
};

// Componente para gráfico de anillo
const RingCard = ({ stat }: { stat: TransactionData }) => {
  const total = stat.segments.reduce((acc, curr) => acc + curr.value, 0);
  
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{stat.title}</Typography>
      </Box>
      
      <Box sx={{ position: 'relative', width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ 
          position: 'relative',
          width: 160,
          height: 160,
        }}>
          <Box sx={{ 
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            background: `conic-gradient(${stat.segments.map((segment, index, arr) => {
              const prevPercent = arr.slice(0, index).reduce((sum, s) => sum + (s.value / total) * 100, 0);
              const currPercent = (segment.value / total) * 100;
              return `${segment.color} ${prevPercent}% ${prevPercent + currPercent}%`;
            }).join(', ')})`,
          }} />
          <Box sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '70%',
            height: '70%',
            borderRadius: '50%',
            bgcolor: 'background.paper',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
          }}>
            <Typography variant="h4" fontWeight="bold">
              {stat.count.toLocaleString()}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Total
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        {stat.segments.map((segment, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: segment.color, mr: 1 }} />
            <Typography variant="body2" sx={{ flex: 1 }}>{segment.label}</Typography>
            <Typography variant="body2" fontWeight="bold">
              {segment.value.toLocaleString()}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              ({((segment.value / total) * 100).toFixed(1)}%)
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// Componente para gráfico de barras
const BarCard = ({ stat }: { stat: TransactionData }) => {
  const maxValue = Math.max(...stat.segments.map(s => s.value));
  
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{stat.title}</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-end', height: 200, gap: 2 }}>
        {stat.segments.map((segment, index) => (
          <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ mb: 1 }}>
              {segment.value}
            </Typography>
            <Box 
              sx={{ 
                width: '100%',
                height: `${(segment.value / maxValue) * 150}px`,
                bgcolor: segment.color,
                borderRadius: '4px 4px 0 0',
              }}
            />
            <Typography variant="caption" sx={{ mt: 1 }}>
              {segment.label}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          {stat.count}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Promedio por hora
        </Typography>
      </Box>
    </Paper>
  );
};

// Componente para gráfico circular
const CircularCard = ({ stat }: { stat: TransactionData }) => {
  const mainSegment = stat.segments[0];
  
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{stat.title}</Typography>
      </Box>

      <Box sx={{ position: 'relative', width: '100%', height: 200, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Box sx={{ 
          position: 'relative',
          width: 160,
          height: 160,
          borderRadius: '50%',
          background: `conic-gradient(${mainSegment.color} ${mainSegment.value}%, #f5f5f5 ${mainSegment.value}% 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            width: '80%',
            height: '80%',
            borderRadius: '50%',
            bgcolor: 'background.paper',
          }
        }}>
          <Box sx={{ position: 'relative', textAlign: 'center' }}>
            <Typography variant="h4" fontWeight="bold">
              {mainSegment.value}%
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Tasa de éxito
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: 2 }}>
        {stat.segments.map((segment, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Box sx={{ width: 12, height: 12, bgcolor: segment.color, mr: 1 }} />
            <Typography variant="body2" sx={{ flex: 1 }}>{segment.label}</Typography>
            <Typography variant="body2" fontWeight="bold">{segment.value}%</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
};

// Componente para indicador
const IndicatorCard = ({ stat }: { stat: TransactionData }) => {
  const currentValue = stat.segments[0].value;
  const targetValue = stat.segments[1].value;
  
  return (
    <Paper elevation={3} sx={{ p: 3, height: '100%' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6">{stat.title}</Typography>
      </Box>

      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography variant="h2" fontWeight="bold" color={currentValue >= targetValue ? 'success.main' : 'warning.main'}>
          {currentValue}%
        </Typography>
        <Box
          sx={{
            width: '100%',
            height: 20,
            bgcolor: 'background.paper',
            borderRadius: 2,
            mt: 2,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              width: `${currentValue}%`,
              height: '100%',
              bgcolor: currentValue >= targetValue ? 'success.main' : 'warning.main',
              borderRadius: 2,
              transition: 'width 0.5s ease-in-out',
            }}
          />
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant="body2">Objetivo</Typography>
          <Typography variant="body2" fontWeight="bold">{targetValue}%</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="body2">Estado</Typography>
          <Typography 
            variant="body2" 
            fontWeight="bold"
            color={currentValue >= targetValue ? 'success.main' : 'warning.main'}
          >
            {currentValue >= targetValue ? 'Cumplido' : 'En progreso'}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'computer',
    status: 'online',
  });

  const [devices, setDevices] = useState<MonitoringDevice[]>([]);
  const [stats, setStats] = useState<TransactionData[]>([]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Obtener datos en paralelo
      const [devicesData, statsData] = await Promise.all([
        monitoringService.getMonitoredDevices(),
        monitoringService.getTransactionStats()
      ]);

      setDevices(devicesData);
      setStats(statsData);
    } catch (err) {
      setError('Error al cargar los datos del dashboard');
      console.error('Error al cargar datos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Actualizar datos cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setNewDevice({
      name: '',
      type: 'computer',
      status: 'online',
    });
  };

  const handleAddDevice = async () => {
    try {
      const currentDate = new Date().toLocaleString();
      const newDeviceData = {
        name: newDevice.name,
        type: newDevice.type as MonitoringDevice['type'],
        status: newDevice.status as MonitoringDevice['status'],
        lastCheck: currentDate,
        cpuUsage: 0,
        memoryUsage: 0,
        diskUsage: 0,
        uptime: '0d 0h 0m',
      };
      
      console.log('Intentando agregar dispositivo:', newDeviceData);
      const addedDevice = await monitoringService.addDevice(newDeviceData);
      console.log('Dispositivo agregado:', addedDevice);
      
      setDevices(prevDevices => [...prevDevices, addedDevice]);
      handleCloseDialog();
    } catch (err) {
      console.error('Error al agregar dispositivo:', err);
      setError('Error al agregar el dispositivo: ' + (err as Error).message);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Panel de Monitoreo
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Agregar Dispositivo
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {stats.map((stat) => (
            <Grid 
              key={stat.id}
              item 
              xs={12} 
              sm={6} 
              md={3}
            >
              {stat.type === 'ring' && <RingCard stat={stat} />}
              {stat.type === 'bar' && <BarCard stat={stat} />}
              {stat.type === 'circular' && <CircularCard stat={stat} />}
              {stat.type === 'indicator' && <IndicatorCard stat={stat} />}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Typography variant="h5" sx={{ mt: 4, mb: 3 }}>
        Dispositivos Monitoreados
      </Typography>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          {devices.map((device) => (
            <Grid 
              key={device.id}
              item
              xs={12}
              sm={6}
              md={4}
              component="div"
            >
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  height: 240,
                }}
              >
                <DeviceCard device={device} />
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Agregar Nuevo Dispositivo</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del Dispositivo"
            fullWidth
            variant="outlined"
            value={newDevice.name}
            onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            fullWidth
            label="Tipo de Dispositivo"
            value={newDevice.type}
            onChange={(e) => setNewDevice({ ...newDevice, type: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="computer">Computadora</MenuItem>
            <MenuItem value="server">Servidor</MenuItem>
            <MenuItem value="workstation">Estación de Trabajo</MenuItem>
            <MenuItem value="transfers">Transferencias</MenuItem>
          </TextField>
          <TextField
            select
            fullWidth
            label="Estado"
            value={newDevice.status}
            onChange={(e) => setNewDevice({ ...newDevice, status: e.target.value })}
          >
            <MenuItem value="online">En línea</MenuItem>
            <MenuItem value="offline">Fuera de línea</MenuItem>
            <MenuItem value="warning">Advertencia</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button 
            onClick={handleAddDevice} 
            variant="contained" 
            disabled={!newDevice.name}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Dashboard; 