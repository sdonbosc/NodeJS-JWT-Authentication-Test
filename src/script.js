var token = '';
function login() {
    const data = {
        username: document.getElementById('username').value,
        password: document.getElementById('password').value,
    };
    axios.post('/api/login', data)
        .then(res => {
            console.log("LOGIN 2");
            console.log(res);
            document.getElementById('username').value = '';
            document.getElementById('password').value = '';
            if (res && res.data && res.data.success) {
                console.log("LOGIN success");
                const token = res.data.token;
                localStorage.setItem('jwt', token);
                document.querySelector('h1.row').innerHTML = 'JWT Home Page';
                document.querySelector('main').innerHTML = 'LoginSuccessful';
                getDashboard();
            }
        }).catch(function (error) {
            document.getElementById('error-message').textContent = "Login Failed, please enter valid credentatials"
            console.log("Error", error);
        });
}
function getDashboard() {
    if(verifytoken()){
    const token = localStorage.getItem('jwt');

    axios.get('/api/dashboard', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => {
        console.log('getDashboard res')
        if (res && res.data && res.data.success) {
            document.querySelector('main').innerHTML = res.data.myContent;
            loadHomePage()
        }
    }).catch(function (error) {
        document.getElementById('error-message').textContent = "Unauthorized access"
        loadHomePage()
        console.log("Error", error);
    });
    history.pushState({
        id: 'dashboard'
    }, 'Dashboard', '/api/dashboard');
}
}

function loadHomePage() {
    axios.get('/dashboardPage')
        .then(res => {
            console.log("Home Page Log", res)
            document.querySelector('main').innerHTML = res.data
        }).catch(function (error) {
            document.getElementById('error-message').textContent = "Failed to load page"
            console.log("Error", error);
        });
}

function getSettings() {
    if(verifytoken()){
    const token = localStorage.getItem('jwt');
    axios.get('/api/settings', {
        headers: {
            'Authorization': 'Bearer ' + token
        }
    }).then(res => {
        console.log('getSettings res')
        if (res && res.data && res.data.success) {
            console.log('getSettings res 1')
            loadSettingsPage()
        }
    }).catch(function (error) {
        document.getElementById('error-message').textContent = "Unauthorized access"
        console.log("Error", error);
    });
    history.pushState({
        id: 'settings'
    }, 'Settings', '/api/settings');
}
}

function loadSettingsPage() {
    console.log('loadSettingsPage res 1')
    axios.get('/settingsPage')
        .then(res => {
            console.log('loadSettingsPage res 2')
            document.querySelector('main').innerHTML = res.data
        }).catch(function (error) {
            document.getElementById('error-message').textContent = "Failed to load page"
            console.log("Error", error);
        });
}

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

function verifytoken(){
    let token = localStorage.getItem('jwt')
    if (token){
        let payload = parseJwt(token)
        if(Date.now() <= payload.exp * 1000){
            return true
        }
        else{
            localStorage.removeItem('jwt')
            window.location.href = "/"
        }
    }
}
setTimeout(()=>{
    verifytoken()
}, 190000)

