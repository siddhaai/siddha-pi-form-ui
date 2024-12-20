import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EastIcon from '@mui/icons-material/East';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ScreenLockLandscapeIcon from '@mui/icons-material/ScreenLockLandscape';
import ScreenLockPortraitIcon from '@mui/icons-material/ScreenLockPortrait';
import WestIcon from '@mui/icons-material/West';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Autocomplete,
  Box,
  Button,
  Card,
  Checkbox,
  // Snackbar,
  CircularProgress,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  lighten,
  List,
  ListItemButton,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Step,
  StepLabel,
  Stepper,
  styled,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Zoom
} from '@mui/material';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
// import { convert } from 'html-to-text';
import jsPDF from 'jspdf';
import { debounce } from 'lodash';
import { useSnackbar } from 'notistack';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import InputMask from 'react-input-mask';
import { useLocation } from 'react-router';
import SignaturePad from 'react-signature-canvas';
import Webcam from 'react-webcam';
import animatedIcon from 'src/assets/completed.svg';

import PIForm_logo from 'src/assets/PIForm_logo.png';
import Loader from 'src/content/SiddhaAI/Loader/Loader';
import AuthContext from 'src/contexts/AuthContext';
import Block12 from './Camera';
import Footer from './Footer';
import Header from './Header';
import './StylesJav.css';
import useAxiosInterceptor from 'src/contexts/Interceptor';
import placeholderImage from 'src/assets/placeholderimg.jpg';
import placeholderImage2 from 'src/assets/placeholderImage.jpg';
import InsFront from 'src/assets/InsFront.jpg';
import InsBack from 'src/assets/InsBack.jpg';
import Pica from 'pica';
import Compressor from 'compressorjs';
import { set } from 'nprogress';
// import axiosOriginal from 'axios';
import highsizePdf from './highsizepdf.pdf';
import axios from 'axios';
import DocLoader from './Loaders/DocLoader';
import FormLoader from './Loaders/FormLoader';
import { IMaskInput } from 'react-imask';
import { current } from '@reduxjs/toolkit';

const ListItemButtonWrapper = styled(ListItemButton)(
  ({ theme }) => `
    transition: ${theme.transitions.create(['transform', 'box-shadow'])};
    transform: scale(1);
    background: ${theme.colors.alpha.white[100]};
    position: relative;
    z-index: 5;

    &:hover {
      border-radius: ${theme.general.borderRadius};
      background: ${theme.colors.alpha.white[100]};
      z-index: 6;
      box-shadow: 
        0 0.56875rem 3.3rem ${alpha(theme.colors.alpha.black[100], 0.05)},
        0 0.9975rem 2.4rem ${alpha(theme.colors.alpha.black[100], 0.07)},
        0 0.35rem 1rem ${alpha(theme.colors.alpha.black[100], 0.1)},
        0 0.225rem 0.8rem ${alpha(theme.colors.alpha.black[100], 0.15)};
      transform: scale(1.08);
    }
  `
);

// Animation for the loader
const LoaderAnimation = styled('div')`
  width: 60px;
  height: 60px;
  border: 6px solid #4caf50;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

// Custom styles for the red asterisk
const RequiredLabel = styled('span')({
  color: 'red'
});

// Function to convert base64 to Blob
const base64ToBlob = (base64) => {
  const byteString = atob(base64.split(',')[1]);
  const mimeString = base64.split(',')[0].split(':')[1].split(';')[0];
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);
  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], { type: mimeString });
};
// Utility function to convert Blob to Base64
const blobToBase64 = (blob) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const TextMaskCustom = React.forwardRef(function TextMaskCustom(props, ref) {
  const { onChange, name, ...other } = props;
  return (
    <IMaskInput
      {...other}
      mask="(000) 000-0000"
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name, value } })}
      overwrite={false}
    />
  );
});

export default function TestTableData() {
  // const pica = new Pica();
  const location = useLocation(); // Used to get query params from the URL
  const [DIdNew, setDIdNew] = useState(null); // State to store the short_token
  const theme = useTheme();
  const [hideStep9, setHideStep9] = useState(false);
  // const hideStep9 = shouldSkipStep('PrimaryCarePhysician');
  const { axbe } = useAxiosInterceptor();

  const {
    step,
    setStep,
    existPatFieldsShow,
    existAddFieldsShow,
    existInsFieldsShow,
    existEmgFieldsShow,
    existRefFieldsShow,
    shouldReturnToStep11,
    setShouldReturnToStep11,
    skip,
    setSkip,
    isNewPatient,
    setIsNewPatient,
    patientName,
    setPatientName,
    customizeForm,
    setCustomForm,
    loading,
    setLoading,
    logo,
    setLogo,
    isInsuredPerson,
    setIsInsuredPerson,
    confirmationChecked,
    setConfirmationChecked,
    docLoading,
    setDocLoading,
    showOnlyOtherName,
    setShowOnlyOtherName,
    formSubmitLoading,
    setFormSubmitLoading,
    sigPad,
    isSignatureConfirmed,
    setIsSignatureConfirmed
    // isNewPatient
  } = useContext(AuthContext);

  // console.log('confirmationChecked', confirmationChecked);

  console.log('should Return To Step11', shouldReturnToStep11);
  console.log(existInsFieldsShow, 'existInsFieldsShow');

  console.log(step, 'current step');

  // console.log(formSubmitLoading, 'submitgifstate');

  // Utility function to check if all PrimaryCarePhysician fields are hidden

  //   const isStep9Hidden = (primaryCarePhysicianFields) => {
  //     return primaryCarePhysicianFields.every((field) => !field.visibility);
  //   };

  //   // Get the PrimaryCarePhysician fields from customizeForm
  //   const primaryCarePhysicianFields =
  //     customizeForm?.fields?.find((section) => section.PrimaryCarePhysician)
  //       ?.PrimaryCarePhysician || [];

  //   // Check if Step 9 should be hidden and update the state accordingly
  //   useEffect(() => {
  //     const shouldHideStep9 = isStep9Hidden(primaryCarePhysicianFields);
  //     setHideStep9(shouldHideStep9);
  //   }, [primaryCarePhysicianFields]);

  //  console.log(hideStep9, 'hideStep9');

  // Utility function to check if all fields in a section have visibility set to false

  // const areAllFieldsHidden = (sectionFields) => {
  //   return sectionFields.every((field) => !field.visibility);
  // };
  const areAllFieldsHidden = (sectionFields) => {
    console.log('Section Fields:', sectionFields);
    const result = sectionFields.every((field) => !field.visibility);
    console.log('Are all fields hidden:', result);
    return result;
  };
  // Function to get fields for a specific section from customizeForm
  // const getSectionFields = (sectionName) => {
  //   return (
  //     customizeForm?.fields?.find((section) => section[sectionName])?.[
  //       sectionName
  //     ] || []
  //   );
  // };

  const getSectionFields = (sectionName) => {
    const fields =
      customizeForm?.fields?.find((section) => section[sectionName])?.[
        sectionName
      ] || [];
    console.log(`Fields for ${sectionName}:`, fields); // Debugging log
    return fields;
  };
  // Function to check if a step should be skipped based on field visibility
  const shouldSkipStep = (sectionName) => {
    const sectionFields = getSectionFields(sectionName);
    console.log(`Section Fields for ${sectionName}:`, sectionFields);
    return areAllFieldsHidden(sectionFields);
  };

  console.log(shouldSkipStep('PrimaryCarePhysician'), 'PrimaryCarePhysician');
  console.log(shouldSkipStep('EmergencyDetails'), 'EmergencyDetails');

  useEffect(() => {
    if (!location || !location.search) return;
    // if (location && location.search) {
    const searchParams = new URLSearchParams(location.search);
    const DIdHere = searchParams.get('short_token'); // Get the value of 'short_token'

    if (DIdHere) {
      setDIdNew(DIdHere); // Save the short_token in the state
      // initiateApiCall(DIdHere); // Call the API when camera access is granted

      // }
      axbe
        .get(`/token/access?short_token=${DIdHere}`)
        .then((response) => {
          console.log('API Response app:', response?.data);

          // Extract the session token and patient_is_new from the response
          const sessionToken = response?.data?.SessionToken?.sessionToken;
          const Logo = response?.data?.logo;

          if (Logo) {
            setLogo(Logo);
            // console.log(Logo, 'LOGOFROMRES'); // Check if the logo is correctly logged here
          } else {
            // console.log('Logo not available in response');
          }
          localStorage.setItem('Sessiontoken', sessionToken);
          const patientIsNew = response?.data?.patient_is_new;
          const patientName = response?.data?.patientName;
          console.log('patientIsNewapp:', patientIsNew);
          fetchGenders();
          fetchLanguages();
          fetchRelationships();
          fetchRelationshipsIns();
          fetchStates();
          fetchAgreements();
          // console.log(
          //   'API response app customizeForm:',
          //   response?.data?.customizeForm
          // ); // Debugging: log the API response
          // Save customizeForm to state
          setCustomForm(response?.data?.customizeForm);
          console.log(customizeForm, 'customizeformappstate');

          // Save them in the corresponding states
          // setToken(sessionToken);
          setIsNewPatient(patientIsNew);
          setPatientName(patientName);
          setLogo(Logo);
          // console.log(logo, 'logofromstate');

          // console.log(patientName, 'patientnameappstate');
          // console.log(isNewPatient, 'isNewPatientappstate');

          // Adjust initial step based on patient status
          if (patientIsNew) {
            setStep(3);
          } else {
            setStep(1);
          }

          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching token:', error);
        });
    }
  }, [location.search]);

  useEffect(() => {
    if (isNewPatient) {
      setStep(3);
    } else {
      setStep(1);
    }
  }, [isNewPatient]);

  const tokenPi = localStorage.getItem('Sessiontoken');

  // const isFieldVisible = (group, fieldName) => {
  //   // Ensure customizeForm is loaded and contains fields
  //   if (!customizeForm || !customizeForm.fields) return false;

  //   // Search for the specific group (e.g., PersonalDetails, AddressDetails) in the fields array
  //   const fieldGroup = customizeForm.fields.find((item) => item[group]);

  //   // If the group exists, search for the field in that group
  //   if (fieldGroup && fieldGroup[group]) {
  //     const field = fieldGroup[group].find((item) => item.field === fieldName);
  //     return field ? field.visibility : false;
  //   }

  //   // Return false if the group or field isn't found
  //   return false;
  // };

  const isFieldVisible = (group, fieldName) => {
    if (!customizeForm || !customizeForm.fields) {
      console.log('customizeForm or fields are missing');
      return false;
    }

    const fieldGroup = customizeForm.fields.find((item) => item[group]);

    if (!fieldGroup) {
      console.log(`No field group found for ${group}`);
      return false;
    }

    const field = fieldGroup[group].find((item) => item.field === fieldName);

    if (!field) {
      console.log(`No field found for ${fieldName} in ${group}`);
      return false;
    }

    console.log(`Visibility for ${fieldName} in ${group}: ${field.visibility}`);
    return field.visibility;
  };

  console.log(customizeForm, 'custom Form');
  console.log(isNewPatient, 'is new patient');
  const [touchedFields, setTouchedFields] = useState({});
  const [selectedDateEx, setSelectedDateEx] = useState(null); // State for DOB
  const [dobErrorEx, setDobErrorEx] = useState(''); // Error message for invalid DOB
  const [generatedPdfUrls, setGeneratedPdfUrls] = useState([]);
  const [attachmentTitles, setAttachmentTitles] = useState([]);
  // const { axbe } = useaxbeInterceptor();
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDate, setSelectedDate] = useState(null);

  console.log('attachmentTitles', attachmentTitles);
  // console.log(selectedDate, 'selectedDate');

  const [dateOfBirth, setDateOfBirth] = useState(null);
  // console.log(dateOfBirth, 'dateOfBirthstate');

  // Example usage

  const normalizeDate = (value) => {
    if (!value) return null; // Handle null/undefined
    return dayjs.isDayjs(value) ? value : dayjs(value); // Convert strings to Day.js
  };

  // const dumdate = normalizeDate('2024-12-02');

  // console.log(dumdate?.format('YYYY-MM-DD'), 'formatdatenew'); // Output: "2024-12-02"

  const [checked, setChecked] = React.useState(false);
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState(null); // Store PDF URL
  const [isSignaturePadCleared, setIsSignaturePadCleared] = useState(false);
  const [areAllAgreementsSigned, setAreAllAgreementsSigned] = useState(false); // New state name
  const [attachementTitle, SetAttachementTitle] = useState('');
  const [isUnder16, setIsUnder16] = useState(false);

  const [capturing, setCapturing] = useState(false); // New state to manage capture process
  const [capturedImage, setCapturedImage] = useState(null);
  const [capturedImageForAPI, setCapturedImageForAPI] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraOpenFront, setIsCameraOpenFront] = useState(false);
  const [isCameraOpenBack, setIsCameraOpenBack] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  console.log(snackbarOpen, 'snackbarOpen');

  const [snackbarOpenSuccess, setSnackbarOpenSuccess] = React.useState(false);

  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarMessageSuccess, setSnackbarMessageSuccess] =
    React.useState('');

  const [showSnackbar, setShowSnackbar] = useState(false);
  const [capturedFrontImage, setCapturedFrontImage] = useState(null); // State for front image
  const [capturedBackImage, setCapturedBackImage] = useState(null); // State for back image
  const [capturedBackImageForAPI, setCapturedBackImageForAPI] = useState(null);
  const [capturedFrontImageForAPI, setCapturedFrontImageForAPI] =
    useState(null);
  const [savedFrontImage, setSavedFrontImage] = useState(null); // State for saving front image after confirmation
  const [savedBackImage, setSavedBackImage] = useState(null); // State for saving back image after confirmation
  const [useLandscape, setUseLandscape] = useState(true); // State to toggle landscape/portrait
  const [disableRetakeFront, setDisableRetakeFront] = useState(false); // Disable retake after confirm front
  const [disableRetakeBack, setDisableRetakeBack] = useState(false); // Disable retake after confirm back
  const [expandedAccordion, setExpandedAccordion] = useState(null);

  const [buttonText, setButtonText] = useState('Take Photo');
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('');
  const [selectedLanguageName, setSelectedLanguageName] = useState('');
  const [otherReferralName, setOtherReferralName] = useState('');
  const [agreements, setAgreements] = useState([]);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [agreementStates, setAgreementStates] = useState({});
  const [agreementErrors, setAgreementErrors] = useState({});
  const [payerCodes, setPayerCodes] = useState([]);
  const [selectedPayerCode, setSelectedPayerCode] = useState(null);
  const [payerNameQuery, setPayerNameQuery] = useState('');
  const [genders, setGenders] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [relationship, setRelationship] = useState('');

  const [relationshipData, setRelationshipData] = useState([]);
  const [relationshipIns, setRelationshipIns] = useState('');

  const [relationshipInsName, setRelationshipInsName] = useState('');
  const [relationshipDataIns, setRelationshipDataIns] = useState([]);
  const [states, setStates] = useState('');
  const [stateName, setStateName] = useState('');
  const [statesData, setStatesData] = useState([]);
  const [dateError, setDateError] = useState('');
  const [dateErrorIns, setDateErrorIns] = useState('');
  const [isPhoneValid, setIsPhoneValid] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [insFirstName, setInsFirstName] = useState('');
  const [insLastName, setInsLastName] = useState('');
  const [addresses, setAddresses] = useState([]); // Store addresses from API response
  const [selectedAddress, setSelectedAddress] = useState(null); // Store selected address
  const [validationErrors, setValidationErrors] = useState({});
  const [addressError, setAddressError] = useState(''); // Store any address validation error
  const [addingData, setAddingData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    streetName: '',
    city: '',
    zipCode: '',
    email: '',
    groupNumber: '',
    memberID: '',
    insFirstName,
    insLastName,
    dateOfBirth: null,
    emergencyFirstname: '',
    emergencyLastname: '',
    emergencyPhoneNo: '',
    PCPFirstname: '',
    PCPLastname: '',
    PCPPhoneNo: '',
    PCPFaxNo: '',
    OtherReferralName: '',
    errors: {
      firstName: '',
      middleName: '',
      lastName: '',
      streetName: '',
      city: '',
      zipCode: '',
      email: '',
      groupNumber: '',
      memberID: '',
      insFirstName: '',
      insLastName: '',
      dateOfBirth: '',
      emergencyFirstname: '',
      emergencyLastname: '',
      emergencyPhoneNo: '',
      PCPFirstname: '',
      PCPLastname: '',
      PCPPhoneNo: '',
      PCPFaxNo: '',
      OtherReferralName: ''
    }
  });
  console.log('adding Data :', addingData);

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  // First Name validation regex (only alphabetic characters allowed)
  const nameRegex = /^[A-Za-z\s]+$/;
  // Phone number validation regex (10 digits)
  const regex = /^[A-Za-z]+$/;
  // const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/; // (XXX) XXX-XXXX
  // const faxRegex = /^\+1 \(\d{3}\) \d{3} \d{4}$/; // +1 (XXX) XXX XXXX
  // const phoneRegex = /^\(\d{3}\) \d{3} \d{4}$/; // (XXX) XXX XXXX
  const phoneRegex = /^\([2-9]\d{2}\) \d{3} \d{4}$/; // (XXX) XXX XXXX, where the area code can't start with 0 or 1
  const faxRegex = /^\(\d{3}\) \d{3} \d{4}$/; // (XXX) XXX XXXX
  const alphabeticRegex = /^[A-Za-z\s]+$/;
  const alphanumericRegex = /^[a-zA-Z0-9\s]*$/; // Allows letters, numbers, and spaces
  const alphabeticRegexs = /^[a-zA-Z\s]*$/; // Allows only letters and single spaces

  useEffect(() => {
    const selectedLanguage = languages?.find((item) => item?.id === language);

    // Get the language name if a matching language is found
    const languageName = selectedLanguage ? selectedLanguage?.value : null;
    setSelectedLanguageName(languageName);
  }, [language]);

  useEffect(() => {
    const selectedState = statesData?.find((item) => item?.id === states);

    // Get the language name if a matching language is found
    const stateName = selectedState ? selectedState?.value : null;
    setStateName(stateName);
  }, [states]);

  useEffect(() => {
    const selectedRelationNameIns = relationshipDataIns?.find(
      (item) => item?.id === relationshipIns
    );
    // console.log('selectedrelationshipfindins', selectedRelationNameIns);

    // Get the language name if a matching language is found
    const relationshipNameIns = selectedRelationNameIns
      ? selectedRelationNameIns?.value
      : null;
    setRelationshipInsName(relationshipNameIns);
  }, [relationshipIns]);

  const handleBlur = (event) => {
    const { name, value } = event.target;

    // Mark the field as touched
    setTouchedFields((prev) => ({ ...prev, [name]: true }));

    // Trigger validation only when the field is blurred
    handleChange(name, value);
  };

  const [errorStep, setErrorStep] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;

    let updatedData = { ...addingData, [name]: value };
    let updatedErrors = { ...validationErrors };

    console.log('updatedErrors', updatedErrors);

    // Validation logic for different fields
    switch (name) {
      case 'firstName':
        if (value.trim() === '') {
          updatedErrors.firstName = t('This field is mandatory');
        } else if (!regex.test(value)) {
          updatedErrors.firstName = t('Only alphabetic characters are allowed');
          setErrorStep(step);
        } else if (value.length < 3) {
          updatedErrors.firstName = t('Must be at least 3 characters long');
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.firstName = t('Must not exceed 35 characters');
          setErrorStep(step);
        } else {
          updatedErrors.firstName = ''; // Clear error if valid
          setErrorStep(null);
        }
        break;

      case 'middleName':
        if (value.trim() === '') {
          updatedErrors.middleName = ''; // No error if the field is empty
          setErrorStep(step);
        } else if (!regex.test(value)) {
          updatedErrors.middleName = t(
            'Only alphabetic characters are allowed'
          );
          setErrorStep(step);

          // } else if (!alphabeticRegexs.test(value)) {
          //   updatedErrors.middleName = t(
          //     'Only alphabetic characters are allowed'
          //   );
          //   setErrorStep(step);
        } else if (value.length < 1) {
          updatedErrors.middleName = t('Must be at least 3 characters long');
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.middleName = t('Must not exceed 35 characters');
          setErrorStep(step);
        } else {
          updatedErrors.middleName = ''; // Clear error if valid
          setErrorStep(null);
        }
        break;

      case 'lastName':
        if (value.trim() === '') {
          updatedErrors.lastName = t('This field is mandatory');
          setErrorStep(step);
        } else if (!regex.test(value)) {
          updatedErrors.lastName = t('Only alphabetic characters are allowed');
          setErrorStep(step);
        } else if (value.length < 3) {
          updatedErrors.lastName = t(
            'Last Name must be at least 3 characters long'
          );
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.lastName = t('Last Name must not exceed 35 characters');
          setErrorStep(step);
        } else {
          updatedErrors.lastName = ''; // Clear error if valid
          setErrorStep(null);
        }
        break;
      case 'phoneNumber':
        // Remove any non-numeric characters
        const numericValue = value.replace(/\D/g, '');
        if (!value) {
          updatedErrors.phoneNumber = t('This field is mandatory');
          setErrorStep(step);
        }
        // Check if the phone number has less than 10 digits
        else if (numericValue.length < 10) {
          updatedErrors.phoneNumber = t(
            'Phone number must be at least 10 digits'
          );
          setErrorStep(step);
        } else if (
          numericValue.length > 0 &&
          (numericValue[0] === '0' || numericValue[0] === '1')
        ) {
          // If the number starts with 0 or 1
          updatedErrors.phoneNumber = t(
            'Phone number cannot start with 0 or 1'
          );
          setErrorStep(step);
        }
        // Check if the phone number has more than 10 digits
        else if (numericValue.length > 10) {
          updatedErrors.phoneNumber = t(
            'Phone number must not exceed 10 digits'
          );
          setErrorStep(step);
        }
        // Clear error if the phone number has exactly 10 digits
        else {
          updatedErrors.phoneNumber = ''; // Clear error if valid
          setErrorStep(null);
        }
        break;

      // Other cases for address fields
      case 'streetName':
        if (!value) {
          updatedErrors.streetName = t('This field is mandatory');
          setErrorStep(step);
        } else if (!alphanumericRegex.test(value)) {
          updatedErrors.streetName = t(
            'Only alphanumeric characters and spaces are allowed'
          );
          setErrorStep(step);
        } else if (value.length > 255) {
          updatedErrors.streetName = t(
            'Street Name must not exceed 255 characters'
          );
          setErrorStep(step);
        } else {
          updatedErrors.streetName = ''; // Clear error if valid
          setErrorStep(null);
        }
        break;

      case 'city':
        if (!value) {
          updatedErrors.city = t('This field is mandatory');
          setErrorStep(step);
        } else if (!alphabeticRegex.test(value)) {
          updatedErrors.city = t(
            'Only alphabetic characters and single spaces are allowed'
          );
          setErrorStep(step);
        } else if (value.length > 45) {
          updatedErrors.city = t('City must not exceed 45 characters');
          setErrorStep(step);
        } else {
          updatedErrors.city = ''; // Clear error if valid t()
          setErrorStep(null);
        }
        break;

      case 'zipCode':
        if (!value.trim()) {
          updatedErrors.zipCode = t('This field is mandatory');
          setErrorStep(step);
        } else if (!/^\d{5}$/.test(value)) {
          updatedErrors.zipCode = t('Zip Code must be exactly 5 digits');
          setErrorStep(step);
        } else {
          updatedErrors.zipCode = ''; // Clear error if valid
          setErrorStep(null);
        }
        break;
      case 'email':
        if (!value) {
          updatedErrors.email = t('This field is mandatory');
          setErrorStep(step);
        } else if (value.length > 255) {
          updatedErrors.email = t('Email must not exceed 255 characters');
          setErrorStep(step);
        } else if (!emailRegex.test(value)) {
          updatedErrors.email = t('Please enter a valid email address');
          setErrorStep(step);
        } else {
          updatedErrors.email = '';
          setErrorStep(null);
        }
        break;

      case 'groupNumber':
        if (!value.trim()) {
          updatedErrors.groupNumber = t('This field is mandatory');
          setErrorStep(step);
        } else if (!alphanumericRegex.test(value)) {
          updatedErrors.groupNumber = t(
            'Group Number must contain only numeric values'
          );
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.groupNumber = t(
            'Group Number must not exceed 35 characters'
          );
          setErrorStep(step);
        } else {
          updatedErrors.groupNumber = '';
          setErrorStep(null);
        }
        break;

      case 'memberID':
        if (!value.trim()) {
          updatedErrors.memberID = t('This field is mandatory');
          setErrorStep(step);
        } else if (!alphanumericRegex.test(value)) {
          updatedErrors.memberID = t(
            'Member ID must contain only alphanumeric characters'
          );
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.memberID = t('Member ID must not exceed 35 characters');
          setErrorStep(step);
        } else {
          updatedErrors.memberID = '';
          setErrorStep(null);
        }
        break;

      case 'insFirstName':
        if (value.trim() === '') {
          updatedErrors.insFirstName = t('This field is mandatory');
          setErrorStep(step);
        } else if (!regex.test(value)) {
          updatedErrors.insFirstName = t(
            'Only alphabetic characters are allowed'
          );
          setErrorStep(step);
        } else if (value.length < 3) {
          updatedErrors.insFirstName = t('Must be at least 3 characters long');
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.insFirstName = t('Must not exceed 35 characters');
          setErrorStep(step);
        } else {
          updatedErrors.insFirstName = '';
          setErrorStep(null);
        }
        break;

      case 'insLastName':
        if (value.trim() === '') {
          updatedErrors.insLastName = t('This field is mandatory');
          setErrorStep(step);
        } else if (!regex.test(value)) {
          updatedErrors.insLastName = t(
            'Only alphabetic characters are allowed'
          );
          setErrorStep(step);
        } else if (value.length < 3) {
          updatedErrors.insLastName = t('Must be at least 3 characters long');
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.insLastName = t('Must not exceed 35 characters');
          setErrorStep(step);
        } else {
          updatedErrors.insLastName = '';
          setErrorStep(null);
        }
        break;

      case 'emergencyFirstname':
        if (value.trim() === '') {
          updatedErrors.emergencyFirstname = t('This field is mandatory');
          setErrorStep(step);
        } else if (!regex.test(value)) {
          updatedErrors.emergencyFirstname = t(
            'Only alphabetic characters are allowed'
          );
          setErrorStep(step);
        } else if (value.length < 3) {
          updatedErrors.emergencyFirstname = t(
            'Must be at least 3 characters long'
          );
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.emergencyFirstname = t(
            'First Name must not exceed 35 characters'
          );
          setErrorStep(step);
        } else {
          updatedErrors.emergencyFirstname = '';
          setErrorStep(null);
        }
        break;

      case 'emergencyLastname':
        if (value.trim() === '') {
          updatedErrors.emergencyLastname = t('This field is mandatory');
          setErrorStep(step);
        } else if (!regex.test(value)) {
          updatedErrors.emergencyLastname = t(
            'Only alphabetic characters are allowed'
          );
          setErrorStep(step);
        } else if (value.length < 3) {
          updatedErrors.emergencyLastname = t(
            'Must be at least 3 characters long'
          );
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.emergencyLastname = t(
            'Last Name must not exceed 35 characters'
          );
          setErrorStep(step);
        } else {
          updatedErrors.emergencyLastname = '';
          setErrorStep(null);
        }
        break;

      // case 'emergencyPhoneNo':
      //   if (value.trim() === '') {
      //     updatedErrors.emergencyPhoneNo = t('This field is mandatory');
      //     setErrorStep(step);
      //   } else if (!phoneRegex.test(value)) {
      //     updatedErrors.emergencyPhoneNo = t(
      //       'Phone Number must be exactly 10 digits'
      //     );
      //     setErrorStep(step);
      //   } else {
      //     updatedErrors.emergencyPhoneNo = '';
      //     setErrorStep(null);
      //   }
      //   break;

      case 'emergencyPhoneNo':
        // Remove formatting to check raw number
        const unformattedEmergencyPhone = value.replace(/\D/g, ''); // Remove all non-digit characters

        if (!value.trim()) {
          // If the field is empty
          updatedErrors.emergencyPhoneNo = t('This field is mandatory');
          setErrorStep(step);
        } else if (
          unformattedEmergencyPhone.length > 0 &&
          (unformattedEmergencyPhone[0] === '0' ||
            unformattedEmergencyPhone[0] === '1')
        ) {
          // If the number starts with 0 or 1
          updatedErrors.emergencyPhoneNo = t(
            'Phone number cannot start with 0 or 1'
          );
          setErrorStep(step);
        } else if (unformattedEmergencyPhone.length !== 10) {
          // Length check: When the phone number does not contain exactly 10 digits
          updatedErrors.emergencyPhoneNo = t(
            'Phone number must be exactly 10 digits'
          );
          setErrorStep(step);
        } else {
          // No errors, clear the validation message
          updatedErrors.emergencyPhoneNo = '';
          setErrorStep(null);
        }
        break;

      case 'PCPFirstname':
        if (value.trim() === '') {
          updatedErrors.PCPFirstname = t('This field is mandatory');
          setErrorStep(step);
        } else if (!regex.test(value)) {
          updatedErrors.PCPFirstname = t(
            'Only alphabetic characters are allowed'
          );
          setErrorStep(step);
        } else if (value.length < 3) {
          updatedErrors.PCPFirstname = t('Must be at least 3 characters long');
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.PCPFirstname = t(
            'Physician First Name must not exceed 35 characters'
          );
          setErrorStep(step);
        } else {
          updatedErrors.PCPFirstname = '';
          setErrorStep(null);
        }
        break;

      case 'PCPLastname':
        if (value.trim() === '') {
          updatedErrors.PCPLastname = t('This field is mandatory');
          setErrorStep(step);
        } else if (!regex.test(value)) {
          updatedErrors.PCPLastname = t(
            'Only alphabetic characters are allowed'
          );
          setErrorStep(step);
        } else if (value.length < 3) {
          updatedErrors.PCPLastname = t('Must be at least 3 characters long');
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.PCPLastname = t(
            'Physician Last Name must not exceed 35 characters'
          );
          setErrorStep(step);
        } else {
          updatedErrors.PCPLastname = '';
          setErrorStep(null);
        }
        break;

      // case 'PCPPhoneNo':
      //   if (!value.trim()) {
      //     updatedErrors.PCPPhoneNo = t('This field is mandatory');
      //     setErrorStep(step);
      //   } else if (!phoneRegex.test(value)) {
      //     updatedErrors.PCPPhoneNo = t(
      //       'Phone Number must be exactly 10 digits'
      //     );
      //     setErrorStep(step);
      //   } else {
      //     updatedErrors.PCPPhoneNo = '';
      //     setErrorStep(null);
      //   }
      //   break;
      case 'PCPPhoneNo':
        // Remove formatting to check raw number
        const unformattedPhone = value.replace(/\D/g, ''); // Remove all non-digit characters

        if (!value.trim()) {
          // If the field is empty
          updatedErrors.PCPPhoneNo = t('This field is mandatory');
          setErrorStep(step);
        } else if (
          unformattedPhone.length > 0 &&
          (unformattedPhone[0] === '0' || unformattedPhone[0] === '1')
        ) {
          // If the number starts with 0 or 1
          updatedErrors.PCPPhoneNo = t('Phone number cannot start with 0 or 1');
          setErrorStep(step);
        } else if (unformattedPhone.length !== 10) {
          // Length check: When the phone number does not contain exactly 10 digits
          updatedErrors.PCPPhoneNo = t(
            'Phone number must be exactly 10 digits'
          );
          setErrorStep(step);
        } else {
          // No errors, clear the validation message
          updatedErrors.PCPPhoneNo = '';
          setErrorStep(null);
        }
        break;

      case 'PCPFaxNo':
        const cleanedValue = value.replace(/[^\d]/g, ''); // Remove all non-digit characters (mask characters)

        if (!cleanedValue.trim()) {
          updatedErrors.PCPFaxNo = t('This field is mandatory');
          setErrorStep(step);
        }
        // Check if the fax number starts with 0 or 1
        else if (cleanedValue.startsWith('0') || cleanedValue.startsWith('1')) {
          updatedErrors.PCPFaxNo = t('Fax Number cannot start with 0 or 1');
          setErrorStep(step);
        }
        // Check if the fax number is exactly 10 digits
        else if (cleanedValue.length !== 10) {
          updatedErrors.PCPFaxNo = t('Fax Number must be exactly 10 digits');
          setErrorStep(step);
        } else {
          updatedErrors.PCPFaxNo = '';
          setErrorStep(null);
        }
        break;

      case 'OtherReferralName':
        if (!value) {
          updatedErrors.OtherReferralName = t('This field is mandatory');
          setErrorStep(step);
        } else if (!nameRegex.test(value)) {
          updatedErrors.OtherReferralName = t(
            'Only alphabetic characters are allowed'
          );
          setErrorStep(step);
        } else if (value.length < 3) {
          updatedErrors.OtherReferralName = t(
            'Must be at least 3 characters long'
          );
          setErrorStep(step);
        } else if (value.length > 35) {
          updatedErrors.OtherReferralName = t(
            'Other Referral Name must not exceed 35 characters'
          );
          setErrorStep(step);
        }
        //  else if (value.trim() === '') {
        //   updatedErrors.OtherReferralName = t('This field is mandatory');
        // }
        else {
          updatedErrors.OtherReferralName = '';
          setErrorStep(null);
        }
        break;

      default:
        break;
    }
    console.log('Updated Data:', updatedData);
    console.log('Updated Errors:', updatedErrors);

    // Update state with new values and errors
    setValidationErrors(updatedErrors);
    setAddingData(updatedData);

    // Check for validation errors before allowing step transition
    const hasErrors = Object.values(updatedErrors).some(
      (error) => error !== ''
    );
    if (hasErrors) {
      console.log('Cannot proceed to next step due to validation errors.');
      // Optionally, you could disable the next button or trigger an alert here
      // e.g., setStepDisabled(true);
    } else {
      // Proceed to next step or handle navigation logic
      // e.g., setStepDisabled(false);
    }
  };

  const [isAgreementAccepted, setIsAgreementAccepted] = useState(); // Renamed state variables

  const handleAgreementCheckboxChange = (event) => {
    setIsAgreementAccepted(event.target.checked); // Update state when checkbox is clicked
  };

  // Function to handle accordion change
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    // If the panel is already open, set it to null (close it), otherwise set it as the active one
    setExpandedAccordion(isExpanded ? panel : null);
  };

  const handleInsDateChange = (newDate) => {
    let updatedData = { ...addingData, dateOfBirth: newDate };

    // Validate if a valid date is selected
    if (!newDate || newDate === 'Invalid Date') {
      updatedData.errors.dateOfBirth = t('Date of Birth is required');
    } else {
      updatedData.errors.dateOfBirth = '';
    }

    // Update state with new date and any errors
    setAddingData(updatedData);
  };
  console.log('is Under16', isUnder16);
  const today = dayjs(); // Set today to the current date
  const sixteenYearsAgo = today.subtract(16, 'year'); // Calculate the date 16 years ago
  console.log(existRefFieldsShow, 'existRefFieldsShow');

  const handleDateChange = (newValue) => {
    // Check if the newValue is a valid date
    const minimumdate = dayjs('1900-01-01');
    if (!newValue) {
      setDateError(t('This field is mandatory'));
      return;
    }
    if (!newValue || !newValue.isValid()) {
      setDateError(t('Invalid date format. Please use MM/DD/YYYY'));
      setSelectedDate(null); // Reset selected date
      return;
    }
    if (newValue < minimumdate) {
      setDateError(t('Date of birth cannot be before January 1, 1900'));
      setSelectedDate(null); // Reset selected date
      return;
    }
    // Check if the selected date is in the future
    if (newValue.isAfter(today)) {
      setDateError(t('You cannot select or type a future date'));
      setSelectedDate(null); // Reset selected date
      return;
    }

    const age = today.diff(newValue, 'year');

    // If under 16, prevent selecting or typing a date that makes them over 16
    if (isUnder16 && age > 16) {
      setDateError(t('You cannot select a date that makes you over 16'));
      setSelectedDate(null); // Reset selected date
      return;
    }

    // If not under 16, prevent selecting or typing a date that makes them under 16
    if (!isUnder16 && age < 16) {
      setDateError(t('You cannot select a date that makes you under 16'));
      setSelectedDate(null); // Reset selected date
      return;
    }

    // If valid, clear the error and set the selected date
    setDateError('');
    setSelectedDate(newValue);
  };

  const handleDateChange2 = (newValue) => {
    const minimumdate = dayjs('1900-01-01');
    const today = dayjs();
    // Check if the newValue is a valid date

    if (!newValue) {
      setDateErrorIns(t('This field is mandatory'));
      return;
    }
    if (!newValue || !dayjs(newValue).isValid()) {
      setDateErrorIns(t('Invalid date format. Please use MM/DD/YYYY'));
      setDateOfBirth(null); // Reset selected date
      return;
    }
    if (newValue.isBefore(minimumdate)) {
      setDateErrorIns(t('Date of birth cannot be before January 1, 1900'));
      setSelectedDate(null); // Reset selected date
      return;
    }
    // Check if the selected date is in the future
    if (newValue.isAfter(today)) {
      setDateErrorIns(t('You cannot select or type a future date'));
      setDateOfBirth(null); // Reset selected date
      return;
    }

    // If the date is valid and not in the future, clear any errors and set the date
    setDateErrorIns('');
    setDateOfBirth(newValue); // Set the valid date
  };

  // Function to validate the phone number based on the numeric value
  const validatePhoneNumber = (numericValue) => {
    if (!numericValue) {
      setPhoneError(''); // No error shown for an empty input
      setIsPhoneValid(false);
      return;
    }

    if (['0', '1'].includes(numericValue[0])) {
      setPhoneError(t('Phone number cannot start with 0 or 1'));
      setIsPhoneValid(false);
      return;
    }

    if (numericValue.length < 10) {
      setPhoneError(''); // Clear errors while typing
      setIsPhoneValid(false);
      return;
    }

    if (numericValue.length !== 10) {
      setPhoneError(t('Phone Number must be exactly 10 digits'));
      setIsPhoneValid(false);
    } else {
      setPhoneError('');
      setIsPhoneValid(true);
    }
  };

  const handlePhoneChange = (e) => {
    const { value } = e.target;
    const numericValue = value.replace(/\D/g, '');

    let formattedPhoneNumber = numericValue;
    if (numericValue.length > 3 && numericValue.length <= 6) {
      formattedPhoneNumber = `(${numericValue.slice(
        0,
        3
      )}) ${numericValue.slice(3)}`;
    } else if (numericValue.length > 6) {
      formattedPhoneNumber = `(${numericValue.slice(
        0,
        3
      )}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
    }

    setPhoneNumber(formattedPhoneNumber);
    validatePhoneNumber(numericValue);
  };

  const handlePhoneBlur = () => {
    const numericValue = phoneNumber.replace(/\D/g, '');
    if (numericValue.length !== 10) {
      setPhoneError(t('Phone Number must be exactly 10 digits'));
      setIsPhoneValid(false);
    }
  };

  // useEffect(() => {
  //   // if (step === 4) {
  //   //   const hasError = validateStep4Fields();
  //   //   if (hasError) {
  //   //     setSnackbarMessage(t('Please fill in all required fields'));
  //   //     setSnackbarOpen(true);
  //   //     return;
  //   //   }

  //     if (!isPhoneValid) {
  //       setPhoneError(t('Please enter a valid 10-digit phone number'));
  //       return;
  //     } else {
  //       setPhoneError('');
  //     }
  //   // }
  // }, [step, isPhoneValid]);

  // const areAllAgreementsChecked = () => {
  //   return eulaAgreement && nppAgreement && pfAgreement && ctAgreement;

  const handleCheckboxChange = (title) => (event) => {
    const updatedStates = {
      ...agreementStates,
      [title]: event.target.checked
    };
    setAgreementStates(updatedStates);

    // Check if all agreements are signed
    setAreAllAgreementsSigned(Object.values(updatedStates).every(Boolean));
  };
  // Check if all agreements are checked
  const allAgreementsChecked = Object.values(agreementStates).every(Boolean);

  const clearSignature = () => {
    if (sigPad.current) {
      sigPad.current.clear();
      setIsSignatureConfirmed(false);
    }
    // setIsSignaturePadCleared(false);
  };

  const handleConfirm = () => {
    // setIsSignaturePadCleared(true);
    if (sigPad.current.isEmpty()) {
      setSnackbarMessage(t('Signature cannot be empty'));
      setSnackbarOpen(true);
      return; // Stop progression if signature pad is empty
    }

    if (sigPad.current) {
      const signatureDataUrl = sigPad.current.toDataURL();
      console.log('Signature captured:', signatureDataUrl);
      // Further logic with the signature data URL
      setIsSignatureConfirmed(true);
    }
  };

  // const handleCheckboxChange2 = (event) => {
  //   setShowOnlyOtherName(event.target.checked);
  // };

  const handleCheckboxChange2 = (event) => {
    const isChecked = event.target.checked;

    // Update the state for showOnlyOtherName
    setShowOnlyOtherName(isChecked);

    // Clear errors and reset fields depending on the checkbox state
    if (isChecked) {
      // If checkbox is checked, clear errors and fields related to Primary Care Physician
      setAddingData((prevData) => ({
        ...prevData,
        PCPFirstname: '', // Clear First Name
        PCPLastname: '', // Clear Last Name
        PCPPhoneNo: '', // Clear Phone No
        PCPFaxNo: '' // Clear Fax No
      }));

      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        PCPFirstname: '', // Clear validation error for First Name
        PCPLastname: '', // Clear validation error for Last Name
        PCPPhoneNo: '', // Clear validation error for Phone No
        PCPFaxNo: '' // Clear validation error for Fax No
      }));
    } else {
      // If checkbox is unchecked, clear "Other Referral Name" related errors and field
      setAddingData((prevData) => ({
        ...prevData,
        OtherReferralName: '' // Clear Other Referral Name
      }));

      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        OtherReferralName: '' // Clear validation error for Other Referral Name
      }));
    }
  };

  const handleValidate = () => {
    enqueueSnackbar(t('Successfully Validated'), {
      variant: 'success',
      anchorOrigin: {
        vertical: 'bottom',
        horizontal: 'right'
      },
      TransitionComponent: Zoom,
      autoHideDuration: 1000 // Set the duration to 3000 milliseconds (3 seconds)
    });
  };

  // API call for validating DOB
  const validateDOB = async () => {
    // if (!selectedDateEx) {
    //   setDobErrorEx('Please select a valid date of birth.');
    //   return false;
    // }
    const minimumdate = dayjs('1900-01-01');
    if (selectedDateEx < minimumdate) {
      setDobErrorEx(t('Date of birth cannot be before January 1, 1900'));
      setSelectedDate(null); // Reset selected date
      return;
    }
    setLoading(true);
    const formattedDate = dayjs(selectedDateEx).format('YYYY-MM-DD');
    try {
      const response = await axbe.post(
        `/patientValidation/dob`,
        {
          patientDob: formattedDate
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenPi}`
          }
        }
      );

      if (response.status === 200) {
        // Set addresses in state if DOB validation is successful
        setAddresses(response.data.data);
        setStep(2); // Move to step 2
        setLoading(false);
        return true; // Proceed to the next step if valid
      }
    } catch (error) {
      setLoading(false);
      // Handle error responses
      if (error.response) {
        const backendErrorMessage = error.response.data.data;

        // Ensure the message is a string or convert to string
        if (
          error.response.status === 404 &&
          typeof backendErrorMessage === 'string'
        ) {
          setDobErrorEx(
            t('The Provided DOB does not match the Patient record')
          ); // Display backend error as a string
        }
        // else {
        //   setDobErrorEx(
        //     typeof backendErrorMessage === 'object'
        //       ? JSON.stringify(backendErrorMessage)
        //       : 'The provided date of birth is invalid. Please try again.'
        //   );
        // }
      } else {
        setDobErrorEx(
          t('An error occurred while validating. Please try again')
        );
      }

      console.error('Error validating DOB:', error);
      return false;
    }
  };

  // const validateAddress = async (selectedAddress, tokenPi) => {
  //   setLoading(true);
  //   try {
  //     // Perform the API call to validate the address
  //     const response = await axbe.post(
  //       `/patientValidation/address`,
  //       {
  //         address: selectedAddress.address,
  //         city: selectedAddress.city,
  //         state: selectedAddress.state,
  //         zip_code: selectedAddress.zipcode || selectedAddress.zip_code // Use proper key
  //       },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${tokenPi}` // Pass tokenPi in headers
  //         }
  //       }
  //     );

  //     // Return success if status is 200
  //     if (response.data.status === 200) {
  //       const {
  //         patient_personal_details,
  //         patient_primary_insurance,
  //         patient_emergency_contact_details,
  //         patient_referring_doctor,
  //         // middle_name,
  //         // last_name,
  //         // date_of_birth,
  //         // gender,
  //         preferred_language,
  //         // cell_phone,
  //         // email,
  //         // address,
  //         // city,
  //         // state,
  //         // zip_code,
  //         emergency_contact_name,
  //         emergency_contact_phone,
  //         emergency_contact_relation
  //       } = response?.data?.data || {}; // Add safety with `|| {}`

  //       // Split emergency contact name into first name and last name
  //       let emergencyFirstname =
  //         patient_emergency_contact_details.emergency_contact_name;
  //       let emergencyLastname = '';

  //       if (patient_emergency_contact_details.emergency_contact_name) {
  //         const nameParts = emergency_contact_name.split(' ');
  //         if (nameParts.length === 1) {
  //           // If only one word, it's the first name
  //           emergencyFirstname = nameParts[0];
  //         } else if (nameParts.length >= 2) {
  //           // If two or more words, treat first part as first name and last part as last name
  //           emergencyFirstname = nameParts[0];
  //           emergencyLastname = nameParts.slice(1).join(' '); // Combine all remaining parts as last name
  //         }
  //       }

  //       // Update state using setter functions
  //       setAddingData({
  //         firstName: patient_personal_details.first_name,
  //         middleName: patient_personal_details.middle_name,
  //         lastName: patient_personal_details.last_name,
  //         // selectedDate: date_of_birth,
  //         email: patient_personal_details.email,
  //         streetName: patient_personal_details.address,
  //         city: patient_personal_details.city,
  //         zipCode: patient_personal_details.zip_code,
  //         emergencyFirstname:
  //           patient_emergency_contact_details.emergencyFirstname, // Set emergency contact first name
  //         emergencyLastname:
  //           patient_emergency_contact_details.emergencyLastname, // Set emergency contact last name
  //         emergencyPhoneNo:
  //           patient_emergency_contact_details.emergency_contact_phone
  //         // relationship: emergency_contact_relation
  //       });

  //       setRelationship(
  //         patient_emergency_contact_details.emergency_contact_relation
  //       );
  //       setSelectedDate(patient_personal_details.date_of_birth);
  //       setGender(patient_personal_details.gender);
  //       setLanguage(preferred_language);
  //       setPhoneNumber(patient_personal_details.cell_phone);
  //       // const numericValue = patient_personal_details.cell_phone.replace(/\D/g, '');

  //       // let formattedPhoneNumber = numericValue;
  //       // if (numericValue.length > 3 && numericValue.length <= 6) {
  //       //   formattedPhoneNumber = `(${numericValue.slice(
  //       //     0,
  //       //     3
  //       //   )}) ${numericValue.slice(3)}`;
  //       // } else if (numericValue.length > 6) {
  //       //   formattedPhoneNumber = `(${numericValue.slice(
  //       //     0,
  //       //     3
  //       //   )}) ${numericValue.slice(3, 6)}-${numericValue.slice(6, 10)}`;
  //       // }

  //       // setPhoneNumber(formattedPhoneNumber);
  //       // validatePhoneNumber(numericValue);
  //       setStates(patient_personal_details.state);

  //       setStep(11); // Move to the correct step (update as necessary)
  //       setLoading(false);
  //     } else {
  //       setLoading(false);
  //       return { success: false, message: 'Address validation failed.' };
  //     }
  //   } catch (error) {
  //     setLoading(false);
  //     console.error('Error validating address:', error);
  //     return {
  //       success: false,
  //       message:
  //         error.response?.data?.detail ||
  //         'An error occurred during address validation.'
  //     };
  //   }
  // };

  const removeCountryCode = (phoneNumber) => {
    // Regex to match and remove country code (e.g., +1 or any other country code)
    const countryCodePattern = /^\+\d+\s/; // Matches the "+1 " or "+XX " part of the number
    return phoneNumber?.replace(countryCodePattern, '').trim();
  };

  const validateAddress = async (selectedAddress, tokenPi) => {
    setLoading(true);
    try {
      // Perform the API call to validate the address
      const response = await axbe.post(
        `/patientValidation/address`,
        {
          address: selectedAddress.address,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zip_code: selectedAddress.zipcode || selectedAddress.zip_code // Use proper key
        },
        {
          headers: {
            Authorization: `Bearer ${tokenPi}` // Pass tokenPi in headers
          }
        }
      );
      console.log('hello');

      // Return success if status is 200
      if (response.data.status === 200) {
        const {
          patient_personal_details,
          patient_emergency_contact_details,
          patient_primary_insurance,
          patient_referring_source,
          patient_referring_doctor,
          no_primary_care_physician
        } = response?.data?.data || {}; // Add safety with `|| {}`

        // // Split emergency contact name into first name and last name
        // let emergencyFirstname =
        //   patient_emergency_contact_details?.emergency_contact_name || '';
        // let emergencyLastname = '';

        // if (emergencyFirstname) {
        //   const nameParts = emergencyFirstname.split(' ');
        //   if (nameParts.length === 1) {
        //     emergencyFirstname = nameParts[0];
        //   } else if (nameParts.length >= 2) {
        //     emergencyFirstname = nameParts[0];
        //     emergencyLastname = nameParts.slice(1).join(' ');
        //   }
        // }

        const emergencyPhoneWithoutCountryCode = removeCountryCode(
          patient_emergency_contact_details?.emergency_contact_phone
        );

        const referralPhoneWithoutCountryCode = removeCountryCode(
          patient_referring_doctor?.phone
        );

        const referralFaxWithoutCountryCode = removeCountryCode(
          patient_referring_doctor?.fax
        );

        // Update state using setter functions
        setAddingData({
          firstName: patient_personal_details?.first_name || '',
          middleName: patient_personal_details?.middle_name || '',
          lastName: patient_personal_details?.last_name || '',
          email: patient_personal_details?.email || '',
          streetName: patient_personal_details?.address || '',
          city: patient_personal_details?.city || '',
          zipCode: patient_personal_details?.zip_code || '',
          emergencyFirstname:
            patient_emergency_contact_details?.emergency_contact_first_name, // Set emergency contact first name
          emergencyLastname:
            patient_emergency_contact_details?.emergency_contact_last_name, // Set emergency contact last name
          emergencyPhoneNo:
            // patient_emergency_contact_details?.emergency_contact_phone || '',
            emergencyPhoneWithoutCountryCode,
          groupNumber: patient_primary_insurance?.insurance_group_number || '',
          memberID: patient_primary_insurance?.insurance_id_number || '',

          insFirstName: patient_primary_insurance?.subscriber_first_name || '',
          insLastName: patient_primary_insurance?.subscriber_last_name || '',
          // dateOfBirth: patient_personal_details?.subscriber_date_of_birth || null,
          // relationshipIns: patient_emergency_contact_details?.patient_relationship_to_subscriber || '',
          OtherReferralName: patient_referring_source,
          PCPFirstname: patient_referring_doctor?.first_name || '',
          PCPLastname: patient_referring_doctor?.last_name || '',
          PCPPhoneNo: referralPhoneWithoutCountryCode || '',
          PCPFaxNo: referralFaxWithoutCountryCode || ''
        });

        // Update other fields
        setShowOnlyOtherName(no_primary_care_physician || false);
        setDateOfBirth(
          normalizeDate(patient_primary_insurance?.subscriber_date_of_birth) ||
            null
        );
        setRelationshipIns(
          patient_primary_insurance?.patient_relationship_to_subscriber || ''
        );
        setRelationship(
          patient_emergency_contact_details?.emergency_contact_relation || ''
        );
        setIsInsuredPerson(
          patient_primary_insurance?.is_subscriber_the_patient || false
        );
        setSelectedDate(
          normalizeDate(patient_personal_details?.date_of_birth) || null
        );
        setGender(patient_personal_details?.gender || '');
        setLanguage(patient_personal_details?.preferred_language || '');
        // setPhoneNumber(patient_personal_details?.cell_phone || '');
        const phoneWithoutCountryCode = removeCountryCode(
          patient_personal_details.cell_phone
        );
        setPhoneNumber(phoneWithoutCountryCode); // Set the phone number without the country code

        setStates(patient_personal_details?.state || '');
        // setCapturedFrontImage(patient_primary_insurance?.photo_front);
        // setCapturedBackImage(patient_primary_insurance?.photo_back);
        // Set step to move to the correct form step
        setStep(11);
        setLoading(false);
        return { success: true };
      } else {
        setLoading(false);
        return { success: false, message: 'Address validation failed.' };
      }
    } catch (error) {
      setLoading(false);
      console.error('Error validating address:', error);
      return {
        success: false,
        message:
          error.response?.data?.detail ||
          'An error occurred during address validation.'
      };
    }
  };

  useEffect(() => {
    setConfirmationChecked(false);
  }, [step]);

  const formatInsuredDate = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().slice(0, 10); // Formats as YYYY-MM-DD
  };

  // Usage
  const DOB = isInsuredPerson
    ? formatInsuredDate(selectedDate)
    : formatInsuredDate(dateOfBirth);

  const insuranceValidation = async () => {
    setLoading(true);

    try {
      const response = await axbe.post(
        `/eligibility-inquiry`,
        {
          FirstName: isInsuredPerson
            ? addingData.firstName
            : addingData.insFirstName,
          LastName: isInsuredPerson
            ? addingData.lastName
            : addingData.insLastName,
          InsuredID: addingData.memberID,
          // DOB: isInsuredPerson ? selectedDate : dateOfBirth,
          DOB: DOB,
          NPI: '',
          // PayerCode: selectedPayerCode,
          PayerCode: selectedPayerCode?.PayerCode,
          PayerName: payerNameQuery,
          is_subscriber_the_patient: isInsuredPerson ? true : false
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenPi}`
          }
        }
      );

      if (response.status === 200) {
        setStep(8); // Move to step 2
        setLoading(false);
        return true; // Proceed to the next step if valid
      }
    } catch (error) {
      setLoading(false);
      // Handle error responses
    }
  };

  // Function to validate step 4 fields
  const validateStep4Fields = () => {
    let hasError = false;

    // Check if each field is visible and not empty
    if (
      isFieldVisible('PersonalDetails', 'firstName') &&
      !addingData?.firstName
    ) {
      hasError = true;
    }
    if (
      isFieldVisible('PersonalDetails', 'lastName') &&
      !addingData?.lastName
    ) {
      hasError = true;
    }
    if (isFieldVisible('PersonalDetails', 'dob') && !selectedDate) {
      hasError = true;
    }
    if (isFieldVisible('PersonalDetails', 'email') && !addingData?.email) {
      hasError = true;
    }
    if (isFieldVisible('PersonalDetails', 'phoneNumber') && !phoneNumber) {
      hasError = true;
    }
    if (isFieldVisible('PersonalDetails', 'gender') && !gender) {
      hasError = true;
    }
    if (isFieldVisible('PersonalDetails', 'language') && !language) {
      hasError = true;
    }

    // Return error status
    return hasError;
  };
  const validateStep5Fields = () => {
    let hasError = false;

    // Check if each field is visible and not empty
    if (isFieldVisible('AddressDetails', 'street') && !addingData?.streetName) {
      hasError = true;
    }
    if (isFieldVisible('AddressDetails', 'city') && !addingData?.city) {
      hasError = true;
    }
    if (isFieldVisible('AddressDetails', 'state') && !states) {
      hasError = true;
    }
    if (isFieldVisible('AddressDetails', 'zipCode') && !addingData?.zipCode) {
      hasError = true;
    }

    // Return error status
    return hasError;
  };
  const validateStep7Fields = () => {
    let hasError = false;

    if (isInsuredPerson) {
      // Validate only the first three fields if the insured person
      if (
        isFieldVisible('InsuranceDetails', 'payerName') &&
        !selectedPayerCode
      ) {
        hasError = true;
      }

      if (
        isFieldVisible('InsuranceDetails', 'groupNumber') &&
        !addingData?.groupNumber
      ) {
        hasError = true;
      }

      if (
        isFieldVisible('InsuranceDetails', 'MemberId') &&
        !addingData?.memberID
      ) {
        hasError = true;
      }
    } else {
      // Validate all fields if not the insured person
      if (
        isFieldVisible('InsuranceDetails', 'payerName') &&
        !selectedPayerCode
      ) {
        hasError = true;
      }

      if (
        isFieldVisible('InsuranceDetails', 'groupNumber') &&
        !addingData?.groupNumber
      ) {
        hasError = true;
      }

      if (
        isFieldVisible('InsuranceDetails', 'MemberId') &&
        !addingData?.memberID
      ) {
        hasError = true;
      }

      if (
        isFieldVisible('InsuranceDetails', 'patientsubscriberFirstName') &&
        !addingData?.insFirstName
      ) {
        hasError = true;
      }

      if (
        isFieldVisible('InsuranceDetails', 'patientsubscriberLastName') &&
        !addingData?.insLastName
      ) {
        hasError = true;
      }

      if (
        isFieldVisible('InsuranceDetails', 'patientsubscriberDOB') &&
        !dateOfBirth
      ) {
        hasError = true;
      }

      if (
        isFieldVisible('InsuranceDetails', 'patientsubscriberRelationShip') &&
        !relationshipIns
      ) {
        hasError = true;
      }
    }

    // setValidationErrors(errors); // Ensure errors are set in the component's state
    // console.log('Validation Errors:', errors); // Log for debugging

    return hasError;
  };

  const validateStep8Fields = () => {
    let hasError = false;
    let errors = {};

    // Emergency First Name validation
    if (
      isFieldVisible('EmergencyDetails', 'emergencyContactFirstName') &&
      !addingData?.emergencyFirstname
    ) {
      hasError = true;
      errors.emergencyFirstname = 'First Name is required';
    }

    // Emergency Last Name validation
    if (
      isFieldVisible('EmergencyDetails', 'emergencyContactLastName') &&
      !addingData?.emergencyLastname
    ) {
      hasError = true;
      errors.emergencyLastname = 'Last Name is required';
    }

    // Emergency Phone Number validation
    if (
      isFieldVisible('EmergencyDetails', 'emergencyContactPhNum') &&
      !addingData?.emergencyPhoneNo
    ) {
      hasError = true;
      errors.emergencyPhoneNo = 'Contact Number is required';
    }

    // Relationship to Patient validation
    if (
      isFieldVisible(
        'EmergencyDetails',
        'emergencyContactRelationshipToPatient'
      ) &&
      !relationship
    ) {
      hasError = true;
      errors.relationship = 'Relationship to Patient is required';
    }

    // setValidationErrors(errors);
    return hasError;
  };

  const validateReferralDetails = () => {
    let hasError = false;
    let errors = {};

    if (showOnlyOtherName) {
      // Validation for "Other Referral Name" field when checkbox is checked
      if (
        isFieldVisible('PrimaryCarePhysician', 'ReferralName') &&
        !addingData?.OtherReferralName
      ) {
        hasError = true;
        errors.OtherReferralName = 'Other Referral Name is required';
      }
    } else {
      // Validation for Primary Care Physician details when checkbox is not checked
      if (
        isFieldVisible('PrimaryCarePhysician', 'PrimaryCareDoctorFirstName') &&
        !addingData?.PCPFirstname
      ) {
        hasError = true;
        errors.PCPFirstname = 'First Name is required';
      }

      if (
        isFieldVisible('PrimaryCarePhysician', 'PrimaryCareDoctorLastName') &&
        !addingData?.PCPLastname
      ) {
        hasError = true;
        errors.PCPLastname = 'Last Name is required';
      }

      if (
        isFieldVisible('PrimaryCarePhysician', 'PrimaryCarePhoneNumber') &&
        !addingData?.PCPPhoneNo
      ) {
        hasError = true;
        errors.PCPPhoneNo = 'Phone Number is required';
      }

      if (
        isFieldVisible('PrimaryCarePhysician', 'PrimaryCareFaxNumber') &&
        !addingData?.PCPFaxNo
      ) {
        hasError = true;
        errors.PCPFaxNo = 'Fax Number is required';
      }
    }

    setValidationErrors(errors);
    return hasError;
  };

  // Snackbar close handler
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };
  const handleSnackbarCloseSuccess = () => {
    setSnackbarOpenSuccess(false);
  };

  // const handleStep7Navigation = () => {
  //   const skipStep9 = shouldSkipStep('PrimaryCarePhysician'); // For Step 9
  //   const skipStep8 = shouldSkipStep('EmergencyDetails'); // For Step 8
  //   console.log(skipStep8,skipStep9);

  //   // Check if both Step 8 and Step 9 are hidden
  //   if (skipStep8 === true && skipStep9 === true) {
  //     setStep(10); // Both Step 8 and 9 are skipped, go directly to Step 10
  //   }
  //   // If Step 8 is visible and Step 9 is skipped, go to Step 8
  //   else if (skipStep8 === false && skipStep9 === true) {
  //     setStep(8); // Move to Step 8 first
  //   }
  //   // If Step 8 is skipped but Step 9 is visible, skip Step 8 and move to Step 9
  //   else if (skipStep8 === true && skipStep9 === false) {
  //     setStep(9); // Move to Step 9 directly
  //   }
  //   // If neither Step 8 nor Step 9 is skipped, move to Step 8
  //   else if (skipStep8 === false && skipStep9 === false) {
  //     setStep(8); // Proceed to Step 8 as both steps need to be shown
  //   }
  // };

  // const handleStep7Navigation = async () => {
  //   // Step 1: Validate Step 7 fields before calling the API or proceeding
  //   const hasError = validateStep7Fields(); // Check for validation errors

  //   if (hasError) {
  //     // If there are errors, display the snackbar message and do not proceed
  //     setSnackbarMessage(t('Please fill in all required fields'));
  //     setSnackbarOpen(true);
  //     return; // Stop further execution if there are errors
  //   }

  //   // Step 2: No errors, proceed with the insuranceValidation API call
  //   await insuranceValidation(); // Call the API to validate insurance (no need to check its result)

  //   // Step 3: Determine which steps to skip and navigate accordingly
  //   const skipStep8 = shouldSkipStep('EmergencyDetails');
  //   const skipStep9 = shouldSkipStep('PrimaryCarePhysician');

  //   // Step 4: Handle navigation based on visibility of steps
  //   if (skipStep8 && skipStep9) {
  //     setStep(10); // Skip both Step 8 and Step 9, go to Step 10
  //   } else if (!skipStep8) {
  //     setStep(8); // Proceed to Step 8 if it's not skipped
  //     console.log(skipStep8, 'skipStep8');
  //   } else if (!skipStep9) {
  //     setStep(9); // Proceed to Step 9 if Step 8 is skipped but Step 9 is not skipped
  //     console.log(skipStep9, 'skipStep9');
  //   }
  // };

  // const handleStep7Navigation = async () => {
  //   const hasError = validateStep7Fields(); // Validate Step 7

  //   if (hasError) {
  //     setSnackbarMessage(t('Please fill in all required fields'));
  //     setSnackbarOpen(true);
  //     return;
  //   }

  //   await insuranceValidation(); // API call to validate insurance

  //   const skipStep8 = shouldSkipStep('EmergencyDetails');
  //   const skipStep9 = shouldSkipStep('PrimaryCarePhysician');

  //   if (skipStep8 && skipStep9) {
  //     setStep(10); // If both steps are skipped, go to Step 10
  //   } else if (skipStep8) {
  //     setStep(9); // Go to Step 8 if it's not skipped
  //   } else if (skipStep9) {
  //     setStep(10); // Go to Step 9 if it's not skipped
  //   } else {
  //     setStep(10); // If Step 9 is skipped, go to Step 10
  //   }
  // };

  // Call this function in Step 7
  console.log(validationErrors, 'errors');

  const handleStep7Navigation = () => {
    const skipStep9 = shouldSkipStep('PrimaryCarePhysician'); // For Step 9
    const skipStep8 = shouldSkipStep('EmergencyDetails'); // For Step 8

    console.log('skipStep8:', skipStep8, 'skipStep9:', skipStep9); // Debugging log

    // Logic to skip steps or move to the next one
    if (skipStep8 && skipStep9) {
      setStep(10); // Both Step 8 and 9 are skipped, go directly to Step 10
      return;
    } else if (!skipStep8 && skipStep9) {
      setStep(8); // Step 8 is visible, move to Step 8 first
      return;
    } else if (skipStep8 && !skipStep9) {
      setStep(9); // Step 9 is visible, move to Step 9 first
      return;
    } else {
      setStep(8); // Both steps are visible, move to Step 8
      return;
    }
  };
  const handleStep8Navigation = () => {
    const skipStep9 = shouldSkipStep('PrimaryCarePhysician'); // For Step 9
    const skipStep8 = shouldSkipStep('EmergencyDetails'); // For Step 8

    console.log('skipStep8:', skipStep8, 'skipStep9:', skipStep9); // Debugging log

    // Logic to skip steps or move to the next one
    if (skipStep9) {
      setStep(10); // Step 8 is visible, move to Step 8 first
      return;
    } else {
      setStep(9); // Both steps are visible, move to Step 8
      return;
    }
  };

  const handleNext = async () => {
    // Check for validation errors
    if (
      Object.values(validationErrors).some((error) => error) &&
      errorStep === step
    ) {
      setSnackbarMessage(t('Please correct the errors before proceeding'));
      setSnackbarOpen(true);
      return; // Stop progression if there are validation errors
    }

    if (step >= 4 && step <= 9 && !confirmationChecked) {
      // if ( ) {
      setSnackbarMessage(t('Please confirm the details are correct'));
      setSnackbarOpen(true);
      return; // Stop further execution
      // } else {
      //   setConfirmationChecked(false); // Reset checkbox
      //   setStep((prevStep) => prevStep + 1);
      //   return;
      // }
    }
    if (step === 7 && shouldReturnToStep11) {
      // Validate step 7 fields before progressing
      const hasError = validateStep7Fields();

      if (hasError) {
        setSnackbarMessage(t('Please fill in all required fields')); // Show error message
        setSnackbarOpen(true); // Open the Snackbar
        return; // Stop progression if there are validation errors
      }

      // If no errors, proceed to step 11
      setShouldReturnToStep11(false); // Reset the flag
      setStep(11);
      return;
    }

    // if (isNewPatient && step === 7) {
    //   handleStep7Navigation();
    // }
    // Handle validation for Step 7 (Insurance Details)
    // if (step === 7) {
    //   const hasError = validateStep7Fields(); // Check for validation errors

    //   if (hasError) {
    //     // If there are errors, display the snackbar message and do not proceed
    //     setSnackbarMessage(t('Please fill in all required fields'));
    //     setSnackbarOpen(true);
    //     return; // Stop here, don't go to the next step
    //   }
    // }

    if (step === 7) {
      const hasError = validateStep7Fields();
      console.log('step 7 ');

      if (hasError) {
        setSnackbarMessage(t('Please fill in all required fields'));
        setSnackbarOpen(true);
        return;
      } else {
        console.log('inside console');

        // Always call handleStep7Navigation after validation passes
        handleStep7Navigation();
        return;
      }
    }
    // Dynamic check for skipping steps based on visibility

    const skipStep9 = shouldSkipStep('PrimaryCarePhysician');
    const skipStep8 = shouldSkipStep('EmergencyDetails');
    const skipStep7 = shouldSkipStep('InsuranceDetails');
    const skipStep6 = shouldSkipStep('AddressDetails');

    // // Handle step navigation based on current step and skipping logic
    // if (isNewPatient && step === 8 && skipStep9) {
    //   setStep(10); // Skip Step 9 if all fields are hidden
    //   // return;
    // }

    // if (isNewPatient && step === 7 && skipStep8) {
    //   setStep(9); // Skip Step 8 if all fields are hidden
    //   // return;
    // }

    // if (isNewPatient && step === 6 && skipStep7) {
    //   setStep(8);  // Skip Step 7 if all fields are hidden
    //   // return;
    // }

    // if (isNewPatient && step === 5 && skipStep6) {
    //   setStep(7);  // Skip Step 6 if all fields are hidden
    //   return;
    // }

    if (step === 10) {
      // Check if all agreements are signed
      const allAgreementsChecked =
        Object.values(agreementStates).every(Boolean);

      if (!allAgreementsChecked || !isAgreementAccepted) {
        setAgreementErrors({
          general: 'Please agree to all agreements before proceeding.'
        });
        setSnackbarMessage(
          t('Please agree to all agreements before proceeding')
        );
        setSnackbarOpen(true);
        return; // Stop progression if agreements are not signed
      }
      if (sigPad.current.isEmpty()) {
        setSnackbarMessage(t('Signature cannot be empty'));
        setSnackbarOpen(true);
        return; // Stop progression if signature pad is empty
      }
      // Check if the signature pad has been confirmed
      if (!isSignatureConfirmed) {
        setSnackbarMessage(t('Please confirm the signature before proceeding'));
        setSnackbarOpen(true);
        return; // Stop progression if the signature is not confirmed
      }
    }

    // Handle validation for Step 8 (Emergency Details)
    if (step === 8) {
      const hasError = validateStep8Fields();
      if (hasError) {
        setSnackbarMessage(t('Please fill in all required fields'));
        setSnackbarOpen(true);
        return;
      } else {
        handleStep8Navigation();
        return;
      }

      // // After validating Step 8, check the hideStep9 state
      // if (hideStep9) {
      //   // If hideStep9 is true, skip to Step 10
      //   setStep(10);
      // } else {
      //   // If hideStep9 is false, move to Step 9
      //   setStep(9);
      // }
      // return; // Stop further execution since we are navigating to a new step
    }
    // console.log(hideStep9, 'hideStep9');

    // Handle validation for Step 9 (Referral Details)
    if (step === 9) {
      const hasError = validateReferralDetails();
      if (hasError) {
        setSnackbarMessage(t('Please fill in all required fields'));
        setSnackbarOpen(true);
        return;
      }
    }

    // Step 6 Validation (Capture Insurance ID)
    if (step === 6) {
      // Check if front and back images are captured
      if (!capturedFrontImage || !capturedBackImage) {
        setSnackbarMessage(
          t(
            'Please capture both the front and back images of your insurance card'
          )
        );
        setSnackbarOpen(true);
        return; // Prevent progressing to the next step
      }

      if (!disableRetakeFront || !disableRetakeBack) {
        setSnackbarMessage(t('Please confirm both the front and back images'));
        setSnackbarOpen(true);
        return;
      }
    }
    // Handle validation for Step 5
    if (step === 5) {
      const hasError = validateStep5Fields();
      if (hasError) {
        setSnackbarMessage(t('Please fill in all required fields'));
        setSnackbarOpen(true);
        return;
      }
    }

    // Handle step 4 validation
    if (step === 4) {
      // Validate personal details specific to step 4
      const hasError = validateStep4Fields(); // Ensure this function validates all required fields
      if (hasError) {
        setSnackbarMessage(t('Please fill in all required fields'));
        setSnackbarOpen(true); // Open the Snackbar with an error message
        return; // Stop progressing to the next step
      }

      // Check phone number validation
      if (!isPhoneValid) {
        setPhoneError(t('Please enter a valid 10-digit phone number'));
        // setSnackbarMessage(
        //   t('Please correct the phone number before proceeding.')
        // );
        // setSnackbarOpen(true);
        return; // Stop progression if phone number is invalid
      } else {
        setPhoneError(''); // Clear phone error if valid
      }
    }

    // Handle step 10 case specifically to generate PDF
    //    if (step === 10) {
    //   handleConfirm();

    //   if (areAllAgreementsSigned && sigPad.current) {
    //     let pdfUrls = [];
    //     let titles = [];

    //     agreements.forEach((agreement) => {
    //       const pdf = new jsPDF('p', 'mm', 'a4');
    //       const { firstName, lastName } = addingData;
    //       const userName = `${firstName} ${lastName}`;
    //       const userDOB = dayjs(selectedDate).format('MM-DD-YYYY');
    //       const signatureDataUrl = sigPad.current.toDataURL();

    //       let currentY = 30;
    //       const pageWidth = pdf.internal.pageSize.width;

    //       // Add agreement title at the top, centered
    //       pdf.setFontSize(16);
    //       pdf.setFont('helvetica', 'bold');
    //       pdf.setTextColor(0, 102, 204); // Set title color
    //       pdf.text(agreement.title, pageWidth / 2, currentY, {
    //         align: 'center'
    //       });
    //       titles.push(agreement.title); // Store the title
    //       currentY += 15; // Move down after the title

    //       // Add user name (left) and date (right) below the title
    //       pdf.setFontSize(12);
    //       pdf.setFont('helvetica', 'normal');
    //       pdf.setTextColor(0, 0, 0); // Reset text color to black
    //       pdf.text(`Name: ${userName}`, 10, currentY); // Left-aligned name
    //       pdf.text(`DOB: ${userDOB}`, pageWidth - 50, currentY); // Right-aligned date
    //       currentY += 10; // Move down for the agreement content

    //       // Process the body of the agreement and get updated Y-position
    //       currentY = processHtmlForPdf(agreement.body, pdf, currentY);

    //       // Add signature if it exists
    //       if (signatureDataUrl) {
    //         // Check if there's enough space for the signature image
    //         if (currentY > pdf.internal.pageSize.height - 50) {
    //           pdf.addPage();
    //           currentY = 20;
    //           addCustomPageNumber(pdf);
    //         }

    //         // Add signature image first, before the title
    //         pdf.addImage(signatureDataUrl, 'PNG', 10, currentY + 10, 50, 30); // Add signature image
    //         currentY += 40; // Move down after the signature image

    //         // Add signature title below the image
    //         pdf.setFont('helvetica', 'bold');
    //         pdf.text('Signature:', 10, currentY);
    //       }

    //       // Generate PDF Blob and URL
    //       const pdfBlob = pdf.output('blob');
    //       const pdfUrl = URL.createObjectURL(pdfBlob);

    //       pdfUrls.push(pdfUrl); // Store PDF URL
    //     });

    //     setGeneratedPdfUrls(pdfUrls); // Update state with all PDF URLs
    //     setAttachmentTitles(titles); // Update state with all titles
    //   } else {
    //     console.error('All agreements must be signed');
    //   }
    // }

    if (step === 10) {
      handleConfirm();

      if (areAllAgreementsSigned && sigPad.current) {
        let pdfUrls = [];
        let titles = [];

        agreements.forEach((agreement) => {
          const pdf = new jsPDF('p', 'mm', 'a4');
          const { firstName, lastName } = addingData;
          const userName = `${firstName} ${lastName}`;
          const userDOB = dayjs(selectedDate).format('MM-DD-YYYY');
          const signatureDataUrl = sigPad.current.toDataURL();

          let currentY = 30;
          const pageWidth = pdf.internal.pageSize.width;

          // Add agreement title at the top, centered
          pdf.setFontSize(16);
          pdf.setFont('helvetica', 'bold');
          pdf.setTextColor(0, 102, 204); // Set title color
          pdf.text(agreement.title, pageWidth / 2, currentY, {
            align: 'center'
          });
          titles.push(agreement.title); // Store the title
          currentY += 15; // Move down after the title

          // Add user name (left) and date (right) below the title
          pdf.setFontSize(12);
          pdf.setFont('helvetica', 'normal');
          pdf.setTextColor(0, 0, 0); // Reset text color to black
          pdf.text(`Name: ${userName}`, 10, currentY); // Left-aligned name
          pdf.text(`DOB: ${userDOB}`, pageWidth - 50, currentY); // Right-aligned date
          currentY += 10; // Move down for the agreement content

          // Process the body of the agreement and get updated Y-position
          currentY = processHtmlForPdf(agreement.body, pdf, currentY);

          // Add signature if it exists
          if (signatureDataUrl) {
            // Check if there's enough space for the signature image
            if (currentY > pdf.internal.pageSize.height - 50) {
              pdf.addPage();
              currentY = 20;
              addCustomPageNumber(pdf);
            }

            // Add space before signature image
            // const signaturePaddingTop = 5;
            const signaturePaddingBottom = 2;
            // currentY += signaturePaddingTop; // Add padding above the signature image

            // Add signature image
            pdf.addImage(signatureDataUrl, 'PNG', 10, currentY + 10, 50, 30); // Add signature image
            currentY += 40; // Move down after the signature image (with image height and padding)

            // Add signature title below the image with padding
            pdf.setFont('helvetica', 'bold');
            pdf.text('Signature:', 10, currentY + signaturePaddingBottom); // Add space below the title
            currentY += 10; // Move down after the title
          }

          // Generate PDF Blob and URL
          const pdfBlob = pdf.output('blob');
          const pdfUrl = URL.createObjectURL(pdfBlob);

          pdfUrls.push(pdfUrl); // Store PDF URL
        });

        setGeneratedPdfUrls(pdfUrls); // Update state with all PDF URLs
        setAttachmentTitles(titles); // Update state with all titles
      } else {
        console.error('All agreements must be signed');
      }
    }

    // Step 1: Handle DOB validation (for existing patients)
    if (!isNewPatient && step === 1) {
      if (!selectedDateEx) {
        // setDobErrorEx('Please select a valid Date of Birth');
        setSnackbarMessage(t('Please select a valid Date of Birth'));
        setSnackbarOpen(true);
        return;
      }

      const isDOBValid = await validateDOB(); // Call the DOB validation API

      if (isDOBValid) {
        setStep(2); // Move to the next step if DOB is valid
      } else {
        setSnackbarMessage(
          t('The Provided DOB does not match the Patient record')
        );
        setSnackbarOpen(true);
      }
      return; // Stop execution to wait for validation
    }

    // Step 2: Handle address validation (for existing patients)
    if (!isNewPatient && step === 2) {
      if (!selectedAddress) {
        setAddressError(t('Please select an address'));
        setSnackbarMessage(t('Please choose an address'));
        setSnackbarOpen(true);
        return;
      }

      // Ensure the address is passed to the validation function
      const isAddressValid = await validateAddress(selectedAddress, tokenPi); // Pass selectedAddress here
      console.log('isAddressValid:', isAddressValid);

      if (isAddressValid.success) {
        setStep(11); // Proceed to step 10 if the address is valid
      } else {
        setAddressError(isAddressValid.message); // Display error message if validation fails
        setSnackbarMessage(
          t('The provided address does not match the Patient record')
        );
        setSnackbarOpen(true);
      }
      return; // Stop execution to wait for validation
    }

    // New logic when `isUnder16` is true
    if (isUnder16 && step === 3) {
      if (!confirmationChecked) {
        // Show snackbar if confirmation checkbox is not checked
        setSnackbarMessage(t('Please confirm the details are correct'));
        setSnackbarOpen(true);
        return; // Stop further execution
      }

      // else {
      //   // Allow moving to the next step
      //   setStep((prevStep) => prevStep + 1);
      //   return;
      // }
    }

    // Logic when `isUnder16` is false (image capture required)
    if (!isUnder16 && step === 3) {
      if (!capturedImage) {
        // Show snackbar if the image is not captured
        setSnackbarMessage(t('Please Capture the image'));
        setSnackbarOpen(true);
        return; // Stop further execution
      }
      if (!isConfirmed) {
        setSnackbarMessage(t('Please Confirm the captured image'));
        setSnackbarOpen(true);
        return; // Stop further execution
      }
      if (!confirmationChecked) {
        // Show snackbar if confirmation checkbox is not checked
        setSnackbarMessage(t('Please confirm the details are correct'));
        setSnackbarOpen(true);
        return; // Stop further execution
      }

      if (capturedImage && confirmationChecked) {
        const isUploaded = await uploadImage(capturedImage); // Call the API to upload the image
        console.log(capturedImage, 'capturedImage');

        if (isUploaded) {
          // If image uploaded successfully, move to the next step
          console.log('Proceeding to the next step');
          // setStep(4);
          // Add logic to move to the next step here
          // Example: setStep((prevStep) => prevStep + 1);
        } else {
          // setStep(4);
          // Show snackbar if image upload fails
          console.log('Image upload failed');
        }
      }
    }

    // Logic for step 4 (Personal Details)

    // Navigate from Step 4 to Step 11 if changes are made
    if (step === 4 && shouldReturnToStep11) {
      setShouldReturnToStep11(false); // Reset the flag
      setStep(11);
      return;
    }

    // Navigate from Step 5 to Step 11 if changes are made
    if (step === 5 && shouldReturnToStep11) {
      setShouldReturnToStep11(false); // Reset the flag
      setStep(11);
      return;
    }
    // Navigate from Step 7 to Step 11 if changes are made

    // if (step === 7 && skip) {
    //   setSkip(false); // Reset the flag
    //   setStep(9);
    //   return;
    // }
    // Navigate from Step 8 to Step 11 if changes are made
    if (step === 8 && shouldReturnToStep11) {
      setShouldReturnToStep11(false); // Reset the flag
      setStep(11);
      return;
    }
    // if (step === 8 && skip) {
    //   setSkip(false); // Reset the flag
    //   setStep(10);
    //   return;
    // }
    // if (step === 9 && hideStep9) {
    //   setStep(10);
    //   return;
    // }
    // Navigate from Step 4 to Step 11 if changes are made
    if (step === 9 && shouldReturnToStep11) {
      setShouldReturnToStep11(false); // Reset the flag
      setStep(11);
      return;
    }

    // Navigate from Step 4 to Step 11 if changes are made
    if (step === 10 && shouldReturnToStep11) {
      setShouldReturnToStep11(false); // Reset the flag
      setStep(11);
      return;
    }
    // Default step increment

    setStep((prevStep) => prevStep + 1);
    setConfirmationChecked(false); // Reset checkbox for all steps
  };

  // const handleStep10Navigation = () => {
  //   const skipStep9 = shouldSkipStep('PrimaryCarePhysician'); // For Step 9
  //   const skipStep8 = shouldSkipStep('EmergencyDetails'); // For Step 8

  //   // If both Step 9 and Step 8 are hidden, go directly to Step 7
  //   if (skipStep9 && skipStep8) {
  //     setStep(7); // Skip both steps and go directly to Step 7
  //     return;
  //   }

  //   // If Step 9 is visible but Step 8 is skipped, go to Step 9 first
  //   if (!skipStep9 && skipStep8) {
  //     setStep(9); // Move to Step 9 and then handle it further
  //     return;
  //   }

  //   // If Step 9 is skipped but Step 8 is visible, go to Step 8 directly
  //   if (skipStep9 && !skipStep8) {
  //     setStep(8); // Move to Step 8 directly
  //     return;
  //   }

  //   // If neither Step 9 nor Step 8 is skipped, move to Step 9 first
  //   if (!skipStep9 && !skipStep8) {
  //     setStep(9); // Proceed to Step 9
  //   }
  // };

  const handleStep10Navigation = () => {
    const skipStep9 = shouldSkipStep('PrimaryCarePhysician'); // For Step 9
    const skipStep8 = shouldSkipStep('EmergencyDetails'); // For Step 8

    // If both Step 9 and Step 8 are hidden, go directly to Step 7
    if (skipStep9 && skipStep8) {
      setStep(7); // Skip both steps and go directly to Step 7
    } else if (!skipStep8 && skipStep9) {
      setStep(8); // Step 8 is visible, move to Step 8 first
      return;
    } else if (skipStep8 && !skipStep9) {
      setStep(9); // Step 9 is visible, move to Step 9 first
      return;
    } else {
      setStep(9); // Both steps are visible, move to Step 8
      return;
    }
  };

  const handleStep9Navigation = () => {
    const skipStep9 = shouldSkipStep('PrimaryCarePhysician'); // For Step 9
    const skipStep8 = shouldSkipStep('EmergencyDetails'); // For Step 8

    console.log('skipStep8:', skipStep8, 'skipStep9:', skipStep9); // Debugging log

    // Logic to skip steps or move to the next one
    if (skipStep8) {
      setStep(7); // Step 8 is visible, move to Step 8 first
      return;
    } else {
      setStep(8); // Both steps are visible, move to Step 8
      return;
    }
  };

  const handleBack = () => {
    // Check for validation errors in the current step
    // if (Object.values(validationErrors).some((error) => error !== '')) {
    //   // Display an error message in a snackbar or alert
    //   setSnackbarMessage(t('Please correct the errors before going back'));
    //   setSnackbarOpen(true);
    //   return; // Stop progression if there are validation errors
    // }

    // Additional validation for phone number (or add it to validationErrors for consistency)
    // if (!isPhoneValid) {
    //   // Update validation state and show an error message
    //   setPhoneError(t('Please enter a valid 10-digit phone number'));
    //   setSnackbarMessage(
    //     t('Please correct the phone number before proceeding')
    //   );
    //   setSnackbarOpen(true);
    //   return; // Stop progression if phone number is invalid
    // }

    // Clear phone error if the number is valid
    setPhoneError('');
    // Call this function when navigating back from Step 10
    if (isNewPatient && step === 10) {
      handleStep10Navigation();
      return;
    }
    if (isNewPatient && step === 9) {
      handleStep9Navigation();
      return;
    }
    // Dynamic check for skipping steps based on visibility
    const skipStep9 = shouldSkipStep('PrimaryCarePhysician');
    const skipStep8 = shouldSkipStep('EmergencyDetails');
    const skipStep7 = shouldSkipStep('InsuranceDetails');
    const skipStep6 = shouldSkipStep('AddressDetails');

    // // Handle back navigation based on the current step and skipping logic
    // if (step === 10 && skipStep9) {
    //   setStep(8); // Skip Step 9 if all fields are hidden
    //   return;
    // }

    // if (step === 9 && skipStep8) {
    //   setStep(7); // Skip Step 8 if all fields are hidden
    //   return;
    // }

    // if (step === 8 && skipStep7) {
    //   setStep(6); // Skip Step 7 if all fields are hidden
    //   return;
    // }

    // if (step === 7 && skipStep6) {
    //   setStep(5); // Skip Step 6 if all fields are hidden
    //   return;
    // }
    // Additional handling for going back to specific steps (e.g., Step 2 for existing patients)
    if (!isNewPatient && step === 10) {
      setStep(2); // Example logic to navigate to step 2
    } else {
      // Default behavior: go back to the previous step
      setStep((prevStep) => prevStep - 1);
    }
  };

  const steps = ['1', '2', '3', '4', '5', '6', '7'];

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value); // Update the selected address
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const webcamRef = useRef(null);
  // Separate refs for front and back webcams
  const webcamFrontRef = useRef(null);
  const webcamBackRef = useRef(null);

  // Toggle frame size between landscape and portrait
  const toggleFrameSize = () => {
    setUseLandscape(!useLandscape);
  };

  // const processHtmlForPdf = (html, pdf, startY) => {
  //   const tempDiv = document.createElement('div');
  //   tempDiv.innerHTML = html;

  //   let currentY = startY;

  //   const traverseNodes = (node) => {
  //     if (currentY > 270) {
  //       // Adjust for page height
  //       pdf.addPage();
  //       currentY = 20;
  //     }

  //     const text = node.textContent.trim();
  //     if (!text) return;

  //     switch (node.nodeName.toLowerCase()) {
  //       case 'h1':
  //         pdf.setFontSize(20);
  //         pdf.setFont('helvetica', 'bold');
  //         currentY += 12;
  //         pdf.text(text, 10, currentY);
  //         currentY += 20;
  //         break;
  //       case 'h2':
  //         pdf.setFontSize(16);
  //         pdf.setFont('helvetica', 'bold');
  //         currentY += 10;
  //         pdf.text(text, 10, currentY);
  //         currentY += 15;
  //         break;
  //       case 'p':
  //         pdf.setFontSize(12);
  //         pdf.setFont('helvetica', 'normal');
  //         const lines = pdf.splitTextToSize(text, 180);
  //         lines.forEach((line) => {
  //           pdf.text(line, 10, currentY);
  //           currentY += 7;
  //         });
  //         currentY += 10;
  //         break;
  //       case 'li':
  //         pdf.setFontSize(12);
  //         pdf.setFont('helvetica', 'normal');
  //         pdf.text(`• ${text}`, 15, currentY); // Indent list items for better formatting
  //         currentY += 7;
  //         break;
  //       case 'a':
  //         if (node.href) {
  //           pdf.setTextColor(0, 0, 255);
  //           pdf.textWithLink(text, 10, currentY, { url: node.href });
  //           pdf.setTextColor(0, 0, 0); // Reset to black after link
  //         }
  //         currentY += 7;
  //         break;
  //       default:
  //         if (node.childNodes) {
  //           node.childNodes.forEach(traverseNodes);
  //         }
  //         break;
  //     }
  //   };

  //   tempDiv.childNodes.forEach(traverseNodes);
  //   return currentY;
  // };

  const processHtmlForPdf = (html, pdf, startY) => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    let currentY = startY;
    const pageHeight = pdf.internal.pageSize.height;
    const pageWidth = pdf.internal.pageSize.width;
    const marginLeft = 15;
    const marginRight = pageWidth - 15;
    let listCounter = 1; // For numbered lists

    const traverseNodes = (node) => {
      const text = node.textContent.trim();
      if (!text) return;

      switch (node.nodeName.toLowerCase()) {
        case 'h1':
          pdf.setFontSize(18);
          pdf.setFont('helvetica', 'bold');
          currentY += 10;
          break;

        case 'p':
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          const lines = pdf.splitTextToSize(text, marginRight - marginLeft);
          lines.forEach((line) => {
            if (currentY > pageHeight - 30) {
              pdf.addPage();
              currentY = 20;
              addCustomPageNumber(pdf);
            }
            pdf.text(line, marginLeft, currentY);
            currentY += 7;
          });
          currentY += 5;
          break;

        case 'ul': // Unordered list
          node.childNodes.forEach((liNode) => {
            const liText = liNode.textContent.trim();
            if (liText) {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              const bulletText = ` • ${liText}`; // Add bullet character
              const lines = pdf.splitTextToSize(
                bulletText,
                marginRight - marginLeft
              );
              lines.forEach((line) => {
                if (currentY > pageHeight - 30) {
                  pdf.addPage();
                  currentY = 20;
                  addCustomPageNumber(pdf);
                }
                pdf.text(line, marginLeft, currentY);
                currentY += 7;
              });
            }
          });
          currentY += 5;
          break;
        case 'ol': // Ordered list
          listCounter = 1; // Reset list counter
          node.childNodes.forEach((liNode) => {
            const liText = liNode.textContent.trim();
            if (liText) {
              pdf.setFontSize(10);
              pdf.setFont('helvetica', 'normal');
              const numberedText = `${listCounter}. ${liText}`; // Add list number
              const lines = pdf.splitTextToSize(
                numberedText,
                marginRight - marginLeft
              );
              lines.forEach((line) => {
                if (currentY > pageHeight - 30) {
                  pdf.addPage();
                  currentY = 20;
                  addCustomPageNumber(pdf);
                }
                pdf.text(line, marginLeft, currentY);
                currentY += 7;
              });
              listCounter++; // Increment list counter
            }
          });
          currentY += 5;
          break;

        case 'a': // Links
          const linkText = node.textContent.trim();
          const linkHref = node.getAttribute('href');
          if (linkText && linkHref) {
            pdf.setFontSize(10);
            pdf.setTextColor(0, 0, 255); // Set link color to blue
            pdf.setFont('helvetica', 'normal');
            pdf.textWithLink(linkText, marginLeft, currentY, { url: linkHref });
            currentY += 7;
          }
          pdf.setTextColor(0, 0, 0); // Reset color to black
          currentY += 5;
          break;

        case 'u': // Underlined text
          const underlineText = node.textContent.trim();
          if (underlineText) {
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'normal');
            const underlineLines = pdf.splitTextToSize(
              underlineText,
              marginRight - marginLeft
            );
            pdf.text(underlineLines.join(' '), marginLeft, currentY);
            pdf.line(
              marginLeft,
              currentY + 1,
              marginLeft + pdf.getTextWidth(underlineLines.join(' ')),
              currentY + 1
            ); // Draw underline
            currentY += 7;
          }
          currentY += 5;
          break;

        default:
          pdf.setFontSize(10);
          pdf.setFont('helvetica', 'normal');
          const defaultLines = pdf.splitTextToSize(
            text,
            marginRight - marginLeft
          );
          defaultLines.forEach((line) => {
            if (currentY > pageHeight - 30) {
              pdf.addPage();
              currentY = 20;
              addCustomPageNumber(pdf);
            }
            pdf.text(line, marginLeft, currentY);
            currentY += 7;
          });
          currentY += 5;
          break;
      }
    };

    tempDiv.childNodes.forEach(traverseNodes);
    return currentY;
  };

  const addCustomPageNumber = (pdf) => {
    const pageCount = pdf.internal.getNumberOfPages();
    const pageWidth = pdf.internal.pageSize.width;
    pdf.setFontSize(10);
    pdf.text(`${pageCount}`, pageWidth / 2, pdf.internal.pageSize.height - 10, {
      align: 'center'
    });
  };
  const handleCaptureClick = () => {
    if (capturing) {
      captureImage();
      setCapturing(false); // Set capturing to false after taking the photo
    } else {
      setCapturing(true); // Set capturing to true to start the capture process
    }
  };

  // ! old constraints video
  // const videoConstraints = {
  //   facingMode: 'environment',
  //   width: 190,
  //   height: 300
  // };

  // ? change width and height of this for reducing quality or increasing quality
  const [videoConstraints, setVideoConstraints] = useState({
    facingMode: 'environment',
    width: 1080,
    height: 1080
  });

  const isMobileScreen = window.innerWidth <= 768; // Mobile breakpoint

  // const getVideoConstraints = () => {
  //   return isMobileScreen
  //     ? { facingMode: 'environment', width: 190, height: 300 }
  //     : { facingMode: 'environment', width: 300, height: 190 };
  // };
  // useEffect(() => {
  //   const handleResize = () => {
  //     setVideoConstraints(getVideoConstraints());
  //   };

  //   // Initial setting of video constraints
  //   handleResize();

  //   // Add event listener to track window resize
  //   window.addEventListener('resize', handleResize);

  //   // Clean up the event listener on component unmount
  //   return () => {
  //     window.removeEventListener('resize', handleResize);
  //   };
  // }, [window.innerWidth]);

  // const isMobileScreen = window.innerWidth <= 768; // Check if screen width is 768px or less (commonly mobile breakpoint)

  // const videoConstraints = isMobileScreen
  //   ? { facingMode: 'environment', width: 190, height: 300 } // Mobile screen resolution
  //   : { facingMode: 'environment', width: 300, height: 190 }; // Non-mobile resolution

  console.log(videoConstraints, 'videoConstraints');

  // ! old open camera
  // const openCamera = () => {

  //   setIsCameraOpen(true); // Open the camera
  //   setCapturedImage(null); // Clear any captured image
  //   setIsConfirmed(false); // Reset confirmation
  // };
  // ! old open camera

  const openCamera = async () => {
    try {
      // Check camera permission status
      const permissionStatus = await navigator.permissions.query({
        name: 'camera'
      });

      if (permissionStatus.state === 'granted') {
        // If permission is already granted, open the camera
        setIsCameraOpen(true); // Open the camera
        setCapturedImage(null); // Clear any captured image
        setIsConfirmed(false); // Reset confirmation
      } else if (permissionStatus.state === 'prompt') {
        // If the state is 'prompt', attempt to get permission and access the camera
        navigator.mediaDevices
          .getUserMedia({ video: { facingMode: 'environment' } })
          .then((stream) => {
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }

            // If the user grants permission, set the states
            setIsCameraOpen(true); // Open the camera
            setCapturedImage(null); // Clear any captured image
            setIsConfirmed(false); // Reset confirmation
          })
          .catch((err) => {
            console.error('Error accessing webcam:', err);
            alert(
              'Unable to access the camera. Please check permissions and try again.'
            );
          });
      } else if (permissionStatus.state === 'denied') {
        // If the permission was denied, inform the user
        alert(
          'Camera access was denied. Please enable it in your browser settings.'
        );
      }

      // Listen for changes to the permission state (optional)
      permissionStatus.onchange = () => {
        console.log('Camera permission changed to:', permissionStatus.state);
      };
    } catch (error) {
      console.error('Error checking camera permission:', error);
      alert('An error occurred while checking camera permissions.');
    }
  };

  // const captureImage = () => {
  //   const imageSrc = webcamRef.current.getScreenshot({
  //     width: 300, // Match the container width
  //     height: 190 // Match the container height
  //   });
  //   setCapturedImage(imageSrc);
  //   setIsCameraOpen(false);
  // };
  // Capture the image

  // const captureImage = () => {
  //   if (webcamRef.current) {
  //     const imageSrc = webcamRef.current.getScreenshot({
  //       width: 1080,
  //       height: 1080
  //     });

  //     if (imageSrc) {
  //       // Resize image to 300x190 before sending
  //       resizeImage(imageSrc, 300, 190).then((resizedBase64) => {
  //         const imageBlobForAPI = base64ToBlob(resizedBase64);

  //         new Compressor(imageBlobForAPI, {
  //           quality: 0.9, // Adjust quality as needed
  //           success(result) {
  //             const reader = new FileReader();
  //             reader.readAsDataURL(result);
  //             reader.onloadend = () => {
  //               setCapturedImageForAPI(reader.result); // Set compressed image
  //             };
  //           },
  //           error(err) {
  //             console.error('Compression failed:', err);
  //           }
  //         });
  //       });
  //       const imageBlob = base64ToBlob(imageSrc);
  //       new Compressor(imageBlob, {
  //         quality: 0.9, // Increase quality to retain more details
  //         success(result) {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(result);
  //           reader.onloadend = () => {
  //             setCapturedImage(reader.result); // Set compressed image
  //           };
  //         },
  //         error(err) {
  //           console.error('Compression failed:', err);
  //         }
  //       });

  //       setIsCameraOpen(false); // Close the camera
  //     }
  //   }
  // };
  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot({
        width: 1080,
        height: 1080
      });

      if (imageSrc) {
        // Step 1: Create an image element from the captured base64 image
        const img = new Image();
        img.src = imageSrc;

        img.onload = () => {
          // Step 2: Create a canvas to crop the image to 300x190
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set the target width and height
          const targetWidth = 400;
          const targetHeight = 290;
          const aspectRatio = targetWidth / targetHeight;

          // Calculate the cropping area (center crop to maintain aspect ratio)
          const cropWidth = img.width;
          const cropHeight = img.width / aspectRatio;

          // Calculate cropping position (center the image vertically)
          const cropX = 0;
          const cropY = (img.height - cropHeight) / 2;

          // Set canvas dimensions to match the target size
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Draw the cropped portion of the image on the canvas
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight, // Crop source
            0,
            0,
            targetWidth,
            targetHeight // Target canvas size
          );

          // Step 3: Convert the cropped image to base64 in JPEG format
          const croppedBase64 = canvas.toDataURL('image/jpeg', 1.0);

          // Step 4: Compress the cropped image before sending to API
          const imageBlobForAPI = base64ToBlob(croppedBase64);
          new Compressor(imageBlobForAPI, {
            quality: 1.0, // Adjust quality as needed
            success(result) {
              const reader = new FileReader();
              reader.readAsDataURL(result);
              reader.onloadend = () => {
                setCapturedImageForAPI(reader.result); // Set compressed image for API
              };
            },
            error(err) {
              console.error('Compression failed:', err);
            }
          });
        };

        // Step 5: Optionally compress the original image without resizing
        const imageBlob = base64ToBlob(imageSrc);
        new Compressor(imageBlob, {
          quality: 0.9, // Increase quality to retain more details
          success(result) {
            const reader = new FileReader();
            reader.readAsDataURL(result);
            reader.onloadend = () => {
              setCapturedImage(reader.result); // Set compressed original image (optional)
            };
          },
          error(err) {
            console.error('Compression failed:', err);
          }
        });

        setIsCameraOpen(false); // Close the camera
      }
    }
  };

  // Utility function to resize image
  const resizeImage = (base64Str, newWidth, newHeight) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = newWidth;
        canvas.height = newHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, newWidth, newHeight);
        resolve(canvas.toDataURL()); // Return resized base64 string
      };
    });
  };

  // const captureImage = () => {
  //   if (webcamRef.current) {
  //     // const container = document.getElementById('camera-container');

  //     // const imageSrc = webcamRef.current.getScreenshot({
  //     //   width: 300, // Set exact width for the screenshot
  //     //   height: 190 // Set exact height for the screenshot
  //     // });
  //     // width: 680, // Capture at higher width for better quality
  //     // height: 300 // Capture at higher height for better quality
  //     const imageSrc = webcamRef.current.getScreenshot({
  //       width: 1080,
  //       height: 1080
  //     });

  //     if (imageSrc) {
  //       const imageBlob = base64ToBlob(imageSrc);

  //       // // Compress the image to meet size requirements
  //       // new Compressor(imageBlob, {
  //       //   quality: 0.85, // Adjust quality as needed
  //       //   success(result) {
  //       //     const reader = new FileReader();
  //       //     reader.readAsDataURL(result);
  //       //     reader.onloadend = () => {
  //       //       setCapturedImage(reader.result); // Set compressed image
  //       //     };
  //       //   },
  //       //   error(err) {
  //       //     console.error('Compression failed:', err);
  //       //   }
  //       // });

  //       new Compressor(imageBlob, {
  //         quality: 0.9, // Increase quality to retain more details
  //         success(result) {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(result);
  //           reader.onloadend = () => {
  //             setCapturedImage(reader.result); // Set compressed image
  //           };
  //         },
  //         error(err) {
  //           console.error('Compression failed:', err);
  //         }
  //       });

  //       setIsCameraOpen(false); // Close the camera
  //     }
  //   }
  // };
  // Function to retake image by reopening the camera
  const retakeImage = () => {
    setCapturedImage(null); // Clear the captured image
    setIsCameraOpen(true); // Open the camera again
    setIsConfirmed(false); // Reset confirmation status
  };

  // Function to confirm the image, disabling the retake button
  const confirmImage = () => {
    setIsConfirmed(true); // Disable retake button
  };

  // Function to upload image via API call
  const uploadImage = async (imageBase64) => {
    try {
      // Set loading to true when API call starts
      setLoading(true);

      // Create a FormData object
      const formData = new FormData();

      // Convert the Base64 image to a Blob
      const byteString = atob(imageBase64.split(',')[1]);
      const mimeString = imageBase64.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });

      // Append the file (Blob) to FormData
      formData.append('file', blob, 'image.jpg');

      // Make the API call with FormData
      const response = await axios.post(
        'https://ai.siddhaai.com/ai/',
        // 'https://d1pdiiov4lhsb2.cloudfront.net/ai',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Check if the request was successful and data exists
      if (response.status === 200 && response.data) {
        setLoading(true);
        // Parse the response data
        const responseData = response.data[0]; // First element is the JSON string
        const parsedData = JSON.parse(responseData); // Parse the JSON string
        console.log('API response:', response.data);
        // Destructure and map the parsed data to your state
        const {
          first_name,
          middle_name,
          last_name,
          date_of_birth,
          street1,
          city,
          state,
          pincode
        } = parsedData;

        // Update state with the parsed data
        setAddingData((prevState) => ({
          ...prevState,
          firstName: first_name,
          middleName: middle_name,
          lastName: last_name,
          // selectedDate : date_of_birth,
          streetName: street1,
          city: city,
          states: state,
          zipCode: pincode
        }));
        setStates(state);
        setSelectedDate(normalizeDate(date_of_birth));
        setLoading(false);
        // Move to the next step after updating state
        // setStep(4);
      } else {
        console.error(
          'Error: Image upload failed or response data is missing.'
        );
        return {
          success: false,
          message: 'Image upload failed or invalid data.'
        };
      }
    } catch (error) {
      console.error('API call failed:', error);
      return { success: false, message: 'API call failed.' };
    } finally {
      // Set loading to false when the API call finishes
      setLoading(false);
    }
  };
  // Function to compress image and ensure it fits within 100KB - 2MB range
  const compressImage = async (webcamRef) => {
    let quality = 0.9; // Start with high quality
    let imageSrc = null;

    while (!imageSrc) {
      // Capture the screenshot as a Blob with the specified quality
      const blob = await webcamRef.current
        .getCanvas()
        .toBlob((blob) => blob, 'image/jpeg', quality);

      // Check the size of the blob
      if (blob.size >= 100 * 1024 && blob.size <= 2 * 1024 * 1024) {
        // If the blob size is between 100KB and 2MB, convert it to Base64 and return
        return blobToBase64(blob);
      } else if (blob.size > 2 * 1024 * 1024) {
        // If the image is too large, decrease quality
        quality -= 0.05;
      } else {
        // If the image is too small, stop (no further increase in quality possible)
        break;
      }
    }
    return imageSrc;
  };
  // const openCameraFront = () => {
  //   setCapturedFrontImage(null); // Clear any captured image
  //   setIsCameraOpenFront(true); // Open the camera
  //   setDisableRetakeFront(false); // Reset confirmation
  // };

  // // Capture front image function
  // const captureFrontImage = () => {
  //   const imageSrc = webcamFrontRef.current.getScreenshot({
  //     width: 300,
  //     height: 190
  //   });
  //   setCapturedFrontImage(imageSrc);
  //   setIsCameraOpenFront(false);
  // };
  // Capture front image function
  // const captureFrontImage = async () => {
  //   const imageSrc = await compressImage(webcamFrontRef);
  //   setCapturedFrontImage(imageSrc);
  //   setIsCameraOpenFront(false);
  // };
  // const openCameraBack = () => {
  //   setCapturedBackImage(null); // Clear any captured image
  //   setIsCameraOpenBack(true); // Open the camera
  //   setIsConfirmed(false); // Reset confirmation
  // };

  // // Capture back image function
  // const captureBackImage = () => {
  //   const imageSrc = webcamBackRef.current.getScreenshot({
  //     width: 300,
  //     height: 190
  //   });
  //   setCapturedBackImage(imageSrc);
  //   setIsCameraOpenBack(false);
  // };
  // Capture back image function
  // const captureBackImage = async () => {
  //   const imageSrc = await compressImage(webcamBackRef);
  //   setCapturedBackImage(imageSrc);
  //   setIsCameraOpenBack(false);
  // };
  // // Retake front image
  // const retakeFrontImage = () => {
  //   setCapturedFrontImage(null);
  //   setIsCameraOpenFront(false);
  //   setDisableRetakeFront(false);
  // };

  // // Retake back image
  // const retakeBackImage = () => {
  //   setCapturedBackImage(null);
  //   setIsCameraOpenBack(false);
  //   setDisableRetakeBack(false);
  // };

  // // Confirm front image
  // const confirmFrontImage = () => {
  //   setDisableRetakeFront(true);
  // };

  // // Confirm back image
  // const confirmBackImage = () => {
  //   setDisableRetakeBack(true);
  // };
  const openCameraFront = () => {
    setCapturedFrontImage(null); // Clear any captured image
    setIsCameraOpenFront(true); // Open the camera
    setDisableRetakeFront(false); // Reset confirmation
  };

  // Capture front image function with quality settings
  // const captureFrontImage = () => {
  //   if (webcamFrontRef.current) {
  //     const imageSrc = webcamFrontRef.current.getScreenshot({
  //       width: 1080,
  //       height: 1080
  //     });

  //     if (imageSrc) {
  //       resizeImage(imageSrc, 300, 190).then((resizedBase64) => {
  //         const imageBlobFrontForAPI = base64ToBlob(resizedBase64);

  //         new Compressor(imageBlobFrontForAPI, {
  //           quality: 0.3, // Increase quality to retain more details
  //           success(result) {
  //             const reader = new FileReader();
  //             reader.readAsDataURL(result);
  //             reader.onloadend = () => {
  //               setCapturedFrontImageForAPI(reader.result); // Set compressed image
  //             };
  //           },
  //           error(err) {
  //             console.error('Compression failed:', err);
  //           }
  //         });
  //       });
  //       const imageBlob = base64ToBlob(imageSrc);

  //       new Compressor(imageBlob, {
  //         quality: 0.3, // Increase quality to retain more details
  //         success(result) {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(result);
  //           reader.onloadend = () => {
  //             setCapturedFrontImage(reader.result); // Set compressed image
  //           };
  //         },
  //         error(err) {
  //           console.error('Compression failed:', err);
  //         }
  //       });

  //       setIsCameraOpenFront(false); // Close the camera
  //     }
  //   }
  // };
  // const captureFrontImage = () => {
  //   if (webcamFrontRef.current) {
  //     // Get the screenshot from the webcam at a high resolution (1080x1080)
  //     const imageSrc = webcamFrontRef.current.getScreenshot({
  //       width: 1080,
  //       height: 1080,
  //     });

  //     if (imageSrc) {
  //       // First, resize the image
  //       resizeImage(imageSrc, 300, 190).then((resizedBase64) => {
  //         const imageBlobForAPI = base64ToBlob(resizedBase64);

  //         // Compress the resized image
  //         new Compressor(imageBlobForAPI, {
  //           quality: 0.3, // Set desired compression quality
  //           success(compressedBlob) {
  //             const reader = new FileReader();
  //             reader.readAsDataURL(compressedBlob); // Convert compressed image to base64
  //             reader.onloadend = () => {
  //               const compressedBase64 = reader.result;

  //               // Send the compressed image to API (base64 format)
  //               setCapturedFrontImageForAPI(compressedBase64);

  //               // You can also send it to the API here directly, or store it:
  //               // sendImageToAPI(compressedBase64); // Example API call
  //             };
  //           },
  //           error(err) {
  //             console.error('Compression failed:', err);
  //           },
  //         });
  //       });

  //       // Optionally compress the original image without resizing
  //       const originalImageBlob = base64ToBlob(imageSrc);
  //       new Compressor(originalImageBlob, {
  //         quality: 0.3, // Compression quality for original image
  //         success(compressedBlob) {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(compressedBlob); // Convert compressed image to base64
  //           reader.onloadend = () => {
  //             const compressedBase64 = reader.result;

  //             // Set the compressed original image (if needed elsewhere in your UI)
  //             setCapturedFrontImage(compressedBase64);
  //           };
  //         },
  //         error(err) {
  //           console.error('Compression failed:', err);
  //         },
  //       });

  //       // Close the camera after capturing
  //       setIsCameraOpenFront(false);
  //     }
  //   }
  // };

  // updated new
  // const captureFrontImage = () => {
  //   if (webcamFrontRef.current) {
  //     // Step 1: Capture the image at 1080x1080 resolution
  //     const imageSrc = webcamFrontRef.current.getScreenshot({
  //       width: 1080,
  //       height: 1080,
  //       format: 'image/jpeg' // Set the format to JPEG
  //     });

  //     if (imageSrc) {
  //       // Step 2: Resize the image to a smaller size (e.g., 250x160 for better control of the file size)
  //       resizeImage(imageSrc, 200, 130).then((resizedBase64) => {
  //         const imageBlobForAPI = base64ToBlob(resizedBase64);

  //         // Step 3: Compress the resized image aggressively (reduce quality to target 80KB)
  //         new Compressor(imageBlobForAPI, {
  //           quality: 0.3, // Lower compression quality to stay under 80KB
  //           success(compressedBlob) {
  //             const reader = new FileReader();
  //             reader.readAsDataURL(compressedBlob); // Convert compressed image to base64
  //             reader.onloadend = () => {
  //               const compressedBase64 = reader.result;

  //               // Calculate the size of the Base64 image
  //               const base64Length =
  //                 compressedBase64.length * (3 / 4) -
  //                 (compressedBase64.indexOf('=') > 0
  //                   ? compressedBase64.length - compressedBase64.indexOf('=')
  //                   : 0);
  //               const base64SizeInKB = base64Length / 1024;
  //               setCapturedFrontImageForAPI(compressedBase64.split(',')[1]); // Set the compressed image for API

  //               // Log the size of the compressed image
  //               console.log('Compressed image size:', base64SizeInKB, 'KB');

  //               // Ensure the image size is under 80KB
  //               // if (base64SizeInKB <= 80) {

  //               // Optionally send the image to the API
  //               // sendImageToAPI(compressedBase64); // Example API call
  //               // } else {
  //               // console.error('Compressed image is still above 80KB after adjustments.');
  //               // You can further reduce quality or resize again here if needed
  //               // }
  //             };
  //           },
  //           error(err) {
  //             console.error('Compression failed:', err);
  //           }
  //         });
  //       });

  //       // Optionally, compress the original image without resizing (if needed for other purposes)
  //       const originalImageBlob = base64ToBlob(imageSrc);
  //       new Compressor(originalImageBlob, {
  //         quality: 0.9, // Compress the original image but retain higher quality
  //         success(compressedBlob) {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(compressedBlob); // Convert to base64
  //           reader.onloadend = () => {
  //             const compressedBase64 = reader.result;
  //             setCapturedFrontImage(compressedBase64); // Optionally store the original image
  //           };
  //         },
  //         error(err) {
  //           console.error('Original image compression failed:', err);
  //         }
  //       });

  //       // Close the camera after capturing the image
  //       setIsCameraOpenFront(false);
  //     }
  //   }
  // };

  // updated latest jpeg

  // const captureFrontImage = () => {
  //   if (webcamFrontRef.current) {
  //     // Step 1: Capture the image at 1080x1080 resolution
  //     const imageSrc = webcamFrontRef.current.getScreenshot({
  //       width: 1080,
  //       height: 1080,
  //       format: 'image/jpeg' // Set the format to JPEG
  //     });

  //     if (imageSrc) {
  //       // Convert the captured image to a base64-encoded JPEG using canvas
  //       const img = new Image();
  //       img.src = imageSrc; // base64 JPEG image

  //       img.onload = () => {
  //         // Create a canvas to draw the image
  //         const canvas = document.createElement('canvas');
  //         const ctx = canvas.getContext('2d');
  //         const width = img.width;
  //         const height = img.height;
  //         canvas.width = width;
  //         canvas.height = height;

  //         // Draw the image on the canvas
  //         ctx.drawImage(img, 0, 0, width, height);

  //         // Convert the canvas to JPEG (quality 0.8 for a balance of size and quality)
  //         const jpegBase64 = canvas.toDataURL('image/jpeg', 1.0);
  //         console.log(jpegBase64, 'frontjpeg'); // Debugging - showing captured JPEG image

  //         // Step 2: Resize the captured image
  //         resizeImage(jpegBase64, 1080, 1080).then((resizedBase64) => {
  //           // Convert resized image base64 to an image element
  //           const resizedImg = new Image();
  //           resizedImg.src = resizedBase64;

  //           resizedImg.onload = () => {
  //             // Resize using canvas again, explicitly converting to JPEG format
  //             const resizedCanvas = document.createElement('canvas');
  //             const resizedCtx = resizedCanvas.getContext('2d');
  //             const resizedWidth = resizedImg.width;
  //             const resizedHeight = resizedImg.height;
  //             resizedCanvas.width = resizedWidth;
  //             resizedCanvas.height = resizedHeight;

  //             // Draw the resized image onto the canvas
  //             resizedCtx.drawImage(
  //               resizedImg,
  //               0,
  //               0,
  //               resizedWidth,
  //               resizedHeight
  //             );

  //             // Convert to JPEG format after resizing
  //             const finalBase64 = resizedCanvas.toDataURL('image/jpeg', 1.0);
  //             console.log(finalBase64, 'final resized JPEG');

  //             // Step 3: Compress the resized image aggressively (reduce quality to target 80KB)
  //             const imageBlobForAPI = base64ToBlob(finalBase64);
  //             new Compressor(imageBlobForAPI, {
  //               quality: 1.0, // Lower compression quality to stay under 80KB
  //               success(compressedBlob) {
  //                 const reader = new FileReader();
  //                 reader.readAsDataURL(compressedBlob); // Convert compressed image to base64
  //                 reader.onloadend = () => {
  //                   const compressedBase64 = reader.result;
  //                   console.log(compressedBase64, 'after resize and compress');

  //                   // Ensure that the base64 string is JPEG
  //                   const compressedBase64JPEG = compressedBase64.split(',')[1];

  //                   // Log the compressed image
  //                   console.log(compressedBase64JPEG, 'Compressed Front Image');

  //                   // Set the compressed image for API (base64 string without prefix)
  //                   setCapturedFrontImageForAPI(compressedBase64JPEG);

  //                   // Log the compressed image size for debugging purposes
  //                   const base64Length =
  //                     compressedBase64.length * (3 / 4) -
  //                     (compressedBase64.indexOf('=') > 0
  //                       ? compressedBase64.length -
  //                         compressedBase64.indexOf('=')
  //                       : 0);
  //                   const base64SizeInKB = base64Length / 1024;
  //                   console.log(
  //                     'Compressed Front image size:',
  //                     base64SizeInKB,
  //                     'KB'
  //                   );
  //                 };
  //               },
  //               error(err) {
  //                 console.error('Compression failed:', err);
  //               }
  //             });
  //           };
  //         });
  //       };

  //       // Compress the original image with higher quality (without resizing)
  //       const originalImageBlob = base64ToBlob(imageSrc);
  //       new Compressor(originalImageBlob, {
  //         quality: 0.9, // Compress the original image but retain higher quality
  //         success(compressedBlob) {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(compressedBlob); // Convert compressed image to base64
  //           reader.onloadend = () => {
  //             const compressedBase64 = reader.result;
  //             setCapturedFrontImage(compressedBase64); // Optionally store the original image
  //           };
  //         },
  //         error(err) {
  //           console.error('Original front image compression failed:', err);
  //         }
  //       });

  //       // Close the camera after capturing the front image
  //       setIsCameraOpenFront(false);
  //     }
  //   }
  // };
  const captureFrontImage = () => {
    if (webcamFrontRef.current) {
      // Step 1: Capture the image at 1080x1080 resolution
      const imageSrc = webcamFrontRef.current.getScreenshot({
        width: 1080,
        height: 1080,
        format: 'image/jpeg' // Set the format to JPEG
      });

      if (imageSrc) {
        // Create an image element from the captured base64 image
        const img = new Image();
        img.src = imageSrc; // base64 JPEG image

        img.onload = () => {
          // Create a canvas to crop the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Step 2: Calculate cropping dimensions
          const targetWidth = 400;
          const targetHeight = 290;
          const aspectRatio = targetWidth / targetHeight;

          // Determine crop size from the center of the square image
          const cropWidth = img.width;
          const cropHeight = img.width / aspectRatio; // Maintain aspect ratio 300:190

          // Calculate cropping position (center the image vertically)
          const cropX = 0;
          const cropY = (img.height - cropHeight) / 2;

          // Set canvas size to the target width and height
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Draw the cropped image on the canvas
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight, // Crop source
            0,
            0,
            targetWidth,
            targetHeight // Target canvas size
          );

          // Step 3: Convert the cropped image to base64 in JPEG format
          const croppedBase64 = canvas.toDataURL('image/jpeg', 1.0);
          console.log(croppedBase64, 'Cropped Front JPEG');

          // Compress the cropped image and send to the API
          const imageBlobForAPI = base64ToBlob(croppedBase64);
          new Compressor(imageBlobForAPI, {
            quality: 1.0, // Lower compression quality to stay under 80KB
            success(compressedBlob) {
              const reader = new FileReader();
              reader.readAsDataURL(compressedBlob); // Convert compressed image to base64
              reader.onloadend = () => {
                const compressedBase64 = reader.result;
                console.log(compressedBase64, 'after resize and compress');

                // Ensure that the base64 string is JPEG
                const compressedBase64JPEG = compressedBase64.split(',')[1];

                // Set the cropped, compressed image for API
                setCapturedFrontImageForAPI(compressedBase64JPEG);

                // Log the compressed image size for debugging purposes
                const base64Length =
                  compressedBase64.length * (3 / 4) -
                  (compressedBase64.indexOf('=') > 0
                    ? compressedBase64.length - compressedBase64.indexOf('=')
                    : 0);
                const base64SizeInKB = base64Length / 1024;
                console.log(
                  'Compressed Front image size:',
                  base64SizeInKB,
                  'KB'
                );
              };
            },
            error(err) {
              console.error('Compression failed:', err);
            }
          });
        };

        // Compress the original image with higher quality (without resizing)
        const originalImageBlob = base64ToBlob(imageSrc);
        new Compressor(originalImageBlob, {
          quality: 0.9, // Compress the original image but retain higher quality
          success(compressedBlob) {
            const reader = new FileReader();
            reader.readAsDataURL(compressedBlob); // Convert compressed image to base64
            reader.onloadend = () => {
              const compressedBase64 = reader.result;
              setCapturedFrontImage(compressedBase64); // Optionally store the original image
            };
          },
          error(err) {
            console.error('Original front image compression failed:', err);
          }
        });
        // Close the camera after capturing the front image
        setIsCameraOpenFront(false);
      }
    }
  };

  const openCameraBack = () => {
    setCapturedBackImage(null); // Clear any captured image
    setIsCameraOpenBack(true); // Open the camera
    setDisableRetakeBack(false); // Reset confirmation
  };
  const captureBackImage = () => {
    if (webcamBackRef.current) {
      // Step 1: Capture a screenshot from the webcam at high resolution (1080x1080)
      const imageSrc = webcamBackRef.current.getScreenshot({
        width: 1080,
        height: 1080,
        format: 'image/jpeg' // Capture in JPEG format
      });

      if (imageSrc) {
        // Create an image element from the captured base64 image
        const img = new Image();
        img.src = imageSrc; // base64 JPEG image

        img.onload = () => {
          // Step 2: Create a canvas to crop the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set the target width and height for the image
          const targetWidth = 400;
          const targetHeight = 290;
          const aspectRatio = targetWidth / targetHeight;

          // Calculate the cropping area (center crop to maintain aspect ratio)
          const cropWidth = img.width;
          const cropHeight = img.width / aspectRatio; // Maintain 300:190 aspect ratio

          // Calculate cropping position (center the image vertically)
          const cropX = 0;
          const cropY = (img.height - cropHeight) / 2;

          // Set canvas dimensions to match the target dimensions
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Draw the cropped portion of the image on the canvas
          ctx.drawImage(
            img,
            cropX,
            cropY,
            cropWidth,
            cropHeight, // Crop source
            0,
            0,
            targetWidth,
            targetHeight // Target canvas size
          );

          // Step 3: Convert the cropped image to base64 in JPEG format
          const croppedBase64 = canvas.toDataURL('image/jpeg', 1.0);
          console.log(croppedBase64, 'Cropped Back JPEG');

          // Step 4: Compress the cropped image and send it to the API
          const imageBlobBackForAPI = base64ToBlob(croppedBase64);
          new Compressor(imageBlobBackForAPI, {
            quality: 1.0, // Lower compression quality to stay under 80KB
            success(compressedBlob) {
              const reader = new FileReader();
              reader.readAsDataURL(compressedBlob); // Convert compressed image to base64
              reader.onloadend = () => {
                const compressedBase64 = reader.result;
                console.log(compressedBase64, 'after resize and compress');

                // Ensure that the base64 string is JPEG
                const compressedBase64JPEG = compressedBase64.split(',')[1];

                // Set the cropped and compressed image for the API
                setCapturedBackImageForAPI(compressedBase64JPEG);

                // Log the compressed image size for debugging purposes
                const base64Length =
                  compressedBase64.length * (3 / 4) -
                  (compressedBase64.indexOf('=') > 0
                    ? compressedBase64.length - compressedBase64.indexOf('=')
                    : 0);
                const base64SizeInKB = base64Length / 1024;
                console.log(
                  'Compressed BACK image size:',
                  base64SizeInKB,
                  'KB'
                );
              };
            },
            error(err) {
              console.error('Compression failed:', err);
            }
          });
        };

        // Optionally, compress the original image without resizing (if needed)
        const originalImageBlob = base64ToBlob(imageSrc);
        new Compressor(originalImageBlob, {
          quality: 0.9, // Compress the original image at a higher quality
          success(compressedBlob) {
            const reader = new FileReader();
            reader.readAsDataURL(compressedBlob); // Convert compressed image to base64
            reader.onloadend = () => {
              const compressedBase64 = reader.result;

              // Set the original image after compression (if needed in the UI)
              setCapturedBackImage(compressedBase64);
            };
          },
          error(err) {
            console.error('Original back image compression failed:', err);
          }
        });

        // Close the camera after capturing the back image
        setIsCameraOpenBack(false);
      }
    }
  };

  // Capture back image function with quality settings
  // const captureBackImage = () => {
  //   if (webcamBackRef.current) {
  //     // const container = document.getElementById('camera-container');

  //     const imageSrc = webcamBackRef.current.getScreenshot({
  //       width: 1080, // Capture at higher width for better quality
  //       height: 1080 // Capture at higher height for better quality
  //     });

  //     if (imageSrc) {
  //       resizeImage(imageSrc, 300, 190).then((resizedBase64) => {
  //         // const imageBlob = base64ToBlob(imageSrc);
  //         const imageBlobBackForAPI = base64ToBlob(resizedBase64);

  //         new Compressor(imageBlobBackForAPI, {
  //           quality: 0.3, // Increase quality to retain more details
  //           success(result) {
  //             const reader = new FileReader();
  //             reader.readAsDataURL(result);
  //             reader.onloadend = () => {
  //               setCapturedBackImageForAPI(reader.result); // Set compressed image
  //             };
  //           },
  //           error(err) {
  //             console.error('Compression failed:', err);
  //           }
  //         });
  //       });

  //       const imageBlob = base64ToBlob(imageSrc);
  //       new Compressor(imageBlob, {
  //         quality: 0.3, // Increase quality to retain more details
  //         success(result) {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(result);
  //           reader.onloadend = () => {
  //             setCapturedBackImage(reader.result); // Set compressed image
  //           };
  //         },
  //         error(err) {
  //           console.error('Compression failed:', err);
  //         }
  //       });
  //       setIsCameraOpenBack(false); // Close the camera
  //     }
  //   }
  //   // const imageSrc = webcamBackRef.current.getScreenshot({
  //   //   width: 300,
  //   //   height: 190,
  //   //   // Set the quality for the back image as well
  //   //   quality: 0.9 // Adjust this quality as needed
  //   // });
  //   // setCapturedBackImage(imageSrc);
  //   // setIsCameraOpenBack(false);
  // };

  // updated new
  // const captureBackImage = () => {
  //   if (webcamBackRef.current) {
  //     // Capture a screenshot from the webcam at high resolution (1080x1080)
  //     const imageSrc = webcamBackRef.current.getScreenshot({
  //       width: 1080,
  //       height: 1080,
  //       format: 'image/jpeg' // Set the format to JPEG
  //     });

  //     if (imageSrc) {
  //       // Step 1: Resize the captured image
  //       resizeImage(imageSrc, 200, 130).then((resizedBase64) => {
  //         const imageBlobBackForAPI = base64ToBlob(resizedBase64);

  //         // Step 2: Compress the resized image
  //         new Compressor(imageBlobBackForAPI, {
  //           quality: 0.3, // Adjust compression quality (0.3 is for a good balance)
  //           success(compressedBlob) {
  //             const reader = new FileReader();
  //             reader.readAsDataURL(compressedBlob); // Convert compressed image to base64
  //             reader.onloadend = () => {
  //               const compressedBase64 = reader.result;
  //               console.log(compressedBase64, 'compressbackimagenew');

  //               const base64Length =
  //                 compressedBase64.length * (3 / 4) -
  //                 (compressedBase64.indexOf('=') > 0
  //                   ? compressedBase64.length - compressedBase64.indexOf('=')
  //                   : 0);
  //               const base64SizeInKB = base64Length / 1024;
  //               console.log(
  //                 'Compressed BACK image size:',
  //                 base64SizeInKB,
  //                 'KB'
  //               );
  //               setCapturedBackImageForAPI(compressedBase64.split(',')[1]); // Set the compressed image for API
  //               // Log the compressed image size for verification
  //               // console.log(
  //               //   'Compressed Back Image size:',
  //               //   compressedBlob.size / 1024,
  //               //   'KB'
  //               // );

  //               // if (base64SizeInKB <= 80) {

  //               // Optionally send the image to the API
  //               // sendImageToAPI(compressedBase64); // Example API call
  //               // } else {
  //               // console.error('Compressed image is still above 80KB after adjustments.');
  //               // You can further reduce quality or resize again here if needed
  //               // }
  //             };
  //           },
  //           error(err) {
  //             console.error('Back image compression failed:', err);
  //           }
  //         });
  //       });

  //       // Optionally, compress the original image without resizing (if needed)
  //       const originalImageBlob = base64ToBlob(imageSrc);
  //       new Compressor(originalImageBlob, {
  //         quality: 0.9, // Compress the original image at the same quality
  //         success(compressedBlob) {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(compressedBlob); // Convert to base64
  //           reader.onloadend = () => {
  //             const compressedBase64 = reader.result;

  //             // Set the original image after compression (if needed in the UI)
  //             setCapturedBackImage(compressedBase64);
  //           };
  //         },
  //         error(err) {
  //           console.error('Original back image compression failed:', err);
  //         }
  //       });

  //       // Close the camera after capturing the back image
  //       setIsCameraOpenBack(false);
  //     }
  //   }
  // };

  // updated new jpeg
  // const captureBackImage = () => {
  //   if (webcamBackRef.current) {
  //     // Step 1: Capture a screenshot from the webcam at high resolution (1080x1080)
  //     const imageSrc = webcamBackRef.current.getScreenshot({
  //       width: 1080,
  //       height: 1080,
  //       format: 'image/jpeg' // Capture in JPEG format
  //     });

  //     if (imageSrc) {
  //       // Convert the captured image to a base64-encoded JPEG using canvas
  //       const img = new Image();
  //       img.src = imageSrc; // base64 JPEG image

  //       img.onload = () => {
  //         // Create a canvas to draw the image
  //         const canvas = document.createElement('canvas');
  //         const ctx = canvas.getContext('2d');
  //         const width = img.width;
  //         const height = img.height;
  //         canvas.width = width;
  //         canvas.height = height;

  //         // Draw the image on the canvas
  //         ctx.drawImage(img, 0, 0, width, height);

  //         // Convert the canvas to JPEG (quality 0.8 for a balance of size and quality)
  //         const jpegBase64 = canvas.toDataURL('image/jpeg', 1.0);
  //         console.log(jpegBase64, 'backjpeg'); // Debugging - showing captured JPEG image

  //         // Step 2: Resize the captured image
  //         resizeImage(jpegBase64, 1080, 1080).then((resizedBase64) => {
  //           const resizedImg = new Image();
  //           resizedImg.src = resizedBase64;

  //           resizedImg.onload = () => {
  //             // Resize using canvas again, explicitly converting to JPEG format
  //             const resizedCanvas = document.createElement('canvas');
  //             const resizedCtx = resizedCanvas.getContext('2d');
  //             const resizedWidth = resizedImg.width;
  //             const resizedHeight = resizedImg.height;
  //             resizedCanvas.width = resizedWidth;
  //             resizedCanvas.height = resizedHeight;

  //             // Draw the resized image onto the canvas
  //             resizedCtx.drawImage(
  //               resizedImg,
  //               0,
  //               0,
  //               resizedWidth,
  //               resizedHeight
  //             );

  //             // Convert to JPEG format after resizing
  //             const finalBase64 = resizedCanvas.toDataURL('image/jpeg', 1.0);
  //             console.log(finalBase64, 'final resized JPEG');

  //             // Step 3: Compress the resized image aggressively (reduce quality to target 80KB)
  //             const imageBlobBackForAPI = base64ToBlob(finalBase64);
  //             new Compressor(imageBlobBackForAPI, {
  //               quality: 1.0, // Lower compression quality to stay under 80KB
  //               success(compressedBlob) {
  //                 const reader = new FileReader();
  //                 reader.readAsDataURL(compressedBlob); // Convert compressed image to base64
  //                 reader.onloadend = () => {
  //                   const compressedBase64 = reader.result;
  //                   console.log(compressedBase64, 'after resize and compress');

  //                   // Ensure that the base64 string is JPEG
  //                   const compressedBase64JPEG = compressedBase64.split(',')[1];

  //                   // Log the compressed image
  //                   console.log(compressedBase64JPEG, 'Compressed Back Image');

  //                   // Set the compressed image for API (base64 string without prefix)
  //                   setCapturedBackImageForAPI(compressedBase64JPEG);

  //                   // Log the compressed image size for debugging purposes
  //                   const base64Length =
  //                     compressedBase64.length * (3 / 4) -
  //                     (compressedBase64.indexOf('=') > 0
  //                       ? compressedBase64.length -
  //                         compressedBase64.indexOf('=')
  //                       : 0);
  //                   const base64SizeInKB = base64Length / 1024;
  //                   console.log(
  //                     'Compressed BACK image size:',
  //                     base64SizeInKB,
  //                     'KB'
  //                   );
  //                 };
  //               },
  //               error(err) {
  //                 console.error('Compression failed:', err);
  //               }
  //             });
  //           };
  //         });
  //       };

  //       // Optionally, compress the original image without resizing (if needed)
  //       const originalImageBlob = base64ToBlob(imageSrc);
  //       new Compressor(originalImageBlob, {
  //         quality: 0.9, // Compress the original image at the same quality
  //         success(compressedBlob) {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(compressedBlob); // Convert to base64
  //           reader.onloadend = () => {
  //             const compressedBase64 = reader.result;

  //             // Set the original image after compression (if needed in the UI)
  //             setCapturedBackImage(compressedBase64);
  //           };
  //         },
  //         error(err) {
  //           console.error('Original back image compression failed:', err);
  //         }
  //       });

  //       // Close the camera after capturing the back image
  //       setIsCameraOpenBack(false);
  //     }
  //   }
  // };

  // Retake front image
  const retakeFrontImage = () => {
    setCapturedFrontImage(null);
    setIsCameraOpenFront(true);
    setDisableRetakeFront(false);
  };

  // Retake back image
  const retakeBackImage = () => {
    setCapturedBackImage(null);
    setIsCameraOpenBack(true);
    setDisableRetakeBack(false);
  };

  // Confirm front image
  const confirmFrontImage = () => {
    setDisableRetakeFront(true);
  };

  // Confirm back image
  const confirmBackImage = () => {
    setDisableRetakeBack(true);
  };

  // ! old camera access code
  // useEffect(() => {
  //   if (!location || !location.search) return;

  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     // Access the webcam
  //     navigator.mediaDevices
  //       .getUserMedia({ video: { facingMode: 'environment' } })
  //       .then((stream) => {
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = stream;
  //         }
  //         if (location && location.search) {
  //           const searchParams = new URLSearchParams(location.search);
  //           const DIdHere = searchParams.get('short_token'); // Get the value of 'short_token'

  //           if (DIdHere) {
  //             setDIdNew(DIdHere); // Save the short_token in the state
  //             initiateApiCall(DIdHere); // Call the API when camera access is granted
  //           }
  //         }
  //       })
  //       .catch((err) => {
  //         console.error('Error accessing webcam:', err);
  //         alert(
  //           'Unable to access the camera. Please check permissions and try again.'
  //         );
  //       });
  //   } else {
  //     console.error('getUserMedia is not supported in this browser.');
  //     alert(
  //       'Camera access is not supported on this device. Please use a different browser or device.'
  //     );
  //   }
  // }, [location.search]);
  // ! old camera access code

  // useEffect(() => {
  //   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  //     // Access the webcam
  //     navigator.mediaDevices
  //       .getUserMedia({ video: { facingMode: 'environment' } })
  //       .then((stream) => {
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = stream;
  //         }
  //       })
  //       .catch((err) => {
  //         console.error('Error accessing webcam:', err);
  //         alert(
  //           'Unable to access the camera. Please check permissions and try again.'
  //         );
  //       });
  //   } else {
  //     console.error('getUserMedia is not supported in this browser.');
  //     alert(
  //       'Camera access is not supported on this device. Please use a different browser or device.'
  //     );
  //   }
  // }, [location.search]);

  // const toggleFrameSize = () => {
  //   setUseLandscape(!useLandscape);
  // };

  // const captureImage = () => {
  //   const canvas = canvasRef.current;
  //   const video = videoRef.current;
  //   const context = canvas.getContext('2d');

  //   // Define the frame size based on the selected orientation
  //   if (useLandscape) {
  //     canvas.width = 300; // Approximate 3.375" width
  //     canvas.height = 190; // Approximate 2.125" height
  //   } else {
  //     canvas.width = 190; // Approximate 2.125" width
  //     canvas.height = 300; // Approximate 3.375" height
  //   }

  //   // Draw the video frame onto the canvas
  //   context.drawImage(video, 0, 0, canvas.width, canvas.height);

  //   // Apply rounded corners using a mask
  //   context.globalCompositeOperation = 'destination-in';
  //   context.beginPath();
  //   const cornerRadius = 20; // Adjust for 0.09" (2.29mm)
  //   context.moveTo(cornerRadius, 0);
  //   context.arcTo(canvas.width, 0, canvas.width, canvas.height, cornerRadius);
  //   context.arcTo(canvas.width, canvas.height, 0, canvas.height, cornerRadius);
  //   context.arcTo(0, canvas.height, 0, 0, cornerRadius);
  //   context.arcTo(0, 0, canvas.width, 0, cornerRadius);
  //   context.closePath();
  //   context.fill();

  //   // Display the captured image
  //   canvas.style.display = 'block';
  // };

  // Fetch the gender options from the API

  const fetchGenders = async () => {
    try {
      const response = await axbe.get(`/fieldValues/genders`, {
        headers: {
          Authorization: `Bearer ${tokenPi}`
        }
      });

      // Set the gender options to the state
      setGenders(response.data.data); // assuming response.data is an array of gender options
    } catch (error) {
      // setError('Failed to fetch gender data');
      console.error('Error fetching gender options:', error);
    }
  };

  console.log('Genders:', genders);

  // Handle gender selection change
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  // Fetch the gender options from the API
  const fetchLanguages = async () => {
    try {
      const response = await axbe.get(`/fieldValues/languages`, {
        headers: {
          Authorization: `Bearer ${tokenPi}`
        }
      });

      // Set the gender options to the state
      setLanguages(response.data.data); // assuming response.data is an array of gender options
    } catch (error) {
      // setError('Failed to fetch gender data');
      console.error('Error fetching gender options:', error);
    }
  };

  // Handle gender selection change
  const handleLanguageChange = (event) => {
    const selectedLanguageId = event.target.value;
    setLanguage(event.target.value);
  };
  const fetchRelationships = async () => {
    try {
      const response = await axbe.get(
        `/fieldValues/emergencyContactRelationships`,
        {
          headers: {
            Authorization: `Bearer ${tokenPi}`
          }
        }
      );

      // Set the gender options to the state
      setRelationshipData(response.data.data);
      // setRelationshipDataIns(response.data.data);
    } catch (error) {
      // setError('Failed to fetch gender data');
      console.error('Error fetching gender options:', error);
    }
  };

  const fetchRelationshipsIns = async () => {
    try {
      const response = await axbe.get(`/fieldValues/relationships`, {
        headers: {
          Authorization: `Bearer ${tokenPi}`
        }
      });

      // Set the gender options to the state
      // setRelationshipData(response.data.data);
      setRelationshipDataIns(response.data.data);
    } catch (error) {
      // setError('Failed to fetch gender data');
      console.error('Error fetching gender options:', error);
    }
  };
  const handleRelationshipChange = (event) => {
    const { value } = event.target;
    setRelationship(value);

    // Check and clear validation errors for 'relationship' field
    setValidationErrors((prevErrors) => {
      const { relationship, ...rest } = prevErrors; // Remove the relationship error if it exists
      return !value
        ? { ...rest, relationship: 'Relationship to Patient is required' }
        : rest;
    });
  };
  const handleRelationshipChangeIns = (event) => {
    setRelationshipIns(event.target.value);
  };
  const fetchStates = async () => {
    try {
      const response = await axbe.get(`/fieldValues/states`, {
        headers: {
          Authorization: `Bearer ${tokenPi}`
        }
      });

      // Set the gender options to the state
      setStatesData(response.data.data); // assuming response.data is an array of gender options
    } catch (error) {
      // setError('Failed to fetch gender data');
      console.error('Error fetching gender options:', error);
    }
  };
  const handleStatesChange = (event) => {
    setStates(event.target.value);
  };

  // useEffect(() => {
  const fetchAgreements = async () => {
    try {
      const response = await axbe.get(`/agreement/getAgreementPi`, {
        headers: {
          Authorization: `Bearer ${tokenPi}`
        }
      });
      setAgreements(response.data.data);
      // Initialize checkbox states based on the agreements fetched
      const initialStates = response.data.data.reduce((acc, agreement) => {
        acc[agreement.title] = false;
        return acc;
      }, {});
      setAgreementStates(initialStates);
    } catch (error) {
      console.error('Error fetching agreements:', error);
    }
  };

  // }, []);

  const debouncedSearch = debounce(async (query) => {
    try {
      const response = await axbe.get(`/eligibility-inquiry/getPayerCode`, {
        headers: {
          Authorization: `Bearer ${tokenPi}`
        },
        params: {
          PayerName: query // Send the typed payer name as a query parameter
        }
      }); // Use the artistFilter API
      setPayerCodes(response.data.data); // Update with your response structure
    } catch (error) {
      console.error('Error fetching payer codes:', error);
    }
  }, 300);

  useEffect(() => {
    if (payerNameQuery) {
      debouncedSearch(payerNameQuery);
    } else {
      setPayerCodes([]); // Clear the list when the search term is empty
    }

    // Cleanup the debounce on unmount
    return () => {
      debouncedSearch.cancel();
    };
  }, [payerNameQuery]);
  // Handle input change in the Autocomplete field
  const handlePayerNameChange = (event, newInputValue) => {
    setPayerNameQuery(newInputValue); // Update input value
  };

  // Handle option selection from the dropdown
  const handlePayerCodeChange = (event, newValue) => {
    setSelectedPayerCode(newValue); // Set the selected payer code
  };

  // Fetch genders when the component mounts

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 200, // Set max height for the dropdown
        width: 250 // Set width of the dropdown (optional)
      }
    }
  };

  console.log(dateOfBirth, 'ins dob');
  const formattedDateOfBirthOfIns = dateOfBirth
    ? (() => {
        // Check if it's a Date object
        if (dateOfBirth instanceof Date && !isNaN(dateOfBirth)) {
          return dateOfBirth.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }

        // Check if it's a string that can be parsed into a Date
        if (typeof dateOfBirth === 'string') {
          const parsedDate = new Date(dateOfBirth);
          if (!isNaN(parsedDate)) {
            return parsedDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
          }
        }

        // If neither, return null
        return null;
      })()
    : null; // Return null if dateOfBirth is falsy

  console.log(formattedDateOfBirthOfIns, 'iiiins');

  const handleSubmit = async () => {
    if (step === 11 && !confirmationChecked) {
      setSnackbarMessage(
        t('Please confirm the details are correct before proceeding')
      );
      setSnackbarOpen(true);
      return;
    }
    console.log('is clicked');
    console.log('Submit button clicked in child, API call triggered in parent');
    // setLoading(true);
    try {
      console.log('clicked');

      // const tokenPi = localStorage.getItem('tokenPi');
      // const tokenPi = tokenPi;
      // const formattedDateOfBirth = selectedDate
      //   ? selectedDate.toISOString().split('T')[0]
      //   : '';
      // const formattedDateOfBirthOfIns = dateOfBirth
      //   ? dateOfBirth?.toISOString()?.includes('T')
      //     ? dateOfBirth.toISOString().split('T')[0]
      //     : dateOfBirth
      //   : dateOfBirth;

      // const formattedDateOfBirthOfIns = dateOfBirth
      // ? (dateOfBirth instanceof Date && !isNaN(dateOfBirth))
      //   ? dateOfBirth.toISOString().split('T')[0]  // If it's a Date object, format as YYYY-MM-DD
      //   : typeof dateOfBirth === 'string'
      //     ? dateOfBirth  // If it's already a string, return as is
      //     : null  // If it's neither, return null (optional handling for invalid cases)
      // : null;  // Return null if dateOfBirth is falsy (null or undefined)

      const base64ToFixedSizeBlobFront = (
        base64Data,
        contentType,
        fixedWidth,
        fixedHeight
      ) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = base64Data;

          img.onload = () => {
            const canvas = document.createElement('canvas');
            const width = fixedWidth; // Set fixed width
            const height = fixedHeight; // Set fixed height

            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            // Draw the image on the canvas with fixed dimensions
            ctx.drawImage(img, 0, 0, width, height);
            const resizedBase64 = canvas.toDataURL(contentType);
            resolve(resizedBase64);
          };
        });
      };

      // const frontImageBlob = await base64ToFixedSizeBlobFront(
      //   capturedFrontImageForAPI,
      //   'image/jpeg',
      //   // 300,
      //   // 200
      // );

      // const backImageBlob = await base64ToFixedSizeBlobFront(
      //   capturedBackImageForAPI,
      //   'image/jpeg',
      //   // 300,
      //   // 200
      // );

      const stripPhoneNumber = (phoneNumber) => {
        return phoneNumber.replace(/\D/g, ''); // Removes all non-numeric characters
      };

      const headersPayload = {
        // personal details
        patientFname: addingData.firstName,
        patientMname: addingData.middleName,
        patientLname: addingData.lastName,
        patientDob: selectedDate
          ? dayjs(selectedDate).format('YYYY-MM-DD')
          : '',
        patientGender: gender,
        patientPreferredLanguage: language,
        // emr_doctorId: ,

        // address
        patientStreetName: addingData.streetName,
        patientCity: addingData.city,
        patientState: states,
        patientZipcode: addingData.zipCode,
        patientEmail: addingData.email,
        patientPhNum: phoneNumber,

        // emergency contact
        emergencyContactFirstName: addingData.emergencyFirstname,
        emergencyContactLastName: addingData.emergencyLastname,
        emergencyContactPhNum: addingData.emergencyPhoneNo,
        emergencyContactRelationshipToPatient: relationship,

        // photo_front: data.photoFront, // Assuming you have base64 encoded photo
        // photo_back: data.photoBack, // Assuming you have base64 encoded photo

        // insurance
        primary_insurance: {
          is_subscriber_the_patient: isInsuredPerson ? true : false,
          insurance_id_number: addingData.memberID,
          insurance_group_number: addingData.groupNumber,

          patientSubscriberFirstName: addingData.insFirstName,
          patientSubscriberLastName: addingData.insLastName,
          // patientSubscriberDateOfBirth: isInsuredPerson
          //   ? selectedDate
          //     ? dayjs(selectedDate).format('YYYY-MM-DD')
          //     : ''
          //   : dateOfBirth
          //   ? dayjs(formattedDateOfBirthOfIns).format('YYYY-MM-DD')
          //   : '',
          patientSubscriberDateOfBirth: isInsuredPerson
            ? selectedDate?.format('YYYY-MM-DD')
            : dateOfBirth?.format('YYYY-MM-DD'),
          patientSubscriberRelationship: relationshipIns,
          photo_front: capturedFrontImageForAPI, // Front image in Base64
          photo_back: capturedBackImageForAPI // Back image in Base64
          // photo_front: frontImageBlob, // Front image in Base64
          // photo_back: backImageBlob // Back image in Base64
        },

        // primary care referral
        patientReferralName: addingData.OtherReferralName,
        no_primary_care_physician: showOnlyOtherName,
        referrel_doctor: {
          first_name: addingData.PCPFirstname,
          last_name: addingData.PCPLastname,
          // phone: `+1${addingData.PCPPhoneNo}`,
          phone: stripPhoneNumber(addingData.PCPPhoneNo),
          fax: stripPhoneNumber(addingData.PCPFaxNo)
        }
      };

      // const documentResponse = await axbe.post(`/PatientDocumentUpload`

      // )

      if (generatedPdfUrls.length > 0 && attachmentTitles.length > 0) {
        const formData = new FormData();

        try {
          setDocLoading(true);
          // Loop through the PDF URLs and titles
          for (let index = 0; index < generatedPdfUrls.length; index++) {
            const pdfUrl = generatedPdfUrls[index];
            const title = attachmentTitles[index];
            const formattedTitle = title.replace(/\s+/g, '_'); // Replace all spaces with underscores
            console.log(formattedTitle);
            console.log('title', title);

            // Fetch the Blob from the URL
            const response = await fetch(pdfUrl);
            // const pdfBlob = await response.blob();
            const convertUrlToPdf = await response.blob(); // Convert it to Blob

            // console.log('response pdf');

            // Convert Blob to a File object
            const file = new File([convertUrlToPdf], `${formattedTitle}.pdf`, {
              type: 'application/pdf'
            });
            // const localPdfResponse = await fetch(highsizePdf); // Fetch the local PDF URL
            // const localPdfBlob = await localPdfResponse.blob(); // Convert it to Blob

            // // Convert the Blob to a File object
            // const localPdfFile = new File([localPdfBlob], 'highsizepdf.pdf', {
            //   type: 'application/pdf'
            // });

            // Append the file and the corresponding title to FormData
            formData.append('files', file);
            formData.append('description', title);
          }
          // license image as image
          if (capturedImageForAPI) {
            // Function to convert base64 to a fixed-size Blob using canvas
            const base64ToFixedSizeBlob = (
              base64Data,
              contentType,
              fixedWidth,
              fixedHeight
            ) => {
              return new Promise((resolve) => {
                const img = new Image();
                img.src = base64Data;

                img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const width = fixedWidth; // Set fixed width
                  const height = fixedHeight; // Set fixed height

                  canvas.width = width;
                  canvas.height = height;

                  const ctx = canvas.getContext('2d');
                  // Draw the image on the canvas with fixed dimensions
                  ctx.drawImage(img, 0, 0, width, height);

                  canvas.toBlob((blob) => {
                    resolve(blob);
                  }, contentType);
                };
              });
            };

            // Convert the base64 image to a resized JPEG Blob with fixed size (e.g., 400x400)
            const imageBlob = await base64ToFixedSizeBlob(
              capturedImageForAPI,
              'image/jpeg',
              1080,
              1080
            ); // Set fixed width/height to 400x400

            // Convert Blob to a File object
            const imageFile = new File([imageBlob], 'Driving_License.jpeg', {
              type: 'image/jpeg'
            });

            // Append the JPEG image to the formData
            formData.append('files', imageFile);
            formData.append('description', 'Captured Image');
          }

          // Use axbe to send the form data to the backend
          const res = await axbe.post('/PatientDocumentUpload', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${tokenPi}`
              // Add any authorization headers if required
            }
          });
          if (res.data.status === 201) {
            setDocLoading(false);
            setSnackbarMessageSuccess(t('Documents uploaded successfully!'));
            setSnackbarOpenSuccess(true);
            // toast.success('Documents uploaded successfully!');
            // setLoading(false);
            // setStep(step + 1);
            // setLoading(false);
          } else {
            setDocLoading(false);
            setSnackbarMessage(
              t('Failed to upload documents. Please try again')
            );
            setSnackbarOpen(true);
            // toast.error('Failed to upload documents. Please try again.');
            // setLoading(false);
          }
          // Handle success
          console.log('Success:', res.data);
          // toast.success('Documents uploaded successfully!');
        } catch (error) {
          // Handle error
          console.error('Error sending PDFs to the backend:', error);
          // toast.error('Failed to upload documents. Please try again.');
        }
      }
      // else {
      //   setSnackbarMessage('No PDFs to send');
      //   setSnackbarOpen(true);
      //   // toast.error('No PDFs to send.');
      // }
      try {
        setFormSubmitLoading(true);
        const response = await axbe.put(`/updatePatient`, headersPayload, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokenPi}`
          }
        });

        if (response?.data?.status === 200) {
          setFormSubmitLoading(false);
          // toast.success('Patient created successfully!');
          setStep(step + 1);
        } else if (response?.data?.status === 400) {
          setFormSubmitLoading(false);
          setSnackbarMessage(response?.data?.message);
        } else {
          setFormSubmitLoading(false); // Ensure loader is stopped for other statuses
          setSnackbarMessage('An unexpected error occurred.');
        }
      } catch (error) {
        console.log(error);
        setFormSubmitLoading(false);
        setSnackbarOpen(true);
        setSnackbarMessage(t('Form submission failed. Please try again'));
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message ||
          'Something went wrong. Please try again.'
      );
    }
    // finally {
    //   setLoading(false);
    // }
  };

  const stepIndex = isNewPatient ? step - 3 : step - 1;

  if (loading) {
    return <Loader />; // Show Loader while data is loading
  }
  if (docLoading) {
    return <DocLoader />;
  }
  if (formSubmitLoading) {
    return <FormLoader />;
  }

  return (
    <Box
      // display="flex"
      // flexDirection="column"
      // minHeight="100vh"
      sx={{
        flex: 1,
        height: '100%',

        '.MuiPageTitle-wrapper': {
          background:
            theme.palette.mode === 'dark'
              ? theme.colors.alpha.trueWhite[5]
              : theme.colors.alpha.white[50],
          marginBottom: `${theme.spacing(4)}`,
          boxShadow:
            theme.palette.mode === 'dark'
              ? `0 1px 0 ${alpha(
                  lighten(theme.colors.primary.main, 0.7),
                  0.15
                )}, 0px 2px 4px -3px rgba(0, 0, 0, 0.2), 0px 5px 12px -4px rgba(0, 0, 0, .1)`
              : `0px 2px 4px -3px ${alpha(
                  theme.colors.alpha.black[100],
                  0.1
                )}, 0px 5px 12px -4px ${alpha(
                  theme.colors.alpha.black[100],
                  0.05
                )}`
        }
      }}
    >
      <Header />
      <Box
        flex={1}
        overflow="auto"
        sx={{
          mt: '7vh', // Adds a gap of 5% of the viewport height from the Header
          p: 0.5, // Optional padding inside the Box
          boxSizing: 'border-box' // Ensures padding is included in the element's width and height
        }}
      >
        <Card
          sx={{
            // height: '85vh',
            height: 'auto',
            mt: '2rem',
            // ml: '1.2rem',
            // mr: '1.2rem',
            mx: 1.2,
            overflow: 'hidden',
            paddingBottom: '60px',
            boxShadow: '0px 4px 12px rgba(0.7, 14, 18, 0.5)' // Add box shadow here
          }}
        >
          {step > 2 && (
            <Stepper
              activeStep={stepIndex}
              alternativeLabel
              sx={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                mt: 0.1,
                padding: '15px',
                width: '100%',
                overflowX: 'auto',
                display: 'flex',
                justifyContent: 'flex-start',
                backgroundColor: 'white'
              }}
            >
              {steps.map((label) => (
                <Step
                  key={label}
                  sx={{
                    '& .MuiStepLabel-label': { fontSize: '0.9rem' },
                    '& .MuiSvgIcon-root': { fontSize: '1.2rem' }
                  }}
                >
                  <StepLabel>{}</StepLabel>
                </Step>
              ))}
            </Stepper>
          )}
          <Box display="block">
            {/* Step 1 (Hidden if isNewPatient is true) */}
            {step === 1 && !isNewPatient && (
              <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
              >
                <Grid
                  item
                  xs={12}
                  md={12}
                  mt={3}
                  display={'flex'}
                  justifyContent={'center'}
                  alignContent={'center'}
                >
                  <img
                    src={PIForm_logo}
                    alt="Logo"
                    style={{ width: '70%', height: '40%' }}
                  />
                </Grid>

                <Grid item xs={12} mt={5}>
                  <Typography
                    align="center"
                    gutterBottom
                    style={{ fontSize: '22px' }}
                  >
                    Hello {patientName},
                  </Typography>
                  <Typography variant="h6" align="center" gutterBottom>
                    {t('Welcome to Orthopedic Spine Institute!')}
                  </Typography>
                </Grid>

                <Grid item xs={12} mt={10}>
                  <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                    className="languageText"
                  >
                    {t('Choose your Date of Birth,')}
                  </Typography>
                </Grid>

                <Grid item xs={12} mt={0.3}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      // label="Select Date"
                      label={t('Select Date')}
                      value={selectedDateEx}
                      inputFormat="MM/DD/YYYY"
                      onChange={(newValue) => {
                        setSelectedDateEx(newValue);
                        setDobErrorEx(''); // Reset error when selecting a new date
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="MM/DD/YYYY"
                          error={!!dobErrorEx}
                          helperText={dobErrorEx || params.helperText}
                        />
                      )}
                      minDate={dayjs('1900-01-01')}
                      maxDate={dayjs()}
                    />
                  </LocalizationProvider>
                  {/* {dobErrorEx && (
                    <Typography color="error" variant="body2">
                      {dobErrorEx}
                    </Typography>
                  )} */}
                </Grid>
              </Grid>
            )}

            {step === 2 && !isNewPatient && (
              <Grid
                container
                spacing={2}
                direction="column"
                alignItems="center"
              >
                <Grid item xs={12} mt={2}>
                  <Typography variant="h3" align="center" gutterBottom>
                    Hello {patientName},
                  </Typography>
                  <Typography
                    variant="h6"
                    align="center"
                    gutterBottom
                    className="languageText"
                  >
                    {t('Welcome to Orthopedic Spine Institute!')}
                  </Typography>
                </Grid>

                <Grid item xs={12} mt={15}>
                  <Typography
                    variant="h4"
                    align="center"
                    left={2}
                    gutterBottom
                    sx={{ fontWeight: 'bold' }}
                  >
                    {t('Please confirm your address')}
                  </Typography>
                </Grid>

                <Grid item xs={12} mt={0.3}>
                  <List disablePadding>
                    <RadioGroup
                      value={
                        selectedAddress ? JSON.stringify(selectedAddress) : ''
                      } // Use JSON.stringify for comparison
                      onChange={(e) => {
                        const selectedAddressObject = JSON.parse(
                          e.target.value
                        ); // Parse the selected value
                        setSelectedAddress(selectedAddressObject); // Update selected address
                      }}
                    >
                      {addresses.map((address, index) => (
                        <ListItemButtonWrapper key={index}>
                          <FormControlLabel
                            value={JSON.stringify(address)} // Set value as stringified address
                            control={<Radio />}
                            label={
                              <Typography color="text.primary" variant="body1">
                                {`${address.address}, ${address.city}, ${
                                  address.state
                                } ${address.zipcode || address.zip_code}`}
                              </Typography>
                            }
                          />
                        </ListItemButtonWrapper>
                      ))}
                    </RadioGroup>
                  </List>
                </Grid>

                {/* {addressError && (
            <Grid item xs={12}>
              <Typography variant="body1" color="error">
                {addressError}
              </Typography>
            </Grid>
          )} */}
              </Grid>
            )}

            {/* Step 3-10 (Show only for new patients) */}
            {step === 3 && isNewPatient && (
              <Grid
                container
                spacing={0}
                direction="column"
                alignItems="center"
              >
                <Grid item xs={12} mt={2}>
                  <Typography variant="h4" align="center" gutterBottom>
                    {t("Patient's Driver's License")}
                  </Typography>
                </Grid>

                <Grid item xs={12} mt={0} p={2}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={isUnder16}
                        onChange={(e) => setIsUnder16(e.target.checked)}
                        // className='languageText'

                        sx={{
                          fontSize: { xs: '10px', sm: '12px', md: '16px' }
                        }}
                      />
                    }
                    label={t('If patient age is under 16 click here')}
                  />
                </Grid>

                {!isUnder16 && (
                  <Grid item xs={12} lg={6} mb={5}>
                    {!capturedImage ? (
                      <div
                        style={{
                          border: '2px solid #000',
                          borderRadius: '10px',
                          width: 300,
                          height: 190,
                          pointerEvents: 'none',
                          overflow: 'hidden'
                        }}
                      >
                        {isCameraOpen ? (
                          <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            // id="camera-container"
                            style={{
                              width: 300,
                              height: 190,
                              objectFit: 'cover',
                              borderRadius: '10px'
                            }}
                          />
                        ) : (
                          <img
                            src={placeholderImage} // Placeholder image path
                            alt="Placeholder"
                            style={{
                              width: 300,
                              height: 190,
                              objectFit: 'cover',
                              borderRadius: '10px'
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          // border: '2px solid #000',
                          // borderRadius: '10px',
                          width: 300,
                          height: 190,
                          pointerEvents: 'none'
                          // overflow: 'hidden'
                        }}
                      >
                        <img
                          src={capturedImage}
                          alt="Captured"
                          // style={{
                          //   width: '100%',
                          //   maxWidth: '300px',
                          //   borderRadius: '10px'
                          // }}
                          style={{
                            // width: '100%',
                            width: 300,
                            height: 190,
                            objectFit: 'cover',
                            borderRadius: '10px'
                          }}
                        />
                      </div>
                    )}
                  </Grid>
                )}

                {!isUnder16 && !capturedImage ? (
                  <>
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="inherit"
                        onClick={isCameraOpen ? captureImage : openCamera}
                        sx={{ mt: 2 }}
                      >
                        {isCameraOpen ? t('Capture Photo') : t('Take Photo')}
                      </Button>
                    </Grid>
                  </>
                ) : (
                  !isUnder16 &&
                  !isConfirmed && (
                    <Grid item xs={12}>
                      <Button
                        variant="contained"
                        color="inherit"
                        onClick={retakeImage}
                        sx={{ mt: 1, mr: 2 }}
                        disabled={isConfirmed}
                      >
                        {t(' Re-take')}
                      </Button>
                      <Button
                        variant="contained"
                        color="inherit"
                        onClick={confirmImage}
                        sx={{ mt: 1 }}
                      >
                        {t(' Confirm')}
                      </Button>
                    </Grid>
                  )
                )}
                {isConfirmed && (
                  <Grid item xs={12}>
                    <Button
                      variant="contained"
                      color="inherit"
                      onClick={openCamera} // Reopen the camera to capture another image
                      sx={{ mt: 2 }}
                    >
                      {t(' Capture Photo')}
                    </Button>
                  </Grid>
                )}
              </Grid>
            )}

            {step === 4 &&
              (isNewPatient || existPatFieldsShow === 'PERSONAL_DETAILS') && (
                <Grid
                  container
                  spacing={2}
                  p={3}
                  sx={{
                    maxHeight: 'calc(85vh - 150px)', // Adjusts max height to fit within the card, subtracting space for sticky elements
                    overflowY: 'auto' // Allows vertical scrolling of the content inside the card
                  }}
                  alignItems="center"
                >
                  <Grid item xs={12} mt={2}>
                    <Typography variant="h4" align="center" gutterBottom>
                      {t('Personal Details')}
                    </Typography>
                  </Grid>

                  {isFieldVisible('PersonalDetails', 'firstName') && (
                    <Grid item mt={1} xs={12} sm={6} md={6} lg={6}>
                      <TextField
                        fullWidth
                        label={
                          <>
                            {t('First Name')}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        }
                        variant="outlined"
                        type="text"
                        name="firstName"
                        value={addingData?.firstName}
                        onChange={handleChange}
                        error={!!validationErrors.firstName}
                        helperText={validationErrors.firstName}
                      />
                      {/* {addingData?.errors?.firstName && (
                  <p style={{ color: 'red' }}>
                    {addingData?.errors?.firstName}
                  </p>
                )} */}
                    </Grid>
                  )}

                  {/* Middle Name Input (Optional) */}
                  {isFieldVisible('PersonalDetails', 'middleName') && (
                    <Grid item mt={1} xs={12} sm={6} md={6} lg={6}>
                      <TextField
                        fullWidth
                        label={<>{t('Middle Name')}</>}
                        variant="outlined"
                        type="text"
                        name="middleName"
                        value={addingData?.middleName}
                        onChange={handleChange}
                        error={!!validationErrors.middleName}
                        helperText={validationErrors.middleName}
                      />
                      {/* {addingData?.errors?.middleName && (
                  <p style={{ color: 'red' }}>
                    {addingData?.errors?.middleName}
                  </p>
                )} */}
                    </Grid>
                  )}

                  {/* Last Name Input */}
                  {isFieldVisible('PersonalDetails', 'lastName') && (
                    <Grid item mt={1} xs={12} sm={6} md={6} lg={6}>
                      <TextField
                        fullWidth
                        label={
                          <>
                            {t('Last Name')}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        }
                        variant="outlined"
                        type="text"
                        name="lastName"
                        value={addingData?.lastName}
                        onChange={handleChange}
                        error={!!validationErrors.lastName}
                        helperText={validationErrors.lastName}
                      />
                      {/* {addingData?.errors?.lastName && (
                  <p style={{ color: 'red' }}>{addingData?.errors?.lastName}</p>
                )} */}
                    </Grid>
                  )}

                  {/* Date of Birth Picker */}
                  {isFieldVisible('PersonalDetails', 'dob') && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label={
                            <>
                              {t('Date of Birth')}
                              <RequiredLabel>*</RequiredLabel>
                            </>
                          }
                          value={selectedDate}
                          onChange={handleDateChange}
                          inputFormat="MM/DD/YYYY"
                          maxDate={today} // Prevent future date selection
                          minDate={
                            isUnder16 ? sixteenYearsAgo : dayjs('1900-01-01')
                          }
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              fullWidth
                              placeholder="MM/DD/YYYY"
                              error={!!dateError}
                              helperText={dateError || params.helperText}
                            />
                          )}
                        />
                      </LocalizationProvider>
                    </Grid>
                  )}

                  {/* Email Input */}
                  {isFieldVisible('PersonalDetails', 'email') && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <TextField
                        fullWidth
                        label={
                          <>
                            {t('Email')}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        }
                        variant="outlined"
                        type="email"
                        name="email"
                        value={addingData?.email}
                        onChange={handleChange}
                        error={!!validationErrors.email}
                        helperText={validationErrors.email}
                      />
                      {/* {addingData.errors.email && (
                  <p style={{ color: 'red' }}>{addingData.errors.email}</p>
                )} */}
                    </Grid>
                  )}

                  {/* Phone Number Input */}
                  {isFieldVisible('PersonalDetails', 'phoneNumber') && (
                    // <Grid item xs={12} sm={6} md={6} lg={6}>
                    //   <InputMask
                    //     mask="(999) 999-9999"
                    //     value={phoneNumber}
                    //     onChange={handlePhoneChange}
                    //     onBlur={handlePhoneBlur}
                    //   >
                    //     {(inputProps) => (
                    //       <TextField
                    //         {...inputProps}
                    //         fullWidth
                    //         label={
                    //           <>
                    //             {t('Phone Number')}
                    //             <RequiredLabel>*</RequiredLabel>
                    //           </>
                    //         }
                    //         variant="outlined"
                    //         error={!!phoneError}
                    //         helperText={phoneError}
                    //       />
                    //     )}
                    //   </InputMask>
                    // </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <TextField
                        fullWidth
                        label={
                          <>
                            {t('Phone Number')}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        }
                        name="phoneNumber"
                        value={phoneNumber} // Make sure this comes from your state (e.g., useState)
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);

                          handleChange({
                            target: {
                              name: 'phoneNumber',
                              value: e.target.value
                            }
                          });
                        }}
                        InputProps={{
                          inputComponent: TextMaskCustom // Use the custom mask component here
                        }}
                        error={!!validationErrors.phoneNumber} // Show error if validation fails
                        helperText={validationErrors.phoneNumber} // Display the error text
                      />
                    </Grid>

                    // <Grid item xs={12} sm={6}>
                    //   <TextField
                    //     fullWidth
                    //     label={t('Phone')}
                    //     name="phone"
                    //     value={phoneNumber}
                    //     onChange={handlePhoneChange}
                    //     InputProps={{
                    //       inputComponent: TextMaskCustom
                    //     }}
                    //     // error={!!errors.phone}
                    //     // helperText={errors.phone}
                    //     error={!!phoneError}
                    //     helperText={phoneError}
                    //   />
                    // </Grid>
                  )}

                  {/* Gender Select */}
                  {isFieldVisible('PersonalDetails', 'gender') && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <FormControl fullWidth>
                        <InputLabel>
                          <>
                            {t('Gender')} <RequiredLabel>*</RequiredLabel>
                          </>
                        </InputLabel>
                        <Select
                          fullWidth
                          value={gender}
                          label="Gender"
                          onChange={handleGenderChange}
                          MenuProps={MenuProps}
                        >
                          {genders?.length > 0 ? (
                            genders?.map((genderOption) => (
                              <MenuItem
                                key={genderOption?.id}
                                value={genderOption?.id}
                              >
                                {genderOption?.value}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              {t('No gender options available')}
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}

                  {/* Language Select */}
                  {isFieldVisible('PersonalDetails', 'language') && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <FormControl fullWidth>
                        <InputLabel>
                          <>
                            {t('Preferred Language')}{' '}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        </InputLabel>
                        <Select
                          value={language}
                          label="Preferred Language"
                          onChange={handleLanguageChange}
                          fullWidth
                          MenuProps={MenuProps}
                        >
                          {languages?.length > 0 ? (
                            languages?.map((language) => (
                              <MenuItem key={language?.id} value={language?.id}>
                                {language?.value}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              {t('No languages available')}
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              )}

            {step === 5 &&
              (isNewPatient || existAddFieldsShow === 'ADDRESS_DETAILS') && (
                <Grid
                  container
                  spacing={2}
                  p={3}
                  sx={{
                    maxHeight: 'calc(85vh - 150px)', // Adjusts max height to fit within the card, subtracting space for sticky elements
                    overflowY: 'auto' // Allows vertical scrolling of the content inside the card
                  }}
                  // direction="column"
                  alignItems="center"
                >
                  <Grid item xs={12} mt={2}>
                    <Typography variant="h4" align="center" gutterBottom>
                      {t('Address Details')}
                    </Typography>
                  </Grid>
                  {isFieldVisible('AddressDetails', 'street') && (
                    <Grid item mt={1} xs={12} sm={6} md={6} lg={6}>
                      <TextField
                        fullWidth
                        label={
                          <>
                            {t('Street Name')}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        }
                        variant="outlined"
                        name="streetName" // Ensure the name attribute is set
                        value={addingData?.streetName}
                        onChange={handleChange} // Pass the event directly
                        error={!!validationErrors.streetName}
                        helperText={validationErrors.streetName}
                        // error={!!addingData?.errors?.streetName} // Show error if present
                        // helperText={addingData?.errors?.streetName} // Display error message
                      />
                      {/* {addingData?.errors?.streetName && (
                  <p style={{ color: 'red' }}>
                    {addingData?.errors?.streetName}
                  </p>
                )} */}
                    </Grid>
                  )}
                  {isFieldVisible('AddressDetails', 'city') && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <TextField
                        fullWidth
                        label={
                          <>
                            {t('City')}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        }
                        variant="outlined"
                        name="city" // Ensure the name attribute is set
                        value={addingData?.city}
                        onChange={handleChange} // Use unified handleChange
                        error={!!validationErrors.city}
                        helperText={validationErrors.city}
                        // error={!!addingData?.errors?.city} // Display error if present
                        // helperText={addingData?.errors?.city} // Show error message
                      />
                      {/* {addingData?.errors?.city && (
                  <p style={{ color: 'red' }}>{addingData?.errors?.city}</p>
                )} */}
                    </Grid>
                  )}
                  {isFieldVisible('AddressDetails', 'state') && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <FormControl fullWidth>
                        <InputLabel>
                          <>
                            {t('State')}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        </InputLabel>
                        <Select
                          value={states}
                          label="State"
                          onChange={handleStatesChange}
                          // sx={{ minWidth: '100%' }}
                          fullWidth
                          MenuProps={MenuProps} // Apply the custom menu props for scrollable behavior
                        >
                          {/* .filter((state) => state?.id === addingData?.states) */}
                          {statesData?.length > 0 ? (
                            statesData?.map((state) => (
                              <MenuItem key={state?.id} value={state?.id}>
                                {state?.value}{' '}
                                {/* assuming genderOption has 'id' and 'name' */}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              {t('No states available')}
                            </MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  )}
                  {isFieldVisible('AddressDetails', 'zipCode') && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <TextField
                        fullWidth
                        label={
                          <>
                            {t('Zip Code')}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        }
                        variant="outlined"
                        type="text"
                        name="zipCode"
                        value={addingData?.zipCode}
                        onChange={handleChange}
                        error={!!validationErrors.zipCode}
                        helperText={validationErrors.zipCode}
                        // required // This makes the field mandatory
                      />
                      {/* {addingData?.errors?.zipCode && (
                  <p style={{ color: 'red' }}>{addingData?.errors?.zipCode}</p>
                )} */}
                    </Grid>
                  )}
                </Grid>
              )}

            {step === 6 &&
              (isNewPatient || existInsFieldsShow === 'INSURANCE_DETAILS') && (
                <Grid
                  container
                  direction={isMobileScreen ? 'column' : 'row'}
                  justifyContent="center"
                  alignItems="center"
                  // sx={{
                  //   // maxHeight: { xs: 'auto', md: 'calc(85vh - 150px)' }, // Handles height for larger screens
                  //   overflowY: 'auto', // Vertical scrolling for larger screens if needed
                  //   padding: { xs: 2, md: 4 } // Padding adjustment for different screens
                  // }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    mt={2}
                    sx={{ textAlign: 'center' }}
                    p={1}
                  >
                    <Typography variant="h5" align="center" gutterBottom>
                      {t('Capture Insurance ID')}
                    </Typography>
                    {/* </Grid> */}

                    {/* <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  mt={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                > */}
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={isInsuredPerson}
                          onChange={(e) => setIsInsuredPerson(e.target.checked)}
                          className="languageText"
                          disabled={!isNewPatient}
                        />
                      }
                      label={t('Insured person is same as the Patient')}
                    />
                  </Grid>

                  {/* Front Image Capture */}
                  <Grid
                    item
                    xs={12}
                    lg={6}
                    mt={1}
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                    alignContent={'center'}
                    gap={1}
                    // display="flex"
                    // justifyContent="center"
                  >
                    <Typography
                      variant="h4"
                      align="center"
                      gutterBottom
                      // className="front-back-jav-text"
                    >
                      {t('Front Side')}
                    </Typography>

                    {/* <Grid
                    item
                    xs={12}
                    sm={6}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  > */}
                    {!capturedFrontImage ? (
                      <div
                        style={{
                          border: '2px solid #000',
                          borderRadius: '10px',
                          width: 300,
                          height: 190,
                          pointerEvents: 'none',
                          overflow: 'hidden'
                        }}
                      >
                        {isCameraOpenFront ? (
                          <Webcam
                            audio={false}
                            ref={webcamFrontRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            style={{
                              width: 300,
                              height: 190,
                              objectFit: 'cover',
                              borderRadius: '10px'
                            }}
                          />
                        ) : (
                          <img
                            src={InsFront} // Placeholder image path
                            alt="Placeholder"
                            style={{
                              width: 300,
                              height: 190,
                              objectFit: 'cover',
                              borderRadius: '10px'
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          // border: '2px solid #000',
                          // borderRadius: '10px',
                          width: 300,
                          height: 190,
                          pointerEvents: 'none'
                          // overflow: 'hidden'
                        }}
                      >
                        <img
                          src={capturedFrontImage}
                          alt="Captured Front"
                          style={{
                            // width: '100%',
                            width: 300,
                            height: 190,
                            objectFit: 'cover',
                            borderRadius: '10px'
                          }}
                        />
                      </div>
                    )}
                    {/* </Grid> */}

                    {/* Front Image Buttons */}
                    {!capturedFrontImage ? (
                      // <Grid
                      //   item
                      //   xs={12}
                      //   display="flex"
                      //   justifyContent="center"
                      //   sx={{ mt: 2 }}
                      // >
                      <Box display="flex" justifyContent="center">
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={
                            isCameraOpenFront
                              ? captureFrontImage
                              : openCameraFront
                          }
                        >
                          {isCameraOpenFront
                            ? t('Capture Photo')
                            : t('Take Photo')}
                        </Button>
                      </Box>
                    ) : // </Grid>
                    !disableRetakeFront ? (
                      // <Grid
                      //   item
                      //   xs={12}
                      //   display="flex"
                      //   justifyContent="center"
                      //   gap={2}
                      // >
                      <Box
                        display="flex"
                        justifyContent="center"
                        // mt={0.2}
                        gap={1}
                      >
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={retakeFrontImage}
                          // sx={{ mt: 1 }}
                        >
                          {t('Re-take')}
                        </Button>
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={confirmFrontImage}
                          // sx={{ mt: 1 }}
                        >
                          {t('Confirm')}
                        </Button>
                      </Box>
                    ) : (
                      // </Grid>
                      // <Grid
                      //   item
                      //   xs={12}
                      //   display="flex"
                      //   justifyContent="center"
                      //   sx={{ mt: 2 }}
                      // >
                      <Box display="flex" justifyContent="center">
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={openCameraFront}
                        >
                          {t('Capture Photo')}
                        </Button>
                      </Box>
                      // </Grid>
                    )}
                  </Grid>

                  {/* Back Image Capture */}
                  <Grid
                    item
                    xs={12}
                    lg={6}
                    mt={2.4}
                    display={'flex'}
                    flexDirection={'column'}
                    alignItems={'center'}
                    alignContent={'center'}
                    gap={1}
                  >
                    <Typography variant="h4" align="center" gutterBottom>
                      {t('Back Side')}
                    </Typography>

                    {/* <Grid
                    item
                    xs={12}
                    sm={6}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                  > */}
                    {!capturedBackImage ? (
                      <div
                        style={{
                          border: '2px solid #000',
                          borderRadius: '10px',
                          width: 300,
                          height: 190,
                          pointerEvents: 'none',
                          overflow: 'hidden'
                        }}
                      >
                        {isCameraOpenBack ? (
                          <Webcam
                            audio={false}
                            ref={webcamBackRef}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            style={{
                              width: 300,
                              height: 190,
                              objectFit: 'cover',
                              borderRadius: '10px'
                            }}
                          />
                        ) : (
                          <img
                            src={InsBack}
                            alt="Placeholder"
                            style={{
                              width: 300,
                              height: 190,
                              objectFit: 'cover',
                              borderRadius: '10px'
                            }}
                          />
                        )}
                      </div>
                    ) : (
                      <div
                        style={{
                          // border: '2px solid #000',
                          // borderRadius: '10px',
                          width: 300,
                          height: 190,
                          pointerEvents: 'none'
                          // overflow: 'hidden'
                        }}
                      >
                        <img
                          src={capturedBackImage}
                          alt="Captured Back"
                          style={{
                            // width: '100%',
                            width: 300,
                            height: 190,
                            objectFit: 'cover',
                            borderRadius: '10px'
                          }}
                        />
                      </div>
                    )}
                    {/* </Grid> */}

                    {/* Back Image Buttons */}
                    {!capturedBackImage ? (
                      // <Grid
                      //   item
                      //   xs={12}
                      //   display="flex"
                      //   justifyContent="center"
                      //   sx={{ mt: 2 }}
                      // >
                      <Box display="flex" justifyContent="center">
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={
                            isCameraOpenBack ? captureBackImage : openCameraBack
                          }
                        >
                          {isCameraOpenBack
                            ? t('Capture Photo')
                            : t('Take Photo')}
                        </Button>
                      </Box>
                    ) : // </Grid>
                    !disableRetakeBack ? (
                      // <Grid
                      //   item
                      //   xs={12}
                      //   display="flex"
                      //   justifyContent="center"
                      //   gap={2}
                      // >
                      <Box
                        display="flex"
                        justifyContent="center"
                        // mt={0.2}
                        gap={1}
                      >
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={retakeBackImage}
                          // sx={{ mt: 1 }}
                        >
                          {t('Re-take')}
                        </Button>
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={confirmBackImage}
                          // sx={{ mt: 1 }}
                        >
                          {t('Confirm')}
                        </Button>
                      </Box>
                    ) : (
                      // </Grid>
                      // <Grid
                      //   item
                      //   xs={12}
                      //   display="flex"
                      //   justifyContent="center"
                      //   sx={{ mt: 2 }}
                      // >
                      <Box display="flex" justifyContent="center">
                        <Button
                          variant="contained"
                          color="inherit"
                          onClick={openCameraBack}
                        >
                          {t('Capture Photo')}
                        </Button>
                      </Box>
                      // </Grid>
                    )}
                  </Grid>
                </Grid>
              )}
            {step === 7 &&
              (isNewPatient || existInsFieldsShow === 'INSURANCE_DETAILS') && (
                <Grid
                  container
                  spacing={2}
                  p={3}
                  sx={{
                    maxHeight: 'calc(85vh - 150px)', // Adjusts max height to fit within the card, subtracting space for sticky elements
                    overflowY: 'auto' // Allows vertical scrolling of the content inside the card
                  }}
                  // direction="column"
                  alignItems="center"
                >
                  <Grid item xs={12} mt={2}>
                    <Typography variant="h4" align="center" gutterBottom>
                      {t('Insurance Details')}
                    </Typography>
                  </Grid>

                  {isInsuredPerson ? (
                    // Fields for Insured Person
                    <>
                      {isFieldVisible('InsuranceDetails', 'payerName') && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <Autocomplete
                            options={payerCodes} // Options from API
                            getOptionLabel={(option) =>
                              option?.PayerCode && option?.PayerName
                                ? `${option?.PayerName}  (${option?.PayerCode})` // Display PayerCode - PayerName
                                : ''
                            }
                            value={selectedPayerCode} // Selected value from the dropdown
                            onChange={handlePayerCodeChange} // Handle option selection
                            inputValue={payerNameQuery} // The value of the input field
                            onInputChange={handlePayerNameChange} // Handle input changes
                            loading={loading} // Show loader when API is fetching data
                            // Show "Search" if no data has been fetched yet (before user interaction or input)
                            noOptionsText={'Search'}
                            // Custom text while loading data
                            loadingText="Loading options..."
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  <>
                                    {t('Payer Name')}
                                    <RequiredLabel>*</RequiredLabel>
                                  </>
                                }
                                placeholder={t('Search by Payer Code')}
                                variant="outlined"
                                fullWidth
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {loading ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  )
                                }}
                              />
                            )}
                            isOptionEqualToValue={
                              (option, value) =>
                                option?.PayerCode === value?.PayerCode // Ensure the correct comparison between options
                            }
                          />
                        </Grid>
                      )}
                      {isFieldVisible('InsuranceDetails', 'groupNumber') && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <TextField
                            label={
                              <>
                                {t('Group Number')}
                                <RequiredLabel>*</RequiredLabel>
                              </>
                            }
                            variant="outlined"
                            fullWidth
                            name="groupNumber"
                            value={addingData?.groupNumber}
                            onChange={handleChange}
                            error={!!validationErrors.groupNumber}
                            helperText={validationErrors.groupNumber}
                            // error={!!addingData?.errors?.groupNumber}
                            // helperText={addingData?.errors?.groupNumber}
                            inputProps={{ maxLength: 35 }} // Enforce max length
                          />
                        </Grid>
                      )}
                      {isFieldVisible('InsuranceDetails', 'MemberId') && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <TextField
                            label={
                              <>
                                {t('Member ID')}
                                <RequiredLabel>*</RequiredLabel>
                              </>
                            }
                            variant="outlined"
                            fullWidth
                            name="memberID"
                            value={addingData?.memberID}
                            onChange={handleChange}
                            error={!!validationErrors.memberID}
                            helperText={validationErrors.memberID}
                            // error={!!addingData?.errors?.memberID}
                            // helperText={addingData?.errors?.memberID}
                            inputProps={{ maxLength: 35 }} // Enforce max length
                          />
                        </Grid>
                      )}
                    </>
                  ) : (
                    // Fields for Non-Insured Person
                    <>
                      {isFieldVisible('InsuranceDetails', 'payerName') && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <Autocomplete
                            options={payerCodes} // Options from API
                            getOptionLabel={(option) =>
                              option?.PayerCode && option?.PayerName
                                ? `${option?.PayerName}  (${option?.PayerCode})` // Display PayerCode - PayerName
                                : ''
                            }
                            value={selectedPayerCode} // Selected value from the dropdown
                            onChange={handlePayerCodeChange} // Handle option selection
                            inputValue={payerNameQuery} // The value of the input field
                            onInputChange={handlePayerNameChange} // Handle input changes
                            noOptionsText="No results found"
                            loading={loading} // Show loader when API is fetching data
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                label={
                                  <>
                                    {t('Payer Name')}
                                    <RequiredLabel>*</RequiredLabel>
                                  </>
                                }
                                variant="outlined"
                                fullWidth
                                placeholder={t('Search by Payer Name...')}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {loading ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  )
                                }}
                              />
                            )}
                            isOptionEqualToValue={
                              (option, value) =>
                                option?.PayerCode === value?.PayerCode // Ensure the correct comparison between options
                            }
                          />
                        </Grid>
                      )}
                      {isFieldVisible('InsuranceDetails', 'groupNumber') && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <TextField
                            label={
                              <>
                                {t('Group Number')}
                                <RequiredLabel>*</RequiredLabel>
                              </>
                            }
                            variant="outlined"
                            fullWidth
                            name="groupNumber"
                            value={addingData?.groupNumber}
                            onChange={handleChange}
                            error={!!validationErrors.groupNumber}
                            helperText={validationErrors.groupNumber}
                            // error={!!addingData?.errors?.groupNumber}
                            // helperText={addingData?.errors?.groupNumber}
                            inputProps={{ maxLength: 35 }} // Enforce max length
                          />
                        </Grid>
                      )}
                      {isFieldVisible('InsuranceDetails', 'MemberId') && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <TextField
                            label={
                              <>
                                {t('Member ID')}
                                <RequiredLabel>*</RequiredLabel>
                              </>
                            }
                            variant="outlined"
                            fullWidth
                            name="memberID"
                            value={addingData?.memberID}
                            onChange={handleChange}
                            error={!!validationErrors.memberID}
                            helperText={validationErrors.memberID}
                            // error={!!addingData?.errors?.memberID}
                            // helperText={addingData?.errors?.memberID}
                            inputProps={{ maxLength: 35 }} // Enforce max length
                          />
                        </Grid>
                      )}
                      {isFieldVisible(
                        'InsuranceDetails',
                        'patientsubscriberFirstName'
                      ) && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <TextField
                            label={
                              <>
                                {t('First Name')}
                                <RequiredLabel>*</RequiredLabel>
                              </>
                            }
                            variant="outlined"
                            fullWidth
                            name="insFirstName"
                            value={addingData?.insFirstName}
                            onChange={handleChange}
                            error={!!validationErrors.insFirstName}
                            helperText={validationErrors.insFirstName}
                            // error={!!addingData?.errors?.insFirstName}
                            // helperText={addingData?.errors?.insFirstName}
                            inputProps={{ maxLength: 35 }} // Enforce max length
                          />
                        </Grid>
                      )}
                      {isFieldVisible(
                        'InsuranceDetails',
                        'patientsubscriberLastName'
                      ) && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <TextField
                            label={
                              <>
                                {t('Last Name')}
                                <RequiredLabel>*</RequiredLabel>
                              </>
                            }
                            variant="outlined"
                            fullWidth
                            name="insLastName"
                            value={addingData?.insLastName}
                            onChange={handleChange}
                            error={!!validationErrors.insLastName}
                            helperText={validationErrors.insLastName}
                            // error={!!addingData?.errors?.insLastName}
                            // helperText={addingData?.errors?.insLastName}
                            inputProps={{ maxLength: 35 }} // Enforce max length
                          />
                        </Grid>
                      )}
                      {isFieldVisible(
                        'InsuranceDetails',
                        'patientsubscriberDOB'
                      ) && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label={
                                <>
                                  {t('Date of Birth')}
                                  <RequiredLabel>*</RequiredLabel>
                                </>
                              }
                              value={dateOfBirth}
                              onChange={handleDateChange2}
                              maxDate={today} // Prevent future date selection
                              inputFormat="MM/DD/YYYY"
                              renderInput={(params) => (
                                <TextField
                                  {...params}
                                  fullWidth
                                  placeholder="MM/DD/YYYY"
                                  error={!!dateErrorIns}
                                  helperText={dateErrorIns || params.helperText}
                                />
                              )}
                            />
                          </LocalizationProvider>
                          {/* {addingData?.errors?.dateOfBirth && (
                            <p style={{ color: 'red' }}>
                              {addingData?.errors?.dateOfBirth}
                            </p>
                          )} */}
                        </Grid>
                      )}
                      {isFieldVisible(
                        'InsuranceDetails',
                        'patientsubscriberRelationShip'
                      ) && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <FormControl fullWidth>
                            <InputLabel>
                              <>
                                {t('Relationship')}
                                <RequiredLabel>*</RequiredLabel>
                              </>
                            </InputLabel>
                            <Select
                              value={relationshipIns}
                              label="Relationship"
                              onChange={handleRelationshipChangeIns}
                              // sx={{ minWidth: '100%' }}
                              fullWidth
                              MenuProps={MenuProps} // Apply the custom menu props for scrollable behavior
                            >
                              {relationshipDataIns?.length > 0 ? (
                                relationshipDataIns?.map((relation) => (
                                  <MenuItem
                                    key={relation?.id}
                                    value={relation?.id}
                                  >
                                    {relation?.value}{' '}
                                    {/* assuming genderOption has 'id' and 'name' */}
                                  </MenuItem>
                                ))
                              ) : (
                                <MenuItem disabled>
                                  {t('No relationship available')}
                                </MenuItem>
                              )}
                            </Select>
                          </FormControl>
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              )}
            {step === 8 &&
              (isNewPatient || existEmgFieldsShow === 'EMERGENCY_DETAILS') && (
                <Grid
                  container
                  spacing={2}
                  // direction="column"
                  alignItems="center"
                  p={3}
                  sx={{
                    maxHeight: 'calc(85vh - 150px)', // Adjusts max height to fit within the card, subtracting space for sticky elements
                    overflowY: 'auto' // Allows vertical scrolling of the content inside the card
                  }}
                  // mt={2}
                >
                  <Grid item xs={12} mt={2}>
                    <Typography variant="h4" align="center" gutterBottom>
                      {t('Emergency Details')}
                    </Typography>
                  </Grid>
                  {isFieldVisible(
                    'EmergencyDetails',
                    'emergencyContactFirstName'
                  ) && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <TextField
                        label={
                          <>
                            {t('First Name')}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        }
                        variant="outlined"
                        fullWidth
                        type="text"
                        name="emergencyFirstname"
                        value={addingData?.emergencyFirstname}
                        onChange={handleChange}
                        error={!!validationErrors.emergencyFirstname}
                        helperText={validationErrors.emergencyFirstname}
                      />
                      {/* {addingData?.errors?.emergencyFirstname && (
                  <p style={{ color: 'red' }}>
                    {addingData?.errors?.emergencyFirstname}
                  </p>
                )} */}
                    </Grid>
                  )}
                  {isFieldVisible(
                    'EmergencyDetails',
                    'emergencyContactLastName'
                  ) && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <TextField
                        label={
                          <>
                            {t('Last Name')}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        }
                        variant="outlined"
                        fullWidth
                        type="text"
                        name="emergencyLastname"
                        value={addingData?.emergencyLastname}
                        onChange={handleChange}
                        error={!!validationErrors.emergencyLastname}
                        helperText={validationErrors.emergencyLastname}
                      />
                      {/* {addingData?.errors?.emergencyLastname && (
                  <p style={{ color: 'red' }}>
                    {addingData?.errors?.emergencyLastname}
                  </p>
                )} */}
                    </Grid>
                  )}
                  {isFieldVisible(
                    'EmergencyDetails',
                    'emergencyContactPhNum'
                  ) && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <InputMask
                        mask="(999) 999-9999"
                        value={addingData?.emergencyPhoneNo}
                        onChange={(e) =>
                          handleChange({
                            target: {
                              name: 'emergencyPhoneNo',
                              value: e.target.value
                            }
                          })
                        }
                        onBlur={handleBlur} // Trigger validation when user leaves the field
                      >
                        {(inputProps) => (
                          <TextField
                            {...inputProps}
                            fullWidth
                            label={
                              <>
                                {t('Contact Number')}
                                <RequiredLabel>*</RequiredLabel>
                              </>
                            }
                            variant="outlined"
                            error={
                              !!touchedFields.emergencyPhoneNo &&
                              !!validationErrors.emergencyPhoneNo
                            } // Only show error if field is touched
                            helperText={
                              touchedFields.emergencyPhoneNo
                                ? validationErrors.emergencyPhoneNo
                                : ''
                            } // Show helper text if field is touched
                            name="emergencyPhoneNo"
                          />
                        )}
                      </InputMask>
                    </Grid>
                  )}
                  {isFieldVisible(
                    'EmergencyDetails',
                    'emergencyContactRelationshipToPatient'
                  ) && (
                    <Grid item xs={12} sm={6} md={6} lg={6}>
                      <FormControl
                        fullWidth
                        error={!!validationErrors.relationship}
                      >
                        <InputLabel>
                          <>
                            {t('Relationship ')}
                            <RequiredLabel>*</RequiredLabel>
                          </>
                        </InputLabel>
                        <Select
                          value={relationship}
                          label="Relationship"
                          name="relationship"
                          onChange={handleRelationshipChange}
                          fullWidth
                          MenuProps={MenuProps} // Apply the custom menu props for scrollable behavior
                        >
                          {relationshipData?.length > 0 ? (
                            relationshipData.map((relation) => (
                              <MenuItem
                                key={relation?.id}
                                value={relation?.value}
                              >
                                {relation?.value}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem disabled>
                              {t('No relationship available')}
                            </MenuItem>
                          )}
                        </Select>
                        {validationErrors.relationship && (
                          <FormHelperText>
                            {validationErrors.relationship}
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  )}
                </Grid>
              )}
            {step === 9 &&
              (isNewPatient || existRefFieldsShow === 'REFERRAL_DETAILS') && (
                <Grid
                  container
                  spacing={2}
                  alignItems="center"
                  p={3}
                  sx={{
                    maxHeight: 'calc(85vh - 150px)', // Adjusts max height to fit within the card, subtracting space for sticky elements
                    overflowY: 'auto' // Allows vertical scrolling of the content inside the card
                  }}
                >
                  <Grid item xs={12} mt={2}>
                    <Typography variant="h4" align="center" gutterBottom>
                      {t('Primary Care Physician')}
                    </Typography>
                  </Grid>
                  <Grid container justifyContent="center" alignItems="center">
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={showOnlyOtherName}
                          onChange={handleCheckboxChange2}
                        />
                      }
                      label={t('No Primary Care Physician')}
                    />
                  </Grid>

                  {showOnlyOtherName ? (
                    // Render only "Other Referral Name" field if checkbox is checked
                    isFieldVisible('PrimaryCarePhysician', 'ReferralName') && (
                      <Grid item xs={12} sm={6} md={6} lg={6}>
                        <TextField
                          fullWidth
                          // label="Other Referral Name"
                          label={
                            <>
                              {t('Other Referral Name')}
                              <RequiredLabel>*</RequiredLabel>
                            </>
                          }
                          variant="outlined"
                          name="OtherReferralName"
                          value={addingData?.OtherReferralName}
                          onChange={handleChange}
                          error={!!validationErrors.OtherReferralName}
                          helperText={validationErrors.OtherReferralName}
                        />
                        {/* {addingData?.errors?.OtherReferralName && (
                    <p style={{ color: 'red' }}>
                      {addingData?.errors?.OtherReferralName}
                    </p>
                  )} */}
                      </Grid>
                    )
                  ) : (
                    // Render all other fields if checkbox is unchecked
                    <>
                      {isFieldVisible(
                        'PrimaryCarePhysician',
                        'PrimaryCareDoctorFirstName'
                      ) && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <TextField
                            label={
                              <>
                                {t('First Name')}
                                <RequiredLabel>*</RequiredLabel>
                              </>
                            }
                            fullWidth
                            variant="outlined"
                            name="PCPFirstname"
                            value={addingData?.PCPFirstname}
                            onChange={handleChange}
                            error={!!validationErrors.PCPFirstname}
                            helperText={validationErrors.PCPFirstname}
                          />
                          {/* {addingData?.errors?.PCPFirstname && (
                      <p style={{ color: 'red' }}>
                        {addingData?.errors?.PCPFirstname}
                      </p>
                    )} */}
                        </Grid>
                      )}
                      {isFieldVisible(
                        'PrimaryCarePhysician',
                        'PrimaryCareDoctorLastName'
                      ) && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <TextField
                            fullWidth
                            label={
                              <>
                                {t('Last Name')}
                                <RequiredLabel>*</RequiredLabel>
                              </>
                            }
                            variant="outlined"
                            name="PCPLastname"
                            value={addingData?.PCPLastname}
                            onChange={handleChange}
                            error={!!validationErrors.PCPLastname}
                            helperText={validationErrors.PCPLastname}
                          />
                          {/* {addingData?.errors?.PCPLastname && (
                      <p style={{ color: 'red' }}>
                        {addingData?.errors?.PCPLastname}
                      </p>
                    )} */}
                        </Grid>
                      )}
                      {isFieldVisible(
                        'PrimaryCarePhysician',
                        'PrimaryCarePhoneNumber'
                      ) && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <InputMask
                            mask="(999) 999 9999"
                            value={addingData?.PCPPhoneNo}
                            onChange={(e) =>
                              handleChange({
                                target: {
                                  name: 'PCPPhoneNo',
                                  value: e.target.value
                                }
                              })
                            }
                            onBlur={handleBlur} // Trigger validation when user leaves the field
                          >
                            {(inputProps) => (
                              <TextField
                                {...inputProps}
                                fullWidth
                                label={
                                  <>
                                    {t('Physician Contact Number')}
                                    <RequiredLabel>*</RequiredLabel>
                                  </>
                                }
                                variant="outlined"
                                error={
                                  !!touchedFields.PCPPhoneNo &&
                                  !!validationErrors.PCPPhoneNo
                                } // Only show error if field is touched
                                helperText={
                                  touchedFields.PCPPhoneNo
                                    ? validationErrors.PCPPhoneNo
                                    : ''
                                } // Show helper text if field is touched
                                name="PCPPhoneNo"
                              />
                            )}
                          </InputMask>
                        </Grid>
                      )}
                      {isFieldVisible(
                        'PrimaryCarePhysician',
                        'PrimaryCareFaxNumber'
                      ) && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <InputMask
                            mask="(999) 999 9999"
                            value={addingData?.PCPFaxNo}
                            onChange={(e) =>
                              handleChange({
                                target: {
                                  name: 'PCPFaxNo',
                                  value: e.target.value
                                }
                              })
                            }
                            onBlur={handleBlur} // Trigger validation when user leaves the field
                          >
                            {(inputProps) => (
                              <TextField
                                {...inputProps}
                                fullWidth
                                label={
                                  <>
                                    {t('Physician Fax Number')}
                                    <RequiredLabel>*</RequiredLabel>
                                  </>
                                }
                                variant="outlined"
                                error={
                                  !!touchedFields.PCPFaxNo &&
                                  !!validationErrors.PCPFaxNo
                                } // Show error only if field is touched
                                helperText={
                                  touchedFields.PCPFaxNo
                                    ? validationErrors.PCPFaxNo
                                    : ''
                                } // Show helper text only if field is touched
                                name="PCPFaxNo"
                              />
                            )}
                          </InputMask>
                        </Grid>
                      )}
                      {isFieldVisible(
                        'PrimaryCarePhysician',
                        'ReferralName'
                      ) && (
                        <Grid item xs={12} sm={6} md={6} lg={6}>
                          <TextField
                            fullWidth
                            // label="Other Referral Name"
                            label={<>{t('Other Referral Name')}</>}
                            variant="outlined"
                            name="OtherReferralName"
                            value={addingData?.OtherReferralName}
                            onChange={handleChange}
                            error={!!validationErrors.OtherReferralName}
                            helperText={validationErrors.OtherReferralName}
                          />
                          {/* {addingData?.errors?.OtherReferralName && (
                      <p style={{ color: 'red' }}>
                        {addingData?.errors?.OtherReferralName}
                      </p>
                    )} */}
                        </Grid>
                      )}
                    </>
                  )}
                </Grid>
              )}

            {step === 10 && (
              <>
                <Card>
                  {/* Hardcoded accordion for the description */}
                  <Accordion
                    expanded={expandedAccordion === 'Hardcoded'}
                    onChange={handleAccordionChange('Hardcoded')}
                  >
                    <AccordionSummary
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 16px',
                        '& .MuiAccordionSummary-expandIconWrapper': {
                          display: 'none'
                        }
                      }}
                    >
                      <Typography variant="h5" sx={{ flexGrow: 1 }}>
                        End User License Agreement
                      </Typography>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 24,
                          height: 24
                        }}
                      >
                        <ExpandMoreIcon />
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{ p: 0, maxHeight: '200px', overflowY: 'auto' }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          px: { xs: 1, sm: 2 }, // Responsive padding (horizontal)
                          py: { xs: 0.5, sm: 1 }, // Responsive padding (vertical)
                          fontSize: {
                            xs: '12px',
                            sm: '14px',
                            md: '16px',
                            lg: '18px',
                            xl: '20px'
                          } // Responsive font size
                        }}
                      >
                        PLEASE READ THIS END USER LICENSE AGREEMENT (“EULA”)
                        CAREFULLY. YOUR MEDICAL PROVIDER HAS BEEN GRANTED A
                        LICENSE BY SIDHHA AI, INC. ("SAI") TO USE THE SIDDHA PI
                        (THE "SERVICE") TO REGISTER PATIENTS FOR A MEDICAL
                        VISIT. SAI IS WILLING TO GRANT EACH PATIENT ACCESS TO
                        THE SERVICE, BUT ONLY UPON HIS/HER ACCEPTANCE OF THIS
                        EULA. BY CLICKING ON THE "I AGREE" BUTTON, YOU
                        ACKNOWLEDGE THAT YOU HAVE READ THIS EULA, UNDERSTAND IT
                        AND AGREE TO BE BOUND BY IT. IF YOU DO NOT AGREE TO BE
                        BOUND THIS EULA YOU WILL NOT OBTAIN ACCESS TO THE
                        SERVICE.
                      </Typography>

                      <ol>
                        <li
                          style={{
                            fontSize: {
                              xs: '12px',
                              sm: '14px',
                              md: '16px',
                              lg: '18px',
                              xl: '20px'
                            }, // Responsive font size for <li>
                            marginBottom: '10px' // Optional: adds spacing between list items
                          }}
                        >
                          License Grant. SAI grants to you a non-exclusive,
                          non-transferable limited right, pursuant to the terms
                          hereof, to access and use the SERVICE solely for the
                          purpose of registering for your medical visit. You do
                          not receive any, and SAI retains all, ownership rights
                          in the SERVICE. SAI reserves all rights in the SERVICE
                          not expressly granted to you in this EULA.
                        </li>
                        <br />
                        <li
                          style={{
                            fontSize: {
                              xs: '12px',
                              sm: '14px',
                              md: '16px',
                              lg: '18px',
                              xl: '20px'
                            }, // Responsive font size for <li>
                            marginBottom: '10px' // Optional: adds spacing between list items
                          }}
                        >
                          Your Data. You acknowledge that SAI does not collect,
                          host or store any data you provide through the
                          Service. All data you provide through the Service is
                          transmitted directly to your medical provider. All use
                          of your data is governed by your medical provider’s
                          privacy policy and any other medical provider policy.
                        </li>
                        <br />
                        <li
                          style={{
                            fontSize: {
                              xs: '12px',
                              sm: '14px',
                              md: '16px',
                              lg: '18px',
                              xl: '20px'
                            }, // Responsive font size for <li>
                            marginBottom: '10px' // Optional: adds spacing between list items
                          }}
                        >
                          Disclaimer of Warranties. TO THE MAXIMUM EXTENT
                          PERMITTED BY APPLICABLE LAW, THE SERVICE IS PROVIDED
                          "AS IS" WITHOUT ANY WARRANTY OF ANY KIND, AND SAI
                          DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED,
                          INCLUDING WITHOUT LIMITATION, ANY IMPLIED WARRANTIES
                          AS TO QUALITY, PERFORMANCE, TITLE, NONINFRINGEMENT,
                          MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE.
                          YOUR USE OF THE SERVICE UNDER THIS EULA IS SOLELY AT
                          YOUR OWN RISK.
                        </li>
                        <br />
                        <li
                          style={{
                            fontSize: {
                              xs: '12px',
                              sm: '14px',
                              md: '16px',
                              lg: '18px',
                              xl: '20px'
                            }, // Responsive font size for <li>
                            marginBottom: '10px' // Optional: adds spacing between list items
                          }}
                        >
                          Limitation of Liability. NOTWITHSTANDING ANYTHING ELSE
                          IN THIS EULA OR OTHERWISE, TO THE MAXIMUM EXTENT
                          PERMITTED BY APPLICABLE LAW, SAI WILL NOT BE LIABLE TO
                          YOU OR TO ANY THIRD PARTY FOR ANY SPECIAL, INDIRECT,
                          INCIDENTAL, EXEMPLARY OR CONSEQUENTIAL DAMAGES OF ANY
                          KIND ARISING OUT OF THE SERVICE OR THIS EULA, EVEN IF
                          ADVISED OF OR COULD HAVE FORESEEN THE POSSIBILITY OF
                          SUCH DAMAGES. SOME JURISDICTIONS DO NOT ALLOW THE
                          EXCLUSION OR LIMITATION OF INCIDENTAL OR CONSEQUENTIAL
                          DAMAGES, SO THE ABOVE LIMITATION MAY NOT APPLY TO YOU.
                          IN NO EVENT WILL SAI HAVE ANY LIABILITY TO YOU OR ANY
                          THIRD PARTY WHICH IN THE AGGREGATE IS MORE THAN
                          US$100.
                        </li>
                        <br />
                        <li
                          style={{
                            fontSize: {
                              xs: '12px',
                              sm: '14px',
                              md: '16px',
                              lg: '18px',
                              xl: '20px'
                            }, // Responsive font size for <li>
                            marginBottom: '10px' // Optional: adds spacing between list items
                          }}
                        >
                          General. The laws of the State of Illinois will govern
                          this EULA, without reference to its conflicts of law
                          principles. The parties hereby submit to the
                          jurisdiction of, and waive any venue objections
                          against, the State and Federal courts located in
                          Chicago, Illinois. If any provision of this EULA is
                          held to be unenforceable, that provision will be
                          removed and the remaining provisions will remain in
                          full force. The failure of either party to require
                          performance by the other party of any provision hereof
                          will not affect the full right to require such
                          performance at any time thereafter; nor will the
                          waiver by either party of a breach of any provision
                          hereof be taken or held to be a waiver of the
                          provision itself. This EULA is the entire and
                          exclusive agreement between you and SAI with respect
                          to the subject matter hereof.
                        </li>
                      </ol>

                      {/* Add the Checkbox here */}
                      <FormControlLabel
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          m: { xs: 0.5, sm: 1 }, // Responsive margin
                          fontSize: { xs: '12px', sm: '14px', md: '16px' } // Responsive font size for label
                        }}
                        control={
                          <Checkbox
                            checked={isAgreementAccepted} // Controlled by the isAgreementAccepted state
                            onChange={handleAgreementCheckboxChange} // Updates state on change
                          />
                        }
                        label="I agree to the terms and conditions"
                      />
                    </AccordionDetails>
                  </Accordion>

                  <Divider />

                  {/* Dynamically mapped agreements */}
                  {agreements?.map((agreement) => (
                    <React.Fragment key={agreement?._id}>
                      <Accordion
                        expanded={expandedAccordion === agreement?.title} // Control the open/close state
                        onChange={handleAccordionChange(agreement?.title)} // Handle change to track the expanded accordion
                      >
                        <AccordionSummary
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '0 16px',
                            '& .MuiAccordionSummary-expandIconWrapper': {
                              display: 'none'
                            }
                          }}
                        >
                          <Typography variant="h5" sx={{ flexGrow: 1 }}>
                            {agreement?.title}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: 24,
                              height: 24,
                              color: agreementStates[agreement?.title]
                                ? 'green'
                                : 'inherit'
                            }}
                          >
                            {agreementStates[agreement?.title] ? (
                              <CheckCircleOutlineIcon />
                            ) : (
                              <ExpandMoreIcon />
                            )}
                          </Box>
                        </AccordionSummary>
                        <AccordionDetails
                          sx={{ p: 0, maxHeight: '200px', overflowY: 'auto' }}
                        >
                          <Typography variant="body1" sx={{ px: 2, py: 1 }}>
                            <div
                              dangerouslySetInnerHTML={{
                                __html: agreement.body
                              }}
                            />
                          </Typography>
                          <FormControlLabel
                            sx={{
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              m: 1,
                              fontSize: { xs: '12px', sm: '14px', md: '16px' }
                            }}
                            control={
                              <Checkbox
                                checked={agreementStates[agreement?.title]}
                                onChange={handleCheckboxChange(
                                  agreement?.title
                                )}
                              />
                            }
                            label={t('I agree to the terms and conditions')}
                          />
                        </AccordionDetails>
                      </Accordion>
                      <Divider />
                    </React.Fragment>
                  ))}
                </Card>
                {areAllAgreementsSigned && (
                  <Card
                    sx={{
                      marginTop: 2,
                      marginBottom: -8,
                      border: '1px solid #ccc', // Border around the Card
                      borderRadius: 2, // Rounded corners
                      padding: -2 // Add padding around the Card
                    }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ marginTop: 2, textAlign: 'center' }}
                    >
                      {t('Signature')}
                    </Typography>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%'
                      }}
                    >
                      <SignaturePad
                        ref={sigPad} // Assign the ref to the SignaturePad
                        penColor="black"
                        canvasProps={{
                          width: 250,
                          height: 150,
                          className: 'sigCanvas',
                          style: {
                            border: '1px solid #ddd',
                            borderRadius: 1,
                            pointerEvents: isSignatureConfirmed
                              ? 'none'
                              : 'auto'
                          }
                        }}
                      />
                    </div>
                    <Grid
                      container
                      spacing={2}
                      sx={{
                        marginTop: 4,
                        marginBottom: 10,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Grid
                        item
                        xs={6}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Button
                          variant="outlined"
                          color="secondary"
                          onClick={clearSignature}
                          // disabled={isSignaturePadCleared} // Disable if signature pad is cleared
                        >
                          {t('Clear')}
                        </Button>
                      </Grid>
                      <Grid
                        item
                        xs={6}
                        sx={{ display: 'flex', justifyContent: 'center' }}
                      >
                        <Button
                          variant="contained"
                          color={isSignatureConfirmed ? 'success' : 'primary'}
                          onClick={handleConfirm}
                        >
                          {isSignatureConfirmed ? t('Confirmed') : t('Confirm')}
                        </Button>
                      </Grid>
                    </Grid>
                  </Card>
                )}
              </>
            )}
            {step === 11 && (
              <Grid sx={{ overflowY: 'auto', maxHeight: '550px' }}>
                <Block12
                  addingData={addingData}
                  formattedDateOfBirth={selectedDate}
                  gender={gender}
                  language={language}
                  states={states}
                  phoneNumber={phoneNumber}
                  relationship={relationship}
                  formattedDateOfBirthOfIns={dateOfBirth}
                  relationshipIns={relationshipIns}
                  payerNameQuery={payerNameQuery}
                  customForm={customizeForm}
                  generatedPdfUrl={generatedPdfUrls}
                  handleConfirm={handleConfirm}
                  attachementTitle={attachmentTitles}
                  submit={handleSubmit}
                  selectedLanguage={selectedLanguageName}
                  selectedStateName={stateName}
                  selectedRelationShipInsName={relationshipInsName}
                />
              </Grid>
            )}
            {step === 12 && (
              <Grid
                container
                spacing={1}
                display={'flex'}
                justifyContent="center"
                // alignItems="center"
                // sx={{ minHeight: '100vh' }} // Ensures the content is vertically centered
              >
                <Grid item xs={12} lg={6}>
                  <Container
                    maxWidth="md" // Adjust the maxWidth to fit well on all screen sizes
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      // alignItems: 'center', // Horizontally center the content
                      // justifyContent: 'center', // Vertically center the content
                      // textAlign: 'center', // Ensure text is centered
                      top: 0
                    }}
                  >
                    {/* Success Icon */}
                    <img
                      src={animatedIcon}
                      alt="Success Icon"
                      style={{
                        width: '100%', // Make the image responsive
                        // maxWidth: '200px', // Set a max width so it doesn't get too large
                        height: '100%' // Keep the aspect ratio of the image
                        // marginTop: '-5  0px' // Add margin-top for spacing
                      }}
                    />

                    {/* Typography for success message */}
                    <Typography
                      variant="h4"
                      sx={{
                        mt: 4, // Add margin-top for spacing
                        animation: 'fadeInScaleUp 1s ease-in-out',
                        fontSize: { xs: '1.5rem', md: '2rem' } // Responsive font size
                      }}
                    >
                      {t('Successfully submitted your patient intake form!')}
                    </Typography>
                  </Container>
                </Grid>
              </Grid>
            )}
            <Box>
              {/* Center the checkbox box */}
              {step > 2 && step !== 10 && step !== 12 && step !== 11 && (
                <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="100%" // Ensures centering on all screen sizes
                  p={2}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={confirmationChecked}
                        onChange={(e) =>
                          setConfirmationChecked(e.target.checked)
                        }
                        // className='languageText'
                        sx={{
                          fontSize: { xs: '12px', sm: '14px', md: '16px' }
                        }}
                      />
                    }
                    label={t('The above information is correct')}
                  />
                </Box>
              )}

              {/* Outer container to center buttons on large screens */}
              <Box
                display="flex"
                justifyContent="center" // Centers the button container
                alignItems="center"
                width="100%" // Ensures it spans the entire width
                mt="1%" // Adds a responsive gap between checkbox and buttons
              >
                {/* Inner button container with fixed width */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  width="300px"
                  maxWidth="100%" // Keeps the buttons responsive
                >
                  {/* Back Button */}
                  {step > 3 && step < 11 && isNewPatient && (
                    <Button color="inherit" onClick={handleBack}>
                      <WestIcon sx={{ mr: 1 }} />
                      {t('Back')}
                    </Button>
                  )}

                  {/* Placeholder for alignment if Back Button is not displayed */}
                  {!isNewPatient || step <= 3 || step >= 13 ? (
                    <Box flex={1} />
                  ) : null}

                  {/* Next Button */}
                  {!(step === 11 || step === 12) && (
                    <Button
                      color="inherit"
                      onClick={handleNext}
                      sx={{
                        ml: 'auto' // Automatically positions the button to the right
                      }}
                    >
                      {t('Next')}
                      <EastIcon sx={{ ml: 1 }} />
                    </Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000} // Close
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="error"
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>

          <Snackbar
            open={snackbarOpenSuccess}
            autoHideDuration={3000} // Close
            onClose={handleSnackbarCloseSuccess}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          >
            <Alert
              onClose={handleSnackbarCloseSuccess}
              severity="success"
              sx={{ width: '100%' }}
            >
              {snackbarMessageSuccess}
            </Alert>
          </Snackbar>
        </Card>
      </Box>
      <Footer />
    </Box>
  );
}
