<template>
  <div class="notification-container">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      :class="getAlertClass(notification.type)"
      class="alert alert-dismissible fade show"
      role="alert"
    >
      <i :class="getIconClass(notification.type)"></i>
      {{ notification.message }}
      <button
        type="button"
        class="btn-close"
        @click="removeNotification(notification.id)"
        aria-label="Close"
      ></button>
    </div>
  </div>
</template>

<script>
import {
  notificationState,
  NotificationService,
} from "../services/notificationService.js";

export default {
  name: "NotificationContainer",
  data() {
    return {
      notificationState,
    };
  },
  computed: {
    notifications() {
      return this.notificationState.notifications;
    },
  },
  methods: {
    getAlertClass(type) {
      const classes = {
        success: "alert-success",
        error: "alert-danger",
        warning: "alert-warning",
        info: "alert-info",
      };
      return classes[type] || "alert-info";
    },
    getIconClass(type) {
      const classes = {
        success: "fas fa-check-circle me-2",
        error: "fas fa-exclamation-triangle me-2",
        warning: "fas fa-exclamation-circle me-2",
        info: "fas fa-info-circle me-2",
      };
      return classes[type] || "fas fa-info-circle me-2";
    },
    removeNotification(id) {
      NotificationService.remove(id);
    },
  },
};
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.alert {
  margin-bottom: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border: none;
  border-radius: 8px;
}

.alert-success {
  background-color: #d4edda;
  color: #155724;
  border-left: 4px solid #28a745;
}

.alert-danger {
  background-color: #f8d7da;
  color: #721c24;
  border-left: 4px solid #dc3545;
}

.alert-warning {
  background-color: #fff3cd;
  color: #856404;
  border-left: 4px solid #ffc107;
}

.alert-info {
  background-color: #d1ecf1;
  color: #0c5460;
  border-left: 4px solid #17a2b8;
}
</style>
