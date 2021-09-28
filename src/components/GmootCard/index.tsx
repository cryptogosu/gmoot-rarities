import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

type GmootProps = {
  img: string,
  name: string,
  rank?: string
}

export const GmootCard = (props: GmootProps) => {
  return (
    <Card sx={{ maxWidth: 300, margin: "12px" }}>
      <CardMedia
        component="img"
        height="270"
        image={props.img}
        alt={props.name}
      />
      <CardContent>
        <Typography variant="h5">
          Rank {props.rank}
        </Typography>
        <Typography gutterBottom variant="h5" component="div">
          {props.name}
        </Typography>
      </CardContent>
    </Card>
  );
}