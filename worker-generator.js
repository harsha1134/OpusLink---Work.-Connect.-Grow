// OPTIMIZED ANDHRA PRADESH WORKER GENERATOR WITH LIMITS

class AndhraPradeshWorkerGenerator {
    static maxWorkers = 50; // Maximum workers to generate
    static currentCount = 0;

    static init() {
        console.log('🚀 Initializing Andhra Pradesh Worker Data Generator...');
        
        // Check current worker count first
        const existingUsers = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const existingWorkers = existingUsers.filter(user => user.role === 'worker');
        this.currentCount = existingWorkers.length;
        
        console.log(`📊 Current worker count: ${this.currentCount}/${this.maxWorkers}`);
        
        if (this.currentCount >= this.maxWorkers) {
            console.log('✅ Already have enough workers, skipping generation');
            return;
        }
        
        this.generateCompleteWorkerDataset();
    }

    static generateCompleteWorkerDataset() {
        console.log('🧹 Cleaning up existing worker data before generation...');
        
        // Clear existing worker data to prevent duplicates
        const existingUsers = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const nonWorkerUsers = existingUsers.filter(user => user.role !== 'worker');
        localStorage.setItem('opuslink_users', JSON.stringify(nonWorkerUsers));
        
        // Calculate how many more workers we need
        const workersNeeded = this.maxWorkers - this.currentCount;
        console.log(`🎯 Generating ${workersNeeded} new workers...`);
        
        // Continue with generation...
        this.generateWorkers(workersNeeded);
    }

    static generateWorkers(count = 30) {
        console.log(`👷 Generating ${count} workers...`);
        
        const workers = [];

        // TECH & IT WORKERS (Limited to 8)
        const techCount = Math.min(8, Math.floor(count * 0.15));
        if (techCount > 0) workers.push(...this.generateTechWorkers(techCount));
        
        // HEALTHCARE WORKERS (Limited to 8)
        const healthCount = Math.min(8, Math.floor(count * 0.15));
        if (healthCount > 0) workers.push(...this.generateHealthcareWorkers(healthCount));
        
        // MANUFACTURING & INDUSTRIAL WORKERS (Limited to 7)
        const manuCount = Math.min(7, Math.floor(count * 0.14));
        if (manuCount > 0) workers.push(...this.generateManufacturingWorkers(manuCount));
        
        // HOSPITALITY & SERVICE WORKERS (Limited to 6)
        const hospCount = Math.min(6, Math.floor(count * 0.12));
        if (hospCount > 0) workers.push(...this.generateHospitalityWorkers(hospCount));
        
        // SKILLED TRADES WORKERS (Limited to 7)
        const tradeCount = Math.min(7, Math.floor(count * 0.14));
        if (tradeCount > 0) workers.push(...this.generateSkilledTradesWorkers(tradeCount));
        
        // OFFICE & ADMIN WORKERS (Limited to 6)
        const officeCount = Math.min(6, Math.floor(count * 0.12));
        if (officeCount > 0) workers.push(...this.generateOfficeWorkers(officeCount));
        
        // RETAIL & SALES WORKERS (Limited to 4)
        const retailCount = Math.min(4, Math.floor(count * 0.08));
        if (retailCount > 0) workers.push(...this.generateRetailWorkers(retailCount));
        
        // DRIVERS & LOGISTICS WORKERS (Limited to 4)
        const logisticsCount = Math.min(4, Math.floor(count * 0.08));
        if (logisticsCount > 0) workers.push(...this.generateLogisticsWorkers(logisticsCount));

        console.log(`📊 Generated ${workers.length} workers across categories`);

        // Save to localStorage with size check
        this.saveWorkersSafely(workers);
        
        return workers;
    }

    static saveWorkersSafely(workers) {
        try {
            const existingUsers = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
            const updatedUsers = [...existingUsers, ...workers];
            
            // Check if we're approaching storage limit
            const dataSize = JSON.stringify(updatedUsers).length;
            const maxSize = 5 * 1024 * 1024; // 5MB limit
            
            if (dataSize > maxSize * 0.8) { // If over 80% of limit
                console.warn('⚠️ Approaching storage limit, reducing worker count');
                // Remove some workers to stay under limit
                const reducedWorkers = workers.slice(0, Math.floor(workers.length * 0.7));
                const safeUsers = [...existingUsers, ...reducedWorkers];
                localStorage.setItem('opuslink_users', JSON.stringify(safeUsers));
                console.log(`✅ Saved ${reducedWorkers.length} workers (reduced to avoid quota)`);
            } else {
                localStorage.setItem('opuslink_users', JSON.stringify(updatedUsers));
                console.log(`✅ Successfully stored ${workers.length} workers`);
            }
            
        } catch (error) {
            console.error('❌ Storage error:', error);
            // Last resort: store only essential data
            this.storeMinimalWorkerData(workers);
        }
    }

    static storeMinimalWorkerData(workers) {
        // Store only essential worker information
        const minimalWorkers = workers.map(worker => ({
            id: worker.id,
            fullName: worker.fullName,
            email: worker.email,
            role: 'worker',
            profession: worker.profession,
            skills: worker.skills.slice(0, 3), // Limit to 3 skills
            location: worker.location,
            isVerified: true,
            profileCompletion: 70
        }));
        
        const existingUsers = JSON.parse(localStorage.getItem('opuslink_users') || '[]');
        const nonWorkerUsers = existingUsers.filter(user => user.role !== 'worker');
        const updatedUsers = [...nonWorkerUsers, ...minimalWorkers];
        
        localStorage.setItem('opuslink_users', JSON.stringify(updatedUsers));
        console.log(`✅ Stored ${minimalWorkers.length} minimal worker profiles`);
    }
    

    // TECH & IT WORKERS (Updated with limits)
    static generateTechWorkers(count = 8) {
        const locations = ['Hyderabad, Telangana', 'Vijayawada, Krishna', 'Visakhapatnam City, Visakhapatnam', 'Guntur City, Guntur'];
        const techWorkers = [];
        
        for (let i = 1; i <= count; i++) {
            const location = locations[Math.floor(Math.random() * locations.length)];
            techWorkers.push({
                id: `worker_tech_${Date.now()}_${i}`,
                fullName: this.generateIndianName(),
                email: `tech.worker${i}@gmail.com`,
                password: 'password123',
                role: 'worker',
                profession: 'Information Technology',
                skills: this.getRandomTechSkills(),
                experience: `${1 + Math.floor(Math.random() * 8)} years`,
                education: ['B.Tech Computer Science', 'B.Sc IT', 'MCA', 'Diploma in Computer Engineering'][Math.floor(Math.random() * 4)],
                location: location,
                phone: this.generatePhoneNumber(),
                description: `Skilled IT professional from ${location} with experience in software development.`,
                expectedSalary: ['₹35,000/month', '₹45,000/month', '₹60,000/month', '₹25,000/month'][Math.floor(Math.random() * 4)],
                isAvailable: Math.random() > 0.3,
                isVerified: true,
                verificationStatus: 'verified',
                profileCompletion: Math.floor(Math.random() * 30) + 70,
                createdAt: new Date().toISOString()
            });
        }
        return techWorkers;
    }

    // HEALTHCARE WORKERS (Updated with limits)
    static generateHealthcareWorkers(count = 8) {
        const healthcareWorkers = [];
        const professions = ['Staff Nurse', 'Medical Lab Technician', 'Pharmacist', 'Hospital Attendant', 'Physiotherapist'];
        
        for (let i = 1; i <= count; i++) {
            const profession = professions[Math.floor(Math.random() * professions.length)];
            healthcareWorkers.push({
                id: `worker_health_${Date.now()}_${i}`,
                fullName: this.generateIndianName(),
                email: `health.worker${i}@gmail.com`,
                password: 'password123',
                role: 'worker',
                profession: profession,
                skills: this.getHealthcareSkills(profession),
                experience: `${1 + Math.floor(Math.random() * 10)} years`,
                education: this.getHealthcareEducation(profession),
                location: this.getAPLocation(),
                phone: this.generatePhoneNumber(),
                description: `Qualified ${profession.toLowerCase()} with healthcare experience.`,
                expectedSalary: ['₹25,000/month', '₹35,000/month', '₹18,000/month', '₹30,000/month'][Math.floor(Math.random() * 4)],
                isAvailable: Math.random() > 0.2,
                isVerified: true,
                verificationStatus: 'verified',
                profileCompletion: Math.floor(Math.random() * 30) + 70,
                createdAt: new Date().toISOString()
            });
        }
        return healthcareWorkers;
    }

    // MANUFACTURING & INDUSTRIAL WORKERS (Updated with limits)
    static generateManufacturingWorkers(count = 7) {
        const manufacturingWorkers = [];
        const roles = ['Machine Operator', 'Production Worker', 'Quality Inspector', 'Assembly Line Worker', 'Factory Supervisor'];
        
        for (let i = 1; i <= count; i++) {
            const role = roles[Math.floor(Math.random() * roles.length)];
            manufacturingWorkers.push({
                id: `worker_manu_${Date.now()}_${i}`,
                fullName: this.generateIndianName(),
                email: `factory.worker${i}@gmail.com`,
                password: 'password123',
                role: 'worker',
                profession: 'Manufacturing',
                skills: this.getManufacturingSkills(role),
                experience: `${1 + Math.floor(Math.random() * 12)} years`,
                education: ['ITI Certificate', 'Diploma in Mechanical', 'High School', 'Industrial Training'][Math.floor(Math.random() * 4)],
                location: this.getAPLocation(),
                phone: this.generatePhoneNumber(),
                description: `Experienced ${role.toLowerCase()} in manufacturing.`,
                expectedSalary: ['₹18,000/month', '₹22,000/month', '₹15,000/month', '₹25,000/month'][Math.floor(Math.random() * 4)],
                isAvailable: Math.random() > 0.1,
                isVerified: true,
                verificationStatus: 'verified',
                profileCompletion: Math.floor(Math.random() * 30) + 70,
                createdAt: new Date().toISOString()
            });
        }
        return manufacturingWorkers;
    }

    // HOSPITALITY WORKERS
    static generateHospitalityWorkers(count = 6) {
        const hospitalityWorkers = [];
        const roles = ['Hotel Staff', 'Restaurant Worker', 'Cook/Chef', 'Housekeeping', 'Receptionist'];
        
        for (let i = 1; i <= count; i++) {
            const role = roles[Math.floor(Math.random() * roles.length)];
            hospitalityWorkers.push({
                id: `worker_hosp_${Date.now()}_${i}`,
                fullName: this.generateIndianName(),
                email: `service.worker${i}@gmail.com`,
                password: 'password123',
                role: 'worker',
                profession: 'Hospitality',
                skills: this.getHospitalitySkills(role),
                experience: `${1 + Math.floor(Math.random() * 6)} years`,
                education: ['Hotel Management', 'High School', 'Diploma in Hospitality', 'Vocational Training'][Math.floor(Math.random() * 4)],
                location: this.getAPLocation(),
                phone: this.generatePhoneNumber(),
                description: `Service professional in ${role.toLowerCase()}.`,
                expectedSalary: ['₹15,000/month', '₹20,000/month', '₹12,000/month', '₹18,000/month'][Math.floor(Math.random() * 4)],
                isAvailable: Math.random() > 0.2,
                isVerified: true,
                verificationStatus: 'verified',
                profileCompletion: Math.floor(Math.random() * 30) + 70,
                createdAt: new Date().toISOString()
            });
        }
        return hospitalityWorkers;
    }

    // SKILLED TRADES WORKERS
    static generateSkilledTradesWorkers(count = 7) {
        const tradeWorkers = [];
        const roles = ['Electrician', 'Plumber', 'Carpenter', 'Welder', 'Mechanic'];
        
        for (let i = 1; i <= count; i++) {
            const role = roles[Math.floor(Math.random() * roles.length)];
            tradeWorkers.push({
                id: `worker_trade_${Date.now()}_${i}`,
                fullName: this.generateIndianName(),
                email: `trade.worker${i}@gmail.com`,
                password: 'password123',
                role: 'worker',
                profession: 'Skilled Trades',
                skills: this.getConstructionSkills(role),
                experience: `${2 + Math.floor(Math.random() * 15)} years`,
                education: ['ITI Certificate', 'Diploma', 'Apprenticeship', 'Vocational Training'][Math.floor(Math.random() * 4)],
                location: this.getAPLocation(),
                phone: this.generatePhoneNumber(),
                description: `Experienced ${role.toLowerCase()} with technical skills.`,
                expectedSalary: ['₹20,000/month', '₹25,000/month', '₹30,000/month', '₹18,000/month'][Math.floor(Math.random() * 4)],
                isAvailable: Math.random() > 0.1,
                isVerified: true,
                verificationStatus: 'verified',
                profileCompletion: Math.floor(Math.random() * 30) + 70,
                createdAt: new Date().toISOString()
            });
        }
        return tradeWorkers;
    }

    // OFFICE & ADMIN WORKERS
    static generateOfficeWorkers(count = 6) {
        const officeWorkers = [];
        const roles = ['Office Assistant', 'Data Entry Operator', 'Receptionist', 'Clerk', 'Admin Staff'];
        
        for (let i = 1; i <= count; i++) {
            const role = roles[Math.floor(Math.random() * roles.length)];
            officeWorkers.push({
                id: `worker_office_${Date.now()}_${i}`,
                fullName: this.generateIndianName(),
                email: `office.worker${i}@gmail.com`,
                password: 'password123',
                role: 'worker',
                profession: 'Office Administration',
                skills: this.getOfficeSkills(role),
                experience: `${1 + Math.floor(Math.random() * 8)} years`,
                education: ['Graduation', 'Diploma in Office Management', 'Computer Course', 'High School'][Math.floor(Math.random() * 4)],
                location: this.getAPLocation(),
                phone: this.generatePhoneNumber(),
                description: `Office professional skilled in ${role.toLowerCase()} tasks.`,
                expectedSalary: ['₹15,000/month', '₹20,000/month', '₹18,000/month', '₹22,000/month'][Math.floor(Math.random() * 4)],
                isAvailable: Math.random() > 0.2,
                isVerified: true,
                verificationStatus: 'verified',
                profileCompletion: Math.floor(Math.random() * 30) + 70,
                createdAt: new Date().toISOString()
            });
        }
        return officeWorkers;
    }

    // RETAIL & SALES WORKERS
    static generateRetailWorkers(count = 4) {
        const retailWorkers = [];
        const roles = ['Sales Associate', 'Store Helper', 'Cashier', 'Retail Assistant'];
        
        for (let i = 1; i <= count; i++) {
            const role = roles[Math.floor(Math.random() * roles.length)];
            retailWorkers.push({
                id: `worker_retail_${Date.now()}_${i}`,
                fullName: this.generateIndianName(),
                email: `retail.worker${i}@gmail.com`,
                password: 'password123',
                role: 'worker',
                profession: 'Retail',
                skills: this.getRetailSkills(role),
                experience: `${1 + Math.floor(Math.random() * 5)} years`,
                education: ['High School', 'Graduation', 'Sales Training', 'Vocational Course'][Math.floor(Math.random() * 4)],
                location: this.getAPLocation(),
                phone: this.generatePhoneNumber(),
                description: `Retail professional experienced in ${role.toLowerCase()}.`,
                expectedSalary: ['₹12,000/month', '₹15,000/month', '₹10,000/month', '₹14,000/month'][Math.floor(Math.random() * 4)],
                isAvailable: Math.random() > 0.3,
                isVerified: true,
                verificationStatus: 'verified',
                profileCompletion: Math.floor(Math.random() * 30) + 70,
                createdAt: new Date().toISOString()
            });
        }
        return retailWorkers;
    }

    // LOGISTICS & DRIVERS WORKERS
    static generateLogisticsWorkers(count = 4) {
        const logisticsWorkers = [];
        const roles = ['Delivery Driver', 'Truck Driver', 'Warehouse Worker', 'Logistics Helper'];
        
        for (let i = 1; i <= count; i++) {
            const role = roles[Math.floor(Math.random() * roles.length)];
            logisticsWorkers.push({
                id: `worker_logistics_${Date.now()}_${i}`,
                fullName: this.generateIndianName(),
                email: `logistics.worker${i}@gmail.com`,
                password: 'password123',
                role: 'worker',
                profession: 'Logistics',
                skills: this.getLogisticsSkills(role),
                experience: `${2 + Math.floor(Math.random() * 10)} years`,
                education: ['High School', 'Driving License', 'Logistics Training', 'Vocational Course'][Math.floor(Math.random() * 4)],
                location: this.getAPLocation(),
                phone: this.generatePhoneNumber(),
                description: `Experienced in ${role.toLowerCase()} and logistics operations.`,
                expectedSalary: ['₹18,000/month', '₹22,000/month', '₹15,000/month', '₹20,000/month'][Math.floor(Math.random() * 4)],
                isAvailable: Math.random() > 0.1,
                isVerified: true,
                verificationStatus: 'verified',
                profileCompletion: Math.floor(Math.random() * 30) + 70,
                createdAt: new Date().toISOString()
            });
        }
        return logisticsWorkers;
    }

    // ADD THE MISSING METHODS HERE:

    static getHealthcareSkills(profession) {
        const healthcareSkills = {
            'Staff Nurse': ['Patient Care', 'Medication Administration', 'Wound Care', 'Vital Signs', 'Emergency Care'],
            'Medical Lab Technician': ['Lab Testing', 'Sample Analysis', 'Equipment Operation', 'Quality Control', 'Report Preparation'],
            'Pharmacist': ['Dispensing Medicine', 'Drug Knowledge', 'Patient Counseling', 'Inventory Management', 'Prescription Verification'],
            'Hospital Attendant': ['Patient Assistance', 'Equipment Handling', 'Sanitation', 'Patient Transport', 'Basic Care'],
            'Physiotherapist': ['Therapy Techniques', 'Exercise Planning', 'Patient Assessment', 'Rehabilitation', 'Mobility Training']
        };
        
        return healthcareSkills[profession] || ['Patient Care', 'Medical Assistance', 'First Aid', 'Healthcare Protocols'];
    }

    static getHealthcareEducation(profession) {
        const educationMap = {
            'Staff Nurse': 'B.Sc Nursing / GNM',
            'Medical Lab Technician': 'DMLT / B.Sc Medical Lab Technology',
            'Pharmacist': 'B.Pharmacy / D.Pharmacy',
            'Hospital Attendant': 'Nursing Assistant Course',
            'Physiotherapist': 'BPT / MPT'
        };
        return educationMap[profession] || 'Relevant Healthcare Qualification';
    }

    static getManufacturingSkills(role) {
        const skillsMap = {
            'Machine Operator': ['Machine Operation', 'Quality Control', 'Production Monitoring', 'Equipment Maintenance'],
            'Production Worker': ['Assembly Work', 'Quality Checking', 'Production Line', 'Safety Procedures'],
            'Quality Inspector': ['Quality Control', 'Inspection Techniques', 'Testing Methods', 'Documentation'],
            'Assembly Line Worker': ['Assembly Skills', 'Team Work', 'Production Targets', 'Quality Focus'],
            'Factory Supervisor': ['Team Management', 'Production Planning', 'Quality Assurance', 'Safety Compliance']
        };
        return skillsMap[role] || ['Manufacturing Skills', 'Quality Focus', 'Safety Awareness'];
    }

    static getHospitalitySkills(role) {
        const skillsMap = {
            'Hotel Staff': ['Guest Service', 'Room Service', 'Hotel Operations', 'Customer Care'],
            'Restaurant Worker': ['Food Service', 'Customer Interaction', 'Table Management', 'Hygiene Standards'],
            'Cook/Chef': ['Food Preparation', 'Cooking Techniques', 'Menu Knowledge', 'Kitchen Safety'],
            'Housekeeping': ['Cleaning Skills', 'Room Preparation', 'Sanitation Standards', 'Attention to Detail'],
            'Receptionist': ['Front Desk Operations', 'Communication Skills', 'Reservation Management', 'Customer Service']
        };
        return skillsMap[role] || ['Customer Service', 'Hospitality Skills', 'Communication'];
    }

    static getOfficeSkills(role) {
        const skillsMap = {
            'Office Assistant': ['Office Management', 'Document Handling', 'Communication', 'Computer Skills'],
            'Data Entry Operator': ['Typing Speed', 'Data Accuracy', 'Computer Skills', 'Attention to Detail'],
            'Receptionist': ['Front Desk Management', 'Phone Etiquette', 'Visitor Handling', 'Communication Skills'],
            'Clerk': ['Documentation', 'Record Keeping', 'Office Procedures', 'Computer Operations'],
            'Admin Staff': ['Administrative Support', 'Coordination', 'Office Software', 'Communication']
        };
        return skillsMap[role] || ['Office Skills', 'Computer Literacy', 'Communication'];
    }

    static getRetailSkills(role) {
        const skillsMap = {
            'Sales Associate': ['Sales Techniques', 'Customer Service', 'Product Knowledge', 'Cash Handling'],
            'Store Helper': ['Stock Management', 'Customer Assistance', 'Store Maintenance', 'Team Work'],
            'Cashier': ['Cash Handling', 'POS Operation', 'Customer Service', 'Accuracy'],
            'Retail Assistant': ['Sales Support', 'Customer Assistance', 'Product Display', 'Inventory Management']
        };
        return skillsMap[role] || ['Customer Service', 'Sales Skills', 'Retail Operations'];
    }

    static getLogisticsSkills(role) {
        const skillsMap = {
            'Delivery Driver': ['Driving Skills', 'Route Planning', 'Delivery Management', 'Customer Interaction'],
            'Truck Driver': ['Heavy Vehicle Driving', 'Route Optimization', 'Safety Compliance', 'Logistics'],
            'Warehouse Worker': ['Inventory Management', 'Stock Handling', 'Warehouse Operations', 'Safety Procedures'],
            'Logistics Helper': ['Loading/Unloading', 'Inventory Support', 'Documentation', 'Team Work']
        };
        return skillsMap[role] || ['Logistics Skills', 'Physical Fitness', 'Safety Awareness'];
    }

    static getRandomSkills(skillsArray, min = 3, max = 6) {
        const count = Math.floor(Math.random() * (max - min + 1)) + min;
        const shuffled = [...skillsArray].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    // KEEP ALL YOUR EXISTING HELPER METHODS
    static generateIndianName() {
        const firstNames = ['Rajesh', 'Suresh', 'Priya', 'Anjali', 'Kiran', 'Mahesh', 'Lakshmi', 'Srinivas', 'Ramesh', 'Divya', 'Arjun', 'Meena', 'Prakash', 'Anil', 'Venkatesh'];
        const lastNames = ['Kumar', 'Reddy', 'Naidu', 'Sharma', 'Devi', 'Rao', 'Iyer', 'Patnaik', 'Babu', 'Gupta', 'Yadav'];
        return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }

    static generatePhoneNumber() {
        return `91${Math.floor(1000000000 + Math.random() * 9000000000)}`;
    }

    static getAPLocation() {
        const locations = [
            'Vijayawada, Krishna', 'Visakhapatnam City, Visakhapatnam', 'Guntur City, Guntur',
            'Rajahmundry, East Godavari', 'Kakinada, East Godavari', 'Tirupati, Chittoor',
            'Nellore City, Nellore', 'Kurnool City, Kurnool', 'Anantapur City, Anantapur',
            'Eluru, West Godavari', 'Ongole, Prakasam', 'Kadapa City, Kadapa'
        ];
        return locations[Math.floor(Math.random() * locations.length)];
    }

    static getRandomTechSkills() {
        const skillSets = [
            ['JavaScript', 'React', 'Node.js', 'MongoDB'],
            ['Java', 'Spring Boot', 'MySQL', 'Hibernate'],
            ['Python', 'Django', 'PostgreSQL', 'AWS'],
            ['HTML5', 'CSS3', 'JavaScript', 'Bootstrap'],
            ['C#', '.NET', 'SQL Server', 'Azure']
        ];
        return skillSets[Math.floor(Math.random() * skillSets.length)];
    }
    // ADD THESE MISSING METHODS TO YOUR EXISTING CLASS:

static getConstructionSkills(role) {
    const skillsMap = {
        'Electrician': ['Electrical Wiring', 'Circuit Repair', 'Safety Procedures', 'Equipment Installation'],
        'Plumber': ['Pipe Fitting', 'Water Systems', 'Drainage Repair', 'Installation'],
        'Carpenter': ['Wood Working', 'Furniture Making', 'Measurement', 'Tool Handling'],
        'Welder': ['Welding Techniques', 'Metal Fabrication', 'Safety Equipment', 'Blueprint Reading'],
        'Mechanic': ['Vehicle Repair', 'Engine Maintenance', 'Diagnostic Skills', 'Tool Usage']
    };
    return skillsMap[role] || ['Technical Skills', 'Tool Handling', 'Safety Procedures'];
}

static getHealthcareSkills(profession) {
    const healthcareSkills = {
        'Staff Nurse': ['Patient Care', 'Medication Administration', 'Wound Care', 'Vital Signs', 'Emergency Care'],
        'Medical Lab Technician': ['Lab Testing', 'Sample Analysis', 'Equipment Operation', 'Quality Control', 'Report Preparation'],
        'Pharmacist': ['Dispensing Medicine', 'Drug Knowledge', 'Patient Counseling', 'Inventory Management', 'Prescription Verification'],
        'Hospital Attendant': ['Patient Assistance', 'Equipment Handling', 'Sanitation', 'Patient Transport', 'Basic Care'],
        'Physiotherapist': ['Therapy Techniques', 'Exercise Planning', 'Patient Assessment', 'Rehabilitation', 'Mobility Training']
    };
    return healthcareSkills[profession] || ['Patient Care', 'Medical Assistance', 'First Aid', 'Healthcare Protocols'];
}

static getManufacturingSkills(role) {
    const skillsMap = {
        'Machine Operator': ['Machine Operation', 'Quality Control', 'Production Monitoring', 'Equipment Maintenance'],
        'Production Worker': ['Assembly Work', 'Quality Checking', 'Production Line', 'Safety Procedures'],
        'Quality Inspector': ['Quality Control', 'Inspection Techniques', 'Testing Methods', 'Documentation'],
        'Assembly Line Worker': ['Assembly Skills', 'Team Work', 'Production Targets', 'Quality Focus'],
        'Factory Supervisor': ['Team Management', 'Production Planning', 'Quality Assurance', 'Safety Compliance']
    };
    return skillsMap[role] || ['Manufacturing Skills', 'Quality Focus', 'Safety Awareness'];
}

static getHospitalitySkills(role) {
    const skillsMap = {
        'Hotel Staff': ['Guest Service', 'Room Service', 'Hotel Operations', 'Customer Care'],
        'Restaurant Worker': ['Food Service', 'Customer Interaction', 'Table Management', 'Hygiene Standards'],
        'Cook/Chef': ['Food Preparation', 'Cooking Techniques', 'Menu Knowledge', 'Kitchen Safety'],
        'Housekeeping': ['Cleaning Skills', 'Room Preparation', 'Sanitation Standards', 'Attention to Detail'],
        'Receptionist': ['Front Desk Operations', 'Communication Skills', 'Reservation Management', 'Customer Service']
    };
    return skillsMap[role] || ['Customer Service', 'Hospitality Skills', 'Communication'];
}

static getOfficeSkills(role) {
    const skillsMap = {
        'Office Assistant': ['Office Management', 'Document Handling', 'Communication', 'Computer Skills'],
        'Data Entry Operator': ['Typing Speed', 'Data Accuracy', 'Computer Skills', 'Attention to Detail'],
        'Receptionist': ['Front Desk Management', 'Phone Etiquette', 'Visitor Handling', 'Communication Skills'],
        'Clerk': ['Documentation', 'Record Keeping', 'Office Procedures', 'Computer Operations'],
        'Admin Staff': ['Administrative Support', 'Coordination', 'Office Software', 'Communication']
    };
    return skillsMap[role] || ['Office Skills', 'Computer Literacy', 'Communication'];
}

static getRetailSkills(role) {
    const skillsMap = {
        'Sales Associate': ['Sales Techniques', 'Customer Service', 'Product Knowledge', 'Cash Handling'],
        'Store Helper': ['Stock Management', 'Customer Assistance', 'Store Maintenance', 'Team Work'],
        'Cashier': ['Cash Handling', 'POS Operation', 'Customer Service', 'Accuracy'],
        'Retail Assistant': ['Sales Support', 'Customer Assistance', 'Product Display', 'Inventory Management']
    };
    return skillsMap[role] || ['Customer Service', 'Sales Skills', 'Retail Operations'];
}

static getLogisticsSkills(role) {
    const skillsMap = {
        'Delivery Driver': ['Driving Skills', 'Route Planning', 'Delivery Management', 'Customer Interaction'],
        'Truck Driver': ['Heavy Vehicle Driving', 'Route Optimization', 'Safety Compliance', 'Logistics'],
        'Warehouse Worker': ['Inventory Management', 'Stock Handling', 'Warehouse Operations', 'Safety Procedures'],
        'Logistics Helper': ['Loading/Unloading', 'Inventory Support', 'Documentation', 'Team Work']
    };
    return skillsMap[role] || ['Logistics Skills', 'Physical Fitness', 'Safety Awareness'];
}

static getHealthcareEducation(profession) {
    const educationMap = {
        'Staff Nurse': 'B.Sc Nursing / GNM',
        'Medical Lab Technician': 'DMLT / B.Sc Medical Lab Technology',
        'Pharmacist': 'B.Pharmacy / D.Pharmacy',
        'Hospital Attendant': 'Nursing Assistant Course',
        'Physiotherapist': 'BPT / MPT'
    };
    return educationMap[profession] || 'Relevant Healthcare Qualification';
}

static getRandomSkills(skillsArray, min = 3, max = 6) {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const shuffled = [...skillsArray].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}
}

// Initialize the worker generator
document.addEventListener('DOMContentLoaded', function() {
    AndhraPradeshWorkerGenerator.init();
});