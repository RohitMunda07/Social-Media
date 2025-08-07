import React from 'react';
import Button from '@mui/material/Button';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import PublicIcon from '@mui/icons-material/Public';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import MovieIcon from '@mui/icons-material/Movie';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Categories = () => {
  const items = [
    { value: "For You" },
    { value: "Trending" },
    { value: "News" },
    { value: "Sports" },
    { value: "Entertainment" },
  ]
  return (
    <div className='mt-5 flex gap-8 items-center justify-center'>
      {items.map((item) => (
        <Button variant="contained" sx={{ borderRadius: '999px', mt: 3 }}>
          {item.value}
        </Button>
      ))}


    </div>
  );
};

export default Categories;
