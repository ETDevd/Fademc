document.addEventListener("DOMContentLoaded", function () {
    fetch("https://api.mcsrvstat.us/2/play.fademc.xyz")
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("player-count").textContent =
                data.players.online + " - Online";
        })
        .catch(() => {
            document.getElementById("player-count").textContent =
                "Unable to fetch player count";
        });

    const fullscreenButton = document.getElementById("fullscreen-button");
    const mapIframe = document.querySelector(".map-iframe");
    let isFullscreen = false;

    fullscreenButton.addEventListener("click", () => {
        if (!isFullscreen) {
            // Enter fullscreen mode
            mapIframe.style.position = "fixed";
            mapIframe.style.top = "0";
            mapIframe.style.left = "0";
            mapIframe.style.width = "100vw";
            mapIframe.style.height = "100vh";
            mapIframe.style.zIndex = "1010";
            fullscreenButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen-exit" viewBox="0 0 16 16">
                    <path d="M5.5 0a.5.5 0 0 1 .5.5v4A1.5 1.5 0 0 1 4.5 6h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5m5 0a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 10 4.5v-4a.5.5 0 0 1 .5-.5M0 10.5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 6 11.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5m10 1a1.5 1.5 0 0 1 1.5-1.5h4a.5.5 0 0 1 0 1h-4a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0z"/>
                </svg>
            `;
            fullscreenButton.title = "Switch to docked mode";
        } else {
            // Exit fullscreen mode
            mapIframe.style.position = "static";
            mapIframe.style.width = "80%";
            mapIframe.style.height = "400px";
            mapIframe.style.zIndex = "auto";
            fullscreenButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16">
                    <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5M.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5m15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5"/>
                </svg>
            `;
            fullscreenButton.title = "Switch to fullscreen mode";
        }
        isFullscreen = !isFullscreen;
    });

    const slidesContainer = document.querySelector('.slides-container');
    const slides = document.querySelectorAll('.slide img');
    const leftButton = document.querySelector('.nav-button.left');
    const rightButton = document.querySelector('.nav-button.right');

    let currentIndex = 0;
    const slideWidth = slides[0].clientWidth;
    const totalSlides = slides.length;

    // Auto-scroll function
    function autoScroll() {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlidePosition();
    }

    // Update slide position
    function updateSlidePosition() {
        slidesContainer.style.transform = `translateX(-${currentIndex * slideWidth}px)`;
    }

    // Button navigation
    leftButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
        updateSlidePosition();
    });

    rightButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % totalSlides;
        updateSlidePosition();
    });

    // Start auto-scroll
    let autoScrollInterval = setInterval(autoScroll, 3000);

    // Pause auto-scroll on hover
    document.querySelector('.slideshow').addEventListener('mouseover', () => {
        clearInterval(autoScrollInterval);
    });

    document.querySelector('.slideshow').addEventListener('mouseout', () => {
        autoScrollInterval = setInterval(autoScroll, 3000);
    });
});

document.addEventListener("DOMContentLoaded", async function () {
    const itemsContainer = document.getElementById("items-container");
    const mostBoughtContainer = document.getElementById("most-bought-container");

    // Function to fetch and parse shop items
    async function fetchShopItems() {
        try {
            const response = await fetch("https://store.fademc.xyz");
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, "text/html");

            // Extract product data
            const products = [];
            const productElements = doc.querySelectorAll(".product_thumbnail");

            productElements.forEach((productElement) => {
                const name = productElement.querySelector(".product_title").textContent.trim();
                const price = productElement.querySelector(".pricetag").textContent.trim();
                const description = productElement.querySelector(".description").textContent.trim();
                const id = productElement.querySelector("button").id;
                const image = productElement.querySelector("img")?.src || "default.png";

                products.push({ id, name, price, description, image });
            });

            return products;
        } catch (error) {
            console.error("Failed to fetch shop items:", error);
            return [];
        }
    }

    // Function to render items
    function renderItems(items, container) {
        container.innerHTML = "";
        items.forEach((item) => {
            const itemBox = document.createElement("div");
            itemBox.classList.add("item-box");
            itemBox.innerHTML = `
                <img src="${item.image}" alt="${item.name}">
                <h3>${item.name}</h3>
                <p>${item.description}</p>
                <p class="price">${item.price}</p>
                <button data-id="${item.id}">Buy Now</button>
            `;
            container.appendChild(itemBox);
        });
    }

    // Load most bought items from localStorage
    const mostBought = JSON.parse(localStorage.getItem("mostBought")) || [];

    // Fetch and display shop items
    const shopItems = await fetchShopItems();

    // Render most bought items
    if (mostBought.length > 0) {
        const mostBoughtItems = shopItems.filter((item) => mostBought.includes(item.id));
        renderItems(mostBoughtItems, mostBoughtContainer);
    } else {
        mostBoughtContainer.innerHTML = "<p>No popular items yet. Be the first to buy!</p>";
    }

    // Render all items
    renderItems(shopItems, itemsContainer);

    // Handle "Buy Now" button clicks
    document.body.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
            const itemId = e.target.dataset.id;
            const item = shopItems.find((item) => item.id === itemId);

            if (item) {
                alert(`Thank you for purchasing ${item.name}!`);

                // Update most bought items
                if (!mostBought.includes(itemId)) {
                    mostBought.push(itemId);
                    localStorage.setItem("mostBought", JSON.stringify(mostBought));
                }
            }
        }
    });
});

document.querySelector('.join-button').addEventListener('click', () => {
    const popup = document.querySelector('.popup');
    popup.style.display = popup.style.display === 'block' ? 'none' : 'block';
});

document.addEventListener("DOMContentLoaded", () => {
    const profileButton = document.getElementById("profile-button");
    const linkButton = document.getElementById("link-button");
    const linkingStatus = document.getElementById("linking-status");

    // Create the floating display
    const floatingDisplay = document.createElement("div");
    floatingDisplay.classList.add("floating-display");
    floatingDisplay.innerHTML = `
        <h3>Global Linking</h3>
        <p>Link your Bedrock and Java accounts to use Global Linking.</p>
        <button id="link-button">Start Linking</button>
        <div id="linking-status"></div>
        <button id="close-floating-display">Close</button>
    `;
    document.body.appendChild(floatingDisplay);

    // Show the floating display when the profile button is clicked
    profileButton.addEventListener("click", () => {
        floatingDisplay.style.display = "block";
    });

    // Close the floating display
    floatingDisplay.addEventListener("click", (e) => {
        if (e.target.id === "close-floating-display") {
            floatingDisplay.style.display = "none";
        }
    });

    // Handle the linking process
    floatingDisplay.addEventListener("click", async (e) => {
        if (e.target.id === "link-button") {
            try {
                // Step 1: Start the linking process
                linkingStatus.textContent = "Starting the linking process...";
                const response = await fetch("https://link.geysermc.org/start", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        server: "play.fademc.xyz", // Replace with your server's address
                    }),
                });

                if (!response.ok) {
                    throw new Error("Failed to start the linking process.");
                }

                const data = await response.json();
                const { linkCode, linkUrl } = data;

                // Step 2: Display the link code and URL
                linkingStatus.innerHTML = `
                    <p>Use the following link code to link your account:</p>
                    <h3>${linkCode}</h3>
                    <p>Click <a href="${linkUrl}" target="_blank">here</a> to complete the linking process.</p>
                `;

                // Step 3: Poll for linking status
                const pollInterval = setInterval(async () => {
                    const pollResponse = await fetch(`https://link.geysermc.org/status/${linkCode}`);
                    const pollData = await pollResponse.json();

                    if (pollData.status === "linked") {
                        clearInterval(pollInterval);

                        // Step 4: Display linked account information
                        const { javaUsername, javaUniqueId, xboxId } = pollData;
                        linkingStatus.innerHTML = `
                            <p>Account linked successfully!</p>
                            <p><strong>Java Username:</strong> ${javaUsername}</p>
                            <p><strong>Java Unique ID:</strong> ${javaUniqueId}</p>
                            <p><strong>Xbox ID:</strong> ${xboxId}</p>
                        `;
                        // 👉 Add this line to update the Bedrock player name on the profile
                        document.getElementById("username").textContent = javaUsername || xboxId;
                    }
                }, 5000); // Poll every 5 seconds
            } catch (error) {
                linkingStatus.textContent = `Error: ${error.message}`;
            }
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("profile-button");

    // Set up Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Add lighting
    const light = new THREE.AmbientLight(0xffffff, 1); // Soft white light
    scene.add(light);

    // Load the 3D model
    const loader = new THREE.GLTFLoader();
    loader.load('head.gltf', (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.25, 1.25, 1.25); // Adjust scale
        scene.add(model);

        // Animate the model (optional rotation)
        function animate() {
            requestAnimationFrame(animate);
            model.rotation.y += 0.01; // Rotate the model
            renderer.render(scene, camera);
        }
        animate();
    }, undefined, (error) => {
        console.error('An error occurred while loading the model:', error);
    });

    // Set camera position
    camera.position.z = 2;

    // Add click event to show floating display
    container.addEventListener("click", () => {
        const floatingDisplay = document.querySelector(".floating-display");
        floatingDisplay.style.display = "block";
    });
});
