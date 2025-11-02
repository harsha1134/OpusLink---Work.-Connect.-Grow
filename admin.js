class AdminDashboard {
    static init() {
        this.loadAdminData();
        this.setupAdminNavigation();
        this.loadDashboardStats();
        this.loadRecentJobs();
        this.loadUserManagement();
        this.loadVerificationRequests();
        this.setupEventListeners();
        
        // FIXED: Call static methods properly
        this.renderDashboardStats();
        this.renderUsersTable();
        this.renderJobsTable();
        this.renderPaymentsTable();
        this.renderAdminUsers();
        this.renderModerationTable();
        this.loadSystemSettings();
        this.renderVerificationQueue(); // Now this will work
        this.updateNavigationBadge(); 
    }

    // ADD THESE MISSING STATIC METHODS:
    static renderDashboardStats() {
        console.log('Rendering dashboard stats...');
        // Implementation for dashboard stats
        try {
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const jobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
            const payments = JSON.parse(localStorage.getItem('opuslink_payments') || '[]');
            
            // Update stats cards
            const totalUsersElem = document.querySelector('[data-stat="totalUsers"]');
            const totalJobsElem = document.querySelector('[data-stat="totalJobs"]');
            const totalRevenueElem = document.querySelector('[data-stat="totalRevenue"]');
            
            if (totalUsersElem) totalUsersElem.textContent = users.length;
            if (totalJobsElem) totalJobsElem.textContent = jobs.length;
            if (totalRevenueElem) {
                const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
                totalRevenueElem.textContent = `$${totalRevenue.toLocaleString()}`;
            }
        } catch (error) {
            console.error('Error rendering dashboard stats:', error);
        }
    }

    static renderUsersTable() {
        console.log('Rendering users table...');
        this.loadUserManagement(); // Reuse existing method
    }

    static renderJobsTable() {
        console.log('Rendering jobs table...');
        this.loadAllJobs(); // Reuse existing method
    }

    static renderPaymentsTable() {
        console.log('Rendering payments table...');
        // Implementation for payments table
        try {
            const payments = JSON.parse(localStorage.getItem('opuslink_payments') || '[]');
            const container = document.getElementById('payments-table-container');
            
            if (!container) return;
            
            if (payments.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">💰</div>
                        <h3>No Payments Found</h3>
                        <p>Payment history will appear here</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${payments.map(payment => `
                            <tr>
                                <td>${payment.id}</td>
                                <td>${payment.userName || 'Unknown'}</td>
                                <td>$${payment.amount}</td>
                                <td>${payment.type}</td>
                                <td><span class="status-badge status-${payment.status}">${payment.status}</span></td>
                                <td>${new Date(payment.date).toLocaleDateString()}</td>
                                <td>
                                    <button class="btn btn-ghost btn-sm" onclick="AdminDashboard.viewPayment('${payment.id}')">
                                        View
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } catch (error) {
            console.error('Error rendering payments table:', error);
        }
    }

    static renderAdminUsers() {
        console.log('Rendering admin users...');
        // Implementation for admin users table
        try {
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const adminUsers = users.filter(user => user.role === 'admin');
            const container = document.getElementById('admin-users-container');
            
            if (!container) return;
            
            if (adminUsers.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">👨‍💼</div>
                        <h3>No Admin Users</h3>
                        <p>Admin users will appear here</p>
                    </div>
                `;
                return;
            }
            
            container.innerHTML = `
                <table class="admin-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Last Active</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${adminUsers.map(user => `
                            <tr>
                                <td>${user.fullName}</td>
                                <td>${user.email}</td>
                                <td><span class="role-badge role-admin">Admin</span></td>
                                <td><span class="status-badge status-completed">Active</span></td>
                                <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                                <td>
                                    <button class="btn btn-warning btn-sm" onclick="AdminDashboard.editAdminUser('${user.id}')">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        } catch (error) {
            console.error('Error rendering admin users:', error);
        }
    }

    static renderModerationTable() {
        console.log('Rendering moderation table...');
        this.loadContentModeration(); // Reuse existing method
    }

    // FIXED: Convert instance methods to static methods
    static renderVerificationQueue() {
        console.log('🔄 Rendering verification queue...');
        
        try {
            const pendingVerifications = this.getPendingVerifications();
            const container = document.getElementById('verification-queue');
            const pendingCount = document.getElementById('pendingVerifications');
            const verifiedCount = document.getElementById('verifiedUsers');
            const totalCount = document.getElementById('totalUsers');
            
            if (!container) {
                console.error('❌ Verification queue container not found');
                return;
            }

            // Update stats
            if (pendingCount) pendingCount.textContent = pendingVerifications.length;
            if (verifiedCount) verifiedCount.textContent = this.getVerifiedUsersCount();
            if (totalCount) {
                const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
                totalCount.textContent = users.length;
            }

            if (pendingVerifications.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">✅</div>
                        <h3>No Pending Verifications</h3>
                        <p>All users are currently verified.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = `
                <div class="verification-list" style="display: flex; flex-direction: column; gap: 16px;">
                    ${pendingVerifications.map(user => `
                        <div class="verification-item" style="
                            background: var(--bg-card);
                            border: 1px solid var(--border-color);
                            border-radius: 12px;
                            padding: 20px;
                            display: flex;
                            justify-content: space-between;
                            align-items: flex-start;
                            gap: 20px;
                        ">
                            <div style="flex: 1;">
                                <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 12px;">
                                    <div style="
                                        width: 60px;
                                        height: 60px;
                                        border-radius: 50%;
                                        background: linear-gradient(135deg, var(--gold-primary), var(--gold-secondary));
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: bold;
                                        color: #000;
                                        font-size: 1.2rem;
                                    ">
                                        ${(user.fullName || user.companyName || 'U').charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 style="margin: 0 0 4px 0; color: var(--text-primary);">
                                            ${user.fullName || user.companyName || 'Unknown User'}
                                        </h4>
                                        <div style="color: var(--text-secondary); margin-bottom: 4px;">
                                            ${user.email} • ${user.role}
                                        </div>
                                        <div style="color: var(--text-muted); font-size: 0.875rem;">
                                            Requested: ${user.verificationRequestedAt ? new Date(user.verificationRequestedAt).toLocaleDateString() : 'Recently'}
                                        </div>
                                    </div>
                                </div>
                                
                                <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 12px;">
                                    <div style="
                                        background: rgba(255, 215, 0, 0.1);
                                        border: 1px solid rgba(255, 215, 0, 0.3);
                                        border-radius: 6px;
                                        padding: 8px 12px;
                                        font-size: 0.875rem;
                                        color: var(--gold-primary);
                                    ">
                                        📊 Profile: ${user.profileCompletion || 0}% Complete
                                    </div>
                                    ${user.role === 'employer' && user.companyName ? `
                                        <div style="
                                            background: rgba(59, 130, 246, 0.1);
                                            border: 1px solid rgba(59, 130, 246, 0.3);
                                            border-radius: 6px;
                                            padding: 8px 12px;
                                            font-size: 0.875rem;
                                            color: #3b82f6;
                                        ">
                                            🏢 ${user.companyName}
                                        </div>
                                    ` : ''}
                                    ${user.skills && user.skills.length > 0 ? `
                                        <div style="
                                            background: rgba(16, 185, 129, 0.1);
                                            border: 1px solid rgba(16, 185, 129, 0.3);
                                            border-radius: 6px;
                                            padding: 8px 12px;
                                            font-size: 0.875rem;
                                            color: #10b981;
                                        ">
                                            💼 ${user.skills.slice(0, 3).join(', ')}
                                        </div>
                                    ` : ''}
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 8px; flex-direction: column; min-width: 200px;">
                                <button class="btn btn-success btn-sm" 
                                        onclick="AdminDashboard.approveVerification('${user.id}')"
                                        style="width: 100%;">
                                    ✅ Approve Verification
                                </button>
                                <button class="btn btn-warning btn-sm" 
                                        onclick="AdminDashboard.requestMoreInfo('${user.id}')"
                                        style="width: 100%;">
                                    📋 Request More Info
                                </button>
                                <button class="btn btn-danger btn-sm" 
                                        onclick="AdminDashboard.rejectVerification('${user.id}')"
                                        style="width: 100%;">
                                    ❌ Reject
                                </button>
                                <button class="btn btn-ghost btn-sm" 
                                        onclick="AdminDashboard.viewUserDetails('${user.id}')"
                                        style="width: 100%;">
                                    👁️ View Details
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } catch (error) {
            console.error('❌ Error rendering verification queue:', error);
            const container = document.getElementById('verification-queue');
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">⚠️</div>
                        <h3>Error Loading Verification Queue</h3>
                        <p>Please try refreshing the page.</p>
                    </div>
                `;
            }
        }
    }

    static getVerifiedUsersCount() {
        try {
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            return users.filter(user => user.isVerified === true).length;
        } catch (error) {
            console.error('Error counting verified users:', error);
            return 0;
        }
    }

    static getPendingVerifications() {
        try {
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            return users.filter(user => 
                user.verificationStatus === 'pending' && 
                user.role !== 'admin' &&
                !user.isVerified
            );
        } catch (error) {
            console.error('Error getting pending verifications:', error);
            return [];
        }
    }

    static updateNavigationBadge() {
        const pendingCount = this.getPendingVerifications().length;
        const verificationLink = document.querySelector('[data-section="verification"]');
        
        if (verificationLink && pendingCount > 0) {
            // Remove existing badge
            const existingBadge = verificationLink.querySelector('.nav-badge');
            if (existingBadge) {
                existingBadge.remove();
            }
            
            // Add new badge
            const badge = document.createElement('span');
            badge.className = 'nav-badge';
            badge.style.cssText = `
                background: #ef4444;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 0.7rem;
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
            `;
            badge.textContent = pendingCount > 99 ? '99+' : pendingCount;
            
            verificationLink.style.position = 'relative';
            verificationLink.appendChild(badge);
        }
    }

    // ADD MISSING STATIC METHODS FOR VERIFICATION ACTIONS:
    static requestMoreInfo(userId) {
        try {
            const infoRequest = prompt('What additional information do you need from the user?');
            if (!infoRequest) {
                alert('Information request is required');
                return;
            }

            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const userIndex = users.findIndex(u => u.id === userId);
            if (userIndex === -1) {
                alert('User not found');
                return;
            }

            const user = users[userIndex];
            
            // Update user status
            user.verificationStatus = 'info_requested';
            user.infoRequestedAt = new Date().toISOString();
            user.infoRequested = infoRequest;
            
            // Save to localStorage
            localStorage.setItem('opuslink_users', JSON.stringify(users));
            
            // Send notification to user
            this.sendVerificationNotification(userId, 'info_requested', `Additional information requested: ${infoRequest}`);
            
            // Show success message
            alert(`📋 Information request sent to ${user.fullName || user.companyName}`);
            
            // Refresh the queue
            this.renderVerificationQueue();
            this.loadUserManagement();
        } catch (error) {
            console.error('Error requesting more info:', error);
            alert('Error requesting information. Please try again.');
        }
    }

    static viewUserDetails(userId) {
        try {
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const user = users.find(u => u.id === userId);
            if (!user) {
                alert('User not found');
                return;
            }

            // Your existing viewUserDetails implementation...
            // (Copy the existing viewUserDetails method content here)
        } catch (error) {
            console.error('Error viewing user details:', error);
            alert('Error loading user details. Please try again.');
        }
    }

    static updateAdminVerificationRequest(userId, status, reason = '') {
        try {
            const requests = JSON.parse(localStorage.getItem('admin_verification_requests') || '[]');
            const requestIndex = requests.findIndex(req => req.userId === userId && req.status === 'pending');
            
            if (requestIndex !== -1) {
                requests[requestIndex].status = status;
                requests[requestIndex].processedAt = new Date().toISOString();
                requests[requestIndex].processedBy = 'admin';
                if (reason) {
                    requests[requestIndex].reason = reason;
                }
                
                localStorage.setItem('admin_verification_requests', JSON.stringify(requests));
            }
        } catch (error) {
            console.error('Error updating admin verification request:', error);
        }
    }

    static sendVerificationNotification(userId, type, message) {
        try {
            // Create notification for user
            const notification = {
                id: 'notif_' + Date.now(),
                userId: userId,
                type: `verification_${type}`,
                title: type === 'approved' ? '✅ Account Verified' : 
                       type === 'rejected' ? '❌ Verification Rejected' : '📋 Information Requested',
                message: message,
                read: false,
                createdAt: new Date().toISOString(),
                priority: 'high'
            };

            // Save to user notifications
            const userNotifications = JSON.parse(localStorage.getItem(`notifications_${userId}`) || '[]');
            userNotifications.push(notification);
            localStorage.setItem(`notifications_${userId}`, JSON.stringify(userNotifications));

            console.log(`📢 Notification sent to user ${userId}: ${message}`);
        } catch (error) {
            console.error('Error sending verification notification:', error);
        }
    }

   // Add these missing static methods to your AdminDashboard class:

static loadDashboardStats() {
    console.log('Loading dashboard stats...');
    try {
        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const jobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
        const payments = JSON.parse(localStorage.getItem('opuslink_payments') || '[]');
        const applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');

        // Update overview stats
        const totalUsersElem = document.querySelector('[data-stat="totalUsers"]');
        const totalJobsElem = document.querySelector('[data-stat="totalJobs"]');
        const totalApplicationsElem = document.querySelector('[data-stat="totalApplications"]');
        const totalRevenueElem = document.querySelector('[data-stat="totalRevenue"]');

        if (totalUsersElem) totalUsersElem.textContent = users.length;
        if (totalJobsElem) totalJobsElem.textContent = jobs.length;
        if (totalApplicationsElem) totalApplicationsElem.textContent = applications.length;
        if (totalRevenueElem) {
            const totalRevenue = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);
            totalRevenueElem.textContent = `$${totalRevenue.toLocaleString()}`;
        }

        // Update verification stats
        const pendingVerifications = this.getPendingVerifications();
        const verifiedUsers = this.getVerifiedUsersCount();
        
        const pendingVerificationsElem = document.querySelector('[data-stat="pendingVerifications"]');
        const verifiedUsersElem = document.querySelector('[data-stat="verifiedUsers"]');
        
        if (pendingVerificationsElem) pendingVerificationsElem.textContent = pendingVerifications.length;
        if (verifiedUsersElem) verifiedUsersElem.textContent = verifiedUsers;

    } catch (error) {
        console.error('Error loading dashboard stats:', error);
    }
}

static loadRecentJobs() {
    console.log('Loading recent jobs...');
    try {
        const jobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
        const recentJobsContainer = document.getElementById('recent-jobs');
        
        if (!recentJobsContainer) return;

        const recentJobs = jobs
            .sort((a, b) => new Date(b.datePosted) - new Date(a.datePosted))
            .slice(0, 5);

        if (recentJobs.length === 0) {
            recentJobsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💼</div>
                    <h3>No Recent Jobs</h3>
                    <p>Recently posted jobs will appear here</p>
                </div>
            `;
            return;
        }

        recentJobsContainer.innerHTML = `
            <div class="recent-list">
                ${recentJobs.map(job => `
                    <div class="recent-item">
                        <div class="recent-item-main">
                            <h4>${job.title}</h4>
                            <p class="recent-item-meta">${job.employerName} • ${job.location} • ${new Date(job.datePosted).toLocaleDateString()}</p>
                        </div>
                        <div class="recent-item-actions">
                            <span class="status-badge status-${job.status}">${job.status}</span>
                            <button class="btn btn-ghost btn-sm" onclick="AdminDashboard.viewJob('${job.id}')">
                                View
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error loading recent jobs:', error);
    }
}

static loadContentModeration() {
    console.log('Loading content moderation...');
    try {
        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const jobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
        const container = document.getElementById('moderation-content');
        
        if (!container) return;

        // Get flagged/reported content (you might want to store this separately)
        const flaggedUsers = users.filter(user => user.isFlagged || user.reports && user.reports.length > 0);
        const pendingJobs = jobs.filter(job => job.status === 'pending');

        container.innerHTML = `
            <div class="moderation-stats">
                <div class="stat-card">
                    <div class="stat-value">${flaggedUsers.length}</div>
                    <div class="stat-label">Flagged Users</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${pendingJobs.length}</div>
                    <div class="stat-label">Pending Jobs</div>
                </div>
                <div class="stat-card">
                    <div class="stat-value">${users.filter(u => u.isSuspended).length}</div>
                    <div class="stat-label">Suspended Users</div>
                </div>
            </div>

            <div class="moderation-sections">
                <div class="moderation-section">
                    <h3>Flagged Users (${flaggedUsers.length})</h3>
                    ${flaggedUsers.length > 0 ? `
                        <div class="moderation-list">
                            ${flaggedUsers.map(user => `
                                <div class="moderation-item">
                                    <div class="user-info">
                                        <strong>${user.fullName || user.companyName}</strong>
                                        <span>${user.email} • ${user.role}</span>
                                    </div>
                                    <div class="moderation-actions">
                                        <button class="btn btn-warning btn-sm" onclick="AdminDashboard.suspendUser('${user.id}')">
                                            Suspend
                                        </button>
                                        <button class="btn btn-ghost btn-sm" onclick="AdminDashboard.viewUserDetails('${user.id}')">
                                            Review
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="empty-state">
                            <p>No flagged users</p>
                        </div>
                    `}
                </div>

                <div class="moderation-section">
                    <h3>Pending Job Approval (${pendingJobs.length})</h3>
                    ${pendingJobs.length > 0 ? `
                        <div class="moderation-list">
                            ${pendingJobs.map(job => `
                                <div class="moderation-item">
                                    <div class="job-info">
                                        <strong>${job.title}</strong>
                                        <span>${job.employerName} • ${job.location}</span>
                                    </div>
                                    <div class="moderation-actions">
                                        <button class="btn btn-success btn-sm" onclick="AdminDashboard.approveJob('${job.id}')">
                                            Approve
                                        </button>
                                        <button class="btn btn-danger btn-sm" onclick="AdminDashboard.rejectJob('${job.id}')">
                                            Reject
                                        </button>
                                        <button class="btn btn-ghost btn-sm" onclick="AdminDashboard.viewJob('${job.id}')">
                                            View
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="empty-state">
                            <p>No pending jobs</p>
                        </div>
                    `}
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading content moderation:', error);
    }
}

static rejectJob(jobId) {
    if (!confirm('Are you sure you want to reject this job? This action cannot be undone.')) {
        return;
    }

    try {
        const jobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
        const jobIndex = jobs.findIndex(j => j.id === jobId);
        
        if (jobIndex !== -1) {
            jobs[jobIndex].status = 'rejected';
            jobs[jobIndex].rejectedAt = new Date().toISOString();
            jobs[jobIndex].rejectedBy = 'admin';
            
            localStorage.setItem('opuslink_jobs', JSON.stringify(jobs));
            
            OpusUtils.showNotification('Job rejected successfully', 'success');
            this.loadContentModeration();
            this.loadAllJobs();
        }
    } catch (error) {
        console.error('Error rejecting job:', error);
        OpusUtils.showNotification('Error rejecting job', 'error');
    }
}

static loadSystemSettings() {
    console.log('Loading system settings...');
    try {
        const settings = JSON.parse(localStorage.getItem('opuslink_system_settings') || '{}');
        const container = document.getElementById('system-settings');
        
        if (!container) return;

        const defaultSettings = {
            siteName: 'OpusLink',
            siteDescription: 'Professional Networking Platform',
            allowRegistrations: true,
            requireVerification: true,
            maintenanceMode: false,
            maxFileSize: 5,
            allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx']
        };

        const currentSettings = { ...defaultSettings, ...settings };

        container.innerHTML = `
            <div class="settings-form">
                <div class="form-group">
                    <label for="siteName">Site Name</label>
                    <input type="text" id="siteName" value="${currentSettings.siteName}" class="form-control">
                </div>

                <div class="form-group">
                    <label for="siteDescription">Site Description</label>
                    <textarea id="siteDescription" class="form-control" rows="3">${currentSettings.siteDescription}</textarea>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="allowRegistrations" ${currentSettings.allowRegistrations ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Allow New Registrations
                    </label>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="requireVerification" ${currentSettings.requireVerification ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Require User Verification
                    </label>
                </div>

                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="maintenanceMode" ${currentSettings.maintenanceMode ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Maintenance Mode
                    </label>
                </div>

                <div class="form-group">
                    <label for="maxFileSize">Maximum File Size (MB)</label>
                    <input type="number" id="maxFileSize" value="${currentSettings.maxFileSize}" class="form-control" min="1" max="50">
                </div>

                <div class="form-actions">
                    <button class="btn btn-primary" onclick="AdminDashboard.saveSystemSettings()">
                        Save Settings
                    </button>
                    <button class="btn btn-ghost" onclick="AdminDashboard.resetSystemSettings()">
                        Reset to Defaults
                    </button>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Error loading system settings:', error);
    }
}

static saveSystemSettings() {
    try {
        const settings = {
            siteName: document.getElementById('siteName').value,
            siteDescription: document.getElementById('siteDescription').value,
            allowRegistrations: document.getElementById('allowRegistrations').checked,
            requireVerification: document.getElementById('requireVerification').checked,
            maintenanceMode: document.getElementById('maintenanceMode').checked,
            maxFileSize: parseInt(document.getElementById('maxFileSize').value),
            lastUpdated: new Date().toISOString(),
            updatedBy: 'admin'
        };

        localStorage.setItem('opuslink_system_settings', JSON.stringify(settings));
        OpusUtils.showNotification('System settings saved successfully!', 'success');
        
        // Apply settings immediately
        this.applySystemSettings(settings);
        
    } catch (error) {
        console.error('Error saving system settings:', error);
        OpusUtils.showNotification('Error saving settings', 'error');
    }
}

static resetSystemSettings() {
    if (!confirm('Are you sure you want to reset all system settings to defaults?')) {
        return;
    }

    localStorage.removeItem('opuslink_system_settings');
    OpusUtils.showNotification('System settings reset to defaults', 'success');
    this.loadSystemSettings();
}

static applySystemSettings(settings) {
    // Apply settings to the current session
    if (settings.maintenanceMode) {
        console.log('⚠️ Maintenance mode enabled');
        // You might want to show a maintenance banner or redirect
    }
    
    if (!settings.allowRegistrations) {
        console.log('⚠️ New registrations disabled');
    }
}

static viewPayment(paymentId) {
    try {
        const payments = JSON.parse(localStorage.getItem('opuslink_payments') || '[]');
        const payment = payments.find(p => p.id === paymentId);
        
        if (!payment) {
            OpusUtils.showNotification('Payment not found', 'error');
            return;
        }

        const modalHTML = `
            <div class="modal" id="paymentDetailsModal" style="display: flex;">
                <div class="modal-content" style="max-width: 500px;">
                    <div class="modal-header">
                        <h3>Payment Details</h3>
                        <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.style.display='none'">&times;</button>
                    </div>
                    
                    <div style="margin: 20px 0;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                            <div>
                                <strong>Payment ID:</strong><br>
                                <span style="color: var(--muted);">${payment.id}</span>
                            </div>
                            <div>
                                <strong>Amount:</strong><br>
                                <span style="color: var(--muted);">$${payment.amount}</span>
                            </div>
                            <div>
                                <strong>User:</strong><br>
                                <span style="color: var(--muted);">${payment.userName || 'Unknown'}</span>
                            </div>
                            <div>
                                <strong>Type:</strong><br>
                                <span style="color: var(--muted);">${payment.type}</span>
                            </div>
                            <div>
                                <strong>Status:</strong><br>
                                <span class="status-badge status-${payment.status}">${payment.status}</span>
                            </div>
                            <div>
                                <strong>Date:</strong><br>
                                <span style="color: var(--muted);">${new Date(payment.date).toLocaleDateString()}</span>
                            </div>
                        </div>
                        
                        ${payment.description ? `
                            <div style="margin-bottom: 16px;">
                                <strong>Description:</strong><br>
                                <div style="color: var(--muted); margin-top: 8px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 6px;">
                                    ${payment.description}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="form-actions">
                        <button class="btn btn-ghost" onclick="this.parentElement.parentElement.parentElement.style.display='none'">Close</button>
                    </div>
                </div>
            </div>
        `;

        // Remove existing modal if any
        const existingModal = document.getElementById('paymentDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }

        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    } catch (error) {
        console.error('Error viewing payment:', error);
        OpusUtils.showNotification('Error loading payment details', 'error');
    }
}

static editAdminUser(userId) {
    const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        OpusUtils.showNotification('User not found', 'error');
        return;
    }

    const modalHTML = `
        <div class="modal" id="editAdminModal" style="display: flex;">
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Edit Admin User</h3>
                    <button class="modal-close" onclick="this.parentElement.parentElement.parentElement.style.display='none'">&times;</button>
                </div>
                
                <div style="margin: 20px 0;">
                    <div class="form-group">
                        <label for="editFullName">Full Name</label>
                        <input type="text" id="editFullName" value="${user.fullName}" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="editEmail">Email</label>
                        <input type="email" id="editEmail" value="${user.email}" class="form-control">
                    </div>
                    
                    <div class="form-group">
                        <label for="editRole">Role</label>
                        <select id="editRole" class="form-control">
                            <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Administrator</option>
                            <option value="moderator" ${user.role === 'moderator' ? 'selected' : ''}>Moderator</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="AdminDashboard.saveAdminUser('${user.id}')">
                        Save Changes
                    </button>
                    <button class="btn btn-ghost" onclick="this.parentElement.parentElement.parentElement.style.display='none'">Cancel</button>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('editAdminModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
}

static saveAdminUser(userId) {
    try {
        const fullName = document.getElementById('editFullName').value;
        const email = document.getElementById('editEmail').value;
        const role = document.getElementById('editRole').value;

        if (!fullName || !email) {
            OpusUtils.showNotification('Please fill in all required fields', 'error');
            return;
        }

        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].fullName = fullName;
            users[userIndex].email = email;
            users[userIndex].role = role;
            users[userIndex].updatedAt = new Date().toISOString();
            
            localStorage.setItem('opuslink_users', JSON.stringify(users));
            
            OpusUtils.showNotification('Admin user updated successfully', 'success');
            
            // Close modal
            const modal = document.getElementById('editAdminModal');
            if (modal) {
                modal.style.display = 'none';
            }
            
            // Refresh admin users table
            this.renderAdminUsers();
        }
    } catch (error) {
        console.error('Error saving admin user:', error);
        OpusUtils.showNotification('Error saving admin user', 'error');
    }
}

// Add notification method
static showNotification(message, type = 'info') {
    if (typeof OpusUtils !== 'undefined' && OpusUtils.showNotification) {
        OpusUtils.showNotification(message, type);
    } else {
        // Fallback notification
        alert(`${type.toUpperCase()}: ${message}`);
    }
}
}