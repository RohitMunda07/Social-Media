import React, { useState } from 'react';
import Button from '@mui/material/Button';

const Categories = () => {
  const [selected, setSelected] = useState("Overview");

  const items = [
    { value: "Overview" },
    { value: "Posts" },
    { value: "Likes" },
    { value: "Comments" },
    { value: "Saved" },
  ];

  return (
    <div className='mt-5 flex gap-6 items-center justify-center'>
      {items.map((item) => (
        <Button
          key={item.value}
          onClick={() => setSelected(item.value)}
          sx={{
            borderRadius: '999px',
            mt: 3,
            color: selected === item.value ? 'white' : 'black',
            backgroundColor: selected === item.value ? 'rgba(0,0,0,0.6)' : 'transparent',
            '&:hover': {
              backgroundColor: selected === item.value ? 'dark' : 'rgba(0,0,0,0.08)'
            }
          }}
        >
          {item.value}
        </Button>
      ))}
    </div>
  );
};

export default Categories;
