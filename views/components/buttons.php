<?php
class Buttons
{
    public function __construct(){

    }
    public function primaryButton($name, $text, $imgSource ='', $alt='', $buttonAttributes = '',$class='',)
    {
        $spanClass = '';
        $imageExists = '';
        if($imgSource != '' && $text != ''){
            $spanClass = "ps-2";
            $imageExists = "<img src='{$imgSource}' alt='{$alt}'>";
        }
        $html = <<<HTML
        <button type="button" class='{$name} btn btn-primary bg-custom-tertiary border-1 rounded-3 fw-medium text-primary {$class}' $buttonAttributes>
            $imageExists
            <span class="{$name}-span btn-span {$spanClass}">$text</span>
        </button>
        HTML;
        return $html;
    }

    public function navButton($text, $url ,$class='', $buttonAttributes = '')
    {

        $html = <<<HTML
        <a href="{$url}" type="button" class="nav-button w-100 text-primary text-decoration-none fs-5 fw-medium {$class}" $buttonAttributes>
            $text
        </a>
        HTML;
        return $html;
    }


}
