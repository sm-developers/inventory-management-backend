const UserModel = require('../../src/models/Users');

(async () => {
    try {
        // Create a test user
        const user = {
            userId: 'user1',
            name: 'Admin User',
            role: 'admin',
            password: 'admin123',
        };
        await UserModel.createUser(user);
        console.log('User created successfully');

        // Fetch the test user
        const fetchedUser = await UserModel.getUserById('user1');
        console.log('Fetched User:', fetchedUser);
    } catch (error) {
        console.error('Error testing Users model:', error);
    }
})();
