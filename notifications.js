    // UNIFIED NOTIFICATION SYSTEM - Replace both files with this one
    class NotificationSystem {
        static currentUser = null;

        static init() {
            console.log('🔔 Initializing Unified Notification System...');
            
            this.currentUser = this.getCurrentUser();
            this.ensureNotificationData();
            this.setupEventListeners();
            this.updateBadge();
            
            return true;
        }

        static ensureNotificationData() {
            if (!localStorage.getItem('opuslink_notifications')) {
                localStorage.setItem('opuslink_notifications', JSON.stringify([]));
            }
        }

        static getCurrentUser() {
            try {
                return JSON.parse(sessionStorage.getItem('currentUser'));
            } catch (error) {
                console.error('Error getting current user:', error);
                return null;
            }
        }

        static setupEventListeners() {
            // Notification button click
            const notificationBtn = document.getElementById('notificationBtn');
            const notificationDropdown = document.getElementById('notificationDropdown');

            if (notificationBtn && notificationDropdown) {
                notificationBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.toggleDropdown();
                });

                // Close dropdown when clicking outside
                document.addEventListener('click', (e) => {
                    if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
                        this.closeDropdown();
                    }
                });
            }
        }

        static toggleDropdown() {
            const dropdown = document.getElementById('notificationDropdown');
            if (dropdown) {
                const isShowing = dropdown.classList.contains('show');
                dropdown.classList.toggle('show');
                
                if (!isShowing) {
                    this.loadNotifications();
                }
            }
        }

        static closeDropdown() {
            const dropdown = document.getElementById('notificationDropdown');
            if (dropdown) {
                dropdown.classList.remove('show');
            }
        }

        // CORE NOTIFICATION METHODS
        static getForUser(userId) {
            try {
                const notifications = JSON.parse(localStorage.getItem('opuslink_notifications') || '[]');
                return notifications.filter(notif => notif.userId === userId || notif.userId === 'all')
                                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            } catch (error) {
                console.error('Error getting notifications:', error);
                return [];
            }
        }

        static createNotification(userId, type, data = {}) {
            try {
                const notifications = JSON.parse(localStorage.getItem('opuslink_notifications') || '[]');
                
                const notificationTemplates = {
                    'application_received': {
                        title: 'New Application Received',
                        message: `New application received for ${data.jobTitle}`
                    },
                    'application_accepted': {
                        title: 'Application Accepted', 
                        message: `Your application for ${data.jobTitle} has been accepted`
                    },
                    'application_rejected': {
                        title: 'Application Rejected',
                        message: `Your application for ${data.jobTitle} was not selected`
                    },
                    'agreement_created': {
                        title: 'Work Agreement Created',
                        message: `New work agreement created for ${data.jobTitle}`
                    },
                    'payment_processed': {
                        title: 'Payment Processed', 
                        message: `Payment of ₹${data.amount} has been processed`
                    },
                    'work_rejected': {
                        title: 'Work Rejected',
                        message: `Your work submission was rejected by ${data.employerName}`
                    },
                    'new_message': {
                        title: 'New Message',
                        message: `New message from ${data.senderName}`
                    }
                };

                const template = notificationTemplates[type] || {
                    title: 'Notification',
                    message: 'You have a new notification'
                };

                const notification = {
                    id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                    userId: userId,
                    type: type,
                    title: template.title,
                    message: template.message,
                    data: data,
                    timestamp: new Date().toISOString(),
                    read: false,
                    priority: data.priority || 'normal'
                };

                notifications.push(notification);
                localStorage.setItem('opuslink_notifications', JSON.stringify(notifications));

                // Update badge
                this.updateBadge();

                return notification;
            } catch (error) {
                console.error('Error creating notification:', error);
                return null;
            }
        }

        static markAsRead(notificationId) {
            try {
                const notifications = JSON.parse(localStorage.getItem('opuslink_notifications') || '[]');
                const notification = notifications.find(notif => notif.id === notificationId);
                
                if (notification) {
                    notification.read = true;
                    localStorage.setItem('opuslink_notifications', JSON.stringify(notifications));
                    this.updateBadge();
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Error marking notification as read:', error);
                return false;
            }
        }

        static markAllAsRead(userId = null) {
            if (!userId) {
                userId = this.currentUser?.id;
            }
            if (!userId) return false;

            try {
                const notifications = JSON.parse(localStorage.getItem('opuslink_notifications') || '[]');
                let updated = false;

                const updatedNotifications = notifications.map(notification => {
                    if ((notification.userId === userId || notification.userId === 'all') && !notification.read) {
                        updated = true;
                        return {
                            ...notification,
                            read: true
                        };
                    }
                    return notification;
                });

                if (updated) {
                    localStorage.setItem('opuslink_notifications', JSON.stringify(updatedNotifications));
                    this.updateBadge();
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Error marking all notifications as read:', error);
                return false;
            }
        }

        static getUnreadCount(userId = null) {
            if (!userId) {
                userId = this.currentUser?.id;
            }
            if (!userId) return 0;

            const notifications = this.getForUser(userId);
            return notifications.filter(notif => !notif.read).length;
        }

        // UI METHODS
        static loadNotifications() {
            if (!this.currentUser) return;

            const notifications = this.getForUser(this.currentUser.id);
            this.displayNotifications(notifications);
        }

        static displayNotifications(notifications) {
            const container = document.getElementById('notificationsContainer');
            if (!container) return;

            if (notifications.length === 0) {
                container.innerHTML = `
                    <div style="padding: 40px 20px; text-align: center; color: #666;">
                        <div style="font-size: 3em; margin-bottom: 10px;">🔔</div>
                        <h4>No notifications</h4>
                        <p>You're all caught up!</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = notifications.map(notification => `
                <div class="notification-item ${notification.read ? 'read' : 'unread'}" 
                    data-notification-id="${notification.id}"
                    style="padding: 12px; border-bottom: 1px solid #eee; cursor: pointer; background: ${notification.read ? '#f9f9f9' : '#f0f8ff'};">
                    <div style="font-weight: bold; color: #333; margin-bottom: 4px;">${this.escapeHtml(notification.title)}</div>
                    <div style="color: #666; font-size: 0.9em; margin-bottom: 8px;">${this.escapeHtml(notification.message)}</div>
                    <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.8em; color: #999;">
                        <span>${this.formatTime(notification.timestamp)}</span>
                        ${!notification.read ? `
                            <button onclick="event.stopPropagation(); NotificationSystem.markAsRead('${notification.id}')" 
                                    style="background: #007bff; color: white; border: none; padding: 2px 8px; border-radius: 3px; font-size: 0.75em; cursor: pointer;">
                                Mark read
                            </button>
                        ` : ''}
                    </div>
                </div>
            `).join('');

            // Add click handlers
            container.querySelectorAll('.notification-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    if (!e.target.closest('button')) {
                        this.handleNotificationClick(item.dataset.notificationId);
                    }
                });
            });
        }

        static handleNotificationClick(notificationId) {
            const notification = this.getNotificationById(notificationId);
            if (!notification) return;

            this.markAsRead(notificationId);
            this.closeDropdown();

            // Handle different notification types
            switch (notification.type) {
                case 'application_received':
                case 'application_accepted':
                case 'application_rejected':
                    if (typeof EmployerDashboard !== 'undefined') {
                        EmployerDashboard.navigateToSection('applications');
                    }
                    break;
                case 'agreement_created':
                    if (typeof EmployerDashboard !== 'undefined') {
                        EmployerDashboard.navigateToSection('active-agreements');
                    }
                    break;
                case 'payment_processed':
                    if (typeof EmployerDashboard !== 'undefined') {
                        EmployerDashboard.navigateToSection('payment-history');
                    }
                    break;
                default:
                    console.log('Notification action:', notification);
            }
        }

        static getNotificationById(notificationId) {
            const notifications = JSON.parse(localStorage.getItem('opuslink_notifications') || '[]');
            return notifications.find(n => n.id === notificationId);
        }

        static updateBadge() {
            const badge = document.getElementById('notificationBadge');
            if (!badge) return;

            const unreadCount = this.getUnreadCount();
            badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }

        // UTILITY METHODS
        static formatTime(timestamp) {
            const date = new Date(timestamp);
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMs / 3600000);
            const diffDays = Math.floor(diffMs / 86400000);

            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            
            return date.toLocaleDateString();
        }

        static escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        // COMPATIBILITY METHODS - For existing code
        static createNotification(notificationData) {
            return this.createNotification(notificationData.userId, notificationData.type, {
                ...notificationData.data,
                priority: notificationData.priority
            });
        }

        static getUserNotifications() {
            return this.getForUser(this.currentUser?.id);
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Auto-initialize only if we're on a dashboard page
        if (document.querySelector('.dashboard-section') || document.getElementById('notificationBtn')) {
            setTimeout(() => {
                NotificationSystem.init();
            }, 1000);
        }
    });

    // Global access
    window.NotificationSystem = NotificationSystem;

    console.log('✅ Unified Notification System loaded');