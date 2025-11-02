// COMPREHENSIVE ANDHRA PRADESH EMPLOYER & JOB GENERATOR
class AndhraPradeshEmployerGenerator {
    static init() {
        console.log('🚀 Initializing Andhra Pradesh Employer Data Generator...');
        this.generateCompleteEmployerDataset();
    }

    static generateCompleteEmployerDataset() {
        const employers = this.generateEmployers();
        const jobs = this.generateJobs(employers);
        console.log('✅ Complete Andhra Pradesh employer dataset generated!');
        console.log(`📊 Generated ${employers.length} employers and ${jobs.length} jobs`);
        return { employers, jobs };
    }

    static generateEmployers() {
        const employers = [];

        // TECH & PROFESSIONAL EMPLOYERS
        employers.push(...this.generateTechEmployers());
        
        // CORPORATE & OFFICE EMPLOYERS
        employers.push(...this.generateCorporateEmployers());
        
        // HEALTHCARE & MEDICAL EMPLOYERS
        employers.push(...this.generateHealthcareEmployers());
        
        // MANUFACTURING & INDUSTRIAL EMPLOYERS
        employers.push(...this.generateManufacturingEmployers());
        
        // HOSPITALITY & RETAIL EMPLOYERS
        employers.push(...this.generateHospitalityEmployers());
        
        // SKILLED TRADES EMPLOYERS
        employers.push(...this.generateSkilledTradesEmployers());
        
        // GOVERNMENT & PUBLIC SECTOR EMPLOYERS
        employers.push(...this.generateGovernmentEmployers());
        
        // AGRICULTURE & SEASONAL EMPLOYERS
        employers.push(...this.generateAgricultureEmployers());

        // Save to localStorage
        localStorage.setItem('employers', JSON.stringify(employers));
        localStorage.setItem('opuslink_users', JSON.stringify([
            ...JSON.parse(localStorage.getItem('opuslink_users') || '[]'),
            ...employers
        ]));

        return employers;
    }

    // TECH & PROFESSIONAL EMPLOYERS
    static generateTechEmployers() {
        return [
            {
                id: 'emp_hyderabad_tech_1',
                fullName: 'Rajesh Kumar',
                email: 'rajesh@techsolutionshyd.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Hyderabad Tech Solutions',
                industry: 'Information Technology',
                companySize: '51-200',
                companyCategory: 'tech',
                location: 'Hyderabad, Telangana',
                website: 'https://techsolutionshyd.com',
                description: 'Leading software development company in Hyderabad specializing in enterprise solutions and digital transformation.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_vijayawada_tech_1',
                fullName: 'Priya Reddy',
                email: 'priya@innovationslabs.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Innovation Labs India',
                industry: 'Software Development',
                companySize: '201-500',
                companyCategory: 'tech',
                location: 'Vijayawada, Andhra Pradesh',
                website: 'https://innovationslabs.com',
                description: 'Product-based company building cutting-edge AI and ML solutions for global clients.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_visakhapatnam_tech_1',
                fullName: 'Arjun Sharma',
                email: 'arjun@vizagsoft.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Vizag Software Park',
                industry: 'IT Services',
                companySize: '101-500',
                companyCategory: 'tech',
                location: 'Visakhapatnam City, Visakhapatnam',
                website: 'https://vizagsoft.com',
                description: 'IT services company providing software development and digital solutions from Vizag.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_guntur_tech_1',
                fullName: 'Suresh Babu',
                email: 'suresh@andhrait.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Andhra IT Solutions',
                industry: 'Information Technology',
                companySize: '11-50',
                companyCategory: 'tech',
                location: 'Guntur City, Guntur',
                website: 'https://andhrait.com',
                description: 'Growing IT company in Guntur providing web and mobile app development services.',
                isVerified: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    // CORPORATE & OFFICE EMPLOYERS
    static generateCorporateEmployers() {
        return [
            {
                id: 'emp_vijayawada_corp_1',
                fullName: 'Kiran Kumar',
                email: 'kiran@andhracorp.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Andhra Corporate Services',
                industry: 'Business Services',
                companySize: '51-200',
                companyCategory: 'corporate',
                location: 'Vijayawada, Krishna',
                website: 'https://andhracorp.com',
                description: 'Leading corporate services provider in Vijayawada offering BPO and back-office solutions.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_visakhapatnam_corp_1',
                fullName: 'Meena Devi',
                email: 'meena@easternconsulting.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Eastern Consulting Group',
                industry: 'Management Consulting',
                companySize: '11-50',
                companyCategory: 'corporate',
                location: 'Visakhapatnam City, Visakhapatnam',
                website: 'https://easternconsulting.com',
                description: 'Management consulting firm providing strategic business solutions to enterprises.',
                isVerified: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    // HEALTHCARE & MEDICAL EMPLOYERS
    static generateHealthcareEmployers() {
        return [
            {
                id: 'emp_vijayawada_health_1',
                fullName: 'Dr. Srinivas Rao',
                email: 'srinivas@aphealthcare.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Andhra Pradesh Healthcare',
                industry: 'Healthcare',
                companySize: '101-500',
                companyCategory: 'healthcare',
                location: 'Vijayawada, Krishna',
                website: 'https://aphealthcare.com',
                description: 'Multi-specialty hospital providing comprehensive healthcare services across Andhra.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_visakhapatnam_health_1',
                fullName: 'Dr. Anjali Gupta',
                email: 'anjali@vizagmedical.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Visakhapatnam Medical Center',
                industry: 'Healthcare',
                companySize: '201-500',
                companyCategory: 'healthcare',
                location: 'Visakhapatnam City, Visakhapatnam',
                website: 'https://vizagmedical.com',
                description: 'Advanced medical center with state-of-the-art facilities in Visakhapatnam.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_guntur_health_1',
                fullName: 'Dr. Ramesh Naidu',
                email: 'ramesh@gunturhospitals.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Guntur General Hospital',
                industry: 'Healthcare',
                companySize: '51-200',
                companyCategory: 'healthcare',
                location: 'Guntur City, Guntur',
                website: 'https://gunturhospitals.com',
                description: 'Trusted healthcare provider serving Guntur and surrounding districts.',
                isVerified: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    // MANUFACTURING & INDUSTRIAL EMPLOYERS
    static generateManufacturingEmployers() {
        return [
            {
                id: 'emp_visakhapatnam_manu_1',
                fullName: 'Kiran Naidu',
                email: 'kiran@vizagsteel.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Vizag Steel Works',
                industry: 'Manufacturing',
                companySize: '501-1000',
                companyCategory: 'manufacturing',
                location: 'Visakhapatnam City, Visakhapatnam',
                website: 'https://vizagsteel.com',
                description: 'Leading steel manufacturing company with operations in Visakhapatnam.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_kakinada_manu_1',
                fullName: 'Ravi Shankar',
                email: 'ravi@eastcoastindustries.com',
                password: 'password123',
                role: 'employer',
                companyName: 'East Coast Industries',
                industry: 'Manufacturing',
                companySize: '201-500',
                companyCategory: 'manufacturing',
                location: 'Kakinada, East Godavari',
                website: 'https://eastcoastindustries.com',
                description: 'Diversified manufacturing company in Kakinada industrial zone.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_anantapur_manu_1',
                fullName: 'Suresh Reddy',
                email: 'suresh@anantapurtextiles.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Anantapur Textile Mills',
                industry: 'Textile Manufacturing',
                companySize: '101-500',
                companyCategory: 'manufacturing',
                location: 'Anantapur City, Anantapur',
                website: 'https://anantapurtextiles.com',
                description: 'Textile manufacturing unit providing employment in Anantapur region.',
                isVerified: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    // HOSPITALITY & RETAIL EMPLOYERS
    static generateHospitalityEmployers() {
        return [
            {
                id: 'emp_visakhapatnam_hosp_1',
                fullName: 'Divya Sharma',
                email: 'divya@bayviewhotels.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Bay View Hotels & Resorts',
                industry: 'Hospitality',
                companySize: '51-200',
                companyCategory: 'hospitality',
                location: 'Visakhapatnam City, Visakhapatnam',
                website: 'https://bayviewhotels.com',
                description: 'Luxury hotel chain with properties across coastal Andhra Pradesh.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_tirupati_hosp_1',
                fullName: 'Venkatesh Iyer',
                email: 'venkatesh@tirupatihospitality.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Tirupati Hospitality Group',
                industry: 'Hospitality',
                companySize: '101-500',
                companyCategory: 'hospitality',
                location: 'Tirupati, Chittoor',
                website: 'https://tirupatihospitality.com',
                description: 'Leading hospitality group serving pilgrims and tourists in Tirupati.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_vijayawada_retail_1',
                fullName: 'Anil Kumar',
                email: 'anil@andhraretail.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Andhra Retail Chains',
                industry: 'Retail',
                companySize: '201-500',
                companyCategory: 'retail',
                location: 'Vijayawada, Krishna',
                website: 'https://andhraretail.com',
                description: 'Retail chain operating multiple stores across Vijayawada and Krishna district.',
                isVerified: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    // SKILLED TRADES EMPLOYERS
    static generateSkilledTradesEmployers() {
        return [
            {
                id: 'emp_rajahmundry_trades_1',
                fullName: 'Prakash Rao',
                email: 'prakash@eastgodavariconstruction.com',
                password: 'password123',
                role: 'employer',
                companyName: 'East Godavari Construction',
                industry: 'Construction',
                companySize: '51-200',
                companyCategory: 'skilled-trades',
                location: 'Rajahmundry, East Godavari',
                website: 'https://eastgodavariconstruction.com',
                description: 'Construction company undertaking major infrastructure projects in East Godavari.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_kurnool_trades_1',
                fullName: 'Mahesh Yadav',
                email: 'mahesh@kurnoolelectrical.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Kurnool Electrical Works',
                industry: 'Electrical Services',
                companySize: '11-50',
                companyCategory: 'skilled-trades',
                location: 'Kurnool City, Kurnool',
                website: 'https://kurnoolelectrical.com',
                description: 'Electrical services and maintenance company serving Kurnool district.',
                isVerified: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    // GOVERNMENT & PUBLIC SECTOR EMPLOYERS
    static generateGovernmentEmployers() {
        return [
            {
                id: 'emp_amaravati_govt_1',
                fullName: 'Srikanth Sharma',
                email: 'srikanth@apgovservices.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Andhra Pradesh Government Services',
                industry: 'Government',
                companySize: '1000+',
                companyCategory: 'government',
                location: 'Amaravati, Guntur',
                website: 'https://ap.gov.in',
                description: 'State government department responsible for public services and administration.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_visakhapatnam_govt_1',
                fullName: 'Lakshmi Patnaik',
                email: 'lakshmi@vizagport.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Visakhapatnam Port Authority',
                industry: 'Government',
                companySize: '501-1000',
                companyCategory: 'government',
                location: 'Visakhapatnam City, Visakhapatnam',
                website: 'https://vizagport.com',
                description: 'Major port authority managing operations at Visakhapatnam Port.',
                isVerified: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    // AGRICULTURE & SEASONAL EMPLOYERS
    static generateAgricultureEmployers() {
        return [
            {
                id: 'emp_eastgodavari_agri_1',
                fullName: 'Ramesh Babu',
                email: 'ramesh@godavariagriculture.com',
                password: 'password123',
                role: 'employer',
                companyName: 'Godavari Agriculture Co-operative',
                industry: 'Agriculture',
                companySize: '51-200',
                companyCategory: 'agriculture',
                location: 'Amalapuram, East Godavari',
                website: 'https://godavariagriculture.com',
                description: 'Agricultural co-operative supporting farmers in East Godavari delta region.',
                isVerified: true,
                createdAt: new Date().toISOString()
            },
            {
                id: 'emp_westgodavari_agri_1',
                fullName: 'Satyam Naidu',
                email: 'satyam@westgodavariagri.com',
                password: 'password123',
                role: 'employer',
                companyName: 'West Godavari Agro Industries',
                industry: 'Agro Processing',
                companySize: '101-500',
                companyCategory: 'agriculture',
                location: 'Eluru, West Godavari',
                website: 'https://westgodavariagri.com',
                description: 'Agro-processing company specializing in rice milling and export.',
                isVerified: true,
                createdAt: new Date().toISOString()
            }
        ];
    }

    static generateJobs(employers) {
        const jobs = [];
        let jobId = 1;

        employers.forEach(employer => {
            // Generate 2-4 jobs per employer
            const jobCount = 3 + Math.floor(Math.random() * 4);
            
            for (let i = 0; i < jobCount; i++) {
                const job = this.createJobForEmployer(employer, jobId++);
                jobs.push(job);
            }
        });

        // Save to localStorage
        const existingJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const existingOpuslinkJobs = JSON.parse(localStorage.getItem('opuslink_jobs') || '[]');
        
        localStorage.setItem('jobs', JSON.stringify([...existingJobs, ...jobs]));
        localStorage.setItem('opuslink_jobs', JSON.stringify([...existingOpuslinkJobs, ...jobs]));

        return jobs;
    }

    static createJobForEmployer(employer, jobId) {
        const jobTemplates = this.getJobTemplatesByCategory(employer.companyCategory);
        const template = jobTemplates[Math.floor(Math.random() * jobTemplates.length)];
        
        const salary = this.generateSalaryForCategory(employer.companyCategory);
        const experienceLevel = ['entry', 'mid', 'senior'][Math.floor(Math.random() * 3)];
        
        return {
            id: `job_${jobId}`,
            title: template.title,
            category: employer.companyCategory,
            type: template.type,
            salary: salary,
            location: employer.location,
            description: template.description.replace('{company}', employer.companyName).replace('{location}', employer.location),
            requirements: template.requirements,
            skills: template.skills.join(', '),
            datePosted: new Date().toISOString(),
            status: 'active',
            employerId: employer.id,
            employerName: employer.companyName,
            applications: [],
            views: Math.floor(Math.random() * 100),
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
        };
    }

    static getJobTemplatesByCategory(category) {
        const templates = {
            'tech': [
                {
                    title: 'Full Stack Developer',
                    type: 'fulltime',
                    description: 'Join {company} in {location} as a Full Stack Developer. Work on cutting-edge technologies and build scalable applications.',
                    requirements: '2+ years experience in JavaScript, React, Node.js\nUnderstanding of databases and REST APIs\nComputer Science degree preferred',
                    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'Express']
                },
                {
                    title: 'Software Engineer',
                    type: 'fulltime',
                    description: 'Software Engineer position at {company} in {location}. Develop and maintain enterprise software solutions.',
                    requirements: '3+ years software development experience\nStrong problem-solving skills\nExperience with Agile methodologies',
                    skills: ['Java', 'Python', 'SQL', 'Spring Boot', 'Git']
                },
                {
                    title: 'Frontend Developer',
                    type: 'fulltime',
                    description: 'Frontend Developer role at {company} in {location}. Create responsive and user-friendly web applications.',
                    requirements: '2+ years frontend development\nProficiency in React/Vue/Angular\nUnderstanding of UI/UX principles',
                    skills: ['React', 'JavaScript', 'CSS', 'HTML5', 'Redux']
                }
            ],
            'healthcare': [
                {
                    title: 'Staff Nurse',
                    type: 'fulltime',
                    description: 'Staff Nurse position at {company} in {location}. Provide quality patient care in a hospital setting.',
                    requirements: 'B.Sc Nursing or equivalent\nValid nursing license\n2+ years hospital experience',
                    skills: ['Patient Care', 'Medical Knowledge', 'Emergency Response', 'Communication']
                },
                {
                    title: 'Medical Lab Technician',
                    type: 'fulltime',
                    description: 'Join {company} in {location} as a Medical Lab Technician. Perform diagnostic testing and analysis.',
                    requirements: 'DMLT or B.Sc in Medical Lab Technology\nLaboratory experience\nAttention to detail',
                    skills: ['Lab Testing', 'Microbiology', 'Pathology', 'Equipment Handling']
                }
            ],
            'manufacturing': [
                {
                    title: 'Production Supervisor',
                    type: 'fulltime',
                    description: 'Production Supervisor role at {company} in {location}. Oversee manufacturing operations and team management.',
                    requirements: '3+ years manufacturing experience\nSupervisory skills\nQuality control knowledge',
                    skills: ['Production Management', 'Quality Control', 'Team Leadership', 'Safety Protocols']
                },
                {
                    title: 'Quality Control Inspector',
                    type: 'fulltime',
                    description: 'Quality Control Inspector position at {company} in {location}. Ensure product quality standards.',
                    requirements: '2+ years QC experience\nKnowledge of quality standards\nAttention to detail',
                    skills: ['Quality Assurance', 'Inspection', 'Documentation', 'Standards Compliance']
                }
            ],
            'hospitality': [
                {
                    title: 'Hotel Front Desk Executive',
                    type: 'fulltime',
                    description: 'Front Desk Executive at {company} in {location}. Provide excellent guest service and manage reservations.',
                    requirements: 'Hotel management degree preferred\nCustomer service experience\nGood communication skills',
                    skills: ['Customer Service', 'Reservation Systems', 'Communication', 'Problem Solving']
                },
                {
                    title: 'Restaurant Manager',
                    type: 'fulltime',
                    description: 'Restaurant Manager position at {company} in {location}. Oversee restaurant operations and staff.',
                    requirements: '3+ years restaurant management\nFood safety knowledge\nStaff management experience',
                    skills: ['Restaurant Management', 'Customer Service', 'Inventory Management', 'Staff Training']
                }
            ]
        };

        return templates[category] || templates['tech']; // Default to tech if category not found
    }

    static generateSalaryForCategory(category) {
        const salaryRanges = {
            'tech': ['₹45,000/month', '₹60,000/month', '₹80,000/month', '₹35,000/month'],
            'healthcare': ['₹25,000/month', '₹35,000/month', '₹45,000/month', '₹30,000/month'],
            'manufacturing': ['₹20,000/month', '₹28,000/month', '₹35,000/month', '₹25,000/month'],
            'hospitality': ['₹18,000/month', '₹25,000/month', '₹32,000/month', '₹22,000/month'],
            'corporate': ['₹30,000/month', '₹45,000/month', '₹60,000/month', '₹35,000/month'],
            'skilled-trades': ['₹22,000/month', '₹30,000/month', '₹40,000/month', '₹28,000/month'],
            'government': ['₹35,000/month', '₹50,000/month', '₹65,000/month', '₹40,000/month'],
            'agriculture': ['₹15,000/month', '₹22,000/month', '₹30,000/month', '₹20,000/month']
        };

        const range = salaryRanges[category] || salaryRanges['tech'];
        return range[Math.floor(Math.random() * range.length)];
    }
}

// Initialize the generator
document.addEventListener('DOMContentLoaded', function() {
    AndhraPradeshEmployerGenerator.init();
});