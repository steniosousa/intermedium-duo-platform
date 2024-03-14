import { Avatar, Button, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import moment from 'moment';
import * as React from 'react';

export default function ListHome({ datas, onPress }) {
    const dateObject = moment(datas.createdAt);
    const data = dateObject.format("DD-MM-YYYY - h:m");
    return (
        <ListItem >
            <ListItemAvatar>
                <Avatar>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${datas.Place.name}`} secondary={data} />
            <Button onClick={() => onPress(datas)} variant={0 == 0 ? "contained" : "outlined"} color="primary" style={{ height: 30 }}>
                Ver
            </Button>
        </ListItem>
    );
}