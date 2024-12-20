import { Box, Card, Typography, styled } from '@mui/material';

const FooterWrapper = styled(Card)(
  ({ theme }) => `
    border-radius: 0;
    // background: ${theme.colors.primary.main};
    background:  linear-gradient(to right, #2ca6af, #109fb3, #0098b6, #0090b8,#0488b9);
    margin-top: ${theme.spacing(2)};
    padding: ${theme.spacing(0, 2)};
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center; // Ensures text alignment in the center
`
);

function Footer() {
  return (
    <FooterWrapper className="footer-wrapper">
      <Box
        p={0.5}
        display="flex" // Use flex for centering
        alignItems="center"
        flexDirection={'column'}
        gap={0.2}
        justifyContent="center" // Centers the content horizontally
        textAlign="center" // Centers the text inside the Box
      >
        {/* <Box> */}
        <Typography variant="subtitle1" color="white">
          &copy; 2024 - Siddha AI
        </Typography>
        <Typography variant="subtitle1" color="white">
          version 1.1.16
        </Typography>

        {/* </Box> */}
        {/* Uncomment this part if you want to include additional text or links */}
        {/* <Typography
          sx={{
            pt: { xs: 2, md: 0 }
          }}
          variant="subtitle1"
        >
          Crafted by{' '}
          <Link
            href="https://bloomui.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            BloomUI.com
          </Link>
        </Typography> */}
      </Box>
    </FooterWrapper>
  );
}

export default Footer;
