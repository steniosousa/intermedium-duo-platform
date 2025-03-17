import React, { useContext, useEffect, useState } from 'react';
import Menuitems from './MenuItems';
import { useLocation } from 'react-router';
import { Box, List } from '@mui/material';
import NavItem from './NavItem';
import NavGroup from './NavGroup/NavGroup';
import AuthContext from 'src/contexto/AuthContext';

const SidebarItems = () => {
  const { pathname } = useLocation();
  const pathDirect = pathname;
  const { user } = useContext(AuthContext)
  const [menu, setMenu] = useState([])

  useEffect(() => {
    if (JSON.parse(user).role === "VIEWR") {
      const itemFilter = Menuitems.filter((e) => e.id === "1")
      setMenu([...menu, itemFilter[0]])
      return
    }
    setMenu(Menuitems)
  }, [user])
  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav">
        {menu.map((item) => {
          if (item.subheader) {
            return <NavGroup item={item} key={item.subheader} />;
          } else {
            return (
              <NavItem item={item} key={item.id} pathDirect={pathDirect} />
            );
          }
        })}
      </List>
    </Box>
  );
};
export default SidebarItems;
