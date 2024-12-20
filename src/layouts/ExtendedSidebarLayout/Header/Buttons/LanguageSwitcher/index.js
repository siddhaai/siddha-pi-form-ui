// import { useRef, useState } from 'react';

// import {
//   IconButton,
//   Box,
//   List,
//   ListItem,
//   Divider,
//   Typography,
//   ListItemText,
//   alpha,
//   Popover,
//   Tooltip,
//   styled,
//   useTheme
// } from '@mui/material';
// import Text from 'src/components/Text';

// // import WarningTwoToneIcon from '@mui/icons-material/WarningTwoTone';
// import internationalization from 'src/i18n/i18n';
// import { useTranslation } from 'react-i18next';

// import { DE } from 'country-flag-icons/react/3x2';
// import { US } from 'country-flag-icons/react/3x2';
// import { ES } from 'country-flag-icons/react/3x2';
// import { FR } from 'country-flag-icons/react/3x2';
// import { CN } from 'country-flag-icons/react/3x2';
// import { AE } from 'country-flag-icons/react/3x2';

// const SectionHeading = styled(Typography)(
//   ({ theme }) => `
//         font-weight: ${theme.typography.fontWeightBold};
//         color: ${theme.palette.secondary.main};
//         display: block;
//         padding: ${theme.spacing(2, 2, 0)};
// `
// );

// const IconButtonWrapper = styled(IconButton)(
//   ({ theme }) => `
//   width: ${theme.spacing(4)};
//   height: ${theme.spacing(4)};
//   border-radius: ${theme.general.borderRadiusLg};
// `
// );

// function LanguageSwitcher() {
//   const { i18n } = useTranslation();
//   const { t } = useTranslation();
//   const getLanguage = i18n.language;
//   const theme = useTheme();

//   const switchLanguage = ({ lng }) => {
//     internationalization.changeLanguage(lng);
//   };
//   const ref = useRef(null);
//   const [isOpen, setOpen] = useState(false);

//   const handleOpen = () => {
//     setOpen(true);
//   };

//   const handleClose = () => {
//     setOpen(false);
//   };

//   return (
//     <>
//       <Tooltip arrow title={t('Language Switcher')}>
//         <IconButtonWrapper
//           color="secondary"
//           ref={ref}
//           onClick={handleOpen}
//           sx={{
//             mx: 1,
//             // background: alpha(theme.colors.error.main, 0.1),
//             background:'#E1E3E1',
//             transition: `${theme.transitions.create(['background'])}`,
//             color: theme.colors.error.main,

//             '&:hover': {
//               background: alpha(theme.colors.error.main, 0.2)
//             }
//           }}
//         >
//           {getLanguage === 'de' && <DE title="German" />}
//           {getLanguage === 'en' && <US title="English" />}
//           {getLanguage === 'en-US' && <US title="English" />}
//           {getLanguage === 'en-GB' && <US title="English" />}
//           {getLanguage === 'es' && <ES title="Spanish" />}
//           {getLanguage === 'fr' && <FR title="French" />}
//           {getLanguage === 'cn' && <CN title="Chinese" />}
//           {getLanguage === 'ae' && <AE title="Arabic" />}
//         </IconButtonWrapper>
//       </Tooltip>
//       <Popover
//         disableScrollLock
//         anchorEl={ref.current}
//         onClose={handleClose}
//         open={isOpen}
//         anchorOrigin={{
//           vertical: 'top',
//           horizontal: 'right'
//         }}
//         transformOrigin={{
//           vertical: 'top',
//           horizontal: 'right'
//         }}
//       >
//         <Box
//           sx={{
//             maxWidth: 240
//           }}
//         >
//           <SectionHeading variant="body2" color="text.primary">
//             {t('Language Switcher')}
//           </SectionHeading>
//           <List
//             sx={{
//               p: 2,
//               svg: {
//                 width: 26,
//                 mr: 1
//               }
//             }}
//             component="nav"
//           >
//             <ListItem
//               className={
//                 getLanguage === 'en' || getLanguage === 'en-US' ? 'active' : ''
//               }
//               button
//               onClick={() => {
//                 switchLanguage({ lng: 'en' });
//                 handleClose();
//               }}
//             >
//               <US title="English" />
//               <ListItemText
//                 sx={{
//                   pl: 1
//                 }}
//                 primary="English"
//               />
//             </ListItem>
//             <ListItem
//               className={getLanguage === 'de' ? 'active' : ''}
//               button
//               onClick={() => {
//                 switchLanguage({ lng: 'de' });
//                 handleClose();
//               }}
//             >
//               <DE title="German" />
//               <ListItemText
//                 sx={{
//                   pl: 1
//                 }}
//                 primary="German"
//               />
//             </ListItem>
//             <ListItem
//               className={getLanguage === 'es' ? 'active' : ''}
//               button
//               onClick={() => {
//                 switchLanguage({ lng: 'es' });
//                 handleClose();
//               }}
//             >
//               <ES title="Spanish" />
//               <ListItemText
//                 sx={{
//                   pl: 1
//                 }}
//                 primary="Spanish"
//               />
//             </ListItem>
//             <ListItem
//               className={getLanguage === 'fr' ? 'active' : ''}
//               button
//               onClick={() => {
//                 switchLanguage({ lng: 'fr' });
//                 handleClose();
//               }}
//             >
//               <FR title="French" />
//               <ListItemText
//                 sx={{
//                   pl: 1
//                 }}
//                 primary="French"
//               />
//             </ListItem>
//             <ListItem
//               className={getLanguage === 'cn' ? 'active' : ''}
//               button
//               onClick={() => {
//                 switchLanguage({ lng: 'cn' });
//                 handleClose();
//               }}
//             >
//               <CN title="Chinese" />
//               <ListItemText
//                 sx={{
//                   pl: 1
//                 }}
//                 primary="Chinese"
//               />
//             </ListItem>
//             <ListItem
//               className={getLanguage === 'ae' ? 'active' : ''}
//               button
//               onClick={() => {
//                 switchLanguage({ lng: 'ae' });
//                 handleClose();
//               }}
//             >
//               <AE title="Arabic" />
//               <ListItemText
//                 sx={{
//                   pl: 1
//                 }}
//                 primary="Arabic"
//               />
//             </ListItem>
//           </List>
//           <Divider />
//           {/* <Text color="warning">
//             <Box
//               p={1.5}
//               display="flex"
//               alignItems="flex-start"
//               sx={{
//                 maxWidth: 340
//               }}
//             >
//               <WarningTwoToneIcon fontSize="small" />
//               <Typography
//                 variant="body1"
//                 sx={{
//                   pl: 1,
//                   fontSize: theme.typography.pxToRem(12)
//                 }}
//               >
//                 {t(
//                   'We only translated a small part of the template, for demonstration purposes'
//                 )}
//                 !
//               </Typography>
//             </Box>
//           </Text> */}
//         </Box>
//       </Popover>
//     </>
//   );
// }

// export default LanguageSwitcher;

// import React, { useState } from 'react';
// import { useTranslation } from 'react-i18next';
// import { Button, ButtonGroup, Menu, MenuItem } from '@mui/material';
// import ReactCountryFlag from 'react-country-flag';

// function LanguageSwitcher() {
//   const { i18n } = useTranslation();
//   const [anchorEl, setAnchorEl] = useState(null);

//   const changeLanguage = (lang) => {
//     i18n.changeLanguage(lang);
//     localStorage.setItem('language', lang); // Save language in local storage
//     handleClose();
//   };

//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };

//   const handleClose = () => {
//     setAnchorEl(null);
//   };

//   return (
//     <div>
//       <ButtonGroup variant="contained" aria-label="language switcher">
//         <Button onClick={handleClick}>
//           <ReactCountryFlag
//             countryCode="US"
//             svg
//             style={{ width: '1.5em', height: '1.5em' }}
//           />
//         </Button>
//       </ButtonGroup>
//       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
//         <MenuItem onClick={() => changeLanguage('en')}>
//           <ReactCountryFlag
//             countryCode="US"
//             svg
//             style={{ width: '1.5em', height: '1.5em' }}
//           />{' '}
//           English
//         </MenuItem>
//         <MenuItem onClick={() => changeLanguage('es')}>
//           <ReactCountryFlag
//             countryCode="ES"
//             svg
//             style={{ width: '1.5em', height: '1.5em' }}
//           />{' '}
//           Spanish
//         </MenuItem>
//         <MenuItem onClick={() => changeLanguage('zh')}>
//           <ReactCountryFlag
//             countryCode="CN"
//             svg
//             style={{ width: '1.5em', height: '1.5em' }}
//           />{' '}
//           Chinese
//         </MenuItem>
//         <MenuItem onClick={() => changeLanguage('tl')}>
//           <ReactCountryFlag
//             countryCode="TL"
//             svg
//             style={{ width: '1.5em', height: '1.5em' }}
//           />
//           Tagalog
//         </MenuItem>
//         <MenuItem onClick={() => changeLanguage('vi')}>
//           <ReactCountryFlag
//             countryCode="VN"
//             svg
//             style={{ width: '1.5em', height: '1.5em' }}
//           />{' '}
//           Vietnamese
//         </MenuItem>
//         <MenuItem onClick={() => changeLanguage('ar')}>
//           <ReactCountryFlag
//             countryCode="AE"
//             svg
//             style={{ width: '1.5em', height: '1.5em' }}
//           />{' '}
//           Arabic
//         </MenuItem>
//         {/* Add more languages as needed */}
//       </Menu>
//     </div>
//   );
// }

// export default LanguageSwitcher;
import { useState } from 'react';
import {
  IconButton,
  Box,
  Menu,
  MenuItem,
  Tooltip,
  styled,
  useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import ReactCountryFlag from 'react-country-flag';

const IconButtonWrapper = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  height: ${theme.spacing(4)};
  border-radius: ${theme.general.borderRadiusLg};
`
);

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { t } = useTranslation();
  const currentLanguage = i18n.language;
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('language', lang); // Save language in local storage
    handleClose();
  };

  // Map language codes to country flags
  const flags = [
    { code: 'en', label: 'English', countryCode: 'US' },
    { code: 'es', label: 'Spanish', countryCode: 'ES' },
    { code: 'fr', label: 'French', countryCode: 'FR' },
    { code: 'zh', label: 'Chinese', countryCode: 'CN' },
    { code: 'tl', label: 'Tagalog', countryCode: 'PH' },
    { code: 'vi', label: 'Vietnamese', countryCode: 'VN' },
    { code: 'ar', label: 'Arabic', countryCode: 'AE' }
  ];

  return (
    <Box>
      <Tooltip arrow title={t('Language Switcher')}>
        <IconButtonWrapper
          color="secondary"
          onClick={handleClick}
          sx={{
            mx: 1,
            background: theme.palette.background.default,
            transition: `${theme.transitions.create(['background'])}`,
            color: theme.palette.text.primary,
            '&:hover': {
              background: theme.palette.background.paper
            }
          }}
        >
          {flags.map(
            ({ code, countryCode }) =>
              currentLanguage === code && (
                <ReactCountryFlag
                  key={code}
                  countryCode={countryCode}
                  svg
                  title={code}
                />
              )
          )}
        </IconButtonWrapper>
      </Tooltip>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {flags.map(({ code, label, countryCode }) => (
          <MenuItem
            key={code}
            onClick={() => changeLanguage(code)}
            sx={{ display: 'flex', alignItems: 'center' }}
          >
            <ReactCountryFlag
              countryCode={countryCode}
              svg
              style={{ width: '1.5em', height: '1.5em', marginRight: '10px' }}
            />
            {label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
}

export default LanguageSwitcher;
