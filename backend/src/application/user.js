import User from '../domain/user.js';

export const createUser = async ({ name, email, password, role, department, phone }) => {
    const user = new User({ name, email, password, role, department, phone });
    await user.save();
    return user;
};

export const getAllUsers = async () => {
    return await User.find().select('-password').sort({ createdAt: -1 });
};

export const getUserById = async (id) => {
    return await User.findById(id).select('-password');
};

export const getUserByEmail = async (email) => {
    return await User.findOne({ email });
};

export const updateUser = async (id, updates) => {
    if (updates.password) {
        const bcrypt = await import('bcryptjs');
        updates.password = await bcrypt.default.hash(updates.password, 10);
    }
    return await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
};

export const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};

export const getUsersByRole = async (role) => {
    return await User.find({ role }).select('-password');
};

export const getUsersByDepartment = async (department) => {
    return await User.find({ department, role: 'agent' }).select('-password');
};