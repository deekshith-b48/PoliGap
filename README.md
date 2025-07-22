# 🏛️ PoliGap - Policy Review Gap Analyzer

> **Advanced AI-Powered Compliance Analysis Platform**

A comprehensive React-based application featuring,purpose-built for legal, compliance, and audit teams to intelligently analyze policy documents, identify compliance gaps, and generate actionable remediation plans using cutting-edge AI technology.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB.svg)
![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

## 🌟 Key Features

### 📄 **Smart Document Processing**
- **Multi-Format Support**: PDF, Word documents, text files with intelligent validation
- **Advanced PDF Processing**: PDF.js integration with optimized text extraction (80% faster)
- **Smart Document Validation**: 60+ policy-related keywords with confidence scoring
- **Performance Optimizations**: 
  - Limited to first 3 pages for 80% speed improvement
  - Early exit strategy for 70% faster processing
  - Dynamic threshold system based on document length

### 🤖 **AI-Powered Analysis Engine**
- **Google Gemini AI Integration**: Advanced natural language processing for policy analysis
- **Multi-Framework Compliance**: GDPR, HIPAA, SOX, ISO 27001, PCI DSS, CCPA, NIST, and 12+ more
- **Comprehensive Gap Analysis**: Critical, High, Medium, Low severity classification
- **Industry Benchmarking**: Compare against industry averages and best practices
- **Maturity Assessment**: 5-level scoring system (Initial → Advanced)

### 📊 **Advanced Results & Reporting**
- **Interactive Dashboard**: Filter by severity, framework, and compliance category
- **Multiple Export Formats**: CSV, JSON, PDF with comprehensive metadata
- **Visual Gap Prioritization**: Color-coded severity indicators
- **Real-time Filtering**: Dynamic search and filter capabilities
- **Detailed Remediation Plans**: Timeline-based action items with business impact analysis

### 🎓 **Comprehensive Knowledge Hub**
- **12+ Compliance Frameworks**: Interactive explorer with search and filtering
- **Regional Coverage**: Global, US, EU, and jurisdiction-specific requirements
- **Implementation Guidance**: Detailed requirements with practical examples
- **Category Organization**: Data Protection, Financial, Healthcare, Cybersecurity

### 🔧 **Policy Generation Tools**
- **AI Policy Generator**: Create framework-specific policies for any industry
- **Professional PDF Export**: Table of contents, structured formatting
- **Industry Templates**: Technology, Healthcare, Finance, and more
- **Customizable Sections**: Tailored content based on specific requirements

### 💬 **Expert Chat System**
- **AI Compliance Consultant**: Real-time policy and compliance guidance
- **Context-Aware Responses**: Understands conversation history
- **Professional Formatting**: Structured advice with actionable recommendations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager
- Modern web browser with ES6+ support

### 1. Installation

```bash
# Clone the repository
git clone <repository-url>
cd PoliGap

# Install dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Supabase Configuration (Optional - Mock client available)
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini AI API Key (Required for AI features)
VITE_GEMINI_API_KEY=your_gemini_api_key
```

#### Supabase Setup (Optional)
If using Supabase for document storage:

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Create a storage bucket named `policy-documents` with RLS enabled
3. Create the analyses table:

```sql
CREATE TABLE analyses (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  analysis_result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Google Gemini AI Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key for Gemini Pro
3. Add the key to your `.env` file

### 3. Run the Application

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run serve
```

The application will be available at `http://localhost:5173`

## 🏗️ Architecture Overview

### **Core Components**

```
src/
├── App.jsx                 # Main application router and state management
├── index.jsx              # React application entry point
├── components/
│   ├── DocumentUpload.jsx      # Smart document upload with validation
│   ├── AnalysisResults.jsx     # Results dashboard with filtering/export
│   ├── DetailedPlan.jsx        # Remediation planning with timelines
│   ├── PolicyGenerator.jsx     # AI-powered policy creation
│   ├── KnowCompliances.jsx     # Compliance framework explorer
│   ├── ChatExpert.jsx          # AI compliance consultant
│   ├── ComplianceMonitor.jsx   # Real-time monitoring dashboard
│   ├── Navigation.jsx          # Responsive navigation system
│   └── LandingPage.jsx         # Modern landing page
├── lib/
│   ├── gemini.js              # Google Gemini AI integration
│   ├── rulesBenchmarking.js   # Compliance framework engine
│   ├── supabase.js            # Database and storage client
│   └── testGemini.js          # API testing utilities
└── utils/
    └── testPdfParsing.js      # PDF processing validation
```

### **Technology Stack**

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | Frontend framework |
| **Vite** | 5.4.8 | Build tool and dev server |
| **Tailwind CSS** | 3.4.10 | Styling and Neobrutalism theme |
| **PDF.js** | 5.3.93 | Client-side PDF text extraction |
| **Google Gemini AI** | Latest | Natural language processing |
| **Supabase** | 2.45.4 | Database and file storage |
| **jsPDF** | 3.0.1 | PDF report generation |
| **html2canvas** | 1.4.1 | Screenshot capabilities |

## 🎯 Core Functionalities

### **1. Document Analysis Workflow**
1. **Upload**: Drag-and-drop or browse for policy documents
2. **Validation**: Smart detection of policy content with confidence scoring
3. **Processing**: PDF text extraction with performance optimizations
4. **Analysis**: AI-powered gap identification across multiple frameworks
5. **Results**: Interactive dashboard with filtering and export options

### **2. Compliance Framework Support**
- **GDPR** (General Data Protection Regulation)
- **HIPAA** (Health Insurance Portability and Accountability Act)
- **SOX** (Sarbanes-Oxley Act)
- **ISO 27001** (Information Security Management)
- **PCI DSS** (Payment Card Industry Data Security Standard)
- **CCPA** (California Consumer Privacy Act)
- **NIST** (National Institute of Standards and Technology)
- **FISMA** (Federal Information Security Management Act)
- **PIPEDA** (Personal Information Protection and Electronic Documents Act)
- **And 3+ more frameworks

### **3. Advanced Features**
- **Performance Optimizations**: Up to 90% faster processing
- **Intelligent Validation**: 60+ policy keywords with dynamic thresholds
- **Export Capabilities**: CSV, JSON, PDF with metadata
- **Real-time Monitoring**: Ongoing compliance tracking
- **Industry Benchmarking**: Compare against peer organizations

## 📈 Performance Optimizations

Based on extensive testing documented in `PERFORMANCE_OPTIMIZATIONS.md`:

- **PDF Processing**: 80% speed improvement with page limits
- **Keyword Analysis**: 90% faster with streamlined matching
- **Early Exit Strategy**: 70% faster for obvious policy documents
- **Content Limits**: 60% faster for large documents
- **Smart Caching**: Reduced API calls and improved response times

## 🛡️ Security & Validation

Advanced document validation system (detailed in `VALIDATION_IMPROVEMENTS.md`):

- **Multi-factor Analysis**: Keyword scoring, structure analysis, content patterns
- **Security Checks**: Prevents non-policy document uploads
- **Content Verification**: Ensures legitimate policy documents
- **Error Handling**: Robust validation with user feedback
- **Privacy Protection**: Local processing with optional cloud storage

## 📚 Usage Examples

### **Basic Analysis**
1. Navigate to the Policy Analyzer
2. Upload a policy document (PDF, Word, or text)
3. Wait for AI analysis to complete
4. Review identified gaps and recommendations
5. Export results for stakeholder review

### **Advanced Workflow**
1. Upload multiple policy documents
2. Filter results by specific compliance frameworks
3. Generate detailed remediation plans with timelines
4. Use the expert chat for specific compliance questions
5. Monitor ongoing compliance status

## 🧪 Testing

The application includes comprehensive testing utilities:

```bash
# Test Gemini AI integration
npm run test:gemini

# Validate PDF parsing
npm run test:pdf

# Run full test suite
npm test
```

## 🔧 Development

### **Project Structure**
- Clean, modular component architecture
- Separation of concerns with dedicated lib/ directory
- Centralized styling with Tailwind CSS
- Environment-based configuration management

### **Development Commands**
```bash
# Start development server with hot reload
npm run dev

# Build optimized production bundle
npm run build

# Preview production build locally
npm run serve

# Run linting and code formatting
npm run lint

# Generate component documentation
npm run docs
```

### **Contributing**
1. Fork the repository
2. Create a feature branch
3. Implement changes with tests
4. Submit a pull request with detailed description

## 🔍 Troubleshooting

### **Common Issues**

**Q: PDF upload fails with "Invalid document" error**
A: Ensure the PDF contains policy-related content. The system validates documents using 60+ keywords.

**Q: Gemini AI analysis not working**
A: Verify your `VITE_GEMINI_API_KEY` is correctly set in the `.env` file.

**Q: Slow performance on large PDFs**
A: The system automatically limits processing to the first 3 pages for optimization. For full document analysis, consider splitting large PDFs.

**Q: Export functionality not working**
A: Ensure your browser supports the File API and doesn't block downloads.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, questions, or feature requests:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation and troubleshooting guide

## 🎨 Design Philosophy

The application features a **Neobrutalism** design approach:
- Bold, high-contrast colors
- Sharp, geometric shapes
- Minimal use of shadows and gradients
- Focus on functionality and usability
- Modern, professional appearance suitable for enterprise use

---

**Built with ❤️ for compliance professionals worldwide**
