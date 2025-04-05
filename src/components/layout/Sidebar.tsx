import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Collapse,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Assignment as ReportIcon,
  Group as UsersIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  ChevronLeft as ChevronLeftIcon,
  ExitToApp as LogoutIcon,
  ExpandLess,
  ExpandMore,
  DateRange as DateIcon,
  AttachMoney as MoneyIcon,
  Send as SendIcon,
  Download as ReceiveIcon,
  PersonAdd as PersonAddIcon,
  Edit as EditIcon,
  List as ListIcon,
  Business as BusinessIcon,
  Login as LoginIcon,
  MenuBook as MenuBookIcon,
  AdminPanelSettings as AdminIcon,
  VpnKey as PermissionIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 240;

interface NavItem {
  title: string;
  path: string;
  icon: React.ReactElement;
  allowedRoles: string[];
  subItems?: NavItem[];
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: <DashboardIcon />,
    allowedRoles: ['admin', 'user'],
  },
  {
    title: 'Reportes',
    path: '/reports',
    icon: <ReportIcon />,
    allowedRoles: ['admin', 'user'],
    subItems: [
      { 
        title: 'Por Fecha',
        path: '/reports/date',
        icon: <DateIcon />,
        allowedRoles: ['admin', 'user']
      },
      { 
        title: 'Por Moneda',
        path: '/reports/currency',
        icon: <MoneyIcon />,
        allowedRoles: ['admin', 'user']
      },
      { 
        title: 'Por Enviadas',
        path: '/reports/sent',
        icon: <SendIcon />,
        allowedRoles: ['admin', 'user']
      },
      { 
        title: 'Por Recibidas',
        path: '/reports/received',
        icon: <ReceiveIcon />,
        allowedRoles: ['admin', 'user']
      },
    ],
  },
  {
    title: 'Usuarios',
    path: '/users',
    icon: <UsersIcon />,
    allowedRoles: ['admin'],
    subItems: [
      {
        title: 'Lista de Usuarios',
        path: '/users/list',
        icon: <ListIcon />,
        allowedRoles: ['admin']
      },
      {
        title: 'Crear Usuario',
        path: '/users/create',
        icon: <PersonAddIcon />,
        allowedRoles: ['admin']
      },
      {
        title: 'Editar Usuario',
        path: '/users/edit',
        icon: <EditIcon />,
        allowedRoles: ['admin']
      },
    ],
  },
  {
    title: 'Roles y Permisos',
    path: '/roles',
    icon: <SecurityIcon />,
    allowedRoles: ['admin'],
    subItems: [
      {
        title: 'Lista de Roles',
        path: '/roles/list',
        icon: <ListIcon />,
        allowedRoles: ['admin']
      },
      {
        title: 'Crear Rol',
        path: '/roles/create',
        icon: <AdminIcon />,
        allowedRoles: ['admin']
      },
      {
        title: 'Asignar Permisos',
        path: '/roles/permissions',
        icon: <PermissionIcon />,
        allowedRoles: ['admin']
      },
      {
        title: 'Acceso a Menús',
        path: '/roles/menu-access',
        icon: <MenuBookIcon />,
        allowedRoles: ['admin']
      },
    ],
  },
  {
    title: 'Configuración',
    path: '/settings',
    icon: <SettingsIcon />,
    allowedRoles: ['admin', 'user'],
    subItems: [
      {
        title: 'Datos de Empresa',
        path: '/settings/company',
        icon: <BusinessIcon />,
        allowedRoles: ['admin']
      },
      {
        title: 'Configuración Login',
        path: '/settings/login',
        icon: <LoginIcon />,
        allowedRoles: ['admin']
      },
      {
        title: 'Apariencia',
        path: '/settings/appearance',
        icon: <SettingsIcon />,
        allowedRoles: ['admin']
      },
    ],
  },
];

interface SidebarProps {
  children: React.ReactNode;
}

const Sidebar = ({ children }: SidebarProps) => {
  const [open, setOpen] = useState(true);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleMenuClick = (path: string) => {
    setMenuOpen(menuOpen === path ? null : path);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/');
  };

  const filteredNavItems = navItems.filter(
    (item) => user && item.allowedRoles.includes(user.role)
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { xs: '100%', md: open ? `calc(100% - ${drawerWidth}px)` : '100%' },
          ml: { xs: 0, md: open ? `${drawerWidth}px` : 0 },
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            {open && !isMobile ? <ChevronLeftIcon /> : <MenuIcon />}
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Sistema de Monitoreo
          </Typography>
          {user && (
            <>
              <IconButton
                onClick={handleProfileMenuOpen}
                size="small"
                sx={{ ml: 2 }}
              >
                <Avatar sx={{ bgcolor: 'secondary.main' }}>
                  {user.name.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleProfileMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem disabled>
                  <Typography variant="body2">{user.name}</Typography>
                </MenuItem>
                <MenuItem disabled>
                  <Typography variant="body2" color="text.secondary">
                    {user.role}
                  </Typography>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <LogoutIcon fontSize="small" />
                  </ListItemIcon>
                  Cerrar Sesión
                </MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={open}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
          display: { xs: 'block', sm: 'block' },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Toolbar />
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            p: 2,
            mb: 2
          }}
        >
          <Box
            component="img"
            src="/images/descarga.jpg"
            alt="Logo"
            sx={{
              width: '150px',
              height: 'auto',
              display: 'block',
              margin: '0 auto',
              borderRadius: '8px'
            }}
          />
        </Box>
        <Divider />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {filteredNavItems.map((item) => (
              <Box key={item.path}>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      if (item.subItems) {
                        handleMenuClick(item.path);
                      } else {
                        navigate(item.path);
                        if (isMobile) setOpen(false);
                      }
                    }}
                    selected={location.pathname === item.path || location.pathname.startsWith(item.path + '/')}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                    {item.subItems && (
                      menuOpen === item.path ? <ExpandLess /> : <ExpandMore />
                    )}
                  </ListItemButton>
                </ListItem>
                {item.subItems && (
                  <Collapse in={menuOpen === item.path} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem) => (
                        <ListItemButton
                          key={subItem.path}
                          sx={{ pl: 4 }}
                          onClick={() => {
                            navigate(subItem.path);
                            if (isMobile) setOpen(false);
                          }}
                          selected={location.pathname === subItem.path}
                        >
                          <ListItemIcon>{subItem.icon}</ListItemIcon>
                          <ListItemText primary={subItem.title} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Collapse>
                )}
              </Box>
            ))}
          </List>
        </Box>
      </Drawer>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { xs: '100%', md: `calc(100% - ${open && !isMobile ? drawerWidth : 0}px)` },
          ml: { xs: 0, md: open && !isMobile ? `${drawerWidth}px` : 0 },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default Sidebar; 