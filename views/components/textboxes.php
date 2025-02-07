<?php
class Textboxes{
    public function __construct(){
        
    }

    public function primaryTextbox($name){
        $html = <<<HTML
            <input type="text" class="{$name} form-control bg-custom-tertiary border-0 rounded-3 p-2 fw-medium text-primary" placeholder="Primary Textbox">
        HTML;
        return $html;
    }
    public function secondaryTextbox($name){
        $html = <<<HTML
            <input type="text" class="{$name} form-control bg-custom-tertiary border-0 rounded-4 p-2 fw-medium text-primary " placeholder="Secondary Textbox">
        HTML;
        return $html;
    }
}