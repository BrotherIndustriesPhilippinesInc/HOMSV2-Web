<?php 
  $compTest = $button->navButton("Component Test", "/homs/comptest");
  $dashboard = $button->navButton("Dashboard", "/homs/");

  $uploadPOL = $button->navButton("Upload POL", "/homs/production/upload_pol", "text-center pt-2");
  $wcSelection = $button->navButton("Work Center Selection", "/homs/production/wc_selection", "text-center pt-2");
  $exportReports = $button->navButton("Export Reports", "/homs/production/export_reports", "text-center pt-2");
  $history = $button->navButton("Edit History", "/homs/production/history", "text-center pt-2");

  $reasons = $button->navButton("Reasons & Actions", "/homs/admin/reasons", "text-center pt-2");
  $workcenters = $button->navButton("Workcenters", "/homs/admin/workcenters", "text-center pt-2");
  $st_management = $button->navButton("St Management", "/homs/admin/st", "text-center pt-2");
  $esp_management = $button->navButton("ESP Management", "/homs/admin/esp_management", "text-center pt-2");
  $breaktime_management = $button->navButton("Breaktime Management", "/homs/admin/breaktime_management", "text-center pt-2");

  $confirmation = $button->navButton("Confirmation", "/homs/confirmation");
  $graphs = $button->navButton("Graphs", "/homs/graphs");

  $om = $button->navButton("Manual", "/homs/manual");

    // Get the current path
  $currentPath = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

  // Helper function to check the active page
  function isActive($path, $currentPath) {
      return $path === $currentPath ? 'd-block' : 'd-none';
  }
?>

<div class="offcanvas offcanvas-start bg-custom" tabindex="-1" id="offcanvasDark" aria-labelledby="offcanvasDarkLabel">
  <div class="offcanvas-header">
    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="d-flex justify-content-center mb-4">
    <span data-bs-toggle="offcanvas" data-bs-target="#offcanvasDark" aria-controls="offcanvasDark">
        <img src="/homs/resources/icons/logo.svg" alt="logo-icon">
    </span>
  </div>
  <div class="offcanvas-body p-0">
    <ul class="nav flex-column">
      <!-- COMPONENT TEST -->
      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/comptest', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="w-100">
            <div class="nav-link w-100 text-primary fs-5 fw-medium">
              <?php echo $compTest; ?>
            </div>
          </div>
          
      </li>
      <!-- DASHBOARD -->
      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="w-100">
            <div class="nav-link w-100 text-primary fs-5 fw-medium">
              <?php echo $dashboard; ?>
            </div>
            
          </div>
      </li>
      <!-- PRODUCTION -->
      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/production', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="nav-link w-100 text-primary fs-5 fw-medium">
            <div class="nav-title d-flex justify-content-center align-items-center">
              <span class="w-100 fs-5">Production</span>
              <img class="arrow" src="/homs/resources/icons/arrow_down.svg" style="width: 24px; height: 24px;" alt="arrow-icon">
              <img class="arrow d-none" src="/homs/resources/icons/arrow_up.svg" style="width: 24px; height: 24px;" alt="arrow-icon">
            </div>
            <div class="nav-submenu">
              <?php 
                echo $uploadPOL; 
                echo $wcSelection;
                echo $history;
                echo $exportReports;
              ?>
            </div>
          </div>
      </li>

      <!-- ADMIN -->
      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/admin', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="nav-link w-100 text-primary fs-5 fw-medium">
            <div class="nav-title d-flex justify-content-center align-items-center">
              <span class="w-100 fs-5">Admin</span>
              <img class="arrow" src="/homs/resources/icons/arrow_down.svg" style="width: 24px; height: 24px;" alt="arrow-icon">
              <img class="arrow d-none" src="/homs/resources/icons/arrow_up.svg" style="width: 24px; height: 24px;" alt="arrow-icon">
            </div>
            <div class="nav-submenu">
              <?php 
                echo $reasons;
                echo $workcenters;
                echo $st_management;
                echo $esp_management;
                echo $breaktime_management;
              ?>
            </div>
          </div>
      </li>
      <!-- GRAPHS -->
      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/graphs', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="w-100">
            <div class="nav-link w-100 text-primary fs-5 fw-medium">
              <?php echo $graphs; ?>
            </div>
            
          </div>
      </li>

      <!-- OM -->
      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/om', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="w-100">
            <div class="nav-link w-100 text-primary fs-5 fw-medium">
              <?php echo $om; ?>
            </div>
            
          </div>
      </li>
    </ul>
  </div>
</div>
