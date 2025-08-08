import React, { useState } from 'react';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Logo = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 10px;
  color: #333;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 30px;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Input = styled.input`
  padding: 15px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #667eea;
  }

  &::placeholder {
    color: #999;
  }
`;

const CodeInput = styled(Input)`
  text-align: center;
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 8px;
  font-family: 'Courier New', monospace;
`;

const Button = styled.button`
  padding: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryButton = styled(Button)`
  background: transparent;
  color: #667eea;
  border: 2px solid #667eea;

  &:hover:not(:disabled) {
    background: #667eea;
    color: white;
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  background: #ffeaea;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 10px;
`;

const SuccessMessage = styled.div`
  color: #27ae60;
  background: #eafaf1;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-top: 10px;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-bottom: 30px;
`;

const Step = styled.div`
  width: 40px;
  height: 6px;
  border-radius: 3px;
  background: ${props => props.active ? '#667eea' : '#e1e5e9'};
  transition: background 0.2s ease;
`;

const Login = () => {
  const { requestLoginCode, verifyLoginCode } = useAuth();
  const [currentStep, setCurrentStep] = useState('email'); // 'email' or 'code'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setIsLoading(true);

    const result = await requestLoginCode(email);
    
    if (result.success) {
      setSuccessMessage('Login code sent! Check your console for the email.');
      setCurrentStep('code');
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await verifyLoginCode(email, code);
    
    if (result.success) {
      // AuthContext will handle the redirect
    } else {
      setError(result.error);
    }
    
    setIsLoading(false);
  };

  const goBackToEmail = () => {
    setCurrentStep('email');
    setCode('');
    setError('');
    setSuccessMessage('');
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Logo>🎵 Musikkhylla</Logo>
        <Subtitle>Welcome to your music collection</Subtitle>
        
        <StepIndicator>
          <Step active={true} />
          <Step active={currentStep === 'code'} />
        </StepIndicator>

        {currentStep === 'email' ? (
          <Form onSubmit={handleEmailSubmit}>
            <Input
              type="email"
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || !email}>
              {isLoading ? 'Sending...' : 'Send Login Code'}
            </Button>
          </Form>
        ) : (
          <Form onSubmit={handleCodeSubmit}>
            <div>
              <p style={{ color: '#666', marginBottom: '10px' }}>
                Enter the 6-digit code sent to:
              </p>
              <p style={{ color: '#333', fontWeight: '600', marginBottom: '20px' }}>
                {email}
              </p>
            </div>
            <CodeInput
              type="text"
              placeholder="000000"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              required
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading || code.length !== 6}>
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </Button>
            <SecondaryButton type="button" onClick={goBackToEmail}>
              Use Different Email
            </SecondaryButton>
          </Form>
        )}

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
