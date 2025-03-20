import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import ConstructionIcon from '@mui/icons-material/Construction';
import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Dashboard',
    icon:SpaceDashboardIcon,
    href: '/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Operadores',
    icon:AccessibilityNewIcon,
    href: '/operarios',
  },
  {
    id: uniqueId(),
    title: 'Configurações',
    icon:ConstructionIcon,
    href: '/Configuracao',
  },
 

];

export default Menuitems;
