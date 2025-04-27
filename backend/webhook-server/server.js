// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { ethers } = require('ethers');

// Initialize express app
const app = express();
app.use(bodyParser.json());

// Load environment variables
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const ABI = require('./MergeFundABI.json'); // You need ABI here

// Set up ethers
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PRIVATE_KEY, provider);
const mergeFundContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

// GitHub webhook endpoint
app.post('/webhook', async (req, res) => {
    const event = req.headers['x-github-event'];
    const payload = req.body;

    try {
        if (event === 'pull_request' && payload.action === 'closed' && payload.pull_request.merged) {
            const githubUsername = payload.pull_request.user.login;
            const issueNumber = extractIssueIdFromUrl(payload.pull_request.issue_url); // cleaner helper function

            console.log(`PR merged by: ${githubUsername}, Issue: ${issueNumber}`);

            // Lookup wallet address
            const solverWallet = await getWalletAddress(githubUsername); 

            // Close the issue
            const tx1 = await mergeFundContract.closeIssue(issueNumber, solverWallet);
            await tx1.wait();
            console.log(`Issue ${issueNumber} closed.`);

            // Finalize payout
            const tx2 = await mergeFundContract.finalizePayout(issueNumber);
            await tx2.wait();
            console.log(`Payout for issue ${issueNumber} finalized.`);

            res.status(200).send('Payout successful');

        } else if (event === 'issue_opened' && payload.action === 'opened') {
            const issueNumber = payload.issue.number;
            console.log(`Opening issue ${issueNumber}`);

            const tx = await mergeFundContract.openIssue(issueNumber);
            await tx.wait();
            console.log(`Issue ${issueNumber} opened.`);

            res.status(200).send('Issue opened');

        } else {
            console.log('Event ignored');
            res.status(200).send('Event ignored');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error processing webhook');
    }
});

// Helper function to extract issue ID from URL
function extractIssueIdFromUrl(issueUrl) {
    const parts = issueUrl.split('/');
    return parseInt(parts.pop());
}

// Placeholder function to map GitHub username to wallet address
async function getWalletAddress(githubUsername) {
    // 🔥 Replace this logic later
    const mockAddresses = {
        "mboekamp03": "0x8e7451F1ef78F2Cb47EC1C889e8b59d00B23d70A",
    };
    return mockAddresses[githubUsername];
}

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Listening for GitHub webhooks on port ${PORT}`);
});
