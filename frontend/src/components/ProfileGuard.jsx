import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useNavigate, useLocation } from 'react-router-dom';

const ProfileGuard = ({ children }) => {
    const { user, isSignedIn, isLoaded } = useUser();
    const navigate = useNavigate();
    const location = useLocation();
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        if (!isLoaded) return;
        if (!isSignedIn) { setChecked(true); return; }

        const role = user?.publicMetadata?.role;
        if (role !== 'citizen') { setChecked(true); return; }
        if (location.pathname === '/profile') { setChecked(true); return; }

        const checkProfile = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/profile/${user.id}`);
                if (res.status === 404) navigate('/profile', { replace: true });
            } catch (err) {
                console.error('Profile check failed:', err);
            } finally {
                setChecked(true);
            }
        };
        checkProfile();
    }, [isLoaded, isSignedIn, user, location.pathname, navigate]);

    if (!checked) return null;
    return children;
};

export default ProfileGuard;