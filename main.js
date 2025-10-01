document.addEventListener('DOMContentLoaded', () => {

    // --- MANAJEMEN ALUR HALAMAN UTAMA (Landing -> Auth -> App) ---

    const landingPage = document.getElementById('landing-page');
    const authPage = document.getElementById('auth-page');
    const appWrapper = document.getElementById('app-wrapper');

    // Tombol-tombol navigasi alur
    const goToAuthButtons = [document.getElementById('go-to-auth-btn'), document.getElementById('go-to-auth-btn-hero')];
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');

    // Tampilkan halaman otentikasi
    const showAuthPage = () => {
        landingPage.classList.add('hidden');
        authPage.classList.remove('hidden');
        appWrapper.classList.add('hidden');
    };

    // Tampilkan aplikasi dasbor
    const showApp = () => {
        landingPage.classList.add('hidden');
        authPage.classList.add('hidden');
        appWrapper.classList.remove('hidden');
        // Inisialisasi halaman pertama di dalam dasbor
        showPageInDashboard('beranda');
    };

    goToAuthButtons.forEach(btn => btn.addEventListener('click', showAuthPage));
    
    // Untuk MVP, login dan register langsung masuk ke aplikasi
    loginBtn.addEventListener('click', showApp);
    registerBtn.addEventListener('click', showApp);


    // --- MANAJEMEN FORM LOGIN/REGISTER DI DALAM AUTH PAGE ---
    
    const loginForm = document.getElementById('login-form-container');
    const registerForm = document.getElementById('register-form-container');
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');

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


    // --- LOGIKA INTERNAL APLIKASI DASBOR (setelah login berhasil) ---
    
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

    // Tempelkan SEMUA logika kalkulator dari file JS sebelumnya di sini.
    // ... (Fungsi calculateResults, createOrUpdateChart, dll.)
    // Ini penting agar kalkulator di dalam dasbor tetap berfungsi.

});

