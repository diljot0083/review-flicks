import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, useTheme } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import MovieIcon from "@mui/icons-material/Movie";

const NavBar = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AppBar position="static" sx={{ background: "#141E30", py: 0.4 }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* Logo */}
        <Box
          sx={{ display: "flex", alignItems: "center", cursor: "pointer", flexShrink: 0 }}
          onClick={() => navigate("/")}
        >
          <MovieIcon sx={{ color: "purple", fontSize: "24px", mr: isSmallScreen ? 0.5 : 1 }} />
          <Typography
            variant="h6"
            sx={{
              color: "white",
              fontWeight: "bold",
              fontSize: isSmallScreen ? "1rem" : "1.25rem",
              whiteSpace: "nowrap",
            }}
          >
            Movie Review
          </Typography>
        </Box>

        {/* Right Side Buttons */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            flexWrap: "nowrap",
            gap: isSmallScreen ? "4px" : "10px",
          }}
        >

          {/* About & Contact Buttons */}
          <Button
            component={Link}
            to="/about"
            sx={{
              color: "white",
              textTransform: "none",
              fontSize: isSmallScreen ? "0.7rem" : "0.9rem",
              padding: isSmallScreen ? "3px 6px" : "6px 10px",
              minWidth: "fit-content",
              whiteSpace: "nowrap",
            }}
          >
            About Us
          </Button>
          <Button
            component={Link}
            to="/contact"
            sx={{
              color: "white",
              textTransform: "none",
              fontSize: isSmallScreen ? "0.7rem" : "0.9rem",
              padding: isSmallScreen ? "3px 6px" : "6px 10px",
              minWidth: "fit-content",
              whiteSpace: "nowrap",
            }}
          >
            Contact Us
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
