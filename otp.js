// OTP verification functionality
class OpusOTP {
    static initOTPInputs() {
        const inputs = document.querySelectorAll('.otp-inputs input');
        
        if (inputs.length === 0) return;

        // Auto move focus
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
                
                // Auto submit when all inputs are filled
                const allFilled = Array.from(inputs).every(input => input.value.length === 1);
                if (allFilled) {
                    const form = document.getElementById('otpForm');
                    if (form) {
                        setTimeout(() => form.dispatchEvent(new Event('submit')), 100);
                    }
                }
            });

            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && !input.value && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });

        // Handle paste
        const otpContainer = document.querySelector('.otp-inputs');
        if (otpContainer) {
            otpContainer.addEventListener('paste', (e) => {
                e.preventDefault();
                const pasteData = (e.clipboardData || window.clipboardData).getData('text');
                if (pasteData.length === inputs.length && /^\d+$/.test(pasteData)) {
                    inputs.forEach((input, i) => {
                        input.value = pasteData[i];
                    });
                    inputs[inputs.length - 1].focus();
                }
            });
        }
    }

    static generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    static verifyOTP(enteredOTP, storedOTP) {
        return enteredOTP === storedOTP;
    }

    static simulateOTPSend(email) {
        const otp = this.generateOTP();
        sessionStorage.setItem('verificationOTP', otp);
        sessionStorage.setItem('verificationEmail', email);
        
        // In a real app, this would be sent via email/SMS
        console.log(`OTP for ${email}: ${otp}`);
        OpusUtils.showNotification(`Verification code sent to ${email}`, 'success');
        
        return otp;
    }
}

// Initialize OTP functionality when page loads
document.addEventListener('DOMContentLoaded', function() {
    OpusOTP.initOTPInputs();
});