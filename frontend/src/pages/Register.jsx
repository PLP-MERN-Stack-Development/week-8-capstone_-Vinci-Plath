import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/auth/AuthForm';

const Register = () => {
  const { register, loading, error } = useAuth();
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || undefined,
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setFormError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setFormError('An unexpected error occurred. Please try again.');
      console.error('Registration error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthForm 
        type="register" 
        onSubmit={handleSubmit} 
        loading={loading} 
        error={formError || error}
      />
    </div>
  );
};

export default Register;
