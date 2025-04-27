// src/components/NavBar/Profile/Profile.jsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Avatar,
  Switch,
  Grid,
  Card,
  CardContent,
  CardActions,
  Divider,
  FormControlLabel,
  TextField
} from '@mui/material'

export default function Profile({ userLogin, onDetail, onBack }) {
  const [notify,    setNotify]    = useState(localStorage.getItem('mergefund-notifications') === 'true')
  const [claimed,   setClaimed]   = useState([])
  const [completed, setCompleted] = useState([])
  const [projects,  setProjects]  = useState([])
  const [githubToken, setGithubToken] = useState(localStorage.getItem('githubToken') || '')

  useEffect(() => {
    // --- Seed dummy completed bounties (with you + votes) ---
    if (!localStorage.getItem('completedBounties')) {
      const dummy = [
        {
          repo: 'gbabaisaac/mergefund',
          id: 3,
          title: 'Styling bug fix',
          bounty: 0.3,
          claimers: ['gbabaisaac','alice','bob'],
          mergedCommitId: 'abc123',
          votes: 12
        },
        {
          repo: 'octocat/Hello-World',
          id: 42,
          title: 'Add dark mode',
          bounty: 1.0,
          claimers: ['charlie','gbabaisaac'],
          mergedCommitId: '123456',
          votes: 34
        },
        {
          repo: 'facebook/react',
          id: 999,
          title: 'Fix memory leak',
          bounty: 0.7,
          claimers: ['dave','gbabaisaac'],
          mergedCommitId: 'cba987',
          votes: 27
        }
      ]
      localStorage.setItem('completedBounties', JSON.stringify(dummy))
    }

    // --- Load Active Claims ---
    const allClaims = JSON.parse(localStorage.getItem('claimedIssues') || '{}')
    const active = []
    Object.entries(allClaims).forEach(([repoKey, ids]) => {
      ids.forEach(id => {
        active.push({
          repo: repoKey,
          id,
          title: `Issue #${id}`,
          bounty: 0.5,
          claimers: [],
          mergedCommitId: null,
          votes: 0
        })
      })
    })
    setClaimed(active)

    // --- Load Completed Bounties ---
    setCompleted(JSON.parse(localStorage.getItem('completedBounties')))

    // --- Dummy Open Source Projects ---
    setProjects([
      {
        repo: 'gbabaisaac/mergefund',
        desc: 'On-chain donation & bounty tracker',
        funding: 5.2,
        openIssues: 4
      },
      {
        repo: 'octocat/Hello-World',
        desc: 'Example "Hello World" repo',
        funding: 2.1,
        openIssues: 10
      },
      {
        repo: 'facebook/react',
        desc: 'A declarative, efficient JS library',
        funding: 12.5,
        openIssues: 120
      }
    ])
  }, [])

  const toggleNotify = () => {
    localStorage.setItem('mergefund-notifications', String(!notify))
    setNotify(n => !n)
  }

  const handleGithubTokenChange = (e) => {
    const token = e.target.value
    setGithubToken(token)
    localStorage.setItem('githubToken', token)
  }

  const handleRemove = issue => {
    const all = JSON.parse(localStorage.getItem('claimedIssues') || '{}')
    all[issue.repo] = (all[issue.repo] || []).filter(x => x !== issue.id)
    localStorage.setItem('claimedIssues', JSON.stringify(all))
    setClaimed(c => c.filter(i => !(i.repo === issue.repo && i.id === issue.id)))
  }

  const lifetimeEarnings = completed.reduce((sum, i) => sum + i.bounty, 0).toFixed(2)

  return (
    <Box sx={{ p: 3, overflowY: 'auto' }}>
      <Button onClick={onBack} variant="outlined" sx={{ mb: 2 }}>
        ← Back
      </Button>

      <Typography variant="h6" gutterBottom color="text.primary">
        Profile Settings
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="subtitle1" sx={{ mb: 2 }}>GitHub Token</Typography>
        <TextField
          fullWidth
          type="password"
          label="GitHub Personal Access Token"
          value={githubToken}
          onChange={handleGithubTokenChange}
          helperText="Enter your GitHub Personal Access Token to enable full functionality"
          sx={{ mb: 2 }}
        />
      </Box>

      <FormControlLabel
        control={
          <Switch
            checked={notify}
            onChange={toggleNotify}
            color="primary"
          />
        }
        label="Enable notifications"
      />

      <Divider sx={{ my: 4 }} />

      {/* Summary */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Avatar sx={{ width:80, height:80, mx:'auto', mb:1 }}>
          {userLogin?.[0]?.toUpperCase() || 'G'}
        </Avatar>
        <Typography variant="h5">{userLogin || 'gbabaisaac'}</Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Lifetime Earnings: {lifetimeEarnings} ETH
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          Completed Bounties: {completed.length}
        </Typography>
      </Box>

      {/* Active Claims */}
      <Typography variant="h6" sx={{ mb: 2 }}>🎯 Active Claims</Typography>
      {claimed.length === 0 ? (
        <Typography color="text.secondary">No active claims.</Typography>
      ) : (
        <Grid container spacing={2}>
          {claimed.map(issue => (
            <Grid item xs={12} sm={6} md={4} key={`${issue.repo}#${issue.id}`}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{issue.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {issue.repo}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" onClick={() => onDetail(issue)}>
                    Details
                  </Button>
                  <Button size="small" onClick={() => handleRemove(issue)}>
                    Remove
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Divider sx={{ my: 4 }} />

      {/* Completed Bounties */}
      <Typography variant="h6" sx={{ mb: 2 }}>🎉 Completed Bounties</Typography>
      <Grid container spacing={2}>
        {completed.map(issue => (
          <Grid item xs={12} sm={6} md={4} key={`${issue.repo}#${issue.id}`}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{issue.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {issue.repo}
                </Typography>
                <Typography variant="body2">
                  Bounty: {issue.bounty} ETH
                </Typography>
                <Typography variant="body2">
                  Contributors: {issue.claimers.join(', ')}
                </Typography>
                <Typography variant="body2">
                  Votes: {issue.votes}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => onDetail(issue)}>
                  Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Open Source Projects */}
      <Typography variant="h6" sx={{ mb: 2 }}>🛠️ Open Source Projects</Typography>
      <Grid container spacing={2}>
        {projects.map(proj => (
          <Grid item xs={12} sm={6} md={4} key={proj.repo}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1">{proj.repo}</Typography>
                <Typography variant="body2" sx={{ mb:1 }}>
                  {proj.desc}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Funding: {proj.funding.toFixed(1)} ETH • Open Issues: {proj.openIssues}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  href={`https://github.com/${proj.repo}`}
                  target="_blank"
                >
                  View on GitHub
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
