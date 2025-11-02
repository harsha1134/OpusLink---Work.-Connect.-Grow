// UNIFIED NOTIFICATION SYSTEM - CLEAN VERSION
class NotificationSystem {
    static currentUser = null;

    static init() {
        console.log('🔔 Initializing Notification System...');
        
        this.currentUser = this.getCurrentUser();
        this.ensureNotificationData();
        this.updateNotificationBadge();
        this.setupEventListeners();
        this.updateBadge();
        
        return true;
    }

    // Add this method to your notification-system.js file
static updateNotificationBadge() {
    try {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) return;

        const notifications = this.getForUser(currentUser.id);
        const unreadCount = notifications.filter(notif => !notif.read).length;
        
        // Update badge element
        const badge = document.getElementById('notificationBadge');
        if (badge) {
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'flex' : 'none';
        }
        
        return unreadCount;
    } catch (error) {
        console.error('Error updating notification badge:', error);
        return 0;
    }
}
    // Add this method to your NotificationSystem class
static cleanupOldNotifications(userId, maxNotifications = 50) {
    try {
        const notifications = this.getForUser(userId);
        
        // If we have too many notifications, remove the oldest ones
        if (notifications.length > maxNotifications) {
            const notificationsToKeep = notifications
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, maxNotifications);
            
            this.saveNotifications(userId, notificationsToKeep);
            console.log(`🧹 Cleaned up ${notifications.length - maxNotifications} old notifications`);
        }
    } catch (error) {
        console.error('Error cleaning up notifications:', error);
    }
}

// Update the createNotification method to include cleanup
static createNotification(userId, type, data = {}) {
    try {
        if (!userId) {
            console.error('❌ Cannot create notification: userId is required');
            return null;
        }

        // Clean up old notifications before creating new one
        this.cleanupOldNotifications(userId, 50);

        const notifications = this.getForUser(userId);
        
        // ... rest of your existing createNotification code ...
        
    } catch (error) {
        if (error.name === 'QuotaExceededError') {
            console.error('❌ Storage full - performing emergency cleanup');
            // Emergency cleanup - remove half of oldest notifications
            const notifications = this.getForUser(userId);
            const keepCount = Math.floor(notifications.length / 2);
            const notificationsToKeep = notifications
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                .slice(0, keepCount);
            
            this.saveNotifications(userId, notificationsToKeep);
            console.log(`🚨 Emergency cleanup: kept ${keepCount} of ${notifications.length} notifications`);
            
            // Retry creating notification
            return this.createNotification(userId, type, data);
        }
        console.error('❌ Error creating notification:', error);
        return null;
    }
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
        const notificationBtn = document.getElementById('notificationBtn');
        const notificationDropdown = document.getElementById('notificationDropdown');

        if (notificationBtn && notificationDropdown) {
            notificationBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown();
            });

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
            const isShowing = dropdown.style.display === 'block';
            dropdown.style.display = isShowing ? 'none' : 'block';
            
            if (!isShowing) {
                this.loadNotifications();
            }
        }
    }

    static closeDropdown() {
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    // ✅ SINGLE createNotification METHOD (NO DUPLICATES)
    static createNotification(userId, type, data = {}) {
        try {
            if (!userId) {
                console.error('❌ Cannot create notification: userId is required');
                return null;
            }

            const notifications = JSON.parse(localStorage.getItem('opuslink_notifications') || '[]');
            
            // SINGLE TEMPLATE DEFINITION
            const notificationTemplates = {
                'application_received': {
                    title: 'New Application Received',
                    message: `${data.workerName || 'A worker'} applied for ${data.jobTitle || 'your job'}`
                },
                'application_accepted': {
                    title: 'Application Accepted', 
                    message: `Your application for ${data.jobTitle || 'the job'} has been accepted`
                },
                'application_rejected': {
                    title: 'Application Status',
                    message: `Your application for ${data.jobTitle || 'the job'} was not selected`
                },
                'agreement_created': {
                    title: 'Work Agreement Created',
                    message: `Work agreement created with ${data.workerName || 'a worker'} for ${data.jobTitle || 'a job'}`
                },
                'payment_processed': {
                    title: 'Payment Processed', 
                    message: `Payment of ₹${data.amount || '0'} processed for ${data.workerName || 'a worker'}`
                },
                'work_approved': {
                    title: 'Work Approved',
                    message: `Work approved for ${data.workerName || 'a worker'} - ₹${data.amount || '0'} paid`
                },
                'work_rejected': {
                    title: 'Work Rejected',
                    message: `Work rejected for ${data.workerName || 'a worker'}`
                },
                'new_message': {
                    title: 'New Message',
                    message: `New message from ${data.senderName || 'a user'}`
                },
                'system_alert': {
                    title: 'System Notification',
                    message: data.message || 'System update'
                },
                'test': {
                    title: 'Test Notification',
                    message: data.message || 'Test notification'
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
                read: false
            };

            notifications.push(notification);
            localStorage.setItem('opuslink_notifications', JSON.stringify(notifications));

            this.updateBadge();
            console.log('✅ Notification created:', notification);

            return notification;
        } catch (error) {
            console.error('❌ Error creating notification:', error);
            return null;
        }
    }

    static getForUser(userId) {
        try {
            const notifications = JSON.parse(localStorage.getItem('opuslink_notifications') || '[]');
            return notifications.filter(notif => notif.userId === userId)
                               .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        } catch (error) {
            console.error('Error getting notifications:', error);
            return [];
        }
    }

    static saveNotifications(userId, userNotifications) {
        try {
            const allNotifications = JSON.parse(localStorage.getItem('opuslink_notifications') || '[]');
            // Remove existing notifications for this user
            const otherNotifications = allNotifications.filter(notif => notif.userId !== userId);
            // Add new notifications
            const updatedNotifications = [...otherNotifications, ...userNotifications];
            localStorage.setItem('opuslink_notifications', JSON.stringify(updatedNotifications));
        } catch (error) {
            console.error('Error saving notifications:', error);
        }
    }

    static markAsRead(notificationId) {
        try {
            const notifications = JSON.parse(localStorage.getItem('opuslink_notifications') || '[]');
            const notificationIndex = notifications.findIndex(notif => notif.id === notificationId);
            
            if (notificationIndex !== -1) {
                notifications[notificationIndex].read = true;
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
                if (notification.userId === userId && !notification.read) {
                    updated = true;
                    return { ...notification, read: true };
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
                <div style="padding: 40px 20px; text-align: center; color: var(--muted);">
                    <div style="font-size: 3em; margin-bottom: 10px;">🔔</div>
                    <h4>No notifications</h4>
                    <p>You're all caught up!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = notifications.map(notification => `
            <div class="notification-item ${notification.read ? '' : 'unread'}" 
                 onclick="NotificationSystem.handleNotificationClick('${notification.id}')">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                    <strong style="color: #fff; flex: 1;">${this.escapeHtml(notification.title)}</strong>
                    ${!notification.read ? '<span style="color: #007bff; font-size: 0.8em;">●</span>' : ''}
                </div>
                <div style="color: var(--muted); font-size: 0.9em; margin-bottom: 8px; line-height: 1.4;">
                    ${this.escapeHtml(notification.message)}
                </div>
                <div style="color: var(--muted); font-size: 0.8em; display: flex; justify-content: space-between; align-items: center;">
                    <span>${this.formatTime(notification.timestamp)}</span>
                    ${!notification.read ? `
                        <button onclick="event.stopPropagation(); NotificationSystem.markAsRead('${notification.id}')" 
                                style="background: #007bff; color: white; border: none; padding: 4px 12px; border-radius: 4px; font-size: 0.75em; cursor: pointer;">
                            Mark read
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    static handleNotificationClick(notificationId) {
        this.markAsRead(notificationId);
        this.closeDropdown();
        
        // Optional: Add navigation logic based on notification type
        console.log('Notification clicked:', notificationId);
    }

    static updateBadge() {
        const badge = document.getElementById('notificationBadge');
        if (!badge) return;

        const unreadCount = this.getUnreadCount();
        badge.textContent = unreadCount > 99 ? '99+' : unreadCount.toString();
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

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
    // Add these methods to your NotificationSystem class

// Method to display notifications in main area
static displayMainNotifications() {
    const container = document.getElementById('notificationsMainContainer');
    if (!container) return;

    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    const notifications = this.getForUser(currentUser.id);
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔔</div>
                <h3>No notifications</h3>
                <p>You're all caught up! Notifications will appear here for new applications, messages, and payments.</p>
            </div>
        `;
        return;
    }

    // Group by read status
    const unreadNotifications = notifications.filter(n => !n.read);
    const readNotifications = notifications.filter(n => n.read);

    let html = '';

    // Unread notifications
    if (unreadNotifications.length > 0) {
        html += `
            <div class="notification-group">
                <h4 style="color: var(--accent); margin-bottom: 16px;">
                    🔔 Unread Notifications (${unreadNotifications.length})
                </h4>
                ${unreadNotifications.map(notification => this.createNotificationCard(notification)).join('')}
            </div>
        `;
    }

    // Read notifications
    if (readNotifications.length > 0) {
        html += `
            <div class="notification-group" style="margin-top: 30px;">
                <h4 style="color: var(--muted); margin-bottom: 16px;">
                    ✅ Read Notifications (${readNotifications.length})
                </h4>
                ${readNotifications.map(notification => this.createNotificationCard(notification)).join('')}
            </div>
        `;
    }

    container.innerHTML = html;
}

// Create individual notification card
static createNotificationCard(notification) {
    const timeAgo = this.formatTime(notification.timestamp);
    
    return `
        <div class="notification-card ${notification.read ? 'read' : 'unread'}" 
             data-notification-id="${notification.id}"
             style="background: ${notification.read ? 'var(--card)' : 'rgba(59, 130, 246, 0.1)'}; 
                    border: 1px solid ${notification.read ? 'rgba(255,255,255,0.1)' : 'rgba(59, 130, 246, 0.3)'};
                    border-radius: 12px; 
                    padding: 16px; 
                    margin-bottom: 12px;
                    transition: all 0.2s;">
            
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <div style="flex: 1;">
                    <h4 style="color: #fff; margin: 0 0 4px 0; font-size: 1rem;">
                        ${notification.read ? '✅' : '🔔'} ${this.escapeHtml(notification.title)}
                    </h4>
                    <p style="color: var(--muted); margin: 0; line-height: 1.4;">
                        ${this.escapeHtml(notification.message)}
                    </p>
                </div>
                <div style="text-align: right; min-width: 80px;">
                    <span style="color: var(--muted); font-size: 0.8rem;">${timeAgo}</span>
                </div>
            </div>
            
            ${notification.data ? `
                <div style="background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 6px; margin-top: 8px;">
                    <div style="color: var(--muted); font-size: 0.8rem;">
                        ${Object.entries(notification.data).map(([key, value]) => 
                            `<div><strong>${key}:</strong> ${value}</div>`
                        ).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div style="display: flex; gap: 8px; margin-top: 12px;">
                ${!notification.read ? `
                    <button class="btn btn-success btn-sm" 
                            onclick="NotificationSystem.markAsRead('${notification.id}')">
                        ✅ Mark Read
                    </button>
                ` : ''}
                <button class="btn btn-ghost btn-sm" 
                        onclick="NotificationSystem.deleteNotification('${notification.id}')">
                    🗑️ Delete
                </button>
                
                ${this.getNotificationAction(notification)}
            </div>
        </div>
    `;
}

// Get action button based on notification type
static getNotificationAction(notification) {
    switch (notification.type) {
        case 'application_received':
            return `<button class="btn btn-primary btn-sm" onclick="EmployerDashboard.navigateToSection('applications')">View Applications</button>`;
        case 'payment_processed':
            return `<button class="btn btn-primary btn-sm" onclick="EmployerDashboard.navigateToSection('payment-history')">View Payments</button>`;
        case 'new_message':
            return `<button class="btn btn-primary btn-sm" onclick="toggleChatSystem()">Open Messages</button>`;
        case 'agreement_created':
            return `<button class="btn btn-primary btn-sm" onclick="EmployerDashboard.navigateToSection('active-agreements')">View Agreements</button>`;
        default:
            return '';
    }
}

// Delete notification
static deleteNotification(notificationId) {
    try {
        const currentUser = this.getCurrentUser();
        if (!currentUser) return false;

        const notifications = this.getForUser(currentUser.id);
        const updatedNotifications = notifications.filter(n => n.id !== notificationId);
        
        this.saveNotifications(currentUser.id, updatedNotifications);
        this.displayMainNotifications();
        this.updateBadge();
        
        OpusUtils.showNotification('Notification deleted', 'success');
        return true;
    } catch (error) {
        console.error('Error deleting notification:', error);
        return false;
    }
}

// Clear all notifications
static clearAllNotifications() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            this.saveNotifications(currentUser.id, []);
            this.displayMainNotifications();
            this.updateBadge();
            OpusUtils.showNotification('All notifications cleared', 'success');
        }
    }
}

// Create test notifications
static createTestNotifications() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    // Clear existing test notifications
    const existingNotifications = this.getForUser(currentUser.id);
    const testNotifications = existingNotifications.filter(n => !n.type.includes('test'));
    this.saveNotifications(currentUser.id, testNotifications);

    // Create new test notifications
    this.createNotification(currentUser.id, 'application_received', {
        workerName: 'Raj Sharma',
        jobTitle: 'Senior Frontend Developer',
        experience: '5 years',
        skills: 'React, Node.js, TypeScript'
    });

    this.createNotification(currentUser.id, 'payment_processed', {
        amount: '18,500',
        workerName: 'Priya Patel',
        jobTitle: 'UI/UX Designer',
        date: new Date().toLocaleDateString()
    });

    this.createNotification(currentUser.id, 'new_message', {
        senderName: 'Amit Kumar',
        messagePreview: 'Hello, I would like to discuss the project requirements...',
        unreadMessages: 3
    });

    this.createNotification(currentUser.id, 'agreement_created', {
        workerName: 'Sneha Verma',
        jobTitle: 'Full Stack Developer',
        startDate: '2024-01-15',
        salary: '₹75,000/month'
    });

    this.displayMainNotifications();
    OpusUtils.showNotification('Test notifications created!', 'success');
}

// Update navigation to handle notifications section
static setupNavigation() {
    // Override the navigateToSection to handle notifications
    const originalNavigate = EmployerDashboard.navigateToSection;
    EmployerDashboard.navigateToSection = function(sectionId) {
        originalNavigate.call(this, sectionId);
        
        if (sectionId === 'notifications-main') {
            NotificationSystem.displayMainNotifications();
        }
    };
}
// Enhanced methods for NotificationSystem class
static displayNotifications(notifications = null) {
    const container = document.getElementById('notificationsContainer');
    if (!container) return;

    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    if (!notifications) {
        notifications = this.getForUser(currentUser.id);
    }

    // Apply filters
    const typeFilter = document.getElementById('notificationTypeFilter')?.value || 'all';
    const statusFilter = document.getElementById('notificationStatusFilter')?.value || 'all';

    let filteredNotifications = notifications;

    if (typeFilter !== 'all') {
        filteredNotifications = filteredNotifications.filter(n => n.type === typeFilter);
    }
    
    if (statusFilter !== 'all') {
        filteredNotifications = filteredNotifications.filter(n => 
            statusFilter === 'unread' ? !n.read : n.read
        );
    }

    // Update stats
    this.updateNotificationStats(notifications);

    if (filteredNotifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔔</div>
                <h3 data-translate="no_notifications">No notifications</h3>
                <p data-translate="notifications_will_appear_here">Notifications about your activities will appear here</p>
            </div>
        `;
        languageManager.translatePage();
        return;
    }

    // Group by read status
    const unreadNotifications = filteredNotifications.filter(n => !n.read);
    const readNotifications = filteredNotifications.filter(n => n.read);

    let html = '';

    // Unread notifications
    if (unreadNotifications.length > 0) {
        html += `
            <div class="notification-group">
                <div class="notification-group-title">
                    🔔 Unread Notifications (${unreadNotifications.length})
                </div>
                ${unreadNotifications.map(notification => this.createNotificationCard(notification)).join('')}
            </div>
        `;
    }

    // Read notifications
    if (readNotifications.length > 0) {
        html += `
            <div class="notification-group">
                <div class="notification-group-title">
                    ✅ Read Notifications (${readNotifications.length})
                </div>
                ${readNotifications.map(notification => this.createNotificationCard(notification)).join('')}
            </div>
        `;
    }

    container.innerHTML = html;
    languageManager.translatePage();
}

static createNotificationCard(notification) {
    const timeAgo = this.formatTime(notification.timestamp);
    const icon = this.getNotificationIcon(notification.type);
    
    return `
        <div class="notification-item ${notification.read ? '' : 'unread'}" 
             data-notification-id="${notification.id}"
             onclick="NotificationSystem.handleNotificationClick('${notification.id}')">
            
            <div class="notification-header">
                <div class="notification-title">
                    ${icon} ${this.escapeHtml(notification.title)}
                </div>
                <div class="notification-time">${timeAgo}</div>
            </div>
            
            <div class="notification-message">
                ${this.escapeHtml(notification.message)}
            </div>
            
            ${notification.data && Object.keys(notification.data).length > 0 ? `
                <div class="notification-meta">
                    ${Object.entries(notification.data).map(([key, value]) => `
                        <div class="notification-meta-item">
                            <span class="notification-meta-key">${this.formatKey(key)}:</span>
                            <span>${this.escapeHtml(value)}</span>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            
            <div class="notification-actions">
                ${!notification.read ? `
                    <button class="btn btn-success btn-sm" 
                            onclick="event.stopPropagation(); NotificationSystem.markAsRead('${notification.id}')">
                        ✅ Mark Read
                    </button>
                ` : ''}
                <button class="btn btn-ghost btn-sm" 
                        onclick="event.stopPropagation(); NotificationSystem.deleteNotification('${notification.id}')">
                    🗑️ Delete
                </button>
                
                ${this.getNotificationAction(notification)}
            </div>
        </div>
    `;
}

static getNotificationIcon(type) {
    const icons = {
        'application_received': '📋',
        'application_accepted': '✅',
        'application_rejected': '❌',
        'agreement_created': '📝',
        'payment_processed': '💰',
        'work_approved': '👍',
        'work_rejected': '👎',
        'new_message': '💬',
        'system_alert': '🔔',
        'test': '🧪'
    };
    return icons[type] || '🔔';
}

static formatKey(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
}

static getNotificationAction(notification) {
    const actions = {
        'application_received': {
            label: 'View Applications',
            action: () => this.navigateToSection('applications')
        },
        'application_accepted': {
            label: 'View Job Offers',
            action: () => this.navigateToSection('job-offers')
        },
        'payment_processed': {
            label: 'View Payments',
            action: () => this.navigateToSection('earnings')
        },
        'new_message': {
            label: 'Open Messages',
            action: () => toggleChatSystem()
        },
        'agreement_created': {
            label: 'View Agreements',
            action: () => this.navigateToSection('active-agreements')
        }
    };
    
    const action = actions[notification.type];
    if (action) {
        return `<button class="btn btn-primary btn-sm" 
                        onclick="event.stopPropagation(); ${action.action.toString().replace(/\n/g, '')}">
                    ${action.label}
                </button>`;
    }
    return '';
}

static navigateToSection(sectionId) {
    // Use existing dashboard navigation
    if (window.workerDashboard) {
        workerDashboard.navigateToSection(sectionId);
    } else if (window.employerDashboard) {
        employerDashboard.navigateToSection(sectionId);
    }
}

static handleNotificationClick(notificationId) {
    this.markAsRead(notificationId);
    
    // Optional: Add specific actions based on notification type
    const notification = this.getForUser(this.currentUser.id).find(n => n.id === notificationId);
    if (notification && notification.data) {
        console.log('Notification clicked:', notification);
        // You can add specific navigation logic here
    }
}

static updateNotificationStats(notifications = null) {
    if (!notifications) {
        const currentUser = this.getCurrentUser();
        notifications = currentUser ? this.getForUser(currentUser.id) : [];
    }
    
    const unreadCount = notifications.filter(n => !n.read).length;
    const totalCount = notifications.length;
    
    // Update stats cards
    const unreadElement = document.getElementById('unreadNotificationsCount');
    const totalElement = document.getElementById('totalNotificationsCount');
    
    if (unreadElement) unreadElement.textContent = unreadCount;
    if (totalElement) totalElement.textContent = totalCount;
    
    // Update sidebar badge
    const sidebarBadge = document.getElementById('sidebarNotificationCount');
    if (sidebarBadge) {
        if (unreadCount > 0) {
            sidebarBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
            sidebarBadge.style.display = 'inline-block';
        } else {
            sidebarBadge.style.display = 'none';
        }
    }
}

static setupNotificationFilters() {
    const typeFilter = document.getElementById('notificationTypeFilter');
    const statusFilter = document.getElementById('notificationStatusFilter');
    
    if (typeFilter) {
        typeFilter.addEventListener('change', () => this.displayNotifications());
    }
    if (statusFilter) {
        statusFilter.addEventListener('change', () => this.displayNotifications());
    }
}

// Initialize notification section when navigated to
static initNotificationSection() {
    this.displayNotifications();
    this.setupNotificationFilters();
}
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('notificationBtn')) {
        NotificationSystem.init();
    }
});

window.NotificationSystem = NotificationSystem;
console.log('✅ Clean Notification System loaded');