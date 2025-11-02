/* ===========================================================
   REAL DATA GENERATOR
   Generates realistic employers, job seekers, and jobs
   =========================================================== */

// ------------------ Real Location Data ------------------
const districts = {
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

// ------------------ Real Categories ------------------
const categories = [
    "Tech & Professional", "Corporate & Office", "Skilled Trades",
    "Hospitality & Retail", "Healthcare & Medical", "Education & Training",
    "Manufacturing & Industrial", "Construction & Civil", "Transport & Logistics",
    "Agriculture & Farming", "Creative & Media", "Customer Service"
];

// ------------------ Real Names ------------------
const indianFirstNames = [
    "Aarav", "Aditya", "Akshay", "Amit", "Anil", "Arjun", "Bhaskar", "Charan", "Deepak", "Ganesh",
    "Harish", "Kiran", "Kumar", "Manoj", "Naveen", "Prakash", "Rajesh", "Ramesh", "Sanjay", "Suresh",
    "Anjali", "Deepika", "Kavita", "Lakshmi", "Madhavi", "Neha", "Pooja", "Priya", "Radha", "Sangeeta",
    "Shanti", "Sneha", "Sonia", "Swati", "Tanvi", "Uma", "Vandana", "Yamini"
];

const indianLastNames = [
    "Reddy", "Kumar", "Sharma", "Patel", "Singh", "Rao", "Naidu", "Chowdary", "Varma", "Gupta",
    "Malhotra", "Mehta", "Jain", "Verma", "Yadav", "Pandey", "Mishra", "Thakur", "Shah", "Joshi"
];

const companyNames = [
    "Tech Solutions", "Innovate Labs", "Global Services", "Prime Industries", "Elite Systems",
    "Smart Enterprises", "Progressive Group", "Dynamic Solutions", "Vision Corporation", "Future Tech",
    "Reliable Services", "Quality Works", "Expert Solutions", "Professional Group", "Advanced Systems"
];

// ------------------ Real Skills ------------------
const techSkills = ["JavaScript", "Python", "React", "Node.js", "HTML/CSS", "Java", "SQL", "AWS", "DevOps", "UI/UX"];
const professionalSkills = ["Project Management", "Communication", "Leadership", "Analytical Thinking", "Customer Service"];
const tradeSkills = ["Electrical Work", "Plumbing", "Carpentry", "Masonry", "Welding"];
const hospitalitySkills = ["Food Service", "Housekeeping", "Customer Care", "Cooking", "Bartending"];
const healthcareSkills = ["Patient Care", "Nursing", "Medical Knowledge", "First Aid", "Health Education"];

// ------------------ Utilities ------------------
const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];
const randomName = () => `${randomItem(indianFirstNames)} ${randomItem(indianLastNames)}`;
const randomCompany = () => `${randomItem(companyNames)} ${randomItem(["Pvt Ltd", "Ltd", "Corporation", "Group"])}`;

// ------------------ Generate Real Employers ------------------
function generateRealEmployers() {
    let employers = [];
    for (let i = 1; i <= 15; i++) {
        const district = randomItem(Object.keys(districts));
        const city = randomItem(districts[district]);
        const category = randomItem(categories);
        
        employers.push({
            id: `emp_${i}`,
            name: randomCompany(),
            category: category,
            district: district,
            city: city,
            rating: (3.5 + Math.random() * 1.5).toFixed(1), // 3.5-5.0 rating
            jobsPosted: [],
            bio: `A reputable ${category.toLowerCase()} company based in ${city}, ${district}. Committed to quality and fair employment practices.`,
            established: 2000 + Math.floor(Math.random() * 24), // Established between 2000-2024
            employees: ["1-10", "11-50", "51-200", "201-500"][Math.floor(Math.random() * 4)]
        });
    }
    localStorage.setItem("employers", JSON.stringify(employers));
    return employers;
}

// ------------------ Generate Real Job Seekers ------------------
function generateRealJobSeekers() {
    let seekers = [];
    for (let i = 1; i <= 50; i++) {
        const district = randomItem(Object.keys(districts));
        const city = randomItem(districts[district]);
        const category = randomItem(categories);
        const experience = ["Entry", "Mid", "Senior"][Math.floor(Math.random() * 3)];
        
        // Realistic skills based on category
        let skills = [];
        if (category.includes("Tech")) {
            skills = techSkills.slice(0, 3 + Math.floor(Math.random() * 3));
        } else if (category.includes("Professional") || category.includes("Corporate")) {
            skills = professionalSkills.slice(0, 2 + Math.floor(Math.random() * 2));
        } else if (category.includes("Skilled") || category.includes("Construction")) {
            skills = tradeSkills.slice(0, 2 + Math.floor(Math.random() * 2));
        } else if (category.includes("Hospitality")) {
            skills = hospitalitySkills.slice(0, 2 + Math.floor(Math.random() * 2));
        } else if (category.includes("Healthcare")) {
            skills = healthcareSkills.slice(0, 2 + Math.floor(Math.random() * 2));
        } else {
            skills = professionalSkills.slice(0, 2 + Math.floor(Math.random() * 2));
        }
        
        seekers.push({
            id: `worker_${i}`,
            name: randomName(),
            category: category,
            district: district,
            city: city,
            experience: experience,
            rating: (3.0 + Math.random() * 2.0).toFixed(1), // 3.0-5.0 rating
            skills: skills,
            education: ["High School", "Diploma", "Bachelor's", "Master's"][Math.floor(Math.random() * 4)],
            bio: `Experienced ${category.toLowerCase()} professional from ${city}. Seeking new opportunities to grow and contribute.`,
            available: Math.random() > 0.2, // 80% available for work
            joinDate: new Date(2023 - Math.floor(Math.random() * 3), Math.floor(Math.random() * 12)).toISOString()
        });
    }
    localStorage.setItem("jobSeekers", JSON.stringify(seekers));
    return seekers;
}

// ------------------ Generate Real Jobs ------------------
function generateRealJobs(employers) {
    let jobs = [];
    let idCounter = 1;
    
    const jobTitles = {
        "Tech & Professional": ["Software Developer", "Web Developer", "Data Analyst", "System Administrator", "IT Support"],
        "Corporate & Office": ["Office Assistant", "Accountant", "HR Executive", "Sales Manager", "Administrative Officer"],
        "Skilled Trades": ["Electrician", "Plumber", "Carpenter", "Welder", "Mason"],
        "Hospitality & Retail": ["Store Manager", "Sales Associate", "Cashier", "Hotel Staff", "Restaurant Worker"],
        "Healthcare & Medical": ["Nurse", "Medical Assistant", "Caregiver", "Lab Technician", "Pharmacist"],
        "Education & Training": ["Teacher", "Tutor", "Trainer", "Education Assistant", "Instructor"],
        "Manufacturing & Industrial": ["Machine Operator", "Assembly Worker", "Quality Inspector", "Factory Worker", "Technician"],
        "Construction & Civil": ["Construction Worker", "Site Supervisor", "Civil Engineer", "Architect", "Surveyor"],
        "Transport & Logistics": ["Driver", "Delivery Executive", "Logistics Coordinator", "Warehouse Worker", "Dispatcher"],
        "Agriculture & Farming": ["Farm Worker", "Agriculture Specialist", "Gardener", "Harvest Worker", "Irrigation Technician"],
        "Creative & Media": ["Graphic Designer", "Content Writer", "Photographer", "Video Editor", "Social Media Manager"],
        "Customer Service": ["Customer Support", "Call Center Agent", "Service Representative", "Help Desk", "Client Relations"]
    };
    
    employers.forEach(emp => {
        // Each employer posts 1-3 jobs
        const jobCount = 1 + Math.floor(Math.random() * 3);
        
        for (let i = 0; i < jobCount; i++) {
            const category = emp.category;
            const title = randomItem(jobTitles[category] || ["General Worker"]);
            const experienceLevel = ["Entry", "Mid", "Senior"][Math.floor(Math.random() * 3)];
            
            // Realistic salary ranges based on category and experience
            let baseSalary = 15000;
            if (category.includes("Tech") || category.includes("Professional")) baseSalary = 25000;
            if (category.includes("Healthcare") || category.includes("Corporate")) baseSalary = 20000;
            
            const salary = baseSalary + (Math.floor(Math.random() * 30000));
            const salaryFormatted = `₹${salary.toLocaleString()}/month`;
            
            const job = {
                id: `job_${idCounter++}`,
                employerId: emp.id,
                employerName: emp.name,
                title: title,
                category: category,
                district: emp.district,
                city: emp.city,
                type: randomItem(["fulltime", "parttime", "contract"]),
                salary: salaryFormatted,
                salaryNumber: salary,
                experienceLevel: experienceLevel,
                description: `We are hiring a ${title} for our ${emp.category} division in ${emp.city}. The ideal candidate should have ${experienceLevel.toLowerCase()} level experience and relevant skills. This is a great opportunity to join a growing company.`,
                requirements: [
                    `${experienceLevel} level experience in relevant field`,
                    "Good communication skills",
                    "Ability to work in a team environment",
                    "Willingness to learn and adapt"
                ],
                skills: ["Communication", "Teamwork", "Problem-solving"].slice(0, 2 + Math.floor(Math.random() * 2)),
                postedDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
                status: "active",
                applicants: []
            };
            
            jobs.push(job);
            emp.jobsPosted.push(job.id);
        }
    });
    
    localStorage.setItem("jobs", JSON.stringify(jobs));
    localStorage.setItem("employers", JSON.stringify(employers)); // update job links
    return jobs;
}

// ------------------ Initialize Real Data ------------------
function initializeRealData() {
    console.log("🧠 Initializing real data...");
    
    if (!localStorage.getItem("employers")) {
        const employers = generateRealEmployers();
        const seekers = generateRealJobSeekers();
        const jobs = generateRealJobs(employers);
        
        console.log(`✅ Generated real data: ${employers.length} employers, ${seekers.length} job seekers, ${jobs.length} jobs.`);
    } else {
        console.log("ℹ️ Real data already exists in localStorage.");
    }

    // Notify dashboard
    if (typeof document !== 'undefined') {
        document.dispatchEvent(new Event("dataReady"));
    }
}

// Run immediately
initializeRealData();