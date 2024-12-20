import { useContext } from 'react';
import {
  Box,
  alpha,
  lighten,
  Tooltip,
  styled,
  useTheme,
  Avatar
} from '@mui/material';
import { SidebarContext } from 'src/contexts/SidebarContext';
import LanguageSwitcher from 'src/layouts/ExtendedSidebarLayout/Header/Buttons/LanguageSwitcher';
import AuthContext from 'src/contexts/AuthContext';

const HeaderWrapper = styled(Box)(
  ({ theme }) => `
        height: 10%;
        color: ${theme.header.textColor};
        padding: ${theme.spacing(0, 2)};
        z-index: 200;
        // background-color: ${alpha(theme.header.background, 0.95)};
        // background-color: ${theme.colors.primary.main};
        background:  linear-gradient(to right, #2ca6af, #109fb3, #0098b6, #0090b8,#0488b9);
        backdrop-filter: blur(3px);
        position: fixed;
        top: 0; /* Ensure it sticks to the top */
        left: 0; /* Ensure it starts from the left */
        right: 0; /* Ensure it spans the full width */
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%; /* Ensure it spans the full width */
        box-shadow:
          ${
            theme.palette.mode === 'dark'
              ? `0 1px 0 ${alpha(
                  lighten(theme.colors.primary.main, 0.7),
                  0.15
                )}, 0px 2px 8px -3px rgba(0, 0, 0, 0.2), 0px 5px 22px -4px rgba(0, 0, 0, .1)`
              : `0px 2px 8px -3px ${alpha(
                  theme.colors.alpha.black[100],
                  0.2
                )}, 0px 5px 22px -4px ${alpha(
                  theme.colors.alpha.black[100],
                  0.1
                )}`
          }
`
);

function Header() {
  const { sidebarToggle, toggleSidebar } = useContext(SidebarContext);
  const theme = useTheme();
  const { logo, setLogo } = useContext(AuthContext);
  // console.log('logo', logo);

  return (
    <HeaderWrapper>
      <Box display="flex" flexGrow={1}>
        {/* Add other header elements here if needed */}
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between" // This ensures the Avatar and Tooltip are spaced apart
        sx={{ width: '100%' }} // Optionally set a width to control the spacing more precisely
      >
        {/* Avatar */}
        <Avatar
          src={`data:image/jpeg;base64,${logo}`} // Use selected image or current logo
          alt="Logo"
          sx={{ width: 40, height: 40 }} // Adjust the size as needed
        />

        {/* Tooltip with Language Switcher */}

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <LanguageSwitcher />
        </Box>
      </Box>
    </HeaderWrapper>
  );
}

export default Header;
