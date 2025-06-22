import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
} from '@mui/material';
import ChairIcon from '@mui/icons-material/Chair';
import WeekendIcon from '@mui/icons-material/Weekend';
import BedIcon from '@mui/icons-material/Bed';
import TableRestaurantIcon from '@mui/icons-material/TableRestaurant';
import BathroomIcon from '@mui/icons-material/Bathroom';
import LightIcon from '@mui/icons-material/Light';

const imageList = ['/mirror.jpg', '/mirror2.jpg', '/mirror3.jpg'];

const cardData = [
  {
    title: 'Comfortable Sofas',
    description: 'Relax in style with our wide range of sofas tailored for comfort.',
    icon: <WeekendIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Elegant Chairs',
    description: 'Find stylish and ergonomic chairs perfect for home or office.',
    icon: <ChairIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Modern Beds',
    description: 'Upgrade your sleep with our sleek and comfy bed designs.',
    icon: <BedIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Dining Sets',
    description: 'Dine with elegance with our collection of dining furniture.',
    icon: <TableRestaurantIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Bathroom Vanity',
    description: 'Luxurious vanities that add style to your bathroom space.',
    icon: <BathroomIcon fontSize="large" color="primary" />,
  },
  {
    title: 'Lighting & Decor',
    description: 'Enhance your home ambiance with our unique lighting pieces.',
    icon: <LightIcon fontSize="large" color="primary" />,
  },
];

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % imageList.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      {/* Image Carousel */}
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: 2,
          p: 1.5,
          m: 0,
          boxShadow: 1,
        }}
      >
        <Box
          component="img"
          src={imageList[currentImageIndex]}
          alt="Furniture Showcase"
          sx={{
            width: '100%',
            height: '50vh',
            objectFit: 'cover',
            borderRadius: 2,
            display: 'block',
            transition: 'opacity 1s ease-in-out',
          }}
        />

        {/* Progressive Dots */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          {imageList.map((_, idx) => (
            <IconButton
              key={idx}
              size="small"
              onClick={() => setCurrentImageIndex(idx)}
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                mx: 0.5,
                backgroundColor: currentImageIndex === idx ? '#1976d2' : '#ccc',
                '&:hover': {
                  backgroundColor: '#1976d2',
                },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Card Grid */}
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
        {cardData.map((item, idx) => (
          <Card
            key={idx}
            sx={{
              flex: '1 1 calc(33.333% - 16px)',
              minWidth: 250,
              maxWidth: 350,
              height: 220,
              boxShadow: 3,
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center',
              transition: 'box-shadow 0.3s ease-in-out',
              '&:hover': {
                boxShadow: 8,
              },
            }}
          >
            {item.icon}
            <Typography variant="h6" mt={1} fontWeight="bold">
              {item.title}
            </Typography>
            <Typography variant="body2" mt={1}>
              {item.description}
            </Typography>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default Home;
