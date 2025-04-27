// popup.js

// You'll need to replace these values
const CONTRACT_ADDRESS = "0xYourContractAddressHere"; // TODO: Update after deploy
const CONTRACT_ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "stakingPrecompileAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_collatorPoolAddress",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "issueId",
        "type": "uint256"
      }
    ],
    "name": "IssueOpened",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "issueId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "solver",
        "type": "address"
      }
    ],
    "name": "IssueSolved",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "issueId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "pledger",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Pledged",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "issueId",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "address",
        "name": "pledger",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "Refunded",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "issueId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "solver_address",
        "type": "address"
      }
    ],
    "name": "closeIssue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "collatorPoolAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "issueId",
        "type": "uint256"
      }
    ],
    "name": "finalizePayout",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "issues",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "totalPledged",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isOpen",
        "type": "bool"
      },
      {
        "internalType": "address",
        "name": "solver_address",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "issueId",
        "type": "uint256"
      }
    ],
    "name": "openIssue",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "issueId",
        "type": "uint256"
      }
    ],
    "name": "pledge",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "name": "pledges",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "issueId",
        "type": "uint256"
      }
    ],
    "name": "refund",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "staking",
    "outputs": [
      {
        "internalType": "contract ParachainStaking",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

async function pledgeToIssue(issueId, ethAmount) {
  if (typeof window.ethereum === 'undefined') {
    alert('Please install MetaMask!');
    return;
  }

  try {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);

    const tx = await contract.pledge(issueId, { value: ethers.utils.parseEther(ethAmount) });
    await tx.wait();
    alert('Successfully pledged!');
  } catch (error) {
    console.error(error);
    alert('Transaction failed.');
  }
}

// Scrape the GitHub page to get issues
function fetchGitHubIssues() {
  return new Promise((resolve, reject) => {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: () => {
          const issues = Array.from(document.querySelectorAll('.js-issue-row')).map(row => {
            const titleElement = row.querySelector('a.Link--primary');
            const id = row.getAttribute('id')?.replace('issue_', '');
            return {
              id: id,
              title: titleElement ? titleElement.innerText : "Untitled Issue"
            };
          });
          return issues;
        }
      }, (results) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          resolve(results[0].result);
        }
      });
    });
  });
}

// Update the popup UI
async function populateIssues() {
  const listElement = document.getElementById('rankingList');
  listElement.innerHTML = '';

  try {
    const issues = await fetchGitHubIssues();
    issues.forEach(issue => {
      const listItem = document.createElement('li');
      listItem.textContent = `${issue.id}: ${issue.title}`;

      const pledgeButton = document.createElement('button');
      pledgeButton.textContent = "Pledge";
      pledgeButton.style.marginLeft = '8px';
      pledgeButton.onclick = async () => {
        const amount = prompt(`Enter amount of ETH to pledge for issue ${issue.id}:`);
        if (amount && !isNaN(amount) && Number(amount) > 0) {
          await pledgeToIssue(issue.id, amount);
        } else {
          alert('Invalid amount.');
        }
      };

      listItem.appendChild(pledgeButton);
      listElement.appendChild(listItem);
    });
  } catch (error) {
    console.error('Failed to fetch GitHub issues:', error);
  }
}

// When popup opens, fetch issues
document.addEventListener('DOMContentLoaded', function() {
  populateIssues();
});

// Other UI events (like opening/closing the earnings card)
document.getElementById('pricePill').addEventListener('click', function() {
  document.getElementById('priceCard').classList.add('active');
  document.getElementById('overlay').classList.add('active');
});

document.getElementById('closeCard').addEventListener('click', function() {
  document.getElementById('priceCard').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
});

document.getElementById('overlay').addEventListener('click', function() {
  document.getElementById('priceCard').classList.remove('active');
  document.getElementById('overlay').classList.remove('active');
});

