import React, { useState } from "react";
import { LiaTimesSolid } from "react-icons/lia";
import FormInput from "../input/FormInput";
import CustomBtn from "../buttons/CustomBtn";

const ProjectCreationForm = ({ isOpen, onClose, onSubmit, loading }) => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        priority: "High",
        estimatedDuration: "",
        requirements: "",
        targetAudience: "",
        budget: "",
        deliverables: "",
        constraints: "",
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name || !formData.description) {
            return;
        }

        // Create structured prompt for AI
        const structuredPrompt = `
Project Name: ${formData.name}

Project Description: ${formData.description}

Category: ${formData.category || 'Not specified'}

Priority Level: ${formData.priority}

Estimated Duration: ${formData.estimatedDuration || 'Not specified'}

Requirements: ${formData.requirements || 'Not specified'}

Target Audience: ${formData.targetAudience || 'Not specified'}

Budget: ${formData.budget || 'Not specified'}

Expected Deliverables: ${formData.deliverables || 'Not specified'}

Constraints/Limitations: ${formData.constraints || 'Not specified'}

Please help me create a detailed project plan and timeline for this project.
    `.trim();

        onSubmit(formData, structuredPrompt);

        // Reset form
        setFormData({
            name: "",
            description: "",
            category: "",
            priority: "High",
            estimatedDuration: "",
            requirements: "",
            targetAudience: "",
            budget: "",
            deliverables: "",
            constraints: "",
        });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Create New Project</h2>
                    <LiaTimesSolid
                        className="text-2xl cursor-pointer hover:text-gray-600"
                        onClick={onClose}
                    />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="font-medium text-blue-800 mb-2">📋 Project Setup Assistant</h3>
                        <p className="text-sm text-blue-700">
                            Please provide the essential details below. This information will help our AI create
                            a more accurate project plan and timeline for you.
                        </p>
                    </div>

                    {/* Required Fields */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            name="name"
                            label="Project Name *"
                            value={formData.name}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g., E-commerce Website"
                        />

                        <FormInput
                            name="category"
                            label="Project Category"
                            value={formData.category}
                            onChange={handleInputChange}
                            placeholder="e.g., Web Development, Mobile App"
                        />
                    </div>

                    <FormInput
                        name="description"
                        label="Project Description *"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe what you want to build and its main purpose..."
                        required
                        multiline
                        rows={3}
                    />

                    {/* Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Priority Level
                            </label>
                            <select
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="High">High Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="Low">Low Priority</option>
                            </select>
                        </div>

                        <FormInput
                            name="estimatedDuration"
                            label="Estimated Duration"
                            value={formData.estimatedDuration}
                            onChange={handleInputChange}
                            placeholder="e.g., 3 months, 6 weeks"
                        />
                    </div>

                    <FormInput
                        name="requirements"
                        label="Key Requirements"
                        value={formData.requirements}
                        onChange={handleInputChange}
                        placeholder="List the main features and functionalities needed..."
                        multiline
                        rows={3}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                            name="targetAudience"
                            label="Target Audience"
                            value={formData.targetAudience}
                            onChange={handleInputChange}
                            placeholder="e.g., Small businesses, Students"
                        />

                        <FormInput
                            name="budget"
                            label="Budget Range"
                            value={formData.budget}
                            onChange={handleInputChange}
                            placeholder="e.g., $5,000 - $10,000"
                        />
                    </div>

                    <FormInput
                        name="deliverables"
                        label="Expected Deliverables"
                        value={formData.deliverables}
                        onChange={handleInputChange}
                        placeholder="What should be delivered at the end? (e.g., Website, Mobile app, Documentation)"
                        multiline
                        rows={2}
                    />

                    <FormInput
                        name="constraints"
                        label="Constraints & Limitations"
                        value={formData.constraints}
                        onChange={handleInputChange}
                        placeholder="Any technical, time, or budget constraints..."
                        multiline
                        rows={2}
                    />

                    {/* Submit Button */}
                    <div className="pt-4 border-t">
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                            <p className="text-sm text-yellow-800">
                                💡 <strong>Next Step:</strong> After submitting, you'll be taken to an AI chat where you can
                                discuss additional details and refine your project plan.
                            </p>
                        </div>

                        <CustomBtn
                            title={loading ? "Creating Project..." : "Start AI Chat"}
                            type="submit"
                            disabled={loading || !formData.name || !formData.description}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProjectCreationForm;