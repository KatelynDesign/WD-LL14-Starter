// This function fetches the list of areas from the API
async function fetchAreas() {
  // The API endpoint for getting the list of areas
  const url = "https://www.themealdb.com/api/json/v1/1/list.php?a=list";

  try {
    // Fetch data from the API
    const response = await fetch(url);

    // Convert the response to JSON
    const data = await response.json();

    // Log the list of areas to the console
    console.log(data.meals);
  } catch (error) {
    // Log any errors to the console
    console.error("Error fetching areas:", error);
  }
}

// Call the fetchAreas function when the page loads
fetchAreas();

// Wait until the DOM is fully loaded before attaching event listeners
window.addEventListener("DOMContentLoaded", function () {
  // Get the area select element
  const areaSelect = document.getElementById("area-select");
  // Get the results div where meals will be displayed
  const resultsDiv = document.getElementById("results");

  // Populate the area dropdown
  areaSelect.innerHTML = '<option value="">Select Area</option>';
  fetch("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
    .then((response) => response.json())
    .then((data) => {
      if (data.meals) {
        data.meals.forEach((areaObj) => {
          const option = document.createElement("option");
          option.value = areaObj.strArea;
          option.textContent = areaObj.strArea;
          areaSelect.appendChild(option);
        });
      }
    });

  // When the user selects an area, fetch and display meals for that area
  areaSelect.addEventListener("change", async function () {
    // Get the selected area from the dropdown
    const area = this.value;
    // Clear previous results
    resultsDiv.innerHTML = "";

    // If no area is selected, do nothing
    if (!area) return;

    try {
      // Fetch meals for the selected area using async/await
      const response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/filter.php?a=${encodeURIComponent(
          area
        )}`
      );
      const data = await response.json();

      // Log the filtered list of recipes to the console (by area)
      console.log("Meals filtered by area:", data.meals);

      // Fetch meals filtered by category "Seafood" and log them to the console
      const categoryResponse = await fetch(
        "https://www.themealdb.com/api/json/v1/1/filter.php?c=Seafood"
      );
      const categoryData = await categoryResponse.json();
      console.log("Meals filtered by category (Seafood):", categoryData.meals);

      if (data.meals) {
        // For each meal, create a card and display it
        data.meals.forEach((meal) => {
          // Create a div for the meal
          const mealDiv = document.createElement("div");
          mealDiv.className = "meal";

          // Create a title for the meal
          const title = document.createElement("h3");
          title.textContent = meal.strMeal;

          // Create an image for the meal
          const img = document.createElement("img");
          img.src = meal.strMealThumb;
          img.alt = meal.strMeal;

          // Add a click event to each meal card
          mealDiv.addEventListener("click", async function () {
            // When a meal is clicked, fetch the recipe for that meal and log it
            try {
              // The API endpoint for getting the details of a specific meal
              const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`;
              const response = await fetch(url);
              const data = await response.json();
              // Log the meal recipe to the console
              console.log(data.meals[0]);
              // Optionally, display the recipe in the UI for students:
              // resultsDiv.innerHTML = `<pre>${JSON.stringify(data.meals[0], null, 2)}</pre>`;
            } catch (error) {
              console.error("Error fetching meal details:", error);
            }
          });

          // Add the title and image to the meal div
          mealDiv.appendChild(title);
          mealDiv.appendChild(img);
          // Add the meal div to the results div
          resultsDiv.appendChild(mealDiv);
        });
      } else {
        // If no meals found, show a message
        resultsDiv.textContent = "No meals found for this area.";
      }
    } catch (error) {
      // Log any errors to the console
      console.error("Error fetching meals:", error);
      resultsDiv.textContent = "An error occurred while fetching meals.";
    }
  });
});
