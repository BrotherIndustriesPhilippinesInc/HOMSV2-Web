<?php 
class Dropdowns
{
    public function __construct(){

    }
    public function primaryDropdown($name, $text, array $options = []) {
        $list = "";
        foreach ($options as $key => $value) {
            $list .= <<<HTML
                <li class="dropdown-item"><span id="{$name}-{$key}" value="{$key}">{$value}</span></li>
            HTML;
        }
        $html = <<<HTML
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle text-primary fw-medium" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    $text
                </button>
                <ul class="dropdown-menu">
                    $list
                </ul>
            </div>
        HTML;
        
        return $html;
    }
}
