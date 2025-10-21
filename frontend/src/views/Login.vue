<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h2>{{ isLoginMode ? "Sign In" : "Create Account" }}</h2>
        <p>
          {{
            isLoginMode
              ? "Welcome back to Library Management System"
              : "Join our Library Management System"
          }}
        </p>
      </div>

      <form @submit.prevent="handleSubmit" class="login-form">
        <!-- Username Field -->
        <div class="form-group">
          <label for="user_name">Username</label>
          <input
            type="text"
            id="user_name"
            v-model="formData.user_name"
            :class="{ error: errors.user_name }"
            placeholder="Enter your username"
            required
          />
          <span v-if="errors.user_name" class="error-message">{{
            errors.user_name
          }}</span>
        </div>

        <!-- Email Field (for registration) -->
        <div v-if="!isLoginMode" class="form-group">
          <label for="email">Email (Optional)</label>
          <input
            type="email"
            id="email"
            v-model="formData.email"
            :class="{ error: errors.email }"
            placeholder="Enter your email"
          />
          <span v-if="errors.email" class="error-message">{{
            errors.email
          }}</span>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="password"
              v-model="formData.password"
              :class="{ error: errors.password }"
              :placeholder="
                isLoginMode
                  ? 'Enter your password'
                  : 'Choose a password (min 6 characters)'
              "
              required
            />
            <button
              type="button"
              @click="togglePassword"
              class="password-toggle"
            >
              {{ showPassword ? "👁️" : "👁️‍🗨️" }}
            </button>
          </div>
          <span v-if="errors.password" class="error-message">{{
            errors.password
          }}</span>
        </div>

        <!-- Role Field (for registration) -->
        <div v-if="!isLoginMode" class="form-group">
          <label for="role">Role</label>
          <select
            id="role"
            v-model="formData.role"
            :class="{ error: errors.role }"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <span v-if="errors.role" class="error-message">{{
            errors.role
          }}</span>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-button" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          {{
            loading
              ? "Please wait..."
              : isLoginMode
              ? "Sign In"
              : "Create Account"
          }}
        </button>

        <!-- Mode Toggle -->
        <div class="mode-toggle">
          <p v-if="isLoginMode">
            Don't have an account?
            <button type="button" @click="toggleMode" class="link-button">
              Create one
            </button>
          </p>
          <p v-else>
            Already have an account?
            <button type="button" @click="toggleMode" class="link-button">
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import authService from "../services/authService.js";
import { NotificationService } from "../services/notificationService.js";

export default {
  name: "Login",
  data() {
    return {
      isLoginMode: true,
      loading: false,
      showPassword: false,
      formData: {
        user_name: "",
        email: "",
        password: "",
        role: "user",
      },
      errors: {},
    };
  },
  methods: {
    async handleSubmit() {
      if (!this.validateForm()) {
        return;
      }

      this.loading = true;
      this.errors = {};

      try {
        let response;
        if (this.isLoginMode) {
          response = await authService.login({
            user_name: this.formData.user_name,
            password: this.formData.password,
          });
        } else {
          response = await authService.register(this.formData);
        }

        NotificationService.success(response.message);

        // Redirect to dashboard
        this.$router.push("/dashboard");
      } catch (error) {
        console.error("Authentication error:", error);

        if (error.response?.data?.message) {
          NotificationService.error(error.response.data.message);
        } else {
          NotificationService.error(
            this.isLoginMode
              ? "Login failed. Please try again."
              : "Registration failed. Please try again."
          );
        }
      } finally {
        this.loading = false;
      }
    },

    validateForm() {
      this.errors = {};

      if (!this.formData.user_name.trim()) {
        this.errors.user_name = "Username is required";
      }

      if (!this.formData.password) {
        this.errors.password = "Password is required";
      } else if (!this.isLoginMode && this.formData.password.length < 6) {
        this.errors.password = "Password must be at least 6 characters long";
      }

      if (
        !this.isLoginMode &&
        this.formData.email &&
        !this.isValidEmail(this.formData.email)
      ) {
        this.errors.email = "Please enter a valid email address";
      }

      return Object.keys(this.errors).length === 0;
    },

    isValidEmail(email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    },

    toggleMode() {
      this.isLoginMode = !this.isLoginMode;
      this.errors = {};
      this.formData = {
        user_name: "",
        email: "",
        password: "",
        role: "user",
      };
    },

    togglePassword() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h2 {
  color: #333;
  margin-bottom: 8px;
  font-size: 28px;
  font-weight: 600;
}

.login-header p {
  color: #666;
  font-size: 14px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #555;
  font-size: 14px;
}

.form-group input,
.form-group select {
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 8px;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-group input.error,
.form-group select.error {
  border-color: #e74c3c;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 4px;
}

.error-message {
  color: #e74c3c;
  font-size: 12px;
  margin-top: 4px;
}

.submit-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 14px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.mode-toggle {
  text-align: center;
  margin-top: 20px;
}

.mode-toggle p {
  color: #666;
  font-size: 14px;
}

.link-button {
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-weight: 600;
  text-decoration: underline;
}

.link-button:hover {
  color: #764ba2;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-header h2 {
    font-size: 24px;
  }
}
</style>