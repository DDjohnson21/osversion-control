import React from 'react'
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'

export default function SearchSort({ searchTerm, onSearch, sortOption, onSortChange }) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
      <TextField
        label="Search repos…"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={e => onSearch(e.target.value)}
      />
      <FormControl size="small">
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sortOption}
          label="Sort by"
          onChange={e => onSortChange(e.target.value)}
        >
          <MenuItem value="starsDesc">Stars ↓</MenuItem>
          <MenuItem value="starsAsc">Stars ↑</MenuItem>
          <MenuItem value="issuesDesc">Issues ↓</MenuItem>
          <MenuItem value="issuesAsc">Issues ↑</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}
