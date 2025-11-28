// Admin Dashboard JavaScript
// Connects to your FastAPI backend and displays data beautifully

const API_URL = 'http://localhost:8000';

// ========================================
// TAB SWITCHING
// ========================================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active from all
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        
        // Add active to clicked
        btn.classList.add('active');
        const tabName = btn.getAttribute('data-tab');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        // Load data for the tab
        if (tabName === 'users') loadUsers();
        if (tabName === 'skills') loadAllSkills();
        if (tabName === 'categories') loadCategories();
    });
});

// ========================================
// LOAD OVERVIEW STATS
// ========================================
async function loadOverviewStats() {
    try {
        // Get users count
        const usersRes = await fetch(`${API_URL}/auth/users/count`);
        const usersData = await usersRes.json();
        document.getElementById('total-users').textContent = usersData.total_users;
        
        // Calculate total skills (we'll sum from all users)
        let totalSkills = 0;
        for (const user of usersData.users) {
            const skillsRes = await fetch(`${API_URL}/skills/user/${user.id || 'unknown'}`);
            if (skillsRes.ok) {
                const skillsData = await skillsRes.json();
                totalSkills += skillsData.length;
            }
        }
        document.getElementById('total-skills').textContent = totalSkills;
        
        // Check API status
        const healthRes = await fetch(`${API_URL}/health`);
        const healthData = await healthRes.json();
        document.getElementById('api-status').textContent = healthData.status === 'healthy' ? '✅ Running' : '❌ Down';
        
    } catch (error) {
        console.error('Error loading stats:', error);
        document.getElementById('api-status').textContent = '❌ Error';
    }
}

// ========================================
// LOAD USERS
// ========================================
async function loadUsers() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading users...</td></tr>';
    
    try {
        const response = await fetch(`${API_URL}/auth/users/count`);
        const data = await response.json();
        
        if (data.users.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading">No users found</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        
        for (const user of data.users) {
            // Fetch full user details
            let userDetails = user;
            try {
                const detailRes = await fetch(`${API_URL}/profile/${user.id || 'unknown'}`);
                if (detailRes.ok) {
                    userDetails = await detailRes.json();
                }
            } catch (e) {
                console.log('Could not fetch details for user:', user.email);
            }
            
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${userDetails.email || 'N/A'}</td>
                <td>${userDetails.full_name || user.name || 'N/A'}</td>
                <td>${userDetails.phone || 'Not set'}</td>
                <td>${userDetails.created_at ? new Date(userDetails.created_at).toLocaleDateString() : 'N/A'}</td>
                <td><span class="badge ${(userDetails.profile_completeness || 0) >= 80 ? 'badge-success' : 'badge-warning'}">${userDetails.profile_completeness || 0}%</span></td>
                <td><span class="badge badge-success">${userDetails.is_active ? 'Active' : 'Inactive'}</span></td>
            `;
            tbody.appendChild(row);
        }
        
    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="loading">❌ Error loading users. Make sure API is running!</td></tr>';
    }
}

// ========================================
// LOAD ALL SKILLS
// ========================================
async function loadAllSkills() {
    const tbody = document.getElementById('skills-table-body');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading skills...</td></tr>';
    
    try {
        // Get all users first
        const usersRes = await fetch(`${API_URL}/auth/users/count`);
        const usersData = await usersRes.json();
        
        // Get categories for mapping
        const categoriesRes = await fetch(`${API_URL}/skills/categories`);
        const categories = await categoriesRes.json();
        const categoryMap = {};
        categories.forEach(cat => categoryMap[cat.id] = cat.name);
        
        tbody.innerHTML = '';
        let totalSkills = 0;
        
        // Fetch skills for each user
        for (const user of usersData.users) {
            try {
                const skillsRes = await fetch(`${API_URL}/skills/user/${user.id}`);
                if (skillsRes.ok) {
                    const skills = await skillsRes.json();
                    
                    skills.forEach(skill => {
                        totalSkills++;
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${user.email}</td>
                            <td>${skill.skill_name}</td>
                            <td>${categoryMap[skill.category_id] || 'Unknown'}</td>
                            <td>${skill.experience_years} years</td>
                            <td>${skill.hourly_rate ? `$${skill.hourly_rate} ${skill.currency}` : 'Not set'}</td>
                            <td><span class="badge ${skill.is_available ? 'badge-success' : 'badge-warning'}">${skill.is_available ? 'Available' : 'Unavailable'}</span></td>
                        `;
                        tbody.appendChild(row);
                    });
                }
            } catch (e) {
                console.log('Could not fetch skills for:', user.email);
            }
        }
        
        if (totalSkills === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="loading">No skills found yet</td></tr>';
        }
        
    } catch (error) {
        console.error('Error loading skills:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="loading">❌ Error loading skills</td></tr>';
    }
}

// ========================================
// LOAD CATEGORIES
// ========================================
async function loadCategories() {
    const grid = document.getElementById('categories-grid');
    grid.innerHTML = '<div class="loading">Loading categories...</div>';
    
    try {
        const response = await fetch(`${API_URL}/skills/categories`);
        const categories = await response.json();
        
        grid.innerHTML = '';
        
        categories.forEach(category => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.innerHTML = `
                <div class="icon">${category.icon || '📦'}</div>
                <h3>${category.name}</h3>
                <p>${category.description || 'No description'}</p>
            `;
            grid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading categories:', error);
        grid.innerHTML = '<div class="loading">❌ Error loading categories</div>';
    }
}

// ========================================
// INITIALIZE ON PAGE LOAD
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Admin Dashboard Loaded!');
    console.log('📡 API URL:', API_URL);
    
    // Load overview stats on startup
    loadOverviewStats();
    
    console.log('✅ Dashboard ready! Click tabs to view data.');
});