<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/STController.php";

class UpdateSt extends API
{
    public function __construct() {
        parent::__construct(new STController());
    }

    public function index($data){
        $this->validation->requiredFields($data, [
            "id",
            "plant",
            "item_code",
            "sequence_no",
            "item_text",
            "new_st_sap",
            "current_st_mh",
            "st_default_flag",
            "st_update_sign",
            "new_tt_sap",
            "current_tt_mh",
            "tt_update_sign",
            "delete_sign",
            "section",
            "creator"   
        ]);

        $id = $data["id"];
        unset($data["id"]);
        
        $this->put($id, $data);
    }
}
$rawInput = file_get_contents("php://input");
$data = json_decode($rawInput, true);
$api = new UpdateSt();
$api->index($data);