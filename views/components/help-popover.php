<div id="help-popover" popover class="rounded-4 border-2 px-3 py-2" >
    <h1 class="fw-bold">Need help?</h1>
    <div class="d-flex flex-column gap-3">
        <span id="popover-desc" class="fw-light">For any inquiries or concerns don’t, hesitate to call or email us. </span>
        
        <div>
            <span>
                <img src="/homs/resources/icons/call.svg" alt="user-logo-icon" style="width: 20px; height: 20px;">
            </span>
            <span class="fw-bold text-primary-misc">3407</span>
        </div>
        
        <div>
            <span>
                <img src="/homs/resources/icons/mail.svg" alt="user-logo-icon" style="width: 20px; height: 20px;">
            </span>
            <span class="fw-bold text-primary-misc">bpsapplicatiosupport@brother-biph.com.ph</span>
        </div>
        
        <div id="popover-footer" class="d-flex flex-column gap-2 text-center  primary-text">
            <div>
                <span class="text-primary-misc">© 2024 BROTHER INDUSTRIES (PHILIPPINES), INC</span>
            </div>
            <div>
                <span class="text-primary-misc">BROTHER PRODUCTION SYSTEM (BPS)</span>
            </div>
        </div>
    </div>
</div>

<?php 

$html = <<<HTML

    <div class="notification-popover-item d-flex flex-column gap-2 border-1 p-2 border-danger danger secondary-background mt-2">
        <span class="fw-bold text-start">Linestop</span>
        <div class ="d-flex gap-1">
            <div class ="d-flex gap-2">
                <span class="fw-bold">Workcenter: </span>
                <span>C4120</span>
            </div>
            <div class ="d-flex gap-2">
                <span class="fw-bold">PO: </span>
                <span>000118932016</span>
            </div>
            
        </div>
    </div>

HTML;

?>
<div id="notification-popover" popover class="rounded-4 border-2 px-3 py-2">
    <?php 
    
        for($i = 0; $i < 0; $i++) {
            echo $html;
        }
    
    ?>
</div>

