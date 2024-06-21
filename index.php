<?php

use core\User;
use project\CityCountryService;
use project\StudentService;

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/engine/core/User.php';
require_once __DIR__ . '/engine/project/CityCountryService.php';
require_once __DIR__ . '/engine/project/StudentService.php';

$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
header('Content-Type: application/json');

switch ($requestMethod) {
    case 'GET':
        if ($requestUri === '/api/countries') {
            $service = new CityCountryService();
            $countries = $service->getCountries();
            echo json_encode($countries);
            exit;
        } elseif (preg_match('#^/api/cities/(\d+)$#', $requestUri, $matches)) {
            $countryId = $matches[1];
            $service = new CityCountryService();
            $cities = $service->getCitiesByCountry($countryId);
            echo json_encode($cities);
            exit;
        } elseif ($requestUri === '/api/students') {
            $service = new StudentService();
            $students = $service->getStudents();
            echo json_encode($students);
            exit;
        } elseif (strpos($requestUri, '/api/search-students') === 0) {
            $params = [];
            parse_str(parse_url($requestUri, PHP_URL_QUERY), $params);
            $service = new StudentService();
            $searchResults = $service->searchStudent($params['fullName'] ?? '');
            echo json_encode($searchResults);
            exit;
        }
        break;

    case 'POST':
        if ($requestUri === '/api/register') {
            $data = json_decode(file_get_contents('php://input'), true);
            $user = new User();
            $response = $user->register(
                $data['email'],
                $data['password'],
                $data['firstName'],
                $data['lastName'],
                $data['age'],
                $data['country_id'],
                $data['city_id']
            );
            echo json_encode($response);
            exit;
        } elseif ($requestUri === '/api/login') {
            $data = json_decode(file_get_contents('php://input'), true);
            $response = User::login($data['username'], $data['password']);
            session_start();
            if ($response->result) {
                $_SESSION['user_id'] = (int)$response->return_data;
                echo json_encode(['success' => $response]);
                exit;
            } else {
                echo json_encode(['error' => 'Login failed']);
                exit;
            }
        } elseif ($requestUri === '/api/student-info') {
            $data = json_decode(file_get_contents('php://input'), true);
            if (isset($data['user_id'])) {
                $user_id = $data['user_id'];
                $service = new StudentService();
                $studentInfo = $service->getStudentInfo($user_id);
                if ($studentInfo) {
                    echo json_encode($studentInfo);
                } else {
                    echo json_encode(['error' => 'Student info not found']);
                }
                exit;
            } else {
                echo json_encode(['error' => 'User ID is required']);
                exit;
            }
        } elseif ($requestUri === '/api/update-student-info') {
            $data = json_decode(file_get_contents('php://input'), true);
            $service = new StudentService();
            $response = $service->updateStudentInfo(
                $data['first_name'],
                $data['last_name'],
                $data['age'],
                $data['city_id'],
                $data['country_id'],
                (int)$data['user_id']
            );
            echo json_encode(['success' => $response]);
            exit;
        } elseif ($requestUri === '/api/logout') {
            $data = json_decode(file_get_contents('php://input'), true);
            $user = new User();
            $response = $user->logout((int)$data['user_id']);
            echo json_encode(['success' => $response]);
            exit;
        }
        break;

    default:
        http_response_code(404);
        echo json_encode(['message' => 'Route not found!']);
        break;
}
