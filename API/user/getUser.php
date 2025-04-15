<?php 
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/UserController.php";
class getUser extends API
{
    public function __construct() {
        parent::__construct(new UserController());
    }

    public function index(array $data) {

        $this->validation->requiredFields($data, ["id_number"]);
        
        $this->get("$data[id_number]");
    }
}
$api = new getUser();
$api->index($_POST);