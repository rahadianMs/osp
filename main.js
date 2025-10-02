document.addEventListener('DOMContentLoaded', () => {
    // --- Elemen Halaman Utama ---
    const pages = {
        landing: document.getElementById('landing-page'),
        auth: document.getElementById('auth-page'),
        app: document.getElementById('app-wrapper')
    };

    // --- Tombol Navigasi Antar Halaman ---
    const goToLoginBtn = document.getElementById('go-to-auth-btn');
    const goToRegisterBtn = document.getElementById('go-to-auth-btn-hero');
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const backToLandingButton = document.querySelector('.back-to-landing-btn');
    const backToLoginButton = document.querySelector('.back-to-login-btn');

    // --- Elemen Form ---
    const loginEmailInput = document.getElementById('login-email');
    const loginPasswordInput = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    const loginForm = document.getElementById('login-form-container');
    const registerForm = document.getElementById('register-form-container');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');

    // --- Fungsi untuk Menampilkan Halaman (Landing, Auth, App) ---
    const showPage = (pageToShow) => {
        // Sembunyikan semua container halaman utama
        for (const pageName in pages) {
            if (pages[pageName]) {
                pages[pageName].classList.add('hidden');
            }
        }
        // Tampilkan hanya halaman yang diinginkan
        if (pageToShow) {
            pageToShow.classList.remove('hidden');
            window.scrollTo(0, 0);
        }
    };
    
    // --- Event Listener untuk Alur Aplikasi ---

    // Dari Landing (Header Login) -> Auth (Login Form)
    goToLoginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(pages.auth);
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });

    // Dari Landing (Hero Register) -> Auth (Register Form)
    goToRegisterBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showPage(pages.auth);
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    // Dari Auth (Login Form) -> Landing (Tombol Kembali)
    if (backToLandingButton) {
        backToLandingButton.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(pages.landing);
        });
    }
    
    // Dari Auth (Register Form) -> Halaman Utama (Tombol Kembali)
    if (backToLoginButton) {
        backToLoginButton.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(pages.landing);
        });
    }
    
    // Dari Auth (Login) -> App
    loginBtn.addEventListener('click', () => {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        loginError.classList.add('hidden');

        if (email.trim() !== '' && password.trim() !== '') {
            showPage(pages.app);
            showPageInDashboard('beranda');
        } else {
            loginError.classList.remove('hidden');
        }
    });

    // Dari Auth (Register) -> App
    registerBtn.addEventListener('click', () => {
        showPage(pages.app);
        showPageInDashboard('beranda');
    });

    // Beralih antara form Login dan Register
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    });


    // --- Logika Internal Dasbor Aplikasi ---

    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const pageContents = document.querySelectorAll('.page-content');
    const pageTitle = document.getElementById('page-title');

    const showPageInDashboard = (pageId) => {
        pageContents.forEach(content => content.classList.add('hidden'));
        const activePage = document.getElementById(`page-${pageId}`);
        if (activePage) activePage.classList.remove('hidden');

        sidebarLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageId) {
                link.classList.add('active');
                if(pageTitle) pageTitle.textContent = link.querySelector('span').textContent;
            }
        });
    };

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.dataset.page;
            showPageInDashboard(pageId);
        });
    });

    // --- Logika untuk Menu Pengguna (User Menu) ---
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');

    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenuDropdown.classList.toggle('visible');
        });
    }

    window.addEventListener('click', (e) => {
        if (userMenuDropdown && userMenuBtn && !userMenuBtn.contains(e.target) && !userMenuDropdown.contains(e.target)) {
            userMenuDropdown.classList.remove('visible');
        }
    });

});

