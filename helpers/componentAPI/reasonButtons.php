<?php
require_once __DIR__ . '/../../views/components/buttons.php'; // or wherever your class is

$data = json_decode(file_get_contents("php://input"), true)["data"];
$button = new Buttons();
$html = '';

$html .= $button->primaryButton("{$data['reason_type']}","{$data['name']}", "", "", "data-reason-id='{$data['id']}' data-bs-dismiss='modal' data-bs-target='#stopProductionModal'");

header('Content-Type: application/json');
echo json_encode(['html' => $html]);
