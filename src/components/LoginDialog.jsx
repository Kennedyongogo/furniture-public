import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  Stack,
  Link,
  IconButton,
  InputAdornment,
  useMediaQuery,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';

const LoginDialog = ({
  open,
  onClose,
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onLoginSuccess,
  onRegisterOpen
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const fetchUserInfo = async (token) => {
    try {
      const res = await fetch('http://localhost:3003/api/users/me', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error('Failed to fetch user info');

      const user = await res.json();
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      console.error('Error fetching user info:', err);
    }
  };

  const handleLogin = async () => {
    try {
      const res = await fetch('http://localhost:3003/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        await fetchUserInfo(data.token);

        Swal.fire({
          icon: 'success',
          title: 'Login Successful',
          text: data.message,
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          position: 'center',
        });

        onClose();
        if (onLoginSuccess) onLoginSuccess(data.token);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Login Failed',
          text: data.message || 'Invalid credentials',
          position: 'center',
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Server error during login',
        position: 'center',
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          boxShadow: 6,
          px: isMobile ? 2 : 4,
          py: isMobile ? 2 : 3,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', fontWeight: 600, fontSize: '1.5rem' }}>
        Welcome Back 👋
      </DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflow: 'visible',
        }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          Please enter your credentials to log in
        </Typography>

        <TextField
          autoFocus
          type="email"
          label="Email"
          value={email}
          onChange={onEmailChange}
          fullWidth
          variant="outlined"
          margin="dense"
          size="medium"
          sx={{ borderRadius: 2 }}
        />

        <TextField
          type={showPassword ? 'text' : 'password'}
          label="Password"
          value={password}
          onChange={onPasswordChange}
          fullWidth
          variant="outlined"
          margin="dense"
          size="medium"
          sx={{ borderRadius: 2 }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center" mt={1}>
          <Link component="button" onClick={onRegisterOpen} underline="hover" fontSize={14}>
            Register
          </Link>
          <Link href="#" underline="hover" fontSize={14}>
            Forgot Password?
          </Link>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button
          onClick={handleLogin}
          variant="contained"
          fullWidth
          size="large"
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            fontWeight: 'bold',
            py: 1.2,
            backgroundColor: theme.palette.primary.main,
            ':hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginDialog;
