import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Stack,
  SvgIcon,
  Tooltip,
  Menu,
  MenuItem,
  useMediaQuery,
  useTheme,
  Link
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import WeekendIcon from '@mui/icons-material/Weekend';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate, Outlet } from 'react-router-dom';
import LoginDialog from './LoginDialog';
import RegisterDialog from './RegisterDialog';
import AccountDialog from './AccountDialog';

const watercolorBackground = {
  background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  boxShadow: 'none',
};

const barHeight = 64;
const bottomBarHeight = 80;

const WhatsAppIcon = (props) => (
  <SvgIcon viewBox="0 0 32 32" {...props}>
    <circle cx="16" cy="16" r="16" fill="#25D366" />
    <path
      fill="#FFF"
      d="M21.4 18.5c-.3-.1-1.9-.9-2.2-1s-.6-.2-.8.2-.9 1.1-1.1 1.3-.5.2-.8.1c-2.1-.9-3.6-3-3.8-3.3s-.4-.6 0-1c.3-.4.8-.8.9-1s.1-.4 0-.6c0-.1-.8-1.9-1.1-2.6-.3-.7-.7-.6-.9-.6h-.7c-.2 0-.6.1-.8.4s-1.2 1.3-1.2 3.1 1.3 3.6 1.4 3.8c.2.3 2.5 4 6 5.3 3.5 1.3 3.5.9 4.1.8.6-.1 2.1-1 2.3-1.8.2-.9.2-1.6.1-1.7s-.3-.2-.6-.3z"
    />
  </SvgIcon>
);

const TikTokIcon = (props) => (
  <SvgIcon viewBox="0 0 24 24" {...props}>
    <path d="M9 3v12.5a2.5 2.5 0 1 1-2.4-2.5H6a4 4 0 1 0 4 4V8.2a6 6 0 0 0 4 1.5V7.1a4 4 0 0 1-4-4z" fill="#000000" />
  </SvgIcon>
);

const WatercolorLayout = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [anchorEl, setAnchorEl] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check login status on initial mount and when token changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    checkAuth();
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLoginOpen = () => setLoginOpen(true);
  const handleLoginClose = () => setLoginOpen(false);

  const handleRegisterOpen = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const handleRegisterClose = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const handleAccountOpen = () => setAccountOpen(true);
  const handleAccountClose = () => setAccountOpen(false);

  const handleLoginSuccess = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    handleLoginClose();

    // 🔁 Update global auth state (App.js)
    if (typeof onLoginSuccess === 'function') {
      onLoginSuccess();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/home');
  };

  const handleRegister = () => {
    console.log('Registering:', { name, email, phone, password, confirmPassword });
    handleRegisterClose();
  };

  const handleNavigate = (path) => {
    navigate(path);
    handleMenuClose();
  };

  useEffect(() => {
    setAnchorEl(null);
  }, [isMobile]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Top Bar */}
      <AppBar position="fixed" sx={{ ...watercolorBackground, height: barHeight }}>
        <Toolbar sx={{ minHeight: barHeight }}>
          <Box sx={{ flexGrow: 1 }}>
            <img src="/logo.png" alt="Ken Furniture Logo" style={{ height: 40 }} />
          </Box>

          {/* Desktop vs Mobile */}
          {isMobile ? (
            <>
              <IconButton edge="end" onClick={handleMenuOpen} sx={{ color: '#000' }}>
                <MenuIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem onClick={() => handleNavigate('/home')}><HomeIcon sx={{ mr: 1 }} /> Home</MenuItem>
                <MenuItem onClick={() => handleNavigate('/furniture')}><WeekendIcon sx={{ mr: 1 }} /> Furniture</MenuItem>
                {isAuthenticated && (
                  <>
                    <MenuItem onClick={() => handleNavigate('/track-order')}><ReceiptLongIcon sx={{ mr: 1 }} /> Track Order</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/cart')}><ShoppingCartIcon sx={{ mr: 1 }} /> Cart</MenuItem>
                    <MenuItem onClick={() => handleNavigate('/notifications')}><NotificationsIcon sx={{ mr: 1 }} /> Notifications</MenuItem>
                    <MenuItem onClick={handleAccountOpen}><AccountCircleIcon sx={{ mr: 1 }} /> Account</MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                  </>
                )}
                {!isAuthenticated && <MenuItem onClick={handleLoginOpen}>Login</MenuItem>}
              </Menu>
            </>
          ) : (
            <>
              <Button startIcon={<HomeIcon />} onClick={() => navigate('/home')} sx={{ color: '#333', textTransform: 'none' }}>Home</Button>
              <Button startIcon={<WeekendIcon />} onClick={() => navigate('/furniture')} sx={{ color: '#333', textTransform: 'none' }}>Furniture</Button>
              {isAuthenticated && (
                <>
                  <Button startIcon={<ReceiptLongIcon />} onClick={() => navigate('/track-order')} sx={{ color: '#333', textTransform: 'none' }}>Track Order</Button>
                  <Button startIcon={<ShoppingCartIcon />} onClick={() => navigate('/cart')} sx={{ color: '#333', textTransform: 'none' }}>Cart</Button>
                  <Button startIcon={<NotificationsIcon />} onClick={() => navigate('/notifications')} sx={{ color: '#333', textTransform: 'none' }}>Notifications</Button>
                  <Button startIcon={<AccountCircleIcon />} onClick={handleAccountOpen} sx={{ color: '#333', textTransform: 'none' }}>Account</Button>
                </>
              )}
              {isAuthenticated ? (
                <Button variant="outlined" onClick={handleLogout} sx={{ ml: 2, borderColor: '#333', color: '#333' }}>Logout</Button>
              ) : (
                <Button variant="outlined" onClick={handleLoginOpen} sx={{ ml: 2, borderColor: '#333', color: '#333' }}>Login</Button>
              )}
            </>
          )}
        </Toolbar>
      </AppBar>

      {/* Dialogs */}
      <LoginDialog
        open={loginOpen}
        onClose={handleLoginClose}
        email={email}
        password={password}
        onEmailChange={(e) => setEmail(e.target.value)}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterOpen={handleRegisterOpen}
      />

      <RegisterDialog
        open={registerOpen}
        onClose={handleRegisterClose}
        name={name}
        email={email}
        phone={phone}
        password={password}
        confirmPassword={confirmPassword}
        onNameChange={(e) => setName(e.target.value)}
        onEmailChange={(e) => setEmail(e.target.value)}
        onPhoneChange={(e) => setPhone(e.target.value)}
        onPasswordChange={(e) => setPassword(e.target.value)}
        onConfirmPasswordChange={(e) => setConfirmPassword(e.target.value)}
        onRegister={handleRegister}
        onLoginOpen={handleLoginOpen}
      />

      <AccountDialog open={accountOpen} onClose={handleAccountClose} />

      <Toolbar sx={{ minHeight: barHeight }} />
      <Box sx={{ flex: 1, px: 1, py: 1 }}>
        <Outlet />
      </Box>

      {/* Footer */}
      <AppBar position="static" sx={{ ...watercolorBackground, height: bottomBarHeight, pt: 1 }}>
        <Toolbar
          sx={{
            minHeight: bottomBarHeight,
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 1,
          }}
        >
          <Typography variant="body2" sx={{ color: '#333' }}>
            © 2025 Ken Furniture. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={2}>
            <Tooltip title="Facebook" arrow><IconButton href="https://facebook.com" target="_blank" sx={{ color: '#1877F2' }}><FacebookIcon /></IconButton></Tooltip>
            <Tooltip title="Twitter" arrow><IconButton href="https://twitter.com" target="_blank" sx={{ color: '#1DA1F2' }}><TwitterIcon /></IconButton></Tooltip>
            <Tooltip title="Instagram" arrow><IconButton href="https://instagram.com" target="_blank" sx={{ color: '#E1306C' }}><InstagramIcon /></IconButton></Tooltip>
            <Tooltip title="WhatsApp" arrow><IconButton href="https://wa.me/254700000000" target="_blank"><WhatsAppIcon /></IconButton></Tooltip>
            <Tooltip title="TikTok" arrow><IconButton href="https://www.tiktok.com" target="_blank"><TikTokIcon /></IconButton></Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

WatercolorLayout.propTypes = {
  onLoginSuccess: PropTypes.func,
};

export default WatercolorLayout;
