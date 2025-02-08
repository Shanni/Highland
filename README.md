# Highland: Peak Crypto Portfolio Manager 🏔️

Highland is a modern, feature-rich cryptocurrency portfolio management application that provides real-time analysis, AI-powered insights, and advanced portfolio tracking across multiple chains.

## Features 🚀

### Cross-Chain Portfolio Overview
- Real-time portfolio valuation across multiple blockchains
- Asset distribution visualization
- Performance metrics and analytics
- Support for major chains (Ethereum, Optimism, Arbitrum, Base)

### AI-Powered Analysis
- **Portfolio Assistant**: Get real-time insights about your holdings
- **Chain Analysis**: Detailed breakdown of assets per chain
- **Agentic Roundtable**: Multi-agent discussion system for deeper analysis
- **Onchain Actions (BETA)**: AI-assisted transaction planning powered by CDP Agentkit

### Technical Features
- Real-time data updates via WebSocket
- Responsive design for all devices
- Secure wallet connection
- Integration with Covalent API for accurate data

## Getting Started 🛠️

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- A modern web browser

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/highland.git
cd highland
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your API keys:
```env
REACT_APP_COVALENT_API_KEY=your_covalent_api_key
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

### Backend Services
Make sure to run the required backend services:
- Chat service: `localhost:4000/chat`
- Action service: `localhost:4000/baseAction`
- News analysis: `localhost:4000/news-based-analysis`

## Architecture 🏗️

### Frontend
- React.js with modern hooks
- Socket.IO for real-time communication
- Recharts for data visualization
- Wagmi for wallet integration

### Backend Services
- WebSocket servers for real-time updates
- AI agents for portfolio analysis
- Chain interaction services

## Contributing 🤝

We welcome contributions! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License 📝

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments 🙏

- [Covalent](https://www.covalenthq.com/) for blockchain data API
- [CDP Agentkit](https://cdpagentkit.com) for AI agent infrastructure
- [Wagmi](https://wagmi.sh/) for wallet integration
- All our contributors and supporters

## Support 💬

For support, please open an issue in the repository or contact our team at support@highland.com

---

Built with ❤️ by the Highland Team
