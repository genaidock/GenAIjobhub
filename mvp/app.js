const jobs = [
    {
        id: 1,
        title: "Senior Prompt Engineer",
        company: "Anthropic",
        location: "Remote (Global)",
        type: "Full-Time",
        salary: "$140k - $180k",
        posted: "2h ago",
        tags: ["LLMs", "Claude", "Python"]
    },
    {
        id: 2,
        title: "AI Product Manager",
        company: "Bharat AI",
        location: "Bangalore, IN",
        type: "Full-Time",
        salary: "₹35L - ₹50L",
        posted: "5h ago",
        tags: ["Product", "Strategy", "Generative AI"]
    },
    {
        id: 3,
        title: "Machine Learning Engineer",
        company: "OpenAI",
        location: "San Francisco, CA",
        type: "Full-Time",
        salary: "$160k - $220k",
        posted: "1d ago",
        tags: ["PyTorch", "NLP", "C++"]
    },
    {
        id: 4,
        title: "AI Automation Consultant",
        company: "GrowthX",
        location: "Remote (India)",
        type: "Contract",
        salary: "$5k - $8k / mo",
        posted: "2d ago",
        tags: ["Zapier", "Make", "OpenAI API"]
    },
    {
        id: 5,
        title: "Freelance Chatbot Developer",
        company: "TechNova Solutions",
        location: "Remote (Global)",
        type: "Freelance Gig",
        salary: "$1,500 / project",
        posted: "3d ago",
        tags: ["Botpress", "Dialogflow", "JS"]
    }
];

function renderJobs(jobsToRender) {
    const container = document.getElementById('job-board-container');
    container.innerHTML = '';

    if (jobsToRender.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 3rem;">No jobs found matching your criteria.</p>';
        return;
    }

    jobsToRender.forEach(job => {
        const tagsHtml = job.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
        
        const jobCard = `
            <div class="job-card">
                <div class="job-info">
                    <h3>${job.title}</h3>
                    <div class="job-meta">
                        <span class="company-name">${job.company}</span>
                        <span>📍 ${job.location}</span>
                        <span>💼 ${job.type}</span>
                        <span>⏱️ ${job.posted}</span>
                    </div>
                    <div class="tags">
                        ${tagsHtml}
                    </div>
                </div>
                <div class="job-action">
                    <div class="salary">${job.salary}</div>
                    <button class="btn-primary">Apply Now</button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', jobCard);
    });
}

// Initial Render
document.addEventListener('DOMContentLoaded', () => {
    renderJobs(jobs);

    // Simple search functionality
    const searchInput = document.getElementById('job-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const filteredJobs = jobs.filter(job => 
                job.title.toLowerCase().includes(searchTerm) || 
                job.company.toLowerCase().includes(searchTerm) ||
                job.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
            renderJobs(filteredJobs);
        });
    }
});
