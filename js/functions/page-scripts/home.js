
(async function() {
  const viz = document.getElementById("tableau-viz");

    async function refreshTableauVizData() {
      swal.fire({
        title: "Refreshing Tableau Data...",
        allowOutsideClick: false,
        didOpen: () => {
          swal.showLoading();
        }
      });

      try {
        await viz.refreshDataAsync();
        swal.close();
        
        console.log("Tableau data refreshed successfully");
      } catch (e) {
        console.error("Tableau refresh failed:", e);
        swal.fire("Error", "Failed to refresh Tableau data.", "error");
      }
    }

    // Example: auto refresh every 5 minutes
    setInterval(refreshTableauVizData, 5 * 60 * 1000);

    // Or manual button
    window.refreshTableauVizData = refreshTableauVizData;
})();