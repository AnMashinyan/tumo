import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ProfileModal({ isOpen, onClose, initialData, onUpdateSuccess }) {
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        age: '',
        country_id: '',
        city_id: '',
    });
    const [countries, setCountries] = useState([]);
    const [cities, setCities] = useState([]);

    useEffect(() => {
        if (initialData) {
            setFormData({
                first_name: initialData.first_name,
                last_name: initialData.last_name,
                age: initialData.age,
                country_id: initialData.country_id || '',
                city_id: initialData.city_id || '',
            });

            if (initialData.country_id) {
                fetchCities(initialData.country_id);
            }
        }
    }, [initialData]);

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/countries');
                setCountries(response.data);
            } catch (error) {
                console.error('Error fetching countries:', error);
            }
        };

        fetchCountries();
    }, []);

    const fetchCities = async (countryId) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/cities/${countryId}`);
            setCities(response.data);
        } catch (error) {
            console.error('Error fetching cities:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'country_id') {
            setFormData(prevState => ({
                ...prevState,
                [name]: value,
                city_id: ''
            }));
            fetchCities(value);
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user_id = localStorage.getItem('user_id');
            const { country_id, city_id, ...restFormData } = formData;

            const response = await axios.post(
                'http://localhost:8000/api/update-student-info',
                {
                    ...restFormData,
                    user_id,
                    country_id: parseInt(country_id),
                    city_id: parseInt(city_id)
                },
                {
                    withCredentials: true,
                }
            );

            if (response.data.success) {
                onUpdateSuccess();
                onClose();
            }
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    return (
        <div className={`modal ${isOpen ? 'open' : ''}`}>
            <div className="modal-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <h2>Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <label>First Name:
                        <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
                    </label>
                    <label>Last Name:
                        <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
                    </label>
                    <label>Age:
                        <input type="number" name="age" value={formData.age} onChange={handleChange} />
                    </label>
                    <label>Country:
                        <select name="country_id" value={formData.country_id} onChange={handleChange}>
                            <option value="">Select Country</option>
                            {Array.isArray(countries) && countries.length > 0 ? (
                                countries.map(country => (
                                    <option key={country.country_id} value={country.country_id}>
                                        {country.country_name}
                                    </option>
                                ))
                            ) : (
                                <option value="">No countries available</option>
                            )}
                        </select>
                    </label>
                    <label>City:
                        <select name="city_id" value={formData.city_id} onChange={handleChange}>
                            <option value="">Select City</option>
                            {Array.isArray(cities) && cities.length > 0 ? (
                                cities.map(city => (
                                    <option key={city.city_id} value={city.city_id}>
                                        {city.city_name}
                                    </option>
                                ))
                            ) : (
                                <option value="">No cities available</option>
                            )}
                        </select>
                    </label>
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
}

export default ProfileModal;
