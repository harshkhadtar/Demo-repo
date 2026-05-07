async function loadMyComplaints() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch('https://demo-repo-9fgn.onrender.com/api/complaints/my', {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        });

        const complaints = await response.json();
        const container = document.getElementById('my-complaints-list');

        if (container) {
            if (complaints.length === 0) {
                container.innerHTML = '<p class="caption">You have not raised any complaints yet.</p>';
            } else {
                container.innerHTML = '';
                complaints.forEach(c => {
                    let statusClass = 'pending';
                    if (c.status === 'In Progress') statusClass = 'in-progress';
                    if (c.status === 'Completed') statusClass = 'completed';
                    if (c.status === 'Rejected') statusClass = 'rejected';

                    const date = new Date(c.created_at).toLocaleDateString();

                    const cardHTML = `
            <div class="md-card">
              ${c.image_url ? `<img src="https://demo-repo-9fgn.onrender.com${c.image_url}" alt="Complaint Image" style="border-radius: 8px; width: 100%; height: 140px; object-fit: cover;">` : ''}
              <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                  <h4 style="margin-bottom: 4px;">${c.title}</h4>
                  <p class="caption">${c.category} • ${date}</p>
                </div>
                <div class="chip ${statusClass}">${c.status}</div>
              </div>
              <p class="body-large" style="margin-top: 8px;">${c.description.substring(0, 100)}${c.description.length > 100 ? '...' : ''}</p>
            </div>
          `;
                    container.innerHTML += cardHTML;
                });
            }
        }
    } catch (error) {
        console.error('Failed to load complaints', error);
    }
}