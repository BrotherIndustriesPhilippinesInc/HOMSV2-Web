<?php
interface IAPI
{
    public function GET(string $where = null);
    public function POST(array $data);
    public function PUT($id, array $data);
    public function PATCH($id, array $data);
    public function DELETE($id);

}
