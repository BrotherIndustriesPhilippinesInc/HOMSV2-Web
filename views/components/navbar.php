<?php 
  $compTest = $button->navButton("Component Test", "/comptest");
  $dashboard = $button->navButton("Dashboard", "/");

  $uploadPOL = $button->navButton("Upload POL", "/production/upload_pol", "text-center pt-2");
  $poSelection = $button->navButton("PO Selection", "/production/po_selection", "text-center pt-2");
  $history = $button->navButton("History", "/production/history", "text-center pt-2");

  $confirmation = $button->navButton("Confirmation", "/confirmation");
  $graphs = $button->navButton("Graphs", "/graphs");


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
        <img src="/resources/icons/logo.svg" alt="logo-icon">
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
              <img class="arrow" src="/resources/icons/arrow_down.svg" style="width: 24px; height: 24px;" alt="arrow-icon">
              <img class="arrow d-none" src="/resources/icons/arrow_up.svg" style="width: 24px; height: 24px;" alt="arrow-icon">
            </div>
            <div class="nav-submenu">
              <?php 
                echo $uploadPOL; 
                echo $poSelection;
                echo $history;
              ?>
            </div>
          </div>
          
      </li>


      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/history', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="w-100">
            <?php echo $history; ?>
          </div>
      </li>
      
      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/graphs', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="w-100">
            <?php echo $graphs; ?>
          </div>
      </li>
    </ul>
  </div>
</div>
