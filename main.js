document.addEventListener('DOMContentLoaded', () => {

    // --- Page Flow Management ---
    const pages = {
        landing: document.getElementById('landing-page'),
        auth: document.getElementById('auth-page'),
        app: document.getElementById('app-wrapper')
    };

    const showPage = (pageToShow) => {
        Object.values(pages).forEach(page => page.classList.add('hidden'));
        if (pageToShow) {
            pageToShow.classList.remove('hidden');
            window.scrollTo(0, 0); // Scroll to top on page change
        }
    };

    // --- Navigation from Landing to Auth ---
    const goToAuthBtn = document.getElementById('go-to-auth-btn');
    const goToAuthBtnHero = document.getElementById('go-to-auth-btn-hero');
    const loginFormContainer = document.getElementById('login-form-container');
    const registerFormContainer = document.getElementById('register-form-container');

    const showAuthPage = (showLogin = true) => {
        showPage(pages.auth);
        if (showLogin) {
            loginFormContainer.classList.remove('hidden');
            registerFormContainer.classList.add('hidden');
        } else {
            loginFormContainer.classList.add('hidden');
            registerFormContainer.classList.remove('hidden');
        }
    };

    if(goToAuthBtn) goToAuthBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthPage(true); // Show login form by default
    });

    if(goToAuthBtnHero) goToAuthBtnHero.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthPage(false); // Show register form from hero button
    });


    // --- Auth Page Internal Logic ---
    const showRegisterLink = document.getElementById('show-register-link');
    const showLoginLink = document.getElementById('show-login-link');
    const backToLandingBtns = document.querySelectorAll('.back-to-landing-btn');

    if(showRegisterLink) showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.classList.add('hidden');
        registerFormContainer.classList.remove('hidden');
    });

    if(showLoginLink) showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormContainer.classList.add('hidden');
        loginFormContainer.classList.remove('hidden');
    });

    backToLandingBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(pages.landing);
        });
    });

    // --- Login/Register to App ---
    const loginBtn = document.getElementById('login-btn');
    const registerBtn = document.getElementById('register-btn');
    const loginError = document.getElementById('login-error');

    const showApp = () => {
        showPage(pages.app);
        showPageInDashboard('beranda');
    };
    
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            if (loginError) loginError.classList.add('hidden');

            if (email.trim() !== '' && password.trim() !== '') {
                showApp();
            } else {
                if (loginError) loginError.classList.remove('hidden');
            }
        });
    }

    if (registerBtn) registerBtn.addEventListener('click', showApp);


    // --- Dashboard Internal Logic ---
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

    // --- User Menu Logic ---
    const userMenuBtn = document.getElementById('user-menu-btn');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');

    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (userMenuDropdown) userMenuDropdown.classList.toggle('visible');
        });
    }

    window.addEventListener('click', (e) => {
        if (userMenuDropdown && userMenuBtn && !userMenuBtn.contains(e.target) && !userMenuDropdown.contains(e.target)) {
            userMenuDropdown.classList.remove('visible');
        }
    });
    
    // --- Smooth Scrolling for Anchor Links ---
    document.querySelectorAll('a.scroll-link').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Participant List Tab Logic ---
    const tabContainer = document.querySelector('.participant-tabs');
    const logoGrids = document.querySelectorAll('.participant-logos-grid');
    const tabBtns = document.querySelectorAll('.tab-btn');

    if (tabContainer) {
        tabContainer.addEventListener('click', (e) => {
            if (e.target.matches('.tab-btn')) {
                const category = e.target.dataset.category;

                tabBtns.forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');

                logoGrids.forEach(grid => {
                    grid.classList.remove('active');
                    if (grid.id === `logos-${category}`) {
                        grid.classList.add('active');
                    }
                });
            }
        });
    }
});

