// Mobile Navigation Toggle
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger menu
    const spans = navToggle.querySelectorAll('span');
    spans[0].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity = navMenu.classList.contains('active') ? '0' : '1';
    spans[2].style.transform = navMenu.classList.contains('active') 
        ? 'rotate(-45deg) translate(7px, -6px)' : '';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
});

// Fetch GitHub Projects
async function fetchGitHubProjects() {
    const username = 'murr2k';
    const projectsGrid = document.getElementById('projectsGrid');
    
    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const repos = await response.json();
        
        // Filter out forked repositories
        const authoredRepos = repos.filter(repo => !repo.fork);
        
        // Clear skeleton loader
        projectsGrid.innerHTML = '';
        
        // Display projects
        authoredRepos.slice(0, 6).forEach(repo => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-image">
                    <img src="https://raw.githubusercontent.com/${username}/${repo.name}/main/screenshot.png" 
                         alt="${repo.name}" 
                         onerror="this.src='https://via.placeholder.com/400x200?text=${repo.name}'">
                </div>
                <div class="project-content">
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'No description available'}</p>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank">
                            <i class="fab fa-github"></i> Code
                        </a>
                        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>` : ''}
                    </div>
                </div>
            `;
            projectsGrid.appendChild(projectCard);
        });
    } catch (error) {
        console.error('Error fetching GitHub projects:', error);
        projectsGrid.innerHTML = '<p>Error loading projects. Please try again later.</p>';
    }
}

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send the data to a server
    // For GitHub Pages, you can use a service like Formspree or EmailJS
    
    // For demo purposes:
    alert(`Thank you for your message, ${data.name}! I'll get back to you soon at ${data.email}.`);
    contactForm.reset();
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubProjects();
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease';
        observer.observe(section);
    });
});