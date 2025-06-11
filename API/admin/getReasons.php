<?php
require_once __DIR__ . "/../API.php";
require_once __DIR__ ."/../../controllers/ReasonController.php";

class GetReasons extends API
{
    public function __construct() {
        parent::__construct(new ReasonController());
    }

    public function get(string $where = null) {
        try {

            $response = $where === null || $where === ""
                ? $this->controller->getAll()
                : $this->controller->getAllWhere($where);

            $this->checkError($response);

            // Wrap single object in array if needed
            if (isset($response['id'])) {
                $response = [$response];
            }

            return json_encode([
                "status" => "success",
                "data" => $response
            ], JSON_PRETTY_PRINT);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function index($data) {
        $search = $data["search"] ?? "";
        $where = "";

        if ($search !== "") {
            $searchSafe = addslashes($search);
            $where .= "name LIKE '%{$searchSafe}%'";
        }

        echo $this->get($where); // Now this works properly!
    }
}
$api = new GetReasons();
$api->index($_GET);