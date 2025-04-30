import React from 'react'
import { Grid } from '@mui/material'
import RepoItem from './RepoItem'

export default function RepoList({ repos }) {
  return (
    <Grid container spacing={2}>
      {repos.map(fullName => (
        <Grid item xs={12} key={fullName}>
          <RepoItem fullName={fullName} />
        </Grid>
      ))}
    </Grid>
  )
}
