// Main App Component
function App() {
    const e = React.createElement;
    const { useState, useEffect } = React;

    // State
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    // Load projects from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('constructionProjects');
        if (stored) {
            setProjects(JSON.parse(stored));
        }
    }, []);

    // Save projects to localStorage whenever they change
    useEffect(() => {
        if (projects.length > 0) {
            localStorage.setItem('constructionProjects', JSON.stringify(projects));
        }
    }, [projects]);

    // Update a project and keep selectedProject in sync
    const updateProject = (updatedProject) => {
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
        setSelectedProject(updatedProject);
    };

    return e('div', { className: "min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6" },
        e('div', { className: "max-w-7xl mx-auto" },
            // Header
            e('div', { className: "bg-white rounded-xl shadow-lg p-6 mb-6" },
                e('h1', { className: "text-3xl font-bold text-slate-800 mb-2" }, 'Construction Job Tracker'),
                e('p', { className: "text-slate-600" }, 'Manage your projects, team, hours, materials, payments, and budgets')
            ),

            // Main Content Grid
            e('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" },
                // Sidebar - Project List
                e('div', { className: "lg:col-span-1" },
                    e(ProjectList, {
                        projects: projects,
                        selectedProject: selectedProject,
                        onSelectProject: setSelectedProject,
                        onProjectsChange: setProjects
                    })
                ),

                // Main Content Area
                e('div', { className: "lg:col-span-2" },
                    selectedProject
                        ? e('div', { className: "space-y-6" },
                            e(BudgetOverview, { project: selectedProject }),
                            e(TeamMembers, { project: selectedProject, onUpdate: updateProject }),
                            e(HoursLogged, { project: selectedProject, onUpdate: updateProject }),
                            e(ChangeOrders, { project: selectedProject, onUpdate: updateProject }),
                            e(Materials, { project: selectedProject, onUpdate: updateProject }),
                            e(Payments, { project: selectedProject, onUpdate: updateProject })
                        )
                        : e('div', { className: "bg-white rounded-xl shadow-lg p-12 text-center" },
                            e(Icon, { d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", size: 64 }),
                            e('h2', { className: "text-2xl font-bold text-slate-800 mb-2" }, 'No Project Selected'),
                            e('p', { className: "text-slate-600" }, 'Select a project from the sidebar or create a new one to get started')
                        )
                )
            )
        )
    );
}
