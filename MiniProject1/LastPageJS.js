//FETCH API

/*fetch(
  //request access to backend database (API) - NY Times book reviews.
  "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=YYRTmuGHrdxW9AaXsNhXhNhApOa05QAG"
)
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error(error));*/
const cardsContainer = document.getElementById("cardsContainer");
const cardTemplate = document.getElementById("bookCardTemplate");

const cardsPerPage = 6;
let currentPage = 1;
let books = [];
let totalPages = 0;

const fetchbooks = async () => {
  try {
    const response = await fetch(
      "https://api.nytimes.com/svc/books/v3/lists/current/hardcover-fiction.json?api-key=YYRTmuGHrdxW9AaXsNhXhNhApOa05QAG"
    );
    const data = await response.json();
    return data.results.books;
  } catch (error) {
    console.error(error);
    return savedBooks;
  }
};

//POPULATE CARDS:
function createCards(books) {
  cardsContainer.innerHTML = "";
  books.forEach((book, index) => {
    const bookindex = index + cardsPerPage * (currentPage - 1); //add this line so that the modal on subsequent pages will link back through to the updated pages, not to the first lot of 6.
    const card = cardTemplate.content.cloneNode(true);

    const img = card.querySelector(".cardIMG");
    const title = card.querySelector(".title");
    const author = card.querySelector(".author");
    img.src = book.book_image;
    title.textContent = book.title;
    author.textContent = `${book.author}`;

    const infoButton = card.querySelector(".btn");
    infoButton.setAttribute("data-index", bookindex); //again, use the bookindex to call the subsequent lot of six on the pagination.
    cardsContainer.appendChild(card);
  });
}

async function fetchbooksMain() {
  books = await fetchbooks();
  displayPage(1);
  updatePagination();
  // createCards(books);
}
fetchbooksMain();

//DROPDOWN - FILTER BY AUTHOR:
function populateAuthorDropdown() {
  const authorDropdown = document.getElementById("authorDropdown");
  const authors = [...new Set(books.map((book) => book.author))];

  authorDropdown.innerHTML = "";

  const allOption = document.createElement("option");
  allOption.textContent = "All";
  allOption.dataset.value = "all";
  authorDropdown.appendChild(allOption);

  authors.forEach((author) => {
    const authorOption = document.createElement("option");
    authorOption.textContent = author;
    authorOption.dataset.value = author;
    authorDropdown.appendChild(authorOption);
  });
}

document.getElementById("authorDropdown").addEventListener("change", (e) => {
  const selectedAuthor = e.target.value;
  if (selectedAuthor == "All") {
    displayPage(1);
  } else {
    const filterbooks = books.filter((book) => book.author == selectedAuthor);
    createCards(filterbooks);
  }
});

async function fetchbooksMain() {
  books = await fetchbooks();
  populateAuthorDropdown();
  displayPage(1);
  updatePagination();
}

//PAGINATION SUPPORT - LIMIT TO 8 RESULTS ONLY:

function displayPage(page) {
  const startIndex = (page - 1) * cardsPerPage;
  const endIndex = startIndex + cardsPerPage;
  const currentBooks = books.slice(startIndex, endIndex);
  createCards(currentBooks);
}

const prevButton = document.getElementById("previous");
const nextButton = document.getElementById("next");
const pageNumbers = document.getElementById("paginationInfo");

function updatePagination() {
  const totalPages = Math.ceil(books.length / cardsPerPage);
  pageNumbers.textContent = `Page ${currentPage} of ${totalPages}`;
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage === totalPages;
}
//Update for "Previous" button.
prevButton.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--; //current page reduce (decrement operator "--") by one.
    displayPage(currentPage);
    updatePagination();
  }
});

//update for "Next" button.
nextButton.addEventListener("click", () => {
  const totalPages = Math.ceil(books.length / cardsPerPage);

  if (currentPage < totalPages) {
    currentPage++; //current page increase (increment operator ("++") by one.)
    displayPage(currentPage);
    updatePagination();
  }
});
fetchbooksMain();
//Modal:

const regModal = document.getElementById("reg-modal");
const myInput = document.getElementById("myInput");

if (regModal) {
  regModal.addEventListener("show.bs.modal", (event) => {
    const button = event.relatedTarget;
    const bookIndex = button.getAttribute("data-index");

    const book = books[bookIndex];

    const modalTitle = regModal.querySelector(".modal-title");
    const modalImg = regModal.querySelector(".modal-img");
    const modalAuthor = regModal.querySelector(".modal-author");
    const modalDescription = regModal.querySelector(".modal-description");

    modalTitle.textContent = book.title;
    modalImg.src = book.book_image;
    modalAuthor.textContent = `Author: ${book.author}`;
    modalDescription.textContent = book.description;
  });
}

/*myModal.addEventListener("click", (event) => {
    if (this.matches(".btn .info-button")) {
      const index = event.target.getAttribute("data-index");
      const book = books[index];
      const modal = document.getElementById("reg-modal");
      //modal.querySelector(".modal-title").textContent = book.title;
      //modal.querySelector(".modal-img").src = book.book_image;
      //modal.querySelector(".author ").textContent = `Author: ${book.author}`;
      //modal.querySelector(".description").textContent = book.description;
    }
  });*/
/*
  function displayPage(modal) {
    cardsContainer.innerHTML = "";
    currentModal.forEach((card) => {
      const modal = modalTemplate.content.cloneNode(true);
      card.querySelector(".cardIMG").src = book.book_image;
      card.querySelector(".title").textContent = book.title;
      card.querySelector(".author").textContent = book.author;
      cardsContainer.appendChild(card);
    });
  }
  fetchbooksMain();*/
