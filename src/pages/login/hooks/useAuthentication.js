import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useCreateUserAccountMutation } from '../../../api/doctor-information/AuthenticationApi'; 
import toast from 'react-hot-toast';

export const useAuthentication = () => {
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [createUserAccount, { isLoading }] = useCreateUserAccountMutation();

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(prev => !prev);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(prev => !prev);
    }
  };
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[#\$%&])[A-Za-z\d#\$%&]{6,}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error(t('register.emailRequired'));
      return;
    }
    if (!password) {
      toast.error(t('register.passwordRequired'));
      return;
    }
      if (!passwordRegex.test(password)) {
    const msg = t("register.passwordWeak");
    toast.error(msg);
    return false;
  }
    if (password !== confirmPassword) {
      toast.error(t('register.passwordMismatch'));
      return;
    }
    const loader = toast.loading(t('loading'));

    try {
      const response = await createUserAccount({
        email,
        password,
        confirmPassword,
        userRole: 1,
      }).unwrap();

      console.log('Account created response:', response);
      if(response.succeeded){

      }

    } catch (error) {
      const errorMessage = error?.data?.message || t('register.error');
      toast.error(errorMessage);
    }finally {
      toast.dismiss(loader);
    }
  };

  return {
    formState: {
      email,
      password,
      confirmPassword,
      showPassword,
      showConfirmPassword,
      isLoading,
    },
    handlers: {
      setEmail,
      setPassword,
      setConfirmPassword,
      togglePasswordVisibility,
      handleSubmit,
    },
  };
};