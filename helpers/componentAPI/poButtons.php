<?php
require_once __DIR__ . '/../../views/components/buttons.php'; // or wherever your class is

$pos = json_decode(file_get_contents("php://input"), true)["data"];
$button = new Buttons();
$html = '';
foreach ($pos as $po) {
    $html .= $button->primaryButton("po-button","{$po['prd_order_no']}", "", "", "data-po-id='{$po['id']}' data-bs-dismiss='modal' data-bs-target='#popover-stops'");
}

header('Content-Type: application/json');
echo json_encode(['html' => $html]);
