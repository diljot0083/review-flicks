import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: "center",
        padding: "10px",
        backgroundColor: "#1976d2",
        color: "white",
        marginTop: "20px",
      }}
    >
      <Typography variant="body2">© {new Date().getFullYear()} ReviewFlicks</Typography>
    </Box>
  );
};

export default Footer;
