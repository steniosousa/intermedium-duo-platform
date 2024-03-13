import React, { useEffect, useState } from 'react';
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import Api from 'src/api/service';
import Swal from 'sweetalert2';
import moment from 'moment';



const ProductPerformance = ({ userId, setCleaning }) => {
    const [cleanings, setCleanings] = useState([])
    async function getAllDatas() {
        if (!userId) return
        try {
            const { data } = await Api.get('/cleaning/recover', {
                params: { userId }
            });
            setCleanings(data)
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Erro ao recuperar dados das solicitações',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
    }
    useEffect(() => {
        getAllDatas()
    }, [userId])
    return (
        <DashboardCard title="Product Performance">
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table
                    aria-label="simple table"
                    sx={{
                        whiteSpace: "nowrap",
                        mt: 2
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Data
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Avaliado
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Ambiente
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Status
                                </Typography>
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cleanings.map((product) => {
                            const dateObject = moment(product.createdAt);
                            const data = dateObject.format("DD-MM-YYYY - h:m");
                            return (

                                <TableRow key={product.name} onClick={() => setCleaning(product)} style={{ cursor: "pointer" }}>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontSize: "15px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {data}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    {product.evidences.lenght}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    sx={{
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    {product.avaliationId ? "Avaliado" : "Sem avaliação"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                            {product.Place.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            sx={{
                                                px: "4px",
                                                backgroundColor: product.status === "CONCLUIDO" ? "green" : "orange",
                                                color: "#fff",
                                            }}
                                            size="small"
                                            label={product.status}
                                        ></Chip>
                                    </TableCell>

                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </Box>
        </DashboardCard>
    );
};

export default ProductPerformance;
