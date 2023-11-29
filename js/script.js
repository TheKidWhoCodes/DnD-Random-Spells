// Ahmad Malki 2140076

// Set global variables for a larger scope.
var desc;
var school;
var loadingText;
var connectionSuccess = true;

// Assign event listeners for buttons and page.
const genButton = document.getElementById("generate-button");
genButton.addEventListener("click", getData);
document.addEventListener("keypress", getData)
document.body.addEventListener("dblclick", getData) //

function getData(e) {

    // Check if event is of desired key/type.
    if(e.key != "Enter" && e.type != "click" && e.type != "dblclick"){
        return;
    }

    // Get containers for dynamic element creation.
    const container = document.getElementById("container");
    const loadingDiv = document.getElementById("loading-div");

    // Remove/Add "Fetching..." message to inform the user.
    loadingText = document.createElement("p");
    if(loadingDiv.firstChild){
        loadingDiv.firstChild.remove();
    }
    loadingText.textContent = "Fetching...";
    loadingDiv.appendChild(loadingText);

    // Delete previously displayed data to display new data.
    while(container.firstChild){
        container.firstChild.remove();
    }

    // Determine endpoint
    const endpoint = "https://www.dnd5eapi.co/api/spells";
    const xhr = new XMLHttpRequest();

    // Initalize new connection.
    xhr.open("GET", endpoint);
    xhr.onload = function(){

        // Connection successful.
        if(xhr.status === 200){

            // Parse file to JSON.
            const data = JSON.parse(xhr.responseText);

            // Get count variable (the count of spells) from file.
            const count = data.count;

            // Repeat process for each retrieved spell.
            for (let i = 0; i < 5; i++){

                // Generate random number from 1 to "count".
                let selection = Math.floor(Math.random() * count + 1);

                // Select a random spell.
                const name = data.results[selection].name;
                const index = data.results[selection].index;

                // New endpoint for specific spell data retrieval.
                let endpoint = "https://www.dnd5eapi.co/api/spells/" + index;
                
                // Initialize new connection.
                xhr.open("GET", endpoint, false);
                xhr.onload = function(){

                    // Connection successful.
                    if(xhr.status === 200){

                        // Parse file to JSON.
                        const data = JSON.parse(xhr.responseText);

                        // Set global variables desc and school.
                        setDescription(data.desc);
                        setSchool(data.school.name);

                        // Delete "Fetching..." message when connection is secured.
                        if(loadingDiv.firstChild){
                            loadingDiv.firstChild.remove();
                        }
                    }
                    else {
                        // Print error message if connection fails.
                        console.error("Failed to connect to " + endpoint);
                        loadingText.textContent = "Connection failure";
                        connectionSuccess = false;
                    }
                }
                xhr.send();

                // Leave if previous connection was unsuccessful, continue if otherwise.
                if(!connectionSuccess){
                    return;
                }

                // Create data container and display it.
                const itemContainer = document.createElement("div");
                itemContainer.classList.add("item-container");
                container.appendChild(itemContainer);
                
                // Create spell name element and display it.
                const nameElement = document.createElement("p");
                nameElement.textContent = name;
                nameElement.classList.add("spell-name")
                itemContainer.appendChild(nameElement);

                // Create spell school element and display it.
                const schoolElement = document.createElement("p");
                schoolElement.textContent = school;

                // Change text color depending on school.
                switch(school){
                    case "Abjuration": schoolElement.classList.add("lightblue");
                    break;
                    case "Conjuration": schoolElement.classList.add("yellow");
                    break;
                    case "Divination": schoolElement.classList.add("silver");
                    break;
                    case "Enchantment": schoolElement.classList.add("pink");
                    break;
                    case "Evocation": schoolElement.classList.add("red");
                    break;
                    case "Illusion": schoolElement.classList.add("purple");
                    break;
                    case "Necromancy": schoolElement.classList.add("lightgreen");
                    break;
                    case "Transmutation": schoolElement.classList.add("lightbrown");
                    break;
                }
                itemContainer.appendChild(schoolElement);

                // Create spell description element and display it.
                const descElement = document.createElement("textarea");
                descElement.textContent = desc;
                descElement.readOnly = true
                descElement.contentEditable = true
                itemContainer.appendChild(descElement);

                // Create spell link element and display it.
                const linkElement = document.createElement("a");
                linkElement.textContent = "More info...";
                linkElement.href = "https://www.dndbeyond.com/spells/" + index;
                itemContainer.appendChild(linkElement);
            }
        }
        else {
            // Print error message if connection fails.
            console.error("Failed to connect to " + endpoint);
            loadingText.textContent = "Connection failure";
        }
    }
    xhr.send();
}

// Sets description to given value.
function setDescription(value) {
    desc = value;
}

// Sets school to given value
function setSchool(value) {
    school = value;
}