import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Register from './Register';
import Login from './Login';
import Header from "./Header";
import StudentList from './StudentList';
function App() {
    return (
        <div>
            <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/api/countries" element={<Register />} />
                <Route path="/api/cities" element={<Register />} />
                <Route path="/" element={
                    <div>
                        <Header />
                        <StudentList />
                    </div>
                } />

            </Routes>
        </div>
    );
}
export default App;
