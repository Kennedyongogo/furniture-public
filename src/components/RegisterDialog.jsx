import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Link,
  IconButton,
  InputAdornment,
  Typography,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';

const RegisterDialog = ({
  open,
  onClose,
  name,
  email,
  phone,
  password,
  confirmPassword,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onLoginOpen
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Passwords do not match',
        position: 'center',
      });
      return;
    }

    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone_number: phone }),
      });

      const data = await res.json();

      if (res.ok) {
        Swal.fire({
          icon: 'success',
          title: 'Registration Successful',
          text: 'Please log in now.',
          timer: 2000,
          showConfirmButton: false,
          timerProgressBar: true,
          position: 'center',
        });
        onClose();
        if (onLoginOpen) onLoginOpen();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Registration Failed',
          text: data.message || 'Something went wrong.',
          position: 'center',
        });
      }
    } catch (error) {
      console.error('Register error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Server error during registration',
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
        Create Account ✨
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
          Fill in the details below to register
        </Typography>

        <TextField
          label="Name"
          value={name}
          onChange={onNameChange}
          fullWidth
          variant="outlined"
          margin="dense"
        />
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={onEmailChange}
          fullWidth
          variant="outlined"
          margin="dense"
        />
        <TextField
          label="Phone Number"
          value={phone}
          onChange={onPhoneChange}
          fullWidth
          variant="outlined"
          margin="dense"
        />
        <TextField
          label="Password"
          type={showPassword ? 'text' : 'password'}
          value={password}
          onChange={onPasswordChange}
          fullWidth
          variant="outlined"
          margin="dense"
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
        <TextField
          label="Confirm Password"
          type={showConfirm ? 'text' : 'password'}
          value={confirmPassword}
          onChange={onConfirmPasswordChange}
          fullWidth
          variant="outlined"
          margin="dense"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowConfirm(!showConfirm)} edge="end">
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Stack direction="row" justifyContent="flex-start" mt={1}>
          <Link component="button" onClick={onLoginOpen} underline="hover" fontSize={14}>
            Already have an account? Login
          </Link>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
        <Button
          onClick={handleRegister}
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
          Register
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterDialog;
