// js/admin-data-manager.js - Separate from main data manager
const AdminDataManager = {
    // Get all users without affecting main data structure
    getAllUsers() {
        try {
            const users = [];
            
            // Safely get employers
            const employers = JSON.parse(localStorage.getItem('employers') || '[]');
            employers.forEach(employer => {
                if (employer && typeof employer === 'object') {
                    users.push({
                        id: `EMP-${employer.id || Date.now()}`,
                        name: employer.companyName || employer.name || 'Unknown Employer',
                        email: employer.email || 'No email',
                        role: 'employer',
                        status: employer.status || 'active',
                        joinDate: employer.joinDate || new Date().toISOString().split('T')[0],
                        company: employer.companyName,
                        profile: employer
                    });
                }
            });
            
            // Safely get workers
            const workers = JSON.parse(localStorage.getItem('workers') || '[]');
            workers.forEach(worker => {
                if (worker && typeof worker === 'object') {
                    users.push({
                        id: `WRK-${worker.id || Date.now()}`,
                        name: worker.fullName || worker.name || 'Unknown Worker',
                        email: worker.email || 'No email',
                        role: 'worker',
                        status: worker.status || 'active',
                        joinDate: worker.joinDate || new Date().toISOString().split('T')[0],
                        skills: worker.skills || [],
                        profile: worker
                    });
                }
            });
            
            return users;
        } catch (error) {
            console.error('Error getting users:', error);
            return [];
        }
    },

    // Get all jobs safely
    getAllJobs() {
        try {
            const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
            return jobs.filter(job => job && typeof job === 'object').map(job => ({
                id: job.id || `JOB-${Date.now()}`,
                title: job.title || 'Untitled Job',
                company: job.company || job.employerCompany || 'Unknown Company',
                category: job.category || 'General',
                type: job.type || 'Full-Time',
                location: job.location || 'Remote',
                salary: job.salary || 'Not specified',
                description: job.description || '',
                requirements: job.requirements || '',
                skills: job.skills || [],
                status: job.status || 'active',
                applications: job.applications ? (Array.isArray(job.applications) ? job.applications.length : 0) : 0,
                postedDate: job.postedDate || new Date().toISOString().split('T')[0],
                employerId: job.employerId,
                employerEmail: job.employerEmail
            }));
        } catch (error) {
            console.error('Error getting jobs:', error);
            return [];
        }
    }
    // ... rest of safe functions
};