import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import { Button, Menu, MenuItem, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import PersonIcon from '@mui/icons-material/Person';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import ListAltIcon from '@mui/icons-material/ListAlt';
import HowToVoteIcon from '@mui/icons-material/HowToVote';
import StarsIcon from '@mui/icons-material/Stars';
import CircleIcon from '@mui/icons-material/Circle';
import { logout } from "../services/auth.service";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { getUserByEmail } from '../services/user.service';
import HomeIcon from '@mui/icons-material/Home';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  backgroundColor: '#2C6AA0',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': {
        ...openedMixin(theme),
        backgroundColor: '#222a2d', // Color de fondo cuando el Drawer está cerrado
      },
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': {
        ...closedMixin(theme),
        backgroundColor: '#222a2d', // Color de fondo cuando el Drawer está cerrado
      },
    }),
  }),
);

export default function LayoutTricel({ children }) {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
      setAnchorElUser(null);
  };

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

const menuItems = [
    { text: 'Foro', icon: <HomeIcon />, link: '/foro'},
    { text: 'Tricel', icon: <ManageAccountsIcon />, link: '/tricel/miembros'},
    {
      text: 'Gestión de Elecciones',
      icon: <ListAltIcon />,
      subitems: [
        { text: 'Postulaciones', link: '/tricel/postulaciones' },
        { text: 'Procesos Electivos', link: '/tricel/procesos-electivos' },
        { text: 'Periodos Electivos', link: '/tricel/periodos-electivos' },
        { text: 'Confirmar Lista Ganadora', link: '/tricel/lista-ganadora' },
      ],
    },
    { text: 'Votaciones', icon: <HowToVoteIcon />, link: '/votaciones' },
  ];

  const { user }  = useAuth();
  const [usuario, setUsuario] = React.useState(null);
  
  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (user && user.email) {
          const loadedUser = await getUserByEmail(user.email);
          if (loadedUser && loadedUser.length > 0) {
            setUsuario(loadedUser[0].user);
          } else {
            console.error('No se encontró ningún usuario.');
          }
        }
      } catch (error) {
        console.error('Error al obtener el usuario:', error.message);
      }
    };

    fetchUser();
  }, [user]);

  if (!usuario) {
    return <p>Cargando usuario...</p>; // Mensaje de carga mientras se carga el usuario
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: '#2C6AA0' }}>
        <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Avatar variant="square" sx={{ width: '21px', height: '20px' }} src="https://intranet.ubiobio.cl/bootstrapsite/assets/images/escudo.png" />
            <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                    mr: 2,
                    display: { xs: 'none', md: 'flex' },
                    fontFamily: 'Open Sans',
                    fontSize: '14px',
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >
                Universidad del Bío-Bío
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, paddingLeft: '50px' }}></Box>
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Abrir Menú">
                <Button
                    onClick={handleOpenUserMenu}
                    sx={{
                        m: 0.5,
                        p: 0.5,
                        backgroundColor: '#579EC8',
                        border: 'solid #222A2D',
                        borderRadius: '15px',
                        transition: 'background-color 0.3s', 
                        '&:hover': {
                        backgroundColor: '#457392', 
                        },
                    }}
                    >
                        <ArrowDropDownIcon sx={{ color: '#fff'}} />
                        <Typography textAlign="center" sx={{ fontSize: '14px', paddingRight: 1, color: '#fff'}}>{usuario.username} (TRICEL)</Typography>
                        <Avatar
                                alt="Imagen Perfil"
                                src={`http://localhost:5000${usuario.profileImage}`} 
                                sx={{ width: 40, height: 40, objectFit: 'cover', backgroundColor: '#e0e0e0'}}
                            />
                    </Button>
                </Tooltip>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    <MenuItem onClick={handleCloseUserMenu}>
                      <Link to="/mi-perfil/" style={{ textDecoration: 'none', color: 'black' }}>
                        <Typography textAlign="center">Mi perfil</Typography>
                      </Link>
                    </MenuItem>
                    <MenuItem key={"logout"} onClick={handleLogout}>
                        <Typography textAlign="center">Cerrar sesión</Typography>
                    </MenuItem>
                </Menu>
            </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} sx={{ backgroundColor: '#222a2d' }}>
        <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
        </DrawerHeader>
        <Divider sx={{ color: '#fff'}}/>
        <List>
      {menuItems.map((item) => (
        <React.Fragment key={item.text}>
          <ListItem disablePadding sx={{ display: 'block' }}>
            {item.link ? (
              <Link to={item.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                <ListItemButton
                  sx={{
                    minHeight: 48,
                    justifyContent: open ? 'initial' : 'center',
                    px: 2.5,
                    color: '#fff',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: open ? 3 : 'auto',
                      justifyContent: 'center',
                      color: '#E1EAF1',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
                </ListItemButton>
              </Link>
            ) : (
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  color: '#fff',
                }}
                onClick={() => setOpen(!open)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                    color: '#E1EAF1',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            )}
          </ListItem>
          {item.subitems && open && (
            <List>
              {item.subitems.map((subitem) => (
                <ListItem key={subitem.text} disablePadding sx={{ display: 'block' }}>
                  <Link to={subitem.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <ListItemButton
                      sx={{
                        minHeight: 48,
                        justifyContent: open ? 'initial' : 'center',
                        px: 4, // Aumenta el padding horizontal para indentar los submenús
                        color: '#fff',
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: open ? 3 : 'auto',
                          justifyContent: 'center',
                          color: '#E1EAF1',
                        }}
                      >
                        <CircleIcon sx={{ fontSize: 'small' }} />
                      </ListItemIcon>
                      <ListItemText primary={subitem.text} sx={{ opacity: open ? 1 : 0 }} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              ))}
            </List>
          )}
        </React.Fragment>
      ))}
    </List>
        </Drawer>
      <Box component="main" sx={{ marginTop: '64px', p: 3 , width: '100%'}}>
        {children}
      </Box>
    </Box>
  );
}
