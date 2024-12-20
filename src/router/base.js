import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Pages

// const Overview = Loader(lazy(() => import('src/content/overview')));
// const SiddhaLogin = Loader(
//   lazy(() => import('src/content/pages/Auth/SiddhaLogin/SiddhaLogin'))
// );
const PIForm = Loader(
  lazy(() => import('src/content/pages/Auth/PIForm/PIForm'))
);
// Status

const Status404 = Loader(
  lazy(() => import('src/content/pages/Status/Status404'))
);
const Status500 = Loader(
  lazy(() => import('src/content/pages/Status/Status500'))
);


const baseRoutes = [
  // {
  //   path: '/',
  //   element: <Overview />
  // },
  {
    path: '/',
    element: <PIForm />
  },
  // {
  //   path: '/',
  //   element: <SiddhaLogin />
  // },
  {
    path: 'overview',
    element: <Navigate to="/" replace />
  },
  {
    path: '*',
    element: <Status404 />
  },
  {
    path: 'status',
    children: [
      {
        path: '500',
        element: <Status500 />
      },
     
    ]
  },
  {
    path: '*',
    element: <Status404 />
  }
];

export default baseRoutes;
