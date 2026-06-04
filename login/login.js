document.querySelectorAll(".tab").forEach((tab) => {
      tab.addEventListener("click", () => {
        const target = tab.getAttribute("data-form");
        document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
        document.querySelectorAll(".forms").forEach((form) => form.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(`${target}-form`).classList.add("active");
      });
    });

    // Validation helper
    function setError(id, msg) {
      const el = document.getElementById(id);
      el.textContent = msg;
    }
    function clearError(id) {
      setError(id, "");
    }

    // Login handler (frontend only)
    function handleLogin() {
      const email = document.getElementById("login-email").value.trim();
      const password = document.getElementById("login-password").value;

      clearError("login-email-error");
      clearError("login-password-error");

      let valid = true;

      if (!email) {
        setError("login-email-error", "Email is required");
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError("login-email-error", "Email is invalid");
        valid = false;
      }

      if (!password) {
        setError("login-password-error", "Password is required");
        valid = false;
      }

      if (valid) {
        // In real app, send to backend (e.g., Node.js / Firebase)
        alert("Login logic would go to backend in production.");
        console.log("Login:", { email, password });
      }
    }

    // Signup handler (frontend only)
    function handleSignup() {
      const name = document.getElementById("signup-name").value.trim();
      const email = document.getElementById("signup-email").value.trim();
      const password = document.getElementById("signup-password").value;
      const confirm = document.getElementById("signup-confirm").value;

      clearError("signup-name-error");
      clearError("signup-email-error");
      clearError("signup-password-error");
      clearError("signup-confirm-error");

      let valid = true;

      if (!name) {
        setError("signup-name-error", "Name is required");
        valid = false;
      }

      if (!email) {
        setError("signup-email-error", "Email is required");
        valid = false;
      } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        setError("signup-email-error", "Email is invalid");
        valid = false;
      }

      if (!password) {
        setError("signup-password-error", "Password is required");
        valid = false;
      } else if (password.length < 6) {
        setError("signup-password-error", "Password must be at least 6 characters");
        valid = false;
      }

      if (confirm !== password) {
        setError("signup-confirm-error", "Passwords do not match");
        valid = false;
      }

      if (valid) {
        // In real app, register user on backend
        alert("Registration successful! Please check your email to verify.");
        console.log("Signup:", { name, email, password });
      }
    }