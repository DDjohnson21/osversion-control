// src/components/NavBar/RequestFeature/RequestFeature.jsx
import React, { useState } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert
} from '@mui/material'

export default function RequestFeature({ owner, repo, onBack }) {
  const [title,       setTitle]       = useState('')
  const [description, setDescription] = useState('')
  const [bounty,      setBounty]      = useState('0.1')
  const [status,      setStatus]      = useState(null)

  // GitHub token must be stored in localStorage under "githubToken"
  const token = localStorage.getItem('githubToken')

  const handleSubmit = async () => {
    if (!token) {
      setStatus({ type: 'error', msg: '🔒 Please connect your GitHub account first.' })
      return
    }
    if (!title.trim() || !description.trim() || !bounty.trim()) {
      setStatus({ type: 'error', msg: 'All fields are required.' })
      return
    }

    setStatus(null)
    try {
      const resp = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/issues`,
        {
          method: 'POST',
          headers: {
            Authorization: `token ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: `[Feature Request] ${title}`,
            body: `${description}\n\n**Bounty:** ${bounty} ETH`,
            labels: ['feature request', 'bounty']
          })
        }
      )
      if (!resp.ok) {
        const err = await resp.json()
        throw new Error(err.message)
      }
      const issue = await resp.json()
      setStatus({ type: 'success', msg: `✅ Created issue #${issue.number}` })
      // reset
      setTitle('')
      setDescription('')
      setBounty('0.1')
    } catch (err) {
      setStatus({ type: 'error', msg: err.message })
    }
  }

  return (
    <Box
      sx={{
        flex:       1,
        p:          3,
        bgcolor:    '#121212',
        color:      '#fff',
        height:     '100%',
        overflowY:  'auto'
      }}
    >
      <Button
        onClick={onBack}
        variant="outlined"
        sx={{ mb: 2, color: '#ccc', borderColor: '#444' }}
      >
        ← Back
      </Button>

      <Typography variant="h5" sx={{ mb: 1 }}>
        Request a Feature
      </Typography>
      <Typography variant="subtitle2" sx={{ mb: 3, color: '#aaa' }}>
        for {owner}/{repo}
      </Typography>

      <TextField
        label="Title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{ sx: { color: '#fff' } }}
        InputLabelProps={{ sx: { color: '#aaa' } }}
      />

      <TextField
        label="Description"
        value={description}
        onChange={e => setDescription(e.target.value)}
        fullWidth
        multiline
        minRows={4}
        sx={{ mb: 2 }}
        InputProps={{ sx: { color: '#fff' } }}
        InputLabelProps={{ sx: { color: '#aaa' } }}
      />

      <TextField
        label="Bounty (ETH)"
        value={bounty}
        onChange={e => setBounty(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
        InputProps={{ sx: { color: '#fff' } }}
        InputLabelProps={{ sx: { color: '#aaa' } }}
      />

      {status && (
        <Alert severity={status.type} sx={{ mb: 2, wordBreak: 'break-word' }}>
          {status.msg}
        </Alert>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleSubmit}
        sx={{
          bgcolor:      '#7C4DFF',
          textTransform:'none',
          py:           1.5
        }}
      >
        Submit Request
      </Button>
    </Box>
  )
}
