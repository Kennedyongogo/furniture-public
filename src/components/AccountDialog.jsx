import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  CircularProgress,
  Typography,
  InputAdornment,
  Tooltip
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Swal from 'sweetalert2';

const AccountDialog = ({ open, onClose }) => {
  const [userData, setUserData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone_number: '',
    password: '',
    confirmPassword: ''
  });

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetch('http://localhost:3003/api/users/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch user data');
          return res.json();
        })
        .then((data) => {
          setUserData(data);
          setForm({
            name: data.name,
            email: data.email,
            phone_number: data.phone_number,
            password: '',
            confirmPassword: ''
          });
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load user data', err);
          setLoading(false);
        });
    }
  }, [open, token]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const showAlert = (options) => {
    Swal.fire({
      ...options,
      heightAuto: false,
      backdrop: true,
      allowOutsideClick: false,
      customClass: {
        popup: 'swal2-dialog-above-dialog'
      },
      didOpen: () => {
        const popup = document.querySelector('.swal2-popup');
        if (popup) popup.style.zIndex = 20000;
      }
    });
  };

  const handleSave = () => {
    if (form.password && form.password !== form.confirmPassword) {
      showAlert({
        title: 'Password Mismatch',
        text: 'New password and confirm password must match.',
        icon: 'warning',
        confirmButtonColor: '#d33',
      });
      return;
    }

    const updatedData = {
      name: form.name,
      email: form.email,
      phone_number: form.phone_number,
    };

    if (form.password.trim() !== '') {
      updatedData.password = form.password;
    }

    fetch('http://localhost:3003/api/users/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update user data');
        return res.json();
      })
      .then((data) => {
        setUserData(data);
        setEditMode(false);
        setForm(prev => ({ ...prev, password: '', confirmPassword: '' }));

        showAlert({
          title: 'Updated!',
          text: 'Your account details have been saved.',
          icon: 'success',
          showConfirmButton: false,
          timer: 1500,
          background: '#f0f8ff',
          color: '#333',
        });
      })
      .catch((err) => {
        console.error('Update failed', err);
        showAlert({
          title: 'Error',
          text: 'Something went wrong. Please try again.',
          icon: 'error',
          confirmButtonColor: '#d33',
        });
      });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: 4,
          p: 2,
          background: 'linear-gradient(to right, #fdfbfb, #ebedee)',
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 'bold',
          fontSize: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography variant="h6" color="primary">My Account</Typography>
        {!editMode && (
          <Tooltip title="Edit Profile" arrow>
            <IconButton onClick={() => setEditMode(true)} color="primary">
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
      </DialogTitle>

      <DialogContent>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              margin="normal"
              disabled={!editMode}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              margin="normal"
              disabled={!editMode}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
            <TextField
              fullWidth
              label="Phone Number"
              name="phone_number"
              value={form.phone_number}
              onChange={handleChange}
              margin="normal"
              disabled={!editMode}
              sx={{ backgroundColor: 'white', borderRadius: 1 }}
            />
            {editMode && (
              <>
                <TextField
                  fullWidth
                  label="New Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                  margin="normal"
                  placeholder="Leave blank to keep current password"
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleTogglePassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  fullWidth
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  margin="normal"
                  sx={{ backgroundColor: 'white', borderRadius: 1 }}
                />
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="secondary">
          Close
        </Button>
        {editMode && (
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AccountDialog;
