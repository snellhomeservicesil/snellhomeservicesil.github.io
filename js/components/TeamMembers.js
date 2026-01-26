// TeamMembers Component - Manage team members
function TeamMembers({ project, onUpdate }) {
    const e = React.createElement;
    const { useState } = React;

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({ name: '', role: '', hourlyRate: '' });

    const handleAdd = () => {
        if (!form.name || !form.hourlyRate) return;
        
        const newMember = {
            id: Date.now(),
            name: form.name,
            role: form.role,
            hourlyRate: parseFloat(form.hourlyRate)
        };

        onUpdate({
            ...project,
            teamMembers: [...project.teamMembers, newMember]
        });

        setForm({ name: '', role: '', hourlyRate: '' });
        setShowForm(false);
    };

    const handleUpdate = () => {
        if (!form.name || !form.hourlyRate) return;

        onUpdate({
            ...project,
            teamMembers: project.teamMembers.map(tm =>
                tm.id === editing.id
                    ? { ...tm, name: form.name, role: form.role, hourlyRate: parseFloat(form.hourlyRate) }
                    : tm
            )
        });

        setEditing(null);
        setForm({ name: '', role: '', hourlyRate: '' });
    };

    const handleDelete = (memberId) => {
        onUpdate({
            ...project,
            teamMembers: project.teamMembers.filter(m => m.id !== memberId),
            hours: project.hours.filter(h => h.teamMemberId !== memberId)
        });
    };

    // Helper function (fallback if utils.js not loaded yet)
    const getHours = (memberId) => {
        return project?.hours
            .filter(h => h.teamMemberId === memberId)
            .reduce((sum, h) => sum + h.hours, 0) || 0;
    };

    // Calculate labor cost for a team member
    const getLaborCost = (memberId, hourlyRate) => {
        const totalHours = typeof getTotalHours !== 'undefined' ? getTotalHours(project, memberId) : getHours(memberId);
        return totalHours * hourlyRate;
    };

    return e('div', { className: "bg-white rounded-xl shadow-lg p-6" },
        e('div', { className: "flex items-center justify-between mb-4" },
            e('div', { className: "flex items-center gap-2" },
                e('h2', { className: "text-xl font-bold text-slate-800" }, 'Team Members')
            ),
            e('button', {
                onClick: () => setShowForm(true),
                className: "p-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            }, e(Icon, { d: "M12 5v14M5 12h14", size: 20 }))
        ),

        // Add Form
        showForm && e('div', { className: "mb-4 p-4 bg-slate-50 rounded-lg border-2 border-green-200" },
            e('input', {
                type: "text",
                placeholder: "Name",
                value: form.name,
                onChange: e => setForm({ ...form, name: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "text",
                placeholder: "Role",
                value: form.role,
                onChange: e => setForm({ ...form, role: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "number",
                placeholder: "Hourly Rate ($)",
                value: form.hourlyRate,
                onChange: e => setForm({ ...form, hourlyRate: e.target.value }),
                className: "w-full p-2 mb-3 border rounded-lg"
            }),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleAdd,
                    className: "flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                }, 'Add'),
                e('button', {
                    onClick: () => {
                        setShowForm(false);
                        setForm({ name: '', role: '', hourlyRate: '' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Edit Form
        editing && e('div', { className: "mb-4 p-4 bg-amber-50 rounded-lg border-2 border-amber-300" },
            e('h3', { className: "font-semibold mb-3 text-slate-700" }, 'Edit Team Member'),
            e('input', {
                type: "text",
                placeholder: "Name",
                value: form.name,
                onChange: e => setForm({ ...form, name: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "text",
                placeholder: "Role",
                value: form.role,
                onChange: e => setForm({ ...form, role: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "number",
                placeholder: "Hourly Rate ($)",
                value: form.hourlyRate,
                onChange: e => setForm({ ...form, hourlyRate: e.target.value }),
                className: "w-full p-2 mb-3 border rounded-lg"
            }),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleUpdate,
                    className: "flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
                }, 'Update'),
                e('button', {
                    onClick: () => {
                        setEditing(null);
                        setForm({ name: '', role: '', hourlyRate: '' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Team Members List
        e('div', { className: "space-y-2" },
            project.teamMembers.map(member => {
                const totalHours = typeof getTotalHours !== 'undefined' ? getTotalHours(project, member.id) : getHours(member.id);
                const laborCost = getLaborCost(member.id, member.hourlyRate);
                
                return e('div', {
                    key: member.id,
                    className: "p-3 bg-slate-50 rounded-lg border border-slate-200"
                },
                    e('div', { className: "flex items-center justify-between" },
                        e('div', { className: "flex-1" },
                            e('h3', { className: "font-semibold text-slate-800" }, member.name),
                            e('p', { className: "text-sm text-slate-600" },
                                member.role, ' • $', member.hourlyRate, '/hr • ',
                                totalHours, ' hrs'
                            ),
                            e('p', { className: "text-sm font-semibold text-green-700 mt-1" },
                                'Labor Cost: $', laborCost.toLocaleString()
                            )
                        ),
                        e('div', { className: "flex gap-1" },
                            e('button', {
                                onClick: () => {
                                    setEditing(member);
                                    setForm({
                                        name: member.name,
                                        role: member.role,
                                        hourlyRate: member.hourlyRate.toString()
                                    });
                                },
                                className: "p-1 text-blue-600 hover:bg-blue-100 rounded"
                            }, e(Icon, { d: "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z", size: 16 })),
                            e('button', {
                                onClick: () => handleDelete(member.id),
                                className: "p-1 text-red-600 hover:bg-red-100 rounded"
                            }, e(Icon, { d: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2", size: 16 }))
                        )
                    )
                );
            })
        )
    );
}
