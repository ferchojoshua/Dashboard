import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Alert,
  Divider,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material';

interface Permission {
  id: string;
  name: string;
  description: string;
}

const defaultPermissions: Permission[] = [
  {
    id: 'dashboard_view',
    name: 'Ver Dashboard',
    description: 'Permite ver el dashboard principal'
  },
  {
    id: 'reports_view',
    name: 'Ver Reportes',
    description: 'Permite ver los reportes del sistema'
  },
  {
    id: 'reports_create',
    name: 'Crear Reportes',
    description: 'Permite crear nuevos reportes'
  },
  {
    id: 'users_view',
    name: 'Ver Usuarios',
    description: 'Permite ver la lista de usuarios'
  },
  {
    id: 'users_create',
    name: 'Crear Usuarios',
    description: 'Permite crear nuevos usuarios'
  },
  {
    id: 'users_edit',
    name: 'Editar Usuarios',
    description: 'Permite editar usuarios existentes'
  },
  {
    id: 'settings_view',
    name: 'Ver Configuración',
    description: 'Permite ver la configuración del sistema'
  },
  {
    id: 'settings_edit',
    name: 'Editar Configuración',
    description: 'Permite modificar la configuración del sistema'
  },
];

const CreateRole = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: {} as Record<string, boolean>,
  });
  
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handlePermissionChange = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permissionId]: !prev.permissions[permissionId]
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!formData.name.trim()) {
      setError('El nombre del rol es obligatorio');
      return;
    }

    try {
      // Aquí iría la lógica para guardar el rol
      console.log('Datos del rol a guardar:', formData);
      setSuccess('Rol creado exitosamente');
      
      // Limpiar el formulario
      setFormData({
        name: '',
        description: '',
        permissions: {},
      });
    } catch (err) {
      setError('Error al crear el rol. Por favor, intente nuevamente.');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
        Crear Nuevo Rol
      </Typography>
      
      <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
        <form onSubmit={handleSubmit}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <TextField
            fullWidth
            label="Nombre del Rol"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            margin="normal"
            required
          />
          
          <TextField
            fullWidth
            label="Descripción"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            margin="normal"
            multiline
            rows={3}
          />
          
          <Divider sx={{ my: 3 }} />
          
          <FormControl component="fieldset" variant="standard" sx={{ width: '100%' }}>
            <FormLabel component="legend" sx={{ mb: 2 }}>
              <Typography variant="h6">Permisos del Rol</Typography>
            </FormLabel>
            
            <FormGroup>
              <Grid container spacing={2}>
                {defaultPermissions.map((permission) => (
                  <Grid item xs={12} sm={6} md={4} key={permission.id}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        height: '100%',
                        backgroundColor: theme.palette.background.default
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={!!formData.permissions[permission.id]}
                            onChange={() => handlePermissionChange(permission.id)}
                            name={permission.id}
                          />
                        }
                        label={
                          <Box>
                            <Typography variant="body1">{permission.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {permission.description}
                            </Typography>
                          </Box>
                        }
                      />
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </FormGroup>
          </FormControl>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setFormData({
                  name: '',
                  description: '',
                  permissions: {},
                });
                setError('');
                setSuccess('');
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              Crear Rol
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateRole; 