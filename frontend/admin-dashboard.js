// Admin Dashboard JavaScript
// Full CRUD Operations with Beautiful UI

const API_URL = 'http://localhost:8000';
let adminToken = '';
let adminInfo = {};
let allUsers = [];
let allAdmins = [];

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    // Check authentication
    adminToken = localStorage.getItem('admin_token');
    const adminInfoStr = localStorage.getItem('admin_info');
    
    if (!adminToken || !adminInfoStr) {
        window.location.href = 'admin-login.html';
        return;
    }
    
    adminInfo = JSON.parse(adminInfoStr);
    
    // Display admin info
    document.getElementById('admin-name').textContent = adminInfo.full_name;
    document.getElementById('admin-role').textContent = adminInfo.role === 'super_admin' ? 'Super Admin' : 'Admin';
    
    // Hide admin management if not super admin
    if (adminInfo.role !== 'super_admin') {
        document.querySelector('[data-section="admins"]').style.display = 'none';
    }
    
    // Load initial data
    loadDashboard();
    
    console.log('✅ Admin Dashboard Loaded');
    console.log('👤 Logged in as:', adminInfo.email);
});

// ========================================
// SECTION SWITCHING
// ========================================

function switchSection(sectionName) {
    // Update menu
    document.querySelectorAll('.menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update content
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(`${sectionName}-section`).classList.add('active');
    
    // Load section data
    if (sectionName === 'users') loadUsers();
    if (sectionName === 'skills') loadAllSkills();
    if (sectionName === 'categories') loadCategories();
    if (sectionName === 'activity') loadActivityLogs();
    if (sectionName === 'admins') loadAdmins();
}

// ========================================
// DASHBOARD OVERVIEW
// ========================================

async function loadDashboard() {
    await refreshStats();
}

async function refreshStats() {
    try {
        const response = await fetch(`${API_URL}/admin/stats`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load stats');
        
        const stats = await response.json();
        
        document.getElementById('stat-total-users').textContent = stats.total_users;
        document.getElementById('stat-active-users').textContent = stats.active_users;
        document.getElementById('stat-total-skills').textContent = stats.total_skills;
        document.getElementById('stat-total-admins').textContent = stats.total_admins;
        
    } catch (error) {
        console.error('Error loading stats:', error);
        showNotification('Error loading statistics', 'error');
    }
}

// ========================================
// USER MANAGEMENT
// ========================================

async function loadUsers() {
    const tbody = document.getElementById('users-table-body');
    tbody.innerHTML = '<tr><td colspan="7" class="loading">Loading users...</td></tr>';
    
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load users');
        
        allUsers = await response.json();
        
        if (allUsers.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="loading">No users found</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        
        allUsers.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.email}</td>
                <td>${user.full_name}</td>
                <td>${user.phone || 'Not set'}</td>
                <td>${new Date(user.created_at).toLocaleDateString()}</td>
                <td>
                    <span class="badge ${(user.profile_completeness || 0) >= 80 ? 'badge-success' : 'badge-warning'}">
                        ${user.profile_completeness || 0}%
                    </span>
                </td>
                <td>
                    <span class="badge ${user.is_active ? 'badge-success' : 'badge-danger'}">
                        ${user.is_active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    <button class="btn-icon-small" onclick="viewUser('${user.id}')" title="View">👁️</button>
                    <button class="btn-icon-small" onclick="editUser('${user.id}')" title="Edit">✏️</button>
                    <button class="btn-icon-small danger" onclick="deleteUser('${user.id}', '${user.email}')" title="Delete">🗑️</button>
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading users:', error);
        tbody.innerHTML = '<tr><td colspan="7" class="loading">❌ Error loading users</td></tr>';
        showNotification('Error loading users', 'error');
    }
}

function openCreateUserModal() {
    document.getElementById('create-user-modal').classList.add('active');
}

function closeCreateUserModal() {
    document.getElementById('create-user-modal').classList.remove('active');
    document.getElementById('create-user-form').reset();
}

// Handle create user form
document.getElementById('create-user-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        email: formData.get('email'),
        full_name: formData.get('full_name'),
        password: formData.get('password'),
        phone: formData.get('phone') || null,
        bio: formData.get('bio') || null,
        latitude: formData.get('latitude') ? parseFloat(formData.get('latitude')) : null,
        longitude: formData.get('longitude') ? parseFloat(formData.get('longitude')) : null,
        is_active: true
    };
    
    try {
        const response = await fetch(`${API_URL}/admin/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(userData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create user');
        }
        
        showNotification('✅ User created successfully!', 'success');
        closeCreateUserModal();
        loadUsers();
        refreshStats();
        
    } catch (error) {
        console.error('Error creating user:', error);
        showNotification('❌ ' + error.message, 'error');
    }
});

function viewUser(userId) {
    const user = allUsers.find(u => u.id === userId);
    if (!user) return;
    
    alert(`User Details:\n\nEmail: ${user.email}\nName: ${user.full_name}\nPhone: ${user.phone || 'Not set'}\nBio: ${user.bio || 'Not set'}\nCreated: ${new Date(user.created_at).toLocaleString()}`);
}

function editUser(userId) {
    showNotification('Edit feature coming soon! Use /docs for now.', 'info');
}

async function deleteUser(userId, userEmail) {
    if (!confirm(`Are you sure you want to delete user: ${userEmail}?\n\nThis action cannot be undone!`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete user');
        
        showNotification('✅ User deleted successfully', 'success');
        loadUsers();
        refreshStats();
        
    } catch (error) {
        console.error('Error deleting user:', error);
        showNotification('❌ Error deleting user', 'error');
    }
}

// User search
document.getElementById('user-search')?.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#users-table-body tr');
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        row.style.display = text.includes(searchTerm) ? '' : 'none';
    });
});

// ========================================
// SKILLS MANAGEMENT
// ========================================

async function loadAllSkills() {
    const tbody = document.getElementById('skills-table-body');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading skills...</td></tr>';
    
    try {
        // Get categories for mapping
        const categoriesRes = await fetch(`${API_URL}/skills/categories`);
        const categories = await categoriesRes.json();
        const categoryMap = {};
        categories.forEach(cat => categoryMap[cat.id] = cat.name);
        
        // Get all users
        const usersRes = await fetch(`${API_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const users = await usersRes.json();
        
        tbody.innerHTML = '';
        let totalSkills = 0;
        
        // Fetch skills for each user
        for (const user of users) {
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
                            <td>
                                <span class="badge ${skill.is_available ? 'badge-success' : 'badge-warning'}">
                                    ${skill.is_available ? 'Available' : 'Unavailable'}
                                </span>
                            </td>
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
// CATEGORIES
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
                <div class="category-icon">${category.icon || '📦'}</div>
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
// ACTIVITY LOGS
// ========================================

async function loadActivityLogs() {
    const tbody = document.getElementById('activity-table-body');
    tbody.innerHTML = '<tr><td colspan="5" class="loading">Loading activity logs...</td></tr>';
    
    try {
        const response = await fetch(`${API_URL}/admin/activity-logs?limit=50`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load logs');
        
        const logs = await response.json();
        
        if (logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="loading">No activity yet</td></tr>';
            return;
        }
        
        tbody.innerHTML = '';
        
        logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.admin_id}</td>
                <td><span class="badge badge-info">${log.action}</span></td>
                <td>${log.target_type}</td>
                <td>${log.details ? JSON.stringify(log.details).substring(0, 50) + '...' : 'N/A'}</td>
                <td>${new Date(log.created_at).toLocaleString()}</td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading logs:', error);
        tbody.innerHTML = '<tr><td colspan="5" class="loading">❌ Error loading logs</td></tr>';
    }
}

// ========================================
// ADMIN MANAGEMENT
// ========================================

async function loadAdmins() {
    if (adminInfo.role !== 'super_admin') {
        showNotification('Only Super Admins can manage admin accounts', 'warning');
        return;
    }
    
    const tbody = document.getElementById('admins-table-body');
    tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading admins...</td></tr>';
    
    try {
        const response = await fetch(`${API_URL}/admin/admins`, {
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to load admins');
        
        allAdmins = await response.json();
        
        tbody.innerHTML = '';
        
        allAdmins.forEach(admin => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${admin.email}</td>
                <td>${admin.full_name}</td>
                <td><span class="badge badge-primary">${admin.role}</span></td>
                <td>${admin.last_login ? new Date(admin.last_login).toLocaleString() : 'Never'}</td>
                <td>
                    <span class="badge ${admin.is_active ? 'badge-success' : 'badge-danger'}">
                        ${admin.is_active ? 'Active' : 'Inactive'}
                    </span>
                </td>
                <td>
                    ${admin.id !== adminInfo.id ? `
                        <button class="btn-icon-small danger" onclick="deleteAdmin('${admin.id}', '${admin.email}')" title="Delete">🗑️</button>
                    ` : '<span class="text-muted">Current User</span>'}
                </td>
            `;
            tbody.appendChild(row);
        });
        
    } catch (error) {
        console.error('Error loading admins:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="loading">❌ Error loading admins</td></tr>';
    }
}

function openCreateAdminModal() {
    if (adminInfo.role !== 'super_admin') {
        showNotification('Only Super Admins can create admin accounts', 'warning');
        return;
    }
    document.getElementById('create-admin-modal').classList.add('active');
}

function closeCreateAdminModal() {
    document.getElementById('create-admin-modal').classList.remove('active');
    document.getElementById('create-admin-form').reset();
}

// Handle create admin form
document.getElementById('create-admin-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const adminData = {
        email: formData.get('email'),
        full_name: formData.get('full_name'),
        password: formData.get('password'),
        role: formData.get('role')
    };
    
    try {
        const response = await fetch(`${API_URL}/admin/admins`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify(adminData)
        });
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.detail || 'Failed to create admin');
        }
        
        showNotification('✅ Admin created successfully!', 'success');
        closeCreateAdminModal();
        loadAdmins();
        refreshStats();
        
    } catch (error) {
        console.error('Error creating admin:', error);
        showNotification('❌ ' + error.message, 'error');
    }
});

async function deleteAdmin(adminId, adminEmail) {
    if (!confirm(`Are you sure you want to delete admin: ${adminEmail}?\n\nThis action cannot be undone!`)) {
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/admin/admins/${adminId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${adminToken}`
            }
        });
        
        if (!response.ok) throw new Error('Failed to delete admin');
        
        showNotification('✅ Admin deleted successfully', 'success');
        loadAdmins();
        refreshStats();
        
    } catch (error) {
        console.error('Error deleting admin:', error);
        showNotification('❌ Error deleting admin', 'error');
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    localStorage.setItem('dark_mode', isDark);
    showNotification(isDark ? '🌙 Dark mode enabled' : '☀️ Light mode enabled', 'info');
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_info');
        window.location.href = 'admin-login.html';
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}