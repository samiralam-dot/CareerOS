/**
 * Admin Account Seeder Script (Frontend Only)
 * Same structure, Firebase removed
 */

const adminAccounts = [
    {
        email: 'admin@careeros.com',
        password: 'Admin@2026',
        fullName: 'Super Admin',
    },
    {
        email: 'placement.admin@careeros.com',
        password: 'Placement@2026',
        fullName: 'Placement Admin',
    },
    {
        email: 'samir.admin@careeros.com',
        password: 'Samir@2026',
        fullName: 'Samir Admin',
    },
];

async function seedAdmin(account) {
    try {
        // Get existing users
        const existing = JSON.parse(localStorage.getItem('users')) || [];

        // Check if already exists
        const alreadyExists = existing.find(u => u.email === account.email);

        if (alreadyExists) {
            console.log(`  Already exists: ${account.email}`);
            return false;
        }

        // Create new user object (same structure)
        const newUser = {
            uid: Date.now().toString(), // fake UID
            email: account.email,
            fullName: account.fullName,
            password: account.password,
            role: 'admin',
            verified: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        // Save to localStorage
        existing.push(newUser);
        localStorage.setItem('users', JSON.stringify(existing));

        console.log(` Created admin: ${account.email} (UID: ${newUser.uid})`);
        return true;

    } catch (error) {
        console.error(` Failed to create ${account.email}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('Seeding admin accounts...\n');

    for (const account of adminAccounts) {
        await seedAdmin(account);
    }

    console.log('\n Done! Admin accounts are ready.');
    console.log('\nCredentials:');

    for (const acc of adminAccounts) {
        console.log(`   Email: ${acc.email} | Password: ${acc.password}`);
    }
}

main();