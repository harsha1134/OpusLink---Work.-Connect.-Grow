// CORRECTED FEEDBACK SYSTEM - Matches your HTML structure
class FeedbackSystem {
static init() {
    console.log('⭐ Feedback System Initializing...');
    
    // Check if we're on a feedback page
    const feedbackSection = document.getElementById('feedback');
    if (!feedbackSection) {
        console.log('ℹ️ FeedbackSystem: No feedback section found');
        return;
    }
    
    // Verify tabs and forms exist before proceeding
    const tabs = document.querySelectorAll('.feedback-tab');
    const forms = document.querySelectorAll('.feedback-form');
    
    if (tabs.length === 0 || forms.length === 0) {
        console.error('❌ Feedback system: Missing tabs or forms');
        console.log('Tabs found:', tabs.length, 'Forms found:', forms.length);
        return;
    }
    
    console.log(`✅ Found ${tabs.length} tabs and ${forms.length} forms`);
    
    // Log all available form types for debugging
    const formTypes = Array.from(tabs).map(tab => tab.getAttribute('data-form'));
    console.log('📋 Available form types:', formTypes);
    
    this.setupEventListeners();
    this.loadPendingFeedback();
    this.loadGivenFeedback();
    this.loadReceivedFeedback();
    this.loadMyReports();
    
    console.log('✅ FeedbackSystem initialized successfully');
}

    static setupEventListeners() {
        console.log('🔧 Setting up feedback event listeners...');
        
        // TAB SWITCHING - Uses your exact HTML structure
    const tabs = document.querySelectorAll('.feedback-tab');
    if (tabs.length === 0) {
        console.error('❌ No feedback tabs found!');
        return;
    }
    
    console.log(`✅ Found ${tabs.length} feedback tabs`);
    
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            e.preventDefault();
            const formType = tab.getAttribute('data-form');
            if (!formType) {
                console.error('❌ Tab missing data-form attribute:', tab);
                return;
            }
            console.log('Tab clicked:', formType);
            this.switchFeedbackTab(formType);
        });
    });

        // PLATFORM FEEDBACK FORM
    const platformForm = document.getElementById('platformFeedbackForm');
    if (platformForm) {
        platformForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitPlatformFeedback();
        });
    }

        // REPORT FORM
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        reportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitReport();
        });
    }

        // RATING STARS - Event delegation for dynamic content
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('rating-star')) {
            this.handleStarRating(e.target);
        }
    });

        // PLATFORM RATING STARS
    const platformRating = document.getElementById('platformRating');
    if (platformRating) {
        platformRating.addEventListener('click', (e) => {
            if (e.target.classList.contains('rating-star')) {
                this.handleStarRating(e.target);
            }
        });
    }
}

static switchFeedbackTab(formType) {
    console.log(`🔄 Switching to tab: ${formType}`);
    
    // Remove active class from all tabs
    document.querySelectorAll('.feedback-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Hide all forms
    document.querySelectorAll('.feedback-form').forEach(form => {
        form.classList.remove('active');
    });

    // Activate clicked tab - ADD NULL CHECK
    const activeTab = document.querySelector(`.feedback-tab[data-form="${formType}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    } else {
        console.error(`❌ Tab not found for form type: ${formType}`);
        OpusUtils.showNotification('Tab not found', 'error');
        return; // Exit early if tab not found
    }

    // Show corresponding form - ADD NULL CHECK
    const activeForm = document.getElementById(formType);
    if (activeForm) {
        activeForm.classList.add('active');
    } else {
        console.error(`❌ Form not found with ID: ${formType}`);
        OpusUtils.showNotification('Form not found', 'error');
        return; // Exit early if form not found
    }

    // Load content for the selected tab
    switch(formType) {
        case 'pending-feedback':
            this.loadPendingFeedback();
            break;
        case 'given-feedback':
            this.loadGivenFeedback();
            break;
        case 'received-feedback':
            this.loadReceivedFeedback();
            break;
        case 'platform-feedback':
            this.loadPlatformFeedbackStats();
            break;
        case 'my-reports':
            this.loadMyReports();
            break;
        case 'report-issue':
            this.loadReportForm();
            break;
        default:
            console.warn(`⚠️ Unknown form type: ${formType}`);
    }
}

    static handleStarRating(star) {
        if (!star) return;
        
        try {
            const starsContainer = star.parentElement;
            const rating = parseInt(star.getAttribute('data-value'));
            const stars = starsContainer.querySelectorAll('.rating-star');
            
            // Update star colors
            stars.forEach((s, index) => {
                if (index < rating) {
                    s.classList.add('active');
                    s.style.color = '#ffc107';
                } else {
                    s.classList.remove('active');
                    s.style.color = '#666';
                }
            });
            
            // Update container rating
            starsContainer.setAttribute('data-rating', rating);
        } catch (error) {
            console.error('Error handling star rating:', error);
        }
    }

    // PENDING FEEDBACK - Rate other users
    static loadPendingFeedback() {
        const container = document.getElementById('pendingFeedbackList');
        if (!container) {
            console.log('❌ pendingFeedbackList container not found');
            return;
        }

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!currentUser) {
            container.innerHTML = '<div class="empty-state">Please log in to view feedback</div>';
            return;
        }

        try {
            const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
            
            const pendingAgreements = agreements.filter(agreement => {
                const isCompleted = agreement.status === 'completed';
                const isUserInvolved = agreement.employerId === currentUser.id || agreement.workerId === currentUser.id;
                const notRated = !agreement.feedback || 
                    (currentUser.role === 'employer' && !agreement.feedback.employerRated) ||
                    (currentUser.role === 'worker' && !agreement.feedback.workerRated);
                
                return isCompleted && isUserInvolved && notRated;
            });

            if (pendingAgreements.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">✅</div>
                        <h3>No pending feedback</h3>
                        <p>You have no completed jobs waiting for feedback</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = pendingAgreements.map(agreement => {
                const otherPartyId = currentUser.role === 'employer' ? agreement.workerId : agreement.employerId;
                const otherPartyName = currentUser.role === 'employer' ? agreement.workerName : agreement.employerName;
                const otherPartyRole = currentUser.role === 'employer' ? 'Worker' : 'Employer';
                
                return `
                    <div class="pending-item" data-agreement="${agreement.id}">
                        <div class="pending-header">
                            <div>
                                <h4>${agreement.jobTitle}</h4>
                                <p>${otherPartyRole}: <strong>${otherPartyName}</strong></p>
                                <p>Completed: ${new Date(agreement.endDate || agreement.updatedAt).toLocaleDateString()}</p>
                            </div>
                        </div>
                        
                        <div class="rating-section">
                            <label>Rate ${otherPartyRole}:</label>
                            <div class="rating-stars" data-rating="0">
                                <span class="rating-star" data-value="1">★</span>
                                <span class="rating-star" data-value="2">★</span>
                                <span class="rating-star" data-value="3">★</span>
                                <span class="rating-star" data-value="4">★</span>
                                <span class="rating-star" data-value="5">★</span>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label>Your Feedback:</label>
                            <textarea class="form-control feedback-comment" placeholder="Share your experience working with ${otherPartyName}..."></textarea>
                        </div>
                        
                        <div class="form-actions">
                            <button class="btn btn-primary" onclick="FeedbackSystem.submitUserFeedback('${agreement.id}')">
                                Submit Feedback
                            </button>
                            <button class="btn btn-ghost" onclick="FeedbackSystem.skipFeedback('${agreement.id}')">
                                Skip
                            </button>
                        </div>
                    </div>
                `;
            }).join('');
        } catch (error) {
            console.error('Error loading pending feedback:', error);
            container.innerHTML = '<div class="empty-state">Error loading pending feedback</div>';
        }
    }

    static submitUserFeedback(agreementId) {
        console.log('Submitting feedback for agreement:', agreementId);
        
        try {
            const agreementElement = document.querySelector(`[data-agreement="${agreementId}"]`);
            if (!agreementElement) {
                OpusUtils.showNotification('Feedback element not found', 'error');
                return;
            }

            const ratingElement = agreementElement.querySelector('.rating-stars');
            const commentElement = agreementElement.querySelector('.feedback-comment');
            
            if (!ratingElement || !commentElement) {
                OpusUtils.showNotification('Feedback form elements not found', 'error');
                return;
            }

            const rating = parseInt(ratingElement.getAttribute('data-rating')) || 0;
            const comment = commentElement.value;
            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            
            if (rating === 0) {
                OpusUtils.showNotification('Please provide a rating', 'error');
                return;
            }

            const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
            const agreementIndex = agreements.findIndex(a => a.id === agreementId);
            
            if (agreementIndex === -1) {
                OpusUtils.showNotification('Agreement not found', 'error');
                return;
            }

            // Initialize feedback object if it doesn't exist
            if (!agreements[agreementIndex].feedback) {
                agreements[agreementIndex].feedback = {
                    employerRated: false,
                    workerRated: false,
                    employerRating: 0,
                    workerRating: 0,
                    employerComment: '',
                    workerComment: '',
                    createdAt: new Date().toISOString()
                };
            }

            // Update based on user role
            if (currentUser.role === 'employer') {
                agreements[agreementIndex].feedback.employerRated = true;
                agreements[agreementIndex].feedback.employerRating = rating;
                agreements[agreementIndex].feedback.employerComment = comment;
            } else {
                agreements[agreementIndex].feedback.workerRated = true;
                agreements[agreementIndex].feedback.workerRating = rating;
                agreements[agreementIndex].feedback.workerComment = comment;
            }

            // Save to storage
            localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
            
            // Create user feedback record
            this.createUserFeedbackRecord(agreements[agreementIndex], currentUser, rating, comment);
            
            OpusUtils.showNotification('Feedback submitted successfully!', 'success');
            this.loadPendingFeedback();
        } catch (error) {
            console.error('Error submitting user feedback:', error);
            OpusUtils.showNotification('Error submitting feedback', 'error');
        }
    }

    static createUserFeedbackRecord(agreement, user, rating, comment) {
        try {
            const feedbacks = JSON.parse(localStorage.getItem('opuslink_feedbacks') || '[]');
            const receiverId = user.role === 'employer' ? agreement.workerId : agreement.employerId;
            const receiverName = user.role === 'employer' ? agreement.workerName : agreement.employerName;
            
            const feedback = {
                id: 'feedback_' + Date.now(),
                type: 'user_feedback',
                agreementId: agreement.id,
                jobTitle: agreement.jobTitle,
                giverId: user.id,
                giverName: user.fullName || user.companyName,
                giverRole: user.role,
                receiverId: receiverId,
                receiverName: receiverName,
                receiverRole: user.role === 'employer' ? 'worker' : 'employer',
                rating: rating,
                comment: comment,
                createdAt: new Date().toISOString(),
                status: 'active'
            };
            
            feedbacks.push(feedback);
            localStorage.setItem('opuslink_feedbacks', JSON.stringify(feedbacks));
            
            // Create notification for the receiver
            if (typeof NotificationSystem !== 'undefined') {
                NotificationSystem.createNotification(receiverId, 'feedback_received', {
                    giverName: user.fullName || user.companyName,
                    jobTitle: agreement.jobTitle,
                    rating: rating
                });
            }
        } catch (error) {
            console.error('Error creating feedback record:', error);
        }
    }

    // PLATFORM FEEDBACK
    static submitPlatformFeedback() {
        try {
            const platformRating = document.getElementById('platformRating');
            if (!platformRating) {
                OpusUtils.showNotification('Platform feedback form not found', 'error');
                return;
            }

            const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
            const feedbackType = document.getElementById('platformFeedbackType').value;
            const rating = parseInt(platformRating.getAttribute('data-rating')) || 0;
            const likes = document.getElementById('platformLikes').value;
            const improvements = document.getElementById('platformImprovements').value;
            const recommend = document.querySelector('input[name="recommend"]:checked')?.value;
            const comments = document.getElementById('platformComments').value;
            
            if (!feedbackType || rating === 0 || !improvements || !recommend) {
                OpusUtils.showNotification('Please fill all required fields', 'error');
                return;
            }

            const platformFeedbacks = JSON.parse(localStorage.getItem('opuslink_platform_feedbacks') || '[]');
            
            const feedback = {
                id: 'platform_feedback_' + Date.now(),
                type: 'platform_feedback',
                feedbackType: feedbackType,
                userId: currentUser.id,
                userName: currentUser.fullName || currentUser.companyName,
                userRole: currentUser.role,
                rating: rating,
                likes: likes,
                improvements: improvements,
                recommend: recommend,
                comments: comments,
                createdAt: new Date().toISOString(),
                status: 'new'
            };

            platformFeedbacks.push(feedback);
            localStorage.setItem('opuslink_platform_feedbacks', JSON.stringify(platformFeedbacks));

            OpusUtils.showNotification('Thank you for your feedback! We appreciate your input.', 'success');
            this.clearPlatformForm();
            this.loadPlatformFeedbackStats();
        } catch (error) {
            console.error('Error submitting platform feedback:', error);
            OpusUtils.showNotification('Error submitting feedback', 'error');
        }
    }

    static clearPlatformForm() {
        const form = document.getElementById('platformFeedbackForm');
        const platformRating = document.getElementById('platformRating');
        
        if (form) form.reset();
        if (platformRating) {
            platformRating.setAttribute('data-rating', '0');
            document.querySelectorAll('#platformRating .rating-star').forEach(star => {
                star.classList.remove('active');
                star.style.color = '#666';
            });
        }
    }

    static loadPlatformFeedbackStats() {
        // Add stats to platform feedback section if needed
        console.log('Loading platform feedback stats...');
    }

    // GIVEN FEEDBACK HISTORY
    static loadGivenFeedback() {
        const container = document.getElementById('givenFeedbackList');
        if (!container) {
            console.log('❌ givenFeedbackList container not found');
            return;
        }

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const userFeedbacks = JSON.parse(localStorage.getItem('opuslink_feedbacks') || '[]');
        const platformFeedbacks = JSON.parse(localStorage.getItem('opuslink_platform_feedbacks') || '[]');
        
        const givenUserFeedbacks = userFeedbacks.filter(fb => fb.giverId === currentUser.id);
        const givenPlatformFeedbacks = platformFeedbacks.filter(fb => fb.userId === currentUser.id);

        if (givenUserFeedbacks.length === 0 && givenPlatformFeedbacks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h3>No feedback given yet</h3>
                    <p>Your feedback history will appear here</p>
                </div>
            `;
            return;
        }

        let html = '';

        // Platform feedback given
        if (givenPlatformFeedbacks.length > 0) {
            html += `<h4>Platform Feedback (${givenPlatformFeedbacks.length})</h4>`;
            html += givenPlatformFeedbacks.map(feedback => {
                const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
                const recommendText = feedback.recommend === 'yes' ? 'Yes' : feedback.recommend === 'maybe' ? 'Maybe' : 'No';
                
                return `
                    <div class="feedback-item platform-feedback">
                        <div class="feedback-header">
                            <div>
                                <h4>Platform Feedback - ${this.formatPlatformType(feedback.feedbackType)}</h4>
                                <p>Submitted: ${new Date(feedback.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div class="rating">${stars}</div>
                        </div>
                        <p><strong>What we can improve:</strong> ${feedback.improvements}</p>
                        ${feedback.likes ? `<p><strong>What you like:</strong> ${feedback.likes}</p>` : ''}
                        <p><strong>Would recommend:</strong> ${recommendText}</p>
                        ${feedback.comments ? `<p><strong>Additional comments:</strong> ${feedback.comments}</p>` : ''}
                    </div>
                `;
            }).join('');
        }

        // User feedback given
        if (givenUserFeedbacks.length > 0) {
            html += `<h4 style="margin-top: 20px;">User Feedback (${givenUserFeedbacks.length})</h4>`;
            html += givenUserFeedbacks.map(feedback => {
                const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
                
                return `
                    <div class="feedback-item user-feedback">
                        <div class="feedback-header">
                            <div>
                                <h4>${feedback.jobTitle}</h4>
                                <p>To: <strong>${feedback.receiverName}</strong> (${feedback.receiverRole})</p>
                            </div>
                            <div class="rating">${stars}</div>
                        </div>
                        <p>${feedback.comment}</p>
                        <div class="feedback-meta">
                            <small>Given on ${new Date(feedback.createdAt).toLocaleDateString()}</small>
                        </div>
                    </div>
                `;
            }).join('');
        }

        container.innerHTML = html;
    }

    static formatPlatformType(type) {
        const types = {
            'general': 'General Feedback',
            'feature_request': 'Feature Request',
            'bug_report': 'Bug Report',
            'ui_ux': 'UI/UX Suggestion',
            'payment_issue': 'Payment System',
            'customer_service': 'Customer Service',
            'other': 'Other'
        };
        return types[type] || type;
    }

    // RECEIVED FEEDBACK
    static loadReceivedFeedback() {
        const container = document.getElementById('receivedFeedbackList');
        if (!container) {
            console.log('❌ receivedFeedbackList container not found');
            return;
        }

        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        const feedbacks = JSON.parse(localStorage.getItem('opuslink_feedbacks') || '[]');
        
        const receivedFeedbacks = feedbacks.filter(fb => fb.receiverId === currentUser.id);

        if (receivedFeedbacks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">⭐</div>
                    <h3>No feedback received yet</h3>
                    <p>Feedback from other users will appear here</p>
                </div>
            `;
            return;
        }

        // Calculate average rating
        const avgRating = receivedFeedbacks.length > 0 
            ? (receivedFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) / receivedFeedbacks.length).toFixed(1)
            : 0;

        container.innerHTML = `
            <div class="rating-summary">
                <h3>Your Average Rating: ${avgRating}/5</h3>
                <p>Based on ${receivedFeedbacks.length} review${receivedFeedbacks.length !== 1 ? 's' : ''}</p>
            </div>
            ${receivedFeedbacks.map(feedback => {
                const stars = '★'.repeat(feedback.rating) + '☆'.repeat(5 - feedback.rating);
                
                return `
                    <div class="feedback-item">
                        <div class="feedback-header">
                            <div>
                                <h4>${feedback.jobTitle}</h4>
                                <p>From: <strong>${feedback.giverName}</strong> (${feedback.giverRole})</p>
                            </div>
                            <div class="rating">${stars}</div>
                        </div>
                        <p>${feedback.comment}</p>
                        <div class="feedback-meta">
                            <small>Received on ${new Date(feedback.createdAt).toLocaleDateString()}</small>
                        </div>
                    </div>
                `;
            }).join('')}
        `;
    }

    // REPORT METHODS
    static submitReport() {
        console.log('Report submission called');
        OpusUtils.showNotification('Report submitted successfully!', 'success');
    }

    static loadMyReports() {
        console.log('Loading reports...');
        const container = document.getElementById('myReportsList');
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3>No reports yet</h3>
                    <p>Your reports will appear here</p>
                </div>
            `;
        }
    }

    static loadReportForm() {
        console.log('Loading report form...');
    }

    static skipFeedback(agreementId) {
        console.log(`Skipping feedback for agreement: ${agreementId}`);
        OpusUtils.showNotification('Feedback skipped', 'info');
        this.loadPendingFeedback();
    }
}

// Initialize when dashboard loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on a dashboard page with feedback section
    if (document.getElementById('feedback')) {
        console.log('🚀 Initializing FeedbackSystem...');
        FeedbackSystem.init();
    }
});

window.FeedbackSystem = FeedbackSystem;