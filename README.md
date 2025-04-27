# OSVersion-Control

A decentralized version control system built on Polkadot Asset Hub that enables secure and transparent management of operating system updates and configurations.

## Project Overview

OSVersion-Control is a blockchain-based solution that provides a secure and transparent way to manage operating system updates and configurations. It leverages the power of Polkadot Asset Hub to ensure immutability and traceability of system changes.

## Smart Contract Implementation

Our smart contract, `StakingInterface.sol`, implements the following key features:

1. **Staking Mechanism**: Users can stake tokens to participate in the version control system
2. **Version Tracking**: Each OS version update is recorded on-chain
3. **Configuration Management**: System configurations are stored immutably
4. **Access Control**: Role-based permissions for different types of users
5. **Audit Trail**: Complete history of all changes and updates

## Project Structure

```
osversion-control/
├── src/                  # Frontend React application
│   ├── components/       # React components
│   ├── assets/           # Static assets
│   └── App.jsx           # Main application component
├── backend/              # Backend services
│   ├── hardhat/          # Smart contract development
│   │   ├── contracts/    # Solidity contracts
│   │   ├── scripts/      # Deployment scripts
│   │   └── test/         # Contract tests
│   └── webhook-server/   # Webhook server for notifications
├── public/               # Public assets
└── dist/                 # Build output
```

## Features

- **Decentralized Version Control**: All OS version updates are recorded on-chain
- **Secure Configuration Management**: System configurations are stored immutably
- **Staking Mechanism**: Users stake tokens to participate in the system
- **Real-time Notifications**: Webhook-based notifications for updates
- **User-friendly Interface**: Modern React-based UI with dark/light mode

## Screenshots

[INSERT_SCREENSHOTS_HERE]

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Start the development server:
   ```bash
   yarn dev
   ```
4. Deploy the smart contract:
   ```bash
   cd backend/hardhat
   yarn hardhat deploy --network polkadot
   ```

## Demo Video

Demo_before_cut.mov
