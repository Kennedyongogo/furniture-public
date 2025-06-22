import React, { useState } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';

const Furniture = () => {
  const [openCartDialog, setOpenCartDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const emptyCardArray = Array.from({ length: 6 });
  const categories = ['All', 'Sofas', 'Beds', 'Tables', 'Cabinets'];

  const handleOpenCartDialog = (event) => {
    event.stopPropagation();
    setOpenCartDialog(true);
  };

  const handleCloseCartDialog = () => {
    setOpenCartDialog(false);
    setQuantity(1);
  };

  const handleOpenDetailDialog = () => {
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
  };

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleConfirm = () => {
    alert(`Confirmed quantity: ${quantity}`);
    handleCloseCartDialog();
  };

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 1.5, m: 1, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>
        Furniture Page
      </Typography>

      {/* Navigation Tab */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          justifyContent: 'center',
          gap: 1,
          mb: 2,
          px: 1,
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {categories.map((category) => (
          <Typography
            key={category}
            onClick={() => setSelectedCategory(category)}
            sx={{
              px: 2,
              py: 1,
              whiteSpace: 'nowrap',
              borderRadius: '20px',
              cursor: 'pointer',
              backgroundColor: selectedCategory === category ? 'primary.main' : '#eee',
              color: selectedCategory === category ? '#fff' : 'text.primary',
              fontWeight: selectedCategory === category ? 'bold' : 'normal',
              fontSize: {
                xs: '0.75rem',
                sm: '0.875rem',
                md: '1rem',
              },
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: selectedCategory === category ? 'primary.dark' : '#ddd',
              },
            }}
          >
            {category}
          </Typography>
        ))}
      </Box>

      {/* Cards Section */}
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          px: 1.5,
          py: 3,
          justifyContent: 'center',
        }}
      >
        {emptyCardArray.map((_, idx) => (
          <Card
            key={idx}
            onClick={handleOpenDetailDialog}
            sx={{
              flex: '1 1 calc(33.333% - 16px)',
              minWidth: 250,
              maxWidth: 350,
              height: 220,
              boxShadow: 3,
              p: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': { boxShadow: 8 },
            }}
          >
            <Card
              sx={{
                flex: 3,
                width: '100%',
                border: '2px dashed #bbb',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="body2" color="textSecondary">
                Furniture Image Placeholder
              </Typography>
            </Card>

            <Box
              sx={{
                flex: 1,
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 1,
                pt: 1,
              }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  Name
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Price
                </Typography>
              </Box>
              <IconButton color="primary" onClick={handleOpenCartDialog}>
                <AddShoppingCartIcon />
              </IconButton>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Quantity Dialog */}
      <Dialog open={openCartDialog} onClose={handleCloseCartDialog} maxWidth="xs" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <DialogTitle sx={{ flex: 1, textAlign: 'center' }}>Quantity</DialogTitle>
            <IconButton onClick={handleCloseCartDialog} sx={{ color: 'grey.600', '&:hover': { color: 'red' } }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mt: 1 }}>
            <TextField
              type="number"
              value={quantity}
              inputProps={{ readOnly: true, style: { textAlign: 'center', width: '60px' } }}
            />
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <IconButton onClick={increment} size="small"><ArrowDropUpIcon /></IconButton>
              <IconButton onClick={decrement} size="small"><ArrowDropDownIcon /></IconButton>
            </Box>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button variant="contained" color="primary" onClick={handleConfirm}>Confirm</Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog} maxWidth="sm" fullWidth>
        <DialogContent sx={{ height: '60vh', p: 0, position: 'relative' }}>
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <IconButton onClick={handleCloseDetailDialog} sx={{ color: 'grey.600', '&:hover': { color: 'red' } }}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box sx={{ height: '50%', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f4f4f4' }}>
            <Typography variant="body1" color="textSecondary">Furniture Image Area</Typography>
          </Box>

          <Box sx={{ height: '50%', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Typography variant="h6">Furniture Name</Typography>
            <Typography variant="subtitle1" color="textSecondary">KES 12,500</Typography>
            <Typography variant="body2" mt={2}>
              This is where a longer description or specifications of the furniture item will go.
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Furniture;
