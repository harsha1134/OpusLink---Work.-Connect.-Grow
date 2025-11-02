class PaymentProcessor {
    constructor() {
        this.paymentData = null;
        this.selectedMethod = 'escrow';
        this.initializeEventListeners();
        this.loadPaymentData();
    }

    initializeEventListeners() {
        // Payment method selection
        document.querySelectorAll('.method-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectPaymentMethod(e.currentTarget.dataset.method);
            });
        });

        // Process payment button
        document.getElementById('processPaymentBtn').addEventListener('click', () => {
            this.processPayment();
        });

        // Cancel payment button
        document.getElementById('cancelPaymentBtn').addEventListener('click', () => {
            this.cancelPayment();
        });

        // Success screen buttons
        document.getElementById('successContinueBtn').addEventListener('click', () => {
            this.returnToDashboard();
        });

        document.getElementById('successDetailsBtn').addEventListener('click', () => {
            this.viewPaymentDetails();
        });

        // Failure screen buttons
        document.getElementById('retryPaymentBtn').addEventListener('click', () => {
            this.retryPayment();
        });

        document.getElementById('failureCancelBtn').addEventListener('click', () => {
            this.returnToDashboard();
        });
    }

    loadPaymentData() {
        // Get payment data from URL parameters or sessionStorage
        const urlParams = new URLSearchParams(window.location.search);
        const paymentDataString = urlParams.get('data') || sessionStorage.getItem('pendingPayment');
        
        if (paymentDataString) {
            this.paymentData = JSON.parse(decodeURIComponent(paymentDataString));
            this.populatePaymentDetails();
        } else {
            this.showError('No payment data found. Please go back and try again.');
        }
    }

    populatePaymentDetails() {
        if (!this.paymentData) return;

        document.getElementById('paymentAmount').textContent = `₹${this.paymentData.amount}`;
        document.getElementById('processAmount').textContent = this.paymentData.amount;
        document.getElementById('workerName').textContent = this.paymentData.workerName;
        document.getElementById('jobTitle').textContent = this.paymentData.jobTitle;
        document.getElementById('workDescription').textContent = this.paymentData.description;
        document.getElementById('workUnits').textContent = this.paymentData.hours ? 
            `${this.paymentData.hours} hours` : `${this.paymentData.days} days`;
        document.getElementById('paymentType').textContent = this.paymentData.paymentType || 'Work Payment';
    }

    selectPaymentMethod(method) {
        this.selectedMethod = method;
        
        // Update UI
        document.querySelectorAll('.method-option').forEach(option => {
            option.classList.remove('selected');
        });
        document.querySelector(`[data-method="${method}"]`).classList.add('selected');
    }

    async processPayment() {
        if (!this.paymentData) return;

        // Show processing screen
        this.showScreen('processingScreen');
        
        // Update processing details
        document.getElementById('processingAmount').textContent = this.paymentData.amount;
        document.getElementById('processingMethod').textContent = this.getMethodDisplayName(this.selectedMethod);
        document.getElementById('processingWorker').textContent = this.paymentData.workerName;

        try {
            // Simulate API call to payment gateway
            const paymentResult = await this.simulatePaymentGateway();
            
            if (paymentResult.success) {
                this.showSuccessScreen(paymentResult);
            } else {
                this.showFailureScreen(paymentResult.error);
            }
        } catch (error) {
            this.showFailureScreen(error.message);
        }
    }

    async simulatePaymentGateway() {
        return new Promise((resolve, reject) => {
            // Simulate network delay
            setTimeout(() => {
                const scenarios = [
                    { 
                        success: true, 
                        transactionId: 'TXN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
                        message: 'Payment processed successfully via ' + this.getMethodDisplayName(this.selectedMethod),
                        fees: this.calculateProcessingFees(),
                        timestamp: new Date().toISOString()
                    },
                    { 
                        success: false, 
                        error: 'Insufficient funds in your account' 
                    },
                    { 
                        success: false, 
                        error: 'Network error. Please try again.' 
                    },
                    { 
                        success: false, 
                        error: 'Bank server is temporarily unavailable' 
                    }
                ];

                // 80% success rate
                const randomIndex = Math.random() < 0.8 ? 0 : Math.floor(Math.random() * (scenarios.length - 1)) + 1;
                const result = scenarios[randomIndex];

                if (result.success) {
                    resolve(result);
                } else {
                    reject(new Error(result.error));
                }
            }, 3000); // 3 second delay
        });
    }

    calculateProcessingFees() {
        const amount = this.paymentData.amount;
        let fees = 0;

        switch (this.selectedMethod) {
            case 'escrow':
                fees = Math.min(Math.max(amount * 0.02, 10), 50); // 2%, min ₹10, max ₹50
                break;
            case 'upi':
                fees = Math.min(Math.max(amount * 0.01, 5), 20); // 1%, min ₹5, max ₹20
                break;
            case 'bank':
                fees = Math.min(Math.max(amount * 0.015, 8), 30); // 1.5%, min ₹8, max ₹30
                break;
        }

        return Math.round(fees * 100) / 100;
    }

    showSuccessScreen(paymentResult) {
        this.showScreen('successScreen');
        
        // Populate success details
        document.getElementById('successTransactionId').textContent = paymentResult.transactionId;
        document.getElementById('successAmount').textContent = this.paymentData.amount;
        document.getElementById('successDateTime').textContent = new Date(paymentResult.timestamp).toLocaleString();
        document.getElementById('successFees').textContent = paymentResult.fees;
        document.getElementById('successNetAmount').textContent = (this.paymentData.amount - paymentResult.fees).toFixed(2);

        // Store payment result for dashboard
        this.storePaymentResult(paymentResult);
    }

    showFailureScreen(errorMessage) {
        this.showScreen('failureScreen');
        
        document.getElementById('failureMessage').textContent = 'Payment could not be processed';
        document.getElementById('errorDetails').textContent = errorMessage;
    }

    showScreen(screenId) {
        // Hide all screens
        document.querySelectorAll('[id$="Screen"]').forEach(screen => {
            screen.classList.add('hidden');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        targetScreen.classList.remove('hidden');
        targetScreen.classList.add('fade-in');
    }

    getMethodDisplayName(method) {
        const names = {
            'escrow': 'Escrow Payment',
            'upi': 'UPI Transfer',
            'bank': 'Bank Transfer'
        };
        return names[method] || method;
    }

    storePaymentResult(paymentResult) {
        const completePayment = {
            ...this.paymentData,
            transactionId: paymentResult.transactionId,
            processingFees: paymentResult.fees,
            netAmount: this.paymentData.amount - paymentResult.fees,
            paymentMethod: this.selectedMethod,
            status: 'completed',
            processedAt: paymentResult.timestamp
        };

        // Store in sessionStorage for dashboard to pick up
        sessionStorage.setItem('completedPayment', JSON.stringify(completePayment));
    }

    returnToDashboard() {
        // Close the payment page and return to dashboard
        if (window.opener) {
            window.opener.postMessage({
                type: 'paymentCompleted',
                data: JSON.parse(sessionStorage.getItem('completedPayment'))
            }, '*');
            window.close();
        } else {
            // Fallback: redirect to dashboard
            window.location.href = 'employer-dashboard.html';
        }
    }

    viewPaymentDetails() {
        const paymentData = JSON.parse(sessionStorage.getItem('completedPayment'));
        alert(`Payment Details:\nTransaction ID: ${paymentData.transactionId}\nAmount: ₹${paymentData.amount}\nMethod: ${this.getMethodDisplayName(paymentData.paymentMethod)}`);
    }

    retryPayment() {
        this.showScreen('paymentSelectionScreen');
    }

    cancelPayment() {
        if (confirm('Are you sure you want to cancel this payment?')) {
            this.returnToDashboard();
        }
    }

    showError(message) {
        alert('Error: ' + message);
        this.returnToDashboard();
    }
}

// Initialize payment processor when page loads
document.addEventListener('DOMContentLoaded', () => {
    new PaymentProcessor();
});