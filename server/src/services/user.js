import * as userModel from '../models/user.js'
import { validateUserData } from '../utils/validator.js';

export async function getAllUsers() {
    return userModel.getAllUsers();
}

/**
 * Get user by ID
 */
export async function getUserById(userId) {
    return userModel.getUserById(userId);
}

/**
 * Update user by ID
 */
export async function updateUser(userId, updatedData) {
    validateUserData(updatedData);
    await userModel.updateUser(userId, updatedData);

    return getUserById(userId);
}

/**
 * Delete user by ID
 */
export async function deleteUser(userId) {
    return userModel.deleteUser(userId);
}
