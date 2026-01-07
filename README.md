# Ovarian Aid

A web-based medical image classification application designed to assist in ovarian cancer detection using machine learning. This application uses TensorFlow.js to run AI models directly in the browser for real-time image analysis.

## 🌐 Live Demo

**Live Application**: [https://deluxe-custard-e6611b.netlify.app/](https://deluxe-custard-e6611b.netlify.app/)

## 🎯 Purpose

Ovarian Aid is a thesis project for Fall 2025 that aims to support medical professionals in early detection of ovarian abnormalities through AI-powered image classification. The application provides a user-friendly interface for uploading medical images and receiving classification predictions.

## ⚕️ Important Medical Disclaimer

**This application is for research and educational purposes only. It should not be used as a substitute for professional medical diagnosis, treatment, or advice. Always consult qualified healthcare professionals for medical decisions.**

## 🚀 Features

- **Real-time Image Classification**: Upload medical images and get instant AI-powered predictions
- **Browser-based AI**: Uses TensorFlow.js for client-side machine learning - no server required
- **Responsive Design**: Built with Tailwind CSS for modern, mobile-friendly UI
- **Privacy-focused**: All processing happens locally in your browser
- **User Consent**: Built-in consent mechanism for medical data handling

## 🛠️ Technology Stack

- **Frontend**: React 19.2.0 with Vite
- **AI/ML**: TensorFlow.js for in-browser machine learning
- **Styling**: Tailwind CSS for responsive design
- **Build Tool**: Vite with Hot Module Replacement (HMR)
- **Linting**: ESLint for code quality

## 📋 Prerequisites

- Node.js (version 18 or higher recommended)
- npm or yarn package manager
- Modern web browser with WebGL support

## 🔧 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd ovarian-aid
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint for code quality checks

## 🧠 AI Model

The application uses a pre-trained TensorFlow.js model located in the `public/model/` directory:
- `model.json` - Model architecture
- `weights.bin` - Model weights
- `metadata.json` - Model metadata and class labels

## 🏗️ Project Structure

```
ovarian-aid/
├── public/
│   └── model/           # AI model files
├── src/
│   ├── components/
│   │   ├── ImageClassifier.jsx  # Main classification component
│   │   └── Footer.jsx           # Application footer
│   ├── assets/          # Static assets
│   ├── App.jsx          # Main application component
│   └── main.jsx         # Application entry point
├── package.json         # Dependencies and scripts
└── README.md           # Project documentation
```

## 🔒 Privacy & Security

- All image processing occurs locally in the browser
- No images are uploaded to external servers
- User consent is required before processing
- No personal data is stored or transmitted

## 🤝 Contributing

This is a thesis project. If you're interested in contributing or have suggestions, please reach out to the project maintainer.

## 📚 Research Context

This application is part of a thesis research project for Fall 2025, focusing on the application of machine learning techniques in medical image analysis for ovarian cancer detection.

## ⚖️ License

This project is for educational and research purposes. Please refer to the license file for specific terms and conditions.

## 📞 Support

For questions about this thesis project, please contact the research team through appropriate academic channels.

---

**Note**: This is a research prototype and should not be used for actual medical diagnosis.
