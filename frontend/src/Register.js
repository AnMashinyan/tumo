import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './style.css';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [cities, setCities] = useState([]);
    const [selectedCity, setSelectedCity] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCountries = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/countries');
                setCountries(response.data); // Assuming response.data is an array of countries
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/register', {
                email, password, firstName, lastName, age, country_id: selectedCountry, city_id: selectedCity
            });
            alert(response.data.message);

            setEmail('');
            setPassword('');
            setFirstName('');
            setLastName('');
            setAge('');
            setSelectedCountry('');
            setSelectedCity('');
            navigate('/login');

        } catch (error) {
            alert('Registration failed: ' + error.message); // Display error message
        }
    };

    const handleCountryChange = (e) => {
        const countryId = e.target.value;
        setSelectedCountry(countryId);
        setCities([]);
        if (countryId) {
            fetchCities(countryId);
        }
    };

    return (
        <div className="register-container">
            <form onSubmit={handleSubmit} className="register-form">
                <h2>Register</h2>
                <input type="email" placeholder="Email *" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password *" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <input type="text" placeholder="First Name *" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                <input type="text" placeholder="Last Name *" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                <input type="number" placeholder="Age *" value={age} onChange={(e) => setAge(e.target.value)} required />

                <select value={selectedCountry} onChange={handleCountryChange} required>
                    <option value="">Select Country *</option>
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

                <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} required>
                    <option value="">Select City *</option>
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

                <button type="submit">Register</button>
                <p className="register-text">Already have an account? <Link to="/login" className="login-link">Login</Link></p>
            </form>
        </div>
    );
}

export default Register;
