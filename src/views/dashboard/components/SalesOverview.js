import React, { useContext, useEffect } from 'react';
import { Select, MenuItem, FormControl, InputLabel, FormControlLabel, Checkbox, Button, Grid } from '@mui/material';

import DashboardCard from '../../../components/shared/DashboardCard';
import { DayPicker } from 'react-day-picker';
import { useState } from 'react';
import { pt } from 'date-fns/locale';
import 'react-day-picker/dist/style.css';
import AuthContext from 'src/contexto/AuthContext';
import Swal from 'sweetalert2';
import Api from 'src/api/service';
const SalesOverview = ({ editObject, setCompaniesFind }) => {
    const { user } = useContext(AuthContext)
    const initialDays = [];
    const [days, setDays] = useState(initialDays);
    const minHeight = 6;
    const [objects, setObjects] = useState([])
    const [places, setPlaces] = useState([])
    const [companies, setCompanies] = useState([])
    const [users, setUsers] = useState([])
    const [companySelect, setcompanyIdSelect] = useState('')
    const [objectSelect, setObjectSelect] = useState([])
    const [placesSelected, setPlacesSelected] = useState('')
    const [userSelected, setUserSelected] = useState('')
    const [repeat, setRepeat] = useState(false)

    let cellHeight = Math.min(
        Math.max(minHeight * 5.5)
    );
    const footer = days && days.length > 0 ? (
        <p>You selected {days.length} day(s).</p>
    ) : (
        <p>Please pick one or more days.</p>
    );



    async function findObjects() {

        const companyId = JSON.parse(user).companyId[0].companyId

        try {
            const [object, place, companies] = await Promise.all([
                Api.get('objects/recover', {
                    params: {
                        companyId
                    }
                }),
                Api.get('place/recover', {
                    params: {
                        companyId
                    }
                }),
                Api.get('/companies/recover/'),
            ]);

            const objectForSelect = object.data.map((item) => {
                return { name: item.name, id: item.id }
            })
            setObjects(objectForSelect);

            setPlaces(place.data);
            setCompanies(companies.data)
            setCompaniesFind(companies.data)
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Erro ao recuperar dados',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }

    }

    async function getUsersForCompany() {
        if (!companySelect) return
        try {
            const { data } = await Api.get('/user/recover', { params: { companyId: companySelect } })
            setUsers(data)
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Erro ao recuperar usuários',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
    }
    const [searchUser, setSeactUser] = useState(false)
    async function handleCompany(value) {
        setcompanyIdSelect(value)
        setSeactUser(!searchUser)
    }

    function handleNextPass() {
        if (!objectSelect || !placesSelected || !userSelected || days.length === 0) return
        editObject({ objects: objectSelect, places: placesSelected, user: userSelected, repeat: repeat, date: days })
    }



    useEffect(() => {
        getUsersForCompany()
    }, [searchUser])

    useEffect(() => {
        findObjects()
    }, [user !== null])
    return (

        <DashboardCard title="Criar solicitação" >
            <Grid container spacing={3} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>

                <FormControl sx={{ m: 1, minWidth: 120 }} >
                    <InputLabel >Empresa</InputLabel>
                    <Select
                        value={companySelect}
                        label="Age"
                        onChange={(company) => handleCompany(company.target.value)}

                    >
                        {companies.map((company) => {
                            return (
                                <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} >
                    <InputLabel >Ambientes</InputLabel>
                    <Select
                        value={placesSelected}
                        onChange={(place) => setPlacesSelected(place.target.value)}

                    >
                        {places.map((place) => {
                            return (
                                <MenuItem key={place.id} value={place.id}>{place.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>
                <FormControl sx={{ m: 1, minWidth: 120 }} >
                    <InputLabel >Objetos</InputLabel>
                    <Select
                        value={objectSelect}
                        onChange={(object) => setObjectSelect((oldState) => [...oldState, object.target.value])}

                    >
                        {objects.map((object) => {
                            return (
                                <MenuItem key={object.id} value={object.id}>{object.name}</MenuItem>
                            )
                        })}
                    </Select>
                </FormControl>

                {users.length > 0 ? (
                    <FormControl sx={{ m: 1, minWidth: 120 }} >
                        <InputLabel >Operário</InputLabel>
                        <Select
                            value={userSelected}
                            onChange={(user) => setUserSelected(user.target.value)}

                        >
                            {users.map((user) => {
                                return (
                                    <MenuItem key={user.id} value={user.id}>{user.name}</MenuItem>
                                )
                            })}
                        </Select>
                    </FormControl>
                ) : null}
                <FormControlLabel control={<Checkbox onChange={() => setRepeat(!repeat)} />} label="REPETIR" />
                <Button onClick={handleNextPass} variant={objectSelect && placesSelected && userSelected && days.length > 0 ? "contained" : "outlined"} color="primary" style={{ height: 30, }}>
                    Prox...
                </Button>


            </Grid>

            <DayPicker
                locale={pt}
                mode="multiple"
                selected={days}
                onSelect={setDays}
                footer={footer}
                styles={{
                    'table': {
                        minWidth: "70vw",

                    },
                    "day": {
                        height: '90px',
                        minWidth: "70%",
                    },
                    'cell': {
                        alignItems: 'center',
                        borderRadius: '4px',
                        fontSize: cellHeight
                    },


                }}
            />
        </DashboardCard>
    );
};

export default SalesOverview;
