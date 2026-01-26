// ProjectList Component - Sidebar for managing projects
function ProjectList({ projects, selectedProject, onSelectProject, onProjectsChange }) {
    const e = React.createElement;
    const { useState } = React;

    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectForm, setProjectForm] = useState({
        name: '',
        agreedPrice: '',
        description: '',
        status: 'Scheduling'
    });

    const statusOptions = [
        'Scheduling',
        'Quoting',
        'In Progress',
        'Awaiting Final Payment',
        'Awaiting Materials Payment',
        'Completed'
    ];

    const getStatusColor = (status) => {
        const colors = {
            'Scheduling': 'bg-gray-100 text-gray-700',
            'Quoting': 'bg-yellow-100 text-yellow-700',
            'In Progress': 'bg-blue-100 text-blue-700',
            'Awaiting Final Payment': 'bg-orange-100 text-orange-700',
            'Awaiting Materials Payment': 'bg-purple-100 text-purple-700',
            'Completed': 'bg-green-100 text-green-700'
        };
        return colors[status] || 'bg-gray-100 text-gray-700';
    };

    const handleCreateProject = () => {
        if (!projectForm.name || !projectForm.agreedPrice) return;

        const newProject = {
            name: projectForm.name,
            agreedPrice: parseFloat(projectForm.agreedPrice),
            description: projectForm.description,
            status: projectForm.status,
            teamMembers: [],
            hours: [],
            changeOrders: [],
            materials: [],
            payments: []
        };

        onProjectsChange([...projects, newProject]);
        setProjectForm({ name: '', agreedPrice: '', description: '', status: 'Scheduling' });
        setShowProjectForm(false);
    };

    const handleUpdateProject = () => {
        if (!projectForm.name || !projectForm.agreedPrice) return;

        const updatedProjects = projects.map(p =>
            p.id === editingProject.id
                ? { ...p, name: projectForm.name, agreedPrice: parseFloat(projectForm.agreedPrice), description: projectForm.description, status: projectForm.status }
                : p
        );

        onProjectsChange(updatedProjects);
        if (selectedProject?.id === editingProject.id) {
            onSelectProject({ ...selectedProject, name: projectForm.name, agreedPrice: parseFloat(projectForm.agreedPrice), description: projectForm.description, status: projectForm.status });
        }
        setEditingProject(null);
        setProjectForm({ name: '', agreedPrice: '', description: '', status: 'Scheduling' });
    };

    const handleDeleteProject = (project) => {
        const updatedProjects = projects.filter(p => p.id !== project.id);
        onProjectsChange(updatedProjects);
        if (selectedProject?.id === project.id) {
            onSelectProject(null);
        }
    };

    return e('div', { className: "bg-white rounded-xl shadow-lg p-6" },
        e('div', { className: "flex items-center justify-between mb-4" },
            e('h2', { className: "text-xl font-bold text-slate-800" }, 'Projects'),
            e('button', {
                onClick: () => setShowProjectForm(true),
                className: "p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            }, e(Icon, { d: "M12 5v14M5 12h14", size: 20 }))
        ),

        // Create Project Form
        showProjectForm && e('div', { className: "mb-4 p-4 bg-slate-50 rounded-lg border-2 border-blue-200" },
            e('h3', { className: "font-semibold mb-3 text-slate-700" }, 'New Project'),
            e('input', {
                type: "text",
                placeholder: "Project Name",
                value: projectForm.name,
                onChange: event => setProjectForm({ ...projectForm, name: event.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "number",
                placeholder: "Agreed Price ($)",
                value: projectForm.agreedPrice,
                onChange: event => setProjectForm({ ...projectForm, agreedPrice: event.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('select', {
                value: projectForm.status,
                onChange: event => setProjectForm({ ...projectForm, status: event.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            },
                statusOptions.map(status =>
                    e('option', { key: status, value: status }, status)
                )
            ),
            e('textarea', {
                placeholder: "Description",
                value: projectForm.description,
                onChange: event => setProjectForm({ ...projectForm, description: event.target.value }),
                className: "w-full p-2 mb-3 border rounded-lg",
                rows: "2"
            }),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleCreateProject,
                    className: "flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
                },
                    e(Icon, { d: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z", size: 16 }),
                    ' Create'
                ),
                e('button', {
                    onClick: () => {
                        setShowProjectForm(false);
                        setProjectForm({ name: '', agreedPrice: '', description: '', status: 'Scheduling' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Project List
        e('div', { className: "space-y-2 max-h-96 overflow-y-auto" },
            projects.map(project => {
                const metrics = calculateProjectMetrics(project);
                return e('div', {
                    key: project.id,
                    className: `p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedProject?.id === project.id ? 'border-blue-500 bg-blue-50' : 'border-slate-200 hover:border-blue-300 bg-white'}`
                },
                    e('div', { className: "flex items-start justify-between" },
                        e('div', {
                            onClick: () => onSelectProject(project),
                            className: "flex-1"
                        },
                            e('h3', { className: "font-semibold text-slate-800" }, project.name),
                            e('p', { className: "text-sm text-slate-600 mb-1" }, '$', metrics.adjustedPrice.toLocaleString()),
                            e('span', {
                                className: `inline-block px-2 py-0.5 text-xs font-medium rounded ${getStatusColor(project.status || 'Scheduling')}`
                            }, project.status || 'Scheduling')
                        ),
                        e('div', { className: "flex gap-1" },
                            e('button', {
                                onClick: () => {
                                    setEditingProject(project);
                                    setProjectForm({
                                        name: project.name,
                                        agreedPrice: project.agreedPrice.toString(),
                                        description: project.description,
                                        status: project.status || 'Scheduling'
                                    });
                                },
                                className: "p-1 text-blue-600 hover:bg-blue-100 rounded"
                            }, e(Icon, { d: "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z", size: 16 })),
                            e('button', {
                                onClick: () => handleDeleteProject(project),
                                className: "p-1 text-red-600 hover:bg-red-100 rounded"
                            }, e(Icon, { d: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2", size: 16 }))
                        )
                    )
                );
            })
        ),

        // Edit Project Form
        editingProject && e('div', { className: "mt-4 p-4 bg-amber-50 rounded-lg border-2 border-amber-300" },
            e('h3', { className: "font-semibold mb-3 text-slate-700" }, 'Edit Project'),
            e('input', {
                type: "text",
                placeholder: "Project Name",
                value: projectForm.name,
                onChange: event => setProjectForm({ ...projectForm, name: event.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "number",
                placeholder: "Agreed Price ($)",
                value: projectForm.agreedPrice,
                onChange: event => setProjectForm({ ...projectForm, agreedPrice: event.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('select', {
                value: projectForm.status,
                onChange: event => setProjectForm({ ...projectForm, status: event.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            },
                statusOptions.map(status =>
                    e('option', { key: status, value: status }, status)
                )
            ),
            e('textarea', {
                placeholder: "Description",
                value: projectForm.description,
                onChange: event => setProjectForm({ ...projectForm, description: event.target.value }),
                className: "w-full p-2 mb-3 border rounded-lg",
                rows: "2"
            }),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleUpdateProject,
                    className: "flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center justify-center gap-2"
                },
                    e(Icon, { d: "M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z", size: 16 }),
                    ' Update'
                ),
                e('button', {
                    onClick: () => {
                        setEditingProject(null);
                        setProjectForm({ name: '', agreedPrice: '', description: '', status: 'Scheduling' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        )
    );
}
