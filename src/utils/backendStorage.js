// Backend API for saving users to Excel (server-side)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Save users to Excel on backend
export async function saveUsersToBackend(users) {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ users }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Failed to save users to backend');
    }

    console.log(`✅ Saved ${result.count} users to backend Excel`);
    return result;
  } catch (error) {
    console.error('Error saving users to backend:', error);
    throw error;
  }
}

// Get users from backend Excel
export async function getUsersFromBackend() {
  try {
    const response = await fetch(`${API_BASE_URL}/users`);

    if (!response.ok) {
      throw new Error('Failed to fetch users from backend');
    }

    const users = await response.json();
    return users;
  } catch (error) {
    console.error('Error fetching users from backend:', error);
    return [];
  }
}

