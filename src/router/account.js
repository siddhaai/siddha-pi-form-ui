import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Guest from 'src/components/Guest';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Account
// const SiddhaLogin = Loader(
//   lazy(() => import('src/content/pages/Auth/SiddhaLogin/SiddhaLogin'))
// );



// const PIForm = Loader(
//   lazy(() => import('src/content/pages/Auth/PIForm/PIForm'))
// );
const accountRoutes = [

  // {
  //   path: 'pi-form',
  //   element: <PIForm />
  // },
 

  // {
  //   path: 'login',
  //   element: <SiddhaLogin />
  // },

];

export default accountRoutes;
