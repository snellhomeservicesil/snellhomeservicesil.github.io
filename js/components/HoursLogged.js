// HoursLogged Component - Track hours worked
function HoursLogged({ project, onUpdate }) {
    const e = React.createElement;
    const { useState } = React;

    // Helper functions (fallback if utils.js not loaded yet)
    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const getMemberName = (memberId) => {
        const member = project?.teamMembers.find(m => m.id === memberId);
        return member ? member.name : 'Unknown';
    };

    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState({
        teamMemberId: '',
        date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(),
        hours: ''
    });

    const handleAdd = () => {
        if (!form.teamMemberId || !form.hours) return;

        const newHours = {
            id: Date.now(),
            teamMemberId: form.teamMemberId,
            date: form.date,
            hours: parseFloat(form.hours)
        };

        onUpdate({
            ...project,
            hours: [...project.hours, newHours]
        });

        setForm({ teamMemberId: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), hours: '' });
        setShowForm(false);
    };

    const handleUpdate = () => {
        if (!form.teamMemberId || !form.hours) return;

        onUpdate({
            ...project,
            hours: project.hours.map(h =>
                h.id === editing.id
                    ? { ...h, teamMemberId: form.teamMemberId, date: form.date, hours: parseFloat(form.hours) }
                    : h
            )
        });

        setEditing(null);
        setForm({ teamMemberId: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), hours: '' });
    };

    const handleDelete = (hoursId) => {
        onUpdate({
            ...project,
            hours: project.hours.filter(h => h.id !== hoursId)
        });
    };

    return e('div', { className: "bg-white rounded-xl shadow-lg p-6" },
        e('div', { className: "flex items-center justify-between mb-4" },
            e('div', { className: "flex items-center gap-2" },
                e('h2', { className: "text-xl font-bold text-slate-800" }, 'Hours Logged')
            ),
            e('button', {
                onClick: () => setShowForm(true),
                className: "p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            }, e(Icon, { d: "M12 5v14M5 12h14", size: 20 }))
        ),

        // Add Form
        showForm && e('div', { className: "mb-4 p-4 bg-slate-50 rounded-lg border-2 border-pink-200" },
            e('select', {
                value: form.teamMemberId,
                onChange: e => setForm({ ...form, teamMemberId: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            },
                e('option', { value: "" }, 'Select Team Member'),
                project.teamMembers.map(tm =>
                    e('option', { key: tm.id, value: tm.id }, tm.name)
                )
            ),
            e('input', {
                type: "date",
                value: form.date,
                onChange: e => setForm({ ...form, date: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "number",
                placeholder: "Hours Worked",
                value: form.hours,
                onChange: e => setForm({ ...form, hours: e.target.value }),
                className: "w-full p-2 mb-3 border rounded-lg"
            }),
            e('div', { className: "flex gap-2" },
                e('button', {
                    onClick: handleAdd,
                    className: "flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                }, 'Add'),
                e('button', {
                    onClick: () => {
                        setShowForm(false);
                        setForm({ teamMemberId: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), hours: '' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Edit Form
        editing && e('div', { className: "mb-4 p-4 bg-amber-50 rounded-lg border-2 border-amber-300" },
            e('h3', { className: "font-semibold mb-3 text-slate-700" }, 'Edit Hours'),
            e('select', {
                value: form.teamMemberId,
                onChange: e => setForm({ ...form, teamMemberId: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            },
                e('option', { value: "" }, 'Select Team Member'),
                project.teamMembers.map(tm =>
                    e('option', { key: tm.id, value: tm.id }, tm.name)
                )
            ),
            e('input', {
                type: "date",
                value: form.date,
                onChange: e => setForm({ ...form, date: e.target.value }),
                className: "w-full p-2 mb-2 border rounded-lg"
            }),
            e('input', {
                type: "number",
                placeholder: "Hours Worked",
                value: form.hours,
                onChange: e => setForm({ ...form, hours: e.target.value }),
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
                        setForm({ teamMemberId: '', date: typeof getTodayISODate !== 'undefined' ? getTodayISODate() : getTodayDate(), hours: '' });
                    },
                    className: "px-4 py-2 bg-slate-300 text-slate-700 rounded-lg hover:bg-slate-400"
                }, e(Icon, { d: "M18 6L6 18M6 6l12 12", size: 16 }))
            )
        ),

        // Hours List
        e('div', { className: "space-y-2" },
            project.hours.map(hour =>
                e('div', {
                    key: hour.id,
                    className: "p-3 bg-slate-50 rounded-lg border border-slate-200"
                },
                    e('div', { className: "flex items-center justify-between" },
                        e('div', null,
                            e('h3', { className: "font-semibold text-slate-800" },
                                getMemberName(hour.teamMemberId)
                            ),
                            e('p', { className: "text-sm text-slate-600" },
                                hour.date, ' • ', hour.hours, ' hours'
                            )
                        ),
                        e('div', { className: "flex gap-1" },
                            e('button', {
                                onClick: () => {
                                    setEditing(hour);
                                    setForm({
                                        teamMemberId: hour.teamMemberId,
                                        date: hour.date,
                                        hours: hour.hours.toString()
                                    });
                                },
                                className: "p-1 text-blue-600 hover:bg-blue-100 rounded"
                            }, e(Icon, { d: "M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z", size: 16 })),
                            e('button', {
                                onClick: () => handleDelete(hour.id),
                                className: "p-1 text-red-600 hover:bg-red-100 rounded"
                            }, e(Icon, { d: "M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2", size: 16 }))
                        )
                    )
                )
            )
        )
    );
}
