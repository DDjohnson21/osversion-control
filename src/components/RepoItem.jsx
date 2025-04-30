import React, { useState, useEffect } from 'react'
import {
  Card, CardContent, CardActions,
  Typography, IconButton, Link
} from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DeleteIcon from '@mui/icons-material/Delete'

export default function RepoItem({ fullName }) {
  const [info, setInfo] = useState(null)
  const [error, setError] = useState(null)
  const token = localStorage.getItem('githubToken')

  useEffect(() => {
    fetch(`https://api.github.com/repos/${fullName}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
      .then(res => {
        if (!res.ok) {
          throw new Error(`GitHub API error: ${res.status} ${res.statusText}`)
        }
        return res.json()
      })
      .then(setInfo)
      .catch(error => {
        console.error('Failed to fetch repo info:', error)
        setError(error.message)
      })
  }, [fullName, token])

  const remove = () => {
    chrome.storage.local.get('repos', ({ repos }) => {
      chrome.storage.local.set({ repos: repos.filter(r => r !== fullName) })
    })
  }

  if (error) return <Typography color="error">Error: {error}</Typography>
  if (!info) return <Typography>Loading {fullName}…</Typography>

  return (
    <Card variant="outlined" sx={{ borderRadius: 3, mb: 2, '&:hover': { boxShadow: 4 } }}>
      <CardContent>
        <Typography variant="h6">{info.full_name}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          ⭐ {info.stargazers_count}   •   Issues: {info.open_issues_count}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton component={Link} href={info.html_url} target="_blank">
          <OpenInNewIcon />
        </IconButton>
        <IconButton onClick={remove}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  )
}
