import Department from '../domain/department.js';

export const createDepartment = async (data) => {
    const dept = new Department(data);
    await dept.save();
    return dept;
};

export const getAllDepartments = async () => {
    return await Department.find().sort({ name: 1 });
};

export const getDepartmentById = async (id) => {
    return await Department.findById(id);
};

export const updateDepartment = async (id, updates) => {
    return await Department.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteDepartment = async (id) => {
    return await Department.findByIdAndDelete(id);
};