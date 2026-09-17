/* =========================================================
   CIVICAI
   MULTILINGUAL AI CONSTITUENCY
   MAIN APPLICATION CONTROLLER

   FLOW:

   Welcome
      ↓
   Role Selection
      ↓
   Citizen / MP-MLA / Department Login
      ↓
   Authentication
      ↓
   Role Dashboard

   CITIZEN REGISTRATION:

   Citizen Login
      ↓
   Create Account
      ↓
   Citizen Registration
      ↓
   Account Created
      ↓
   Citizen Login
   ========================================================= */


/* =========================================================
   1. APPLICATION STATE
   ========================================================= */

const AppState = {

    language:
        localStorage.getItem("civicai-language") || "en",

    theme:
        localStorage.getItem("civicai-theme") || "dark",

    currentPage: "welcome",

    currentRole:
        sessionStorage.getItem("civicai-role") || null

};


const CitizenDashboardState = {

    currentView: "overview",

    history: []

};


const DepartmentDashboardState = {

    currentView: "overview"

};


/* =========================================================
   2. SUPPORTED LANGUAGES
   ========================================================= */

const SupportedLanguages = {

    en: "English",
    ta: "Tamil",
    hi: "Hindi",
    te: "Telugu",
    ml: "Malayalam",
    kn: "Kannada",
    mr: "Marathi",
    bn: "Bengali",
    gu: "Gujarati"

};


/* =========================================================
   3. SUPPORTED ROLES
   ========================================================= */

const SupportedRoles = [
    "citizen",
    "mpmla",
    "department"
];


/* =========================================================
   4. PAGE MAP
   ========================================================= */

const PageMap = {

    welcome:
        "pages/welcome.html",

    "role-selection":
        "pages/role-selection.html",

    "citizen-login":
        "pages/citizen-login.html",

    "citizen-register":
        "pages/citizen-register.html",

    "mpmla-login":
        "pages/mpmla-login.html",

    "department-login":
        "pages/department-login.html",

    "citizen-dashboard":
        "pages/citizen-dashboard.html",

    "mpmla-dashboard":
        "pages/mpmla-dashboard.html",

    "department-dashboard":
        "pages/department-dashboard.html"

};


/* =========================================================
   5. START APPLICATION
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initializeApplication
);


/* =========================================================
   6. INITIALIZE APPLICATION
   ========================================================= */

async function initializeApplication() {

    console.log("CivicAI starting...");

    initializeLanguage();

    initializeTheme();

    initializeGlobalEvents();

    await loadPage("welcome");

    console.log("CivicAI ready.");

}


/* =========================================================
   7. GLOBAL EVENT HANDLER
   ========================================================= */

function initializeGlobalEvents() {

    document.addEventListener(
        "click",
        handleGlobalClick
    );


    document.addEventListener(
        "keydown",
        handleGlobalKeydown
    );

}


/* =========================================================
   8. GLOBAL CLICK HANDLER
   ========================================================= */

function handleGlobalClick(event) {

    const roleTarget =
        event.target.closest(
            "[data-role-action]"
        );


    if (roleTarget) {

        event.preventDefault();

        const role =
            roleTarget.getAttribute(
                "data-role-action"
            );

        if (role) {

            selectRole(role);

        }

        return;

    }


    const target =
        event.target.closest(
            "[data-civic-action]"
        );


    if (!target) {

        return;

    }


    const action =
        target.getAttribute(
            "data-civic-action"
        );


    switch (action) {


        /* -----------------------------------------
           NAVIGATION
           ----------------------------------------- */

        case "get-started":

            event.preventDefault();

            navigateTo(
                "role-selection"
            );

            break;


        case "role-selection":

            event.preventDefault();

            navigateTo(
                "role-selection"
            );

            break;


        case "back":

            event.preventDefault();

            handleBackNavigation();

            break;


        /* -----------------------------------------
           ROLE SELECTION
           ----------------------------------------- */

        case "citizen":

            event.preventDefault();

            selectRole("citizen");

            break;


        case "mpmla":

            event.preventDefault();

            selectRole("mpmla");

            break;


        case "department":

            event.preventDefault();

            selectRole("department");

            break;


        /* -----------------------------------------
           ABOUT
           ----------------------------------------- */

        case "about":

            event.preventDefault();

            openAboutModal();

            break;


        case "close-about":

            event.preventDefault();

            closeAboutModal();

            break;


        /* -----------------------------------------
           THEME
           ----------------------------------------- */

        case "toggle-theme":

            event.preventDefault();

            toggleTheme();

            break;


        /* -----------------------------------------
           MOBILE MENU
           ----------------------------------------- */

        case "mobile-menu":

            event.preventDefault();

            toggleMobileNavigation();

            break;


        case "close-mobile-menu":

            event.preventDefault();

            closeMobileNavigation();

            break;


        /* -----------------------------------------
           BRAND HOME
           ----------------------------------------- */

        case "home":

            event.preventDefault();

            navigateTo("welcome");

            break;


        case "logout":

            event.preventDefault();

            handleLogout();

            break;


        /* -----------------------------------------
           NOTIFICATIONS
           ----------------------------------------- */

        case "toggle-notifications":

            event.preventDefault();

            toggleNotificationPanel();

            break;


        /* -----------------------------------------
           LOGIN
           ----------------------------------------- */

        case "citizen-login":

            event.preventDefault();

            navigateTo(
                "citizen-login"
            );

            break;


        case "mpmla-login":

            event.preventDefault();

            navigateTo(
                "mpmla-login"
            );

            break;


        case "department-login":

            event.preventDefault();

            navigateTo(
                "department-login"
            );

            break;


        /* -----------------------------------------
           CITIZEN REGISTRATION
           ----------------------------------------- */

        case "create-citizen-account":

            event.preventDefault();

            navigateTo(
                "citizen-register"
            );

            break;


        case "citizen-register":

            event.preventDefault();

            navigateTo(
                "citizen-register"
            );

            break;


        /* -----------------------------------------
           OTP
           ----------------------------------------- */

        case "continue-otp":

            event.preventDefault();

            handleOTP();

            break;


        /* -----------------------------------------
           PASSWORD
           ----------------------------------------- */

        case "toggle-password":

            event.preventDefault();

            togglePasswordVisibility();

            break;


        default:

            console.log(
                "Unknown CivicAI action:",
                action
            );

    }

}


/* =========================================================
   9. KEYBOARD EVENTS
   ========================================================= */

function handleGlobalKeydown(event) {

    if (
        event.key === "Escape"
    ) {

        closeAboutModal();

        closeMobileNavigation();

    }

}


/* =========================================================
   10. LOAD PAGE
   ========================================================= */

async function loadPage(pageName) {

    const app =
        document.getElementById("app");


    if (!app) {

        console.error(
            "CivicAI Error: #app not found."
        );

        return false;

    }


    const pagePath =
        PageMap[pageName];


    if (!pagePath) {

        console.error(
            `CivicAI Error: Unknown page "${pageName}".`
        );

        showPageError(pageName);

        return false;

    }


    try {

        const response =
            await fetch(pagePath);


        if (!response.ok) {

            throw new Error(
                `Unable to load ${pagePath}`
            );

        }


        const html =
            await response.text();


        app.innerHTML =
            html;


        AppState.currentPage =
            pageName;


        initializePage(
            pageName
        );


        initializeSharedPageControls();

        applyTheme();

        updateLanguageSelectors();

        closeMobileNavigation();

        closeAboutModal();


        window.scrollTo({
            top: 0,
            behavior: "instant"
        });


        console.log(
            `CivicAI page loaded: ${pageName}`
        );


        return true;

    }


    catch (error) {

        console.error(
            "CivicAI navigation error:",
            error
        );

        showPageError(pageName);

        return false;

    }

}


/* =========================================================
   11. PAGE ERROR
   ========================================================= */

function showPageError(pageName) {

    const app =
        document.getElementById("app");


    if (!app) {

        return;

    }


    app.innerHTML = `

        <section class="civic-error-page">

            <div class="civic-error-card">

                <div class="civic-error-logo">
                    ✦
                </div>

                <h1>
                    CivicAI
                </h1>

                <h2>
                    Page could not be loaded
                </h2>

                <p>
                    We couldn't open the requested page.
                </p>

                <strong>
                    ${PageMap[pageName] || pageName}
                </strong>

                <div class="civic-error-actions">

                    <button
                        type="button"
                        data-civic-action="back"
                    >
                        ← Back
                    </button>

                    <button
                        type="button"
                        data-civic-action="home"
                    >
                        Go to Home
                    </button>

                </div>

            </div>

        </section>

    `;

}


/* =========================================================
   12. PAGE INITIALIZATION
   ========================================================= */

function initializePage(pageName) {

    switch (pageName) {


        case "welcome":

            initializeWelcomePage();

            break;


        case "role-selection":

            initializeRoleSelectionPage();

            break;


        case "citizen-login":

            initializeCitizenLoginPage();

            break;


        case "citizen-register":

            initializeCitizenRegisterPage();

            break;


        case "mpmla-login":

            initializeMPMLALoginPage();

            break;


        case "department-login":

            initializeDepartmentLoginPage();

            break;


        case "citizen-dashboard":

            initializeCitizenDashboard();

            break;


        case "mpmla-dashboard":

            initializeMPMLADashboard();

            break;


        case "department-dashboard":

            initializeDepartmentDashboard();

            break;


        default:

            console.log(
                `No specific initialization for ${pageName}`
            );

    }

}


/* =========================================================
   13. SHARED PAGE CONTROLS
   ========================================================= */

function initializeSharedPageControls() {

    updateThemeUI();

    updateLanguageSelectors();


    const languageSelector =
        document.getElementById(
            "languageSelector"
        );


    if (languageSelector) {

        languageSelector.onchange =
            function(event) {

                setLanguage(
                    event.target.value
                );

            };

    }


    const mobileLanguageSelector =
        document.getElementById(
            "mobileLanguageSelector"
        );


    if (mobileLanguageSelector) {

        mobileLanguageSelector.onchange =
            function(event) {

                setLanguage(
                    event.target.value
                );

            };

    }


    const themeToggle =
        document.getElementById(
            "themeToggle"
        );


    /*
       Theme buttons with data-civic-action are handled
       by the single delegated global click listener.
       Keep a direct fallback only for legacy markup.
    */
    if (
        themeToggle &&
        !themeToggle.hasAttribute("data-civic-action")
    ) {

        themeToggle.onclick =
            function(event) {

                event.preventDefault();

                toggleTheme();

            };

    }


    const mobileThemeToggle =
        document.getElementById(
            "mobileThemeToggle"
        );


    if (mobileThemeToggle) {

        mobileThemeToggle.onclick =
            function(event) {

                event.preventDefault();

                toggleTheme();

            };

    }


    const mobileMenuButton =
        document.getElementById(
            "mobileMenuButton"
        );


    if (mobileMenuButton) {

        mobileMenuButton.onclick =
            function(event) {

                event.preventDefault();

                toggleMobileNavigation();

            };

    }


    const aboutButton =
        document.getElementById(
            "aboutButton"
        );


    if (aboutButton) {

        aboutButton.onclick =
            function(event) {

                event.preventDefault();

                openAboutModal();

            };

    }


    const closeAboutButton =
        document.getElementById(
            "closeAboutModal"
        );


    if (closeAboutButton) {

        closeAboutButton.onclick =
            function(event) {

                event.preventDefault();

                closeAboutModal();

            };

    }

}


/* =========================================================
   14. WELCOME PAGE
   ========================================================= */

function initializeWelcomePage() {

    console.log(
        "Welcome page initialized."
    );


    const getStartedButton =
        document.getElementById(
            "getStartedButton"
        );


    if (getStartedButton) {

        getStartedButton.onclick =
            function(event) {

                event.preventDefault();

                navigateTo(
                    "role-selection"
                );

            };

    }


    const heroAboutButton =
        document.getElementById(
            "heroAboutButton"
        );


    if (heroAboutButton) {

        heroAboutButton.onclick =
            function(event) {

                event.preventDefault();

                const aboutSection =
                    document.getElementById(
                        "aboutProject"
                    );


                if (aboutSection) {

                    aboutSection.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            };

    }


    const brandHome =
        document.getElementById(
            "brandHome"
        );


    if (brandHome) {

        brandHome.onclick =
            function(event) {

                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });

            };

    }


    initializeAboutModal();

}


/* =========================================================
   15. ROLE SELECTION PAGE
   ========================================================= */

function initializeRoleSelectionPage() {

    console.log(
        "Role Selection page initialized."
    );

    initializeBackButtons();

    const roleLanguageSelector =
        document.getElementById(
            "roleLanguageSelector"
        );


    if (roleLanguageSelector) {

        roleLanguageSelector.value =
            AppState.language;

        roleLanguageSelector.onchange =
            function(event) {

                setLanguage(
                    event.target.value
                );

            };

    }


    const roleThemeToggle =
        document.getElementById(
            "roleThemeToggle"
        );


    if (roleThemeToggle) {

        roleThemeToggle.onclick =
            function(event) {

                event.preventDefault();

                toggleTheme();

            };

    }


    const citizenElements =
        document.querySelectorAll(
            "#citizenCard, #citizenRole, [data-role='citizen']"
        );


    citizenElements.forEach(
        function(element) {

            element.onclick =
                function(event) {

                    event.preventDefault();

                    selectRole("citizen");

                };

            element.style.cursor =
                "pointer";

        }
    );


    const mpmlaElements =
        document.querySelectorAll(
            "#mpmlaCard, #mpmlaRole, [data-role='mpmla']"
        );


    mpmlaElements.forEach(
        function(element) {

            element.onclick =
                function(event) {

                    event.preventDefault();

                    selectRole("mpmla");

                };

            element.style.cursor =
                "pointer";

        }
    );


    const departmentElements =
        document.querySelectorAll(
            "#departmentCard, #departmentRole, [data-role='department']"
        );


    departmentElements.forEach(
        function(element) {

            element.onclick =
                function(event) {

                    event.preventDefault();

                    selectRole("department");

                };

            element.style.cursor =
                "pointer";

        }
    );


    const citizenPortal =
        document.getElementById(
            "citizenPortalButton"
        );


    if (citizenPortal) {

        citizenPortal.onclick =
            function(event) {

                event.preventDefault();

                selectRole("citizen");

            };

    }


    const mpmlaPortal =
        document.getElementById(
            "mpmlaPortalButton"
        );


    if (mpmlaPortal) {

        mpmlaPortal.onclick =
            function(event) {

                event.preventDefault();

                selectRole("mpmla");

            };

    }


    const departmentPortal =
        document.getElementById(
            "departmentPortalButton"
        );


    if (departmentPortal) {

        departmentPortal.onclick =
            function(event) {

                event.preventDefault();

                selectRole("department");

            };

    }

}


/* =========================================================
   16. SELECT ROLE
   ========================================================= */

function selectRole(role) {

    if (
        !SupportedRoles.includes(role)
    ) {

        console.warn(
            "Invalid role:",
            role
        );

        return;

    }


    setRole(role);


    switch (role) {

        case "citizen":

            navigateTo(
                "citizen-login"
            );

            break;


        case "mpmla":

            navigateTo(
                "mpmla-login"
            );

            break;


        case "department":

            navigateTo(
                "department-login"
            );

            break;

    }

}


/* =========================================================
   17. CITIZEN LOGIN
   ========================================================= */

function initializeCitizenLoginPage() {

    console.log(
        "Citizen Login page initialized."
    );


    setRole("citizen");

    initializeBackButtons();


    const loginForm =
        document.getElementById(
            "citizenLoginForm"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleCitizenLogin
        );

    }


    const continueButton =
        document.getElementById(
            "citizenContinueButton"
        );


    if (continueButton) {

        continueButton.onclick =
            function(event) {

                event.preventDefault();

                handleCitizenLogin();

            };

    }


    const otpButton =
        document.getElementById(
            "citizenOTPButton"
        ) || document.getElementById(
            "continueOtpButton"
        );


    if (otpButton) {

        otpButton.onclick =
            function(event) {

                event.preventDefault();

                handleOTP();

            };

    }


    const passwordToggle =
        document.getElementById(
            "togglePassword"
        ) || document.getElementById(
            "passwordToggle"
        );


    if (passwordToggle) {

        passwordToggle.onclick =
            function(event) {

                event.preventDefault();

                togglePasswordVisibility();

            };

    }


    /*
       CREATE ACCOUNT

       This is now connected to the
       Citizen Registration page.
    */

    const createAccount =
        document.getElementById(
            "createCitizenAccount"
        );


    if (createAccount) {

        createAccount.onclick =
            function(event) {

                event.preventDefault();

                navigateTo(
                    "citizen-register"
                );

            };

    }


    const forgotPassword =
        document.getElementById(
            "forgotPasswordButton"
        );


    if (forgotPassword) {

        forgotPassword.onclick =
            function(event) {

                event.preventDefault();

                showLoginMessage(
                    "Password recovery will be connected in the next stage."
                );

            };

    }

}


/* =========================================================
   18. CITIZEN LOGIN HANDLER
   ========================================================= */

async function handleCitizenLogin(event) {

    if (event) {
        event.preventDefault();
    }

    const mobileInput =
        document.getElementById("citizenMobile") ||
        document.getElementById("mobileNumber");

    const passwordInput =
        document.getElementById("citizenPassword") ||
        document.getElementById("password");

    const mobile = mobileInput
        ? mobileInput.value.trim()
        : "";

    const password = passwordInput
        ? passwordInput.value
        : "";

    if (!mobile) {
        showLoginMessage("Please enter your mobile number.");

        if (mobileInput) {
            mobileInput.focus();
        }

        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        showLoginMessage(
            "Please enter a valid 10-digit mobile number."
        );

        if (mobileInput) {
            mobileInput.focus();
        }

        return;
    }

    if (!password) {
        showLoginMessage("Please enter your password.");

        if (passwordInput) {
            passwordInput.focus();
        }

        return;
    }

    try {

        const response = await fetch(
            "https://multilingual-ai-backend.onrender.com/api/auth/login",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mobile: mobile,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            showLoginMessage(
                data.detail || "Invalid mobile number or password."
            );
            return;
        }

        sessionStorage.setItem(
            "civicai-authenticated",
            "true"
        );

        sessionStorage.setItem(
            "civicai-user-role",
            "citizen"
        );

        sessionStorage.setItem(
            "civicai-citizen",
            JSON.stringify(data.citizen)
        );

        console.log(
            "Citizen login successful."
        );

        navigateTo(
            "citizen-dashboard"
        );

    } catch (error) {

        console.error(
            "Citizen login error:",
            error
        );

        showLoginMessage(
            "Unable to connect to the server. Please try again."
        );
    }
}


/* =========================================================
   19. LOGIN MESSAGE
   ========================================================= */

function showLoginMessage(message) {

    let messageElement =
        document.getElementById(
            "loginMessage"
        );


    if (!messageElement) {

        messageElement =
            document.createElement(
                "div"
            );


        messageElement.id =
            "loginMessage";


        messageElement.setAttribute(
            "role",
            "alert"
        );


        const form =
            document.querySelector(
                "form"
            );


        if (form) {

            form.prepend(
                messageElement
            );

        } else {

            const app =
                document.getElementById(
                    "app"
                );


            if (app) {

                app.prepend(
                    messageElement
                );

            }

        }

    }


    messageElement.textContent =
        message;

}


/* =========================================================
   20. OTP
   ========================================================= */

function handleOTP() {

    const mobileInput =
        document.getElementById(
            "citizenMobile"
        );


    const mobile =
        mobileInput
            ? mobileInput.value.trim()
            : "";


    if (
        !/^[0-9]{10}$/.test(mobile)
    ) {

        showLoginMessage(
            "Enter a valid 10-digit mobile number before continuing with OTP."
        );


        if (mobileInput) {

            mobileInput.focus();

        }


        return;

    }


    console.log(
        "OTP flow selected."
    );


    showLoginMessage(
        "OTP verification will be connected in the next stage."
    );

}


/* =========================================================
   21. PASSWORD VISIBILITY
   ========================================================= */

function togglePasswordVisibility() {

    const passwordInput =
        document.getElementById(
            "citizenPassword"
        ) || document.getElementById(
            "password"
        ) || document.getElementById(
            "mpmlaPassword"
        ) || document.getElementById(
            "departmentPassword"
        );


    if (!passwordInput) {

        return;

    }


    if (
        passwordInput.type === "password"
    ) {

        passwordInput.type =
            "text";

    } else {

        passwordInput.type =
            "password";

    }

}


/* =========================================================
   22. CITIZEN REGISTRATION
   ========================================================= */

function initializeCitizenRegisterPage() {

    console.log(
        "Citizen Registration page initialized."
    );


    setRole("citizen");

    initializeBackButtons();


    const registerForm =
        document.getElementById(
            "citizenRegisterForm"
        );


    if (registerForm) {

        registerForm.addEventListener(
            "submit",
            handleCitizenRegistration
        );

    }


    const registerPasswordToggle =
        document.getElementById(
            "registerPasswordToggle"
        );


    if (registerPasswordToggle) {

        registerPasswordToggle.onclick =
            function(event) {

                event.preventDefault();

                toggleRegisterPassword();

            };

    }


    const registerConfirmToggle =
        document.getElementById(
            "registerConfirmPasswordToggle"
        );


    if (registerConfirmToggle) {

        registerConfirmToggle.onclick =
            function(event) {

                event.preventDefault();

                toggleRegisterConfirmPassword();

            };

    }


    const backToLogin =
        document.getElementById(
            "backToCitizenLogin"
        );


    if (backToLogin) {

        backToLogin.onclick =
            function(event) {

                event.preventDefault();

                navigateTo(
                    "citizen-login"
                );

            };

    }

}


/* =========================================================
   23. CITIZEN REGISTRATION HANDLER
   ========================================================= */
async function handleCitizenRegistration(event) {

    if (event) {
        event.preventDefault();
    }

    const nameInput =
        document.getElementById("registerFullName");

    const mobileInput =
        document.getElementById("registerMobile");

    const emailInput =
        document.getElementById("registerEmail");

    const passwordInput =
        document.getElementById("registerPassword");

    const confirmPasswordInput =
        document.getElementById("registerConfirmPassword");

    const fullName = nameInput
        ? nameInput.value.trim()
        : "";

    const mobile = mobileInput
        ? mobileInput.value.trim()
        : "";

    const email = emailInput
        ? emailInput.value.trim()
        : "";

    const password = passwordInput
        ? passwordInput.value
        : "";

    const confirmPassword = confirmPasswordInput
        ? confirmPasswordInput.value
        : "";

    if (!fullName) {
        showRegisterMessage(
            "Please enter your full name."
        );

        nameInput?.focus();
        return;
    }

    if (!/^[0-9]{10}$/.test(mobile)) {
        showRegisterMessage(
            "Please enter a valid 10-digit mobile number."
        );

        mobileInput?.focus();
        return;
    }

    if (
        !email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
        showRegisterMessage(
            "Please enter a valid email address."
        );

        emailInput?.focus();
        return;
    }

    if (password.length < 6) {
        showRegisterMessage(
            "Password must contain at least 6 characters."
        );

        passwordInput?.focus();
        return;
    }

    if (password !== confirmPassword) {
        showRegisterMessage(
            "Passwords do not match."
        );

        confirmPasswordInput?.focus();
        return;
    }

    try {

        const response = await fetch(
            "https://multilingual-ai-backend.onrender.com/api/auth/register",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName: fullName,
                    mobile: mobile,
                    email: email,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            showRegisterMessage(
                data.detail ||
                "Registration failed. Please try again."
            );

            return;
        }

        console.log(
            "Citizen account created successfully."
        );

        showRegisterSuccess();

    } catch (error) {

        console.error(
            "Citizen registration error:",
            error
        );

        showRegisterMessage(
            "Unable to connect to the server. Please try again."
        );
    }
}


/* =========================================================
   24. REGISTRATION MESSAGE
   ========================================================= */

function showRegisterMessage(message) {

    const messageElement =
        document.getElementById(
            "registerMessage"
        );


    if (!messageElement) {

        return;

    }


    messageElement.textContent =
        message;


    messageElement.className =
        "register-message error";

}


/* =========================================================
   25. REGISTRATION SUCCESS
   ========================================================= */

function showRegisterSuccess() {

    const form =
        document.getElementById(
            "citizenRegisterForm"
        );


    const success =
        document.getElementById(
            "registerSuccess"
        );


    if (form) {

        form.style.display =
            "none";

    }


    if (success) {

        success.classList.add(
            "active"
        );

    }

}


/* =========================================================
   26. REGISTER PASSWORD TOGGLE
   ========================================================= */

function toggleRegisterPassword() {

    const input =
        document.getElementById(
            "registerPassword"
        );


    if (!input) {

        return;

    }


    input.type =
        input.type === "password"
            ? "text"
            : "password";

}


/* =========================================================
   27. REGISTER CONFIRM PASSWORD TOGGLE
   ========================================================= */

function toggleRegisterConfirmPassword() {

    const input =
        document.getElementById(
            "registerConfirmPassword"
        );


    if (!input) {

        return;

    }


    input.type =
        input.type === "password"
            ? "text"
            : "password";

}


/* =========================================================
   28. MP / MLA LOGIN
   ========================================================= */

function initializeMPMLALoginPage() {

    console.log(
        "MP / MLA Login page initialized."
    );


    setRole("mpmla");

    initializeBackButtons();

    const loginForm =
        document.getElementById(
            "mpmlaLoginForm"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleMPMLALogin
        );

    }


    const continueButton =
        document.getElementById(
            "mpmlaContinueButton"
        );


    if (continueButton) {

        continueButton.onclick =
            function(event) {

                event.preventDefault();

                handleMPMLALogin();

            };

    }


    const otpButton =
        document.getElementById(
            "mpmlaOTPButton"
        );


    if (otpButton) {

        otpButton.onclick =
            function(event) {

                event.preventDefault();

                showLoginMessage(
                    "OTP verification will be connected in the next stage."
                );

            };

    }


    const passwordToggle =
        document.getElementById(
            "togglePassword"
        );


    if (passwordToggle) {

        passwordToggle.onclick =
            function(event) {

                event.preventDefault();

                togglePasswordVisibility();

            };

    }

}


/* =========================================================
   29. DEPARTMENT LOGIN
   ========================================================= */

function initializeDepartmentLoginPage() {

    console.log(
        "Department Login page initialized."
    );


    setRole("department");

    initializeBackButtons();

    const loginForm =
        document.getElementById(
            "departmentLoginForm"
        );


    if (loginForm) {

        loginForm.addEventListener(
            "submit",
            handleDepartmentLogin
        );

    }


    const continueButton =
        document.getElementById(
            "departmentContinueButton"
        );


    if (continueButton) {

        continueButton.onclick =
            function(event) {

                event.preventDefault();

                handleDepartmentLogin();

            };

    }


    const otpButton =
        document.getElementById(
            "departmentOTPButton"
        );


    if (otpButton) {

        otpButton.onclick =
            function(event) {

                event.preventDefault();

                showLoginMessage(
                    "OTP verification will be connected in the next stage."
                );

            };

    }


    const passwordToggle =
        document.getElementById(
            "togglePassword"
        );


    if (passwordToggle) {

        passwordToggle.onclick =
            function(event) {

                event.preventDefault();

                togglePasswordVisibility();

            };

    }

}


/* =========================================================
   30. DASHBOARD INITIALIZERS
   ========================================================= */

function initializeCitizenDashboard() {

    console.log(
        "Citizen Dashboard initialized."
    );

    initializeBackButtons();
    ensureDemoState();

    CitizenDashboardState.currentView = "overview";
    CitizenDashboardState.history = [];

    const backButton = document.getElementById("citizenDashboardBack");
    if (backButton) {
        backButton.onclick = function(event) {
            event.preventDefault();
            goBackCitizenDashboard();
        };
    }

    renderCitizenDashboard();
    updateCitizenDashboardBackButton();

}


const CitizenDashboardViewLabels = {
    overview: "Overview",
    grievance: "Raise Grievance",
    "my-grievances": "My Grievances",
    tracking: "Grievance Tracking",
    schemes: "Government Schemes",
    services: "Government Services",
    notifications: "Notifications",
    profile: "Profile",
    settings: "Settings",
    "grievance-detail": "Grievance Details",
    "service-detail": "Service Details"
};


function setCitizenDashboardView(view, options = {}) {

    if (!view || view === CitizenDashboardState.currentView && !options.force) {
        return;
    }

    if (options.pushHistory !== false) {
        CitizenDashboardState.history.push(
            CitizenDashboardState.currentView
        );
    }

    CitizenDashboardState.currentView = view;
    updateCitizenDashboardBackButton();

}


function goBackCitizenDashboard() {

    const previousView =
        CitizenDashboardState.history.pop();

    if (!previousView) {
        updateCitizenDashboardBackButton();
        return;
    }

    CitizenDashboardState.currentView = previousView;
    renderCitizenDashboardView(previousView);
    updateCitizenDashboardBackButton();

}


function updateCitizenDashboardBackButton() {

    const button =
        document.getElementById("citizenDashboardBack");

    const context =
        document.getElementById("citizenDashboardViewContext");

    if (button) {
        button.disabled = CitizenDashboardState.history.length === 0;
    }

    if (context) {
        context.textContent =
            CitizenDashboardViewLabels[
                CitizenDashboardState.currentView
            ] || "Citizen workspace";
    }

}


function renderCitizenDashboardView(view) {

    switch (view) {

        case "overview":
            renderCitizenDashboard();
            break;

        case "grievance":
            renderCitizenGrievanceForm();
            break;

        case "my-grievances":
            renderCitizenGrievances();
            break;

        case "tracking":
            renderCitizenTracking();
            break;

        case "schemes":
            renderSchemes();
            break;

        case "services":
            renderServices();
            break;

        case "notifications":
            renderNotifications();
            break;

        case "profile":
            renderCitizenProfile();
            break;

        case "settings":
            renderSettings();
            break;

        default:
            CitizenDashboardState.currentView = "overview";
            renderCitizenDashboard();

    }

    updateCitizenDashboardBackButton();

}


function initializeMPMLADashboard() {

    console.log(
        "MP / MLA Dashboard initialized."
    );


    initializeBackButtons();

    ensureDemoState();


    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );


    if (!container) {

        console.error(
            "MP/MLA dashboard container not found."
        );

        return;

    }


    const page =
        document.querySelector(
            '[data-role-page="mpmla"]'
        );


    if (!page) {
        return;
    }


    let mpmlaProfileMode = "view";


    /* =====================================================
       DATA
    ====================================================== */

    const grievances =
        typeof getDashboardGrievances ===
        "function"
            ? getDashboardGrievances()
            : [];


    const departments = [

        {
            name:
                "Public Works",

            active:
                184,

            performance:
                91,

            avg:
                "1.8 days"

        },

        {
            name:
                "Water Department",

            active:
                126,

            performance:
                84,

            avg:
                "2.4 days"

        },

        {
            name:
                "Electricity",

            active:
                92,

            performance:
                79,

            avg:
                "3.1 days"

        },

        {
            name:
                "Sanitation",

            active:
                76,

            performance:
                87,

            avg:
                "2.1 days"

        },

        {
            name:
                "Transport",

            active:
                48,

            performance:
                73,

            avg:
                "4.2 days"

        },

        {
            name:
                "Health Services",

            active:
                39,

            performance:
                94,

            avg:
                "1.4 days"

        }

    ];


    const notifications = [

        {
            type:
                "red",

            icon:
                "⚠",

            title:
                "High-priority complaint detected",

            text:
                "A road infrastructure complaint in Ward 12 requires representative attention.",

            time:
                "10 minutes ago"

        },

        {
            type:
                "green",

            icon:
                "✓",

            title:
                "Complaint resolved",

            text:
                "Public Works successfully resolved a citizen complaint.",

            time:
                "42 minutes ago"

        },

        {
            type:
                "yellow",

            icon:
                "◷",

            title:
                "Department response delayed",

            text:
                "Water Department has exceeded the expected response window.",

            time:
                "2 hours ago"

        },

        {
            type:
                "blue",

            icon:
                "✦",

            title:
                "New AI insight available",

            text:
                "CivicAI identified a growing water-supply trend.",

            time:
                "Today"

        }

    ];


    const aiInsights = [

        {
            type:
                "positive",

            icon:
                "✓",

            status:
                "POSITIVE",

            title:
                "Resolution performance improved",

            text:
                "Constituency-wide resolution performance has improved compared with the previous reporting period.",

            foot:
                "AI confidence · 94%"

        },

        {
            type:
                "warning",

            icon:
                "⚠",

            status:
                "MONITOR",

            title:
                "Water complaints remain elevated",

            text:
                "Water-related complaints continue to appear above the constituency average.",

            foot:
                "AI confidence · 89%"

        },

        {
            type:
                "critical",

            icon:
                "!",

            status:
                "HIGH PRIORITY",

            title:
                "Ward 12 requires intervention",

            text:
                "Road and drainage complaints are increasing rapidly and may become a sustained hotspot.",

            foot:
                "AI confidence · 96%"

        },

        {
            type:
                "recommendation",

            icon:
                "✦",

            status:
                "RECOMMENDATION",

            title:
                "Coordinate infrastructure review",

            text:
                "A coordinated review across Public Works and Water could reduce recurring complaints.",

            foot:
                "AI confidence · 91%"

        }

    ];


    /* =====================================================
       HELPERS
    ====================================================== */

    function esc(value) {

        return String(
            value ?? ""
        )
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );

    }


    function getStatusClass(
        status
    ) {

        const normalized =
            String(
                status || ""
            ).toLowerCase();


        if (
            normalized.includes(
                "resolved"
            )
        ) {

            return "resolved";

        }


        if (
            normalized.includes(
                "progress"
            )
        ) {

            return "progress";

        }


        return "pending";

    }


    function stat(
        icon,
        label,
        value,
        text
    ) {

        return `

            <article
                class="mpmla-stat-card"
            >

                <div
                    class="mpmla-stat-icon"
                >
                    ${icon}
                </div>

                <small>
                    ${esc(label)}
                </small>

                <strong>
                    ${esc(value)}
                </strong>

                <span>
                    ${esc(text)}
                </span>

            </article>

        `;

    }


    function kpi(
        label,
        value,
        text
    ) {

        return `

            <article
                class="mpmla-kpi"
            >

                <small>
                    ${esc(label)}
                </small>

                <strong>
                    ${esc(value)}
                </strong>

                <span>
                    ${esc(text)}
                </span>

            </article>

        `;

    }


    function showView(
        view
    ) {

        page
            .querySelectorAll(
                "[data-mpmla-view]"
            )
            .forEach(
                function(button) {

                    button.classList.toggle(
                        "active",
                        button.dataset.mpmlaView ===
                            view
                    );

                }
            );


        switch (view) {

            case "overview":

                renderOverview();

                break;


            case "grievances":

                renderGrievances();

                break;


            case "analytics":

                renderAnalytics();

                break;


            case "issues":

                renderIssues();

                break;


            case "departments":

                renderDepartments();

                break;


            case "areas":

                renderAreas();

                break;


            case "ai":

                renderAI();

                break;


            case "reports":

                renderReports();

                break;


            case "notifications":

                renderNotifications();

                break;


            case "profile":

                renderProfile();

                break;


            case "settings":

                renderSettings();

                break;


            default:

                renderOverview();

        }


        container.scrollIntoView({
            behavior:
                "smooth",
            block:
                "start"
        });

    }


    /* =====================================================
       OVERVIEW
    ====================================================== */

    function renderOverview() {

        const total =
            grievances.length;


        const pending =
            grievances.filter(
                function(item) {

                    return [
                        "Submitted",
                        "Under Review"
                    ].includes(
                        item.status
                    );

                }
            ).length;


        const progress =
            grievances.filter(
                function(item) {

                    return item.status ===
                        "In Progress";

                }
            ).length;


        const resolved =
            grievances.filter(
                function(item) {

                    return item.status ===
                        "Resolved";

                }
            ).length;


        const high =
            grievances.filter(
                function(item) {

                    return item.priority ===
                        "High";

                }
            ).length;


        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-welcome"
                >

                    <span
                        class="mpmla-welcome-tag"
                    >
                        REPRESENTATIVE OVERVIEW
                    </span>

                    <h1>
                        Good morning, Representative
                    </h1>

                    <p>
                        Monitor constituency complaints,
                        department performance and CivicAI
                        recommendations from one workspace.
                    </p>

                </div>


                <div
                    class="mpmla-stat-grid"
                >

                    ${stat(
                        "📋",
                        "Total Complaints",
                        total || 1284,
                        "Across constituency"
                    )}

                    ${stat(
                        "⚠",
                        "Pending Issues",
                        pending || 286,
                        "Awaiting review"
                    )}

                    ${stat(
                        "⚙",
                        "In Progress",
                        progress || 1,
                        "With departments"
                    )}

                    ${stat(
                        "✓",
                        "Resolved",
                        resolved || 1,
                        "Completed issues"
                    )}

                </div>


                <div
                    class="mpmla-two-column"
                >

                    <section
                        class="mpmla-panel"
                    >

                        <div
                            class="mpmla-panel-head"
                        >

                            <h3>
                                Top Issues &amp; Trends
                            </h3>

                            <span
                                class="mpmla-pill"
                            >
                                AI ANALYSIS
                            </span>

                        </div>


                        <div
                            class="mpmla-issue-list"
                        >

                            ${[
                                ["Road & Infrastructure",38],
                                ["Water Supply",27],
                                ["Electricity",18],
                                ["Sanitation",11]
                            ]
                            .map(
                                function(item) {

                                    return `

                                        <div
                                            class="mpmla-issue"
                                        >

                                            <div
                                                class="mpmla-issue-top"
                                            >

                                                <strong>
                                                    ${esc(
                                                        item[0]
                                                    )}
                                                </strong>

                                                <span>
                                                    ${item[1]}%
                                                </span>

                                            </div>


                                            <div
                                                class="mpmla-progress"
                                            >

                                                <span
                                                    style="
                                                        width:${item[1]}%
                                                    "
                                                ></span>

                                            </div>

                                        </div>

                                    `;

                                }
                            )
                            .join("")}

                        </div>

                    </section>


                    <section
                        class="mpmla-panel"
                    >

                        <div
                            class="mpmla-panel-head"
                        >

                            <h3>
                                Department Performance
                            </h3>

                            <span
                                class="mpmla-pill"
                            >
                                LIVE
                            </span>

                        </div>


                        <div
                            class="mpmla-dept-list"
                        >

                            ${departments
                                .slice(0,4)
                                .map(
                                    function(item) {

                                        return `

                                            <div
                                                class="mpmla-dept-row"
                                            >

                                                <div>

                                                    <strong>
                                                        ${esc(
                                                            item.name
                                                        )}
                                                    </strong>

                                                    <small>
                                                        ${item.active}
                                                        active complaints
                                                    </small>

                                                </div>


                                                <span
                                                    class="
                                                        mpmla-dept-score
                                                    "
                                                >
                                                    ${item.performance}%
                                                </span>

                                            </div>

                                        `;

                                    }
                                )
                                .join("")}

                        </div>

                    </section>

                </div>


                <section
                    class="mpmla-panel"
                >

                    <div
                        class="mpmla-panel-head"
                    >

                        <h3>
                            Priority Snapshot
                        </h3>

                        <span
                            class="mpmla-pill"
                        >
                            ${high} HIGH PRIORITY
                        </span>

                    </div>


                    <div
                        class="mpmla-kpi-grid"
                    >

                        ${kpi(
                            "High priority",
                            high || 3,
                            "Needs attention"
                        )}

                        ${kpi(
                            "Hotspot wards",
                            12,
                            "Concentration areas"
                        )}

                        ${kpi(
                            "Resolution rate",
                            "78%",
                            "Current performance"
                        )}

                        ${kpi(
                            "Response SLA",
                            "3 days",
                            "Target average"
                        )}

                    </div>

                </section>

            </section>

        `;

    }


    /* =====================================================
       GRIEVANCES
    ====================================================== */

    function renderGrievances() {

        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-heading"
                >

                    <span
                        class="mpmla-eyebrow"
                    >
                        CONSTITUENCY CASELOAD
                    </span>

                    <h1>
                        Citizen Grievances
                    </h1>

                    <p>
                        Review citizen complaints,
                        priority, location and status.
                    </p>

                </div>


                <section
                    class="mpmla-panel"
                >

                    <div
                        class="mpmla-panel-head"
                    >

                        <h3>
                            Grievance Queue
                        </h3>

                        <span
                            class="mpmla-pill"
                        >
                            ${grievances.length}
                            CASES
                        </span>

                    </div>


                    <div
                        class="mpmla-grievance-grid"
                    >

                        ${
                            grievances.length
                                ? grievances.map(
                                    function(item) {

                                        return `

                                            <article
                                                class="
                                                    mpmla-grievance-card
                                                "
                                            >

                                                <div>

                                                    <h3>
                                                        ${esc(
                                                            item.subject
                                                        )}
                                                    </h3>

                                                    <p>
                                                        ${esc(
                                                            item.description ||
                                                            "Citizen grievance"
                                                        )}
                                                    </p>


                                                    <div
                                                        class="
                                                            mpmla-grievance-meta
                                                        "
                                                    >

                                                        <span
                                                            class="
                                                                mpmla-chip
                                                            "
                                                        >
                                                            ${esc(
                                                                item.id
                                                            )}
                                                        </span>

                                                        <span
                                                            class="
                                                                mpmla-chip
                                                            "
                                                        >
                                                            ${esc(
                                                                item.location ||
                                                                "Constituency"
                                                            )}
                                                        </span>

                                                        <span
                                                            class="
                                                                mpmla-status
                                                                ${getStatusClass(
                                                                    item.status
                                                                )}
                                                            "
                                                        >
                                                            ${esc(
                                                                item.status
                                                            )}
                                                        </span>

                                                    </div>

                                                </div>


                                                <button
                                                    type="button"
                                                    class="
                                                        mpmla-open-button
                                                    "
                                                    data-mpmla-open-grievance="${esc(
                                                        item.id
                                                    )}"
                                                >
                                                    View Details
                                                </button>

                                            </article>

                                        `;

                                    }
                                ).join("")

                                :

                                `
                                    <div
                                        class="mpmla-panel"
                                    >
                                        No grievances found.
                                    </div>
                                `
                        }

                    </div>

                </section>

            </section>

        `;


        container
            .querySelectorAll(
                "[data-mpmla-open-grievance]"
            )
            .forEach(
                function(button) {

                    button.addEventListener(
                        "click",
                        function(event) {

                            event.preventDefault();

                            event.stopPropagation();

                            renderGrievanceDetail(
                                button.dataset.mpmlaOpenGrievance
                            );

                        }
                    );

                }
            );

    }


    function renderGrievanceDetail(
        id
    ) {

        const item =
            grievances.find(
                function(record) {

                    return record.id ===
                        id;

                }
            );


        if (!item) {
            return;
        }


        const timeline =
            item.timeline ||
            [
                {
                    label:
                        "Submitted",
                    date:
                        "2026-08-01",
                    type:
                        "complete"
                },
                {
                    label:
                        "Under Review",
                    date:
                        "2026-08-02",
                    type:
                        "complete"
                },
                {
                    label:
                        "Assigned",
                    date:
                        "2026-08-03",
                    type:
                        "warning"
                }
            ];


        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-heading"
                >

                    <span
                        class="mpmla-eyebrow"
                    >
                        COMPLAINT DETAIL
                    </span>

                    <h1>
                        ${esc(item.subject)}
                    </h1>

                    <p>
                        ${esc(
                            item.description ||
                            "Complaint submitted by a citizen."
                        )}
                    </p>

                </div>


                <div
                    class="mpmla-stat-grid"
                >

                    ${kpi(
                        "Grievance ID",
                        item.id,
                        "Case reference"
                    )}

                    ${kpi(
                        "Category",
                        item.category || "Infrastructure",
                        "Classification"
                    )}

                    ${kpi(
                        "Priority",
                        item.priority || "Medium",
                        "Current priority"
                    )}

                    ${kpi(
                        "Status",
                        item.status,
                        "Current state"
                    )}

                </div>


                <section
                    class="mpmla-panel"
                >

                    <div
                        class="mpmla-panel-head"
                    >

                        <h3>
                            Complaint Timeline
                        </h3>

                        <span
                            class="mpmla-pill"
                        >
                            HISTORY
                        </span>

                    </div>


                    <div
                        class="mpmla-timeline"
                    >

                        ${timeline
                            .map(
                                function(step) {

                                    return `

                                        <div
                                            class="
                                                mpmla-timeline-item
                                                ${
                                                    step.type ||
                                                    ""
                                                }
                                            "
                                        >

                                            <span
                                                class="
                                                    mpmla-timeline-dot
                                                "
                                            ></span>


                                            <div
                                                class="
                                                    mpmla-timeline-card
                                                "
                                            >

                                                <strong>
                                                    ${esc(
                                                        step.label
                                                    )}
                                                </strong>

                                                <small>
                                                    ${esc(
                                                        step.date
                                                    )}
                                                </small>

                                                ${
                                                    step.response
                                                        ? `
                                                            <small>
                                                                ${esc(
                                                                    step.response
                                                                )}
                                                            </small>
                                                        `
                                                        : ""
                                                }

                                            </div>

                                        </div>

                                    `;

                                }
                            )
                            .join("")}

                    </div>

                </section>


                <button
                    type="button"
                    class="mpmla-open-button"
                    id="mpmlaBackToGrievances"
                >
                    ← Back to Grievances
                </button>

            </section>

        `;


        document
            .getElementById(
                "mpmlaBackToGrievances"
            )
            ?.addEventListener(
                "click",
                function() {

                    renderGrievances();

                }
            );

    }


    /* =====================================================
       ANALYTICS
    ====================================================== */

    function renderAnalytics() {

        const data = [
            ["Mar",58],
            ["Apr",72],
            ["May",66],
            ["Jun",89],
            ["Jul",82],
            ["Aug",104]
        ];


        const max =
            104;


        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-heading"
                >

                    <span
                        class="mpmla-eyebrow"
                    >
                        CONSTITUENCY INTELLIGENCE
                    </span>

                    <h1>
                        Constituency Analytics
                    </h1>

                    <p>
                        Monthly complaint movement,
                        resolution performance and
                        constituency response indicators.
                    </p>

                </div>


                <div
                    class="mpmla-kpi-grid"
                >

                    ${kpi(
                        "Complaint volume",
                        "1,284",
                        "+8.4% this month"
                    )}

                    ${kpi(
                        "Resolved",
                        "998",
                        "78% resolution rate"
                    )}

                    ${kpi(
                        "Average resolution",
                        "4.8 days",
                        "-11% improvement"
                    )}

                    ${kpi(
                        "Active departments",
                        "8",
                        "100% monitored"
                    )}

                </div>


                <section
                    class="mpmla-chart-panel"
                >

                    <div
                        class="mpmla-panel-head"
                    >

                        <div>

                            <h3>
                                Monthly Complaint Trend
                            </h3>

                            <p>
                                Number of complaints received
                                each month
                            </p>

                        </div>

                        <span
                            class="mpmla-pill"
                        >
                            LAST 6 MONTHS
                        </span>

                    </div>


                    <div
                        class="mpmla-chart"
                    >

                        ${data
                            .map(
                                function(item) {

                                    const height =
                                        (
                                            item[1] /
                                            max
                                        ) * 100;


                                    return `

                                        <div
                                            class="
                                                mpmla-bar-group
                                            "
                                        >

                                            <span
                                                class="
                                                    mpmla-bar-value
                                                "
                                            >
                                                ${item[1]}
                                            </span>


                                            <div
                                                class="
                                                    mpmla-bar-track
                                                "
                                            >

                                                <span
                                                    class="
                                                        mpmla-bar
                                                    "
                                                    style="
                                                        height:${height}%
                                                    "
                                                ></span>

                                            </div>


                                            <span
                                                class="
                                                    mpmla-bar-label
                                                "
                                            >
                                                ${item[0]}
                                            </span>

                                        </div>

                                    `;

                                }
                            )
                            .join("")}

                    </div>


                    <div
                        class="mpmla-chart-summary"
                    >

                        <div
                            class="mpmla-summary"
                        >

                            <small>
                                Highest month
                            </small>

                            <strong>
                                Aug · 104
                            </strong>

                        </div>


                        <div
                            class="mpmla-summary"
                        >

                            <small>
                                Lowest month
                            </small>

                            <strong>
                                Mar · 58
                            </strong>

                        </div>


                        <div
                            class="mpmla-summary"
                        >

                            <small>
                                Growth
                            </small>

                            <strong>
                                +79%
                            </strong>

                        </div>

                    </div>

                </section>

            </section>

        `;

    }


    /* =====================================================
       TOP ISSUES
    ====================================================== */

    function renderIssues() {

        const issues = [

            [
                "Road & Infrastructure",
                482,
                "HIGH"
            ],

            [
                "Water Supply",
                347,
                "HIGH"
            ],

            [
                "Electricity",
                231,
                "MEDIUM"
            ],

            [
                "Sanitation",
                142,
                "MEDIUM"
            ],

            [
                "Public Transport",
                82,
                "LOW"
            ]

        ];


        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-heading"
                >

                    <span
                        class="mpmla-eyebrow"
                    >
                        ISSUE MONITORING
                    </span>

                    <h1>
                        Top Issues &amp; Trends
                    </h1>

                    <p>
                        Current civic issue concentration
                        and constituency-level priorities.
                    </p>

                </div>


                <div
                    class="mpmla-grievance-grid"
                >

                    ${issues
                        .map(
                            function(item,index) {

                                const className =
                                    index <
                                    2
                                        ? "critical"
                                        : "normal";


                                return `

                                    <article
                                        class="
                                            mpmla-grievance-card
                                        "
                                    >

                                        <div>

                                            <h3>
                                                ${esc(
                                                    item[0]
                                                )}
                                            </h3>

                                            <p>
                                                ${item[1]}
                                                active complaints
                                            </p>

                                            <div
                                                class="
                                                    mpmla-grievance-meta
                                                "
                                            >

                                                <span
                                                    class="
                                                        mpmla-status
                                                        ${
                                                            className ===
                                                            "critical"
                                                                ? "progress"
                                                                : "pending"
                                                        }
                                                    "
                                                >
                                                    ${item[2]}
                                                </span>

                                            </div>

                                        </div>

                                        <strong
                                            style="
                                                font-size:28px;
                                                color:var(--mp-blue);
                                            "
                                        >
                                            ${item[1]}
                                        </strong>

                                    </article>

                                `;

                            }
                        )
                        .join("")}

                </div>

            </section>

        `;

    }


    /* =====================================================
       DEPARTMENTS
    ====================================================== */

    function renderDepartments() {

        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-heading"
                >

                    <span
                        class="mpmla-eyebrow"
                    >
                        PERFORMANCE INTELLIGENCE
                    </span>

                    <h1>
                        Department Performance
                    </h1>

                    <p>
                        Compare department response quality,
                        resolution performance and average
                        resolution time.
                    </p>

                </div>


                <div
                    class="mpmla-3d-grid"
                >

                    ${departments
                        .map(
                            function(item) {

                                return `

                                    <article
                                        class="mpmla-3d-card"
                                    >

                                        <div
                                            class="mpmla-3d-top"
                                        >

                                            <div
                                                class="mpmla-3d-icon"
                                            >
                                                ▦
                                            </div>

                                            <span
                                                class="mpmla-3d-score"
                                            >
                                                ${item.performance}%
                                                PERFORMANCE
                                            </span>

                                        </div>


                                        <h3>
                                            ${esc(
                                                item.name
                                            )}
                                        </h3>


                                        <p>
                                            ${item.active}
                                            active complaints
                                        </p>


                                        <div
                                            class="mpmla-3d-progress"
                                        >

                                            <div
                                                class="
                                                    mpmla-3d-progress-head
                                                "
                                            >

                                                <span>
                                                    Resolution performance
                                                </span>

                                                <strong>
                                                    ${item.performance}%
                                                </strong>

                                            </div>


                                            <div
                                                class="mpmla-3d-track"
                                            >

                                                <span
                                                    style="
                                                        width:${item.performance}%
                                                    "
                                                ></span>

                                            </div>

                                        </div>


                                        <div
                                            class="mpmla-3d-footer"
                                        >

                                            <span>
                                                Average resolution
                                            </span>

                                            <strong>
                                                ${item.avg}
                                            </strong>

                                        </div>

                                    </article>

                                `;

                            }
                        )
                        .join("")}

                </div>

            </section>

        `;

    }


    /* =====================================================
       AREAS
    ====================================================== */

    function renderAreas() {

        const areas = [

            ["Ward 12",184,"Roads · Drainage"],
            ["Ward 08",137,"Water · Electricity"],
            ["Ward 19",119,"Sanitation · Roads"],
            ["Ward 04",92,"Water · Waste"],
            ["Ward 21",74,"Transport · Roads"],
            ["Ward 02",61,"Electricity · Drainage"]

        ];


        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-heading"
                >

                    <span
                        class="mpmla-eyebrow"
                    >
                        AREA INTELLIGENCE
                    </span>

                    <h1>
                        Area Problem Analysis
                    </h1>

                    <p>
                        Identify civic hotspots and
                        dominant issue categories across wards.
                    </p>

                </div>


                <div
                    class="mpmla-area-grid"
                >

                    ${areas
                        .map(
                            function(item) {

                                return `

                                    <article
                                        class="mpmla-area-card"
                                    >

                                        <span>
                                            ${esc(
                                                item[0]
                                            )}
                                        </span>

                                        <strong>
                                            ${item[1]}
                                        </strong>

                                        <small>
                                            ${esc(
                                                item[2]
                                            )}
                                        </small>

                                    </article>

                                `;

                            }
                        )
                        .join("")}

                </div>

            </section>

        `;

    }


    /* =====================================================
       AI INSIGHTS
    ====================================================== */

    function renderAI() {

        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-heading"
                >

                    <span
                        class="mpmla-eyebrow"
                    >
                        CIVICAI PROCESSING ENGINE
                    </span>

                    <h1>
                        AI-Powered Insights
                    </h1>

                    <p>
                        Intelligent signals generated from
                        complaint patterns, department response
                        and constituency trends.
                    </p>

                </div>


                <div
                    class="mpmla-ai-grid"
                >

                    ${aiInsights
                        .map(
                            function(item) {

                                return `

                                    <article
                                        class="
                                            mpmla-ai-card
                                            ${item.type}
                                        "
                                    >

                                        <div
                                            class="
                                                mpmla-ai-inner
                                            "
                                        >

                                            <div
                                                class="
                                                    mpmla-ai-head
                                                "
                                            >

                                                <div
                                                    class="
                                                        mpmla-ai-icon
                                                    "
                                                >
                                                    ${item.icon}
                                                </div>

                                                <span
                                                    class="
                                                        mpmla-ai-status
                                                    "
                                                >
                                                    ${item.status}
                                                </span>

                                            </div>


                                            <h3>
                                                ${esc(
                                                    item.title
                                                )}
                                            </h3>


                                            <p>
                                                ${esc(
                                                    item.text
                                                )}
                                            </p>


                                            <div
                                                class="
                                                    mpmla-ai-footer
                                                "
                                            >
                                                ${esc(
                                                    item.foot
                                                )}
                                            </div>

                                        </div>

                                    </article>

                                `;

                            }
                        )
                        .join("")}

                </div>

            </section>

        `;

    }


    /* =====================================================
       REPORTS
    ====================================================== */

    function renderReports() {

        const reports = [

            [
                "Monthly Complaint Report",
                "Complaint volume and monthly trend.",
            ],

            [
                "Department Performance Report",
                "Department response and resolution performance.",
            ],

            [
                "Hotspot Analysis Report",
                "Ward-wise civic issue concentration.",
            ],

            [
                "AI Recommendations Report",
                "Priority recommendations generated by CivicAI.",
            ]

        ];


        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-heading"
                >

                    <span
                        class="mpmla-eyebrow"
                    >
                        REPORTS &amp; EXPORT
                    </span>

                    <h1>
                        Reports &amp; Export
                    </h1>

                    <p>
                        Generate representative reports
                        from the current dashboard data.
                    </p>

                </div>


                <div
                    class="mpmla-grievance-grid"
                >

                    ${reports
                        .map(
                            function(item,index) {

                                return `

                                    <article
                                        class="
                                            mpmla-grievance-card
                                        "
                                    >

                                        <div>

                                            <h3>
                                                ${esc(
                                                    item[0]
                                                )}
                                            </h3>

                                            <p>
                                                ${esc(
                                                    item[1]
                                                )}
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            class="
                                                mpmla-open-button
                                            "
                                            data-mpmla-export="${index}"
                                        >
                                            Export
                                        </button>

                                    </article>

                                `;

                            }
                        )
                        .join("")}

                </div>

            </section>

        `;


        container
            .querySelectorAll(
                "[data-mpmla-export]"
            )
            .forEach(
                function(button) {

                    button.addEventListener(
                        "click",
                        function() {

                            const text = [

                                "CivicAI Representative Report",

                                "",

                                reports[
                                    Number(
                                        button.dataset.mpmlaExport
                                    )
                                ][0],

                                "",

                                "Total complaints: 1,284",

                                "Pending issues: 286",

                                "Resolution rate: 78%",

                                "Hotspot wards: 12"

                            ].join("\n");


                            const blob =
                                new Blob(
                                    [text],
                                    {
                                        type:
                                            "text/plain"
                                    }
                                );


                            const url =
                                URL.createObjectURL(
                                    blob
                                );


                            const link =
                                document.createElement(
                                    "a"
                                );


                            link.href =
                                url;


                            link.download =
                                "civicai-report.txt";


                            link.click();


                            URL.revokeObjectURL(
                                url
                            );

                        }
                    );

                }
            );

    }


    /* =====================================================
       NOTIFICATIONS
    ====================================================== */

    function renderNotifications() {

        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-heading"
                >

                    <span
                        class="mpmla-eyebrow"
                    >
                        NOTIFICATION SERVICE
                    </span>

                    <h1>
                        Notifications
                    </h1>

                    <p>
                        Important constituency alerts,
                        department updates and AI signals.
                    </p>

                </div>


                <div
                    class="mpmla-notification-list"
                >

                    ${notifications
                        .map(
                            function(item,index) {

                                return `

                                    <article
                                        class="
                                            mpmla-notification-card
                                            ${item.type}
                                            ${
                                                index < 2
                                                    ? "unread"
                                                    : ""
                                            }
                                        "
                                    >

                                        <div
                                            class="
                                                mpmla-notification-icon
                                            "
                                        >
                                            ${item.icon}
                                        </div>


                                        <div>

                                            <h3>
                                                ${esc(
                                                    item.title
                                                )}
                                            </h3>

                                            <p>
                                                ${esc(
                                                    item.text
                                                )}
                                            </p>

                                            <small>
                                                ${esc(
                                                    item.time
                                                )}
                                            </small>

                                        </div>

                                    </article>

                                `;

                            }
                        )
                        .join("")}

                </div>

            </section>

        `;

    }


    /* =====================================================
       PROFILE — READ ONLY
    ====================================================== */

    function renderProfile() {

        const profile = getMPMLAProfile();
        const isEditing = mpmlaProfileMode === "edit";
        const editableFields = [
            ["Official Email", "officialEmail", "email"],
            ["Official Phone", "officialPhone", "tel"],
            ["Constituency", "constituency", "text"],
            ["District", "district", "text"]
        ];

        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-heading"
                >

                    <span
                        class="mpmla-eyebrow"
                    >
                        REPRESENTATIVE ACCOUNT
                    </span>

                    <h1>
                        Profile
                    </h1>

                    <p>
                        Official representative information.
                        ${isEditing ? "Update the fields below and save when ready." : "Manage the contact details shown in your CivicAI workspace."}
                    </p>

                </div>


                <div
                    class="mpmla-profile-grid"
                >

                    <aside
                        class="mpmla-profile-card"
                    >

                        <div
                            class="mpmla-avatar"
                        >
                            M
                        </div>

                        <h3>
                            Representative
                        </h3>

                        <p>
                            ${mpmlaEscape(profile.role)}
                        </p>

                    </aside>


                    <section
                        class="mpmla-profile-details"
                    >

                        <div class="mpmla-profile-toolbar">
                            <div>
                                <h3>Representative details</h3>
                                <p>${isEditing ? "Changes are saved locally in this browser." : "Role and account status remain system-managed."}</p>
                            </div>
                            <div class="mpmla-profile-actions">
                                ${isEditing
                                    ? `
                                        <button type="button" class="mpmla-profile-save" id="mpmlaSaveProfile">Save</button>
                                        <button type="button" id="mpmlaCancelProfile">Cancel</button>
                                    `
                                    : '<button type="button" id="mpmlaEditProfile">Edit Profile</button>'}
                            </div>
                        </div>

                        <div class="mpmla-profile-info">
                            ${isEditing
                                ? editableFields.map(([label, field, type]) => `
                                    <div class="mpmla-profile-field">
                                        <label for="mpmlaProfile-${field}">${mpmlaEscape(label)}</label>
                                        <input
                                            id="mpmlaProfile-${field}"
                                            type="${type}"
                                            data-mpmla-profile-field="${field}"
                                            value="${mpmlaEscape(profile[field])}"
                                            autocomplete="off"
                                        >
                                    </div>
                                `).join("")
                                : `
                                    ${profileInfo("Role", profile.role)}
                                    ${profileInfo("Official Email", profile.officialEmail)}
                                    ${profileInfo("Official Phone", profile.officialPhone)}
                                    ${profileInfo("Constituency", profile.constituency)}
                                    ${profileInfo("District", profile.district)}
                                    ${profileInfo("Account Status", profile.accountStatus)}
                                `}
                        </div>

                        <div class="mpmla-profile-message" id="mpmlaProfileMessage" role="status" aria-live="polite"></div>

                    </section>

                </div>

            </section>

        `;

        if (!isEditing) {
            document.getElementById("mpmlaEditProfile")?.addEventListener(
                "click",
                function() {
                    mpmlaProfileMode = "edit";
                    renderProfile();
                }
            );
            return;
        }

        document.getElementById("mpmlaSaveProfile")?.addEventListener(
            "click",
            function() {
                const next = { ...profile };
                container
                    .querySelectorAll("[data-mpmla-profile-field]")
                    .forEach(function(input) {
                        next[input.getAttribute("data-mpmla-profile-field")] = input.value.trim();
                    });

                const message = document.getElementById("mpmlaProfileMessage");
                if (!next.officialEmail || !next.officialPhone || !next.constituency || !next.district) {
                    if (message) {
                        message.className = "mpmla-profile-message error";
                        message.textContent = "Please complete all profile fields.";
                    }
                    return;
                }

                if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.officialEmail)) {
                    if (message) {
                        message.className = "mpmla-profile-message error";
                        message.textContent = "Enter a valid official email address.";
                    }
                    return;
                }

                if (!/^\+?[0-9\s-]{10,}$/.test(next.officialPhone)) {
                    if (message) {
                        message.className = "mpmla-profile-message error";
                        message.textContent = "Enter a valid official phone number.";
                    }
                    return;
                }

                saveMPMLAProfile(next);
                mpmlaProfileMode = "view";
                renderProfile();
                const savedMessage = document.getElementById("mpmlaProfileMessage");
                if (savedMessage) {
                    savedMessage.className = "mpmla-profile-message success";
                    savedMessage.textContent = "Profile saved successfully.";
                }
            }
        );

        document.getElementById("mpmlaCancelProfile")?.addEventListener(
            "click",
            function() {
                mpmlaProfileMode = "view";
                renderProfile();
            }
        );

    }


    function profileInfo(
        label,
        value
    ) {

        return `

            <div
                class="mpmla-info"
            >

                <small>
                    ${esc(label)}
                </small>

                <strong>
                    ${esc(value)}
                </strong>

            </div>

        `;

    }


    /* =====================================================
       SETTINGS
    ====================================================== */

    function renderSettings() {

        container.innerHTML = `

            <section
                class="mpmla-view"
            >

                <div
                    class="mpmla-heading"
                >

                    <span
                        class="mpmla-eyebrow"
                    >
                        PREFERENCES
                    </span>

                    <h1>
                        Settings
                    </h1>

                    <p>
                        Manage dashboard appearance
                        and language preferences.
                    </p>

                </div>


                <div
                    class="mpmla-setting-list"
                >

                    <div
                        class="mpmla-setting"
                    >

                        <div>

                            <strong>
                                Appearance
                            </strong>

                            <small>
                                Toggle the CivicAI light/dark theme.
                            </small>

                        </div>


                        <button
                            type="button"
                            id="mpmlaSettingTheme"
                        >
                            Toggle Theme
                        </button>

                    </div>


                    <div
                        class="mpmla-setting"
                    >

                        <div>

                            <strong>
                                Language
                            </strong>

                            <small>
                                Choose your preferred dashboard language.
                            </small>

                        </div>


                        <select
                            id="mpmlaSettingLanguage"
                            class="dashboard-language"
                        >

                            <option value="en">
                                English
                            </option>

                            <option value="ta">
                                தமிழ்
                            </option>

                            <option value="hi">
                                हिन्दी
                            </option>

                            <option value="te">
                                తెలుగు
                            </option>

                            <option value="ml">
                                മലയാളം
                            </option>

                            <option value="kn">
                                ಕನ್ನಡ
                            </option>

                            <option value="mr">
                                मराठी
                            </option>

                            <option value="bn">
                                বাংলা
                            </option>

                            <option value="gu">
                                ગુજરાતી
                            </option>

                        </select>

                    </div>

                </div>

            </section>

        `;


        const themeButton =
            document.getElementById(
                "mpmlaSettingTheme"
            );


        const language =
            document.getElementById(
                "mpmlaSettingLanguage"
            );


        if (language) {

            language.value =
                typeof AppState !==
                "undefined"
                    ? AppState.language
                    : "en";


            language.addEventListener(
                "change",
                function() {

                    if (
                        typeof setLanguage ===
                        "function"
                    ) {

                        setLanguage(
                            language.value
                        );

                    }

                }
            );

        }


        if (themeButton) {

            themeButton.addEventListener(
                "click",
                function() {

                    if (
                        typeof toggleTheme ===
                        "function"
                    ) {

                        toggleTheme();

                    }

                }
            );

        }

    }


    /* =====================================================
       NAVIGATION
       LOCAL MP/MLA ONLY
       DOES NOT TOUCH CITIZEN
    ====================================================== */

    page
        .querySelectorAll(
            "[data-mpmla-view]"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function(event) {

                        /*
                         * Stop the old global dashboard
                         * navigation from touching these
                         * MP/MLA buttons.
                         */

                        event.preventDefault();

                        event.stopPropagation();

                        showView(
                            button.dataset.mpmlaView
                        );

                    }
                );

            }
        );


    /* =====================================================
       HEADER NOTIFICATION
    ====================================================== */

    document
        .getElementById(
            "mpmlaNotificationButton"
        )
        ?.addEventListener(
            "click",
            function(event) {

                event.preventDefault();

                event.stopPropagation();

                showView(
                    "notifications"
                );

            }
        );


    /* =====================================================
       FIRST PAGE
    ====================================================== */

    showView(
        "overview"
    );

}
function initializeDepartmentDashboard() {

    console.log(
        "Department Dashboard initialized."
    );

    initializeBackButtons();
    ensureDemoState();
    renderDepartmentDashboard();

}


/* =========================================================
   31. BACK BUTTONS
   ========================================================= */

function initializeBackButtons() {

    const backButtons =
        document.querySelectorAll(
            "#backButton, #roleBackButton, .back-button, [data-back]"
        );


    backButtons.forEach(
        function(button) {

            button.onclick =
                function(event) {

                    event.preventDefault();

                    handleBackNavigation();

                };

        }
    );

}


/* =========================================================
   32. BACK NAVIGATION
   ========================================================= */

function handleBackNavigation() {

    switch (
        AppState.currentPage
    ) {


        case "role-selection":

            navigateTo(
                "welcome"
            );

            break;


        case "citizen-login":

            navigateTo(
                "role-selection"
            );

            break;


        case "citizen-register":

            navigateTo(
                "citizen-login"
            );

            break;


        case "mpmla-login":

            navigateTo(
                "role-selection"
            );

            break;


        case "department-login":

            navigateTo(
                "role-selection"
            );

            break;


        case "citizen-dashboard":

            if (
                sessionStorage.getItem(
                    "civicai-authenticated"
                ) === "true"
            ) {

                navigateTo(
                    "citizen-login"
                );

            } else {

                navigateTo(
                    "role-selection"
                );

            }

            break;


        case "mpmla-dashboard":

            navigateTo(
                "mpmla-login"
            );

            break;


        case "department-dashboard":

            navigateTo(
                "department-login"
            );

            break;


        default:

            navigateTo(
                "welcome"
            );

    }

}


/* =========================================================
   33. THEME INITIALIZATION
   ========================================================= */

function initializeTheme() {

    if (
        AppState.theme !== "light" &&
        AppState.theme !== "dark"
    ) {

        AppState.theme =
            "light";

    }


    applyTheme();

}


/* =========================================================
   34. SET THEME
   ========================================================= */

function setTheme(theme) {

    if (
        theme !== "light" &&
        theme !== "dark"
    ) {

        console.warn(
            "Invalid theme:",
            theme
        );

        return;

    }


    AppState.theme =
        theme;


    applyTheme();

}


/* =========================================================
   35. APPLY THEME
   ========================================================= */

function applyTheme() {

    document.documentElement.setAttribute(
        "data-theme",
        AppState.theme
    );


    document.body.setAttribute(
        "data-theme",
        AppState.theme
    );


    localStorage.setItem(
        "civicai-theme",
        AppState.theme
    );


    updateThemeUI();

}


/* =========================================================
   36. TOGGLE THEME
   ========================================================= */

function toggleTheme() {

    const newTheme =
        AppState.theme === "light"
            ? "dark"
            : "light";


    setTheme(
        newTheme
    );


    console.log(
        `CivicAI theme changed to ${newTheme}`
    );

}


/* =========================================================
   37. UPDATE THEME UI
   ========================================================= */

function updateThemeUI() {

    const themeIcon =
        document.getElementById(
            "themeIcon"
        );


    const themeLabel =
        document.getElementById(
            "themeLabel"
        );


    if (themeIcon) {

        themeIcon.textContent =
            AppState.theme === "light"
                ? "☾"
                : "☀";

    }


    if (themeLabel) {

        themeLabel.textContent =
            AppState.theme === "light"
                ? "Dark"
                : "Light";

    }


    const roleThemeIcon =
        document.getElementById(
            "roleThemeIcon"
        );


    const roleThemeLabel =
        document.getElementById(
            "roleThemeLabel"
        );


    if (roleThemeIcon) {

        roleThemeIcon.textContent =
            AppState.theme === "light"
                ? "☾"
                : "☀";

    }


    if (roleThemeLabel) {

        roleThemeLabel.textContent =
            AppState.theme === "light"
                ? "Dark"
                : "Light";

    }


    const themeToggle =
        document.getElementById(
            "themeToggle"
        );


    if (themeToggle) {

        themeToggle.setAttribute(
            "aria-label",
            AppState.theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
        );

    }


    const roleThemeToggle =
        document.getElementById(
            "roleThemeToggle"
        );


    if (roleThemeToggle) {

        roleThemeToggle.setAttribute(
            "aria-label",
            AppState.theme === "light"
                ? "Switch to dark mode"
                : "Switch to light mode"
        );

    }


    const mobileThemeToggle =
        document.getElementById(
            "mobileThemeToggle"
        );


    if (mobileThemeToggle) {

        mobileThemeToggle.textContent =
            AppState.theme === "light"
                ? "Switch to Dark Mode"
                : "Switch to Light Mode";

    }

}


/* =========================================================
   38. LANGUAGE INITIALIZATION
   ========================================================= */

function initializeLanguage() {

    if (
        !Object.prototype.hasOwnProperty.call(
            SupportedLanguages,
            AppState.language
        )
    ) {

        AppState.language =
            "en";

    }


    localStorage.setItem(
        "civicai-language",
        AppState.language
    );

}


/* =========================================================
   39. SET LANGUAGE
   ========================================================= */

function setLanguage(language) {

    if (
        !Object.prototype.hasOwnProperty.call(
            SupportedLanguages,
            language
        )
    ) {

        console.warn(
            "Unsupported language:",
            language
        );

        return;

    }


    AppState.language =
        language;


    localStorage.setItem(
        "civicai-language",
        language
    );


    updateLanguageSelectors();


    console.log(
        `CivicAI language:
        ${SupportedLanguages[language]}`
    );

}


/* =========================================================
   40. UPDATE LANGUAGE SELECTORS
   ========================================================= */

function updateLanguageSelectors() {

    const selectors =
        document.querySelectorAll(
            "#languageSelector, #mobileLanguageSelector, #roleLanguageSelector"
        );


    selectors.forEach(
        function(selector) {

            if (
                SupportedLanguages[
                    AppState.language
                ]
            ) {

                selector.value =
                    AppState.language;

            }

        }
    );

}


function handleLogout() {

    sessionStorage.removeItem(
        "civicai-authenticated"
    );

    sessionStorage.removeItem(
        "civicai-user-role"
    );

    sessionStorage.removeItem(
        "civicai-role"
    );

    AppState.currentRole = null;

    navigateTo(
        "welcome"
    );

}


function readLocalStorageJson(key, fallback) {

    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
        console.warn(`CivicAI storage read failed for ${key}.`, error);
        return fallback;
    }

}


function getMPMLAProfile() {

    const defaults = {
        role: "MP / MLA",
        officialEmail: "representative@civicai.gov",
        officialPhone: "+91 98765 43210",
        constituency: "Constituency 01",
        district: "District",
        accountStatus: "Active"
    };

    return {
        ...defaults,
        ...readLocalStorageJson("civicai-mpmla-profile", {})
    };

}


function saveMPMLAProfile(profile) {

    localStorage.setItem(
        "civicai-mpmla-profile",
        JSON.stringify(profile)
    );

}


function ensureDemoState() {

    const grievanceSeed = [
        {
            id: "CG-1001",
            subject: "Broken street light near Ward 12",
            category: "Infrastructure",
            location: "Ward 12, Ashok Vihar",
            date: "2026-08-01",
            status: "Submitted",
            priority: "High",
            department: "Public Works",
            description: "Street lighting has remained non-functional for over two weeks, creating safety issues for pedestrians and residents.",
            timeline: [
                { label: "Submitted", date: "2026-08-01" },
                { label: "Under Review", date: "2026-08-02" },
                { label: "Assigned", date: "2026-08-03" }
            ]
        },
        {
            id: "CG-1004",
            subject: "Water supply interruption",
            category: "Water Resources",
            location: "Sector 7, Gulmohar Colony",
            date: "2026-08-06",
            status: "In Progress",
            priority: "High",
            department: "Water Supply",
            description: "The colony has faced intermittent water flow during morning hours. Residents are unable to complete daily requirements.",
            timeline: [
                { label: "Submitted", date: "2026-08-06" },
                { label: "In Progress", date: "2026-08-07" },
                { label: "Site Inspection", date: "2026-08-08" }
            ]
        },
        {
            id: "CG-1008",
            subject: "Garbage collection delay",
            category: "Sanitation",
            location: "Main Market Road",
            date: "2026-08-11",
            status: "Resolved",
            priority: "Medium",
            department: "Sanitation",
            description: "Waste collection in the market area has been delayed for several days, creating health concerns and blocked pathways.",
            timeline: [
                { label: "Submitted", date: "2026-08-11" },
                { label: "Resolved", date: "2026-08-13" }
            ]
        }
    ];

    if (!localStorage.getItem("civicai-grievances")) {

        localStorage.setItem(
            "civicai-grievances",
            JSON.stringify(grievanceSeed)
        );

    }

    if (!localStorage.getItem("civicai-notifications")) {

        localStorage.setItem(
            "civicai-notifications",
            JSON.stringify([
                {
                    id: 1,
                    title: "Grievance status update",
                    message: "CG-1004 is now in progress and under field inspection.",
                    unread: true,
                    type: "grievance"
                },
                {
                    id: 2,
                    title: "Public service notice",
                    message: "New water supply maintenance is scheduled for the next two days.",
                    unread: false,
                    type: "announcement"
                },
                {
                    id: 3,
                    title: "Scheme round-up",
                    message: "New housing assistance applications are now open for eligible citizens.",
                    unread: true,
                    type: "scheme"
                }
            ])
        );

    }

    if (!localStorage.getItem("civicai-schemes")) {

        localStorage.setItem(
            "civicai-schemes",
            JSON.stringify([
                {
                    title: "Pradhan Mantri Awas Yojana",
                    category: "Housing",
                    eligibility: "Low-income families and eligible urban/rural households",
                    benefits: "Subsidised housing, home loan support and renovation assistance",
                    application: "Apply via local municipal office or online portal"
                },
                {
                    title: "PM-Kisan Samman Nidhi",
                    category: "Agriculture",
                    eligibility: "Registered small and marginal farmers",
                    benefits: "Seasonal financial assistance support",
                    application: "Through the government agriculture support portal"
                },
                {
                    title: "Ayushman Bharat",
                    category: "Healthcare",
                    eligibility: "Eligible families with government-issued identification",
                    benefits: "Cashless healthcare at empanelled hospitals",
                    application: "Apply or renew through the health portal"
                }
            ])
        );

    }

    if (!localStorage.getItem("civicai-services")) {

        localStorage.setItem(
            "civicai-services",
            JSON.stringify([
                {
                    title: "Property Tax Payment",
                    description: "Pay verified property taxes using secure digital service channels.",
                    category: "Finance"
                },
                {
                    title: "Water Connection Update",
                    description: "Request the status of household water connection approvals and service updates.",
                    category: "Utilities"
                },
                {
                    title: "Birth Certificate Assistance",
                    description: "Track application progress and receive service updates for civic records.",
                    category: "Records"
                }
            ])
        );

    }

    if (!localStorage.getItem("civicai-profile")) {

        const account = JSON.parse(
            localStorage.getItem("civicai-citizen-account") || "null"
        );

        localStorage.setItem(
            "civicai-profile",
            JSON.stringify({
                fullName: account?.fullName || "Aarav Sharma",
                mobile: account?.mobile || "9876543210",
                email: account?.email || "aarav.sharma@example.com",
                address: "12 Green Avenue, Sector 7",
                voterId: "ABC1234567",
                constituency: "Ward 12"
            })
        );

    }

}


function getDashboardGrievances() {

    try {

        return JSON.parse(
            localStorage.getItem("civicai-grievances") || "[]"
        );

    } catch (error) {

        return [];

    }

}


function getDashboardNotifications() {

    try {

        return JSON.parse(
            localStorage.getItem("civicai-notifications") || "[]"
        );

    } catch (error) {

        return [];

    }

}


function renderCitizenDashboard() {

    CitizenDashboardState.currentView = "overview";
    renderCitizenDashboardImproved();
    updateNotificationBadge();
    updateCitizenDashboardBackButton();
}


function renderCitizenGrievanceForm() {

    const container = document.getElementById("citizenDashboardContent");
    if (!container) return;

    container.innerHTML = `
        <section class="panel">
            <div class="panel-header">
                <h3>Report a problem</h3>
                <span class="pill">Easy & Quick</span>
            </div>
            <form id="citizenGrievanceForm">
                <div class="grievance-form-container">
                    <!-- Location Input -->
                    <div class="field" style="margin-bottom: 20px;">
                        <label for="grievanceLocation" style="font-size: 14px; font-weight: 500;">Where is the problem?</label>
                        <input 
                            id="grievanceLocation" 
                            type="text" 
                            placeholder="Enter location, ward, or area name..." 
                            required
                            aria-label="Location of grievance"
                        />
                    </div>

                    <!-- Description with Microphone Input -->
                    <div class="field" style="margin-bottom: 20px;">
                        <label for="grievanceDescription" style="font-size: 14px; font-weight: 500;">Describe the problem</label>
                        <div class="textarea-with-microphone">
                            <textarea 
                                id="grievanceDescription" 
                                placeholder="Describe what you're experiencing... You can type or use the microphone to speak." 
                                required
                                aria-label="Description of grievance"
                            ></textarea>
                            <button 
                                type="button" 
                                id="grievanceMicrophoneButton" 
                                class="microphone-button" 
                                aria-label="Start voice input"
                                title="Click to speak your issue"
                            >
                                🎤
                            </button>
                        </div>
                        <small style="display: block; margin-top: 8px; color: var(--text-muted);">💡 Microphone button lets you speak instead of typing</small>
                    </div>

                    <!-- AI Analysis Result (initially hidden) -->
                    <div id="grievanceAIResult" class="ai-result-panel" style="display: none; margin-bottom: 20px;">
                        <div class="ai-result-content">
                            <div class="result-header">
                                <span class="result-icon">🤖</span>
                                <span class="result-title">AI Analysis</span>
                            </div>
                            <div class="result-details">
                                <div class="result-item">
                                    <strong>Category</strong>
                                    <span id="aiCategory">--</span>
                                </div>
                                <div class="result-item">
                                    <strong>Department</strong>
                                    <span id="aiDepartment">--</span>
                                </div>
                                <div class="result-item">
                                    <strong>Priority</strong>
                                    <span id="aiPriority">--</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Error Message -->
                    <div id="grievanceMessage" role="alert" aria-live="polite" style="margin-bottom: 16px; padding: 12px; border-radius: 8px; display: none;"></div>

                    <!-- Submit Button -->
                    <button type="submit" class="form-submit" style="width: 100%;">Submit Grievance</button>
                </div>
            </form>
        </section>

        <section class="panel" style="margin-top: 20px;">
            <div class="panel-header">
                <h3>Recent submissions</h3>
                <span class="pill">${getDashboardGrievances().length} records</span>
            </div>
            <div class="table-grid">
                ${getDashboardGrievances().slice(0, 4).map((grievance) => `
                    <div class="table-row">
                        <strong>${grievance.id}</strong>
                       <span>${grievance.problem}</span>
                        <span>${grievance.category}</span>
                        <span>${grievance.status}</span>
                        <button type="button" class="detail-button" data-grievance-id="${grievance.id}">Open</button>
                    </div>
                `).join("") || '<div class="content-empty">No grievances submitted yet.</div>'}
            </div>
        </section>
    `;

    // Initialize voice input
    const recognition = initializeVoiceInput("grievanceDescription", AppState.language);
    
    // Microphone button handler
    const micButton = document.getElementById("grievanceMicrophoneButton");
    if (micButton && recognition) {
        micButton.addEventListener("click", function(e) {
            e.preventDefault();
            if (micButton.classList.contains("listening")) {
                stopVoiceInput(recognition);
            } else {
                startVoiceInput(recognition);
            }
        });
    } else if (micButton && !recognition) {
        micButton.style.opacity = "0.5";
        micButton.disabled = true;
        micButton.title = "Speech recognition not supported in this browser";
    }

    // Form submission
    const form = document.getElementById("citizenGrievanceForm");
    if (form) {
        form.dataset.analysisComplete = "false";

        form.addEventListener("submit", function(event) {
            event.preventDefault();

            const location = document.getElementById("grievanceLocation").value.trim();
            const description = document.getElementById("grievanceDescription").value.trim();
            const messageEl = document.getElementById("grievanceMessage");

            if (!location || !description) {
                if (messageEl) {
                    messageEl.style.display = "block";
                    messageEl.style.backgroundColor = "rgba(216, 90, 103, 0.1)";
                    messageEl.style.borderLeft = "4px solid var(--danger)";
                    messageEl.style.color = "var(--danger)";
                    messageEl.textContent = "Please fill in all required fields.";
                }
                return;
            }

            if (form.dataset.analysisComplete === "true" && form.analysisResult) {
                submitGrievanceWithAnalysis(
                    description,
                    location,
                    form.analysisResult
                );
                return;
            }

            performAIGrievanceAnalysis(description, location);
        });
    }

    bindSidebarNavigation();
}

function performAIGrievanceAnalysis(description, location) {

    // Show processing state
    const messageEl = document.getElementById("grievanceMessage");
    if (messageEl) {
        messageEl.style.display = "block";
        messageEl.style.backgroundColor = "rgba(74, 144, 226, 0.1)";
        messageEl.style.borderLeft = "4px solid var(--info)";
        messageEl.style.color = "var(--info)";
        messageEl.textContent = "🔍 Analyzing your grievance...";
    }

    // Simulate backend AI analysis (demo logic)
    setTimeout(function() {
        
        const analysis = analyzeGrievanceDescription(description);
        
        // Display AI result
        const resultPanel = document.getElementById("grievanceAIResult");
        if (resultPanel) {
            document.getElementById("aiCategory").textContent = analysis.category;
            document.getElementById("aiDepartment").textContent = analysis.department;
            document.getElementById("aiPriority").textContent = analysis.priority;
            resultPanel.style.display = "block";
        }

        if (messageEl) {
            messageEl.style.display = "none";
        }

        // Update submit button to finalize
        const form = document.getElementById("citizenGrievanceForm");
        if (form) {
            form.dataset.analysisComplete = "true";
            form.analysisResult = analysis;

            const submitBtn = form.querySelector("[type='submit']");
            if (submitBtn) {
                submitBtn.textContent = "Submit & Track Grievance";
            }
        }

    }, 1200);
}

function analyzeGrievanceDescription(description) {

    const descLower = description.toLowerCase();
    const categories = {
        "Infrastructure": ["road", "street", "pavement", "pothole", "light", "lamp", "electricity", "power", "electricity"],
        "Water Resources": ["water", "tap", "supply", "pipe", "leak", "drainage", "sewage"],
        "Sanitation": ["garbage", "waste", "clean", "sweeping", "debris", "trash", "dump"],
        "Transport": ["traffic", "bus", "auto", "vehicle", "parking", "congestion"],
        "Public Safety": ["crime", "police", "theft", "safety", "security"],
        "Healthcare": ["hospital", "clinic", "doctor", "medicine", "health"],
        "Education": ["school", "college", "student", "education"]
    };

    let detectedCategory = "General";
    for (const [cat, keywords] of Object.entries(categories)) {
        if (keywords.some((kw) => descLower.includes(kw))) {
            detectedCategory = cat;
            break;
        }
    }

    const departmentMap = {
        "Infrastructure": "Public Works Department",
        "Water Resources": "Water Supply Department",
        "Sanitation": "Municipal Sanitation",
        "Transport": "Transport Authority",
        "Public Safety": "Police Department",
        "Healthcare": "Health Department",
        "Education": "Education Department",
        "General": "Citizen Services"
    };

    const priorityKeywords = {
        "Urgent": ["urgent", "emergency", "critical", "danger", "dangerous", "immediately", "severe", "accident"],
        "High": ["broken", "blocked", "damaged", "serious", "problem", "issue"],
        "Medium": ["minor", "small", "needs", "help"]
    };

    let priority = "Medium";
    for (const [level, keywords] of Object.entries(priorityKeywords)) {
        if (keywords.some((kw) => descLower.includes(kw))) {
            priority = level;
            break;
        }
    }

    return {
        category: detectedCategory,
        department: departmentMap[detectedCategory] || "Citizen Services",
        priority: priority
    };
}

async function submitGrievanceWithAnalysis(description, location, analysis) {

    const messageEl =
        document.getElementById("grievanceMessage");

    if (messageEl) {
        messageEl.style.display = "block";
        messageEl.style.backgroundColor = "rgba(39, 139, 104, 0.1)";
        messageEl.style.borderLeft = "4px solid var(--success)";
        messageEl.style.color = "var(--success)";
        messageEl.textContent = "🔄 Submitting your grievance...";
    }

    try {

        const citizen =
            JSON.parse(
                sessionStorage.getItem("civicai-citizen") || "{}"
            );

        const mobile = citizen.mobile || "";

        if (!mobile) {
            if (messageEl) {
                messageEl.textContent =
                    "Please log in again before submitting a grievance.";
            }
            return;
        }

        const response = await fetch(
            "https://multilingual-ai-backend.onrender.com/api/grievances",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    mobile: mobile,
                    problem: description,
                    problemLocation: location,
                    category: analysis.category || "Other",
                    priority: analysis.priority || "Medium"
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.detail || "Grievance submission failed."
            );
        }

        const complaintId = data.complaintId;

        // Keep the dashboard UI in sync
        const existing = getDashboardGrievances();

        const entry = {
            id: complaintId,
            subject: generateSubjectFromDescription(description),
            category: analysis.category || "Other",
            location: location,
            description: description,
            priority: analysis.priority || "Medium",
            department: analysis.department || "Other",
            status: data.complaintStatus || "Pending",
            date: new Date().toISOString().slice(0, 10),
            timeline: [
                {
                    label: "Submitted",
                    date: new Date().toISOString().slice(0, 10)
                }
            ]
        };

        existing.unshift(entry);

        localStorage.setItem(
            "civicai-grievances",
            JSON.stringify(existing)
        );

        // Add notification
        const notifications = getDashboardNotifications();

        notifications.unshift({
            id: Date.now(),
            title: "Grievance submitted successfully",
            message:
                `Your grievance ${complaintId} has been received and is pending department action.`,
            unread: true,
            type: "grievance"
        });

        localStorage.setItem(
            "civicai-notifications",
            JSON.stringify(notifications)
        );

        updateNotificationBadge();

        if (messageEl) {
            messageEl.textContent =
                `✅ Grievance ${complaintId} submitted successfully!`;
        }

        setTimeout(function() {
            renderCitizenDashboard();
        }, 1200);

    } catch (error) {

        console.error(
            "Grievance submission error:",
            error
        );

        if (messageEl) {
            messageEl.style.display = "block";
            messageEl.style.backgroundColor =
                "rgba(216, 90, 103, 0.1)";
            messageEl.style.borderLeft =
                "4px solid var(--danger)";
            messageEl.style.color =
                "var(--danger)";

            messageEl.textContent =
                "Unable to submit grievance. Please try again.";
        }
    }
}
function generateSubjectFromDescription(description) {

    const words = description.trim().split(" ");
    const subject = words.slice(0, Math.min(8, words.length)).join(" ");
    return subject.length > 0 ? subject : "New Grievance";
}


async function renderCitizenGrievances() {

    const container = document.getElementById("citizenDashboardContent");
    if (!container) return;
    const response = await fetch("https://multilingual-ai-backend.onrender.com/api/grievances"); const data = await response.json(); const grievances = data.grievances || [];

    container.innerHTML = `
        <section class="panel">
            <div class="panel-header">
                <h3>My grievances</h3>
                <span class="pill">${grievances.length} total</span>
            </div>
            <div class="table-grid">
                ${grievances.map((grievance) => `
                    <div class="table-row">
                        <strong>${grievance.id}</strong>
                        <span>${grievance.problem}</span>
                        <span>${grievance.category}</span>
                        <span>${grievance.status}</span>
                        <button type="button" class="detail-button" data-grievance-id="${grievance.id}">View</button>
                    </div>
                `).join("") || '<div class="content-empty">No grievances yet.</div>'}
            </div>
        </section>
    `;

    bindSidebarNavigation();
    bindGrievanceViewButtons();
}


async function renderCitizenTracking() {

    const container = document.getElementById("citizenDashboardContent");
    if (!container) return;
    
const response = await fetch("https://multilingual-ai-backend.onrender.com/api/grievances");
const data = await response.json();
const grievances = data.grievances || [];
    const first = grievances[0];

    if (!first) {
        container.innerHTML = `
            <section class="panel">
                <div class="panel-header">
                    <h3>Grievance tracking</h3>
                    <span class="pill">Timeline</span>
                </div>
                <div class="content-empty">No grievance is currently available for tracking.</div>
            </section>
        `;
        bindSidebarNavigation();
        return;
    }

    container.innerHTML = `
        <section class="panel">
            <div class="panel-header">
                <div>
                    <h3>${first.subject}</h3>
                    <div style="margin-top: 8px; color: var(--text-secondary); font-size: 14px;">
                        ID: <strong>${first.id}</strong> • Location: <strong>${first.location}</strong>
                    </div>
                </div>
                <span class="tag ${first.status.toLowerCase().replace(/\s+/g, '-')}">${first.status}</span>
            </div>

            <!-- 3D Timeline Visualization -->
            ${renderTimeline3D(first)}

            <!-- Detailed Timeline -->
            <div style="margin-top: 30px;">
                <h4 style="margin-bottom: 16px;">Timeline History</h4>
                <div class="timeline-details">
                    ${(first.timeline || []).map((step, index) => `
                        <div class="timeline-detail-item">
                            <div class="detail-marker">
                                <span class="marker-icon">${index === 0 ? '📝' : index === (first.timeline.length - 1) ? '✅' : '⏳'}</span>
                            </div>
                            <div class="detail-content">
                                <strong>${step.label}</strong>
                                <div style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">${step.date}</div>
                                ${step.response ? `<div style="margin-top: 8px; padding: 8px; background: var(--surface-soft); border-radius: 8px; font-size: 12px; color: var(--text-secondary);">${step.response}</div>` : ''}
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>

            <!-- Grievance Details -->
            <div style="margin-top: 30px;">
                <h4 style="margin-bottom: 16px;">Grievance Details</h4>
                <div class="details-grid">
                    <div class="detail-box">
                        <small>Category</small>
                        <strong>${first.category}</strong>
                    </div>
                    <div class="detail-box">
                        <small>Department</small>
                        <strong>${first.department || "Processing"}</strong>
                    </div>
                    <div class="detail-box">
                        <small>Priority</small>
                        <strong>${first.priority || "Medium"}</strong>
                    </div>
                    <div class="detail-box">
                        <small>Submitted Date</small>
                        <strong>${first.date}</strong>
                    </div>
                </div>
                <div style="margin-top: 16px; padding: 14px; background: var(--surface-soft); border-radius: 12px;">
                    <small style="color: var(--text-muted);">Description</small>
                    <p style="margin-top: 8px; color: var(--text-secondary);">${first.description}</p>
                </div>
            </div>
        </section>
    `;

    bindSidebarNavigation();
}


function renderSchemes() {

    const container = document.getElementById("citizenDashboardContent");
    if (!container) return;
    const schemes = JSON.parse(localStorage.getItem("civicai-schemes") || "[]");

    container.innerHTML = `
        <section class="panel">
            <div class="panel-header">
                <h3>Government schemes</h3>
                <span class="pill">Search ready</span>
            </div>
            <div class="scheme-grid">
                ${schemes.map((scheme) => `
                    <article class="scheme-card">
                        <span class="pill">${scheme.category}</span>
                        <h4 style="margin-top: 12px;">${scheme.title}</h4>
                        <p style="color: var(--text-secondary); margin: 8px 0 12px;">${scheme.benefits}</p>
                        <p><strong>Eligibility:</strong> ${scheme.eligibility}</p>
                        <p style="margin-top: 8px;"><strong>Application:</strong> ${scheme.application}</p>
                    </article>
                `).join("") || '<div class="content-empty">No schemes available.</div>'}
            </div>
        </section>
    `;

    bindSidebarNavigation();
}


function renderServices() {

    const container = document.getElementById("citizenDashboardContent");
    if (!container) return;
    const services = JSON.parse(localStorage.getItem("civicai-services") || "[]");

    container.innerHTML = `
        <section class="panel">
            <div class="panel-header">
                <h3>Government services</h3>
                <span class="pill">Available now</span>
            </div>
            <div class="service-grid">
                ${services.map((service) => `
                    <article class="service-card">
                        <span class="pill">${service.category}</span>
                        <h4 style="margin-top: 12px;">${service.title}</h4>
                        <p style="color: var(--text-secondary);">${service.description}</p>
                        <button type="button" class="mini-button" style="margin-top: 12px;" data-service-index="${services.indexOf(service)}">View details</button>
                    </article>
                `).join("") || '<div class="content-empty">No services available.</div>'}
            </div>
        </section>
    `;

    bindCitizenServiceButtons(services);
    bindSidebarNavigation();
}


function bindCitizenServiceButtons(services) {

    document
        .querySelectorAll("#citizenDashboardContent [data-service-index]")
        .forEach((button) => {
            button.addEventListener("click", function() {
                const service = services[Number(button.dataset.serviceIndex)];
                if (!service) {
                    return;
                }

                setCitizenDashboardView("service-detail");
                renderCitizenServiceDetail(service);
            });
        });

}


function renderCitizenServiceDetail(service) {

    const container = document.getElementById("citizenDashboardContent");
    if (!container || !service) {
        return;
    }

    container.innerHTML = `
        <section class="panel dashboard-detail-view">
            <div class="panel-header">
                <div>
                    <span class="pill">Government service</span>
                    <h3>${mpmlaEscape(service.title)}</h3>
                </div>
                <span class="pill">${mpmlaEscape(service.category)}</span>
            </div>
            <div class="content-empty">
                <p>${mpmlaEscape(service.description)}</p>
                <p style="margin-top: 10px;">This service detail is available in the CivicAI prototype. Continue through the relevant government channel for the next step.</p>
            </div>
        </section>
    `;

    updateCitizenDashboardBackButton();
}


function renderNotifications() {

    const container = document.getElementById("citizenDashboardContent");
    if (!container) return;
    const notifications = getDashboardNotifications();

    container.innerHTML = `
        <section class="panel">
            <div class="panel-header">
                <h3>Notifications</h3>
                <span class="pill">${notifications.filter((item) => item.unread).length} unread</span>
            </div>
            <div class="notification-list">
                ${notifications.map((item) => `
                    <div class="notification-item ${item.unread ? "unread" : ""}">
                        <div class="notification-meta">
                            <strong>${item.title}</strong>
                            <span class="pill">${item.type}</span>
                        </div>
                        <p style="color: var(--text-secondary);">${item.message}</p>
                        <button type="button" class="mini-button" data-notification-id="${item.id}">${item.unread ? "Mark as read" : "Read"}</button>
                    </div>
                `).join("") || '<div class="content-empty">No notifications available.</div>'}
            </div>
        </section>
    `;

    const buttons = container.querySelectorAll("[data-notification-id]");
    buttons.forEach((button) => {
        button.addEventListener("click", function() {
            const notifications = getDashboardNotifications();
            const next = notifications.map((item) => item.id === Number(button.dataset.notificationId) ? { ...item, unread: false } : item);
            localStorage.setItem("civicai-notifications", JSON.stringify(next));
            renderNotifications();
        });
    });

    bindSidebarNavigation();
}


function renderCitizenProfile() {

    const container = document.getElementById("citizenDashboardContent");
    if (!container) return;

    const profile = {
        fullName: "",
        mobile: "",
        email: "",
        address: "",
        constituency: "",
        ...readLocalStorageJson("civicai-profile", {})
    };

    container.innerHTML = `
        <section class="panel">
            <div class="panel-header">
                <div>
                    <span class="pill">Citizen account</span>
                    <h3>Profile</h3>
                </div>
                <span class="pill">Editable</span>
            </div>
            <div class="profile-grid">
                <div class="field">
                    <label for="citizenProfileFullName">Name</label>
                    <input id="citizenProfileFullName" data-citizen-profile-field="fullName" value="${mpmlaEscape(profile.fullName)}" autocomplete="name">
                </div>
                <div class="field">
                    <label for="citizenProfileMobile">Mobile</label>
                    <input id="citizenProfileMobile" data-citizen-profile-field="mobile" value="${mpmlaEscape(profile.mobile)}" inputmode="numeric" autocomplete="tel">
                </div>
                <div class="field">
                    <label for="citizenProfileEmail">Email</label>
                    <input id="citizenProfileEmail" data-citizen-profile-field="email" value="${mpmlaEscape(profile.email)}" type="email" autocomplete="email">
                </div>
                <div class="field">
                    <label for="citizenProfileConstituency">Constituency</label>
                    <input id="citizenProfileConstituency" data-citizen-profile-field="constituency" value="${mpmlaEscape(profile.constituency)}">
                </div>
                <div class="field" style="grid-column: 1 / -1;">
                    <label for="citizenProfileAddress">Address</label>
                    <input id="citizenProfileAddress" data-citizen-profile-field="address" value="${mpmlaEscape(profile.address)}" autocomplete="street-address">
                </div>
            </div>
            <button type="button" class="form-submit" id="saveCitizenProfileButton">Save changes</button>
            <div class="citizen-profile-message" id="citizenProfileMessage" role="status" aria-live="polite"></div>
        </section>
    `;

    document.getElementById("saveCitizenProfileButton")?.addEventListener("click", function() {
        const next = { ...profile };
        container.querySelectorAll("[data-citizen-profile-field]").forEach((input) => {
            next[input.getAttribute("data-citizen-profile-field")] = input.value.trim();
        });

        const message = document.getElementById("citizenProfileMessage");
        if (!next.fullName || !next.mobile || !next.email || !next.address || !next.constituency) {
            if (message) {
                message.className = "citizen-profile-message error";
                message.textContent = "Please complete all profile fields.";
            }
            return;
        }

        if (!/^\d{10}$/.test(next.mobile)) {
            if (message) {
                message.className = "citizen-profile-message error";
                message.textContent = "Enter a valid 10-digit mobile number.";
            }
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.email)) {
            if (message) {
                message.className = "citizen-profile-message error";
                message.textContent = "Enter a valid email address.";
            }
            return;
        }

        localStorage.setItem("civicai-profile", JSON.stringify(next));
        renderCitizenProfile();
        const savedMessage = document.getElementById("citizenProfileMessage");
        if (savedMessage) {
            savedMessage.className = "citizen-profile-message success";
            savedMessage.textContent = "Profile saved successfully.";
        }
    });

    bindSidebarNavigation();
}


function renderSettings() {

    const container = document.getElementById("citizenDashboardContent");
    if (!container) return;

    container.innerHTML = `
        <section class="panel">
            <div class="panel-header">
                <h3>Settings</h3>
                <span class="pill">Preferences</span>
            </div>
            <div class="profile-grid">
                <div class="field"><label>Theme</label><select id="settingsTheme"><option value="light">Light</option><option value="dark">Dark</option></select></div>
                <div class="field"><label>Language</label><select id="settingsLanguage"><option value="en">English</option><option value="ta">தமிழ்</option><option value="hi">हिन्दी</option><option value="te">తెలుగు</option><option value="ml">മലയാളം</option><option value="kn">ಕನ್ನಡ</option><option value="mr">मराठी</option><option value="bn">বাংলা</option><option value="gu">ગુજરાતી</option></select></div>
            </div>
            <button type="button" class="form-submit" id="saveSettingsButton">Apply settings</button>
        </section>
    `;

    const settingsTheme = document.getElementById("settingsTheme");
    const settingsLanguage = document.getElementById("settingsLanguage");
    if (settingsTheme) settingsTheme.value = AppState.theme;
    if (settingsLanguage) settingsLanguage.value = AppState.language;

    const saveSettingsButton = document.getElementById("saveSettingsButton");
    if (saveSettingsButton) {
        saveSettingsButton.addEventListener("click", function() {
            if (settingsTheme) setTheme(settingsTheme.value);
            if (settingsLanguage) setLanguage(settingsLanguage.value);
            renderSettings();
        });
    }

    bindSidebarNavigation();
}

/* =========================================================
   MP / MLA DASHBOARD
========================================================= */

function renderMPMLADashboard() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }

    setMPMLAActiveView("overview");

    renderMPMLAOverview();

    bindSidebarNavigation();

    bindMPMLAHeaderActions();

}


function bindMPMLAHeaderActions() {

    const button =
        document.getElementById(
            "mpmlaNotificationButton"
        );

    if (
        !button ||
        button.dataset.bound === "true"
    ) {
        return;
    }

    button.dataset.bound = "true";

    button.addEventListener(
        "click",
        function(event) {

            event.preventDefault();
            event.stopPropagation();

            setMPMLAActiveView(
                "notifications"
            );

            renderMPMLANotifications();

        }
    );

}


/* =========================================================
   OVERVIEW
========================================================= */

function renderMPMLAOverview() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }


    const grievances =
        getDashboardGrievances();


    const total =
        grievances.length;


    const pending =
        grievances.filter(
            function(item) {
                return [
                    "Submitted",
                    "Under Review"
                ].includes(item.status);
            }
        ).length;


    const inProgress =
        grievances.filter(
            function(item) {
                return item.status ===
                    "In Progress";
            }
        ).length;


    const resolved =
        grievances.filter(
            function(item) {
                return item.status ===
                    "Resolved";
            }
        ).length;


    const highPriority =
        grievances.filter(
            function(item) {
                return item.priority ===
                    "High";
            }
        ).length;


    const rate =
        total
            ? Math.round(
                (resolved / total) * 100
            ) + "%"
            : "78%";


    const counts = {};


    grievances.forEach(
        function(item) {

            const key =
                item.category ||
                "Infrastructure";


            counts[key] =
                (counts[key] || 0) + 1;

        }
    );


    const issues =
        Object.entries(counts)
            .sort(
                function(a,b) {
                    return b[1] - a[1];
                }
            )
            .slice(0,4);


    const fallback = [
        ["Road & Infrastructure",38],
        ["Water Supply",27],
        ["Electricity",18],
        ["Sanitation",11]
    ];


    const departments =
        getMPMLADepartmentData()
            .slice(0,4);


    container.innerHTML = `

        <section class="mpmla-view">

            <div class="mpmla-welcome">

                <span class="mpmla-welcome-tag">
                    REPRESENTATIVE OVERVIEW
                </span>

                <h1>
                    Good morning, Representative
                </h1>

                <p>
                    Monitor constituency complaints,
                    identify priority areas and track
                    department response from one CivicAI workspace.
                </p>

            </div>


            <div class="mpmla-stat-grid">

                ${mpmlaStatCard(
                    "📋",
                    "Total Complaints",
                    total,
                    "Across constituency"
                )}

                ${mpmlaStatCard(
                    "⚠",
                    "Pending Issues",
                    pending,
                    "Awaiting review"
                )}

                ${mpmlaStatCard(
                    "⚙",
                    "In Progress",
                    inProgress,
                    "With departments"
                )}

                ${mpmlaStatCard(
                    "✓",
                    "Resolved",
                    resolved,
                    "Completed issues"
                )}

            </div>


            <div class="mpmla-two-column">


                <section class="mpmla-panel">

                    <div class="mpmla-panel-head">

                        <h3>
                            Top Issues &amp; Trends
                        </h3>

                        <span class="mpmla-pill">
                            AI ANALYSIS
                        </span>

                    </div>


                    <div class="mpmla-issue-list">

                        ${
                            (
                                issues.length
                                    ? issues
                                    : fallback
                            )
                            .map(
                                function(item,index) {

                                    const name =
                                        item[0];

                                    const pct =
                                        total
                                            ? Math.max(
                                                8,
                                                Math.round(
                                                    (
                                                        item[1]
                                                        /
                                                        total
                                                    ) * 100
                                                )
                                            )
                                            : fallback[index][1];


                                    return `

                                        <div
                                            class="mpmla-issue"
                                        >

                                            <div
                                                class="mpmla-issue-top"
                                            >

                                                <strong>
                                                    ${mpmlaEscape(name)}
                                                </strong>

                                                <span>
                                                    ${pct}%
                                                </span>

                                            </div>


                                            <div
                                                class="mpmla-progress"
                                            >

                                                <span
                                                    style="
                                                        width:${pct}%
                                                    "
                                                ></span>

                                            </div>

                                        </div>

                                    `;

                                }
                            )
                            .join("")
                        }

                    </div>

                </section>


                <section class="mpmla-panel">

                    <div class="mpmla-panel-head">

                        <h3>
                            Department Performance
                        </h3>

                        <span class="mpmla-pill">
                            LIVE
                        </span>

                    </div>


                    <div class="mpmla-dept-list">

                        ${
                            departments
                                .map(
                                    function(item) {

                                        return `

                                            <div
                                                class="mpmla-dept-row"
                                            >

                                                <div>

                                                    <strong>
                                                        ${mpmlaEscape(
                                                            item.name
                                                        )}
                                                    </strong>

                                                    <small>
                                                        ${item.active}
                                                        active complaints
                                                    </small>

                                                </div>

                                                <span
                                                    class="mpmla-dept-score"
                                                >
                                                    ${item.performance}%
                                                </span>

                                            </div>

                                        `;

                                    }
                                )
                                .join("")
                        }

                    </div>

                </section>

            </div>


            <section class="mpmla-panel">

                <div class="mpmla-panel-head">

                    <h3>
                        Priority Snapshot
                    </h3>

                    <span class="mpmla-pill">
                        ${highPriority} HIGH PRIORITY
                    </span>

                </div>


                <div class="mpmla-kpi-grid">

                    ${mpmlaKpi(
                        "High priority",
                        highPriority,
                        "Needs attention"
                    )}

                    ${mpmlaKpi(
                        "Hotspot wards",
                        12,
                        "Concentration areas"
                    )}

                    ${mpmlaKpi(
                        "Resolution rate",
                        rate,
                        "Current performance"
                    )}

                    ${mpmlaKpi(
                        "Response SLA",
                        "3d",
                        "Target average"
                    )}

                </div>

            </section>

        </section>

    `;

}


/* =========================================================
   CITIZEN GRIEVANCES
========================================================= */

function renderMPMLAGrievances() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }


    const grievances =
        getDashboardGrievances();


    container.innerHTML = `

        <section class="mpmla-view">

            <div class="mpmla-heading">

                <span class="mpmla-eyebrow">
                    CONSTITUENCY CASELOAD
                </span>

                <h1>
                    Citizen Grievances
                </h1>

                <p>
                    Review incoming citizen complaints,
                    priority, location and workflow status.
                </p>

            </div>


            <section class="mpmla-panel">

                <div class="mpmla-panel-head">

                    <h3>
                        Grievance Queue
                    </h3>

                    <span class="mpmla-pill">
                        ${grievances.length} CASES
                    </span>

                </div>


                <div class="mpmla-complaint-table">

                    <div
                        class="mpmla-complaint-row head"
                    >

                        <span>ID</span>
                        <span>Complaint</span>
                        <span>Location</span>
                        <span>Status</span>
                        <span>Open</span>

                    </div>


                    ${
                        grievances
                            .map(
                                function(item) {

                                    return `

                                        <div
                                            class="
                                                mpmla-complaint-row
                                            "
                                        >

                                            <strong>
                                                ${mpmlaEscape(
                                                    item.id
                                                )}
                                            </strong>

                                            <span>
                                                ${mpmlaEscape(
                                                    item.subject
                                                )}
                                            </span>

                                            <span>
                                                ${mpmlaEscape(
                                                    item.location ||
                                                    "Not specified"
                                                )}
                                            </span>

                                            <span
                                                class="
                                                    tag
                                                    ${mpmlaStatusClass(
                                                        item.status
                                                    )}
                                                "
                                            >
                                                ${mpmlaEscape(
                                                    item.status
                                                )}
                                            </span>

                                            <button
                                                type="button"
                                                class="mpmla-complaint-open"
                                                data-mpmla-grievance-id="${mpmlaEscape(
                                                    item.id
                                                )}"
                                            >
                                                Open
                                            </button>

                                        </div>

                                    `;

                                }
                            )
                            .join("")

                        ||

                        `
                            <div class="content-empty">
                                No citizen grievances are available.
                            </div>
                        `
                    }

                </div>

            </section>

        </section>

    `;


    bindMPMLAGrievanceButtons();

}


/* =========================================================
   ANALYTICS
========================================================= */

function renderMPMLAAnalytics() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }


    const chart = [

        ["Mar",58],
        ["Apr",72],
        ["May",66],
        ["Jun",89],
        ["Jul",82],
        ["Aug",104]

    ];


    const max =
        Math.max(
            ...chart.map(
                function(item) {
                    return item[1];
                }
            )
        );


    container.innerHTML = `

        <section class="mpmla-view">

            <div class="mpmla-heading">

                <span class="mpmla-eyebrow">
                    CONSTITUENCY INTELLIGENCE
                </span>

                <h1>
                    Constituency Analytics
                </h1>

                <p>
                    Complaint volume, resolution
                    performance and monthly movement
                    across the constituency.
                </p>

            </div>


            <div class="mpmla-kpi-grid">

                ${mpmlaKpi(
                    "Complaint volume",
                    "1,284",
                    "+8.4%"
                )}

                ${mpmlaKpi(
                    "Resolved",
                    "998",
                    "78%"
                )}

                ${mpmlaKpi(
                    "Average resolution",
                    "4.8d",
                    "-11%"
                )}

                ${mpmlaKpi(
                    "Active departments",
                    "8",
                    "100%"
                )}

            </div>


            <section class="mpmla-chart-panel">

                <div class="mpmla-panel-head">

                    <div>

                        <h3>
                            Monthly Complaint Trend
                        </h3>

                        <p>
                            Complaints received by month
                        </p>

                    </div>

                    <span class="mpmla-pill">
                        6 MONTHS
                    </span>

                </div>


                <div class="mpmla-chart-grid">

                    ${
                        chart
                            .map(
                                function(item) {

                                    const month =
                                        item[0];

                                    const value =
                                        item[1];

                                    const height =
                                        Math.round(
                                            (
                                                value
                                                /
                                                max
                                            ) * 100
                                        );


                                    return `

                                        <div
                                            class="
                                                mpmla-bar-column
                                            "
                                        >

                                            <span
                                                class="
                                                    mpmla-bar-value
                                                "
                                            >
                                                ${value}
                                            </span>


                                            <div
                                                class="
                                                    mpmla-bar-track
                                                "
                                            >

                                                <span
                                                    class="
                                                        mpmla-bar
                                                    "
                                                    style="
                                                        height:${height}%
                                                    "
                                                ></span>

                                            </div>


                                            <span
                                                class="
                                                    mpmla-bar-label
                                                "
                                            >
                                                ${month}
                                            </span>

                                        </div>

                                    `;

                                }
                            )
                            .join("")
                    }

                </div>


                <div class="mpmla-summary-grid">

                    <div class="mpmla-summary">
                        <small>Highest month</small>
                        <strong>Aug · 104</strong>
                    </div>

                    <div class="mpmla-summary">
                        <small>Lowest month</small>
                        <strong>Mar · 58</strong>
                    </div>

                    <div class="mpmla-summary">
                        <small>Growth</small>
                        <strong>+79%</strong>
                    </div>

                </div>

            </section>

        </section>

    `;

}


/* =========================================================
   TOP ISSUES
========================================================= */

function renderMPMLAIssues() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }


    const issues = [

        [
            "Road & Infrastructure",
            482,
            "HIGH"
        ],

        [
            "Water Supply",
            347,
            "HIGH"
        ],

        [
            "Electricity",
            231,
            "MEDIUM"
        ],

        [
            "Sanitation",
            142,
            "MEDIUM"
        ],

        [
            "Public Transport",
            82,
            "LOW"
        ]

    ];


    container.innerHTML = `

        <section class="mpmla-view">

            <div class="mpmla-heading">

                <span class="mpmla-eyebrow">
                    ISSUE MONITORING
                </span>

                <h1>
                    Top Issues &amp; Trends
                </h1>

                <p>
                    AI-ranked civic issues across
                    the constituency.
                </p>

            </div>


            <div class="mpmla-trend-list">

                ${
                    issues
                        .map(
                            function(item) {

                                return `

                                    <article
                                        class="
                                            mpmla-panel
                                            mpmla-trend
                                        "
                                    >

                                        <div>

                                            <strong>
                                                ${mpmlaEscape(
                                                    item[0]
                                                )}
                                            </strong>

                                            <small>
                                                ${item[1]}
                                                complaints currently tracked
                                            </small>

                                        </div>

                                        <span
                                            class="
                                                mpmla-trend-score
                                            "
                                        >
                                            ${item[2]}
                                        </span>

                                    </article>

                                `;

                            }
                        )
                        .join("")
                }

            </div>

        </section>

    `;

}


/* =========================================================
   DEPARTMENT PERFORMANCE
========================================================= */

function renderMPMLADepartments() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }


    const departments =
        getMPMLADepartmentData();


    container.innerHTML = `

        <section class="mpmla-view">

            <div class="mpmla-heading">

                <span class="mpmla-eyebrow">
                    PERFORMANCE INTELLIGENCE
                </span>

                <h1>
                    Department Performance
                </h1>

                <p>
                    Compare response quality,
                    resolution rate and average
                    resolution time.
                </p>

            </div>


            <div class="mpmla-3d-grid">

                ${
                    departments
                        .map(
                            function(item) {

                                return `

                                    <article
                                        class="
                                            mpmla-3d-card
                                        "
                                    >

                                        <div
                                            class="
                                                mpmla-3d-top
                                            "
                                        >

                                            <div
                                                class="
                                                    mpmla-3d-icon
                                                "
                                            >
                                                ▦
                                            </div>

                                            <span
                                                class="
                                                    mpmla-performance
                                                "
                                            >
                                                ${item.performance}%
                                                PERFORMANCE
                                            </span>

                                        </div>


                                        <h3>
                                            ${mpmlaEscape(
                                                item.name
                                            )}
                                        </h3>


                                        <p>
                                            ${item.active}
                                            assigned complaints
                                        </p>


                                        <div
                                            class="
                                                mpmla-3d-progress
                                            "
                                        >

                                            <div
                                                class="
                                                    mpmla-3d-progress-top
                                                "
                                            >

                                                <span>
                                                    Resolution performance
                                                </span>

                                                <strong>
                                                    ${item.performance}%
                                                </strong>

                                            </div>


                                            <div
                                                class="
                                                    mpmla-3d-track
                                                "
                                            >

                                                <span
                                                    style="
                                                        width:${item.performance}%
                                                    "
                                                ></span>

                                            </div>

                                        </div>


                                        <div
                                            class="
                                                mpmla-3d-footer
                                            "
                                        >

                                            <span>
                                                Average resolution
                                            </span>

                                            <strong>
                                                ${item.avg}
                                            </strong>

                                        </div>

                                    </article>

                                `;

                            }
                        )
                        .join("")
                }

            </div>

        </section>

    `;

}


/* =========================================================
   AREA ANALYSIS
========================================================= */

function renderMPMLAAreas() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }


    const areas = [

        [
            "Ward 12",
            184,
            "Roads · Drainage"
        ],

        [
            "Ward 08",
            137,
            "Water · Electricity"
        ],

        [
            "Ward 19",
            119,
            "Sanitation · Roads"
        ],

        [
            "Ward 04",
            92,
            "Water · Waste"
        ],

        [
            "Ward 21",
            74,
            "Transport · Roads"
        ],

        [
            "Ward 02",
            61,
            "Electricity · Drainage"
        ]

    ];


    container.innerHTML = `

        <section class="mpmla-view">

            <div class="mpmla-heading">

                <span class="mpmla-eyebrow">
                    AREA ANALYSIS
                </span>

                <h1>
                    Area Problem Analysis
                </h1>

                <p>
                    Identify where civic problems
                    are concentrated and which
                    categories dominate.
                </p>

            </div>


            <div class="mpmla-area-grid">

                ${
                    areas
                        .map(
                            function(item) {

                                return `

                                    <article
                                        class="
                                            mpmla-area-card
                                        "
                                    >

                                        <span>
                                            ${mpmlaEscape(
                                                item[0]
                                            )}
                                        </span>

                                        <strong>
                                            ${item[1]}
                                        </strong>

                                        <small>
                                            ${mpmlaEscape(
                                                item[2]
                                            )}
                                        </small>

                                    </article>

                                `;

                            }
                        )
                        .join("")
                }

            </div>

        </section>

    `;

}


/* =========================================================
   AI INSIGHTS
========================================================= */

function renderMPMLAAI() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }


    const insights = [

        {
            type: "positive",
            icon: "✓",
            status: "POSITIVE",
            title: "Resolution performance improved",
            text: "Constituency-wide resolution performance has improved compared with the previous reporting period.",
            foot: "AI confidence · 94%"
        },

        {
            type: "warning",
            icon: "⚠",
            status: "MONITOR",
            title: "Water complaints remain elevated",
            text: "Water-related complaints continue to appear above the constituency average.",
            foot: "AI confidence · 89%"
        },

        {
            type: "critical",
            icon: "!",
            status: "HIGH PRIORITY",
            title: "Ward 12 requires intervention",
            text: "Road and drainage complaints are increasing rapidly and may become a sustained hotspot.",
            foot: "AI confidence · 96%"
        },

        {
            type: "recommendation",
            icon: "✦",
            status: "RECOMMENDATION",
            title: "Coordinate infrastructure review",
            text: "A coordinated review across Public Works and Water could reduce repeated complaints.",
            foot: "AI confidence · 91%"
        }

    ];


    container.innerHTML = `

        <section class="mpmla-view">

            <div class="mpmla-heading">

                <span class="mpmla-eyebrow">
                    CIVICAI PROCESSING ENGINE
                </span>

                <h1>
                    AI-Powered Insights
                </h1>

                <p>
                    Signals generated from complaint
                    patterns, department response and
                    constituency trends.
                </p>

            </div>


            <div class="mpmla-ai-grid">

                ${
                    insights
                        .map(
                            function(item) {

                                return `

                                    <article
                                        class="
                                            mpmla-ai-card
                                            ${item.type}
                                        "
                                    >

                                        <div
                                            class="
                                                mpmla-ai-top
                                            "
                                        >

                                            <div
                                                class="
                                                    mpmla-ai-icon
                                                "
                                            >
                                                ${item.icon}
                                            </div>

                                            <span
                                                class="
                                                    mpmla-ai-status
                                                "
                                            >
                                                ${item.status}
                                            </span>

                                        </div>


                                        <h3>
                                            ${mpmlaEscape(
                                                item.title
                                            )}
                                        </h3>


                                        <p>
                                            ${mpmlaEscape(
                                                item.text
                                            )}
                                        </p>


                                        <div
                                            class="
                                                mpmla-ai-foot
                                            "
                                        >
                                            ${mpmlaEscape(
                                                item.foot
                                            )}
                                        </div>

                                    </article>

                                `;

                            }
                        )
                        .join("")
                }

            </div>

        </section>

    `;

}


/* =========================================================
   REPORTS
========================================================= */

function renderMPMLAReports() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }


    const reports = [

        [
            "Monthly Complaint Report",
            "Complaint volume, status distribution and six-month trend.",
            "monthly-complaints"
        ],

        [
            "Department Performance Report",
            "Resolution percentage and average response performance.",
            "department-performance"
        ],

        [
            "Hotspot Analysis Report",
            "Ward-wise concentration of constituency issues.",
            "hotspot-analysis"
        ],

        [
            "AI Recommendations Report",
            "Priority issues and recommended development actions.",
            "ai-recommendations"
        ]

    ];


    container.innerHTML = `

        <section class="mpmla-view">

            <div class="mpmla-heading">

                <span class="mpmla-eyebrow">
                    REPORTS &amp; ANALYTICS
                </span>

                <h1>
                    Reports &amp; Export
                </h1>

                <p>
                    Generate frontend reports from the
                    current CivicAI representative dataset.
                </p>

            </div>


            <div class="mpmla-report-grid">

                ${
                    reports
                        .map(
                            function(item) {

                                return `

                                    <article
                                        class="
                                            mpmla-report-card
                                        "
                                    >

                                        <div>

                                            <h3>
                                                ${mpmlaEscape(
                                                    item[0]
                                                )}
                                            </h3>

                                            <p>
                                                ${mpmlaEscape(
                                                    item[1]
                                                )}
                                            </p>

                                        </div>


                                        <button
                                            type="button"
                                            class="mpmla-export"
                                            data-mpmla-report="${mpmlaEscape(
                                                item[2]
                                            )}"
                                        >
                                            Export
                                        </button>

                                    </article>

                                `;

                            }
                        )
                        .join("")
                }

            </div>

        </section>

    `;


    document
        .querySelectorAll(
            "[data-mpmla-report]"
        )
        .forEach(
            function(button) {

                button.addEventListener(
                    "click",
                    function() {

                        const key =
                            button.getAttribute(
                                "data-mpmla-report"
                            ) ||
                            "civicai-report";


                        const text =
                            [
                                "CivicAI Representative Report",
                                "",
                                `Report: ${key}`,
                                "Total complaints: 1,284",
                                "Pending issues: 286",
                                "Resolution rate: 78%",
                                "Hotspot wards: 12"
                            ].join("\n");


                        const blob =
                            new Blob(
                                [text],
                                {
                                    type:
                                        "text/plain;charset=utf-8"
                                }
                            );


                        const url =
                            URL.createObjectURL(
                                blob
                            );


                        const link =
                            document.createElement(
                                "a"
                            );


                        link.href =
                            url;

                        link.download =
                            `${key}.txt`;

                        link.click();


                        URL.revokeObjectURL(
                            url
                        );

                    }
                );

            }
        );

}


/* =========================================================
   NOTIFICATIONS
========================================================= */

function renderMPMLANotifications() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }


    const notes = [

        [
            "🔔",
            "New high-priority complaint",
            "A high-priority infrastructure complaint was detected in Ward 12.",
            "10 minutes ago",
            true
        ],

        [
            "✓",
            "Complaint resolved",
            "CIV-2026-1029 was marked as resolved.",
            "42 minutes ago",
            true
        ],

        [
            "✦",
            "New AI insight",
            "CivicAI detected an emerging water-supply trend.",
            "2 hours ago",
            false
        ],

        [
            "▦",
            "Department performance update",
            "Public Works performance increased to 91%.",
            "Today",
            false
        ]

    ];


    container.innerHTML = `

        <section class="mpmla-view">

            <div class="mpmla-heading">

                <span class="mpmla-eyebrow">
                    NOTIFICATION SERVICE
                </span>

                <h1>
                    Notifications
                </h1>

                <p>
                    Important constituency updates,
                    department events and CivicAI alerts.
                </p>

            </div>


            <div class="mpmla-notification-list">

                ${
                    notes
                        .map(
                            function(item) {

                                return `

                                    <article
                                        class="
                                            mpmla-notification-item
                                            ${item[4] ? "unread" : ""}
                                        "
                                    >

                                        <div
                                            class="
                                                mpmla-notification-icon
                                            "
                                        >
                                            ${item[0]}
                                        </div>


                                        <div>

                                            <h3>
                                                ${mpmlaEscape(
                                                    item[1]
                                                )}
                                            </h3>

                                            <p>
                                                ${mpmlaEscape(
                                                    item[2]
                                                )}
                                            </p>

                                            <small>
                                                ${mpmlaEscape(
                                                    item[3]
                                                )}
                                            </small>

                                        </div>

                                    </article>

                                `;

                            }
                        )
                        .join("")
                }

            </div>

        </section>

    `;

}


/* =========================================================
   PROFILE — READ ONLY
========================================================= */

function renderMPMLAProfile() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `

        <section class="mpmla-view">

            <div class="mpmla-heading">

                <span class="mpmla-eyebrow">
                    REPRESENTATIVE ACCOUNT
                </span>

                <h1>
                    Profile
                </h1>

                <p>
                    This profile is read-only.
                </p>

            </div>


            <div class="mpmla-profile-shell">

                <aside
                    class="mpmla-profile-card"
                >

                    <div
                        class="mpmla-avatar"
                    >
                        M
                    </div>

                    <h3>
                        Representative
                    </h3>

                    <p>
                        MP / MLA
                    </p>

                </aside>


                <section
                    class="mpmla-profile-details"
                >

                    <div
                        class="mpmla-profile-info"
                    >

                        ${mpmlaInfo(
                            "Role",
                            "MP / MLA"
                        )}

                        ${mpmlaInfo(
                            "Official Email",
                            "representative@civicai.gov"
                        )}

                        ${mpmlaInfo(
                            "Official Phone",
                            "+91 98765 43210"
                        )}

                        ${mpmlaInfo(
                            "Constituency",
                            "Constituency 01"
                        )}

                        ${mpmlaInfo(
                            "District",
                            "District"
                        )}

                        ${mpmlaInfo(
                            "Account Status",
                            "Active"
                        )}

                    </div>

                </section>

            </div>

        </section>

    `;

}


/* =========================================================
   SETTINGS
========================================================= */

function renderMPMLASettings() {

    const container =
        document.getElementById(
            "mpmlaDashboardContent"
        );

    if (!container) {
        return;
    }


    container.innerHTML = `

        <section class="mpmla-view">

            <div class="mpmla-heading">

                <span class="mpmla-eyebrow">
                    PREFERENCES
                </span>

                <h1>
                    Settings
                </h1>

                <p>
                    Manage representative dashboard
                    appearance and language preferences.
                </p>

            </div>


            <div class="mpmla-settings-list">

                <div
                    class="mpmla-setting"
                >

                    <div>

                        <strong>
                            Appearance
                        </strong>

                        <small>
                            Switch between CivicAI themes.
                        </small>

                    </div>


                    <button
                        type="button"
                        class="form-submit"
                        data-civic-action="toggle-theme"
                    >
                        Toggle Theme
                    </button>

                </div>


                <div
                    class="mpmla-setting"
                >

                    <div>

                        <strong>
                            Language
                        </strong>

                        <small>
                            Choose the dashboard language.
                        </small>

                    </div>


                    <select
                        id="mpmlaSettingsLanguage"
                        class="dashboard-language"
                    >

                        <option value="en">
                            English
                        </option>

                        <option value="ta">
                            தமிழ்
                        </option>

                        <option value="hi">
                            हिन्दी
                        </option>

                        <option value="te">
                            తెలుగు
                        </option>

                        <option value="ml">
                            മലയാളം
                        </option>

                        <option value="kn">
                            ಕನ್ನಡ
                        </option>

                        <option value="mr">
                            मराठी
                        </option>

                        <option value="bn">
                            বাংলা
                        </option>

                        <option value="gu">
                            ગુજરાતી
                        </option>

                    </select>

                </div>

            </div>

        </section>

    `;


    const language =
        document.getElementById(
            "mpmlaSettingsLanguage"
        );


    if (language) {

        language.value =
            AppState.language;


        language.addEventListener(
            "change",
            function() {

                setLanguage(
                    language.value
                );

                renderMPMLASettings();

            }
        );

    }

}


/* =========================================================
   GRIEVANCE DETAIL
========================================================= */

function bindMPMLAGrievanceButtons() {

    document
        .querySelectorAll(
            "[data-mpmla-grievance-id]"
        )
        .forEach(
            function(button) {

                if (
                    button.dataset.bound ===
                    "true"
                ) {
                    return;
                }


                button.dataset.bound =
                    "true";


                button.addEventListener(
                    "click",
                    function() {

                        const id =
                            button.getAttribute(
                                "data-mpmla-grievance-id"
                            );


                        const grievance =
                            getDashboardGrievances()
                                .find(
                                    function(item) {
                                        return item.id === id;
                                    }
                                );


                        if (!grievance) {
                            return;
                        }


                        const container =
                            document.getElementById(
                                "mpmlaDashboardContent"
                            );


                        if (!container) {
                            return;
                        }


                        container.innerHTML = `

                            <section
                                class="mpmla-view"
                            >

                                <div
                                    class="mpmla-heading"
                                >

                                    <span
                                        class="mpmla-eyebrow"
                                    >
                                        COMPLAINT DETAIL
                                    </span>

                                    <h1>
                                        ${mpmlaEscape(
                                            grievance.subject
                                        )}
                                    </h1>

                                    <p>
                                        ${mpmlaEscape(
                                            grievance.description ||
                                            "Complaint detail"
                                        )}
                                    </p>

                                </div>


                                <section
                                    class="mpmla-panel"
                                >

                                    <div
                                        class="mpmla-kpi-grid"
                                    >

                                        ${mpmlaKpi(
                                            "Grievance ID",
                                            grievance.id,
                                            "Case reference"
                                        )}

                                        ${mpmlaKpi(
                                            "Category",
                                            grievance.category ||
                                            "Infrastructure",
                                            "Classification"
                                        )}

                                        ${mpmlaKpi(
                                            "Priority",
                                            grievance.priority ||
                                            "Medium",
                                            "Current priority"
                                        )}

                                        ${mpmlaKpi(
                                            "Status",
                                            grievance.status,
                                            "Current state"
                                        )}

                                    </div>

                                </section>


                                <section
                                    class="mpmla-panel"
                                >

                                    <div
                                        class="mpmla-panel-head"
                                    >

                                        <h3>
                                            Timeline
                                        </h3>

                                        <span
                                            class="mpmla-pill"
                                        >
                                            HISTORY
                                        </span>

                                    </div>


                                    ${
                                        (
                                            grievance.timeline ||
                                            []
                                        )
                                        .map(
                                            function(step) {

                                                return `

                                                    <div
                                                        class="
                                                            mpmla-notification-item
                                                        "
                                                    >

                                                        <div
                                                            class="
                                                                mpmla-notification-icon
                                                            "
                                                        >
                                                            ◷
                                                        </div>

                                                        <div>

                                                            <h3>
                                                                ${mpmlaEscape(
                                                                    step.label ||
                                                                    "Status"
                                                                )}
                                                            </h3>

                                                            <p>
                                                                ${mpmlaEscape(
                                                                    step.response ||
                                                                    "Status update"
                                                                )}
                                                            </p>

                                                            <small>
                                                                ${mpmlaEscape(
                                                                    step.date ||
                                                                    ""
                                                                )}
                                                            </small>

                                                        </div>

                                                    </div>

                                                `;

                                            }
                                        )
                                        .join("")

                                        ||

                                        `
                                            <div
                                                class="content-empty"
                                            >
                                                No timeline updates available.
                                            </div>
                                        `
                                    }

                                </section>


                                <button
                                    type="button"
                                    class="form-submit"
                                    data-mpmla-back-grievances="true"
                                >
                                    ← Back to Grievances
                                </button>

                            </section>

                        `;


                        bindMPMLABackToGrievances();

                    }
                );

            }
        );

}


function bindMPMLABackToGrievances() {

    const button =
        document.querySelector(
            "[data-mpmla-back-grievances]"
        );


    if (
        !button ||
        button.dataset.bound === "true"
    ) {
        return;
    }


    button.dataset.bound =
        "true";


    button.addEventListener(
        "click",
        function() {

            setMPMLAActiveView(
                "grievances"
            );

            renderMPMLAGrievances();

        }
    );

}


/* =========================================================
   HELPERS
========================================================= */

function setMPMLAActiveView(view) {

    document
        .querySelectorAll(
            ".mpmla-sidebar .sidebar-nav-item"
        )
        .forEach(
            function(item) {

                item.classList.toggle(
                    "active",
                    item.getAttribute(
                        "data-dashboard-view"
                    ) === view
                );

            }
        );

}


function getMPMLADepartmentData() {

    return [

        {
            name: "Public Works",
            active: 184,
            performance: 91,
            avg: "1.8d"
        },

        {
            name: "Water Department",
            active: 126,
            performance: 84,
            avg: "2.4d"
        },

        {
            name: "Electricity",
            active: 92,
            performance: 79,
            avg: "3.1d"
        },

        {
            name: "Sanitation",
            active: 76,
            performance: 87,
            avg: "2.1d"
        },

        {
            name: "Transport",
            active: 48,
            performance: 73,
            avg: "4.2d"
        },

        {
            name: "Health Services",
            active: 39,
            performance: 94,
            avg: "1.4d"
        }

    ];

}


function mpmlaStatCard(
    icon,
    label,
    value,
    description
) {

    return `

        <article class="mpmla-stat-card">

            <div class="mpmla-stat-icon">
                ${icon}
            </div>

            <small>
                ${mpmlaEscape(label)}
            </small>

            <strong>
                ${mpmlaEscape(value)}
            </strong>

            <span>
                ${mpmlaEscape(description)}
            </span>

        </article>

    `;

}


function mpmlaKpi(
    label,
    value,
    description
) {

    return `

        <article class="mpmla-kpi">

            <small>
                ${mpmlaEscape(label)}
            </small>

            <strong>
                ${mpmlaEscape(value)}
            </strong>

            <span>
                ${mpmlaEscape(description)}
            </span>

        </article>

    `;

}


function mpmlaInfo(
    label,
    value
) {

    return `

        <div
            class="mpmla-info-box"
        >

            <small>
                ${mpmlaEscape(label)}
            </small>

            <strong>
                ${mpmlaEscape(value)}
            </strong>

        </div>

    `;

}


function mpmlaStatusClass(
    status
) {

    if (
        status ===
        "Resolved"
    ) {
        return "resolved";
    }


    if (
        status ===
        "In Progress"
    ) {
        return "in-progress";
    }


    return "pending";

}


function mpmlaEscape(
    value
) {

    return String(
        value ?? ""
    )
        .replaceAll(
            "&",
            "&amp;"
        )
        .replaceAll(
            "<",
            "&lt;"
        )
        .replaceAll(
            ">",
            "&gt;"
        )
        .replaceAll(
            '"',
            "&quot;"
        )
        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =========================================================
   SIDEBAR NAVIGATION
   IMPORTANT:
   This keeps Citizen + Department navigation intact
   and adds the MP / MLA views.
========================================================= */

function bindLegacyDashboardNavigation() {

    if (
        document.body.dataset.civicDashboardNavigationBound ===
        "true"
    ) {
        return;
    }


    document.body.dataset.civicDashboardNavigationBound =
        "true";


    document.addEventListener(
        "click",
        function(event) {

            const item =
                event.target.closest(
                    "[data-dashboard-view]"
                );


            if (!item) {
                return;
            }


            const view =
                item.getAttribute(
                    "data-dashboard-view"
                );


            if (!view) {
                return;
            }


            document
                .querySelectorAll(
                    ".sidebar-nav-item"
                )
                .forEach(
                    function(button) {

                        button.classList.remove(
                            "active"
                        );

                    }
                );


            item.classList.add(
                "active"
            );


            /* =========================================
               CITIZEN
            ========================================== */

            if (
                AppState.currentRole ===
                "citizen"
            ) {

                switch(view) {

                    case "overview":
                        renderCitizenDashboard();
                        break;

                    case "grievance":
                        renderCitizenGrievanceForm();
                        break;

                    case "my-grievances":
                        renderCitizenGrievances();
                        break;

                    case "tracking":
                        renderCitizenTracking();
                        break;

                    case "schemes":
                        renderSchemes();
                        break;

                    case "services":
                        renderServices();
                        break;

                    case "notifications":
                        renderNotifications();
                        break;

                    case "profile":
                        renderCitizenProfile();
                        break;

                    case "settings":
                        renderSettings();
                        break;

                    default:
                        renderCitizenDashboard();

                }


                return;

            }


            /* =========================================
               MP / MLA
            ========================================== */

            if (
                AppState.currentRole ===
                "mpmla"
            ) {

                switch(view) {

                    case "overview":
                        renderMPMLAOverview();
                        break;

                    case "grievances":
                        renderMPMLAGrievances();
                        break;

                    case "analytics":
                        renderMPMLAAnalytics();
                        break;

                    case "issues":
                        renderMPMLAIssues();
                        break;

                    case "departments":
                        renderMPMLADepartments();
                        break;

                    case "areas":
                        renderMPMLAAreas();
                        break;

                    case "ai":
                        renderMPMLAAI();
                        break;

                    case "reports":
                        renderMPMLAReports();
                        break;

                    case "notifications":
                        renderMPMLANotifications();
                        break;

                    case "profile":
                        renderMPMLAProfile();
                        break;

                    case "settings":
                        renderMPMLASettings();
                        break;

                    default:
                        renderMPMLAOverview();

                }


                bindMPMLAHeaderActions();

                return;

            }


            /* =========================================
               DEPARTMENT
            ========================================== */

            if (
                AppState.currentRole ===
                "department"
            ) {

                renderDepartmentDashboard();

            }

        }
    );

}

function renderLegacyDepartmentDashboard() {

    const container = document.getElementById("departmentDashboardContent");
    if (!container) return;

    const grievances = getDashboardGrievances();
    const stats = {
        total: grievances.length,
        pending: grievances.filter((item) => item.status === "Submitted").length,
        inProgress: grievances.filter((item) => item.status === "In Progress").length,
        resolved: grievances.filter((item) => item.status === "Resolved").length
    };

    container.innerHTML = `
        <div class="dashboard-cards">
            <div class="dashboard-stat"><small>Assigned grievances</small><strong>${stats.total}</strong><span>Open workload</span></div>
            <div class="dashboard-stat"><small>Pending</small><strong>${stats.pending}</strong><span>Awaiting review</span></div>
            <div class="dashboard-stat"><small>In progress</small><strong>${stats.inProgress}</strong><span>Action underway</span></div>
            <div class="dashboard-stat"><small>Resolved</small><strong>${stats.resolved}</strong><span>Completed tasks</span></div>
        </div>

        <div class="widget-grid">
            <section class="panel">
                <div class="panel-header">
                    <h3>Assigned grievances</h3>
                    <span class="pill">Review queue</span>
                </div>
                <div class="table-grid">
                    ${grievances.map((item) => `
                        <div class="table-row">
                            <strong>${item.id}</strong>
                            <span>${item.subject}</span>
                            <span>${item.department}</span>
                            <span class="tag ${item.status.toLowerCase().replace(/\s+/g, '-')}">${item.status}</span>
                            <button type="button" class="detail-button" data-grievance-id="${item.id}">Review</button>
                        </div>
                    `).join("")}
                </div>
            </section>

            <section class="panel">
                <div class="panel-header">
                    <h3>Update status</h3>
                    <span class="pill">Action</span>
                </div>
                <div class="select-row">
                    <div class="field">
                        <label for="statusSelect">Status</label>
                        <select id="statusSelect">
                            <option value="Submitted">Submitted</option>
                            <option value="Under Review">Under Review</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                    <div class="field">
                        <label for="statusGrievance">Grievance</label>
                        <select id="statusGrievance">
                            ${grievances.map((item) => `<option value="${item.id}">${item.id}</option>`).join("")}
                        </select>
                    </div>
                </div>
                <div class="field" style="margin-top: 12px;">
                    <label for="statusResponse">Officer response</label>
                    <textarea id="statusResponse" placeholder="Add a response or action note"></textarea>
                </div>
                <button type="button" class="form-submit" id="saveStatusButton">Save update</button>
            </section>
        </div>
    `;

    const saveStatusButton = document.getElementById("saveStatusButton");
    if (saveStatusButton) {
        saveStatusButton.addEventListener("click", function() {
            const grievanceId = document.getElementById("statusGrievance")?.value;
            const statusValue = document.getElementById("statusSelect")?.value;
            const responseText = document.getElementById("statusResponse")?.value || "No response provided.";
            if (!grievanceId) return;
            const items = getDashboardGrievances();
            const updated = items.map((item) => item.id === grievanceId ? {
                ...item,
                status: statusValue,
                lastUpdated: new Date().toISOString().slice(0, 10),
                timeline: [...(item.timeline || []), { label: statusValue, date: new Date().toISOString().slice(0, 10), response: responseText }]
            } : item);
            localStorage.setItem("civicai-grievances", JSON.stringify(updated));
            renderDepartmentDashboard();
        });
    }

    bindGrievanceViewButtons();
    bindSidebarNavigation();
}


const DepartmentDashboardViewLabels = {
    overview: "Overview",
    assigned: "Assigned Grievances",
    "ai-analysis": "AI Analysis",
    pending: "Pending",
    "in-progress": "In Progress",
    resolved: "Resolved",
    notifications: "Notifications",
    profile: "Profile",
    settings: "Settings"
};


function updateDepartmentActiveView(view) {

    document
        .querySelectorAll(".department-sidebar [data-department-view]")
        .forEach((button) => button.classList.toggle(
            "active",
            button.getAttribute("data-department-view") === view
        ));

}


function setDepartmentDashboardView(view) {

    if (!DepartmentDashboardViewLabels[view]) {
        return;
    }

    DepartmentDashboardState.currentView = view;
    updateDepartmentActiveView(view);

    switch (view) {

        case "overview":
        case "assigned":
        case "pending":
        case "in-progress":
        case "resolved":
            renderDepartmentDashboard(view);
            break;

        case "ai-analysis":
            renderDepartmentAIAnalysis();
            break;

        case "notifications":
            renderDepartmentNotifications();
            break;

        case "profile":
            renderDepartmentProfile();
            break;

        case "settings":
            renderDepartmentSettings();
            break;

    }

}


function departmentStatusClass(status) {

    const normalized = String(status || "")
        .toLowerCase();

    if (normalized === "resolved") {
        return "resolved";
    }

    if (normalized === "in progress") {
        return "progress";
    }

    return "pending";

}


function getDepartmentQueue(view, grievances) {

    if (view === "pending") {
        return grievances.filter((item) => [
            "Submitted",
            "Under Review"
        ].includes(item.status));
    }

    if (view === "in-progress") {
        return grievances.filter((item) => item.status === "In Progress");
    }

    if (view === "resolved") {
        return grievances.filter((item) => item.status === "Resolved");
    }

    return grievances;

}


function renderDepartmentDashboard(view = "overview") {

    const container = document.getElementById("departmentDashboardContent");
    if (!container) {
        return;
    }

    DepartmentDashboardState.currentView = view;
    updateDepartmentActiveView(view);

    const grievances = getDashboardGrievances();
    const queue = getDepartmentQueue(view, grievances);
    const stats = {
        total: grievances.length,
        pending: grievances.filter((item) => ["Submitted", "Under Review"].includes(item.status)).length,
        inProgress: grievances.filter((item) => item.status === "In Progress").length,
        resolved: grievances.filter((item) => item.status === "Resolved").length
    };
    const isQueueView = view !== "overview";
    const title = isQueueView
        ? DepartmentDashboardViewLabels[view]
        : "Department workspace";
    const description = isQueueView
        ? "Review the current queue and keep citizens informed as work moves forward."
        : "Coordinate assigned civic requests, update progress and close resolved cases from one workspace.";

    container.innerHTML = `
        <section class="department-view">
            <div class="department-hero">
                <span class="department-hero-tag">${mpmlaEscape(isQueueView ? "CASE QUEUE" : "DEPARTMENT OVERVIEW")}</span>
                <h1>${mpmlaEscape(title)}</h1>
                <p>${mpmlaEscape(description)}</p>
            </div>

            ${isQueueView ? "" : `
                <div class="department-stat-grid">
                    ${departmentStatCard("◈", "green", "Assigned grievances", stats.total, "Open workload")}
                    ${departmentStatCard("○", "yellow", "Pending", stats.pending, "Awaiting review")}
                    ${departmentStatCard("◷", "blue", "In progress", stats.inProgress, "Action underway")}
                    ${departmentStatCard("✓", "green", "Resolved", stats.resolved, "Completed tasks")}
                </div>
            `}

            <div class="department-two-column">
                <section class="department-panel">
                    <div class="department-panel-head">
                        <h3>${mpmlaEscape(isQueueView ? `${DepartmentDashboardViewLabels[view]} queue` : "Assigned grievances")}</h3>
                        <span class="department-pill">${queue.length} CASES</span>
                    </div>
                    <div class="department-case-list">
                        ${queue.map((item) => `
                            <article class="department-case-card">
                                <div>
                                    <h3>${mpmlaEscape(item.subject)}</h3>
                                    <p>${mpmlaEscape(item.description || "No description provided.")}</p>
                                    <div class="department-case-meta">
                                        <span class="department-chip">${mpmlaEscape(item.id)}</span>
                                        <span class="department-chip">${mpmlaEscape(item.location || "Location pending")}</span>
                                        <span class="department-status ${departmentStatusClass(item.status)}">${mpmlaEscape(item.status)}</span>
                                    </div>
                                </div>
                                <button type="button" class="department-review-button" data-grievance-id="${mpmlaEscape(item.id)}">Review</button>
                            </article>
                        `).join("") || '<div class="content-empty">No grievances are in this queue.</div>'}
                    </div>
                </section>

                <section class="department-panel">
                    <div class="department-panel-head">
                        <h3>Update status</h3>
                        <span class="department-pill">ACTION</span>
                    </div>
                    <div class="department-form-grid">
                        <div class="department-field">
                            <label for="statusSelect">Status</label>
                            <select id="statusSelect">
                                <option value="Submitted">Submitted</option>
                                <option value="Under Review">Under Review</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                        <div class="department-field">
                            <label for="statusGrievance">Grievance</label>
                            <select id="statusGrievance">
                                ${grievances.map((item) => `<option value="${mpmlaEscape(item.id)}">${mpmlaEscape(item.id)}</option>`).join("") || '<option value="">No grievances</option>'}
                            </select>
                        </div>
                        <div class="department-field full">
                            <label for="statusResponse">Officer response</label>
                            <textarea id="statusResponse" placeholder="Add a response or action note"></textarea>
                        </div>
                    </div>
                    <button type="button" class="department-primary-button" id="saveStatusButton">Save update</button>
                    <div class="department-profile-message" id="departmentStatusMessage" role="status" aria-live="polite"></div>
                </section>
            </div>
        </section>
    `;

    const statusSelect = document.getElementById("statusSelect");
    const statusGrievance = document.getElementById("statusGrievance");
    const selectedGrievance = grievances.find(
        (item) => item.id === statusGrievance?.value
    );

    if (statusSelect && selectedGrievance) {
        statusSelect.value = selectedGrievance.status;
    }

    statusGrievance?.addEventListener("change", function() {
        const item = grievances.find((grievance) => grievance.id === statusGrievance.value);
        if (item && statusSelect) {
            statusSelect.value = item.status;
        }
    });

    document.getElementById("saveStatusButton")?.addEventListener("click", function() {
        const grievanceId = statusGrievance?.value;
        const statusValue = statusSelect?.value;
        const responseText = document.getElementById("statusResponse")?.value.trim() || "No response provided.";
        const message = document.getElementById("departmentStatusMessage");

        if (!grievanceId || !statusValue) {
            if (message) {
                message.className = "department-profile-message error";
                message.textContent = "Select a grievance and status before saving.";
            }
            return;
        }

        const date = new Date().toISOString().slice(0, 10);
        const updated = getDashboardGrievances().map((item) => item.id === grievanceId
            ? {
                ...item,
                status: statusValue,
                lastUpdated: date,
                timeline: [
                    ...(item.timeline || []),
                    { label: statusValue, date, response: responseText }
                ]
            }
            : item);

        localStorage.setItem("civicai-grievances", JSON.stringify(updated));

        if (message) {
            message.className = "department-profile-message success";
            message.textContent = `Update saved for ${grievanceId}.`;
        }

        renderDepartmentDashboard(DepartmentDashboardState.currentView);
    });

    bindGrievanceViewButtons();
    bindSidebarNavigation();
}


function departmentStatCard(icon, tone, label, value, description) {

    return `
        <article class="department-stat">
            <div class="department-stat-icon ${tone}">${icon}</div>
            <small>${mpmlaEscape(label)}</small>
            <strong>${mpmlaEscape(value)}</strong>
            <span>${mpmlaEscape(description)}</span>
        </article>
    `;

}


function renderDepartmentAIAnalysis() {

    const container = document.getElementById("departmentDashboardContent");
    if (!container) {
        return;
    }

    const grievances = getDashboardGrievances();
    const pending = grievances.filter((item) => ["Submitted", "Under Review"].includes(item.status)).length;
    const inProgress = grievances.filter((item) => item.status === "In Progress").length;
    const resolved = grievances.filter((item) => item.status === "Resolved").length;

    container.innerHTML = `
        <section class="department-view">
            <div class="department-hero">
                <span class="department-hero-tag">CIVICAI PROCESSING ENGINE</span>
                <h1>AI Analysis</h1>
                <p>Signals from current grievance volume, workflow status and department response patterns.</p>
            </div>
            <div class="department-two-column">
                <section class="department-panel">
                    <div class="department-panel-head">
                        <h3>Workflow signals</h3>
                        <span class="department-pill">LIVE</span>
                    </div>
                    <div class="department-insight-list">
                        <article class="department-insight">
                            <strong>${pending ? "Pending cases need review" : "Queue is clear"}</strong>
                            <small>${pending} cases are waiting for department action or initial review.</small>
                        </article>
                        <article class="department-insight">
                            <strong>${inProgress ? "Field work is underway" : "No active field work"}</strong>
                            <small>${inProgress} cases are currently marked in progress and need follow-through.</small>
                        </article>
                        <article class="department-insight">
                            <strong>${resolved ? "Resolution momentum is visible" : "Resolution history is empty"}</strong>
                            <small>${resolved} cases are recorded as resolved in the current demo dataset.</small>
                        </article>
                    </div>
                </section>
                <section class="department-panel">
                    <div class="department-panel-head">
                        <h3>Routing summary</h3>
                        <span class="department-pill">${grievances.length} CASES</span>
                    </div>
                    <div class="department-stat-grid">
                        ${departmentStatCard("◈", "green", "Total cases", grievances.length, "Current dataset")}
                        ${departmentStatCard("○", "yellow", "Needs review", pending, "Priority queue")}
                        ${departmentStatCard("✓", "blue", "Resolved", resolved, "Completed cases")}
                    </div>
                </section>
            </div>
        </section>
    `;

    bindSidebarNavigation();
}


function renderDepartmentNotifications() {

    const container = document.getElementById("departmentDashboardContent");
    if (!container) {
        return;
    }

    const notifications = getDashboardNotifications();

    container.innerHTML = `
        <section class="department-view">
            <div class="department-hero">
                <span class="department-hero-tag">NOTIFICATION SERVICE</span>
                <h1>Notifications</h1>
                <p>Stay aware of new assignments, citizen updates and CivicAI routing events.</p>
            </div>
            <section class="department-panel">
                <div class="department-panel-head">
                    <h3>Department alerts</h3>
                    <span class="department-pill">${notifications.filter((item) => item.unread).length} UNREAD</span>
                </div>
                <div class="department-notification-list">
                    ${notifications.map((item) => `
                        <article class="department-notification ${item.unread ? "blue" : ""}">
                            <div class="department-notification-icon">${item.type === "grievance" ? "◈" : item.type === "scheme" ? "▦" : "✦"}</div>
                            <div>
                                <h3>${mpmlaEscape(item.title)}</h3>
                                <p>${mpmlaEscape(item.message)}</p>
                                <small>${item.unread ? "Unread" : "Read"}</small>
                            </div>
                            <button type="button" class="department-secondary-button" data-department-notification-id="${mpmlaEscape(item.id)}">${item.unread ? "Mark as read" : "Read"}</button>
                        </article>
                    `).join("") || '<div class="content-empty">No notifications available.</div>'}
                </div>
            </section>
        </section>
    `;

    container.querySelectorAll("[data-department-notification-id]").forEach((button) => {
        button.addEventListener("click", function() {
            const id = button.getAttribute("data-department-notification-id");
            const updated = getDashboardNotifications().map((item) => item.id === Number(id)
                ? { ...item, unread: false }
                : item);
            localStorage.setItem("civicai-notifications", JSON.stringify(updated));
            updateNotificationBadge();
            renderDepartmentNotifications();
        });
    });

    bindSidebarNavigation();
}


function getDepartmentProfile() {

    const defaults = {
        departmentName: "Public Works Department",
        officialEmail: "department@civicai.gov",
        officialPhone: "+91 98765 43000",
        constituency: "Constituency 01",
        district: "District",
        office: "Civic Services Office",
        accountStatus: "Active"
    };

    return {
        ...defaults,
        ...readLocalStorageJson("civicai-department-profile", {})
    };

}


function saveDepartmentProfile(profile) {
    localStorage.setItem(
        "civicai-department-profile",
        JSON.stringify(profile)
    );
}


function renderDepartmentProfile() {

    const container = document.getElementById("departmentDashboardContent");
    if (!container) {
        return;
    }

    const profile = getDepartmentProfile();

    container.innerHTML = `
        <section class="department-view">
            <div class="department-hero">
                <span class="department-hero-tag">DEPARTMENT ACCOUNT</span>
                <h1>Profile</h1>
                <p>Keep the department contact and office information used for civic coordination up to date.</p>
            </div>
            <div class="department-profile-grid">
                <aside class="department-profile-card">
                    <div class="department-avatar">D</div>
                    <h3>${mpmlaEscape(profile.departmentName)}</h3>
                    <p>${mpmlaEscape(profile.office)}</p>
                </aside>
                <section class="department-panel">
                    <div class="department-profile-toolbar">
                        <div>
                            <h3>Department details</h3>
                            <p>Official identity and contact information.</p>
                        </div>
                        <div class="department-profile-actions">
                            <button type="button" class="department-profile-edit" id="departmentEditProfile">Edit Profile</button>
                        </div>
                    </div>
                    <div class="department-profile-info">
                        ${departmentInfo("Department", profile.departmentName, "departmentName")}
                        ${departmentInfo("Official Email", profile.officialEmail, "officialEmail")}
                        ${departmentInfo("Official Phone", profile.officialPhone, "officialPhone")}
                        ${departmentInfo("Constituency", profile.constituency, "constituency")}
                        ${departmentInfo("District", profile.district, "district")}
                        ${departmentInfo("Office", profile.office, "office")}
                        ${departmentInfo("Account Status", profile.accountStatus, "accountStatus")}
                    </div>
                    <div class="department-profile-message" id="departmentProfileMessage" role="status" aria-live="polite"></div>
                </section>
            </div>
        </section>
    `;

    document.getElementById("departmentEditProfile")?.addEventListener("click", function() {
        renderDepartmentProfileEditor(profile);
    });

    bindSidebarNavigation();
}


function departmentInfo(label, value, field) {

    return `
        <div class="department-info" data-department-profile-display="${field}">
            <small>${mpmlaEscape(label)}</small>
            <strong>${mpmlaEscape(value)}</strong>
        </div>
    `;

}


function renderDepartmentProfileEditor(profile) {

    const container = document.getElementById("departmentDashboardContent");
    if (!container) {
        return;
    }

    const fields = [
        ["Department", "departmentName"],
        ["Official Email", "officialEmail"],
        ["Official Phone", "officialPhone"],
        ["Constituency", "constituency"],
        ["District", "district"],
        ["Office", "office"]
    ];

    container.querySelector(".department-profile-toolbar").innerHTML = `
        <div>
            <h3>Edit department details</h3>
            <p>Save changes to update the department profile.</p>
        </div>
        <div class="department-profile-actions">
            <button type="button" class="department-profile-save" id="departmentSaveProfile">Save</button>
            <button type="button" id="departmentCancelProfile">Cancel</button>
        </div>
    `;

    const infoGrid = container.querySelector(".department-profile-info");
    infoGrid.innerHTML = fields.map(([label, field]) => `
        <div class="department-profile-field">
            <label for="departmentProfile-${field}">${mpmlaEscape(label)}</label>
            <input id="departmentProfile-${field}" data-department-profile-field="${field}" value="${mpmlaEscape(profile[field])}" autocomplete="off">
        </div>
    `).join("") + `
        <div class="department-info">
            <small>Account Status</small>
            <strong>${mpmlaEscape(profile.accountStatus)}</strong>
        </div>
    `;

    const message = document.getElementById("departmentProfileMessage");

    document.getElementById("departmentSaveProfile")?.addEventListener("click", function() {
        const next = { ...profile };
        container.querySelectorAll("[data-department-profile-field]").forEach((input) => {
            next[input.getAttribute("data-department-profile-field")] = input.value.trim();
        });

        if (!next.departmentName || !next.officialEmail || !next.officialPhone || !next.constituency || !next.district || !next.office) {
            if (message) {
                message.className = "citizen-profile-message error";
                message.textContent = "Please complete all department profile fields.";
            }
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(next.officialEmail)) {
            if (message) {
                message.className = "citizen-profile-message error";
                message.textContent = "Enter a valid official email address.";
            }
            return;
        }

        saveDepartmentProfile(next);
        renderDepartmentProfile();
        document.getElementById("departmentProfileMessage").className = "department-profile-message success";
        document.getElementById("departmentProfileMessage").textContent = "Profile saved successfully.";
    });

    document.getElementById("departmentCancelProfile")?.addEventListener("click", function() {
        renderDepartmentProfile();
    });
}


function renderDepartmentSettings() {

    const container = document.getElementById("departmentDashboardContent");
    if (!container) {
        return;
    }

    container.innerHTML = `
        <section class="department-view">
            <div class="department-hero">
                <span class="department-hero-tag">PREFERENCES</span>
                <h1>Settings</h1>
                <p>Manage the appearance and language preferences for this department workspace.</p>
            </div>
            <section class="department-panel">
                <div class="department-setting-list">
                    <div class="department-setting">
                        <div><strong>Appearance</strong><small>Switch between CivicAI themes.</small></div>
                        <button type="button" class="department-primary-button" id="departmentSettingTheme">Toggle theme</button>
                    </div>
                    <div class="department-setting">
                        <div><strong>Language</strong><small>Choose your preferred workspace language.</small></div>
                        <select id="departmentSettingLanguage" class="dashboard-language">
                            <option value="en">English</option>
                            <option value="ta">தமிழ்</option>
                            <option value="hi">हिन्दी</option>
                            <option value="te">తెలుగు</option>
                            <option value="ml">മലയാളം</option>
                            <option value="kn">ಕನ್ನಡ</option>
                            <option value="mr">मराठी</option>
                            <option value="bn">বাংলা</option>
                            <option value="gu">ગુજરાતી</option>
                        </select>
                    </div>
                </div>
            </section>
        </section>
    `;

    const language = document.getElementById("departmentSettingLanguage");
    if (language) {
        language.value = AppState.language;
        language.addEventListener("change", function() {
            setLanguage(language.value);
        });
    }

    document.getElementById("departmentSettingTheme")?.addEventListener("click", function() {
        toggleTheme();
    });

    bindSidebarNavigation();
}


function bindSidebarNavigation() {

    if (document.body.dataset.civicDashboardNavigationBound === "true") {
        return;
    }

    document.body.dataset.civicDashboardNavigationBound = "true";

    document.addEventListener("click", function(event) {
        const citizenItem = event.target.closest("[data-dashboard-view]");
        const departmentItem = event.target.closest("[data-department-view]");
        const item = citizenItem || departmentItem;

        if (!item) {
            return;
        }

        const view = item.getAttribute(
            citizenItem ? "data-dashboard-view" : "data-department-view"
        );

        if (!view) {
            return;
        }

        event.preventDefault();

        if (citizenItem && AppState.currentRole === "citizen") {
            setCitizenDashboardView(view);
            renderCitizenDashboardView(view);
            document.querySelectorAll(".dashboard-page[data-role-page='citizen'] .sidebar-nav-item")
                .forEach((button) => button.classList.toggle(
                    "active",
                    button.getAttribute("data-dashboard-view") === view
                ));
            return;
        }

        if (departmentItem && AppState.currentRole === "department") {
            setDepartmentDashboardView(view);
            return;
        }
    });

    document.addEventListener("click", function(event) {
        const notificationButton = event.target.closest("#departmentNotificationButton");
        if (!notificationButton || AppState.currentRole !== "department") {
            return;
        }

        event.preventDefault();
        setDepartmentDashboardView("notifications");
    });
}


function bindDashboardButtons() {
    /* Kept as a compatibility hook for existing render calls. */
    bindSidebarNavigation();
}


function bindLegacyGrievanceViewButtons() {

    const buttons = document.querySelectorAll("[data-grievance-id]");
    buttons.forEach((button) => {
        button.addEventListener("click", function() {
            const grievanceId = button.getAttribute("data-grievance-id");
            if (!grievanceId) return;
            const grievances = getDashboardGrievances();
            const grievance = grievances.find((item) => item.id === grievanceId);
            if (!grievance) return;

            const container = document.getElementById("citizenDashboardContent") || document.getElementById("mpmlaDashboardContent") || document.getElementById("departmentDashboardContent");
            if (!container) return;

            container.innerHTML = `
                <section class="panel">
                    <div class="panel-header">
                        <h3>${grievance.subject}</h3>
                        <span class="tag ${grievance.status.toLowerCase().replace(/\s+/g, '-')}">${grievance.status}</span>
                    </div>
                    <div class="list-compact">
                        <div class="list-item-card"><div><strong>Grievance ID</strong><div style="color: var(--text-secondary);">${grievance.id}</div></div><div><strong>Category</strong><div style="color: var(--text-secondary);">${grievance.category}</div></div></div>
                        <div class="list-item-card"><div><strong>Location</strong><div style="color: var(--text-secondary);">${grievance.location}</div></div><div><strong>Priority</strong><div style="color: var(--text-secondary);">${grievance.priority || "Medium"}</div></div></div>
                        <div class="list-item-card"><div style="flex:1;"><strong>Description</strong><div style="color: var(--text-secondary); margin-top:4px;">${grievance.description}</div></div></div>
                    </div>
                    <div class="panel-header" style="margin-top:20px;">
                        <h3>Timeline</h3>
                        <span class="pill">History</span>
                    </div>
                    ${(grievance.timeline || []).map((step) => `
                        <div class="list-item-card">
                            <div>
                                <strong>${step.label}</strong>
                                <div style="color: var(--text-secondary); margin-top:4px;">${step.date}</div>
                            </div>
                            <span class="pill">${step.response ? "Response" : "Status"}</span>
                        </div>
                    `).join("")}
                </section>
            `;
        });
    });
}


function bindGrievanceViewButtons() {

    if (document.body.dataset.civicGrievanceNavigationBound === "true") {
        return;
    }

    document.body.dataset.civicGrievanceNavigationBound = "true";

    document.addEventListener("click", function(event) {
        const button = event.target.closest("[data-grievance-id]");
        if (!button) {
            return;
        }

        const grievanceId = button.getAttribute("data-grievance-id");
        const grievance = getDashboardGrievances().find(
            (item) => item.id === grievanceId
        );

        if (!grievance) {
            return;
        }

        if (button.closest("#citizenDashboardContent")) {
            event.preventDefault();
            event.stopPropagation();
            setCitizenDashboardView("grievance-detail");
            renderCitizenGrievanceDetail(grievance);
            return;
        }

        if (button.closest("#departmentDashboardContent")) {
            event.preventDefault();
            event.stopPropagation();
            renderDepartmentGrievanceDetail(grievance);
        }
    });
}


function renderCitizenGrievanceDetail(grievance) {

    const container = document.getElementById("citizenDashboardContent");
    if (!container || !grievance) {
        return;
    }

    const statusClass = String(grievance.status || "submitted")
        .toLowerCase()
        .replace(/\s+/g, "-");

    container.innerHTML = `
        <section class="panel dashboard-detail-view">
            <div class="panel-header">
                <div>
                    <span class="pill">Grievance details</span>
                    <h3>${mpmlaEscape(grievance.subject)}</h3>
                </div>
                <span class="tag ${statusClass}">${mpmlaEscape(grievance.status)}</span>
            </div>
            <div class="list-compact">
                <div class="list-item-card">
                    <div><strong>Grievance ID</strong><div>${mpmlaEscape(grievance.id)}</div></div>
                    <div><strong>Category</strong><div>${mpmlaEscape(grievance.category)}</div></div>
                </div>
                <div class="list-item-card">
                    <div><strong>Location</strong><div>${mpmlaEscape(grievance.location)}</div></div>
                    <div><strong>Priority</strong><div>${mpmlaEscape(grievance.priority || "Medium")}</div></div>
                </div>
                <div class="list-item-card">
                    <div><strong>Description</strong><div>${mpmlaEscape(grievance.description)}</div></div>
                </div>
            </div>
            <div class="panel-header" style="margin-top:20px;">
                <h3>Timeline</h3>
                <span class="pill">History</span>
            </div>
            <div class="list-compact">
                ${(grievance.timeline || []).map((step) => `
                    <div class="list-item-card">
                        <div>
                            <strong>${mpmlaEscape(step.label)}</strong>
                            <div>${mpmlaEscape(step.date)}</div>
                        </div>
                        <span class="pill">${step.response ? "Response" : "Status"}</span>
                    </div>
                `).join("") || '<div class="content-empty">No timeline updates available.</div>'}
            </div>
        </section>
    `;

    updateCitizenDashboardBackButton();
}


function renderDepartmentGrievanceDetail(grievance) {

    const container = document.getElementById("departmentDashboardContent");
    if (!container || !grievance) {
        return;
    }

    const statusClass = String(grievance.status || "submitted")
        .toLowerCase()
        .replace(/\s+/g, "-");

    container.innerHTML = `
        <section class="department-view department-detail-view">
            <div class="department-heading">
                <span class="department-hero-tag">CASE REVIEW</span>
                <h1>${mpmlaEscape(grievance.subject)}</h1>
                <p>${mpmlaEscape(grievance.description || "Review the selected grievance and its current workflow history.")}</p>
            </div>
            <section class="department-panel">
                <div class="department-case-meta">
                    <span class="department-chip">${mpmlaEscape(grievance.id)}</span>
                    <span class="department-chip">${mpmlaEscape(grievance.location || "Location pending")}</span>
                    <span class="department-status ${statusClass}">${mpmlaEscape(grievance.status)}</span>
                </div>
                <div class="department-timeline" style="margin-top: 18px;">
                    ${(grievance.timeline || []).map((step) => `
                        <div class="department-timeline-item">
                            <span class="department-timeline-dot"></span>
                            <div class="department-timeline-card">
                                <strong>${mpmlaEscape(step.label)}</strong>
                                <small>${mpmlaEscape(step.date)}${step.response ? ` · ${mpmlaEscape(step.response)}` : ""}</small>
                            </div>
                        </div>
                    `).join("") || '<div class="content-empty">No timeline updates available.</div>'}
                </div>
                <button type="button" class="department-secondary-button" data-department-back-to-queue="true">
                    ← Back to assigned grievances
                </button>
            </section>
        </section>
    `;

    const backButton = container.querySelector("[data-department-back-to-queue]");
    if (backButton) {
        backButton.addEventListener("click", function() {
            setDepartmentDashboardView("assigned");
        });
    }
}


function handleMPMLALogin(event) {

    if (event && event.preventDefault) {
        event.preventDefault();
    }

    const emailInput = document.getElementById("mpmlaEmail");
    const passwordInput = document.getElementById("mpmlaPassword");
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email || !password) {
        showLoginMessage("Please enter your email and password.");
        return;
    }

    sessionStorage.setItem("civicai-authenticated", "true");
    sessionStorage.setItem("civicai-user-role", "mpmla");
    AppState.currentRole = "mpmla";
    navigateTo("mpmla-dashboard");

}


function handleDepartmentLogin(event) {

    if (event && event.preventDefault) {
        event.preventDefault();
    }

    const emailInput = document.getElementById("departmentEmail");
    const passwordInput = document.getElementById("departmentPassword");
    const email = emailInput ? emailInput.value.trim() : "";
    const password = passwordInput ? passwordInput.value : "";

    if (!email || !password) {
        showLoginMessage("Please enter your department email and password.");
        return;
    }

    sessionStorage.setItem("civicai-authenticated", "true");
    sessionStorage.setItem("civicai-user-role", "department");
    AppState.currentRole = "department";
    navigateTo("department-dashboard");

}


/* =========================================================
   41. ABOUT MODAL
   ========================================================= */

function initializeAboutModal() {

    const modal =
        document.getElementById(
            "aboutModal"
        );


    if (!modal) {

        return;

    }


    modal.addEventListener(
        "click",
        function(event) {

            if (
                event.target === modal
            ) {

                closeAboutModal();

            }

        }
    );

}


function openAboutModal() {

    const modal =
        document.getElementById(
            "aboutModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );


    const closeButton =
        document.getElementById(
            "closeAboutModal"
        );


    if (closeButton) {

        setTimeout(
            function() {

                closeButton.focus();

            },
            100
        );

    }

}


function closeAboutModal() {

    const modal =
        document.getElementById(
            "aboutModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   42. MOBILE NAVIGATION
   ========================================================= */

function toggleMobileNavigation() {

    const navigation =
        document.getElementById(
            "mobileNavigation"
        );


    const button =
        document.getElementById(
            "mobileMenuButton"
        );


    if (!navigation) {

        return;

    }


    const isOpen =
        navigation.classList.toggle(
            "active"
        );


    if (button) {

        button.setAttribute(
            "aria-expanded",
            String(isOpen)
        );

    }

}


function closeMobileNavigation() {

    const navigation =
        document.getElementById(
            "mobileNavigation"
        );


    const button =
        document.getElementById(
            "mobileMenuButton"
        );


    if (navigation) {

        navigation.classList.remove(
            "active"
        );

    }


    if (button) {

        button.setAttribute(
            "aria-expanded",
            "false"
        );

    }

}


/* =========================================================
   43. ROLE MANAGEMENT
   ========================================================= */

function setRole(role) {

    if (
        !SupportedRoles.includes(role)
    ) {

        console.warn(
            "Invalid role:",
            role
        );

        return;

    }


    AppState.currentRole =
        role;


    sessionStorage.setItem(
        "civicai-role",
        role
    );


    console.log(
        `CivicAI role selected: ${role}`
    );

}


/* =========================================================
   44. NAVIGATION
   ========================================================= */

async function navigateTo(pageName) {

    if (
        !PageMap[pageName]
    ) {

        console.error(
            `Cannot navigate. Page "${pageName}" is not registered.`
        );

        return false;

    }


    closeMobileNavigation();

    closeAboutModal();


    return await loadPage(
        pageName
    );

}


/* =========================================================
   43. NOTIFICATION PANEL MANAGEMENT
   ========================================================= */

function toggleNotificationPanel() {

    if (AppState.currentRole === "citizen") {
        setCitizenDashboardView("notifications");
        renderCitizenDashboardView("notifications");

        document
            .querySelectorAll(".dashboard-page[data-role-page='citizen'] .sidebar-nav-item")
            .forEach((item) => item.classList.toggle(
                "active",
                item.getAttribute("data-dashboard-view") === "notifications"
            ));

        updateNotificationBadge();
    }
}

function updateNotificationBadge() {
    const notifications = getDashboardNotifications();
    const badge = document.getElementById("notificationBadge");
    
    if (badge) {
        const unreadCount = notifications.filter((n) => n.unread).length;
        badge.textContent = unreadCount > 0 ? unreadCount : "0";
    }
}


/* =========================================================
   44. VOICE INPUT HANDLER
   ========================================================= */

function initializeVoiceInput(textareaId, language = "en") {

    const textarea = document.getElementById(textareaId);
    if (!textarea) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
        console.warn("Speech Recognition not supported in this browser");
        return null;
    }

    const recognition = new SpeechRecognition();
    let isListening = false;

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = getWebSpeechLanguage(language);

    recognition.onstart = function() {
        isListening = true;
        updateMicrophoneButtonState(true);
    };

    recognition.onresult = function(event) {
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i].transcript;
            
            if (event.results[i].isFinal) {
                textarea.value += (textarea.value ? ' ' : '') + transcript;
            } else {
                interimTranscript += transcript;
            }
        }
        
        if (interimTranscript && textarea) {
            console.log("Interim:", interimTranscript);
        }
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error:", event.error);
        updateMicrophoneButtonState(false);
    };

    recognition.onend = function() {
        isListening = false;
        updateMicrophoneButtonState(false);
    };

    return recognition;
}

function getWebSpeechLanguage(civicaiLang) {
    const langMap = {
        "en": "en-US",
        "ta": "ta-IN",
        "hi": "hi-IN",
        "te": "te-IN",
        "ml": "ml-IN",
        "kn": "kn-IN",
        "mr": "mr-IN",
        "bn": "bn-IN",
        "gu": "gu-IN"
    };
    return langMap[civicaiLang] || "en-US";
}

function updateMicrophoneButtonState(isActive) {
    const micButton = document.getElementById("grievanceMicrophoneButton");
    if (!micButton) return;
    
    if (isActive) {
        micButton.classList.add("listening");
        micButton.setAttribute("aria-label", "Listening...");
    } else {
        micButton.classList.remove("listening");
        micButton.setAttribute("aria-label", "Start voice input");
    }
}

function startVoiceInput(recognition) {
    if (recognition && !recognition.isListening) {
        try {
            recognition.start();
        } catch (e) {
            console.error("Could not start voice input:", e);
        }
    }
}

function stopVoiceInput(recognition) {
    if (recognition) {
        recognition.stop();
    }
}


/* =========================================================
   44. 3D TIMELINE VISUALIZATION
   ========================================================= */

function renderTimeline3D(grievance) {

    const stages = [
        { label: "Submitted", key: "Submitted" },
        { label: "Under Review", key: "Under Review" },
        { label: "In Progress", key: "In Progress" },
        { label: "Resolved", key: "Resolved" }
    ];

    const currentStatusIndex = stages.findIndex((s) => s.key === grievance.status);
    
    let timelineHTML = `
        <div class="timeline-3d-container">
            <div class="timeline-3d-track">
    `;

    stages.forEach((stage, index) => {
        const isCompleted = index <= currentStatusIndex;
        const isCurrent = index === currentStatusIndex;
        const nextStage = index < stages.length - 1 ? stages[index + 1] : null;

        timelineHTML += `
            <div class="timeline-node ${isCurrent ? "active" : ""} ${isCompleted ? "completed" : "pending"}">
                <div class="node-circle">
                    <span class="node-dot"></span>
                </div>
                <div class="node-label">
                    <strong>${stage.label}</strong>
                </div>
            </div>
        `;

        if (nextStage && index < stages.length - 1) {
            const lineClass = isCompleted ? "completed" : "pending";
            timelineHTML += `<div class="timeline-connector ${lineClass}"></div>`;
        }
    });

    timelineHTML += `
            </div>
        </div>
    `;

    return timelineHTML;
}


/* =========================================================
   45. IMPROVED DASHBOARD OVERVIEW
   ========================================================= */

function renderCitizenDashboardImproved() {

    const container = document.getElementById("citizenDashboardContent");
    if (!container) return;

    const grievances = getDashboardGrievances();
    const notifications = getDashboardNotifications();
    const profile = readLocalStorageJson("civicai-profile", {});
    
    const stats = {
        total: grievances.length,
        pending: grievances.filter((item) => item.status === "Submitted" || item.status === "Under Review").length,
        inProgress: grievances.filter((item) => item.status === "In Progress").length,
        resolved: grievances.filter((item) => item.status === "Resolved").length
    };

    const userName = profile.fullName || "Citizen";

    container.innerHTML = `
        <div class="dashboard-welcome-section">
            <div class="welcome-card">
                <div class="welcome-content">
                    <h2>Welcome back, <span class="user-name">${mpmlaEscape(userName)}</span></h2>
                    <p class="welcome-subtitle">Your civic issues matter. Track everything here.</p>
                </div>
                <div class="welcome-visual">
                    <span class="welcome-emoji">✨</span>
                </div>
            </div>
        </div>

        <div class="dashboard-cards">
            <div class="dashboard-stat">
                <div class="stat-icon">📋</div>
                <small>Total grievances</small>
                <strong>${stats.total}</strong>
                <span>All submitted requests</span>
            </div>
            <div class="dashboard-stat">
                <div class="stat-icon">⏳</div>
                <small>Pending</small>
                <strong>${stats.pending}</strong>
                <span>Waiting for action</span>
            </div>
            <div class="dashboard-stat">
                <div class="stat-icon">⚙️</div>
                <small>In progress</small>
                <strong>${stats.inProgress}</strong>
                <span>Currently under review</span>
            </div>
            <div class="dashboard-stat">
                <div class="stat-icon">✅</div>
                <small>Resolved</small>
                <strong>${stats.resolved}</strong>
                <span>Completed requests</span>
            </div>
        </div>

        <div class="widget-grid">
            <section class="panel">
                <div class="panel-header">
                    <h3>Recent activity</h3>
                    <span class="pill">${grievances.length} total</span>
                </div>
                <div class="list-compact">
                    ${grievances.slice(0, 3).map((grievance) => `
                        <div class="list-item-card">
                            <div>
                                <strong>${grievance.subject}</strong>
                                <div style="color: var(--text-secondary); font-size: 12px; margin-top: 4px;">${grievance.id} • ${grievance.location}</div>
                            </div>
                            <div style="display: flex; align-items: center; gap: 10px;">
                                <span class="tag ${grievance.status.toLowerCase().replace(/\s+/g, '-')}">${grievance.status}</span>
                                <button type="button" class="detail-button" data-grievance-id="${grievance.id}">View</button>
                            </div>
                        </div>
                    `).join("") || '<div class="content-empty">No concerns recorded yet.</div>'}
                </div>
            </section>

            <section class="panel quick-actions-panel">
                <div class="panel-header">
                    <h3>Quick actions</h3>
                </div>
                <div class="quick-actions-grid">
                    <button type="button" class="action-button primary-action" data-dashboard-view="grievance">
                        <span class="action-icon">➕</span>
                        <span class="action-label">Report Problem</span>
                    </button>
                    <button type="button" class="action-button secondary-action" data-dashboard-view="my-grievances">
                        <span class="action-icon">📍</span>
                        <span class="action-label">Track Issues</span>
                    </button>
                    <button type="button" class="action-button secondary-action" data-dashboard-view="schemes">
                        <span class="action-icon">🎁</span>
                        <span class="action-label">Schemes</span>
                    </button>
                    <button type="button" class="action-button secondary-action" data-dashboard-view="services">
                        <span class="action-icon">🏛️</span>
                        <span class="action-label">Services</span>
                    </button>
                </div>
            </section>
        </div>
    `;

    bindDashboardButtons();
    bindGrievanceViewButtons();
    bindSidebarNavigation();
}


/* =========================================================
   45. GLOBAL CIVICAI API
   ========================================================= */

window.CivicAI = {

    state:
        AppState,

    languages:
        SupportedLanguages,

    roles:
        SupportedRoles,

    pages:
        PageMap,

    loadPage:
        loadPage,

    navigateTo:
        navigateTo,

    setTheme:
        setTheme,

    toggleTheme:
        toggleTheme,

    setLanguage:
        setLanguage,

    setRole:
        setRole,

    selectRole:
        selectRole,

    openAboutModal:
        openAboutModal,

    closeAboutModal:
        closeAboutModal,

    handleBackNavigation:
        handleBackNavigation

};


/* =========================================================
   END OF CIVICAI APP CONTROLLER
   ========================================================= */
