// storage.js - Complete Fixed Version
class OpusStorage {
    // Generic storage methods
    static get(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from storage:', error);
            return null;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error writing to storage:', error);
            return false;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from storage:', error);
            return false;
        }
    }

    static clear() {
        try {
            localStorage.clear();
            return true;
        } catch (error) {
            console.error('Error clearing storage:', error);
            return false;
        }
    }

    // Users
    static getUsers() {
        return JSON.parse(localStorage.getItem('opuslink_users') || '[]');
    }

    static getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    }

    static getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    }

    static saveUser(user) {
        const users = this.getUsers();
        
        if (user.id) {
            // Update existing user
            const userIndex = users.findIndex(u => u.id === user.id);
            if (userIndex !== -1) {
                users[userIndex] = user;
            }
        } else {
            // Create new user
            user.id = this.generateId();
            user.createdAt = new Date().toISOString();
            user.isVerified = false;
            user.isActive = true;
            users.unshift(user);
        }

        localStorage.setItem('opuslink_users', JSON.stringify(users));
        return user;
    }

    static updateUser(userId, updates) {
        const users = this.getUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem('opuslink_users', JSON.stringify(users));
            return true;
        }
        return false;
    }

    static deleteUser(userId) {
        const users = this.getUsers();
        const filteredUsers = users.filter(user => user.id !== userId);
        localStorage.setItem('opuslink_users', JSON.stringify(filteredUsers));
        return true;
    }

    // Jobs
    static getJobs() {
        return JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
    }

    static getJobById(id) {
        const jobs = this.getJobs();
        return jobs.find(job => job.id === id);
    }

    static getJobsByEmployer(employerId) {
        const jobs = this.getJobs();
        return jobs.filter(job => job.employerId === employerId);
    }

    static getJobsByCategory(category) {
        const jobs = this.getJobs();
        return jobs.filter(job => job.category === category);
    }

    static saveJob(job) {
        const jobs = this.getJobs();
        
        if (job.id) {
            // Update existing job
            const jobIndex = jobs.findIndex(j => j.id === job.id);
            if (jobIndex !== -1) {
                jobs[jobIndex] = job;
            }
        } else {
            // Create new job
            job.id = this.generateId();
            job.createdAt = new Date().toISOString();
            job.updatedAt = new Date().toISOString();
            job.applications = [];
            job.status = 'active';
            job.isArchived = false;
            jobs.unshift(job);
        }

        localStorage.setItem('opuslink_jobs', JSON.stringify(jobs));
        return job;
    }

    static deleteJob(jobId) {
        const jobs = this.getJobs();
        const filteredJobs = jobs.filter(job => job.id !== jobId);
        localStorage.setItem('opuslink_jobs', JSON.stringify(filteredJobs));
        return true;
    }

    static archiveJob(jobId) {
        const jobs = this.getJobs();
        const jobIndex = jobs.findIndex(job => job.id === jobId);
        if (jobIndex !== -1) {
            jobs[jobIndex].isArchived = true;
            jobs[jobIndex].status = 'archived';
            jobs[jobIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('opuslink_jobs', JSON.stringify(jobs));
            return true;
        }
        return false;
    }

    // Applications
    static getApplications() {
        return JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
    }

    static getApplicationById(id) {
        const applications = this.getApplications();
        return applications.find(app => app.id === id);
    }

    static getApplicationsByJob(jobId) {
        const applications = this.getApplications();
        return applications.filter(app => app.jobId === jobId);
    }

    static getApplicationsByWorker(workerId) {
        const applications = this.getApplications();
        return applications.filter(app => app.workerId === workerId);
    }

    static saveApplication(application) {
        const applications = this.getApplications();
        
        if (application.id) {
            // Update existing application
            const appIndex = applications.findIndex(app => app.id === application.id);
            if (appIndex !== -1) {
                applications[appIndex] = application;
            }
        } else {
            // Create new application
            application.id = this.generateId();
            application.appliedAt = new Date().toISOString();
            application.status = 'pending';
            application.updatedAt = new Date().toISOString();
            applications.unshift(application);
        }

        localStorage.setItem('opuslink_applications', JSON.stringify(applications));
        return application;
    }

    static updateApplicationStatus(applicationId, status) {
        const applications = this.getApplications();
        const appIndex = applications.findIndex(app => app.id === applicationId);
        if (appIndex !== -1) {
            applications[appIndex].status = status;
            applications[appIndex].updatedAt = new Date().toISOString();
            localStorage.setItem('opuslink_applications', JSON.stringify(applications));
            return true;
        }
        return false;
    }

    // Messages
    static getMessages() {
        return JSON.parse(localStorage.getItem('opuslink_messages') || '[]');
    }

    static getMessagesBetweenUsers(user1Id, user2Id) {
        const messages = this.getMessages();
        return messages.filter(msg => 
            (msg.senderId === user1Id && msg.receiverId === user2Id) ||
            (msg.senderId === user2Id && msg.receiverId === user1Id)
        ).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    }

    static getUnreadMessagesCount(userId) {
        const messages = this.getMessages();
        return messages.filter(msg => msg.receiverId === userId && !msg.read).length;
    }

    static saveMessage(message) {
        const messages = this.getMessages();
        message.id = this.generateId();
        message.timestamp = new Date().toISOString();
        message.read = false;
        messages.push(message);
        localStorage.setItem('opuslink_messages', JSON.stringify(messages));
        return message;
    }

    static markMessagesAsRead(senderId, receiverId) {
        const messages = this.getMessages();
        const updatedMessages = messages.map(msg => {
            if (msg.senderId === senderId && msg.receiverId === receiverId && !msg.read) {
                return { ...msg, read: true };
            }
            return msg;
        });
        localStorage.setItem('opuslink_messages', JSON.stringify(updatedMessages));
        return true;
    }

    // Ratings
    static getRatings() {
        return JSON.parse(localStorage.getItem('opuslink_ratings') || '[]');
    }

    static getRatingsForUser(userId) {
        const ratings = this.getRatings();
        return ratings.filter(rating => rating.ratedUserId === userId);
    }

    static getAverageRating(userId) {
        const ratings = this.getRatingsForUser(userId);
        if (ratings.length === 0) return 0;
        const sum = ratings.reduce((total, rating) => total + rating.rating, 0);
        return (sum / ratings.length).toFixed(1);
    }

    static saveRating(rating) {
        const ratings = this.getRatings();
        rating.id = this.generateId();
        rating.createdAt = new Date().toISOString();
        ratings.push(rating);
        localStorage.setItem('opuslink_ratings', JSON.stringify(ratings));
        return rating;
    }
    // In storage.js - add these methods to OpusStorage class

// Verification Management
static getUserVerificationStatus(userId) {
    const user = this.getUserById(userId);
    return user ? user.verificationStatus : 'not_found';
}

static updateVerificationStatus(userId, status, adminId = null) {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex !== -1) {
        users[userIndex].verificationStatus = status;
        users[userIndex].isVerified = status === 'verified';
        
        if (status === 'verified') {
            users[userIndex].verificationDate = new Date().toISOString();
        }
        
        if (adminId) {
            users[userIndex].verifiedBy = adminId;
        }
        
        localStorage.setItem('opuslink_users', JSON.stringify(users));
        return true;
    }
    return false;
}

static getPendingVerifications() {
    const users = this.getUsers();
    return users.filter(user => 
        user.verificationStatus === 'pending' && 
        user.role !== 'admin'
    );
}

// Job Posting with Verification Check
static canPostJob(userId) {
    const user = this.getUserById(userId);
    if (!user) return false;
    
    // Employers need verification to post jobs
    if (user.role === 'employer') {
        return user.verificationStatus === 'verified';
    }
    
    return false;
}

static canApplyToJob(userId) {
    const user = this.getUserById(userId);
    if (!user) return false;
    
    // Workers need verification to apply to jobs
    if (user.role === 'worker') {
        return user.verificationStatus === 'verified';
    }
    
    return false;
}

// Enhanced job saving with verification check
static saveJobWithVerification(job, employerId) {
    if (!this.canPostJob(employerId)) {
        throw new Error('Employer must be verified to post jobs');
    }
    
    return this.saveJob(job);
}

// Enhanced application saving with verification check
static saveApplicationWithVerification(application, workerId) {
    if (!this.canApplyToJob(workerId)) {
        throw new Error('Worker must be verified to apply for jobs');
    }
    
    return this.saveApplication(application);
}

    // Admin Methods
    static getAdminStats() {
        const users = this.getUsers();
        const jobs = this.getJobs();
        const applications = this.getApplications();
        const messages = this.getMessages();

        return {
            totalUsers: users.length,
            totalEmployers: users.filter(u => u.role === 'employer').length,
            totalWorkers: users.filter(u => u.role === 'worker').length,
            totalAdmins: users.filter(u => u.role === 'admin').length,
            totalJobs: jobs.length,
            activeJobs: jobs.filter(j => j.status === 'active').length,
            archivedJobs: jobs.filter(j => j.status === 'archived').length,
            totalApplications: applications.length,
            pendingApplications: applications.filter(a => a.status === 'pending').length,
            acceptedApplications: applications.filter(a => a.status === 'accepted').length,
            rejectedApplications: applications.filter(a => a.status === 'rejected').length,
            totalMessages: messages.length,
            unreadMessages: messages.filter(m => !m.read).length
        };
    }

    static getAllUsersWithDetails() {
        const users = this.getUsers();
        const jobs = this.getJobs();
        const applications = this.getApplications();

        return users.map(user => {
            let userStats = {};
            
            if (user.role === 'employer') {
                const employerJobs = jobs.filter(j => j.employerId === user.id);
                userStats = {
                    postedJobs: employerJobs.length,
                    totalApplications: applications.filter(a => 
                        employerJobs.some(j => j.id === a.jobId)
                    ).length,
                    activeJobs: employerJobs.filter(j => j.status === 'active').length,
                    archivedJobs: employerJobs.filter(j => j.status === 'archived').length
                };
            } else if (user.role === 'worker') {
                const workerApplications = applications.filter(a => a.workerId === user.id);
                userStats = {
                    totalApplications: workerApplications.length,
                    pendingApplications: workerApplications.filter(a => a.status === 'pending').length,
                    acceptedApplications: workerApplications.filter(a => a.status === 'accepted').length,
                    rejectedApplications: workerApplications.filter(a => a.status === 'rejected').length
                };
            }

            return {
                ...user,
                stats: userStats,
                lastActive: user.lastActive || user.createdAt,
                joinDate: user.createdAt
            };
        });
    }

    static getPlatformAnalytics() {
        const users = this.getUsers();
        const jobs = this.getJobs();
        const applications = this.getApplications();

        // Calculate monthly growth (sample data)
        const monthlyData = {
            userGrowth: [65, 78, 92, 81, 56, 55, 40, 45, 68, 72, 85, 94],
            jobPostings: [12, 19, 3, 5, 2, 3, 15, 8, 12, 14, 11, 18],
            applications: [30, 45, 25, 35, 18, 22, 40, 28, 35, 42, 38, 50]
        };

        return {
            monthlyData,
            popularCategories: this.getJobCategoriesStats(),
            conversionRate: applications.length > 0 ? 
                (applications.filter(a => a.status === 'accepted').length / applications.length * 100).toFixed(1) : 0,
            averageApplicationsPerJob: jobs.length > 0 ? 
                (applications.length / jobs.length).toFixed(1) : 0,
            userEngagement: this.calculateUserEngagement()
        };
    }

    static getJobCategoriesStats() {
        const jobs = this.getJobs();
        const categoryCount = {};
        
        jobs.forEach(job => {
            categoryCount[job.category] = (categoryCount[job.category] || 0) + 1;
        });

        return Object.entries(categoryCount)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count);
    }

    static calculateUserEngagement() {
        const users = this.getUsers();
        const applications = this.getApplications();
        const messages = this.getMessages();

        const activeUsers = users.filter(user => {
            if (user.role === 'worker') {
                return applications.some(app => app.workerId === user.id);
            } else if (user.role === 'employer') {
                return applications.some(app => {
                    const job = this.getJobById(app.jobId);
                    return job && job.employerId === user.id;
                });
            }
            return false;
        }).length;

        return {
            activeUsers,
            totalUsers: users.length,
            engagementRate: ((activeUsers / users.length) * 100).toFixed(1)
        };
    }

    // Utility Methods
    static generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    static searchJobs(query, filters = {}) {
        let jobs = this.getJobs();
        
        if (query) {
            jobs = jobs.filter(job => 
                job.title.toLowerCase().includes(query.toLowerCase()) ||
                job.description.toLowerCase().includes(query.toLowerCase()) ||
                job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()))
            );
        }

        // Apply filters
        if (filters.category) {
            jobs = jobs.filter(job => job.category === filters.category);
        }
        if (filters.location) {
            jobs = jobs.filter(job => job.location.toLowerCase().includes(filters.location.toLowerCase()));
        }
        if (filters.type) {
            jobs = jobs.filter(job => job.type === filters.type);
        }
        if (filters.salaryMin) {
            jobs = jobs.filter(job => parseInt(job.salary) >= parseInt(filters.salaryMin));
        }

        return jobs;
    }

    static getPaginatedData(data, page = 1, limit = 10) {
        const start = (page - 1) * limit;
        const end = start + limit;
        return {
            data: data.slice(start, end),
            total: data.length,
            page,
            totalPages: Math.ceil(data.length / limit),
            hasNext: end < data.length,
            hasPrev: page > 1
        };
    }

    // Initialize sample data if empty
    static initializeSampleData() {
        if (this.getUsers().length === 0) {
        const sampleUsers = [
            {
                id: 'admin1',
                fullName: 'System Administrator',
                email: 'admin@opuslink.com',
                password: 'temp_admin_123',
                phone: '+91 9876543200',
                role: 'admin',
                isVerified: true,
                isActive: true,
                verificationStatus: 'verified', // NEW
                verificationDate: new Date().toISOString(), // NEW
                permissions: ['manage_users', 'manage_jobs', 'view_analytics', 'system_settings'],
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            },
            {
                id: 'employer1',
                fullName: 'Acme Corp Admin',
                email: 'admin@acmecorp.com',
                password: 'temp_employer_123',
                phone: '+91 9876543210',
                role: 'employer',
                isVerified: true,
                isActive: true,
                verificationStatus: 'verified', // NEW
                verificationDate: new Date().toISOString(), // NEW
                companyDocuments: ['business_license.pdf'], // NEW
                createdAt: new Date().toISOString(),
                companyCategory: 'tech',
                companySize: '51-200',
                companyName: 'Acme Corporation',
                industry: 'Technology & IT',
                website: 'https://acmecorp.com',
                location: 'Mumbai, Maharashtra',
                description: 'Leading technology company building innovative solutions',
                postedJobs: [],
                hiredWorkers: []
            },
            {
                id: 'worker1',
                fullName: 'Ravi Kumar',
                email: 'ravi@example.com',
                password: 'temp_worker_123',
                phone: '+91 9876543211',
                role: 'worker',
                isVerified: false, // NOT verified initially
                isActive: true,
                verificationStatus: 'pending', // NEW
                verificationDate: null, // NEW
                skills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
                education: 'B.Tech Computer Science',
                preferredLocation: 'Bangalore, Karnataka',
                bio: 'Full stack developer with 4 years of experience in building web applications',
                applications: [],
                resume: 'ravi_kumar_resume.pdf', // NEW
                experience: [ // NEW
                    {
                        company: 'Tech Solutions Inc',
                        position: 'Frontend Developer',
                        duration: '2 years',
                        description: 'Built responsive web applications'
                    }
                ]
            },
            {
                id: 'worker2',
                fullName: 'Priya Sharma',
                email: 'priya@example.com',
                password: 'temp_worker_456',
                phone: '+91 9876543212',
                role: 'worker',
                isVerified: true, // Already verified
                isActive: true,
                verificationStatus: 'verified', // NEW
                verificationDate: new Date().toISOString(), // NEW
                skills: ['Patient Care', 'Emergency Response', 'Medical Records'],
                education: 'B.Sc Nursing',
                preferredLocation: 'Delhi, NCR',
                bio: 'Senior nurse with 8 years of experience in critical care units',
                applications: [],
                resume: 'priya_sharma_resume.pdf', // NEW
                certifications: ['BLS Certified', 'ACLS Certified'] // NEW
            }
        ];

        localStorage.setItem('opuslink_users', JSON.stringify(sampleUsers));

            // Create sample jobs
            const sampleJobs = [
                {
                    id: 'job1',
                    employerId: 'employer1',
                    title: 'Frontend Developer',
                    category: 'tech',
                    type: 'fulltime',
                    location: 'Bangalore, Karnataka',
                    salary: '50000',
                    description: 'We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing design systems.',
                    requirements: ['3+ years of React experience', 'Strong JavaScript skills', 'Experience with responsive design'],
                    skills: ['React', 'JavaScript', 'HTML/CSS', 'TypeScript'],
                    status: 'active',
                    isArchived: false,
                    createdAt: new Date().toISOString(),
                    applications: []
                },
                {
                    id: 'job2',
                    employerId: 'employer1',
                    title: 'Senior Nurse',
                    category: 'healthcare',
                    type: 'fulltime',
                    location: 'Delhi, NCR',
                    salary: '55000',
                    description: 'Looking for an experienced Senior Nurse for our hospital. Must have experience in critical care and emergency response.',
                    requirements: ['B.Sc Nursing', '5+ years experience', 'Critical care certification'],
                    skills: ['Patient Care', 'Emergency Response', 'Medical Knowledge'],
                    status: 'active',
                    isArchived: false,
                    createdAt: new Date().toISOString(),
                    applications: []
                },
                {
                    id: 'job3',
                    employerId: 'employer1',
                    title: 'Backend Developer',
                    category: 'tech',
                    type: 'remote',
                    location: 'Remote',
                    salary: '60000',
                    description: 'Looking for a backend developer with Node.js and database experience.',
                    requirements: ['4+ years Node.js', 'MongoDB/PostgreSQL', 'API Design'],
                    skills: ['Node.js', 'MongoDB', 'Express', 'REST API'],
                    status: 'active',
                    isArchived: false,
                    createdAt: new Date().toISOString(),
                    applications: []
                }
            ];

            localStorage.setItem('opuslink_jobs', JSON.stringify(sampleJobs));

            // Create sample applications
            const sampleApplications = [
                {
                    id: 'app1',
                    jobId: 'job1',
                    workerId: 'worker1',
                    status: 'pending',
                    appliedAt: new Date().toISOString(),
                    coverLetter: 'I am very interested in this position and believe my skills are a great match for your requirements.',
                    resume: 'ravi_kumar_resume.pdf',
                    updatedAt: new Date().toISOString()
                },
                {
                    id: 'app2',
                    jobId: 'job2',
                    workerId: 'worker2',
                    status: 'accepted',
                    appliedAt: new Date().toISOString(),
                    coverLetter: 'I have extensive experience in critical care nursing and would love to bring my skills to your hospital.',
                    resume: 'priya_sharma_resume.pdf',
                    updatedAt: new Date().toISOString()
                }
            ];

            localStorage.setItem('opuslink_applications', JSON.stringify(sampleApplications));

            // Create sample messages
            const sampleMessages = [
                {
                    id: 'msg1',
                    senderId: 'worker1',
                    receiverId: 'employer1',
                    jobId: 'job1',
                    message: 'Hello, I am interested in the Frontend Developer position. Could you tell me more about the team?',
                    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    read: true
                },
                {
                    id: 'msg2',
                    senderId: 'employer1',
                    receiverId: 'worker1',
                    jobId: 'job1',
                    message: 'Sure! We have a team of 10 developers working on various projects. The position is for our new e-commerce platform.',
                    timestamp: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
                    read: false
                }
            ];

            localStorage.setItem('opuslink_messages', JSON.stringify(sampleMessages));

            console.log('✅ Sample data initialized with admin, employer, worker accounts');
            console.log('📧 Admin: admin@opuslink.com / temp_admin_123');
            console.log('💼 Employer: admin@acmecorp.com / temp_employer_123');
            console.log('👷 Worker: ravi@example.com / temp_worker_123');
            console.log('👩‍⚕️ Worker: priya@example.com / temp_worker_456');
        } else {
            console.log('ℹ️ Sample data already exists');
        }
    }
}

// Initialize when loaded
OpusStorage.initializeSampleData();

// Make global
window.OpusStorage = OpusStorage;

console.log('✅ OpusStorage loaded with complete functionality');