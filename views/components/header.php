<?php 
    include_once __DIR__ . "/help-popover.php";
?>
<div id="header" class="row justify-content-center py-3 sticky-top">
    
        <!-- First Column -->
        <div class="col d-flex align-items-center">
            <button class="bg-custom border-0" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDark" aria-controls="offcanvasDark">
                <img src="/homs/resources/icons/menu.svg" alt="menu-icon" class="">
            </button>
            <a href="/homs/"><img src="/homs/resources/icons/HΩMS.svg" alt="HΩMS-logo" class="ms-2"></a>
        </div>

        <!-- Second Column -->
        <div class="col d-flex justify-content-end align-items-center gap-3">
            <button class="bg-custom border-0" popovertarget="help-popover">
                <img src="/homs/resources/icons/Help.svg"  alt="help-icon" class="">
            </button>
            <span>
                <a href="/homs/settings"><img src="/homs/resources/icons/settings.svg" alt="settings-icon" class=""></a>
            </span>

            <div class="d-flex align-items-center">
                <span>
                    <img src="/homs/resources/icons/UserLogo.svg" alt="user-logo-icon" class="">
                </span>
                <div class="d-flex flex-column text-center">
                    <span id="username" class="header-text ms-2 fw-bold">Lastname, Firstname</span>
                    <span id="section" class="header-text ms-2 fw-bold">BPS</span>
                </div>
            </div>
            
        </div>
</div>
