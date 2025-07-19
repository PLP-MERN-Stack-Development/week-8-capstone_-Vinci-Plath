import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AuthForm from '../components/auth/AuthForm';

const Login = () => {
  const { login, loading, error } = useAuth();
  const [formError, setFormError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      
      if (result.success) {
        navigate('/');
      } else {
        setFormError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setFormError('An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AuthForm 
        type="login" 
        onSubmit={handleSubmit} 
        loading={loading} 
        error={formError || error}
      />
    </div>
  );
};

export default Login;
