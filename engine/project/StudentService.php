<?php

namespace project;

use db\Mysql;

class StudentService
{
    private $db;

    public function __construct()
    {
        $this->db = Mysql::connection('default_connection');
    }

    public function getStudentInfo(int $user_id)
    {
        $query = "SELECT * FROM user_info WHERE user_id = :user_id";
        $params = ['user_id' => $user_id];

        return $this->db->getTable($query, $params);
    }

    public function updateStudentInfo(string $first_name, string $last_name,  $age, $city_id, int $country_id, int $user_id)
    {
        $query = "UPDATE user_info SET 
                     first_name = :first_name,
                     last_name = :last_name,
                     age = :age,
                     city_id = :city_id,
                     country_id = :country_id
                   WHERE user_id = :user_id";
        $params = [
            'first_name' => $first_name,
            'last_name' => $last_name,
            'age' => $age,
            'city_id' => $city_id,
            'country_id' => $country_id,
            'user_id' => $user_id
        ];

        return (bool) $this->db->setQuery($query, $params);
    }

    public function getStudents()
    {
        $query = "SELECT first_name, last_name, user_info.created AS date, users.mail 
                  FROM user_info 
                  LEFT JOIN users ON user_info.user_id = users.id";

        return $this->db->getTable($query, []);
    }

    public function searchStudent(string $fullname = "")
    {
        $names = explode(' ', $fullname, 2);
        $first_name = isset($names[0]) ? trim($names[0]) : "";
        $last_name = isset($names[1]) ? trim($names[1]) : "";

        $query = "SELECT first_name, last_name, user_info.created AS date, users.mail 
              FROM user_info 
              LEFT JOIN users ON user_info.user_id = users.id
              WHERE first_name LIKE :first_name
              AND last_name LIKE :last_name";
        $params = [
            'first_name' => '%' . $first_name . '%',
            'last_name' => '%' . $last_name . '%',
        ];

        return $this->db->getTable($query, $params);
    }

}
