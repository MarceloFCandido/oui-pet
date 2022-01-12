import {
  Grid,
  ListItem,
  Rating,
  Typography,
} from '@mui/material';

import classes from '../utils/classes';

function ReviewsPanel({ reviews }) {
  return (reviews.map(({
    _id,
    name,
    updatedAt,
    rating,
    comment
  }) => (
    <ListItem key={_id}>
      <Grid container>
        <Grid item sx={classes.reviewItem}>
          <Typography><strong>{name}</strong></Typography>

          <Typography>{updatedAt.substring(0, 10)}</Typography>
        </Grid>

        <Grid item>
          <Rating value={rating} readOnly />

          <Typography>{comment}</Typography>
        </Grid>
      </Grid>
    </ListItem>
  ))
  );
}

export default ReviewsPanel;