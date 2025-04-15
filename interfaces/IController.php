<?php
interface IController {
    public function get(string $where);
    public function getAll();
    public function create(array $data);
    public function update($id, array $data);
    public function partialUpdate($id, array $data);
    public function delete($id);
}
