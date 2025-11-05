import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Divider,
  Paper,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Person,
  Email,
  Phone,
  Cake,
  Female,
  LocationOn,
  MedicalServices,
  Allergy,
  CalendarToday
} from '@mui/icons-material';
import { patientService } from './test2';

const PatientProfile = () => {
  const [patientId, setPatientId] = useState('4');
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchPatientData = async () => {
    if (!patientId) return;
    
    setLoading(true);
    setError('');
    
    try {
      const data = await patientService.getPatientBasicInfo(patientId);
      setPatientData(data);
    } catch (err) {
      setError('فشل في جلب البيانات. تأكد من معرف المريض');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatientData();
  }, []);

  // دالة لتحويل التاريخ
  const formatDate = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00') return 'لا يوجد';
    return new Date(dateString).toLocaleDateString('ar-EG');
  };

  // دالة لحساب العمر
  const calculateAge = (dateString) => {
    if (!dateString || dateString === '0001-01-01T00:00:00') return 'غير معروف';
    const birthDate = new Date(dateString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* العنوان */}
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        align="center" 
        color="primary"
        sx={{ 
          fontWeight: 'bold',
          mb: 4,
          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
        }}
      >
        🏥 الملف الشخصي للمريض
      </Typography>

      {/* شريط البحث */}
      <Paper elevation={2} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
          <TextField
            label="🔍 أدخل معرف المريض"
            type="number"
            value={patientId}
            onChange={(e) => setPatientId(e.target.value)}
            sx={{ minWidth: 250 }}
            size="small"
          />
          <Button
            variant="contained"
            onClick={fetchPatientData}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
            sx={{ px: 4 }}
          >
            {loading ? 'جاري البحث...' : 'عرض البيانات'}
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress size={60} />
        </Box>
      )}

      {patientData && patientData.data && (
        <Grid container spacing={3}>
          {/* البطاقة الرئيسية */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                {/* الصورة */}
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    mx: 'auto',
                    mb: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2.5rem'
                  }}
                >
                  <Person sx={{ fontSize: 60 }} />
                </Avatar>

                {/* الاسم */}
                <Typography variant="h4" component="h2" gutterBottom color="primary">
                  {patientData.data.firstName} {patientData.data.lastName}
                </Typography>

                {/* المعلومات الأساسية */}
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                  <InfoItem 
                    icon={<Email color="primary" />} 
                    label="البريد الإلكتروني" 
                    value={patientData.data.email} 
                  />
                  
                  <InfoItem 
                    icon={<Phone color="primary" />} 
                    label="رقم الهاتف" 
                    value={patientData.data.phoneNumber} 
                  />
                  
                  <InfoItem 
                    icon={<Cake color="primary" />} 
                    label="تاريخ الميلاد" 
                    value={formatDate(patientData.data.dateOfBirth)} 
                  />
                  
                  <InfoItem 
                    icon={<Female color="primary" />} 
                    label="العمر" 
                    value={`${calculateAge(patientData.data.dateOfBirth)} سنة`} 
                  />
                  
                  <InfoItem 
                    icon={<Female color="primary" />} 
                    label="النوع" 
                    value={patientData.data.genderName} 
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* المعلومات الطبية */}
          <Grid item xs={12} md={8}>
            <Card elevation={3} sx={{ height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" component="h3" gutterBottom color="secondary" sx={{ mb: 3 }}>
                  📋 المعلومات الطبية
                </Typography>

                {/* الحساسيات */}
                <Section 
                  title="🩺 الحساسيات" 
                  items={patientData.data.allergiesNames}
                  emptyMessage="لا توجد حساسيات مسجلة"
                  color="error"
                />

                <Divider sx={{ my: 3 }} />

                {/* الأمراض المزمنة */}
                <Section 
                  title="💊 الأمراض المزمنة" 
                  items={patientData.data.chronicDiseasesNames}
                  emptyMessage="لا توجد أمراض مزمنة مسجلة"
                  color="warning"
                />

                <Divider sx={{ my: 3 }} />

                {/* الأدوية */}
                <Section 
                  title="🧪 الأدوية" 
                  items={patientData.data.medicinesNames}
                  emptyMessage="لا توجد أدوية مسجلة"
                  color="info"
                />

                <Divider sx={{ my: 3 }} />

                {/* آخر زيارة */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                  <CalendarToday color="action" />
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      آخر زيارة
                    </Typography>
                    <Typography variant="h6">
                      {formatDate(patientData.data.lastVisit)}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* معلومات إضافية */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom color="primary">
                  📍 معلومات إضافية
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <InfoItem 
                      icon={<LocationOn color="primary" />} 
                      label="البلد" 
                      value={patientData.data.countryName || 'غير محدد'} 
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InfoItem 
                      icon={<LocationOn color="primary" />} 
                      label="المدينة" 
                      value={patientData.data.cityName || 'غير محدد'} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <InfoItem 
                      icon={<LocationOn color="primary" />} 
                      label="العنوان" 
                      value={patientData.data.address || 'غير محدد'} 
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

// مكون مساعد لعرض عنصر معلومات
const InfoItem = ({ icon, label, value }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, direction: 'rtl' }}>
    {icon}
    <Box sx={{ flexGrow: 1, textAlign: 'right' }}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6">
        {value || 'غير محدد'}
      </Typography>
    </Box>
  </Box>
);

// مكون مساعد لعرض الأقسام
const Section = ({ title, items, emptyMessage, color }) => (
  <Box sx={{ mb: 3 }}>
    <Typography variant="h6" gutterBottom color={color}>
      {title}
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
      {items && items.length > 0 ? (
        items.map((item, index) => (
          <Chip 
            key={index}
            label={item}
            color={color}
            variant="outlined"
            sx={{ fontSize: '0.9rem' }}
          />
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          {emptyMessage}
        </Typography>
      )}
    </Box>
  </Box>
);

export default PatientProfile;