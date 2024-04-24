import React from 'react';
import { Link } from 'react-router-dom';
import { CardContent, Typography, Grid, Rating, Tooltip, Fab } from '@mui/material';
import { Stack } from '@mui/system';
import { IconBasket } from '@tabler/icons';
import BlankCard from '../../../components/shared/BlankCard';



const Blog = ({ clear }) => {
    console.log(clear)
    return (
        <Grid container spacing={3}>
            {clear && clear.evidences.map((product, index) => {
                return (
                    <Grid item sm={12} md={4} lg={3} key={index}>
                        <BlankCard>
                            <Typography component={Link} to="/">
                                <img src={`data:image/png;base64,${product.evidenceUrl}`} alt="img" width="100%" />
                            </Typography>
                            <Tooltip title="Add To Cart">
                                <Fab
                                    size="small"
                                    color="primary"
                                    sx={{ bottom: '75px', right: '15px', position: 'absolute' }}
                                >
                                    <IconBasket size="16" />
                                </Fab>
                            </Tooltip>
                            <CardContent sx={{ p: 3, pt: 2 }}>
                                <Typography variant="h6">{product.title}</Typography>
                                <Stack direction="row" alignItems="center" justifyContent="space-between" mt={1}>
                                    <Stack direction="row" alignItems="center">
                                        <Typography variant="h6">{index}</Typography>
                                        <Typography color="textSecondary" ml={1} >
                                            {product.type === "EXIT" ? "Saída" : product.type === "ENTRANCE" ? "Entrada" : "Observação"}
                                        </Typography>
                                    </Stack>
                                    <Rating name="read-only" size="small" value={product.rating} readOnly />
                                </Stack>
                            </CardContent>
                        </BlankCard>
                    </Grid>
                )
            })}
        </Grid>
    );
};

export default Blog;
