import React from 'react';
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
} from '@mui/material';

const cartItems = [
  {
    id: 1,
    name: 'Modern Sofa',
    price: 45000,
    image: '/sofa.jpg',
  },
  {
    id: 2,
    name: 'Wooden Coffee Table',
    price: 18000,
    image: '/coffee-table.jpg',
  },
];

const Cart = () => {
  const total = cartItems.reduce((sum, item) => sum + item.price, 0);

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
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar
                      variant="rounded"
                      src={item.image}
                      sx={{ width: 60, height: 60 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.name}
                    secondary={`Price: KES ${item.price.toLocaleString()}`}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6">Total:</Typography>
            <Typography variant="h6" color="primary">
              KES {total.toLocaleString()}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, borderRadius: 2 }}
          >
            Proceed to Checkout
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Cart;
