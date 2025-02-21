<?php 
require_once __DIR__ . '/../BaseApi.php';
require_once __DIR__ . '/../../controllers/InitialGraphControllers.php';

class InitialGraph extends BaseApi
{
    private $controller;
    public function __construct() {
        $this->controller = new InitialGraphControllers();
    }
    public function get() {
    try {
        $data = $this->controller->getInitialGraph();
        $this->response($data, 200);
    } catch (Exception $e) {
        $this->response(["error" => $e->getMessage()], 500);
    }
}

}
$api = new InitialGraph();
$api->handleRequest();