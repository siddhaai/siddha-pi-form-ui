import React, { createContext, useState, useEffect, useRef } from 'react';
// import useAxiosInterceptor from './Interceptor';
// import { useLocation } from 'react-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [step, setStep] = useState();
  const [logo, setLogo] = useState('');
  // console.log(logo,'logoinauth');
  
  const [existPatFieldsShow, setExistPatFieldsShow] = useState('');
  const [existAddFieldsShow, setExistAddFieldsShow] = useState('');
  const [existInsFieldsShow, setExistInsFieldsShow] = useState('');
  const [existEmgFieldsShow, setExistEmgFieldsShow] = useState('');
  const [existRefFieldsShow, setExistRefFieldsShow] = useState('');
  const [skip, setSkip] = useState(false);
  const [shouldReturnToStep11, setShouldReturnToStep11] = useState(false);
  const [isNewPatient, setIsNewPatient] = useState(true);
  const [patientName, setPatientName] = useState(null);
  const [isInsuredPerson, setIsInsuredPerson] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [showOnlyOtherName, setShowOnlyOtherName] = useState(false);
  const [docLoading, setDocLoading] = useState(false);
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const sigPad = useRef(null);
  const [isSignatureConfirmed, setIsSignatureConfirmed] = useState(false);
  const [skipStep8, setSkipStep8] = useState(false); // Track if Step 8 should be skipped
  const [skipStep9, setSkipStep9] = useState(false); // Track if Step 9 should be skipped



  // const { axios } = useAxiosInterceptor();
  const [customizeForm, setCustomForm] = useState(null);
  // const location = useLocation();
  const [DIdNew, setDIdNew] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.setItem('isAuthenticated', 'false');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
        step,
        setStep,
        existPatFieldsShow,
        setExistPatFieldsShow,
        existAddFieldsShow,
        setExistAddFieldsShow,
        existInsFieldsShow,
        setExistInsFieldsShow,
        existEmgFieldsShow,
        setExistEmgFieldsShow,
        existRefFieldsShow,
        setExistRefFieldsShow,
        shouldReturnToStep11,
        setShouldReturnToStep11,
        isNewPatient,
        setIsNewPatient,
        patientName,
        setPatientName,
        loading,
        setLoading,
        DIdNew,
        setDIdNew,
        customizeForm,
        setCustomForm,
        logo,
        setLogo,
        isInsuredPerson,
        setIsInsuredPerson,
        confirmationChecked,
        setConfirmationChecked,
        showOnlyOtherName,
        setShowOnlyOtherName,
        docLoading,
        setDocLoading,
        formSubmitLoading,
        setFormSubmitLoading,
        sigPad,
        isSignatureConfirmed,
        setIsSignatureConfirmed,
        skip,
        setSkip,
        skipStep8,  
        setSkipStep8,
        skipStep9,    
        setSkipStep9
      }}
    >
       {/* {console.log('isNewPatient:', isNewPatient, 'setIsNewPatient:', setIsNewPatient)} */}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
