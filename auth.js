const OpusAuth = {
  currentUser: null,

  // Initialize with system admin
  initSystem() {
    const systemAdmin = {
      id: 1,
      email: 'admin@opuslink.com',
      password: 'admin123',
      role: 'super_admin',
      name: 'System Administrator',
      permissions: ['all'],
      createdBy: 'system',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    if (!OpusStorage.get('system_initialized')) {
      // First time setup - create system admin
      OpusStorage.set(`user_${systemAdmin.email}`, systemAdmin);
      OpusStorage.set('system_initialized', true);
      OpusStorage.set('admin_users', [systemAdmin.email]);
    }
  },

  // === ADD THESE MISSING METHODS ===
  
  // Get current logged-in user
  getCurrentUser() {
    // First check if we have it in memory
    if (this.currentUser) {
      return this.currentUser;
    }
    
    // Then check sessionStorage
    try {
      const userData = sessionStorage.getItem('currentUser');
      if (userData) {
        this.currentUser = JSON.parse(userData);
        return this.currentUser;
      }
    } catch (e) {
      console.error('Error parsing user data from sessionStorage:', e);
    }
    
    return null;
  },

  // Get current user ID safely
  getCurrentUserId() {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  },

  // Check if user is authenticated
  isAuthenticated() {
    return this.getCurrentUser() !== null;
  },

  // Require authentication (redirect if not logged in)
  requireAuth() {
    if (!this.isAuthenticated()) {
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  // Check if user has specific role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user && user.role === role;
  },

  // Require specific role
  requireRole(role) {
    if (!this.hasRole(role)) {
      OpusUtils.showNotification(`Access denied. ${role} access required.`, 'error');
      setTimeout(() => window.location.href = 'login.html', 2000);
      return false;
    }
    return true;
  },

  // Save user to session
  saveCurrentUser(userData) {
    if (!userData || !userData.id) {
      console.error('Invalid user data:', userData);
      return false;
    }
    this.currentUser = userData;
    sessionStorage.setItem('currentUser', JSON.stringify(userData));
    return true;
  },

  // Logout
  logout() {
    this.currentUser = null;
    sessionStorage.removeItem('currentUser');
    OpusUtils.showNotification('Logged out successfully', 'success');
    window.location.href = 'login.html';
  },

  // === EXISTING METHODS CONTINUE ===

  // Create new admin (only for existing admins)
  createAdmin(adminData, createdBy) {
    if (!this.hasPermission(createdBy, 'create_admin')) {
      OpusUtils.showNotification('Permission denied: Cannot create admin accounts', 'error');
      return false;
    }

    // Check if user already exists
    if (OpusStorage.get(`user_${adminData.email}`)) {
      OpusUtils.showNotification('User with this email already exists', 'error');
      return false;
    }

    const newAdmin = {
      id: Date.now(), // Simple ID generation
      email: adminData.email,
      password: adminData.password,
      role: adminData.role,
      name: adminData.name,
      permissions: adminData.permissions || [],
      createdBy: createdBy.email,
      createdAt: new Date().toISOString(),
      isActive: true,
      lastLogin: null
    };

    // Save admin user
    OpusStorage.set(`user_${newAdmin.email}`, newAdmin);

    // Add to admin list
    const adminUsers = OpusStorage.get('admin_users') || [];
    adminUsers.push(newAdmin.email);
    OpusStorage.set('admin_users', adminUsers);

    OpusUtils.showNotification(`Admin account created for ${newAdmin.name}`, 'success');
    return true;
  },

  // Get all admin users
  getAdminUsers() {
    const adminEmails = OpusStorage.get('admin_users') || [];
    return adminEmails.map(email => {
      const user = OpusStorage.get(`user_${email}`);
      // Remove password for security
      if (user) {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }
      return null;
    }).filter(user => user !== null);
  },

  // Check admin permissions
  hasPermission(user, permission) {
    if (!user) return false;
    
    if (user.role === 'super_admin') return true;
    if (user.permissions && user.permissions.includes('all')) return true;
    if (user.permissions && user.permissions.includes(permission)) return true;
    
    return false;
  },

  // Admin login (separate from regular login)
  adminLogin(email, password) {
    this.initSystem();
    
    const user = OpusStorage.get(`user_${email}`);
    
    // Check if user is an admin
    const adminUsers = OpusStorage.get('admin_users') || [];
    if (!adminUsers.includes(email)) {
      OpusUtils.showNotification('Access denied: Admin login only', 'error');
      return false;
    }
    
    if (user && user.password === password && user.isActive) {
      // Update last login
      user.lastLogin = new Date().toISOString();
      OpusStorage.set(`user_${email}`, user);
      
      // Remove password from session
      const { password: _, ...userWithoutPassword } = user;
      this.saveCurrentUser(userWithoutPassword);
      
      OpusUtils.showNotification(`Welcome back, ${user.name}!`, 'success');
      return true;
    }
    
    OpusUtils.showNotification('Invalid admin credentials', 'error');
    return false;
  },

  // Regular login (for workers/employers)
  userLogin(email, password, role) {
    this.initSystem();
    
    const user = OpusStorage.get(`user_${email}`);
    
    // Prevent admin login through regular login
    const adminUsers = OpusStorage.get('admin_users') || [];
    if (adminUsers.includes(email)) {
      OpusUtils.showNotification('Please use admin login', 'error');
      return false;
    }
    
    if (user && user.password === password && user.role === role) {
      const { password: _, ...userWithoutPassword } = user;
      this.saveCurrentUser(userWithoutPassword);
      
      OpusUtils.showNotification(`Welcome back, ${user.name}!`, 'success');
      return true;
    }
    
    return false;
  }
};