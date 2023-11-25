function handlePanelClick(index) {
  const previousSelectedPanel = document.querySelector(".panel.highlight");
  if (previousSelectedPanel) {
    previousSelectedPanel.classList.remove("highlight");
  }

  const selectedPanel = document.getElementsByClassName("panel")[index];
  const errorSelectPanel = document.getElementById("errorSelectPanel");
  errorSelectPanel.style.display = "none";
  const selectedCaption = document.getElementsByClassName("caption")[index];
  selectedPanel.classList.add("highlight");

  selectedPanelIndex = index;
  selectedCaptionIndex = index;

  if (isImageGenerated) {
    document.getElementById("previewBtn").style.display = "flex";
  }
}

async function callAPI(data) {
  try {
    const response = await fetch(
      "https://xdwvg9no7pefghrn.us-east-1.aws.endpoints.huggingface.cloud",
      {
        method: "POST",
        headers: {
          Accept: "image/png",
          Authorization:
            "Bearer VknySbLLTUjbxXAXCjyfaFIPwUTCeRXbFSOjwRiCxsxFyhbnGjSFalPKrpvvDAaPVzWEevPljilLVDBiTzfIbWFdxOkYJxnOPoHhkkVGzAknaOulWggusSFewzpqsNWM",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      return { success: true, data: await response.blob() };
    } else {
      // If response status is not within the success range, throw an error
      const errorText = await response.text();
      throw {
        success: false,
        error: `API request failed with status ${response.status}: ${errorText}`,
      };
    }
  } catch (error) {
    // Handle other errors (e.g., network issues)
    console.error("Error in API request:", error.message);
    throw {
      success: false,
      error: "Error making API request. Please try again later.",
    };
  }
}

function openModal() {
  // Display the overlay and modal
  document.getElementById("overlay").style.display = "flex";
}

// Function to close the modal
function closeModal() {
  // Hide the overlay and modal
  document.getElementById("overlay").style.display = "none";
}
