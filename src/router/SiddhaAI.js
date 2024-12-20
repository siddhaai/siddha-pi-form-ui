import { Suspense, lazy } from 'react';
// import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Siddha AI

// const LoginScreen = Loader(
//   lazy(() => import('src/content/SiddhaAI/LoginScreen/LoginScreen'))
// );

// const CreateDoctor = Loader(
//   lazy(() => import('src/content/SiddhaAI/CreateDoctor/CreateDoctor'))
// );
// const CreateProfile = Loader(
//   lazy(() => import('src/content/SiddhaAI/CreateProfile/CreateProfile'))
// );
// const NewPatient = Loader(
//   lazy(() => import('src/content/SiddhaAI/NewPatient/NewPatient'))
// );

// const FormBuilder = Loader(
//   lazy(() => import('src/content/SiddhaAI/FormBuilder/FormBuilder'))
// );
// const GetForm = Loader(
//   lazy(() => import('src/content/SiddhaAI/GetForm/GetForm'))
// );
// const DashBoard = Loader(
//   lazy(() => import('src/content/SiddhaAI/DashBoard/DashBoard'))
// );

// const ExistingPatient = Loader(
//   lazy(() => import('src/content/SiddhaAI/ExistingPatient/ExistingPatient'))
// );

// const Reports = Loader(
//   lazy(() => import('src/content/SiddhaAI/Reports/Reports'))
// );
// const PIForm = Loader(
//   lazy(() => import('src/content/SiddhaAI/PIForm/PIForm'))
// );

const AdminRoutes = [
  // {
  //   path: 'LoginScreen',
  //   children: [
  //     {
  //       path: 'LoginScreen',
  //       element: <LoginScreen />
  //     }
  //   ]
  // },
  // {
  //   path: 'CreateDoctor',
  //   children: [
  //     {
  //       path: 'CreateDoctor',
  //       element: <CreateDoctor />
  //     }
  //   ]
  // },
  // {
  //   path: 'CreateProfile',
  //   children: [
  //     {
  //       path: 'CreateProfile',
  //       element: <CreateProfile />
  //     }
  //   ]
  // },
  // {
  //   path: 'NewPatient',
  //   children: [
  //     {
  //       path: 'NewPatient',
  //       element: <NewPatient />
  //     }
  //   ]
  // },
  // {
  //   path: 'FormBuilder',
  //   children: [
  //     {
  //       path: 'FormBuilder',
  //       element: <FormBuilder />
  //     }
  //   ]
  // },
  // {
  //   path: 'GetForm',
  //   children: [
  //     {
  //       path: 'GetForm',
  //       element: <GetForm />
  //     }
  //   ]
  // },
  // {
  //   path: 'DashBoard',
  //   children: [
  //     {
  //       path: 'DashBoard',
  //       element: <DashBoard />
  //     }
  //   ]
  // },
  // {
  //   path: 'ExistingPatient',
  //   children: [
  //     {
  //       path: 'ExistingPatient',
  //       element: <ExistingPatient />
  //     }
  //   ]
  // },
  // {
  //   path: 'Reports',
  //   children: [
  //     {
  //       path: 'Reports',
  //       element: <Reports />
  //     }
  //   ]
  // }
  // {
  //   path: 'PIForm',
  //   children: [
  //     {
  //       path: 'PIForm',
  //       element: <PIForm />
  //     }
  //   ]
  // }

  // {
  //   path: 'ForgetPassword',
  //   children: [
  //     {
  //       path: 'ForgetPassword',
  //       element: <ForgetPassword />
  //     }
  //   ]
  // },
];

export default AdminRoutes;
