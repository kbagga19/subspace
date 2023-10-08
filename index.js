const express = require('express');
const app = express();
var _ = require('lodash');

app.get('/api/blog-stats', (req, res) => {
    fetch('https://intent-kit-16.hasura.app/api/rest/blogs', {
        headers: {"x-hasura-admin-secret": "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6"}
    })
    .then((res) => res.json())
    .then((data) => {
        const count = data.blogs
            .map(obj => (obj.title.match('Privacy') || []).length)
            .reduce((count, occurrences) => count + occurrences, 0);
        res.send({
            "Total number of blogs": _.size(data.blogs),
            "The title of the longest blog": (_.maxBy(data.blogs, obj => obj.title.length)).title,
            "Number of blogs with 'privacy' in the title": count,
            "An array of unique blog titles": [...new Set(data.blogs.map(obj => obj.title))]
        });            
    });
});

app.get("/api/blog-search", (req, res) => {
    fetch('https://intent-kit-16.hasura.app/api/rest/blogs', {
        headers: {"x-hasura-admin-secret": "32qR4KmXOIpsGPQKMqEJHGJS27G5s7HdSKO3gdtQd2kv5e852SiYwWNfxkZOBuQ6"}
    })
    .then((res) => res.json())
    .then((data) => {
        const query = req.query.query;

        if (!query) {
            return res.status(400).json({ error: 'Query is required.' });
        }

        const blogsList = data.blogs.filter(blog =>
            blog.title.toLowerCase().includes(query.toLowerCase())
        );

        res.json(blogsList );
    });
});


app.listen(3001, () => {
   console.log("Server listening on 3001");
})