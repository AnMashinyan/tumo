<?php
namespace core;

require_once(__DIR__ . '/db/Mysql.php');

use db\Mysql;

class User
{
    private $db;

    public function __construct()
    {
        $this->db = Mysql::connection();
    }

    public static function setSession($user_id = 0, string $token = '')
    {
        if ($token === '') {
            $token = bin2hex(random_bytes(16));
        }

        $db = Mysql::connection('default_connection');
        if ($user_id === 0) {
            $db->setQuery("DELETE FROM online WHERE user_id = :user_id", ['user_id' => $user_id]);
        } else {
            $db->setQuery("INSERT INTO online(user_id, token, last_action)
                                    VALUES(:user_id, :token, CURRENT_TIMESTAMP)
                                    ON DUPLICATE KEY UPDATE last_action = CURRENT_TIMESTAMP",
                ['user_id' => $user_id, 'token' => $token]);
        }

        $_SESSION['user_id'] = (int)$user_id;
    }

    public static function login(string $username, string $password)
    {
        $db = Mysql::connection('default_connection');

        if (!empty($username) && !empty($password)) {
            $query = "SELECT * FROM users WHERE username = :username";
            $params = ['username' => $username];

            $user = $db->getRow($query, $params);
            if (!$user) {
                return (object)['result' => false, 'message' => 'Error retrieving user data'];
            } else {
                if (password_verify($password, $user['password'])) {
                    self::setSession($user['id'], '');
                    return (object)['result' => true, 'message' => 'Login Ok', 'return_data' => $user['id']];
                } else {
                    return (object)['result' => false, 'message' => 'Invalid username or password'];
                }
            }
        } else {
            return (object)['result' => false, 'message' => 'Username and password are required'];
        }
    }

    public static function logout(int $user_id = 0)
    {
        $db = Mysql::connection('default_connection');

        $db->setQuery("DELETE FROM online WHERE user_id = :user_id", ['user_id' => $user_id]);
        self::setSession();
        return (object)['message' => 'Logout ok', 'result' => true];
    }

    public static function register(string $mail, string $password, string $firstName, string $lastName, int $age, int $country_id, int $city_id)
    {
        $db = Mysql::connection();
        $unique_mail = (int)$db->getItem("SELECT COUNT(*) FROM users WHERE mail = :mail", ['mail' => $mail]);
        if ($unique_mail === 0) {
            $hashed_pass = password_hash($password, PASSWORD_DEFAULT);
            $user_id = $db->setQuery("INSERT INTO users (username, password, mail, created) VALUES (:username, :password, :mail, CURRENT_TIMESTAMP)",
                ['username' => $mail, 'password' => $hashed_pass, 'mail' => $mail])['return_data']['id'];
            $query = (bool)$db->setQuery("INSERT INTO user_info(first_name, last_name, age, user_id, country_id, city_id, created) VALUES(:first_name, :last_name, :age, :user_id, :country_id, :city_id, CURRENT_TIMESTAMP)",
                ['first_name' => $firstName, 'last_name' => $lastName, 'age' => $age, 'user_id' => $user_id, 'country_id' => $country_id, 'city_id' => $city_id]);
            if ($query) {
                return (object)['result' => true, 'message' => 'Registration Ok'];
            } else {
                return (object)['result' => false, 'message' => 'Registration failed'];
            }
        } else {
            return (object)['result' => false, 'message' => 'Registration failed: Mail already exists'];
        }
    }
}

