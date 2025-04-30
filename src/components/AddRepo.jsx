import React, { useState } from 'react'
import { Box, TextField, Button } from '@mui/material'

export default function AddRepo({ repos, onSave }) {
  const [input, setInput] = useState('')

  const handleAdd = () => {
    const trimmed = input.trim()
    if (trimmed.includes('/') && !repos.includes(trimmed)) {
      onSave([...repos, trimmed])
      setInput('')
    }
  }

  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
      <TextField
        fullWidth size="medium"
        label="owner/repo"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleAdd()}
      />
      <Button variant="contained" size="large" onClick={handleAdd}>
        Add
      </Button>
    </Box>
  )
}
