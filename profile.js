class ProfileManager {
    static calculateProfileCompletion(user) {
        let completion = 0;
        const fields = [
            'fullName', 'email', 'phone', 'jobCategory', 'experienceLevel',
            'workType', 'expectedSalary', 'skills', 'education', 'preferredLocation', 'bio'
        ];

        fields.forEach(field => {
            if (user[field] && user[field].toString().length > 0) {
                completion += 7; // ~7% per field
            }
        });

        // Bonus for verification
        if (user.isVerified) completion += 10;
        
        // Bonus for profile picture/documents
        if (user.documents && user.documents.length > 0) completion += 5;
        if (user.avatar) completion += 5;

        return Math.min(100, completion);
    }

    static updateProfileCompletion(userId) {
        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].profileCompletion = this.calculateProfileCompletion(users[userIndex]);
            localStorage.setItem('opuslink_users', JSON.stringify(users));
            
            // Update UI if on profile page
            this.updateProfileCompletionUI(users[userIndex].profileCompletion);
        }
    }

    static updateProfileCompletionUI(completion) {
        const completionElement = document.getElementById('profileCompletion');
        const progressBar = document.getElementById('profileProgressBar');
        const progressText = document.getElementById('profileProgressText');
        
        if (completionElement) {
            completionElement.textContent = `Profile Completion: ${completion}%`;
        }
        if (progressBar) {
            progressBar.style.width = `${completion}%`;
            progressBar.setAttribute('aria-valuenow', completion);
        }
        if (progressText) {
            progressText.textContent = `${completion}% Complete`;
        }
    }

    static uploadDocument(userId, documentType, fileName) {
        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            if (!users[userIndex].documents) {
                users[userIndex].documents = [];
            }
            
            const document = {
                id: 'doc_' + Date.now(),
                type: documentType,
                name: fileName,
                uploadedAt: new Date().toISOString(),
                status: 'pending'
            };
            
            users[userIndex].documents.push(document);
            localStorage.setItem('opuslink_users', JSON.stringify(users));
            
            // Update profile completion
            this.updateProfileCompletion(userId);
            
            // Simulate verification
            this.simulateDocumentVerification(userId, document.id);
            
            return { success: true, message: 'Document uploaded successfully' };
        }
        
        return { success: false, message: 'User not found' };
    }

    static simulateDocumentVerification(userId, documentId) {
        setTimeout(() => {
            const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const userIndex = users.findIndex(u => u.id === userId);
            
            if (userIndex !== -1 && users[userIndex].documents) {
                const docIndex = users[userIndex].documents.findIndex(d => d.id === documentId);
                if (docIndex !== -1) {
                    users[userIndex].documents[docIndex].status = 'verified';
                    localStorage.setItem('opuslink_users', JSON.stringify(users));
                    
                    // Create notification
                    NotificationSystem.createNotification(userId, 'document_verified', {
                        documentType: users[userIndex].documents[docIndex].type
                    });
                    
                    console.log('Document verified:', documentId);
                }
            }
        }, 5000);
    }

    static getProfileStrengthTips(user) {
        const tips = [];
        
        if (!user.fullName || user.fullName.length < 2) {
            tips.push('Add your full name');
        }
        
        if (!user.skills || user.skills.length === 0) {
            tips.push('Add your skills');
        }
        
        if (!user.jobCategory) {
            tips.push('Select your job category');
        }
        
        if (!user.preferredLocation) {
            tips.push('Add your preferred location');
        }
        
        if (!user.bio || user.bio.length < 50) {
            tips.push('Write a detailed bio (min. 50 characters)');
        }
        
        if (!user.isVerified) {
            tips.push('Complete document verification');
        }
        
        if (!user.documents || user.documents.length === 0) {
            tips.push('Upload verification documents');
        }
        
        return tips.slice(0, 5); // Return top 5 tips
    }

    static getDocuments(userId) {
        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const user = users.find(u => u.id === userId);
        return user?.documents || [];
    }

    static deleteDocument(userId, documentId) {
        const users = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1 && users[userIndex].documents) {
            users[userIndex].documents = users[userIndex].documents.filter(doc => doc.id !== documentId);
            localStorage.setItem('opuslink_users', JSON.stringify(users));
            
            // Update profile completion
            this.updateProfileCompletion(userId);
            
            return { success: true, message: 'Document deleted successfully' };
        }
        
        return { success: false, message: 'Document not found' };
    }
}