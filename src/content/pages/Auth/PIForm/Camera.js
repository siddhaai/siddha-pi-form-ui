import {
  Box,
  Card,
  Typography,
  Grid,
  IconButton,
  styled,
  CardActionArea,
  useTheme,
  alpha,
  Button,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import CakeIcon from '@mui/icons-material/Cake';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { useContext, useState } from 'react';
import Label from 'src/components/Label';
import AuthContext from 'src/contexts/AuthContext';
import { useNavigate } from 'react-router';

const CardWrapper = styled(Box)(
  ({ theme }) => `
           background: ${alpha(theme.colors.primary.main, 0.05)};
      `
);

const CardActionAreaWrapper = styled(CardActionArea)(
  ({ theme }) => `
           text-align: center;
            background: ${alpha(theme.colors.primary.main, 0.03)};
    
            .MuiTouchRipple-root {
              opacity: .2;
            }
      
            .MuiCardActionArea-focusHighlight {
              background: ${theme.colors.primary.main};
            }
      
            &:hover {
              .MuiCardActionArea-focusHighlight {
                opacity: .05;
              }
            }
      `
);

// Block12 Component
function Block12({
  addingData,
  formattedDateOfBirth,
  customForm,
  gender,
  language,
  states,
  phoneNumber,
  relationship,
  payerNameQuery,
  formattedDateOfBirthOfIns,
  // relationshipIns,
  generatedPdfUrl,
  attachementTitle,
  handleConfirm,
  signaturePadData, // Pass signature pad data here
  submit,
  selectedLanguage,
  selectedStateName,
  selectedRelationShipInsName
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const navigate = useNavigate();
  const {
    step,
    setStep,
    logo,
    setLogo,
    setExistPatFieldsShow,
    existPatFieldsShow,
    setExistAddFieldsShow,
    existAddFieldsShow,
    setExistInsFieldsShow,
    existInsFieldsShow,
    setExistEmgFieldsShow,
    existEmgFieldsShow,
    setExistRefFieldsShow,
    existRefFieldsShow,
    shouldReturnToStep11,
    setShouldReturnToStep11,
    isInsuredPerson,
    setIsInsuredPerson,
    confirmationChecked,
    setConfirmationChecked,
    setShowOnlyOtherName,
    showOnlyOtherName,
    customizeForm,
    setSkip,
    setIsSignatureConfirmed
  } = useContext(AuthContext);

  console.log('Block12 component loaded');
  console.log('Received addingData:', addingData);
  console.log('custom form data camera page:', customForm);

  // Guard clause: If no addingData is passed
  if (!addingData) {
    console.error('addingData is null or undefined');
    return <Typography variant="h6">No Data Available</Typography>;
  }

  const date = new Date(formattedDateOfBirth);

  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const dateIns = new Date(formattedDateOfBirthOfIns);
  const formattedDateIns = dateIns.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });

  const handleNavigatePersonalDetails = () => {
    navigate('/');
    setStep(4);
    setExistPatFieldsShow('PERSONAL_DETAILS');
    setShouldReturnToStep11(true);
  };
  const handleNavigateAddressDetails = () => {
    navigate('/');
    setStep(5);
    setExistAddFieldsShow('ADDRESS_DETAILS');
    setShouldReturnToStep11(true);
  };

  const handleNavigateInsuranceDetails = () => {
    navigate('/');
    setStep(6);
    setExistInsFieldsShow('INSURANCE_DETAILS');
    setShouldReturnToStep11(true);
  };

  const handleNavigateEmergencyDetails = () => {
    navigate('/');
    setStep(8);
    setExistEmgFieldsShow('EMERGENCY_DETAILS');
    setShouldReturnToStep11(true);
    setSkip(true);
  };

  const handleNavigateReferralDetails = () => {
    navigate('/');
    setStep(9);
    setExistRefFieldsShow('REFERRAL_DETAILS');
    setShouldReturnToStep11(true);
  };

  const handleNavigateAttachments = () => {
    navigate('/');
    setStep(10);
    setIsSignatureConfirmed(false);
    setShouldReturnToStep11(true);
  };

  const areAllFieldsHidden = (sectionFields) => {
    return sectionFields.every((field) => !field.visibility);
  };

  // Function to get fields for a specific section from customizeForm
  const getSectionFields = (sectionName) => {
    return (
      customizeForm?.fields?.find((section) => section[sectionName])?.[
        sectionName
      ] || []
    );
  };

  // Function to check if a step should be skipped based on field visibility
  const shouldSkipStep = (sectionName) => {
    const sectionFields = getSectionFields(sectionName);
    return areAllFieldsHidden(sectionFields);
  };

  const isFieldVisible = (group, fieldName) => {
    // Ensure customizeForm is loaded and contains fields
    if (!customForm || !customForm.fields) return false;

    // Search for the specific group (e.g., PersonalDetails, AddressDetails) in the fields array
    const fieldGroup = customForm.fields.find((item) => item[group]);

    // If the group exists, search for the field in that group
    if (fieldGroup && fieldGroup[group]) {
      const field = fieldGroup[group].find((item) => item.field === fieldName);
      return field ? field.visibility : false;
    }

    // Return false if the group or field isn't found
    return false;
  };

  // Define personalDetailsMissing and addressDetailsMissing outside the validateFields function
  const personalDetailsMissing =
    (isFieldVisible('PersonalDetails', 'firstName') &&
      !addingData?.firstName) ||
    (isFieldVisible('PersonalDetails', 'lastName') && !addingData?.lastName) ||
    (isFieldVisible('PersonalDetails', 'dob') && !formattedDateOfBirth) ||
    (isFieldVisible('PersonalDetails', 'email') && !addingData?.email) ||
    (isFieldVisible('PersonalDetails', 'phoneNumber') && !phoneNumber) ||
    (isFieldVisible('PersonalDetails', 'gender') && !gender) ||
    (isFieldVisible('PersonalDetails', 'language') && !selectedLanguage);

  const addressDetailsMissing =
    (isFieldVisible('AddressDetails', 'street') && !addingData?.streetName) ||
    (isFieldVisible('AddressDetails', 'city') && !addingData?.city) ||
    (isFieldVisible('AddressDetails', 'state') && !states) ||
    (isFieldVisible('AddressDetails', 'zipCode') && !addingData?.zipCode);

  const insuranceDetailsMissing =
    (isFieldVisible('InsuranceDetails', 'payerName') && !payerNameQuery) ||
    (isFieldVisible('InsuranceDetails', 'groupNumber') &&
      !addingData?.groupNumber) ||
    (isFieldVisible('InsuranceDetails', 'MemberId') && !addingData?.memberID);

  const emergencyDetailsMissing =
    (isFieldVisible('EmergencyDetails', 'emergencyContactFirstName') &&
      !addingData?.emergencyFirstname) ||
    (isFieldVisible('EmergencyDetails', 'emergencyContactLastName') &&
      !addingData?.emergencyLastname) ||
    (isFieldVisible('EmergencyDetails', 'emergencyContactPhNum') &&
      !addingData?.emergencyPhoneNo) ||
    (isFieldVisible(
      'EmergencyDetails',
      'emergencyContactRelationshipToPatient'
    ) &&
      !relationship);

  // const referralDetailsMissing =

  //   isFieldVisible('PrimaryCarePhysician', 'ReferralName') &&
  //   !addingData?.OtherReferralName;

  const validateReferralDetails = () => {
    if (showOnlyOtherName) {
      // Validate ReferralName when showOnlyOtherName is true
      return (
        isFieldVisible('PrimaryCarePhysician', 'ReferralName') &&
        !addingData?.OtherReferralName
      );
    } else {
      // Validate fields when showOnlyOtherName is false
      return (
        (isFieldVisible('PrimaryCarePhysician', 'PrimaryCareDoctorFirstName') &&
          !addingData?.PCPFirstname) ||
        (isFieldVisible('PrimaryCarePhysician', 'PrimaryCareDoctorLastName') &&
          !addingData?.PCPLastname) ||
        (isFieldVisible('PrimaryCarePhysician', 'PrimaryCarePhoneNumber') &&
          !addingData?.PCPPhoneNo) ||
        (isFieldVisible('PrimaryCarePhysician', 'PrimaryCareFaxNumber') &&
          !addingData?.PCPFaxNo)
      );
    }
  };

  // Update referralDetailsMissing to use the validation function
  const referralDetailsMissing = validateReferralDetails();

  // Validation function
  const validateFields = () => {
    if (personalDetailsMissing) {
      setSnackbarMessage(t('Please fill out all fields in Personal Details'));
      setOpenSnackbar(true);
      return true; // Validation failed
    }

    if (addressDetailsMissing) {
      setSnackbarMessage(t('Please fill out all fields in Address Details'));
      setOpenSnackbar(true);
      return true; // Validation failed
    }

    if (insuranceDetailsMissing) {
      setSnackbarMessage(t('Please fill out all fields in Insurance Details'));
      setOpenSnackbar(true);
      return true; // Validation failed
    }

    if (emergencyDetailsMissing) {
      setSnackbarMessage(
        t('Please fill out all fields in Emergency Contact Details')
      );
      setOpenSnackbar(true);
      return true; // Validation failed
    }

    if (referralDetailsMissing) {
      setSnackbarMessage(t('Please fill out all fields in Referral Details'));
      setOpenSnackbar(true);
      return true; // Validation failed
    }

    return false; // All validations passed
  };

  return (
    <Card variant="outlined" className="preview_card" px={2}>
      <CardWrapper
        sx={{
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',
          position: 'relative',
          pt: 1,
          px: 1,
          pb: 4
        }}
      >
        <Typography variant="h4" mt={2}>
          {t('Preview of Patient Intake Form')}
        </Typography>
      </CardWrapper>

      <Box p={2}>
        {/* <Box p={2}> */}
        <Grid container spacing={4}>
          {/* Personal Details */}
          {!shouldSkipStep('PersonalDetails') && (
            <Grid item xs={12} sm={6}>
              <Card
                variant="outlined"
                sx={{
                  borderColor:
                    openSnackbar && personalDetailsMissing
                      ? 'error.main'
                      : 'transparent', // Red border if validation fails
                  borderWidth:
                    openSnackbar && personalDetailsMissing ? '2px' : '1px', // Make the border thicker on error
                  p: 2
                }}
              >
                <CardActionAreaWrapper sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <Typography variant="h4" color={theme.colors.primary.main}>
                      {t('Personal Details')}
                    </Typography>
                    <Button
                      size="small"
                      onClick={handleNavigatePersonalDetails}
                    >
                      <ModeEditOutlineIcon />
                    </Button>
                  </Box>

                  {isFieldVisible('PersonalDetails', 'firstName') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('First Name') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {addingData?.firstName}
                      </Typography>
                    </Box>
                  )}

                  {isFieldVisible('PersonalDetails', 'middleName') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('Middle Name') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {addingData?.middleName}
                      </Typography>
                    </Box>
                  )}

                  {isFieldVisible('PersonalDetails', 'lastName') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('Last Name') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {addingData?.lastName}
                      </Typography>
                    </Box>
                  )}

                  {isFieldVisible('PersonalDetails', 'dob') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        D.O.B:
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {formattedDateOfBirth ? formattedDate : ''}
                      </Typography>
                    </Box>
                  )}

                  {isFieldVisible('PersonalDetails', 'email') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('Email') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {addingData?.email}
                      </Typography>
                    </Box>
                  )}

                  {isFieldVisible('PersonalDetails', 'phoneNumber') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('Phone No') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {phoneNumber}
                      </Typography>
                    </Box>
                  )}

                  {isFieldVisible('PersonalDetails', 'gender') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('Gender') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {gender}
                      </Typography>
                    </Box>
                  )}

                  {isFieldVisible('PersonalDetails', 'language') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('Preferred Language') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {selectedLanguage}
                      </Typography>
                    </Box>
                  )}
                </CardActionAreaWrapper>
              </Card>
            </Grid>
          )}

          {/* Address Details */}
          {!shouldSkipStep('AddressDetails') && (
            <Grid item xs={12} sm={6}>
              <Card
                variant="outlined"
                sx={{
                  borderColor:
                    openSnackbar && addressDetailsMissing
                      ? 'error.main'
                      : 'transparent', // Red border if validation fails
                  borderWidth:
                    openSnackbar && addressDetailsMissing ? '2px' : '1px', // Make the border thicker on error
                  p: 2
                }}
              >
                <CardActionAreaWrapper sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <Typography variant="h4" color={theme.colors.primary.main}>
                      {t('Address Details')}
                    </Typography>
                    <ModeEditOutlineIcon
                      onClick={handleNavigateAddressDetails}
                    />
                  </Box>

                  {isFieldVisible('AddressDetails', 'street') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('Street') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {addingData?.streetName}
                      </Typography>
                    </Box>
                  )}

                  {isFieldVisible('AddressDetails', 'city') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('City') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {addingData?.city}
                      </Typography>
                    </Box>
                  )}

                  {isFieldVisible('AddressDetails', 'state') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('State') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {selectedStateName}
                      </Typography>
                    </Box>
                  )}

                  {isFieldVisible('AddressDetails', 'zipCode') && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('Zip Code') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {addingData?.zipCode}
                      </Typography>
                    </Box>
                  )}
                </CardActionAreaWrapper>
              </Card>
            </Grid>
          )}

          {/* Insurance Details */}
          {!shouldSkipStep('InsuranceDetails') && (
            <Grid item xs={12} sm={6}>
              <Card
                variant="outlined"
                sx={{
                  borderColor:
                    openSnackbar && insuranceDetailsMissing
                      ? 'error.main'
                      : 'transparent', // Red border if validation fails
                  borderWidth:
                    openSnackbar && insuranceDetailsMissing ? '2px' : '1px', // Make the border thicker on error
                  p: 2
                }}
              >
                <CardActionAreaWrapper sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <Typography variant="h4" color={theme.colors.primary.main}>
                      {t('Insurance Details')}
                    </Typography>
                    <ModeEditOutlineIcon
                      onClick={handleNavigateInsuranceDetails}
                    />
                  </Box>

                  {isInsuredPerson ? (
                    <>
                      {isFieldVisible('InsuranceDetails', 'payerName') && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Payer Name') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {payerNameQuery}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible('InsuranceDetails', 'groupNumber') && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Group No') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.groupNumber}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible('InsuranceDetails', 'MemberId') && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Member ID') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.memberID}
                          </Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      {isFieldVisible('InsuranceDetails', 'payerName') && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Payer Name') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {payerNameQuery}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible('InsuranceDetails', 'groupNumber') && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Group No') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.groupNumber}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible('InsuranceDetails', 'MemberId') && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Member ID') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.memberID}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible(
                        'InsuranceDetails',
                        'patientsubscriberFirstName'
                      ) && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('First Name') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.insFirstName}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible(
                        'InsuranceDetails',
                        'patientsubscriberLastName'
                      ) && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Last Name') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.insLastName}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible(
                        'InsuranceDetails',
                        'patientsubscriberDOB'
                      ) && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            D.O.B:
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {isInsuredPerson
                              ? formattedDateOfBirth
                                ? formattedDate
                                : ''
                              : formattedDateOfBirthOfIns
                              ? formattedDateIns
                              : ''}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible(
                        'InsuranceDetails',
                        'patientsubscriberRelationShip'
                      ) && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Relationship') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {selectedRelationShipInsName}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </CardActionAreaWrapper>
              </Card>
            </Grid>
          )}
          {/* Emergency Contact */}
          {!shouldSkipStep('EmergencyDetails') && (
            <Grid item xs={12} sm={6}>
              <Card
                variant="outlined"
                sx={{
                  borderColor:
                    openSnackbar && emergencyDetailsMissing
                      ? 'error.main'
                      : 'transparent', // Red border if validation fails
                  borderWidth:
                    openSnackbar && emergencyDetailsMissing ? '2px' : '1px', // Make the border thicker on error
                  p: 2
                }}
              >
                <CardActionAreaWrapper
                  sx={{
                    p: 2
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <Typography variant="h4" color={theme.colors.primary.main}>
                      {t('Emergency Contact')}
                    </Typography>
                    <ModeEditOutlineIcon
                      onClick={handleNavigateEmergencyDetails}
                    />
                  </Box>

                  {/* First Name */}
                  {isFieldVisible(
                    'EmergencyDetails',
                    'emergencyContactFirstName'
                  ) && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('First Name') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {addingData?.emergencyFirstname}
                      </Typography>
                    </Box>
                  )}

                  {/* Last Name */}
                  {isFieldVisible(
                    'EmergencyDetails',
                    'emergencyContactLastName'
                  ) && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('Last Name') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {addingData?.emergencyLastname}
                      </Typography>
                    </Box>
                  )}

                  {/* Contact No */}
                  {isFieldVisible(
                    'EmergencyDetails',
                    'emergencyContactPhNum'
                  ) && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('Contact No') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {addingData?.emergencyPhoneNo}
                      </Typography>
                    </Box>
                  )}

                  {/* Relationship */}
                  {isFieldVisible(
                    'EmergencyDetails',
                    'emergencyContactRelationshipToPatient'
                  ) && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                      <Typography
                        variant="subtitle2"
                        sx={{ whiteSpace: 'nowrap', mr: 1, fontWeight: 'bold' }}
                      >
                        {t('Relationship') + ':'}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ wordBreak: 'break-word' }}
                      >
                        {relationship}
                      </Typography>
                    </Box>
                  )}
                </CardActionAreaWrapper>
              </Card>
            </Grid>
          )}

          {/* Referral Details */}
          {!shouldSkipStep('PrimaryCarePhysician') && (
            <Grid item xs={12} sm={6}>
              <Card
                variant="outlined"
                sx={{
                  borderColor:
                    openSnackbar && referralDetailsMissing?.length === 0
                      ? 'error.main'
                      : 'transparent', // Red border if validation fails
                  borderWidth:
                    openSnackbar && referralDetailsMissing ? '2px' : '1px', // Make the border thicker on error
                  p: 2
                }}
              >
                <CardActionAreaWrapper sx={{ p: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 2
                    }}
                  >
                    <Typography variant="h4" color={theme.colors.primary.main}>
                      {t('Referral Details')}
                    </Typography>
                    <ModeEditOutlineIcon
                      onClick={handleNavigateReferralDetails}
                    />
                  </Box>

                  {showOnlyOtherName ? (
                    <>
                      {isFieldVisible(
                        'PrimaryCarePhysician',
                        'ReferralName'
                      ) && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Other Referral Name') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.OtherReferralName}
                          </Typography>
                        </Box>
                      )}
                    </>
                  ) : (
                    <>
                      {isFieldVisible(
                        'PrimaryCarePhysician',
                        'PrimaryCareDoctorFirstName'
                      ) && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('First Name') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.PCPFirstname}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible(
                        'PrimaryCarePhysician',
                        'PrimaryCareDoctorLastName'
                      ) && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Last Name') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.PCPLastname}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible(
                        'PrimaryCarePhysician',
                        'PrimaryCarePhoneNumber'
                      ) && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Phone No') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.PCPPhoneNo}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible(
                        'PrimaryCarePhysician',
                        'PrimaryCareFaxNumber'
                      ) && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Fax No') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.PCPFaxNo}
                          </Typography>
                        </Box>
                      )}

                      {isFieldVisible(
                        'PrimaryCarePhysician',
                        'ReferralName'
                      ) && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                          <Typography
                            variant="subtitle2"
                            sx={{
                              whiteSpace: 'nowrap',
                              mr: 1,
                              fontWeight: 'bold'
                            }}
                          >
                            {t('Other Referral Name') + ':'}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            sx={{ wordBreak: 'break-word' }}
                          >
                            {addingData?.OtherReferralName}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </CardActionAreaWrapper>
              </Card>
            </Grid>
          )}

          {/* Attachments */}
          {/* <Grid container spacing={3}> */}
          <Grid item xs={12} sm={6}>
            <Card
              variant="outlined"
              sx={{
                borderColor:
                  openSnackbar && generatedPdfUrl?.length === 0
                    ? 'error.main'
                    : 'transparent', // Add red border if snackbar is open
                borderWidth: openSnackbar ? '2px' : '1px', // Optional: to make the error border more prominent
                p: 2
              }}
            >
              <CardActionAreaWrapper sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 2
                  }}
                >
                  <Typography variant="h4" color="primary">
                    {t('Aggreements')}
                  </Typography>
                  <ModeEditOutlineIcon onClick={handleNavigateAttachments} />
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    mr: 1
                  }}
                >
                  {generatedPdfUrl?.map((pdfUrl, index) => (
                    <Box
                      key={index}
                      sx={{
                        mb: 2,
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        width: '100%'
                      }}
                    >
                      <Typography
                        variant="h6"
                        color="textPrimary"
                        sx={{ mr: 1 }}
                      >
                        {attachementTitle[index]}
                      </Typography>
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: '#007bff',
                          textDecoration: 'underline',
                          marginLeft: 'auto'
                        }}
                      >
                        {t('View')}
                      </a>
                    </Box>
                  ))}
                </Box>
              </CardActionAreaWrapper>
            </Card>
          </Grid>
          {/* </Grid> */}
        </Grid>
        {/* </Box> */}
        <Box
          display="flex"
          justifyContent="center"
          flexDirection={'column'}
          alignItems="center"
          width="100%" // Ensures centering on all screen sizes
          p={1}
        >
          <FormControlLabel
            control={
              <Checkbox
                checked={confirmationChecked}
                onChange={(e) => setConfirmationChecked(e.target.checked)}
              />
            }
            label={t('The above information is correct')}
          />

          <Button
            variant="contained"
            onClick={() => {
              console.log('Submit button clicked in child');

              // Validate fields before submission
              if (validateFields()) {
                // Validation failed, message already set
                return;
              }

              // Check if generatedPdfUrl is empty
              if (generatedPdfUrl?.length === 0) {
                setSnackbarMessage(
                  t('Please check and sign before submitting.')
                );
                setOpenSnackbar(true);
              } else if (submit) {
                submit(); // Call the submit function passed from the parent
              } else {
                console.error('Submit function is not defined');
              }
            }}
          >
            {t('Submit')}
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}

export default Block12;
