import React, { useState } from 'react'
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  Avatar,
  Badge
} from '@mui/material'
import InfoIcon from '@mui/icons-material/Info'
import RankingInfo from './RankingInfo'

const contributors = [
  { login: 'gbabaisaac', avatar_url: 'https://github.com/gbabaisaac.png', merged: 128, earned: 12.4 },
  { login: 'alice',      avatar_url: 'https://i.pravatar.cc/40?img=1',  merged: 42,  earned: 3.5 },
  { login: 'bob',        avatar_url: 'https://i.pravatar.cc/40?img=2',  merged: 35,  earned: 2.1 }
]
const donators = [
  { login: 'dave',   avatar_url: 'https://i.pravatar.cc/40?img=4', donated: 5.0 },
  { login: 'eve',    avatar_url: 'https://i.pravatar.cc/40?img=5', donated: 4.2 },
  { login: 'frank',  avatar_url: 'https://i.pravatar.cc/40?img=6', donated: 3.9 }
]

export default function Leaderboard({ onViewUser }) {
  const [showInfo, setShowInfo] = useState(false)
  if (showInfo) return <RankingInfo onBack={() => setShowInfo(false)} />

  return (
    <Box sx={{ p: 3, overflowY: 'auto' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
          🏆 Leaderboard
        </Typography>
        <IconButton onClick={() => setShowInfo(true)} sx={{ color: 'text.secondary' }}>
          <InfoIcon />
        </IconButton>
      </Box>

      <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.primary' }}>
        Top Contributors
      </Typography>
      <Grid container spacing={2} mb={3}>
        {contributors.map((u, i) => (
          <Grid item xs={12} sm={4} key={u.login}>
            <Card>
              <CardActionArea onClick={() => onViewUser(u.login)}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Badge
                    badgeContent={i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <Avatar src={u.avatar_url} sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }} />
                  </Badge>
                  <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                    {u.login}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {u.merged} merged · {u.earned} ETH
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="subtitle1" sx={{ mb: 1, color: 'text.primary' }}>
        Top Donators
      </Typography>
      <Grid container spacing={2}>
        {donators.map((u, i) => (
          <Grid item xs={12} sm={4} key={u.login}>
            <Card>
              <CardActionArea onClick={() => onViewUser(u.login)}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Badge
                    badgeContent={i === 0 ? '🥇' : i === 1 ? '🥈' : '🥉'}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                  >
                    <Avatar src={u.avatar_url} sx={{ width: 56, height: 56, mx: 'auto', mb: 1 }} />
                  </Badge>
                  <Typography variant="subtitle1" sx={{ color: 'text.primary' }}>
                    {u.login}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {u.donated} ETH
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
