  // Logout function
  function logout() {
    localStorage.removeItem('auth');
    window.location.href = 'login.html';
  }

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const day = String(date.getDate()).padStart(2, '0'); 
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear(); 

    
    const hours = String(date.getHours()).padStart(2, '0'); 
    const minutes = String(date.getMinutes()).padStart(2, '0'); 
    const seconds = String(date.getSeconds()).padStart(2, '0'); 

    const formattedDate = `${day}/${month}/${year}`;
    const formattedTime = `${hours}:${minutes}:${seconds}`;

    return `${formattedDate} ${formattedTime}`; 
}

const borrowedbookhistory = async () => {
    try {
        const authdata = JSON.parse(localStorage.getItem('auth'));
        const token = authdata.Token;
        const userid = authdata.user._id;
        console.log(authdata);

        const res = await fetch(`https://library-backend-iitb-ass.onrender.com/api/v1/history/getallstudenthistory`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });

        if (res.ok) {
            const response = await res.json();

            if (response && response.success === true) {
                const history = response.history;
                const borrowedHistoryList = document.getElementById('borrowedHistoryList');
                borrowedHistoryList.innerHTML = '';

                history.forEach((his) => {
                    const row = document.createElement('tr');
                    let actionButtons = '';
                    if (his?.message === 'book_borrowed' && his?.book?._id) {
                        console.log('borrowed_dipayan');
                        actionButtons = `
                            <button class="btn btn-warning btn-sm" 
                                id="return_book_${his.book._id}" 
                                onclick="return_book('${his.book._id}')">Return
                            </button>`;
                    }
                    row.innerHTML = `
                        <td>${his?.bookname || 'Unknown Book'}</td>
                        <td>${formatDate(his?.createdAt)}</td>
                        <td>${his?.message}</td>
                        <td>${actionButtons}</td>
                    `;

                    borrowedHistoryList.appendChild(row);
                });
            }
        } else {
            console.log('something went wrong');
        }
    } catch (error) {
        console.log(error);
    }
};

const historyLibrary = async()=>{
    try{
        const authdata = JSON.parse(localStorage.getItem('auth'));
        const token = authdata.Token;
        const res = await fetch('https://library-backend-iitb-ass.onrender.com/api/v1/history/getallhistoryborrowed', {
            method : 'GET',
            headers : {
                'Authorization' : token
            }
        });
        if(res.ok){
            const response = await res.json();
            if(response && response.success === true){
                const history = response.history;
                const historyList = document.getElementById('historyList');
                history.forEach((his)=>{
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${his?.user}</td>
                        <td>${his?.bookname}</td>
                        <td>${formatDate(his?.createdAt)}</td>
                        <td>${his?.message}</td>
                    `
                    historyList.appendChild(row);
                })
            }
        }
    }catch(error){
        console.log(error);

    }
}


  const return_book = async(book_id)=>{
    try{
        const authdata = JSON.parse(localStorage.getItem('auth'));
        const token = authdata.Token;
        const res = await fetch(`https://library-backend-iitb-ass.onrender.com/api/v1/book/returnbook/${book_id}` , {
            method : 'PUT',
            headers : {
                'Authorization' : token
            }
        });
        if(res.ok){
            const response = await res.json();
            console.log(response);
            if(response && response.success === true){
                const returnButton = document.getElementById(`return_book_${book_id}`);
                returnButton.innerHTML = '';
                const borrowButton = document.getElementById(`button_borrow_${book_id}`);
                borrowButton.innerHTML = 'borrow';
                return true;
            }else{
                return false;
            }
        }else{
            alert('Book Not returned');
            return false;
        }
    }catch(error){
        console.log(error);
        return false;
    }
  }

  const GetActiveUsers = async()=>{
    try{
        const authdata = JSON.parse(localStorage.getItem('auth'));
        const token = authdata.Token;
        const res = await fetch("https://library-backend-iitb-ass.onrender.com/api/v1/auth/getallusersactive" , {
            headers : {
                "Authorization" : token,
            }
        });
        const response = await res.json();
        if(response && response.success === true){
            const userList = document.getElementById('ActiveUserList');
            userList.innerHTML = '';
            const users = response.users;
            users.forEach((user)=>{
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                `;
                userList.appendChild(row);
            });
 
        }
    }catch(error){
        console.log(error);
    }
  }

  const DeActiveUserList = async()=>{
    try{
        const authdata = JSON.parse(localStorage.getItem('auth'));
        const token = authdata.Token;
        const res = await fetch('https://library-backend-iitb-ass.onrender.com/api/v1/auth/getallusersdeleted' , {
            method : 'GET',
            headers : {
                "Authorization" : token
            }
        });
        if(res.ok){
            const response = await res.json();
            if(response && response.success === true){
                const userList = document.getElementById('DeActiveUserList');
                userList.innerHTML = '';
                const users = response.deleted_users;
                users.forEach((user)=>{
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${user.name}</td>
                        <td>${user.email}</td>
                    `;
                    userList.appendChild(row);
                })
            }else{
            }
        }else{
            alert('something went wrong');
        }
    }catch(error){
        console.log(error);
    }
  }
  
  
  // Function to load books for librarian
  async function loadBooks() {
    const authdata = JSON.parse(localStorage.getItem('auth'));
    const token = authdata.Token;
    const response = await fetch('https://library-backend-iitb-ass.onrender.com/api/v1/book/getallbooks', {
        headers : {
            'Authorization': token
        }
    });
    const role = authdata.user.role;
    const book = await response.json();
    const bookList = document.getElementById('bookList');
    bookList.innerHTML = '';
    const books = book.books;
    books.forEach(book => {
      const row = document.createElement('tr');
      let actions = 'None';
      console.log(role);
      if (role === 'Libraian') {
        actions = 'true'
      }

      row.innerHTML = `
        <td>${book.name}</td>
        <td>${book.author}</td>
        <td>${(book.Published === undefined || book.Published === null ) ? "Not available" : book.Published}</td>
        <td>${book.content}</td>
        <td>${actions === 'true' ? getButtons(book._id) : getButtonsStudent(book)}</td>
      `;
      bookList.appendChild(row);
    });
  }

  const getButtons = (book_id)=>{
    actionButtons = `<button class="btn btn-warning btn-sm" id="edit_book_${book_id}" onclick="editBook('${book_id}')">Edit</button>
    <button class="btn btn-danger btn-sm" onclick="deleteBook('${book_id}')">Delete</button>`;
    return actionButtons;
  }

  const getButtonsStudent = (book)=>{
    const book_id = book._id;
    let actionButtons = `<button class="btn btn-warning btn-sm" id="button_borrow_${book_id}" onclick="borrow_book('${book_id}')">${book.status === 'borrowed' ? 'Not Available' : 'borrow'}</button>`;
    return actionButtons;
  }

  const deleteBook = async(book_id)=>{
    try{
        const authdata = JSON.parse(localStorage.getItem('auth'));
        const token = authdata.Token;
        const res = await fetch(`https://library-backend-iitb-ass.onrender.com/api/v1/book/removebook/${book_id}`, {
            method : 'DELETE',
            headers : {
                'Authorization' : token
            }
        });
        if(res.ok){
            const response = await res.json();
            if(response && response.success === true){
                loadBooks();
                return true;
            }else{
                return false;
            }
        }
    }catch(error){
        console.log(error);
        return false;
    }
  }


  async function borrow_book(book_id){
    try{
        const authdata = JSON.parse(localStorage.getItem('auth'));
        const token = authdata.Token;
        const res = await fetch(`https://library-backend-iitb-ass.onrender.com/api/v1/book/borrowbook/${book_id}`, {
            method : 'PUT',
            headers : {
                'Authorization' : token
            }
        });
        if(res.ok){
            const response = await res.json();
            if(response && response.success === true){
                const borrowbutton = document.getElementById(`button_borrow_${book_id}`);
                borrowbutton.innerHTML = 'Not Available';
                window.location.reload();
                return true;
            }else{
                return false;
            }
        }else{
            alert('something went wrong')
        }
    }catch(error){
        console.log(error);
    }
  }
  
  // Edit Book
  async function editBook(bookId) {
    const editModal = new bootstrap.Modal(document.getElementById('editModal'));
    editModal.show();
    const authdata = JSON.parse(localStorage.getItem('auth'));
    const token = authdata.Token;
    try{
        document.getElementById('editbookForm').addEventListener('submit', async function(e){
            e.preventDefault();
            const name = document.getElementById('editbookTitle').value;
            const author = document.getElementById('editbookAuthor').value;
            const Published = document.getElementById('editbookPublished').value;
            const content = document.getElementById('editbookContent').value;

            console.log(name, author, content);
            const res = await fetch(`https://library-backend-iitb-ass.onrender.com/api/v1/book/updatebooks/${bookId}`, {
                method : 'PUT',
                headers : {
                    "Content-Type": "application/json",
                    'Authorization': token
                },
                body : JSON.stringify({name , author , Published , content})
            });

            if(res.ok){
                const response = await res.json();
                console.log(response);
                if(response && response.success === true){
                    window.location.reload();
                    return true;
                }else{
                    alert('Update Unsuccessful');
                }
            }
            
        })
    }catch(error){
        console.log(error);
        return false;
    }
  }
  document.addEventListener('DOMContentLoaded', function () {
    const pathname = window.location.pathname;
    const authdata = JSON.parse(localStorage.getItem('auth'));
    if(authdata === null){
        window.location.href = 'index.html';
    }
    const user = authdata.user;
  
    if (authdata!=null && user.role === 'Libraian' && pathname.includes('Libraian_dashboard.html')) {
      loadBooks();
      GetActiveUsers();
      DeActiveUserList();
      historyLibrary();
    } else if (authdata!==null && user.role === 'student' && pathname.includes('member_dashboard.html')) {
      loadBooks();
      borrowedbookhistory();
    }
  });
