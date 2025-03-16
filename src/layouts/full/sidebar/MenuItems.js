import {
  IconAperture, IconCopy, IconLayoutDashboard, IconUserCircle, IconMoodHappy
} from '@tabler/icons';

import { uniqueId } from 'lodash';

const Menuitems = [
  {
    navlabel: true,
    subheader: 'Home',
  },

  {
    id: uniqueId(),
    title: 'Dashboard',
    icon: IconLayoutDashboard,
    href: '/dashboard',
  },
  {
    id: uniqueId(),
    title: 'Localiza - BETA',
    icon: IconAperture,
    href: '/localiza',
  },
  {
    id: uniqueId(),
    title: 'Configurações',
    icon: IconCopy,
    href: '/Configuracao',
  },
  // {
  //   navlabel: true,
  //   subheader: 'Utilitários',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Perfil',
  //   icon: IconUserCircle,
  //   href: '/ui/Perfil',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Shadow',
  //   icon: IconCopy,
  //   href: '/ui/shadow',
  // },
  // {
  //   navlabel: true,
  //   subheader: 'Autenticação',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Login',
  //   icon: IconLogin,
  //   href: '/auth/login',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Register',
  //   icon: IconUserPlus,
  //   href: '/auth/register',
  // },
  // {
  //   navlabel: true,
  //   subheader: 'Extra',
  // },
  // {
  //   id: uniqueId(),
  //   title: 'Icons',
  //   icon: IconMoodHappy,
  //   href: '/icons',
  // },

];

export default Menuitems;
