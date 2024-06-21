import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.css';

function Header() {
    const [studentInfo, setStudentInfo] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchStudentInfo();
    }, []);

    const fetchStudentInfo = async () => {
        const user_id = localStorage.getItem('user_id');
        if (!user_id) {
            console.error('User ID not found. Please log in.');
            navigate('/login');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/api/student-info', { user_id });
            console.log(response);
            if (response.data && response.data.length > 0) {
                setStudentInfo(response.data[0]);
            }
        } catch (error) {
            console.error('Error fetching student info:', error);
        }
    };

    const handleEditProfile = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleUpdateSuccess = () => {
        fetchStudentInfo();
    };

    const handleLogout = async () => {
        try {
            const user_id = localStorage.getItem('user_id');

            const response = await axios.post('http://localhost:8000/api/logout', {
                user_id: user_id
            }, {
                withCredentials: true,
            });
            console.log(response)
            if (response.data.success) {
                localStorage.removeItem('user_id');
                navigate('/login');
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    return (
        <header className="header">
            <div className="header-content">
                {studentInfo ? (
                    <div className="student-info">
                        <i className="fa-solid fa-user"></i>

                        <span>{studentInfo.first_name} {studentInfo.last_name}</span>
                        <button onClick={handleEditProfile}>Edit Profile</button>
                        <button onClick={handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div className="student-info">
                        <span>Loading...</span>
                    </div>
                )}
            </div>
            {isModalOpen && (
                <ProfileModal isOpen={isModalOpen} onClose={handleCloseModal} initialData={studentInfo} onUpdateSuccess={handleUpdateSuccess} />
            )}
        </header>
    );
}
export default Header;
