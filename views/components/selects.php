<?php 
class Selects
{
    public function __construct(){

    }

    public function primarySelect($name){
        $html = <<<HTML
            <select class="{$name} form-select bg-custom-tertiary text-primary fw-bold border-0" aria-label="Default select example">
                <option disabled selected class="text-primary fw-bold">Open this select menu</option>
                <option value="1" class="text-primary">One</option>
                <option value="2" class="text-primary">Two</option>
                <option value="3" class="text-primary">Three</option>
            </select>
        HTML;
        
        return $html;
    }
}
