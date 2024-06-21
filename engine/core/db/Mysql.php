<?php

namespace db;

use PDO;
use PDOException;
use Exception;

class Mysql
{
    private ?PDO $connection;
    private array $system_settings;
    private static array $instance = [];

    public function __construct(string $configName)
    {
        $this->system_settings = parse_ini_file($_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'configuration' . DIRECTORY_SEPARATOR . 'system.ini');
        $this->connection = null;
        $db_settings_file = $_SERVER['DOCUMENT_ROOT'] . DIRECTORY_SEPARATOR . 'configuration' . DIRECTORY_SEPARATOR . 'database.ini';

        $config = parse_ini_file($db_settings_file, true);
        if (!empty($config)) {
            $db_settings_config = $config[$configName];
            $dsn = 'mysql:host=' . $db_settings_config['HOST'] . ';dbname=' . $db_settings_config['NAME'] . ';port=' . $db_settings_config['PORT'];
            $username = $db_settings_config['USERNAME'];
            $password = $db_settings_config['PASSWORD'];

            try {
                $this->connection = new PDO($dsn, $username, $password);
                $this->connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            } catch (PDOException $e) {
                throw new Exception("Database connection error: " . $e->getMessage());
            }
        } else {
            throw new Exception("Config file is empty");
        }
    }

    public static function connection(string $configName = 'default_connection'): self
    {
        if (empty(self::$instance[$configName]) || self::$instance[$configName] == null) {
            self::$instance[$configName] = new self($configName);
        }
        return self::$instance[$configName];
    }

    public function getItem(string $query, array $params): string
    {
        $stmt = $this->connection->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue(':' . $key, $value);
        }
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $first_key = array_keys($result)[0];
            if (!empty($result[$first_key])) {
                return (string)$result[$first_key];
            } else {
                return "";
            }
        } else {
            return "";
        }
    }

    public function getRow(string $query, array $params): array
    {
        $stmt = $this->connection->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue(':' . $key, $value);
        }
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            return $result;
        } else {
            return [];
        }
    }

    public function getTable(string $query, array $params): array
    {
        $stmt = $this->connection->prepare($query);
        foreach ($params as $key => $value) {
            $stmt->bindValue(':' . $key, $value);
        }
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_OBJ);

        return $result ?: [];
    }

    public function setQuery(string $query, array $params, bool $transaction = false): array
    {
        try {
            if ($transaction) {
                $this->connection->beginTransaction();
            }

            $stmt = $this->connection->prepare($query);
            foreach ($params as $key => $value) {
                $stmt->bindValue(':' . $key, $value);
            }
            $stmt->execute();

            if ($transaction) {
                $this->connection->commit();
            }

            $affected_rows = $stmt->rowCount();
            $return_data = [];
            $last_insert_id = $this->connection->lastInsertId();

            if ($last_insert_id) {
                $return_data['id'] = $last_insert_id;
            }

            if ($this->system_settings['STATE'] === 'DEBUG') {
                return ['result' => $affected_rows, 'return_data' => $return_data, 'query' => $query];
            }

            return ['result' => $affected_rows, 'return_data' => $return_data];
        } catch (PDOException $e) {
            if ($transaction) {
                $this->connection->rollBack();
            }
            throw new Exception('Error executing query: ' . $e->getMessage());
        }
    }
}
