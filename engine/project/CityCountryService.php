<?php

namespace project;
use db\Mysql;
class CityCountryService
{
    private $db;
    public function __construct()
    {
        $this->db = Mysql::connection('default_connection');
    }

    public function getCountries()
    {
        return $this->db->getTable("SELECT * FROM country",[]);
    }

    public function getCitiesByCountry(int $country_id)
    {
        return $this->db->getTable("SELECT * FROM city WHERE country_id = :country_id",['country_id' => $country_id]);
    }

}