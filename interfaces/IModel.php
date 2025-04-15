<?php
interface IModel {
    public function insert(array $data);
    public function getAll();
    public function get(string $where);
    public function update($id, array $data);
    public function delete($id);
}