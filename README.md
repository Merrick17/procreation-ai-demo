# Procreation AI

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0-cyan)](https://tailwindcss.com/)

> A premium AI-powered image generation and NFT minting platform built with modern web technologies.

![Procreation AI Banner](./public/og-image.png)

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Demo](#demo)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

### Image Generation
- **Multiple AI Models**: Support for 20+ models including:
  - Google Imagen 4.0 (Ultra, Fast)
  - OpenAI DALL-E 3, GPT Image 1
  - Replicate (Flux, Stable Diffusion, Recraft)
  - Hugging Face Models (SDXL, RealVis, Animagine, etc.)
  - Free models via Hugging Face
- **Aspect Ratio Control**: 1:1, 3:4, 4:3, 9:16, 16:9
- **Preset Dimensions**: Square, Portrait, Landscape, Mobile formats
- **Smart Aspect Ratio Detection**: Automatically converts pixel dimensions to supported ratios
- **Streaming Generation**: Real-time generation status updates

### NFT Minting
- **Solana Integration**: Mint NFTs on Solana blockchain
- **Metaplex Support**: Full Metaplex standard compliance
- **Multiple Mint Types**: Image only, Prompt only, or Bundle
- **Royalty Configuration**: Set secondary sale royalties (0-15%)
- **IPFS Storage**: Metadata and images stored on IPFS via Irys
- **Wallet Integration**: Connect with Solana wallets

### Dashboard & Analytics
- **DeFi-Style Interface**: Modern fintech-inspired dashboard
- **Portfolio Tracking**: Monitor your NFT collection value
- **Activity Feed**: Real-time transaction history
- **Credit System**: Pay-per-use credit system for generations
- **Marketplace Integration**: List and sell NFTs

### AI Assistant
- **Groq-Powered Chat**: Llama 3.3 70B assistant
- **Contextual Help**: Get help with prompts, models, and minting
- **Tool Integration**: Check credits, view generations, calculate costs

## Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Next.js API Routes** - Serverless functions
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **Iron Session** - Session management
- **bcrypt** - Password hashing

### AI/ML
- **AI SDK** - Vercel's AI SDK for streaming
- **Google Imagen** - Image generation
- **OpenAI** - DALL-E, GPT models
- **Replicate** - Flux, SD models
- **Hugging Face** - Open source models
- **Groq** - Chat assistant

### Blockchain
- **Solana Web3.js** - Blockchain interactions
- **Metaplex UMI** - NFT minting
- **Irys** - Permanent storage
- **x402** - Payment protocol

### DevOps
- **Cloudinary** - Image storage & CDN
- **Vercel** - Deployment

## Demo

🚀 [Live Demo](https://your-demo-url.vercel.app)

📹 [Video Demo](https://youtube.com/your-demo-video)

![Dashboard Screenshot](./screenshots/dashboard.png)
![Studio Screenshot](./screenshots/studio.png)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- PostgreSQL database
- API keys (see below)
- Solana wallet (for NFT features)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/procreation-ai.git
cd procreation-ai
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up the database**

```bash
# Create PostgreSQL database
createdb procreation_ai

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# (Optional) Seed the database
npx prisma db seed
```

4. **Configure environment variables**

```bash
cp .env.example .env.local
```

Edit `.env.local` with your API keys (see [Environment Variables](#environment-variables)).

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Copy `.env.example` to `.env.local` and configure:

#### Required

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/procreation_ai"

# Session
SESSION_SECRET="your-random-secret-min-32-chars"

# Cloudinary (Image Storage)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

#### AI Providers (at least one)

```env
# Google AI
GOOGLE_GENERATIVE_AI_API_KEY="your-google-api-key"

# OpenAI
OPENAI_API_KEY="sk-your-openai-key"

# Replicate
REPLICATE_API_TOKEN="r8_your-replicate-token"

# Hugging Face (for free models)
HUGGINGFACE_API_KEY="hf_your-huggingface-key"

# Groq (for chat assistant)
GROQ_API_KEY="gsk_your-groq-key"
```

#### Blockchain (optional, for NFT features)

```env
# Solana
NEXT_PUBLIC_SOLANA_NETWORK="devnet"
NEXT_PUBLIC_SOLANA_RPC_URL="https://api.devnet.solana.com"
NEXT_PUBLIC_TREASURY_WALLET="your-solana-wallet-address"
```

See [REQUIRED_API_KEYS.md](./REQUIRED_API_KEYS.md) for detailed setup instructions.

## Usage

### Image Generation

1. Navigate to `/studio`
2. Enter your prompt
3. Select a model (e.g., "imagen-4.0", "flux-schnell")
4. Choose aspect ratio
5. Click "Generate"
6. Wait for the image to be generated and uploaded

### Minting NFTs

1. Generate an image or navigate to your gallery
2. Click "Mint" on any image
3. Fill in NFT metadata (name, description)
4. Select mint type (Image/Prompt/Bundle)
5. Set royalty percentage
6. Connect your wallet and approve the transaction

### Chat Assistant

Click the chat bubble in the bottom-right corner to:
- Get model recommendations
- Enhance your prompts
- Check your credit balance
- Learn about features

## API Documentation

### Authentication

All API routes (except public pages) require authentication via Iron Session.

### Image Generation

```http
POST /api/generate/image
Content-Type: application/json

{
  "prompt": "a cyberpunk samurai",
  "modelId": "imagen-4.0-fast",
  "width": 1024,
  "height": 1024
}
```

Response:
```json
{
  "success": true,
  "jobId": "uuid",
  "imageUrl": "https://cloudinary.com/...",
  "creditsUsed": 3,
  "priceUSD": "$0.03"
}
```

### Chat

```http
POST /api/chat
Content-Type: application/json

{
  "messages": [
    { "role": "user", "content": "What models do you recommend?" }
  ]
}
```

Returns a streaming text response.

See the [API routes directory](./app/api/) for more endpoints.

## Architecture

```
procreation-ai/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes (login/register)
│   ├── (dashboard)/       # Dashboard routes
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── dashboard/         # Dashboard components
│   ├── nft/               # NFT-related components
│   ├── studio/            # Image generation UI
│   └── ui/                # Shadcn/ui components
├── lib/                   # Utility functions
│   ├── modules/           # Feature modules
│   │   ├── ai/            # AI/ML integration
│   │   ├── generation/    # Image generation
│   │   └── nft/           # NFT minting
│   ├── prisma/            # Database client
│   └── utils.ts           # Helper functions
├── prisma/                # Database schema
├── public/                # Static assets
└── types/                 # TypeScript types
```

## Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure TypeScript types are correct

### Reporting Bugs

Please use [GitHub Issues](../../issues) to report bugs. Include:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details

### Feature Requests

We'd love to hear your ideas! Open an issue with the `feature-request` label.

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Batch image generation
- [ ] Custom model training
- [ ] Community marketplace
- [ ] Advanced analytics
- [ ] API for developers
- [ ] Plugin system
- [ ] Multi-language support

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Vercel](https://vercel.com) for the AI SDK and deployment platform
- [Shadcn](https://ui.shadcn.com) for the UI component library
- [Groq](https://groq.com) for fast inference
- [Metaplex](https://metaplex.com) for NFT standards
- [Hugging Face](https://huggingface.co) for open source models
- All the model providers that make this possible




## Disclaimer

This project is for educational purposes. Please review the terms of service for each AI provider before using their APIs commercially.

---

Built with ❤️ by Cyber Vision 

[⬆ Back to Top](#procreation-ai)
