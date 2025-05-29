import { Fade } from "react-awesome-reveal";
import { Box, Typography } from "@mui/material";
import heroImage from "../assets/hero.jpg";

const HeroSection = () => {
  return (
    <Box
      sx={{
        width: "100vw",
        maxWidth: "100%",
        height: "400px",
        backgroundImage: `url(${heroImage})`,
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        overflow: "hidden",
        left: "0",
      }}
    >
      {/* Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0,0,0,0.6)",
          zIndex: 0,
        }}
      />

      {/* Animated Text */}
      <Fade direction="down" delay={200} triggerOnce>
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            position: "relative",
            zIndex: 1,
            paddingLeft: "180px",
            width: "80%",
          }}
        >
          🎬 Discover & Review Your Favourite Movies
        </Typography>
      </Fade>
    </Box>
  );
};

export default HeroSection;
