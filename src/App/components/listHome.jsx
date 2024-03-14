import { Avatar, Button, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import moment from 'moment';
import * as React from 'react';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

export default function ListHome({ datas, onPress }) {
    const dateObject = moment(datas.createdAt);
    const data = dateObject.format("DD-MM-YYYY - h:m");
    return (
        <ListItem style={{ background: datas.evidences.length > 0 ? "orange" : "transparent" }}>
            <ListItemAvatar>
                <Avatar style={{ background: "#add8e6" }}>
                    <CleaningServicesIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={`${datas.Place.name}`} secondary={data} />
            {datas.evidences.length > 0 ? (
                <span>Falhou</span>
            ) :
                (
                    <Button onClick={() => onPress(datas)} variant={0 == 0 ? "contained" : "outlined"} color="primary" style={{ height: 30 }}>
                        Ver
                    </Button>

                )}

        </ListItem>
    );
}