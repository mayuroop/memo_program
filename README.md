# Solana Metadata Storage App

A React/Next.js application that allows users to store small metadata on Solana devnet using Phantom Wallet.

## Features

- 🔗 Connect to Phantom Wallet
- 📝 Store text or JSON metadata on Solana devnet
- 🔍 Retrieve stored metadata by account address
- 💰 Automatic account creation and rent payment
- 🎨 Modern, responsive UI with Tailwind CSS
- ⚡ Real-time transaction confirmation
- 📋 Copy account addresses and transaction signatures

## Prerequisites

1. **Phantom Wallet**: Install the [Phantom Wallet browser extension](https://phantom.app/)
2. **Node.js**: Version 18 or higher
3. **Solana Devnet**: The app connects to Solana devnet (no mainnet fees)

## Installation

1. Clone or download this project
2. Navigate to the project directory:
   ```bash
   cd solana-metadata-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## How to Use

### 1. Connect Your Wallet
- Click "Connect Phantom" to connect your Phantom wallet
- Make sure you're on Solana devnet in your wallet settings
- The app will display your wallet address once connected

### 2. Store Metadata
- Choose between "Plain Text" or "JSON" content type
- Enter your metadata content in the text area
- Click "Store Metadata on Solana" to create a new account and store the data
- Sign the transaction in your Phantom wallet
- Wait for transaction confirmation

### 3. Retrieve Data
- Use the "Retrieve Data by Address" section
- Enter the account address where metadata was stored
- Click "Retrieve Data" to fetch and display the stored content

## Technical Details

### Architecture
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Blockchain**: Solana devnet via @solana/web3.js
- **Wallet**: Phantom Wallet integration
- **Storage**: Raw Solana accounts (no NFT standards)

### How It Works
1. **Account Creation**: A new keypair is generated for each metadata storage
2. **Transaction**: User signs a transaction to create the account and pay rent
3. **Data Storage**: Metadata is stored as raw bytes in the account
4. **Retrieval**: Data is fetched by reading the account's data field

### Key Components
- `MetadataForm`: Form for entering and validating metadata
- `WalletConnection`: Phantom wallet connection management
- `StoredDataDisplay`: Display and retrieval of stored metadata
- `MessageDisplay`: Success/error message handling

## Important Notes

⚠️ **This is a demo application for educational purposes**

- Uses Solana devnet (no real SOL required)
- Creates new accounts for each metadata storage
- No custom programs - uses SystemProgram for account creation
- In production, you'd want to use a custom program for better data management

## Troubleshooting

### Common Issues

1. **"Phantom wallet not found"**
   - Install Phantom Wallet browser extension
   - Refresh the page after installation

2. **"Invalid JSON format"**
   - Ensure JSON is properly formatted
   - Use a JSON validator if needed

3. **Transaction fails**
   - Check you have enough SOL in devnet
   - Get devnet SOL from [Solana Faucet](https://faucet.solana.com/)

4. **Account not found during retrieval**
   - Verify the account address is correct
   - Ensure the account was created successfully

## Development

### Project Structure
```
src/
├── app/
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Main application page
├── components/
│   ├── MetadataForm.tsx    # Metadata input form
│   ├── WalletConnection.tsx # Wallet connection UI
│   ├── StoredDataDisplay.tsx # Data display and retrieval
│   └── MessageDisplay.tsx  # Success/error messages
└── types/
    └── solana.ts           # TypeScript definitions
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

This project is for educational purposes. Feel free to use and modify as needed.