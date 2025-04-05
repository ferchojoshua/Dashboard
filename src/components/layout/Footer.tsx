import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      component="footer" 
      sx={{
        py: 2,
        px: 3,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.background.paper,
        textAlign: 'center',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        © 2023 Sistema de Monitoreo. Todos los derechos reservados.
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Contacto: soporte@sistemamonitoreo.com
      </Typography>
    </Box>
  );
};

export default Footer; 