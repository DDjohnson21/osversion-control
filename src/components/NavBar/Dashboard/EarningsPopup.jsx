import React, { useState, useEffect } from 'react'
import {
  Drawer,
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

export default function EarningsPopup({ open, onClose, owner, repo }) {
  const [issues, setIssues]     = useState([])
  const [funding, setFunding]   = useState({})

  // 1) load issues & demo funding when opened
  useEffect(() => {
    if (!open || !owner || !repo) return

    const token = localStorage.getItem('githubToken')
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
        const onlyIssues = data.filter(i => !i.pull_request)
        setIssues(onlyIssues)

        // demo: random raised per issue
        const demo = {}
        onlyIssues.forEach(i => {
          demo[i.number] = { raised: +(Math.random() * 3 + 0.2).toFixed(2) }
        })
        setFunding(demo)
      })
      .catch(error => {
        console.error('Failed to fetch issues:', error)
        setIssues([])
      })
  }, [open, owner, repo])

  // 2) sum them
  const total = issues
    .reduce((sum, i) => sum + (funding[i.number]?.raised || 0), 0)
    .toFixed(2)

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { bgcolor: '#1E1E1E', borderTopLeftRadius: 16, borderTopRightRadius: 16, height: '60%' } }}
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
            Earnings for {owner}/{repo}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#aaa' }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* total */}
        <Typography variant="subtitle1" sx={{ color: '#7C4DFF', mb: 2 }}>
          Total raised: {total} ETH
        </Typography>
        <Divider sx={{ borderColor: '#333', mb: 2 }} />

        {/* list of issues + their individual earnings */}
        <Box sx={{ overflowY: 'auto', flex: 1 }}>
          <List disablePadding>
            {issues.map(issue => (
              <ListItem
                key={issue.id}
                sx={{
                  py: 1,
                  px: 0,
                  borderBottom: '1px solid #333'
                }}
              >
                <ListItemText
                  primary={
                    <Typography sx={{ color: '#fff' }}>
                      #{issue.number} – {issue.title}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="caption" sx={{ color: '#ccc' }}>
                      {funding[issue.number]?.raised || 0} ETH
                    </Typography>
                  }
                />
              </ListItem>
            ))}
            {issues.length === 0 && (
              <Typography align="center" sx={{ color: '#555', mt: 4 }}>
                No open issues found.
              </Typography>
            )}
          </List>
        </Box>
      </Box>
    </Drawer>
  )
}
