import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  CircularProgress,
  Stack,
  Chip,
  Divider,
  Avatar,
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorsAPI } from '../services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HealingIcon from '@mui/icons-material/Healing';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ScienceIcon from '@mui/icons-material/Science';
import BuildIcon from '@mui/icons-material/Build';
import HearingIcon from '@mui/icons-material/Hearing';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

const specializationMeta = {
  Cardiology: {
    icon: <FavoriteIcon sx={{ fontSize: 32 }} />,
    color: '#e11d48',
    accent: '#fb7185',
    description: 'Heart and cardiovascular health. Our cardiologists specialize in diagnosing and treating heart conditions, managing high blood pressure, and preventing cardiovascular diseases.',
  },
  Dermatology: {
    icon: <HealingIcon sx={{ fontSize: 32 }} />,
    color: '#7c3aed',
    accent: '#c084fc',
    description: 'Skin, hair and nail care. Dermatologists treat skin conditions, provide cosmetic solutions, and offer preventive skin health recommendations.',
  },
  Neurology: {
    icon: <PsychologyIcon sx={{ fontSize: 32 }} />,
    color: '#0891b2',
    accent: '#22d3ee',
    description: 'Brain, spine and nervous system disorders. Neurologists diagnose and treat conditions affecting the brain, spinal cord, and peripheral nerves.',
  },
  Orthopedics: {
    icon: <BuildIcon sx={{ fontSize: 32 }} />,
    color: '#d97706',
    accent: '#fbbf24',
    description: 'Bones, joints and musculoskeletal health. Orthopedic specialists treat fractures, joint problems, and provide rehabilitation for mobility issues.',
  },
  Pediatrics: {
    icon: <ChildCareIcon sx={{ fontSize: 32 }} />,
    color: '#059669',
    accent: '#34d399',
    description: 'Children and adolescent healthcare. Pediatricians provide comprehensive care for infants, children, and teens including vaccinations and growth monitoring.',
  },
  Psychiatry: {
    icon: <PsychologyIcon sx={{ fontSize: 32 }} />,
    color: '#c026d3',
    accent: '#e879f9',
    description: 'Mental health and psychological wellness. Psychiatrists treat mental health disorders and provide therapy and medication management.',
  },
  Radiology: {
    icon: <ScienceIcon sx={{ fontSize: 32 }} />,
    color: '#4f46e5',
    accent: '#818cf8',
    description: 'Medical imaging and diagnostic scans. Radiologists use advanced imaging techniques to diagnose diseases and guide treatment planning.',
  },
  Surgery: {
    icon: <LocalHospitalIcon sx={{ fontSize: 32 }} />,
    color: '#dc2626',
    accent: '#f87171',
    description: 'Surgical procedures and advanced care. Surgeons perform planned and emergency surgical interventions across various specialties.',
  },
  Urology: {
    icon: <HealingIcon sx={{ fontSize: 32 }} />,
    color: '#7c3aed',
    accent: '#a78bfa',
    description: 'Urinary and reproductive health. Urologists treat conditions of the urinary system and male reproductive organs.',
  },
  Gynecology: {
    icon: <FavoriteIcon sx={{ fontSize: 32 }} />,
    color: '#db2777',
    accent: '#f472b6',
    description: "Women's reproductive health and wellness. Gynecologists provide comprehensive care including pregnancy, menopause, and gynecological disorders.",
  },
  Ophthalmology: {
    icon: <VisibilityIcon sx={{ fontSize: 32 }} />,
    color: '#0284c7',
    accent: '#38bdf8',
    description: 'Vision and eye care. Ophthalmologists diagnose and treat eye conditions, perform surgery, and provide vision correction solutions.',
  },
  ENT: {
    icon: <HearingIcon sx={{ fontSize: 32 }} />,
    color: '#0f766e',
    accent: '#2dd4bf',
    description: 'Ear, nose and throat care. ENT specialists treat conditions affecting hearing, balance, breathing, and swallowing.',
  },
  Dentistry: {
    icon: <HealingIcon sx={{ fontSize: 32 }} />,
    color: '#ea580c',
    accent: '#fb923c',
    description: 'Dental and oral health. Dentists provide preventive care, dental treatment, cosmetic procedures, and oral health education.',
  },
  'General Medicine': {
    icon: <LocalHospitalIcon sx={{ fontSize: 32 }} />,
    color: '#2563eb',
    accent: '#60a5fa',
    description: 'Primary care and general health. General physicians provide comprehensive healthcare for all ages and manage various health conditions.',
  },
};

const SpecialtyDoctors = () => {
  const { specialty } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const meta = specializationMeta[specialty] || {
    icon: <LocalHospitalIcon sx={{ fontSize: 32 }} />,
    color: '#2563eb',
    accent: '#60a5fa',
    description: 'Expert medical care and treatment',
  };

  useEffect(() => {
    const loadDoctors = async () => {
      setLoading(true);
      try {
        const response = await doctorsAPI.getDoctors(specialty);
        setDoctors(response.data || []);
        setError('');
      } catch (err) {
        console.error('Error fetching doctors:', err);
        setError('Unable to load doctors for this specialty.');
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, [specialty]);

  const handleBook = (doctorId) => {
    if (isAuthenticated) {
      navigate(`/book-appointment/${doctorId}`);
      return;
    }
    navigate('/login');
  };

  const averageRating = doctors.length
    ? (doctors.reduce((sum, doc) => sum + Number(doc.ratings || 0), 0) / doctors.length).toFixed(1)
    : '0.0';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(14, 165, 233, 0.12), transparent 28%), radial-gradient(circle at right center, rgba(59, 130, 246, 0.14), transparent 24%), linear-gradient(180deg, #f5fbff 0%, #eef6fb 52%, #f8fafc 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="xl">
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          sx={{ mb: 3, color: 'primary.main' }}
        >
          Back to Home
        </Button>

        {/* Header Section */}
        <Box
          sx={{
            mb: 6,
            p: { xs: 3, md: 4 },
            borderRadius: '24px',
            background: `linear-gradient(135deg, ${meta.color}15 0%, ${meta.accent}10 100%)`,
            border: `1px solid ${meta.color}20`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 56,
                height: 56,
                bgcolor: `${meta.color}20`,
                color: meta.color,
              }}
            >
              {meta.icon}
            </Avatar>
            <Box>
              <Typography variant="overline" sx={{ color: meta.color, fontWeight: 800 }}>
                Medical Specialty
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
                {specialty}
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              lineHeight: 1.7,
              maxWidth: 800,
              mt: 2,
            }}
          >
            {meta.description}
          </Typography>

          {/* Stats */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: 3 }}>
            <Chip
              label={`${doctors.length} specialists available`}
              sx={{
                bgcolor: `${meta.color}20`,
                color: meta.color,
                fontWeight: 700,
              }}
            />
            <Chip
              label={`${averageRating} average rating`}
              icon={<StarIcon />}
              sx={{
                bgcolor: `${meta.color}20`,
                color: meta.color,
                fontWeight: 700,
              }}
            />
          </Stack>
        </Box>

        {/* Doctors Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
            Available {specialty} Specialists
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
            Review and compare experienced doctors, check their ratings and experience, then book an appointment with
            confidence.
          </Typography>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : doctors.length === 0 ? (
          <Card>
            <CardContent sx={{ py: 8, textAlign: 'center' }}>
              <Typography color="text.secondary" variant="h6">
                No doctors available in {specialty} at this moment.
              </Typography>
              <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate('/')}>
                Explore Other Specialties
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Grid container spacing={3}>
            {doctors.map((doctor) => (
              <Grid item xs={12} md={6} lg={4} key={doctor._id}>
                <Card
                  sx={{
                    height: '100%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Avatar
                        src={doctor.image}
                        sx={{
                          width: 66,
                          height: 66,
                          bgcolor: 'primary.main',
                          boxShadow: '0 12px 24px rgba(37, 99, 235, 0.18)',
                        }}
                      >
                        {doctor.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          Dr. {doctor.name}
                        </Typography>
                        <Typography color="primary.main" sx={{ fontWeight: 700, fontSize: '0.875rem' }}>
                          {doctor.specialization}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.8 }}>
                      <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {doctor.ratings || 0}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ({doctor.totalReviews || 0} reviews)
                      </Typography>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap' }} useFlexGap>
                      <Chip label={`${doctor.experience} yrs experience`} size="small" />
                      <Chip label={`Rs. ${doctor.consultationFee}`} size="small" color="primary" />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
                      View the full profile to learn more about this doctor before confirming an appointment.
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                      <Button variant="outlined" fullWidth onClick={() => navigate(`/doctor/${doctor._id}`)}>
                        View Profile
                      </Button>
                      <Button variant="contained" fullWidth onClick={() => handleBook(doctor._id)}>
                        {isAuthenticated ? 'Book Now' : 'Login to Book'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default SpecialtyDoctors;
