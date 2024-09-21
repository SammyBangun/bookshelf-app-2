let books = JSON.parse(localStorage.getItem("books")) || [];
let editBookId = null;

// Menambahkan buku
document
  .getElementById("bookForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = parseInt(document.getElementById("bookFormYear").value);
    const isComplete = document.getElementById("bookFormIsComplete").checked;

    if (editBookId !== null) {
      const bookIndex = books.findIndex((book) => book.id === editBookId);
      books[bookIndex] = {
        id: editBookId,
        title,
        author,
        year,
        isComplete,
      };

      editBookId = null;
      document.getElementById("bookFormSubmit").textContent =
        "Masukkan Buku ke rak";
    } else {
      const id = new Date().getTime();
      const newBook = { id, title, author, year, isComplete };
      books.push(newBook);
    }

    localStorage.setItem("books", JSON.stringify(books));

    renderBooks();
    document.getElementById("bookForm").reset();
  });

// Menampilkan buku dan membagi kedalam 2 rak
function renderBooks() {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");
  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  books.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">
            ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
          </button>
          <button data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      `;

    bookElement
      .querySelector('[data-testid="bookItemIsCompleteButton"]')
      .addEventListener("click", () => toggleCompleteBook(book.id));
    bookElement
      .querySelector('[data-testid="bookItemDeleteButton"]')
      .addEventListener("click", () => deleteBook(book.id));
    bookElement
      .querySelector('[data-testid="bookItemEditButton"]')
      .addEventListener("click", () => editBook(book.id));

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

window.addEventListener("load", function () {
  renderBooks();
});

// Memindahkan buku antar rak
function toggleCompleteBook(bookId) {
  const bookIndex = books.findIndex((book) => book.id === bookId);
  books[bookIndex].isComplete = !books[bookIndex].isComplete;
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
}

// Menghapus buku
function deleteBook(bookId) {
  books = books.filter((book) => book.id !== bookId);
  localStorage.setItem("books", JSON.stringify(books));
  renderBooks();
}

// Mencari buku
document
  .getElementById("searchBook")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const query = document
      .getElementById("searchBookTitle")
      .value.toLowerCase();

    const filteredBooks = books.filter((book) =>
      book.title.toLowerCase().includes(query)
    );

    renderFilteredBooks(filteredBooks);

    document.getElementById("searchBook").reset();
  });

// Menampilkan hasil pencarian buku
function renderFilteredBooks(filteredBooks) {
  const incompleteBookList = document.getElementById("incompleteBookList");
  const completeBookList = document.getElementById("completeBookList");

  incompleteBookList.innerHTML = "";
  completeBookList.innerHTML = "";

  filteredBooks.forEach((book) => {
    const bookElement = document.createElement("div");
    bookElement.setAttribute("data-bookid", book.id);
    bookElement.setAttribute("data-testid", "bookItem");
    bookElement.innerHTML = `
        <h3 data-testid="bookItemTitle">${book.title}</h3>
        <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
        <p data-testid="bookItemYear">Tahun: ${book.year}</p>
        <div>
          <button data-testid="bookItemIsCompleteButton">
            ${book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca"}
          </button>
          <button data-testid="bookItemDeleteButton">Hapus Buku</button>
          <button data-testid="bookItemEditButton">Edit Buku</button>
        </div>
      `;

    bookElement
      .querySelector('[data-testid="bookItemIsCompleteButton"]')
      .addEventListener("click", () => toggleCompleteBook(book.id));

    bookElement
      .querySelector('[data-testid="bookItemDeleteButton"]')
      .addEventListener("click", () => deleteBook(book.id));

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });
}

// Mengedit buku
function editBook(bookId) {
  const book = books.find((b) => b.id === bookId);
  document.getElementById("bookFormTitle").value = book.title;
  document.getElementById("bookFormAuthor").value = book.author;
  document.getElementById("bookFormYear").value = book.year;
  document.getElementById("bookFormIsComplete").checked = book.isComplete;

  editBookId = bookId;

  document.getElementById("bookFormSubmit").textContent = "Simpan Perubahan";
  document.getElementById("head").scrollIntoView({ behavior: "smooth" });
}
