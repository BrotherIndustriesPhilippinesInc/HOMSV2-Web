<?php
require_once __DIR__ ."/../interfaces/IController.php";
require_once __DIR__ . '/../models/Model.php';

abstract class Controller implements IController {
    protected object $model;

    public function __construct(object $model) {
        $this->model = $model;
    }

    public function getAll() {
        try {
            return $this->model->getAll();
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function get(string $where) {
        try {
            return $this->model->get($where);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function create(array $data) {
        try {
            if (empty($data)) throw new Exception("No data provided.");
            return $this->model->insert($data);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function update($id, array $data) {
        try {
            if (!is_numeric($id)) throw new Exception("Invalid ID format.");
            if (empty($data)) throw new Exception("No data provided.");
            return $this->model->update($id, $data);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function partialUpdate($id, array $data) {
        try {
            if (!is_numeric($id)) throw new Exception("Invalid ID format.");
            if (empty($data)) throw new Exception("No data provided.");
            return $this->model->partialUpdate($id, $data);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    public function delete($id) {
        try {
            if (!is_numeric($id)) throw new Exception("Invalid ID format.");
            return $this->model->delete($id);
        } catch (Exception $e) {
            return $this->errorResponse($e);
        }
    }

    protected function errorResponse(Exception $e) {
        error_log("Controller Error: " . $e->getMessage()); // Log the error
        return [
            "status" => "error",
            "message" => "An error occurred while processing your request.",
            "details" => $e->getMessage() // Consider removing this in production
        ];
    }
}
