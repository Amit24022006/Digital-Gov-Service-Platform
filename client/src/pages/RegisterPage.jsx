import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/login?mode=register', { replace: true });
  }, [navigate]);
  return null;
}
