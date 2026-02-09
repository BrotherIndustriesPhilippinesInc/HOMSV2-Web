<?php
ini_set('session.gc_maxlifetime', 0);
ini_set('session.cookie_lifetime', 0);
session_start();

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON"]);
    exit;
}

$_SESSION['user'] = $data;

echo json_encode(["success" => true]);
