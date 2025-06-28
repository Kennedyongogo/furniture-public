import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button
} from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Swal from 'sweetalert2'; // ✅ NEW import

const Furniture = () => {
  const [furnitureList, setFurnitureList] = useState([]);
  const [openCartDialog, setOpenCartDialog] = useState(false);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFurniture, setSelectedFurniture] = useState(null);
  const [hoveredImageIndex, setHoveredImageIndex] = useState({});
  const [dialogImageIndex, setDialogImageIndex] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const categories = ['All', 'Sofas', 'Beds', 'Tables', 'Cabinets'];

  useEffect(() => {
    fetch('http://localhost:3003/api/furniture')
      .then((res) => res.json())
      .then((data) => setFurnitureList(data.data))
      .catch((err) => console.error('Fetch error:', err));

    const checkLoginStatus = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    checkLoginStatus();
    window.addEventListener('storage', checkLoginStatus);
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleOpenCartDialog = (event, item) => {
    event.stopPropagation();
    setSelectedFurniture(item);
    setOpenCartDialog(true);
  };

  const handleCloseCartDialog = () => {
    setOpenCartDialog(false);
    setQuantity(1);
    setSelectedFurniture(null);
  };

  const handleOpenDetailDialog = (item) => {
    setSelectedFurniture(item);
    setDialogImageIndex(0);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedFurniture(null);
  };

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3003/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          furnitureId: selectedFurniture.id,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        await Swal.fire({
          title: 'Success',
          text: 'Item added to cart successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          
        });
      } else {
        await Swal.fire({
          title: 'Error',
          text: data.message || 'Failed to add to cart',
          icon: 'error',
          confirmButtonColor: '#d33',
          
        });
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      await Swal.fire({
        title: 'Server Error',
        text: 'There was a problem adding the item to the cart.',
        icon: 'error',
        confirmButtonColor: '#d33',
        
      });
    }

    handleCloseCartDialog();
  };

  const categoryMap = {
    All: 'all',
    Sofas: 'sofa',
    Beds: 'beds',
    Tables: 'tables',
    Cabinets: 'cabinets'
  };

  const filteredFurniture =
    selectedCategory === 'All'
      ? furnitureList
      : furnitureList.filter(
          (item) =>
            item.furniture_category.toLowerCase() === categoryMap[selectedCategory].toLowerCase()
        );

  const navIconStyle = {
    color: '#333',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: '50%',
    p: 0.5,
  };

  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 1.5, m: 1, boxShadow: 1 }}>
      <Typography variant="h5" gutterBottom>
        Furniture Page
      </Typography>

      {/* Categories */}
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
              backgroundColor:
                selectedCategory === category ? 'primary.main' : '#eee',
              color: selectedCategory === category ? '#fff' : 'text.primary',
              fontWeight: selectedCategory === category ? 'bold' : 'normal',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor:
                  selectedCategory === category ? 'primary.dark' : '#ddd',
              },
            }}
          >
            {category}
          </Typography>
        ))}
      </Box>

      {/* Cards */}
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
        {filteredFurniture.map((item) => (
          <Card
            key={item.id}
            onClick={() => handleOpenDetailDialog(item)}
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
              '&:hover': { boxShadow: 8 },
            }}
          >
            {/* Card Image */}
            <Card
              sx={{
                flex: 3,
                width: '100%',
                backgroundColor: '#f9f9f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {item.image_paths.length > 1 && (
                <>
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', left: 5, zIndex: 1, ...navIconStyle }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredImageIndex((prev) => ({
                        ...prev,
                        [item.id]: Math.max((prev[item.id] || 0) - 1, 0),
                      }));
                    }}
                  >
                    <ArrowBackIosNewIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ position: 'absolute', right: 5, zIndex: 1, ...navIconStyle }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredImageIndex((prev) => ({
                        ...prev,
                        [item.id]: Math.min(
                          (prev[item.id] || 0) + 1,
                          item.image_paths.length - 1
                        ),
                      }));
                    }}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </>
              )}
              <img
                src={`http://localhost:3003/${item.image_paths[hoveredImageIndex[item.id] || 0]}`}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '4px' }}
              />
            </Card>

            {/* Footer */}
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 1,
                pt: 1,
              }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight="bold">
                  {item.name}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  KES {parseFloat(item.price).toLocaleString()}
                </Typography>
              </Box>
              {isLoggedIn && (
                <IconButton color="primary" onClick={(e) => handleOpenCartDialog(e, item)}>
                  <AddShoppingCartIcon />
                </IconButton>
              )}
            </Box>
          </Card>
        ))}
      </Box>

      {/* Quantity Dialog */}
      <Dialog open={openCartDialog} onClose={handleCloseCartDialog} maxWidth="xs" fullWidth>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <DialogTitle sx={{ flex: 1, textAlign: 'center' }}>Quantity</DialogTitle>
            <IconButton onClick={handleCloseCartDialog}>
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
              <IconButton onClick={increment}><ArrowDropUpIcon /></IconButton>
              <IconButton onClick={decrement}><ArrowDropDownIcon /></IconButton>
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
            <IconButton onClick={handleCloseDetailDialog}><CloseIcon /></IconButton>
          </Box>

          {selectedFurniture && (
            <>
              <Box
                sx={{
                  height: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f4f4f4',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                {selectedFurniture.image_paths.length > 1 && (
                  <>
                    <IconButton
                      sx={{ position: 'absolute', left: 10, zIndex: 1, ...navIconStyle }}
                      onClick={() => setDialogImageIndex((prev) => Math.max(prev - 1, 0))}
                    >
                      <ArrowBackIosNewIcon />
                    </IconButton>
                    <IconButton
                      sx={{ position: 'absolute', right: 10, zIndex: 1, ...navIconStyle }}
                      onClick={() =>
                        setDialogImageIndex((prev) =>
                          Math.min(prev + 1, selectedFurniture.image_paths.length - 1)
                        )
                      }
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </>
                )}
                <img
                  src={`http://localhost:3003/${selectedFurniture.image_paths[dialogImageIndex]}`}
                  alt={selectedFurniture.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>

              <Box sx={{ height: '50%', p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6">{selectedFurniture.name}</Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  KES {parseFloat(selectedFurniture.price).toLocaleString()}
                </Typography>
                <Typography variant="body2" mt={2}>{selectedFurniture.description}</Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Furniture;
