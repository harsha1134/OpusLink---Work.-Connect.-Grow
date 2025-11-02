class WorkTracking {
    static logWork(agreementId, hours, description, workerId) {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreementIndex = agreements.findIndex(a => a.id === agreementId);
        
        if (agreementIndex === -1) {
            return { success: false, message: 'Agreement not found' };
        }

        const workLog = {
            id: 'work_' + Date.now(),
            agreementId: agreementId,
            workerId: workerId,
            hours: hours,
            description: description,
            date: new Date().toISOString(),
            status: 'pending',
            approvedBy: null,
            approvedAt: null
        };

        if (!agreements[agreementIndex].workLogs) {
            agreements[agreementIndex].workLogs = [];
        }
        agreements[agreementIndex].workLogs.push(workLog);
        
        localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
        
        NotificationSystem.createNotification(agreements[agreementIndex].employerId, 'work_logged', {
            workerName: agreements[agreementIndex].workerName,
            hours: hours,
            description: description,
            agreementId: agreementId
        });

        return { success: true, message: 'Work logged successfully', workLog: workLog };
    }

    static approveWork(workLogId, employerId) {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        
        for (let agreement of agreements) {
            if (agreement.workLogs) {
                const workLogIndex = agreement.workLogs.findIndex(w => w.id === workLogId);
                if (workLogIndex !== -1) {
                    agreement.workLogs[workLogIndex].status = 'approved';
                    agreement.workLogs[workLogIndex].approvedBy = employerId;
                    agreement.workLogs[workLogIndex].approvedAt = new Date().toISOString();
                    
                    localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
                    
                    NotificationSystem.createNotification(agreement.workerId, 'work_approved', {
                        hours: agreement.workLogs[workLogIndex].hours,
                        agreementId: agreement.id,
                        jobTitle: agreement.jobTitle
                    });

                    this.processPaymentForWork(agreement, agreement.workLogs[workLogIndex]);
                    
                    return { success: true, message: 'Work approved successfully' };
                }
            }
        }
        
        return { success: false, message: 'Work log not found' };
    }

    static processPaymentForWork(agreement, workLog) {
        const hourlyRate = agreement.terms.salary / 160;
        const amount = workLog.hours * hourlyRate;
        
        PaymentSystem.simulatePayment(agreement.id, amount.toFixed(2));
    }

    static getWorkLogs(agreementId) {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const agreement = agreements.find(a => a.id === agreementId);
        return agreement?.workLogs || [];
    }

    static getPendingApprovals(employerId) {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const employerAgreements = agreements.filter(a => a.employerId === employerId);
        
        let pendingWork = [];
        employerAgreements.forEach(agreement => {
            if (agreement.workLogs) {
                const pendingLogs = agreement.workLogs.filter(log => log.status === 'pending');
                pendingWork.push(...pendingLogs.map(log => ({
                    ...log,
                    agreement: agreement
                })));
            }
        });
        
        return pendingWork;
    }

    static getWorkerWorkLogs(workerId) {
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const workerAgreements = agreements.filter(a => a.workerId === workerId);
        
        let allWorkLogs = [];
        workerAgreements.forEach(agreement => {
            if (agreement.workLogs) {
                allWorkLogs.push(...agreement.workLogs.map(log => ({
                    ...log,
                    agreement: agreement
                })));
            }
        });
        
        return allWorkLogs.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
}