export const roleSkills = {

FrontendDeveloper:[
"HTML","CSS","JavaScript","TypeScript",
"React","Next.js","Vue","Nuxt.js",
"Angular","Bootstrap","Tailwind CSS",
"Material UI","Redux","Zustand",
"jQuery","SASS","SCSS",
"Webpack","Vite","Babel",
"Responsive Design","UI/UX",
"REST API Integration"
],

BackendDeveloper:[
"Node.js","Express.js","NestJS",
"Python","Django","FastAPI","Flask",
"Java","Spring Boot","Kotlin","javascript",
"C#",".NET Core",
"PHP","Laravel",
"Ruby on Rails",
"Golang","Rust",
"REST API","GraphQL",
"Authentication","JWT",
"Microservices",
"Redis","Kafka"
],

FullStackDeveloper:[
"React","Angular","Vue",
"Node.js","Express",
"Django","SpringBoot",
"MongoDB","MySQL",
"PostgreSQL",
"REST API","GraphQL",
"Docker","AWS"
],

MLEngineer:[
"Python","Machine Learning",
"Deep Learning",
"TensorFlow","PyTorch",
"Keras","Scikit-learn",
"OpenCV","NLP",
"Computer Vision",
"Pandas","NumPy",
"Matplotlib","Seaborn",
"LLM","Transformers",
"HuggingFace",
"MLOps","MLflow",
"Data Engineering"
],

CybersecurityEngineer:[
"Network Security",
"Ethical Hacking",
"Penetration Testing",
"Cryptography",
"SIEM","SOC",
"Kali Linux",
"Firewall",
"Malware Analysis",
"Threat Intelligence",
"OWASP",
"Zero Trust",
"Cloud Security"
],

DevOpsEngineer:[
"Docker","Kubernetes",
"AWS","Azure","GCP",
"CI/CD","Jenkins",
"Terraform","Ansible",
"Linux","Shell Scripting",
"Monitoring",
"Prometheus","Grafana",
"Nginx","Apache"
],

BlockchainDeveloper:[
"Blockchain",
"Ethereum","Solidity",
"Smart Contracts",
"Web3.js","Hardhat",
"Hyperledger",
"Cryptography",
"DeFi","NFT",
"IPFS"
],

Database:[
"MySQL","PostgreSQL",
"MongoDB","Oracle",
"SQL Server",
"SQLite",
"Redis",
"Cassandra",
"DynamoDB",
"Firebase",
"Neo4j",
"Elasticsearch"
]
};

export const careerShifts = {
    "FrontendDeveloper": [
        { "to": "FullStackDeveloper", "match": 85, "bridge": "Node.js & MongoDB" },
        { "to": "MobileAppDeveloper", "match": 75, "bridge": "React Native" }
    ],
    "BackendDeveloper": [
        { "to": "FullStackDeveloper", "match": 85, "bridge": "React or Angular" },
        { "to": "DevOpsEngineer", "match": 65, "bridge": "Docker & CI/CD" }
    ],
    "FullStackDeveloper": [
        { "to": "DevOpsEngineer", "match": 75, "bridge": "Kubernetes & Terraform" },
        { "to": "MLEngineer", "match": 60, "bridge": "Python & Machine Learning" }
    ],
    "MLEngineer": [
        { "to": "DataEngineer", "match": 80, "bridge": "ETL Pipelines & Spark" },
        { "to": "AIOpsEngineer", "match": 75, "bridge": "MLflow & Deployment" }
    ],
    "CybersecurityEngineer": [
        { "to": "DevSecOps", "match": 80, "bridge": "Automation & CI/CD Security" },
        { "to": "CloudArchitect", "match": 60, "bridge": "AWS/Azure Solutions" }
    ],
    "DevOpsEngineer": [
        { "to": "SiteReliabilityEngineer", "match": 90, "bridge": "Advanced Monitoring" },
        { "to": "CloudSecurityEngineer", "match": 70, "bridge": "IAM & Encryption" }
    ],
    "BlockchainDeveloper": [
        { "to": "FullStackDeveloper", "match": 75, "bridge": "Traditional Databases" },
        { "to": "CybersecurityEngineer", "match": 65, "bridge": "Smart Contract Auditing" }
    ],
    "Database": [
        { "to": "DataEngineer", "match": 85, "bridge": "Big Data Tools (Hadoop)" },
        { "to": "BackendDeveloper", "match": 70, "bridge": "API Development (Node/Python)" }
    ],
    "MobileAppDeveloper": [
        { "to": "FullStackDeveloper", "match": 80, "bridge": "Node.js & Databases" },
        { "to": "FrontendDeveloper", "match": 85, "bridge": "Next.js & Web Optimization" }
    ]
};