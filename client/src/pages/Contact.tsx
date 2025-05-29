import React, { useState } from 'react';
import { Box, Typography, Container, TextField, Button } from '@mui/material';

interface FormData {
  name: string;
  email: string;
  phone: string;
  suggestion: string;
}

const Contact = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    suggestion: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Contact form submitted successfully:', data);
        alert("Thank you! Your suggestion has been submitted.");
        setFormData({
          name: '',
          email: '',
          phone: '',
          suggestion: '',
        });
      } else {
        console.error('Failed to submit form:', data);
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("Error submitting form. Please try again later.");
    }
  };
  

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: '100vh',
        flexDirection: 'column',
        backgroundColor: '#f4f4f4',
      }}
    >

      <Box
        sx={{
          width: '100%',
          background: 'linear-gradient(to right, #FF7E5F, #FEB47B)',
          color: 'white',
          height: '350px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          px: 2,
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          sx={{
            color: '#fff',
            textShadow: '2px 2px 6px rgba(0,0,0,0.7)',
            px: 2,
          }}
        >
          We'd Love to Hear From You!
        </Typography>
      </Box>

      {/* Main Content Section */}
      <Box sx={{ flexGrow: 1, backgroundColor: '#f4f4f4', color: '#333' }}>
        <Container maxWidth="md" sx={{ py: 6 }}>
          <Typography variant="h4" gutterBottom>
            Your Suggestions Matter!
          </Typography>
          <Typography variant="body1" sx={{ mb: 4 }}>
            Please provide us with your feedback or suggestions. We value your thoughts and ideas to help us improve.
          </Typography>

          {/* Suggestion Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              backgroundColor: '#fff',
              padding: '40px',
              borderRadius: '8px',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            }}
          >
            <TextField
              label="Full Name"
              variant="outlined"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              fullWidth
              sx={{ backgroundColor: '#f9f9f9', borderRadius: '4px', mb: 3 }}
            />
            <TextField
              label="Email Address"
              variant="outlined"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              fullWidth
              sx={{ backgroundColor: '#f9f9f9', borderRadius: '4px', mb: 3 }}
            />
            <TextField
              label="Phone Number"
              variant="outlined"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleInputChange}
              fullWidth
              sx={{ backgroundColor: '#f9f9f9', borderRadius: '4px', mb: 3 }}
            />
            <TextField
              label="Your Suggestion"
              variant="outlined"
              name="suggestion"
              multiline
              rows={4}
              value={formData.suggestion}
              onChange={handleInputChange}
              fullWidth
              sx={{ backgroundColor: '#f9f9f9', borderRadius: '4px', mb: 3 }}
            />
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: '#4E54C8',
                color: '#fff',
                '&:hover': { backgroundColor: '#8F94FB' },
                width: '100%',
                padding: '14px',
                borderRadius: '8px',
              }}
            >
              Submit Suggestion
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Contact;
