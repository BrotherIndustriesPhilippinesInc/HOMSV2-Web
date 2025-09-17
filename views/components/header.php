<?php 
    include_once __DIR__ . "/help-popover.php";
?>
<div id="header" class="row justify-content-center py-3 sticky-top">
    
        <!-- First Column -->
        <div class="col d-flex align-items-center">
            <button class="bg-custom border-0" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDark" aria-controls="offcanvasDark">
                <!-- <img src="/homs/resources/icons/menu.svg" alt="menu-icon" class=""> -->
                 <i class="fa-solid fa-bars fs-1 text-primary-misc"></i>
            </button>
            <a href="/homs/" class="text-decoration-none fw-bold fs-1 text-primary-misc"><!-- <img src="/homs/resources/icons/HΩMS.svg" alt="HΩMS-logo" class="ms-2"> --> HΩMS</a>
        </div>

        <!-- Second Column -->
        <div class="col d-flex justify-content-end align-items-center gap-3">

            <button class="notification-popover-trigger bg-custom border-0 position-relative">
                <!-- <img src="/homs/resources/icons/bell-solid-full.svg"  alt="bell-icon" class="" style="width: 24px; height: 24px;"> -->
                <i class="fa-solid fa-bell fs-5 text-primary-misc"></i>
                <span id="notification-badge" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style="display: none;">
                    0
                    <span class="visually-hidden">unread messages</span>
                </span>
            </button>

            <button class="bg-custom border-0" popovertarget="help-popover">
                <!-- <img src="/homs/resources/icons/Help.svg"  alt="help-icon" class=""> -->
                 <i class="fa-solid fa-question fs-5 text-primary-misc"></i>
            </button>

            <span>
                <!-- <a href="/homs/settings"><img src="/homs/resources/icons/settings.svg" alt="settings-icon" class=""></a> -->
                 <i class="fa-solid fa-gear fs-5 text-primary-misc"></i>
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