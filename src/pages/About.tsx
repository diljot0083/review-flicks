import { Box, Typography, Container } from "@mui/material";
import AboutImage from "../assets/hero.jpg";

const About = () => {
  return (
    <Box sx={{ backgroundColor: "#0D0D0D", color: "white", overflowX: "hidden" }}>
      {/* Hero Section */}
      <Box
        sx={{
          backgroundImage: `url(${AboutImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          width: "100vw",
          height: "350px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            color: "#fff",
            textShadow: "2px 2px 6px rgba(0,0,0,0.7)",
            px: 2,
            marginRight: 22
          }}
        >
          Meet the Developer Behind the Screen
        </Typography>
      </Box>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ px: 2, py: 6 }}>
        {/* Heading */}
        <Box textAlign="center" mb={6}>
          <Typography variant="h4" gutterBottom>
            So, Who Am I?
          </Typography>
        </Box>

        {/* About Text */}
        <Box
          sx={{
            maxWidth: "800px",
            margin: "0 auto",
            textAlign: "justify", // makes both sides align
          }}
        >
          <Typography variant="h6" gutterBottom>
            Hey, I'm Diljot Singh
          </Typography>
          <Typography variant="body1" sx={{ lineHeight: 1.8, whiteSpace: "pre-line" }}>
            {`An aspiring Software Developer with a strong foundation in C++, MERN stack, and Data Structures. I'm passionate about building efficient, scalable, and user-centric software solutions. With a deep interest in solving complex problems, I enjoy creating full-stack applications that are both functional and intuitive.

As a coding enthusiast, I've gained hands-on experience through various C++ projects that have helped sharpen my problem-solving abilities. I'm well-versed in algorithms, data structures, and scripting in C++, and constantly strive to write clean, optimized code.

Currently, I’m diving deeper into the world of MERN Stack development, where I’m exploring the art of building dynamic and responsive full-stack web applications. As a fresher in this field, I'm always eager to learn, experiment, and stay up-to-date with the latest technologies in software development.

This movie review site is a result of my learning journey — combining my skills, creativity, and love for building meaningful digital experiences. Welcome, and I hope you enjoy exploring it as much as I enjoyed building it!`}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default About;
