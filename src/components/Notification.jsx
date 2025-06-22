import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/NotificationsActive';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const notifications = [
  { id: 1, message: 'Your order has been shipped', type: 'success' },
  { id: 2, message: 'New promotion available!', type: 'info' },
  { id: 3, message: 'Payment failed for Order #2031', type: 'error' },
];

const Notification = () => {
  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <Typography variant="h5" gutterBottom>
        Notifications
      </Typography>

      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent>
          <List>
            {notifications.map((note) => (
              <React.Fragment key={note.id}>
                <ListItem>
                  <ListItemIcon>
                    {note.type === 'success' ? (
                      <CheckCircleIcon color="success" />
                    ) : note.type === 'error' ? (
                      <ErrorIcon color="error" />
                    ) : (
                      <NotificationsIcon color="primary" />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={note.message}
                    secondary={new Date().toLocaleString()}
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Notification;
