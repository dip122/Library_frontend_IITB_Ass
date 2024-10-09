document.getElementById('bookFormList').addEventListener("submit" , async function(e) {
    e.preventDefault();
    console.log('dipayan');
    const name = document.getElementById('bookTitle').value;
    const author = document.getElementById('bookAuthor').value;
    const Published = document.getElementById('bookPublished').value;
    const content = document.getElementById('bookContent').value;
    const auth = localStorage.getItem('auth');
    const data = JSON.parse(auth);
    const token = data.Token;
    console.log(token);

    const response = await fetch('https://library-backend-iitb-ass.onrender.com/api/v1/book/addbook' , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': token
        },
        body: JSON.stringify({ name, author,  Published , content }),
    });

    console.log(response);

    if(response.ok){
        const data = await response.json();
        if(data && data.success === true){
            console.log('Dipayan Ghosh')
            if(data && data.book!=undefined){
                const books = await data.book;
                console.log(books);
                const bookList = document.getElementById('bookList');
                books.forEach(book => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                        <td>${book.name}</td>
                        <td>${book.author}</td>
                        <td>${book.Published === undefined ? "Not available" : book.Published}</td>
                        <td>${book.content}</td>
                        <td>
                            <button class="btn btn-primary mb-3" data-bs-toggle="modal" data-bs-target="#bookModal" onclick="editBook('${book._id}')">Edit</button>
                            <button class="btn btn-danger btn-sm" onclick="deleteBook('${book._id}')">Delete</button>
                        </td>
                    `;
                    bookList.appendChild(row);
                })
            }
        }else{
            alert('Book Not added successfully');
        }
    }else{
        alert('UnAuthorized Access');
    }

})