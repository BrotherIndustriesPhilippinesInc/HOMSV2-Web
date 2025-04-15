<?php 
require_once __DIR__ ."/../helpers/MSQLServer.php";

class UserModel
{
    private MSQLServer $db;
    public function __construct() {
        $this->db = new MSQLServer();
    }

    public function get(string $where){
        $data = $this->db->query("SELECT TOP(1) * FROM tbl_EMSVIEW WHERE EmpNo = '$where'");
        if ($data) {
            return $data[0];
        } else {
            throw new Exception("No data found for the given condition.", 404);
        }
    }
}
