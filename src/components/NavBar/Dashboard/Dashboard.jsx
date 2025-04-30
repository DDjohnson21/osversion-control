// src/components/NavBar/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button
} from '@mui/material'

/** Your demo issues always shown first */
const dummyIssues = [
  {
    id: 1,
    title: 'Fix login bug',
    priority: 'High',
    bounty: 1.2,
    claimers: ['alice','bob'],
    commits: [
      { id: 'c1', author: 'alice', sha: 'abc123' },
      { id: 'c2', author: 'bob',   sha: 'def456' }
    ]
  },
  {
    id: 2,
    title: 'Add dark mode',
    priority: 'Medium',
    bounty: 0.8,
    claimers: ['carol'],
    commits: []
  }
]

export default function Dashboard({ owner, repo, onClaim }) {
  const [apiIssues, setApiIssues] = useState([])
  const [loading,   setLoading]   = useState(false)
  const token = localStorage.getItem('githubToken')

  useEffect(() => {
    if (!owner || !repo) return
    setLoading(true)
    fetch(`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=50`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
        }
        return res.json()
      })
      .then(data => {
        // filter out PRs and map to our shape
        const filtered = (data || [])
          .filter(i => !i.pull_request)
          .map(i => ({
            id: i.number,
            title: i.title,
            priority: 'Low',       // default
            bounty: 0,             // no on‐chain bounty yet
            claimers: [],          // nothing claimed
            commits: []            // no commit history tracked
          }))
        setApiIssues(filtered)
      })
      .catch(error => {
        console.error('Failed to fetch GitHub issues:', error)
        // Show error to user
        setApiIssues([])
      })
      .finally(() => setLoading(false))
  }, [owner, repo, token])

  // always show dummy first, then real ones
  const issues = [...dummyIssues, ...apiIssues]

  return (
    <Box sx={{ p: 3, overflowY: 'auto' }}>
      <Typography variant="h6" gutterBottom color="text.primary">
        Issues in {owner}/{repo}
      </Typography>

      {loading && (
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          Loading issues…
        </Typography>
      )}

      <Grid container spacing={2}>
        {issues.map(issue => (
          <Grid item xs={12} md={6} key={issue.id + '-' + issue.title}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" color="text.primary">
                  {issue.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Priority: {issue.priority} • Bounty: {issue.bounty} ETH
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => onClaim(issue)}>
                  View/Claim
                </Button>
                <Button
                  size="small"
                  disabled={!token}
                  onClick={() => {
                    const key = `${owner}/${repo}`
                    const saved = JSON.parse(localStorage.getItem('claimedIssues') || '{}')
                    saved[key] = Array.from(new Set([...(saved[key]||[]), issue.id]))
                    localStorage.setItem('claimedIssues', JSON.stringify(saved))
                    alert('Issue claimed!')
                  }}
                >
                  Claim
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {issues.length === 0 && !loading && (
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          No open issues found.
        </Typography>
      )}
    </Box>
  )
}
