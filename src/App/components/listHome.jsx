import { Avatar, Button, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import moment from 'moment';
import * as React from 'react';
import CleaningServicesIcon from '@mui/icons-material/CleaningServices';

export default function ListHome({ datas, onPress }) {
    const dateObject = moment(datas.createdAt);
    const data = dateObject.format("DD-MM-YYYY - h:m");
    return (
        <ListItem style={{ background: datas.evidences.length > 0 ? "orange" : "transparent", cursor: "pointer" }} onClick={() => onPress(datas)}>
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
                    <Button onClick={() => onPress(datas)} variant={"contained" } color={datas.status === 'ASSUMIDO' ? "primary" : "secondary"} style={{ height: 30, color:'white' }}>
                        {datas.status === 'ASSUMIDO' ? "CONCLUIR" : "ASSUMIR"}
                    </Button>

                )}

        </ListItem>
    );
}