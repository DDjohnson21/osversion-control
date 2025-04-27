// src/components/NavBar/Donate/Donate.jsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material'
import { ethers } from 'ethers'

/**
 * Supports two donation types:
 *  • “Support Developers” (repo‐level)
 *  • “Bug Bounty” (issue‐level)
 */
export default function Donate({
  owner,
  repo,
  issue,
  onBack,
  onDonateComplete
}) {
  // radio: 'dev' or 'issue'
  const [donationType, setDonationType] = useState('dev')
  const [amount,         setAmount]       = useState('0.1')
  const [status,         setStatus]       = useState(null)
  const [sending,        setSending]      = useState(false)

  // ← placeholder addresses; replace with your real mapping
  const DEV_ADDRESS    = '0xDEVELOPER_ADDRESS_HERE'
  const BOUNTY_ADDRESS = '0xISSUE_BOUNTY_ADDRESS_HERE'

  useEffect(() => {
    // reset status & default type when issue/owner changes
    setStatus(null)
    setDonationType('dev')
  }, [owner, repo, issue])

  const handleDonate = async () => {
    if (!window.ethereum) {
      setStatus({ type: 'error', msg: 'MetaMask not detected' })
      return
    }

    let value
    try {
      value = ethers.utils.parseEther(amount)
    } catch {
      setStatus({ type: 'error', msg: 'Invalid ETH amount' })
      return
    }

    const to = donationType === 'issue' ? BOUNTY_ADDRESS : DEV_ADDRESS

    setSending(true)
    setStatus(null)

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.send('eth_requestAccounts', [])
      const signer = provider.getSigner()
      const tx = await signer.sendTransaction({ to, value })

      setStatus({ type: 'info', msg: `⏳ Transaction sent: ${tx.hash}` })
      await tx.wait()
      setStatus({ type: 'success', msg: '✅ Donation confirmed! Thank you.' })
      onDonateComplete?.()
    } catch (err) {
      setStatus({ type: 'error', msg: err.message || 'Transaction failed' })
    } finally {
      setSending(false)
    }
  }

  return (
    <Box
      sx={{
        flex:        1,
        p:           3,
        bgcolor:     '#121212',
        color:       '#fff',
        height:      '100%',
        overflowY:   'auto'
      }}
    >
      <Button
        onClick={onBack}
        variant="outlined"
        sx={{ mb: 2, color: '#ccc', borderColor: '#444' }}
      >
        ← Back
      </Button>

      <FormControl component="fieldset" sx={{ mb: 3, color: '#fff' }}>
        <FormLabel component="legend" sx={{ color: '#aaa' }}>
          Donation Type
        </FormLabel>
        <RadioGroup
          row
          value={donationType}
          onChange={e => setDonationType(e.target.value)}
        >
          <FormControlLabel
            value="dev"
            control={<Radio sx={{ color: '#7C4DFF' }} />}
            label="Support Developers"
          />
          <FormControlLabel
            value="issue"
            control={<Radio sx={{ color: '#7C4DFF' }} />}
            label={issue ? `Bug Bounty #${issue.number}` : 'Bug Bounty'}
            disabled={!issue}
          />
        </RadioGroup>
      </FormControl>

      <Typography variant="h5" sx={{ mb: 1 }}>
        {donationType === 'dev'
          ? 'Support Repository:'
          : issue
            ? `Donate to Issue #${issue.number}:`
            : 'Select an issue'}
      </Typography>
      <Typography variant="h6" sx={{ color: '#7C4DFF', mb: 3 }}>
        {donationType === 'dev'
          ? `${owner}/${repo}`
          : issue
            ? issue.title
            : '—'}
      </Typography>

      <TextField
        label="Amount (ETH)"
        value={amount}
        onChange={e => setAmount(e.target.value)}
        fullWidth
        sx={{
          mb: 2,
          '& .MuiInputBase-input': { color: '#fff' },
          '& .MuiFormLabel-root':  { color: '#aaa' },
          '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#444'
          },
          '&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
            borderColor: '#7C4DFF'
          }
        }}
      />

      {status && (
        <Alert
          severity={status.type}
          sx={{ mb: 2, wordBreak: 'break-word' }}
        >
          {status.msg}
        </Alert>
      )}

      <Box sx={{ position: 'relative' }}>
        <Button
          variant="contained"
          fullWidth
          onClick={handleDonate}
          disabled={sending || (donationType === 'issue' && !issue)}
          sx={{
            bgcolor:       '#7C4DFF',
            py:            1.5,
            fontSize:      '1rem',
            textTransform: 'none'
          }}
        >
          {sending ? 'Processing…' : 'Send Donation'}
        </Button>
        {sending && (
          <CircularProgress
            size={24}
            sx={{
              position:   'absolute',
              top:        '50%',
              left:       '50%',
              transform:  'translate(-50%, -50%)',
              color:      '#fff'
            }}
          />
        )}
      </Box>
    </Box>
  )
}
