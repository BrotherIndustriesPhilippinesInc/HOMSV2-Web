<?php 
require_once __DIR__ ."/Controller.php";
require_once __DIR__ ."/../models/UserModel.php";

class UserController extends Controller
{
    public function __construct() {
        parent::__construct(new UserModel());
    }

    public function get(string $where = null) {
        try {
            if ($where === null) {
                return $this->model->getAll();
            } else {
                return $this->model->get($where);
            }
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }
}
