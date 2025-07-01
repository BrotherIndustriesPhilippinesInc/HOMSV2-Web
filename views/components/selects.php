<?php 
class Selects
{
    public function __construct(){

    }

    public function primarySelect($name, $text, $options = [], $attributes="", $class=""){
        $optionsHtml = "";
        foreach($options as $key => $value){
            $optionsHtml .= "<option value='$key'>$value</option>";
        }
        $html = <<<HTML
            <select class="{$name} form-select bg-custom-tertiary text-primary fw-bold glow primary-border {$class}" aria-label="Default select example" $attributes>
                <option disabled selected value="{$text}" class="text-primary fw-bold">{$text}</option>
                {$optionsHtml}
            </select>
        HTML;
        
        return $html;
    }
}
