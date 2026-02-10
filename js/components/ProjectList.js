// ProjectList Component - Sidebar for managing projects
function ProjectList({ projects, selectedProject, onSelectProject, onProjectsChange }) {
    const e = React.createElement;
    const { useState, useEffect } = React;

    const [showProjectForm, setShowProjectForm] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectForm, setProjectForm] = useState({
        name: '',
        agreedPrice: '',
        description: '',
        status: 'Scheduling'
    });

    // Close editing form when selected project changes
    useEffect(() => {
        if (editingProject && selectedProject && editingProject.id !== selectedProject.id) {
            setEditingProject(null);
            setProjectForm({ name: '', agreedPrice: '', description: '', status: 'Scheduling' });
        }
    }, [selectedProject]);

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
        if (!projectForm.name.trim() || !projectForm.agreedPrice) return;

        const newProject = {
            id: crypto.randomUUID(), // Generate UUID before adding to state
            name: projectForm.name.trim(),
            agreedPrice: parseFloat(projectForm.agreedPrice),
            description: projectForm.description.trim(),
            status: projectForm.status,
            teamMembers: [],
            hours: [],
            changeOrders: [],
            materials: [],
            invoices: [],
            travelExpenses: [],
            fuelPrices: [],
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        onProjectsChange([...projects, newProject]);
        setProjectForm({ name: '', agreedPrice: '', description: '', status: 'Scheduling' });
        setShowProjectForm(false);
    };

    const handleUpdateProject = () => {
        if (!projectForm.name.trim() || !projectForm.agreedPrice) return;

        const updatedProject = {
            ...editingProject,
            name: projectForm.name.trim(),
            agreedPrice: parseFloat(projectForm.agreedPrice),
            description: projectForm.description.trim(),
            status: projectForm.status,
            updated_at: new Date().toISOString()
        };

        const updatedProjects = projects.map(p =>
            p.id === editingProject.id ? updatedProject : p
        );

        onProjectsChange(updatedProjects);
        
        // Update selected project if it's the one being edited
        if (selectedProject?.id === editingProject.id) {
            onSelectProject(updatedProject);
        }
        
        setEditingProject(null);
        setProjectForm({ name: '', agreedPrice: '', description: '', status: 'Scheduling' });
    };

    const handleDeleteProject = async (project) => {
        if (!confirm(`Are you sure you want to delete "${project.name}"? This action cannot be undone.`)) {
            return;
        }
        
        console.log('Delete clicked for project:', project);
        
        // First, try to delete from database if this is a saved project
        if (project.id && typeof project.id === 'string') {
            try {
                // Access window's global supabase instance set by App.js
                const supabaseClient = window.supabase;
                console.log('Supabase client:', supabaseClient ? 'found' : 'NOT FOUND');
                
                if (supabaseClient) {
                    console.log('Deleting project from database:', project.id);
                    const { error } = await supabaseClient
                        .from('projects')
                        .delete()
                        .eq('id', project.id);
                    
                    if (error) {
                        console.error('Error deleting from database:', error);
                        alert('Error deleting project: ' + error.message);
                        return;
                    }
                    console.log('Project deleted from database successfully');
                } else {
                    console.warn('Supabase client not available');
                }
            } catch (err) {
                console.error('Error deleting project:', err);
                alert('Error deleting project: ' + err.message);
                return;
            }
        }

        // Remove from local state
        console.log('Removing from local state');
        const updatedProjects = projects.filter(p => p.id !== project.id);
        onProjectsChange(updatedProjects);
        if (selectedProject?.id === project.id) {
            onSelectProject(null);
        }
    };

    return e('div', { className: "bg-slate-800 rounded-xl shadow-lg p-6 border border-slate-700" },
        e('div', { className: "flex items-center justify-between mb-4" },
            e('h2', { className: "text-xl font-bold text-white" }, 'Projects'),
            e('button', {
                onClick: () => setShowProjectForm(true),
                className: "p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            }, e(Icon, { d: "M12 5v14M5 12h14", size: 20 }))
        ),

        // Create Project Form
        showProjectForm && e('div', { className: "mb-4 p-4 bg-slate-700 rounded-lg border-2 border-blue-500" },
            e('h3', { className: "font-semibold mb-3 text-white" }, 'New Project'),
            e('input', {
                type: "text",
                placeholder: "Project Name",
                value: projectForm.name,
                onChange: event => setProjectForm({ ...projectForm, name: event.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "number",
                placeholder: "Agreed Price ($)",
                value: projectForm.agreedPrice,
                onChange: event => setProjectForm({ ...projectForm, agreedPrice: event.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('select', {
                value: projectForm.status,
                onChange: event => setProjectForm({ ...projectForm, status: event.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white"
            },
                statusOptions.map(status =>
                    e('option', { key: status, value: status }, status)
                )
            ),
            e('textarea', {
                placeholder: "Description",
                value: projectForm.description,
                onChange: event => setProjectForm({ ...projectForm, description: event.target.value }),
                className: "w-full p-2 mb-3 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400",
                rows: "8"
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
                    className: `p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedProject?.id === project.id ? 'border-blue-500 bg-slate-700' : 'border-slate-600 hover:border-blue-400 bg-slate-800'}`
                },
                    e('div', { className: "flex items-start justify-between" },
                        e('div', {
                            onClick: () => onSelectProject(project),
                            className: "flex-1"
                        },
                            e('h3', { className: "font-semibold text-white" }, project.name),
                            e('p', { className: "text-sm text-slate-400 mb-1" }, '$', metrics.adjustedPrice.toLocaleString()),
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
                                        description: project.description || '',
                                        status: project.status || 'Scheduling'
                                    });
                                },
                                className: "p-1 text-blue-400 hover:text-blue-300 hover:bg-blue-900 rounded transition-all duration-200 hover:scale-110"
                            }, e(Icon, { d: "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z", size: 16 })),
                            e('button', {
                                onClick: () => handleDeleteProject(project),
                                className: "p-1 text-red-400 hover:text-red-300 hover:bg-red-900 rounded transition-all duration-200 hover:scale-110"
                            }, e(Icon, { d: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2", size: 16 }))
                        )
                    )
                );
            })
        ),

        // Edit Project Form
        editingProject && e('div', { className: "mt-4 p-4 bg-slate-700 rounded-lg border-2 border-amber-500" },
            e('h3', { className: "font-semibold mb-3 text-white" }, 'Edit Project'),
            e('input', {
                type: "text",
                placeholder: "Project Name",
                value: projectForm.name,
                onChange: event => setProjectForm({ ...projectForm, name: event.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('input', {
                type: "number",
                placeholder: "Agreed Price ($)",
                value: projectForm.agreedPrice,
                onChange: event => setProjectForm({ ...projectForm, agreedPrice: event.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400"
            }),
            e('select', {
                value: projectForm.status,
                onChange: event => setProjectForm({ ...projectForm, status: event.target.value }),
                className: "w-full p-2 mb-2 border border-slate-600 rounded-lg bg-slate-600 text-white"
            },
                statusOptions.map(status =>
                    e('option', { key: status, value: status }, status)
                )
            ),
            e('textarea', {
                placeholder: "Description",
                value: projectForm.description,
                onChange: event => setProjectForm({ ...projectForm, description: event.target.value }),
                className: "w-full p-2 mb-3 border border-slate-600 rounded-lg bg-slate-600 text-white placeholder-slate-400",
                rows: "8"
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
