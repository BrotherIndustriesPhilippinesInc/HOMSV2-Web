<?php 
  $compTest = $button->navButton("Component Test", "/comptest");
  $dashboard = $button->navButton("Dashboard", "/");
  $startProduction = $button->navButton("Start Production", "/production");
  $confirmation = $button->navButton("Confirmation", "/confirmation");
  $history = $button->navButton("History", "/history");
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
        <img src="resources/icons/logo.svg" alt="logo-icon">
    </span>
  </div>
  <div class="offcanvas-body p-0">
    <ul class="nav flex-column">
      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/comptest', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="w-100">
            <?php echo $compTest; ?>
          </div>
          
      </li>

      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="w-100">
            <?php echo $dashboard; ?>
          </div>
      </li>
      
      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/production', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="w-100">
            <?php echo $startProduction; ?>
          </div>
      </li>

      <li class="nav-item d-flex">
          <div class="nav-status <?php echo isActive('/confirmation', $currentPath); ?>" style="width: 8px; height: auto;"></div>
          <div class="w-100">
            <?php echo $confirmation; ?>
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
