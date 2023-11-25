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

async function generateImage(event) {
    event.preventDefault();
  
    const previewPanel = document.getElementById("previewPanel");
    const previewBtn = document.getElementById("previewBtn");
    const generateBtn = document.getElementById("generateBtn");
    const loader = document.getElementById("loader");
    const infoLoader = document.getElementById("infoLoader");
    const errorSelectPanel = document.getElementById("errorSelectPanel");
    
    previewPanel.style.display = "none";
    previewBtn.style.display = "none";
    
    errorSelectPanel.style.display = "none";
    
    generateBtn.disabled = true;
    generateBtn.style.cursor = "not-allowed";
    generateBtn.style.color = "#fa6b6b";
  
    loader.style.display = "flex";
    loader.style.backgroundColor = "white";
  
    infoLoader.style.display = "flex";
  
    const textInputValue = document.getElementById("textInput").value;
    const result = await callAPI({ inputs: textInputValue });
  
    if(result.success){
      previewPanel.innerHTML = `<img src="${URL.createObjectURL(
        result.data
      )}" alt="Generated Image" height="150px" width="150px">`;
    
      previewPanel.style.display = "block";
      previewPanel.style.backgroundColor = "white";
      previewBtn.style.display = "flex";
    
      generateBtn.disabled = false;
      generateBtn.style.cursor = "pointer";
      generateBtn.style.color = "#fcfcfa";
    
      loader.style.display = "none";
      loader.style.backgroundColor = "unset";
      
      infoLoader.style.display = "none";
    
      isImageGenerated = true;
    }else{
      errorSelectPanel.style.display = "block";
      errorSelectPanel.textContent = `${result.data}`;
    }
  }

  function addText(event) {
    event.preventDefault();
    const errorSelectPanel = document.getElementById("errorSelectPanel");
  
    if (selectedPanelIndex != null) {
      errorSelectPanel.style.display = "none";
      const selectedPanel = document.getElementsByClassName("panel")[selectedPanelIndex];
      const selectedCaption = document.getElementsByClassName("caption")[selectedCaptionIndex];
      const textInputValue = document.getElementById("textInput").value;
      
      selectedCaption.textContent = textInputValue;
      selectedPanel.classList.remove("highlight");
      selectedPanelIndex = null;
    } else {
      errorSelectPanel.style.display = "block";
      errorSelectPanel.textContent = "Please select a panel to add";
    }
  }

  function acceptPreview() {
    const errorSelectPanel = document.getElementById("errorSelectPanel");
    const previewPanel = document.getElementById("previewPanel");
    const previewBtn = document.getElementById("previewBtn");
    if (selectedPanelIndex != null) {
      errorSelectPanel.style.display = "none";
      const selectedPanel =
        document.getElementsByClassName("panel")[selectedPanelIndex];
      selectedPanel.style.backgroundImage = `url("${
        document.getElementById("previewPanel").firstElementChild.src
      }")`;
      selectedPanel.classList.remove("highlight");
      
      previewPanel.style.display = "none";
      previewPanel.style.backgroundColor = "unset";
      
      selectedPanelIndex = null;
      pre.style.display = "none";
      isImageGenerated = false;
    } else {
      errorSelectPanel.style.display = "block";
      errorSelectPanel.textContent = "Please select a panel to add image";
    }
  }
  
  function rejectPreview() {
    const previewPanel = document.getElementById("previewPanel");
    const errorSelectPanel = document.getElementById("errorSelectPanel");
    const previewBtn = document.getElementById("previewBtn");
    const generateBtn = document.getElementById("generateBtn");
  
    previewPanel.style.display = "none";
    errorSelectPanel.style.display = "none";
    previewBtn.style.display = "none";
    generateBtn.disabled = false;
  
    if (selectedPanelIndex) {
      const selectedPanel =
        document.getElementsByClassName("panel")[selectedPanelIndex];
      selectedPanel.classList.remove("highlight");
    }
    selectedPanelIndex = null;
    isImageGenerated = false;
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
