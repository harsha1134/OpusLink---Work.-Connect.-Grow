// Stats counter animation
function animateCounter(id, target) {
  let count = 0;
  const interval = setInterval(() => {
    count++;
    document.getElementById(id).innerText = count;
    if (count === target) clearInterval(interval);
  }, 30);
}
animateCounter("users", 1200);
animateCounter("jobs", 350);
animateCounter("categories", 12);

// Chart.js job distribution
const ctx = document.getElementById('jobChart');
new Chart(ctx, {
  type: 'pie',
  data: {
    labels: ["IT", "Plumber", "Electrician", "Photographer", "Carpenter", "Driver", "Teacher", "Doctor", "Nurse", "Cook", "Cleaner", "Others"],
    datasets: [{
      data: [120, 80, 60, 45, 30, 25, 50, 40, 35, 20, 15, 30],
      backgroundColor: ["#238636","#1f6feb","#c9d1d9","#ff7b72","#58a6ff","#d29922","#8957e5","#f85149","#a371f7","#3fb950","#ffa657","#79c0ff"]
    }]
  }
});

// Dummy jobs
const jobs = [
  {title:"Web Developer", company:"TechCorp", location:"Bangalore", category:"IT"},
  {title:"Electrician", company:"HomeFix", location:"Hyderabad", category:"Electrician"},
  {title:"Event Photographer", company:"WeddingsPro", location:"Chennai", category:"Photographer"},
  {title:"Driver", company:"CityCab", location:"Delhi", category:"Driver"},
];
const jobList = document.getElementById("job-list");
jobs.forEach(job => {
  const div = document.createElement("div");
  div.classList.add("job-card");
  div.innerHTML = `<h3>${job.title}</h3><p>${job.company}</p><p>${job.location}</p><small>${job.category}</small>`;
  jobList.appendChild(div);
});

// Categories
const categories = [
  "Tech & Professional",
  "Corporate & Office",
  "Skilled Trades (Blue Collar)",
  "Daily Wage & Short-Term",
  "Hospitality & Retail",
  "Freelance & Gigs",
  "Students & Internships",
  "Household & Care Services",
  "Agriculture & Seasonal",
  "Healthcare & Medical",
  "Sanitation & Waste Management",
  "Informal Sector / Local Vendors",
  "Government & Public Sector",
  "Manufacturing & Industrial Labor",
  "Textile & Leather Industry Specialists"
];

const categoryGrid = document.querySelector(".category-grid");
categories.forEach(cat => {
  const div = document.createElement("div");
  div.classList.add("category-card");
  div.innerText = cat;
  categoryGrid.appendChild(div);
});

// Stats Counter Animation
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  counter.innerText = '0';
  const updateCounter = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / 200;
    if(count < target){
      counter.innerText = `${Math.ceil(count + increment)}`;
      setTimeout(updateCounter, 20);
    } else {
      counter.innerText = target;
    }
  };
  updateCounter();
});

