// Main App Component
function App() {
    const e = React.createElement;
    const { useState, useEffect } = React;

    // State
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [supabase, setSupabase] = useState(null);

    // Load projects from Supabase
    const loadProjectsFromSupabase = async (client, userId) => {
        try {
            console.log('Loading projects for user:', userId);
            
            const { data, error } = await client
                .from('projects')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error loading projects:', error);
                setProjects([]);
            } else {
                console.log('Loaded projects:', data);
                setProjects(data || []);
            }
        } catch (err) {
            console.error('Error loading projects:', err);
            setProjects([]);
        } finally {
            setLoading(false);
        }
    };

    // Refresh a single project from the database
    const refreshSelectedProject = async (projectId) => {
        if (!supabase || !projectId) return;
        
        try {
            console.log('Refreshing project data for:', projectId);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', projectId)
                .single();
            
            if (error) {
                console.error('Error refreshing project:', error);
                return;
            }
            
            if (data) {
                console.log('Project refreshed:', data);
                setSelectedProject(data);
                // Also update in the projects list
                setProjects(projects.map(p => p.id === projectId ? data : p));
            }
        } catch (err) {
            console.error('Error refreshing project:', err);
        }
    };

    // Initialize Supabase and load user on mount
    useEffect(() => {
        const initSupabase = async () => {
            const { createClient } = await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm');
            
            const SUPABASE_URL = "https://gkxjksbctyunshcsayjj.supabase.co";
            const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdreGprc2JjdHl1bnNoY3NheWpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0NDkwNjcsImV4cCI6MjA4NTAyNTA2N30.jz5e0qEN9pfS43gesX4tIHgxNPWrshd3bo9_ECeGjcg";
            
            const client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            setSupabase(client);
            
            // Make supabase available globally for other components
            window.supabase = client;

            // Get current user
            const { data: { user }, error: userError } = await client.auth.getUser();
            
            if (userError || !user) {
                console.log('No user found, redirecting to login');
                window.location.href = 'index.html';
                return;
            }

            console.log('User authenticated:', user.email);
            setCurrentUser(user);
            
            // Load projects for this user
            await loadProjectsFromSupabase(client, user.id);
        };

        initSupabase();
    }, []);

    // Save projects to Supabase whenever they change
    useEffect(() => {
        if (supabase && currentUser && projects.length > 0) {
            saveProjectsToSupabase();
        }
    }, [projects]);

    // Logout function
    const handleLogout = async () => {
        try {
            if (supabase) {
                await supabase.auth.signOut();
            }
            // Redirect to login - Supabase automatically clears session storage
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Logout error:', error);
            // Force redirect even if logout fails
            window.location.href = 'index.html';
        }
    };

    // Save projects to Supabase
    const saveProjectsToSupabase = async () => {
        if (!supabase || !currentUser) {
            console.warn('Cannot save: Missing supabase or currentUser');
            return;
        }

        try {
            console.log('Saving projects for user:', currentUser.id, 'Count:', projects.length);
            
            if (projects.length === 0) {
                console.log('No projects to save');
                return;
            }

            // Prepare projects with user_id
            const projectsToSave = projects.map(p => ({
                ...p,
                user_id: currentUser.id
            }));

            // Use upsert to safely update projects (insert if new, update if exists)
            // onConflict: 'id' means if a project with this ID already exists, update it instead
            const { data, error: upsertError } = await supabase
                .from('projects')
                .upsert(projectsToSave, { onConflict: 'id' });

            if (upsertError) {
                console.error('Upsert error:', upsertError);
                alert('Error saving projects: ' + upsertError.message);
                throw upsertError;
            }

            console.log('Projects saved successfully');
        } catch (error) {
            console.error('Error saving projects:', error);
        }
    };

    // Update a project and keep selectedProject in sync
    const updateProject = (updatedProject) => {
        setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p));
        setSelectedProject(updatedProject);
    };

    return e('div', { className: "min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6" },
        e('div', { className: "max-w-7xl mx-auto" },
            // Header
            e('div', { className: "bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl shadow-lg p-6 mb-6 border border-slate-600 border-opacity-50" },
                e('div', { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6" },
                    e('div', { className: "flex-1" },
                        e('div', { className: "flex items-center gap-3 mb-3" },
                            e('div', { className: "w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md" },
                                e('svg', { 
                                    viewBox: "0 0 24 24",
                                    className: "w-6 h-6 text-white",
                                    style: { stroke: 'currentColor', strokeWidth: 2, fill: 'none' }
                                },
                                    e('path', { d: "M3 12l9-9 9 9M4 13v6a2 2 0 002 2h12a2 2 0 002-2v-6M9 18h6" })
                                )
                            ),
                            e('h1', { className: "text-3xl font-bold text-white" }, 'Construction Projects Tracker')
                        ),
                        e('p', { className: "text-slate-300 ml-13" }, 'Manage your projects, team, hours, materials, payments, and budgets'),
                        currentUser && e('p', { className: "text-sm text-slate-400 mt-2 ml-13 flex items-center gap-2" }, 
                            e('svg', { viewBox: "0 0 24 24", className: "w-4 h-4", style: { stroke: 'currentColor', strokeWidth: 2, fill: 'none' } },
                                e('path', { d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2M12 3a4 4 0 110 8 4 4 0 010-8z" })
                            ),
                            currentUser.email
                        )
                    ),
                    e('button', { 
                        onClick: handleLogout,
                        className: "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg whitespace-nowrap flex items-center justify-center gap-2 self-start sm:self-center"
                    }, 
                        e('svg', { viewBox: "0 0 24 24", className: "w-5 h-5", style: { stroke: 'currentColor', strokeWidth: 2, fill: 'none' } },
                            e('path', { d: "M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" })
                        ),
                        'Logout'
                    )
                )
            ),

            // Loading state
            loading
                ? e('div', { className: "bg-slate-800 rounded-xl shadow-lg p-12 text-center border border-slate-700" },
                    e('div', { className: "flex flex-col items-center gap-4" },
                        e('div', { className: "w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin" }),
                        e('p', { className: "text-slate-300 text-lg" }, 'Loading your projects...')
                    )
                )
                : e('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" },
                    // Sidebar - Project List
                    e('div', { className: "lg:col-span-1" },
                        e(ProjectList, {
                            projects: projects,
                            selectedProject: selectedProject,
                            onSelectProject: (project) => {
                                setSelectedProject(project);
                                // Refresh the project data from the database
                                if (project && project.id) {
                                    refreshSelectedProject(project.id);
                                }
                            },
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
                            : projects.length === 0
                                ? e('div', { className: "bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg p-12 text-center border border-slate-600" },
                                    e('div', { className: "mb-6" },
                                        e('div', { className: "w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" },
                                            e('svg', { viewBox: "0 0 24 24", className: "w-10 h-10 text-white", style: { stroke: 'currentColor', strokeWidth: 2, fill: 'none' } },
                                                e('path', { d: "M12 4v16m8-8H4" })
                                            )
                                        )
                                    ),
                                    e('h2', { className: "text-3xl font-bold text-white mb-3" }, 'Welcome to Construction Tracker'),
                                    e('p', { className: "text-slate-300 mb-6 text-lg" }, 'Get started by creating your first project'),
                                    e('p', { className: "text-slate-400" }, 'Click the + button in the Projects sidebar to create a new project and start tracking')
                                )
                                : e('div', { className: "bg-gradient-to-br from-slate-800 to-slate-700 rounded-xl shadow-lg p-12 text-center border border-slate-600" },
                                    e('div', { className: "mb-6" },
                                        e('div', { className: "w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-slate-600" },
                                            e('svg', { viewBox: "0 0 24 24", className: "w-10 h-10 text-slate-400", style: { stroke: 'currentColor', strokeWidth: 2, fill: 'none' } },
                                                e('path', { d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" })
                                            )
                                        )
                                    ),
                                    e('h2', { className: "text-2xl font-bold text-white mb-2" }, 'No Project Selected'),
                                    e('p', { className: "text-slate-400" }, 'Select a project from the sidebar to view its details and manage tasks')
                                )
                    )
                )
        )
    );
}
