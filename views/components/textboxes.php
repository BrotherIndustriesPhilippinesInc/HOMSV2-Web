<?php
class Textboxes{
    public function __construct(){
        
    }

    public function primaryTextbox($name, $class = "", $placeholder = ""){
        $html = <<<HTML
            <input type="text" id="{$name}" class="{$class} form-control border-0 rounded-3 fw-medium text-primary" placeholder="{$placeholder}">
        HTML;
        return $html;
    }
    public function secondaryTextbox($name){
        $html = <<<HTML
            <input type="text" class="{$name} form-control bg-custom-tertiary border-0 rounded-4 p-2 fw-medium text-primary " placeholder="Secondary Textbox">
        HTML;
        return $html;
    }
    public function searchTextbox($name){
        $html = <<<HTML
        <div class="d-flex bg-custom-tertiary border-0 rounded-4 p-1 ps-2">
            <img src="/homs/resources/icons/search.svg" />
            <input type="text" id="{$name}" class="bg-custom-tertiary border-0 rounded-4 fw-medium text-primary text-center" placeholder="Search">
        </div>
            
        HTML;
        return $html;
    }
    public function dateSelect($name){
        $html = <<<HTML
            <input id="{$name}" class="flatpickr-calendar-input btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary" type="text" placeholder="Select Date.." readonly="readonly">
        HTML;
        return $html;
    }

    public function timeSelect($name){
        $html = <<<HTML
            <input id="{$name}" class="flatpickr-no-calendar" type="text" placeholder="Select Date.." readonly="readonly">
        HTML;
        return $html;
    }
    public function textArea($name, $class=" ", $placeholder = ""){
        $html = <<<HTML
            <textarea id="{$name}" class="{$class} form-control border-0 rounded-3 fw-medium text-primary" placeholder="{$placeholder}"></textarea>
        HTML;
        return $html;
    }
}