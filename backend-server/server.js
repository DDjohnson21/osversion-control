const express = require('express');
const { ethers } = require('ethers');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Contract ABI - you'll need to add the full ABI here
const contractABI = [
    "function openIssue(uint256 issueId) external",
    "function pledge(uint256 issueId) external payable",
    "function closeIssue(uint256 issueId, address solver) external",
    "function finalizePayout(uint256 issueId) external",
    "function issues(uint256) view returns (uint256 totalPledged, bool isOpen, address solver_address, bool isPaidOut)"
];

const CONTRACT_ADDRESS = "0xDA3A029cC4fb8003Bc6d758edc3B9A92CA0c53dD";
const RPC_URL = process.env.RPC_URL || "https://rpc.api.moonbase.moonbeam.network";
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

// Open a new issue
app.post('/api/open-issue', async (req, res) => {
    try {
        const { issueId } = req.body;
        const tx = await contract.openIssue(issueId);
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pledge to an issue
app.post('/api/pledge', async (req, res) => {
    try {
        const { issueId, amount } = req.body;
        const tx = await contract.pledge(issueId, {
            value: ethers.parseEther(amount)
        });
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Close an issue
app.post('/api/close-issue', async (req, res) => {
    try {
        const { issueId, solverAddress } = req.body;
        const tx = await contract.closeIssue(issueId, solverAddress);
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Finalize payout
app.post('/api/finalize-payout', async (req, res) => {
    try {
        const { issueId } = req.body;
        const tx = await contract.finalizePayout(issueId);
        await tx.wait();
        res.json({ success: true, txHash: tx.hash });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get issue status
app.get('/api/issue/:issueId', async (req, res) => {
    try {
        const { issueId } = req.params;
        const issue = await contract.issues(issueId);
        res.json({
            totalPledged: ethers.formatEther(issue.totalPledged),
            isOpen: issue.isOpen,
            solverAddress: issue.solver_address,
            isPaidOut: issue.isPaidOut
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 