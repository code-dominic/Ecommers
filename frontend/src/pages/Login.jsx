import React, { useState } from "react";
import { ChevronLeft, ChevronRight, User, Mail, Lock, Eye, EyeOff, UserStar } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const BackendURL = import.meta.env.VITE_APP_BackendUrl;// Replace with your actual backend URL



export default function AuthPage({ setToken }) {
  
  const navigate = useNavigate();

  // Common states
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
//   const [showAppPassword, setShowAppPassword] = useState(false);
  const [isSliding, setIsSliding] = useState(false);
//   const [showInstructions, setShowInstructions] = useState(false);
  
  // Login states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  
  
  // Register states
  const [email, setEmail] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
//   const [appPassword , setAppPassword] = useState("");


  const handleModeSwitch = () => {
    setIsSliding(true);
    setError("");
    setTimeout(() => {
      setIsLogin(!isLogin);
      setIsSliding(false);
    }, 300);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with actual axios call
      // console.log("Login:", { username, password });
    //   alert(backendURL);    
      const res = await axios.post(`${BackendURL}/users/login`, { username, password });
      setToken(res.data.token);
      navigate('/');
      // alert("Login successful! (Demo)");
    } catch (err) {
      setError("Invalid username or password");
      console.error(err);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      // Replace with actual axios call
      console.log("Register:", { username: regUsername, password: regPassword, email });
      
      const res = await axios.post(`${BackendURL}/users/register`, { username: regUsername, password: regPassword, email});
      setToken(res.data.token);
      navigate('/');
      // alert("Registration successful! (Demo)");
    } catch (err) {
      setError("Registration failed. Please try again.");
      console.error(err);
    }
  };

  const inputStyle = {
    width: '100%',
    height: '56px',
    paddingLeft: '50px',
    paddingRight: '50px',
    border: '2px solid transparent',
    borderRadius: '16px',
    background: 'rgba(247, 250, 252, 0.8)',
    backdropFilter: 'blur(10px)',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    outline: 'none'
  };

  const inputFocusStyle = {
    borderColor: '#667eea',
    background: 'white',
    boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)'
  };

  return (
    <>
      {/* <NavBar /> */}
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden',
        paddingTop: '80px'
      }}>
        {/* Floating shapes */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', overflow: 'hidden', zIndex: 1 }}>
          <div style={{
            position: 'absolute',
            width: '100px',
            height: '100px',
            top: '20%',
            left: '10%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            animation: 'float 6s ease-in-out infinite'
          }}></div>
          <div style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            top: '60%',
            right: '15%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            animation: 'float 6s ease-in-out infinite 2s'
          }}></div>
          <div style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            bottom: '20%',
            left: '20%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            animation: 'float 6s ease-in-out infinite 4s'
          }}></div>
          <div style={{
            position: 'absolute',
            width: '120px',
            height: '120px',
            top: '40%',
            right: '30%',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            animation: 'float 6s ease-in-out infinite 3s'
          }}></div>
        </div>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 'calc(100vh - 80px)',
          padding: '2rem',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ width: '100%', maxWidth: '500px' }}>
            {/* Toggle Buttons */}
            <div style={{
              position: 'relative',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: '50px',
              padding: '4px',
              marginBottom: '2rem',
              display: 'flex',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}>
              <button 
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  padding: '12px 24px',
                  color: isLogin ? '#667eea' : 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '46px',
                  transition: 'all 0.3s ease',
                  fontWeight: '500',
                  position: 'relative',
                  zIndex: 2,
                  cursor: 'pointer'
                }}
                onClick={() => !isLogin && handleModeSwitch()}
              >
                Login
              </button>
              <button 
                style={{
                  flex: 1,
                  background: 'none',
                  border: 'none',
                  padding: '12px 24px',
                  color: !isLogin ? '#667eea' : 'rgba(255, 255, 255, 0.7)',
                  borderRadius: '46px',
                  transition: 'all 0.3s ease',
                  fontWeight: '500',
                  position: 'relative',
                  zIndex: 2,
                  cursor: 'pointer'
                }}
                onClick={() => isLogin && handleModeSwitch()}
              >
                Register
              </button>
              <div style={{
                position: 'absolute',
                top: '4px',
                bottom: '4px',
                width: 'calc(50% - 4px)',
                background: 'white',
                borderRadius: '42px',
                transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                transform: isLogin ? 'translateX(0)' : 'translateX(100%)'
              }}></div>
            </div>

            {/* Card Container */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '24px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              minHeight: '500px',
              overflow: 'hidden',
              padding: '2rem',
              transform: isSliding ? 'rotateY(90deg)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d'
            }}>
              {isLogin ? (
                // Login Form
                <div style={{ opacity: isSliding ? 0 : 1, transition: 'opacity 0.3s ease' }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <User size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
                    <h2 style={{ 
                      color: '#2d3748', 
                      fontWeight: '700', 
                      fontSize: '1.8rem', 
                      marginBottom: '0.5rem' 
                    }}>Welcome Back</h2>
                    <p style={{ color: '#718096', margin: 0 }}>Sign in to your account</p>
                  </div>

                  {error && (
                    <div style={{
                      background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      marginBottom: '1rem',
                      border: 'none'
                    }}>
                      {error}
                    </div>
                  )}

                  <div onSubmit={handleLoginSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <User size={20} style={{ position: 'absolute', left: '16px', color: '#a0aec0', zIndex: 2 }} />
                        <input
                          type="text"
                          placeholder="Username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          style={inputStyle}
                          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Lock size={20} style={{ position: 'absolute', left: '16px', color: '#a0aec0', zIndex: 2 }} />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={inputStyle}
                          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '16px',
                            background: 'none',
                            border: 'none',
                            color: '#a0aec0',
                            cursor: 'pointer',
                            padding: 0,
                            zIndex: 2,
                            transition: 'color 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#667eea'}
                          onMouseLeave={(e) => e.target.style.color = '#a0aec0'}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      onClick={handleLoginSubmit}
                      style={{
                        width: '100%',
                        height: '56px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: '600',
                        fontSize: '16px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Sign In
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                // Register Form
                <div style={{ opacity: isSliding ? 0 : 1, transition: 'opacity 0.3s ease' }}>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <Mail size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
                    <h2 style={{ 
                      color: '#2d3748', 
                      fontWeight: '700', 
                      fontSize: '1.8rem', 
                      marginBottom: '0.5rem' 
                    }}>Create Account</h2>
                    <p style={{ color: '#718096', margin: 0 }}>Join us today</p>
                  </div>

                  {error && (
                    <div style={{
                      background: 'linear-gradient(135deg, #ff6b6b, #ee5a52)',
                      color: 'white',
                      padding: '12px 16px',
                      borderRadius: '12px',
                      marginBottom: '1rem',
                      border: 'none'
                    }}>
                      {error}
                    </div>
                  )}

                  <div onSubmit={handleRegisterSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Mail size={20} style={{ position: 'absolute', left: '16px', color: '#a0aec0', zIndex: 2 }} />
                        <input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          style={inputStyle}
                          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <User size={20} style={{ position: 'absolute', left: '16px', color: '#a0aec0', zIndex: 2 }} />
                        <input
                          type="text"
                          placeholder="Username"
                          value={regUsername}
                          onChange={(e) => setRegUsername(e.target.value)}
                          style={inputStyle}
                          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                          required
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <Lock size={20} style={{ position: 'absolute', left: '16px', color: '#a0aec0', zIndex: 2 }} />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          style={inputStyle}
                          onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                          onBlur={(e) => Object.assign(e.target.style, inputStyle)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute',
                            right: '16px',
                            background: 'none',
                            border: 'none',
                            color: '#a0aec0',
                            cursor: 'pointer',
                            padding: 0,
                            zIndex: 2,
                            transition: 'color 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#667eea'}
                          onMouseLeave={(e) => e.target.style.color = '#a0aec0'}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                    </div>

                    

                    <button
                      type="submit"
                      onClick={handleRegisterSubmit}
                      style={{
                        width: '100%',
                        height: '56px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        border: 'none',
                        borderRadius: '16px',
                        fontWeight: '600',
                        fontSize: '16px',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        marginBottom: '1.5rem'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Create Account
                      <ChevronRight size={20} />
                    </button>
                  </div>

                 
                </div>
              )}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-20px) rotate(180deg);
            }
          }

          @media (max-width: 768px) {
            .auth-container {
              padding: 1rem !important;
            }
          }
        `}</style>
      </div>
    </>
  );
}