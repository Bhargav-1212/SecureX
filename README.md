<h1 align="center" id="title">SecureX</h1>

<p align="center"><img src="https://socialify.git.ci/Bhargav-1212/SecureX/image?custom_language=React&amp;language=1&amp;name=1&amp;owner=1&amp;stargazers=1&amp;theme=Light" alt="project-image"></p>

<p id="description">SecureX is an AI-integrated blockchain-powered document management dashboard built for secure transparent and intelligent file handling. The platform allows users to upload store and access documents via IPFS with blockchain-backed authenticity using smart contracts on the Sepolia testnet. It features MetaMask authentication a responsive dashboard and an AI chatbot (powered by LLMs) that enables users to interact with uploaded documents intelligently.</p>

<h2>🚀 Demo</h2>

[https://3752e4b727bb4425be66c9c40fb49d1b-ad43427cb1314fb4be0787a1b.fly.dev/](https://3752e4b727bb4425be66c9c40fb49d1b-ad43427cb1314fb4be0787a1b.fly.dev/)

  
  
<h2>🧐 Features</h2>

Here're some of the project's best features:

*   📂 Document upload & download via IPFS
*   🔗 Smart contract integration to store IPFS hashes
*   🧠 AI-based chat (LLM & LangChain) with documents
*   🔐 Wallet authentication using MetaMask
*   📊 Activity analytics & upload history
*   📱 Fully responsive and user-friendly dashboard (React + Tailwind)

<h2>🛠️ Installation Steps:</h2>

<p>1. Step 1: Clone the Repository bash Copy Edit</p>

```
git clone https://github.com/your-username/securex.git cd securex
```

<p>2. Step 2: Install Frontend Dependencies</p>

```
cd client npm install
```

<p>3. Step 3: Install Backend Dependencies</p>

```
cd ../server npm install
```

<p>4. Set Environment Variables</p>

```
PORT=5000 MONGODB_URI=your_mongo_uri JWT_SECRET=your_jwt_secret NFT_STORAGE_KEY=your_nft_storage_api_key SMART_CONTRACT_ADDRESS=your_deployed_contract_address
```

<p>5. Step 5: Run Backend Server</p>

```
cd server npm start
```

<p>6. Step 6: Run Frontend Dev Server</p>

```
cd ../client npm run dev
```

<p>7. Step 7: Connect MetaMask Wallet Install MetaMask extension. Switch to the Sepolia test network. Connect wallet from the landing page.</p>

<h2>Techologies</h2>
🔹 Frontend:
- React.js
- Tailwind CSS
- Vite
- Heroicons
- MetaMask Integration (Ethers.js)

🔹 Backend:
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT Authentication
- IPFS (via NFT.Storage)

🔹 Blockchain & AI:
- Solidity Smart Contract (Sepolia Network)
- Ethers.js for Contract Interaction
- LangChain & OpenAI (LLM-based Document Chat)

🔹 Deployment & Dev Tools:
- Git & GitHub
- Postman (API Testing)
- Visual Studio Code (IDE)
