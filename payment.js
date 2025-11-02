// Complete Payment Simulation System for Indian Market
class PaymentSystem {
    static currentEmployer = null;
    static currentPayment = null;
    static paymentStep = 1;

    static init() {
        console.log('💰 Payment System initializing...');
        
        this.currentEmployer = JSON.parse(sessionStorage.getItem('currentUser'));
        this.setupEventListeners();
        this.loadPaymentData();
        
        return true;
    }

    static setupEventListeners() {
        // Payment tabs
        document.querySelectorAll('.payment-tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = e.target.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Payment history filter
        const historyFilter = document.getElementById('paymentHistoryFilter');
        if (historyFilter) {
            historyFilter.addEventListener('change', () => this.loadPaymentHistory());
        }
    }

    static switchTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // Remove active class from all tabs
        document.querySelectorAll('.payment-tabs .tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Show selected tab
        const selectedTab = document.getElementById(tabId);
        const selectedBtn = document.querySelector(`[data-tab="${tabId}"]`);

        if (selectedTab) selectedTab.classList.add('active');
        if (selectedBtn) selectedBtn.classList.add('active');

        // Load tab data
        switch(tabId) {
            case 'pending-payments':
                this.loadPendingPayments();
                break;
            case 'payment-history':
                this.loadPaymentHistory();
                break;
            case 'payment-methods':
                this.loadPaymentMethods();
                break;
        }
    }

    static loadPaymentData() {
        this.loadPendingPayments();
        this.loadPaymentHistory();
        this.updatePaymentStats();
    }

    static loadPendingPayments() {
        const employer = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!employer) return;

        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        const employerAgreements = agreements.filter(agreement => 
            agreement.employerId === employer.id && agreement.status === 'active'
        );

        let pendingPayments = [];

        employerAgreements.forEach(agreement => {
            if (agreement.workLogs) {
                agreement.workLogs.forEach(workLog => {
                    if (workLog.status === 'approved' && !workLog.paid) {
                        const amount = this.calculateWorkAmount(workLog, agreement.paymentTerms);
                        pendingPayments.push({
                            id: workLog.id,
                            agreementId: agreement.id,
                            workerId: workLog.workerId,
                            workerName: workLog.workerName,
                            jobTitle: agreement.jobTitle,
                            amount: amount,
                            workDescription: workLog.description,
                            workDate: workLog.date,
                            workUnits: workLog.hours || workLog.days,
                            paymentType: workLog.paymentType || agreement.paymentTerms.type,
                            hourlyRate: agreement.paymentTerms.hourlyRate
                        });
                    }
                });
            }
        });

        this.displayPendingPayments(pendingPayments);
    }

    static calculateWorkAmount(workLog, paymentTerms) {
        let rate = 0;
        
        if (paymentTerms.hourlyRate) {
            rate = paymentTerms.hourlyRate;
        } else {
            rate = parseFloat(paymentTerms.amount?.replace(/[^\d.]/g, '')) || 0;
        }
        
        switch (paymentTerms.type) {
            case 'hourly':
                return Math.round(workLog.hours * rate);
            case 'monthly':
                return Math.round((workLog.days / 26) * rate); // Assuming 26 working days
            case 'fixed':
                return Math.round((workLog.days / 30) * rate); // Prorated for days worked
            case 'milestone':
                return rate; // Full milestone amount
            default:
                return rate;
        }
    }

    static displayPendingPayments(payments) {
        const container = document.getElementById('pendingPaymentsList');
        if (!container) return;

        if (payments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">💰</div>
                    <h3>No pending payments</h3>
                    <p>All approved work has been paid</p>
                </div>
            `;
            return;
        }

        container.innerHTML = payments.map(payment => `
            <div class="payment-card">
                <div class="payment-header">
                    <div class="payment-worker-info">
                        <div class="payment-worker-name">${payment.workerName}</div>
                        <div class="payment-job-title">${payment.jobTitle}</div>
                    </div>
                    <div class="payment-amount">₹${payment.amount.toLocaleString()}</div>
                </div>
                
                <div class="payment-details">
                    <div class="payment-detail-item">
                        <div class="payment-detail-label">Work Date</div>
                        <div class="payment-detail-value">${new Date(payment.workDate).toLocaleDateString()}</div>
                    </div>
                    <div class="payment-detail-item">
                        <div class="payment-detail-label">Work Units</div>
                        <div class="payment-detail-value">${payment.workUnits} ${payment.paymentType === 'hourly' ? 'hours' : 'days'}</div>
                    </div>
                    <div class="payment-detail-item">
                        <div class="payment-detail-label">Hourly Rate</div>
                        <div class="payment-detail-value">₹${payment.hourlyRate}/hour</div>
                    </div>
                    <div class="payment-detail-item">
                        <div class="payment-detail-label">Payment Type</div>
                        <div class="payment-detail-value">${this.formatPaymentType(payment.paymentType)}</div>
                    </div>
                </div>
                
                <div class="payment-description">
                    <strong>Work Description:</strong> ${payment.workDescription}
                </div>
                
                <div class="payment-actions">
                    <button class="btn btn-success" onclick="PaymentSystem.processPayment('${payment.id}')">
                        💰 Pay Now
                    </button>
                    <button class="btn btn-ghost" onclick="PaymentSystem.viewWorkDetails('${payment.id}')">
                        👁️ View Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    static processPayment(paymentId) {
        const employer = JSON.parse(sessionStorage.getItem('currentUser'));
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        
        let paymentData = null;
        
        // Find the payment data
        agreements.forEach(agreement => {
            if (agreement.workLogs) {
                agreement.workLogs.forEach(workLog => {
                    if (workLog.id === paymentId) {
                        const amount = this.calculateWorkAmount(workLog, agreement.paymentTerms);
                        paymentData = {
                            id: paymentId,
                            agreementId: agreement.id,
                            workerId: workLog.workerId,
                            workerName: workLog.workerName,
                            jobTitle: agreement.jobTitle,
                            amount: amount,
                            workDescription: workLog.description,
                            workUnits: workLog.hours || workLog.days,
                            paymentType: workLog.paymentType || agreement.paymentTerms.type,
                            hourlyRate: agreement.paymentTerms.hourlyRate
                        };
                    }
                });
            }
        });

        if (!paymentData) {
            OpusUtils.showNotification('Payment data not found', 'error');
            return;
        }

        this.currentPayment = paymentData;
        this.paymentStep = 1;
        this.showPaymentOptions();
    }

    static showPaymentOptions() {
        const modal = document.getElementById('paymentModal');
        const modalContent = document.getElementById('paymentModalContent');
        
        if (!modal || !modalContent) return;

        modalContent.innerHTML = `
            <div class="payment-options">
                <div class="payment-progress">
                    <div class="progress-step active">1</div>
                    <div class="progress-line"></div>
                    <div class="progress-step">2</div>
                    <div class="progress-line"></div>
                    <div class="progress-step">3</div>
                </div>
                
                <h4 style="color: #fff; margin-bottom: 16px; text-align: center;">Choose Payment Method</h4>
                
                <div class="payment-method-options">
                    <div class="payment-option-card" onclick="PaymentSystem.selectUPI()">
                        <div class="payment-option-icon">🏦</div>
                        <div class="payment-option-info">
                            <h5>UPI Payment</h5>
                            <p>Instant transfer using UPI ID</p>
                            <small>Recommended - Instant settlement</small>
                        </div>
                        <div class="payment-option-arrow">→</div>
                    </div>
                    
                    <div class="payment-option-card" onclick="PaymentSystem.selectBankTransfer()">
                        <div class="payment-option-icon">💳</div>
                        <div class="payment-option-info">
                            <h5>Bank Transfer</h5>
                            <p>Direct bank account transfer</p>
                            <small>1-2 business days</small>
                        </div>
                        <div class="payment-option-arrow">→</div>
                    </div>
                    
                    <div class="payment-option-card" onclick="PaymentSystem.selectWallet()">
                        <div class="payment-option-icon">📱</div>
                        <div class="payment-option-info">
                            <h5>Digital Wallet</h5>
                            <p>Paytm, PhonePe, Google Pay</p>
                            <small>Instant transfer</small>
                        </div>
                        <div class="payment-option-arrow">→</div>
                    </div>
                </div>
                
                <div class="payment-summary">
                    <h5 style="color: #fff; margin-bottom: 12px;">Payment Summary</h5>
                    <div class="summary-item">
                        <span>Worker:</span>
                        <span>${this.currentPayment.workerName}</span>
                    </div>
                    <div class="summary-item">
                        <span>Job:</span>
                        <span>${this.currentPayment.jobTitle}</span>
                    </div>
                    <div class="summary-item">
                        <span>Work Units:</span>
                        <span>${this.currentPayment.workUnits} ${this.currentPayment.paymentType === 'hourly' ? 'hours' : 'days'}</span>
                    </div>
                    <div class="summary-item">
                        <span>Rate:</span>
                        <span>₹${this.currentPayment.hourlyRate}/hour</span>
                    </div>
                    <div class="summary-item total">
                        <span>Total Amount:</span>
                        <span>₹${this.currentPayment.amount.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'flex';
    }

    static selectUPI() {
        this.closePaymentModal();
        this.showUPIPayment();
    }

    static selectBankTransfer() {
        this.closePaymentModal();
        this.showBankTransfer();
    }

    static selectWallet() {
        this.closePaymentModal();
        this.showWalletPayment();
    }

    static showUPIPayment() {
        const modal = document.getElementById('upiPaymentModal');
        const upiAmount = document.getElementById('upiAmount');
        
        if (!modal || !upiAmount) return;

        upiAmount.textContent = `₹${this.currentPayment.amount.toLocaleString()}`;
        modal.style.display = 'flex';
        this.paymentStep = 2;
    }

    static showBankTransfer() {
        const modal = document.getElementById('bankTransferModal');
        if (modal) {
            modal.style.display = 'flex';
            this.paymentStep = 2;
        }
    }

    static showWalletPayment() {
        const modal = document.getElementById('walletPaymentModal');
        if (modal) {
            modal.style.display = 'flex';
            this.paymentStep = 2;
        }
    }

    static simulateUpiPayment() {
        this.showUPIProcessing();
    }

    static simulateUpiFailure() {
        this.closeUpiModal();
        OpusUtils.showNotification('UPI payment failed. Please try again.', 'error');
    }

    static showUPIProcessing() {
        const modal = document.getElementById('upiPaymentModal');
        const modalBody = modal?.querySelector('.modal-body');
        
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="payment-processing">
                <div class="processing-animation">
                    <div class="spinner"></div>
                </div>
                <h4 style="text-align: center; color: #fff; margin-bottom: 16px;">Processing UPI Payment</h4>
                <p style="text-align: center; color: var(--muted); margin-bottom: 20px;">
                    Please wait while we process your payment...
                </p>
                <div class="payment-details-processing">
                    <div class="detail-item">
                        <span>Amount:</span>
                        <span>₹${this.currentPayment.amount.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span>To:</span>
                        <span>${this.currentPayment.workerName}</span>
                    </div>
                    <div class="detail-item">
                        <span>UPI ID:</span>
                        <span>worker${this.currentPayment.workerId.substring(0, 8)}@okopuslink</span>
                    </div>
                </div>
            </div>
        `;

        // Simulate payment processing
        setTimeout(() => {
            this.processPaymentCompletion('upi');
        }, 3000);
    }

    static simulateBankTransfer() {
        this.showBankProcessing();
    }

    static showBankProcessing() {
        const modal = document.getElementById('bankTransferModal');
        const modalBody = modal?.querySelector('.modal-body');
        
        if (!modalBody) return;

        modalBody.innerHTML = `
            <div class="payment-processing">
                <div class="processing-animation">
                    <div class="spinner"></div>
                </div>
                <h4 style="text-align: center; color: #fff; margin-bottom: 16px;">Processing Bank Transfer</h4>
                <p style="text-align: center; color: var(--muted); margin-bottom: 20px;">
                    Initiating bank transfer. This may take 1-2 business days...
                </p>
                <div class="payment-details-processing">
                    <div class="detail-item">
                        <span>Amount:</span>
                        <span>₹${this.currentPayment.amount.toLocaleString()}</span>
                    </div>
                    <div class="detail-item">
                        <span>To:</span>
                        <span>${this.currentPayment.workerName}</span>
                    </div>
                    <div class="detail-item">
                        <span>Account:</span>
                        <span>XXXXXXX${this.currentPayment.workerId.substring(this.currentPayment.workerId.length - 4)}</span>
                    </div>
                </div>
            </div>
        `;

        // Simulate bank transfer processing
        setTimeout(() => {
            this.processPaymentCompletion('bank_transfer');
        }, 4000);
    }

    static processPaymentCompletion(method) {
        const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
        
        // Update work log as paid
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        let paymentProcessed = false;

        agreements.forEach(agreement => {
            if (agreement.workLogs) {
                agreement.workLogs.forEach(workLog => {
                    if (workLog.id === this.currentPayment.id) {
                        workLog.paid = true;
                        workLog.paymentDate = new Date().toISOString();
                        workLog.paymentMethod = method;
                        workLog.transactionId = transactionId;
                        paymentProcessed = true;
                    }
                });
            }
        });

        if (paymentProcessed) {
            localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
            
            // Record payment in payment history
            this.recordPayment({
                id: 'pay_' + Date.now(),
                agreementId: this.currentPayment.agreementId,
                workerId: this.currentPayment.workerId,
                workerName: this.currentPayment.workerName,
                employerId: this.currentEmployer.id,
                employerName: this.currentEmployer.companyName || this.currentEmployer.fullName,
                jobTitle: this.currentPayment.jobTitle,
                amount: this.currentPayment.amount,
                paymentDate: new Date().toISOString(),
                paymentMethod: method,
                transactionId: transactionId,
                status: 'completed',
                workUnits: this.currentPayment.workUnits,
                hourlyRate: this.currentPayment.hourlyRate
            });

            this.closeAllModals();
            this.showPaymentSuccess(transactionId);
            this.loadPaymentData();
            
            // Create notification for worker
            NotificationSystem.createNotification(this.currentPayment.workerId, 'payment_processed', {
                amount: this.currentPayment.amount,
                employerName: this.currentEmployer.companyName || this.currentEmployer.fullName,
                jobTitle: this.currentPayment.jobTitle,
                transactionId: transactionId,
                method: this.formatPaymentMethod(method)
            });

            OpusUtils.showNotification(`Payment of ₹${this.currentPayment.amount.toLocaleString()} completed successfully!`, 'success');
        }
    }

    static recordPayment(paymentData) {
        const payments = JSON.parse(localStorage.getItem('opuslink_payments') || '[]');
        payments.push(paymentData);
        localStorage.setItem('opuslink_payments', JSON.stringify(payments));
    }

    static showPaymentSuccess(transactionId) {
        const modal = document.getElementById('paymentSuccessModal');
        const successAmount = document.getElementById('successAmount');
        const successWorker = document.getElementById('successWorker');
        const successTransactionId = document.getElementById('successTransactionId');
        
        if (!modal) return;

        if (successAmount) successAmount.textContent = `₹${this.currentPayment.amount.toLocaleString()}`;
        if (successWorker) successWorker.textContent = this.currentPayment.workerName;
        if (successTransactionId) successTransactionId.textContent = transactionId;

        modal.style.display = 'flex';
        this.paymentStep = 3;
    }

    static loadPaymentHistory() {
        const employer = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!employer) return;

        const payments = JSON.parse(localStorage.getItem('opuslink_payments') || '[]');
        const employerPayments = payments.filter(payment => payment.employerId === employer.id);
        
        const filter = document.getElementById('paymentHistoryFilter')?.value || 'all';
        let filteredPayments = employerPayments;

        // Apply time filter
        if (filter !== 'all') {
            const now = new Date();
            let startDate = new Date();

            switch (filter) {
                case 'last-week':
                    startDate.setDate(now.getDate() - 7);
                    break;
                case 'last-month':
                    startDate.setMonth(now.getMonth() - 1);
                    break;
                case 'last-3-months':
                    startDate.setMonth(now.getMonth() - 3);
                    break;
            }

            filteredPayments = employerPayments.filter(payment => 
                new Date(payment.paymentDate) >= startDate
            );
        }

        this.displayPaymentHistory(filteredPayments);
    }

    static displayPaymentHistory(payments) {
        const container = document.getElementById('paymentHistoryList');
        if (!container) return;

        if (payments.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <h3>No payment history</h3>
                    <p>Payment history will appear here after you make payments</p>
                </div>
            `;
            return;
        }

        // Sort by date (newest first)
        payments.sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate));

        container.innerHTML = payments.map(payment => `
            <div class="payment-card">
                <div class="payment-header">
                    <div class="payment-worker-info">
                        <div class="payment-worker-name">${payment.workerName}</div>
                        <div class="payment-job-title">${payment.jobTitle}</div>
                    </div>
                    <div class="payment-amount">₹${payment.amount.toLocaleString()}</div>
                </div>
                
                <div class="payment-details">
                    <div class="payment-detail-item">
                        <div class="payment-detail-label">Payment Date</div>
                        <div class="payment-detail-value">${new Date(payment.paymentDate).toLocaleDateString()}</div>
                    </div>
                    <div class="payment-detail-item">
                        <div class="payment-detail-label">Payment Method</div>
                        <div class="payment-detail-value">${this.formatPaymentMethod(payment.paymentMethod)}</div>
                    </div>
                    <div class="payment-detail-item">
                        <div class="payment-detail-label">Transaction ID</div>
                        <div class="payment-detail-value">${payment.transactionId}</div>
                    </div>
                    <div class="payment-detail-item">
                        <div class="payment-detail-label">Work Units</div>
                        <div class="payment-detail-value">${payment.workUnits} hours @ ₹${payment.hourlyRate}/hour</div>
                    </div>
                </div>
                
                <div class="payment-status">
                    <span class="status-badge status-completed">✅ Paid</span>
                </div>
            </div>
        `).join('');
    }

    static updatePaymentStats() {
        const employer = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!employer) return;

        const payments = JSON.parse(localStorage.getItem('opuslink_payments') || '[]');
        const employerPayments = payments.filter(payment => payment.employerId === employer.id);
        
        // Calculate pending payments
        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        let pendingAmount = 0;

        agreements.forEach(agreement => {
            if (agreement.employerId === employer.id && agreement.workLogs) {
                agreement.workLogs.forEach(workLog => {
                    if (workLog.status === 'approved' && !workLog.paid) {
                        pendingAmount += this.calculateWorkAmount(workLog, agreement.paymentTerms);
                    }
                });
            }
        });

        // Calculate total paid
        const totalPaid = employerPayments.reduce((sum, payment) => sum + payment.amount, 0);
        
        // Calculate this month's payments
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const monthlyPaid = employerPayments
            .filter(payment => {
                const paymentDate = new Date(payment.paymentDate);
                return paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear;
            })
            .reduce((sum, payment) => sum + payment.amount, 0);

        // Update UI
        const pendingElement = document.getElementById('pendingPaymentsAmount');
        const totalElement = document.getElementById('totalPaidAmount');
        const monthlyElement = document.getElementById('monthlyPaidAmount');

        if (pendingElement) pendingElement.textContent = `₹${pendingAmount.toLocaleString()}`;
        if (totalElement) totalElement.textContent = `₹${totalPaid.toLocaleString()}`;
        if (monthlyElement) monthlyElement.textContent = `₹${monthlyPaid.toLocaleString()}`;
    }

    static formatPaymentType(type) {
        const types = {
            'hourly': 'Hourly',
            'monthly': 'Monthly',
            'fixed': 'Fixed Project',
            'milestone': 'Milestone'
        };
        return types[type] || type;
    }

    static formatPaymentMethod(method) {
        const methods = {
            'upi': 'UPI Payment',
            'bank_transfer': 'Bank Transfer',
            'wallet': 'Digital Wallet',
            'escrow': 'Escrow Wallet'
        };
        return methods[method] || method;
    }

    static closePaymentModal() {
        const modal = document.getElementById('paymentModal');
        if (modal) modal.style.display = 'none';
    }

    static closeUpiModal() {
        const modal = document.getElementById('upiPaymentModal');
        if (modal) modal.style.display = 'none';
    }

    static closeBankModal() {
        const modal = document.getElementById('bankTransferModal');
        if (modal) modal.style.display = 'none';
    }

    static closeWalletModal() {
        const modal = document.getElementById('walletPaymentModal');
        if (modal) modal.style.display = 'none';
    }

    static closeSuccessModal() {
        const modal = document.getElementById('paymentSuccessModal');
        if (modal) modal.style.display = 'none';
    }

    static closeAllModals() {
        this.closePaymentModal();
        this.closeUpiModal();
        this.closeBankModal();
        this.closeWalletModal();
    }

    static payAllPending() {
        const employer = JSON.parse(sessionStorage.getItem('currentUser'));
        if (!employer) return;

        const agreements = JSON.parse(localStorage.getItem('opuslink_agreements') || '[]');
        let totalAmount = 0;
        let pendingCount = 0;

        agreements.forEach(agreement => {
            if (agreement.employerId === employer.id && agreement.workLogs) {
                agreement.workLogs.forEach(workLog => {
                    if (workLog.status === 'approved' && !workLog.paid) {
                        totalAmount += this.calculateWorkAmount(workLog, agreement.paymentTerms);
                        pendingCount++;
                    }
                });
            }
        });

        if (pendingCount === 0) {
            OpusUtils.showNotification('No pending payments to process', 'info');
            return;
        }

        if (confirm(`Process ${pendingCount} pending payments totaling ₹${totalAmount.toLocaleString()}?`)) {
            // Process all payments (simplified for demo)
            agreements.forEach(agreement => {
                if (agreement.employerId === employer.id && agreement.workLogs) {
                    agreement.workLogs.forEach(workLog => {
                        if (workLog.status === 'approved' && !workLog.paid) {
                            const amount = this.calculateWorkAmount(workLog, agreement.paymentTerms);
                            const transactionId = 'TXN' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
                            
                            workLog.paid = true;
                            workLog.paymentDate = new Date().toISOString();
                            workLog.paymentMethod = 'upi';
                            workLog.transactionId = transactionId;

                            // Record payment
                            this.recordPayment({
                                id: 'pay_' + Date.now(),
                                agreementId: agreement.id,
                                workerId: workLog.workerId,
                                workerName: workLog.workerName,
                                employerId: employer.id,
                                employerName: employer.companyName || employer.fullName,
                                jobTitle: agreement.jobTitle,
                                amount: amount,
                                paymentDate: new Date().toISOString(),
                                paymentMethod: 'upi',
                                transactionId: transactionId,
                                status: 'completed'
                            });

                            // Notify worker
                            NotificationSystem.createNotification(workLog.workerId, 'payment_processed', {
                                amount: amount,
                                employerName: employer.companyName || employer.fullName,
                                jobTitle: agreement.jobTitle,
                                transactionId: transactionId
                            });
                        }
                    });
                }
            });

            localStorage.setItem('opuslink_agreements', JSON.stringify(agreements));
            OpusUtils.showNotification(`Successfully processed ${pendingCount} payments totaling ₹${totalAmount.toLocaleString()}`, 'success');
            this.loadPaymentData();
        }
    }

    static viewWorkDetails(paymentId) {
        // Implementation for viewing work details
        OpusUtils.showNotification('Work details feature coming soon', 'info');
    }

    static loadPaymentMethods() {
        // Load payment methods (could be extended to fetch from API)
        console.log('Loading payment methods...');
    }

    static showAddPaymentMethod() {
        OpusUtils.showNotification('Add payment method feature coming soon', 'info');
    }
}

// Initialize payment system when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('payments')) {
        PaymentSystem.init();
    }
});