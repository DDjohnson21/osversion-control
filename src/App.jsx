import React, { useState, useEffect } from 'react'
import {
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  TextField,
  InputAdornment
} from '@mui/material'
import MenuIcon       from '@mui/icons-material/Menu'
import SearchIcon     from '@mui/icons-material/Search'
import MonetizationOn from '@mui/icons-material/MonetizationOn'

import theme          from './theme'
import NavBar         from './components/NavBar/NavBar'
import Main           from './components/Main/Main'
import Dashboard      from './components/NavBar/Dashboard/Dashboard'
import Donate         from './components/NavBar/Donate/Donate'
import RequestFeature from './components/NavBar/RequestFeature/RequestFeature'
import Leaderboard    from './components/NavBar/Leaderboard/Leaderboard'
import Profile        from './components/NavBar/profile/Profile'
import EarningsPopup  from './components/NavBar/Dashboard/EarningsPopup'
import IssueDetail    from './components/IssueDetail/IssueDetail'

export default function App() {
  const [navOpen,      setNavOpen]       = useState(true)
  const [activeTab,    setActiveTab]     = useState('main')
  const [owner,        setOwner]         = useState(null)
  const [repo,         setRepo]          = useState(null)
  const [search,       setSearch]        = useState('')
  const [selectedIssue,setSelectedIssue] = useState(null)
  const [viewingIssue, setViewingIssue]  = useState(null)
  const [earnOpen,     setEarnOpen]      = useState(false)
  const [notifyEnabled,setNotifyEnabled] = useState(false)
  const [profileUser,  setProfileUser]   = useState(null)

  // auto‐detect GitHub tab repo + notification pref
  useEffect(() => {
    setNotifyEnabled(localStorage.getItem('mergefund-notifications') === 'true')
    if (chrome?.tabs?.query) {
      chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
        const m = tab.url?.match(/github\.com\/([^\/]+)\/([^\/#?]+)/)
        if (m) {
          setOwner(m[1])
          setRepo(m[2])
        }
      })
    }
  }, [])

  // global owner/repo search
  const handleSearch = async e => {
    if (e.key === 'Enter' && search.includes('/')) {
      const [o, r] = search.trim().split('/')
      try {
        const res = await fetch(`https://api.github.com/repos/${o}/${r}`)
        if (!res.ok) throw new Error()
        setOwner(o)
        setRepo(r)
        setActiveTab('dashboard')
      } catch {
        alert('Repository not found—check owner/repo spelling.')
      }
    }
  }

  const handleNav = key => {
    setActiveTab(key)
    setViewingIssue(null)
    setSelectedIssue(null)
    setProfileUser(null)
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', height: '100vh' }}>
        <NavBar open={navOpen} active={activeTab} onNavClick={handleNav} />

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            bgcolor: 'background.default'
          }}
        >
          <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper' }}>
            <Toolbar>
              <IconButton edge="start" onClick={() => setNavOpen(o => !o)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" sx={{ flexGrow: 1, color: 'text.primary' }}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </Typography>

              <TextField
                placeholder="owner/repo"
                variant="filled"
                size="small"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onKeyDown={handleSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                  disableUnderline: true,
                  sx: { bgcolor: 'background.paper', borderRadius: 1, width: 200 }
                }}
              />

              {activeTab === 'dashboard' && (
                <IconButton onClick={() => setEarnOpen(true)} sx={{ ml: 1 }}>
                  <MonetizationOn />
                </IconButton>
              )}
            </Toolbar>
          </AppBar>

          {activeTab === 'main' && <Main />}

          {!viewingIssue && activeTab === 'dashboard' && (
            <Dashboard
              owner={owner}
              repo={repo}
              onClaim={issue => setViewingIssue(issue)}
            />
          )}

          {viewingIssue && (
            <IssueDetail
              owner={owner}
              repo={repo}
              issue={viewingIssue}
              onBack={() => setViewingIssue(null)}
            />
          )}

          {activeTab === 'donate' && (
            <Donate
              owner={owner}
              repo={repo}
              issue={selectedIssue}
              onBack={() => setActiveTab('dashboard')}
              onDonateComplete={() => notifyEnabled && setEarnOpen(true)}
            />
          )}

          {activeTab === 'request' && (
            <RequestFeature
              owner={owner}
              repo={repo}
              onBack={() => handleNav('dashboard')}
            />
          )}

          {activeTab === 'leaderboard' && (
            <Leaderboard
              onViewUser={login => {
                setProfileUser(login)
                setActiveTab('profile')
              }}
            />
          )}

          {activeTab === 'profile' && (
            <Profile
              userLogin={profileUser}
              onBack={() => handleNav('leaderboard')}
              onDetail={issue => {
                // reuse the same detail flow
                setViewingIssue(issue)
                setActiveTab('dashboard')
              }}
            />
          )}
        </Box>

        <EarningsPopup
          open={earnOpen}
          onClose={() => setEarnOpen(false)}
          owner={owner}
          repo={repo}
        />
      </Box>
    </ThemeProvider>
  )
}
