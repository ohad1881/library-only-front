//books querySelectors
const mainSection = document.querySelector(".container");

const changeLocation = document.querySelector(".change-location");
const allBooksBtn = document.querySelector(".all-books-btn");
const addBooksBtn = document.querySelector(".add-books-btn");
const removeBooksBtn = document.querySelector(".remove-books-btn");
const addRemoveCopiesBtn = document.querySelector(
  ".add-remove-copies-btn-menu"
);
const addRemovebookCategoryBtn = document.querySelector(
  ".add-remove-book-category-menu"
);

//rents querySelectors
const allRentsBtn = document.querySelector(".all-rents-btn");
const rentBooksBtn = document.querySelector(".rent-books-btn");
const returnRentBooksBtn = document.querySelector(".return-rent-books-btn");
const timeIsUp = document.querySelector(".who-should-return-btn");

//search bar querySelectors
const serchBarBox = document.querySelector(".search-bar-box");
const homeScreenBtn = document.querySelector(".home-screen-btn");
const searchBar = document.querySelector("#search-bar");
const bookOrRent = document.getElementById("select-book-person");

//functions books
// all books button click
const allBooks = async function () {
  try {
    let booksString = "";
    mainSection.innerHTML = "";
    mainSection.classList.add("grid-4-rows");
    if (window.innerWidth <= 822) {
      menu1.classList.add("hidden");
    }

    const res = await fetch("http://127.0.0.1:9000/books");
    const data = await res.json();
    const dataList = Object.entries(data);

    let i = 0;

    dataList.forEach((book) => {
      const [bookname, author] = book[0].split("##");
      booksString += `<div data-bookdata="${i}" class="book">
      <img
        class="book-img"
        src="/imgs/default-book.jpg"
        alt="default book image"
      />
      <h3 class="bookname">${bookname}</h3>
      <h4>Author: ${author}</h4>
      <p>copies available: ${book[1].copies_available}</p>
      <p>total copies: ${book[1].total_copies}</p>
    </div>`;
      i += 1;
    });
    mainSection.insertAdjacentHTML("beforeend", booksString);

    const clickBooks = document.querySelectorAll(".book");
    clickBooks.forEach((book) =>
      book.addEventListener("click", function () {
        mainSection.innerHTML = "";
        mainSection.classList.remove("grid-4-rows");
        const extendedBookData = dataList[book.dataset.bookdata];
        console.log(extendedBookData);
        const [exBookname, exAuthor] = extendedBookData[0].split("##");
        mainSection.insertAdjacentHTML(
          "beforeend",
          `
        <div class="extended-book-data">
        <div class="ex-bookname">"${exBookname}"</div>
        <div class="ex-author">Author: ${exAuthor}</div>
        <div class="ex-copies-available">Copies available: ${extendedBookData[1].copies_available}</div>
        <div class="ex-total-copies">Total copies: ${extendedBookData[1].total_copies}</div>
        <div class="ex-publication_date">Publication date: ${extendedBookData[1].publication_date}</div>
        <div class="ex-located">Located: ${extendedBookData[1].location}</div>
        <div class="ex-number-of-pages">Number of pages: ${extendedBookData[1].number_of_pages}</div>
        <div class="ex-date-added">Date added: ${extendedBookData[1].date_added}</div>
        <div class="ex-categories">Categories: ${extendedBookData[1].categories}</div>
        <button class="ex-rent-btn">Rent</button>`
        );
        //rent button
        const exRentBtn = document.querySelector(".ex-rent-btn");
        exRentBtn.addEventListener("click", function () {
          mainSection.innerHTML = "";
          mainSection.insertAdjacentHTML(
            "beforeend",
            `<div class="rent-book">
            <h4 class="rent-book-title">rent the book <highlight>${exBookname}</highlight> by <highlight>${exAuthor}</highlight> for a person</h4>
            <form class="rent-book-form">
              <div>
                <label for="person-name">Person name:</label>
                <input
                  id="person-name"
                  type="text"
                  placeholder="Ohad shushan"
                  required
                />
              </div>
              <div>
                <label for="id-number">ID: </label>
                <input id="id-number" type="number" required />
              </div>
              <div>
                <label for="phone-number">Phone number:</label>
                <input id="phone-number" type="number" required />
              </div>
  
              <button class="Rent-book-btn">Rent</button>
            </form>
          </div>`
          );
          const finalRent = document.querySelector(".Rent-book-btn");
          finalRent.addEventListener("click", async function (event) {
            event.preventDefault(); // Prevent the form from submitting and refreshing the page

            // Get values from the input fields
            const name_and_author = exBookname + "##" + exAuthor;

            const PersonName = document.getElementById("person-name").value;
            const IdNumber = document.getElementById("id-number").value;
            const phoneNumber = document.getElementById("phone-number").value;

            try {
              // Send the book data to the server
              if (PersonName === "" || !IdNumber || !phoneNumber) {
                alert("fill in all fields!");
                return;
              }
              const response = await fetch(
                `http://127.0.0.1:9000/rent/${encodeURIComponent(
                  name_and_author
                )}/${PersonName}/${IdNumber}/${phoneNumber}`,
                {
                  method: "POST", // Specify the request method
                }
              );

              // Check if the response is okay (status in the range 200-299)
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }

              // Parse the response if needed
              const result = await response.json();
              alert(JSON.stringify(result, null, 2)); // Converts the result object to a JSON string
            } catch (error) {
              console.error("Error renting book:", error);
            }
          });
        });
      })
    );
  } catch (err) {
    console.log(err);
    renderError(`something went wrong ${err.message}`);
  }
};
// add books button click
const addBooks = async function () {
  mainSection.innerHTML = "";
  mainSection.classList.remove("grid-4-rows");
  if (window.innerWidth <= 822) {
    menu1.classList.add("hidden");
  }
  mainSection.insertAdjacentHTML(
    "beforeend",
    `<div class="add-book">
    <h4 class="add-book-title">Add a book to the library</h4>
    <form class="add-book-form">
      <div>
        <label for="book-name-Id">Bookname</label>
        <input
          id="book-name-Id"
          type="text"
          placeholder="Harry Potter"
          required
        />
      </div>
      <div>
        <label for="author-Id">Author</label>
        <input
          id="author-Id"
          type="text"
          placeholder="j.k rolling"
          required
        />
      </div>
      <div>
        <label for="categories">Categories</label>
        <input
          id="categories"
          type="text"
          placeholder="thriller,action,horror..."
          required
        />
      </div>
      <div>
        <label for="number-of-copies">Number of copies</label>
        <input id="number-of-copies" type="number" required />
      </div>

      <div>
        <label for="location">Shelf number:</label>
        <input
          id="location"
          type="number"
          required
        />
      </div>
      <div>
        <label for="number-of-pages">number of pages:</label>
        <input id="number-of-pages" type="number" required />
      </div>
      <div>
        <label for="date-added">Date added: </label>
        <input id="date-added" type="date" required />
        
      </div>
      <div>
        <label for="pub-date">publication date</label>
        <input id="pub_date" type="date" required />
        
      </div>

      <button class="add-book-btn">Add</button>
    </form>
  </div>`
  );
  const addBookBtn = document.querySelector(".add-book-btn");
  addBookBtn.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Get values from the input fields
    const bookName = document.getElementById("book-name-Id").value;
    const author = document.getElementById("author-Id").value;
    const name_and_author = bookName + "##" + author;

    const categories = [
      ...document.getElementById("categories").value.split(","),
    ];
    const numberOfCopies = +document.getElementById("number-of-copies").value;
    const publicationDate = document.getElementById("pub_date").value;
    const location = +document.getElementById("location").value;
    const numberOfPages = +document.getElementById("number-of-pages").value;
    const dateAdded = document.getElementById("date-added").value;
    // You can log the values to the console or use them as needed
    if (!dateAdded || !publicationDate) {
      alert("please fill in all the fields!");
      return;
    }

    const bookData = {
      name_and_author,
      categories,
      copies_available: +numberOfCopies,
      total_copies: +numberOfCopies, // Convert number of copies to an integer
      publication_date: publicationDate,
      location: location,
      number_of_pages: +numberOfPages, // Convert to integer
      date_added: dateAdded,
    };
    try {
      // Send the book data to the server
      const response = await fetch("http://127.0.0.1:9000/add_book/", {
        method: "POST", // Specify the request method
        headers: {
          "Content-Type": "application/json", // Indicate that you're sending JSON
        },
        body: JSON.stringify(bookData), // Convert the JavaScript object to a JSON string
      });

      // Check if the response is okay (status in the range 200-299)
      console.log(response);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response if needed
      const result = await response.json();
      alert(JSON.stringify(result, null, 2)); // Converts the result object to a JSON string
    } catch (error) {
      console.error("Error adding book:", error);
    }
  });
};
// remove book button click
const removeBooks = async function () {
  mainSection.innerHTML = "";
  mainSection.classList.remove("grid-4-rows");
  if (window.innerWidth <= 822) {
    menu1.classList.add("hidden");
  }
  mainSection.insertAdjacentHTML(
    "beforeend",
    `<div class="remove-book">
    <h4 class="remove-book-title">
      Remove a book from the library, specify the book name and the author
    </h4>
    <form class="remove-book-form">
      <div>
        <label for="book-name-Id">Bookname</label>
        <input
          id="book-name-Id"
          type="text"
          placeholder="Harry Potter"
          required
        />
      </div>
      <div>
        <label for="author-Id">Author</label>
        <input
          id="author-Id"
          type="text"
          placeholder="j.k rolling"
          required
        />
      </div>

      <button class="remove-book-btn">Remove</button>
    </form>
  </div>`
  );
  const removeBookBtn = document.querySelector(".remove-book-btn");
  removeBookBtn.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Get values from the input fields
    const bookName = document.getElementById("book-name-Id").value;
    const author = document.getElementById("author-Id").value;
    const name_and_author = bookName + "##" + author;
    // You can log the values to the console or use them as needed
    console.log("Book Name:", bookName);
    console.log("Author:", author);
    try {
      // Send the book data to the server
      const response = await fetch(
        `http://127.0.0.1:9000/delete_book/${encodeURIComponent(
          name_and_author
        )}`,
        { method: "DELETE" }
      );

      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response if needed
      const result = await response.json();
      alert(JSON.stringify(result, null, 2)); // Converts the result object to a JSON string
    } catch (error) {
      console.error("Error removing book:", error);
    }
  });
};
// add/remove copies button click
const addRemoveCopies = async function () {
  mainSection.innerHTML = "";
  mainSection.classList.remove("grid-4-rows");
  if (window.innerWidth <= 822) {
    menu1.classList.add("hidden");
  }
  mainSection.insertAdjacentHTML(
    "beforeend",
    `<div class="add-remove-copies">
  <h4 class="add-remove-copies-title">
    Add / remove copies of the specified book
  </h4>
  <form class="add-remove-copies-form">
    <div>
      <label for="book-name-Id">Bookname</label>
      <input
        id="book-name-Id"
        type="text"
        placeholder="Harry Potter"
        required
      />
    </div>
    <div>
      <label for="author-Id">Author</label>
      <input
        id="author-Id"
        type="text"
        placeholder="j.k rolling"
        required
      />
    </div>
    <div>
      <label for="number-of-copies">Number of copies</label>
      <input id="number-of-copies" type="number" required />
    </div>
    <div>
      <label for="select-add-remove">Add / Remove copies</label>
      <select id="select-add-remove" required>
        <option value="">add / remove</option>
        <option value="add">add</option>
        <option value="remove">remove</option>
      </select>
    </div>

    <button class="add-remove-copies-btn">Apply</button>
  </form>
</div> `
  );
  const addRemoveCopiesBtn = document.querySelector(".add-remove-copies-btn");
  addRemoveCopiesBtn.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Get values from the input fields
    const bookName = document.getElementById("book-name-Id").value;
    const author = document.getElementById("author-Id").value;

    const name_and_author = bookName + "##" + author;

    const numberOfCopies = document.getElementById("number-of-copies").value;
    const selection = document.getElementById("select-add-remove").value;

    if (!selection) {
      alert("choose add or remove");
      return;
    }
    // You can log the values to the console or use them as needed
    console.log("Book Name:", bookName);
    console.log("Author:", author);
    console.log("Number of Copies:", numberOfCopies);
    console.log(selection);

    try {
      const response = await fetch(
        `http://127.0.0.1:9000/${selection}_copies/${encodeURIComponent(
          name_and_author
        )}/${parseInt(numberOfCopies)}`,
        {
          method: "PUT", // Specify the request method
          headers: {
            "Content-Type": "application/json", // Indicate that you're sending JSON
          },
        }
      );

      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response if needed
      const result = await response.json();
      alert(JSON.stringify(result, null, 2)); // Converts the result object to a JSON string
    } catch (error) {
      console.error("Error adding book:", error);
    }
  });
};
// add/remove categories button click
const addRemoveCategories = async function () {
  mainSection.innerHTML = "";
  mainSection.classList.remove("grid-4-rows");
  if (window.innerWidth <= 822) {
    menu1.classList.add("hidden");
  }
  mainSection.insertAdjacentHTML(
    "beforeend",
    `<div class="add-remove-categories">
  <h4 class="add-remove-categories-title">
    Add / remove category of the specified book
  </h4>
  <form class="add-remove-categories-form">
    <div>
      <label for="book-name-Id">Bookname</label>
      <input
        id="book-name-Id"
        type="text"
        placeholder="Harry Potter"
        required
      />
    </div>
    <div>
      <label for="author-Id">Author</label>
      <input
        id="author-Id"
        type="text"
        placeholder="j.k rolling"
        required
      />
    </div>
    <div>
      <label for="categories-Id">Categories</label>
      <input
        id="categories-Id"
        type="text"
        placeholder="thriller"
        required
      />
    </div>
    <div>
      <label for="select-add-remove">Add / Remove categories</label>
      <select id="select-add-remove" required>
        <option value="">Add / Remove</option>
        <option value="add">Add</option>
        <option value="remove">Remove</option>
      </select>
    </div>

    <button class="add-remove-categories-btn">Apply</button>
  </form>
</div>`
  );
  const addRemoveCategoriesBtn = document.querySelector(
    ".add-remove-categories-btn"
  );
  addRemoveCategoriesBtn.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Get values from the input fields
    const bookName = document.getElementById("book-name-Id").value;
    const author = document.getElementById("author-Id").value;

    const name_and_author = bookName + "##" + author;

    const category = document.getElementById("categories-Id").value;
    const selection = document.getElementById("select-add-remove").value;

    // You can log the values to the console or use them as needed
    console.log("Book Name:", bookName);
    console.log("Author:", author);
    console.log(category);
    console.log(selection);

    if (!selection) {
      alert("choose add or remove");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:9000/${selection}_category/${encodeURIComponent(
          name_and_author
        )}/${category}`,
        {
          method: "PUT", // Specify the request method
          headers: {
            "Content-Type": "application/json", // Indicate that you're sending JSON
          },
        }
      );

      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response if needed
      const result = await response.json();
      alert(JSON.stringify(result, null, 2)); // Converts the result object to a JSON string
    } catch (error) {
      console.error("Error adding book:", error);
    }
  });
};
// change book shelf button click
const changeBookShelf = async function () {
  mainSection.innerHTML = "";
  mainSection.classList.remove("grid-4-rows");
  if (window.innerWidth <= 822) {
    menu1.classList.add("hidden");
  }
  mainSection.insertAdjacentHTML(
    "beforeend",
    `<div class="change-shelf">
    <h4 class="change-shelf-title">Change a book's shelf number</h4>
  <form class="change-shelf-form">
    <div>
      <label for="book-name-Id">Bookname</label>
      <input
        id="book-name-Id"
        type="text"
        placeholder="Harry Potter"
        required
      />
    </div>
    <div>
      <label for="author-Id">Author</label>
      <input
        id="author-Id"
        type="text"
        placeholder="j.k rolling"
        required
      />
    </div>
    <div>
      <label for="shelf-number">shelf number: </label>
      <input id="shelf-number" type="number" required />
    </div>
    <button class="change-shelf-btn">Change</button>
  </form>
</div>`
  );
  const changeshelfBtn = document.querySelector(".change-shelf-btn");
  changeshelfBtn.addEventListener("click", async function (e) {
    try {
      e.preventDefault();
      const bookName = document.getElementById("book-name-Id").value;
      const author = document.getElementById("author-Id").value;
      const name_and_author = encodeURIComponent(bookName + "##" + author);
      const shelfNumber = document.getElementById("shelf-number").value;
      if (!shelfNumber) {
        alert("please fill in all the fields!");
        return;
      }
      console.log(shelfNumber);
      const res = await fetch(
        `http://127.0.0.1:9000/shelf_change/${name_and_author}/${shelfNumber}`,
        {
          method: "PUT", // Specify the request method
        }
      );
      const data = await res.json();
      alert(JSON.stringify(data, null, 2));
    } catch (err) {
      console.log(err);
      alert(`something went wrong ${err.message}`);
    }
  });
};
// load books when searching
const loadBooks = async function (e, searchBar) {
  if (window.innerWidth <= 822) {
    menu1.classList.add("hidden");
  }
  mainSection.innerHTML = "";
  let booksString = "";
  e.preventDefault();

  const userInput = searchBar.value.trim();

  if (userInput.length > 0) {
    try {
      // Fetch the search results
      const res = await fetch(
        `http://127.0.0.1:9000/trying_to_find/${userInput}`
      );

      // Check if the fetch was successful
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);

      // If the response is empty, show a message
      if (Object.keys(data).length === 0) {
        mainSection.innerHTML = `<p class="no-books-found-msg">No books or authors found.</p>`;
        return;
      }

      //highlighters
      let highBookSearch;
      let highAuthorSearch;
      let i = 0;

      // Loop through the results if there are any
      const dataList = Object.entries(data);
      mainSection.classList.add("grid-4-rows");
      dataList.forEach((book) => {
        const [bookname, author] = book[0].split("##");
        highBookSearch = bookname
          .split(userInput)
          .join(`<mark>${userInput}</mark>`);
        highAuthorSearch = author
          .split(userInput)
          .join(`<mark>${userInput}</mark>`);
        booksString += `<div data-bookdata="${i}" class="book">
          <img class="book-img" src="/imgs/default-book.jpg" alt="default book image" />
          <h3 class="bookname">${highBookSearch}</h3>
          <h4>Author: ${highAuthorSearch}</h4>
          <p>copies available: ${book[1].copies_available}</p>
          <p>total copies: ${book[1].total_copies}</p>
        </div>`;
        i += 1;
      });

      mainSection.insertAdjacentHTML("beforeend", booksString);

      // Event listener for book click
      const clickBooks = document.querySelectorAll(".book");
      clickBooks.forEach((book) =>
        book.addEventListener("click", function () {
          mainSection.innerHTML = "";
          mainSection.classList.remove("grid-4-rows");
          const extendedBookData = dataList[book.dataset.bookdata];
          console.log(extendedBookData);
          const [exBookname, exAuthor] = extendedBookData[0].split("##");

          mainSection.insertAdjacentHTML(
            "beforeend",
            `<div class="extended-book-data">
              <div class="ex-bookname">"${exBookname}"</div>
              <div class="ex-author">Author: ${exAuthor}</div>
              <div class="ex-copies-available">Copies available: ${extendedBookData[1].copies_available}</div>
              <div class="ex-total-copies">Total copies: ${extendedBookData[1].total_copies}</div>
              <div class="ex-publication_date">Publication date: ${extendedBookData[1].publication_date}</div>
              <div class="ex-located">Located: ${extendedBookData[1].location}</div>
              <div class="ex-number-of-pages">Number of pages: ${extendedBookData[1].number_of_pages}</div>
              <div class="ex-date-added">Date added: ${extendedBookData[1].date_added}</div>
              <div class="ex-categories">Categories: ${extendedBookData[1].categories}</div>
              <button class="ex-rent-btn">Rent</button>`
          );

          //rent button
          const exRentBtn = document.querySelector(".ex-rent-btn");
          exRentBtn.addEventListener("click", function () {
            mainSection.innerHTML = "";
            mainSection.insertAdjacentHTML(
              "beforeend",
              `<div class="rent-book">
                <h4 class="rent-book-title">rent the book <highlight>${exBookname}</highlight> by <highlight>${exAuthor}</highlight> for a person</h4>
                <form class="rent-book-form">
                  <div>
                    <label for="person-name">Person name:</label>
                    <input id="person-name" type="text" placeholder="Ohad shushan" required />
                  </div>
                  <div>
                    <label for="id-number">ID: </label>
                    <input id="id-number" type="number" required />
                  </div>
                  <div>
                    <label for="phone-number">Phone number:</label>
                    <input id="phone-number" type="number" required />
                  </div>
                  <button class="Rent-book-btn">Rent</button>
                </form>
              </div>`
            );

            const finalRent = document.querySelector(".Rent-book-btn");
            finalRent.addEventListener("click", async function (event) {
              event.preventDefault(); // Prevent the form from submitting and refreshing the page

              const name_and_author = exBookname + "##" + exAuthor;
              const PersonName = document.getElementById("person-name").value;
              const IdNumber = document.getElementById("id-number").value;
              const phoneNumber = document.getElementById("phone-number").value;

              try {
                if (PersonName === "" || !IdNumber || !phoneNumber) {
                  alert("fill in all fields!");
                  return;
                }

                const response = await fetch(
                  `http://127.0.0.1:9000/rent/${encodeURIComponent(
                    name_and_author
                  )}/${PersonName}/${IdNumber}/${phoneNumber}`,
                  { method: "POST" }
                );

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                alert(JSON.stringify(result, null, 2)); // Converts the result object to a JSON string
              } catch (error) {
                console.error("Error renting book:", error);
              }
            });
          });
        })
      );
    } catch (error) {
      console.error("Error loading books:", error);
      mainSection.innerHTML = `<p class="error-msg">An error occurred while loading books. Please try again later.</p>`;
    }
  } else {
    mainSection.classList.remove("grid-4-rows");
    mainSection.innerHTML = `<p class="info">
      Choose to search a book / rent by toggling the button with the
      <ion-icon class="search-icon" name="search-outline"></ion-icon> emoji above
    </p>`;
  }
};

//functions rents
// all rents button click
const allRents = async function () {
  try {
    let booksString = "";
    mainSection.innerHTML = "";
    mainSection.classList.add("grid-4-rows");
    if (window.innerWidth <= 822) {
      menu2.classList.add("hidden");
    }

    let i = 0;
    const res = await fetch("http://127.0.0.1:9000/rents");
    const data = await res.json();
    console.log(data);
    const dataList = Object.entries(data);
    console.log(dataList);

    dataList.forEach((rentP) => {
      const [name, Id, phone] = rentP[0].split("##");
      booksString += `<div data-spec="${i}" class="rent-person">
    <img
      class="person-img"
      src="/imgs/default-profile.jpg"
      alt="default person image"
    />
    <h3 class="person"> ${name}:</h3>
    <h4 class="ID">ID: ${Id}</h4>
    <p>phone: ${phone}</p>
    <p>books rented: ${Object.keys(rentP[1]).length}</p>
    </div>`;
      i += 1;
    });
    mainSection.insertAdjacentHTML("beforeend", booksString);

    const clickPersons = document.querySelectorAll(".rent-person");
    clickPersons.forEach((person) =>
      person.addEventListener("click", function () {
        mainSection.innerHTML = "";
        mainSection.classList.remove("grid-4-rows");

        const personI = person.dataset.spec;
        const parsePerson = Object.entries(dataList[personI][1]);

        const [name, Id, phone] = dataList[personI][0].split("##");
        mainSection.insertAdjacentHTML(
          "beforeend",
          `
          <div class="ex-title">books rented:</div>
          <div class="extended-person">
          
        <img
          class="ex-person-img"
          src="/imgs/default-profile.jpg"
          alt="default person image"
        />
        <div class="person-details">
          <h3 class="ex-name">${name}</h3>
          <p class="ex-id">ID: ${Id}</p>
          <p class="ex-phone">phone: ${phone}</p>
        </div>
      </div>
      `
        );
        let stringBooks = "";
        let j = 0;
        let dayCount;
        let timePass;
        parsePerson.forEach((book) => {
          const [bookname, author] = book[0].split("##");
          dayCount = Math.floor(
            (Math.floor(Date.now() / 1000) - new Date(book[1])) / (60 * 60 * 24)
          );
          console.log(dayCount);
          if (dayCount >= 28) {
            timePass = `<timePassed>${dayCount} days</timePassed>`;
          } else {
            timePass = `${dayCount} days`;
          }
          stringBooks += `
            <div class="book dont-translate">
              <img
                class="book-img"
                src="/imgs/default-book.jpg"
                alt="default book image"
              />
              <h3 class="bookname">${bookname}</h3>
              <p> rent time: ${timePass}</p>
              <button data-btnI="${j}" class="return-book-btns">return</button>
            </div>
          `;
          j += 1;
        });
        mainSection.insertAdjacentHTML(
          "beforeend",
          `<div class="lower-container grid-4-rows">${stringBooks} </div>`
        );
        const lowerContainer = document.querySelector(".lower-container");
        const returnImmediately =
          document.querySelectorAll(".return-book-btns");
        returnImmediately.forEach((btn) => {
          btn.addEventListener("click", async function () {
            const whichBtn = btn.dataset.btni;
            const response = await fetch(
              `http://127.0.0.1:9000/return_rent/${encodeURIComponent(
                parsePerson[whichBtn][0]
              )}/${name}/${Id}/${phone}`,
              {
                method: "POST", // Specify the request method
              }
            );
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const mainSection = document.querySelector(".container");
            lowerContainer.classList.remove("grid-4-rows");
            mainSection.innerHTML = "";
            // Parse the response if needed
            const result = await response.json();
            alert(JSON.stringify(result, null, 2)); // Converts the result object to a JSON string
          });
        });
      })
    );
  } catch (err) {
    console.log(err);
    alert(`something went wrong ${err.message}`);
  }
};
// rent book button click
const rentBook = async function () {
  mainSection.innerHTML = "";
  mainSection.classList.remove("grid-4-rows");
  if (window.innerWidth <= 822) {
    menu2.classList.add("hidden");
  }
  mainSection.insertAdjacentHTML(
    "beforeend",
    `<div class="rent-book">
    <h4 class="rent-book-title">rent a book for a person</h4>
    <form class="rent-book-form">
      <div>
        <label for="book-name-Id">Bookname</label>
        <input
          id="book-name-Id"
          type="text"
          placeholder="Harry Potter"
          required
        />
      </div>
      <div>
        <label for="author-Id">Author</label>
        <input
          id="author-Id"
          type="text"
          placeholder="j.k rolling"
          required
        />
      </div>
      <div>
        <label for="person-name">Person name:</label>
        <input
          id="person-name"
          type="text"
          placeholder="Ohad shushan"
          required
        />
      </div>
      <div>
        <label for="id-number">ID: </label>
        <input id="id-number" type="number" required />
      </div>
      <div>
        <label for="phone-number">Phone number:</label>
        <input id="phone-number" type="number" required />
      </div>

      <button class="Rent-book-btn">Rent</button>
    </form>
  </div> `
  );
  const rentBookBtn = document.querySelector(".Rent-book-btn");
  rentBookBtn.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Get values from the input fields
    const bookName = document.getElementById("book-name-Id").value;
    const author = document.getElementById("author-Id").value;
    const name_and_author = bookName + "##" + author;

    const PersonName = document.getElementById("person-name").value;
    const IdNumber = document.getElementById("id-number").value;
    const phoneNumber = document.getElementById("phone-number").value;

    try {
      // Send the book data to the server
      if (PersonName === "" || !IdNumber || !phoneNumber) {
        alert("fill in all fields!");
        return;
      }
      const response = await fetch(
        `http://127.0.0.1:9000/rent/${encodeURIComponent(
          name_and_author
        )}/${PersonName}/${IdNumber}/${phoneNumber}`,
        {
          method: "POST", // Specify the request method
        }
      );

      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response if needed
      const result = await response.json();
      alert(JSON.stringify(result, null, 2)); // Converts the result object to a JSON string
    } catch (error) {
      console.error("Error renting book:", error);
    }
  });
};
// return rent button click
const returnRentedBook = async function () {
  mainSection.innerHTML = "";
  mainSection.classList.remove("grid-4-rows");
  if (window.innerWidth <= 822) {
    menu2.classList.add("hidden");
  }
  mainSection.insertAdjacentHTML(
    "beforeend",
    `<div class="rent-book">
    <h4 class="rent-book-title">return a rented book from a person</h4>
    <form class="rent-book-form">
      <div>
        <label for="book-name-Id">Bookname</label>
        <input
          id="book-name-Id"
          type="text"
          placeholder="Harry Potter"
          required
        />
      </div>
      <div>
        <label for="author-Id">Author</label>
        <input
          id="author-Id"
          type="text"
          placeholder="j.k rolling"
          required
        />
      </div>
      <div>
        <label for="person-name">Person name:</label>
        <input
          id="person-name"
          type="text"
          placeholder="Ohad shushan"
          required
        />
      </div>
      <div>
        <label for="id-number">ID: </label>
        <input id="id-number" type="number" required />
      </div>
      <div>
        <label for="phone-number">Phone number:</label>
        <input id="phone-number" type="number" required />
      </div>

      <button class="Rent-book-btn">Return rent</button>
    </form>
  </div> `
  );
  const returnRentBookBtn = document.querySelector(".Rent-book-btn");
  returnRentBookBtn.addEventListener("click", async function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Get values from the input fields
    const bookName = document.getElementById("book-name-Id").value;
    const author = document.getElementById("author-Id").value;
    const name_and_author = bookName + "##" + author;

    const PersonName = document.getElementById("person-name").value;
    const IdNumber = document.getElementById("id-number").value;
    const phoneNumber = document.getElementById("phone-number").value;

    try {
      // Send the book data to the server
      if (PersonName === "" || !IdNumber || !phoneNumber) {
        alert("fill in all fields!");
        return;
      }
      const response = await fetch(
        `http://127.0.0.1:9000/return_rent/${encodeURIComponent(
          name_and_author
        )}/${PersonName}/${IdNumber}/${phoneNumber}`,
        {
          method: "POST", // Specify the request method
        }
      );

      // Check if the response is okay (status in the range 200-299)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Parse the response if needed
      const result = await response.json();
      alert(JSON.stringify(result, null, 2)); // Converts the result object to a JSON string
    } catch (error) {
      console.error("Error renting book:", error);
    }
  });
};
// who should return button click
const whoShouldReturn = async function () {
  try {
    let personString = "";
    mainSection.innerHTML = "";
    mainSection.classList.add("grid-4-rows");
    if (window.innerWidth <= 822) {
      menu2.classList.add("hidden");
    }

    let i = 0;
    const res = await fetch("http://127.0.0.1:9000/who_should_return");
    const data = await res.json();
    console.log(data);
    const dataList = Object.entries(data);

    dataList.forEach((rentP) => {
      const [name, Id, phone] = rentP[0].split("##");
      personString += `<div data-spec="${i}" class="rent-person">
    <img
      class="person-img"
      src="/imgs/default-profile.jpg"
      alt="default person image"
    />
    <h3 class="person"> ${name}:</h3>
    <h4 class="ID">ID: ${Id}</h4>
    <p>phone: ${phone}</p>
    <p class="should-return-p">should return: ${
      Object.keys(rentP[1]).length
    } books</p>
  </div>`;
      i += 1;
    });
    mainSection.insertAdjacentHTML("beforeend", personString);

    const clickPersons = document.querySelectorAll(".rent-person");
    clickPersons.forEach((person) =>
      person.addEventListener("click", function () {
        mainSection.innerHTML = "";
        mainSection.classList.remove("grid-4-rows");
        const personI = person.dataset.spec;
        console.log(dataList[personI]);
        let stringBooks = "";
        let j = 0;
        const [name, Id, phone] = dataList[personI][0].split("##");
        mainSection.insertAdjacentHTML(
          "afterbegin",
          `<div class="ex-title-limit-rent">these books surpassed the <timePassed>4 weeks</timePassed> rental limit:</div>`
        );
        mainSection.insertAdjacentHTML(
          "beforeend",
          `<div class="extended-person">
        <img
          class="ex-person-img"
          src="/imgs/default-profile.jpg"
          alt="default person image"
        />
        <div class="person-details">
          <h3 class="ex-name">${name}</h3>
          <p class="ex-id">ID: ${Id}</p>
          <p class="ex-phone">phone: ${phone}</p>
        </div>
      </div>`
        );
        dataList[personI][1].forEach((book) => {
          const [bookname, author] = book.split("##");
          stringBooks += `
            <div class="book dont-translate">
              <img
                class="book-img"
                src="/imgs/default-book.jpg"
                alt="default book image"
              />
              <h3 class="bookname">${bookname}</h3>
              <p> author: ${author}</p>
              <button data-btnI="${j}" class="return-book-btns">return</button>
            </div>
          `;
          j += 1;
        });
        mainSection.insertAdjacentHTML(
          "beforeend",
          `<div class="lower-container grid-4-rows">${stringBooks} </div>`
        );
        const lowerContainer = document.querySelector(".lower-container");
        const returnImmediately =
          document.querySelectorAll(".return-book-btns");
        returnImmediately.forEach((btn) => {
          btn.addEventListener("click", async function () {
            const whichBtn = btn.dataset.btni;
            const response = await fetch(
              `http://127.0.0.1:9000/return_rent/${encodeURIComponent(
                dataList[personI][1][whichBtn]
              )}/${name}/${Id}/${phone}`,
              {
                method: "POST", // Specify the request method
              }
            );

            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            const mainSection = document.querySelector(".container");
            lowerContainer.classList.remove("grid-4-rows");
            mainSection.innerHTML = "";
            // Parse the response if needed
            const result = await response.json();
            alert(JSON.stringify(result, null, 2)); // Converts the result object to a JSON string
          });
        });
      })
    );
  } catch (err) {
    console.log(err);
    alert(`something went wrong ${err.message}`);
  }
};
// load rents when searching
const loadRents = async function (e, searchBar) {
  mainSection.innerHTML = "";
  if (window.innerWidth <= 822) {
    menu2.classList.add("hidden");
  }
  let rentString = "";
  e.preventDefault();

  const userInput = searchBar.value.trim();
  if (userInput.length > 0) {
    try {
      const res = await fetch(
        `http://127.0.0.1:9000/trying_to_find_rent/${userInput}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log(data);

      // If the response is empty, show a message
      if (Object.keys(data).length === 0) {
        mainSection.innerHTML = `<p class="no-rents-found-msg">No rents found.</p>`;
        return;
      }

      //highlighters
      let highPersonSearch;
      let highIdSearch;
      let highPhoneSearch;
      let i = 0;

      // Loop through the results if there are any
      const dataList = Object.entries(data);
      mainSection.classList.add("grid-4-rows");
      dataList.forEach((rent) => {
        const [name, id, phone] = rent[0].split("##");
        highPersonSearch = name
          .split(userInput)
          .join(`<mark>${userInput}</mark>`);
        highIdSearch = id.split(userInput).join(`<mark>${userInput}</mark>`);
        highPhoneSearch = phone
          .split(userInput)
          .join(`<mark>${userInput}</mark>`);
        rentString += `<div data-spec="${i}" class="rent-person">
        <img
          class="person-img"
          src="/imgs/default-profile.jpg"
          alt="default person image"
        />
        <h3 class="person"> ${highPersonSearch}:</h3>
        <h4 class="ID">ID: ${highIdSearch}</h4>
        <p>phone: ${highPhoneSearch}</p>
        <p>books rented: ${Object.keys(rent[1]).length}</p>
        </div>`;
        i += 1;
      });

      mainSection.insertAdjacentHTML("beforeend", rentString);
      const clickPersons = document.querySelectorAll(".rent-person");
      clickPersons.forEach((person) =>
        person.addEventListener("click", function () {
          mainSection.innerHTML = "";
          mainSection.classList.remove("grid-4-rows");

          const personI = person.dataset.spec;
          const parsePerson = Object.entries(dataList[personI][1]);

          const [name, Id, phone] = dataList[personI][0].split("##");
          mainSection.insertAdjacentHTML(
            "beforeend",
            `<div class="extended-person">
          <img
            class="ex-person-img"
            src="/imgs/default-profile.jpg"
            alt="default person image"
          />
          <div class="person-details">
            <h3 class="ex-name">${name}</h3>
            <p class="ex-id">ID: ${Id}</p>
            <p class="ex-phone">phone: ${phone}</p>
          </div>
        </div>`
          );

          let stringBooks = "";
          let j = 0;
          let dayCount;
          let timePass;

          parsePerson.forEach((book) => {
            const [bookname, author] = book[0].split("##");
            dayCount = Math.floor(
              (Math.floor(Date.now() / 1000) - new Date(book[1])) /
                (60 * 60 * 24)
            );
            console.log(dayCount);
            if (dayCount >= 28) {
              timePass = `<timePassed>${dayCount} days</timePassed>`;
            } else {
              timePass = `${dayCount} days`;
            }
            stringBooks += `
              <div class="book dont-translate">
                <img
                  class="book-img"
                  src="/imgs/default-book.jpg"
                  alt="default book image"
                />
                <h3 class="bookname">${bookname}</h3>
                <p> rented time: ${timePass}</p>
                <button data-btnI="${j}" class="return-book-btns">return</button>
              </div>
            `;
            j += 1;
          });

          mainSection.insertAdjacentHTML(
            "beforeend",
            `<div class="lower-container grid-4-rows">${stringBooks} </div>`
          );
          const lowerContainer = document.querySelector(".lower-container");
          const returnImmediately =
            document.querySelectorAll(".return-book-btns");

          returnImmediately.forEach((btn) => {
            btn.addEventListener("click", async function () {
              const whichBtn = btn.dataset.btni;
              try {
                const response = await fetch(
                  `http://127.0.0.1:9000/return_rent/${encodeURIComponent(
                    parsePerson[whichBtn][0]
                  )}/${name}/${Id}/${phone}`,
                  {
                    method: "POST", // Specify the request method
                  }
                );

                if (!response.ok) {
                  throw new Error(`HTTP error! status: ${response.status}`);
                }

                const mainSection = document.querySelector(".container");
                lowerContainer.classList.remove("grid-4-rows");
                mainSection.innerHTML = "";

                // Parse the response if needed
                const result = await response.json();
                alert(JSON.stringify(result, null, 2)); // Converts the result object to a JSON string
              } catch (error) {
                console.error("Error returning book:", error);
              }
            });
          });
        })
      );
    } catch (error) {
      console.error("Error loading rents:", error);
    }
  } else {
    mainSection.classList.remove("grid-4-rows");
    mainSection.innerHTML = `<p class="info">
      Choose to search a book / rent by toggling the button with the
      <ion-icon class="search-icon" name="search-outline"></ion-icon> emoji above
    </p>`;
  }
};

//events books
homeScreenBtn.addEventListener("click", function () {
  mainSection.innerHTML = `<p class="info">
  Choose to search a book / rent by toggling the button with the
  <ion-icon class="search-icon" name="search-outline"></ion-icon> emoji above
</p>`;
  serchBarBox.innerHTML = "";
  mainSection.classList.remove("grid-4-rows");
  serchBarBox.insertAdjacentHTML(
    "beforeend",
    `<form class="search-bar-form">
    <label for="search-bar">
      <input
        id="search-bar"
        type="text"
        placeholder="Search for books by their name / Author "
        required
      />
    </label>
  </form>
  <form class="toggle-book-person">
    <ion-icon name="search-outline"></ion-icon>
    <label for="select-book-person"></label>
    <select id="select-book-person">
      <option value="books">Books</option>
      <option value="rents">rents</option>
    </select>
  </form>`
  );
  const searchBar = document.querySelector("#search-bar");
  const bookOrRent = document.getElementById("select-book-person");
  bookOrRent.addEventListener("click", function (e) {
    if (bookOrRent.value === "books")
      searchBar.placeholder = "Search for books by their name / Author";
    else searchBar.placeholder = "Search for rents by their name / id / phone";
  });
  searchBar.addEventListener("keyup", async function (event) {
    try {
      const bookOrRent = document.getElementById("select-book-person").value;
      if (bookOrRent === "books") {
        loadBooks(event, searchBar);
      } else loadRents(event, searchBar);
    } catch (err) {
      console.error("Error:", err);
      mainSection.innerHTML = `<p>Something went wrong: ${err.message}</p>`;
    }
  });
});

allBooksBtn.addEventListener("click", allBooks);
addBooksBtn.addEventListener("click", addBooks);
removeBooksBtn.addEventListener("click", removeBooks);
addRemoveCopiesBtn.addEventListener("click", addRemoveCopies);
addRemovebookCategoryBtn.addEventListener("click", addRemoveCategories);
changeLocation.addEventListener("click", changeBookShelf);

//events rents
allRentsBtn.addEventListener("click", allRents);
rentBooksBtn.addEventListener("click", rentBook);
returnRentBooksBtn.addEventListener("click", returnRentedBook);
timeIsUp.addEventListener("click", whoShouldReturn);

//events searchbar

bookOrRent.addEventListener("click", function (e) {
  if (bookOrRent.value === "books")
    searchBar.placeholder = "Search for books by their name / Author";
  else searchBar.placeholder = "Search for rents by their name / id / phone";
});
searchBar.addEventListener("keyup", async function (event) {
  try {
    const bookOrRent = document.getElementById("select-book-person").value;
    if (bookOrRent === "books") {
      loadBooks(event, searchBar);
    } else loadRents(event, searchBar);
  } catch (err) {
    console.error("Error:", err);
    mainSection.innerHTML = `<p>Something went wrong: ${err.message}</p>`;
  }
});
const newFeature = function () {
  console.log("welcome,this is a test,3");
};
newFeature();

//new query with menu button
const booksOptionsBtn = document.querySelector(".options-btn-books");
const rentsOptionsBtn = document.querySelector(".options-btn-rents");
const btnclose1 = document.querySelector(".btn-close1");
const btnclose2 = document.querySelector(".btn-close2");
const menu1 = document.querySelector(".menu1");
const menu2 = document.querySelector(".menu2");
const navWelcomeText = document.querySelector(".nav-welcome");

// change the UI when smaller query
function changeMenuElement() {
  if (window.innerWidth <= 822) {
    if (menu1) {
      menu1.classList.add("hidden");
    }
    if (menu2) {
      menu2.classList.add("hidden");
    }
    navWelcomeText.textContent = "Welcome!";
  }
}
window.addEventListener("load", changeMenuElement);
window.addEventListener("resize", changeMenuElement);

// add the options buttons when smaller query
function addOptionsBtn() {
  if (window.innerWidth <= 822) {
    if (booksOptionsBtn) booksOptionsBtn.classList.remove("hidden");
    if (rentsOptionsBtn) rentsOptionsBtn.classList.remove("hidden");
  }
}

// Run the function when the page loads and when it resizes
window.addEventListener("load", addOptionsBtn);
window.addEventListener("resize", addOptionsBtn);

//open menus
booksOptionsBtn.addEventListener("click", function () {
  menu1.classList.remove("hidden");
});
rentsOptionsBtn.addEventListener("click", function () {
  menu2.classList.remove("hidden");
});
//close menus
btnclose1.addEventListener("click", function () {
  menu1.classList.add("hidden");
});
btnclose2.addEventListener("click", function () {
  menu2.classList.add("hidden");
});
