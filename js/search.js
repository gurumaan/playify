// Client-side search index
function searchTracks(q, catalog) { return catalog.filter(t => t.title.toLowerCase().includes(q.toLowerCase())); }
