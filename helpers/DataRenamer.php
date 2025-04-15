<?php 

class DataRenamer
{
    public function __construct(){

    }

    public function rename(array $from, array $to){
        $renamedData = array_combine(
            array_map(fn($key) => $to[$key] ?? $key, array_keys($from)),
            array_values($from)
        );

        return $renamedData;
    }
    
}
