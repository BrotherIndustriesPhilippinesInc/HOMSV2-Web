
<?php 

$element = <<<HTML
<div class="modal fade" id="linestop_alert" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
            <div class="modal-header justify-content-center">
                <div class="">
                    <div class="d-flex gap-2 align-items-center fa-beat-fade">
                        <i class="fa-solid fa-triangle-exclamation" style="color: #ff0000; font-size:80px;"></i>
                        <h1 class="modal-title fs-1 fw-bold text-danger " id="exampleModalLabel">Linestop!!!</h1>
                    </div>
                </div>
                
            </div>
            <div class="modal-body">
                <div class="d-flex flex-column align-items-b text-primary fs-4 mb-4">
                    <div class="d-flex justify-content-between">
                        <div>
                            <div class="fs-5">Workcenter</div>
                            <span id="linestop_workcenter" class="fw-bold">Work Center 1</span>
                        </div>

                        <div>
                            <div  class="fs-5 text-end">PO</div>
                            <span id="linestop_po" class="fw-bold">PO 1</span>
                        </div>
                        
                    </div>

                    <div class="d-flex justify-content-between">
                        <div>
                            <div  class="fs-5">Area</div>
                            <span id="linestop_area" class="fw-bold">Area 1</span>
                        </div>

                        <div>
                            <div  class="fs-5 text-end">Line</div>
                            <span id="linestop_line" class="fw-bold">Line 1</span>
                        </div>
                    </div>

                </div>
                <p class="text-center text-primary fs-5 fw-bold">Please resolve the linestop as soon as possible.</p>
            </div>
            <div class="modal-footer">

                <button type="button" id="btn_dismiss" class="btn btn-primary text-primary glow fw-bold" data-bs-dismiss="modal" aria-label="Close">Dismiss</button>
            </div>
            </div>
        </div>
    </div>
HTML;

echo $element;
?>
