import { reactive } from 'vue'

export const notificationState = reactive({
    notifications: []
})

export class NotificationService {
    static show(message, type = 'info', duration = 5000) {
        const id = Date.now() + Math.random()
        const notification = {
            id,
            message,
            type, // 'success', 'error', 'warning', 'info'
            timestamp: new Date()
        }

        notificationState.notifications.push(notification)

        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.remove(id)
            }, duration)
        }

        return id
    }

    static success(message, duration = 5000) {
        return this.show(message, 'success', duration)
    }

    static error(message, duration = 7000) {
        return this.show(message, 'error', duration)
    }

    static warning(message, duration = 6000) {
        return this.show(message, 'warning', duration)
    }

    static info(message, duration = 5000) {
        return this.show(message, 'info', duration)
    }

    static remove(id) {
        const index = notificationState.notifications.findIndex(n => n.id === id)
        if (index > -1) {
            notificationState.notifications.splice(index, 1)
        }
    }

    static clear() {
        notificationState.notifications.splice(0)
    }
}