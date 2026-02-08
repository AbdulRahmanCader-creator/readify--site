// --- REUSABLE FUNCTIONS & GLOBAL LOGIC ---
// function to highlight the current page
function highlightCurrentPage() {
    // 1. Get the current URL (e.g., "explorer.html")
    const currentPage = window.location.pathname.split("/").pop();
    
    // 2. Find all links in your nav-links div
    const navLinks = document.querySelectorAll('.nav-links a');

    navLinks.forEach(link => {
        // 3. Get the filename from the href (e.g., "explorer.html")
        const linkPage = link.getAttribute('href');

        // 4. If they match, add the 'active' class
        if (currentPage === linkPage) {
            link.classList.add('active');
        }
    });
}


function subscribeNewsletter() {
    const emailInput = document.getElementById('newsletter-email');
    const message = document.getElementById('subscription-msg');

    if (!emailInput || !message) return; // Exit early if footer isn't there

    const email = emailInput.value;

    // Simple check to make sure the input isn't empty
    if (email) {
        // Save to localStorage: localStorage.setItem('key', 'value')
        localStorage.setItem('subscriberEmail', email);
        
        // Show a success message to the user
        message.innerText = "Thanks for subscribing!";
        emailInput.value = ""; // Clear the box
    } else {
        alert("Please enter a valid email address.");
    }
}

// Run this automatically every time any page loads
window.addEventListener('DOMContentLoaded', highlightCurrentPage);

// --- AUTO-ROTATING QUOTES (Requirement 1.1) ---
const quotes = [
    "'A book is a dream that you hold in your hand.' – Neil Gaiman",
    "'Reading is essential for those who seek to rise above the ordinary.' – Jim Rohn",
    "'There is no friend as loyal as a book.' – Ernest Hemingway",
    "'Books are a uniquely portable magic.' – Stephen King"
];

let quoteIndex = 0;
const quoteElement = document.getElementById("rotating-quote");

function rotateQuotes() {
    
    if (!quoteElement) return; // if to stop null error

    quoteElement.style.opacity = 0;  //fade in quote
    setTimeout(() => {
        quoteIndex = (quoteIndex + 1) % quotes.length;
        quoteElement.textContent = quotes[quoteIndex];
        quoteElement.style.opacity = 1;  //fade out quote
    }, 500);
}

// Change quote every 5 seconds
setInterval(rotateQuotes, 5000);

// --- AUTHOR OF THE DAY (Requirement 1.3) ---
const authors = [
    { name: "J.K. Rowling", date: 1 }, // Assign numbers for dates
    { name: "George R.R. Martin", date: 2 },
    { name: "Agatha Christie", date: 3 },
    { name: "J.R.R. Tolkien", date: 4 },
    { name: "F. Scott Fitzgerald", date: 5},
    { name: "George Orwell", date: 6},
    { name: "Rick Riordan", date: 7}
];

function setAuthorOfTheDay() {
    const today = new Date().getDate(); // Gets day of the month (1-31)
    const authorDisplay = document.getElementById("author-name");
    
    // Simple logic: pick an author based on the current date
    const dailyAuthor = authors[today % authors.length];
    authorDisplay.textContent = dailyAuthor.name;
}




// --- BOOK DATA (JSON-like Array FOLLOWING REQ DATA STORED IN JS OBJECT) ---
const books = [
    { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", genre: "Classic", img: "Images/gatsbyimg.jpg", desc: "A story of wealth and love.", rating: "4.4/5", length: "short"},
    { id: 2, title: "The Hobbit", author: "J.R.R. Tolkien", genre: "Fantasy", img: "Images/hobbitimg.webp", desc: "An epic adventure.", rating: "4.8/5", sequel: ["The Fellowship of the Ring", " The Two Towers", " The Return of the King"], length: "long" },
    { id: 3, title: "1984", author: "George Orwell", genre: "Fiction", img: "Images/1984img.jpg", desc: "A dystopian future.", rating: "4.2/5", length: "medium" },
    { id: 4, title: "Percy Jackson & The Olympians", author: "Rick Riordan", genre: "Fantasy", img: "Images/percy.jpg", desc: "A boy discovers he is a demigod and the son of Poseidon.", rating: "4.9/5", sequel: ["The Heroes of Olympus"], length: "medium" },
    { id: 5, title: "Dune", author: "Frank Herbert", genre: "Fiction", img: "Images/dune.jpeg", desc: "A story of politics, religion, and survival on a desert planet.", rating: "4.7/5", sequel: ["Sisterhood of Dune", "Dune Messiah"], length: "long" }
];


const grid = document.getElementById('book-display-grid');
// Check if the grid exists before trying to show books
if (grid) {
    displayBooks(books);
}



function displayBooks(bookArray) {
    if(!grid) return; // Only run on explorer page
    grid.innerHTML = ""; 
    
    bookArray.forEach(book => {        // finds book in books array
        const card = document.createElement('div');
        card.classList.add('book-card');
        card.innerHTML = `
            <img src="${book.img}" alt="${book.title}">
            <h3>${book.title}</h3>
            <p>${book.author}</p>
        `;
        card.onclick = () => openModal(book);  // onclick built in event so when clicked, openModal is called and executes
        grid.appendChild(card);
    });
}

// Search Logic (filter as you search)
const searchInput = document.getElementById('book-search');
if(searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = books.filter(b => b.title.toLowerCase().includes(term));
        displayBooks(filtered);
    });
}

if(searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = books.filter(b => 
            b.title.toLowerCase().includes(term) || 
            b.author.toLowerCase().includes(term)
        );
        
        displayBooks(filtered);

        // Bonus: Show a message if no books match
        if (filtered.length === 0) {
            grid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; padding: 20px;">
                                No books found matching "${term}".
                              </p>`;
        }
    });
}


// --- MODAL LOGIC (Requirement 1.2.3) ---
const modal = document.getElementById("book-modal");
const modalBody = document.getElementById("modal-body");
const closeBtn = document.querySelector(".close-button");

function openModal(book) {
    // Creating the content for the modal based on one singular book item
    modalBody.innerHTML = `
        <h2>${book.title}</h2>
        <p><strong>Author:</strong> ${book.author}</p>
        <p><strong>Synopsis:</strong> ${book.desc}</p>
        
        <h3>Sequels/Prequels</h3>
        <ul>
            <li>${book.sequel || 'None'}</li>
        </ul>

        <h3>Ratings & Reviews</h3>
        <table border="1" style="width:100%; border-collapse: collapse;">
            <tr>
                <th>Source</th>
                <th>Rating</th>
            </tr>
            <tr>
                <td>Reader Review</td>
                <td>${book.rating}</td>
            </tr>
        </table>
    `;
    modal.style.display = "block";
}

// Close modal when 'X' is clicked
if(closeBtn) {
    closeBtn.onclick = () => modal.style.display = "none";
}

// --- GENRE FILTER LOGIC (Requirement 1.2.2) ---
const genreFilter = document.getElementById('genre-filter');

if(genreFilter) {
    genreFilter.addEventListener('change', (e) => {
        const selectedGenre = e.target.value;
        if (selectedGenre === "all") {
            displayBooks(books);
        } else {
            const filtered = books.filter(b => b.genre === selectedGenre);
            displayBooks(filtered);
        }
    });
}

// Close modal if user clicks outside the box
window.onclick = (event) => {
    if (event.target == modal) {
        modal.style.display = "none";
    }
};



// Power button
document.addEventListener('DOMContentLoaded', () => {
    // 1. Run Home Page logic
    if (document.getElementById("author-name")) {
        setAuthorOfTheDay();
    }
    
    // 2. Run Explorer Page logic
    if (document.getElementById("book-display-grid")) {
        displayBooks(books);
    }

    // 3. Modal "Click Outside" logic
    window.onclick = (event) => {
        // We only care about this if the modal actually exists on the page
        if (modal && event.target == modal) {
            modal.style.display = "none";
        }
    };

    
});



// --- TRACKER LOGIC ---
const calculateBtn = document.getElementById('calculate-btn');

if (calculateBtn) {
calculateBtn.addEventListener('click', () => {
    // 1. Grab values
    const total = parseFloat(document.getElementById('total-pages').value);
    const read = parseFloat(document.getElementById('pages-read').value);
    const speed = parseFloat(document.getElementById('reading-speed').value);

    // 2. SMART VALIDATION (The Fix)
    if (total <= 0 || read < 0 || speed <= 0) {
        alert("Numbers must be positive! You can't have negative pages or speed.");
        return; 
    }

    if (read > total) {
        alert("You can't read more pages than the book actually has!");
        return;
    }

    // 3. Perform Calculations
    const percentage = (read / total) * 100;
    const remainingPages = total - read;
    const daysLeft = Math.ceil(remainingPages / speed);

    // 4. Update the DOM
    document.getElementById('results-area').style.display = "block";
    document.getElementById('percent-display').innerText = percentage.toFixed(1);
    document.getElementById('finish-time').innerText = daysLeft;
    
    const progressBar = document.getElementById('progress-fill');
    progressBar.style.width = percentage + "%";
});
}

// Logic for Saving to LocalStorage 
const saveBtn = document.getElementById('save-btn');
if (saveBtn) {
    saveBtn.addEventListener('click', () => {
        const progressData = {
            total: document.getElementById('total-pages').value,
            read: document.getElementById('pages-read').value
        };
        localStorage.setItem('readingProgress', JSON.stringify(progressData));
        alert("Progress saved to your browser!");
    });
}


const recommendBtn = document.getElementById('recommend-btn');

if (recommendBtn) {
    recommendBtn.addEventListener('click', () => {
        const genre = document.getElementById('genre-select').value;
        const length = document.getElementById('length-select').value;
        const resultArea = document.getElementById('recommendation-result');

        // 1. FILTER: Find books that match BOTH genre and length 
        const matches = books.filter(b => b.genre === genre && b.length === length);

        if (matches.length > 0) {
            // 2. RANDOM: Pick one from the matches 
            const randomBook = matches[Math.floor(Math.random() * matches.length)];

            // 3. DISPLAY: Show result and the "Save" button 
            resultArea.innerHTML = `
                <div class="recommend-card animate-fade-in">
                    <h3>${randomBook.title}</h3>
                    <p>By ${randomBook.author}</p>
                    <button class="save-list-btn" onclick="saveToReadingList(${randomBook.id})">
                        Add to Reading List
                    </button>
                </div>
            `;
        } else {
            resultArea.innerHTML = "<p>No books found for that combo. Try another!</p>";
        }
    });
}

// 4. THE SAVING LOGIC (Requirement: localStorage reading list) [cite: 49, 69]
function saveToReadingList(bookId) {
    // Get existing list or start a new empty array
    let currentList = JSON.parse(localStorage.getItem('myReadingList')) || [];

    // Check if the book is already in the list
    if (!currentList.includes(bookId)) {
        currentList.push(bookId);
        localStorage.setItem('myReadingList', JSON.stringify(currentList));
        alert("Book added to your personal Reading List!");
    } else {
        alert("This book is already in your list!");
    }
}



// READFLOW
// --- AMBIENT SOUNDS LOGIC ---
let currentAudio = null;
function toggleSound(fileName) {
    const audioPath = `Sounds/${fileName}.mp3`;

    if (currentAudio && currentAudio.src.includes(audioPath)) {   //if current audio is null includes is built-in that returns true or false if found audioPath 
        currentAudio.pause(); 
        currentAudio = null;
    } else {
        if (currentAudio) currentAudio.pause();  // pause if current audio is not nul
        currentAudio = new Audio(audioPath);   // Audio built-in js constructor
        currentAudio.loop = true;  
        currentAudio.play();
    }
}

// --- LOCALSTORAGE PROGRESS TRACKER FOR READFLOW---
// 1. Function to save a book to the finished list
function addCurrentToComplete() {
    let finished = JSON.parse(localStorage.getItem('completedBooks')) || [];
    
    // booID 1 as current book
    let bookId = 1; 
    
    if (!finished.includes(bookId)) {
        finished.push(bookId);
        localStorage.setItem('completedBooks', JSON.stringify(finished));
        renderCompletedList(); // Refresh display to show completed book in the styled grid
        alert("Book marked as complete!");
    } else {
        alert("This book is already finished!");
    }
}

// 2. Function to display the list from localStorage
function renderCompletedList() {
    const listDiv = document.getElementById('completed-list');

    if (!listDiv) return; //to check if list exists

    const finishedIds = JSON.parse(localStorage.getItem('completedBooks')) || [];

    if (finishedIds.length === 0) {
        listDiv.innerHTML = "<p>No books completed yet. Keep reading!</p>";
        return;
    }

    // filter out book details from your main 'books' object array
    const finishedData = books.filter(b => finishedIds.includes(b.id));

    listDiv.innerHTML = finishedData.map(book => `
        <div class="completed-card animate-fade-in">
            <h4>${book.title}</h4>
            <p>By ${book.author}</p>
        </div>
    `).join('');
}

// Run this on page load to show existing progress
document.addEventListener('DOMContentLoaded', renderCompletedList);


// TASK 6: Feedback Form Validation & LocalStorage
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const feedbackData = {
        name: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        message: document.getElementById('userMessage').value
    };

    // Store in localStorage
    localStorage.setItem('userFeedback', JSON.stringify(feedbackData));
    
    // Show confirmation
    document.getElementById('confirmationMessage').style.display = 'block';
    feedbackForm.reset();
});
}

// FAQ Accordion Toggle 
document.querySelectorAll('.accordion-header').forEach(button => {
    button.addEventListener('click', () => {
        const content = button.nextElementSibling;
        
        // This ensures if it's open, it closes, and vice versa
        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
            content.style.display = "block";
        }
    });
});
// Define the elements first
const hamb = document.getElementById('hamburger');
const btnhamb = document.getElementById('btn-hamb');

// The Action: What happens when the button is clicked
function openHamburger() {
    if (hamb) {
        // We check if it's currently empty to create a simple toggle
        if (hamb.innerHTML === "") {
            hamb.innerHTML = `
                <a href="index.html">Home</a>
                <a href="explorer.html">Explorer</a>
                <a href="tracker.html">Tracker</a>
                <a href="recommender.html">Recommender</a>
                <a href="readflow.html">Readflow</a>
                <a href="feedback.html">Feedback</a>
            `;
        } else {
            // If it's already full, we clear it (closes the menu)
            hamb.innerHTML = "";
        }
    }
}

// The Trigger: This "listens" for the click and calls the function
if (btnhamb) {
btnhamb.addEventListener('click', openHamburger);
}