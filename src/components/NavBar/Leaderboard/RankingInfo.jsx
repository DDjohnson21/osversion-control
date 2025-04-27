import React from 'react'
import { Box, Typography, Card, CardContent, Grid, Button } from '@mui/material'

const tiers = [
  { name: 'Bronze',   req: '≥ 5 merges or ≥ 0.5 ETH' },
  { name: 'Silver',   req: '≥ 20 merges or ≥ 2 ETH' },
  { name: 'Gold',     req: '≥ 50 merges or ≥ 5 ETH' },
  { name: 'Platinum', req: '≥ 100 merges or ≥ 10 ETH' },
  { name: 'Diamond',  req: '≥ 200 merges or ≥ 20 ETH' }
]

export default function RankingInfo({ onBack }) {
  return (
    <Box sx={{ p: 3, overflowY: 'auto' }}>
      <Button
        onClick={onBack}
        variant="outlined"
        sx={{ mb: 3, color: 'text.secondary', borderColor: 'divider' }}
      >
        ← Back to Leaderboard
      </Button>

      <Typography variant="h5" sx={{ mb: 3, color: 'text.primary' }}>
        🎮 Ranking Tiers & Prizes
      </Typography>

      <Grid container spacing={2}>
        {tiers.map((t, i) => (
          <Grid item xs={12} sm={6} md={4} key={t.name}>
            <Card sx={{ border: `2px solid ${i === 0 ? 'gold' : i === 1 ? 'silver' : '#888'}` }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ mb: 1, color: 'primary.main' }}>
                  {t.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {t.req}
                </Typography>
                <Typography variant="subtitle2" sx={{ color: 'secondary.main' }}>
                  Prize: {(i + 1) * 2} ETH
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
