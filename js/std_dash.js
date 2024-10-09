document.getElementById('deleteAccount').addEventListener('click', async function () {
    const authdata = JSON.parse(localStorage.getItem('auth'));
    const token = authdata.Token;
    const id = authdata.user._id;

    try {
        const res = await fetch(`https://library-backend-iitb-ass.onrender.com/api/v1/auth/deleteuser/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': token
            }
        });

        if (res.ok) {
            const response = await res.json();
            console.log(response);
            if(response && response.success === true){
                alert('Account deleted successfully');
                localStorage.removeItem('auth');
                window.location.href = '/login.html';
            }
        } else {
            alert('Error deleting account');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});