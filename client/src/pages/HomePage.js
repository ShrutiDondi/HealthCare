import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarIcon from '@mui/icons-material/Star';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PsychologyIcon from '@mui/icons-material/Psychology';
import HealingIcon from '@mui/icons-material/Healing';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ScienceIcon from '@mui/icons-material/Science';
import BuildIcon from '@mui/icons-material/Build';
import HearingIcon from '@mui/icons-material/Hearing';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import TuneIcon from '@mui/icons-material/Tune';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { doctorsAPI } from '../services/api';

const createSpecialtyImage = (emoji, title, startColor, endColor, glowColor) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 220">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${startColor}" />
          <stop offset="100%" stop-color="${endColor}" />
        </linearGradient>
      </defs>
      <rect width="320" height="220" rx="28" fill="url(#bg)" />
      <circle cx="255" cy="52" r="62" fill="${glowColor}" opacity="0.26" />
      <circle cx="74" cy="178" r="74" fill="#ffffff" opacity="0.14" />
      <circle cx="286" cy="186" r="28" fill="#ffffff" opacity="0.10" />
      <rect x="28" y="24" width="90" height="28" rx="14" fill="#ffffff" opacity="0.18" />
      <rect x="28" y="168" width="162" height="12" rx="6" fill="#ffffff" opacity="0.24" />
      <rect x="28" y="188" width="126" height="10" rx="5" fill="#ffffff" opacity="0.18" />
      <text x="34" y="45" font-family="Segoe UI, Arial, sans-serif" font-size="15" font-weight="700" fill="#ffffff">Specialty</text>
      <text x="34" y="146" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="800" fill="#ffffff">${title}</text>
      <text x="224" y="126" text-anchor="middle" font-size="72">${emoji}</text>
    </svg>
  `)}`;

const specializationMeta = {
  Cardiology: {
    icon: <FavoriteIcon sx={{ fontSize: 28 }} />,
    color: '#e11d48',
    accent: '#fb7185',
    surface: '#fff1f2',
    description: 'Heart and cardiovascular health. Our cardiologists specialize in diagnosing and treating heart conditions, managing high blood pressure, and preventing cardiovascular diseases.',
    tag: 'Heart health',
    image: createSpecialtyImage('❤', 'Cardiology', '#fb7185', '#be123c', '#fecdd3'),
  },
  Dermatology: {
    icon: <HealingIcon sx={{ fontSize: 28 }} />,
    color: '#7c3aed',
    accent: '#c084fc',
    surface: '#f5f3ff',
    description: 'Skin, hair and nail care. Dermatologists treat various skin conditions, provide cosmetic solutions, and offer preventive care for optimal skin health.',
    tag: 'Skin care',
    image: createSpecialtyImage('✦', 'Dermatology', '#c084fc', '#6d28d9', '#ddd6fe'),
  },
  Neurology: {
    icon: <PsychologyIcon sx={{ fontSize: 28 }} />,
    color: '#0891b2',
    accent: '#22d3ee',
    surface: '#ecfeff',
    description: 'Brain, spine and nervous system disorders. Neurologists diagnose and treat conditions affecting the brain, spinal cord, and peripheral nerves.',
    tag: 'Neuro care',
    image: createSpecialtyImage('◌', 'Neurology', '#22d3ee', '#155e75', '#a5f3fc'),
  },
  Orthopedics: {
    icon: <BuildIcon sx={{ fontSize: 28 }} />,
    color: '#d97706',
    accent: '#fbbf24',
    surface: '#fffbeb',
    description: 'Bones, joints and musculoskeletal health. Orthopedic specialists treat fractures, joint problems, sports injuries, and provide rehabilitation services.',
    tag: 'Bone & joint',
    image: createSpecialtyImage('✚', 'Orthopedics', '#fbbf24', '#b45309', '#fde68a'),
  },
  Pediatrics: {
    icon: <ChildCareIcon sx={{ fontSize: 28 }} />,
    color: '#059669',
    accent: '#34d399',
    surface: '#ecfdf5',
    description: 'Children and adolescent healthcare. Pediatricians provide comprehensive care including vaccinations, growth monitoring, and treatment for all childhood illnesses.',
    tag: 'Kids care',
    image: createSpecialtyImage('◡', 'Pediatrics', '#6ee7b7', '#059669', '#bbf7d0'),
  },
  Psychiatry: {
    icon: <PsychologyIcon sx={{ fontSize: 28 }} />,
    color: '#c026d3',
    accent: '#e879f9',
    surface: '#fdf4ff',
    description: 'Mental health and psychological wellness. Psychiatrists treat mental health disorders and provide therapy and medication management support.',
    tag: 'Mind health',
    image: createSpecialtyImage('☼', 'Psychiatry', '#f0abfc', '#a21caf', '#f5d0fe'),
  },
  Radiology: {
    icon: <ScienceIcon sx={{ fontSize: 28 }} />,
    color: '#4f46e5',
    accent: '#818cf8',
    surface: '#eef2ff',
    description: 'Medical imaging and diagnostic scans. Radiologists use advanced imaging techniques to diagnose diseases and guide treatment planning effectively.',
    tag: 'Medical imaging',
    image: createSpecialtyImage('◎', 'Radiology', '#818cf8', '#3730a3', '#c7d2fe'),
  },
  Surgery: {
    icon: <LocalHospitalIcon sx={{ fontSize: 28 }} />,
    color: '#dc2626',
    accent: '#f87171',
    surface: '#fef2f2',
    description: 'Surgical procedures and advanced care. Surgeons perform planned and emergency surgical interventions across various medical specialties.',
    tag: 'Surgical care',
    image: createSpecialtyImage('✚', 'Surgery', '#f87171', '#b91c1c', '#fecaca'),
  },
  Urology: {
    icon: <HealingIcon sx={{ fontSize: 28 }} />,
    color: '#7c3aed',
    accent: '#a78bfa',
    surface: '#f5f3ff',
    description: 'Urinary and reproductive health. Urologists treat conditions of the urinary system and male reproductive organs with specialized expertise.',
    tag: 'Uro care',
    image: createSpecialtyImage('◔', 'Urology', '#a78bfa', '#6d28d9', '#ddd6fe'),
  },
  Gynecology: {
    icon: <FavoriteIcon sx={{ fontSize: 28 }} />,
    color: '#db2777',
    accent: '#f472b6',
    surface: '#fdf2f8',
    description: "Women's reproductive health and wellness. Gynecologists provide comprehensive care including pregnancy care and reproductive health management.",
    tag: 'Women care',
    image: createSpecialtyImage('❀', 'Gynecology', '#f9a8d4', '#be185d', '#fbcfe8'),
  },
  Ophthalmology: {
    icon: <VisibilityIcon sx={{ fontSize: 28 }} />,
    color: '#0284c7',
    accent: '#38bdf8',
    surface: '#f0f9ff',
    description: 'Vision and eye care. Ophthalmologists diagnose and treat eye conditions, perform surgery, and provide vision correction solutions.',
    tag: 'Eye care',
    image: createSpecialtyImage('◉', 'Ophthalmology', '#38bdf8', '#0369a1', '#bae6fd'),
  },
  ENT: {
    icon: <HearingIcon sx={{ fontSize: 28 }} />,
    color: '#0f766e',
    accent: '#2dd4bf',
    surface: '#f0fdfa',
    description: 'Ear, nose and throat care. ENT specialists treat conditions affecting hearing, balance, breathing, and swallowing functions.',
    tag: 'ENT care',
    image: createSpecialtyImage('◐', 'ENT', '#5eead4', '#0f766e', '#99f6e4'),
  },
  Dentistry: {
    icon: <HealingIcon sx={{ fontSize: 28 }} />,
    color: '#ea580c',
    accent: '#fb923c',
    surface: '#fff7ed',
    description: 'Dental and oral health. Dentists provide preventive care, dental treatment, cosmetic procedures, and oral health education.',
    tag: 'Dental care',
    image: createSpecialtyImage('✺', 'Dentistry', '#fdba74', '#c2410c', '#fed7aa'),
  },
  'General Medicine': {
    icon: <LocalHospitalIcon sx={{ fontSize: 28 }} />,
    color: '#2563eb',
    accent: '#60a5fa',
    surface: '#eff6ff',
    description: 'Primary care and general health. General physicians provide comprehensive healthcare for all ages and manage various health conditions.',
    tag: 'Primary care',
    image: createSpecialtyImage('✚', 'General Medicine', '#60a5fa', '#1d4ed8', '#bfdbfe'),
  },
};

const trustHighlights = [
  {
    title: 'Trusted specialists',
    description: 'Browse experienced doctors across major specialties with clear profile details.',
    icon: <VerifiedUserIcon sx={{ fontSize: 26 }} />,
    accent: '#dbeafe',
    color: '#1d4ed8',
  },
  {
    title: 'Fast booking flow',
    description: 'Find a doctor, review their profile, and move to booking in just a few steps.',
    icon: <AccessTimeIcon sx={{ fontSize: 26 }} />,
    accent: '#dcfce7',
    color: '#15803d',
  },
  {
    title: 'Meaningful care choices',
    description: 'Filter by specialty so patients can reach the right expert without confusion.',
    icon: <SupportAgentIcon sx={{ fontSize: 26 }} />,
    accent: '#fee2e2',
    color: '#b91c1c',
  },
];

const careJourney = [
  {
    title: 'Choose your need',
    description: 'Start with a specialty that matches your symptoms or treatment goal.',
    icon: <TuneIcon sx={{ fontSize: 24 }} />,
  },
  {
    title: 'Compare doctors',
    description: 'Review ratings, experience, fees, and profile details before deciding.',
    icon: <MedicalServicesIcon sx={{ fontSize: 24 }} />,
  },
  {
    title: 'Book with confidence',
    description: 'Sign in only when you are ready to confirm the appointment.',
    icon: <CalendarMonthIcon sx={{ fontSize: 24 }} />,
  },
];

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('All Doctors');
  const [loadingSpecializations, setLoadingSpecializations] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadSpecializations = async () => {
      try {
        const response = await doctorsAPI.getSpecializations();
        setSpecializations(response.data || []);
      } catch (err) {
        console.error('Error fetching specializations:', err);
        setError('Unable to load specialties right now.');
      } finally {
        setLoadingSpecializations(false);
      }
    };

    loadSpecializations();
  }, []);

  const visibleSpecializations = useMemo(() => specializations.slice(0, 10), [specializations]);
  const allDoctorsMeta = useMemo(
    () => ({
      icon: <LocalHospitalIcon sx={{ fontSize: 28 }} />,
      color: '#2563eb',
      accent: '#7dd3fc',
      surface: '#eff6ff',
      description: 'Browse every available specialty from one place.',
      tag: 'All specialties',
      image: createSpecialtyImage('+', 'All Doctors', '#7dd3fc', '#1d4ed8', '#bfdbfe'),
    }),
    []
  );

  const activeHeadline = 'Find the right doctor with more clarity and less stress';

  const getSpecializationMeta = (specialization) => specializationMeta[specialization] || allDoctorsMeta;

  const handleSpecialtyClick = (specialization) => {
    if (specialization === null || specialization === '') {
      setSelectedSpecialty('All Doctors');
    } else {
      setSelectedSpecialty(specialization);
    }
  };

  const handleViewDoctors = () => {
    if (selectedSpecialty && selectedSpecialty !== 'All Doctors') {
      navigate(`/specialty/${encodeURIComponent(selectedSpecialty)}`);
    } else {
      navigate('/doctors');
    }
  };

  const handleBook = (doctorId) => {
    if (isAuthenticated) {
      navigate(`/book-appointment/${doctorId}`);
      return;
    }

    navigate('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top left, rgba(14, 165, 233, 0.12), transparent 28%), radial-gradient(circle at right center, rgba(59, 130, 246, 0.14), transparent 24%), linear-gradient(180deg, #f5fbff 0%, #eef6fb 52%, #f8fafc 100%)',
        pb: 10,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #083b5c 0%, #0f6b78 48%, #dff6ff 100%)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at 15% 15%, rgba(255,255,255,0.22), transparent 20%), radial-gradient(circle at 85% 18%, rgba(255,255,255,0.18), transparent 24%), radial-gradient(circle at 70% 80%, rgba(255,255,255,0.12), transparent 18%)',
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', py: { xs: 7, md: 10 } }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} lg={7}>
              <Chip
                label="Smart search for better care decisions"
                sx={{
                  mb: 2.5,
                  bgcolor: 'rgba(255,255,255,0.9)',
                  color: '#0f172a',
                  fontWeight: 700,
                }}
              />
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  color: '#ffffff',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  mb: 2,
                  maxWidth: 780,
                  WebkitTextFillColor: 'unset',
                }}
              >
                {activeHeadline}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255,255,255,0.88)',
                  maxWidth: 720,
                  fontWeight: 400,
                  mb: 3,
                }}
              >
                Discover specialists, compare profiles, and book appointments from one clear, patient-friendly
                experience designed to help families act sooner and choose care with confidence.
              </Typography>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3.5 }}>
                <Button
                  variant="contained"
                  endIcon={<ArrowForwardIcon />}
                  onClick={() => {
                    const section = document.getElementById('specialty-section');
                    section?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #e0f2fe 100%)',
                    color: '#0f172a',
                    px: 3.5,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #f8fafc 0%, #bae6fd 100%)',
                    },
                  }}
                >
                  Explore Specialties
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/doctors')}
                  sx={{
                    color: '#ffffff',
                    borderColor: 'rgba(255,255,255,0.72)',
                    '&:hover': {
                      borderColor: '#ffffff',
                      backgroundColor: 'rgba(255,255,255,0.08)',
                    },
                  }}
                >
                  View All Doctors
                </Button>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} flexWrap="wrap" useFlexGap>
                <Chip
                  icon={<LocalHospitalIcon />}
                  label={`${specializations.length} specialties`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#ffffff' }}
                />
                <Chip
                  icon={<MedicalServicesIcon />}
                  label={`${specializations.length} specialties`}
                  sx={{ bgcolor: 'rgba(255,255,255,0.14)', color: '#ffffff' }}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Card
                sx={{
                  borderRadius: '28px',
                  background: 'rgba(255,255,255,0.92)',
                  border: '1px solid rgba(255,255,255,0.35)',
                  boxShadow: '0 28px 60px rgba(8, 59, 92, 0.22)',
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 } }}>
                  <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 1.2 }}>
                    Patient-first experience
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1.2 }}>
                    Care navigation that feels simple
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 3 }}>
                    The homepage now guides patients through what matters most: identifying the right specialty,
                    reviewing trustworthy doctor information, and reaching booking without unnecessary friction.
                  </Typography>

                  <Stack spacing={1.5}>
                    {careJourney.map((item, index) => (
                      <Box
                        key={item.title}
                        sx={{
                          display: 'flex',
                          gap: 2,
                          p: 2,
                          borderRadius: '18px',
                          background:
                            index === 0 ? '#eff6ff' : index === 1 ? '#f0fdf4' : '#fff7ed',
                        }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: '#ffffff',
                            color: 'primary.main',
                            width: 48,
                            height: 48,
                            boxShadow: '0 8px 18px rgba(37, 99, 235, 0.12)',
                          }}
                        >
                          {item.icon}
                        </Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700, mb: 0.4 }}>{`${index + 1}. ${item.title}`}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.description}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pt: 5 }}>
        {error && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: '16px' }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3} sx={{ mb: 5 }}>
          {trustHighlights.map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Card
                sx={{
                  height: '100%',
                  background: 'rgba(255,255,255,0.78)',
                  backdropFilter: 'blur(10px)',
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Avatar
                    sx={{
                      bgcolor: item.accent,
                      color: item.color,
                      width: 54,
                      height: 54,
                      mb: 2,
                    }}
                  >
                    {item.icon}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
                    {item.title}
                  </Typography>
                  <Typography color="text.secondary">{item.description}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box
          id="specialty-section"
          sx={{
            mb: 6,
            p: { xs: 2.5, md: 3.5 },
            borderRadius: '28px',
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.12)',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 1.2 }}>
              Explore care areas
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Start by choosing the kind of care you need
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }}>
              These specialties help patients move directly to relevant doctors instead of scanning a long list without
              context.
            </Typography>
          </Box>

          {loadingSpecializations ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <Card
                  onClick={() => handleSpecialtyClick(null)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    overflow: 'hidden',
                    border: selectedSpecialty === 'All Doctors' ? `2px solid ${allDoctorsMeta.color}` : '1px solid rgba(148, 163, 184, 0.16)',
                    background: '#ffffff',
                    boxShadow: selectedSpecialty === 'All Doctors' ? '0 22px 42px rgba(37, 99, 235, 0.18)' : '0 10px 24px rgba(15, 23, 42, 0.06)',
                    transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 24px 44px rgba(15, 23, 42, 0.14)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      height: 150,
                      backgroundImage: `url("${allDoctorsMeta.image}")`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: allDoctorsMeta.surface,
                        color: allDoctorsMeta.color,
                        width: 56,
                        height: 56,
                        border: `1px solid ${allDoctorsMeta.accent}55`,
                        boxShadow: '0 12px 24px rgba(37, 99, 235, 0.14)',
                        mx: 'auto',
                        mb: 1.5,
                      }}
                    >
                      {allDoctorsMeta.icon}
                    </Avatar>
                    <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>All Doctors</Typography>
                  </CardContent>
                </Card>
              </Grid>

              {visibleSpecializations.map((specialization) => {
                const meta = getSpecializationMeta(specialization);

                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={specialization}>
                    <Card
                      onClick={() => handleSpecialtyClick(specialization)}
                      sx={{
                        cursor: 'pointer',
                        height: '100%',
                        overflow: 'hidden',
                        border: selectedSpecialty === specialization ? `2px solid ${meta.color}` : '1px solid rgba(148, 163, 184, 0.16)',
                        background: '#ffffff',
                        boxShadow: selectedSpecialty === specialization ? `0 22px 42px ${meta.color}26` : '0 10px 24px rgba(15, 23, 42, 0.06)',
                        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                        '&:hover': {
                          transform: 'translateY(-6px)',
                          boxShadow: `0 24px 44px ${meta.color}22`,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          height: 150,
                          backgroundImage: `url("${meta.image}")`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <CardContent sx={{ p: 2.5, textAlign: 'center' }}>
                        <Avatar
                          sx={{
                            bgcolor: meta.surface,
                            color: meta.color,
                            width: 56,
                            height: 56,
                            border: `1px solid ${meta.accent}55`,
                            boxShadow: `0 12px 24px ${meta.color}22`,
                            mx: 'auto',
                            mb: 1.5,
                          }}
                        >
                          {meta.icon}
                        </Avatar>
                        <Typography sx={{ fontWeight: 800, fontSize: '1rem' }}>{specialization}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>

        {/* Specialty Description Section */}
        {selectedSpecialty && (
          <Box
            sx={{
              mb: 6,
              p: { xs: 3, md: 4 },
              borderRadius: '24px',
              background: selectedSpecialty === 'All Doctors'
                ? `linear-gradient(135deg, ${allDoctorsMeta.color}15 0%, ${allDoctorsMeta.accent}10 100%)`
                : `linear-gradient(135deg, ${getSpecializationMeta(selectedSpecialty).color}15 0%, ${getSpecializationMeta(selectedSpecialty).accent}10 100%)`,
              border: selectedSpecialty === 'All Doctors'
                ? `2px solid ${allDoctorsMeta.color}40`
                : `2px solid ${getSpecializationMeta(selectedSpecialty).color}40`,
              transition: 'all 0.3s ease',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, mb: 2 }}>
              <Avatar
                sx={{
                  width: 64,
                  height: 64,
                  bgcolor: selectedSpecialty === 'All Doctors'
                    ? `${allDoctorsMeta.color}20`
                    : `${getSpecializationMeta(selectedSpecialty).color}20`,
                  color: selectedSpecialty === 'All Doctors'
                    ? allDoctorsMeta.color
                    : getSpecializationMeta(selectedSpecialty).color,
                  boxShadow: selectedSpecialty === 'All Doctors'
                    ? `0 12px 24px ${allDoctorsMeta.color}22`
                    : `0 12px 24px ${getSpecializationMeta(selectedSpecialty).color}22`,
                }}
              >
                {selectedSpecialty === 'All Doctors'
                  ? allDoctorsMeta.icon
                  : getSpecializationMeta(selectedSpecialty).icon}
              </Avatar>
              <Box>
                <Typography variant="overline" sx={{
                  color: selectedSpecialty === 'All Doctors' ? allDoctorsMeta.color : getSpecializationMeta(selectedSpecialty).color,
                  fontWeight: 800
                }}>
                  Selected Specialty
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, color: 'text.primary' }}>
                  {selectedSpecialty}
                </Typography>
              </Box>
            </Box>

            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.8,
                mb: 3,
                fontSize: '1.05rem',
              }}
            >
              {selectedSpecialty === 'All Doctors'
                ? allDoctorsMeta.description
                : getSpecializationMeta(selectedSpecialty).description}
            </Typography>

            <Button
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={handleViewDoctors}
              sx={{
                background: selectedSpecialty === 'All Doctors'
                  ? `linear-gradient(135deg, ${allDoctorsMeta.color} 0%, ${allDoctorsMeta.accent} 100%)`
                  : `linear-gradient(135deg, ${getSpecializationMeta(selectedSpecialty).color} 0%, ${getSpecializationMeta(selectedSpecialty).accent} 100%)`,
                '&:hover': {
                  background: selectedSpecialty === 'All Doctors'
                    ? `linear-gradient(135deg, ${allDoctorsMeta.accent} 0%, ${allDoctorsMeta.color} 100%)`
                    : `linear-gradient(135deg, ${getSpecializationMeta(selectedSpecialty).accent} 0%, ${getSpecializationMeta(selectedSpecialty).color} 100%)`,
                },
              }}
            >
              View Doctors in {selectedSpecialty}
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
