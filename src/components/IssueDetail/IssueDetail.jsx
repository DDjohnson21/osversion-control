// src/components/IssueDetail/IssueDetail.jsx
import React from 'react'
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  AvatarGroup,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Divider,
  CardActions
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'

export default function IssueDetail({ issue, onBack }) {
  const winner = issue.commits.find(c => c.sha === issue.mergedCommitId)

  return (
    <Card sx={{ width: '100%', maxWidth: 600, mx: 'auto', mt: 2 }}>
      <CardHeader
        avatar={
          <Button onClick={onBack} startIcon={<ArrowBackIcon />}>
            Back
          </Button>
        }
        title={issue.title}
        subheader={`Repo: ${issue.repo}`}
      />

      <CardContent>
        <Typography variant="subtitle1" gutterBottom>
          Bounty: {issue.bounty} ETH
        </Typography>

        {/* Votes & Voters */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <ThumbUpIcon color="action" sx={{ mr: 1 }} />
          <Typography variant="body2">{issue.votes} votes</Typography>
          <AvatarGroup max={4} sx={{ ml: 2 }}>
            {(issue.voters || []).map(v => (
              <Avatar key={v.login} src={v.avatar_url} />
            ))}
          </AvatarGroup>
        </Box>

        <Divider sx={{ my:2 }} />

        {/* Commits */}
        <Typography variant="subtitle1" gutterBottom>
          Commits
        </Typography>
        <List disablePadding>
          {issue.commits.map(commit => (
            <React.Fragment key={commit.sha}>
              <ListItem
                secondaryAction={
                  commit.sha === issue.mergedCommitId && (
                    <EmojiEventsIcon sx={{ color: '#FFD700' }} />
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar src={commit.avatar_url}>
                    {commit.author[0].toUpperCase()}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={commit.sha}
                  secondary={`Author: ${commit.author}`}
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>

        {/* Winner Badge */}
        {winner && (
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <EmojiEventsIcon sx={{ color: '#FFD700', mr: 1 }} />
            <Typography variant="body1">
              Winner: {winner.author} ({winner.sha})
            </Typography>
          </Box>
        )}
      </CardContent>

      <CardActions>
        <Button disabled> 👍 Upvote </Button>
        <Button disabled> 👎 Downvote </Button>
      </CardActions>
    </Card>
  )
}
