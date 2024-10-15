from fastapi import FastAPI,HTTPException
from pydantic import BaseModel
from typing import List
import json
import time
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(  # allow cors like delete put etc from frontend
    CORSMiddleware,
    allow_origins=["*"],  # all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


all_categories = [
    "action","mystery", "thriller","fiction", "science fiction", "romance", "fantasy",
    "historical fiction", "non-fiction", "biography", "autobiography", "self-help",
    "business", "children's", "young adult", "graphic novel", "horror", "dystopian",
    "cyberpunk", "detective", "true crime", "humor", "adventure", "paranormal",
    "supernatural", "mythology", "folklore", "cultural", "religious", "spiritual",
    "inspirational", "educational", "history", "poetry", "drama", "comedy", "science",
    "mathematics", "philosophy", "travel", "cooking", "sports", "fitness", "health",
    "medical", "science journalism", "technology", "computer science", "programming",
    "artificial intelligence", "robotics", "environmental", "nature", "gardening",
    "pets", "crafts", "diy", "fashion", "beauty", "parenting", "family",
    "relationships", "marriage", "divorce", "lgbtq+", "women's studies",
    "men's studies", "gender studies", "sociology", "anthropology",
    "cultural studies", "political science", "current affairs",
    "international relations", "military", "law", "true adventure",
    "space exploration", "astronomy", "astrology", "science history",
    "mathematics history", "historical biography", "literary criticism",
    "film", "theater", "architecture", "art history", "photography",
    "design", "gaming", "board games", "chess", "card games", "puzzles",
    "hobbies", "art", "music", "inspirational", "religion", "cultural studies",
    "personal development"
]  # a list of categories of books, including 100 different categories
users = []


class Book(BaseModel):  # the model of a book in the library
    name_and_author: str
    categories: List[str]
    copies_available: int
    total_copies: int
    publication_date: str
    location: int
    number_of_pages: int
    date_added: str






def open_books():  # open the json files
    with open("books.json") as f:
        data = json.load(f)
    return data


def open_book_rents():  # open the json files
    with open("book_rents.json") as f:
        data = json.load(f)
    return data


def dump_to_books(stuff):  # dump data to the json files
    with open('books.json', 'w') as file:
        json.dump(stuff, file, indent=2)


def dump_to_book_rents(stuff):  # dump data to the json files
    with open('book_rents.json', 'w') as file:
        json.dump(stuff, file, indent=2)



@app.get('/books')  # returns the list of the books in the library
async def get_info():
    data = open_books()
    return data


@app.get("/trying_to_find/{value}")  # search for a book / author or a part of it
async def trying_to_find(value):
    value = value.lower()
    books_data = open_books()
    optional_results = {}

    for name_and_author, data in books_data.items():
        if value in name_and_author:
            optional_results[name_and_author] = data

    # If no results are found, return an empty dictionary
    if len(optional_results) == 0:
        return {}

    # Return the matching results
    return optional_results

@app.get("/trying_to_find_rent/{value}")  # search for a rent / ID / Phone or a part of it
async def trying_to_find(value):
    value = value.lower()
    optional_results = {}
    rent_data = open_book_rents()

    for identity, data in rent_data.items():
        if value in identity:
            optional_results[identity] = data

    # If no results are found, return an empty dictionary
    if len(optional_results) == 0:
        return {}

    # Return the matching results
    return optional_results


@app.post("/add_book/")  # adds a book to the library
async def add_book(book: Book):
    try:
        # Convert book name, author, and categories to lowercase so everything in the project will be lowercase thus easier to work with
        name_and_author = book.name_and_author.lower()
        parts = name_and_author.split('##')
        book_name = parts[0]
        author = parts[1]


        categories = [cat.lower() for cat in book.categories]

        book.name_and_author = name_and_author
        book.categories = categories
        if book_name == "" or author == "":
            raise HTTPException(status_code=400, detail="Book name / Author can't be nothing")

        if not all(char.isalpha() or char.isdigit() or char == '.' or char == "'" or char == '#' or char.isspace() for char in name_and_author):  # makes sure the author is a valid name
            raise HTTPException(status_code=400, detail="Book name / Author must be a string containing only letters or periods for abbreviations")

        if len(categories) == 0:  # checks if book has no categories
            raise HTTPException(status_code=400, detail="Add the categories of the book!")

        if book.location <= 0:
            raise HTTPException(status_code=400, detail="Shelf number must be larger than 0!")
        else:
            book.location = "shelf " + str(book.location)
        if book.copies_available <= 0:
            raise HTTPException(status_code=400, detail="Copies must be larger than 0!")
        if book.number_of_pages <= 0:
            raise HTTPException(status_code=400, detail="number of pages must be larger than 0!")

        #  checks if there are any invalid categories (from the 'all_categories' list)
        lowercase_categories = [i for i in categories if i not in all_categories]
        if len(lowercase_categories) != 0:
            raise HTTPException(status_code=400, detail=f"The following categories are not valid categories {lowercase_categories}")

        books_data = open_books()
        #  if there is no book with this name create a new key:value --> book_name:[book details]
        if name_and_author not in books_data:
            del book.name_and_author
            books_data[name_and_author] = book.model_dump()

        else:
            raise HTTPException(status_code=400,detail="You tried to add a book that the library already has!")

        dump_to_books(books_data)
        return {"Book added successfully"}

    except HTTPException as e:
        return e

@app.delete("/delete_book/{name_and_author}")  # deletion of a book
async def delete_book(name_and_author):
    books_data = open_books()

    name_and_author = name_and_author.lower()  # Converts book name and author to lowercase so everything in the project will be lowercase thus easier to work with
    parts = name_and_author.split('##')
    book_name = parts[0]
    author = parts[1]
    try:
        if book_name == "" or author == "":
            raise HTTPException(status_code=400, detail="Book name / Author can't be nothing")
        if name_and_author not in books_data:
            raise HTTPException(status_code=400, detail=f"{book_name} by {author} is not a book in the library")
        else:
            del books_data[name_and_author]
            dump_to_books(books_data)
            return {"Book removed successfully"}

    except HTTPException as e:
        return e

@app.put("/add_copies/{name_and_author}/{number_of_copies}")  # adds new copies of the book
async def add_copy(name_and_author,number_of_copies):

    name_and_author = name_and_author.lower()

    parts = name_and_author.split('##')
    book_name = parts[0]
    author = parts[1]

    books_data = open_books()
    try:
        if book_name == "" or author == "":
            raise HTTPException(status_code=400, detail="Book name / Author can't be nothing")

        if name_and_author not in books_data:
            raise HTTPException(status_code=400, detail=f"{book_name} by {author} is not a book in the library")

        if int(number_of_copies) <= 0:  # checks if the value is not 0
            raise HTTPException(status_code=400, detail="the number of copies must be larger than 0")

        # adds copies to the book
        books_data[name_and_author]["copies_available"] += int(number_of_copies)
        books_data[name_and_author]["total_copies"] += int(number_of_copies)
        dump_to_books(books_data)
        return {f"{number_of_copies} copies of the book {book_name} by {author} were added successfully"}
    except HTTPException as e:
        return e


@app.put("/remove_copies/{name_and_author}/{number_of_copies}")  # remove number of copies of the book
async def delete_copy(name_and_author,number_of_copies):

    name_and_author = name_and_author.lower()

    parts = name_and_author.split('##')
    book_name = parts[0]
    author = parts[1]



    books_data = open_books()
    try:
        if book_name == "" or author == "":
            raise HTTPException(status_code=400, detail="Book name / Author can't be nothing")

        if name_and_author not in books_data:
            raise HTTPException(status_code=400, detail=f"{book_name} by {author} is not a book in the library")

        if int(number_of_copies) <= 0:  # checks if the value is not 0
            raise HTTPException(status_code=400, detail="the number of copies must be larger than 0")

        if int(number_of_copies) > books_data[name_and_author]["total_copies"]:
            raise HTTPException(status_code=400, detail="you are trying to remove more copies of the book than the library has!")

        if int(number_of_copies) > books_data[name_and_author]["copies_available"]:
            cps_av=books_data[name_and_author]["copies_available"]
            ttl_cps = books_data[name_and_author]["total_copies"]
            raise HTTPException(status_code=400, detail=f"{ttl_cps-cps_av} people have not returned their book you are looking to remove copies from, can't delete all the books unless everyone returns their books")

        # adds copies to the book
        books_data[name_and_author]["copies_available"] -= int(number_of_copies)
        books_data[name_and_author]["total_copies"] -= int(number_of_copies)
        if books_data[name_and_author]["total_copies"] == 0:
            del books_data[name_and_author]
        dump_to_books(books_data)
        return {f"{number_of_copies} copies of the book {book_name} by {author} were removed successfully"}
    except HTTPException as e:
        return e


@app.put("/add_category/{name_and_author}/{key}")  # adds a category to a book
async def add_category(name_and_author,key):
    key = key.lower()
    name_and_author = name_and_author.lower()

    parts = name_and_author.split('##')
    book_name = parts[0]
    author = parts[1]

    books_data = open_books()
    try:
        if book_name == "" or author == "":
            raise HTTPException(status_code=400, detail="Book name / Author can't be nothing")

        if name_and_author not in books_data:
            raise HTTPException(status_code=400, detail=f"{book_name} by {author} is not a book in the library")

        if key in books_data[name_and_author]["categories"]:  # checks if the category is already in the book's category list
            raise HTTPException(status_code=400, detail=f"the category {key} is already one of the categories of the book {book_name} by {author}")

        if key in all_categories:
            books_data[name_and_author]["categories"].append(key)  # adds the category
            dump_to_books(books_data)
            return {f"the category {key} was added successfully to the book {book_name} by {author}"}
        else:
            raise HTTPException(status_code=400,detail=f"the category {key} is not a valid category")

    except HTTPException as e:
        return e


@app.put("/remove_category/{name_and_author}/{key}")  # delete a category from the book
async def delete_category(name_and_author,key):
    key = key.lower()
    name_and_author = name_and_author.lower()

    parts = name_and_author.split('##')
    book_name = parts[0]
    author = parts[1]

    books_data = open_books()
    try:
        if book_name == "" or author == "":
            raise HTTPException(status_code=400, detail="Book name / Author can't be nothing")

        if name_and_author not in books_data:
            raise HTTPException(status_code=400, detail=f"{book_name} by {author} is not a book in the library")

        if key not in books_data[name_and_author]["categories"]:
            raise HTTPException(status_code=400,detail=f"the category {key} is not one of the book's categories")
        else:
            books_data[name_and_author]["categories"].remove(key)  # adds the category
            dump_to_books(books_data)
            return {f"the category {key} was removed successfully from the book {book_name} by {author}"}

    except HTTPException as e:
        return e

@app.put("/shelf_change/{name_and_author}/{shelf_number}")  # remove number of copies of the book
async def shelf_change(name_and_author,shelf_number):

    name_and_author = name_and_author.lower()

    parts = name_and_author.split('##')
    book_name = parts[0]
    author = parts[1]



    books_data = open_books()
    try:
        if book_name == "" or author == "":
            raise HTTPException(status_code=400, detail="Book name / Author can't be nothing")

        if name_and_author not in books_data:
            raise HTTPException(status_code=400, detail=f"{book_name} by {author} is not a book in the library")

        if int(shelf_number) <= 0:  # checks if the value is not 0
            raise HTTPException(status_code=400, detail="the shelf number must be larger than 0")
        else:
            shelf_number = "shelf " + str(shelf_number)


        books_data[name_and_author]["location"] = shelf_number
        dump_to_books(books_data)
        return f"shelf number has been updated to {shelf_number[5:]}"

    except HTTPException as e:
        return e

@app.get('/rents')
async def get_rents():
    data = open_book_rents()
    return data

@app.post("/rent/{name_and_author}/{person}/{id}/{phone_number}")  # rent a book
async def rent(name_and_author,person,id,phone_number):
    name_and_author = name_and_author.lower()

    parts = name_and_author.split('##')
    book_name = parts[0]
    author = parts[1]

    person=person.lower()

    print(int(id),int(phone_number))

    print(id,phone_number)

    identity = person+"##"+id+"##"+phone_number  # makes a full identity variable

    books_data = open_books()
    rent_data = open_book_rents()

    if identity not in rent_data:  # creates a new person's dictionary of rented books
        rent_data[identity] = {}
    try:
        if book_name == "" or author == "":
            raise HTTPException(status_code=400, detail="Book name / Author can't be nothing")

        if not int(phone_number) > 0 or not len(phone_number) == 10:  # checks valid p_n
            raise HTTPException(status_code=400, detail=f"the phone number must be 10 digits")

        if not int(id) > 0 or not len(id) == 9:  # checks valid id number
            raise HTTPException(status_code=400, detail=f"the id must be 9 digits")

        if name_and_author in rent_data[identity]:
            raise HTTPException(status_code=400, detail=f"{person} has already rented the book {book_name} by {author}")

        if name_and_author not in books_data:  # checks if the book is in the library
            raise HTTPException(status_code=400, detail=f"{book_name} by {author} is not a book in the library")

        if name_and_author in books_data and books_data[name_and_author]["copies_available"] <=0:  # checks if the book is in the library
            raise HTTPException(status_code=400, detail=f"{book_name} by {author} doesn't have any copies left")

        if len(rent_data[identity]) == 4:
            raise HTTPException(status_code=400, detail=f"{person} has rented the maximum of 4 books!")

        if name_and_author not in rent_data[identity]:  # creates a new dictionary for the book_name in the person's list of books
            rent_data[identity][name_and_author]=time.time()
            books_data[name_and_author]["copies_available"] -= 1
        dump_to_books(books_data)
        dump_to_book_rents(rent_data)
        return {f"the book {book_name} by {author} was rented successfully by {person}, id : {id}, phone number": phone_number}
    except HTTPException as e:
        return e


@app.post("/return_rent/{name_and_author}/{person}/{id}/{phone_number}")  # returns a rent of a book by a person to the library
async def ret_rent(name_and_author,person,id,phone_number):
    name_and_author = name_and_author.lower()

    parts = name_and_author.split('##')
    book_name = parts[0]
    author = parts[1]

    person = person.lower()

    print(int(id), int(phone_number))

    print(id, phone_number)

    identity = person + "##" + id + "##" + phone_number  # makes a full identity variable

    books_data = open_books()
    rent_data = open_book_rents()


    try:
        if identity not in rent_data:
            raise HTTPException(status_code=400, detail=f"{person} with the id of {id}, phone number {phone_number} hasn't rented anything yet!")

        if book_name == "" or author == "":
            raise HTTPException(status_code=400, detail="Book name / Author can't be nothing")

        if name_and_author not in books_data:  # checks if the book is in the library
            raise HTTPException(status_code=400, detail=f"{book_name} by {author} is not a book in the library")
        if name_and_author not in rent_data[identity]:
            raise HTTPException(status_code=400, detail=f"{person} has not rented the book {book_name} by {author}!")



        books_data[name_and_author]["copies_available"] += 1
        del rent_data[identity][name_and_author]
        if rent_data[identity] == {}:
            del rent_data[identity]
        dump_to_books(books_data)
        dump_to_book_rents(rent_data)
        return {
            f"the book {book_name} by {author} was returned successfully from {person}, id : {id}, phone number": phone_number}
    except HTTPException as e:
        return e

@app.get("/who_should_return")  # checks which person has not returned a book for over 2 weeks since the rental date
async def who_should_return():
    rent_data = open_book_rents()  # assuming this function returns the rent data
    time_is_up = {}

    for person, books in rent_data.items():  # use .items() to get both key (person) and value (books)
        for book_data, time_rented in books.items():  # iterate over the books dictionary
            if (time.time() - time_rented) > 60 * 60 * 24 * 28:  # check if more than 2 weeks have passed
                if person not in time_is_up:
                    time_is_up[person] = []  # create a list for the person if not already present
                time_is_up[person].append(book_data)  # add the book to the person's list

    return time_is_up  # return the dictionary of people who need to return books














