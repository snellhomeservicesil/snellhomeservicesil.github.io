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
            e('div', { className: "bg-slate-800 rounded-xl shadow-lg p-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border border-slate-700" },
                e('div', { },
                    e('h1', { className: "text-3xl font-bold text-white mb-2" }, 'Construction Projects Tracker'),
                    e('p', { className: "text-slate-300" }, 'Manage your projects, team, hours, materials, payments, and budgets'),
                    currentUser && e('p', { className: "text-sm text-slate-400 mt-2" }, `Logged in as: ${currentUser.email}`)
                ),
                e('button', { 
                    onClick: handleLogout,
                    className: "bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg whitespace-nowrap"
                }, 'Logout')
            ),

            // Loading state
            loading
                ? e('div', { className: "bg-slate-800 rounded-xl shadow-lg p-12 text-center border border-slate-700" },
                    e('p', { className: "text-slate-300 text-lg" }, 'Loading projects...')
                )
                : e('div', { className: "grid grid-cols-1 lg:grid-cols-3 gap-6" },
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
                            : e('div', { className: "bg-slate-800 rounded-xl shadow-lg p-12 text-center border border-slate-700" },
                                e(Icon, { d: "M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z", size: 64, className: "text-slate-600 mx-auto mb-4" }),
                                e('h2', { className: "text-2xl font-bold text-white mb-2" }, 'No Project Selected'),
                                e('p', { className: "text-slate-400" }, 'Select a project from the sidebar or create a new one to get started')
                            )
                    )
                )
        )
    );
}
