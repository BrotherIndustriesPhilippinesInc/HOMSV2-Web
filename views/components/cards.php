<?php 

class Cards
{
    public function __construct(){

    }

    public function wcCard($name){
        $html = <<<HTML
            <div class="card">
                
            </div>
        HTML;
        
        return $html;
    }
}
