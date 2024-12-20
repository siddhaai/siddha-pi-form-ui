import { useEffect, useRef, useState } from 'react';
import useAuth from 'src/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

import {
  Avatar,
  Box,
  Button,
  Divider,
  // MenuList,
  alpha,
  IconButton,
  // MenuItem,
  // ListItemText,
  Popover,
  Typography,
  styled
  // useTheme
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import LockOpenTwoToneIcon from '@mui/icons-material/LockOpenTwoTone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { ApiUrl } from 'src/content/SiddhaAI/ApiUrl';
import toast from 'react-hot-toast';
import useAxiosInterceptor from 'src/contexts/Interceptor';


const UserBoxButton = styled(IconButton)(
  ({ theme }) => `
  width: ${theme.spacing(4)};
  padding: 0;
  height: ${theme.spacing(4)};
  margin-left: ${theme.spacing(1)};
  border-radius: ${theme.general.borderRadiusLg};
  
  &:hover {
    background: ${theme.colors.primary.main};
  }
`
);

const UserAvatar = styled(Avatar)(
  ({ theme }) => `
        height: 90%;
        width: 90%;
        border-radius: ${theme.general.borderRadiusLg};
`
);

const MenuUserBox = styled(Box)(
  ({ theme }) => `
        background: ${alpha(theme.colors.alpha.black[100], 0.08)};
        padding: ${theme.spacing(2)};
`
);

const UserBoxText = styled(Box)(
  ({ theme }) => `
        text-align: left;
        padding-left: ${theme.spacing(1)};
`
);

const UserBoxLabel = styled(Typography)(
  ({ theme }) => `
        font-weight: ${theme.typography.fontWeightBold};
        color: ${theme.palette.secondary.main};
        display: block;
`
);

const UserBoxDescription = styled(Typography)(
  ({ theme }) => `
        color: ${theme.palette.secondary.light}
`
);

function HeaderUserbox() {
  const { t } = useTranslation();
  const { axios } = useAxiosInterceptor();

  // const theme = useTheme();

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const ref = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogout = async () => {
    try {
      handleClose();
      await logout();
      navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const token = localStorage.getItem('token');
  const [userFullName, setUserFullName] = useState('');

  const [getUserImage, SetGetUserImage] = useState('');
  const fetchUserData = async () => {
    try {
      const response = await axios.get(`${ApiUrl}/getClientDoctorDetails`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const fullName = `${response.data.clientProfile[0].clientName}`;
      setUserFullName(fullName);
      const imageUrl = response.data.clientProfile[0].profilePhoto
        ? `data:image/jpeg;base64,${response.data.clientProfile[0].profilePhoto}`
        : '';
      SetGetUserImage(imageUrl);
    } catch (error) {
      console.log(user);
      toast.error('Failed to fetch user data');
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleViewProfile = () => {
    navigate('/extended-sidebar/SiddhaAI/CreateProfile/CreateProfile');
  };

  return (
    <>
      <UserBoxButton color="primary" ref={ref} onClick={handleOpen}>
        <UserAvatar alt={userFullName} src={getUserImage} />
      </UserBoxButton>
      <Popover
        disableScrollLock
        anchorEl={ref.current}
        onClose={handleClose}
        open={isOpen}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <MenuUserBox
          sx={{
            minWidth: 210
          }}
          display="flex"
        >
          <Avatar variant="rounded" alt={userFullName} src={getUserImage} />
          <UserBoxText>
            <UserBoxLabel variant="body1">{userFullName}</UserBoxLabel>
            <UserBoxDescription variant="body2">
              {/* {user.jobtitle} */}
            </UserBoxDescription>
          </UserBoxText>
        </MenuUserBox>
        <Divider
          sx={{
            mb: 0
          }}
        />
        <Divider />

        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleViewProfile}>
            <VisibilityIcon
              sx={{
                mr: 1
              }}
            />
            {t('View Profile')}
          </Button>
        </Box>
        {/* <Divider /> */}
        <Box m={1}>
          <Button color="primary" fullWidth onClick={handleLogout}>
            <LockOpenTwoToneIcon
              sx={{
                mr: 1
              }}
            />
            {t('Sign out')}
          </Button>
        </Box>
      </Popover>
    </>
  );
}

export default HeaderUserbox;
