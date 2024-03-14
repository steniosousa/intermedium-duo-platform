import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/header';
import Api from 'src/api/service';
import AuthContext from 'src/contexto/AuthContext';
import Swal from 'sweetalert2';
import ListHome from '../components/listHome';
import { Button, CircularProgress, List } from '@mui/material';
import { useNavigate } from "react-router-dom";
function HomeApp() {
    const { operator } = useContext(AuthContext)
    const [cleanings, setCleanings] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()


    async function getCleanings() {
        setIsLoading(true)
        if (!operator) return
        const userId = JSON.parse(operator).id
        try {
            const { data } = await Api.get('cleaning/recover/app', { params: { userId } })
            setCleanings(data)
        }
        catch {
            await Swal.fire({
                icon: 'error',
                title: "Não foi possível recuperar solicitações",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
        setIsLoading(false)
    }

    useEffect(() => {
        getCleanings()
    }, [operator])

    function press(e) {
        navigate('/app/details', { state: e })
    }

    return (
        <div>
            <Header />
            <List sx={{ width: '100%', bgcolor: 'background.paper' }} style={{ alignItems: 'center' }}>
                {cleanings.length == 0 ? (
                    <div style={{ width: '100vw', textAlign: 'center', display: 'flex', flexDirection: 'column', }}>
                        {isLoading ? (
                            <div style={{width:'100%', alignItems:'center'}}>
                                <CircularProgress />
                            </div>
                        ) : (
                            <>
                                <span >Nenhuma solicitação vigente no momento</span>
                                <Button onClick={getCleanings}>Atualizar</Button>
                            </>

                        )}
                    </div>
                ) : (
                    cleanings.map((item) => {
                        return (
                            <ListHome datas={item} key={item.id} onPress={press} />
                        )
                    })
                )}
            </List>



        </div >
    );
}

export default HomeApp;
