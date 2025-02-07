<?php
class Buttons
{
    public function __construct(){

    }
    public function primaryButton($name, $text, $imgSource ='', $alt='', $buttonAttributes = '',$class='',)
    {
        $addClass = '';
        if($imgSource != '' && $text != ''){
            $addClass = "class='ps-2'";
        }   
        $html = <<<HTML
        <button type="button" class='{$name} btn btn-primary bg-custom-tertiary border-0 rounded-3 p-2 fw-medium text-primary {$class}' $buttonAttributes>
            <img src='{$imgSource}' alt='{$alt}'>
            <span {$addClass}>$text</span>
        </button>
        HTML;
        return $html;
    }

    public function navButton($text, $url ,$class='', $buttonAttributes = '')
    {

        $html = <<<HTML
        <a href="{$url}" type="button" class="nav-button w-100 text-primary text-decoration-none p-3 fs-5 fw-medium {$class}" $buttonAttributes>
            $text
        </a>
        HTML;
        return $html;
    }
}
