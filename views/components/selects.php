<?php 
class Selects
{
    public function __construct(){

    }

    public function primarySelect($name, $text, $options = []){
        $optionsHtml = "";
        foreach($options as $key => $value){
            $optionsHtml .= "<option value='$key'>$value</option>";
        }
        $html = <<<HTML
            <select class="{$name} form-select bg-custom-tertiary text-primary fw-bold border-0 glow" aria-label="Default select example">
                <option disabled selected class="text-primary fw-bold">{$text}</option>
                {$optionsHtml}
            </select>
        HTML;
        
        return $html;
    }
}
