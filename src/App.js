import { useLocation, useRoutes } from 'react-router-dom';
import router from 'src/router';

import { SnackbarProvider } from 'notistack';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useAuth from 'src/hooks/useAuth';
import { AuthProvider } from 'src/contexts/AuthContext';
import { CssBaseline } from '@mui/material';
import ThemeProvider from './theme/ThemeProvider';
import AppInit from './components/AppInit';
import { useContext, useEffect } from 'react';
import AuthContext from './contexts/JWTAuthContext';
import useAxiosInterceptor from './contexts/Interceptor';
import { I18nextProvider } from 'react-i18next';
import i18n from './Lang/i18n'; // Import the i18n configuration

function App() {
  const content = useRoutes(router);
  const auth = useAuth();
  const location = useLocation();
  console.log(location, 'locationappstate');

  const { axios } = useAxiosInterceptor();

  // const {
  //   isNewPatient,
  //   setIsNewPatient,
  //   setPatientName,
  //   setCustomForm,
  //   setDIdNew,
  //   setStep,
  //   setLoading,
  //   DIDNew,
  //   customizeForm,
  //   patientName
  // } = useContext(AuthContext);

  // if (!setIsNewPatient || typeof setIsNewPatient !== 'function') {
  //   console.error("setIsNewPatient is not a function in AuthContext");
  // }

 

  return (
    <ThemeProvider>
      <AuthProvider>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SnackbarProvider
            maxSnack={6}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right'
            }}
          >
            <CssBaseline />
            <I18nextProvider i18n={i18n}>
              {auth.isInitialized ? content : <AppInit />}
            </I18nextProvider>
          </SnackbarProvider>
        </LocalizationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
