import React, { useContext, useEffect, useState } from 'react';

import AuthContext from 'src/contexto/AuthContext';
import {
  FormControl, InputLabel, Select, MenuItem, Box, Grid, List, ListItem, ListItemText, Button, TextField, OutlinedInput, CircularProgress,
} from "@mui/material";
import Swal from 'sweetalert2';
import DashboardCard from 'src/components/shared/DashboardCard';
import Api from 'src/api/service';


export default function Configuracao() {
  const { companies } = useContext(AuthContext)
  const [path, setPath] = useState("");
  const { user } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const [permissionions, setPermissionions] = useState([]);
  const [email, setEmail] = useState("");
  const [companiesId, setCompaniesId] = useState([]);
  const [role, setRole] = useState("");
  const [name, setName] = useState("");
  const [epis, setAllEpis] = useState([])
  const [objects, setObjects] = useState([]);
  const [places, setPlaces] = useState([]);
  const [users, setUsers] = useState([]);
  const [list, setList] = useState([])
  const [companySelected, setCompanySelected] = useState('')
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  async function getUsersForCompany() {
    if (!companySelected) {
      return
    };
    try {
      const [users, objects, places, epis] = await Promise.all([
        Api.get("/user/recover", {
          params: { companyId: companySelected },
        }),
        Api.get("objects/recover", {
          params: {
            companyId: companySelected,
          },
        }),
        Api.get("place/recover", {
          params: {
            companyId: companySelected,
          },
        }),
        Api.get('/epis/recover', { params: { companyId: companySelected } })
      ]);
      const objectForSelect = objects.data.map((item) => {
        return { name: item.name, id: item.id };
      });
      setObjects(objectForSelect);
      setPlaces(places.data);
      setUsers(users.data);
      const optionsEquipaments = epis.data.map((item) => {
        return {
          id: item.id,
          name: item.name
        }
      })
      setAllEpis(optionsEquipaments)
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Erro ao recuperar dados",
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
      });
    }
  }

  async function deletionItem(itemSelected) {
    setLoading(true);
    const confirm = await Swal.fire({
      icon: "question",
      title: "Deseja realmente deleter esse item?",
      showDenyButton: true,
      showCancelButton: false,
      showConfirmButton: true,
      denyButtonText: "Cancelar",
      confirmButtonText: "Sim",
    });

    if (!confirm.isConfirmed) return;

    try {
      await Api.delete(
        `/${path}/delete?${path == "companies" ? "company" : path}Id=${itemSelected}`,
      );
      await Swal.fire({
        icon: "success",
        title: "Deleção bem sucedida",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: "Cancelar",
        confirmButtonText: "ok",
      });
      getUsersForCompany()
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Conflito ao deletar item",
        html: "<p>Item sendo usado em alguma solicitação vigente</p>",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: "Cancelar",
        confirmButtonText: "ok",
      });
    }
    setLoading(false);
  }

  const handleChange = (event) => {
    setPath(event.target.value);
  };
  const handleChangePermissions = (event) => {
    const {
      target: { value },
    } = event;
    setPermissionions(typeof value === "string" ? value.split(",") : value);
  };
  const handleChangeCompanies = (event) => {
    const {
      target: { value },
    } = event;

    console.log(value)
    setCompaniesId(typeof value === "string" ? value.split(",") : value);
  };
  async function handleCreateManager(send) {
    if (isLoading) return;
    setLoading(true);
    if (!name || !email || !role) {
      await Swal.fire({
        icon: "info",
        title: "Preencha todos os campos",
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
      });
      setLoading(false);
      return;
    }
    const companiesId = companies
      .filter(item => send.companyId.includes(item.name))
      .map(item => item.id);


    send.companyId = companiesId
    try {
      await Api.post(`manager/create`, send);
      await Swal.fire({
        icon: "success",
        title: "Criação bem sucessedida",
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Erro ao criar gerente",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: "Cancelar",
        confirmButtonText: "ok",
      });
    }
    setLoading(false);
  }
  async function handleCreate() {
    if (path == "manager") {
      const send = {
        name,
        email: email,
        companyId: companiesId,
        role,
        permissions: permissionions,
      };
      handleCreateManager(send);
      return;
    }
    if (isLoading) return;
    setLoading(true);
    if (path != "companies" && !name || path != "companies" && !companySelected) {
      console.log(path, name, companySelected)
      await Swal.fire({
        icon: "warning",
        title: "Preencha todos os campos",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: "Cancelar",
        confirmButtonText: "ok",
      });
      setLoading(false);
      return;
    }
    const send = {
      companyId: companySelected,
      name: name,
    };
    if (path == "user") {
      send.password = "intermedium";
    }
    try {
      await Api.post(`${path}/create`, send);
      getUsersForCompany()
      await Swal.fire({
        icon: "success",
        title: "Criação bem sucessedida",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: false,
        denyButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Erro ao efetuar criação",
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: "Cancelar",
        confirmButtonText: "Confirmar",
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    getUsersForCompany()
  }, [companySelected])

  useEffect(() => {
    if (path === "place") {
      setList(places)
    } else if (path === "objects") {
      setList(objects)
    } else if (path === "companies") {
      setList(companies)
    } else if (path === "epis") {
      setList(epis)
    } else if (path === "manager") {
      setList([])
    } else {
      setList(users)
    }

  }, [path])

  return (
    <Box sx={{ height: '100vh', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <DashboardCard
        background="#f2f2f2"
        title="Configurações"

      >
        <Box sx={{ display: 'flex', flexDirection: 'row', backgroundColor: '#f2f2f2', margin: 1 }}>
          <FormControl sx={{ minWidth: 100 }} >
            <InputLabel>Empresa</InputLabel>
            <Select value={companySelected} onChange={(e) => setCompanySelected(e.target.value)} label="Empresa">
              {companies?.map((company) => (
                <MenuItem key={company.id} value={company.id}>
                  {company.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 100 }}>
            <InputLabel>Módulo</InputLabel>
            <Select label="Empresa" onChange={handleChange}>
              <MenuItem value={"place"}>Ambiente</MenuItem>
              <MenuItem value={"objects"}>Objeto</MenuItem>
              <MenuItem value={"epis"}>EPI</MenuItem>
              <MenuItem value={"companies"}>Empresa</MenuItem>
              <MenuItem value={"user"}>Operador</MenuItem>
              {user && JSON.parse(user).role === "ADMIN" ? (
                <MenuItem value={"manager"}>Gerente</MenuItem>
              ) : null}
            </Select>
          </FormControl>
        </Box>
        <FormControl fullWidth>
          <FormControl className='flex flex-row'>

            {path == "manager" ? (
              <FormControl fullWidth>
                <TextField
                  style={{ margin: 5 }}
                  onChange={(event) => setName(event.target.value)}
                  id="outlined-basic"
                  label="Nome"
                  variant="outlined"
                />
                <FormControl style={{ margin: 10 }}>
                  <InputLabel id="demo-simple-select-label">
                    Hierarquia
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={role}
                    label="Age"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <MenuItem value={"VIEWR"}>Visualizador</MenuItem>
                    <MenuItem value={"MANAGER"}>Gerente</MenuItem>
                    <MenuItem value={"ADMIN"}>Administrador</MenuItem>
                  </Select>
                </FormControl>
                {role !== "VIEWR" ? (
                  <FormControl style={{ margin: 10 }}>
                    <InputLabel id="demo-simple-select-label">
                      Permissões
                    </InputLabel>
                    <Select
                      multiple
                      displayEmpty
                      value={permissionions}
                      onChange={handleChangePermissions}
                      input={<OutlinedInput />}
                      renderValue={(selected) => {
                        if (selected.length === 0) {
                          return <em>Permissões</em>;
                        }

                        return selected.join(", ");
                      }}
                      MenuProps={MenuProps}
                      inputProps={{ "aria-label": "Without label" }}
                    >
                      <MenuItem disabled value="">
                        <em>Permissões</em>
                      </MenuItem>
                      <MenuItem value={"OBJECTS"}>OBJECTS</MenuItem>
                      <MenuItem value={"PLACES"}>Ambientes</MenuItem>
                      <MenuItem value={"COMPANIES"}>Empresas</MenuItem>
                      <MenuItem value={"EPIS"}>EPIs</MenuItem>
                    </Select>
                  </FormControl>

                ) : null}


                <FormControl style={{ margin: 10 }}>
                  <InputLabel id="demo-simple-select-label">
                    Empresas
                  </InputLabel>
                  <Select
                    multiple
                    displayEmpty
                    value={companiesId}
                    onChange={handleChangeCompanies}
                    input={<OutlinedInput />}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return <em>Empresas</em>;
                      }

                      return selected.join(", ");
                    }}
                    MenuProps={MenuProps}
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem disabled value="">
                      <em>Empresas</em>
                    </MenuItem>
                    {companies.map((company) => {
                      return (
                        <MenuItem value={company.name} key={company.id}>
                          {company.name}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
                <TextField
                  style={{ margin: 5 }}
                  onChange={(event) => setEmail(event.target.value)}
                  id="outlined-basic"
                  label="Email"
                  variant="outlined"
                />
              </FormControl>
            ) : (

              <TextField
                style={{ margin: 5 }}
                onChange={(event) => setName(event.target.value)}
                id="outlined-basic"
                label="Nome"
                variant="outlined"
              />

            )}
            <Button variant="contained" onClick={handleCreate}>
              {isLoading ? (
                <CircularProgress size={20} />
              ) : (
                <span>Criar</span>
              )}
            </Button>
          </FormControl>
        </FormControl>
      </DashboardCard>
      <Box sx={{ flexGrow: 1, overflowY: 'auto', padding: 2 }}>
        <Grid container spacing={2} direction="column">
          <Grid item>
            <List>
              {list.map((item) => (
                <ListItem
                  key={item.id}
                  sx={{ backgroundColor: '#f2f2f2', marginBottom: 1, borderRadius: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                  <ListItemText primary={item.name} />
                  <Box>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => deletionItem(item.id)}
                    >
                      Deletar
                    </Button>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

