// Utility functions for OpusLink
class OpusUtils {
    // Format currency
    static formatCurrency(amount) {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    }

    // Format date
    static formatDate(dateString) {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    // Generate unique ID
    static generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    // Validate email
    static validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Validate phone
    static validatePhone(phone) {
        const re = /^[\+]?[1-9][\d]{0,15}$/;
        return re.test(phone.replace(/\s/g, ''));
    }

    // Show notification
    static showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add styles if not already added
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #1a1a1a;
                    border: 1px solid #333;
                    border-left: 4px solid #facc15;
                    border-radius: 8px;
                    padding: 16px;
                    max-width: 400px;
                    box-shadow: 0 8px 25px rgba(0,0,0,0.5);
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                }
                .notification-success { border-left-color: #4ade80; }
                .notification-error { border-left-color: #ff5c5c; }
                .notification-warning { border-left-color: #f59e0b; }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: #bdbdbd;
                    font-size: 18px;
                    cursor: pointer;
                    margin-left: auto;
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    static getNotificationIcon(type) {
        const icons = {
            success: '✅',
            error: '❌',
            warning: '⚠️',
            info: 'ℹ️'
        };
        return icons[type] || icons.info;
    }

    // Debounce function
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Get current user from session storage
    static getCurrentUser() {
        const user = sessionStorage.getItem('currentUser');
        return user ? JSON.parse(user) : null;
    }

    // Update current user in session storage
    static updateCurrentUser(updates) {
        const currentUser = this.getCurrentUser();
        if (currentUser) {
            const updatedUser = { ...currentUser, ...updates };
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
    }

    // Logout user
    static logout() {
        sessionStorage.removeItem('currentUser');
        sessionStorage.removeItem('isLoggedIn');
        window.location.href = 'login.html';
    }

    // Check if user is logged in
    static isLoggedIn() {
        return !!this.getCurrentUser();
    }

    // Require authentication
    static requireAuth() {
        if (!this.isLoggedIn()) {
            this.showNotification('Please login to continue', 'error');
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
            return false;
        }
        return true;
    }

    // MODAL SYSTEM
    static showModal(title, content) {
        // Create modal if it doesn't exist
        let modal = document.getElementById('opusModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'opusModal';
            modal.className = 'modal-overlay';
            modal.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: none;
                justify-content: center;
                align-items: center;
                z-index: 10000;
            `;
            modal.innerHTML = `
                <div class="modal-content" style="
                    background: var(--card);
                    border-radius: 12px;
                    padding: 0;
                    max-width: 600px;
                    width: 90%;
                    max-height: 80vh;
                    overflow-y: auto;
                    border: 1px solid rgba(255,255,255,0.1);
                ">
                    <div class="modal-header" style="
                        padding: 20px;
                        border-bottom: 1px solid rgba(255,255,255,0.1);
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    ">
                        <h3 style="margin: 0; color: #fff;" id="modalTitle">${title}</h3>
                        <button class="modal-close" onclick="OpusUtils.closeModal()" style="
                            background: none;
                            border: none;
                            color: var(--muted);
                            font-size: 24px;
                            cursor: pointer;
                            padding: 0;
                            width: 30px;
                            height: 30px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        ">&times;</button>
                    </div>
                    <div id="modalBody" style="padding: 20px;"></div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close modal when clicking outside
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });

            // Close modal with Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && modal.style.display === 'flex') {
                    this.closeModal();
                }
            });
        }
        
        // Update content and show
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalBody').innerHTML = content;
        modal.style.display = 'flex';
    }

    static closeModal() {
        const modal = document.getElementById('opusModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // FORM VALIDATION
    static validateForm(formElement) {
        const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!input.value.trim()) {
                this.highlightError(input, 'This field is required');
                isValid = false;
            } else {
                this.removeError(input);
            }
            
            // Email validation
            if (input.type === 'email' && input.value) {
                if (!this.validateEmail(input.value)) {
                    this.highlightError(input, 'Please enter a valid email address');
                    isValid = false;
                }
            }
            
            // Phone validation
            if (input.type === 'tel' && input.value) {
                if (!this.validatePhone(input.value)) {
                    this.highlightError(input, 'Please enter a valid phone number');
                    isValid = false;
                }
            }
        });
        
        return isValid;
    }

    static highlightError(input, message) {
        this.removeError(input);
        input.style.borderColor = '#ef4444';
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.8rem;
            margin-top: 4px;
        `;
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }

    static removeError(input) {
        input.style.borderColor = '';
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }

    // LOADING STATES
    static showLoading(element, text = 'Loading...') {
        const originalContent = element.innerHTML;
        element.disabled = true;
        element.innerHTML = `
            <span style="display: flex; align-items: center; gap: 8px;">
                <div class="loading-spinner" style="
                    width: 16px;
                    height: 16px;
                    border: 2px solid transparent;
                    border-top: 2px solid currentColor;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                "></div>
                ${text}
            </span>
        `;
        
        // Add spinner animation if not exists
        if (!document.querySelector('#loading-styles')) {
            const styles = document.createElement('style');
            styles.id = 'loading-styles';
            styles.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(styles);
        }
        
        return () => {
            element.disabled = false;
            element.innerHTML = originalContent;
        };
    }

    // FILE UTILITIES
    static formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    static validateFile(file, options = {}) {
        const {
            maxSize = 10 * 1024 * 1024, // 10MB default
            allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
            allowedExtensions = ['.jpg', '.jpeg', '.png', '.pdf']
        } = options;

        // Check file size
        if (file.size > maxSize) {
            return { isValid: false, error: `File size must be less than ${this.formatFileSize(maxSize)}` };
        }

        // Check file type
        if (!allowedTypes.includes(file.type)) {
            return { isValid: false, error: 'File type not allowed' };
        }

        // Check file extension
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            return { isValid: false, error: 'File extension not allowed' };
        }

        return { isValid: true, error: null };
    }

    // DATA UTILITIES
    static groupBy(array, key) {
        return array.reduce((groups, item) => {
            const group = item[key];
            groups[group] = groups[group] || [];
            groups[group].push(item);
            return groups;
        }, {});
    }

    static sortBy(array, key, order = 'asc') {
        return array.sort((a, b) => {
            let aVal = a[key];
            let bVal = b[key];
            
            // Handle dates
            if (this.isDate(aVal) && this.isDate(bVal)) {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }
            
            if (order === 'asc') {
                return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            } else {
                return aVal > bVal ? -1 : aVal < bVal ? 1 : 0;
            }
        });
    }

    static isDate(value) {
        return value && (typeof value === 'string' || value instanceof Date) && !isNaN(new Date(value).getTime());
    }

    // TIME UTILITIES
    static formatTimeAgo(dateString) {
        const date = new Date(dateString);
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

    static getRelativeTime(dateString) {
        const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = date - now;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (Math.abs(diffDays) < 1) {
            const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
            return rtf.format(diffHours, 'hour');
        } else if (Math.abs(diffDays) < 30) {
            return rtf.format(diffDays, 'day');
        } else {
            const diffMonths = Math.floor(diffDays / 30);
            return rtf.format(diffMonths, 'month');
        }
    }
}

// Make utilities globally available
window.OpusUtils = OpusUtils;

// Initialize when document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Add logout functionality to all logout buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('logout-btn') || 
            e.target.closest('.logout-btn') ||
            (e.target.textContent === 'Logout' && e.target.tagName === 'A')) {
            e.preventDefault();
            OpusUtils.logout();
        }
    });

    // Add active state to current page in navigation
    const currentPage = window.location.pathname.split('/').pop();
    document.querySelectorAll('.nav a').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });

    // Auto-close notifications when clicked
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('notification-close')) {
            e.target.closest('.notification').remove();
        }
    });

    console.log('✅ OpusUtils initialized successfully');
});

// GLOBAL ERROR HANDLER
window.addEventListener('error', function(e) {
    console.error('Global error:', e.error);
    OpusUtils.showNotification('An unexpected error occurred', 'error');
});

// UNHANDLED PROMISE REJECTION HANDLER
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    OpusUtils.showNotification('An unexpected error occurred', 'error');
});