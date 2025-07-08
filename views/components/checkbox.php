<?php 
class Checkbox
{
    public function __construct(){

    }
    public function primaryCheckbox($id, $name, $text, $checked = false) {
        
        $checkedAttribute = $checked ? 'checked' : '';
        $html = <<<HTML
            <div class="form-check form-switch d-flex align-items-center jus gap-2">
                <input id="$id" class="form-check-input" type="checkbox" value="" name="$name" $checkedAttribute>
                <label class="form-check-label" for="$name">
                    $text
                </label>
            </div>
        HTML;
        
        return $html;
    }
}
