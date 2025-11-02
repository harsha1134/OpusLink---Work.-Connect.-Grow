// AGREEMENT MANAGER CLASS
class AgreementManager {
    static init() {
        console.log('📝 Agreement Manager initialized');
    }

static createAgreementForApplication(applicationId, terms) {
    try {
        console.log('📝 Creating agreement for application:', applicationId);
        
        const applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
        const application = applications.find(app => app.id === applicationId);
        
        if (!application) {
            throw new Error('Application not found');
        }

        // VALIDATE AND ENSURE ALL DATES ARE VALID
        const now = new Date();
        
        // Validate start date
        let startDate = terms.workTerms?.startDate ? new Date(terms.workTerms.startDate) : now;
        if (isNaN(startDate.getTime())) {
            console.warn('⚠️ Invalid start date, using current date');
            startDate = now;
        }

        // Calculate end date based on duration
        const duration = parseInt(terms.workTerms?.duration) || 90;
        let endDate = new Date(startDate.getTime() + (duration * 24 * 60 * 60 * 1000));
        if (isNaN(endDate.getTime())) {
            endDate = new Date(now.getTime() + (duration * 24 * 60 * 60 * 1000));
        }

        const agreement = {
            id: 'agreement_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            employerId: application.employerId,
            employerName: application.employerName,
            workerId: application.workerId,
            workerName: application.workerName,
            jobId: application.jobId,
            jobTitle: application.jobTitle,
            applicationId: applicationId,
            status: 'pending_worker_acceptance',
            
            // Payment terms with validation
            paymentTerms: {
                type: terms.paymentType || 'monthly',
                amount: parseFloat(terms.paymentAmount) || 0,
                schedule: terms.paymentSchedule || 'monthly',
                currency: terms.currency || 'INR',
                hourlyRate: terms.paymentType === 'hourly' ? parseFloat(terms.paymentAmount) || 0 : 0
            },
            
            // Work terms with validated dates
            workTerms: {
                workType: terms.workType || 'fulltime',
                location: terms.workLocation || 'remote',
                duration: duration,
                weeklyHours: parseInt(terms.weeklyHours) || 40,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                probationPeriod: parseInt(terms.probationPeriod) || 0,
                noticePeriod: parseInt(terms.noticePeriod) || 15,
                workingDays: terms.workingDays || 'mon_fri',
                shiftTiming: terms.shiftTiming || 'general',
                overtimePolicy: terms.overtimePolicy || 'paid_2x'
            },
            
            // Legal terms
            legalTerms: {
                ipRights: terms.ipRights || 'employer',
                confidentiality: terms.confidentiality || 'standard',
                equipmentProvision: terms.equipmentProvision || 'employer_provides',
                additionalTerms: terms.additionalTerms || ''
            },
            
            // Additional fields with proper dates
            workStatus: 'not_started',
            payments: [],
            workLogs: [],
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
        };

        console.log('✅ Agreement object created with valid dates');

        // Save agreement
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        agreements.push(agreement);
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));

        // Update application status
        application.status = 'agreement_created';
        application.agreementId = agreement.id;
        localStorage.setItem('opuslink_applications', JSON.stringify(applications));

        console.log('🎉 Agreement created successfully for application');
        return agreement;

    } catch (error) {
        console.error('❌ Error creating agreement for application:', error);
        throw error;
    }
}

    // Create agreement for direct job offers
    static createAgreementForJobOffer(offerId, terms) {
    try {
        console.log('📝 Creating agreement for job offer:', offerId);
        
        const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
        const offer = jobOffers.find(o => o.id === offerId);
        
        if (!offer) {
            throw new Error('Job offer not found');
        }

        // VALIDATE AND FIX DATES
        const now = new Date();
        const startDate = terms.workTerms?.startDate ? new Date(terms.workTerms.startDate) : now;
        const endDate = terms.workTerms?.duration ? 
            new Date(startDate.getTime() + (terms.workTerms.duration * 24 * 60 * 60 * 1000)) : 
            new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000)); // Default 90 days

        // Ensure dates are valid
        if (isNaN(startDate.getTime())) {
            startDate = now;
        }
        if (isNaN(endDate.getTime())) {
            endDate = new Date(now.getTime() + (90 * 24 * 60 * 60 * 1000));
        }

        const agreement = {
            id: 'agreement_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            employerId: offer.employerId,
            employerName: offer.employerName,
            workerId: offer.workerId,
            workerName: offer.workerName,
            jobId: offer.jobId,
            jobTitle: offer.jobTitle,
            offerId: offerId,
            status: 'pending_worker_acceptance',
            
            // Payment terms with proper validation
            paymentTerms: {
                type: terms.paymentType || 'monthly',
                amount: parseFloat(terms.paymentAmount) || 0,
                schedule: terms.paymentSchedule || 'monthly',
                currency: terms.currency || 'INR',
                hourlyRate: terms.paymentType === 'hourly' ? parseFloat(terms.paymentAmount) || 0 : 0
            },
            
            // Work terms with validated dates
            workTerms: {
                workType: terms.workType || 'fulltime',
                location: terms.workLocation || 'remote',
                duration: parseInt(terms.duration) || 90,
                weeklyHours: parseInt(terms.weeklyHours) || 40,
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                probationPeriod: parseInt(terms.probationPeriod) || 0,
                noticePeriod: parseInt(terms.noticePeriod) || 15,
                workingDays: terms.workingDays || 'mon_fri',
                shiftTiming: terms.shiftTiming || 'general',
                overtimePolicy: terms.overtimePolicy || 'paid_2x'
            },
            
            // Legal terms
            legalTerms: {
                ipRights: terms.ipRights || 'employer',
                confidentiality: terms.confidentiality || 'standard',
                equipmentProvision: terms.equipmentProvision || 'employer_provides',
                additionalTerms: terms.additionalTerms || ''
            },
            
            // Additional fields with proper dates
            workStatus: 'not_started',
            payments: [],
            workLogs: [],
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
        };

        console.log('✅ Agreement object created:', agreement);

        // Save agreement
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        agreements.push(agreement);
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));

        // Update offer status
        offer.status = 'agreement_created';
        offer.agreementId = agreement.id;
        localStorage.setItem('opuslink_job_offers', JSON.stringify(jobOffers));

        console.log('🎉 Agreement created successfully for job offer');
        return agreement;

    } catch (error) {
        console.error('❌ Error creating agreement for job offer:', error);
        throw error;
    }
}
    // 🔧 ADD TO AgreementManager class
static requestAgreementModification(agreementId, modificationData, requestedBy) {
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    const agreementIndex = agreements.findIndex(a => a.id === agreementId);
    
    if (agreementIndex === -1) return null;

    const modificationRequest = {
        id: 'mod_req_' + Date.now(),
        agreementId: agreementId,
        requestedBy: requestedBy.id,
        requestedByName: requestedBy.name,
        requestedByRole: requestedBy.role,
        modificationData: modificationData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        responses: {}
    };

    if (!agreements[agreementIndex].modificationRequests) {
        agreements[agreementIndex].modificationRequests = [];
    }
    
    agreements[agreementIndex].modificationRequests.push(modificationRequest);
    agreements[agreementIndex].status = 'modification_pending';
    
    localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
    
    return modificationRequest;
}

static respondToModification(modificationId, agreementId, response, respondedBy) {
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    const agreementIndex = agreements.findIndex(a => a.id === agreementId);
    
    if (agreementIndex === -1) return false;

    const modificationIndex = agreements[agreementIndex].modificationRequests?.findIndex(m => m.id === modificationId);
    if (modificationIndex === -1) return false;

    agreements[agreementIndex].modificationRequests[modificationIndex].responses[respondedBy.role] = {
        response: response.status,
        message: response.message,
        respondedAt: new Date().toISOString()
    };

    // Check if both parties have responded
    const responses = agreements[agreementIndex].modificationRequests[modificationIndex].responses;
    const hasEmployerResponse = responses.employer;
    const hasWorkerResponse = responses.worker;

    if (hasEmployerResponse && hasWorkerResponse) {
        if (responses.employer.response === 'accepted' && responses.worker.response === 'accepted') {
            // Apply modifications
            agreements[agreementIndex].modificationRequests[modificationIndex].status = 'accepted';
            agreements[agreementIndex].status = 'active';
            
            const modData = agreements[agreementIndex].modificationRequests[modificationIndex].modificationData;
            if (modData.paymentTerms) {
                Object.assign(agreements[agreementIndex].paymentTerms, modData.paymentTerms);
            }
            if (modData.workTerms) {
                Object.assign(agreements[agreementIndex].workTerms, modData.workTerms);
            }
        } else {
            agreements[agreementIndex].modificationRequests[modificationIndex].status = 'rejected';
            agreements[agreementIndex].status = 'active';
        }
    }

    localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
    return true;
}

static requestAgreementTermination(agreementId, terminationData, requestedBy) {
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    const agreementIndex = agreements.findIndex(a => a.id === agreementId);
    
    if (agreementIndex === -1) return null;

    const terminationRequest = {
        id: 'term_req_' + Date.now(),
        agreementId: agreementId,
        requestedBy: requestedBy.id,
        requestedByName: requestedBy.name,
        requestedByRole: requestedBy.role,
        reason: terminationData.reason,
        details: terminationData.details,
        effectiveDate: terminationData.effectiveDate,
        status: 'pending',
        createdAt: new Date().toISOString(),
        responses: {}
    };

    if (!agreements[agreementIndex].terminationRequests) {
        agreements[agreementIndex].terminationRequests = [];
    }
    
    agreements[agreementIndex].terminationRequests.push(terminationRequest);
    agreements[agreementIndex].status = 'termination_pending';
    
    localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
    
    return terminationRequest;
}

static respondToTermination(terminationId, agreementId, response, respondedBy) {
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    const agreementIndex = agreements.findIndex(a => a.id === agreementId);
    
    if (agreementIndex === -1) return false;

    const terminationIndex = agreements[agreementIndex].terminationRequests?.findIndex(t => t.id === terminationId);
    if (terminationIndex === -1) return false;

    agreements[agreementIndex].terminationRequests[terminationIndex].responses[respondedBy.role] = {
        response: response.status,
        message: response.message,
        respondedAt: new Date().toISOString()
    };

    const responses = agreements[agreementIndex].terminationRequests[terminationIndex].responses;
    const hasEmployerResponse = responses.employer;
    const hasWorkerResponse = responses.worker;

    if (hasEmployerResponse && hasWorkerResponse) {
        if (responses.employer.response === 'accepted' && responses.worker.response === 'accepted') {
            agreements[agreementIndex].terminationRequests[terminationIndex].status = 'accepted';
            agreements[agreementIndex].status = 'terminated';
            agreements[agreementIndex].terminatedAt = new Date().toISOString();
        } else {
            agreements[agreementIndex].terminationRequests[terminationIndex].status = 'rejected';
            agreements[agreementIndex].status = 'active';
        }
    }

    localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
    return true;
}

    static getDefaultTerms(job, source) {
        const baseSalary = job.salary ? parseInt(job.salary.replace(/[^\d]/g, '')) : 45000;
        
        return {
            paymentType: 'monthly',
            paymentAmount: baseSalary,
            paymentSchedule: 'monthly',
            hourlyRate: Math.round(baseSalary / 160), // 160 hours per month
            workType: job.type || 'fulltime',
            duration: 90, // days
            weeklyHours: job.type === 'fulltime' ? 40 : 20,
            probationPeriod: 15,
            noticePeriod: 30
        };
    }

    static getDefaultWorkerResponsibilities(category) {
        const responsibilities = {
            general: [
                'Perform assigned tasks diligently and professionally',
                'Maintain regular communication with employer',
                'Submit work reports as required',
                'Adhere to work schedule and deadlines'
            ]
        };

        return responsibilities[category] || responsibilities.general;
    }

    static getDefaultEmployerResponsibilities() {
        return [
            'Provide clear work instructions and expectations',
            'Make timely payments as per agreement',
            'Provide necessary tools and resources',
            'Maintain professional work environment'
        ];
    }

    static notifyAgreementCreation(agreement) {
        // Notify worker
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.createNotification(agreement.workerId, 'agreement_created', {
                employerName: agreement.employerName,
                jobTitle: agreement.jobTitle,
                agreementId: agreement.id,
                status: agreement.status
            });

            // Notify employer
            NotificationSystem.createNotification(agreement.employerId, 'agreement_created', {
                workerName: agreement.workerName,
                jobTitle: agreement.jobTitle,
                agreementId: agreement.id,
                status: agreement.status
            });
        }
    }

    // Worker accepts agreement
static acceptAgreement(agreementId) {
    try {
        console.log('✅ Accepting agreement:', agreementId);
        
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreementIndex = agreements.findIndex(a => a.id === agreementId);
        
        if (agreementIndex === -1) {
            console.error('❌ Agreement not found:', agreementId);
            return false;
        }

        // Update agreement status
        agreements[agreementIndex].status = 'active';
        agreements[agreementIndex].workStatus = 'in_progress';
        agreements[agreementIndex].acceptedAt = new Date().toISOString();
        agreements[agreementIndex].updatedAt = new Date().toISOString();
        
        // Ensure required fields exist
        if (!agreements[agreementIndex].workTerms) {
            agreements[agreementIndex].workTerms = {
                workType: 'fulltime',
                location: 'remote',
                duration: 90,
                weeklyHours: 40,
                startDate: new Date().toISOString()
            };
        }
        
        if (!agreements[agreementIndex].paymentTerms) {
            agreements[agreementIndex].paymentTerms = {
                type: 'monthly',
                amount: 45000,
                schedule: 'monthly',
                currency: 'INR'
            };
        }

        // Save the updated agreement
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        
        console.log('✅ Agreement accepted successfully');
        return true;
        
    } catch (error) {
        console.error('❌ Error accepting agreement:', error);
        return false;
    }
}
    // Worker rejects agreement
    static rejectAgreement(agreementId, reason = '') {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreementIndex = agreements.findIndex(a => a.id === agreementId);
        
        if (agreementIndex !== -1) {
            agreements[agreementIndex].status = 'rejected';
            agreements[agreementIndex].rejectionReason = reason;
            agreements[agreementIndex].updatedAt = new Date().toISOString();
            
            localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));

            // Notify employer
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.createNotification(
                    agreements[agreementIndex].employerId,
                    'agreement_rejected',
                    {
                        workerName: agreements[agreementIndex].workerName,
                        jobTitle: agreements[agreementIndex].jobTitle,
                        agreementId: agreementId,
                        reason: reason
                    }
                );
            }

            return true;
        }
        return false;
    }

// IN AgreementManager CLASS - ENSURE THIS METHOD WORKS PROPERLY
static getAgreement(agreementId) {
    try {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreement = agreements.find(a => a.id === agreementId);
        
        if (!agreement) {
            console.error('❌ Agreement not found with ID:', agreementId);
            console.log('📋 Available agreement IDs:', agreements.map(a => a.id));
            return null;
        }
        
        return agreement;
    } catch (error) {
        console.error('❌ Error getting agreement:', error);
        return null;
    }
}

    // Get agreements for user
    static getUserAgreements(userId) {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        return agreements.filter(a => 
            a.employerId === userId || a.workerId === userId
        );
    }

    // Check if agreement exists for application
    static hasAgreementForApplication(applicationId) {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        return agreements.some(a => a.applicationId === applicationId);
    }

    // Check if agreement exists for job offer
    static hasAgreementForJobOffer(offerId) {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        return agreements.some(a => a.offerId === offerId);
    }
}
// COMPLETE EmployerDashboard Class - Everything Working
class EmployerDashboard {
    static currentView = 'list';

    static init() {
        console.log('🚀 Initializing Employer Dashboard...');
        
        
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (!currentUser) {
                window.location.href = 'login.html';
                return;
            }
            if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.init();
        }
            this.currentUser = null;
            this.loadCurrentUser();

            // Initialize notification system
            NotificationSystem.init();
            NotificationSystem.setupNavigation();

            // Initialize all systems
            if (currentUser) {
                EscrowWallet.initializeWallet(currentUser.id);
            }
            
            this.setupNavigation();
            this.setupEventListeners();
            this.setupPendingWorkEvents();
            this.loadUserData();
            this.initializeProfilePicture();
            this.initializeProfileSystem();
            this.initializeNotifications();
            this.checkVerificationStatus(); // ADD THIS LINE
            this.setupRealTimeUpdates();
            this.ensureWorkLogsIntegrity();
            AgreementManager.init();
            
            // Load initial data
            this.loadOverview();
                    // Only set view if we're on a page that has view containers
        const hasViewContainers = document.getElementById('workersListContainer') && 
                                 document.getElementById('workersGridContainer');
        if (hasViewContainers) {
            this.setView('list');
        }
        
            
        } catch (error) {
            console.error('Dashboard init error:', error);
        }
    }
        // 🔧 ADD THIS METHOD TO EmployerDashboard CLASS
// 🔧 ADD THIS METHOD TO EmployerDashboard CLASS
static loadCurrentUser() {
    try {
        const userData = sessionStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            console.log('✅ Loaded current user:', this.currentUser.email);
            return this.currentUser;
        } else {
            console.log('❌ No user found in session storage');
            // Redirect to login if no user
            window.location.href = 'login.html';
            return null;
        }
    } catch (error) {
        console.error('Error loading current user:', error);
        window.location.href = 'login.html';
        return null;
    }
}
// 🔧 ADD METHOD TO PROTECT EMPLOYER DASHBOARD

 protectEmployerDashboard() {
    const userType = this.getUserType();
    if (userType === 'employer') {
        console.log('🛡️ Protecting employer dashboard from worker auto-refresh');
        
        // Override the loadActiveAgreements method for employers
        const originalLoadActiveAgreements = this.loadActiveAgreements;
        this.loadActiveAgreements = function() {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (currentUser && (currentUser.role === 'employer' || currentUser.companyName)) {
                console.log('🛑 Blocking worker agreement load for employer');
                return; // Don't load worker agreements for employer
            }
            // Call original method for workers
            return originalLoadActiveAgreements.apply(this, arguments);
        };
    }
}
      // ADD THESE METHODS:
static checkVerificationStatus() {
    console.log('🔍 Checking employer verification status...');
    
    try {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        if (!currentUser) {
            console.log('No user logged in');
            return false;
        }

        // Get fresh user data from ALL storage sources
        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const employers = JSON.parse(localStorage.getItem('employers') || '[]');
        
        // Check both user collections
        let freshUserData = users.find(u => u.id === currentUser.id);
        if (!freshUserData) {
            freshUserData = employers.find(emp => emp.id === currentUser.id);
        }
        
        if (!freshUserData) {
            console.log('User data not found in any storage');
            // Create the user record if it doesn't exist
            this.createMissingUserRecord(currentUser);
            return false;
        }

        // Update session storage with fresh data
        const updatedUser = {
            ...currentUser,
            ...freshUserData,
            isVerified: freshUserData.isVerified || false,
            verificationStatus: freshUserData.verificationStatus || 'pending'
        };
        
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));

        // Update UI based on verification status
        this.updateVerificationUI();
        
        console.log('✅ Employer verification status:', updatedUser.isVerified ? 'VERIFIED' : 'PENDING');
        
        return updatedUser.isVerified;

    } catch (error) {
        console.error('Error checking verification status:', error);
        return false;
    }
}
static createMissingUserRecord(user) {
    try {
        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const userExists = users.find(u => u.id === user.id);
        
        if (!userExists) {
            users.push({
                ...user,
                profileCompletion: user.profileCompletion || 30,
                isVerified: user.isVerified || false,
                verificationStatus: user.verificationStatus || 'pending',
                role: 'employer' // Ensure role is set
            });
            localStorage.setItem('opuslink_users', JSON.stringify(users));
            console.log('✅ Created missing employer record in storage');
        }
    } catch (error) {
        console.error('Error creating user record:', error);
    }
}


static updateVerificationUI() {
    try {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        const isVerified = currentUser.isVerified === true;
        
        console.log('🔄 Updating verification UI - Verified:', isVerified);
        
        // Update verification badges
        const verificationBadges = document.querySelectorAll('.verification-status, .verification-badge');
        verificationBadges.forEach(badge => {
            if (isVerified) {
                badge.innerHTML = '<span class="status status-approved">✅ Verified</span>';
                badge.className = 'verification-status verified';
            } else {
                badge.innerHTML = '<span class="status status-pending">⏳ Pending Verification</span>';
                badge.className = 'verification-status pending';
            }
        });
        
        // Update post job button
        const postJobBtn = document.getElementById('openPostJob');
        if (postJobBtn) {
            if (isVerified) {
                postJobBtn.disabled = false;
                postJobBtn.title = 'Post a new job';
                postJobBtn.classList.remove('disabled');
            } else {
                postJobBtn.disabled = true;
                postJobBtn.title = 'Complete verification to post jobs';
                postJobBtn.classList.add('disabled');
            }
        }
        
        // Show/hide verification warning
        if (!isVerified) {
            this.showVerificationWarning();
        } else {
            this.hideVerificationWarning();
        }
        
        console.log('✅ Verification UI updated');
        
    } catch (error) {
        console.error('Error updating verification UI:', error);
    }
}
    static setupRealTimeUpdates() {
        // Check for verification updates every 3 seconds
        setInterval(() => {
            this.checkVerificationStatus();
        }, 3000);
        
        // Listen for storage changes
        window.addEventListener('storage', (e) => {
            if (e.key === 'opuslink_users') {
                this.checkVerificationStatus();
            }
        });
    }
// Add this method to your WorkerDashboard class

static hideVerificationWarning() {
    const warningBanner = document.querySelector('.verification-warning');
    if (warningBanner) {
        warningBanner.remove();
    }
}

    static showVerificationWarning() {
        // Add warning banner to overview
        const overview = document.getElementById('overview');
        if (overview && !overview.querySelector('.verification-warning')) {
            const warningBanner = document.createElement('div');
            warningBanner.className = 'verification-warning';
            warningBanner.innerHTML = `
                <div style="background: linear-gradient(135deg, rgba(234, 179, 8, 0.1), rgba(234, 179, 8, 0.05)); border: 1px solid rgba(234, 179, 8, 0.3); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <div style="font-size: 1.5rem;">⚠️</div>
                        <div style="flex: 1;">
                            <h4 style="color: #eab308; margin: 0 0 4px 0;">Account Verification Required</h4>
                            <p style="color: var(--muted); margin: 0; font-size: 0.9rem;">
                                Complete your profile and upload verification documents to post jobs. 
                                <a href="#" onclick="EmployerDashboard.navigateToSection('profile')" style="color: var(--accent); text-decoration: underline;">Complete verification now</a>
                            </p>
                        </div>
                    </div>
                </div>
            `;
            overview.insertBefore(warningBanner, overview.firstChild);
        }
    }

    static showVerificationModal(action) {
        const modal = document.getElementById('applicationModal');
        const modalContent = document.getElementById('applicationModalContent');
        
        const verification = ProfileManager.getVerificationStatus(JSON.parse(sessionStorage.getItem('currentUser')).id);

        modalContent.innerHTML = `
            <div>
                <div class="modal-header">
                    <h3>Verification Required</h3>
                    <button class="modal-close" onclick="EmployerDashboard.closeModal()">&times;</button>
                </div>
                
                <div style="margin: 20px 0; text-align: center;">
                    <div style="font-size: 4rem; margin-bottom: 16px;">🔒</div>
                    <h4 style="color: #fff; margin-bottom: 12px;">Account Verification Required</h4>
                    <p style="color: var(--muted); margin-bottom: 20px; line-height: 1.5;">
                        You need to complete your profile verification before you can ${action}.
                    </p>
                    
                    <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                        <h5 style="color: #fff; margin-bottom: 12px;">Verification Status</h5>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; text-align: left;">
                            <div>
                                <strong>Profile Completion:</strong><br>
                                <span style="color: ${verification.profileCompletion >= 70 ? '#22c55e' : '#eab308'};">${verification.profileCompletion}%</span>
                            </div>
                            <div>
                                <strong>Verification:</strong><br>
                                <span style="color: ${verification.isVerified ? '#22c55e' : '#eab308'};">${verification.isVerified ? 'Approved' : 'Pending'}</span>
                            </div>
                        </div>
                    </div>

                    ${!verification.isVerified ? `
                        <div style="background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                            <p style="color: #eab308; margin: 0; font-size: 0.9rem;">
                                <strong>Next Steps:</strong> Complete your profile to 70% and upload verification documents. 
                                Our admin team will review your account within 24-48 hours.
                            </p>
                        </div>
                    ` : ''}
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="EmployerDashboard.navigateToSection('profile'); EmployerDashboard.closeModal();">
                        Complete Verification
                    </button>
                    <button class="btn btn-ghost" onclick="EmployerDashboard.closeModal()">
                        Maybe Later
                    </button>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }




    // Navigation System
    static setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (link.classList.contains('logout-btn')) {
                    this.logout();
                    return;
                }
                
                const section = link.getAttribute('data-section');
                if (section) {
                    this.navigateToSection(section);
                }
            });
        });
         document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            if (link.classList.contains('logout-btn')) {
                this.logout();
                return;
            }
            
            const section = link.getAttribute('data-section');
            if (section) {
                this.navigateToSection(section);
                
                // Load payment methods when navigating to that section
                if (section === 'payment-methods') {
                    this.loadPaymentMethods();
                    this.loadPaymentStats();
                }
            }
        });
    });

        // Post Job button
        const openPostJob = document.getElementById('openPostJob');
        if (openPostJob) {
            openPostJob.addEventListener('click', () => {
                this.navigateToSection('post-job');
            });
        }
        this.setupNotificationClick();
    }
     static initializeProfilePicture() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.updateProfilePicture(currentUser);
    }

    static loadPaymentStats() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const agreements = this.getAllAgreements();
    const employerAgreements = agreements.filter(a => a.employerId === currentUser.id);
    
    let totalPaid = 0;
    let workersPaid = new Set();
    let thisMonthTotal = 0;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    employerAgreements.forEach(agreement => {
        if (agreement.payments) {
            agreement.payments.forEach(payment => {
                totalPaid += payment.amount;
                workersPaid.add(payment.workerId);
                
                const paymentDate = new Date(payment.processedAt || payment.createdAt);
                if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
                    thisMonthTotal += payment.amount;
                }
            });
        }
    });
    
    // Update UI
    const totalPaidElement = document.getElementById('totalPaid');
    const workersPaidElement = document.getElementById('workersPaid');
    const thisMonthElement = document.getElementById('thisMonth');
    
    if (totalPaidElement) totalPaidElement.textContent = `₹${totalPaid.toLocaleString()}`;
    if (workersPaidElement) workersPaidElement.textContent = workersPaid.size;
    if (thisMonthElement) thisMonthElement.textContent = `₹${thisMonthTotal.toLocaleString()}`;
}

// Add these helper methods
static setDefaultPaymentMethod(paymentMethodId) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const paymentMethods = JSON.parse(localStorage.getItem(`employer_payment_methods_${currentUser.id}`) || '[]');
    
    paymentMethods.forEach(pm => {
        pm.isDefault = pm.id === paymentMethodId;
    });
    
    localStorage.setItem(`employer_payment_methods_${currentUser.id}`, JSON.stringify(paymentMethods));
    OpusUtils.showNotification('Default payment method updated!', 'success');
    this.loadPaymentMethods();
}

static deletePaymentMethod(paymentMethodId) {
    if (!confirm('Are you sure you want to delete this payment method?')) {
        return;
    }
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const paymentMethods = JSON.parse(localStorage.getItem(`employer_payment_methods_${currentUser.id}`) || '[]');
    const updatedMethods = paymentMethods.filter(pm => pm.id !== paymentMethodId);
    
    localStorage.setItem(`employer_payment_methods_${currentUser.id}`, JSON.stringify(updatedMethods));
    OpusUtils.showNotification('Payment method deleted!', 'success');
    this.loadPaymentMethods();
}
    // Add these methods to EmployerDashboard class

static loadProfileTips() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const tips = ProfileManager.getProfileStrengthTips(currentUser);
    const tipsList = document.getElementById('profileTipsList');
    
    if (tipsList) {
        tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
    }
}

static loadDocuments() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const documents = ProfileManager.getDocuments(currentUser.id);
    const documentsList = document.getElementById('documentsList');
    const uploadArea = document.getElementById('documentUploadArea');
    
    if (documents.length > 0) {
        if (uploadArea) uploadArea.style.display = 'none';
        if (documentsList) {
            documentsList.innerHTML = documents.map(doc => `
                <div class="document-item">
                    <div class="document-info">
                        <div class="document-icon">📄</div>
                        <div>
                            <div class="document-name">${doc.name}</div>
                            <div class="document-meta">
                                ${doc.type} • Uploaded ${new Date(doc.uploadedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                    <div class="document-status">
                        <span class="status status-${doc.status}">${doc.status}</span>
                        <button class="btn btn-ghost btn-sm" onclick="EmployerDashboard.deleteDocument('${doc.id}')">
                            Delete
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } else {
        if (uploadArea) uploadArea.style.display = 'block';
        if (documentsList) documentsList.innerHTML = '';
    }
}

static deleteDocument(docId) {
    if (confirm('Are you sure you want to delete this document?')) {
        ProfileManager.deleteDocument(docId);
        this.loadDocuments();
        OpusUtils.showNotification('Document deleted successfully', 'success');
    }
}


static loadProfilePictureSection() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    this.updateProfilePicture(currentUser);
    
    // Update last updated text
    const lastUpdated = document.getElementById('profilePictureLastUpdated');
    if (lastUpdated && currentUser?.profilePictureUpdated) {
        lastUpdated.textContent = `Last updated: ${new Date(currentUser.profilePictureUpdated).toLocaleDateString()}`;
    } else if (lastUpdated) {
        lastUpdated.textContent = 'No profile picture uploaded';
    }
}

static initializeProfileSystem() {
    console.log('👤 Profile system initialized for employer');
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    ProfileManager.updateProfileCompletion(currentUser.id);
    this.loadProfileTips();
    this.loadDocuments();
    
    // Setup profile form event listeners
    const profileForm = document.getElementById('profileForm');
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateProfile();
        });
    }
}


    static updateProfilePicture(user) {
        // Update header avatar
        const employerAvatar = document.getElementById('employerAvatar');
        if (employerAvatar) {
            if (user?.profilePicture) {
                employerAvatar.innerHTML = `<img src="${user.profilePicture}" alt="${user.companyName || user.fullName}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            } else {
                employerAvatar.textContent = (user.companyName || user.fullName).charAt(0).toUpperCase();
            }
        }

        // Update profile preview
        const profilePreview = document.getElementById('profilePicturePreview');
        if (profilePreview) {
            if (user?.profilePicture) {
                profilePreview.innerHTML = `<img src="${user.profilePicture}" alt="Profile Preview" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            } else {
                profilePreview.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--accent); color: white; border-radius: 50%; font-size: 2rem; font-weight: bold;">${(user.companyName || user.fullName).charAt(0).toUpperCase()}</div>`;
            }
        }
    }

    static navigateToSection(sectionId) {
        console.log('🔄 Navigating to:', sectionId);
        
        // Hide all sections
        document.querySelectorAll('.dashboard-section').forEach(s => {
            s.classList.remove('active');
        });
        
        // Remove active class from all nav links
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        // Show target section
        const targetSection = document.getElementById(sectionId);
        const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
        
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Load section-specific data
            switch(sectionId) {
                case 'overview':
                    this.loadOverview();
                    break;
                case 'applications':
                    this.loadApplications();
                    break;
                case 'active-agreements':
                    this.loadActiveAgreements();
                    break;
                case 'pending-work':
                    this.loadPendingWork();
                    break;
                case 'payment-history':
                    this.loadPaymentHistory();
                    break;
                case 'browse-workers':
                    this.loadBrowseWorkers();
                    break;
                case 'manage-jobs':
                    this.loadManageJobs();
                    break;
                case 'post-job':
                    // Reset form when navigating to post job
                    const postJobForm = document.getElementById('postJobForm');
                    if (postJobForm) postJobForm.reset();
                    break;
                case 'profile':
                    this.loadProfileSection();
                    break;
                case 'feedback':
                FeedbackSystem.init();
                    break;
            }
        }
        
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }

    // Event Listeners
    static setupEventListeners() {
        // Post Job Form
    const postJobForm = document.getElementById('postJobForm') || 
                       document.getElementById('jobPostForm') ||
                       document.querySelector('form[onsubmit*="postJob"]');
    
    if (postJobForm) {
        console.log('✅ Found post job form, setting up listener');
        postJobForm.removeEventListener('submit', this.boundHandleSubmit);
        this.boundHandleSubmit = this.handlePostJobSubmit.bind(this);
        postJobForm.addEventListener('submit', this.boundHandleSubmit);
    } else {
        console.log('ℹ️ Post job form not found (might not be on current page)');
    }

        // Cancel Post button
        const cancelPost = document.getElementById('cancelPost');
        if (cancelPost) {
            cancelPost.addEventListener('click', () => {
                this.navigateToSection('overview');
            });
        }

        // Profile Form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }
        const profilePictureUpload = document.getElementById('profilePictureUpload');
        if (profilePictureUpload) {
            profilePictureUpload.addEventListener('change', (e) => {
                this.handleProfilePictureUpload(e);
            });
        }

        // Remove profile picture
        const removeProfilePicture = document.getElementById('removeProfilePicture');
        if (removeProfilePicture) {
            removeProfilePicture.addEventListener('click', () => {
                this.removeProfilePicture();
            });
        }

        // Modal close
        document.querySelectorAll('.modal-close').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        });

        // View toggle buttons
        document.querySelectorAll('.view-toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const viewType = btn.getAttribute('data-view');
                this.setView(viewType);
            });
        });

        // Search and filter handlers
        const workerSearch = document.getElementById('workerSearch');
        if (workerSearch) {
            workerSearch.addEventListener('input', OpusUtils.debounce(() => this.searchWorkers(), 300));
        }

        const searchButton = document.getElementById('searchWorkers');
        if (searchButton) {
            searchButton.addEventListener('click', () => this.searchWorkers());
        }

        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) {
            clearFilters.addEventListener('click', () => this.clearFilters());
        }

        // Handle select dropdown styling
        document.querySelectorAll('select').forEach(select => {
            select.addEventListener('change', function() {
                this.style.color = this.value ? '#fff' : 'var(--muted)';
            });
            
            // Initialize on load
            if (select.value) {
                select.style.color = '#fff';
            }
        });

        // Document upload
        const documentUpload = document.getElementById('documentUpload');
        if (documentUpload) {
            documentUpload.addEventListener('change', (e) => {
                this.handleDocumentUpload(e);
            });
        }
         document.addEventListener('click', (e) => {
    const target = e.target;
    
    // Handle view details buttons
    if (target.classList.contains('view-details-btn') || target.closest('.view-details-btn')) {
        const button = target.classList.contains('view-details-btn') ? target : target.closest('.view-details-btn');
        const offerId = button.getAttribute('data-offer-id');
        if (offerId) {
            e.preventDefault();
            e.stopPropagation();
            EmployerDashboard.viewJobOfferDetails(offerId); // Use the class name directly
        }
    }
});
    }
      static  handleDocumentUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            const result = ProfileManager.uploadDocument(currentUser.id, file);
            
            if (result.success) {
                OpusUtils.showNotification('Document uploaded successfully!', 'success');
                this.loadDocuments();
            } else {
                OpusUtils.showNotification(result.message, 'error');
            }
            
            // Reset file input
            e.target.value = '';
        }
    }

    // ADD THIS METHOD: Single submission handler for job posting
static handlePostJobSubmit(e) {
    e.preventDefault();
    console.log('📝 Form submission intercepted');
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // Prevent multiple submissions
    if (submitBtn.disabled) {
        console.log('⚠️ Form already submitting...');
        return;
    }
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Posting Job...';
    
    // Use setTimeout to ensure the UI updates before processing
    setTimeout(() => {
        try {
            this.processJobSubmission();
        } catch (error) {
            console.error('❌ Error in form submission:', error);
            OpusUtils.showNotification('Error posting job', 'error');
            
            // Re-enable button on error
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Job';
        }
    }, 100);
}

static processJobSubmission() {
    console.log('🔄 Processing job submission...');
    
    // Get form fields
    const jobTitle = document.getElementById('jobTitle')?.value?.trim() || '';
    const jobCategory = document.getElementById('jobCategory')?.value || '';
    const jobType = document.getElementById('jobType')?.value || '';
    const jobSalary = document.getElementById('jobSalary')?.value || '';
    const jobLocation = document.getElementById('jobLocation')?.value?.trim() || '';
    const jobDescription = document.getElementById('jobDescription')?.value?.trim() || '';
    const jobRequirements = document.getElementById('jobRequirements')?.value?.trim() || '';
    const jobSkills = document.getElementById('jobSkills')?.value?.trim() || '';

    console.log('🔍 Form values captured:', {
        jobTitle, jobCategory, jobType, jobSalary, jobLocation, jobDescription
    });

    // Validate required fields
    if (!jobTitle || !jobDescription || !jobCategory || !jobType || !jobLocation) {
        console.log('❌ Validation failed');
        OpusUtils.showNotification('Please fill in all required fields', 'error');
        
        // Re-enable submit button
        const submitBtn = document.querySelector('#postJobForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Job';
        }
        return;
    }

    console.log('✅ Validation passed');

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        console.error('❌ No user logged in');
        OpusUtils.showNotification('Please log in to post jobs', 'error');
        return;
    }

    // Create job data
    const jobId = 'job_' + Date.now();
    const formattedSalary = jobSalary ? `₹${parseInt(jobSalary).toLocaleString()}/month` : 'Negotiable';
    
    const jobData = {
        id: jobId,
        title: jobTitle,
        category: jobCategory,
        type: jobType,
        salary: formattedSalary,
        location: jobLocation,
        description: jobDescription,
        requirements: jobRequirements ? jobRequirements.split('\n').filter(req => req.trim()) : [],
        skills: jobSkills ? jobSkills.split(',').map(skill => skill.trim()).filter(skill => skill) : [],
        datePosted: new Date().toISOString(),
        status: 'active',
        employerId: currentUser.id,
        employerName: currentUser.companyName || currentUser.fullName,
        applications: [],
        views: 0,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    console.log('💼 Job data created:', jobData);

    // Save job
    try {
        const opuslinkJobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
        opuslinkJobs.push(jobData);
        localStorage.setItem('opuslink_jobs', JSON.stringify(opuslinkJobs));
        
        console.log('✅ Job saved to localStorage');

        // Show success message
        OpusUtils.showNotification('✅ Job posted successfully!', 'success');

        // Reset form
        const form = document.getElementById('postJobForm');
        if (form) {
            form.reset();
            console.log('✅ Form reset');
        }

        // Navigate to overview after a short delay
        setTimeout(() => {
            this.navigateToSection('overview');
            this.loadManageJobs();
            this.loadOverview();
        }, 1000);

    } catch (error) {
        console.error('❌ Error saving job:', error);
        OpusUtils.showNotification('Failed to save job', 'error');
        
        // Re-enable submit button on error
        const submitBtn = document.querySelector('#postJobForm button[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Post Job';
        }
    }
}

    static handleProfilePictureUpload(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            OpusUtils.showNotification('Please select a valid image file (JPEG, PNG, GIF)', 'error');
            return;
        }

        // Validate file size (max 2MB)
        if (file.size > 2 * 1024 * 1024) {
            OpusUtils.showNotification('Image size should be less than 2MB', 'error');
            return;
        }

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        ProfileManager.uploadProfilePicture(currentUser.id, file)
            .then(result => {
                if (result.success) {
                    OpusUtils.showNotification(result.message, 'success');
                    this.updateProfilePicture(JSON.parse(sessionStorage.getItem('currentUser')));
                } else {
                    OpusUtils.showNotification(result.message, 'error');
                }
            })
            .catch(error => {
                OpusUtils.showNotification(error.message, 'error');
            })
            .finally(() => {
                // Reset file input
                e.target.value = '';
            });
    }
     static removeProfilePicture() {
        if (!confirm('Are you sure you want to remove your profile picture?')) {
            return;
        }

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const result = ProfileManager.removeProfilePicture(currentUser.id);
        
        if (result.success) {
            OpusUtils.showNotification(result.message, 'success');
            this.updateProfilePicture(JSON.parse(sessionStorage.getItem('currentUser')));
        } else {
            OpusUtils.showNotification(result.message, 'error');
        }
    }

    static loadProfileSection() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Refresh completion score
    if (currentUser) {
        const completion = ProfileManager.updateProfileCompletion(currentUser.id);
        this.updateProfileCompletionUI(completion);
    }
    
    this.loadProfileTips();
    this.loadDocuments();
    this.loadProfilePictureSection();
}

    static loadProfilePictureSection() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        this.updateProfilePicture(currentUser);
        
        // Update last updated text
        const lastUpdated = document.getElementById('profilePictureLastUpdated');
        if (lastUpdated && currentUser?.profilePictureUpdated) {
            lastUpdated.textContent = `Last updated: ${new Date(currentUser.profilePictureUpdated).toLocaleDateString()}`;
        } else if (lastUpdated) {
            lastUpdated.textContent = 'No profile picture uploaded';
        }
    }

    // Data Management - Dual Source Support
// FIXED Job Loading Methods
static getAllJobs() {
    // Use only opuslink_jobs to avoid duplicates
    const opuslinkJobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
    
    // Remove any potential duplicates by ID
    const uniqueJobs = [];
    const seenIds = new Set();
    
    opuslinkJobs.forEach(job => {
        if (!seenIds.has(job.id)) {
            seenIds.add(job.id);
            uniqueJobs.push(job);
        }
    });
    
    console.log(`📊 Loaded ${uniqueJobs.length} unique jobs from storage`);
    return uniqueJobs;
}

static getEmployerJobs(employerId) {
    const allJobs = this.getAllJobs();
    const employerJobs = allJobs.filter(job => job.employerId === employerId);
    console.log(`📋 Found ${employerJobs.length} jobs for employer ${employerId}`);
    return employerJobs;
}

    static getEmployerJobs(employerId) {
        const allJobs = this.getAllJobs();
        const employerJobs = allJobs.filter(job => job.employerId === employerId);
        return employerJobs;
    }

    static saveJob(jobData) {
        // Save to both locations for compatibility
        const opuslinkJobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
        const generatedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        
        // Add to opuslink_jobs
        const opuslinkIndex = opuslinkJobs.findIndex(job => job.id === jobData.id);
        if (opuslinkIndex !== -1) {
            opuslinkJobs[opuslinkIndex] = jobData;
        } else {
            opuslinkJobs.push(jobData);
        }
        localStorage.setItem('opuslink_jobs', JSON.stringify(opuslinkJobs));
        
        // Also add to generated jobs for compatibility
        const generatedIndex = generatedJobs.findIndex(job => job.id === jobData.id);
        if (generatedIndex !== -1) {
            generatedJobs[generatedIndex] = jobData;
        } else {
            generatedJobs.push(jobData);
        }
        localStorage.setItem('jobs', JSON.stringify(generatedJobs));
    }

    static deleteJob(jobId) {
        // Delete from both locations
        const opuslinkJobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
        const generatedJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        
        const updatedOpuslinkJobs = opuslinkJobs.filter(job => job.id !== jobId);
        const updatedGeneratedJobs = generatedJobs.filter(job => job.id !== jobId);
        
        localStorage.setItem('opuslink_jobs', JSON.stringify(updatedOpuslinkJobs));
        localStorage.setItem('jobs', JSON.stringify(updatedGeneratedJobs));
    }

    static getAllApplications() {
    const applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
    console.log('📋 getAllApplications - Found:', applications.length, 'applications');
    applications.forEach(app => {
        console.log(`   - ${app.id}: ${app.status} - ${app.workerName} for ${app.jobTitle}`);
    });
    return applications;
}

    static getAllAgreements() {
        return JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    }

    static getAllUsers() {
        return JSON.parse(localStorage.getItem('opuslink_users') || '[]');
    }

static getAllWorkers() {
    console.log('🔍 Loading all workers...');
    
    // Try multiple data sources
    const opuslinkUsers = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
    const opuslinkWorkers = JSON.parse(localStorage.getItem('opuslink_workers') || '[]');
    const jobSeekers = JSON.parse(localStorage.getItem('jobSeekers') || '[]');
    
    // Combine all sources
    const allWorkers = [
        ...opuslinkUsers.filter(user => user.role === 'worker'),
        ...opuslinkWorkers,
        ...jobSeekers
    ];
    
    console.log('📊 Raw workers found:', allWorkers.length);
    
    // Remove duplicates by ID and map data
    const uniqueWorkers = [];
    const seenIds = new Set();
    
    allWorkers.forEach(worker => {
        if (!seenIds.has(worker.id)) {
            seenIds.add(worker.id);
            const mappedWorker = this.mapWorkerData(worker);
            if (mappedWorker) { // Only add valid mapped workers
                uniqueWorkers.push(mappedWorker);
            }
        }
    });
    
    console.log('✅ Valid unique workers:', uniqueWorkers.length);
    
    // Show worker names for debugging
    console.log('👥 Worker names:', uniqueWorkers.map(w => w.fullName));
    
    return uniqueWorkers;
}
static viewJobOfferDetails(offerId) {
    console.log('ℹ️ Employer viewing job offer details:', offerId);
    
    const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
    const jobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
    const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
    
    const offer = jobOffers.find(o => o.id === offerId);
    if (!offer) {
        OpusUtils.showNotification('Job offer not found', 'error');
        return;
    }

    const job = jobs.find(j => j.id === offer.jobId);
    const worker = users.find(u => u.id === offer.workerId);

    const modalContent = `
        <div style="max-width: 600px;">
            <h3>Job Offer Details</h3>
            
            <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <h4 style="color: #fff; margin-bottom: 8px;">${offer.jobTitle || 'Position'}</h4>
                <p style="color: var(--accent); font-weight: 600; margin: 0 0 8px 0;">
                    From: ${offer.employerName || 'Employer'}
                </p>
                <p style="color: var(--accent); font-weight: 600; margin: 0 0 12px 0;">
                    Offered to: ${worker?.fullName || 'Worker'}
                </p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <div>
                        <strong>Location:</strong><br>
                        <span style="color: var(--muted);">${offer.jobLocation || 'Not specified'}</span>
                    </div>
                    <div>
                        <strong>Type:</strong><br>
                        <span style="color: var(--muted);">${this.formatJobType(offer.jobType || 'contract')}</span>
                    </div>
                    <div>
                        <strong>Salary:</strong><br>
                        <span style="color: var(--muted);">${offer.jobSalary || 'Not specified'}</span>
                    </div>
                    <div>
                        <strong>Status:</strong><br>
                        <span style="color: ${offer.status === 'pending' ? '#f59e0b' : offer.status === 'accepted' ? '#22c55e' : '#ef4444'};">${offer.status}</span>
                    </div>
                </div>
                
                <div>
                    <strong>Offer Date:</strong><br>
                    <span style="color: var(--muted);">${new Date(offer.offerDate).toLocaleString()}</span>
                </div>
                <div>
                    <strong>Expires:</strong><br>
                    <span style="color: #f59e0b;">${new Date(offer.expiresAt).toLocaleString()}</span>
                </div>
            </div>
            
            <div style="margin-bottom: 16px;">
                <strong>Job Description:</strong>
                <div style="color: var(--muted); margin-top: 8px; line-height: 1.5;">
                    ${job?.description || offer.jobDescription || 'No description provided.'}
                </div>
            </div>
            
            <div style="margin-bottom: 16px;">
                <strong>Offer Message:</strong>
                <div style="color: var(--muted); margin-top: 8px; line-height: 1.5;">
                    ${offer.message || 'No additional message.'}
                </div>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-ghost" onclick="OpusUtils.closeModal()">Close</button>
                ${offer.status === 'pending' ? `
                    <button class="btn btn-danger" onclick="EmployerDashboard.withdrawJobOffer('${offer.id}')">
                        Withdraw Offer
                    </button>
                ` : ''}
            </div>
        </div>
    `;
    
    OpusUtils.showModal('Job Offer Details', modalContent);
}

static formatJobType(type) {
    const types = {
        'fulltime': 'Full-Time',
        'parttime': 'Part-Time', 
        'contract': 'Contract',
        'freelance': 'Freelance',
        'remote': 'Remote'
    };
    return types[type] || type;
}

    // User Data & Profile
    static loadUserData() {
        const user = JSON.parse(sessionStorage.getItem('currentUser'));
        if (user) {
            // Update header info
            const employerName = document.getElementById('employerName');
            const employerEmail = document.getElementById('employerEmail');
            const employerAvatar = document.getElementById('employerAvatar');
            
            if (employerName) employerName.textContent = user.companyName || user.fullName;
            if (employerEmail) employerEmail.textContent = user.email;
            if (employerAvatar) employerAvatar.textContent = (user.companyName || user.fullName).charAt(0);
            
            // Load profile form data
            const profileFields = {
                'profileCompanyName': 'companyName',
                'profileIndustry': 'industry', 
                'profileCompanySize': 'companySize',
                'profileCompanyCategory': 'companyCategory',
                'profileLocation': 'location',
                'profileWebsite': 'website',
                'profileDescription': 'description'
            };
            
            Object.entries(profileFields).forEach(([fieldId, userField]) => {
                const element = document.getElementById(fieldId);
                if (element && user[userField]) {
                    element.value = user[userField];
                }
            });
        }
    }


    // Overview Section
    static loadOverview() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) return;

        const jobs = this.getEmployerJobs(currentUser.id);
        const applications = this.getAllApplications().filter(app => 
            jobs.some(job => job.id === app.jobId)
        );

        // Update stats
        const statJobs = document.getElementById('statJobs');
        const statApps = document.getElementById('statApps');
        const statHired = document.getElementById('statHired');
        
        if (statJobs) statJobs.textContent = jobs.length;
        if (statApps) statApps.textContent = applications.length;
        if (statHired) statHired.textContent = applications.filter(app => app.status === 'accepted').length;

        // Load recent applications
        const recentApplications = applications
            .sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate))
            .slice(0, 5);
        this.displayRecentApplications(recentApplications);

        // Load active jobs
        this.displayActiveJobs(jobs.slice(0, 3));

        // Add wallet to overview
        this.addWalletToOverview();
    }

    static displayRecentApplications(applications) {
        const container = document.getElementById('recentApplications');
        if (!container) return;

        if (applications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📥</div>
                    <h3>No applications yet</h3>
                    <p>Applications will appear here when job seekers apply to your jobs</p>
                </div>
            `;
            return;
        }

        container.innerHTML = applications.map(app => {
            const statusClass = this.getApplicationStatusClass(app.status);
            const statusText = this.getApplicationStatusText(app.status);
            
            return `
                <div class="application-item">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <div style="font-weight: 600; color: #fff;">${app.workerName}</div>
                            <div style="color: var(--muted); font-size: 0.9rem;">${app.jobTitle}</div>
                        </div>
                        <span class="status ${statusClass}">${statusText}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    static displayActiveJobs(jobs) {
        const container = document.getElementById('activeJobs');
        if (!container) return;

        if (jobs.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💼</div>
                    <h3>No active jobs</h3>
                    <p>Post your first job to start receiving applications</p>
                    <div style="margin-top: 16px;">
                        <button class="btn btn-primary" onclick="EmployerDashboard.navigateToSection('post-job')">
                            Post a Job
                        </button>
                    </div>
                </div>
            `;
            return;
        }

        const applications = this.getAllApplications();
        
        container.innerHTML = jobs.map(job => {
            const jobApplications = applications.filter(app => app.jobId === job.id);
            
            let statusBadge = '';
            if (job.status === 'filled') {
                statusBadge = '<span class="status status-completed">Filled</span>';
            } else if (job.status === 'closed') {
                statusBadge = '<span class="status status-rejected">Closed</span>';
            } else {
                statusBadge = `<span class="status status-approved">${jobApplications.length} applications</span>`;
            }
            
            return `
                <div class="job">
                    <div class="left">
                        ${statusBadge}
                        <div>
                            <div style="font-weight:700;">${job.title}</div>
                            <div class="meta">${job.location} • ${this.formatType(job.type)} • ${job.salary}</div>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="btn btn-primary" onclick="EmployerDashboard.viewJob('${job.id}')">View</button>
                        ${job.status === 'active' ? `
                            <button class="btn btn-ghost" onclick="EmployerDashboard.closeJob('${job.id}')">Close</button>
                        ` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }

    static addWalletToOverview() {
        const overviewContainer = document.getElementById('overview');
        if (!overviewContainer) return;
        
        let walletSection = overviewContainer.querySelector('.wallet-quick-access');
        if (!walletSection) {
            walletSection = document.createElement('div');
            walletSection.className = 'wallet-quick-access';
            walletSection.style.marginTop = '20px';
            overviewContainer.appendChild(walletSection);
        }
        
        const walletSummary = WalletManager.getWalletSummary();
        if (walletSummary) {
            walletSection.innerHTML = `
                <div class="card" style="background: linear-gradient(135deg, rgba(250,204,21,0.1), rgba(250,204,21,0.05)); border: 1px solid rgba(250,204,21,0.2);">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <div>
                            <h3 style="color: #fff; margin-bottom: 8px;">💰 Wallet Balance</h3>
                            <div style="color: var(--muted); font-size: 0.9rem;">
                                Available: <strong style="color: var(--accent);">₹${walletSummary.available}</strong> • 
                                Escrow: <strong style="color: #f59e0b;">₹${walletSummary.escrow}</strong>
                            </div>
                        </div>
                        <button class="btn btn-primary" onclick="EmployerDashboard.showWallet()">
                            Manage Wallet
                        </button>
                    </div>
                </div>
            `;
        }
    }

    // Job Management
// IN EmployerDashboard CLASS - UPDATE THE postJob METHOD:
static postJob() {
    console.log('📝 Starting job posting process...');
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Check verification status
    if (!currentUser || !currentUser.isVerified) {
        this.showVerificationModal('post jobs');
        return;
    }
    
    // Get form fields directly (FIXED - using direct DOM access)
    const jobTitle = document.getElementById('jobTitle')?.value?.trim() || '';
    const jobCategory = document.getElementById('jobCategory')?.value || '';
    const jobType = document.getElementById('jobType')?.value || '';
    const jobSalary = document.getElementById('jobSalary')?.value?.trim() || '';
    const jobLocation = document.getElementById('jobLocation')?.value?.trim() || '';
    const jobDescription = document.getElementById('jobDescription')?.value?.trim() || '';
    const jobRequirements = document.getElementById('jobRequirements')?.value?.trim() || '';
    const jobSkills = document.getElementById('jobSkills')?.value?.trim() || '';

    // DEBUG: Log all field values
    console.log('🔍 Field Values (Direct Access):', {
        jobTitle,
        jobCategory,
        jobType,
        jobSalary,
        jobLocation,
        jobDescription,
        jobRequirements,
        jobSkills
    });

    // Create job data with unique ID
    const jobId = 'job_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    const jobData = {
        id: jobId,
        title: jobTitle,
        category: jobCategory,
        type: jobType,
        salary: jobSalary,
        location: jobLocation,
        description: jobDescription,
        requirements: jobRequirements,
        skills: jobSkills,
        datePosted: new Date().toISOString(),
        status: 'active',
        employerId: currentUser.id,
        employerName: currentUser.companyName || currentUser.fullName,
        applications: [],
        views: 0,
        expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    // Validate required fields with detailed logging
    const validationErrors = [];
    
    if (!jobData.title) {
        validationErrors.push('Job Title is required');
        console.log('❌ Validation failed: Job Title missing');
    }
    
    if (!jobData.description) {
        validationErrors.push('Job Description is required');
        console.log('❌ Validation failed: Job Description missing');
    }
    
    if (!jobData.category) {
        validationErrors.push('Job Category is required');
        console.log('❌ Validation failed: Job Category missing');
    }
    
    if (!jobData.type) {
        validationErrors.push('Job Type is required');
        console.log('❌ Validation failed: Job Type missing');
    }

    if (validationErrors.length > 0) {
        console.log('❌ Validation errors:', validationErrors);
        OpusUtils.showNotification('Please fill in all required fields', 'error');
        return;
    }

    console.log('✅ Job data validated, saving job...', jobData);

    // Save job (single instance)
    const result = this.saveJob(jobData);

    if (result) {
        OpusUtils.showNotification('✅ Job posted successfully!', 'success');
        
        // Reset form
        const form = document.getElementById('postJobForm');
        if (form) form.reset();
        
        // Navigate to overview
        this.navigateToSection('overview');
        
        // Refresh job listings
        this.loadManageJobs();
        this.loadOverview();
    }
}

    static loadManageJobs() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const jobs = this.getEmployerJobs(currentUser.id);
        const tableBody = document.getElementById('jobsTableBody');
        
        if (!tableBody) return;

        if (jobs.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">💼</div>
                            <h3>No jobs posted</h3>
                            <p>Post your first job to get started</p>
                            <div style="margin-top: 16px;">
                                <button class="btn btn-primary" onclick="EmployerDashboard.navigateToSection('post-job')">
                                    Post Your First Job
                                </button>
                            </div>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        const applications = this.getAllApplications();

        tableBody.innerHTML = jobs.map(job => {
            const jobApplications = applications.filter(app => app.jobId === job.id);
            const statusBadge = this.getJobStatusBadge(job.status);
            
            return `
                <tr>
                    <td style="color: #fff; font-weight: 600;">${job.title}</td>
                    <td>${this.formatCategory(job.category)}</td>
                    <td>${this.formatType(job.type)}</td>
                    <td>${job.location}</td>
                    <td style="text-align: center;">${jobApplications.length}</td>
                    <td><span class="${statusBadge.class}">${statusBadge.text}</span></td>
                    <td>
                        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                            <button class="btn btn-ghost btn-sm" onclick="EmployerDashboard.viewJob('${job.id}')">
                                View
                            </button>
                            ${job.status === 'active' ? `
                                <button class="btn btn-success btn-sm" onclick="EmployerDashboard.closeJob('${job.id}')">
                                    Close Job
                                </button>
                                <button class="btn btn-primary btn-sm" onclick="EmployerDashboard.editJob('${job.id}')">
                                    Edit
                                </button>
                            ` : ''}
                            ${job.status === 'closed' ? `
                                <button class="btn btn-ghost btn-sm" onclick="EmployerDashboard.reopenJob('${job.id}')">
                                    Reopen
                                </button>
                            ` : ''}
                            <button class="btn btn-danger btn-sm" onclick="EmployerDashboard.safeDeleteJob('${job.id}')">
                                Delete
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    static viewJob(jobId) {
        const allJobs = this.getAllJobs();
        const job = allJobs.find(j => j.id === jobId);
        
        if (job) {
            const modal = document.getElementById('applicationModal');
            const modalContent = document.getElementById('applicationModalContent');
            
            modalContent.innerHTML = `
                <div>
                    <div class="modal-header">
                        <h3>${job.title}</h3>
                        <button class="modal-close" onclick="EmployerDashboard.closeModal()">&times;</button>
                    </div>
                    <div style="margin: 20px 0;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                            <div>
                                <strong>Category:</strong><br>
                                <span style="color: var(--muted);">${this.formatCategory(job.category)}</span>
                            </div>
                            <div>
                                <strong>Type:</strong><br>
                                <span style="color: var(--muted);">${this.formatType(job.type)}</span>
                            </div>
                            <div>
                                <strong>Location:</strong><br>
                                <span style="color: var(--muted);">${job.location}</span>
                            </div>
                            <div>
                                <strong>Salary:</strong><br>
                                <span style="color: var(--muted);">${job.salary}</span>
                            </div>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <strong>Description:</strong><br>
                            <div style="color: var(--muted); line-height: 1.5; margin-top: 8px;">${job.description}</div>
                        </div>
                        
                        ${job.requirements ? `
                            <div style="margin-bottom: 16px;">
                                <strong>Requirements:</strong><br>
                                <div style="color: var(--muted); line-height: 1.5; margin-top: 8px;">${job.requirements}</div>
                            </div>
                        ` : ''}
                        
                        ${job.skills ? `
                            <div style="margin-bottom: 16px;">
                                <strong>Skills:</strong><br>
                                <div style="color: var(--muted); line-height: 1.5; margin-top: 8px;">${job.skills}</div>
                            </div>
                        ` : ''}

                        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px; margin-top: 16px;">
                            <strong>Job ID:</strong> ${job.id}<br>
                            <strong>Posted:</strong> ${new Date(job.datePosted).toLocaleDateString()}<br>
                            <strong>Status:</strong> ${job.status}
                        </div>
                    </div>
                    <div class="form-actions">
                        <button class="btn btn-ghost" onclick="EmployerDashboard.closeModal()">Close</button>
                    </div>
                </div>
            `;
            
            modal.style.display = 'flex';
        } else {
            OpusUtils.showNotification('Job not found', 'error');
        }
    }

    static closeJob(jobId) {
        const jobs = this.getAllJobs();
        const jobIndex = jobs.findIndex(job => job.id === jobId);
        
        if (jobIndex !== -1) {
            jobs[jobIndex].status = 'closed';
            jobs[jobIndex].closedAt = new Date().toISOString();
            this.saveJob(jobs[jobIndex]);
            
            OpusUtils.showNotification('Job closed successfully!', 'success');
            this.loadManageJobs();
            this.loadOverview();
        }
    }

    static reopenJob(jobId) {
        const jobs = this.getAllJobs();
        const jobIndex = jobs.findIndex(job => job.id === jobId);
        
        if (jobIndex !== -1) {
            jobs[jobIndex].status = 'active';
            jobs[jobIndex].reopenedAt = new Date().toISOString();
            this.saveJob(jobs[jobIndex]);
            
            OpusUtils.showNotification('Job reopened successfully!', 'success');
            this.loadManageJobs();
            this.loadOverview();
        }
    }

    static safeDeleteJob(jobId) {
        const agreements = this.getAllAgreements();
        const activeAgreements = agreements.filter(a => a.jobId === jobId && a.status === 'active');
        
        if (activeAgreements.length > 0) {
            this.viewJobAgreements(jobId);
        } else {
            this.deleteJob(jobId);
        }
    }

    static viewJobAgreements(jobId) {
        const agreements = this.getAllAgreements();
        const jobAgreements = agreements.filter(a => a.jobId === jobId && a.status === 'active');
        
        if (jobAgreements.length === 0) {
            OpusUtils.showNotification('No active agreements for this job', 'info');
            return;
        }
        
        const modal = document.getElementById('applicationModal');
        const modalContent = document.getElementById('applicationModalContent');
        
        modalContent.innerHTML = `
            <div>
                <div class="modal-header">
                    <h3>Active Agreements for Job</h3>
                    <button class="modal-close" onclick="EmployerDashboard.closeModal()">&times;</button>
                </div>
                
                <div style="margin: 20px 0;">
                    <p style="color: var(--muted); margin-bottom: 16px;">
                        You have ${jobAgreements.length} active agreement(s) for this job. 
                        End them first before deleting the job.
                    </p>
                    
                    ${jobAgreements.map(agreement => `
                        <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                            <div style="display: flex; justify-content: between; align-items: center;">
                                <div style="flex: 1;">
                                    <h4 style="color: #fff; margin: 0 0 4px 0;">${agreement.workerName}</h4>
                                    <div style="color: var(--muted); font-size: 0.9rem;">
                                        Started: ${new Date(agreement.startDate).toLocaleDateString()}
                                    </div>
                                </div>
                                <button class="btn btn-danger btn-sm" onclick="EmployerDashboard.endAgreement('${agreement.id}')">
                                    End Agreement
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-ghost" onclick="EmployerDashboard.closeModal()">Close</button>
                </div>
            </div>
        `;
        
        modal.style.display = 'flex';
    }

    static endAgreement(agreementId) {
        const agreements = this.getAllAgreements();
        const agreementIndex = agreements.findIndex(a => a.id === agreementId);
        
        if (agreementIndex !== -1) {
            agreements[agreementIndex].status = 'completed';
            agreements[agreementIndex].endDate = new Date().toISOString();
            agreements[agreementIndex].workStatus = 'completed';
            
            localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
            
            OpusUtils.showNotification('Agreement ended successfully', 'success');
            this.loadActiveAgreements();
            this.closeModal();
        }
    }

    // Applications Management
    static loadApplications() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const applications = this.getAllApplications();
        const jobs = this.getAllJobs();
        
        const employerJobs = jobs.filter(job => job.employerId === currentUser.id);
        const employerJobIds = employerJobs.map(job => job.id);
        const employerApplications = applications.filter(app => employerJobIds.includes(app.jobId));
        
        const applicationsContainer = document.getElementById('applicationsContainer');
        if (!applicationsContainer) return;

        if (employerApplications.length === 0) {
            applicationsContainer.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3>No applications received</h3>
                    <p>Applications from job seekers will appear here</p>
                </div>
            `;
            return;
        }
        
        applicationsContainer.innerHTML = employerApplications.map(app => {
            const job = jobs.find(j => j.id === app.jobId);
            const statusClass = this.getApplicationStatusClass(app.status);
            const statusText = this.getApplicationStatusText(app.status);
            
            return `
                <div class="application-item">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                        <div style="flex: 1;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                                <div class="worker-avatar-small">
                                    ${app.workerName?.charAt(0) || 'W'}
                                </div>
                                <div>
                                    <h4 style="color: #fff; margin: 0 0 4px 0;">${app.workerName}</h4>
                                    <p style="color: var(--accent); margin: 0; font-weight: 600;">Applied for: ${app.jobTitle}</p>
                                </div>
                            </div>
                            
                            <div style="color: var(--muted); margin-bottom: 12px;">
                                <strong>Applied:</strong> ${new Date(app.appliedDate).toLocaleDateString()}
                            </div>
                            
                            <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 6px; margin-bottom: 12px;">
                                <div style="color: var(--muted); font-size: 0.9rem; margin-bottom: 4px;">Cover Letter:</div>
                                <div style="color: #fff; line-height: 1.4;">${app.coverLetter || 'No cover letter provided'}</div>
                            </div>
                        </div>
                        
                        <div style="margin-left: 16px; text-align: right;">
                            <span class="status ${statusClass}" style="display: inline-block; margin-bottom: 12px;">${statusText}</span>
                            <div style="display: flex; gap: 8px; flex-direction: column;">
                                <button class="btn btn-primary" onclick="EmployerDashboard.viewApplication('${app.id}')">
                                    View Details
                                </button>
                                
                                ${app.status === 'pending' ? `
                                    <button class="btn btn-success" onclick="EmployerDashboard.acceptApplication('${app.id}')">
                                        Accept
                                    </button>
                                    <button class="btn btn-danger" onclick="EmployerDashboard.rejectApplication('${app.id}')">
                                        Reject
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    static viewApplication(applicationId) {
        const applications = this.getAllApplications();
        const application = applications.find(app => app.id === applicationId);
        
        if (application) {
            const modal = document.getElementById('applicationModal');
            const modalContent = document.getElementById('applicationModalContent');
            
            let actionButtons = '';
            if (application.status === 'pending') {
                actionButtons = `
                    <button class="btn btn-primary" onclick="EmployerDashboard.acceptApplication('${application.id}')">
                        Accept
                    </button>
                    <button class="btn btn-ghost" onclick="EmployerDashboard.rejectApplication('${application.id}')">
                        Reject
                    </button>
                `;
            } else {
                actionButtons = `
                    <div style="color: var(--muted); text-align: center; padding: 10px;">
                        This application has been ${application.status}
                        ${application.reviewedDate ? ` on ${new Date(application.reviewedDate).toLocaleDateString()}` : ''}
                    </div>
                `;
            }
            
            modalContent.innerHTML = `
                <div>
                    <div class="modal-header">
                        <h3>Application Details</h3>
                        <button class="modal-close" onclick="EmployerDashboard.closeModal()">&times;</button>
                    </div>
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                        <div class="worker-avatar" style="width: 60px; height: 60px; font-size: 1.5rem;">
                            ${application.workerName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 style="color: #fff; margin-bottom: 4px;">${application.workerName}</h3>
                            <div style="color: var(--accent); font-weight: 600;">Applied for: ${application.jobTitle}</div>
                            <div style="color: var(--muted);">Applied: ${new Date(application.appliedDate).toLocaleString()}</div>
                            ${application.reviewedDate ? 
                                `<div style="color: var(--muted);">Reviewed: ${new Date(application.reviewedDate).toLocaleString()}</div>` : ''}
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 20px;">
                        <h4 style="color: #fff; margin-bottom: 8px;">Cover Letter</h4>
                        <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; color: var(--muted); line-height: 1.5;">
                            ${application.coverLetter}
                        </div>
                    </div>
                    
                    <div class="form-actions">
                        ${actionButtons}
                        <button class="btn btn-ghost" onclick="EmployerDashboard.closeModal()">Close</button>
                    </div>
                </div>
            `;
            
            modal.style.display = 'flex';
        }
    }

    static acceptApplication(applicationId) {
    console.log('✅ Employer accepting application:', applicationId);
    
    // Debug current state
    this.debugApplication(applicationId);
    
    // Check if agreement already exists
    if (AgreementManager.hasAgreementForApplication(applicationId)) {
        OpusUtils.showNotification('Agreement already exists for this application', 'info');
        return;
    }

    // Update application status immediately
    const success = this.updateApplicationStatus(applicationId, 'accepted');
    
    if (success) {
        // Then show agreement creation modal
        this.showAgreementCreationModal(applicationId);
    }
}

static updateApplicationStatus(applicationId, status) {
    try {
        console.log('🔄 Updating application status:', { applicationId, status });
        
        const applications = this.getAllApplications();
        console.log('📊 Total applications found:', applications.length);
        
        const applicationIndex = applications.findIndex(app => app.id === applicationId);
        console.log('🔍 Application index:', applicationIndex);
        
        if (applicationIndex === -1) {
            console.error('❌ Application not found:', applicationId);
            OpusUtils.showNotification('Application not found', 'error');
            return false;
        }
        
        // Update the application
        applications[applicationIndex].status = status;
        applications[applicationIndex].reviewedDate = new Date().toISOString();
        applications[applicationIndex].updatedAt = new Date().toISOString();
        
        console.log('📝 Updated application:', applications[applicationIndex]);
        
        // Save back to localStorage
        localStorage.setItem('opuslink_applications', JSON.stringify(applications));
        
        // Verify the save worked
        const verifyApplications = this.getAllApplications();
        const verifyApp = verifyApplications.find(app => app.id === applicationId);
        console.log('✅ Verification - Application status after save:', verifyApp?.status);
        
        // Refresh the UI
        this.loadApplications();
        
        // Force a re-render of the overview if we're on that section
        if (document.getElementById('overview')?.classList.contains('active')) {
            this.loadOverview();
        }
        
        console.log(`✅ Application ${applicationId} status updated to: ${status}`);
        return true;
        
    } catch (error) {
        console.error('❌ Error updating application status:', error);
        OpusUtils.showNotification('Error updating application status', 'error');
        return false;
    }
}
static showAgreementCreationModal(applicationId) {
    const applications = this.getAllApplications();
    const jobs = this.getAllJobs();
    const users = this.getAllUsers();
    
    const application = applications.find(app => app.id === applicationId);
    const job = jobs.find(j => j.id === application.jobId);
    const worker = users.find(u => u.id === application.workerId);
    
    if (!application || !job || !worker) {
        OpusUtils.showNotification('Application data not found', 'error');
        return;
    }
    
    const modal = document.getElementById('applicationModal');
    const modalContent = document.getElementById('applicationModalContent');
    
    modalContent.innerHTML = `
        <div style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header">
                <h3>📝 Create Work Agreement</h3>
                <button class="modal-close" onclick="EmployerDashboard.closeModal()">&times;</button>
            </div>
            
            <div style="margin: 20px 0;">
                <!-- Job Summary -->
                <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1)); padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.1);">
                    <h4 style="color: #fff; margin-bottom: 12px;">${application.jobTitle}</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>👤 Worker:</strong> ${application.workerName}</p>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>📅 Applied:</strong> ${new Date(application.appliedDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>📍 Location:</strong> ${job.location || 'Remote'}</p>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>🏢 Category:</strong> ${this.formatCategory(job.category)}</p>
                        </div>
                    </div>
                </div>
                
                <form id="agreementForm">
                    <!-- Payment Terms Section -->
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                            💰 Payment Terms
                        </h4>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Type *</label>
                                <select id="paymentType" required 
                                        style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                    <option value="">Select Payment Type</option>
                                    <option value="hourly">💰 Hourly Rate</option>
                                    <option value="daily">📅 Daily Rate</option>
                                    <option value="weekly">🗓️ Weekly Salary</option>
                                    <option value="monthly" selected>📊 Monthly Salary</option>
                                    <option value="fixed">🎯 Fixed Project</option>
                                    <option value="milestone">🏆 Milestone-based</option>
                                    <option value="commission">📈 Commission Only</option>
                                    <option value="retainer">🔄 Retainer</option>
                                    <option value="piece_rate">🧩 Piece Rate</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Amount (₹) *</label>
                                <input type="number" id="paymentAmount" value="${job.salary ? job.salary.replace(/[^\d]/g, '') : '45000'}" required 
                                       style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;"
                                       placeholder="Enter amount">
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Schedule *</label>
                                <select id="paymentSchedule" required 
                                        style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                    <option value="weekly">📅 Weekly</option>
                                    <option value="biweekly">🔄 Bi-weekly</option>
                                    <option value="monthly" selected>🗓️ Monthly</option>
                                    <option value="upon_completion">✅ Upon Completion</option>
                                    <option value="milestone_based">🏆 Milestone-based</option>
                                    <option value="15_30_days">📊 15/30 Days</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Currency *</label>
                                <select id="currency" required 
                                        style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                    <option value="INR" selected>🇮🇳 Indian Rupee (INR)</option>
                                    <option value="USD">🇺🇸 US Dollar (USD)</option>
                                    <option value="EUR">🇪🇺 Euro (EUR)</option>
                                    <option value="GBP">🇬🇧 British Pound (GBP)</option>
                                </select>
                            </div>
                        </div>
                        
                        <!-- Dynamic Fields Based on Payment Type -->
                        <div id="dynamicPaymentFields">
                            <!-- Will be populated based on payment type selection -->
                        </div>
                    </div>

                    <!-- Work Terms Section -->
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                            ⚙️ Work Terms
                        </h4>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Work Type *</label>
                                <select id="workType" required 
                                        style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                    <option value="fulltime" ${job.type === 'fulltime' ? 'selected' : ''}>🕘 Full-Time</option>
                                    <option value="parttime" ${job.type === 'parttime' ? 'selected' : ''}>⏰ Part-Time</option>
                                    <option value="contract">📝 Contract</option>
                                    <option value="freelance">🎯 Freelance</option>
                                    <option value="internship">🎓 Internship</option>
                                    <option value="remote">🌍 Remote</option>
                                    <option value="hybrid">🏢 Hybrid</option>
                                    <option value="shift_based">🔄 Shift-based</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Work Location *</label>
                                <select id="workLocation" required 
                                        style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                    <option value="remote" ${job.location?.toLowerCase().includes('remote') ? 'selected' : ''}>🌍 Fully Remote</option>
                                    <option value="onsite" ${!job.location?.toLowerCase().includes('remote') ? 'selected' : ''}>🏢 On-Site</option>
                                    <option value="hybrid">🔄 Hybrid</option>
                                    <option value="client_site">👥 Client Site</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Duration *</label>
                                <select id="duration" required 
                                        style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                    <option value="15">15 days</option>
                                    <option value="30">30 days (1 month)</option>
                                    <option value="60">60 days (2 months)</option>
                                    <option value="90" selected>90 days (3 months)</option>
                                    <option value="180">180 days (6 months)</option>
                                    <option value="365">365 days (1 year)</option>
                                    <option value="permanent">Permanent</option>
                                    <option value="project_based">Project-based</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Weekly Hours *</label>
                                <select id="weeklyHours" required 
                                        style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                    <option value="20">20 hours/week</option>
                                    <option value="30">30 hours/week</option>
                                    <option value="40" selected>40 hours/week</option>
                                    <option value="45">45 hours/week</option>
                                    <option value="48">48 hours/week</option>
                                    <option value="flexible">Flexible hours</option>
                                </select>
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Start Date *</label>
                                <input type="date" id="startDate" required 
                                       style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;"
                                       min="${new Date().toISOString().split('T')[0]}"
                                       value="${new Date().toISOString().split('T')[0]}">
                            </div>
                            
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Probation Period</label>
                                <select id="probationPeriod" 
                                        style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                    <option value="0">No probation</option>
                                    <option value="15" selected>15 days</option>
                                    <option value="30">30 days</option>
                                    <option value="60">60 days</option>
                                    <option value="90">90 days</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Work Schedule Section -->
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                            🕐 Work Schedule
                        </h4>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Working Days *</label>
                                <select id="workingDays" required 
                                        style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                    <option value="mon_fri">Monday - Friday</option>
                                    <option value="mon_sat" selected>Monday - Saturday</option>
                                    <option value="shift_rotation">Shift Rotation</option>
                                    <option value="flexible">Flexible Days</option>
                                    <option value="weekends_only">Weekends Only</option>
                                </select>
                            </div>
                            
                            <div>
                                <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Shift Timing</label>
                                <select id="shiftTiming" 
                                        style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                    <option value="general" selected>General (9 AM - 6 PM)</option>
                                    <option value="morning">Morning Shift</option>
                                    <option value="evening">Evening Shift</option>
                                    <option value="night">Night Shift</option>
                                    <option value="rotating">Rotating Shifts</option>
                                    <option value="flexible">Flexible Timing</option>
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Overtime Policy</label>
                            <select id="overtimePolicy" 
                                    style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                <option value="paid_1.5x">Paid (1.5x rate)</option>
                                <option value="paid_2x" selected>Paid (2x rate)</option>
                                <option value="comp_off">Compensatory Off</option>
                                <option value="no_overtime">No Overtime</option>
                                <option value="as_per_company">As per company policy</option>
                            </select>
                        </div>
                    </div>

                    <!-- Additional Terms Section -->
                    <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                            📋 Additional Terms & Conditions
                        </h4>
                        
                        <div style="margin-bottom: 16px;">
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Notice Period *</label>
                            <select id="noticePeriod" required 
                                    style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                <option value="7">7 days</option>
                                <option value="15" selected>15 days</option>
                                <option value="30">30 days</option>
                                <option value="60">60 days</option>
                                <option value="90">90 days</option>
                            </select>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Intellectual Property Rights</label>
                            <select id="ipRights" 
                                    style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                <option value="employer" selected>Belongs to Employer</option>
                                <option value="worker">Belongs to Worker</option>
                                <option value="shared">Shared Ownership</option>
                                <option value="project_specific">Project Specific</option>
                            </select>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Confidentiality Clause</label>
                            <select id="confidentiality" 
                                    style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                <option value="standard" selected>Standard Confidentiality</option>
                                <option value="strict">Strict Confidentiality</option>
                                <option value="nda_required">NDA Required</option>
                                <option value="none">No Confidentiality</option>
                            </select>
                        </div>
                        
                        <div style="margin-bottom: 16px;">
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Equipment Provision</label>
                            <select id="equipmentProvision" 
                                    style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                <option value="employer_provides" selected>Employer Provides</option>
                                <option value="worker_provides">Worker Provides</option>
                                <option value="shared">Shared Responsibility</option>
                                <option value="allowance">Equipment Allowance</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Additional Terms & Notes</label>
                            <textarea id="additionalTerms" 
                                      style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px; min-height: 100px;"
                                      placeholder="Any special terms, conditions, project requirements, or additional notes..."></textarea>
                        </div>
                    </div>

                    <!-- Agreement Summary -->
                    <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.1)); border: 1px solid rgba(34, 197, 94, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                        <h5 style="color: #22c55e; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                            📊 Agreement Summary
                        </h5>
                        <div id="agreementSummary" style="color: var(--muted); font-size: 0.9rem; line-height: 1.6;">
                            <!-- Dynamic summary will be inserted here -->
                        </div>
                    </div>
                </form>
            </div>
            
            <div class="form-actions" style="display: flex; gap: 12px; justify-content: flex-end; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <button class="btn btn-ghost" onclick="EmployerDashboard.closeModal()">
                    Cancel
                </button>
                <button class="btn btn-primary" onclick="EmployerDashboard.createAgreement('${applicationId}')" 
                        style="background: linear-gradient(135deg, var(--accent), #3b82f6); border: none; padding: 12px 24px;">
                    📝 Create Agreement
                </button>
            </div>
        </div>
    `;
    
    // Setup real-time summary updates and dynamic fields
    this.setupAgreementSummaryUpdates();
    this.setupDynamicPaymentFields();
    
    modal.style.display = 'flex';
}

static setupDynamicPaymentFields() {
    const paymentTypeSelect = document.getElementById('paymentType');
    const dynamicFieldsContainer = document.getElementById('dynamicPaymentFields');
    
    const updateDynamicFields = () => {
        const paymentType = paymentTypeSelect.value;
        let dynamicHTML = '';
        
        switch(paymentType) {
            case 'hourly':
                dynamicHTML = `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Expected Weekly Hours</label>
                            <input type="number" id="expectedHours" value="40" 
                                   style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                        </div>
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Overtime Rate</label>
                            <input type="number" id="overtimeRate" value="${Math.round(parseInt(document.getElementById('paymentAmount').value) * 1.5)}" 
                                   style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;"
                                   placeholder="Overtime rate per hour">
                        </div>
                    </div>
                `;
                break;
                
            case 'commission':
                dynamicHTML = `
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Commission Rate (%)</label>
                            <input type="number" id="commissionRate" value="10" step="0.1"
                                   style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                        </div>
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Commission Structure</label>
                            <select id="commissionStructure" 
                                    style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                                <option value="revenue_based">Revenue-based</option>
                                <option value="profit_based">Profit-based</option>
                                <option value="sales_based">Sales-based</option>
                                <option value="performance_based">Performance-based</option>
                            </select>
                        </div>
                    </div>
                `;
                break;
                
            case 'milestone':
                dynamicHTML = `
                    <div>
                        <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Number of Milestones</label>
                        <select id="milestoneCount" 
                                style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                            <option value="3">3 Milestones</option>
                            <option value="5" selected>5 Milestones</option>
                            <option value="7">7 Milestones</option>
                            <option value="10">10 Milestones</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'retainer':
                dynamicHTML = `
                    <div>
                        <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Retainer Period</label>
                        <select id="retainerPeriod" 
                                style="width: 100%; padding: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); border-radius: 8px; color: #fff; font-size: 14px;">
                            <option value="30">30 days</option>
                            <option value="60">60 days</option>
                            <option value="90" selected>90 days</option>
                            <option value="180">180 days</option>
                        </select>
                    </div>
                `;
                break;
                
            default:
                dynamicHTML = '';
        }
        
        dynamicFieldsContainer.innerHTML = dynamicHTML;
    };
    
    paymentTypeSelect.addEventListener('change', updateDynamicFields);
    updateDynamicFields(); // Initial call
}


static setupAgreementSummaryUpdates() {
    const updateSummary = () => {
        const paymentType = document.getElementById('paymentType').value;
        const amount = document.getElementById('paymentAmount').value;
        const schedule = document.getElementById('paymentSchedule').value;
        const workType = document.getElementById('workType').value;
        const duration = document.getElementById('duration').value;
        const weeklyHours = document.getElementById('weeklyHours').value;
        const startDate = document.getElementById('startDate').value;
        const location = document.getElementById('workLocation').value;
        const workingDays = document.getElementById('workingDays').value;
        const noticePeriod = document.getElementById('noticePeriod').value;
        
        let paymentSummary = '';
        const amountFormatted = new Intl.NumberFormat('en-IN').format(amount);
        
        switch(paymentType) {
            case 'hourly':
                paymentSummary = `<strong>Hourly rate of ₹${amountFormatted}/hour</strong>`;
                break;
            case 'daily':
                paymentSummary = `<strong>Daily rate of ₹${amountFormatted}/day</strong>`;
                break;
            case 'weekly':
                paymentSummary = `<strong>Weekly salary of ₹${amountFormatted}/week</strong>`;
                break;
            case 'monthly':
                paymentSummary = `<strong>Monthly salary of ₹${amountFormatted}/month</strong>`;
                break;
            case 'fixed':
                paymentSummary = `<strong>Fixed project payment of ₹${amountFormatted}</strong>`;
                break;
            case 'commission':
                paymentSummary = `<strong>Commission-based payment</strong>`;
                break;
            default:
                paymentSummary = `<strong>Payment: ₹${amountFormatted}</strong>`;
        }
        
        const workTypeFormatted = workType.charAt(0).toUpperCase() + workType.slice(1);
        const locationFormatted = location === 'remote' ? 'Remote' : 
                                location === 'hybrid' ? 'Hybrid' : 'On-site';
        
        const summary = `
            <div style="display: grid; gap: 8px;">
                <div>${paymentSummary}, paid <strong>${schedule.replace('_', ' ')}</strong></div>
                <div><strong>${workTypeFormatted}</strong> position, <strong>${locationFormatted}</strong> work</div>
                <div>Duration: <strong>${duration} days</strong>, Weekly hours: <strong>${weeklyHours}</strong></div>
                <div>Start date: <strong>${new Date(startDate).toLocaleDateString()}</strong></div>
                <div>Working days: <strong>${workingDays.replace('_', ' to ')}</strong></div>
                <div>Notice period: <strong>${noticePeriod} days</strong></div>
                <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(34, 197, 94, 0.3);">
                    <strong>Total Estimated Value:</strong> ₹${this.calculateTotalValue(amount, paymentType, duration, weeklyHours).toLocaleString()}
                </div>
            </div>
        `;
        
        document.getElementById('agreementSummary').innerHTML = summary;
    };
    
    // Add event listeners to all relevant fields
    const fieldsToWatch = [
        'paymentType', 'paymentAmount', 'paymentSchedule', 'workType', 
        'duration', 'weeklyHours', 'startDate', 'workLocation', 
        'workingDays', 'noticePeriod'
    ];
    
    fieldsToWatch.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('input', updateSummary);
            element.addEventListener('change', updateSummary);
        }
    });
    
    // Initial update
    updateSummary();
}
static calculateTotalValue(amount, paymentType, duration, weeklyHours) {
    const amountNum = parseFloat(amount);
    const durationNum = parseFloat(duration);
    const weeklyHoursNum = parseFloat(weeklyHours);
    
    switch(paymentType) {
        case 'hourly':
            // Assuming 4.33 weeks per month for calculation
            const totalHours = (durationNum / 30) * 4.33 * weeklyHoursNum;
            return Math.round(amountNum * totalHours);
            
        case 'daily':
            const totalDays = durationNum;
            return Math.round(amountNum * totalDays);
            
        case 'weekly':
            const totalWeeks = durationNum / 7;
            return Math.round(amountNum * totalWeeks);
            
        case 'monthly':
            const totalMonths = durationNum / 30;
            return Math.round(amountNum * totalMonths);
            
        case 'fixed':
            return amountNum;
            
        default:
            return amountNum;
    }
}


// ENHANCED CREATE AGREEMENT METHOD
static createAgreement(applicationId) {
    console.log('📝 Employer creating agreement for application:', applicationId);
    
    const form = document.getElementById('agreementForm');
    if (!form.checkValidity()) {
        OpusUtils.showNotification('Please fill all required fields', 'error');
        return;
    }
    
    try {
        // Collect all form data with proper validation
        const terms = {
            // Payment Terms
            paymentType: document.getElementById('paymentType').value || 'monthly',
            paymentAmount: parseFloat(document.getElementById('paymentAmount').value) || 0,
            paymentSchedule: document.getElementById('paymentSchedule').value || 'monthly',
            currency: document.getElementById('currency').value || 'INR',
            
            // Work Terms - VALIDATE DATES
            workType: document.getElementById('workType').value || 'fulltime',
            workLocation: document.getElementById('workLocation').value || 'remote',
            duration: parseInt(document.getElementById('duration').value) || 90,
            weeklyHours: parseInt(document.getElementById('weeklyHours').value) || 40,
            
            // VALIDATE START DATE
            startDate: this.validateDate(document.getElementById('startDate').value),
            
            probationPeriod: parseInt(document.getElementById('probationPeriod').value) || 0,
            noticePeriod: parseInt(document.getElementById('noticePeriod').value) || 15,
            
            // Work Schedule
            workingDays: document.getElementById('workingDays').value || 'mon_fri',
            shiftTiming: document.getElementById('shiftTiming').value || 'general',
            overtimePolicy: document.getElementById('overtimePolicy').value || 'paid_2x',
            
            // Additional Terms
            ipRights: document.getElementById('ipRights').value || 'employer',
            confidentiality: document.getElementById('confidentiality').value || 'standard',
            equipmentProvision: document.getElementById('equipmentProvision').value || 'employer_provides',
            additionalTerms: document.getElementById('additionalTerms').value || ''
        };

        console.log('📋 Sending validated terms to agreement manager:', terms);

        const agreement = AgreementManager.createAgreementForApplication(applicationId, terms);
        
        if (agreement) {
            this.updateApplicationStatus(applicationId, 'accepted');
            
            OpusUtils.showNotification('✅ Agreement created successfully! Sent to worker for acceptance.', 'success');

            this.closeModal();
            this.loadApplications();
        }
        
    } catch (error) {
        console.error('❌ Error creating agreement:', error);
        OpusUtils.showNotification('Failed to create agreement: ' + error.message, 'error');
    }
}
static debugApplication(applicationId) {
    const applications = this.getAllApplications();
    const application = applications.find(app => app.id === applicationId);
    console.log('🔍 Application Debug:', application);
    return application;
}

// ADD THIS HELPER METHOD FOR DATE VALIDATION
static validateDate(dateString) {
    if (!dateString) {
        return new Date().toISOString().split('T')[0]; // Return today as default
    }
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
        console.warn('⚠️ Invalid date provided, using current date');
        return new Date().toISOString().split('T')[0]; // Return today if invalid
    }
    
    return dateString; // Return valid date string
}

    static showPaymentNegotiationModal(applicationId) {
        const applications = this.getAllApplications();
        const jobs = this.getAllJobs();
        const users = this.getAllUsers();
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        const application = applications.find(app => app.id === applicationId);
        const job = jobs.find(j => j.id === application.jobId);
        const worker = users.find(u => u.id === application.workerId);
        
        if (!application || !job || !worker) {
            OpusUtils.showNotification('Application data not found', 'error');
            return;
        }
        
        const modal = document.getElementById('applicationModal');
        const modalContent = document.getElementById('applicationModalContent');
        
        modalContent.innerHTML = `
            <div>
                <div class="modal-header">
                    <h3>Create Work Agreement</h3>
                    <button class="modal-close" onclick="EmployerDashboard.closeModal()">&times;</button>
                </div>
                
                <div style="margin: 20px 0;">
                    <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                        <h4 style="color: #fff; margin-bottom: 8px;">${application.jobTitle}</h4>
                        <p style="color: var(--muted); margin: 4px 0;"><strong>Worker:</strong> ${application.workerName}</p>
                        <p style="color: var(--muted); margin: 4px 0;"><strong>Applied:</strong> ${new Date(application.appliedDate).toLocaleDateString()}</p>
                    </div>
                    
                    <h4 style="color: #fff; margin-bottom: 16px;">💰 Payment Terms</h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Type</label>
                            <select id="paymentType" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff;">
                                <option value="hourly">Hourly Rate</option>
                                <option value="monthly">Monthly Salary</option>
                                <option value="fixed">Fixed Project</option>
                                <option value="milestone">Milestone-based</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Amount (₹)</label>
                            <input type="number" id="paymentAmount" value="${job.salary || '45000'}" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff;" placeholder="Enter amount">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Schedule</label>
                            <select id="paymentSchedule" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff;">
                                <option value="weekly">Weekly</option>
                                <option value="biweekly">Bi-weekly</option>
                                <option value="monthly">Monthly</option>
                            </select>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Work Type</label>
                            <select id="workType" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff;">
                                <option value="fulltime" ${job.type === 'fulltime' ? 'selected' : ''}>Full-Time</option>
                                <option value="parttime" ${job.type === 'parttime' ? 'selected' : ''}>Part-Time</option>
                                <option value="contract" ${job.type === 'contract' ? 'selected' : ''}>Contract</option>
                                <option value="freelance" ${job.type === 'freelance' ? 'selected' : ''}>Freelance</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="margin-bottom: 16px;">
                        <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Additional Terms (Optional)</label>
                        <textarea id="additionalTerms" placeholder="Any special terms, conditions, or notes..." style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; min-height: 80px;"></textarea>
                    </div>
                    
                    <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                        <div style="color: #22c55e; font-weight: 600; margin-bottom: 4px;">📋 Agreement Summary</div>
                        <div style="color: var(--muted); font-size: 0.9rem;">
                            <span id="summaryText">Hourly rate of ₹${job.salary || '45000'} with weekly payments</span>
                        </div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-primary" onclick="EmployerDashboard.createAgreementWithNegotiatedTerms('${applicationId}')">
                        📝 Create Agreement
                    </button>
                    <button class="btn btn-ghost" onclick="EmployerDashboard.closeModal()">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        // Real-time summary update
        const updateSummary = () => {
            const paymentType = document.getElementById('paymentType').value;
            const amount = document.getElementById('paymentAmount').value;
            const schedule = document.getElementById('paymentSchedule').value;
            
            let summary = '';
            if (paymentType === 'hourly') {
                summary = `Hourly rate of ₹${amount} with ${schedule} payments`;
            } else if (paymentType === 'monthly') {
                summary = `Monthly salary of ₹${amount} with ${schedule} payments`;
            } else if (paymentType === 'fixed') {
                summary = `Fixed project payment of ₹${amount} with ${schedule} payments`;
            } else {
                summary = `Milestone-based payments totaling ₹${amount}`;
            }
            
            document.getElementById('summaryText').textContent = summary;
        };
        
        // Add event listeners for real-time updates
        document.getElementById('paymentType').addEventListener('change', updateSummary);
        document.getElementById('paymentAmount').addEventListener('input', updateSummary);
        document.getElementById('paymentSchedule').addEventListener('change', updateSummary);
        
        // Initial summary
        updateSummary();
        
        modal.style.display = 'flex';
    }

    static createAgreementWithNegotiatedTerms(applicationId) {
        const applications = this.getAllApplications();
        const jobs = this.getAllJobs();
        const users = this.getAllUsers();
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        const applicationIndex = applications.findIndex(app => app.id === applicationId);
        
        if (applicationIndex === -1) {
            OpusUtils.showNotification('Application not found', 'error');
            return;
        }
        
        const application = applications[applicationIndex];
        const job = jobs.find(j => j.id === application.jobId);
        
        // Get negotiated terms from the form
        const paymentType = document.getElementById('paymentType').value;
        const paymentAmount = document.getElementById('paymentAmount').value;
        const paymentSchedule = document.getElementById('paymentSchedule').value;
        const workType = document.getElementById('workType').value;
        const additionalTerms = document.getElementById('additionalTerms').value;
        
        if (!paymentAmount || paymentAmount <= 0) {
            OpusUtils.showNotification('Please enter a valid payment amount', 'error');
            return;
        }
        
        // Calculate hourly rate for payment calculations
        let hourlyRate = 0;
        if (paymentType === 'hourly') {
            hourlyRate = parseFloat(paymentAmount);
        } else if (paymentType === 'monthly') {
            hourlyRate = parseFloat(paymentAmount) / 160; // 160 hours per month
        } else {
            hourlyRate = parseFloat(paymentAmount) / 160; // Fallback calculation
        }
        
        // 1. Update application status
        applications[applicationIndex].status = 'accepted';
        applications[applicationIndex].reviewedDate = new Date().toISOString();
        applications[applicationIndex].negotiatedTerms = {
            paymentType: paymentType,
            paymentAmount: paymentAmount,
            paymentSchedule: paymentSchedule
        };
        
        // 2. Create agreement
        const agreement = {
            id: 'agreement_' + Date.now(),
            employerId: currentUser.id,
            employerName: currentUser.companyName || currentUser.fullName,
            workerId: application.workerId,
            workerName: application.workerName,
            jobId: application.jobId,
            jobTitle: application.jobTitle,
            paymentTerms: {
                type: paymentType,
                amount: paymentAmount,
                schedule: paymentSchedule,
                hourlyRate: Math.round(hourlyRate),
                currency: 'INR',
                agreedUpon: new Date().toISOString()
            },
            terms: {
                workType: workType,
                location: job.location || 'Remote',
                duration: 90,
                weeklyHours: workType === 'fulltime' ? 40 : 20,
                additionalTerms: additionalTerms
            },
            status: 'active',
            startDate: new Date().toISOString(),
            endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            workStatus: 'in_progress',
            payments: [],
            workLogs: [],
            createdAt: new Date().toISOString(),
            applicationId: applicationId
        };

        // Save agreement
        const agreements = this.getAllAgreements();
        agreements.push(agreement);
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        
        // 3. Update job status
        const jobIndex = jobs.findIndex(j => j.id === application.jobId);
        if (jobIndex !== -1) {
            if (workType === 'fulltime') {
                jobs[jobIndex].status = 'filled';
                jobs[jobIndex].filledAt = new Date().toISOString();
                jobs[jobIndex].filledBy = application.workerId;
            } else {
                jobs[jobIndex].status = 'closed';
                jobs[jobIndex].closedAt = new Date().toISOString();
            }
            this.saveJob(jobs[jobIndex]);
        }
        
        // 4. Save application changes
        localStorage.setItem('opuslink_applications', JSON.stringify(applications));
        
        // 5. Notify worker
        const notificationMessage = `${paymentType} - ₹${paymentAmount} (${paymentSchedule})`;
        NotificationSystem.createNotification(application.workerId, 'agreement_created', {
            employerName: currentUser.companyName || currentUser.fullName,
            jobTitle: application.jobTitle,
            agreementId: agreement.id,
            paymentTerms: notificationMessage
        });

        OpusUtils.showNotification(`Agreement created with ${application.workerName}! Payment terms: ₹${paymentAmount} ${paymentType}`, 'success');
        this.closeModal();
        this.loadApplications();
        this.loadActiveAgreements();
    }

    static rejectApplication(applicationId) {
        this.showRejectionModal(applicationId);
    }

    static showRejectionModal(applicationId) {
        const modal = document.getElementById('applicationModal');
        const modalContent = document.getElementById('applicationModalContent');
        
        modalContent.innerHTML = `
            <div>
                <div class="modal-header">
                    <h3>Reject Application</h3>
                    <button class="modal-close" onclick="EmployerDashboard.closeModal()">&times;</button>
                </div>
                
                <div style="margin: 20px 0;">
                    <p style="color: var(--muted); margin-bottom: 16px;">Please provide a reason for rejection:</p>
                    
                    <div style="margin-bottom: 16px;">
                        <select id="rejectionReasonSelect" style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff;">
                            <option value="">Select a reason...</option>
                            <option value="Not enough experience">Not enough experience</option>
                            <option value="Skills don't match">Skills don't match requirements</option>
                            <option value="Position filled">Position already filled</option>
                            <option value="Budget constraints">Budget constraints</option>
                            <option value="Other">Other reason</option>
                        </select>
                    </div>
                    
                    <div id="customReasonContainer" style="display: none; margin-bottom: 16px;">
                        <textarea id="customRejectionReason" placeholder="Please specify the reason..." style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; min-height: 80px;"></textarea>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button class="btn btn-danger" onclick="EmployerDashboard.confirmRejection('${applicationId}')">
                        Confirm Rejection
                    </button>
                    <button class="btn btn-ghost" onclick="EmployerDashboard.closeModal()">
                        Cancel
                    </button>
                </div>
            </div>
        `;
        
        // Show/hide custom reason field
        const reasonSelect = document.getElementById('rejectionReasonSelect');
        const customContainer = document.getElementById('customReasonContainer');
        
        reasonSelect.addEventListener('change', function() {
            customContainer.style.display = this.value === 'Other' ? 'block' : 'none';
        });
        
        modal.style.display = 'flex';
    }

    static confirmRejection(applicationId) {
        const reasonSelect = document.getElementById('rejectionReasonSelect');
        const customReason = document.getElementById('customRejectionReason');
        
        if (!reasonSelect.value) {
            OpusUtils.showNotification('Please select a rejection reason', 'error');
            return;
        }
        
        const rejectionReason = reasonSelect.value === 'Other' ? customReason.value : reasonSelect.value;
        
        if (!rejectionReason) {
            OpusUtils.showNotification('Please provide a rejection reason', 'error');
            return;
        }
        
        const applications = this.getAllApplications();
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        const applicationIndex = applications.findIndex(app => app.id === applicationId);
        
        if (applicationIndex !== -1) {
            const application = applications[applicationIndex];
            
            // Update application status with reason
            applications[applicationIndex].status = 'rejected';
            applications[applicationIndex].reviewedDate = new Date().toISOString();
            applications[applicationIndex].rejectionReason = rejectionReason;
            
            localStorage.setItem('opuslink_applications', JSON.stringify(applications));
            
            // Notify worker
            NotificationSystem.createNotification(application.workerId, 'application_rejected', {
                employerName: currentUser.companyName || currentUser.fullName,
                jobTitle: application.jobTitle,
                rejectionReason: rejectionReason
            });

            OpusUtils.showNotification('Application rejected', 'success');
            this.closeModal();
            this.loadApplications();
        }
    }

static loadActiveAgreements() {
    console.log('📋 Loading active agreements for employer...');
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    
    // Show ALL agreements for this employer, not just 'active' status
    const employerAgreements = agreements.filter(agreement => 
        agreement.employerId === currentUser.id
    );
    
    console.log('📊 Found agreements for employer:', employerAgreements);
    
    const container = document.getElementById('activeAgreementsContainer');
    if (!container) {
        console.error('❌ Active agreements container not found');
        return;
    }

    if (employerAgreements.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📝</div>
                <h3>No agreements yet</h3>
                <p>Your work agreements will appear here</p>
                <button class="btn btn-primary" onclick="EmployerDashboard.navigateToSection('applications')">
                    View Applications
                </button>
            </div>
        `;
        return;
    }

    // Sort by creation date (newest first)
    employerAgreements.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    container.innerHTML = employerAgreements.map(agreement => {
        const statusColor = this.getAgreementStatusColor(agreement.status);
        const daysRemaining = this.calculateDaysRemaining(agreement);
        
        return `
            <div class="agreement-card">
                <div class="agreement-header">
                    <h4>${agreement.jobTitle}</h4>
                    <div style="display: flex; align-items: center; gap: 8px;">
                        <span class="status" style="background: ${statusColor.background}; color: ${statusColor.color};">
                            ${agreement.status.replace(/_/g, ' ')}
                        </span>
                    </div>
                </div>
                
                <div class="agreement-details">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                        <div>
                            <strong>Worker:</strong><br>
                            <span style="color: #fff;">${agreement.workerName}</span>
                        </div>
                        <div>
                            <strong>Status:</strong><br>
                            <span style="color: #fff;">${agreement.status.replace(/_/g, ' ')}</span>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                        <div>
                            <strong>Created:</strong><br>
                            <span style="color: #fff;">${new Date(agreement.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <strong>Start Date:</strong><br>
                            <span style="color: #fff;">${agreement.workTerms?.startDate ? new Date(agreement.workTerms.startDate).toLocaleDateString() : 'Not set'}</span>
                        </div>
                    </div>
                    
                    ${agreement.paymentTerms ? `
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <div>
                                <strong>Payment:</strong><br>
                                <span style="color: var(--accent);">₹${agreement.paymentTerms.amount} ${agreement.paymentTerms.type}</span>
                            </div>
                            <div>
                                <strong>Schedule:</strong><br>
                                <span style="color: #fff;">${agreement.paymentTerms.schedule}</span>
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="agreement-actions" style="display: flex; gap: 8px; flex-wrap: wrap;">
                    <button class="btn btn-ghost" onclick="EmployerDashboard.viewAgreementDetails('${agreement.id}')">
                        👁️ View Details
                    </button>
                    
                    ${agreement.status === 'pending_worker_acceptance' ? `
                        <button class="btn btn-danger" onclick="EmployerDashboard.withdrawAgreement('${agreement.id}')">
                            ❌ Withdraw
                        </button>
                    ` : ''}
                    
                    ${agreement.status === 'active' ? `
                        <button class="btn btn-primary" onclick="EmployerDashboard.showManageAgreementModal('${agreement.id}')">
                            ⚙️ Manage
                        </button>
                        <button class="btn btn-success" onclick="EmployerDashboard.completeAgreement('${agreement.id}')">
                            ✅ Complete
                        </button>
                        <button class="btn btn-danger" onclick="EmployerDashboard.terminateAgreement('${agreement.id}')">
                            🏁 Terminate
                        </button>
                    ` : ''}
                    
                    <button class="btn btn-ghost" onclick="startChatWithUser('${agreement.workerId}', '${agreement.workerName}')">
                        💬 Message
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    console.log('✅ Agreements loaded:', employerAgreements.length);
}
static terminateAgreement(agreementId) {
    console.log('🏁 Terminating agreement:', agreementId);
    
    if (!confirm('Are you sure you want to terminate this agreement? This will end the working relationship with the worker.')) {
        return;
    }
    
    try {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreementIndex = agreements.findIndex(a => a.id === agreementId);
        
        if (agreementIndex === -1) {
            OpusUtils.showNotification('Agreement not found', 'error');
            return;
        }
        
        const agreement = agreements[agreementIndex];
        
        // Update agreement status
        agreements[agreementIndex].status = 'terminated';
        agreements[agreementIndex].terminatedAt = new Date().toISOString();
        agreements[agreementIndex].updatedAt = new Date().toISOString();
        
        // Save the updated agreement
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        
        // Notify worker
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.createNotification(agreement.workerId, 'agreement_terminated', {
                employerName: agreement.employerName,
                jobTitle: agreement.jobTitle,
                agreementId: agreementId
            });
        }
        
        OpusUtils.showNotification('✅ Agreement terminated successfully!', 'success');
        
        // Reload agreements display
        setTimeout(() => {
            this.loadActiveAgreements();
        }, 500);
        
    } catch (error) {
        console.error('❌ Error terminating agreement:', error);
        OpusUtils.showNotification('Failed to terminate agreement', 'error');
    }
}
static withdrawAgreement(agreementId) {
    console.log('🗑️ Withdrawing agreement:', agreementId);
    
    if (!confirm('Are you sure you want to withdraw this agreement? The worker will be notified and the agreement will be cancelled.')) {
        return;
    }
    
    try {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreementIndex = agreements.findIndex(a => a.id === agreementId);
        
        if (agreementIndex === -1) {
            OpusUtils.showNotification('Agreement not found', 'error');
            return;
        }
        
        const agreement = agreements[agreementIndex];
        
        // Only allow withdrawal for pending agreements
        if (agreement.status !== 'pending_worker_acceptance') {
            OpusUtils.showNotification('Cannot withdraw agreement that has already been accepted or is active', 'error');
            return;
        }
        
        // Update agreement status
        agreements[agreementIndex].status = 'withdrawn';
        agreements[agreementIndex].withdrawnAt = new Date().toISOString();
        agreements[agreementIndex].updatedAt = new Date().toISOString();
        
        // Save the updated agreement
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        
        // Update related application if it exists
        const applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
        const applicationIndex = applications.findIndex(app => app.agreementId === agreementId);
        if (applicationIndex !== -1) {
            applications[applicationIndex].status = 'agreement_withdrawn';
            applications[applicationIndex].agreementStatus = 'withdrawn';
            localStorage.setItem('opuslink_applications', JSON.stringify(applications));
        }
        
        // Update related job offer if it exists
        const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
        const offerIndex = jobOffers.findIndex(offer => offer.agreementId === agreementId);
        if (offerIndex !== -1) {
            jobOffers[offerIndex].status = 'agreement_withdrawn';
            jobOffers[offerIndex].agreementStatus = 'withdrawn';
            localStorage.setItem('opuslink_job_offers', JSON.stringify(jobOffers));
        }
        
        // Notify worker
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.createNotification(agreement.workerId, 'agreement_withdrawn', {
                employerName: agreement.employerName,
                jobTitle: agreement.jobTitle,
                agreementId: agreementId
            });
        }
        
        OpusUtils.showNotification('✅ Agreement withdrawn successfully! The worker has been notified.', 'success');
        
        // Reload agreements display
        setTimeout(() => {
            this.loadActiveAgreements();
            this.loadApplications();
        }, 500);
        
    } catch (error) {
        console.error('❌ Error withdrawing agreement:', error);
        OpusUtils.showNotification('Failed to withdraw agreement', 'error');
    }
}
static completeAgreement(agreementId) {
    console.log('✅ Completing agreement:', agreementId);
    
    if (!confirm('Mark this agreement as completed? This will close the agreement and archive it.')) {
        return;
    }
    
    try {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreementIndex = agreements.findIndex(a => a.id === agreementId);
        
        if (agreementIndex === -1) {
            OpusUtils.showNotification('Agreement not found', 'error');
            return;
        }
        
        const agreement = agreements[agreementIndex];
        
        // Update agreement status
        agreements[agreementIndex].status = 'completed';
        agreements[agreementIndex].completedAt = new Date().toISOString();
        agreements[agreementIndex].updatedAt = new Date().toISOString();
        agreements[agreementIndex].workStatus = 'completed';
        
        // Save the updated agreement
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        
        // Notify worker
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.createNotification(agreement.workerId, 'agreement_completed', {
                employerName: agreement.employerName,
                jobTitle: agreement.jobTitle,
                agreementId: agreementId
            });
        }
        
        OpusUtils.showNotification('✅ Agreement marked as completed!', 'success');
        
        // Reload agreements display
        setTimeout(() => {
            this.loadActiveAgreements();
        }, 500);
        
    } catch (error) {
        console.error('❌ Error completing agreement:', error);
        OpusUtils.showNotification('Failed to complete agreement', 'error');
    }
}
    // 🔧 ADD TO EmployerDashboard class
 static showManageAgreementModal(agreementId) {
    const agreement = this.getAgreementById(agreementId);
    if (!agreement) {
        OpusUtils.showNotification('Agreement not found', 'error');
        return;
    }

    const canModify = ['active', 'modification_pending'].includes(agreement.status);
    const canTerminate = ['active', 'termination_pending'].includes(agreement.status);
    const pendingModification = agreement.modificationRequests?.find(m => m.status === 'pending');
    const pendingTermination = agreement.terminationRequests?.find(t => t.status === 'pending');

    const modalContent = `
        <div style="padding: 20px; max-width: 600px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">⚙️ Manage Agreement</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px;">
                    <h4 style="color: #fff; margin: 0 0 8px 0;">${agreement.jobTitle}</h4>
                    <p style="color: var(--muted); margin: 0 0 4px 0;">Worker: ${agreement.workerName}</p>
                    <p style="color: var(--muted); margin: 0;">Status: <span class="status status-${agreement.status}">${agreement.status.replace(/_/g, ' ')}</span></p>
                </div>
            </div>

            ${pendingModification ? `
                <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="color: #f59e0b; margin: 0 0 8px 0;">📝 Modification Request Pending</h4>
                    <p style="color: var(--muted); margin: 0 0 12px 0;">Requested by: ${pendingModification.requestedByName}</p>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-success btn-sm" onclick="EmployerDashboard.respondToModification('${pendingModification.id}', '${agreement.id}', 'accepted')">
                            ✅ Accept Changes
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="EmployerDashboard.respondToModification('${pendingModification.id}', '${agreement.id}', 'rejected')">
                            ❌ Reject Changes
                        </button>
                    </div>
                </div>
            ` : ''}

            ${pendingTermination ? `
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="color: #ef4444; margin: 0 0 8px 0;">🏁 Termination Request Pending</h4>
                    <p style="color: var(--muted); margin: 0 0 12px 0;">Requested by: ${pendingTermination.requestedByName}</p>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-success btn-sm" onclick="EmployerDashboard.respondToTermination('${pendingTermination.id}', '${agreement.id}', 'accepted')">
                            ✅ Accept Termination
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="EmployerDashboard.respondToTermination('${pendingTermination.id}', '${agreement.id}', 'rejected')">
                            ❌ Reject Termination
                        </button>
                    </div>
                </div>
            ` : ''}

            <div style="display: grid; gap: 12px;">
                ${canModify && !pendingModification ? `
                    <button class="btn btn-primary" onclick="EmployerDashboard.showModifyAgreementModal('${agreement.id}')">
                        ✏️ Modify Agreement Terms
                    </button>
                ` : ''}
                
                ${canTerminate && !pendingTermination ? `
                    <button class="btn btn-danger" onclick="EmployerDashboard.showTerminateAgreementModal('${agreement.id}')">
                        🏁 Terminate Agreement
                    </button>
                ` : ''}
                
                <button class="btn btn-ghost" onclick="EmployerDashboard.viewAgreementHistory('${agreement.id}')">
                    📋 View Agreement History
                </button>
            </div>
        </div>
    `;

    OpusUtils.showModal('Manage Agreement', modalContent);
}

// 🔧 UPDATE showModifyAgreementModal method in EmployerDashboard
    static showModifyAgreementModal(agreementId) {
    const agreement = this.getAgreementById(agreementId);
    if (!agreement) return;

    const modalContent = `
        <div style="padding: 20px; max-width: 700px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">✏️ Modify Agreement Terms</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px;">
                    <h4 style="color: #fff; margin: 0 0 8px 0;">${agreement.jobTitle}</h4>
                    <p style="color: var(--muted); margin: 0;">Worker: ${agreement.workerName}</p>
                </div>
            </div>
            
            <form id="modifyAgreementForm">
                <!-- Payment Terms Section -->
                <div style="margin-bottom: 24px;">
                    <h4 style="color: var(--text-primary); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">💰 Payment Terms</h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Payment Amount (₹)</label>
                            <input type="number" id="modifyPaymentAmount" value="${agreement.paymentTerms.amount}" 
                                   style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);"
                                   min="1" step="1000">
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Payment Type</label>
                            <select id="modifyPaymentType" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
                                <option value="hourly" ${agreement.paymentTerms.type === 'hourly' ? 'selected' : ''}>Hourly</option>
                                <option value="daily" ${agreement.paymentTerms.type === 'daily' ? 'selected' : ''}>Daily</option>
                                <option value="weekly" ${agreement.paymentTerms.type === 'weekly' ? 'selected' : ''}>Weekly</option>
                                <option value="monthly" ${agreement.paymentTerms.type === 'monthly' ? 'selected' : ''}>Monthly</option>
                                <option value="fixed" ${agreement.paymentTerms.type === 'fixed' ? 'selected' : ''}>Fixed Project</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-top: 12px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Payment Schedule</label>
                        <select id="modifyPaymentSchedule" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
                            <option value="weekly" ${agreement.paymentTerms.schedule === 'weekly' ? 'selected' : ''}>Weekly</option>
                            <option value="biweekly" ${agreement.paymentTerms.schedule === 'biweekly' ? 'selected' : ''}>Bi-weekly</option>
                            <option value="monthly" ${agreement.paymentTerms.schedule === 'monthly' ? 'selected' : ''}>Monthly</option>
                            <option value="upon_completion" ${agreement.paymentTerms.schedule === 'upon_completion' ? 'selected' : ''}>Upon Completion</option>
                        </select>
                    </div>
                </div>

                <!-- Work Terms Section -->
                <div style="margin-bottom: 24px;">
                    <h4 style="color: var(--text-primary); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">⚙️ Work Terms</h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Work Type</label>
                            <select id="modifyWorkType" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
                                <option value="fulltime" ${agreement.workTerms.workType === 'fulltime' ? 'selected' : ''}>Full-Time</option>
                                <option value="parttime" ${agreement.workTerms.workType === 'parttime' ? 'selected' : ''}>Part-Time</option>
                                <option value="contract" ${agreement.workTerms.workType === 'contract' ? 'selected' : ''}>Contract</option>
                                <option value="freelance" ${agreement.workTerms.workType === 'freelance' ? 'selected' : ''}>Freelance</option>
                                <option value="remote" ${agreement.workTerms.workType === 'remote' ? 'selected' : ''}>Remote</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Work Location</label>
                            <select id="modifyWorkLocation" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
                                <option value="remote" ${agreement.workTerms.location === 'remote' ? 'selected' : ''}>Remote</option>
                                <option value="onsite" ${agreement.workTerms.location === 'onsite' ? 'selected' : ''}>On-Site</option>
                                <option value="hybrid" ${agreement.workTerms.location === 'hybrid' ? 'selected' : ''}>Hybrid</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Weekly Hours</label>
                            <input type="number" id="modifyWeeklyHours" value="${agreement.workTerms.weeklyHours}" 
                                   style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);"
                                   min="1" max="80" step="1">
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Agreement Duration (days)</label>
                            <input type="number" id="modifyAgreementDuration" value="${agreement.workTerms.duration}" 
                                   style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);"
                                   min="1" max="365" step="1">
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Probation Period (days)</label>
                            <input type="number" id="modifyProbationPeriod" value="${agreement.workTerms.probationPeriod}" 
                                   style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);"
                                   min="0" max="90" step="1">
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Notice Period (days)</label>
                            <input type="number" id="modifyNoticePeriod" value="${agreement.workTerms.noticePeriod}" 
                                   style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);"
                                   min="0" max="90" step="1">
                        </div>
                    </div>
                </div>

                <!-- Work Schedule Section -->
                <div style="margin-bottom: 24px;">
                    <h4 style="color: var(--text-primary); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">🕐 Work Schedule</h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Working Days</label>
                            <select id="modifyWorkingDays" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
                                <option value="mon_fri" ${agreement.workTerms.workingDays === 'mon_fri' ? 'selected' : ''}>Monday - Friday</option>
                                <option value="mon_sat" ${agreement.workTerms.workingDays === 'mon_sat' ? 'selected' : ''}>Monday - Saturday</option>
                                <option value="flexible" ${agreement.workTerms.workingDays === 'flexible' ? 'selected' : ''}>Flexible</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Shift Timing</label>
                            <select id="modifyShiftTiming" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
                                <option value="general" ${agreement.workTerms.shiftTiming === 'general' ? 'selected' : ''}>General (9 AM - 6 PM)</option>
                                <option value="morning" ${agreement.workTerms.shiftTiming === 'morning' ? 'selected' : ''}>Morning Shift</option>
                                <option value="evening" ${agreement.workTerms.shiftTiming === 'evening' ? 'selected' : ''}>Evening Shift</option>
                                <option value="night" ${agreement.workTerms.shiftTiming === 'night' ? 'selected' : ''}>Night Shift</option>
                                <option value="flexible" ${agreement.workTerms.shiftTiming === 'flexible' ? 'selected' : ''}>Flexible Timing</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-top: 12px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Overtime Policy</label>
                        <select id="modifyOvertimePolicy" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
                            <option value="paid_1.5x" ${agreement.workTerms.overtimePolicy === 'paid_1.5x' ? 'selected' : ''}>Paid (1.5x rate)</option>
                            <option value="paid_2x" ${agreement.workTerms.overtimePolicy === 'paid_2x' ? 'selected' : ''}>Paid (2x rate)</option>
                            <option value="comp_off" ${agreement.workTerms.overtimePolicy === 'comp_off' ? 'selected' : ''}>Compensatory Off</option>
                            <option value="no_overtime" ${agreement.workTerms.overtimePolicy === 'no_overtime' ? 'selected' : ''}>No Overtime</option>
                        </select>
                    </div>
                </div>

                <!-- Legal Terms Section -->
                <div style="margin-bottom: 24px;">
                    <h4 style="color: var(--text-primary); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">⚖️ Legal Terms</h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Intellectual Property Rights</label>
                            <select id="modifyIPRights" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
                                <option value="employer" ${agreement.legalTerms.ipRights === 'employer' ? 'selected' : ''}>Belongs to Employer</option>
                                <option value="worker" ${agreement.legalTerms.ipRights === 'worker' ? 'selected' : ''}>Belongs to Worker</option>
                                <option value="shared" ${agreement.legalTerms.ipRights === 'shared' ? 'selected' : ''}>Shared Ownership</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Confidentiality</label>
                            <select id="modifyConfidentiality" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
                                <option value="standard" ${agreement.legalTerms.confidentiality === 'standard' ? 'selected' : ''}>Standard Confidentiality</option>
                                <option value="strict" ${agreement.legalTerms.confidentiality === 'strict' ? 'selected' : ''}>Strict Confidentiality</option>
                                <option value="nda_required" ${agreement.legalTerms.confidentiality === 'nda_required' ? 'selected' : ''}>NDA Required</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-group" style="margin-top: 12px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Equipment Provision</label>
                        <select id="modifyEquipmentProvision" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);">
                            <option value="employer_provides" ${agreement.legalTerms.equipmentProvision === 'employer_provides' ? 'selected' : ''}>Employer Provides</option>
                            <option value="worker_provides" ${agreement.legalTerms.equipmentProvision === 'worker_provides' ? 'selected' : ''}>Worker Provides</option>
                            <option value="shared" ${agreement.legalTerms.equipmentProvision === 'shared' ? 'selected' : ''}>Shared Responsibility</option>
                        </select>
                    </div>
                    
                    <div class="form-group" style="margin-top: 12px;">
                        <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Additional Terms</label>
                        <textarea id="modifyAdditionalTerms" 
                                  style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); min-height: 80px;"
                                  placeholder="Any additional terms or special conditions...">${agreement.legalTerms.additionalTerms || ''}</textarea>
                    </div>
                </div>

                <!-- Reason for Modification -->
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Reason for Modification *</label>
                    <textarea id="modifyReason" 
                              style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); min-height: 80px;"
                              placeholder="Explain why you want to modify these agreement terms..." required></textarea>
                </div>
            </form>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                <button class="btn btn-ghost" onclick="OpusUtils.closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="EmployerDashboard.submitModificationRequest('${agreement.id}')">Request Modification</button>
            </div>
        </div>
    `;

    OpusUtils.showModal('Modify Agreement Terms', modalContent);
}

// 🔧 UPDATE submitModificationRequest method
    static submitModificationRequest(agreementId) {
     if (!this.currentUser) {
        this.loadCurrentUser();
    }
    const agreement = this.getAgreementById(agreementId);
    if (!agreement) return;

    // Get all form values
    const modificationData = {
        paymentTerms: {
            amount: parseInt(document.getElementById('modifyPaymentAmount').value),
            type: document.getElementById('modifyPaymentType').value,
            schedule: document.getElementById('modifyPaymentSchedule').value
        },
        workTerms: {
            workType: document.getElementById('modifyWorkType').value,
            location: document.getElementById('modifyWorkLocation').value,
            weeklyHours: parseInt(document.getElementById('modifyWeeklyHours').value),
            duration: parseInt(document.getElementById('modifyAgreementDuration').value),
            probationPeriod: parseInt(document.getElementById('modifyProbationPeriod').value),
            noticePeriod: parseInt(document.getElementById('modifyNoticePeriod').value),
            workingDays: document.getElementById('modifyWorkingDays').value,
            shiftTiming: document.getElementById('modifyShiftTiming').value,
            overtimePolicy: document.getElementById('modifyOvertimePolicy').value
        },
        legalTerms: {
            ipRights: document.getElementById('modifyIPRights').value,
            confidentiality: document.getElementById('modifyConfidentiality').value,
            equipmentProvision: document.getElementById('modifyEquipmentProvision').value,
            additionalTerms: document.getElementById('modifyAdditionalTerms').value
        }
    };

    const reason = document.getElementById('modifyReason').value;

    if (!reason) {
        OpusUtils.showNotification('Please provide a reason for modification', 'error');
        return;
    }

    // Add reason to modification data
    modificationData.reason = reason;

    const request = AgreementManager.requestAgreementModification(
        agreementId, 
        modificationData, 
        { id: this.currentUser.id, name: this.currentUser.fullName, role: 'employer' }
    );

    if (request) {
        OpusUtils.closeModal();
        OpusUtils.showNotification('Modification request sent to worker for approval', 'success');
        
        // Notify worker
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.createNotification(
                agreement.workerId,
                'agreement_modification_request',
                {
                    agreementId: agreementId,
                    jobTitle: agreement.jobTitle,
                    employerName: agreement.employerName,
                    requestId: request.id,
                    changes: 'Multiple agreement terms modified'
                }
            );
        }
    }
}

    static respondToModification(modificationId, agreementId, response) {
    const result = AgreementManager.respondToModification(
        modificationId, 
        agreementId, 
        { status: response, message: `${response} the modification request` },
        { role: 'employer' }
    );

    if (result) {
        OpusUtils.closeModal();
        OpusUtils.showNotification(`Modification request ${response}`, 'success');
        this.showManageAgreementModal(agreementId);
    }
}

    static calculateDaysRemaining(agreement) {
        if (!agreement.endDate) return null;
        
        const endDate = new Date(agreement.endDate);
        const today = new Date();
        const timeDiff = endDate.getTime() - today.getTime();
        const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        return daysRemaining > 0 ? daysRemaining : 0;
    }

    static calculateAgreementProgress(agreement) {
        if (!agreement.startDate || !agreement.endDate) return 0;
        
        const startDate = new Date(agreement.startDate);
        const endDate = new Date(agreement.endDate);
        const today = new Date();
        
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsedDuration = today.getTime() - startDate.getTime();
        
        if (totalDuration <= 0) return 100;
        
        const progress = (elapsedDuration / totalDuration) * 100;
        return Math.min(Math.max(Math.round(progress), 0), 100);
    }

    // Pending Work
static loadPendingWork() {
    console.log('📋 Loading pending work with integrity check...');
    
    // 1. Ensure data integrity
    this.ensureWorkLogsIntegrity();
    
    // 2. Get pending work
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const pendingWork = this.getPendingWorkFallback(currentUser.id);

    const container = document.getElementById('pendingWorkContainer');
    if (!container) {
        console.error('❌ Pending work container not found');
        return;
    }

    if (pendingWork.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <h3>No pending work approvals</h3>
                <p>Work logs from workers will appear here for approval</p>
                <button class="btn btn-primary" onclick="EmployerDashboard.navigateToSection('active-agreements')">
                    View Active Agreements
                </button>
            </div>
        `;
        return;
    }

    // Display pending work with proper event binding
    container.innerHTML = pendingWork.map(work => {
        const amount = this.calculateWorkAmount(work);
        const workLogId = work.id;
        
        return `
            <div class="work-log-card" id="worklog-${workLogId}">
                <div class="work-log-header">
                    <h4>${work.agreement?.jobTitle || 'Unknown Job'}</h4>
                    <span class="work-hours">${work.hours || work.days || 0} ${work.hours ? 'hours' : 'days'}</span>
                </div>
                <div class="work-log-details">
                    <p><strong>Worker:</strong> ${work.agreement?.workerName || 'Unknown Worker'}</p>
                    <p><strong>Date:</strong> ${new Date(work.date || work.createdAt).toLocaleDateString()}</p>
                    <p><strong>Description:</strong> ${work.description || 'No description provided'}</p>
                    <p style="color: var(--accent); font-weight: 600;"><strong>Amount:</strong> ₹${amount}</p>
                </div>
                <div class="work-log-actions">
                    <button class="btn btn-success approve-work-btn" 
                            data-worklog-id="${workLogId}"
                            data-amount="${amount}">
                        ✅ Approve & Pay ₹${amount}
                    </button>
                    <button class="btn btn-danger reject-work-btn" 
                            data-worklog-id="${workLogId}">
                        ❌ Reject
                    </button>
                    <button class="btn btn-ghost chat-work-btn" 
                            data-worker-id="${work.workerId}" 
                            data-worker-name="${work.agreement?.workerName || 'Worker'}">
                        💬 Discuss
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    // Bind event listeners after rendering
    this.bindPendingWorkEvents();
    
    console.log('✅ Pending work displayed:', pendingWork.length, 'items');
}

static bindPendingWorkEvents() {
    console.log('🔗 Binding pending work events...');
    
    const container = document.getElementById('pendingWorkContainer');
    if (!container) {
        console.log('ℹ️ Pending work container not found, skipping event binding');
        return;
    }

    // Remove existing event listeners to prevent duplicates
    container.replaceWith(container.cloneNode(true));
    const newContainer = document.getElementById('pendingWorkContainer');
    
    // Add new event listeners using event delegation
    newContainer.addEventListener('click', (e) => {
        const target = e.target;
        
        // Handle Approve button click
        if (target.classList.contains('approve-work-btn') || target.closest('.approve-work-btn')) {
            const button = target.classList.contains('approve-work-btn') ? target : target.closest('.approve-work-btn');
            const workLogId = button.getAttribute('data-worklog-id');
            const amount = button.getAttribute('data-amount');
            
            console.log('✅ Approve button clicked:', { workLogId, amount });
            e.preventDefault();
            e.stopPropagation();
            
            if (workLogId) {
                this.approveWorkDirect(workLogId);
            } else {
                console.error('❌ No worklog ID found for approve button');
            }
        }
        
        // Handle Reject button click
        else if (target.classList.contains('reject-work-btn') || target.closest('.reject-work-btn')) {
            const button = target.classList.contains('reject-work-btn') ? target : target.closest('.reject-work-btn');
            const workLogId = button.getAttribute('data-worklog-id');
            
            console.log('❌ Reject button clicked:', workLogId);
            e.preventDefault();
            e.stopPropagation();
            
            if (workLogId) {
                this.rejectWork(workLogId);
            }
        }
        
        // Handle Chat button click
        else if (target.classList.contains('chat-work-btn') || target.closest('.chat-work-btn')) {
            const button = target.classList.contains('chat-work-btn') ? target : target.closest('.chat-work-btn');
            const workerId = button.getAttribute('data-worker-id');
            const workerName = button.getAttribute('data-worker-name');
            
            console.log('💬 Chat button clicked:', { workerId, workerName });
            e.preventDefault();
            e.stopPropagation();
            
            if (workerId && workerName && typeof startChatWithUser === 'function') {
                startChatWithUser(workerId, workerName);
            } else {
                console.error('❌ Chat function not available');
                OpusUtils.showNotification('Chat feature is not available', 'error');
            }
        }
    });
    
    console.log('✅ Pending work events bound successfully');
}

// PERMANENT FIX - REPLACE YOUR getPendingWorkFallback METHOD
static getPendingWorkFallback(employerId) {
    console.log('🔍 Getting pending work for employer:', employerId);
    
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    const pendingWork = [];
    
    // Debug info
    console.log('📊 Scanning', agreements.length, 'agreements');
    
    agreements.forEach(agreement => {
        // Check if agreement belongs to this employer
        if (agreement.employerId === employerId) {
            // Ensure workLogs array exists
            if (!agreement.workLogs || !Array.isArray(agreement.workLogs)) {
                agreement.workLogs = [];
                console.log('⚠️ Initialized workLogs for:', agreement.jobTitle);
            }
            
            // Find pending work logs
            agreement.workLogs.forEach(workLog => {
                if (workLog.status === 'pending') {
                    pendingWork.push({
                        ...workLog,
                        agreement: agreement,
                        workerId: agreement.workerId,
                        workerName: agreement.workerName || 'Unknown Worker',
                        jobTitle: agreement.jobTitle,
                        date: workLog.date || workLog.createdAt || new Date().toISOString()
                    });
                }
            });
        }
    });
    
    console.log('✅ Found', pendingWork.length, 'pending work items');
    return pendingWork;
}
// ADD TO EmployerDashboard CLASS - DATA INTEGRITY CHECK
static ensureWorkLogsIntegrity() {
    console.log('🔧 Ensuring work logs data integrity...');
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    
    let fixedCount = 0;
    
    agreements.forEach(agreement => {
        if (agreement.employerId === currentUser?.id) {
            // Ensure workLogs array exists and has proper structure
            if (!agreement.workLogs || !Array.isArray(agreement.workLogs)) {
                agreement.workLogs = [];
                fixedCount++;
            }
            
            // Ensure each work log has required fields
            agreement.workLogs.forEach(workLog => {
                if (!workLog.id) workLog.id = 'worklog_' + Date.now() + '_' + Math.random();
                if (!workLog.status) workLog.status = 'pending';
                if (!workLog.date) workLog.date = new Date().toISOString();
                if (!workLog.createdAt) workLog.createdAt = new Date().toISOString();
            });
        }
    });
    
    // Save fixes
    if (fixedCount > 0) {
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        console.log('✅ Fixed work logs in', fixedCount, 'agreements');
    }
    
    return fixedCount;
}

static calculateWorkAmount(work) {
    const agreement = work.agreement || work;
    let amount = 0;

    // Get the payment terms from the agreement
    const paymentTerms = agreement.paymentTerms;
    
    if (!paymentTerms) {
        console.error('❌ No payment terms found in agreement');
        return '0.00';
    }

    const workDays = work.days || work.hours || 0;
    
    switch (paymentTerms.type) {
        case 'hourly':
            // For hourly: hours * hourly rate
            const hourlyRate = parseFloat(paymentTerms.hourlyRate) || parseFloat(paymentTerms.amount);
            amount = workDays * hourlyRate;
            break;
            
        case 'monthly':
            // For monthly: (monthly salary / working days in month) * days worked
            const monthlySalary = parseFloat(paymentTerms.amount);
            const dailyRate = monthlySalary / 22; // 22 working days per month
            amount = workDays * dailyRate;
            break;
            
        case 'fixed':
            // For fixed project: (total amount / total estimated days) * days worked
            const totalAmount = parseFloat(paymentTerms.amount);
            const totalEstimatedDays = agreement.terms?.duration || 30;
            const perDayRate = totalAmount / totalEstimatedDays;
            amount = workDays * perDayRate;
            break;
            
        case 'milestone':
            // For milestone: use the milestone amount if specified, otherwise calculate daily
            if (work.milestoneAmount) {
                amount = parseFloat(work.milestoneAmount);
            } else {
                const milestoneTotal = parseFloat(paymentTerms.amount);
                const milestoneDays = agreement.terms?.duration || 30;
                amount = (workDays / milestoneDays) * milestoneTotal;
            }
            break;
            
        default:
            // Default fallback calculation
            const defaultRate = parseFloat(paymentTerms.amount) || 2000;
            amount = workDays * defaultRate;
    }

    console.log('💰 Payment calculation:', {
        type: paymentTerms.type,
        amount: paymentTerms.amount,
        days: workDays,
        calculated: amount
    });

    return Math.max(0, amount).toFixed(2);
}

// REPLACE your current approveWorkDirect method with this:
// IN EmployerDashboard CLASS - ENHANCE approveWorkDirect METHOD
static approveWorkDirect(workLogId) {
    console.log('💰 APPROVE WORK DIRECT CALLED for work log:', workLogId);
    
    if (!workLogId) {
        console.error('❌ No work log ID provided');
        OpusUtils.showNotification('Invalid work log', 'error');
        return;
    }

    // Get work log details
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const agreements = this.getAllAgreements();
    
    console.log('🔍 Searching for work log in', agreements.length, 'agreements');
    
    let workLog = null;
    let agreement = null;
    
    for (const agr of agreements) {
        if (agr.workLogs && Array.isArray(agr.workLogs)) {
            const foundWorkLog = agr.workLogs.find(w => w.id === workLogId);
            if (foundWorkLog) {
                workLog = foundWorkLog;
                agreement = agr;
                console.log('✅ Found work log:', workLog);
                console.log('✅ Found agreement:', agreement.jobTitle);
                break;
            }
        }
    }
    
    if (!workLog) {
        console.error('❌ Work log not found with ID:', workLogId);
        OpusUtils.showNotification('Work log not found. It may have been already processed.', 'error');
        return;
    }
    
    if (!agreement) {
        console.error('❌ Agreement not found for work log:', workLogId);
        OpusUtils.showNotification('Associated agreement not found', 'error');
        return;
    }

    // Check if work log is already processed
    if (workLog.status !== 'pending') {
        console.warn('⚠️ Work log already processed with status:', workLog.status);
        OpusUtils.showNotification(`This work has already been ${workLog.status}`, 'info');
        return;
    }

    // Calculate amount
    const amount = this.calculateWorkAmount({...workLog, agreement});
    console.log('💰 Calculated amount:', amount);
    
    if (!amount || amount <= 0) {
        console.error('❌ Invalid amount calculated:', amount);
        OpusUtils.showNotification('Cannot process payment with invalid amount', 'error');
        return;
    }
    
    // Show payment processing modal with proper error handling
    try {
        this.showPaymentProcessingModal(workLogId, agreement, workLog, amount);
    } catch (error) {
        console.error('❌ Error showing payment modal:', error);
        OpusUtils.showNotification('Error opening payment system', 'error');
    }
}


// IN EmployerDashboard CLASS - ENSURE showPaymentProcessingModal PASSES CORRECT DATA
static showPaymentProcessingModal(workLogId, agreement, workLog, amount) {
    console.log('🔄 SHOW PAYMENT PROCESSING MODAL CALLED');
    
    const modal = document.getElementById('paymentProcessingModal');
    const content = document.getElementById('paymentProcessingContent');
    
    if (!modal || !content) {
        console.error('❌ Payment modal elements not found!');
        OpusUtils.showNotification('Payment system error', 'error');
        return;
    }

    // Get payment methods
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const paymentMethods = JSON.parse(localStorage.getItem(`employer_payment_methods_${currentUser.id}`) || '[]');
    
    console.log('📋 Payment methods found:', paymentMethods.length);

    let paymentMethodsHTML = '';
    
    if (paymentMethods.length === 0) {
        paymentMethodsHTML = `
            <div class="no-methods">
                <div style="font-size: 3rem; margin-bottom: 16px;">💳</div>
                <h4 style="color: #fff; margin-bottom: 12px;">No Payment Methods</h4>
                <p style="color: var(--muted); margin-bottom: 20px;">Add a payment method to process payments to workers</p>
                <button class="btn btn-primary" onclick="EmployerDashboard.closePaymentProcessingModal(); EmployerDashboard.navigateToSection('payment-methods');">
                    Add Payment Method
                </button>
            </div>
        `;
    } else {
        paymentMethodsHTML = `
            <div class="payment-methods-options">
                ${paymentMethods.map(pm => `
                    <div class="payment-method-option ${pm.isDefault ? 'selected' : ''}" 
                         onclick="EmployerDashboard.selectPaymentMethod('${pm.id}')">
                        <div class="payment-method-radio">
                            <input type="radio" name="paymentMethod" ${pm.isDefault ? 'checked' : ''} value="${pm.id}">
                        </div>
                        <div class="payment-method-info">
                            <div class="payment-method-name">${pm.displayName}</div>
                            <div class="payment-method-type">${this.formatPaymentMethodType(pm.type)}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="add-new-method">
                <button class="btn btn-ghost" onclick="EmployerDashboard.closePaymentProcessingModal(); EmployerDashboard.navigateToSection('payment-methods');">
                    + Add New Payment Method
                </button>
            </div>
        `;
    }

    content.innerHTML = `
        <div class="payment-details">
            <div class="payment-summary">
                <h4>💰 Payment Summary</h4>
                <div class="payment-info">
                    <div class="payment-row">
                        <span style="color: var(--muted);">Worker:</span>
                        <span style="color: #fff; font-weight: 600;">${agreement.workerName}</span>
                    </div>
                    <div class="payment-row">
                        <span style="color: var(--muted);">Job:</span>
                        <span style="color: #fff; font-weight: 600;">${agreement.jobTitle}</span>
                    </div>
                    <div class="payment-row">
                        <span style="color: var(--muted);">Work Description:</span>
                        <span style="color: #fff;">${workLog.description || 'No description provided'}</span>
                    </div>
                    <div class="payment-row">
                        <span style="color: var(--muted);">Hours/Days:</span>
                        <span style="color: #fff;">${workLog.hours || workLog.days || 0} ${workLog.hours ? 'hours' : 'days'}</span>
                    </div>
                    <div class="payment-row total">
                        <span style="color: #fff; font-size: 1.1rem;">Total Amount:</span>
                        <span class="amount">₹${amount}</span>
                    </div>
                </div>
            </div>
            
            <div class="payment-method-selection">
                <h4>💳 Select Payment Method</h4>
                ${paymentMethodsHTML}
            </div>
            
            <div class="payment-actions" style="margin-top: 20px; display: flex; gap: 12px; justify-content: flex-end;">
                <button class="btn btn-ghost" onclick="EmployerDashboard.closePaymentProcessingModal()">
                    Cancel
                </button>
                <button class="btn btn-primary" onclick="EmployerDashboard.confirmPayment()" 
                        ${paymentMethods.length === 0 ? 'disabled' : ''}>
                    Confirm Payment
                </button>
            </div>
        </div>
    `;
    
    // Store payment data for confirmation
    this.currentPaymentData = {
        workLogId: workLogId,
        agreement: agreement,
        workLog: workLog,
        amount: amount
    };
    
    // Show modal with proper styling
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
    
    console.log('✅ Payment modal displayed');
}

static selectPaymentMethod(paymentMethodId) {
    // Update UI to show selected payment method
    document.querySelectorAll('.payment-method-option').forEach(option => {
        option.classList.remove('selected');
    });
    const selectedOption = document.querySelector(`.payment-method-option input[value="${paymentMethodId}"]`);
    if (selectedOption) {
        selectedOption.parentElement.parentElement.classList.add('selected');
        selectedOption.checked = true;
    }
}

// IN EmployerDashboard CLASS - FIX THE confirmPayment METHOD
static confirmPayment() {
    const selectedPaymentMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (!selectedPaymentMethod) {
        OpusUtils.showNotification('Please select a payment method', 'error');
        return;
    }

    const paymentData = this.currentPaymentData;
    if (!paymentData) {
        OpusUtils.showNotification('Payment data not found', 'error');
        return;
    }

    // Process the payment
    this.processPayment(paymentData, selectedPaymentMethod.value);
}

// FIXED processPayment method
// IN EmployerDashboard CLASS - FIX THE processPayment METHOD
static processPayment(paymentData, paymentMethodId) {
    console.log('💸 PROCESS PAYMENT CALLED:', { paymentData, paymentMethodId });
    
    // Get payment method details
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const paymentMethods = JSON.parse(localStorage.getItem(`employer_payment_methods_${currentUser.id}`) || '[]');
    const paymentMethod = paymentMethods.find(pm => pm.id === paymentMethodId);
    
    if (!paymentMethod) {
        console.error('❌ Payment method not found:', paymentMethodId);
        OpusUtils.showNotification('Payment method not found', 'error');
        return;
    }

    // Show processing notification
    OpusUtils.showNotification(`Processing payment of ₹${paymentData.amount}...`, 'info');
    
    // Simulate payment processing (2 seconds)
    setTimeout(() => {
        try {
            // Complete the payment
            const success = this.completeWorkPayment(
                paymentData.workLogId, 
                paymentData.agreement, 
                paymentData.workLog, 
                paymentData.amount, 
                paymentMethod
            );
            
            if (success) {
                OpusUtils.showNotification(`✅ Payment of ₹${paymentData.amount} processed successfully!`, 'success');
                
                // Close modal and refresh data
                this.closePaymentProcessingModal();
                this.loadPendingWork();
                this.loadPaymentHistory();
                this.loadPaymentStats();
                
                console.log('🎉 Payment process completed successfully');
            } else {
                OpusUtils.showNotification('❌ Failed to process payment', 'error');
            }
            
        } catch (error) {
            console.error('❌ Error in payment processing:', error);
            OpusUtils.showNotification('Error processing payment', 'error');
        }
    }, 2000);
}

static closePaymentProcessingModal() {
    const modal = document.getElementById('paymentProcessingModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    this.currentPaymentData = null;
    console.log('✅ Payment modal closed');
}

// IN EmployerDashboard CLASS - FIX THE completeWorkPayment METHOD
static completeWorkPayment(workLogId, agreement, workLog, amount, paymentMethod) {
    console.log('💰 COMPLETE WORK PAYMENT CALLED:', { workLogId, agreement, workLog, amount, paymentMethod });
    
    const agreements = this.getAllAgreements();
    let workLogFound = false;
    let targetAgreement = null;
    let targetWorkLogIndex = -1;
    
    // Find the work log in agreements
    for (let i = 0; i < agreements.length; i++) {
        const currentAgreement = agreements[i];
        if (currentAgreement.workLogs && Array.isArray(currentAgreement.workLogs)) {
            const workLogIndex = currentAgreement.workLogs.findIndex(w => w.id === workLogId);
            if (workLogIndex !== -1) {
                targetAgreement = currentAgreement;
                targetWorkLogIndex = workLogIndex;
                workLogFound = true;
                break;
            }
        }
    }
    
    if (!workLogFound || !targetAgreement) {
        console.error('❌ Work log not found in any agreement:', workLogId);
        OpusUtils.showNotification('Work log not found', 'error');
        return false;
    }

    try {
        // Create payment record
        const paymentRecord = {
            id: 'payment_' + Date.now(),
            transactionId: 'txn_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
            agreementId: targetAgreement.id,
            workLogId: workLogId,
            workerId: targetAgreement.workerId,
            workerName: targetAgreement.workerName,
            amount: parseFloat(amount),
            paymentMethod: paymentMethod.type,
            paymentMethodId: paymentMethod.id,
            status: 'completed',
            description: workLog.description,
            hours: workLog.hours,
            days: workLog.days,
            processedAt: new Date().toISOString(),
            createdAt: new Date().toISOString()
        };

        console.log('💳 Created payment record:', paymentRecord);

        // Initialize payments array if it doesn't exist
        if (!targetAgreement.payments) {
            targetAgreement.payments = [];
        }
        
        // Add payment to agreement
        targetAgreement.payments.push(paymentRecord);
        
        // Update work log status
        targetAgreement.workLogs[targetWorkLogIndex].status = 'approved';
        targetAgreement.workLogs[targetWorkLogIndex].approvedAt = new Date().toISOString();
        targetAgreement.workLogs[targetWorkLogIndex].paymentId = paymentRecord.id;
        targetAgreement.workLogs[targetWorkLogIndex].amount = parseFloat(amount);
        
        // Update agreement timestamp
        targetAgreement.updatedAt = new Date().toISOString();

        // Save the updated agreements
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        
        console.log('✅ Payment completed successfully:', paymentRecord.transactionId);

        // Notify worker
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.createNotification(targetAgreement.workerId, 'payment_processed', {
                amount: amount,
                employerName: currentUser.companyName || currentUser.fullName,
                jobTitle: targetAgreement.jobTitle,
                paymentId: paymentRecord.id,
                transactionId: paymentRecord.transactionId
            });
        }

        return true;
        
    } catch (error) {
        console.error('❌ Error in completeWorkPayment:', error);
        OpusUtils.showNotification('Failed to process payment', 'error');
        return false;
    }
}

    static getPaymentDetails(agreement, workLog) {
    const paymentTerms = agreement.paymentTerms;
    const units = workLog.days || workLog.hours || 0;
    
    return {
        type: paymentTerms.type,
        baseAmount: paymentTerms.amount,
        units: units,
        calculatedAmount: this.calculateWorkAmount({...workLog, agreement: agreement}),
        description: `${units} ${paymentTerms.type === 'hourly' ? 'hours' : 'days'} at ${paymentTerms.amount}`
    };
}

   static rejectWork(workLogId) {
    console.log('❌ REJECT WORK CALLED for work log:', workLogId);
    
    if (!confirm('Are you sure you want to reject this work? The worker will be notified and will need to resubmit.')) {
        return;
    }
    
    const agreements = this.getAllAgreements();
    let rejected = false;
    let workerName = '';
    
    for (let agreement of agreements) {
        if (agreement.workLogs) {
            const workLogIndex = agreement.workLogs.findIndex(w => w.id === workLogId);
            if (workLogIndex !== -1) {
                agreement.workLogs[workLogIndex].status = 'rejected';
                agreement.workLogs[workLogIndex].rejectedAt = new Date().toISOString();
                agreement.workLogs[workLogIndex].rejectionReason = 'Work rejected by employer';
                
                workerName = agreement.workerName;
                
                // Notify worker
                if (typeof NotificationSystem !== 'undefined') {
                    NotificationSystem.createNotification(agreement.workerId, 'work_rejected', {
                        employerName: agreement.employerName,
                        jobTitle: agreement.jobTitle,
                        workDescription: agreement.workLogs[workLogIndex].description,
                        rejectionReason: 'Work rejected by employer'
                    });
                }
                
                rejected = true;
                break;
            }
        }
    }
    
    if (rejected) {
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        OpusUtils.showNotification(`Work rejected successfully. ${workerName} has been notified.`, 'success');
        
        // Reload pending work
        setTimeout(() => {
            this.loadPendingWork();
        }, 1000);
    } else {
        OpusUtils.showNotification('Work log not found', 'error');
    }
}

static setupPendingWorkEvents() {
    console.log('🔧 Setting up pending work events...');
    
    // Bind events when navigating to pending work section
    const originalNavigateToSection = this.navigateToSection;
    this.navigateToSection = function(sectionId) {
        originalNavigateToSection.call(this, sectionId);
        
        if (sectionId === 'pending-work') {
            // Small delay to ensure DOM is rendered
            setTimeout(() => {
                this.bindPendingWorkEvents();
            }, 100);
        }
    };
}

    // Payment History
    static loadPaymentHistory() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const agreements = this.getAllAgreements();
        const employerAgreements = agreements.filter(a => a.employerId === currentUser.id);
        
        let allPayments = [];
        employerAgreements.forEach(agreement => {
            if (agreement.payments && agreement.payments.length > 0) {
                agreement.payments.forEach(payment => {
                    allPayments.push({
                        ...payment,
                        agreement: agreement,
                        workerName: agreement.workerName,
                        jobTitle: agreement.jobTitle
                    });
                });
            }
        });
        
        allPayments.sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date));
        
        const tableBody = document.getElementById('paymentHistoryTable');
        if (!tableBody) return;

        if (allPayments.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 60px 20px;">
                        <div style="text-align: center; color: var(--muted);">
                            <div style="font-size: 4rem; margin-bottom: 16px;">💰</div>
                            <h3 style="color: #fff; margin-bottom: 12px; font-size: 1.4rem;">No payments yet</h3>
                            <p style="margin-bottom: 24px; font-size: 1rem;">Payments will appear here when you approve work</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = allPayments.map(payment => {
            const paymentDate = payment.createdAt || payment.date || new Date().toISOString();
            const amount = payment.amount || 0;
            
            let statusClass = 'status-processing';
            let statusText = 'Processing';
            let statusIcon = '⏳';
            
            if (payment.status === 'completed') {
                statusClass = 'status-completed';
                statusText = 'Completed';
                statusIcon = '✅';
            } else if (payment.status === 'failed') {
                statusClass = 'status-rejected';
                statusText = 'Failed';
                statusIcon = '❌';
            }

            return `
                <tr>
                    <td>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div class="worker-avatar-small">
                                ${payment.workerName?.charAt(0)?.toUpperCase() || 'W'}
                            </div>
                            <div>
                                <div style="color: #fff; font-weight: 600;">${payment.workerName}</div>
                                <div style="color: var(--muted); font-size: 0.85rem;">Worker</div>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div style="color: #fff; font-weight: 500;">${payment.jobTitle}</div>
                        <div style="color: var(--muted); font-size: 0.85rem;">${payment.hours || 0} hours</div>
                    </td>
                    <td>
                        <div style="color: var(--accent); font-weight: 700; font-size: 1.1rem;">₹${amount.toLocaleString()}</div>
                    </td>
                    <td>
                        <div style="color: #fff; font-weight: 500;">${new Date(paymentDate).toLocaleDateString()}</div>
                    </td>
                    <td>
                        <span class="status ${statusClass}" style="display: inline-flex; align-items: center; gap: 6px;">
                            ${statusIcon} ${statusText}
                        </span>
                    </td>
                    <td>
                        <div style="display: flex; gap: 8px;">
                            <button class="btn btn-ghost btn-sm" onclick="EmployerDashboard.viewPaymentDetails('${payment.id}')">
                                👁️ Details
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    // Worker Browsing
static loadBrowseWorkers() {
    console.log('👥 Loading workers for browsing...');
    
    
    const workers = this.getAllWorkers();
    console.log(`🎯 Displaying ${workers.length} workers`, workers);
    
    // Update results count immediately
    const resultsCount = document.getElementById('resultsCount');
    const workerResultsCount = document.getElementById('workerResultsCount');
    
    if (resultsCount) {
        resultsCount.textContent = `Showing ${workers.length} workers`;
    }
    if (workerResultsCount) {
        workerResultsCount.textContent = `Showing ${workers.length} workers`;
        workerResultsCount.setAttribute('data-translate', 'showing_workers');
    }
    
    if (workers.length === 0) {
        console.log('⚠️ No workers found. Checking data sources...');
        
        // Create sample workers for testing if none exist
        this.createSampleWorkers();
        
        // Reload workers
        const newWorkers = this.getAllWorkers();
        this.displayWorkers(newWorkers);
    } else {
        this.displayWorkers(workers);
    }
}
    static displayWorkers(workers) {
    console.log('🔄 Displaying workers:', workers.length);
    
    const listContainer = document.getElementById('workersListContainer');
    const gridContainer = document.getElementById('workersGridContainer');
    const resultsCount = document.getElementById('resultsCount');
    const workerResultsCount = document.getElementById('workerResultsCount');
    
    // DEBUG: Check if elements exist
    console.log('📋 Container check:', {
        listContainer: !!listContainer,
        gridContainer: !!gridContainer,
        resultsCount: !!resultsCount,
        workerResultsCount: !!workerResultsCount
    });
    
    if (!listContainer || !gridContainer) {
        console.error('❌ Missing containers!');
        return;
    }

    // UPDATE BOTH COUNT ELEMENTS
    const countText = `Showing ${workers.length} workers`;
    
    if (resultsCount) {
        resultsCount.textContent = countText;
        console.log('✅ Updated resultsCount:', countText);
    }
    if (workerResultsCount) {
        workerResultsCount.textContent = countText;
        workerResultsCount.setAttribute('data-translate', 'showing_workers');
        console.log('✅ Updated workerResultsCount:', countText);
    }

    if (workers.length === 0) {
        console.log('⚠️ No workers to display');
        const emptyState = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <h3>No workers found</h3>
                <p>Try adjusting your search filters</p>
            </div>
        `;
        listContainer.innerHTML = emptyState;
        gridContainer.innerHTML = emptyState;
        return;
    }

    console.log('🎨 Rendering worker items...');
    listContainer.innerHTML = workers.map(worker => this.createWorkerListItem(worker)).join('');
    gridContainer.innerHTML = workers.map(worker => this.createWorkerGridItem(worker)).join('');

    this.setView(this.currentView);
    console.log('✅ Workers display completed');
}

static setView(viewType) {
    this.currentView = viewType;
    
    const listContainer = document.getElementById('workersListContainer');
    const gridContainer = document.getElementById('workersGridContainer');
    
    // Add null checks
    if (!listContainer || !gridContainer) {
        console.log('ℹ️ View containers not found (might not be on browse-workers page)');
        return;
    }

    if (viewType === 'list') {
        listContainer.style.display = 'block';
        gridContainer.style.display = 'none';
    } else {
        listContainer.style.display = 'none';
        gridContainer.style.display = 'grid';
    }
    
    // Safe query selector
    document.querySelectorAll('.view-toggle-btn').forEach(btn => {
        if (btn.getAttribute('data-view') === viewType) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

static createWorkerListItem(worker) {
    // Use mapped data
    const mappedWorker = this.mapWorkerData(worker);
    const skills = mappedWorker.skills.slice(0, 3);
    
    return `
        <div class="worker-item card-style">
            <div style="display: flex; align-items: center; gap: 12px;">
                <div class="worker-avatar-small">
                    ${mappedWorker.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                
                <div style="flex: 1;">
                    <div style="font-weight: 700; color: #fff; margin-bottom: 4px;">${mappedWorker.fullName || 'Unknown Worker'}</div>
                    <div style="display: flex; gap: 12px; font-size: 0.85rem; color: var(--muted); margin-bottom: 6px;">
                        <span>${this.formatCategory(mappedWorker.jobCategory)}</span>
                        <span>📍 ${mappedWorker.preferredLocation}</span>
                        <span>${this.formatExperience(mappedWorker.experienceLevel)}</span>
                    </div>
                    ${skills.length > 0 ? `
                        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                            ${skills.map(skill => `
                                <span class="skill-tag">${skill}</span>
                            `).join('')}
                            ${mappedWorker.skills.length > 3 ? `
                                <span class="skill-tag">+${mappedWorker.skills.length - 3} more</span>
                            ` : ''}
                        </div>
                    ` : ''}
                </div>
                
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary" onclick="EmployerDashboard.viewWorkerProfile('${mappedWorker.id}')">
                        View
                    </button>
                    <button class="btn btn-ghost" onclick="EmployerDashboard.offerJob('${mappedWorker.id}')">
                        Offer
                    </button>
                </div>
            </div>
        </div>
    `;
}

static createWorkerGridItem(worker) {
    // Use mapped data
    const mappedWorker = this.mapWorkerData(worker);
    const skills = mappedWorker.skills.slice(0, 4);
    
    return `
        <div class="worker-card">
            <div class="worker-card-header">
                <div class="worker-avatar">
                    ${mappedWorker.fullName?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                    <div class="worker-name">${mappedWorker.fullName || 'Unknown Worker'}</div>
                    <div class="worker-category">${this.formatCategory(mappedWorker.jobCategory)}</div>
                    <div class="worker-location">${mappedWorker.preferredLocation}</div>
                </div>
            </div>
            
            <div class="worker-stats">
                <div class="stat">
                    <div class="stat-value">${this.getExperienceYears(mappedWorker.experienceLevel)}+</div>
                    <div class="stat-label">Years</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${mappedWorker.expectedSalary || 'Negotiable'}</div>
                    <div class="stat-label">Expected</div>
                </div>
                <div class="stat">
                    <div class="stat-value">${this.formatWorkType(mappedWorker.workType)}</div>
                    <div class="stat-label">Availability</div>
                </div>
            </div>
            
            ${skills.length > 0 ? `
                <div class="worker-skills">
                    <div class="skills-label">Skills</div>
                    <div class="skills-list">
                        ${skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                        ${mappedWorker.skills.length > 4 ? `<span class="skill-tag">+${mappedWorker.skills.length - 4}</span>` : ''}
                    </div>
                </div>
            ` : ''}
            
            <div class="worker-actions">
                <button class="btn btn-primary" onclick="EmployerDashboard.viewWorkerProfile('${mappedWorker.id}')">
                    View Profile
                </button>
                <button class="btn btn-ghost" onclick="EmployerDashboard.offerJob('${mappedWorker.id}')">
                    Offer Job
                </button>
            </div>
        </div>
    `;
}
    // ADD THESE METHODS: Data mapping for worker display
static mapWorkerData(worker) {
    console.log('🔍 Mapping worker data:', worker);
    
    // Validate required fields
    if (!worker || !worker.id) {
        console.warn('❌ Invalid worker data:', worker);
        return null; // Return null for invalid workers
    }

    // Get worker name with fallbacks
    const fullName = worker.fullName || worker.name || worker.username || 'Unknown Worker';
    
    // Only proceed if we have a real name
    if (fullName === 'Unknown Worker') {
        console.warn('⚠️ Worker has no name:', worker);
        return null; // Skip workers with no name
    }

    // Map the actual worker data to expected fields
    const mappedWorker = {
        id: worker.id,
        fullName: fullName,
        // Map category/profession with better fallbacks
        jobCategory: worker.profession || worker.jobCategory || worker.category || this.extractCategoryFromSkills(worker.skills) || 'General',
        // Map experience with better detection
        experienceLevel: this.extractExperienceLevel(worker.experience || worker.experienceLevel),
        // Map work type (default to fulltime)
        workType: worker.workType || worker.employmentType || 'fulltime',
        // Map location with better fallbacks
        preferredLocation: worker.location || worker.preferredLocation || worker.city || 'Location not specified',
        // Map skills - ensure it's always an array
        skills: Array.isArray(worker.skills) ? worker.skills : 
               (typeof worker.skills === 'string' ? worker.skills.split(',').map(s => s.trim()) : []),
        // Map salary
        expectedSalary: worker.expectedSalary || worker.salary || 'Negotiable',
        // Map education
        education: worker.education || worker.qualification || '',
        // Map bio/description
        bio: worker.bio || worker.description || worker.about || '',
        // Contact info
        email: worker.email || '',
        phone: worker.phone || '',
        // Availability
        isAvailable: worker.isAvailable !== false,
        // Keep original for reference
        _original: worker
    };

    // Filter out workers with obviously fake or missing data
    if (this.isInvalidWorker(mappedWorker)) {
        console.warn('🚫 Filtering out invalid worker:', mappedWorker);
        return null;
    }

    console.log('✅ Mapped worker:', mappedWorker.fullName);
    return mappedWorker;
}

static isInvalidWorker(worker) {
    // Skip workers with obviously placeholder data
    const invalidPatterns = [
        'Unknown Worker',
        'Test Worker',
        'Example Worker',
        'Placeholder'
    ];

    if (invalidPatterns.some(pattern => worker.fullName.includes(pattern))) {
        return true;
    }

    // Skip workers with no skills and no category
    if ((!worker.skills || worker.skills.length === 0) && worker.jobCategory === 'General') {
        return true;
    }

    // Skip workers with no contact info and no bio
    if (!worker.email && !worker.phone && !worker.bio) {
        return true;
    }

    return false;
}

static extractCategoryFromSkills(skills) {
    if (!skills || !Array.isArray(skills) || skills.length === 0) {
        return 'General';
    }
    
    const skillString = skills.join(' ').toLowerCase();
    
    // Tech & IT
    if (skillString.includes('javascript') || skillString.includes('python') || skillString.includes('java') || 
        skillString.includes('developer') || skillString.includes('programming') || skillString.includes('software') ||
        skillString.includes('web') || skillString.includes('app') || skillString.includes('code')) {
        return 'tech';
    }
    // Healthcare
    else if (skillString.includes('nurse') || skillString.includes('medical') || skillString.includes('health') || 
             skillString.includes('patient') || skillString.includes('care') || skillString.includes('hospital')) {
        return 'healthcare';
    }
    // Skilled Trades
    else if (skillString.includes('electric') || skillString.includes('plumb') || skillString.includes('carpent') || 
             skillString.includes('welder') || skillString.includes('mechanic') || skillString.includes('construction')) {
        return 'skilled-trades';
    }
    // Manufacturing
    else if (skillString.includes('manufactur') || skillString.includes('factory') || skillString.includes('production') || 
             skillString.includes('assembly') || skillString.includes('machine')) {
        return 'manufacturing';
    }
    // Hospitality
    else if (skillString.includes('hotel') || skillString.includes('restaurant') || skillString.includes('chef') || 
             skillString.includes('hospitality') || skillString.includes('cook') || skillString.includes('service')) {
        return 'hospitality';
    }
    // Corporate
    else if (skillString.includes('office') || skillString.includes('admin') || skillString.includes('reception') || 
             skillString.includes('account') || skillString.includes('management') || skillString.includes('executive')) {
        return 'corporate';
    }
    // Retail
    else if (skillString.includes('sales') || skillString.includes('retail') || skillString.includes('store') || 
             skillString.includes('cashier') || skillString.includes('customer')) {
        return 'retail';
    }
    // Education
    else if (skillString.includes('teach') || skillString.includes('education') || skillString.includes('school') || 
             skillString.includes('professor') || skillString.includes('train')) {
        return 'education';
    }
    
    return 'General';
}

static extractExperienceLevel(experience) {
    if (!experience) return 'mid';
    
    if (typeof experience === 'string') {
        const experienceLower = experience.toLowerCase();
        
        // Handle text-based experience levels
        if (experienceLower.includes('entry') || experienceLower.includes('fresher') || experienceLower.includes('beginner')) {
            return 'entry';
        }
        if (experienceLower.includes('senior') || experienceLower.includes('expert') || experienceLower.includes('lead')) {
            return 'senior';
        }
        if (experienceLower.includes('mid') || experienceLower.includes('intermediate')) {
            return 'mid';
        }
        
        // Extract years from string
        const yearsMatch = experience.match(/(\d+)/);
        if (yearsMatch) {
            const years = parseInt(yearsMatch[1]);
            if (years <= 2) return 'entry';
            if (years <= 5) return 'mid';
            return 'senior';
        }
    }
    
    // Default to mid-level for unknown cases
    return 'mid';
}

static searchWorkers() {
    // Check if we're actually on the browse-workers section
    const browseSection = document.getElementById('browse-workers');
    if (!browseSection || browseSection.style.display === 'none') {
        console.log('ℹ️ Browse workers section not active, skipping search');
        return;
    }
    
    const workers = this.getFilteredWorkers();
    this.displayWorkers(workers);
}

static getFilteredWorkers() {
    // SAFELY get filter values with null checks
    const searchTerm = document.getElementById('workerSearch')?.value?.toLowerCase() || '';
    const categoryFilter = document.getElementById('filterCategory')?.value || '';
    const experienceFilter = document.getElementById('filterExperience')?.value || '';
    const workTypeFilter = document.getElementById('filterWorkType')?.value || '';
    
    let workers = this.getAllWorkers();
    
    if (searchTerm) {
        workers = workers.filter(worker => 
            worker.fullName?.toLowerCase().includes(searchTerm) ||
            (worker.skills && worker.skills.some(skill => skill.toLowerCase().includes(searchTerm))) ||
            (worker.jobCategory && this.formatCategory(worker.jobCategory).toLowerCase().includes(searchTerm))
        );
    }
    
    if (categoryFilter) {
        workers = workers.filter(worker => worker.jobCategory === categoryFilter);
    }
    
    if (experienceFilter) {
        workers = workers.filter(worker => worker.experienceLevel === experienceFilter);
    }
    
    if (workTypeFilter) {
        workers = workers.filter(worker => worker.workType === workTypeFilter);
    }
    
    return workers;
}

static clearFilters() {
    // Safely clear filters if they exist
    const workerSearch = document.getElementById('workerSearch');
    const filterCategory = document.getElementById('filterCategory');
    const filterExperience = document.getElementById('filterExperience');
    const filterWorkType = document.getElementById('filterWorkType');
    
    if (workerSearch) workerSearch.value = '';
    if (filterCategory) filterCategory.value = '';
    if (filterExperience) filterExperience.value = '';
    if (filterWorkType) filterWorkType.value = '';
    
    this.loadBrowseWorkers();
    OpusUtils.showNotification('All filters cleared', 'info');
}

    static viewWorkerProfile(workerId) {
        const worker = this.getAllUsers().find(u => u.id === workerId);
        if (worker) {
            const modal = document.getElementById('applicationModal');
            const modalContent = document.getElementById('applicationModalContent');
            
            modalContent.innerHTML = `
                <div>
                    <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 20px;">
                        <div class="worker-avatar" style="width: 80px; height: 80px; font-size: 2rem;">
                            ${worker.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 style="color: #fff; margin-bottom: 4px;">${worker.fullName}</h3>
                            <div style="color: var(--accent); font-weight: 600; margin-bottom: 4px;">
                                ${this.formatCategory(worker.jobCategory)}
                            </div>
                            <div style="color: var(--muted);">${worker.preferredLocation || 'Location not specified'}</div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                        <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px;">
                            <div style="color: var(--muted); font-size: 0.9rem;">Experience</div>
                            <div style="color: #fff; font-weight: 600;">${this.formatExperience(worker.experienceLevel)}</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px;">
                            <div style="color: var(--muted); font-size: 0.9rem;">Expected Salary</div>
                            <div style="color: #fff; font-weight: 600;">${worker.expectedSalary ? '₹' + worker.expectedSalary + '/month' : 'Negotiable'}</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px;">
                            <div style="color: var(--muted); font-size: 0.9rem;">Work Type</div>
                            <div style="color: #fff; font-weight: 600;">${this.formatWorkType(worker.workType)}</div>
                        </div>
                        <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 8px;">
                            <div style="color: var(--muted); font-size: 0.9rem;">Status</div>
                            <div style="color: var(--success); font-weight: 600;">Available</div>
                        </div>
                    </div>
                    
                    ${worker.bio ? `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #fff; margin-bottom: 8px;">About</h4>
                            <div style="color: var(--muted); line-height: 1.5;">${worker.bio}</div>
                        </div>
                    ` : ''}
                    
                    ${worker.skills && worker.skills.length > 0 ? `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #fff; margin-bottom: 8px;">Skills</h4>
                            <div class="skills-list">
                                ${worker.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${worker.education ? `
                        <div style="margin-bottom: 20px;">
                            <h4 style="color: #fff; margin-bottom: 8px;">Education</h4>
                            <div style="color: var(--muted);">${worker.education}</div>
                        </div>
                    ` : ''}
                    
                    <div class="form-actions">
                        <button class="btn btn-primary" onclick="EmployerDashboard.offerJob('${worker.id}')">
                            Offer Job
                        </button>
                        <button class="btn btn-ghost" onclick="EmployerDashboard.contactWorker('${worker.id}')">
                            Send Message
                        </button>
                    </div>
                </div>
            `;
            
            modal.style.display = 'flex';
        }
    }

    static offerJob(workerId) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const worker = this.getAllUsers().find(u => u.id === workerId);
        
        if (!worker) {
            OpusUtils.showNotification('Worker not found', 'error');
            return;
        }

        // Get employer's active jobs
        const employerJobs = this.getEmployerJobs(currentUser.id);
        const activeJobs = employerJobs.filter(job => job.status === 'active');
        
        if (activeJobs.length === 0) {
            OpusUtils.showNotification('Please create a job first before offering', 'warning');
            this.navigateToSection('post-job');
            return;
        }

        this.showJobOfferModal(workerId, worker, activeJobs);
    }

    static showJobOfferModal(workerId, worker, jobs) {
        const modalContent = `
            <div style="max-width: 500px;">
                <h3>Offer Job to ${worker.fullName}</h3>
                <p style="color: var(--muted); margin-bottom: 20px;">
                    Select which job you want to offer to ${worker.fullName}
                </p>
                
                <div class="job-offer-list" style="max-height: 300px; overflow-y: auto; margin-bottom: 20px;">
                    ${jobs.map(job => `
                        <div class="job-offer-item" 
                             onclick="EmployerDashboard.selectJobForOffer('${workerId}', '${job.id}')"
                             style="border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; margin-bottom: 12px; cursor: pointer; transition: all 0.2s;">
                                <div style="font-weight: 600; color: #fff; margin-bottom: 4px;">${job.title}</div>
                                <div style="color: var(--muted); font-size: 0.9rem;">
                                    📍 ${job.location} • 🕒 ${this.formatType(job.type)} • 💰 ${job.salary}
                                </div>
                                <div style="color: var(--muted); font-size: 0.8rem; margin-top: 8px; line-height: 1.4;">
                                    ${job.description?.substring(0, 100)}...
                                </div>
                                <div style="color: var(--accent); font-size: 0.8rem; margin-top: 8px;">
                                    ✅ Click to offer this job
                                </div>
                        </div>
                    `).join('')}
                </div>
                
                ${jobs.length === 0 ? `
                    <div style="text-align: center; padding: 40px; color: var(--muted);">
                        <div style="font-size: 3rem; margin-bottom: 16px;">💼</div>
                        <h4>No active jobs</h4>
                        <p>Create a job first to make offers</p>
                        <button class="btn btn-primary" onclick="EmployerDashboard.navigateToSection('post-job'); OpusUtils.closeModal();" style="margin-top: 16px;">
                            Create New Job
                        </button>
                    </div>
                ` : `
                    <div style="text-align: center; color: var(--muted); font-size: 0.9rem;">
                        ${jobs.length} active job${jobs.length !== 1 ? 's' : ''} available to offer
                    </div>
                `}
            </div>
        `;

        OpusUtils.showModal(`Offer Job to ${worker.fullName}`, modalContent);
    }

    static selectJobForOffer(workerId, jobId) {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const worker = this.getAllUsers().find(u => u.id === workerId);
        const job = this.getAllJobs().find(j => j.id === jobId);
        
        if (!worker || !job) {
            OpusUtils.showNotification('Error creating job offer', 'error');
            return;
        }

        // Create job offer
        const jobOffer = {
            id: 'offer_' + Date.now(),
            jobId: jobId,
            jobTitle: job.title,
            jobDescription: job.description,
            jobSalary: job.salary,
            jobLocation: job.location,
            jobType: job.type,
            jobCategory: job.category,
            employerId: currentUser.id,
            employerName: currentUser.companyName || currentUser.fullName,
            employerEmail: currentUser.email,
            workerId: workerId,
            workerName: worker.fullName,
            workerEmail: worker.email,
            status: 'pending',
            offerDate: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            message: `You have been offered the position of ${job.title} by ${currentUser.companyName || currentUser.fullName}. The role is ${job.type} based in ${job.location} with compensation of ${job.salary}.`,
            employerMessage: '' // Optional custom message
        };

        // Save job offer
        const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
        jobOffers.push(jobOffer);
        localStorage.setItem('opuslink_job_offers', JSON.stringify(jobOffers));

        // Create notification for worker
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.createNotification(workerId, 'job_offer', {
                employerName: currentUser.companyName || currentUser.fullName,
                jobTitle: job.title,
                offerId: jobOffer.id,
                salary: job.salary,
                location: job.location,
                type: job.type
            });
        }

        // Update job stats
        job.offersSent = (job.offersSent || 0) + 1;
        this.saveJob(job);

        OpusUtils.showNotification(`🎉 Job offer sent to ${worker.fullName}! They will be notified.`, 'success');
        OpusUtils.closeModal();
    }

    static contactWorker(workerId) {
        const worker = this.getAllUsers().find(u => u.id === workerId);
        if (worker) {
            OpusUtils.showNotification(`Message sent to ${worker.fullName}`, 'success');
        }
    }

    // Notification System
static initializeNotifications() {
    console.log('🔔 Initializing employer notifications...');
    
    // Check if NotificationSystem exists
    if (typeof NotificationSystem === 'undefined') {
        console.error('❌ NotificationSystem not found!');
        return;
    }
    
    try {
        // Initialize notification system
        NotificationSystem.init();
        
        // Update badge immediately
        NotificationSystem.updateNotificationBadge();
        
        // Set up periodic updates
        setInterval(() => {
            NotificationSystem.updateNotificationBadge();
        }, 30000); // Update every 30 seconds
        
        console.log('✅ Employer notifications initialized');
    } catch (error) {
        console.error('Error initializing notifications:', error);
    }
}
static setupNotificationClick() {
    const btn = document.getElementById('notificationBtn');
    const dropdown = document.getElementById('notificationDropdown');
    
    if (!btn || !dropdown) {
        console.log('Notification elements not found in employer dashboard');
        return;
    }

    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isVisible = dropdown.style.display === 'block';
        dropdown.style.display = isVisible ? 'none' : 'block';
        
        if (!isVisible) {
            this.loadRealNotifications();
        }
    });

    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
            dropdown.style.display = 'none';
        }
    });
}

static loadRealNotifications() {
    if (typeof NotificationSystem === 'undefined') return;
    
    const container = document.getElementById('notificationsContainer');
    if (!container) return;

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;

    const notifications = NotificationSystem.getForUser(currentUser.id);
    
    if (notifications.length === 0) {
        container.innerHTML = `
            <div style="padding: 40px 20px; text-align: center; color: var(--muted);">
                <div style="font-size: 3rem; margin-bottom: 16px;">🔔</div>
                <h4 style="color: var(--text-primary); margin-bottom: 8px;">No notifications</h4>
                <p>You're all caught up!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = notifications.map(notif => `
        <div class="notification-item ${notif.read ? 'read' : 'unread'}" 
             onclick="EmployerDashboard.handleRealNotificationClick('${notif.id}')"
             style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: background 0.2s;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                <strong style="color: var(--text-primary); flex: 1;">${notif.title}</strong>
                ${!notif.read ? '<span style="color: var(--accent); font-size: 0.8rem;">●</span>' : ''}
            </div>
            <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 8px; line-height: 1.4;">
                ${notif.message}
            </div>
            <div style="color: var(--muted); font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                <span>${this.formatTime(notif.timestamp)}</span>
                ${!notif.read ? `
                    <button onclick="event.stopPropagation(); EmployerDashboard.markRealNotificationAsRead('${notif.id}')" 
                            style="background: var(--accent); color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; cursor: pointer;">
                        Mark read
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
}

static handleRealNotificationClick(notificationId) {
    if (typeof NotificationSystem !== 'undefined') {
        NotificationSystem.markAsRead(notificationId);
        this.loadRealNotifications();
    }
    
    const dropdown = document.getElementById('notificationDropdown');
    if (dropdown) {
        dropdown.style.display = 'none';
    }
}

static markRealNotificationAsRead(notificationId) {
    if (typeof NotificationSystem !== 'undefined' && NotificationSystem.markAsRead(notificationId)) {
        this.loadRealNotifications();
        OpusUtils.showNotification('Notification marked as read', 'success');
    }
}
    static updateNotificationBadge() {
        const badge = document.getElementById('notificationBadge');
        if (!badge) return;
        
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) return;
        
        const notifications = NotificationSystem.getForUser(currentUser.id);
        const unreadCount = notifications.filter(notif => !notif.read).length;
        
        badge.textContent = unreadCount;
        badge.style.display = unreadCount > 0 ? 'flex' : 'none';
    }

    // Wallet Methods
    static showWallet() {
        WalletManager.showWalletModal();
    }

    // Utility Methods
    static formatType(type) {
        const types = {
            'fulltime': 'Full-Time',
            'parttime': 'Part-Time',
            'contract': 'Contract',
            'freelance': 'Freelance',
            'internship': 'Internship',
            'remote': 'Remote'
        };
        return types[type] || type;
    }

    static formatCategory(category) {
        const categories = {
            'tech': 'Tech & IT',
            'corporate': 'Corporate & Office',
            'skilled-trades': 'Skilled Trades',
            'healthcare': 'Healthcare',
            'hospitality': 'Hospitality',
            'education': 'Education',
            'retail': 'Retail',
            'creative': 'Creative & Media',
            'manufacturing': 'Manufacturing',
            'home-services': 'Home Services',
            'other': 'Other'
        };
        return categories[category] || category;
    }

    static formatExperience(level) {
        const levels = {
            'entry': 'Entry Level',
            'mid': 'Mid Level',
            'senior': 'Senior Level'
        };
        return levels[level] || level;
    }

    static formatWorkType(type) {
        const types = {
            'fulltime': 'Full-Time',
            'parttime': 'Part-Time',
            'contract': 'Contract',
            'freelance': 'Freelance',
            'remote': 'Remote'
        };
        return types[type] || type;
    }

    static getExperienceYears(level) {
        const years = {
            'entry': '0-2',
            'mid': '3-5',
            'senior': '5+'
        };
        return years[level] || '2-4';
    }

    static getApplicationStatusClass(status) {
        const classes = {
            'pending': 'status-pending',
            'accepted': 'status-approved',
            'rejected': 'status-rejected'
        };
        return classes[status] || 'status-pending';
    }

    static getApplicationStatusText(status) {
        const texts = {
            'pending': 'Pending',
            'accepted': 'Accepted',
            'rejected': 'Rejected'
        };
        return texts[status] || 'Pending';
    }

    static getJobStatusBadge(status) {
        const badges = {
            'active': { class: 'status-approved', text: 'Active' },
            'closed': { class: 'status-rejected', text: 'Closed' },
            'filled': { class: 'status-completed', text: 'Filled' }
        };
        return badges[status] || { class: 'status-pending', text: 'Draft' };
    }

    static formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        
        return date.toLocaleDateString();
    }

    static closeModal() {
        const modal = document.getElementById('applicationModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    static logout() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    // Cleaned up methods - removed debug functionality
    static loadJobOffers() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
    const employerOffers = jobOffers.filter(offer => offer.employerId === currentUser.id);
    
    const container = document.getElementById('jobOffersContainer');
    if (!container) return;

    if (employerOffers.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📨</div>
                <h3>No job offers sent</h3>
                <p>Job offers you send to workers will appear here</p>
            </div>
        `;
        return;
    }

    container.innerHTML = employerOffers.map(offer => {
        const statusClass = offer.status === 'accepted' ? 'status-approved' : 
                           offer.status === 'rejected' ? 'status-rejected' : 'status-pending';
        const statusText = offer.status === 'accepted' ? 'Accepted' : 
                          offer.status === 'rejected' ? 'Rejected' : 'Pending';
        
        return `
            <div class="job-offer-item">
                <div style="display: flex; justify-content: space-between; align-items: start;">
                    <div style="flex: 1;">
                        <h4 style="color: #fff; margin-bottom: 8px;">${offer.jobTitle}</h4>
                        <div style="color: var(--muted); margin-bottom: 8px;">
                            <strong>Offered to:</strong> ${offer.workerName}<br>
                            <strong>Date:</strong> ${new Date(offer.offerDate).toLocaleDateString()}<br>
                            <strong>Salary:</strong> ${offer.jobSalary}<br>
                            <strong>Location:</strong> ${offer.jobLocation}
                        </div>
                        ${offer.employerMessage ? `
                            <div style="background: rgba(255,255,255,0.05); padding: 8px; border-radius: 4px; margin-top: 8px;">
                                <strong>Your Message:</strong> ${offer.employerMessage}
                            </div>
                        ` : ''}
                    </div>
                    <div style="text-align: right;">
                        <span class="status ${statusClass}" style="display: block; margin-bottom: 8px;">${statusText}</span>
                        ${offer.status === 'pending' ? `
                            <button class="btn btn-danger btn-sm" onclick="EmployerDashboard.withdrawJobOffer('${offer.id}')">
                                Withdraw
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ADD: Job Offer Withdrawal
static withdrawJobOffer(offerId) {
    if (!confirm('Are you sure you want to withdraw this job offer?')) {
        return;
    }

    const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
    const offerIndex = jobOffers.findIndex(offer => offer.id === offerId);
    
    if (offerIndex !== -1) {
        const offer = jobOffers[offerIndex];
        jobOffers.splice(offerIndex, 1);
        localStorage.setItem('opuslink_job_offers', JSON.stringify(jobOffers));

        // Notify worker
        NotificationSystem.createNotification(offer.workerId, 'job_offer_withdrawn', {
            employerName: offer.employerName,
            jobTitle: offer.jobTitle
        });

        OpusUtils.showNotification('Job offer withdrawn successfully', 'success');
        this.loadJobOffers();
    }
}

// ADD: Agreement Extension
static extendAgreement(agreementId) {
    const agreements = this.getAllAgreements();
    const agreementIndex = agreements.findIndex(a => a.id === agreementId);
    
    if (agreementIndex === -1) {
        OpusUtils.showNotification('Agreement not found', 'error');
        return;
    }

    const agreement = agreements[agreementIndex];
    const newEndDate = new Date(agreement.endDate);
    newEndDate.setDate(newEndDate.getDate() + 30); // Extend by 30 days

    agreements[agreementIndex].endDate = newEndDate.toISOString();
    agreements[agreementIndex].terms.duration += 30;
    agreements[agreementIndex].updatedAt = new Date().toISOString();

    localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));

    // Notify worker
    NotificationSystem.createNotification(agreement.workerId, 'agreement_extended', {
        employerName: agreement.employerName,
        jobTitle: agreement.jobTitle,
        newEndDate: newEndDate.toLocaleDateString()
    });

    OpusUtils.showNotification('Agreement extended by 30 days!', 'success');
    this.closeModal();
    this.loadActiveAgreements();
}
    // Placeholder methods for future implementation
// IN WorkerDashboard CLASS - FIX viewAgreementDetails METHOD
static viewAgreementDetails(agreementId) {
    console.log('👁️ Employer viewing agreement details:', agreementId);
    
    const agreement = this.getAgreementById(agreementId);
    if (agreement) {
        // Use the agreement ID directly for employer view
        this.showAgreementDetailsModal(agreement);
    } else {
        console.error('❌ Agreement not found:', agreementId);
        OpusUtils.showNotification('Agreement not found', 'error');
    }
}
static getAgreementById(agreementId) {
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    return agreements.find(a => a.id === agreementId);
}

static showDirectAgreementDetails(agreement) {
    const modalContent = `
        <div style="padding: 20px; max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">📝 Agreement Details</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            ${this.generateAgreementDetailsContent(agreement)}
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="btn btn-ghost" onclick="OpusUtils.closeModal()">
                        Close
                    </button>
                    ${agreement.status === 'pending_worker_acceptance' ? `
                        <button class="btn btn-danger" onclick="EmployerDashboard.withdrawAgreement('${agreement.id}')">
                            ❌ Withdraw Agreement
                        </button>
                    ` : ''}
                    ${agreement.status === 'active' ? `
                        <button class="btn btn-primary" onclick="EmployerDashboard.showManageAgreementModal('${agreement.id}')">
                            ⚙️ Manage Agreement
                        </button>
                    ` : ''}
                    <button class="btn btn-primary" onclick="EmployerDashboard.downloadAgreement('${agreement.id}')">
                        📄 Download
                    </button>
                </div>
            </div>
        </div>
    `;

    OpusUtils.showModal('Agreement Details', modalContent);
}

static showApplicationAgreementDetails(agreement) {
    // For employer view, show the same direct details
    this.showDirectAgreementDetails(agreement);
}


// NEW METHOD: Show agreement details for application-based agreements
static showApplicationAgreementDetails(agreement) {
    const modalContent = `
        <div style="padding: 20px; max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">📝 Agreement Details</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            ${this.generateAgreementDetailsContent(agreement)}
        </div>
    `;

    OpusUtils.showModal('Agreement Details', modalContent);
}

// NEW METHOD: Show direct agreement details (fallback)
static showDirectAgreementDetails(agreement) {
    const modalContent = `
        <div style="padding: 20px; max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">📝 Agreement Details</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            ${this.generateAgreementDetailsContent(agreement)}
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button class="btn btn-ghost" onclick="OpusUtils.closeModal()">
                        Close
                    </button>
                    <button class="btn btn-primary" onclick="workerDashboard.downloadAgreement('${agreement.id}')">
                        📄 Download Agreement
                    </button>
                </div>
            </div>
        </div>
    `;

    OpusUtils.showModal('Agreement Details', modalContent);
}

// NEW METHOD: Generate agreement details content (reusable)
static generateAgreementDetailsContent(agreement) {
    // Safe property access with fallbacks
    const workType = agreement.workTerms?.workType || 'Not specified';
    const location = agreement.workTerms?.location || 'Not specified';
    const duration = agreement.workTerms?.duration || 'Not specified';
    const weeklyHours = agreement.workTerms?.weeklyHours || 'Not specified';
    const startDate = agreement.workTerms?.startDate ? 
        new Date(agreement.workTerms.startDate).toLocaleDateString() : 'Not set';
    const endDate = agreement.workTerms?.endDate ? 
        new Date(agreement.workTerms.endDate).toLocaleDateString() : 'Not set';
    
    const paymentAmount = agreement.paymentTerms?.amount ? 
        `₹${agreement.paymentTerms.amount.toLocaleString()}` : 'Not specified';
    const paymentType = agreement.paymentTerms?.type || 'Not specified';
    const paymentSchedule = agreement.paymentTerms?.schedule || 'Not specified';

    return `
        <!-- Agreement Summary -->
        <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1)); padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.1);">
            <h4 style="color: #fff; margin-bottom: 12px;">${agreement.jobTitle || 'Untitled Agreement'}</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                <div>
                    <p style="color: var(--muted); margin: 6px 0;"><strong>👤 Employer:</strong> ${agreement.employerName || 'Unknown'}</p>
                    <p style="color: var(--muted); margin: 6px 0;"><strong>👥 Worker:</strong> ${agreement.workerName || 'Unknown'}</p>
                </div>
                <div>
                    <p style="color: var(--muted); margin: 6px 0;"><strong>📅 Created:</strong> ${new Date(agreement.createdAt).toLocaleDateString()}</p>
                    <p style="color: var(--muted); margin: 6px 0;"><strong>🔄 Status:</strong> ${agreement.status ? agreement.status.replace(/_/g, ' ') : 'Unknown'}</p>
                </div>
            </div>
        </div>

        <!-- Payment Terms -->
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                💰 Payment Terms
            </h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Type</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                        ${this.formatPaymentType(paymentType)}
                    </div>
                </div>
                
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Amount</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                        ${paymentAmount} ${paymentType === 'monthly' ? '/month' : paymentType === 'hourly' ? '/hour' : ''}
                    </div>
                </div>
                
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Schedule</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                        ${paymentSchedule.replace(/_/g, ' ')}
                    </div>
                </div>
                
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Currency</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                        ${agreement.paymentTerms?.currency || 'INR'}
                    </div>
                </div>
            </div>
        </div>

        <!-- Work Terms -->
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                ⚙️ Work Terms
            </h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Work Type</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                        ${this.formatWorkType(workType)}
                    </div>
                </div>
                
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Work Location</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                        ${this.formatLocation(location)}
                    </div>
                </div>
                
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Duration</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                        ${duration} days
                    </div>
                </div>
                
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Weekly Hours</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                        ${weeklyHours} hours/week
                    </div>
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px;">
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Start Date</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                        ${startDate}
                    </div>
                </div>
                
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">End Date</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                        ${endDate}
                    </div>
                </div>
            </div>
        </div>

        <!-- Additional Information -->
        <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
            <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                📋 Additional Information
            </h4>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Agreement ID</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: var(--muted); font-size: 12px; font-family: monospace;">
                        ${agreement.id}
                    </div>
                </div>
                
                <div>
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Total Estimated Value</label>
                    <div style="padding: 12px; background: rgba(34, 197, 94, 0.1); border-radius: 8px; color: #22c55e; font-size: 14px; font-weight: 600;">
                        ₹${this.calculateAgreementTotalValue(agreement).toLocaleString()}
                    </div>
                </div>
            </div>
            
            ${agreement.legalTerms?.additionalTerms ? `
                <div style="margin-top: 12px;">
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Additional Terms</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: var(--muted); font-size: 14px; line-height: 1.5;">
                        ${agreement.legalTerms.additionalTerms}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}
static showAgreementDetailsModal(agreement) {
    const modalContent = `
        <div style="padding: 20px; max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">📝 Agreement Details</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            ${this.generateAgreementDetailsContent(agreement)}
            
            <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
                <div style="display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap;">
                    <button class="btn btn-ghost" onclick="OpusUtils.closeModal()">
                        Close
                    </button>
                    ${agreement.status === 'pending_worker_acceptance' ? `
                        <button class="btn btn-danger" onclick="EmployerDashboard.withdrawAgreement('${agreement.id}')">
                            ❌ Withdraw Agreement
                        </button>
                    ` : ''}
                    ${agreement.status === 'active' ? `
                        <button class="btn btn-primary" onclick="EmployerDashboard.showManageAgreementModal('${agreement.id}')">
                            ⚙️ Manage Agreement
                        </button>
                    ` : ''}
                    <button class="btn btn-primary" onclick="EmployerDashboard.downloadAgreement('${agreement.id}')">
                        📄 Download
                    </button>
                </div>
            </div>
        </div>
    `;

    OpusUtils.showModal('Agreement Details', modalContent);
}

// Add these static helper methods to your EmployerDashboard class
static formatPaymentType(paymentType) {
    const paymentTypeMap = {
        'hourly': '💰 Hourly Rate',
        'daily': '📅 Daily Rate', 
        'weekly': '📆 Weekly Rate',
        'monthly': '📊 Monthly Salary',
        'fixed': '🎯 Fixed Price',
        'piece_rate': '📦 Piece Rate',
        'commission': '📈 Commission Based'
    };
    return paymentTypeMap[paymentType] || paymentType;
}

static formatWorkType(workType) {
    const workTypeMap = {
        'full_time': '🕒 Full Time',
        'part_time': '⏰ Part Time',
        'contract': '📝 Contract',
        'freelance': '🎨 Freelance',
        'remote': '🌐 Remote',
        'hybrid': '🔀 Hybrid',
        'on_site': '🏢 On Site'
    };
    return workTypeMap[workType] || workType;
}

static formatLocation(location) {
    if (location === 'remote') {
        return '🌐 Remote Work';
    } else if (location === 'hybrid') {
        return '🔀 Hybrid (Remote & On-site)';
    } else {
        return `📍 ${location}`;
    }
}

static calculateAgreementTotalValue(agreement) {
    if (!agreement.paymentTerms?.amount || !agreement.workTerms?.duration) {
        return 0;
    }
    
    const dailyRate = agreement.paymentTerms.amount;
    const duration = agreement.workTerms.duration;
    
    // Calculate based on payment type
    switch (agreement.paymentTerms.type) {
        case 'hourly':
            const weeklyHours = agreement.workTerms.weeklyHours || 40;
            const weeklyRate = dailyRate * weeklyHours;
            return weeklyRate * (duration / 7);
        case 'daily':
            return dailyRate * duration;
        case 'weekly':
            return dailyRate * (duration / 7);
        case 'monthly':
            return dailyRate * (duration / 30);
        case 'fixed':
            return dailyRate;
        default:
            return dailyRate * duration;
    }
}

// NEW METHOD: Download agreement as PDF (placeholder)
static downloadAgreement(agreementId) {
    const agreement = AgreementManager.getAgreement(agreementId);
    if (!agreement) {
        OpusUtils.showNotification('Agreement not found', 'error');
        return;
    }
    
    // In a real implementation, this would generate a PDF
    // For now, we'll show a success message
    OpusUtils.showNotification('📄 Agreement download started (PDF generation would happen here)', 'info');
    
    // Simulate PDF generation
    setTimeout(() => {
        OpusUtils.showNotification('✅ Agreement PDF ready for download', 'success');
        
        // In a real app, you would trigger the actual download here
        // this.generateAgreementPDF(agreement);
    }, 1500);
}

// COMPLETE Work Logs View
static viewWorkLogs(agreementId) {
    const agreements = this.getAllAgreements();
    const agreement = agreements.find(a => a.id === agreementId);
    
    if (!agreement) {
        OpusUtils.showNotification('Agreement not found', 'error');
        return;
    }

    const workLogs = agreement.workLogs || [];
    
    const modal = document.getElementById('applicationModal');
    const modalContent = document.getElementById('applicationModalContent');

    modalContent.innerHTML = `
        <div>
            <div class="modal-header">
                <h3>Work Logs - ${agreement.jobTitle}</h3>
                <button class="modal-close" onclick="EmployerDashboard.closeModal()">&times;</button>
            </div>
            
            <div style="margin: 20px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h4 style="color: #fff;">Work History for ${agreement.workerName}</h4>
                    <div style="display: flex; gap: 8px;">
                        <span class="status status-approved">Approved: ${workLogs.filter(w => w.status === 'approved').length}</span>
                        <span class="status status-pending">Pending: ${workLogs.filter(w => w.status === 'pending').length}</span>
                        <span class="status status-rejected">Rejected: ${workLogs.filter(w => w.status === 'rejected').length}</span>
                    </div>
                </div>

                ${workLogs.length === 0 ? `
                    <div class="empty-state">
                        <div class="empty-state-icon">📊</div>
                        <h3>No work logs yet</h3>
                        <p>Work logs will appear here when the worker submits their work</p>
                    </div>
                ` : `
                    <div style="max-height: 400px; overflow-y: auto;">
                        ${workLogs.sort((a, b) => new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt))
                            .map(log => {
                                const amount = this.calculateWorkAmount({...log, agreement});
                                const statusClass = this.getApplicationStatusClass(log.status);
                                const statusText = this.getApplicationStatusText(log.status);
                                
                                return `
                                    <div class="work-log-item" style="border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 16px; margin-bottom: 12px;">
                                        <div style="display: flex; justify-content: between; align-items: start;">
                                            <div style="flex: 1;">
                                                <div style="display: flex; justify-content: between; align-items: center; margin-bottom: 8px;">
                                                    <strong style="color: #fff;">${new Date(log.date || log.createdAt).toLocaleDateString()}</strong>
                                                    <span class="status ${statusClass}">${statusText}</span>
                                                </div>
                                                <div style="color: var(--muted); margin-bottom: 8px;">
                                                    <strong>Hours:</strong> ${log.hours} • <strong>Amount:</strong> ₹${amount}
                                                </div>
                                                <div style="color: #fff; line-height: 1.4;">
                                                    ${log.description}
                                                </div>
                                                ${log.approvedAt ? `
                                                    <div style="color: var(--muted); font-size: 0.8rem; margin-top: 8px;">
                                                        Approved: ${new Date(log.approvedAt).toLocaleString()}
                                                    </div>
                                                ` : ''}
                                                ${log.rejectedAt ? `
                                                    <div style="color: var(--muted); font-size: 0.8rem; margin-top: 8px;">
                                                        Rejected: ${new Date(log.rejectedAt).toLocaleString()}
                                                    </div>
                                                ` : ''}
                                            </div>
                                        </div>
                                        ${log.status === 'pending' ? `
                                            <div style="display: flex; gap: 8px; margin-top: 12px;">
                                                <button class="btn btn-success btn-sm" onclick="EmployerDashboard.approveWorkDirect('${log.id}')">
                                                    Approve & Pay ₹${amount}
                                                </button>
                                                <button class="btn btn-danger btn-sm" onclick="EmployerDashboard.rejectWork('${log.id}')">
                                                    Reject
                                                </button>
                                            </div>
                                        ` : ''}
                                    </div>
                                `;
                            }).join('')}
                    </div>
                `}
            </div>
            
            <div class="form-actions">
                <button class="btn btn-primary" onclick="EmployerDashboard.viewAgreementDetails('${agreement.id}')">
                    Back to Agreement
                </button>
                <button class="btn btn-ghost" onclick="EmployerDashboard.closeModal()">Close</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
}
// 🔧 ADD TERMINATION METHODS TO BOTH DASHBOARDS

// In EmployerDashboard:
    static showTerminateAgreementModal(agreementId) {
    const agreement = this.getAgreementById(agreementId);
    if (!agreement) return;

    const modalContent = `
        <div style="padding: 20px; max-width: 500px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">🏁 Terminate Agreement</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <form id="terminateAgreementForm">
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Reason for Termination</label>
                    <select id="terminateReason" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);" required>
                        <option value="">Select reason</option>
                        <option value="project_completed">Project Completed</option>
                        <option value="performance_issues">Performance Issues</option>
                        <option value="mutual_agreement">Mutual Agreement</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Additional Details</label>
                    <textarea id="terminateDetails" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); min-height: 80px;" 
                              placeholder="Provide details about terminating this agreement..."></textarea>
                </div>
            </form>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-ghost" onclick="OpusUtils.closeModal()">Cancel</button>
                <button class="btn btn-danger" onclick="EmployerDashboard.submitTerminationRequest('${agreement.id}')">Request Termination</button>
            </div>
        </div>
    `;

    OpusUtils.showModal('Terminate Agreement', modalContent);
}

    static submitTerminationRequest(agreementId) {
    const agreement = this.getAgreementById(agreementId);
    if (!agreement) return;

    const reason = document.getElementById('terminateReason').value;
    const details = document.getElementById('terminateDetails').value;

    if (!reason) {
        OpusUtils.showNotification('Please select a reason for termination', 'error');
        return;
    }

    const terminationData = {
        reason: reason,
        details: details,
        effectiveDate: new Date().toISOString()
    };

    const request = AgreementManager.requestAgreementTermination(
        agreementId, 
        terminationData, 
        { id: this.currentUser.id, name: this.currentUser.fullName, role: 'employer' }
    );

    if (request) {
        OpusUtils.closeModal();
        OpusUtils.showNotification('Termination request sent to worker for approval', 'success');
        
        // Notify worker
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.createNotification(
                agreement.workerId,
                'agreement_termination_request',
                {
                    agreementId: agreementId,
                    jobTitle: agreement.jobTitle,
                    employerName: agreement.employerName,
                    requestId: request.id
                }
            );
        }
    }
}
// 🔧 ADD THESE HELPER METHODS TO EmployerDashboard CLASS

static getAgreementById(agreementId) {
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    return agreements.find(a => a.id === agreementId);
}

static getAgreementStatusColor(status) {
    const statusMap = {
        'active': { background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' },
        'pending_worker_acceptance': { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' },
        'modification_pending': { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' },
        'termination_pending': { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' },
        'completed': { background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }
    };
    return statusMap[status] || { background: 'rgba(100, 116, 139, 0.2)', color: '#94a3b8' };
}
// 🔧 ADD THIS METHOD TO EmployerDashboard CLASS
static viewAgreementHistory(agreementId) {
    const agreement = this.getAgreementById(agreementId);
    if (!agreement) {
        OpusUtils.showNotification('Agreement not found', 'error');
        return;
    }

    let historyContent = `
        <div style="padding: 20px; max-width: 700px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">📋 Agreement History</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="color: #fff; margin: 0 0 8px 0;">${agreement.jobTitle}</h4>
                <p style="color: var(--muted); margin: 0;">Worker: ${agreement.workerName}</p>
            </div>
    `;

    // Modification History
    if (agreement.modificationRequests && agreement.modificationRequests.length > 0) {
        historyContent += `
            <h4 style="color: var(--text-primary); margin-bottom: 12px;">✏️ Modification History</h4>
            ${agreement.modificationRequests.map(mod => `
                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <div>
                            <strong style="color: #fff;">Requested by: ${mod.requestedByName}</strong>
                            <div style="color: var(--muted); font-size: 0.9rem;">${new Date(mod.createdAt).toLocaleString()}</div>
                        </div>
                        <span class="status status-${mod.status}">${mod.status}</span>
                    </div>
                    <div style="color: var(--muted);">
                        <strong>Reason:</strong> ${mod.reason || 'No reason provided'}
                    </div>
                </div>
            `).join('')}
        `;
    } else {
        historyContent += `
            <div style="text-align: center; padding: 40px 20px; color: var(--muted);">
                <div style="font-size: 3rem; margin-bottom: 16px;">📝</div>
                <h4 style="color: var(--text-primary); margin-bottom: 8px;">No Modification History</h4>
                <p>No modification requests have been made for this agreement.</p>
            </div>
        `;
    }

    // Termination History
    if (agreement.terminationRequests && agreement.terminationRequests.length > 0) {
        historyContent += `
            <h4 style="color: var(--text-primary); margin-bottom: 12px; margin-top: 24px;">🏁 Termination History</h4>
            ${agreement.terminationRequests.map(term => `
                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 12px;">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">
                        <div>
                            <strong style="color: #fff;">Requested by: ${term.requestedByName}</strong>
                            <div style="color: var(--muted); font-size: 0.9rem;">${new Date(term.createdAt).toLocaleString()}</div>
                        </div>
                        <span class="status status-${term.status}">${term.status}</span>
                    </div>
                    <div style="color: var(--muted;">
                        <strong>Reason:</strong> ${term.reason}<br>
                        ${term.details ? `<strong>Details:</strong> ${term.details}` : ''}
                    </div>
                </div>
            `).join('')}
        `;
    }

    historyContent += `</div>`;
    OpusUtils.showModal('Agreement History', historyContent);
}

// Similar methods for WorkerDashboard (copy and adjust role to 'worker')
// COMPLETE Payment Details View
static viewPaymentDetails(paymentIdOrTransactionId) {
    console.log('🔍 Opening payment details for:', paymentIdOrTransactionId);
    
    const agreements = this.getAllAgreements();
    let payment = null;
    let agreement = null;
    
    // Search for payment by transaction ID or payment ID
    for (const agr of agreements) {
        if (agr.payments) {
            const foundPayment = agr.payments.find(p => 
                p.id === paymentIdOrTransactionId || p.transactionId === paymentIdOrTransactionId
            );
            if (foundPayment) {
                payment = foundPayment;
                agreement = agr;
                break;
            }
        }
    }
    
    if (!payment || !agreement) {
        OpusUtils.showNotification('Payment not found', 'error');
        return;
    }

    const modal = document.getElementById('applicationModal');
    const modalContent = document.getElementById('applicationModalContent');

    // FIX: Properly show the modal
    modalContent.innerHTML = `
        <div>
            <div class="modal-header">
                <h3>Payment Details</h3>
                <button class="modal-close" onclick="EmployerDashboard.closeModal()">&times;</button>
            </div>
            
            <div style="margin: 20px 0;">
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                    <div style="text-align: center; margin-bottom: 16px;">
                        <div style="font-size: 2rem; margin-bottom: 8px;">💰</div>
                        <div style="font-size: 2rem; font-weight: bold; color: var(--accent);">₹${payment.amount}</div>
                        <div style="color: var(--muted);">Payment to ${agreement.workerName}</div>
                        <div style="color: #22c55e; font-weight: 600; margin-top: 8px;">
                            ✅ ${payment.status === 'completed' ? 'Completed' : 'Processing'}
                        </div>
                    </div>
                    
                    <div class="payment-details">
                        <div class="payment-detail-row">
                            <strong>Transaction ID:</strong>
                            <span style="color: var(--muted); font-family: monospace; font-size: 0.9rem;">${payment.transactionId || payment.id}</span>
                        </div>
                        <div class="payment-detail-row">
                            <strong>Date:</strong>
                            <span style="color: #fff;">${new Date(payment.createdAt || payment.date).toLocaleString()}</span>
                        </div>
                        <div class="payment-detail-row">
                            <strong>Worker:</strong>
                            <span style="color: #fff;">${agreement.workerName}</span>
                        </div>
                        <div class="payment-detail-row">
                            <strong>Job:</strong>
                            <span style="color: #fff;">${agreement.jobTitle}</span>
                        </div>
                        <div class="payment-detail-row">
                            <strong>Hours/Days:</strong>
                            <span style="color: #fff;">${payment.hours || payment.days || 'N/A'}</span>
                        </div>
                        <div class="payment-detail-row">
                            <strong>Payment Method:</strong>
                            <span style="color: #fff;">${payment.paymentMethod || 'Escrow'}</span>
                        </div>
                    </div>
                </div>

                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="color: #fff; margin-bottom: 12px;">📝 Payment Description</h4>
                    <p style="color: var(--muted); line-height: 1.5;">${payment.description || 'Work completion payment'}</p>
                </div>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-primary" onclick="EmployerDashboard.closeModal()">Close</button>
            </div>
        </div>
    `;
    
    // FIX: Proper modal display
    modal.style.display = 'flex';
    modal.style.opacity = '1';
    modal.style.visibility = 'visible';
    
    console.log('✅ Modal should be visible now');
}

// Ensure closeModal works properly
static closeModal() {
    const modal = document.getElementById('applicationModal');
    modal.style.display = 'none';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden';
}


// COMPLETE Job Editing
static editJob(jobId) {
    const jobs = this.getAllJobs();
    const job = jobs.find(j => j.id === jobId);
    
    if (!job) {
        OpusUtils.showNotification('Job not found', 'error');
        return;
    }

    const modal = document.getElementById('applicationModal');
    const modalContent = document.getElementById('applicationModalContent');

    modalContent.innerHTML = `
        <div>
            <div class="modal-header">
                <h3>Edit Job - ${job.title}</h3>
                <button class="modal-close" onclick="EmployerDashboard.closeModal()">&times;</button>
            </div>
            
            <form id="editJobForm" onsubmit="event.preventDefault(); EmployerDashboard.updateJob('${jobId}')">
                <div style="margin: 20px 0;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Job Title</label>
                            <input type="text" id="editJobTitle" value="${job.title}" required 
                                   style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff;">
                        </div>
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Category</label>
                            <select id="editJobCategory" required
                                    style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff;">
                                <option value="tech" ${job.category === 'tech' ? 'selected' : ''}>Tech & IT</option>
                                <option value="corporate" ${job.category === 'corporate' ? 'selected' : ''}>Corporate & Office</option>
                                <option value="skilled-trades" ${job.category === 'skilled-trades' ? 'selected' : ''}>Skilled Trades</option>
                                <option value="healthcare" ${job.category === 'healthcare' ? 'selected' : ''}>Healthcare</option>
                                <option value="hospitality" ${job.category === 'hospitality' ? 'selected' : ''}>Hospitality</option>
                                <option value="education" ${job.category === 'education' ? 'selected' : ''}>Education</option>
                                <option value="retail" ${job.category === 'retail' ? 'selected' : ''}>Retail</option>
                                <option value="creative" ${job.category === 'creative' ? 'selected' : ''}>Creative & Media</option>
                                <option value="manufacturing" ${job.category === 'manufacturing' ? 'selected' : ''}>Manufacturing</option>
                                <option value="home-services" ${job.category === 'home-services' ? 'selected' : ''}>Home Services</option>
                                <option value="other" ${job.category === 'other' ? 'selected' : ''}>Other</option>
                            </select>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Job Type</label>
                            <select id="editJobType" required
                                    style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff;">
                                <option value="fulltime" ${job.type === 'fulltime' ? 'selected' : ''}>Full-Time</option>
                                <option value="parttime" ${job.type === 'parttime' ? 'selected' : ''}>Part-Time</option>
                                <option value="contract" ${job.type === 'contract' ? 'selected' : ''}>Contract</option>
                                <option value="freelance" ${job.type === 'freelance' ? 'selected' : ''}>Freelance</option>
                                <option value="internship" ${job.type === 'internship' ? 'selected' : ''}>Internship</option>
                                <option value="remote" ${job.type === 'remote' ? 'selected' : ''}>Remote</option>
                            </select>
                        </div>
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Salary</label>
                            <input type="text" id="editJobSalary" value="${job.salary}" required 
                                   style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff;"
                                   placeholder="e.g., ₹45,000/month">
                        </div>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Location</label>
                        <input type="text" id="editJobLocation" value="${job.location}" required 
                               style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff;"
                               placeholder="e.g., Bangalore, Karnataka">
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Job Description</label>
                        <textarea id="editJobDescription" required 
                                  style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; min-height: 100px;"
                                  placeholder="Describe the job responsibilities and role...">${job.description}</textarea>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Requirements</label>
                        <textarea id="editJobRequirements" 
                                  style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; min-height: 80px;"
                                  placeholder="List the requirements for this job...">${job.requirements || ''}</textarea>
                    </div>

                    <div style="margin-bottom: 16px;">
                        <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Skills Required</label>
                        <textarea id="editJobSkills" 
                                  style="width: 100%; padding: 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #fff; min-height: 60px;"
                                  placeholder="List the skills required (comma separated)...">${job.skills || ''}</textarea>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Update Job</button>
                    <button type="button" class="btn btn-ghost" onclick="EmployerDashboard.closeModal()">Cancel</button>
                </div>
            </form>
        </div>
    `;
    
    modal.style.display = 'flex';
}

// COMPLETE Job Update Method
static updateJob(jobId) {
    const jobs = this.getAllJobs();
    const jobIndex = jobs.findIndex(j => j.id === jobId);
    
    if (jobIndex === -1) {
        OpusUtils.showNotification('Job not found', 'error');
        return;
    }

    const updatedJobData = {
        ...jobs[jobIndex],
        title: document.getElementById('editJobTitle').value,
        category: document.getElementById('editJobCategory').value,
        type: document.getElementById('editJobType').value,
        salary: document.getElementById('editJobSalary').value,
        location: document.getElementById('editJobLocation').value,
        description: document.getElementById('editJobDescription').value,
        requirements: document.getElementById('editJobRequirements').value,
        skills: document.getElementById('editJobSkills').value,
        updatedAt: new Date().toISOString()
    };

    // Save updated job
    this.saveJob(updatedJobData);

    OpusUtils.showNotification('Job updated successfully!', 'success');
    this.closeModal();
    this.loadManageJobs();
    this.loadOverview();
}

static updateProfile() {
    console.log('Updating employer profile...');
    
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;

    // Get form data
    const profileData = {
        companyName: document.getElementById('profileCompanyName')?.value || '',
        industry: document.getElementById('profileIndustry')?.value || '',
        companySize: document.getElementById('profileCompanySize')?.value || '',
        companyCategory: document.getElementById('profileCompanyCategory')?.value || '',
        location: document.getElementById('profileLocation')?.value || '',
        website: document.getElementById('profileWebsite')?.value || '',
        description: document.getElementById('profileDescription')?.value || ''
    };

    // Update user data
    const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    
    if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...profileData };
        localStorage.setItem('opuslink_users', JSON.stringify(users));
        
        // Update session storage
        const updatedUser = { ...currentUser, ...profileData };
        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
        
        // Update profile completion - THIS IS THE KEY FIX
        const newCompletion = ProfileManager.updateProfileCompletion(currentUser.id);
        
        // Update UI immediately
        this.updateProfileCompletionUI(newCompletion);
        
        OpusUtils.showNotification('Profile updated successfully!', 'success');
        
        // Refresh profile tips
        this.loadProfileTips();
        
        console.log(`✅ Profile updated! Completion: ${newCompletion}%`);
    }
}

static updateProfileCompletionUI(completion) {
    console.log('🔄 Updating profile completion UI:', completion);
    
    // Update completion percentage
    const completionElement = document.getElementById('profileCompletion');
    if (completionElement) {
        completionElement.textContent = `Profile Completion: ${completion}%`;
    }
    
    // Update progress bar
    const progressBar = document.getElementById('profileProgressBar');
    if (progressBar) {
        progressBar.style.width = `${completion}%`;
    }
    
    // Update progress text
    const progressText = document.getElementById('profileProgressText');
    if (progressText) {
        progressText.textContent = `${completion}% Complete`;
    }
    
    // Update verification status
    this.updateVerificationUI();
    
    console.log('✅ Profile completion UI updated');
}

// PAYMENT METHODS SYSTEM
static showAddPaymentMethodModal() {
    const modal = document.getElementById('paymentMethodModal');
    if (modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        document.getElementById('addPaymentMethodForm').reset();
        this.togglePaymentFields();
    }
}

static closePaymentModal() {
    const modal = document.getElementById('paymentMethodModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Re-enable scrolling
    }
    console.log('✅ Add payment method modal closed');
}

static togglePaymentFields() {
    const type = document.getElementById('paymentMethodType').value;
    
    // Hide all fields first
    document.querySelectorAll('.payment-fields').forEach(field => {
        field.style.display = 'none';
    });
    
    // Show relevant fields
    if (type === 'bank_transfer') {
        document.getElementById('bankFields').style.display = 'block';
    } else if (type === 'upi') {
        document.getElementById('upiFields').style.display = 'block';
    } else if (type === 'paypal') {
        document.getElementById('paypalFields').style.display = 'block';
    } else if (type === 'card') {
        document.getElementById('cardFields').style.display = 'block';
    }
}

static savePaymentMethod() {
    const type = document.getElementById('paymentMethodType').value;
    const setAsDefault = document.getElementById('setAsDefault').checked;
    
    if (!type) {
        OpusUtils.showNotification('Please select a payment method type', 'error');
        return;
    }

    let paymentMethod = {
        id: 'pm_' + Date.now(),
        type: type,
        isDefault: setAsDefault,
        createdAt: new Date().toISOString()
    };

    // Add type-specific data
    if (type === 'bank_transfer') {
        const bankName = document.getElementById('bankName').value;
        const accountNumber = document.getElementById('accountNumber').value;
        const ifscCode = document.getElementById('ifscCode').value;
        const accountHolderName = document.getElementById('accountHolderName').value;
        
        if (!bankName || !accountNumber || !ifscCode || !accountHolderName) {
            OpusUtils.showNotification('Please fill all bank details', 'error');
            return;
        }
        
        paymentMethod.details = {
            bankName: bankName,
            accountNumber: accountNumber,
            ifscCode: ifscCode,
            accountHolderName: accountHolderName
        };
        paymentMethod.displayName = `${bankName} ••••${accountNumber.slice(-4)}`;
        
    } else if (type === 'upi') {
        const upiId = document.getElementById('upiId').value;
        if (!upiId) {
            OpusUtils.showNotification('Please enter UPI ID', 'error');
            return;
        }
        paymentMethod.details = { upiId: upiId };
        paymentMethod.displayName = `UPI: ${upiId}`;
        
    } else if (type === 'paypal') {
        const paypalEmail = document.getElementById('paypalEmail').value;
        if (!paypalEmail) {
            OpusUtils.showNotification('Please enter PayPal email', 'error');
            return;
        }
        paymentMethod.details = { email: paypalEmail };
        paymentMethod.displayName = `PayPal: ${paypalEmail}`;
        
    } else if (type === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardExpiry = document.getElementById('cardExpiry').value;
        const cardCvv = document.getElementById('cardCvv').value;
        const cardHolderName = document.getElementById('cardHolderName').value;
        
        if (!cardNumber || !cardExpiry || !cardCvv || !cardHolderName) {
            OpusUtils.showNotification('Please fill all card details', 'error');
            return;
        }
        
        paymentMethod.details = {
            cardNumber: cardNumber,
            expiry: cardExpiry,
            holderName: cardHolderName
        };
        paymentMethod.displayName = `Card •••• ${cardNumber.slice(-4)}`;
    }

    // Save payment method
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const paymentMethods = JSON.parse(localStorage.getItem(`employer_payment_methods_${currentUser.id}`) || '[]');
    
    // If setting as default, remove default from others
    if (setAsDefault) {
        paymentMethods.forEach(pm => pm.isDefault = false);
    }
    
    paymentMethods.push(paymentMethod);
    localStorage.setItem(`employer_payment_methods_${currentUser.id}`, JSON.stringify(paymentMethods));
    
    OpusUtils.showNotification('Payment method added successfully!', 'success');
    this.closePaymentModal();
    this.loadPaymentMethods();
}

static loadPaymentMethods() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const paymentMethods = JSON.parse(localStorage.getItem(`employer_payment_methods_${currentUser.id}`) || '[]');
    const container = document.getElementById('savedPaymentMethods');
    
    if (!container) return;

    if (paymentMethods.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💳</div>
                <h3>No payment methods</h3>
                <p>Add a payment method to pay workers easily</p>
            </div>
        `;
        return;
    }

    container.innerHTML = paymentMethods.map(pm => `
        <div class="payment-method-item ${pm.isDefault ? 'default' : ''}">
            <div class="payment-method-info">
                <div class="payment-method-icon">
                    ${this.getPaymentMethodIcon(pm.type)}
                </div>
                <div class="payment-method-details">
                    <div class="payment-method-name">${pm.displayName}</div>
                    <div class="payment-method-type">${this.formatPaymentMethodType(pm.type)}</div>
                    ${pm.isDefault ? '<span class="default-badge">Default</span>' : ''}
                </div>
            </div>
            <div class="payment-method-actions">
                ${!pm.isDefault ? `
                    <button class="btn btn-ghost btn-sm" onclick="EmployerDashboard.setDefaultPaymentMethod('${pm.id}')">
                        Set Default
                    </button>
                ` : ''}
                <button class="btn btn-danger btn-sm" onclick="EmployerDashboard.deletePaymentMethod('${pm.id}')">
                    Delete
                </button>
            </div>
        </div>
    `).join('');
}

static getPaymentMethodIcon(type) {
    const icons = {
        'bank_transfer': '🏦',
        'upi': '📱', 
        'paypal': '🔵',
        'card': '💳'
    };
    return icons[type] || '💳';
}

static formatPaymentMethodType(type) {
    const types = {
        'bank_transfer': 'Bank Transfer',
        'upi': 'UPI',
        'paypal': 'PayPal',
        'card': 'Credit/Debit Card'
    };
    return types[type] || type;
}



}
window.employerDashboard = new EmployerDashboard();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (window.employerDashboard && window.employerDashboard.init) {
        window.employerDashboard.init();
    }
});

// COMPLETE PROFILE MANAGER FIX
class ProfileManager {
    static init() {
        console.log('ProfileManager initialized');
        return true;
    }
    static uploadProfilePicture(userId, file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                try {
                    const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
                    const userIndex = users.findIndex(u => u.id === userId);
                    
                    if (userIndex !== -1) {
                        users[userIndex].profilePicture = e.target.result;
                        users[userIndex].profilePictureUpdated = new Date().toISOString();
                        localStorage.setItem('opuslink_users', JSON.stringify(users));
                        
                        // Update current user in session storage
                        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
                        if (currentUser && currentUser.id === userId) {
                            currentUser.profilePicture = e.target.result;
                            currentUser.profilePictureUpdated = new Date().toISOString();
                            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                        }
                        
                        resolve({
                            success: true,
                            message: 'Profile picture uploaded successfully!'
                        });
                    } else {
                        reject({ success: false, message: 'User not found' });
                    }
                } catch (error) {
                    reject({ success: false, message: 'Error uploading profile picture' });
                }
            };
            reader.onerror = () => reject({ success: false, message: 'Error reading file' });
            reader.readAsDataURL(file);
        });
    }
// In ProfileManager class - ENHANCED VERSION
// In ProfileManager class - COMPLETELY FIXED VERSION
// IN ProfileManager CLASS - SAFE UPDATE FOR BOTH EMPLOYER AND WORKER:
static requestVerification(userId) {
    try {
        console.log('🔍 Starting verification request for user:', userId);
        
        // SAFELY get current user from sessionStorage
        let currentUser;
        try {
            const sessionUser = sessionStorage.getItem('currentUser');
            if (!sessionUser) {
                return { success: false, message: 'Please log in to request verification.' };
            }
            currentUser = JSON.parse(sessionUser);
            console.log('✅ Current user from session:', currentUser.email, 'Role:', currentUser.role);
        } catch (sessionError) {
            console.error('❌ Error reading session storage:', sessionError);
            return { success: false, message: 'Session error. Please log in again.' };
        }

        // SAFELY get users from localStorage
        let users = [];
        try {
            const storedUsers = localStorage.getItem('opuslink_users');
            users = storedUsers ? JSON.parse(storedUsers) : [];
            console.log('📊 Total users in storage:', users.length);
        } catch (storageError) {
            console.error('❌ Error reading localStorage:', storageError);
            users = [];
        }

        // Find or create user in localStorage
        let userIndex = users.findIndex(u => u.id === userId);
        let user = userIndex !== -1 ? users[userIndex] : null;
        
        if (!user) {
            console.log('⚠️ User not found in localStorage, creating from session data...');
            user = { ...currentUser };
            users.push(user);
            userIndex = users.length - 1;
        }

        console.log('👤 User role:', user.role, 'Current verification status:', user.verificationStatus);

        // Check current verification status
        if (user.verificationStatus === 'pending') {
            return { 
                success: false, 
                message: '⏳ Verification request already submitted and under review. Please wait for admin approval.' 
            };
        }

        if (user.verificationStatus === 'verified' || user.isVerified) {
            return { 
                success: false, 
                message: '✅ Your account is already verified!' 
            };
        }

        // Check eligibility (works for both workers and employers)
        const eligibility = this.checkVerificationEligibility(userId);
        console.log('📋 Eligibility result:', eligibility);

        if (!eligibility.eligible) {
            return { 
                success: false, 
                message: eligibility.message || 'Please complete your profile before requesting verification.' 
            };
        }

        // Update verification status (SAME FOR BOTH ROLES)
        user.verificationRequested = true;
        user.verificationStatus = 'pending';
        user.verificationRequestedAt = new Date().toISOString();
        user.profileCompletion = eligibility.completionScore;

        // SAFELY save to localStorage
        try {
            localStorage.setItem('opuslink_users', JSON.stringify(users));
            console.log('💾 Successfully saved users to localStorage');
        } catch (saveError) {
            console.error('❌ Error saving to localStorage:', saveError);
            return { success: false, message: 'Storage error. Please try again.' };
        }

        // Update session storage (SAME FOR BOTH ROLES)
        try {
            currentUser.verificationRequested = true;
            currentUser.verificationStatus = 'pending';
            currentUser.verificationRequestedAt = user.verificationRequestedAt;
            currentUser.profileCompletion = eligibility.completionScore;
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log('💾 Updated session storage');
        } catch (sessionError) {
            console.error('❌ Error updating session storage:', sessionError);
            // Continue anyway, this is less critical
        }

        // Send notification to admin (WORKS FOR BOTH ROLES)
        try {
            this.sendVerificationRequestToAdmin(user);
            console.log('📢 Notification sent to admin');
        } catch (notificationError) {
            console.error('❌ Error sending notification:', notificationError);
            // Continue anyway
        }

        console.log('✅ Verification request completed successfully for', user.role);
        
        // SUCCESS MESSAGE (SAME FOR BOTH ROLES)
        return { 
            success: true, 
            message: '✅ Verification request submitted successfully! Our admin team will review your profile within 24-48 hours.' 
        };

    } catch (error) {
        console.error('❌ UNEXPECTED ERROR in requestVerification:', error);
        return { 
            success: false, 
            message: 'Unexpected error. Please try again or contact support.' 
        };
    }
}
static checkVerificationEligibilitySimple(user) {
    try {
        let completionScore = 0;
        const reasons = [];

        // Basic checks
        if (user.fullName && user.fullName.trim()) completionScore += 20;
        else reasons.push('Full name');

        if (user.email && user.email.trim()) completionScore += 20;
        else reasons.push('Email address');

        if (user.phone && user.phone.trim()) completionScore += 15;
        else reasons.push('Phone number');

        // Role-specific checks
        if (user.role === 'worker') {
            if (user.skills && user.skills.length > 0) completionScore += 25;
            else reasons.push('Skills');
            
            if (user.experienceLevel) completionScore += 20;
            else reasons.push('Experience level');
        } else if (user.role === 'employer') {
            if (user.companyName && user.companyName.trim()) completionScore += 25;
            else reasons.push('Company name');
            
            if (user.industry) completionScore += 20;
            else reasons.push('Industry');
        }

        const eligible = completionScore >= 70;
        
        let message = '';
        if (!eligible) {
            message = `Profile ${completionScore}% complete. Need to add: ${reasons.join(', ')}`;
        }

        return {
            eligible: eligible,
            completionScore: completionScore,
            reasons: reasons,
            message: message
        };

    } catch (error) {
        console.error('Error in eligibility check:', error);
        return {
            eligible: false,
            completionScore: 0,
            reasons: ['Error checking eligibility'],
            message: 'Error checking profile completeness'
        };
    }
}
// In ProfileManager class - Make sure this exists
static sendVerificationRequestToAdmin(user) {
    try {
        console.log('📨 Sending verification request to admin for user:', user.id);
        
        const notification = {
            id: 'verif_' + Date.now(),
            type: 'verification_request',
            title: `🔐 New Verification Request - ${user.role}`,
            message: `${user.fullName || user.companyName} (${user.email}) has requested account verification.`,
            userId: user.id,
            userName: user.fullName || user.companyName,
            userEmail: user.email,
            userRole: user.role,
            profileCompletion: user.profileCompletion || 0,
            requestedAt: new Date().toISOString(),
            status: 'pending',
            read: false,
            createdAt: new Date().toISOString()
        };

        // Save to admin notifications
        let adminNotifications = [];
        try {
            const stored = localStorage.getItem('admin_verification_requests');
            adminNotifications = stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.log('No existing admin notifications, starting fresh');
        }

        adminNotifications.push(notification);
        
        try {
            localStorage.setItem('admin_verification_requests', JSON.stringify(adminNotifications));
            console.log('✅ Admin notification saved successfully');
        } catch (saveError) {
            console.error('❌ Error saving admin notification:', saveError);
        }

    } catch (error) {
        console.error('❌ Error in sendVerificationRequestToAdmin:', error);
        // Don't throw, just log the error
    }
}

// Add this method to get verification requirements
static getVerificationRequirements(role) {
    const baseRequirements = [
        'Complete profile information (name, email, phone)',
        'Add profile picture',
        'Provide valid identification documents'
    ];
    
    if (role === 'worker') {
        return [
            ...baseRequirements,
            'Add your skills and experience',
            'Provide education background',
            'Set your work preferences'
        ];
    } else if (role === 'employer') {
        return [
            ...baseRequirements,
            'Add company information',
            'Provide business registration documents',
            'Set company location and contact details'
        ];
    }
    
    return baseRequirements;
}

    static getProfilePicture(userId) {
        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const user = users.find(u => u.id === userId);
        return user?.profilePicture || null;
    }

    static removeProfilePicture(userId) {
        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            delete users[userIndex].profilePicture;
            delete users[userIndex].profilePictureUpdated;
            localStorage.setItem('opuslink_users', JSON.stringify(users));
            
            // Update current user in session storage
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (currentUser && currentUser.id === userId) {
                delete currentUser.profilePicture;
                delete currentUser.profilePictureUpdated;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            }
            
            return { success: true, message: 'Profile picture removed successfully' };
        }
        
        return { success: false, message: 'User not found' };
    }
    
    static loadEmployerProfile(employerId) {
        console.log('Loading employer profile for:', employerId);
        const employers = JSON.parse(localStorage.getItem('employers') || '[]');
        return employers.find(emp => emp.id === employerId) || {};
    }
    
static updateProfileCompletion(userId) {
    const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
    const user = users.find(u => u.id === userId);
    
    if (!user) return 0;

    let completion = 0;
    
    // COMMON FIELDS FOR ALL USERS
    const commonFields = {
        'fullName': 15,
        'email': 15,
        'phone': 10,
        'profilePicture': 10
    };

    // ROLE-SPECIFIC FIELDS
    let roleFields = {};
    
    if (user.role === 'worker') {
        roleFields = {
            'jobCategory': 10,
            'experienceLevel': 10,
            'workType': 10,
            'preferredLocation': 10,
            'skills': 10,
            'bio': 10
        };
    } else if (user.role === 'employer') {
        roleFields = {
            'companyName': 15,
            'industry': 10,
            'companySize': 10,
            'location': 10,
            'description': 10
        };
    }

    // Combine all fields
    const allFields = { ...commonFields, ...roleFields };

    // Calculate completion
    Object.keys(allFields).forEach(field => {
        if (user[field]) {
            if (Array.isArray(user[field])) {
                if (user[field].length > 0) completion += allFields[field];
            } else if (user[field].toString().trim() !== '') {
                completion += allFields[field];
            }
        }
    });

    // Update user profile completion
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
        users[userIndex].profileCompletion = Math.min(completion, 100);
        users[userIndex].isVerified = users[userIndex].isVerified || false;
        users[userIndex].verificationStatus = users[userIndex].verificationStatus || 'pending';
        localStorage.setItem('opuslink_users', JSON.stringify(users));
        
        // Update session storage
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser && currentUser.id === userId) {
            currentUser.profileCompletion = Math.min(completion, 100);
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        }
    }

    console.log(`✅ Profile completion updated: ${completion}% for ${user.role}`);
    return completion;
}

    static getVerificationStatus(userId) {
        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const user = users.find(u => u.id === userId);
        return {
            isVerified: user?.isVerified || false,
            verificationStatus: user?.verificationStatus || 'pending',
            profileCompletion: user?.profileCompletion || 0
        };
    }

    static canPostJobs(userId) {
        try {
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const user = users.find(u => u.id === userId);
            
            if (!user) return false;
            
            // Employers need to be verified to post jobs
            return user.role === 'employer' && user.isVerified === true;
            
        } catch (error) {
            console.error('Error checking post permission:', error);
            return false;
        }
    }


    static canApplyJobs(userId) {
        try {
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const user = users.find(u => u.id === userId);
            
            if (!user) return false;
            
            // Workers need to be verified to apply for jobs
            return user.role === 'worker' && user.isVerified === true;
            
        } catch (error) {
            console.error('Error checking apply permission:', error);
            return false;
        }
    }
    
    static getProfileCompletion(userId) {
        const completionKey = `profile_completion_${userId}`;
        const completion = JSON.parse(localStorage.getItem(completionKey) || '{}');
        return {
            percentage: completion.percentage || 0,
            completedSections: completion.completedSections || [],
            pendingSections: completion.pendingSections || ['profile', 'company', 'jobs']
        };
    }
    
    static updateEmployerProfile(employerId, profileData) {
        console.log('Updating employer profile:', employerId, profileData);
        const employers = JSON.parse(localStorage.getItem('employers') || '[]');
        const index = employers.findIndex(emp => emp.id === employerId);
        if (index !== -1) {
            employers[index] = { ...employers[index], ...profileData };
            localStorage.setItem('employers', JSON.stringify(employers));
        }
        return true;
    }
// In ProfileManager class - update this method
static getProfileStrengthTips(user) {
    const tips = [];
    
    if (!user) return tips;

    // Check basic profile completion
    if (!user.fullName || user.fullName.trim() === '') {
        tips.push('Add your full name to complete your profile');
    }
    
    if (!user.email || user.email.trim() === '') {
        tips.push('Add your email address');
    }
    
    if (!user.phone || user.phone.trim() === '') {
        tips.push('Add your phone number for better communication');
    }
    
    // Check role-specific fields
    if (user.role === 'worker') {
        if (!user.jobCategory || user.jobCategory === '') {
            tips.push('Select your job category to get relevant job matches');
        }
        
        if (!user.experienceLevel || user.experienceLevel === '') {
            tips.push('Specify your experience level');
        }
        
        if (!user.skills || user.skills.length === 0) {
            tips.push('Add your skills to attract employers');
        }
        
        if (!user.preferredLocation || user.preferredLocation === '') {
            tips.push('Set your preferred work location');
        }
        
        if (!user.bio || user.bio.trim() === '') {
            tips.push('Write a bio to showcase your experience and personality');
        }
    } else if (user.role === 'employer') {
        if (!user.companyName || user.companyName.trim() === '') {
            tips.push('Add your company name to build trust with workers');
        }
        
        if (!user.industry || user.industry === '') {
            tips.push('Specify your industry to attract relevant workers');
        }
        
        if (!user.location || user.location === '') {
            tips.push('Add your company location to show local opportunities');
        }
        
        if (!user.description || user.description.trim() === '') {
            tips.push('Write a company description to showcase your culture');
        }
        
        if (!user.website || user.website === '') {
            tips.push('Add your website for credibility');
        }
    }
    
    // If no specific tips, provide general ones
    if (tips.length === 0) {
        tips.push('Your profile looks great! Keep it updated');
        tips.push('Consider uploading a professional profile picture');
        tips.push('Add verification documents for faster approval');
    }
    
    return tips.slice(0, 3);
}

static getDocuments(userId) {
    const documentsKey = `documents_${userId}`;
    return JSON.parse(localStorage.getItem(documentsKey) || '[]');
}

static uploadDocument(userId, file) {
    try {
        const documentsKey = `documents_${userId}`;
        const documents = JSON.parse(localStorage.getItem(documentsKey) || '[]');
        
        const newDocument = {
            id: 'doc_' + Date.now(),
            name: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
            status: 'verified'
        };
        
        documents.push(newDocument);
        localStorage.setItem(documentsKey, JSON.stringify(documents));
        
        return { success: true, document: newDocument };
    } catch (error) {
        return { success: false, message: 'Failed to upload document' };
    }
}

static deleteDocument(docId) {
    // This would need to search through all users' documents
    // For now, we'll implement a simplified version
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (currentUser) {
        const documentsKey = `documents_${currentUser.id}`;
        const documents = JSON.parse(localStorage.getItem(documentsKey) || '[]');
        const updatedDocuments = documents.filter(doc => doc.id !== docId);
        localStorage.setItem(documentsKey, JSON.stringify(updatedDocuments));
    }
}
}

// Reload the dashboard
if (typeof EmployerDashboard !== 'undefined') {
    EmployerDashboard.init();
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    EmployerDashboard.init();
});
window.ProfileManager = ProfileManager;


//worker dashboard
class WorkerDashboard {
    constructor() {
        console.log('🔄 WorkerDashboard constructor - loading data...');
        this.initializeData();
        this.setupDistricts();
        this.currentJobId = null;
        this.updateInterval = null;
        this.storageHandler = null;
    }

    // 🔧 INITIALIZATION METHODS
    // 🔧 PERMANENT FIX: Replace your initializeData method with this
// 🔧 PERMANENT FIX: Replace your initializeData method with this
initializeData() {
    try {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    } catch (error) {
        console.error('Error initializing current user:', error);
        this.currentUser = null;
    }
    
    // Load data from ALL possible sources
    this.seekers = JSON.parse(localStorage.getItem('jobSeekers')) || [];
    this.employers = JSON.parse(localStorage.getItem('employers')) || [];
    this.applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
    this.agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    
    // 🎯 PERMANENT FIX: Load jobs from ALL sources and combine them
    this.loadAndCombineAllJobs();
    
    // Load workers from multiple sources
    const opuslinkWorkers = JSON.parse(localStorage.getItem('opuslink_workers') || '[]');
    const opuslinkUsers = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
    
    this.workers = [
        ...this.seekers,
        ...opuslinkWorkers,
        ...opuslinkUsers.filter(user => user.role === 'worker')
    ].filter((worker, index, self) => 
        index === self.findIndex(w => w.id === worker.id)
    );
    
    console.log(`📊 Loaded: ${this.jobs.length} jobs, ${this.employers.length} employers, ${this.seekers.length} seekers`);
}

// 🎯 ADD THIS NEW METHOD TO YOUR WorkerDashboard CLASS
loadAndCombineAllJobs() {
    console.log('🔄 Loading and combining jobs from all sources...');
    
    // Load from all possible job storage locations
    const opuslinkJobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
    const legacyJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const allJobsStorage = JSON.parse(localStorage.getItem('all_jobs') || '[]');
    const employerJobs = JSON.parse(localStorage.getItem('employer_jobs') || '[]');
    
    console.log(`📁 Job Sources Found:`);
    console.log(`   - opuslink_jobs: ${opuslinkJobs.length} jobs`);
    console.log(`   - jobs (legacy): ${legacyJobs.length} jobs`);
    console.log(`   - all_jobs: ${allJobsStorage.length} jobs`);
    console.log(`   - employer_jobs: ${employerJobs.length} jobs`);
    
    // Combine all jobs from all sources
    const allJobs = [
        ...opuslinkJobs,
        ...legacyJobs,
        ...allJobsStorage,
        ...employerJobs
    ];
    
    // Remove duplicates based on job ID
    const uniqueJobs = allJobs.filter((job, index, self) => {
        if (!job || !job.id) return false; // Skip invalid jobs
        return index === self.findIndex(j => j.id === job.id);
    });
    
    // Ensure all jobs have required fields and clean data
    const cleanedJobs = uniqueJobs.map(job => this.cleanJobData(job));
    
    // Save back to all_jobs for consistency
    localStorage.setItem('all_jobs', JSON.stringify(cleanedJobs));
    
    this.jobs = cleanedJobs;
    
    console.log(`✅ Combined ${cleanedJobs.length} unique jobs from all sources`);
    return cleanedJobs;
}

// 🎯 ADD THIS METHOD TO CLEAN AND STANDARDIZE JOB DATA
cleanJobData(job) {
    if (!job) return null;
    
    // Ensure job has basic required structure
    const cleanedJob = {
        id: job.id || 'job_' + Date.now(),
        title: job.title || 'Untitled Position',
        employerId: job.employerId || '',
        employerName: job.employerName || job.company || 'Unknown Company',
        description: job.description || 'No description available',
        salary: this.cleanSalary(job.salary),
        type: job.type || job.jobType || 'fulltime',
        category: job.category || job.jobCategory || 'General',
        city: job.city || '',
        district: job.district || '',
        location: job.location || `${job.city || ''}, ${job.district || ''}`.replace(/^, |, $/g, ''),
        status: job.status || 'active',
        skills: Array.isArray(job.skills) ? job.skills : (job.skills ? [job.skills] : []),
        createdAt: job.createdAt || new Date().toISOString(),
        // Preserve all original data
        ...job
    };
    
    return cleanedJob;
}

// 🎯 ADD THIS METHOD TO CLEAN SALARY DATA
cleanSalary(salary) {
    if (!salary) return 'Not specified';
    
    // If salary is already a string with ₹ symbol, return as is
    if (typeof salary === 'string' && salary.includes('₹')) {
        return salary;
    }
    
    // If salary is a number, format it
    if (typeof salary === 'number') {
        return `₹${salary.toLocaleString()}/month`;
    }
    
    // If salary is a string without ₹, add it
    if (typeof salary === 'string' && !salary.includes('₹')) {
        return `₹${salary}`;
    }
    
    return `₹${salary}/month`;
}
    setupDistricts() {
        this.districts = {
            "Anantapur": ["Anantapur City", "Dharmavaram", "Tadipatri", "Gooty", "Rayadurg"],
            "Chittoor": ["Chittoor City", "Tirupati", "Madanapalle", "Punganur", "Nagari"],
            "East Godavari": ["Rajahmundry", "Kakinada", "Amalapuram", "Peddapuram", "Mandapeta"],
            "Guntur": ["Guntur City", "Tenali", "Narasaraopet", "Mangalagiri", "Ponnur"],
            "Kadapa": ["Kadapa City", "Proddatur", "Pulivendula", "Rayachoti", "Jammalamadugu"],
            "Krishna": ["Vijayawada", "Machilipatnam", "Nuzvid", "Pedana", "Vuyyuru"],
            "Kurnool": ["Kurnool City", "Nandyal", "Adoni", "Yemmiganur", "Dhone"],
            "Prakasam": ["Ongole", "Markapur", "Chirala", "Kandukur", "Podili"],
            "Nellore": ["Nellore City", "Gudur", "Kavali", "Atmakur", "Venkatagiri"],
            "Srikakulam": ["Srikakulam City", "Palasa", "Amadalavalasa", "Ichchapuram", "Tekkali"],
            "Visakhapatnam": ["Visakhapatnam City", "Anakapalle", "Bheemunipatnam", "Yelamanchili", "Narsipatnam"],
            "Vizianagaram": ["Vizianagaram City", "Bobbili", "Parvathipuram", "Salur", "Gajapathinagaram"],
            "West Godavari": ["Eluru", "Bhimavaram", "Tadepalligudem", "Palakollu", "Narasapuram"]
        };
    }

// 🔧 SECURE INIT METHOD WITH ROLE CHECKING
init() {
    console.log('🎯 WorkerDashboard initializing with role checking...');
    
    // 🔐 FIRST: Check if user has permission to access this dashboard
    if (!this.checkUserRoleAndRedirect()) {
        console.log('🛑 Initialization stopped - user not authorized');
        return; // Stop initialization if not authorized
    }

    // 🔥 STOP ALL AUTO-REFRESH FIRST
    this.stopAllAutoRefresh();
    
    if (!this.currentUser) {
        console.error('❌ No user logged in');
        window.location.href = 'login.html';
        return;
    }

    const userType = this.getUserType();
    console.log(`👤 User type detected: ${userType}`);
    
    // Double-check: If somehow an employer got through, redirect them
    if (userType === 'employer') {
        console.log('🛑 DOUBLE CHECK: User is employer, redirecting...');
        this.redirectToProperDashboard('employer');
        return;
    }

    // Only initialize for authorized worker users
    if (userType === 'worker') {
        console.log('🚀 Initializing worker-specific features...');
        
        this.protectEmployerDashboard();
        
        // Debug agreements (optional)
        setTimeout(() => {
            const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
            console.log(`📊 Found ${agreements.length} total agreements`);
            
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (currentUser) {
                const userAgreements = agreements.filter(a => a.workerId === currentUser.id);
                console.log(`👤 Found ${userAgreements.length} agreements for current user`);
            }
        }, 2000);

        // Core worker initialization
        this.loadUserData();
        this.setupNavigation();
        this.setupEventListeners();
        this.initializeProfileSystem();
        this.initializeNotifications();
        this.setupRealTimeUpdates();
        
        // Load data with delay
        setTimeout(() => { 
            this.loadJobFeed();
            this.loadApplications();
            this.loadActiveAgreements();
            this.loadEarningsOverview();
            this.loadJobOffers();
            if (this.migrateAgreementData) {
                this.migrateAgreementData();
            }
            this.setupJobOfferFilters();
        }, 500);
        
        console.log('✅ WorkerDashboard initialized successfully for authorized worker');
    } else {
        console.log('❓ Unknown user type, showing access denied');
        this.showAccessDeniedMessage(this.currentUser);
    }
}
// // 🔧 ADD PROPER ROLE DETECTION AND REDIRECTION
// checkUserRoleAndRedirect() {
//     console.log('🔐 Checking user role and permissions...');
    
//     const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
//     if (!currentUser) {
//         console.log('❌ No user logged in');
//         window.location.href = 'login.html';
//         return false;
//     }

//     // Check user role
//     const userRole = currentUser.role?.toLowerCase();
//     console.log('🎯 User role:', userRole);

//     // Define allowed roles for worker dashboard
//     const allowedRoles = ['worker', 'jobseeker', 'seeker', 'employee'];
    
//     if (!allowedRoles.includes(userRole)) {
//         console.log('🚫 Access denied: User role not allowed for worker dashboard');
        
//         // Show access denied message
//         this.showAccessDeniedMessage(currentUser);
        
//         // Redirect based on detected role
//         this.redirectToProperDashboard(userRole);
//         return false;
//     }
    
//     console.log('✅ User role verified - access granted');
//     return true;
// }

// // 🔧 ADD ACCESS DENIED MESSAGE METHOD
// showAccessDeniedMessage(user) {
//     console.log('🚫 Showing access denied message for:', user);
    
//     // Replace entire page content with access denied message
//     document.body.innerHTML = `
//         <div style="min-height: 100vh; background: var(--bg-primary); display: flex; align-items: center; justify-content: center; padding: 20px;">
//             <div style="background: var(--card); border-radius: 12px; padding: 40px; text-align: center; max-width: 500px; width: 100%; border: 1px solid var(--border-color);">
//                 <div style="font-size: 4rem; margin-bottom: 20px;">🚫</div>
//                 <h2 style="color: var(--text-primary); margin-bottom: 16px;">Access Denied</h2>
//                 <p style="color: var(--text-secondary); margin-bottom: 8px;">
//                     This dashboard is for <strong>Job Seekers/Workers</strong> only.
//                 </p>
//                 <p style="color: var(--text-secondary); margin-bottom: 24px;">
//                     Your account is registered as: <strong>${user.role || 'Unknown Role'}</strong>
//                 </p>
                
//                 <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
//                     <button onclick="window.location.href='employer-dashboard.html'" 
//                             style="background: var(--gold-primary); color: black; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer;">
//                         👔 Go to Employer Dashboard
//                     </button>
//                     <button onclick="window.location.href='login.html'" 
//                             style="background: transparent; color: var(--text-secondary); border: 1px solid var(--border-color); padding: 12px 24px; border-radius: 8px; cursor: pointer;">
//                         🔄 Switch Account
//                     </button>
//                 </div>
                
//                 <div style="border-top: 1px solid var(--border-color); padding-top: 20px;">
//                     <button onclick="localStorage.clear(); sessionStorage.clear(); window.location.href='login.html'" 
//                             style="background: transparent; color: var(--danger); border: none; padding: 8px 16px; cursor: pointer; font-size: 0.9rem;">
//                         🗑️ Clear Data & Logout
//                     </button>
//                 </div>
//             </div>
//         </div>
//     `;
// }

// // 🔧 ADD REDIRECTION METHOD
// redirectToProperDashboard(userRole) {
//     console.log('🔄 Redirecting to proper dashboard for role:', userRole);
    
//     // Map roles to proper dashboards
//     const dashboardMap = {
//         'employer': 'employer-dashboard.html',
//         'worker': 'worker-dashboard.html', 
//         'jobseeker': 'worker-dashboard.html',
//         'seeker': 'worker-dashboard.html',
//         'employee': 'worker-dashboard.html',
//         'admin': 'admin-dashboard.html'
//     };
    
//     const targetDashboard = dashboardMap[userRole] || 'login.html';
    
//     console.log('🎯 Redirecting to:', targetDashboard);
    
//     // Redirect after a short delay to show the message
//     setTimeout(() => {
//         if (window.location.pathname.includes(targetDashboard)) {
//             console.log('✅ Already on correct dashboard');
//         } else {
//             window.location.href = targetDashboard;
//         }
//     }, 3000);
// }
// 🔧 ADD DEBUG METHOD FOR MODIFICATION REQUESTS
debugModificationRequests() {
    console.log('🐛 DEBUG: Detailed modification request check...');
    
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    const userAgreements = agreements.filter(a => a.workerId === currentUser?.id);
    console.log(`👤 User agreements: ${userAgreements.length}`);
    
    userAgreements.forEach(agreement => {
        console.log(`📄 Agreement: ${agreement.id}`, {
            jobTitle: agreement.jobTitle,
            status: agreement.status,
            modificationRequests: agreement.modificationRequests,
            hasModificationRequests: !!agreement.modificationRequests,
            modificationRequestCount: agreement.modificationRequests?.length || 0
        });
        
        if (agreement.modificationRequests && agreement.modificationRequests.length > 0) {
            agreement.modificationRequests.forEach((request, index) => {
                console.log(`   📝 Request ${index}:`, {
                    id: request.id,
                    status: request.status,
                    reason: request.reason,
                    proposedChanges: request.proposedChanges,
                    requestedAt: request.requestedAt
                });
            });
        }
    });
    
    return userAgreements;
}

// Run this in console to see what's happening
// workerDashboard.debugModificationRequests();

    // 👤 USER & PROFILE METHODS
    loadUserData() {
        console.log('👤 Loading worker user data...');
        
        if (!this.currentUser) {
            console.log('❌ No current user');
            return;
        }

        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const jobSeekers = JSON.parse(localStorage.getItem('jobSeekers') || '[]');
        
        const freshUser = users.find(u => u.id === this.currentUser.id);
        const jobSeeker = jobSeekers.find(js => js.id === this.currentUser.id);

        // Merge data from all sources
        const mergedData = {
            ...this.currentUser,
            ...jobSeeker,
            ...freshUser,
            profileCompletion: freshUser?.profileCompletion || jobSeeker?.profileCompletion || this.currentUser.profileCompletion || 0,
            isVerified: freshUser?.isVerified || jobSeeker?.isVerified || this.currentUser.isVerified || false
        };

        this.currentUser = mergedData;
        sessionStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        this.setProfileFormValues(this.currentUser);
        
        console.log('✅ Worker profile data loaded');
    }
    // 🔧 ADD THIS MISSING METHOD TO WorkerDashboard CLASS
protectEmployerDashboard() {
    const userType = this.getUserType();
    if (userType === 'employer') {
        console.log('🛡️ Protecting employer dashboard from worker auto-refresh');
        
        // Override the loadActiveAgreements method for employers
        const originalLoadActiveAgreements = this.loadActiveAgreements;
        this.loadActiveAgreements = function() {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (currentUser && (currentUser.role === 'employer' || currentUser.companyName)) {
                console.log('🛑 Blocking worker agreement load for employer');
                return; // Don't load worker agreements for employer
            }
            // Call original method for workers
            return originalLoadActiveAgreements.apply(this, arguments);
        };
    }
}

// 🔧 ALSO ADD getUserType METHOD IF IT'S MISSING
// 🔧 ENHANCED ROLE DETECTION
getUserType() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return null;
    
    // Check URL first (most reliable indicator)
    const path = window.location.pathname.toLowerCase();
    if (path.includes('employer') || path.includes('company')) {
        return 'employer';
    }
    if (path.includes('worker') || path.includes('jobseeker') || path.includes('seeker')) {
        return 'worker';
    }
    if (path.includes('admin')) {
        return 'admin';
    }
    
    // Check user role property
    const userRole = currentUser.role?.toLowerCase();
    if (userRole === 'employer' || userRole === 'company' || userRole === 'recruiter') {
        return 'employer';
    }
    if (userRole === 'worker' || userRole === 'jobseeker' || userRole === 'seeker' || userRole === 'employee') {
        return 'worker';
    }
    if (userRole === 'admin' || userRole === 'administrator') {
        return 'admin';
    }
    
    // Check user properties as fallback
    if (currentUser.companyName || currentUser.employerId || currentUser.businessName) {
        return 'employer';
    }
    if (currentUser.workerId || currentUser.skills || currentUser.resume) {
        return 'worker';
    }
    
    return 'unknown';
}
init() {
    console.log('🎯 WorkerDashboard initializing...');
    
    if (!this.currentUser) {
        console.error('❌ No user logged in');
        window.location.href = 'login.html';
        return;
    }

    try {
        // 🔧 FIXED: Define userType first and add safety check
        const userType = this.getUserType ? this.getUserType() : 'unknown';
        console.log(`👤 User type detected: ${userType}`);
        
        // 🔧 FIXED: Only call if method exists
        if (this.protectEmployerDashboard) {
            this.protectEmployerDashboard();
        } else {
            console.log('⚠️ protectEmployerDashboard method not found, skipping');
        }
        
        // Debug agreements (optional)
        setTimeout(() => {
            const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
            console.log(`📊 Found ${agreements.length} total agreements`);
            
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (currentUser) {
                const userAgreements = agreements.filter(a => a.workerId === currentUser.id);
                console.log(`👤 Found ${userAgreements.length} agreements for current user`);
                
                userAgreements.forEach(agreement => {
                    console.log(`📄 User Agreement ${agreement.id}:`, {
                        title: agreement.jobTitle,
                        status: agreement.status,
                        hasWorkTerms: !!agreement.workTerms,
                        hasPaymentTerms: !!agreement.paymentTerms,
                        source: agreement.offerId ? 'offer' : agreement.applicationId ? 'application' : 'unknown'
                    });
                });
            }
        }, 2000);

        // Only initialize worker-specific features for workers
        if (userType === 'worker') {
            console.log('🚀 Initializing worker-specific features...');
            
            // Worker-specific setup with delays
            setTimeout(() => {
                if (this.migrateAndRepairAllAgreements) {
                    this.migrateAndRepairAllAgreements();
                }
                if (this.setupAgreementMonitoring) {
                    this.setupAgreementMonitoring();
                }
                if (this.checkForNewAgreements) {
                    this.checkForNewAgreements();
                }
            }, 1000);

            // Core worker initialization
            this.loadUserData();
            this.setupNavigation();
            this.setupEventListeners();
            this.initializeProfileSystem();
            this.initializeNotifications();
            this.setupRealTimeUpdates();
            
            // Load data with delay
            setTimeout(() => { 
                this.loadJobFeed();
                this.loadApplications();
                this.loadActiveAgreements();
                this.loadEarningsOverview();
                this.loadJobOffers();
                if (this.migrateAgreementData) {
                    this.migrateAgreementData();
                }
                this.setupJobOfferFilters();
            }, 500);
        } else {
            console.log('🛑 Skipping worker-specific initialization for employer or unknown user type');
        }
        
        console.log('✅ WorkerDashboard initialized successfully');
        
    } catch (error) {
        console.error('❌ Error during WorkerDashboard initialization:', error);
    }
}
    setProfileFormValues(userData) {
        console.log('📝 Setting profile form values...');
        
        const fieldMappings = {
            'workerFullName': userData.fullName || '',
            'workerEmail': userData.email || '',
            'workerPhone': userData.phone || '',
            'workerJobCategory': userData.jobCategory || userData.category || '',
            'workerExperienceLevel': userData.experienceLevel || userData.experience || '',
            'workerWorkType': userData.workType || '',
            'workerExpectedSalary': userData.expectedSalary || '',
            'workerPreferredLocation': userData.preferredLocation || '',
            'workerSkills': Array.isArray(userData.skills) ? userData.skills.join(', ') : (userData.skills || ''),
            'workerEducation': userData.education || '',
            'workerBio': userData.bio || ''
        };
        
        let updatedCount = 0;
        Object.entries(fieldMappings).forEach(([fieldId, value]) => {
            const element = document.getElementById(fieldId);
            if (element) {
                element.value = value;
                updatedCount++;
            }
        });
        
        console.log(`✅ Set ${updatedCount} profile form fields`);
        this.updateProfileCompletion();
    }

    initializeProfileSystem() {
        console.log('👤 Profile system initialized for worker');
        
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (currentUser) {
            ProfileManager.updateProfileCompletion(currentUser.id);
        }
        
        const workerProfileForm = document.getElementById('workerProfileForm');
        if (workerProfileForm) {
            workerProfileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateWorkerProfile();
            });
        }
        
        this.initFloatingProfile();
        this.checkVerificationStatus();
    }

    initFloatingProfile() {
        console.log('🔄 Initializing floating profile system...');
        
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (!currentUser) return;

            this.initializeProfilePicture();
            this.setupProfilePictureUpload();
            this.loadProfileSection();
            
            console.log('✅ Floating profile system initialized');
        } catch (error) {
            console.error('Error initializing floating profile:', error);
        }
    }

    initializeProfilePicture() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const preview = document.getElementById('workerProfilePicturePreview');
        const lastUpdated = document.getElementById('workerProfilePictureLastUpdated');
        
        if (!preview) return;
        
        if (currentUser.profilePicture) {
            preview.innerHTML = `<img src="${currentUser.profilePicture}" alt="Profile" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`;
            if (lastUpdated) {
                lastUpdated.textContent = `Last updated: ${new Date(currentUser.profilePictureUpdated).toLocaleDateString()}`;
            }
        } else {
            const initial = (currentUser.fullName || 'U').charAt(0).toUpperCase();
            preview.innerHTML = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--gold-primary); color: black; border-radius: 50%; font-size: 2rem; font-weight: bold;">${initial}</div>`;
            if (lastUpdated) {
                lastUpdated.textContent = 'No profile picture uploaded';
            }
        }
    }

    setupProfilePictureUpload() {
        const uploadInput = document.getElementById('workerProfilePictureUpload');
        const removeButton = document.getElementById('removeWorkerProfilePicture');
        
        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => this.handleProfilePictureUpload(e));
        }
        
        if (removeButton) {
            removeButton.addEventListener('click', () => this.removeProfilePicture());
        }
    }

    handleProfilePictureUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            OpusUtils.showNotification('Please select an image file', 'error');
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            OpusUtils.showNotification('Image must be less than 2MB', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            this.saveProfilePicture(e.target.result);
        };
        reader.readAsDataURL(file);
    }

    saveProfilePicture(imageData) {
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (userIndex !== -1) {
                users[userIndex].profilePicture = imageData;
                users[userIndex].profilePictureUpdated = new Date().toISOString();
                localStorage.setItem('opuslink_users', JSON.stringify(users));
                
                currentUser.profilePicture = imageData;
                currentUser.profilePictureUpdated = new Date().toISOString();
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                this.initializeProfilePicture();
                OpusUtils.showNotification('✅ Profile picture updated successfully!', 'success');
            }
        } catch (error) {
            console.error('Error saving profile picture:', error);
            OpusUtils.showNotification('Failed to update profile picture', 'error');
        }
    }

    removeProfilePicture() {
        if (!confirm('Are you sure you want to remove your profile picture?')) return;

        try {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (userIndex !== -1) {
                delete users[userIndex].profilePicture;
                delete users[userIndex].profilePictureUpdated;
                localStorage.setItem('opuslink_users', JSON.stringify(users));
                
                delete currentUser.profilePicture;
                delete currentUser.profilePictureUpdated;
                sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                this.initializeProfilePicture();
                OpusUtils.showNotification('Profile picture removed successfully', 'success');
            }
        } catch (error) {
            console.error('Error removing profile picture:', error);
            OpusUtils.showNotification('Failed to remove profile picture', 'error');
        }
    }

    updateWorkerProfile() {
        console.log('Updating worker profile...');
        
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) return;

        const profileData = {
            fullName: document.getElementById('workerFullName')?.value || '',
            email: document.getElementById('workerEmail')?.value || '',
            phone: document.getElementById('workerPhone')?.value || '',
            jobCategory: document.getElementById('workerJobCategory')?.value || '',
            experienceLevel: document.getElementById('workerExperienceLevel')?.value || '',
            workType: document.getElementById('workerWorkType')?.value || '',
            expectedSalary: document.getElementById('workerExpectedSalary')?.value || '',
            preferredLocation: document.getElementById('workerPreferredLocation')?.value || '',
            skills: document.getElementById('workerSkills')?.value.split(',').map(s => s.trim()).filter(s => s) || [],
            education: document.getElementById('workerEducation')?.value || '',
            bio: document.getElementById('workerBio')?.value || ''
        };

        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...profileData };
            localStorage.setItem('opuslink_users', JSON.stringify(users));
            
            const updatedUser = { ...currentUser, ...profileData };
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
            
            OpusUtils.showNotification('Profile updated successfully!', 'success');
            this.updateProfileCompletion();
        }
    }

    updateProfileCompletion() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) return;

        const completion = ProfileManager.updateProfileCompletion(currentUser.id);
        
        const completionElement = document.getElementById('workerProfileCompletion');
        const progressBar = document.getElementById('workerProfileProgressBar');
        const progressText = document.getElementById('workerProfileProgressText');
        
        if (completionElement) completionElement.textContent = `Profile Completion: ${completion}%`;
        if (progressBar) progressBar.style.width = `${completion}%`;
        if (progressText) progressText.textContent = `${completion}% Complete`;
        
        this.loadProfileTips();
    }

    loadProfileSection() {
        this.loadProfileTips();
        this.loadDocuments();
        this.updateProfileCompletion();
    }

    loadProfileTips() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const tips = ProfileManager.getProfileStrengthTips(currentUser);
        const tipsList = document.getElementById('workerProfileTipsList');
        
        if (tipsList) {
            tipsList.innerHTML = tips.map(tip => `<li>${tip}</li>`).join('');
        }
    }

    loadDocuments() {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const documents = ProfileManager.getDocuments(currentUser.id);
        const documentsList = document.getElementById('workerDocumentsList');
        const uploadArea = document.getElementById('workerDocumentUploadArea');
        
        if (documents.length > 0) {
            if (uploadArea) uploadArea.style.display = 'none';
            if (documentsList) {
                documentsList.innerHTML = documents.map(doc => `
                    <div class="document-item">
                        <div class="document-info">
                            <div class="document-icon">📄</div>
                            <div>
                                <div class="document-name">${doc.name}</div>
                                <div class="document-meta">
                                    ${doc.type} • Uploaded ${new Date(doc.uploadedAt).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div class="document-status">
                            <span class="status status-${doc.status}">${doc.status}</span>
                            <button class="btn btn-ghost btn-sm" onclick="workerDashboard.deleteDocument('${doc.id}')">
                                Delete
                            </button>
                        </div>
                    </div>
                `).join('');
            }
        } else {
            if (uploadArea) uploadArea.style.display = 'block';
            if (documentsList) documentsList.innerHTML = '';
        }
    }

    deleteDocument(docId) {
        if (confirm('Are you sure you want to delete this document?')) {
            ProfileManager.deleteDocument(docId);
            this.loadDocuments();
            OpusUtils.showNotification('Document deleted successfully', 'success');
        }
    }

    // 🔐 VERIFICATION METHODS
    checkVerificationStatus() {
        console.log('🔍 Checking worker verification status...');
        
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            
            if (!currentUser) {
                console.log('No user logged in');
                return false;
            }

            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const jobSeekers = JSON.parse(localStorage.getItem('jobSeekers') || '[]');
            
            let freshUserData = users.find(u => u.id === currentUser.id);
            if (!freshUserData) {
                freshUserData = jobSeekers.find(seeker => seeker.id === currentUser.id);
            }
            
            if (!freshUserData) {
                console.log('Worker data not found in any storage');
                this.createMissingWorkerRecord(currentUser);
                return false;
            }

            const updatedUser = {
                ...currentUser,
                ...freshUserData,
                isVerified: freshUserData.isVerified || false,
                verificationStatus: freshUserData.verificationStatus || 'pending'
            };
            
            sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
            this.updateVerificationUI(updatedUser);
            
            console.log('✅ Worker verification status:', updatedUser.isVerified ? 'VERIFIED' : 'PENDING');
            return updatedUser.isVerified;

        } catch (error) {
            console.error('Error checking verification status:', error);
            return false;
        }
    }

    updateVerificationUI(user = null) {
        console.log('🔄 WorkerDashboard: Starting UI update...');
        
        let currentUser = user || this.currentUser;
        let profileCompletion = 0;
        let isVerified = false;
        
        try {
            if (!currentUser) {
                try {
                    const userData = sessionStorage.getItem('currentUser');
                    if (userData) currentUser = JSON.parse(userData);
                } catch (sessionError) {
                    console.log('⚠️ Could not get user from session storage');
                }
            }
            
            if (!currentUser) {
                console.warn('⚠️ No user data found, using safe defaults');
                currentUser = { profileCompletion: 0, isVerified: false, fullName: 'Worker', email: '' };
            }
            
            profileCompletion = (currentUser && currentUser.profileCompletion !== undefined && currentUser.profileCompletion !== null) 
                ? Number(currentUser.profileCompletion) 
                : 0;
                
            profileCompletion = Math.max(0, Math.min(100, profileCompletion));
            isVerified = !!(currentUser && currentUser.isVerified);
            
        } catch (error) {
            console.error('❌ Critical error getting user data:', error);
            profileCompletion = 0;
            isVerified = false;
            currentUser = { profileCompletion: 0, isVerified: false };
        }
        
        try {
            // Update verification badges
            const verificationBadges = document.querySelectorAll('.verification-badge, .status-badge, .verification-status, [class*="verification"]');
            verificationBadges.forEach((badge) => {
                try {
                    if (badge && badge.innerHTML !== undefined) {
                        if (isVerified) {
                            badge.innerHTML = '✅ Verified';
                            badge.className = 'verification-badge verified';
                        } else {
                            badge.innerHTML = '⏳ Pending Verification';
                            badge.className = 'verification-badge pending';
                        }
                    }
                } catch (badgeError) {
                    console.log('⚠️ Could not update badge:', badgeError);
                }
            });
            
            // Update apply buttons
            const applyButtons = document.querySelectorAll('.apply-job-btn, .apply-btn, [onclick*="applyForJob"]');
            applyButtons.forEach((button) => {
                try {
                    if (button && button.innerHTML !== undefined) {
                        if (isVerified) {
                            button.disabled = false;
                            button.title = 'Apply for job';
                            button.classList.remove('disabled');
                        } else {
                            button.disabled = true;
                            button.title = 'Complete verification to apply';
                            button.classList.add('disabled');
                        }
                    }
                } catch (buttonError) {
                    console.log('⚠️ Could not update button:', buttonError);
                }
            });
            
            // Update profile completion
            const completionElement = document.getElementById('workerProfileCompletion');
            const progressBar = document.getElementById('workerProfileProgressBar');
            const progressText = document.getElementById('workerProfileProgressText');
            
            if (completionElement) completionElement.textContent = `Profile Completion: ${profileCompletion}%`;
            if (progressBar) progressBar.style.width = `${profileCompletion}%`;
            if (progressText) progressText.textContent = `${profileCompletion}% Complete`;
            
            console.log('✅ WorkerDashboard: UI update completed');
            
        } catch (uiError) {
            console.error('❌ WorkerDashboard: Unhandled UI error:', uiError);
        }
    }

    showVerificationModal(actionType = 'apply for jobs') {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const eligibility = ProfileManager.checkVerificationEligibility(currentUser.id);
        
        const modalContent = `
            <div style="padding: 24px; text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 16px;">🔒</div>
                <h3 style="color: var(--text-primary); margin-bottom: 12px;">Account Verification Required</h3>
                <p style="color: var(--text-secondary); margin-bottom: 24px; line-height: 1.5;">
                    You need to verify your account before you can ${actionType}. 
                    This ensures the quality and security of our platform.
                </p>
                
                <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); 
                            border-radius: 8px; padding: 16px; margin-bottom: 24px; text-align: left;">
                    <h4 style="color: #f59e0b; margin-bottom: 12px;">📊 Your Profile Status</h4>
                    <div style="margin-bottom: 12px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                            <span style="color: var(--text-secondary);">Profile Completion:</span>
                            <span style="color: ${eligibility.completionScore >= 70 ? '#10B981' : '#f59e0b'};">${eligibility.completionScore}%</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="background: ${eligibility.completionScore >= 70 ? '#10B981' : '#f59e0b'}; 
                                        height: 100%; width: ${eligibility.completionScore}%; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    <p style="color: #f59e0b; margin: 0; font-size: 0.9rem;">
                        ${eligibility.eligible ? 
                          '✅ You meet the requirements! Request verification now.' : 
                          'Complete the requirements below to request verification.'}
                    </p>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button onclick="WorkerDashboard.requestVerification()" 
                            style="background: var(--gold-primary); color: black; border: none; 
                                   padding: 12px 24px; border-radius: 8px; font-weight: bold; 
                                   cursor: pointer; ${!eligibility.eligible ? 'opacity: 0.5; cursor: not-allowed;' : ''}"
                            ${!eligibility.eligible ? 'disabled' : ''}>
                        📋 Request Verification
                    </button>
                    <button onclick="workerDashboard.goToProfile()" 
                            style="background: transparent; color: var(--text-secondary); 
                                   border: 1px solid var(--border-color); padding: 12px 24px; 
                                   border-radius: 8px; cursor: pointer;">
                        Complete Profile
                    </button>
                </div>
            </div>
        `;

        if (typeof OpusUtils !== 'undefined' && OpusUtils.showModal) {
            OpusUtils.showModal('Verification Required', modalContent);
        } else {
            this.showFallbackModal(modalContent);
        }
    }

    createMissingWorkerRecord(user) {
        try {
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const userExists = users.find(u => u.id === user.id);
            
            if (!userExists) {
                users.push({
                    ...user,
                    profileCompletion: user.profileCompletion || 30,
                    isVerified: user.isVerified || false,
                    verificationStatus: user.verificationStatus || 'pending',
                    role: 'worker'
                });
                localStorage.setItem('opuslink_users', JSON.stringify(users));
                console.log('✅ Created missing worker record in storage');
            }
        } catch (error) {
            console.error('Error creating worker record:', error);
        }
    }

    goToProfile() {
        if (typeof OpusUtils !== 'undefined' && OpusUtils.closeModal) {
            OpusUtils.closeModal();
        }
        this.navigateToSection('profile');
    }

    // 🧭 NAVIGATION & EVENT METHODS
    setupNavigation() {
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (link.classList.contains('logout-btn')) {
                    this.logout();
                    return;
                }
                
                const section = link.getAttribute('data-section');
                if (section) {
                    this.navigateToSection(section);
                }
            });
        });
        this.setupWorkerNotificationClick();
    }

    navigateToSection(sectionId) {
        console.log('🔄 Navigating to:', sectionId);
        
        document.querySelectorAll('.dashboard-section').forEach(s => {
            s.classList.remove('active');
            s.style.display = 'none';
        });
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        
        const targetSection = document.getElementById(sectionId);
        const targetLink = document.querySelector(`[data-section="${sectionId}"]`);
        
        if (targetSection) {
            targetSection.classList.add('active');
            targetSection.style.display = 'block';
            this.loadSectionData(sectionId);
        }
        
        if (targetLink) targetLink.classList.add('active');
    }

    loadSectionData(sectionId) {
        switch(sectionId) {
            case 'job-feed':
                this.loadJobFeed();
                break;
            case 'applications':
                this.loadApplications();
                break;
            case 'job-offers':
                this.loadJobOffers();
                break;
            case 'saved-jobs':
                this.loadSavedJobs();
                break;
            case 'active-agreements':
                this.loadActiveAgreements();
                break;
            case 'work-history':
                this.loadWorkHistory();
                break;
            case 'earnings':
                this.loadEarningsOverview();
                break;
            case 'profile':
                this.updateProfileCompletion();
                break;
            case 'feedback':
                if (typeof FeedbackSystem !== 'undefined') FeedbackSystem.init();
                break;
            case 'notifications':
                this.loadNotifications();
                this.setupNotificationFilters();
                break;
        }
    }

    setupEventListeners() {
        // Profile form
        const profileForm = document.getElementById('profileForm');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.updateProfile();
            });
        }

        // Job search and filters
        const jobSearch = document.getElementById('jobSearch');
        if (jobSearch) jobSearch.addEventListener('input', () => this.loadJobFeed());

        const categoryFilter = document.getElementById('jobCategoryFilter');
        if (categoryFilter) categoryFilter.addEventListener('change', () => this.loadJobFeed());

        const districtFilter = document.getElementById('jobDistrictFilter');
        if (districtFilter) districtFilter.addEventListener('change', (e) => {
            this.updateCityFilter(e.target.value);
            this.loadJobFeed();
        });

        const cityFilter = document.getElementById('jobCityFilter');
        if (cityFilter) cityFilter.addEventListener('change', () => this.loadJobFeed());

        const typeFilter = document.getElementById('jobTypeFilter');
        if (typeFilter) typeFilter.addEventListener('change', () => this.loadJobFeed());

        const clearFilters = document.getElementById('clearFilters');
        if (clearFilters) clearFilters.addEventListener('click', () => this.clearAllFilters());

        // Modal handlers
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', () => this.closeModals());
        });

        document.querySelectorAll('.modal-overlay').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeModals();
            });
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') this.closeModals();
        });

        this.setupApplyButtonListeners();
    }

    setupApplyButtonListeners() {
        console.log('🔧 Setting up apply button listeners...');
        
        document.addEventListener('click', (e) => {
            const applyButton = e.target.closest('.apply-btn, .apply-job-btn, [onclick*="applyForJob"]');
            
            if (applyButton) {
                e.preventDefault();
                e.stopPropagation();
                
                let jobId = applyButton.dataset.jobId;
                
                if (!jobId) {
                    const onclick = applyButton.getAttribute('onclick');
                    if (onclick && onclick.includes('applyForJob')) {
                        const match = onclick.match(/applyForJob\(['"]([^'"]+)['"]\)/);
                        jobId = match ? match[1] : null;
                    }
                }
                
                if (jobId) {
                    this.applyForJob(jobId);
                }
            }
        });
    }

// 🔄 UPDATED loadJobFeed method
loadJobFeed() {
    console.log('🔄 Loading job feed...');
    
    // Always ensure we have the latest job data
    this.loadAndCombineAllJobs();
    
    const searchTerm = document.getElementById('jobSearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('jobCategoryFilter')?.value || '';
    const districtFilter = document.getElementById('jobDistrictFilter')?.value || '';
    const cityFilter = document.getElementById('jobCityFilter')?.value || '';
    const typeFilter = document.getElementById('jobTypeFilter')?.value || '';
    
    console.log(`🔍 Filtering ${this.jobs.length} jobs - Search: "${searchTerm}", Category: "${categoryFilter}", District: "${districtFilter}", City: "${cityFilter}", Type: "${typeFilter}"`);
    
    // Filter out filled/inactive jobs
    let filteredJobs = this.jobs.filter(job => {
        if (!job || typeof job !== 'object') return false;
        
        const status = job.status ? job.status.toLowerCase() : 'active';
        const inactiveStatuses = ['filled', 'closed', 'inactive', 'completed'];
        
        return !inactiveStatuses.includes(status);
    });
    
    console.log(`📊 ${filteredJobs.length} active jobs after status filter`);
    
    // Apply search filter
    if (searchTerm) {
        filteredJobs = filteredJobs.filter(job => {
            const searchFields = [
                job.title,
                job.employerName,
                job.company,
                job.category,
                job.description,
                // FIX: Ensure skills is always treated as an array before calling join
                Array.isArray(job.skills) ? job.skills.join(' ') : (job.skills || ''),
                job.city,
                job.district
            ].filter(Boolean).join(' ').toLowerCase();
            
            return searchFields.includes(searchTerm);
        });
        console.log(`🔍 ${filteredJobs.length} jobs after search filter`);
    }
    
    // Apply category filter
    if (categoryFilter) {
        filteredJobs = filteredJobs.filter(job => 
            job.category === categoryFilter
        );
        console.log(`🏷️ ${filteredJobs.length} jobs after category filter`);
    }
    
    // Apply district filter
    if (districtFilter) {
        filteredJobs = filteredJobs.filter(job => 
            job.district === districtFilter
        );
        console.log(`📍 ${filteredJobs.length} jobs after district filter`);
    }
    
    // Apply city filter
    if (cityFilter) {
        filteredJobs = filteredJobs.filter(job => 
            job.city === cityFilter
        );
        console.log(`🏙️ ${filteredJobs.length} jobs after city filter`);
    }
    
    // Apply type filter
    if (typeFilter) {
        filteredJobs = filteredJobs.filter(job => 
            job.type === typeFilter
        );
        console.log(`🕒 ${filteredJobs.length} jobs after type filter`);
    }
    
    console.log(`🎯 Final filtered jobs: ${filteredJobs.length}`);
    this.displayJobs(filteredJobs);
    this.updateFilterStatus();
    
    // Update counters
    this.updateJobCounters(filteredJobs);
}
// 📊 ADD THIS METHOD TO UPDATE JOB COUNTERS
updateJobCounters(filteredJobs) {
    const totalJobsElement = document.getElementById('totalJobsCount');
    const matchedJobsElement = document.getElementById('matchedJobs');
    
    if (totalJobsElement) {
        totalJobsElement.textContent = filteredJobs.length;
    }
    
    if (matchedJobsElement) {
        const matchedCount = this.calculateMatchedJobs(filteredJobs);
        matchedJobsElement.textContent = matchedCount;
    }
    
    // Update any other counters
    const activeJobsCount = this.jobs.filter(job => 
        !['filled', 'closed', 'inactive'].includes(job.status)
    ).length;
    
    console.log(`📈 Counters updated - Displaying: ${filteredJobs.length}, Total Active: ${activeJobsCount}`);
}

    calculateMatchedJobs(jobs) {
        if (!this.currentUser) return 0;
        
        const workerProfile = this.seekers.find(worker => worker.id === this.currentUser.id);
        if (!workerProfile) return jobs.length;
        
        return jobs.filter(job => {
            const categoryMatch = !workerProfile.category || job.category === workerProfile.category;
            const locationMatch = !workerProfile.district || job.district === workerProfile.district;
            return categoryMatch && locationMatch;
        }).length;
    }

    // 🎨 IMPROVED displayJobs method
displayJobs(jobs) {
    const jobFeed = document.getElementById('jobFeed');
    if (!jobFeed) {
        console.error('❌ Job feed container not found');
        return;
    }

    if (!jobs || jobs.length === 0) {
        jobFeed.innerHTML = this.createEmptyState(
            '💼', 
            'No jobs found', 
            'Try adjusting your search criteria or check back later for new job postings'
        );
        return;
    }
    
    console.log(`🎨 Displaying ${jobs.length} jobs in the feed`);
    
    jobFeed.innerHTML = jobs.map(job => {
        const employer = this.employers.find(emp => 
            emp.id === job.employerId || 
            emp.companyName === job.employerName
        ) || { name: job.employerName || 'Company' };
        
        const jobType = this.formatType(job.type);
        const jobCategory = this.formatCategory(job.category);
        const salary = job.salary || 'Salary not specified';
        const location = job.location || `${job.city || ''}, ${job.district || ''}`.replace(/^, |, $/g, '') || 'Location not specified';
        const description = job.description || 'No description available';
        
        return `
            <div class="job" data-job-id="${job.id}">
                <div class="left">
                    <div class="badge">${jobType}</div>
                    <div>
                        <div style="font-weight:700; color: var(--text-primary); margin-bottom: 8px;">
                            ${job.title}
                        </div>
                        <div class="meta" style="color: var(--muted); margin-bottom: 8px;">
                            📍 ${location} • ${jobCategory}
                        </div>
                        <div style="color: var(--muted); font-size:0.9rem; margin-bottom: 8px;">
                            🏢 ${employer.name} • 💰 ${salary}
                        </div>
                        <div style="color: var(--muted); font-size:0.9rem; line-height: 1.4;">
                            ${description.substring(0, 120)}...
                        </div>
                    </div>
                </div>
                <div class="actions">
                    <button class="btn btn-ghost view-job-btn" data-job-id="${job.id}">
                        View Details
                    </button>
                    <button class="btn btn-primary apply-job-btn" data-job-id="${job.id}">
                        Apply Now
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    this.attachJobEventListeners();
    console.log('✅ Jobs displayed successfully');
}

    attachJobEventListeners() {
        document.querySelectorAll('.view-job-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-job-id');
                this.viewJobDetails(jobId);
            });
        });
        
        document.querySelectorAll('.apply-job-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const jobId = e.target.getAttribute('data-job-id');
                this.applyForJob(jobId);
            });
        });
    }

    viewJobDetails(jobId) {
        const job = this.jobs.find(j => j.id === jobId);
        if (!job) return;

        const modal = document.getElementById('jobModal');
        const modalTitle = document.getElementById('jobModalTitle');
        const modalContent = document.getElementById('jobModalContent');
        
        if (!modal || !modalTitle || !modalContent) return;

        const employer = this.employers.find(emp => emp.id === job.employerId);
        
        modalTitle.textContent = job.title;
        modalContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
                    <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; flex: 1;">
                        <div style="color: var(--muted); font-size: 0.9rem;">Company</div>
                        <div style="font-weight: 600;">${employer?.name || 'Not specified'}</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; flex: 1;">
                        <div style="color: var(--muted); font-size: 0.9rem;">Location</div>
                        <div style="font-weight: 600;">${job.city}, ${job.district}</div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 16px; margin-bottom: 16px; flex-wrap: wrap;">
                    <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; flex: 1;">
                        <div style="color: var(--muted); font-size: 0.9rem;">Salary</div>
                        <div style="font-weight: 600;">₹${job.salary}/month</div>
                    </div>
                    <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; flex: 1;">
                        <div style="color: var(--muted); font-size: 0.9rem;">Type</div>
                        <div style="font-weight: 600;">${this.formatType(job.type)}</div>
                    </div>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <h4 style="color: #fff; margin-bottom: 8px;">Job Description</h4>
                    <div style="color: var(--muted); line-height: 1.5; background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px;">
                        ${job.description}
                    </div>
                </div>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-primary" onclick="workerDashboard.applyForJob('${job.id}')">
                    Apply Now
                </button>
                <button class="btn btn-ghost modal-close">Close</button>
            </div>
        `;
        
        modal.style.display = 'flex';
    }

    // 🔧 FIXED applyForJob method
applyForJob(jobId) {
    console.log('🎯 applyForJob called with jobId:', jobId);
    
    let currentUser;
    try {
        currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    } catch (error) {
        console.error('Error getting current user:', error);
        OpusUtils.showNotification('Please log in to apply for jobs', 'error');
        return;
    }
    
    if (!currentUser) {
        console.error('No user logged in');
        OpusUtils.showNotification('Please log in to apply for jobs', 'error');
        return;
    }

    // 🎯 FIX: Check verification status properly
    const canApply = ProfileManager.canApplyJobs(currentUser.id);
    if (!canApply) {
        this.showVerificationModal('apply for jobs');
        return;
    }

    // 🎯 FIX: Look for job in ALL storage locations
    const job = this.findJobById(jobId);
    
    if (!job) {
        console.error('❌ Job not found with ID:', jobId);
        console.log('Available jobs:', this.jobs.map(j => ({ id: j.id, title: j.title })));
        OpusUtils.showNotification('Job not found or may have been removed', 'error');
        return;
    }

    // 🎯 FIX: Check for existing application
    const applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
    const existingApplication = applications.find(app => 
        app.jobId === jobId && app.workerId === currentUser.id
    );

    if (existingApplication) {
        OpusUtils.showNotification('You have already applied for this job', 'info');
        return;
    }

    console.log('✅ Job found, showing application modal:', job.title);
    this.showJobApplicationModal(job);
}

// 🎯 ADD THIS NEW METHOD TO FIND JOBS IN ALL LOCATIONS
findJobById(jobId) {
    console.log('🔍 Searching for job with ID:', jobId);
    
    // First, check in the current jobs array
    let job = this.jobs.find(j => j.id === jobId);
    
    if (job) {
        console.log('✅ Job found in current jobs array');
        return job;
    }
    
    // If not found, search in all storage locations
    console.log('🔄 Job not in current array, searching all storage locations...');
    
    const opuslinkJobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
    const legacyJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const allJobsStorage = JSON.parse(localStorage.getItem('all_jobs') || '[]');
    
    job = opuslinkJobs.find(j => j.id === jobId) ||
          legacyJobs.find(j => j.id === jobId) ||
          allJobsStorage.find(j => j.id === jobId);
    
    if (job) {
        console.log('✅ Job found in storage:', job.title);
        // Add it to current jobs array for future reference
        if (!this.jobs.find(j => j.id === jobId)) {
            this.jobs.push(job);
        }
        return job;
    }
    
    console.error('❌ Job not found in any storage location');
    return null;
}

    // 🔧 UPDATED showJobApplicationModal method
showJobApplicationModal(job) {
    console.log('📝 showJobApplicationModal called with job:', job);
    
    // 🎯 FIX: Ensure job data is complete
    if (!job) {
        console.error('❌ No job data provided to application modal');
        OpusUtils.showNotification('Job data is missing', 'error');
        return;
    }
    
    const modalContent = `
        <div style="padding: 20px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">Apply for: ${job.title || 'Position'}</h3>
                <button class="modal-close" onclick="workerDashboard.closeModals()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">×</button>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; color: var(--text-secondary);">
                    <strong>Company:</strong> ${job.employerName || job.company || 'Unknown Company'}
                </p>
                <p style="margin: 0 0 8px 0; color: var(--text-secondary);">
                    <strong>Location:</strong> ${job.city || ''}, ${job.district || job.location || ''}
                </p>
                <p style="margin: 0; color: var(--text-secondary);">
                    <strong>Salary:</strong> ${job.salary || 'Not specified'}
                </p>
            </div>
            
            <div class="form-group">
                <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">
                    Cover Letter *
                </label>
                <textarea id="coverLetterInput" 
                          style="width: 100%; padding: 12px; background: var(--bg-card); border: 1px solid var(--border-color); 
                                 border-radius: 8px; color: var(--text-primary); min-height: 120px; font-family: inherit;"
                          placeholder="Tell the employer why you're a good fit for this position..."
                          required>I am very interested in this position and believe my skills are a great match for your requirements.</textarea>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                <button type="button" onclick="workerDashboard.closeModals()" 
                        style="background: transparent; color: var(--text-secondary); border: 1px solid var(--border-color); 
                               padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500;">
                    Cancel
                </button>
                <button type="button" onclick="workerDashboard.submitJobApplication('${job.id}')" 
                        style="background: var(--gold-primary); color: black; border: none; 
                               padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                    Submit Application
                </button>
            </div>
        </div>
    `;

    OpusUtils.showModal('Apply for Job', modalContent);
}

    // 🔧 UPDATED showJobApplicationModal method
showJobApplicationModal(job) {
    console.log('📝 showJobApplicationModal called with job:', job);
    
    // 🎯 FIX: Ensure job data is complete
    if (!job) {
        console.error('❌ No job data provided to application modal');
        OpusUtils.showNotification('Job data is missing', 'error');
        return;
    }
    
    const modalContent = `
        <div style="padding: 20px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">Apply for: ${job.title || 'Position'}</h3>
                <button class="modal-close" onclick="workerDashboard.closeModals()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center;">×</button>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <p style="margin: 0 0 8px 0; color: var(--text-secondary);">
                    <strong>Company:</strong> ${job.employerName || job.company || 'Unknown Company'}
                </p>
                <p style="margin: 0 0 8px 0; color: var(--text-secondary);">
                    <strong>Location:</strong> ${job.city || ''}, ${job.district || job.location || ''}
                </p>
                <p style="margin: 0; color: var(--text-secondary);">
                    <strong>Salary:</strong> ${job.salary || 'Not specified'}
                </p>
            </div>
            
            <div class="form-group">
                <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">
                    Cover Letter *
                </label>
                <textarea id="coverLetterInput" 
                          style="width: 100%; padding: 12px; background: var(--bg-card); border: 1px solid var(--border-color); 
                                 border-radius: 8px; color: var(--text-primary); min-height: 120px; font-family: inherit;"
                          placeholder="Tell the employer why you're a good fit for this position..."
                          required>I am very interested in this position and believe my skills are a great match for your requirements.</textarea>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                <button type="button" onclick="workerDashboard.closeModals()" 
                        style="background: transparent; color: var(--text-secondary); border: 1px solid var(--border-color); 
                               padding: 10px 20px; border-radius: 6px; cursor: pointer; font-weight: 500;">
                    Cancel
                </button>
                <button type="button" onclick="workerDashboard.submitJobApplication('${job.id}')" 
                        style="background: var(--gold-primary); color: black; border: none; 
                               padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                    Submit Application
                </button>
            </div>
        </div>
    `;

    OpusUtils.showModal('Apply for Job', modalContent);
}
// 🔧 UPDATED submitJobApplication method
submitJobApplication(jobId) {
    console.log('📨 Submitting application for job:', jobId);
    
    let currentUser;
    try {
        currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    } catch (error) {
        console.error('Error getting current user:', error);
        OpusUtils.showNotification('Please log in to apply for jobs', 'error');
        return;
    }
    
    if (!currentUser) {
        OpusUtils.showNotification('Please log in to apply for jobs', 'error');
        return;
    }

    const coverLetter = document.getElementById('coverLetterInput')?.value;
    
    if (!coverLetter?.trim()) {
        OpusUtils.showNotification('Please write a cover letter', 'error');
        return;
    }

    try {
        // 🎯 FIX: Use the findJobById method instead of direct lookup
        const job = this.findJobById(jobId);
        
        if (!job) {
            OpusUtils.showNotification('Job not found', 'error');
            return;
        }

        const application = {
            id: 'app_' + Date.now(),
            jobId: jobId,
            jobTitle: job.title,
            employerId: job.employerId,
            employerName: job.employerName || job.company,
            workerId: currentUser.id,
            workerName: currentUser.fullName || 'Worker',
            workerEmail: currentUser.email,
            coverLetter: coverLetter,
            appliedDate: new Date().toISOString(),
            status: 'pending',
            location: `${job.city || ''}, ${job.district || ''}`.replace(/^, |, $/g, ''),
            salary: job.salary,
            jobType: job.type,
            jobCategory: job.category
        };

        const applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
        applications.push(application);
        localStorage.setItem('opuslink_applications', JSON.stringify(applications));

        this.closeModals();
        OpusUtils.showNotification('✅ Application submitted successfully!', 'success');
        
        // Update UI to show applied status
        setTimeout(() => {
            const applyButtons = document.querySelectorAll(`
                .apply-job-btn[data-job-id="${jobId}"], 
                .apply-btn[data-job-id="${jobId}"],
                [onclick*="applyForJob('${jobId}')"]
            `);
            
            applyButtons.forEach(button => {
                button.innerHTML = '✅ Applied';
                button.style.background = 'var(--success)';
                button.disabled = true;
                button.onclick = null;
            });
        }, 200);
        
        this.loadApplications();
        console.log('✅ Application submitted successfully');

    } catch (error) {
        console.error('❌ Application submission error:', error);
        OpusUtils.showNotification('Failed to submit application', 'error');
    }
}

    updateCityFilter(selectedDistrict) {
        const cityFilter = document.getElementById('jobCityFilter');
        if (!cityFilter) return;

        cityFilter.innerHTML = '<option value="">All Cities</option>';
        
        if (selectedDistrict && this.districts[selectedDistrict]) {
            this.districts[selectedDistrict].forEach(city => {
                const option = document.createElement('option');
                option.value = city;
                option.textContent = city;
                cityFilter.appendChild(option);
            });
            cityFilter.disabled = false;
        } else {
            cityFilter.disabled = true;
        }
    }

    clearAllFilters() {
        document.getElementById('jobSearch').value = '';
        document.getElementById('jobCategoryFilter').value = '';
        document.getElementById('jobDistrictFilter').value = '';
        document.getElementById('jobCityFilter').innerHTML = '<option value="">All Cities</option>';
        document.getElementById('jobCityFilter').disabled = true;
        document.getElementById('jobTypeFilter').value = '';
        
        this.loadJobFeed();
        OpusUtils.showNotification('All filters cleared', 'info');
    }

    updateFilterStatus() {
        try {
            const searchInput = document.getElementById('jobSearch');
            const categorySelect = document.getElementById('jobCategory');
            const districtSelect = document.getElementById('jobDistrict');
            
            const searchValue = searchInput ? searchInput.value : '';
            const categoryValue = categorySelect ? categorySelect.value : '';
            const districtValue = districtSelect ? districtSelect.value : '';
            
            const filterStatus = document.getElementById('filterStatus');
            if (filterStatus) {
                const activeFilters = [];
                if (searchValue) activeFilters.push(`Search: "${searchValue}"`);
                if (categoryValue) activeFilters.push(`Category: ${categoryValue}`);
                if (districtValue) activeFilters.push(`District: ${districtValue}`);
                
                filterStatus.textContent = activeFilters.length > 0 
                    ? `Active filters: ${activeFilters.join(', ')}`
                    : 'No filters active';
            }
            
        } catch (error) {
            console.error('❌ Error in updateFilterStatus:', error);
        }
    }

    // 📋 APPLICATIONS METHODS
    loadApplications() {
        console.log('📥 Loading applications...');
        
        let currentUser;
        try {
            currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        } catch (error) {
            console.error('Error getting current user:', error);
            return;
        }
        
        if (!currentUser) {
            console.log('No current user');
            return;
        }

        const applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
        const workerApplications = applications.filter(app => app.workerId === currentUser.id);
        
        this.applications = applications;
        
        const container = document.getElementById('applications-content');
        if (!container) {
            console.log('ℹ️ Applications container not found');
            return;
        }
        
        this.updateApplicationsDisplay(workerApplications);
    }

    updateApplicationsDisplay(applications) {
        const container = document.getElementById('applications-content');
        if (!container) {
            console.error('❌ Applications container not found');
            return;
        }

        console.log('🔄 Displaying applications:', applications.length);

        if (applications.length === 0) {
            container.innerHTML = this.createEmptyState('📄', 'No applications yet', 'Your job applications will appear here once you start applying');
            return;
        }

        const sortedApplications = applications.sort((a, b) => 
            new Date(b.appliedDate) - new Date(a.appliedDate)
        );

        container.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${sortedApplications.map(app => {
                    const appliedDate = new Date(app.appliedDate).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    });
                    
                    return `
                        <div style="background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
                                <div style="flex: 1;">
                                    <div style="font-size: 1.2rem; font-weight: 600; margin-bottom: 4px; color: #fff;">${app.jobTitle}</div>
                                    <div style="color: var(--muted); font-size: 0.9rem;">
                                        ${app.employerName || 'Company'} • ${app.location || 'Location'} • 
                                        Applied on ${appliedDate}
                                    </div>
                                </div>
                                <span style="padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; 
                                    background: ${this.getStatusColor(app.status).background}; 
                                    color: ${this.getStatusColor(app.status).color};">
                                    ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                                </span>
                            </div>
                            
                            <div style="color: var(--muted); margin-bottom: 16px; line-height: 1.5;">
                                <strong>Cover Letter:</strong><br>
                                ${app.coverLetter || 'No cover letter provided'}
                            </div>
                            
                            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                <button class="btn btn-ghost btn-sm" onclick="workerDashboard.viewApplicationDetails('${app.id}')">
                                    View Details
                                </button>
                                ${app.status === 'pending' ? `
                                    <button class="btn btn-danger btn-sm" onclick="workerDashboard.withdrawApplication('${app.id}')">
                                        Withdraw
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
        
        console.log('✅ Applications displayed');
    }

    viewApplicationDetails(applicationId) {
        const applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
        const application = applications.find(app => app.id === applicationId);
        
        if (!application) {
            OpusUtils.showNotification('Application not found', 'error');
            return;
        }

        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const employers = JSON.parse(localStorage.getItem('employers') || '[]');
        
        const job = jobs.find(j => j.id === application.jobId);
        const employer = employers.find(emp => emp.id === application.employerId);

        const modal = document.getElementById('jobModal');
        const modalTitle = document.getElementById('jobModalTitle');
        const modalContent = document.getElementById('jobModalContent');
        
        if (!modal || !modalTitle || !modalContent) return;
        
        modalTitle.textContent = 'Application Details';
        modalContent.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="color: #fff; margin-bottom: 8px;">${application.jobTitle}</h4>
                    <div style="color: var(--muted); margin-bottom: 4px;">
                        <strong>Company:</strong> ${employer?.name || application.employerName || 'Unknown Company'}
                    </div>
                    <div style="color: var(--muted); margin-bottom: 4px;">
                        <strong>Location:</strong> ${application.location || job?.city || 'Unknown Location'}
                    </div>
                    <div style="color: var(--muted);">
                        <strong>Applied:</strong> ${new Date(application.appliedDate).toLocaleString()}
                    </div>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <h4 style="color: #fff; margin-bottom: 8px;">Your Cover Letter</h4>
                    <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; color: var(--muted); line-height: 1.5;">
                        ${application.coverLetter}
                    </div>
                </div>
                
                <div style="background: rgba(255,255,255,0.02); padding: 12px; border-radius: 6px; margin-bottom: 16px;">
                    <p style="color: var(--muted); font-size: 0.9rem; margin: 0;">
                        <strong>Status:</strong> ${application.status}<br>
                        ${application.status === 'pending' ? 'The employer will review your application soon.' : 
                        application.status === 'approved' ? 'Congratulations! Your application was approved.' :
                        application.status === 'rejected' ? 'Keep applying to other opportunities.' : ''}
                    </p>
                </div>
            </div>
            
            <div class="form-actions">
                <button class="btn btn-ghost modal-close">Close</button>
                ${application.status === 'pending' ? `
                    <button class="btn btn-danger" onclick="workerDashboard.withdrawApplication('${application.id}')">
                        Withdraw Application
                    </button>
                ` : ''}
            </div>
        `;
        
        modal.style.display = 'flex';
    }

    withdrawApplication(applicationId) {
        if (!confirm('Are you sure you want to withdraw this application?')) return;
        
        const applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
        const applicationIndex = applications.findIndex(app => app.id === applicationId);
        
        if (applicationIndex !== -1) {
            applications.splice(applicationIndex, 1);
            localStorage.setItem('opuslink_applications', JSON.stringify(applications));
            
            this.applications = applications;
            
            OpusUtils.showNotification('Application withdrawn successfully!', 'success');
            this.loadApplications();
        } else {
            OpusUtils.showNotification('Application not found', 'error');
        }
    }

    // 💾 SAVED JOBS METHODS
    loadSavedJobs() {
        console.log('📥 Loading saved jobs...');
        
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            const savedJobsContainer = document.getElementById('saved-jobs-container');
            
            if (!savedJobsContainer) {
                console.log('Saved jobs container not found');
                return;
            }

            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const currentUserData = users.find(u => u.id === currentUser.id);
            
            let savedJobIds = [];
            
            if (currentUserData && currentUserData.savedJobs) {
                savedJobIds = currentUserData.savedJobs;
            } else if (currentUserData && currentUserData.bookmarks) {
                savedJobIds = currentUserData.bookmarks;
            }

            const allJobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
            const savedJobs = allJobs.filter(job => savedJobIds.includes(job.id));

            if (savedJobs.length === 0) {
                savedJobsContainer.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">📋</div>
                        <h3>No Saved Jobs</h3>
                        <p>Jobs you save will appear here for quick access.</p>
                        <button onclick="WorkerDashboard.navigateToSection('browse-jobs')" 
                                class="btn btn-primary">
                            Browse Jobs
                        </button>
                    </div>
                `;
                return;
            }

            savedJobsContainer.innerHTML = savedJobs.map(job => `
                <div class="job-card" data-job-id="${job.id}">
                    <div class="job-card-header">
                        <h3 class="job-title">${job.title || 'Untitled Position'}</h3>
                        <div class="job-actions">
                            <button class="btn btn-ghost btn-sm" onclick="WorkerDashboard.unsaveJob('${job.id}')" title="Remove from saved">
                                ❌
                            </button>
                            <button class="btn btn-ghost btn-sm" onclick="WorkerDashboard.viewJobDetails('${job.id}')" title="View details">
                                👁️
                            </button>
                            ${ProfileManager.canApplyJobs(currentUser.id) ? 
                                `<button class="btn btn-primary btn-sm" onclick="WorkerDashboard.applyForJob('${job.id}')">
                                    Apply Now
                                </button>` : 
                                `<button class="btn btn-warning btn-sm" onclick="WorkerDashboard.showVerificationModal('apply for jobs')">
                                    Verify to Apply
                                </button>`
                            }
                        </div>
                    </div>
                    
                    <div class="job-card-body">
                        <div class="job-info-grid">
                            <div class="job-info-item">
                                <span class="job-info-label">🏢 Company:</span>
                                <span class="job-info-value">${job.companyName || job.employerName || 'Unknown'}</span>
                            </div>
                            <div class="job-info-item">
                                <span class="job-info-label">📍 Location:</span>
                                <span class="job-info-value">${job.location || 'Not specified'}</span>
                            </div>
                            <div class="job-info-item">
                                <span class="job-info-label">💰 Salary:</span>
                                <span class="job-info-value">${job.salary || 'Not specified'}</span>
                            </div>
                            <div class="job-info-item">
                                <span class="job-info-label">📅 Posted:</span>
                                <span class="job-info-value">${job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Unknown'}</span>
                            </div>
                        </div>
                        
                        <div class="job-description">
                            <p>${job.description || 'No description available.'}</p>
                        </div>
                        
                        ${job.skills && job.skills.length > 0 ? `
                            <div class="job-skills">
                                <strong>Skills Required:</strong>
                                <div class="skills-tags">
                                    ${job.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            `).join('');

            console.log(`✅ Loaded ${savedJobs.length} saved jobs`);

        } catch (error) {
            console.error('Error loading saved jobs:', error);
            const container = document.getElementById('saved-jobs-container');
            if (container) {
                container.innerHTML = `
                    <div class="error-state">
                        <div class="error-icon">⚠️</div>
                        <h3>Error Loading Saved Jobs</h3>
                        <p>There was a problem loading your saved jobs. Please try again.</p>
                        <button onclick="WorkerDashboard.loadSavedJobs()" class="btn btn-primary">
                            Retry
                        </button>
                    </div>
                `;
            }
        }
    }

    unsaveJob(jobId) {
        console.log('Removing job from saved:', jobId);
        
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const userIndex = users.findIndex(u => u.id === currentUser.id);
            
            if (userIndex !== -1) {
                if (!users[userIndex].savedJobs) {
                    users[userIndex].savedJobs = [];
                }
                
                users[userIndex].savedJobs = users[userIndex].savedJobs.filter(id => id !== jobId);
                localStorage.setItem('opuslink_users', JSON.stringify(users));
                
                this.loadSavedJobs();
                OpusUtils.showNotification('Job removed from saved', 'info');
            }
        } catch (error) {
            console.error('Error unsaving job:', error);
            OpusUtils.showNotification('Failed to remove job from saved', 'error');
        }
    }

    saveJob(jobData) {
        console.log('💾 Saving job to storage...', jobData.id);
        
        try {
            const opuslinkJobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
            const existingIndex = opuslinkJobs.findIndex(job => job.id === jobData.id);
            
            if (existingIndex !== -1) {
                opuslinkJobs[existingIndex] = jobData;
                console.log('🔄 Updated existing job');
            } else {
                opuslinkJobs.push(jobData);
                console.log('➕ Added new job');
            }
            
            localStorage.setItem('opuslink_jobs', JSON.stringify(opuslinkJobs));
            this.jobs = opuslinkJobs;
            
            console.log('✅ Job saved successfully');
            return true;
            
        } catch (error) {
            console.error('❌ Error saving job:', error);
            OpusUtils.showNotification('Failed to save job', 'error');
            return false;
        }
    }

    // 🎯 JOB OFFERS METHODS
   // Update your existing loadJobOffers method
loadJobOffers() {
    if (!this.currentUser) return;

    const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
    const workerOffers = jobOffers.filter(offer => 
        offer.workerId === this.currentUser.id
    );

    console.log(`📨 Found ${workerOffers.length} job offers for worker ${this.currentUser.id}`);
    
    const container = document.getElementById('jobOffersContainer');
    if (!container) {
        console.log('ℹ️ Job offers container not found');
        return;
    }
     // Update counters first
    this.updateOfferCounters();

    // Apply current filter
    this.filterJobOffers();
}
// 🔧 UPDATED displayModificationRequests METHOD
displayModificationRequests(agreements) {
    console.log('🔍 Checking for modification requests...');
    
    const container = document.getElementById('activeAgreementsContainer');
    if (!container) return '';

    let modificationRequests = [];
    
    // Collect all modification requests from all agreements
    agreements.forEach(agreement => {
        console.log(`🔍 Checking agreement ${agreement.id}:`, {
            status: agreement.status,
            modificationRequests: agreement.modificationRequests
        });
        
        if (agreement.modificationRequests && Array.isArray(agreement.modificationRequests)) {
            agreement.modificationRequests.forEach(request => {
                console.log(`   📝 Found request:`, {
                    status: request.status,
                    id: request.id
                });
                
                if (request.status === 'pending') {
                    modificationRequests.push({
                        ...request,
                        agreementId: agreement.id,
                        jobTitle: agreement.jobTitle,
                        employerName: agreement.employerName,
                        agreementStatus: agreement.status
                    });
                }
            });
        }
    });

    console.log(`📝 Found ${modificationRequests.length} modification requests`);
    
    // Debug: Log what we found
    modificationRequests.forEach(request => {
        console.log(`🎯 Modification request details:`, {
            id: request.id,
            jobTitle: request.jobTitle,
            status: request.status,
            agreementStatus: request.agreementStatus
        });
    });

    if (modificationRequests.length === 0) {
        console.log('❌ No pending modification requests found');
        return ''; // No modification requests to display
    }

    return `
        <div style="margin-bottom: 32px;">
            <h3 style="color: var(--text-primary); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                🔄 Modification Requests (${modificationRequests.length})
            </h3>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${modificationRequests.map(request => this.createModificationRequestCard(request)).join('')}
            </div>
        </div>
    `;
}

// 🔧 ADD METHOD TO CREATE MODIFICATION REQUEST CARD
createModificationRequestCard(request) {
    return `
        <div class="modification-request-card" style="background: var(--card); border: 2px solid #3b82f6; border-radius: 12px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 8px 0; color: #fff;">Modification Request: ${request.jobTitle}</h4>
                    <div style="color: var(--muted); font-size: 0.9rem; margin-bottom: 8px;">
                        <strong>From:</strong> ${request.employerName} • 
                        <strong>Requested:</strong> ${new Date(request.requestedAt).toLocaleDateString()}
                    </div>
                </div>
                <span style="padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; 
                      background: rgba(59, 130, 246, 0.2); color: #60a5fa;">
                    🔄 Modification Requested
                </span>
            </div>
            
            <div style="color: var(--muted); margin-bottom: 16px;">
                <div style="margin-bottom: 12px;">
                    <strong>Reason for Modification:</strong>
                    <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-top: 8px;">
                        ${request.reason || 'No reason provided'}
                    </div>
                </div>
                
                ${request.proposedChanges ? `
                    <div style="margin-bottom: 12px;">
                        <strong>Proposed Changes:</strong>
                        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-top: 8px;">
                            ${this.formatProposedChanges(request.proposedChanges)}
                        </div>
                    </div>
                ` : ''}
                
                ${request.message ? `
                    <div>
                        <strong>Additional Message:</strong>
                        <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-top: 8px;">
                            ${request.message}
                        </div>
                    </div>
                ` : ''}
            </div>
            
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button class="btn btn-success" onclick="workerDashboard.acceptModificationRequest('${request.id}', '${request.agreementId}')">
                    ✅ Accept Changes
                </button>
                <button class="btn btn-danger" onclick="workerDashboard.rejectModificationRequest('${request.id}', '${request.agreementId}')">
                    ❌ Reject Changes
                </button>
                <button class="btn btn-ghost" onclick="workerDashboard.viewAgreementDetails('${request.agreementId}')">
                    👁️ View Agreement
                </button>
            </div>
        </div>
    `;
}

// 🔧 ADD METHOD TO FORMAT PROPOSED CHANGES
formatProposedChanges(changes) {
    if (typeof changes === 'string') return changes;
    
    let html = '';
    if (changes.paymentTerms) {
        html += `<div><strong>Payment:</strong> ${JSON.stringify(changes.paymentTerms)}</div>`;
    }
    if (changes.workTerms) {
        html += `<div><strong>Work Terms:</strong> ${JSON.stringify(changes.workTerms)}</div>`;
    }
    if (changes.duration) {
        html += `<div><strong>Duration:</strong> ${changes.duration} days</div>`;
    }
    if (changes.weeklyHours) {
        html += `<div><strong>Weekly Hours:</strong> ${changes.weeklyHours}</div>`;
    }
    
    return html || 'No specific changes detailed';
}

// IN WorkerDashboard CLASS - FIX JOB OFFERS DISPLAY
// Update your displayJobOffers method to fix the "Unknown Status" issue
displayJobOffers(offers) {
    const container = document.getElementById('jobOffersContainer');
    if (!container) {
        console.error('❌ Job offers container not found');
        return;
    }

    const statusFilter = document.getElementById('offerStatusFilter')?.value || 'all';
    const filterStatus = statusFilter !== 'all' ? ` (${this.formatStatusFilter(statusFilter)})` : '';

    if (!offers || offers.length === 0) {
        let message = 'No job offers yet';
        let description = 'Job offers from employers will appear here when they send you direct offers';
        
        switch(statusFilter) {
            case 'pending':
                message = 'No pending job offers';
                description = 'You have no pending job offers at the moment';
                break;
            case 'accepted':
                message = 'No accepted job offers';
                description = 'You have not accepted any job offers yet';
                break;
            case 'rejected':
                message = 'No declined job offers';
                description = 'You have not declined any job offers';
                break;
        }
        
        container.innerHTML = this.createEmptyState('🎯', message, description);
        return;
    }

    // Update the counters in the stats cards
    this.updateOfferCounters();

    container.innerHTML = `
        <div style="margin-bottom: 16px; color: var(--muted); font-size: 0.9rem;">
            Showing ${offers.length} offer${offers.length !== 1 ? 's' : ''}${filterStatus}
        </div>
        <div style="display: flex; flex-direction: column; gap: 16px;">
            ${offers.map(offer => {
                const hasAgreement = AgreementManager.hasAgreementForJobOffer(offer.id);
                const agreement = hasAgreement ? AgreementManager.getUserAgreements(this.currentUser.id)
                    .find(a => a.offerId === offer.id) : null;
                
                // Fix status display
                const status = offer.status || 'pending';
                const statusDisplay = this.formatOfferStatus(status);
                const statusColor = this.getStatusColor(status);
                
                return `
                    <div class="job-offer-card" style="
                        border: 2px solid ${hasAgreement ? (agreement?.status === 'pending_worker_acceptance' ? '#f59e0b' : '#22c55e') : statusColor.border};
                        border-radius: 12px;
                        padding: 20px;
                        background: ${hasAgreement ? 
                            (agreement?.status === 'pending_worker_acceptance' ? 'rgba(245, 158, 11, 0.05)' : 'rgba(34, 197, 94, 0.05)') : 
                            statusColor.background};
                    ">
                        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                            <div style="flex: 1;">
                                <h4 style="color: #fff; margin: 0 0 8px 0;">${offer.jobTitle || 'Untitled Position'}</h4>
                                <div style="color: var(--accent); font-weight: 600; margin-bottom: 8px;">
                                    Offer from ${offer.employerName || 'Unknown Employer'}
                                </div>
                                <div style="color: var(--muted); font-size: 0.9rem;">
                                    📍 ${offer.jobLocation || 'Location not specified'} • 
                                    🕒 ${this.formatJobType(offer.jobType || 'contract')} • 
                                    💰 ${offer.jobSalary || 'Salary not specified'}
                                </div>
                                
                                ${hasAgreement && agreement ? `
                                    <div style="margin-top: 8px;">
                                        <span style="padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; 
                                            background: ${agreement.status === 'pending_worker_acceptance' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 197, 94, 0.2)'}; 
                                            color: ${agreement.status === 'pending_worker_acceptance' ? '#f59e0b' : '#22c55e'};">
                                            ${agreement.status === 'pending_worker_acceptance' ? '📝 Agreement Pending' : '✅ Agreement Active'}
                                        </span>
                                    </div>
                                ` : ''}
                            </div>
                            <div style="text-align: right;">
                                <div style="color: var(--muted); font-size: 0.8rem;">
                                    Offered: ${new Date(offer.offerDate).toLocaleDateString()}
                                </div>
                                <div style="color: #f59e0b; font-size: 0.8rem;">
                                    Expires: ${new Date(offer.expiresAt).toLocaleDateString()}
                                </div>
                                <div style="margin-top: 8px;">
                                    <span style="padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; 
                                        background: ${statusColor.background}; 
                                        color: ${statusColor.color};">
                                        ${statusDisplay}
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div style="color: var(--muted); margin-bottom: 16px; line-height: 1.5;">
                            ${offer.message || 'No additional message provided.'}
                        </div>
                        
                        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                            ${!hasAgreement && status === 'pending' ? `
                                <button class="btn btn-success accept-offer-btn" data-offer-id="${offer.id}">
                                    ✅ Accept Offer & Create Agreement
                                </button>
                            ` : hasAgreement && agreement?.status === 'pending_worker_acceptance' ? `
                                <button class="btn btn-primary review-agreement-btn" data-offer-id="${offer.id}">
                                    📝 Review Agreement
                                </button>
                            ` : hasAgreement && agreement ? `
                                <button class="btn btn-success view-agreement-btn" data-agreement-id="${agreement.id}">
                                    👁️ View Agreement
                                </button>
                            ` : ''}
                            
                            ${status === 'pending' ? `
                                <button class="btn btn-danger reject-offer-btn" data-offer-id="${offer.id}">
                                    ❌ Decline Offer
                                </button>
                            ` : ''}
                            
                            <button class="btn btn-ghost view-details-btn" data-offer-id="${offer.id}">
                                ℹ️ View Details
                            </button>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    // Bind event listeners after rendering
    this.bindJobOfferEvents();
}
// Add these helper methods to WorkerDashboard class
formatOfferStatus(status) {
    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Accepted',
        'rejected': 'Declined',
        'expired': 'Expired'
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
}

getStatusColor(status) {
    const colors = {
        'pending': { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b', border: '#f59e0b' },
        'accepted': { background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '#22c55e' },
        'rejected': { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '#ef4444' },
        'expired': { background: 'rgba(100, 116, 139, 0.2)', color: '#64748b', border: '#64748b' }
    };
    return colors[status] || { background: 'rgba(100, 116, 139, 0.2)', color: '#64748b', border: '#64748b' };
}

// Update the counters display - FIXED VERSION
updateOfferCounters() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;

    const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
    const workerOffers = jobOffers.filter(offer => offer.workerId === currentUser.id);

    console.log(`📊 Found ${workerOffers.length} total offers for counters`);

    // Count by status
    const pendingCount = workerOffers.filter(offer => offer.status === 'pending').length;
    const acceptedCount = workerOffers.filter(offer => offer.status === 'accepted').length;
    
    // Count expiring soon (within 3 days)
    const now = new Date();
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const expiringSoonCount = workerOffers.filter(offer => {
        if (offer.status !== 'pending') return false;
        const expiresAt = new Date(offer.expiresAt);
        return expiresAt <= threeDaysFromNow && expiresAt > now;
    }).length;

    console.log(`📊 Counters - Pending: ${pendingCount}, Accepted: ${acceptedCount}, Expiring: ${expiringSoonCount}`);

    // METHOD 1: Try different selectors to find the counter elements
    let pendingElement, acceptedElement, expiringElement;

    // Try to find by data-translate attributes first
    pendingElement = document.querySelector('[data-translate="pending_offers"]');
    acceptedElement = document.querySelector('[data-translate="accepted"]');
    expiringElement = document.querySelector('[data-translate="expiring_soon"]');

    // If not found by data-translate, try by text content
    if (!pendingElement) {
        pendingElement = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent.includes('Pending Offers') || 
            el.textContent.includes('Pending')
        );
    }

    if (!acceptedElement) {
        acceptedElement = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent.includes('Accepted')
        );
    }

    if (!expiringElement) {
        expiringElement = Array.from(document.querySelectorAll('*')).find(el => 
            el.textContent.includes('Expiring Soon')
        );
    }

    // METHOD 2: If still not found, try by common counter classes/IDs
    if (!pendingElement) {
        pendingElement = document.getElementById('pendingOffersCount') || 
                        document.querySelector('.pending-count') ||
                        document.querySelector('[class*="pending"] .stat-number');
    }

    if (!acceptedElement) {
        acceptedElement = document.getElementById('acceptedOffersCount') || 
                         document.querySelector('.accepted-count') ||
                         document.querySelector('[class*="accepted"] .stat-number');
    }

    if (!expiringElement) {
        expiringElement = document.getElementById('expiringOffersCount') || 
                         document.querySelector('.expiring-count') ||
                         document.querySelector('[class*="expiring"] .stat-number');
    }

    // Update the elements if found
    if (pendingElement) {
        pendingElement.textContent = pendingCount;
        console.log('✅ Updated pending offers counter:', pendingCount);
    } else {
        console.warn('❌ Pending offers counter element not found');
    }

    if (acceptedElement) {
        acceptedElement.textContent = acceptedCount;
        console.log('✅ Updated accepted offers counter:', acceptedCount);
    } else {
        console.warn('❌ Accepted offers counter element not found');
    }

    if (expiringElement) {
        expiringElement.textContent = expiringSoonCount;
        console.log('✅ Updated expiring soon counter:', expiringSoonCount);
    } else {
        console.warn('❌ Expiring soon counter element not found');
    }
}

// BIND JOB OFFER EVENT LISTENERS
 bindJobOfferEvents() {
    console.log('🔗 Binding job offer event listeners...');
    
    // Accept offer buttons
    document.querySelectorAll('.accept-offer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const offerId = e.target.getAttribute('data-offer-id');
            console.log('✅ Accept offer button clicked:', offerId);
            this.acceptJobOffer(offerId);
        });
    });
    
    // Review agreement buttons
    document.querySelectorAll('.review-agreement-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const offerId = e.target.getAttribute('data-offer-id');
            console.log('📝 Review agreement button clicked:', offerId);
            this.showAgreementAcceptanceModal(offerId);
        });
    });
    
    // View agreement buttons
    document.querySelectorAll('.view-agreement-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const agreementId = e.target.getAttribute('data-agreement-id');
            console.log('👁️ View agreement button clicked:', agreementId);
            this.viewAgreementDetails(agreementId);
        });
    });
    
    // Reject offer buttons
    document.querySelectorAll('.reject-offer-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const offerId = e.target.getAttribute('data-offer-id');
            console.log('❌ Reject offer button clicked:', offerId);
            this.rejectJobOffer(offerId);
        });
    });
    
    // View details buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const offerId = e.target.getAttribute('data-offer-id');
            console.log('ℹ️ View details button clicked:', offerId);
            this.viewJobOfferDetails(offerId);
        });
    });
}

  acceptJobOffer(offerId) {
    console.log('✅ Worker accepting job offer:', offerId);
    setTimeout(() => this.updateOfferCounters(), 500);

    const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
    const offerIndex = jobOffers.findIndex(offer => offer.id === offerId);
    
    if (offerIndex !== -1) {
        jobOffers[offerIndex].status = 'accepted';
        jobOffers[offerIndex].respondedAt = new Date().toISOString();
        localStorage.setItem('opuslink_job_offers', JSON.stringify(jobOffers));
    }
    
    // Check if agreement already exists
    if (AgreementManager.hasAgreementForJobOffer(offerId)) {
        // Show agreement details for acceptance
        this.showAgreementAcceptanceModal(offerId);
        return;
    }
    
    // Create agreement first
    this.showAgreementCreationForOfferModal(offerId);
}
showAgreementCreationForOfferModal(offerId) {
    console.log('📝 Creating agreement for job offer:', offerId);
    
    const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
    const jobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
    const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
    
    const offer = jobOffers.find(o => o.id === offerId);
    if (!offer) {
        OpusUtils.showNotification('Job offer not found', 'error');
        return;
    }

    const job = jobs.find(j => j.id === offer.jobId);
    const employer = users.find(u => u.id === offer.employerId);
    
    if (!offer || !employer) {
        OpusUtils.showNotification('Offer data not found', 'error');
        return;
    }

    const modalContent = `
        <div style="padding: 20px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">Create Agreement for Job Offer</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="color: var(--text-primary); margin-bottom: 8px;">${offer.jobTitle || 'Position'}</h4>
                <p style="color: var(--text-secondary); margin: 4px 0;"><strong>Employer:</strong> ${employer.companyName || employer.fullName || 'Unknown'}</p>
                <p style="color: var(--text-secondary); margin: 4px 0;"><strong>Location:</strong> ${offer.jobLocation || 'Not specified'}</p>
                <p style="color: var(--text-secondary); margin: 4px 0;"><strong>Salary:</strong> ${offer.jobSalary || 'Not specified'}</p>
                <p style="color: var(--text-secondary); margin: 4px 0;"><strong>Type:</strong> ${offer.jobType || 'Contract'}</p>
            </div>
            
            <form id="offerAgreementForm">
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">
                        Confirm Your Understanding *
                    </label>
                    <div style="background: var(--bg-card); padding: 12px; border-radius: 6px; border: 1px solid var(--border-color);">
                        <label style="display: flex; align-items: flex-start; gap: 8px; cursor: pointer;">
                            <input type="checkbox" id="agreeTermsCheckbox" required style="margin-top: 2px;">
                            <span style="color: var(--text-secondary); font-size: 0.9rem;">
                                I understand and agree to the job requirements, payment terms, and work conditions as specified in the job offer. I confirm my availability for the specified work schedule.
                            </span>
                        </label>
                    </div>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">
                        Availability Start Date *
                    </label>
                    <input type="date" id="startDate" required 
                           style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);"
                           min="${new Date().toISOString().split('T')[0]}"
                           value="${new Date().toISOString().split('T')[0]}">
                </div>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">
                        Additional Notes (Optional)
                    </label>
                    <textarea id="workerNotes" 
                              style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); min-height: 80px;"
                              placeholder="Any questions, concerns, or additional requirements..."></textarea>
                </div>
            </form>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                <button type="button" onclick="OpusUtils.closeModal()" 
                        style="background: transparent; color: var(--text-secondary); border: 1px solid var(--border-color); padding: 10px 20px; border-radius: 6px; cursor: pointer;">
                    Cancel
                </button>
                <button type="button" onclick="workerDashboard.createAgreementForOffer('${offerId}')" 
                        style="background: var(--gold-primary); color: black; border: none; padding: 10px 20px; border-radius: 6px; font-weight: 600; cursor: pointer;">
                    Create Agreement
                </button>
            </div>
        </div>
    `;

    OpusUtils.showModal('Create Agreement', modalContent);
}

// FIX THE AGREEMENT CREATION METHOD
 createAgreementForOffer(offerId) {
    console.log('📝 Creating agreement for offer:', offerId);
    
    const agreeCheckbox = document.getElementById('agreeTermsCheckbox');
    const startDateInput = document.getElementById('startDate');
    
    if (!agreeCheckbox || !agreeCheckbox.checked) {
        OpusUtils.showNotification('Please confirm your understanding by checking the agreement box', 'error');
        return;
    }
    
    if (!startDateInput || !startDateInput.value) {
        OpusUtils.showNotification('Please select a start date', 'error');
        return;
    }
    
    // VALIDATE AND FIX THE START DATE
    let startDate = new Date(startDateInput.value);
    if (isNaN(startDate.getTime())) {
        startDate = new Date(); // Fallback to today if invalid
    }
    
    // Get the job offer to extract default terms
    const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
    const offer = jobOffers.find(o => o.id === offerId);
    
    if (!offer) {
        OpusUtils.showNotification('Job offer not found', 'error');
        return;
    }
    
    // Create complete terms object with all required fields
    const terms = {
        // Payment terms (use defaults from offer or sensible defaults)
        paymentType: offer.jobType === 'hourly' ? 'hourly' : 'monthly',
        paymentAmount: this.extractSalaryAmount(offer.jobSalary) || 45000,
        paymentSchedule: 'monthly',
        currency: 'INR',
        
        // Work terms
        workType: offer.jobType || 'fulltime',
        workLocation: offer.jobLocation || 'remote',
        duration: 90, // Default 3 months
        weeklyHours: offer.jobType === 'fulltime' ? 40 : 20,
        startDate: startDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        probationPeriod: 0,
        noticePeriod: 15,
        workingDays: 'mon_fri',
        shiftTiming: 'general',
        overtimePolicy: 'paid_2x',
        
        // Legal terms
        ipRights: 'employer',
        confidentiality: 'standard',
        equipmentProvision: 'employer_provides',
        additionalTerms: document.getElementById('workerNotes')?.value || '',
        
        // Additional fields
        workerNotes: document.getElementById('workerNotes')?.value || ''
    };
    
    console.log('📋 Sending terms to agreement manager:', terms);
    
    try {
        const agreement = AgreementManager.createAgreementForJobOffer(offerId, terms);
        
        if (agreement) {
            OpusUtils.showNotification('✅ Agreement created! Please review and accept the agreement terms.', 'success');
            OpusUtils.closeModal();
            
            // Reload job offers to show the new agreement status
            setTimeout(() => {
                this.loadJobOffers();
            }, 500);
        } else {
            OpusUtils.showNotification('Failed to create agreement', 'error');
        }
        
    } catch (error) {
        console.error('❌ Error creating agreement for offer:', error);
        OpusUtils.showNotification('Failed to create agreement: ' + error.message, 'error');
    }
}

// Helper method to extract salary amount from salary string
 extractSalaryAmount(salaryString) {
    if (!salaryString) return 45000;
    
    // Extract numbers from strings like "₹45,000/month" or "45000"
    const matches = salaryString.match(/\d+/g);
    if (matches && matches.length > 0) {
        return parseInt(matches.join(''));
    }
    
    return 45000; // Default fallback
}

// IN WorkerDashboard CLASS - ENHANCE showAgreementAcceptanceModal METHOD
 showAgreementAcceptanceModal(offerId) {
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    const agreement = agreements.find(a => a.offerId === offerId);
    
    if (!agreement) {
        OpusUtils.showNotification('Agreement not found', 'error');
        return;
    }
    
    const modalContent = `
        <div style="padding: 20px; max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">📝 Review Work Agreement</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="max-height: 70vh; overflow-y: auto;">
                <!-- Agreement Summary -->
                <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1)); padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.1);">
                    <h4 style="color: #fff; margin-bottom: 12px;">${agreement.jobTitle}</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>👤 Employer:</strong> ${agreement.employerName}</p>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>📅 Created:</strong> ${new Date(agreement.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>📍 Location:</strong> ${agreement.workTerms.location}</p>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>🔄 Status:</strong> ${agreement.status.replace(/_/g, ' ')}</p>
                        </div>
                    </div>
                </div>

                <!-- Payment Terms -->
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        💰 Payment Terms
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Type</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${this.formatPaymentType(agreement.paymentTerms.type)}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Amount</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ₹${agreement.paymentTerms.amount.toLocaleString()} ${agreement.paymentTerms.type === 'monthly' ? '/month' : agreement.paymentTerms.type === 'hourly' ? '/hour' : ''}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Schedule</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.paymentTerms.schedule.replace(/_/g, ' ')}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Currency</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.paymentTerms.currency}
                            </div>
                        </div>
                    </div>
                    
                    ${agreement.paymentTerms.expectedHours ? `
                        <div style="margin-top: 12px;">
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Expected Weekly Hours</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.paymentTerms.expectedHours} hours/week
                            </div>
                        </div>
                    ` : ''}
                    
                    ${agreement.paymentTerms.overtimeRate ? `
                        <div style="margin-top: 12px;">
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Overtime Rate</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ₹${agreement.paymentTerms.overtimeRate}/hour
                            </div>
                        </div>
                    ` : ''}
                </div>

                <!-- Work Terms -->
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        ⚙️ Work Terms
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Work Type</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${this.formatWorkType(agreement.workTerms.workType)}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Work Location</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${this.formatLocation(agreement.workTerms.location)}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Duration</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.workTerms.duration} days
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Weekly Hours</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.workTerms.weeklyHours} hours/week
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Start Date</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${new Date(agreement.workTerms.startDate).toLocaleDateString()}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Probation Period</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.workTerms.probationPeriod} days
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Work Schedule -->
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        🕐 Work Schedule
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Working Days</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.workTerms.workingDays.replace(/_/g, ' to ')}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Shift Timing</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${this.formatShiftTiming(agreement.workTerms.shiftTiming)}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Overtime Policy</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${this.formatOvertimePolicy(agreement.workTerms.overtimePolicy)}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Notice Period</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.workTerms.noticePeriod} days
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Terms -->
                ${agreement.legalTerms.additionalTerms ? `
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        📋 Additional Terms
                    </h4>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: var(--muted); font-size: 14px; line-height: 1.5;">
                        ${agreement.legalTerms.additionalTerms}
                    </div>
                </div>
                ` : ''}

                <!-- Legal Terms -->
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        ⚖️ Legal Terms
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Intellectual Property</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${this.formatIPRights(agreement.legalTerms.ipRights)}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Confidentiality</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${this.formatConfidentiality(agreement.legalTerms.confidentiality)}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Equipment Provision</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${this.formatEquipmentProvision(agreement.legalTerms.equipmentProvision)}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Total Value Calculation -->
                <div style="background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(21, 128, 61, 0.1)); border: 1px solid rgba(34, 197, 94, 0.3); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h5 style="color: #22c55e; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                        📊 Agreement Value Summary
                    </h5>
                    <div style="color: var(--muted); font-size: 0.9rem; line-height: 1.6;">
                        <div style="display: grid; gap: 8px;">
                            <div><strong>Estimated Total Value:</strong> ₹${this.calculateAgreementTotalValue(agreement).toLocaleString()}</div>
                            <div><strong>Payment Schedule:</strong> ${agreement.paymentTerms.schedule.replace(/_/g, ' ')}</div>
                            <div><strong>Work Duration:</strong> ${agreement.workTerms.duration} days (${Math.round(agreement.workTerms.duration / 30)} months)</div>
                            <div><strong>Weekly Commitment:</strong> ${agreement.workTerms.weeklyHours} hours</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Acceptance Section -->
            <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-top: 20px;">
                <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                    ✅ Agreement Acceptance
                </h4>
                
                <div style="margin-bottom: 16px;">
                    <label style="display: flex; align-items: flex-start; gap: 8px; cursor: pointer; color: var(--text-secondary);">
                        <input type="checkbox" id="agreeTerms" required style="margin-top: 2px;">
                        <span style="font-size: 0.9rem;">
                            I have read and understood all the terms and conditions of this agreement. I agree to abide by the payment terms, work schedule, and all other conditions specified above.
                        </span>
                    </label>
                </div>
                
                <div style="margin-bottom: 16px;">
                    <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Acceptance Date</label>
                    <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                        ${new Date().toLocaleDateString()}
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button type="button" onclick="workerDashboard.rejectAgreementWithReason('${agreement.id}')" 
                            style="background: transparent; color: var(--text-secondary); border: 1px solid var(--border-color); padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500;">
                        ❌ Reject Agreement
                    </button>
                    <button type="button" onclick="workerDashboard.acceptAgreement('${agreement.id}')" 
                            style="background: linear-gradient(135deg, var(--accent), #3b82f6); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;"
                            id="acceptAgreementBtn" disabled>
                        ✅ Accept Agreement
                    </button>
                </div>
            </div>
        </div>
    `;

    OpusUtils.showModal('Review Agreement', modalContent);
    
    // Enable accept button when terms are agreed
    const agreeCheckbox = document.getElementById('agreeTerms');
    const acceptButton = document.getElementById('acceptAgreementBtn');
    
    if (agreeCheckbox && acceptButton) {
        agreeCheckbox.addEventListener('change', function() {
            acceptButton.disabled = !this.checked;
        });
    }
}
// 🔧 ADD TERMINATION METHODS TO WorkerDashboard class

showTerminateAgreementModal(agreementId) {
    const agreement = AgreementManager.getAgreement(agreementId);
    if (!agreement) {
        OpusUtils.showNotification('Agreement not found', 'error');
        return;
    }

    const modalContent = `
        <div style="padding: 20px; max-width: 500px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">🏁 Terminate Agreement</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <p style="color: var(--text-secondary);">You are requesting to terminate the agreement for:</p>
                <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px;">
                    <h4 style="color: #fff; margin: 0 0 8px 0;">${agreement.jobTitle}</h4>
                    <p style="color: var(--muted); margin: 0;">Employer: ${agreement.employerName}</p>
                </div>
            </div>
            
            <form id="workerTerminateAgreementForm">
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Reason for Termination *</label>
                    <select id="workerTerminateReason" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);" required>
                        <option value="">Select reason</option>
                        <option value="found_better_opportunity">Found Better Opportunity</option>
                        <option value="personal_reasons">Personal Reasons</option>
                        <option value="work_environment">Work Environment Issues</option>
                        <option value="payment_issues">Payment Issues</option>
                        <option value="health_reasons">Health Reasons</option>
                        <option value="mutual_agreement">Mutual Agreement</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Additional Details</label>
                    <textarea id="workerTerminateDetails" style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary); min-height: 80px;" 
                              placeholder="Provide details about why you want to terminate this agreement..."></textarea>
                </div>
                
                <div class="form-group">
                    <label style="display: block; margin-bottom: 8px; color: var(--text-primary); font-weight: 500;">Last Working Date</label>
                    <input type="date" id="workerEffectiveDate" 
                           style="width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 6px; color: var(--text-primary);"
                           min="${new Date().toISOString().split('T')[0]}"
                           value="${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}">
                    <small style="color: var(--muted); font-size: 0.8rem;">Suggested: Give at least 1 week notice</small>
                </div>
                
                <div class="form-group">
                    <label style="display: flex; align-items: flex-start; gap: 8px; cursor: pointer; color: var(--text-secondary);">
                        <input type="checkbox" id="workerConfirmTermination" required style="margin-top: 2px;">
                        <span style="font-size: 0.9rem;">
                            I understand that this termination request requires employer approval and will end our work relationship.
                        </span>
                    </label>
                </div>
            </form>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 20px;">
                <button class="btn btn-ghost" onclick="OpusUtils.closeModal()">Cancel</button>
                <button class="btn btn-danger" onclick="workerDashboard.submitTerminationRequest('${agreement.id}')" 
                        id="workerTerminateBtn" disabled>Request Termination</button>
            </div>
        </div>
    `;

    OpusUtils.showModal('Terminate Agreement', modalContent);
    
    // Enable button when confirmed
    const confirmCheckbox = document.getElementById('workerConfirmTermination');
    const terminateBtn = document.getElementById('workerTerminateBtn');
    
    if (confirmCheckbox && terminateBtn) {
        confirmCheckbox.addEventListener('change', function() {
            terminateBtn.disabled = !this.checked;
        });
    }
}

submitTerminationRequest(agreementId) {
    const agreement = AgreementManager.getAgreement(agreementId);
    if (!agreement) return;

    const reason = document.getElementById('workerTerminateReason').value;
    const details = document.getElementById('workerTerminateDetails').value;
    const effectiveDate = document.getElementById('workerEffectiveDate').value;

    if (!reason) {
        OpusUtils.showNotification('Please select a reason for termination', 'error');
        return;
    }

    const terminationData = {
        reason: reason,
        details: details,
        effectiveDate: effectiveDate || new Date().toISOString()
    };

    const request = AgreementManager.requestAgreementTermination(
        agreementId, 
        terminationData, 
        { id: this.currentUser.id, name: this.currentUser.fullName, role: 'worker' }
    );

    if (request) {
        OpusUtils.closeModal();
        OpusUtils.showNotification('Termination request sent to employer for approval', 'success');
        
        // Notify employer
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.createNotification(
                agreement.employerId,
                'agreement_termination_request',
                {
                    agreementId: agreementId,
                    jobTitle: agreement.jobTitle,
                    workerName: agreement.workerName,
                    requestId: request.id
                }
            );
        }
        
        // Refresh the manage agreement modal
        setTimeout(() => {
            this.showManageAgreementModal(agreementId);
        }, 500);
    }
}

respondToTermination(terminationId, agreementId, response) {
    const result = AgreementManager.respondToTermination(
        terminationId, 
        agreementId, 
        { status: response, message: `${response} the termination request` },
        { role: 'worker' }
    );

    if (result) {
        OpusUtils.closeModal();
        OpusUtils.showNotification(`Termination request ${response}`, 'success');
        this.showManageAgreementModal(agreementId);
    }
}
// Add this method to WorkerDashboard class
refreshJobOffers() {
    console.log('🔄 Refreshing job offers...');
    this.loadJobOffers();
    OpusUtils.showNotification('Job offers refreshed!', 'success');
}

// Add this method to WorkerDashboard class
setupJobOfferFilters() {
    const offerStatusFilter = document.getElementById('offerStatusFilter');
    if (offerStatusFilter) {
        offerStatusFilter.addEventListener('change', () => {
            this.filterJobOffers();
        });
    }
}

filterJobOffers() {
    const statusFilter = document.getElementById('offerStatusFilter')?.value || 'all';
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) return;

    const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
    let workerOffers = jobOffers.filter(offer => offer.workerId === currentUser.id);

    // Normalize status values for filtering
    if (statusFilter !== 'all') {
        workerOffers = workerOffers.filter(offer => {
            const offerStatus = (offer.status || 'pending').toLowerCase();
            return offerStatus === statusFilter.toLowerCase();
        });
    }

    console.log(`📨 Filtered job offers: ${workerOffers.length} offers (status: ${statusFilter})`);
    
    // Update counters
    this.updateOfferCounters();
    
    // Display filtered offers
    this.displayJobOffers(workerOffers);
}

formatStatusFilter(status) {
    const statusMap = {
        'pending': 'Pending',
        'accepted': 'Accepted', 
        'rejected': 'Declined',
        'all': 'All'
    };
    return statusMap[status] || status;
}

// Calculate total agreement value
 calculateAgreementTotalValue(agreement) {
    try {
        // Validate agreement structure
        if (!agreement || typeof agreement !== 'object') {
            console.warn('❌ Invalid agreement object:', agreement);
            return 0;
        }

        const paymentTerms = agreement.paymentTerms;
        const workTerms = agreement.workTerms;

        // Validate required fields with fallbacks
        if (!paymentTerms || !paymentTerms.amount) {
            console.warn('❌ Missing payment terms in agreement:', agreement.id);
            return 0;
        }

        const amountNum = parseFloat(paymentTerms.amount);
        if (isNaN(amountNum)) {
            console.warn('❌ Invalid payment amount in agreement:', agreement.id);
            return 0;
        }

        // If no work terms, return base amount
        if (!workTerms) {
            console.warn('⚠️ No work terms found in agreement, using base amount:', agreement.id);
            return amountNum;
        }

        const durationNum = workTerms.duration ? parseInt(workTerms.duration) : 30; // Default 30 days
        const weeklyHoursNum = workTerms.weeklyHours ? parseInt(workTerms.weeklyHours) : 40; // Default 40 hours

        // Calculate based on payment type
        switch(paymentTerms.type) {
            case 'hourly':
                // Assuming 4.33 weeks per month for calculation
                const totalHours = (durationNum / 30) * 4.33 * weeklyHoursNum;
                return Math.round(amountNum * totalHours);
                
            case 'daily':
                return Math.round(amountNum * durationNum);
                
            case 'weekly':
                const totalWeeks = durationNum / 7;
                return Math.round(amountNum * totalWeeks);
                
            case 'monthly':
                const totalMonths = durationNum / 30;
                return Math.round(amountNum * totalMonths);
                
            case 'fixed':
                return amountNum;
                
            default:
                return amountNum;
        }
    } catch (error) {
        console.error('❌ Error calculating agreement total value:', error, agreement);
        return 0;
    }
}

// Formatting methods for display
 formatPaymentType(type) {
    const types = {
        'hourly': '💰 Hourly Rate',
        'daily': '📅 Daily Rate', 
        'weekly': '🗓️ Weekly Salary',
        'monthly': '📊 Monthly Salary',
        'fixed': '🎯 Fixed Project',
        'milestone': '🏆 Milestone-based',
        'commission': '📈 Commission Only',
        'retainer': '🔄 Retainer',
        'piece_rate': '🧩 Piece Rate'
    };
    return types[type] || type;
}

 formatWorkType(type) {
    const types = {
        'fulltime': '🕘 Full-Time',
        'parttime': '⏰ Part-Time',
        'contract': '📝 Contract',
        'freelance': '🎯 Freelance',
        'internship': '🎓 Internship',
        'remote': '🌍 Remote',
        'hybrid': '🏢 Hybrid',
        'shift_based': '🔄 Shift-based'
    };
    return types[type] || type;
}

 formatLocation(location) {
    const locations = {
        'remote': '🌍 Fully Remote',
        'onsite': '🏢 On-Site',
        'hybrid': '🔄 Hybrid',
        'client_site': '👥 Client Site'
    };
    return locations[location] || location;
}

 formatShiftTiming(timing) {
    const timings = {
        'general': 'General (9 AM - 6 PM)',
        'morning': 'Morning Shift',
        'evening': 'Evening Shift',
        'night': 'Night Shift',
        'rotating': 'Rotating Shifts',
        'flexible': 'Flexible Timing'
    };
    return timings[timing] || timing;
}

formatOvertimePolicy(policy) {
    const policies = {
        'paid_1.5x': 'Paid (1.5x rate)',
        'paid_2x': 'Paid (2x rate)',
        'comp_off': 'Compensatory Off',
        'no_overtime': 'No Overtime',
        'as_per_company': 'As per company policy'
    };
    return policies[policy] || policy;
}

 formatIPRights(rights) {
    const rightsMap = {
        'employer': 'Belongs to Employer',
        'worker': 'Belongs to Worker',
        'shared': 'Shared Ownership',
        'project_specific': 'Project Specific'
    };
    return rightsMap[rights] || rights;
}

 formatConfidentiality(confidentiality) {
    const levels = {
        'standard': 'Standard Confidentiality',
        'strict': 'Strict Confidentiality',
        'nda_required': 'NDA Required',
        'none': 'No Confidentiality'
    };
    return levels[confidentiality] || confidentiality;
}

 formatEquipmentProvision(provision) {
    const provisions = {
        'employer_provides': 'Employer Provides',
        'worker_provides': 'Worker Provides',
        'shared': 'Shared Responsibility',
        'allowance': 'Equipment Allowance'
    };
    return provisions[provision] || provision;
}
    acceptAgreement(agreementId) {
    const agreeCheckbox = document.getElementById('agreeTerms');
    
    if (!agreeCheckbox || !agreeCheckbox.checked) {
        OpusUtils.showNotification('Please agree to the terms and conditions before accepting the agreement', 'error');
        return;
    }
    
    try {
        // Use the new AgreementManager method
        if (AgreementManager.acceptAgreement(agreementId)) {
            OpusUtils.showNotification('✅ Agreement accepted successfully! You can now start working on this project.', 'success');
            OpusUtils.closeModal();
            
            // Update job offer status
            const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
            const agreement = AgreementManager.getAgreement(agreementId);
            
            if (agreement && agreement.offerId) {
                const offerIndex = jobOffers.findIndex(offer => offer.id === agreement.offerId);
                if (offerIndex !== -1) {
                    jobOffers[offerIndex].status = 'accepted';
                    jobOffers[offerIndex].agreementAcceptedAt = new Date().toISOString();
                    localStorage.setItem('opuslink_job_offers', JSON.stringify(jobOffers));
                }
            }
            
            // Reload all relevant sections
            setTimeout(() => {
                this.loadJobOffers();
                this.loadMyAgreements(); // Make sure this is called, not loadActiveAgreements
                if (typeof this.loadActiveAgreements === 'function') {
                    this.loadActiveAgreements();
                }
            }, 500);
            
        } else {
            OpusUtils.showNotification('Failed to accept agreement', 'error');
        }
    } catch (error) {
        console.error('❌ Error in acceptAgreement:', error);
        OpusUtils.showNotification('Error accepting agreement: ' + error.message, 'error');
    }
}
// 🔧 DEBUG VERSION OF migrateAgreementData
migrateAgreementData() {
    console.log('🔄 DEBUG: Starting migrateAgreementData...');
    
    try {
        console.log('📦 Step 1: Reading localStorage...');
        const agreementsData = localStorage.getItem('opuslink_agreements');
        console.log('📦 Raw agreements data:', agreementsData);
        
        const agreements = JSON.parse(agreementsData || '[]');
        console.log('📦 Parsed agreements:', agreements);
        
        console.log('👤 Step 2: Getting current user...');
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        console.log('👤 Current user:', currentUser);
        
        if (!currentUser) {
            console.log('❌ No user logged in for agreement migration');
            return []; // Return empty array instead of undefined
        }

        console.log(`📋 Step 3: Filtering agreements for worker ${currentUser.id}...`);
        const workerAgreements = agreements.filter(agreement => {
            console.log('🔍 Checking agreement:', {
                agreementId: agreement.id,
                workerId: agreement.workerId,
                currentUserId: currentUser.id,
                matches: agreement.workerId === currentUser.id
            });
            return agreement.workerId === currentUser.id;
        });
        
        console.log(`👤 Step 4: Found ${workerAgreements.length} agreements for worker`);
        
        workerAgreements.forEach(agreement => {
            console.log(`📄 Agreement ${agreement.id}:`, {
                status: agreement.status,
                jobTitle: agreement.jobTitle,
                employerName: agreement.employerName,
                hasWorkTerms: !!agreement.workTerms,
                hasPaymentTerms: !!agreement.paymentTerms
            });
        });

        console.log('✅ DEBUG: migrateAgreementData returning:', workerAgreements);
        return workerAgreements;
        
    } catch (error) {
        console.error('❌ DEBUG: Error in migrateAgreementData:', error);
        console.error('❌ Error stack:', error.stack);
        return []; // Return empty array instead of undefined
    }
}
// 🔧 ADD THIS MISSING METHOD
showAgreementError() {
    console.log('🔄 Showing agreement error state...');
    
    const container = document.getElementById('activeAgreementsContainer');
    if (!container) {
        console.error('❌ Active agreements container not found');
        return;
    }

    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h3>Error Loading Agreements</h3>
            <p>There was a problem loading your agreements. Please try refreshing the page.</p>
            <div style="display: flex; gap: 12px; margin-top: 16px;">
                <button onclick="location.reload()" class="btn btn-primary">
                    🔄 Refresh Page
                </button>
                <button onclick="workerDashboard.debugAgreementFlow()" class="btn btn-ghost">
                    🐛 Debug Agreements
                </button>
            </div>
        </div>
    `;
}
// Add this helper method to repair agreements for display
 quickRepairAgreement(agreement) {
    let wasRepaired = false;
    
    // Create a copy to avoid modifying the original
    const repaired = JSON.parse(JSON.stringify(agreement));
    
    // Repair workTerms if missing
    if (!repaired.workTerms) {
        repaired.workTerms = {
            workType: 'fulltime',
            location: 'remote',
            duration: 90,
            weeklyHours: 40,
            startDate: repaired.createdAt || new Date().toISOString()
        };
        wasRepaired = true;
    }
    
    // Repair paymentTerms if missing
    if (!repaired.paymentTerms) {
        repaired.paymentTerms = {
            type: 'monthly',
            amount: 45000,
            schedule: 'monthly',
            currency: 'INR'
        };
        wasRepaired = true;
    }
    
    // Ensure status exists
    if (!repaired.status) {
        repaired.status = 'active';
        wasRepaired = true;
    }
    
    return { agreement: repaired, wasRepaired };
}

// Add this method to fix all agreements
 migrateAndRepairAllAgreements() {
    console.log('🔧 Migrating and repairing all agreements...');
    
    try {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        let repairedCount = 0;
        
        const repairedAgreements = agreements.map(agreement => {
            const result = this.quickRepairAgreement(agreement);
            if (result.wasRepaired) {
                repairedCount++;
            }
            return result.agreement;
        });
        
        // Save the repaired agreements
        localStorage.setItem('opuslink_agreements', JSON.stringify(repairedAgreements));
        
        OpusUtils.showNotification(`✅ Repaired ${repairedCount} agreements successfully!`, 'success');
        console.log(`🔧 Repaired ${repairedCount} agreements`);
        
        // Reload the agreements display
        setTimeout(() => {
            if (typeof this.loadMyAgreements === 'function') {
                this.loadMyAgreements();
            }
            if (typeof this.loadActiveAgreements === 'function') {
                this.loadActiveAgreements();
            }
        }, 1000);
        
        return repairedCount;
        
    } catch (error) {
        console.error('❌ Error repairing agreements:', error);
        OpusUtils.showNotification('Error repairing agreements', 'error');
        return 0;
    }
}

// Also add this method to ensure AgreementManager.getAgreement exists
 ensureAgreementManagerMethods() {
    // Make sure AgreementManager has the getAgreement method
    if (typeof AgreementManager === 'object' && !AgreementManager.getAgreement) {
        AgreementManager.getAgreement = function(agreementId) {
            const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
            return agreements.find(a => a.id === agreementId);
        };
    }
}


 rejectAgreementWithReason(agreementId) {
    const reason = prompt('Please provide a detailed reason for rejecting this agreement:');
    if (reason === null || reason.trim() === '') {
        OpusUtils.showNotification('Please provide a reason for rejection', 'info');
        return;
    }
    
    if (AgreementManager.rejectAgreement(agreementId, reason.trim())) {
        OpusUtils.showNotification('Agreement rejected successfully', 'info');
        OpusUtils.closeModal();
        this.loadJobOffers();
    } else {
        OpusUtils.showNotification('Failed to reject agreement', 'error');
    }
}

    // ENHANCE REJECT JOB OFFER METHOD
rejectJobOffer(offerId) {
    if (!confirm('Are you sure you want to decline this job offer?')) {
        return;
    }
    
    const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
    const offerIndex = jobOffers.findIndex(offer => offer.id === offerId);
    
    if (offerIndex !== -1) {
        jobOffers[offerIndex].status = 'rejected';
        jobOffers[offerIndex].respondedAt = new Date().toISOString();
        localStorage.setItem('opuslink_job_offers', JSON.stringify(jobOffers));
        
        OpusUtils.showNotification('Job offer declined', 'info');
        this.loadJobOffers(); // This will trigger counter update
        
        // Also update counters directly
        this.updateOfferCounters();
    }
}


    createApplicationFromOffer(offer) {
        const application = {
            id: 'app_' + Date.now(),
            jobId: offer.jobId,
            jobTitle: offer.jobTitle,
            employerId: offer.employerId,
            workerId: offer.workerId,
            workerName: offer.workerName,
            workerEmail: offer.workerEmail,
            coverLetter: `I'm excited to accept the job offer for ${offer.jobTitle} position. Thank you for considering me!`,
            appliedDate: new Date().toISOString(),
            status: 'accepted',
            source: 'direct_offer'
        };

        const applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
        applications.push(application);
        localStorage.setItem('opuslink_applications', JSON.stringify(applications));
        
        return application;
    }

// FIX VIEW JOB OFFER DETAILS METHOD
 viewJobOfferDetails(offerId) {
    console.log('ℹ️ Viewing job offer details:', offerId);
    
    const jobOffers = JSON.parse(localStorage.getItem('opuslink_job_offers') || '[]');
    const jobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
    const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
    
    const offer = jobOffers.find(o => o.id === offerId);
    if (!offer) {
        OpusUtils.showNotification('Job offer not found', 'error');
        return;
    }

    const job = jobs.find(j => j.id === offer.jobId);
    const employer = users.find(u => u.id === offer.employerId);
    const hasAgreement = AgreementManager.hasAgreementForJobOffer(offerId);
    const agreement = hasAgreement ? AgreementManager.getUserAgreements(this.currentUser.id)
        .find(a => a.offerId === offerId) : null;

    const modalContent = `
        <div style="max-width: 600px;">
            <h3>Job Offer Details</h3>
            
            <div style="background: rgba(255,255,255,0.05); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                <h4 style="color: #fff; margin-bottom: 8px;">${offer.jobTitle || 'Position'}</h4>
                <p style="color: var(--accent); font-weight: 600; margin: 0 0 12px 0;">
                    Offer from ${employer?.companyName || employer?.fullName || 'Unknown Employer'}
                </p>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <div>
                        <strong>Location:</strong><br>
                        <span style="color: var(--muted);">${offer.jobLocation || 'Not specified'}</span>
                    </div>
                    <div>
                        <strong>Type:</strong><br>
                        <span style="color: var(--muted);">${this.formatJobType(offer.jobType || 'contract')}</span>
                    </div>
                    <div>
                        <strong>Salary:</strong><br>
                        <span style="color: var(--muted);">${offer.jobSalary || 'Not specified'}</span>
                    </div>
                    <div>
                        <strong>Category:</strong><br>
                        <span style="color: var(--muted);">${job?.category ? this.formatCategory(job.category) : 'Not specified'}</span>
                    </div>
                </div>
                
                <div>
                    <strong>Offer Date:</strong><br>
                    <span style="color: var(--muted);">${new Date(offer.offerDate).toLocaleString()}</span>
                </div>
                <div>
                    <strong>Expires:</strong><br>
                    <span style="color: #f59e0b;">${new Date(offer.expiresAt).toLocaleString()}</span>
                </div>
                
                ${hasAgreement ? `
                    <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1);">
                        <strong>Agreement Status:</strong><br>
                        <span style="color: ${agreement?.status === 'pending_worker_acceptance' ? '#f59e0b' : '#22c55e'};">
                            ${agreement?.status === 'pending_worker_acceptance' ? '📝 Pending Your Acceptance' : '✅ Agreement Active'}
                        </span>
                    </div>
                ` : ''}
            </div>
            
            <div style="margin-bottom: 16px;">
                <strong>Job Description:</strong>
                <div style="color: var(--muted); margin-top: 8px; line-height: 1.5;">
                    ${job?.description || offer.jobDescription || 'No description provided.'}
                </div>
            </div>
            
            <div style="margin-bottom: 16px;">
                <strong>Offer Message:</strong>
                <div style="color: var(--muted); margin-top: 8px; line-height: 1.5;">
                    ${offer.message || 'No additional message.'}
                </div>
            </div>
            
            <div class="form-actions">
                ${!hasAgreement ? `
                    <button class="btn btn-success" onclick="workerDashboard.acceptJobOffer('${offer.id}')">
                        ✅ Accept Offer & Create Agreement
                    </button>
                ` : agreement?.status === 'pending_worker_acceptance' ? `
                    <button class="btn btn-primary" onclick="workerDashboard.showAgreementAcceptanceModal('${offer.id}')">
                        📝 Review Agreement
                    </button>
                ` : agreement ? `
                    <button class="btn btn-success" onclick="workerDashboard.viewAgreementDetails('${agreement.id}')">
                        👁️ View Agreement
                    </button>
                ` : ''}
                
                <button class="btn btn-danger" onclick="workerDashboard.rejectJobOffer('${offer.id}')">
                    ❌ ${hasAgreement ? 'Withdraw' : 'Decline'} Offer
                </button>
                <button class="btn btn-ghost" onclick="OpusUtils.closeModal()">
                    Close
                </button>
            </div>
        </div>
    `;
    
    OpusUtils.showModal('Job Offer Details', modalContent);
}

// 🔧 UPDATED loadActiveAgreements METHOD
loadActiveAgreements() {
    console.log('📋 WorkerDashboard: Loading active agreements...');
    
    try {
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) {
            console.log('❌ No user logged in');
            this.showNoUserError();
            return;
        }

        console.log('👤 Current user:', currentUser.id);
        
        // Get agreements directly
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        console.log('📊 Total agreements in storage:', agreements.length);
        
        // Filter for current user's agreements
        const userAgreements = agreements.filter(agreement => {
            if (!agreement || !agreement.workerId) return false;
            return agreement.workerId === currentUser.id;
        });
        
        console.log('👤 User agreements found:', userAgreements.length);
        userAgreements.forEach(agreement => {
            console.log(`📄 ${agreement.id}: ${agreement.jobTitle} - ${agreement.status}`);
        });

        // Separate agreements - INCLUDING modification_pending status
        const pendingAgreements = userAgreements.filter(agreement => 
            agreement.status === 'pending_worker_acceptance' || 
            agreement.status === 'pending'
        );
        
        const activeAgreements = userAgreements.filter(agreement => 
            agreement.status === 'active' || 
            agreement.status === 'modification_pending' // 🔥 INCLUDED HERE
        );

        console.log(`🎯 Pending: ${pendingAgreements.length}, Active/Modification: ${activeAgreements.length}`);

        // Display both sections
        this.displayAgreementsSection(pendingAgreements, activeAgreements);
        
    } catch (error) {
        console.error('❌ Error in loadActiveAgreements:', error);
        this.showAgreementError();
    }
}


// 🔧 UPDATED displayAgreementsSection METHOD
displayAgreementsSection(pendingAgreements, activeAgreements) {
    const container = document.getElementById('activeAgreementsContainer');
    if (!container) {
        console.error('❌ Active agreements container not found');
        return;
    }

    let html = '';

    // 1. Display modification requests FIRST (most important)
    const modificationRequestsHTML = this.displayModificationRequests([...pendingAgreements, ...activeAgreements]);
    if (modificationRequestsHTML) {
        html += modificationRequestsHTML;
    }

    // 2. Display pending agreements
    if (pendingAgreements.length > 0) {
        html += `
            <div style="margin-bottom: 32px;">
                <h3 style="color: var(--text-primary); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                    📝 Agreements Pending Your Acceptance (${pendingAgreements.length})
                </h3>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    ${pendingAgreements.map(agreement => this.createPendingAgreementCard(agreement)).join('')}
                </div>
            </div>
        `;
    }

    // 3. Display active agreements
    if (activeAgreements.length > 0) {
        html += `
            <div style="margin-bottom: 24px;">
                <h3 style="color: var(--text-primary); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                    ✅ Active Agreements (${activeAgreements.length})
                </h3>
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    ${activeAgreements.map(agreement => this.createActiveAgreementCard(agreement)).join('')}
                </div>
            </div>
        `;
    }

    // Show empty state if no agreements or requests
    if (!modificationRequestsHTML && pendingAgreements.length === 0 && activeAgreements.length === 0) {
        html = this.createEmptyState('📝', 'No Agreements Yet', 'Your agreements will appear here once employers create them');
    }

    container.innerHTML = html;
    
    // Bind events after rendering
    setTimeout(() => {
        this.bindAgreementButtonEvents();
    }, 100);
    
    console.log('✅ Agreements display updated successfully');
}
// 🔧 ADD METHODS TO HANDLE MODIFICATION REQUESTS
acceptModificationRequest(requestId, agreementId) {
    console.log('✅ Accepting modification request:', requestId);
    
    if (!confirm('Are you sure you want to accept these changes?')) {
        return;
    }
    
    try {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreementIndex = agreements.findIndex(a => a.id === agreementId);
        
        if (agreementIndex === -1) {
            OpusUtils.showNotification('Agreement not found', 'error');
            return;
        }
        
        const agreement = agreements[agreementIndex];
        const requestIndex = agreement.modificationRequests?.findIndex(r => r.id === requestId);
        
        if (requestIndex === -1 || !agreement.modificationRequests) {
            OpusUtils.showNotification('Modification request not found', 'error');
            return;
        }
        
        // Update request status
        agreement.modificationRequests[requestIndex].status = 'accepted';
        agreement.modificationRequests[requestIndex].respondedAt = new Date().toISOString();
        agreement.modificationRequests[requestIndex].respondedBy = 'worker';
        
        // Apply the proposed changes if they exist
        const proposedChanges = agreement.modificationRequests[requestIndex].proposedChanges;
        if (proposedChanges) {
            this.applyProposedChanges(agreement, proposedChanges);
        }
        
        // Update agreement status if it was pending modification
        if (agreement.status === 'modification_pending') {
            agreement.status = 'active';
        }
        
        // Save changes
        agreements[agreementIndex] = agreement;
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        
        OpusUtils.showNotification('✅ Modification request accepted!', 'success');
        
        // Refresh display
        setTimeout(() => {
            this.loadActiveAgreements();
        }, 500);
        
    } catch (error) {
        console.error('❌ Error accepting modification request:', error);
        OpusUtils.showNotification('Failed to accept modification request', 'error');
    }
}

rejectModificationRequest(requestId, agreementId) {
    console.log('❌ Rejecting modification request:', requestId);
    
    const reason = prompt('Please provide a reason for rejecting this modification:');
    if (reason === null) return; // User cancelled
    
    try {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreementIndex = agreements.findIndex(a => a.id === agreementId);
        
        if (agreementIndex === -1) {
            OpusUtils.showNotification('Agreement not found', 'error');
            return;
        }
        
        const agreement = agreements[agreementIndex];
        const requestIndex = agreement.modificationRequests?.findIndex(r => r.id === requestId);
        
        if (requestIndex === -1 || !agreement.modificationRequests) {
            OpusUtils.showNotification('Modification request not found', 'error');
            return;
        }
        
        // Update request status
        agreement.modificationRequests[requestIndex].status = 'rejected';
        agreement.modificationRequests[requestIndex].respondedAt = new Date().toISOString();
        agreement.modificationRequests[requestIndex].respondedBy = 'worker';
        agreement.modificationRequests[requestIndex].rejectionReason = reason;
        
        // Update agreement status back to active
        if (agreement.status === 'modification_pending') {
            agreement.status = 'active';
        }
        
        // Save changes
        agreements[agreementIndex] = agreement;
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        
        OpusUtils.showNotification('Modification request rejected', 'info');
        
        // Refresh display
        setTimeout(() => {
            this.loadActiveAgreements();
        }, 500);
        
    } catch (error) {
        console.error('❌ Error rejecting modification request:', error);
        OpusUtils.showNotification('Failed to reject modification request', 'error');
    }
}

// 🔧 ADD HELPER METHOD TO APPLY CHANGES
applyProposedChanges(agreement, proposedChanges) {
    if (proposedChanges.paymentTerms) {
        agreement.paymentTerms = { ...agreement.paymentTerms, ...proposedChanges.paymentTerms };
    }
    if (proposedChanges.workTerms) {
        agreement.workTerms = { ...agreement.workTerms, ...proposedChanges.workTerms };
    }
    if (proposedChanges.duration) {
        agreement.workTerms.duration = proposedChanges.duration;
    }
    if (proposedChanges.weeklyHours) {
        agreement.workTerms.weeklyHours = proposedChanges.weeklyHours;
    }
    
    agreement.updatedAt = new Date().toISOString();
}
// 🔧 ADD THIS METHOD IF MISSING
showAgreementAcceptanceModal(agreementId) {
    console.log('📝 Opening agreement acceptance modal for:', agreementId);
    
    const agreement = this.getAgreementById(agreementId);
    if (!agreement) {
        OpusUtils.showNotification('Agreement not found', 'error');
        return;
    }

    // Create a simple acceptance modal
    const modalContent = `
        <div style="padding: 20px; max-width: 600px;">
            <h3 style="color: var(--text-primary); margin-bottom: 16px;">📝 Review Agreement</h3>
            
            <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <h4 style="color: #fff; margin-bottom: 8px;">${agreement.jobTitle}</h4>
                <p style="color: var(--muted); margin: 4px 0;"><strong>Employer:</strong> ${agreement.employerName}</p>
                <p style="color: var(--muted); margin: 4px 0;"><strong>Payment:</strong> ₹${agreement.paymentTerms?.amount?.toLocaleString() || '0'}/${agreement.paymentTerms?.type || 'monthly'}</p>
                <p style="color: var(--muted); margin: 4px 0;"><strong>Duration:</strong> ${agreement.workTerms?.duration || 90} days</p>
            </div>
            
            <div style="margin-bottom: 20px;">
                <label style="display: flex; align-items: flex-start; gap: 8px; cursor: pointer;">
                    <input type="checkbox" id="agreeTermsCheckbox">
                    <span style="color: var(--text-secondary);">
                        I have read and agree to the terms and conditions of this agreement.
                    </span>
                </label>
            </div>
            
            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button class="btn btn-ghost" onclick="OpusUtils.closeModal()">Cancel</button>
                <button class="btn btn-primary" onclick="workerDashboard.acceptAgreement('${agreementId}')" id="acceptBtn" disabled>
                    Accept Agreement
                </button>
            </div>
        </div>
    `;

    OpusUtils.showModal('Review Agreement', modalContent);
    
    // Enable accept button when checkbox is checked
    const checkbox = document.getElementById('agreeTermsCheckbox');
    const acceptBtn = document.getElementById('acceptBtn');
    
    if (checkbox && acceptBtn) {
        checkbox.addEventListener('change', function() {
            acceptBtn.disabled = !this.checked;
        });
    }
}

// 🔧 ADD HELPER METHOD TO GET AGREEMENT BY ID
getAgreementById(agreementId) {
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    return agreements.find(a => a.id === agreementId);
}

// 🔧 ADD acceptAgreement METHOD
acceptAgreement(agreementId) {
    console.log('✅ Accepting agreement:', agreementId);
    
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    const agreementIndex = agreements.findIndex(a => a.id === agreementId);
    
    if (agreementIndex === -1) {
        OpusUtils.showNotification('Agreement not found', 'error');
        return;
    }
    
    // Update agreement status
    agreements[agreementIndex].status = 'active';
    agreements[agreementIndex].acceptedAt = new Date().toISOString();
    agreements[agreementIndex].acceptedBy = 'worker';
    
    // Save back to localStorage
    localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
    
    // Close modal and show success message
    OpusUtils.closeModal();
    OpusUtils.showNotification('✅ Agreement accepted successfully!', 'success');
    
    // Refresh the display
    setTimeout(() => {
        this.loadActiveAgreements();
    }, 500);
}

// 🔧 ADD METHOD FOR PENDING AGREEMENT CARDS
// 🔧 ALTERNATIVE: USE DATA ATTRIBUTES INSTEAD OF ONCLICK
createPendingAgreementCard(agreement) {
    const totalValue = this.calculateAgreementTotalValue(agreement);
    const jobTitle = agreement.jobTitle || 'Untitled Agreement';
    const employerName = agreement.employerName || 'Unknown';
    const workType = agreement.workTerms?.workType || 'fulltime';
    const paymentAmount = agreement.paymentTerms?.amount || 0;
    const duration = agreement.workTerms?.duration || 90;
    const weeklyHours = agreement.workTerms?.weeklyHours || 40;
    const location = agreement.workTerms?.location || 'Remote';
    
    return `
        <div class="agreement-card" data-agreement-id="${agreement.id}" style="background: var(--card); border: 2px solid #f59e0b; border-radius: 12px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 8px 0; color: #fff;">${jobTitle}</h4>
                    <div style="color: var(--muted); font-size: 0.9rem; margin-bottom: 8px;">
                        <strong>Employer:</strong> ${employerName} • 
                        <strong>Type:</strong> ${this.formatWorkType(workType)}
                    </div>
                    <div style="color: var(--accent); font-weight: 600;">
                        Total Value: ₹${totalValue.toLocaleString()}
                    </div>
                </div>
                <span style="padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; 
                      background: rgba(245, 158, 11, 0.2); color: #f59e0b;">
                    ⏳ Pending Acceptance
                </span>
            </div>
            
            <div style="color: var(--muted); margin-bottom: 16px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                    <div>
                        <p style="margin: 4px 0;"><strong>Payment:</strong> ₹${paymentAmount.toLocaleString()}/${agreement.paymentTerms?.type || 'monthly'}</p>
                        <p style="margin: 4px 0;"><strong>Duration:</strong> ${duration} days</p>
                    </div>
                    <div>
                        <p style="margin: 4px 0;"><strong>Weekly Hours:</strong> ${weeklyHours}</p>
                        <p style="margin: 4px 0;"><strong>Location:</strong> ${location}</p>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button class="btn btn-primary accept-agreement-btn" data-agreement-id="${agreement.id}">
                    📝 Review & Accept Agreement
                </button>
                <button class="btn btn-ghost view-details-btn" data-agreement-id="${agreement.id}">
                    👁️ View Details
                </button>
                <button class="btn btn-danger reject-agreement-btn" data-agreement-id="${agreement.id}">
                    ❌ Reject
                </button>
            </div>
        </div>
    `;
}
// 🔧 BIND AGREEMENT BUTTON EVENTS
bindAgreementButtonEvents() {
    // Accept agreement buttons
    document.querySelectorAll('.accept-agreement-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const agreementId = e.target.getAttribute('data-agreement-id');
            if (agreementId) {
                this.showAgreementAcceptanceModal(agreementId);
            }
        });
    });
    
    // View details buttons
    document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const agreementId = e.target.getAttribute('data-agreement-id');
            if (agreementId) {
                this.viewAgreementDetails(agreementId);
            }
        });
    });
    
    // Reject agreement buttons
    document.querySelectorAll('.reject-agreement-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const agreementId = e.target.getAttribute('data-agreement-id');
            if (agreementId) {
                this.rejectAgreementWithReason(agreementId);
            }
        });
    });
}

// 🔧 ADD METHOD FOR ACTIVE AGREEMENT CARDS
createActiveAgreementCard(agreement) {
    const totalValue = this.calculateAgreementTotalValue(agreement);
    const totalPaid = agreement.payments ? 
        agreement.payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0) : 0;
    
    return `
        <div class="agreement-card" style="background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                <div style="flex: 1;">
                    <h4 style="margin: 0 0 8px 0; color: #fff;">${agreement.jobTitle || 'Untitled Agreement'}</h4>
                    <div style="color: var(--muted); font-size: 0.9rem; margin-bottom: 8px;">
                        <strong>Employer:</strong> ${agreement.employerName || 'Unknown'} • 
                        <strong>Type:</strong> ${this.formatWorkType(agreement.workTerms?.workType || 'fulltime')}
                    </div>
                </div>
                <span style="padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; 
                      background: rgba(34, 197, 94, 0.2); color: #4ade80;">
                    Active
                </span>
            </div>
            
            <div style="color: var(--muted); margin-bottom: 16px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                    <div>
                        <p style="margin: 4px 0;"><strong>Payment:</strong> ₹${agreement.paymentTerms?.amount?.toLocaleString() || '0'}</p>
                        <p style="margin: 4px 0;"><strong>Total Earned:</strong> ₹${totalPaid.toLocaleString()}</p>
                    </div>
                    <div>
                        <p style="margin: 4px 0;"><strong>Total Value:</strong> ₹${totalValue.toLocaleString()}</p>
                        <p style="margin: 4px 0;"><strong>Started:</strong> ${agreement.workTerms?.startDate ? new Date(agreement.workTerms.startDate).toLocaleDateString() : 'Not set'}</p>
                    </div>
                </div>
            </div>
            
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="workerDashboard.logWork('${agreement.id}')">
                    📝 Log Work
                </button>
                <button class="btn btn-ghost" onclick="workerDashboard.viewAgreementDetails('${agreement.id}')">
                    👁️ View Details
                </button>
            </div>
        </div>
    `;
}

// 🔧 ADD MISSING ERROR METHOD
showNoUserError() {
    const container = document.getElementById('activeAgreementsContainer');
    if (!container) return;
    
    container.innerHTML = `
        <div class="error-state">
            <div class="error-icon">🔒</div>
            <h3>Not Logged In</h3>
            <p>Please log in to view your agreements</p>
            <button onclick="window.location.href='login.html'" class="btn btn-primary">
                Login
            </button>
        </div>
    `;
}

// 🔧 SAFER PENDING AGREEMENTS DISPLAY
displayPendingAgreements(agreements) {
    const container = document.getElementById('activeAgreementsContainer');
    if (!container) {
        console.error('❌ Active agreements container not found');
        return;
    }

    // Ensure agreements is an array
    if (!agreements || !Array.isArray(agreements)) {
        console.error('❌ Invalid agreements data passed to display:', agreements);
        container.innerHTML = this.createEmptyState('⚠️', 'Data Error', 'There was a problem loading agreements data');
        return;
    }

    if (agreements.length === 0) {
        // Only show empty state if we're specifically looking at this section
        const activeSection = document.getElementById('active-agreements');
        if (activeSection && activeSection.style.display !== 'none') {
            container.innerHTML = this.createEmptyState('📝', 'No pending agreements', 'Agreements that need your acceptance will appear here');
        }
        return;
    }

    console.log(`🎯 Displaying ${agreements.length} pending agreements`);

    // Filter out any invalid agreements before display
    const validAgreements = agreements.filter(agreement => 
        agreement && agreement.id && agreement.jobTitle
    );

    if (validAgreements.length === 0) {
        container.innerHTML = this.createEmptyState('📝', 'No valid agreements', 'No valid agreements found to display');
        return;
    }

    container.innerHTML = `
        <div style="margin-bottom: 24px;">
            <h3 style="color: var(--text-primary); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                📝 Agreements Pending Your Acceptance (${validAgreements.length})
            </h3>
            <div style="display: flex; flex-direction: column; gap: 16px;">
                ${validAgreements.map(agreement => {
                    const totalValue = this.calculateAgreementTotalValue(agreement);
                    const jobTitle = agreement.jobTitle || 'Untitled Agreement';
                    const employerName = agreement.employerName || 'Unknown';
                    const workType = agreement.workTerms?.workType || 'fulltime';
                    const paymentAmount = agreement.paymentTerms?.amount || 0;
                    const duration = agreement.workTerms?.duration || 90;
                    const weeklyHours = agreement.workTerms?.weeklyHours || 40;
                    const location = agreement.workTerms?.location || 'Remote';
                    
                    return `
                        <div class="agreement-card" style="background: var(--card); border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                                <div style="flex: 1;">
                                    <h4 style="margin: 0 0 8px 0; color: #fff;">${jobTitle}</h4>
                                    <div style="color: var(--muted); font-size: 0.9rem; margin-bottom: 8px;">
                                        <strong>Employer:</strong> ${employerName} • 
                                        <strong>Type:</strong> ${this.formatWorkType(workType)}
                                    </div>
                                    <div style="color: var(--accent); font-weight: 600;">
                                        Total Value: ₹${totalValue.toLocaleString()}
                                    </div>
                                </div>
                                <span style="padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; 
                                      background: rgba(245, 158, 11, 0.2); color: #f59e0b;">
                                    ⏳ Pending Acceptance
                                </span>
                            </div>
                            
                            <div style="color: var(--muted); margin-bottom: 16px;">
                                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                                    <div>
                                        <p style="margin: 4px 0;"><strong>Payment:</strong> ₹${paymentAmount.toLocaleString()}/${agreement.paymentTerms?.type || 'monthly'}</p>
                                        <p style="margin: 4px 0;"><strong>Duration:</strong> ${duration} days</p>
                                    </div>
                                    <div>
                                        <p style="margin: 4px 0;"><strong>Weekly Hours:</strong> ${weeklyHours}</p>
                                        <p style="margin: 4px 0;"><strong>Location:</strong> ${location}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                                <button class="btn btn-primary" onclick="workerDashboard.showAgreementAcceptanceModal('${agreement.offerId || agreement.id}')">
                                    📝 Review & Accept Agreement
                                </button>
                                <button class="btn btn-ghost" onclick="workerDashboard.viewAgreementDetails('${agreement.id}')">
                                    👁️ View Details
                                </button>
                                <button class="btn btn-danger" onclick="workerDashboard.rejectAgreementWithReason('${agreement.id}')">
                                    ❌ Reject
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}
// 🔧 UPDATED setupAgreementMonitoring - NO AUTO-REFRESH INTERVALS
setupAgreementMonitoring() {
    console.log('👀 Setting up agreement monitoring (no auto-refresh)...');
    
    const userType = this.getUserType();
    if (userType !== 'worker') {
        console.log('🛑 Skipping agreement monitoring - user is not a worker');
        return;
    }
    
    // Only monitor for storage changes (when other tabs update data)
    window.addEventListener('storage', (e) => {
        if (e.key === 'opuslink_agreements' && this.getUserType() === 'worker') {
            console.log('🔄 Agreements updated in another tab, refreshing...');
            setTimeout(() => {
                this.loadActiveAgreements();
                if (this.loadJobOffers) {
                    this.loadJobOffers();
                }
            }, 1000);
        }
    });
    
    console.log('✅ Storage event monitoring setup complete (no auto-refresh intervals)');
}

// 🔧 ADD METHOD TO DETECT USER TYPE
getUserType() {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return null;
    
    // Check if user is employer
    if (currentUser.role === 'employer' || currentUser.companyName || currentUser.employerId) {
        return 'employer';
    }
    // Check if user is worker
    if (currentUser.role === 'worker' || currentUser.workerId || currentUser.skills) {
        return 'worker';
    }
    
    return null;
}

// 🔧 UPDATE checkForNewAgreements TO CHECK USER TYPE
// 🔧 SIMPLIFIED checkForNewAgreements - NO AUTO-REFRESH
checkForNewAgreements() {
    try {
        const userType = this.getUserType();
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        if (!currentUser || userType !== 'worker') {
            return; // Only run for workers
        }

        // Get agreements directly
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const userAgreements = agreements.filter(agreement => 
            agreement && agreement.workerId === currentUser.id
        );
        
        // Check for pending agreements
        const pendingAgreements = userAgreements.filter(agreement => 
            agreement.status === 'pending_worker_acceptance' || 
            agreement.status === 'pending'
        );

        // Check for modification requests
        let modificationRequestCount = 0;
        userAgreements.forEach(agreement => {
            if (agreement.modificationRequests) {
                modificationRequestCount += agreement.modificationRequests.filter(
                    req => req.status === 'pending'
                ).length;
            }
        });

        // Just log the counts, no auto-refresh
        if (modificationRequestCount > 0) {
            console.log(`📝 ${modificationRequestCount} modification request(s) waiting`);
        }
        
        if (pendingAgreements.length > 0) {
            console.log(`📋 ${pendingAgreements.length} agreement(s) pending acceptance`);
        }
        
    } catch (error) {
        console.error('❌ Error in checkForNewAgreements:', error);
    }
}
// 🔧 ADD TO WorkerDashboard class
showManageAgreementModal(agreementId) {
    const agreement = AgreementManager.getAgreement(agreementId);
    if (!agreement) {
        OpusUtils.showNotification('Agreement not found', 'error');
        return;
    }

    const canModify = ['active', 'modification_pending'].includes(agreement.status);
    const canTerminate = ['active', 'termination_pending'].includes(agreement.status);
    const pendingModification = agreement.modificationRequests?.find(m => m.status === 'pending');
    const pendingTermination = agreement.terminationRequests?.find(t => t.status === 'pending');

    const modalContent = `
        <div style="padding: 20px; max-width: 600px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">⚙️ Manage Agreement</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px;">
                    <h4 style="color: #fff; margin: 0 0 8px 0;">${agreement.jobTitle}</h4>
                    <p style="color: var(--muted); margin: 0 0 4px 0;">Employer: ${agreement.employerName}</p>
                    <p style="color: var(--muted); margin: 0;">Status: <span class="status status-${agreement.status}">${agreement.status.replace(/_/g, ' ')}</span></p>
                </div>
            </div>

            ${pendingModification ? `
                <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="color: #f59e0b; margin: 0 0 8px 0;">📝 Modification Request Pending</h4>
                    <p style="color: var(--muted); margin: 0 0 12px 0;">Requested by: ${pendingModification.requestedByName}</p>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-success btn-sm" onclick="workerDashboard.respondToModification('${pendingModification.id}', '${agreement.id}', 'accepted')">
                            ✅ Accept Changes
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="workerDashboard.respondToModification('${pendingModification.id}', '${agreement.id}', 'rejected')">
                            ❌ Reject Changes
                        </button>
                    </div>
                </div>
            ` : ''}

            ${pendingTermination ? `
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="color: #ef4444; margin: 0 0 8px 0;">🏁 Termination Request Pending</h4>
                    <p style="color: var(--muted); margin: 0 0 12px 0;">Requested by: ${pendingTermination.requestedByName}</p>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-success btn-sm" onclick="workerDashboard.respondToTermination('${pendingTermination.id}', '${agreement.id}', 'accepted')">
                            ✅ Accept Termination
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="workerDashboard.respondToTermination('${pendingTermination.id}', '${agreement.id}', 'rejected')">
                            ❌ Reject Termination
                        </button>
                    </div>
                </div>
            ` : ''}

            <div style="display: grid; gap: 12px;">
                ${canModify && !pendingModification ? `
                    <button class="btn btn-primary" onclick="workerDashboard.showModifyAgreementModal('${agreement.id}')">
                        ✏️ Request Agreement Changes
                    </button>
                ` : ''}
                
                ${canTerminate && !pendingTermination ? `
                    <button class="btn btn-danger" onclick="workerDashboard.showTerminateAgreementModal('${agreement.id}')">
                        🏁 Request Agreement Termination
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    OpusUtils.showModal('Manage Agreement', modalContent);
}

respondToModification(modificationId, agreementId, response) {
    const result = AgreementManager.respondToModification(
        modificationId, 
        agreementId, 
        { status: response, message: `${response} the modification request` },
        { role: 'worker' }
    );

    if (result) {
        OpusUtils.closeModal();
        OpusUtils.showNotification(`Modification request ${response}`, 'success');
        this.showManageAgreementModal(agreementId);
    }
}

respondToTermination(terminationId, agreementId, response) {
    const result = AgreementManager.respondToTermination(
        terminationId, 
        agreementId, 
        { status: response, message: `${response} the termination request` },
        { role: 'worker' }
    );

    if (result) {
        OpusUtils.closeModal();
        OpusUtils.showNotification(`Termination request ${response}`, 'success');
        this.showManageAgreementModal(agreementId);
    }
}

 quickRepairAgreement(agreement) {
    const repaired = JSON.parse(JSON.stringify(agreement)); // Deep clone
    let wasRepaired = false;
    
    if (!repaired.workTerms) {
        repaired.workTerms = {
            workType: 'fulltime',
            location: 'remote',
            duration: 90,
            weeklyHours: 40,
            startDate: repaired.createdAt || new Date().toISOString()
        };
        wasRepaired = true;
    }
    
    if (!repaired.paymentTerms) {
        repaired.paymentTerms = {
            type: 'monthly',
            amount: 45000,
            schedule: 'monthly',
            currency: 'INR'
        };
        wasRepaired = true;
    }
    
    // Ensure amount is a number
    if (repaired.paymentTerms.amount && typeof repaired.paymentTerms.amount === 'string') {
        repaired.paymentTerms.amount = parseFloat(repaired.paymentTerms.amount) || 45000;
        wasRepaired = true;
    }
    
    return { agreement: repaired, wasRepaired };
}

// IN WorkerDashboard CLASS - FIX THE DISPLAY METHOD
 updateAgreementsDisplay(agreements) {
    const container = document.getElementById('activeAgreementsContainer');
    if (!container) {
        console.error('❌ Active agreements container not found');
        return;
    }

    if (!agreements || agreements.length === 0) {
        container.innerHTML = this.createEmptyState('📝', 'No active agreements', 'Your active work agreements will appear here once you accept job offers');
        return;
    }

    // Filter out invalid agreements and log warnings
    const validAgreements = agreements.filter(agreement => {
        if (!agreement || !agreement.id) {
            console.warn('⚠️ Skipping invalid agreement:', agreement);
            return false;
        }
        return true;
    });

    if (validAgreements.length === 0) {
        container.innerHTML = this.createEmptyState('📝', 'No valid agreements found', 'There seems to be an issue with your agreement data');
        return;
    }

    container.innerHTML = validAgreements.map(agreement => {
        try {
            const totalPaid = agreement.payments ? 
                agreement.payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0) : 0;
            
            const totalValue = this.calculateAgreementTotalValue(agreement);
            const progressPercentage = agreement.workTerms && agreement.workTerms.startDate ? 
                this.calculateAgreementProgress(agreement) : 0;
            
            // Safe property access with fallbacks
            const workType = agreement.workTerms?.workType || 'Not specified';
            const startDate = agreement.workTerms?.startDate ? 
                new Date(agreement.workTerms.startDate).toLocaleDateString() : 'Not set';
            const duration = agreement.workTerms?.duration || 'Not specified';
            const weeklyHours = agreement.workTerms?.weeklyHours || 'Not specified';
            
            return `
                <div class="agreement-card" style="background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 16px;">
                        <div style="flex: 1;">
                            <h4 style="margin: 0 0 8px 0; color: #fff;">${agreement.jobTitle || 'Untitled Agreement'}</h4>
                            <div style="color: var(--muted); font-size: 0.9rem; margin-bottom: 8px;">
                                <strong>Employer:</strong> ${agreement.employerName || 'Unknown'} • 
                                <strong>Type:</strong> ${this.formatWorkType(workType)} • 
                                <strong>Payment:</strong> ${this.formatPaymentType(agreement.paymentTerms?.type || 'unknown')}
                            </div>
                            
                            <!-- Progress Bar -->
                            ${progressPercentage > 0 ? `
                                <div style="margin-bottom: 12px;">
                                    <div style="display: flex; justify-content: space-between; font-size: 0.8rem; color: var(--muted); margin-bottom: 4px;">
                                        <span>Agreement Progress</span>
                                        <span>${progressPercentage}%</span>
                                    </div>
                                    <div style="background: rgba(255,255,255,0.1); height: 6px; border-radius: 3px; overflow: hidden;">
                                        <div style="background: linear-gradient(90deg, var(--accent), #3b82f6); height: 100%; width: ${progressPercentage}%; border-radius: 3px; transition: width 0.3s;"></div>
                                    </div>
                                </div>
                            ` : ''}
                        </div>
                        <span class="status status-active" style="padding: 6px 16px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; background: rgba(34, 197, 94, 0.2); color: #4ade80;">Active</span>
                    </div>
                    
                    <div style="color: var(--muted); margin-bottom: 16px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
                            <div>
                                <p style="margin: 4px 0;"><strong>Start Date:</strong> ${startDate}</p>
                                <p style="margin: 4px 0;"><strong>Duration:</strong> ${duration} days</p>
                                <p style="margin: 4px 0;"><strong>Weekly Hours:</strong> ${weeklyHours}</p>
                            </div>
                            <div>
                                <p style="margin: 4px 0;"><strong>Payment:</strong> ₹${agreement.paymentTerms?.amount?.toLocaleString() || '0'}</p>
                                <p style="margin: 4px 0;"><strong>Total Earned:</strong> <span style="color: var(--accent);">₹${totalPaid.toLocaleString()}</span></p>
                                <p style="margin: 4px 0;"><strong>Total Value:</strong> ₹${totalValue.toLocaleString()}</p>
                            </div>
                        </div>
                        
                        ${agreement.paymentTerms?.schedule ? `
                            <div style="background: rgba(255,255,255,0.05); padding: 12px; border-radius: 8px; margin-top: 8px;">
                                <div style="font-size: 0.8rem; color: var(--muted);">
                                    <strong>Next Payment:</strong> ${this.getNextPaymentDate(agreement)} • 
                                    <strong>Schedule:</strong> ${agreement.paymentTerms.schedule.replace(/_/g, ' ')}
                                </div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                        <button class="btn btn-primary" onclick="workerDashboard.logWork('${agreement.id}')">
                            📝 Log Work
                        </button>
                        
                        <button class="btn btn-primary" onclick="workerDashboard.showManageAgreementModal('${agreement.id}')">
                            ⚙️ Manage Agreement
                        </button>
                        
                        <button class="btn btn-ghost" onclick="startChatWithUser('${agreement.employerId}', '${agreement.employerName}')">
                            💬 Message Employer
                        </button>
                        
                        <button class="btn btn-ghost" onclick="workerDashboard.viewAgreementDetails('${agreement.id}')">
                            👁️ View Details
                        </button>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('❌ Error rendering agreement card:', error, agreement);
            return `
                <div class="agreement-card" style="background: var(--card); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 16px; border-left: 4px solid #ef4444;">
                    <div style="color: #fff; margin-bottom: 8px;">⚠️ Corrupted Agreement Data</div>
                    <div style="color: var(--muted); font-size: 0.9rem;">
                        This agreement contains invalid data and cannot be displayed properly.
                    </div>
                    <div style="margin-top: 12px;">
                        <button class="btn btn-danger btn-sm" onclick="workerDashboard.repairAgreement('${agreement.id}')">
                            Repair Agreement
                        </button>
                    </div>
                </div>
            `;
        }
    }).join('');
}
// 🔧 ADD MISSING downloadAgreement METHOD
downloadAgreement(agreementId) {
    console.log('📄 Downloading agreement:', agreementId);
    
    try {
        const agreement = this.getAgreementById(agreementId);
        if (!agreement) {
            OpusUtils.showNotification('Agreement not found', 'error');
            return;
        }

        // Create agreement document content
        const agreementContent = this.generateAgreementDocument(agreement);
        
        // Create download link
        const blob = new Blob([agreementContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Agreement_${agreement.jobTitle}_${agreement.id}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        OpusUtils.showNotification('✅ Agreement downloaded successfully!', 'success');
        
    } catch (error) {
        console.error('❌ Error downloading agreement:', error);
        OpusUtils.showNotification('Failed to download agreement', 'error');
    }
}

// 🔧 ADD HELPER METHOD TO GENERATE AGREEMENT DOCUMENT
generateAgreementDocument(agreement) {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return '₹' + amount.toLocaleString('en-IN');
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Work Agreement - ${agreement.jobTitle}</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section-title {
            background: #f4f4f4;
            padding: 10px;
            font-weight: bold;
            border-left: 4px solid #007bff;
            margin-bottom: 15px;
        }
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 15px;
        }
        .info-item {
            margin-bottom: 8px;
        }
        .info-label {
            font-weight: bold;
            color: #666;
        }
        .signature-section {
            margin-top: 50px;
            border-top: 1px solid #ccc;
            padding-top: 20px;
        }
        .signature-line {
            border-bottom: 1px solid #333;
            margin: 40px 0 20px 0;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            font-size: 0.9em;
            color: #666;
        }
        @media print {
            body { padding: 0; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>WORK AGREEMENT</h1>
        <h2>${agreement.jobTitle}</h2>
        <p><strong>Agreement ID:</strong> ${agreement.id}</p>
        <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="section">
        <div class="section-title">PARTIES</div>
        <div class="info-grid">
            <div>
                <h3>Employer</h3>
                <div class="info-item">
                    <span class="info-label">Company:</span> ${agreement.employerName}
                </div>
                <div class="info-item">
                    <span class="info-label">Employer ID:</span> ${agreement.employerId}
                </div>
            </div>
            <div>
                <h3>Worker</h3>
                <div class="info-item">
                    <span class="info-label">Name:</span> ${agreement.workerName}
                </div>
                <div class="info-item">
                    <span class="info-label">Email:</span> ${agreement.workerEmail}
                </div>
                <div class="info-item">
                    <span class="info-label">Worker ID:</span> ${agreement.workerId}
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">WORK TERMS</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Work Type:</span> ${agreement.workTerms?.workType || 'Not specified'}
            </div>
            <div class="info-item">
                <span class="info-label">Location:</span> ${agreement.workTerms?.location || 'Not specified'}
            </div>
            <div class="info-item">
                <span class="info-label">Duration:</span> ${agreement.workTerms?.duration || 'Not specified'} days
            </div>
            <div class="info-item">
                <span class="info-label">Weekly Hours:</span> ${agreement.workTerms?.weeklyHours || 'Not specified'}
            </div>
            <div class="info-item">
                <span class="info-label">Start Date:</span> ${agreement.workTerms?.startDate ? formatDate(agreement.workTerms.startDate) : 'Not specified'}
            </div>
            <div class="info-item">
                <span class="info-label">Probation Period:</span> ${agreement.workTerms?.probationPeriod || '0'} days
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">PAYMENT TERMS</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Payment Type:</span> ${agreement.paymentTerms?.type || 'Not specified'}
            </div>
            <div class="info-item">
                <span class="info-label">Amount:</span> ${agreement.paymentTerms?.amount ? formatCurrency(agreement.paymentTerms.amount) : 'Not specified'}
            </div>
            <div class="info-item">
                <span class="info-label">Schedule:</span> ${agreement.paymentTerms?.schedule || 'Not specified'}
            </div>
            <div class="info-item">
                <span class="info-label">Currency:</span> ${agreement.paymentTerms?.currency || 'INR'}
            </div>
        </div>
    </div>

    ${agreement.workTerms?.workingDays ? `
    <div class="section">
        <div class="section-title">WORK SCHEDULE</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Working Days:</span> ${agreement.workTerms.workingDays.replace(/_/g, ' to ')}
            </div>
            <div class="info-item">
                <span class="info-label">Shift Timing:</span> ${agreement.workTerms?.shiftTiming || 'General'}
            </div>
            <div class="info-item">
                <span class="info-label">Overtime Policy:</span> ${agreement.workTerms?.overtimePolicy || 'As per company policy'}
            </div>
        </div>
    </div>
    ` : ''}

    <div class="section">
        <div class="section-title">LEGAL TERMS</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">IP Rights:</span> ${agreement.legalTerms?.ipRights || 'Employer'}
            </div>
            <div class="info-item">
                <span class="info-label">Confidentiality:</span> ${agreement.legalTerms?.confidentiality || 'Standard'}
            </div>
            <div class="info-item">
                <span class="info-label">Equipment Provision:</span> ${agreement.legalTerms?.equipmentProvision || 'Employer provides'}
            </div>
            <div class="info-item">
                <span class="info-label">Notice Period:</span> ${agreement.workTerms?.noticePeriod || '15'} days
            </div>
        </div>
    </div>

    ${agreement.legalTerms?.additionalTerms ? `
    <div class="section">
        <div class="section-title">ADDITIONAL TERMS</div>
        <p>${agreement.legalTerms.additionalTerms}</p>
    </div>
    ` : ''}

    <div class="section">
        <div class="section-title">AGREEMENT STATUS</div>
        <div class="info-grid">
            <div class="info-item">
                <span class="info-label">Status:</span> ${agreement.status ? agreement.status.replace(/_/g, ' ') : 'Active'}
            </div>
            <div class="info-item">
                <span class="info-label">Created:</span> ${agreement.createdAt ? formatDate(agreement.createdAt) : 'Not specified'}
            </div>
            ${agreement.acceptedAt ? `
            <div class="info-item">
                <span class="info-label">Accepted:</span> ${formatDate(agreement.acceptedAt)}
            </div>
            ` : ''}
        </div>
    </div>

    <div class="signature-section">
        <div class="info-grid">
            <div>
                <div class="signature-line"></div>
                <p><strong>Employer Signature</strong></p>
                <p>${agreement.employerName}</p>
                <p>Date: ________________</p>
            </div>
            <div>
                <div class="signature-line"></div>
                <p><strong>Worker Signature</strong></p>
                <p>${agreement.workerName}</p>
                <p>Date: ________________</p>
            </div>
        </div>
    </div>

    <div class="footer">
        <p>This agreement was generated electronically via OpusLink Platform</p>
        <p>Agreement ID: ${agreement.id} | Generated on: ${new Date().toLocaleString()}</p>
        <p class="no-print">This is a digital copy. For official purposes, please refer to the signed original.</p>
    </div>
</body>
</html>`;
}

// 🔧 ADD HELPER METHOD TO GET AGREEMENT BY ID
getAgreementById(agreementId) {
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    return agreements.find(a => a.id === agreementId);
}
// 🔧 ADD EVENT DELEGATION FOR DOWNLOAD BUTTONS
setupDownloadButtonEvents() {
    document.addEventListener('click', (e) => {
        const downloadBtn = e.target.closest('.download-agreement-btn');
        if (downloadBtn) {
            e.preventDefault();
            const agreementId = downloadBtn.getAttribute('data-agreement-id');
            if (agreementId) {
                this.downloadAgreement(agreementId);
            }
        }
    });
}
// 🔧 ADD TO WorkerDashboard class
showManageAgreementModal(agreementId) {
    const agreement = AgreementManager.getAgreement(agreementId);
    if (!agreement) {
        OpusUtils.showNotification('Agreement not found', 'error');
        return;
    }

    const canModify = ['active', 'modification_pending'].includes(agreement.status);
    const canTerminate = ['active', 'termination_pending'].includes(agreement.status);
    const pendingModification = agreement.modificationRequests?.find(m => m.status === 'pending');
    const pendingTermination = agreement.terminationRequests?.find(t => t.status === 'pending');

    const modalContent = `
        <div style="padding: 20px; max-width: 600px;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">⚙️ Manage Agreement</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <div style="background: var(--bg-secondary); padding: 16px; border-radius: 8px;">
                    <h4 style="color: #fff; margin: 0 0 8px 0;">${agreement.jobTitle}</h4>
                    <p style="color: var(--muted); margin: 0 0 4px 0;">Employer: ${agreement.employerName}</p>
                    <p style="color: var(--muted); margin: 0;">Status: <span class="status status-${agreement.status}">${agreement.status.replace(/_/g, ' ')}</span></p>
                </div>
            </div>

            ${pendingModification ? `
                <div style="background: rgba(245, 158, 11, 0.1); border: 1px solid rgba(245, 158, 11, 0.3); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="color: #f59e0b; margin: 0 0 8px 0;">📝 Modification Request Pending</h4>
                    <p style="color: var(--muted); margin: 0 0 12px 0;">Requested by: ${pendingModification.requestedByName}</p>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-success btn-sm" onclick="workerDashboard.respondToModification('${pendingModification.id}', '${agreement.id}', 'accepted')">
                            ✅ Accept Changes
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="workerDashboard.respondToModification('${pendingModification.id}', '${agreement.id}', 'rejected')">
                            ❌ Reject Changes
                        </button>
                    </div>
                </div>
            ` : ''}

            ${pendingTermination ? `
                <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); padding: 16px; border-radius: 8px; margin-bottom: 16px;">
                    <h4 style="color: #ef4444; margin: 0 0 8px 0;">🏁 Termination Request Pending</h4>
                    <p style="color: var(--muted); margin: 0 0 12px 0;">Requested by: ${pendingTermination.requestedByName}</p>
                    <div style="display: flex; gap: 8px;">
                        <button class="btn btn-success btn-sm" onclick="workerDashboard.respondToTermination('${pendingTermination.id}', '${agreement.id}', 'accepted')">
                            ✅ Accept Termination
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="workerDashboard.respondToTermination('${pendingTermination.id}', '${agreement.id}', 'rejected')">
                            ❌ Reject Termination
                        </button>
                    </div>
                </div>
            ` : ''}

            <div style="display: grid; gap: 12px;">
                ${canModify && !pendingModification ? `
                    <button class="btn btn-primary" onclick="workerDashboard.showModifyAgreementModal('${agreement.id}')">
                        ✏️ Request Agreement Changes
                    </button>
                ` : ''}
                
                ${canTerminate && !pendingTermination ? `
                    <button class="btn btn-danger" onclick="workerDashboard.showTerminateAgreementModal('${agreement.id}')">
                        🏁 Request Agreement Termination
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    OpusUtils.showModal('Manage Agreement', modalContent);
}

respondToModification(modificationId, agreementId, response) {
    const result = AgreementManager.respondToModification(
        modificationId, 
        agreementId, 
        { status: response, message: `${response} the modification request` },
        { role: 'worker' }
    );

    if (result) {
        OpusUtils.closeModal();
        OpusUtils.showNotification(`Modification request ${response}`, 'success');
        this.showManageAgreementModal(agreementId);
    }
}

respondToTermination(terminationId, agreementId, response) {
    const result = AgreementManager.respondToTermination(
        terminationId, 
        agreementId, 
        { status: response, message: `${response} the termination request` },
        { role: 'worker' }
    );

    if (result) {
        OpusUtils.closeModal();
        OpusUtils.showNotification(`Termination request ${response}`, 'success');
        this.showManageAgreementModal(agreementId);
    }
}



 // IN WorkerDashboard CLASS - FIX viewAgreementDetails METHOD
 viewAgreementDetails(agreementId) {
    console.log('👁️ Viewing agreement details:', agreementId);
    
    const agreement = AgreementManager.getAgreement(agreementId);
    if (agreement) {
        // Use the agreement ID directly instead of looking for offerId
        this.showAgreementDetailsModal(agreement);
    } else {
        console.error('❌ Agreement not found:', agreementId);
        OpusUtils.showNotification('Agreement not found', 'error');
    }
}

// CREATE A NEW METHOD TO SHOW AGREEMENT DETAILS
 showAgreementDetailsModal(agreement) {
    console.log('📄 Showing agreement details modal for:', agreement.id);
    
    const modalContent = `
        <div style="padding: 20px; max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <div class="modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; color: var(--text-primary);">📝 Agreement Details</h3>
                <button class="modal-close" onclick="OpusUtils.closeModal()" style="background: none; border: none; color: var(--text-secondary); font-size: 24px; cursor: pointer;">×</button>
            </div>
            
            <div style="max-height: 70vh; overflow-y: auto;">
                <!-- Agreement Summary -->
                <div style="background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1)); padding: 20px; border-radius: 12px; margin-bottom: 24px; border: 1px solid rgba(255,255,255,0.1);">
                    <h4 style="color: #fff; margin-bottom: 12px;">${agreement.jobTitle || 'Untitled Agreement'}</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>👤 Employer:</strong> ${agreement.employerName || 'Unknown'}</p>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>📅 Created:</strong> ${new Date(agreement.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>📍 Location:</strong> ${agreement.workTerms?.location || 'Remote'}</p>
                            <p style="color: var(--muted); margin: 6px 0;"><strong>🔄 Status:</strong> ${agreement.status ? agreement.status.replace(/_/g, ' ') : 'Active'}</p>
                        </div>
                    </div>
                </div>

                <!-- Payment Terms -->
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        💰 Payment Terms
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Type</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${this.formatPaymentType(agreement.paymentTerms?.type || 'monthly')}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Amount</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ₹${(agreement.paymentTerms?.amount || 0).toLocaleString()} ${agreement.paymentTerms?.type === 'monthly' ? '/month' : agreement.paymentTerms?.type === 'hourly' ? '/hour' : ''}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Payment Schedule</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.paymentTerms?.schedule ? agreement.paymentTerms.schedule.replace(/_/g, ' ') : 'Monthly'}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Currency</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.paymentTerms?.currency || 'INR'}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Work Terms -->
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        ⚙️ Work Terms
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Work Type</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${this.formatWorkType(agreement.workTerms?.workType || 'fulltime')}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Work Location</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${this.formatLocation(agreement.workTerms?.location || 'remote')}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Duration</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.workTerms?.duration || 90} days
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Weekly Hours</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.workTerms?.weeklyHours || 40} hours/week
                            </div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 12px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Start Date</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.workTerms?.startDate ? new Date(agreement.workTerms.startDate).toLocaleDateString() : 'Not set'}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">End Date</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${agreement.workTerms?.endDate ? new Date(agreement.workTerms.endDate).toLocaleDateString() : 'Not set'}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Agreement Progress -->
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        📊 Agreement Progress
                    </h4>
                    
                    <div style="margin-bottom: 16px;">
                        <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: var(--muted); margin-bottom: 8px;">
                            <span>Progress</span>
                            <span>${this.calculateAgreementProgress(agreement)}%</span>
                        </div>
                        <div style="background: rgba(255,255,255,0.1); height: 8px; border-radius: 4px; overflow: hidden;">
                            <div style="background: linear-gradient(90deg, var(--accent), #3b82f6); height: 100%; width: ${this.calculateAgreementProgress(agreement)}%; border-radius: 4px; transition: width 0.3s;"></div>
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Total Value</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #22c55e; font-size: 14px; font-weight: 600;">
                                ₹${this.calculateAgreementTotalValue(agreement).toLocaleString()}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Total Earned</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: var(--accent); font-size: 14px; font-weight: 600;">
                                ₹${(agreement.payments ? agreement.payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0) : 0).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Additional Information -->
                <div style="background: rgba(255,255,255,0.05); padding: 20px; border-radius: 12px; margin-bottom: 20px;">
                    <h4 style="color: #fff; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                        ℹ️ Additional Information
                    </h4>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Agreement ID</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 12px; font-family: monospace;">
                                ${agreement.id}
                            </div>
                        </div>
                        
                        <div>
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Created Date</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 14px;">
                                ${new Date(agreement.createdAt).toLocaleString()}
                            </div>
                        </div>
                    </div>
                    
                    ${agreement.applicationId ? `
                        <div style="margin-top: 12px;">
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Application ID</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 12px; font-family: monospace;">
                                ${agreement.applicationId}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${agreement.offerId ? `
                        <div style="margin-top: 12px;">
                            <label style="color: var(--muted); font-size: 0.9rem; display: block; margin-bottom: 6px;">Offer ID</label>
                            <div style="padding: 12px; background: rgba(255,255,255,0.08); border-radius: 8px; color: #fff; font-size: 12px; font-family: monospace;">
                                ${agreement.offerId}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
            
                        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color);">
                <button type="button" onclick="OpusUtils.closeModal()" 
                        style="background: transparent; color: var(--text-secondary); border: 1px solid var(--border-color); padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: 500;">
                    Close
                </button>
                ${agreement.status === 'pending_worker_acceptance' ? `
                    <button type="button" onclick="WorkerDashboard.acceptAgreement('${agreement.id}')" 
                            style="background: var(--success); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        ✅ Accept Agreement
                    </button>
                    <button type="button" onclick="WorkerDashboard.rejectAgreement('${agreement.id}')" 
                            style="background: var(--danger); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        ❌ Reject
                    </button>
                ` : ''}
                ${agreement.status === 'active' ? `
                    <button type="button" onclick="WorkerDashboard.logWork('${agreement.id}')" 
                            style="background: var(--gold-primary); color: black; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                        📝 Log Work
                    </button>
                ` : ''}
                <button type="button" onclick="workerDashboard.downloadAgreement('${agreement.id}')" 
                        style="background: var(--accent); color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer;">
                    📄 Download
                </button>
            </div>
        </div>
    `;

    OpusUtils.showModal('Agreement Details', modalContent);
}


// Request agreement modification
 requestAgreementModification(agreementId) {
    const modificationReason = prompt('Please specify what changes you would like to request in this agreement:');
    if (modificationReason && modificationReason.trim() !== '') {
        // In a real implementation, this would send a notification to the employer
        OpusUtils.showNotification('Modification request sent to employer', 'info');
        
        if (typeof NotificationSystem !== 'undefined') {
            const agreement = AgreementManager.getAgreement(agreementId);
            NotificationSystem.createNotification(
                agreement.employerId,
                'agreement_modification_request',
                {
                    workerName: agreement.workerName,
                    jobTitle: agreement.jobTitle,
                    agreementId: agreementId,
                    modificationReason: modificationReason.trim()
                }
            );
        }
    }
}

// IN WorkerDashboard CLASS - FIX PROGRESS CALCULATION
 calculateAgreementProgress(agreement) {
    try {
        if (!agreement.workTerms || !agreement.workTerms.startDate) return 0;
        
        const startDate = new Date(agreement.workTerms.startDate);
        const endDate = agreement.workTerms.endDate ? 
            new Date(agreement.workTerms.endDate) : 
            new Date(startDate.getTime() + (agreement.workTerms.duration || 30) * 24 * 60 * 60 * 1000);
        
        const today = new Date();
        
        // Validate dates
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.warn('❌ Invalid dates in agreement:', agreement.id);
            return 0;
        }
        
        const totalDuration = endDate.getTime() - startDate.getTime();
        const elapsedDuration = today.getTime() - startDate.getTime();
        
        if (totalDuration <= 0) return 100;
        
        const progress = (elapsedDuration / totalDuration) * 100;
        return Math.min(Math.max(Math.round(progress), 0), 100);
        
    } catch (error) {
        console.error('❌ Error calculating agreement progress:', error);
        return 0;
    }
}
// Get next payment date
// IN WorkerDashboard CLASS - FIX PAYMENT DATE CALCULATION
 getNextPaymentDate(agreement) {
    try {
        if (!agreement.paymentTerms?.schedule || !agreement.workTerms?.startDate) {
            return 'Not scheduled';
        }
        
        const now = new Date();
        const startDate = new Date(agreement.workTerms.startDate);
        
        if (isNaN(startDate.getTime())) {
            return 'Invalid start date';
        }
        
        switch(agreement.paymentTerms.schedule) {
            case 'weekly':
                const weeksSinceStart = Math.floor((now - startDate) / (7 * 24 * 60 * 60 * 1000));
                const nextWeeklyDate = new Date(startDate);
                nextWeeklyDate.setDate(startDate.getDate() + (weeksSinceStart + 1) * 7);
                return nextWeeklyDate.toLocaleDateString();
                
            case 'monthly':
                const nextMonthlyDate = new Date(startDate);
                nextMonthlyDate.setMonth(startDate.getMonth() + 1);
                return nextMonthlyDate.toLocaleDateString();
                
            case 'upon_completion':
                return 'Upon Completion';
                
            default:
                return 'As per schedule';
        }
    } catch (error) {
        console.error('❌ Error calculating next payment date:', error);
        return 'Error calculating';
    }
}

    logWork(agreementId = null) {
        console.log('📝 WorkerDashboard: Enhanced logWork called with agreementId:', agreementId);
        
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (!currentUser) {
                OpusUtils.showNotification('Please log in to log work', 'error');
                return;
            }
            const activeAgreements = AgreementManager.getUserAgreements(currentUser.id)
        .filter(a => a.status === 'active' && a.workerId === currentUser.id);

    if (activeAgreements.length === 0) {
        OpusUtils.showNotification('No active agreements found. Please wait for an agreement to be created and accepted.', 'warning');
        return;
    }


            if (agreementId) {
                this.currentJobId = agreementId;
                this.logWorkForSelectedJob();
                return;
            }

            
            if (activeAgreements.length === 0) {
                OpusUtils.showNotification('No active jobs found to log work for', 'warning');
                return;
            }

            if (activeAgreements.length === 1) {
                this.currentJobId = activeAgreements[0].id;
                this.logWorkForSelectedJob();
            } else {
                this.showJobSelectionModal(activeAgreements);
            }

        } catch (error) {
            console.error('❌ Error in enhanced logWork:', error);
            OpusUtils.showNotification('Failed to log work', 'error');
        }
    }

    getActiveAgreements() {
        console.log('📋 WorkerDashboard: Getting active agreements...');
        
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (!currentUser) {
                console.log('❌ No user logged in');
                return [];
            }

            const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
            const activeAgreements = agreements.filter(agreement => 
                agreement.workerId === currentUser.id && agreement.status === 'active'
            );

            console.log(`✅ Found ${activeAgreements.length} active agreements`);
            return activeAgreements;

        } catch (error) {
            console.error('❌ Error getting active agreements:', error);
            return [];
        }
    }

    showJobSelectionModal(agreements) {
        console.log('🎯 WorkerDashboard: Showing job selection modal...');
        
        const modalContent = `
            <div style="padding: 20px; max-width: 500px;">
                <h3 style="color: var(--text-primary); margin-bottom: 16px;">Select Job to Log Work</h3>
                <p style="color: var(--text-secondary); margin-bottom: 20px;">
                    You have multiple active jobs. Please select which job you want to log work for:
                </p>
                
                <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                    ${agreements.map(agreement => {
                        const jobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
                        const job = jobs.find(j => j.id === agreement.jobId);
                        return `
                            <button onclick="workerDashboard.selectJobForWorkLog('${agreement.id}')"
                                    style="background: var(--bg-card); border: 1px solid var(--border-color); 
                                           padding: 16px; border-radius: 8px; text-align: left; cursor: pointer;
                                           transition: all 0.2s; color: var(--text-primary);"
                                    onmouseover="this.style.borderColor='var(--accent)'"
                                    onmouseout="this.style.borderColor='var(--border-color)'">
                                <div style="font-weight: 600; margin-bottom: 4px;">${job?.title || agreement.jobTitle || 'Unknown Job'}</div>
                                <div style="color: var(--text-secondary); font-size: 0.9rem;">
                                    ${agreement.employerName} • ${this.formatPaymentType(agreement.paymentTerms?.type)}
                                </div>
                            </button>
                        `;
                    }).join('')}
                </div>
                
                <div style="display: flex; justify-content: flex-end;">
                    <button onclick="OpusUtils.closeModal()" 
                            style="background: transparent; color: var(--text-secondary); 
                                   border: 1px solid var(--border-color); padding: 10px 20px; 
                                   borderRadius: 6px; cursor: pointer;">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        if (typeof OpusUtils !== 'undefined' && OpusUtils.showModal) {
            OpusUtils.showModal('Select Job', modalContent);
        } else {
            this.showFallbackModal(modalContent);
        }
    }

    selectJobForWorkLog(agreementId) {
        console.log('✅ WorkerDashboard: Selected agreement for work log:', agreementId);
        
        this.currentJobId = agreementId;
        
        if (typeof OpusUtils !== 'undefined' && OpusUtils.closeModal) {
            OpusUtils.closeModal();
        }
        
        this.logWorkForSelectedJob();
    }

    logWorkForSelectedJob() {
        console.log('📝 WorkerDashboard: Logging work for selected job:', this.currentJobId);
        
        if (!this.currentJobId) {
            console.error('❌ No job selected for work logging');
            OpusUtils.showNotification('No job selected', 'error');
            return;
        }

        try {
            const validation = this.validateAgreementForWorkLog(this.currentJobId);
            if (!validation.valid) {
                OpusUtils.showNotification(validation.message, 'error');
                return;
            }

            const agreement = validation.agreement;
            const paymentTerms = agreement.paymentTerms;

            let promptMessage = `Enter ${paymentTerms.type} work units:\n\n`;
            promptMessage += `Agreement: ${agreement.jobTitle}\n`;
            promptMessage += `Employer: ${agreement.employerName}\n`;
            promptMessage += `Payment Type: ${this.formatPaymentType(paymentTerms.type)}\n`;
            promptMessage += `Rate: ${paymentTerms.amount}\n\n`;
            
            let unitType = '';
            let unitLabel = '';
            
            switch (paymentTerms.type) {
                case 'hourly':
                    promptMessage += 'Enter hours worked:';
                    unitType = 'hours';
                    unitLabel = 'hours';
                    break;
                case 'monthly':
                    promptMessage += 'Enter days worked this month:';
                    unitType = 'days';
                    unitLabel = 'days';
                    break;
                case 'fixed':
                    promptMessage += 'Enter days worked on project:';
                    unitType = 'days';
                    unitLabel = 'days';
                    break;
                case 'milestone':
                    promptMessage += 'Enter milestone progress (days):';
                    unitType = 'days';
                    unitLabel = 'days';
                    break;
                default:
                    promptMessage += 'Enter units worked:';
                    unitType = 'units';
                    unitLabel = 'units';
            }

            const units = prompt(promptMessage);
            if (!units || isNaN(units) || units <= 0) {
                OpusUtils.showNotification(`Please enter valid ${unitLabel}`, 'error');
                return;
            }
            
            const description = prompt('Enter work description:');
            if (!description) {
                OpusUtils.showNotification('Please enter work description', 'error');
                return;
            }

            this.logWorkDirect(this.currentJobId, parseFloat(units), description, paymentTerms.type);

        } catch (error) {
            console.error('❌ Error in logWorkForSelectedJob:', error);
            OpusUtils.showNotification('Failed to log work', 'error');
        }
    }

    validateAgreementForWorkLog(agreementId) {
        try {
            const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
            const agreement = agreements.find(a => a.id === agreementId);
            
            if (!agreement) {
                return { valid: false, message: 'Agreement not found' };
            }
            
            if (agreement.status !== 'active') {
                return { valid: false, message: 'Agreement is not active' };
            }
            
            if (!agreement.paymentTerms) {
                return { valid: false, message: 'No payment terms found for this agreement' };
            }
            
            if (!agreement.paymentTerms.type) {
                return { valid: false, message: 'Payment type not specified' };
            }
            
            return { valid: true, agreement: agreement };
            
        } catch (error) {
            console.error('Error validating agreement:', error);
            return { valid: false, message: 'Error validating agreement' };
        }
    }

    logWorkDirect(agreementId, units, description, paymentType) {
        console.log('📝 WorkerDashboard: Direct work logging for agreement:', agreementId);
        
        try {
            const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
            const agreementIndex = agreements.findIndex(agr => agr.id === agreementId);
            
            if (agreementIndex === -1) {
                OpusUtils.showNotification('Agreement not found', 'error');
                return;
            }

            const agreement = agreements[agreementIndex];
            
            if (!agreement.workLogs) {
                agreement.workLogs = [];
            }

            const workLog = {
                id: 'worklog_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
                workerId: this.currentUser.id,
                workerName: this.currentUser.fullName || 'Worker',
                date: new Date().toISOString(),
                days: paymentType === 'hourly' ? 0 : units,
                hours: paymentType === 'hourly' ? units : 0,
                description: description,
                status: 'pending',
                createdAt: new Date().toISOString(),
                paymentType: paymentType,
                agreementId: agreementId,
                jobTitle: agreement.jobTitle,
                employerId: agreement.employerId,
                employerName: agreement.employerName
            };

            agreement.workLogs.push(workLog);
            localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
            
            console.log('✅ Work logged successfully:', workLog);
            
            OpusUtils.showNotification('Work logged successfully! Waiting for employer approval.', 'success');
            
            this.loadActiveAgreements();
            this.loadWorkHistory();
            
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.createNotification(
                    agreement.employerId,
                    'work_logged',
                    {
                        workerName: this.currentUser.fullName || 'Worker',
                        jobTitle: agreement.jobTitle,
                        units: units,
                        unitType: paymentType === 'hourly' ? 'hours' : 'days',
                        workLogId: workLog.id
                    }
                );
            }
            
        } catch (error) {
            console.error('❌ Error logging work:', error);
            OpusUtils.showNotification('Failed to log work', 'error');
        }
    }

    // 📊 WORK HISTORY METHODS
    loadWorkHistory() {
        console.log('📊 WorkerDashboard: Loading work history...');
        
        if (!this.currentUser) {
            console.log('❌ No user logged in');
            return;
        }

        try {
            const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
            const workerAgreements = agreements.filter(agreement => 
                agreement.workerId === this.currentUser.id
            );

            console.log(`📊 Found ${workerAgreements.length} agreements for worker`);

            let allWorkLogs = [];
            workerAgreements.forEach(agreement => {
                if (agreement.workLogs && Array.isArray(agreement.workLogs)) {
                    agreement.workLogs.forEach(log => {
                        allWorkLogs.push({
                            ...log,
                            agreementId: agreement.id,
                            jobTitle: agreement.jobTitle,
                            employerName: agreement.employerName
                        });
                    });
                }
            });

            console.log(`📊 Found ${allWorkLogs.length} work logs`);

            allWorkLogs.sort((a, b) => new Date(b.date) - new Date(a.date));

            const completedAgreements = workerAgreements.filter(agreement => 
                agreement.status === 'completed'
            );

            console.log(`📊 Found ${completedAgreements.length} completed agreements`);

            this.displayWorkHistory(allWorkLogs, completedAgreements);

        } catch (error) {
            console.error('❌ Error loading work history:', error);
            const container = document.getElementById('work-history-content');
            if (container) {
                container.innerHTML = this.createEmptyState('⚠️', 'Error Loading Work History', 'There was a problem loading your work history. Please try again.');
            }
        }
    }

    displayWorkHistory(workLogs, completedAgreements) {
        const container = document.getElementById('work-history-content');
        if (!container) {
            console.log('❌ Work history container not found');
            return;
        }

        if (workLogs.length === 0 && completedAgreements.length === 0) {
            container.innerHTML = this.createEmptyState('📊', 'No work history yet', 'Your completed work and time logs will appear here');
            return;
        }

        let historyHTML = '';

        if (completedAgreements.length > 0) {
            historyHTML += `
                <div style="margin-bottom: 32px;">
                    <h3 style="color: var(--text-primary); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                        ✅ Completed Jobs (${completedAgreements.length})
                    </h3>
                    <div style="display: flex; flex-direction: column; gap: 16px;">
                        ${completedAgreements.map(agreement => {
                            const totalEarned = agreement.payments ? 
                                agreement.payments.reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0) : 0;
                            
                            return `
                                <div style="background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 12px; padding: 20px;">
                                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                                        <div style="flex: 1;">
                                            <h4 style="margin: 0 0 8px 0; color: var(--text-primary);">${agreement.jobTitle}</h4>
                                            <div style="color: var(--text-secondary); font-size: 0.9rem;">
                                                <strong>Employer:</strong> ${agreement.employerName}
                                            </div>
                                        </div>
                                        <span style="padding: 6px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 500; 
                                              background: rgba(34, 197, 94, 0.2); color: #4ade80;">
                                            Completed
                                        </span>
                                    </div>
                                    <div style="color: var(--text-secondary); font-size: 0.9rem; line-height: 1.5;">
                                        <div><strong>Duration:</strong> ${new Date(agreement.startDate).toLocaleDateString()} - ${agreement.endDate ? new Date(agreement.endDate).toLocaleDateString() : 'Present'}</div>
                                        <div><strong>Total Earned:</strong> ₹${totalEarned.toLocaleString()}</div>
                                        ${agreement.paymentTerms ? `<div><strong>Payment Type:</strong> ${this.formatPaymentType(agreement.paymentTerms.type)}</div>` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        }

        if (workLogs.length > 0) {
            historyHTML += `
                <div>
                    <h3 style="color: var(--text-primary); margin-bottom: 16px; border-bottom: 1px solid var(--border-color); padding-bottom: 8px;">
                        📝 Work Logs (${workLogs.length})
                    </h3>
                    <div class="table-responsive">
                        <table class="data-table" style="width: 100%; border-collapse: collapse; background: var(--bg-card); border-radius: 8px; overflow: hidden;">
                            <thead>
                                <tr style="background: rgba(255,255,255,0.05);">
                                    <th style="padding: 12px; text-align: left; color: var(--text-secondary); font-weight: 600;">Date</th>
                                    <th style="padding: 12px; text-align: left; color: var(--text-secondary); font-weight: 600;">Job</th>
                                    <th style="padding: 12px; text-align: left; color: var(--text-secondary); font-weight: 600;">Hours/Days</th>
                                    <th style="padding: 12px; text-align: left; color: var(--text-secondary); font-weight: 600;">Description</th>
                                    <th style="padding: 12px; text-align: left; color: var(--text-secondary); font-weight: 600;">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${workLogs.map(log => {
                                    const workDate = new Date(log.date);
                                    const workUnits = log.hours > 0 ? `${log.hours} hrs` : `${log.days} days`;
                                    
                                    return `
                                        <tr style="border-bottom: 1px solid rgba(255,255,255,0.1); transition: background 0.2s;" 
                                            onmouseover="this.style.background='rgba(255,255,255,0.02)'" 
                                            onmouseout="this.style.background='transparent'">
                                            <td style="padding: 12px; color: var(--text-secondary);">${workDate.toLocaleDateString()}</td>
                                            <td style="padding: 12px; color: var(--text-primary); font-weight: 500;">${log.jobTitle || 'Unknown Job'}</td>
                                            <td style="padding: 12px; color: var(--text-secondary);">${workUnits}</td>
                                            <td style="padding: 12px; color: var(--text-secondary); max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${log.description}">${log.description}</td>
                                            <td style="padding: 12px;">
                                                <span style="padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; font-weight: 500; 
                                                    background: ${log.status === 'approved' ? 'rgba(34, 197, 94, 0.2)' : 
                                                              log.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}; 
                                                    color: ${log.status === 'approved' ? '#4ade80' : 
                                                           log.status === 'rejected' ? '#ef4444' : '#f59e0b'};">
                                                    ${log.status.charAt(0).toUpperCase() + log.status.slice(1)}
                                                </span>
                                            </td>
                                        </tr>
                                    `;
                                }).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
            `;
        }

        container.innerHTML = historyHTML;
        console.log('✅ Work history displayed successfully');
    }

    // 💰 EARNINGS METHODS
    loadEarningsOverview() {
        if (!this.currentUser) return;

        const workerAgreements = this.agreements.filter(a => a.workerId === this.currentUser.id);
        
        let totalEarned = 0;
        let totalPending = 0;
        let completedJobs = 0;
        let activeJobs = 0;

        workerAgreements.forEach(agreement => {
            if (agreement.payments) {
                agreement.payments.forEach(payment => {
                    if (payment.status === 'completed') {
                        totalEarned += parseFloat(payment.amount) || 0;
                    } else if (payment.status === 'pending') {
                        totalPending += parseFloat(payment.amount) || 0;
                    }
                });
            }

            if (agreement.status === 'completed') {
                completedJobs++;
            } else if (agreement.status === 'active') {
                activeJobs++;
            }
        });

        this.updateEarningsDisplay(totalEarned, totalPending, completedJobs, activeJobs);
    }

    updateEarningsDisplay(totalEarned, totalPending, completedJobs, activeJobs) {
        const container = document.getElementById('earnings-content');
        if (!container) return;

        container.innerHTML = `
            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin: 24px 0;">
                <div class="stat-card" style="background: var(--card); border-radius: 12px; padding: 20px; text-align: center;">
                    <div style="font-size: 1.5rem;">💰</div>
                    <div class="stat-amount" style="font-size: 1.8rem; font-weight: 700; margin: 8px 0;">₹${totalEarned.toLocaleString()}</div>
                    <div class="stat-label" style="color: var(--muted);">Total Earned</div>
                </div>
                
                <div class="stat-card" style="background: var(--card); border-radius: 12px; padding: 20px; text-align: center;">
                    <div style="font-size: 1.5rem;">⏳</div>
                    <div class="stat-amount" style="font-size: 1.8rem; font-weight: 700; margin: 8px 0;">₹${totalPending.toLocaleString()}</div>
                    <div class="stat-label" style="color: var(--muted);">Pending</div>
                </div>
                
                <div class="stat-card" style="background: var(--card); border-radius: 12px; padding: 20px; text-align: center;">
                    <div style="font-size: 1.5rem;">✅</div>
                    <div class="stat-amount" style="font-size: 1.8rem; font-weight: 700; margin: 8px 0;">${completedJobs}</div>
                    <div class="stat-label" style="color: var(--muted);">Completed Jobs</div>
                </div>
                
                <div class="stat-card" style="background: var(--card); border-radius: 12px; padding: 20px; text-align: center;">
                    <div style="font-size: 1.5rem;">🔄</div>
                    <div class="stat-amount" style="font-size: 1.8rem; font-weight: 700; margin: 8px 0;">${activeJobs}</div>
                    <div class="stat-label" style="color: var(--muted);">Active Jobs</div>
                </div>
            </div>
        `;
    }

    // 🔔 NOTIFICATION METHODS
    initializeNotifications() {
        console.log('🔔 Initializing worker notifications...');
        
        if (typeof NotificationSystem === 'undefined') {
            console.error('❌ NotificationSystem not found!');
            return;
        }
        
        try {
            NotificationSystem.init();
            this.updateNotificationBadges();
            
            setInterval(() => {
                this.updateNotificationBadges();
            }, 30000);
            
            console.log('✅ Worker notifications initialized');
        } catch (error) {
            console.error('Error initializing notifications:', error);
        }
    }

    loadNotifications() {
        console.log('📥 Loading notifications...');
        
        if (!this.currentUser) {
            console.log('No current user');
            return;
        }

        const notifications = NotificationSystem.getForUser(this.currentUser.id);
        this.displayNotifications(notifications);
    }

    displayNotifications(notifications = null) {
        const container = document.getElementById('notificationsContainer');
        if (!container) return;

        const currentUser = this.currentUser;
        if (!currentUser) return;

        if (!notifications) {
            notifications = NotificationSystem.getForUser(currentUser.id);
        }

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

        this.updateNotificationStats(notifications);

        if (filteredNotifications.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔔</div>
                    <h3>No notifications</h3>
                    <p>Notifications about your activities will appear here</p>
                </div>
            `;
            return;
        }

        const unreadNotifications = filteredNotifications.filter(n => !n.read);
        const readNotifications = filteredNotifications.filter(n => n.read);

        let html = '';

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
    }

    createNotificationCard(notification) {
        const timeAgo = this.formatNotificationTime(notification.timestamp);
        const icon = this.getNotificationIcon(notification.type);
        
        return `
            <div class="notification-item ${notification.read ? '' : 'unread'}" 
                 data-notification-id="${notification.id}"
                 onclick="workerDashboard.handleNotificationClick('${notification.id}')">
                
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
                                <span class="notification-meta-value">${this.escapeHtml(value)}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
                
                <div class="notification-actions">
                    ${!notification.read ? `
                        <button class="btn btn-success btn-sm" 
                                onclick="event.stopPropagation(); workerDashboard.markNotificationAsRead('${notification.id}')">
                            ✅ Mark Read
                        </button>
                    ` : ''}
                    <button class="btn btn-ghost btn-sm" 
                            onclick="event.stopPropagation(); workerDashboard.deleteNotification('${notification.id}')">
                        🗑️ Delete
                    </button>
                    
                    ${this.getNotificationAction(notification)}
                </div>
            </div>
        `;
    }

    handleNotificationClick(notificationId) {
        this.markNotificationAsRead(notificationId);
        
        const notification = NotificationSystem.getForUser(this.currentUser.id).find(n => n.id === notificationId);
        if (notification && notification.data) {
            console.log('Notification clicked:', notification);
            this.handleNotificationAction(notification);
        }
    }

    handleNotificationAction(notification) {
        switch (notification.type) {
            case 'application_accepted':
                this.navigateToSection('applications');
                break;
            case 'job_offers':
                this.navigateToSection('job-offers');
                break;
            case 'new_message':
                if (typeof toggleChatSystem !== 'undefined') toggleChatSystem();
                break;
            case 'payment_processed':
                this.navigateToSection('earnings');
                break;
            case 'agreement_created':
                this.navigateToSection('active-agreements');
                break;
            default:
                break;
        }
    }

    getNotificationAction(notification) {
        const actions = {
            'application_accepted': {
                label: 'View Applications',
                action: () => this.navigateToSection('applications')
            },
            'job_offers': {
                label: 'View Job Offers',
                action: () => this.navigateToSection('job-offers')
            },
            'payment_processed': {
                label: 'View Payments',
                action: () => this.navigateToSection('earnings')
            },
            'new_message': {
                label: 'Open Messages',
                action: () => { if (typeof toggleChatSystem !== 'undefined') toggleChatSystem(); }
            },
            'agreement_created': {
                label: 'View Agreements',
                action: () => this.navigateToSection('active-agreements')
            }
        };
        
        const action = actions[notification.type];
        if (action) {
            return `<button class="btn btn-primary btn-sm" 
                            onclick="event.stopPropagation(); workerDashboard.navigateToSection('${this.getSectionFromAction(action)}')">
                        ${action.label}
                    </button>`;
        }
        return '';
    }

    getSectionFromAction(action) {
        const sectionMap = {
            'View Applications': 'applications',
            'View Job Offers': 'job-offers',
            'View Payments': 'earnings',
            'View Agreements': 'active-agreements'
        };
        return sectionMap[action.label] || 'job-feed';
    }

    markNotificationAsRead(notificationId) {
        if (NotificationSystem.markAsRead(notificationId)) {
            this.loadNotifications();
            this.updateNotificationBadges();
            OpusUtils.showNotification('Notification marked as read', 'success');
        }
    }

    markAllNotificationsAsRead() {
        if (NotificationSystem.markAllAsRead(this.currentUser.id)) {
            this.loadNotifications();
            this.updateNotificationBadges();
            OpusUtils.showNotification('All notifications marked as read', 'success');
        }
    }

    deleteNotification(notificationId) {
        if (confirm('Are you sure you want to delete this notification?')) {
            this.deleteNotificationDirect(notificationId);
        }
    }

    deleteNotificationDirect(notificationId) {
        try {
            const notifications = JSON.parse(localStorage.getItem('opuslink_notifications') || '[]');
            const updatedNotifications = notifications.filter(n => n.id !== notificationId);
            localStorage.setItem('opuslink_notifications', JSON.stringify(updatedNotifications));
            
            this.loadNotifications();
            this.updateNotificationBadges();
            
            OpusUtils.showNotification('Notification deleted', 'success');
            return true;
        } catch (error) {
            console.error('Error deleting notification:', error);
            return false;
        }
    }

    clearAllNotifications() {
        if (confirm('Are you sure you want to clear all notifications?')) {
            const currentUser = this.currentUser;
            if (currentUser) {
                const notifications = JSON.parse(localStorage.getItem('opuslink_notifications') || '[]');
                const otherNotifications = notifications.filter(n => n.userId !== currentUser.id);
                localStorage.setItem('opuslink_notifications', JSON.stringify(otherNotifications));
                
                this.loadNotifications();
                this.updateNotificationBadges();
                OpusUtils.showNotification('All notifications cleared', 'success');
            }
        }
    }

    updateNotificationStats(notifications = null) {
        if (!notifications) {
            const currentUser = this.currentUser;
            notifications = currentUser ? NotificationSystem.getForUser(currentUser.id) : [];
        }
        
        const unreadCount = notifications.filter(n => !n.read).length;
        const totalCount = notifications.length;
        
        const unreadElement = document.getElementById('unreadNotificationsCount');
        const totalElement = document.getElementById('totalNotificationsCount');
        
        if (unreadElement) unreadElement.textContent = unreadCount;
        if (totalElement) totalElement.textContent = totalCount;
        
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

    updateNotificationBadges() {
        if (!this.currentUser) return;

        const notifications = NotificationSystem.getForUser(this.currentUser.id);
        const unreadCount = notifications.filter(n => !n.read).length;
        
        const sidebarBadge = document.getElementById('sidebarNotificationCount');
        if (sidebarBadge) {
            if (unreadCount > 0) {
                sidebarBadge.textContent = unreadCount > 99 ? '99+' : unreadCount;
                sidebarBadge.style.display = 'inline-block';
            } else {
                sidebarBadge.style.display = 'none';
            }
        }
        
        this.updateNotificationStats(notifications);
    }

    getNotificationIcon(type) {
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

    formatNotificationTime(timestamp) {
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

    formatKey(key) {
        return key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    setupNotificationFilters() {
        const typeFilter = document.getElementById('notificationTypeFilter');
        const statusFilter = document.getElementById('notificationStatusFilter');
        
        if (typeFilter) {
            typeFilter.addEventListener('change', () => this.loadNotifications());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.loadNotifications());
        }
    }

    setupWorkerNotificationClick() {
        const btn = document.getElementById('notificationBtn');
        const dropdown = document.getElementById('notificationDropdown');
        
        if (!btn || !dropdown) {
            console.log('Notification elements not found in worker dashboard');
            return;
        }

        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const isVisible = dropdown.style.display === 'block';
            dropdown.style.display = isVisible ? 'none' : 'block';
            
            if (!isVisible) {
                this.loadWorkerNotifications();
            }
        });

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    loadWorkerNotifications() {
        if (typeof NotificationSystem === 'undefined') return;
        
        const container = document.getElementById('notificationsContainer');
        if (!container) {
            console.log('Worker notifications container not found');
            return;
        }

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) return;

        const notifications = NotificationSystem.getForUser(currentUser.id);
        
        if (notifications.length === 0) {
            container.innerHTML = `
                <div style="padding: 40px 20px; text-align: center; color: var(--muted);">
                    <div style="font-size: 3rem; margin-bottom: 16px;">🔔</div>
                    <h4 style="color: var(--text-primary); margin-bottom: 8px;">No notifications</h4>
                    <p>You're all caught up!</p>
                </div>
            `;
            return;
        }

        container.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.read ? 'read' : 'unread'}" 
                 onclick="workerDashboard.handleWorkerNotificationClick('${notif.id}')"
                 style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); cursor: pointer; transition: background 0.2s;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
                    <strong style="color: var(--text-primary); flex: 1;">${notif.title}</strong>
                    ${!notif.read ? '<span style="color: var(--accent); font-size: 0.8rem;">●</span>' : ''}
                </div>
                <div style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 8px; line-height: 1.4;">
                    ${notif.message}
                </div>
                <div style="color: var(--muted); font-size: 0.8rem; display: flex; justify-content: space-between; align-items: center;">
                    <span>${this.formatTime(notif.timestamp)}</span>
                    ${!notif.read ? `
                        <button onclick="event.stopPropagation(); workerDashboard.markWorkerNotificationAsRead('${notif.id}')" 
                                style="background: var(--accent); color: white; border: none; padding: 4px 8px; border-radius: 4px; font-size: 0.7rem; cursor: pointer;">
                            Mark read
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    handleWorkerNotificationClick(notificationId) {
        if (typeof NotificationSystem !== 'undefined') {
            NotificationSystem.markAsRead(notificationId);
            this.loadWorkerNotifications();
        }
        
        const dropdown = document.getElementById('notificationDropdown');
        if (dropdown) {
            dropdown.style.display = 'none';
        }
    }

    markWorkerNotificationAsRead(notificationId) {
        if (typeof NotificationSystem !== 'undefined' && NotificationSystem.markAsRead(notificationId)) {
            this.loadWorkerNotifications();
            OpusUtils.showNotification('Notification marked as read', 'success');
        }
    }

    // ⏰ REAL-TIME UPDATES
    setupRealTimeUpdates() {
        console.log('⏰ Setting up real-time updates...');
        
        this.updateInterval = setInterval(() => {
            try {
                this.syncUserData();
                this.updateNotificationBadges();
            } catch (error) {
                console.error('❌ Error in real-time update:', error);
            }
        }, 5000);
        
        this.storageHandler = (e) => {
            if (e.key === 'opuslink_users' || e.key === 'opuslink_notifications') {
                try {
                    this.syncUserData();
                    this.updateNotificationBadges();
                } catch (error) {
                    console.error('❌ Error in storage update:', error);
                }
            }
        };
        
        window.addEventListener('storage', this.storageHandler);
        console.log('✅ Real-time updates configured');
    }

    syncUserData() {
        console.log('🔄 WorkerDashboard: Starting data sync...');
        
        try {
            let sessionUser = null;
            try {
                const userData = sessionStorage.getItem('currentUser');
                if (userData) sessionUser = JSON.parse(userData);
            } catch (parseError) {
                console.error('❌ Error parsing session user:', parseError);
            }
            
            let storageUsers = [];
            try {
                const storedData = localStorage.getItem('opuslink_users');
                if (storedData) storageUsers = JSON.parse(storedData);
            } catch (storageError) {
                console.error('❌ Error parsing storage users:', storageError);
            }
            
            if (sessionUser && sessionUser.id) {
                const storageUser = storageUsers.find(u => u.id === sessionUser.id);
                
                if (storageUser) {
                    const updatedUser = {
                        ...sessionUser,
                        ...storageUser,
                        profileCompletion: this.getSafeNumber(storageUser.profileCompletion, sessionUser.profileCompletion, 0),
                        isVerified: !!storageUser.isVerified || !!sessionUser.isVerified || false
                    };
                    
                    try {
                        sessionStorage.setItem('currentUser', JSON.stringify(updatedUser));
                        this.currentUser = updatedUser;
                        this.updateVerificationUI(updatedUser);
                        console.log('✅ WorkerDashboard: Data synced successfully');
                    } catch (saveError) {
                        console.error('❌ Error saving to session:', saveError);
                    }
                } else {
                    console.log('⚠️ User not found in storage, using session data');
                    this.currentUser = sessionUser;
                    this.updateVerificationUI(sessionUser);
                }
            } else {
                console.warn('⚠️ No valid session user found');
                this.updateVerificationUI();
            }
            
        } catch (error) {
            console.error('❌ WorkerDashboard: Sync error:', error);
            this.updateVerificationUI();
        }
    }

    // 🛠️ UTILITY METHODS
    // Add this method to your WorkerDashboard class
closeModals() {
    console.log('🔒 Closing all modals...');
    
    // Close job modal
    const jobModal = document.getElementById('jobModal');
    if (jobModal) {
        jobModal.style.display = 'none';
    }
    
    // Close application modal
    const applicationModal = document.getElementById('applicationModal');
    if (applicationModal) {
        applicationModal.style.display = 'none';
    }
    
    // Close any other modals
    document.querySelectorAll('.modal-overlay').forEach(modal => {
        modal.style.display = 'none';
    });
}


    logout() {
        if (this.updateInterval) clearInterval(this.updateInterval);
        if (this.storageHandler) window.removeEventListener('storage', this.storageHandler);
        
        sessionStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    }

    createEmptyState(icon, title, message) {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">${icon}</div>
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        `;
    }

    getStatusColor(status) {
        const colors = {
            'pending': { background: 'rgba(245, 158, 11, 0.2)', color: '#f59e0b' },
            'approved': { background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' },
            'rejected': { background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' },
            'accepted': { background: 'rgba(34, 197, 94, 0.2)', color: '#4ade80' },
            'active': { background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa' }
        };
        return colors[status] || { background: 'rgba(100, 116, 139, 0.2)', color: '#94a3b8' };
    }

    formatType(type) {
        const types = {
            'fulltime': 'Full-Time',
            'parttime': 'Part-Time', 
            'contract': 'Contract',
            'freelance': 'Freelance',
            'remote': 'Remote'
        };
        return types[type] || type;
    }

    formatJobType(type) {
        return this.formatType(type);
    }

    formatCategory(category) {
        return category || 'General';
    }

    formatPaymentType(type) {
        const types = {
            'hourly': 'Hourly Rate',
            'monthly': 'Monthly Salary', 
            'fixed': 'Fixed Project',
            'milestone': 'Milestone-based',
            'daily': 'Daily Rate'
        };
        return types[type] || type;
    }

    formatTime(timestamp) {
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

    getSafeNumber(...values) {
        for (let value of values) {
            if (value !== undefined && value !== null && !isNaN(value)) {
                const num = Number(value);
                if (num >= 0 && num <= 100) return num;
            }
        }
        return 0;
    }

    showFallbackModal(content) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div style="background: #1a1a1a; border-radius: 12px; max-width: 500px; width: 90%; border: 1px solid #333;">
                <div style="padding: 20px; border-bottom: 1px solid #333; display: flex; justify-content: space-between; align-items: center;">
                    <h3 style="margin: 0; color: #fff;">Verification Required</h3>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" 
                            style="background: none; border: none; color: #fff; font-size: 20px; cursor: pointer;">×</button>
                </div>
                <div>${content}</div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    // Static methods
    static requestVerification() {
        try {
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            if (!currentUser) {
                OpusUtils.showNotification('Please log in to request verification', 'error');
                return;
            }

            const result = ProfileManager.requestVerification(currentUser.id);
            
            if (result.success) {
                OpusUtils.showNotification(result.message, 'success');
                
                if (typeof OpusUtils !== 'undefined' && OpusUtils.closeModal) {
                    OpusUtils.closeModal();
                }
                
                if (window.workerDashboard) {
                    workerDashboard.checkVerificationStatus();
                    workerDashboard.updateVerificationBadges();
                }
            } else {
                OpusUtils.showNotification(result.message, 'error');
            }
        } catch (error) {
            console.error('Error requesting verification:', error);
            OpusUtils.showNotification('Failed to request verification', 'error');
        }
    }

    static showVerificationConfirmation(user) {
        const modalContent = `
            <div style="padding: 24px; text-align: center;">
                <div style="font-size: 4rem; margin-bottom: 16px;">✅</div>
                <h3 style="color: var(--text-primary); margin-bottom: 12px;">Verification Request Submitted!</h3>
                
                <div style="background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3); 
                            border-radius: 8px; padding: 16px; margin-bottom: 20px; text-align: left;">
                    <h4 style="color: #22c55e; margin-bottom: 12px;">📋 What Happens Next?</h4>
                    <ul style="color: var(--text-secondary); padding-left: 20px; margin: 0; text-align: left;">
                        <li>Our admin team has been notified</li>
                        <li>Your profile is now in review queue</li>
                        <li>Typical processing time: 24-48 hours</li>
                        <li>You'll receive a notification once approved</li>
                        <li>You can track status in your profile</li>
                    </ul>
                </div>
                
                <div style="background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.3); 
                            border-radius: 8px; padding: 12px; margin-bottom: 20px;">
                    <p style="color: #3b82f6; margin: 0; font-weight: 500;">
                        🔔 You will be notified via email and in-app notification once your account is verified.
                    </p>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button onclick="OpusUtils.closeModal(); WorkerDashboard.navigateToSection('profile');" 
                            style="background: var(--gold-primary); color: black; border: none; 
                                   padding: 12px 24px; border-radius: 8px; font-weight: bold; 
                                   cursor: pointer;">
                        📊 View Profile Status
                    </button>
                    <button onclick="OpusUtils.closeModal()" 
                            style="background: transparent; color: var(--text-secondary); 
                                   border: 1px solid var(--border-color); padding: 12px 24px; 
                                   border-radius: 8px; cursor: pointer;">
                        Close
                    </button>
                </div>
            </div>
        `;

        if (typeof OpusUtils !== 'undefined' && OpusUtils.showModal) {
            OpusUtils.showModal('Verification Request Submitted', modalContent);
        }
    }
     migrateAgreementData() {
    try {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        let migratedCount = 0;
        
        agreements.forEach(agreement => {
            let needsMigration = false;
            
            // Migrate old agreement structure to new structure
            if (agreement.terms && !agreement.workTerms) {
                agreement.workTerms = {
                    workType: agreement.terms.workType || 'fulltime',
                    location: agreement.terms.location || 'remote',
                    duration: agreement.terms.duration || 90,
                    weeklyHours: agreement.terms.weeklyHours || 40,
                    startDate: agreement.startDate || agreement.createdAt,
                    probationPeriod: agreement.terms.probationPeriod || 15,
                    noticePeriod: agreement.terms.noticePeriod || 30
                };
                needsMigration = true;
            }
            
            // Ensure paymentTerms exists
            if (!agreement.paymentTerms && agreement.terms) {
                agreement.paymentTerms = {
                    type: agreement.terms.paymentType || 'monthly',
                    amount: agreement.terms.paymentAmount || 45000,
                    schedule: agreement.terms.paymentSchedule || 'monthly',
                    currency: 'INR'
                };
                needsMigration = true;
            }
            
            if (needsMigration) {
                migratedCount++;
            }
        });
        
        if (migratedCount > 0) {
            localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
            console.log(`✅ Migrated ${migratedCount} agreements to new data structure`);
        }
        
    } catch (error) {
        console.error('❌ Error migrating agreement data:', error);
    }
}
// IN WorkerDashboard CLASS - ADD COMPREHENSIVE MIGRATION
 migrateAndRepairAllAgreements() {
    console.log('🔄 Starting comprehensive agreement migration and repair...');
    
    try {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        let repairedCount = 0;
        let migratedCount = 0;
        
        agreements.forEach((agreement, index) => {
            let wasRepaired = false;
            let wasMigrated = false;
            
            // Skip completely invalid agreements
            if (!agreement || typeof agreement !== 'object' || !agreement.id) {
                console.warn('❌ Skipping completely invalid agreement:', agreement);
                return;
            }
            
            // MIGRATION: Convert old structure to new structure
            if (agreement.terms && !agreement.workTerms) {
                console.log('🔄 Migrating old agreement structure:', agreement.id);
                
                agreement.workTerms = {
                    workType: agreement.terms.workType || agreement.terms?.type || 'fulltime',
                    location: agreement.terms.location || agreement.location || 'remote',
                    duration: agreement.terms.duration || 90,
                    weeklyHours: agreement.terms.weeklyHours || (agreement.terms.workType === 'fulltime' ? 40 : 20),
                    startDate: agreement.startDate || agreement.createdAt || new Date().toISOString(),
                    endDate: agreement.endDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    probationPeriod: agreement.terms.probationPeriod || 15,
                    noticePeriod: agreement.terms.noticePeriod || 30,
                    workingDays: agreement.terms.workingDays || 'mon_fri',
                    shiftTiming: agreement.terms.shiftTiming || 'general',
                    overtimePolicy: agreement.terms.overtimePolicy || 'paid_2x'
                };
                
                // Clean up old structure
                delete agreement.terms;
                wasMigrated = true;
                migratedCount++;
            }
            
            // REPAIR: Ensure workTerms exists
            if (!agreement.workTerms) {
                console.log('🔧 Repairing missing workTerms:', agreement.id);
                
                agreement.workTerms = {
                    workType: 'fulltime',
                    location: 'remote',
                    duration: 90,
                    weeklyHours: 40,
                    startDate: agreement.createdAt || new Date().toISOString(),
                    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    probationPeriod: 15,
                    noticePeriod: 30,
                    workingDays: 'mon_fri',
                    shiftTiming: 'general',
                    overtimePolicy: 'paid_2x'
                };
                wasRepaired = true;
            }
            
            // REPAIR: Ensure paymentTerms exists and is valid
            if (!agreement.paymentTerms) {
                console.log('🔧 Repairing missing paymentTerms:', agreement.id);
                
                agreement.paymentTerms = {
                    type: 'monthly',
                    amount: agreement.salary ? parseInt(agreement.salary.replace(/[^\d]/g, '')) || 45000 : 45000,
                    schedule: 'monthly',
                    currency: 'INR',
                    hourlyRate: 0,
                    agreedUpon: agreement.createdAt || new Date().toISOString()
                };
                wasRepaired = true;
            }
            
            // REPAIR: Validate and fix payment amount
            if (!agreement.paymentTerms.amount || isNaN(parseFloat(agreement.paymentTerms.amount))) {
                console.log('🔧 Repairing invalid payment amount:', agreement.id);
                
                agreement.paymentTerms.amount = 45000; // Default amount
                if (agreement.paymentTerms.type === 'hourly') {
                    agreement.paymentTerms.amount = 500; // Default hourly rate
                }
                wasRepaired = true;
            }
            
            // REPAIR: Ensure payment amount is a number
            if (typeof agreement.paymentTerms.amount === 'string') {
                agreement.paymentTerms.amount = parseFloat(agreement.paymentTerms.amount);
                wasRepaired = true;
            }
            
            // REPAIR: Ensure required workTerms fields
            const requiredWorkFields = ['duration', 'weeklyHours'];
            requiredWorkFields.forEach(field => {
                if (!agreement.workTerms[field] || isNaN(parseInt(agreement.workTerms[field]))) {
                    agreement.workTerms[field] = field === 'duration' ? 90 : 40;
                    wasRepaired = true;
                }
            });
            
            // REPAIR: Ensure dates are valid
            if (!agreement.workTerms.startDate || isNaN(new Date(agreement.workTerms.startDate).getTime())) {
                agreement.workTerms.startDate = agreement.createdAt || new Date().toISOString();
                wasRepaired = true;
            }
            
            if (!agreement.workTerms.endDate || isNaN(new Date(agreement.workTerms.endDate).getTime())) {
                const startDate = new Date(agreement.workTerms.startDate);
                agreement.workTerms.endDate = new Date(startDate.getTime() + (agreement.workTerms.duration * 24 * 60 * 60 * 1000)).toISOString();
                wasRepaired = true;
            }
            
            // REPAIR: Add legalTerms if missing
            if (!agreement.legalTerms) {
                agreement.legalTerms = {
                    ipRights: 'employer',
                    confidentiality: 'standard',
                    equipmentProvision: 'employer_provides',
                    additionalTerms: ''
                };
                wasRepaired = true;
            }
            
            // Update the agreement in the array
            agreements[index] = agreement;
            
            if (wasRepaired) repairedCount++;
            if (wasMigrated) migratedCount++;
            
            if (wasRepaired || wasMigrated) {
                console.log('✅ Successfully processed agreement:', agreement.id, {
                    wasRepaired,
                    wasMigrated,
                    workTerms: !!agreement.workTerms,
                    paymentTerms: !!agreement.paymentTerms,
                    amount: agreement.paymentTerms?.amount
                });
            }
        });
        
        // Save all changes
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        
        console.log(`🎉 Migration complete: ${migratedCount} migrated, ${repairedCount} repaired out of ${agreements.length} total agreements`);
        
        if (migratedCount > 0 || repairedCount > 0) {
            OpusUtils.showNotification(`✅ Updated ${migratedCount + repairedCount} agreements to new format`, 'success');
        }
        
        return { migratedCount, repairedCount, totalAgreements: agreements.length };
        
    } catch (error) {
        console.error('❌ Error during agreement migration:', error);
        OpusUtils.showNotification('Error updating agreement data', 'error');
        return { migratedCount: 0, repairedCount: 0, totalAgreements: 0 };
    }
}
// 🔧 ADD EVENT DELEGATION FOR AGREEMENT BUTTONS
setupAgreementEventDelegation() {
    document.addEventListener('click', (e) => {
        const target = e.target;
        
        // Handle "Review & Accept Agreement" buttons
        if (target.classList.contains('btn-primary') && target.textContent.includes('Review & Accept Agreement')) {
            e.preventDefault();
            const agreementCard = target.closest('.agreement-card');
            if (agreementCard) {
                // You'll need to extract agreement ID from data attribute
                const agreementId = target.getAttribute('data-agreement-id');
                if (agreementId) {
                    this.showAgreementAcceptanceModal(agreementId);
                }
            }
        }
        
        // Handle "View Details" buttons
        if (target.classList.contains('btn-ghost') && target.textContent.includes('View Details')) {
            e.preventDefault();
            const agreementId = target.getAttribute('data-agreement-id');
            if (agreementId) {
                this.viewAgreementDetails(agreementId);
            }
        }
        
        // Handle "Reject" buttons
        if (target.classList.contains('btn-danger') && target.textContent.includes('Reject')) {
            e.preventDefault();
            const agreementId = target.getAttribute('data-agreement-id');
            if (agreementId) {
                this.rejectAgreementWithReason(agreementId);
            }
        }
    });
}
    // IN WorkerDashboard CLASS - ADD REPAIR METHOD
// ENHANCE THE REPAIR METHOD
 repairAgreement(agreementId) {
    if (!confirm('This will repair the agreement data structure. Continue?')) {
        return;
    }
    
    try {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreementIndex = agreements.findIndex(a => a.id === agreementId);
        
        if (agreementIndex === -1) {
            OpusUtils.showNotification('Agreement not found', 'error');
            return;
        }
        
        const agreement = agreements[agreementIndex];
        console.log('🔧 Repairing agreement:', agreement);
        
        // Comprehensive repair
        if (!agreement.workTerms) {
            agreement.workTerms = {
                workType: 'fulltime',
                location: 'remote',
                duration: 90,
                weeklyHours: 40,
                startDate: agreement.createdAt || new Date().toISOString(),
                endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                probationPeriod: 15,
                noticePeriod: 30,
                workingDays: 'mon_fri',
                shiftTiming: 'general',
                overtimePolicy: 'paid_2x'
            };
        }
        
        if (!agreement.paymentTerms) {
            agreement.paymentTerms = {
                type: 'monthly',
                amount: 45000,
                schedule: 'monthly',
                currency: 'INR',
                hourlyRate: Math.round(45000 / 160), // 160 hours per month
                agreedUpon: new Date().toISOString()
            };
        }
        
        // Ensure amount is valid number
        if (!agreement.paymentTerms.amount || isNaN(parseFloat(agreement.paymentTerms.amount))) {
            agreement.paymentTerms.amount = 45000;
        }
        
        if (typeof agreement.paymentTerms.amount === 'string') {
            agreement.paymentTerms.amount = parseFloat(agreement.paymentTerms.amount);
        }
        
        // Ensure work terms have required fields
        if (!agreement.workTerms.duration || isNaN(parseInt(agreement.workTerms.duration))) {
            agreement.workTerms.duration = 90;
        }
        
        if (!agreement.workTerms.weeklyHours || isNaN(parseInt(agreement.workTerms.weeklyHours))) {
            agreement.workTerms.weeklyHours = 40;
        }
        
        // Add legal terms if missing
        if (!agreement.legalTerms) {
            agreement.legalTerms = {
                ipRights: 'employer',
                confidentiality: 'standard',
                equipmentProvision: 'employer_provides',
                additionalTerms: ''
            };
        }
        
        // Update timestamp
        agreement.updatedAt = new Date().toISOString();
        
        // Save the repaired agreement
        agreements[agreementIndex] = agreement;
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        
        console.log('✅ Repaired agreement:', agreement);
        OpusUtils.showNotification('✅ Agreement repaired successfully!', 'success');
        
        // Reload the display
        this.loadActiveAgreements();
        
    } catch (error) {
        console.error('❌ Error repairing agreement:', error);
        OpusUtils.showNotification('Failed to repair agreement', 'error');
    }
}
// DEBUG METHOD: Check all agreements
 debugAgreements() {
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    console.log('🔍 DEBUG: All agreements in storage:', agreements);
    
    agreements.forEach(agreement => {
        console.log(`📄 Agreement ${agreement.id}:`, {
            hasWorkTerms: !!agreement.workTerms,
            hasPaymentTerms: !!agreement.paymentTerms,
            workTerms: agreement.workTerms,
            paymentTerms: agreement.paymentTerms,
            offerId: agreement.offerId,
            applicationId: agreement.applicationId,
            status: agreement.status
        });
    });
    
    return agreements;
}

// Call this in your console to debug:
// workerDashboard.debugAgreements();
// TEMPORARY: Add test button to debug agreements
addTestButton() {
    const testButton = document.createElement('button');
    testButton.textContent = '🧪 Test Agreement View';
    testButton.className = 'btn btn-info';
    testButton.style.margin = '10px';
    testButton.onclick = () => {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        if (agreements.length > 0 && currentUser) {
            const userAgreement = agreements.find(a => a.workerId === currentUser.id);
            if (userAgreement) {
                this.viewAgreementDetails(userAgreement.id);
            } else {
                OpusUtils.showNotification('No agreements found for current user', 'warning');
            }
        } else {
            OpusUtils.showNotification('No agreements found in storage', 'warning');
        }
    };
    
    const container = document.getElementById('activeAgreementsContainer');
    if (container) {
        container.parentNode.insertBefore(testButton, container);
    }
}
    
}

// Initialize global instance
let workerDashboard = new WorkerDashboard();

// Make it globally available

// Global instance

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Creating WorkerDashboard instance...');
    workerDashboard = new WorkerDashboard();
    workerDashboard.init();

    window.WorkerDashboard = WorkerDashboard;
});
// Global functions for document management
function openDocumentUploadModal() {
    const modal = document.getElementById('documentUploadModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeDocumentUploadModal() {
    const modal = document.getElementById('documentUploadModal');
    if (modal) {
        modal.style.display = 'none';
    }
    // Reset form
    const fileInput = document.getElementById('documentFile');
    const selectedFileName = document.getElementById('selectedFileName');
    const uploadBtn = document.getElementById('uploadDocumentBtn');
    
    if (fileInput) fileInput.value = '';
    if (selectedFileName) selectedFileName.style.display = 'none';
    if (uploadBtn) uploadBtn.disabled = true;
}

function uploadDocument() {
    const fileInput = document.getElementById('documentFile');
    const documentTypeSelect = document.getElementById('documentType');
    
    if (!fileInput || !documentTypeSelect) {
        OpusUtils.showNotification('Document upload system not available', 'error');
        return;
    }
    
    const documentType = documentTypeSelect.value;
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        OpusUtils.showNotification('Please log in to upload documents', 'error');
        return;
    }
    
    if (!fileInput.files.length) {
        OpusUtils.showNotification('Please select a file', 'error');
        return;
    }
    
    const file = fileInput.files[0];
    const result = ProfileManager.uploadDocument(currentUser.id, documentType, file.name);
    
    if (result.success) {
        OpusUtils.showNotification(result.message, 'success');
        closeDocumentUploadModal();
        
        // Reload documents list
        if (typeof EmployerDashboard !== 'undefined') {
            EmployerDashboard.loadDocuments();
        }
        if (typeof WorkerDashboard !== 'undefined') {
            WorkerDashboard.loadDocuments();
        }
    } else {
        OpusUtils.showNotification(result.message, 'error');
    }
}

function deleteDocument(documentId) {
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    if (!currentUser) {
        OpusUtils.showNotification('Please log in to delete documents', 'error');
        return;
    }
    
    const result = ProfileManager.deleteDocument(currentUser.id, documentId);
    
    if (result.success) {
        OpusUtils.showNotification(result.message, 'success');
        
        // Reload documents list
        if (typeof EmployerDashboard !== 'undefined') {
            EmployerDashboard.loadDocuments();
        }
        if (typeof WorkerDashboard !== 'undefined') {
            WorkerDashboard.loadDocuments();
        }
    } else {
        OpusUtils.showNotification(result.message, 'error');
    }
}

// File input change handler - This should be in DOMContentLoaded
// Section switching functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing OpusLink Dashboard...');
    
    // 🆕 WALLET INITIALIZATION - ADD THIS AT THE BEGINNING 🆕
    
    function initializeWalletSystem() {
        console.log('ℹ️ Wallet system: Checking for wallet elements...');
  
  // Check if any wallet elements exist
  const walletElements = document.querySelectorAll('[class*="wallet"], .wallet-connect, .balance-display, .wallet-container');
  
  if (walletElements.length === 0) {
    console.log('ℹ️ No wallet elements found on this page. Wallet features disabled.');
    return; // STOP - don't retry
  }
  
  console.log('✅ Wallet elements found, initializing...');
        }
        
        const currentUser = OpusAuth.getCurrentUser();
        if (currentUser && currentUser.id) {
            EscrowWallet.initializeWallet(currentUser.id);
            console.log('✅ Wallet system initialized for:', currentUser.email);
            
            // Update wallet balance in topbar if element exists
            updateWalletBalanceDisplay();
        }
    
    
    // 🆕 FUNCTION TO UPDATE WALLET BALANCE DISPLAY 🆕
    function updateWalletBalanceDisplay() {
        const walletBalanceElement = document.getElementById('walletBalance');
        if (walletBalanceElement && typeof WalletManager !== 'undefined') {
            const walletSummary = WalletManager.getWalletSummary();
            if (walletSummary) {
                walletBalanceElement.innerHTML = `₹${walletSummary.available}`;
            }
        }
    }
    
    // Start wallet initialization
    if (document.querySelector('.wallet-section')) {
  initializeWalletSystem();
}


    // YOUR EXISTING NAVIGATION CODE
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.dashboard-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding section
            const sectionId = this.getAttribute('data-section');
            const targetSection = document.getElementById(sectionId);
            if (targetSection) {
                targetSection.classList.add('active');
                
                // 🆕 UPDATE WALLET BALANCE WHEN SWITCHING SECTIONS 🆕
                if (sectionId === 'overview' || sectionId === 'payment-history') {
                    setTimeout(updateWalletBalanceDisplay, 100);
                }
            }
        });
    });

    // Close modal when clicking outside
    const modal = document.getElementById('documentUploadModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeDocumentUploadModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeDocumentUploadModal();
        }
    });
    
    // 🆕 ADD WALLET BUTTON EVENT LISTENER 🆕
    const walletButton = document.querySelector('[onclick*="showWallet"]');
    if (walletButton) {
        walletButton.addEventListener('click', function(e) {
            e.preventDefault();
            if (typeof EmployerDashboard !== 'undefined') {
                EmployerDashboard.showWallet();
            }
        });
    }
    
    // 🆕 PERIODICALLY UPDATE WALLET BALANCE 🆕
    setInterval(updateWalletBalanceDisplay, 30000); // Update every 30 seconds
    
    console.log('✅ DOM Content Loaded - Dashboard ready with wallet integration');
});
// Global Chat Functions
function toggleChatSystem() {
    const chatSystem = document.getElementById('chatSystem');
    if (chatSystem) {
        chatSystem.classList.toggle('active');
        ChatSystem.loadChats();
    }
}

function closeChatSystem() {
    const chatSystem = document.getElementById('chatSystem');
    if (chatSystem) {
        chatSystem.classList.remove('active');
    }
}

function startChatWithUser(userId, userName) {
    toggleChatSystem();
    setTimeout(() => {
        ChatSystem.startNewChat(userId, userName);
    }, 100);
}
function createAgreementsForAcceptedApplications() {
    const applications = JSON.parse(localStorage.getItem('opuslink_applications') || '[]');
    const jobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
    const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
    const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
    
    const acceptedApplications = applications.filter(app => app.status === 'accepted');
    
    console.log(`Found ${acceptedApplications.length} accepted applications`);
    
    acceptedApplications.forEach(app => {
        // Check if agreement already exists for this application
        const existingAgreement = agreements.find(agr => agr.applicationId === app.id);
        
        if (!existingAgreement) {
            const job = jobs.find(j => j.id === app.jobId);
            const employer = users.find(u => u.id === app.employerId);
            
            if (job && employer) {
                const agreement = {
                    id: 'agreement_' + Date.now(),
                    employerId: app.employerId,
                    employerName: employer.companyName || employer.fullName,
                    workerId: app.workerId,
                    workerName: app.workerName,
                    jobId: app.jobId,
                    jobTitle: app.jobTitle,
                    terms: {
                        salary: job.salary || '45000',
                        workType: job.type || 'fulltime',
                        location: job.location || 'Remote',
                        duration: 90
                    },
                    status: 'active',
                    startDate: new Date().toISOString(),
                    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
                    workStatus: 'in_progress',
                    payments: [],
                    workLogs: [],
                    createdAt: new Date().toISOString(),
                    applicationId: app.id
                };
                
                agreements.push(agreement);
                console.log(`✅ Created agreement for: ${app.jobTitle} with ${agreement.employerName}`);
            }
        }
    });
    
    localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
    console.log(`🎉 Created ${acceptedApplications.length} agreements from accepted applications`);
    
    // Reload worker dashboard
    if (typeof WorkerDashboard !== 'undefined') {
      //  WorkerDashboard.loadActiveAgreements();
    }
    
}

// Run this to create agreements for existing accepted applications
createAgreementsForAcceptedApplications();
// ... all your existing WorkerDashboard class code ...

// =============================================
// GLOBAL DOCUMENT UPLOAD FUNCTIONS
// =============================================

function openWorkerDocumentUploadModal() {
    console.log('📁 Opening document upload modal...');
    const modal = document.getElementById('documentUploadModal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        console.error('❌ Document upload modal not found');
    }
}

function closeDocumentUploadModal() {
    console.log('📁 Closing document upload modal...');
    const modal = document.getElementById('documentUploadModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Reset file input
        const fileInput = document.getElementById('documentFile');
        if (fileInput) {
            fileInput.value = '';
        }
        
        const fileName = document.getElementById('selectedFileName');
        if (fileName) {
            fileName.style.display = 'none';
        }
    }
}

function uploadDocument() {
    console.log('📤 Uploading document...');
    
    const fileInput = document.getElementById('documentFile');
    const file = fileInput.files[0];
    
    if (!file) {
        OpusUtils.showNotification('Please select a file', 'error');
        return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        OpusUtils.showNotification('File size must be less than 5MB', 'error');
        return;
    }

    // Check file type
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        OpusUtils.showNotification('Please select a PDF, JPG, or PNG file', 'error');
        return;
    }

    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    const result = ProfileManager.uploadDocument(currentUser.id, file);
    
    if (result.success) {
        OpusUtils.showNotification('Document uploaded successfully!', 'success');
        closeDocumentUploadModal();
        
        // Refresh documents list
        if (window.workerDashboard) {
            workerDashboard.loadDocuments();
        }
    } else {
        OpusUtils.showNotification(result.message, 'error');
    }
}

// File input change handler
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('documentFile');
    const fileName = document.getElementById('selectedFileName');
    const uploadBtn = document.getElementById('uploadDocumentBtn');
    
    if (fileInput && fileName) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                const file = e.target.files[0];
                fileName.textContent = `Selected: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`;
                fileName.style.display = 'block';
                
                // Enable upload button
                if (uploadBtn) {
                    uploadBtn.disabled = false;
                }
            } else {
                fileName.style.display = 'none';
                if (uploadBtn) {
                    uploadBtn.disabled = true;
                }
            }
        });
    }
    
    // Setup file upload area click
    const uploadArea = document.getElementById('fileUploadArea');
    if (uploadArea) {
        uploadArea.addEventListener('click', function() {
            document.getElementById('documentFile').click();
        });
    }
});
