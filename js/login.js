document.getElementById('loginForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const email = document.getElementById('loginemail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await fetch('http://localhost:2003/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if(response.ok){
      const data = await response.json();
      console.log(data);
      if (data.success === true && data.user.status === 'active') {
        console.log("dipayan Ghosh");
        const AuthSave = {
          user: data.user,
          Token: data.Token,
          role: data.user.role
        };
        
        await localStorage.setItem('auth', JSON.stringify(AuthSave));
        console.log(data);
        console.log('localstorage saved');
        if (data.user.role === 'Libraian') {
          window.location.href = 'Libraian_dashboard.html';
        } else {
          window.location.href = 'member_dashboard.html';
        }
      }else if(data.success === true && data.user.status === 'Deleted_User'){
        alert('Cannot login throgh this mail as this account is deleted');
      }
       else {
        document.getElementById('errorMessage').textContent = 'Invalid useremail or password';
      }
    }else{
      alert('Something went wrong');
    }
  } catch (error) {
    console.log(error);
  }
});