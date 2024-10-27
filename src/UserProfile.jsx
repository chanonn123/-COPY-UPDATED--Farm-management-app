import React, { useEffect, useState } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserProfile = () => {
    const storage = getStorage();
    const [email, setEmail] = useState('');
    const [profilePic, setProfilePic] = useState(null);
    const [newProfilePic, setNewProfilePic] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const currentUser = auth.currentUser;

        if (currentUser) {
            setEmail(currentUser.email);
            fetchProfilePic(currentUser.uid);
        } else {
            setError('User is not authenticated.');
        }
    }, []);

    const fetchProfilePic = async (uid) => {
        try {
            const storageRef = ref(storage, `profile_pics/${uid}`);
            const url = await getDownloadURL(storageRef);
            setProfilePic(url);
        } catch (err) {
            console.warn('No profile picture found for this user.');
        }
    };

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];
        setNewProfilePic(file);
    };

    const handleUploadProfilePic = async () => {
        if (!newProfilePic) return;

        setLoading(true);
        setError('');

        const currentUser = auth.currentUser;
        if (currentUser) {
            try {
                const storageRef = ref(storage, `profile_pics/${currentUser.uid}`);
                await uploadBytes(storageRef, newProfilePic);
                const downloadURL = await getDownloadURL(storageRef);
                setProfilePic(downloadURL);
            } catch (err) {
                setError('Error uploading profile picture. Please try again.');
            } finally {
                setLoading(false);
            }
        } else {
            setError('User is not authenticated.');
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex flex-column justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <h2>User Profile</h2>
            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">{error}</p>}
            <div className="text-center mb-3">
                <p>Email: {email || 'No email available'}</p>
                {profilePic ? (
                    <img
                        src={profilePic}
                        alt="Profile"
                        className="img-fluid rounded-circle"
                        style={{ width: '200px', height: '200px' }}
                    />
                ) : (
                    <p>No profile picture uploaded.</p>
                )}
            </div>
            <input
                id="profilePicInput"
                type="file"
                onChange={handleProfilePicChange}
                accept="image/*"
                className="form-control mb-2"
                aria-label="Upload Profile Picture"
            />
            <button className="btn btn-primary" onClick={handleUploadProfilePic} disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Profile Picture'}
            </button>
        </div>
    );
};

export default UserProfile;
