import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
  Divider,
  CircularProgress,
  IconButton,
  TextField,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [ordersDialogOpen, setOrdersDialogOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const fetchCartItems = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3003/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to fetch cart items');
      const data = await response.json();
      setCartItems(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to load cart items');
      setLoading(false);
    }
  };

  const removeItem = async (furnitureId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3003/api/cart/${furnitureId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error('Failed to remove item');
      fetchCartItems();
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item');
    }
  };

  const updateQuantity = async (furnitureId, quantity) => {
    if (quantity < 1) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:3003/api/cart/${furnitureId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });

      if (!response.ok) throw new Error('Failed to update quantity');
      fetchCartItems();
    } catch (err) {
      console.error('Error updating quantity:', err);
      setError('Failed to update quantity');
    }
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (err) => console.error('Location error:', err)
    );
  };

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3003/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ latitude, longitude }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message);

      Swal.fire({
        icon: 'success',
        title: 'Order Placed',
        text: data.message,
        timer: 2500,
        position: 'center',
        showConfirmButton: false,
        timerProgressBar: true,
      });

      fetchCartItems();
    } catch (error) {
      console.error('Order error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Order Failed',
        text: error.message,
        position: 'center',
      });
    }
  };

  const handleViewOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3003/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      setOrders(data);
      setOrdersDialogOpen(true);
    } catch (err) {
      console.error('View orders error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to load orders',
        text: err.message,
        position: 'center',
      });
    }
  };

  useEffect(() => {
    fetchCartItems();
    getCurrentLocation();
  }, []);

  const total = cartItems.reduce(
    (sum, item) => sum + item.Furniture.price * item.quantity,
    0
  );

  if (loading) {
    return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Box sx={{ p: 4, textAlign: 'center' }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h5" gutterBottom>
        Your Shopping Cart
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <List>
            {cartItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem
                  alignItems="center"
                  secondaryAction={
                    <Tooltip title="Remove from cart">
                      <IconButton onClick={() => removeItem(item.furnitureId)} edge="end">
                        <DeleteIcon color="error" />
                      </IconButton>
                    </Tooltip>
                  }
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={`http://localhost:3003/${item.Furniture.image_paths?.[0]}`}
                      sx={{ width: 60, height: 60 }}
                    />
                  </ListItemAvatar>

                  <Box sx={{ ml: 2, textAlign: 'center', flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {item.Furniture.name}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2">
                        KES {item.Furniture.price.toLocaleString()} x
                      </Typography>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.furnitureId, parseInt(e.target.value))}
                        inputProps={{ min: 1 }}
                        sx={{ width: 60, mx: 1, '& input': { textAlign: 'center' } }}
                        size="small"
                      />
                    </Box>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ mt: 2 }}>
            <Typography variant="h6">Delivery Location (latitude, longitude)</Typography>
            <Stack direction="row" spacing={2} mt={1}>
              <TextField
                label="Latitude"
                type="number"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                size="small"
              />
              <TextField
                label="Longitude"
                type="number"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                size="small"
              />
            </Stack>
          </Box>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary">
              KES {total.toLocaleString()}
            </Typography>
          </Box>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" color="secondary" onClick={handlePlaceOrder}>
              Place Order
            </Button>
            <Button variant="outlined" color="primary" onClick={handleViewOrders}>
              View Orders
            </Button>
          </Box>

          <Button fullWidth variant="contained" color="primary" sx={{ mt: 3, borderRadius: 2 }}>
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>

      <Dialog open={ordersDialogOpen} onClose={() => setOrdersDialogOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Your Orders</DialogTitle>
        <DialogContent dividers>
          {orders.length === 0 ? (
            <Typography>No past orders found.</Typography>
          ) : (
            orders.map((order) => (
              <Box key={order.id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="subtitle2">Order #: {order.order_number}</Typography>
                <Typography variant="body2">Total: KES {order.total_price.toLocaleString()}</Typography>
                <Typography variant="body2">Status: {order.order_status}</Typography>
              </Box>
            ))
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Cart;
