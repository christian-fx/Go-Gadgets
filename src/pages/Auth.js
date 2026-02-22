import { store } from '../store.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
  sendEmailVerification
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from '../api/firebase-config.js';

export function renderAuth() {
  return `
    <div class="min-h-screen bg-gray-50 flex">
      
      <!-- Left Form Section -->
      <div class="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-y-auto">
        <!-- Back to Home -->
        <a href="/" data-link class="absolute top-8 left-8 flex items-center gap-2 text-sm font-semibold text-gray-900 hover:text-blue-600 transition-colors">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
          GO GADGETS
        </a>

        <div class="w-full max-w-md mt-12 lg:mt-0">
          <div class="text-center mb-8">
            <h1 id="auth-title" class="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h1>
            <p id="auth-subtitle" class="mt-3 text-gray-500">Enter your email to sign in to your account</p>
          </div>

          <!-- Auth Tabs -->
          <div class="flex p-1 bg-gray-100 rounded-lg mb-8" role="tablist">
            <button id="tab-login" class="flex-1 py-2.5 px-4 text-sm font-semibold rounded-md bg-white text-gray-900 shadow-sm transition-all focus:outline-none">Log In</button>
            <button id="tab-signup" class="flex-1 py-2.5 px-4 text-sm font-semibold rounded-md text-gray-500 hover:text-gray-900 transition-all focus:outline-none">Sign Up</button>
          </div>

          <!-- Alert Container (Hidden by default) -->
          <div id="auth-alert" class="hidden mb-6 p-4 rounded-md text-sm font-medium"></div>

          <!-- Master Auth Form -->
          <form id="auth-form" class="space-y-5">
            
            <!-- Dynamic Sign Up Fields -->
            <div id="signup-fields" class="hidden space-y-5">
              <div>
                <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input type="text" id="name" name="name" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="John Doe">
              </div>
              <div>
                <label for="phone" class="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input type="tel" id="phone" name="phone" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="+1 (555) 000-0000">
              </div>
            </div>

            <!-- Standard Fields -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" name="email" required class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="name@example.com">
            </div>

            <div class="relative">
               <div class="flex items-center justify-between mb-1">
                 <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                 <a href="#" id="forgot-password-link" class="text-sm font-medium text-blue-600 hover:text-blue-500">Forgot password?</a>
               </div>
               <div class="relative">
                 <input type="password" id="password" name="password" required class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="••••••••">
                 <button type="button" class="toggle-password absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none" data-target="password">
                   <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                 </button>
               </div>
            </div>

            <div id="confirm-password-container" class="hidden relative">
               <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
               <div class="relative">
                 <input type="password" id="confirm-password" name="confirm-password" class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="••••••••">
                 <button type="button" class="toggle-password absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none" data-target="confirm-password">
                   <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                 </button>
               </div>
            </div>

            <button type="submit" id="auth-submit-btn" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors mt-6">
              Sign In with Email
            </button>
          </form>

          <!-- Social Auth Divider -->
          <div class="mt-8">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-200"></div>
              </div>
              <div class="relative flex justify-center text-xs uppercase">
                <span class="bg-gray-50 px-2 text-gray-400">Or continue with</span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-1 gap-3">
              <button id="google-login-btn" class="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-gray-200 rounded-lg bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <svg class="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
            </div>
            
            <p class="mt-8 text-center text-xs text-gray-500">
              By clicking continue, you agree to our <a href="#" class="font-medium text-gray-900 border-b border-gray-900">Terms of Service</a> and <a href="#" class="font-medium text-gray-900 border-b border-gray-900">Privacy Policy</a>
            </p>
          </div>
        </div>
      </div>

      <!-- Right Image Section -->
      <div class="hidden lg:block lg:w-1/2 relative bg-gray-900 overflow-hidden">
        <img class="absolute inset-0 w-full h-full object-cover opacity-80" src="https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80" alt="High-tech workstation desk">
        <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div class="absolute bottom-12 left-12 right-12 text-white">
          <blockquote class="text-2xl font-semibold leading-relaxed mb-4">
            "The future of technology is not just about what we can achieve, but how effortlessly we can do it."
          </blockquote>
          <p class="text-gray-300">Designed for the modern creator.</p>
      </div>
      
      <!-- Verification Modal Overlay (Hidden by default) -->
      <div id="verification-modal" class="fixed inset-0 z-[200] bg-gray-900/50 hidden flex-col items-center justify-center opacity-0 transition-opacity duration-300">
        <div class="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transform scale-95 transition-transform duration-300 text-center">
           <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
             <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
           </div>
           <h3 class="text-2xl font-bold text-gray-900 mb-2 tracking-tight">Verify your email</h3>
           <p class="text-gray-500 mb-8 leading-relaxed">We sent a verification link to your email address. Please click the link to activate your account. <br/><span class="text-sm mt-2 block">(Don't forget to check your spam folder!)</span></p>
           
           <div class="flex flex-col gap-3">
              <button id="btn-verified" class="w-full py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm text-sm">
                 I have verified
              </button>
              <button id="btn-resend" class="w-full py-3 bg-gray-50 text-gray-700 hover:bg-gray-100 font-medium rounded-lg transition text-sm flex items-center justify-center gap-2 border border-gray-200">
                 <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                 Resend Email
              </button>
           </div>
           <div id="resend-alert" class="hidden mt-4 text-sm font-medium"></div>
        </div>
      </div>

    </div>
  `;
}

export function onAuthMount() {
  let isSignUpMode = false;

  // Elements
  const tabLogin = document.getElementById('tab-login');
  const tabSignup = document.getElementById('tab-signup');
  const authTitle = document.getElementById('auth-title');
  const authSubtitle = document.getElementById('auth-subtitle');
  const signupFields = document.getElementById('signup-fields');
  const confirmPasswordContainer = document.getElementById('confirm-password-container');
  const submitBtn = document.getElementById('auth-submit-btn');
  const forgotPasswordLink = document.getElementById('forgot-password-link');
  const authForm = document.getElementById('auth-form');
  const authAlert = document.getElementById('auth-alert');

  // Verification Modal Elements
  const verificationModal = document.getElementById('verification-modal');
  const btnVerified = document.getElementById('btn-verified');
  const btnResend = document.getElementById('btn-resend');
  const resendAlert = document.getElementById('resend-alert');

  // Helper: Translate Firebase Errors to User-Friendly Strings
  const translateAuthError = (error) => {
    const code = error.code || '';
    switch (code) {
      case 'auth/invalid-credential':
        return 'The email or password you entered is incorrect.';
      case 'auth/user-not-found':
        return 'No account found with this email. Please sign up first.';
      case 'auth/wrong-password':
        return 'Incorrect password. Try clicking "Forgot Password" if you are stuck.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email address. Please log in instead.';
      case 'auth/weak-password':
        return 'Your password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-email':
        return 'The email address is improperly formatted.';
      case 'auth/too-many-requests':
        return 'Too many matching attempts. Please wait a moment and try again.';
      default:
        return 'An unexpected error occurred. Please try again.';
    }
  };

  // Input Fields
  const nameInput = document.getElementById('name');
  const confirmPasswordInput = document.getElementById('confirm-password');

  // Tab Switching Logic
  const setMode = (signup) => {
    isSignUpMode = signup;
    authAlert.classList.add('hidden'); // Clear alerts on switch

    if (signup) {
      // Switch UI to Sign Up
      tabSignup.classList.remove('text-gray-500', 'hover:text-gray-900');
      tabSignup.classList.add('bg-white', 'text-gray-900', 'shadow-sm');

      tabLogin.classList.remove('bg-white', 'text-gray-900', 'shadow-sm');
      tabLogin.classList.add('text-gray-500', 'hover:text-gray-900');

      authTitle.textContent = 'Create an account';
      authSubtitle.textContent = 'Join us and start shopping modern tech';
      submitBtn.textContent = 'Sign Up with Email';

      forgotPasswordLink.classList.add('hidden');
      signupFields.classList.remove('hidden');
      confirmPasswordContainer.classList.remove('hidden');

      nameInput.setAttribute('required', 'true');
      confirmPasswordInput.setAttribute('required', 'true');
    } else {
      // Switch UI to Log In
      tabLogin.classList.remove('text-gray-500', 'hover:text-gray-900');
      tabLogin.classList.add('bg-white', 'text-gray-900', 'shadow-sm');

      tabSignup.classList.remove('bg-white', 'text-gray-900', 'shadow-sm');
      tabSignup.classList.add('text-gray-500', 'hover:text-gray-900');

      authTitle.textContent = 'Welcome back';
      authSubtitle.textContent = 'Enter your email to sign in to your account';
      submitBtn.textContent = 'Sign In with Email';

      forgotPasswordLink.classList.remove('hidden');
      signupFields.classList.add('hidden');
      confirmPasswordContainer.classList.add('hidden');

      nameInput.removeAttribute('required');
      confirmPasswordInput.removeAttribute('required');
    }
  };

  tabLogin.addEventListener('click', () => setMode(false));
  tabSignup.addEventListener('click', () => setMode(true));

  // Password Visibility Toggles
  const toggles = document.querySelectorAll('.toggle-password');
  toggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      const targetId = e.currentTarget.getAttribute('data-target');
      const input = document.getElementById(targetId);
      const isPassword = input.type === 'password';

      input.type = isPassword ? 'text' : 'password';

      // Swap icon (Eye / Eye Off)
      if (isPassword) {
        // Eye Off Icon
        e.currentTarget.innerHTML = `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>`;
      } else {
        // Eye Icon
        e.currentTarget.innerHTML = `<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>`;
      }
    });
  });

  // Form Submission Logic
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(authForm);
    const email = formData.get('email');
    const password = formData.get('password');

    // Reset Alerts
    authAlert.classList.add('hidden');
    authAlert.classList.remove('bg-red-50', 'text-red-700', 'bg-green-50', 'text-green-700');

    if (isSignUpMode) {
      const name = formData.get('name');
      const phone = formData.get('phone');
      const confirmPassword = formData.get('confirm-password');

      // Validation
      if (password !== confirmPassword) {
        authAlert.textContent = 'Passwords do not match.';
        authAlert.classList.add('block', 'bg-red-50', 'text-red-700');
        authAlert.classList.remove('hidden');
        return;
      }

      if (password.length < 6) {
        authAlert.textContent = 'Password must be at least 6 characters.';
        authAlert.classList.add('block', 'bg-red-50', 'text-red-700');
        authAlert.classList.remove('hidden');
        return;
      }

      // Simulate Firebase Registration Request
      submitBtn.disabled = true;
      submitBtn.textContent = 'Creating account...';

      try {
        // REAL FIREBASE LOGIC
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create Profile Data
        await setDoc(doc(db, "users", user.uid), {
          name: name,
          email: email,
          phone: phone || null,
          role: 'customer',
          createdAt: new Date().toISOString(),
          orders: 0,
          totalSpent: 0
        });
        // Send Verification Email
        await sendEmailVerification(user);

        authAlert.textContent = 'Account created! Please check your email to verify your account.';
        authAlert.classList.add('block', 'bg-green-50', 'text-green-700');
        authAlert.classList.remove('hidden');

        // Prevent them from auto-navigating to the backend if unverified.
        // Clear the mock sign in token from Firebase auth state to keep them here.
        import("firebase/auth").then(({ signOut }) => signOut(auth));

        // Show Verification Modal natively
        verificationModal.classList.remove('hidden');
        requestAnimationFrame(() => {
          verificationModal.classList.remove('opacity-0');
          verificationModal.querySelector('div').classList.remove('scale-95');
        });

        // Temporarily store the email to allow resends
        document.getElementById('email').setAttribute('data-unverified-user', true);

      } catch (error) {
        authAlert.textContent = translateAuthError(error);
        authAlert.classList.add('block', 'bg-red-50', 'text-red-700');
        authAlert.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up with Email';
      }

    } else {
      // LOG IN MODE
      submitBtn.disabled = true;
      submitBtn.textContent = 'Signing in...';

      try {
        // REAL FIREBASE LOGIC
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        if (!userCredential.user.emailVerified) {
          // Sign them completely out of the local Firebase session to prevent store.js from caching them as logged in
          import("firebase/auth").then(({ signOut }) => signOut(auth));

          // Show Verification Modal
          authAlert.classList.add('hidden');
          submitBtn.disabled = false;
          submitBtn.textContent = 'Sign In with Email';

          verificationModal.classList.remove('hidden');
          requestAnimationFrame(() => {
            verificationModal.classList.remove('opacity-0');
            verificationModal.querySelector('div').classList.remove('scale-95');
          });

          // Temporarily store the email to allow resends
          document.getElementById('email').setAttribute('data-unverified-user', true);
          return;
        }

        // Mock visual delay, onAuthStateChanged catches this in store.js
        setTimeout(() => {
          window.router.navigate('/account');
        }, 500);

      } catch (error) {
        authAlert.textContent = translateAuthError(error);
        authAlert.classList.add('block', 'bg-red-50', 'text-red-700');
        authAlert.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign In with Email';
      }
    }
  });

  // Verification Modal Actions
  if (btnVerified) {
    btnVerified.addEventListener('click', () => {
      // Reload the page to force a re-login/re-check of auth state by Firebase
      window.location.reload();
    });
  }

  if (btnResend) {
    btnResend.addEventListener('click', async () => {
      const user = auth.currentUser;
      const origText = btnResend.innerHTML;
      btnResend.innerHTML = 'Sending...';
      btnResend.disabled = true;

      resendAlert.classList.remove('hidden', 'text-red-600', 'text-green-600');

      if (user) {
        try {
          await sendEmailVerification(user);
          resendAlert.textContent = 'Verification email re-sent! ETA ~1 minute.';
          resendAlert.classList.add('block', 'text-green-600');
        } catch (err) {
          resendAlert.textContent = 'Could not resend immediately. Try again later.';
          resendAlert.classList.add('block', 'text-red-600');
        }
      } else {
        resendAlert.textContent = 'Session lost. Please try logging in again first.';
        resendAlert.classList.add('block', 'text-red-600');
      }

      setTimeout(() => {
        btnResend.innerHTML = origText;
        btnResend.disabled = false;
      }, 3000);
    });
  }

  // Forgot Password Logic
  forgotPasswordLink.addEventListener('click', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    authAlert.classList.add('hidden');

    if (!email) {
      authAlert.textContent = 'Please enter your email address first.';
      authAlert.classList.add('block', 'bg-yellow-50', 'text-yellow-700');
      authAlert.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'bg-green-50', 'text-green-700');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      authAlert.textContent = 'Password reset email sent! Check your inbox.';
      authAlert.classList.add('block', 'bg-green-50', 'text-green-700');
      authAlert.classList.remove('hidden', 'bg-red-50', 'text-red-700', 'bg-yellow-50', 'text-yellow-700');
    } catch (error) {
      authAlert.textContent = translateAuthError(error);
      authAlert.classList.add('block', 'bg-red-50', 'text-red-700');
      authAlert.classList.remove('hidden');
    }
  });

  // Google Login Logic
  const googleBtn = document.getElementById('google-login-btn');
  if (googleBtn) {
    googleBtn.addEventListener('click', async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        // Check if user document exists, if not create it
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists()) {
          await setDoc(doc(db, "users", user.uid), {
            name: user.displayName || 'Google User',
            email: user.email,
            phone: user.phoneNumber || null,
            role: 'customer',
            createdAt: new Date().toISOString(),
            orders: 0,
            totalSpent: 0
          });
        }

        window.router.navigate('/account');
      } catch (error) {
        authAlert.textContent = translateAuthError(error);
        authAlert.classList.add('block', 'bg-red-50', 'text-red-700');
        authAlert.classList.remove('hidden');
      }
    });
  }
}
