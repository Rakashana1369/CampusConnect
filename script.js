
// CAMPUSCONNECT JAVASCRIPT


// STEP 1: CONNECT HTML ELEMENTS

const form = document.getElementById("itemForm");

const itemList = document.getElementById("itemList");

const searchInput = document.getElementById("searchInput");

const filterType = document.getElementById("filterType");

const noResults = document.getElementById("noResults");


// STEP 2: LOAD SAVED ITEMS

let items = [];

try {
    items = JSON.parse(
        localStorage.getItem("campusItems")
    ) || [];
} catch (error) {
    items = [];
}


// STEP 3: DISPLAY ITEMS

function displayItems() {

    itemList.innerHTML = "";

    const searchText =
        searchInput.value.toLowerCase();

    const selectedType =
        filterType.value;

    let count = 0;


    items.forEach(function(item) {

        const matchesName =
            item.name.toLowerCase().includes(searchText);

        const matchesType =
            selectedType === "All" ||
            item.type === selectedType;


        if (!matchesName || !matchesType) {
            return;
        }


        // CREATE ITEM CARD

        const card = document.createElement("div");

        card.className = "item-card";


        // ITEM NAME

        const heading = document.createElement("h3");

        heading.textContent = item.name;

        card.appendChild(heading);


        // DISPLAY PHOTO

        if (item.image) {

            const photo = document.createElement("img");

            photo.src = item.image;

            photo.alt = item.name;

            photo.className = "item-photo";

            card.appendChild(photo);

        }


        // ITEM DETAILS

        const details = [
            "Type: " + item.type,
            "Category: " + item.category,
            "Location: " + item.location,
            "Description: " + (item.description || "Not provided")
        ];


        details.forEach(function(detail) {

            const paragraph = document.createElement("p");

            paragraph.textContent = detail;

            card.appendChild(paragraph);

        });


        // ADD CARD TO WEBSITE

        itemList.appendChild(card);

        count++;

    });


    // NO RESULTS MESSAGE

    if (count === 0) {

        noResults.style.display = "block";

        noResults.textContent =
            items.length === 0
                ? "No reports yet. Submit your first item!"
                : "No matching items found.";

    } else {

        noResults.style.display = "none";

    }

}


// STEP 4: SUBMIT REPORT

form.addEventListener("submit", function(event) {

    event.preventDefault();


    // GET FORM VALUES

    const name =
        document.getElementById("itemName").value.trim();

    const type =
        document.getElementById("itemType").value;

    const category =
        document.getElementById("category").value;

    const location =
        document.getElementById("itemLocation").value.trim();

    const description =
        document.getElementById("description").value.trim();

    const imageFile =
        document.getElementById("itemImage").files[0];


    // SAVE ITEM FUNCTION

    function saveItem(imageData) {

        const newItem = {

            name: name,
            type: type,
            category: category,
            location: location,
            description: description,
            image: imageData

        };


        items.unshift(newItem);


        // SAVE TO LOCAL STORAGE

        try {

            localStorage.setItem(
                "campusItems",
                JSON.stringify(items)
            );

        } catch (error) {

            items.shift();

            alert(
                "Storage is full. Please use a smaller image."
            );

            return;

        }


        // CLEAR FORM

        form.reset();

        searchInput.value = "";

        filterType.value = "All";


        // DISPLAY UPDATED ITEMS

        displayItems();

        alert("Item reported successfully!");

    }


    // CHECK IMAGE

    if (imageFile) {

        if (!imageFile.type.startsWith("image/")) {

            alert("Please select a valid image.");

            return;

        }


        if (imageFile.size > 1024 * 1024) {

            alert("Please select an image smaller than 1 MB.");

            return;

        }


        // READ IMAGE

        const reader = new FileReader();

        reader.onload = function() {

            saveItem(reader.result);

        };

        reader.readAsDataURL(imageFile);

    } else {

        saveItem("");

    }

});


// STEP 5: SEARCH ITEMS

searchInput.addEventListener(
    "input",
    displayItems
);


// STEP 6: FILTER LOST AND FOUND

filterType.addEventListener(
    "change",
    displayItems
);


// STEP 7: LOAD ITEMS WHEN WEBSITE OPENS

displayItems();
