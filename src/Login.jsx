import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from './firebase';
import { GoogleAuthProvider } from 'firebase/auth';
import './Login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSignup, setIsSignup] = useState(false);
    const navigate = useNavigate();

    const googleProvider = new GoogleAuthProvider();

    const handleLogin = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User ID:', user.uid);
                navigate('/dashboard');
            })
            .catch((err) => {
                setError('Invalid email or password');
                console.error(err);
            });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log('User ID:', user.uid);
                navigate('/dashboard');
            })
            .catch((err) => {
                setError('Failed to create an account');
                console.error(err);
            });
    };

    const handleGoogleSignIn = () => {
        signInWithPopup(auth, googleProvider)
            .then((result) => {
                const user = result.user;
                console.log('User ID:', user.uid);
                navigate('/dashboard');
            })
            .catch((err) => {
                setError('Failed to sign in with Google');
                console.error(err);
            });
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="card shadow-sm" style={{ width: '400px' }}>
                <div className="card-body">
                    <h2 className="card-title text-center">{isSignup ? 'Sign Up' : 'Login'}</h2>
                    {error && <p className="text-danger">{error}</p>}
                    <form onSubmit={isSignup ? handleSignup : handleLogin}>
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-100">
                            {isSignup ? 'Sign Up' : 'Login'}
                        </button>
                    </form>

                    <div className="text-center my-3">
                        <p>Or {isSignup ? 'Sign Up' : 'Login'} with Google:</p>
                        <button onClick={handleGoogleSignIn} className="btn btn-outline-danger w-100">
                            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" />
                            Continue with Google
                        </button>
                    </div>

                    <p className="text-center">
                        {isSignup ? 'Already have an account?' : 'Don’t have an account?'}
                        <span
                            className="text-primary cursor-pointer"
                            onClick={() => {
                                setIsSignup(!isSignup);
                                setError('');
                            }}
                        >
                            {isSignup ? ' Login' : ' Sign Up'}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
