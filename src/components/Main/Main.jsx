import React from 'react'
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Avatar,
  Link,
  Chip
} from '@mui/material'
import CodeIcon from '@mui/icons-material/Code'

const topRepos = [
  {
    owner:        'facebook',
    repo:         'react',
    description:  'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    activity:     1342,
    funding:      28.7,
    openBounties: 12
  },
  {
    owner:        'vercel',
    repo:         'next.js',
    description:  'The React Framework for Production.',
    activity:     873,
    funding:      15.3,
    openBounties: 8
  },
  {
    owner:        'nodejs',
    repo:         'node',
    description:  'Node.js JavaScript runtime.',
    activity:     622,
    funding:      9.1,
    openBounties: 5
  }
]

export default function Main() {
  return (
    <Box sx={{ p: 3, overflowY: 'auto' }}>
      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
        🔥 Top Repositories
      </Typography>

      <Grid container spacing={2}>
        {topRepos.map(r => (
          <Grid item xs={12} sm={6} md={4} key={`${r.owner}/${r.repo}`}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Avatar src={`https://github.com/${r.owner}.png?size=40`} />
                  <Box sx={{ ml: 2 }}>
                    <Link
                      href={`https://github.com/${r.owner}/${r.repo}`}
                      target="_blank"
                      underline="none"
                      sx={{ fontWeight: 600, color: 'primary.main' }}
                    >
                      {r.owner}/{r.repo}
                    </Link>
                  </Box>
                </Box>

                <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                  {r.description}
                </Typography>

                <Chip icon={<CodeIcon />} label={`${r.activity} events`} size="small" sx={{ mr: 1 }} />
                <Chip label={`${r.funding} ETH`} size="small" sx={{ mr: 1 }} />
                <Chip label={`${r.openBounties} bounties`} size="small" />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
