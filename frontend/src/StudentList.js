import React, { useState, useEffect } from 'react';
import axios from 'axios';

function StudentList() {
    const [students, setStudents] = useState([]);
    const [searchFirstName, setSearchFirstName] = useState('');
    const [searchFullName, setSearchFullName] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                let url = 'http://localhost:8000/api/search-students';
                if (searchFirstName || searchFullName) {
                    url += `?fullName=${encodeURIComponent(searchFullName)}`;
                }

                const response = await axios.get(url, {
                    withCredentials: true,
                });
                setStudents(response.data);
            } catch (error) {
                console.error('Error fetching students:', error);
            }
        };

        fetchStudents();
    }, [searchFirstName, searchFullName]);

    const handleSearchFirstNameChange = (event) => {
        setSearchFirstName(event.target.value);
    };

    const handleSearchFullNameChange = (event) => {
        setSearchFullName(event.target.value);
    };

    return (
        <div className="student-list">
            <h2>Students List</h2>
            <div className="search-box">

                <input
                    type="text"
                    placeholder="Search by Full Name"
                    value={searchFullName}
                    onChange={handleSearchFullNameChange}
                />
            </div>
            <table className="student-table">
                <thead>
                <tr>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>Mail</th>
                    <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {students.map((student) => (
                    <tr key={student.user_id}>
                        <td>{student.first_name}</td>
                        <td>{student.last_name}</td>
                        <td>{student.mail}</td>
                        <td>{student.date}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

export default StudentList;
