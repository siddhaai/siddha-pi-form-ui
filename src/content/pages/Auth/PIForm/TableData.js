import React, { useState, useRef, useEffect } from 'react';
import {
  Typography,
  Card,
  Grid,
  TextField,
  Button,
  InputLabel,
  Box,
  Zoom,
  alpha,
  ListItemButton,
  styled,
  List,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Tooltip,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import EastIcon from '@mui/icons-material/East';
import { useSnackbar } from 'notistack';
// import WebCam from './Camera';
import Styles from './Styles.css';
import './Styles.css';
import ScreenLockLandscapeIcon from '@mui/icons-material/ScreenLockLandscape';
import ScreenLockPortraitIcon from '@mui/icons-material/ScreenLockPortrait';
import Webcam from 'react-webcam';

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

export default function TableData() {
  const { t } = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const [selectedDate, setSelectedDate] = React.useState(dayjs());
  // const [step, setStep] = React.useState(1); // State to manage UI steps
  const [selectedAddress, setSelectedAddress] = React.useState(''); // State to manage selected address
  const [checked, setChecked] = React.useState(false);
  const [confirmationChecked, setConfirmationChecked] = React.useState(false);
  const [isUnder16, setIsUnder16] = useState(false);
  const [isInsuredPerson, setIsInsuredPerson] = useState(false);
  const [capturing, setCapturing] = useState(false); // New state to manage capture process
  const [step, setStep] = useState(1);
  const [useLandscape, setUseLandscape] = useState(true);
  const [capturedImage, setCapturedImage] = useState(null);
  const webcamRef = useRef(null);
  const [buttonText, setButtonText] = useState('Take Photo');
  const genders = ['Male', 'Female', 'Other'];
  const languages = ['English', 'Spanish', 'French', 'German', 'Chinese'];
  const [gender, setGender] = useState('');
  const [language, setLanguage] = useState('');
  const [showOnlyOtherName, setShowOnlyOtherName] = useState(false);
  const [otherReferralName, setOtherReferralName] = useState('');

  const handleCheckboxChange = (event) => {
    setShowOnlyOtherName(event.target.checked);
  };

  const handleOtherReferralNameChange = (event) => {
    setOtherReferralName(event.target.value);
  };

  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  const videoConstraints = {
    facingMode: 'environment',
    width: useLandscape ? 300 : 190,
    height: useLandscape ? 190 : 300
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

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1); // Increment step to show next UI
  };

  const handleAddressChange = (event) => {
    setSelectedAddress(event.target.value); // Update the selected address
  };

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // const captureImage = () => {
  //   const imageSrc = webcamRef.current.getScreenshot();
  //   setCapturedImage(imageSrc);
  // };

  // const retakeImage = () => {
  //   setCapturedImage(null);
  // };

  // const confirmImage = () => {
  //   // Handle the confirmed image (e.g., upload or process)
  //   console.log('Image confirmed:', capturedImage);
  // };

  const captureImage = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setCapturedImage(imageSrc);
      setButtonText('Confirm');
    }
  };

  const retakeImage = () => {
    setCapturedImage(null);
    setButtonText('Capture');
  };

  const confirmImage = () => {
    // Handle the confirmed image (e.g., upload or process)
    console.log('Image confirmed:', capturedImage);
  };

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      // Access the webcam
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: 'environment' } })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.error('Error accessing webcam:', err);
          alert(
            'Unable to access the camera. Please check permissions and try again.'
          );
        });
    } else {
      console.error('getUserMedia is not supported in this browser.');
      alert(
        'Camera access is not supported on this device. Please use a different browser or device.'
      );
    }
  }, []);

  const toggleFrameSize = () => {
    setUseLandscape(!useLandscape);
  };

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

  const handleCaptureClick = () => {
    if (capturing) {
      captureImage();
      setCapturing(false); // Set capturing to false after taking the photo
    } else {
      setCapturing(true); // Set capturing to true to start the capture process
    }
  };

  return (
    <Card
      className="PIForm_Card"
      sx={{
        mx: 'auto',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden' // Prevent overflow on smaller screens
      }}
    >
      {/* Conditionally render the Stepper */}
      {step > 2 && (
        <Stepper
          activeStep={0}
          alternativeLabel
          sx={{
            mt: 0.1,

            padding: '15px',
            width: '100%', // Ensures the Stepper takes full width of its container
            overflowX: 'auto', // Allows horizontal scrolling if needed
            '.MuiStepLabel-root': {
              minWidth: '40px', // Adjust the minimum width of each step label
              fontSize: '0.55rem' // Make step labels smaller on mobile
            },
            display: 'flex', // Centers the Stepper
            justifyContent: 'flex-start'
          }}
        >
          {['1', '2', '3', '4', '5', '6', '7'].map((label) => (
            <Step key={label}>
              <StepLabel />
            </Step>
          ))}
        </Stepper>
      )}

      {/* Content Container with flex-grow */}
      <Box sx={{ flexGrow: 1, p: 2 }}>
        {step === 1 && (
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item xs={12} mt={2}>
              <Typography variant="h3" align="center" gutterBottom>
                Hello Jeeva,
              </Typography>
              <Typography variant="h6" align="center" gutterBottom>
                Welcome to Siddha AI!
              </Typography>
            </Grid>

            <Grid item xs={12} mt={5}>
              <Typography variant="body1" align="center" gutterBottom>
                Choose your Date of Birth,
              </Typography>
            </Grid>

            <Grid item xs={12}>
              <InputLabel htmlFor="date" sx={{ mb: 2 }}>
                Date of Birth
              </InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Select Date"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
          </Grid>
        )}

        {step === 2 && (
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item xs={12} mt={2}>
              <Grid item xs={12} mt={2}>
                <Typography variant="h3" align="center" gutterBottom>
                  Hello Jeeva,
                </Typography>
                <Typography
                  variant="h6"
                  align="center"
                  gutterBottom
                  marginBottom={5}
                >
                  Welcome to Siddha AI!
                </Typography>
              </Grid>

              <Typography
                variant="h4"
                align="center"
                left={2}
                gutterBottom
                sx={{ fontWeight: 'bold' }}
              >
                Choose Your Address
              </Typography>
            </Grid>

            <Grid item xs={12} mt={2}>
              <List disablePadding sx={{ pt: 4 }}>
                <RadioGroup
                  value={selectedAddress}
                  onChange={handleAddressChange}
                >
                  <ListItemButtonWrapper>
                    <FormControlLabel
                      value="address1"
                      control={<Radio />}
                      label={
                        <Typography color="text.primary" variant="body1">
                          132, My Street, Kingston, New York 12401
                        </Typography>
                      }
                    />
                  </ListItemButtonWrapper>
                  <ListItemButtonWrapper>
                    <FormControlLabel
                      value="address2"
                      control={<Radio />}
                      label={
                        <Typography color="text.primary" variant="body1">
                          456, Another St, Kingston, New York 12402
                        </Typography>
                      }
                    />
                  </ListItemButtonWrapper>
                  <ListItemButtonWrapper>
                    <FormControlLabel
                      value="address3"
                      control={<Radio />}
                      label={
                        <Typography color="text.primary" variant="body1">
                          12, colenel St, Kingston, New York 12403
                        </Typography>
                      }
                    />
                  </ListItemButtonWrapper>
                </RadioGroup>
              </List>
            </Grid>
          </Grid>
        )}

        {step === 3 && (
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item xs={12} mt={2}>
              <Typography variant="h4" align="center" gutterBottom>
                Capture Legal ID
              </Typography>
            </Grid>

            <FormControlLabel
              control={
                <Checkbox
                  checked={isUnder16}
                  onChange={(e) => setIsUnder16(e.target.checked)}
                />
              }
              label="Patient is under 16, then click here"
            />

            {!isUnder16 && (
              <Grid item xs={12} mb={4}>
                {!capturedImage ? (
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      maxWidth: '400px',
                      margin: '0 auto'
                    }}
                  >
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      style={{ width: '100%', borderRadius: '10px' }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        border: '2px solid #000',
                        borderRadius: '10px',
                        left: '50%',
                        width: useLandscape ? '300px' : '190px',
                        height: useLandscape ? '190px' : '300px',
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none'
                      }}
                    ></div>
                  </div>
                ) : (
                  <div id="captured-images">
                    <img
                      src={capturedImage}
                      alt="Captured"
                      style={{
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '10px'
                      }}
                    />
                  </div>
                )}
              </Grid>
            )}

            {!isUnder16 && !capturedImage ? (
              <>
                <Grid item xs={12} mt={5}>
                  <Button
                    color="inherit"
                    onClick={toggleFrameSize}
                    sx={{ position: 'absolute', right: '5%' }}
                  >
                    <Tooltip arrow placement="top" title="Rotate">
                      {useLandscape ? (
                        <ScreenLockPortraitIcon />
                      ) : (
                        <ScreenLockLandscapeIcon />
                      )}
                    </Tooltip>
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={captureImage}
                    sx={{ mt: 8 }}
                  >
                    {buttonText}
                  </Button>
                </Grid>
              </>
            ) : (
              !isUnder16 && (
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={retakeImage}
                    sx={{ mt: 1, mr: 2 }}
                  >
                    Re-take
                  </Button>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={confirmImage}
                    sx={{ mt: 1 }}
                  >
                    Confirm
                  </Button>
                </Grid>
              )
            )}
          </Grid>
        )}

        {step === 4 && (
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item xs={12} mt={1}>
              <Typography variant="h4" align="center" gutterBottom>
                Personal Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField fullWidth label="First Name" variant="outlined" />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField fullWidth label="Middle Name" variant="outlined" />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6}>
              <TextField fullWidth label="Last Name" variant="outlined" />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  label="Date of Birth"
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} sx={{ width: '250px' }}>
              <FormControl fullWidth>
                <InputLabel>Gender</InputLabel>
                <Select
                  fullWidth
                  labelId="gender-label"
                  value={gender}
                  label="Gender"
                  onChange={handleGenderChange}
                >
                  <MenuItem value={10}>Male</MenuItem>
                  <MenuItem value={20}>Female</MenuItem>
                  <MenuItem value={30}>Others</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={12}>
              <FormControl fullWidth>
                <InputLabel id="language-label">Preferred Language</InputLabel>
                <Select
                  labelId="language-label"
                  value={language}
                  label="Preferred Language"
                  onChange={handleLanguageChange}
                  // sx={{ minWidth: '100%' }}
                  fullWidth
                >
                  <MenuItem value={10}>English</MenuItem>
                  <MenuItem value={20}>Spanish</MenuItem>
                  <MenuItem value={30}>German</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        )}

        {step === 5 && (
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item xs={12} mt={1}>
              <Typography variant="h4" align="center" gutterBottom>
                Address Details
              </Typography>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Street Name" variant="outlined" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="City" variant="outlined" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="State" variant="outlined" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Zip Code" variant="outlined" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Email" variant="outlined" />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Phone Number" variant="outlined" />
            </Grid>
          </Grid>
        )}
        {step === 6 && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" align="center" gutterBottom>
                Capture Insurance ID
              </Typography>
            </Grid>

            <Grid item xs={12} alignItems={'center'}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isInsuredPerson}
                    onChange={(e) => setIsInsuredPerson(e.target.checked)}
                  />
                }
                label="I am an Insured Person"
              />
            </Grid>

            {/* Front Image Capture Section */}

            <Grid item lg={12}>
              <Typography variant="body1">Front Side</Typography>
              {!capturedImage ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '400px'
                    // margin: '0 auto'
                  }}
                >
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      border: '2px solid #000',
                      borderRadius: '10px',
                      left: '50%',
                      width: useLandscape ? '300px' : '190px',
                      height: useLandscape ? '190px' : '300px',
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none'
                    }}
                  ></div>
                </div>
              ) : (
                <div id="captured-images">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      borderRadius: '10px'
                    }}
                  />
                </div>
              )}
            </Grid>

            {/* Buttons for Front Image Capture */}
            {!capturedImage ? (
              <>
                <Grid item xs={12}>
                  <Button
                    color="inherit"
                    onClick={toggleFrameSize}
                    sx={{ position: 'absolute', right: '5%' }}
                  >
                    <Tooltip arrow placement="top" title="Rotate">
                      {useLandscape ? (
                        <ScreenLockPortraitIcon />
                      ) : (
                        <ScreenLockLandscapeIcon />
                      )}
                    </Tooltip>
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={captureImage}
                    sx={{ mt: 1 }}
                  >
                    {buttonText}
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={retakeImage}
                  sx={{ mt: 1, mr: 2 }}
                >
                  Re-take
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={confirmImage}
                  sx={{ mt: 1 }}
                >
                  Confirm
                </Button>
              </Grid>
            )}

            {/* Back Image Capture Section */}
            <Typography variant="body1">Back Side</Typography>
            <Grid item xs={12}>
              {!capturedImage ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    maxWidth: '400px',
                    margin: '0 auto'
                  }}
                >
                  <Webcam
                    audio={false}
                    ref={webcamRef}
                    screenshotFormat="image/jpeg"
                    videoConstraints={videoConstraints}
                    style={{ width: '100%', borderRadius: '10px' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      border: '2px solid #000',
                      borderRadius: '10px',
                      left: '50%',
                      width: useLandscape ? '300px' : '190px',
                      height: useLandscape ? '190px' : '300px',
                      transform: 'translate(-50%, -50%)',
                      pointerEvents: 'none'
                    }}
                  ></div>
                </div>
              ) : (
                <div id="captured-images">
                  <img
                    src={capturedImage}
                    alt="Captured"
                    style={{
                      width: '100%',
                      maxWidth: '400px',
                      borderRadius: '10px'
                    }}
                  />
                </div>
              )}
            </Grid>

            {/* Buttons for Back Image Capture */}
            {!capturedImage ? (
              <>
                <Grid item xs={12}>
                  <Button
                    color="inherit"
                    onClick={toggleFrameSize}
                    sx={{ position: 'absolute', right: '5%' }}
                  >
                    <Tooltip arrow placement="top" title="Rotate">
                      {useLandscape ? (
                        <ScreenLockPortraitIcon />
                      ) : (
                        <ScreenLockLandscapeIcon />
                      )}
                    </Tooltip>
                  </Button>
                </Grid>

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="inherit"
                    onClick={captureImage}
                    sx={{ mt: 1 }}
                  >
                    {buttonText}
                  </Button>
                </Grid>
              </>
            ) : (
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={retakeImage}
                  sx={{ mt: 1, mr: 2 }}
                >
                  Re-take
                </Button>
                <Button
                  variant="contained"
                  color="inherit"
                  onClick={confirmImage}
                  sx={{ mt: 1 }}
                >
                  Confirm
                </Button>
              </Grid>
            )}
          </Grid>
        )}
        {step === 7 && (
          <Grid container spacing={2} direction="column" alignItems="center">
            <Grid item xs={12}>
              <Typography variant="h4" align="center" gutterBottom>
                {isInsuredPerson ? 'Insurance Details' : 'Insurance Details'}
              </Typography>
            </Grid>

            {isInsuredPerson ? (
              // Fields for Insured Person
              <>
                <Grid item xs={12}>
                  <TextField
                    label="Group Number"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Member ID"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
              </>
            ) : (
              // Fields for Non-Insured Person
              <>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Group Number"
                    variant="outlined"
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Member ID" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="First Name" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField label="Last Name" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label=" Date of Birth"
                      value={selectedDate}
                      onChange={(newValue) => setSelectedDate(newValue)}
                      renderInput={(params) => (
                        <TextField {...params} fullWidth />
                      )}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} style={{ width: '250px' }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>{t('Relationship')}</InputLabel>
                    <Select
                      label="Relationship"
                      // value={type}
                      // onChange={handleType}
                      fullWidth
                    >
                      <MenuItem value="father">Father</MenuItem>
                      <MenuItem value="mother">Mother</MenuItem>
                      <MenuItem value="child">Child</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                  {/* <TextField
                    select
                    label="Relationship"
                    variant="outlined"
                    fullWidth
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="father">Father</MenuItem>
                    <MenuItem value="mother">Mother</MenuItem>
                    <MenuItem value="child">Child</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </TextField> */}
                </Grid>
              </>
            )}
          </Grid>
        )}
        {step === 8 && (
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOnlyOtherName}
                  onChange={handleCheckboxChange}
                />
              }
              label="No Primary Care Physician"
            />

            <Grid container spacing={2} direction="column" alignItems="center">
              {showOnlyOtherName ? (
                // Render only "Other Referral Name" field if checkbox is checked
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    fullWidth
                    type="text"
                    label="Other Referral Name"
                    variant="outlined"
                    value={otherReferralName}
                    onChange={handleOtherReferralNameChange}
                  />
                </Grid>
              ) : (
                // Render all other fields if checkbox is unchecked
                <>
                  <Grid item xs={12} mt={1}>
                    <Typography variant="h4" align="center" gutterBottom>
                      Primary Care Physician
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      fullWidth
                      label="Physician First Name"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      fullWidth
                      label="Physician Last Name"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      fullWidth
                      label="Physician Contact Number"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      fullWidth
                      label="Physician Fax Number"
                      variant="outlined"
                    />
                  </Grid>

                  <Grid item xs={12} sm={6} md={6} lg={6}>
                    <TextField
                      fullWidth
                      label="Other Referral Name"
                      variant="outlined"
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        )}
      </Box>

      {step > 2 && (
        <Grid
          className="next-btn"
          item
          container
          xs={12}
          spacing={2}
          justifyContent="center"
          sx={{ position: 'absolute', bottom: '8%' }}
        >
          <Grid item>
            <Box display="flex" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={confirmationChecked}
                    onChange={(e) => setConfirmationChecked(e.target.checked)}
                  />
                }
                label="The above information is correct"
              />
            </Box>
          </Grid>
        </Grid>
      )}
      {/* Next Button at the Bottom for All Steps */}
      <Grid
        className="next-btn"
        item
        container
        xs={12}
        spacing={2}
        justifyContent="flex-end"
        sx={{ position: 'absolute', bottom: '2%', right: '5%' }}
      >
        <Grid item>
          <Box display="flex" alignItems="center">
            <Button
              color="inherit"
              onClick={() => {
                // handleValidate(); // Call handleValidate first
                handleNext(); // Then call handleNext
              }}
            >
              Next
            </Button>
            <EastIcon />
          </Box>
        </Grid>
      </Grid>
    </Card>
  );
}
