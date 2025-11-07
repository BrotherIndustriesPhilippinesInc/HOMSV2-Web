<?php
class Textboxes{
    public function __construct(){
        
    }

    public function primaryTextbox($name, $class = "", $placeholder = "", $value = "", $type= "text"){
        $html = <<<HTML
            <input type={$type} id="{$name}" class="{$class} border-1 form-control rounded-3 fw-medium text-primary glow" placeholder="{$placeholder}" value="{$value}">
        HTML;
        return $html;
    }
    public function secondaryTextbox($name){
        $html = <<<HTML
            <input type="text" class="{$name} form-control bg-custom-tertiary border-0 rounded-4 p-2 fw-medium text-primary glow" placeholder="Secondary Textbox">
        HTML;
        return $html;
    }
    public function searchTextbox($name){
        $html = <<<HTML
        <div class="d-flex bg-custom-tertiary primary-border rounded-4 p-1 ps-2 glow">
            <img src="/homs/resources/icons/search.svg" />
            <input type="text" id="{$name}" class="bg-custom-tertiary border-0 rounded-4 fw-medium text-primary text-center " placeholder="Search">
        </div>
            
        HTML;
        return $html;
    }
    public function dateSelect($name){
        $html = <<<HTML
            <input id="{$name}" class="flatpickr-calendar-input btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary glow" type="text" placeholder="Select Date.." readonly="readonly">
        HTML;
        return $html;
    }

    public function timeSelect($name, $class = "", $attributes = "", $style=""){
        $html = <<<HTML
            <input id="{$name}" class="flatpickr-no-calendar glow {$class}" type="text" placeholder="00:00" {$attributes} style="{$style}">
        HTML;
        return $html;
    }
    public function textArea($name, $class=" ", $placeholder = ""){
        $html = <<<HTML
            <textarea id="{$name}" class="{$class} form-control primary-border rounded-3 fw-medium tertiary-text glow" placeholder="{$placeholder}"></textarea>
        HTML;
        return $html;
    }
}