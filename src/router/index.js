import { Navigate } from 'react-router-dom';

import BoxedSidebarLayout from 'src/layouts/BoxedSidebarLayout';
import DocsLayout from 'src/layouts/DocsLayout';
import BaseLayout from 'src/layouts/BaseLayout';
import AccentHeaderLayout from 'src/layouts/AccentHeaderLayout';
import AccentSidebarLayout from 'src/layouts/AccentSidebarLayout';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import CollapsedSidebarLayout from 'src/layouts/CollapsedSidebarLayout';
import BottomNavigationLayout from 'src/layouts/BottomNavigationLayout';
import TopNavigationLayout from 'src/layouts/TopNavigationLayout';

import accountRoutes from './account';
import baseRoutes from './base';
import SiddhaAIRoutes from './SiddhaAI';

const router = [
  {
    path: 'account',
    children: accountRoutes
  },
  {
    path: '',
    element: <BaseLayout />,
    children: baseRoutes
  },

  // Documentation

 

  // Boxed Sidebar Layout

  {
    path: 'boxed-sidebar',
    element: (
     
        <BoxedSidebarLayout />
     
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },

     
    ]
  },

  // Accent Sidebar Layout

  {
    path: 'accent-sidebar',
    element: (
    
        <AccentSidebarLayout />
    
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
     
     
    ]
  },

  // Collapsed Sidebar Layout

  {
    path: 'collapsed-sidebar',
    element: (
     
        <CollapsedSidebarLayout />
    
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
      
     
    ]
  },

  // Bottom Navigation Layout

  {
    path: 'bottom-navigation',
    element: (
     
        <BottomNavigationLayout />
    
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
     
     
    ]
  },

  // Top Navigation Layout

  {
    path: 'top-navigation',
    element: (
     
        <TopNavigationLayout />
    
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
     
     
    ]
  },

  // Accent Header Layout

  {
    path: 'accent-header',
    element: (
        <AccentHeaderLayout />
    ),
    children: [
      {
        path: '',
        element: <Navigate to="dashboards" replace />
      },
    
    ]
  },

  // Extended Sidebar Layout

  {
    path: 'extended-sidebar',
    element: (
        <ExtendedSidebarLayout />
    ),
    children: [
    
    ]
  }
];

export default router;
