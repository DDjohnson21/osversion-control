// src/components/NavBar/NavBar.jsx
import React from 'react'
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Chip
} from '@mui/material'
import HomeIcon           from '@mui/icons-material/Home'
import DashboardIcon      from '@mui/icons-material/Dashboard'
import LightbulbIcon      from '@mui/icons-material/Lightbulb'
import AttachMoneyIcon    from '@mui/icons-material/AttachMoney'
import EmojiEventsIcon    from '@mui/icons-material/EmojiEvents'
import AccountCircleIcon  from '@mui/icons-material/AccountCircle'
import GitHubIcon         from '@mui/icons-material/GitHub'

const DRAWER_WIDTH = 200

const navItems = [
  { key: 'main',        label: 'Home',           icon: <HomeIcon /> },
  { key: 'dashboard',   label: 'Dashboard',      icon: <DashboardIcon /> },
  { key: 'request',     label: 'Request Feature',icon: <LightbulbIcon /> },
  { key: 'donate',      label: 'Donate',         icon: <AttachMoneyIcon /> },
  { key: 'leaderboard', label: 'Leaderboard',    icon: <EmojiEventsIcon /> },
  { key: 'profile',     label: 'Profile',        icon: <AccountCircleIcon /> }
]

export default function NavBar({ open, active, onNavClick }) {
  if (!open) return null

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          boxSizing: 'border-box',
          bgcolor: '#161616',
          color: '#fff',
          borderRight: 0,
          p: 2
        }
      }}
    >
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <GitHubIcon sx={{ fontSize: 32, color: '#7C4DFF' }} />
        <Typography variant="h6" sx={{ mt: 1 }}>
          MergeFund
        </Typography>
      </Box>

      <List>
        {navItems.map(item => (
          <ListItemButton
            key={item.key}
            selected={active === item.key}
            onClick={() => onNavClick(item.key)}
            sx={{
              mb: 1,
              borderRadius: 1,
              '&.Mui-selected': {
                bgcolor: '#262626',
                '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                  color: '#7C4DFF'
                }
              }
            }}
          >
            <ListItemIcon sx={{ color: active === item.key ? '#7C4DFF' : '#aaa' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: 14,
                color: active === item.key ? '#7C4DFF' : '#ddd'
              }}
            />
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ my: 2, borderColor: '#333' }} />

      <Typography variant="subtitle2" sx={{ mb: 1, color: '#888' }}>
        FILTERS
      </Typography>
      <Typography variant="caption">Categories</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {['Web', 'Mobile', 'AI'].map(cat => (
          <Chip key={cat} label={cat} size="small" sx={{ bgcolor: '#262626', color: '#fff' }} />
        ))}
      </Box>

      <Typography variant="caption">Languages</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        {['JavaScript', 'Python'].map(lang => (
          <Chip key={lang} label={lang} size="small" sx={{ bgcolor: '#262626', color: '#fff' }} />
        ))}
      </Box>

      <Typography variant="caption">Donation</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {["> $1,000", "Any"].map(d => (
          <Chip key={d} label={d} size="small" sx={{ bgcolor: '#262626', color: '#fff' }} />
        ))}
      </Box>
    </Drawer>
  )
}
