export const roleSkills = {

    FrontendDeveloper: [
        "HTML", "CSS", "JavaScript", "TypeScript",
        "React", "Next.js", "Vue", "Nuxt.js",
        "Angular", "Bootstrap", "Tailwind CSS",
        "Material UI", "Redux", "Zustand",
        "jQuery", "SASS", "SCSS",
        "Webpack", "Vite", "Babel",
        "Responsive Design", "UI/UX",
        "REST API Integration"
    ],

    BackendDeveloper: [
        "Node.js", "Express.js", "NestJS",
        "Python", "Django", "FastAPI", "Flask",
        "Java", "Spring Boot", "Kotlin", "javascript",
        "C#", ".NET Core",
        "PHP", "Laravel",
        "Ruby on Rails",
        "Golang", "Rust",
        "REST API", "GraphQL",
        "Authentication", "JWT",
        "Microservices",
        "Redis", "Kafka"
    ],

    FullStackDeveloper: [
        "React", "Angular", "Vue",
        "Node.js", "Express",
        "Django", "SpringBoot",
        "MongoDB", "MySQL",
        "PostgreSQL",
        "REST API", "GraphQL",
        "Docker", "AWS"
    ],

    MLEngineer: [
        "Python", "Machine Learning",
        "Deep Learning",
        "TensorFlow", "PyTorch",
        "Keras", "Scikit-learn",
        "OpenCV", "NLP",
        "Computer Vision",
        "Pandas", "NumPy",
        "Matplotlib", "Seaborn",
        "LLM", "Transformers",
        "HuggingFace",
        "MLOps", "MLflow",
        "Data Engineering"
    ],

    CybersecurityEngineer: [
        "Network Security",
        "Ethical Hacking",
        "Penetration Testing",
        "Cryptography",
        "SIEM", "SOC",
        "Kali Linux",
        "Firewall",
        "Malware Analysis",
        "Threat Intelligence",
        "OWASP",
        "Zero Trust",
        "Cloud Security"
    ],

    DevOpsEngineer: [
        "Docker", "Kubernetes",
        "AWS", "Azure", "GCP",
        "CI/CD", "Jenkins",
        "Terraform", "Ansible",
        "Linux", "Shell Scripting",
        "Monitoring",
        "Prometheus", "Grafana",
        "Nginx", "Apache"
    ],

    BlockchainDeveloper: [
        "Blockchain",
        "Ethereum", "Solidity",
        "Smart Contracts",
        "Web3.js", "Hardhat",
        "Hyperledger",
        "Cryptography",
        "DeFi", "NFT",
        "IPFS"
    ],

    Database: [
        "MySQL", "PostgreSQL",
        "MongoDB", "Oracle",
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
    "WebDeveloper": [
        {
            "to": "FullStackDeveloper",
            "match": 80,
            "bridge": "Node.js & Databases",
            "links": ["https://nodejs.org/", "https://www.mongodb.com/"],
            "skills_comparison": [
                { "subject": "UI/UX", "A": 90, "B": 70, "fullMark": 100 },
                { "subject": "Backend", "A": 20, "B": 85, "fullMark": 100 },
                { "subject": "Database", "A": 15, "B": 80, "fullMark": 100 },
                { "subject": "DevOps", "A": 10, "B": 75, "fullMark": 100 }
            ]
        }
    ],
    "SoftwareEngineer": [
        {
            "to": "SystemArchitect",
            "match": 70,
            "bridge": "System Design & Distributed Systems",
            "links": ["https://github.com/donnemartin/system-design-primer"],
            "skills_comparison": [
                { "subject": "Coding", "A": 95, "B": 70, "fullMark": 100 },
                { "subject": "Design Patterns", "A": 60, "B": 90, "fullMark": 100 },
                { "subject": "Scalability", "A": 40, "B": 95, "fullMark": 100 },
                { "subject": "Infrastructure", "A": 30, "B": 85, "fullMark": 100 }
            ]
        }
    ],
    "DataScientist": [
        {
            "to": "MLEngineer",
            "match": 85,
            "bridge": "MLOps & Model Deployment",
            "links": ["https://ml-ops.org/"],
            "skills_comparison": [
                { "subject": "Analysis", "A": 95, "B": 70, "fullMark": 100 },
                { "subject": "Modeling", "A": 90, "B": 85, "fullMark": 100 },
                { "subject": "Deployment", "A": 20, "B": 90, "fullMark": 100 },
                { "subject": "Engineering", "A": 30, "B": 85, "fullMark": 100 }
            ]
        }
    ],
    "FrontendDeveloper": [
        {
            "to": "FullStackDeveloper",
            "match": 85,
            "bridge": "Node.js & MongoDB",
            "links": ["https://www.mongodb.com/basics/node-js", "https://expressjs.com/"],
            "skills_comparison": [
                { "subject": "UI Design", "A": 90, "B": 70, "fullMark": 100 },
                { "subject": "State Mgmt", "A": 85, "B": 80, "fullMark": 100 },
                { "subject": "Backend", "A": 10, "B": 85, "fullMark": 100 },
                { "subject": "Database", "A": 5, "B": 80, "fullMark": 100 },
                { "subject": "APIs", "A": 40, "B": 90, "fullMark": 100 }
            ]
        },
        {
            "to": "MobileAppDeveloper",
            "match": 75,
            "bridge": "React Native",
            "links": ["https://reactnative.dev/docs/getting-started"],
            "skills_comparison": [
                { "subject": "React", "A": 90, "B": 95, "fullMark": 100 },
                { "subject": "Native Features", "A": 10, "B": 80, "fullMark": 100 },
                { "subject": "Mobile UI", "A": 60, "B": 90, "fullMark": 100 },
                { "subject": "Architecture", "A": 70, "B": 80, "fullMark": 100 }
            ]
        }
    ],
    "BackendDeveloper": [
        {
            "to": "FullStackDeveloper",
            "match": 85,
            "bridge": "React or Angular",
            "links": ["https://react.dev/", "https://angular.io/"],
            "skills_comparison": [
                { "subject": "Backend", "A": 90, "B": 85, "fullMark": 100 },
                { "subject": "Database", "A": 85, "B": 80, "fullMark": 100 },
                { "subject": "Frontend UI", "A": 15, "B": 90, "fullMark": 100 },
                { "subject": "CSS/Design", "A": 10, "B": 85, "fullMark": 100 },
                { "subject": "Client State", "A": 20, "B": 80, "fullMark": 100 }
            ]
        },
        {
            "to": "DevOpsEngineer",
            "match": 65,
            "bridge": "Docker & CI/CD",
            "links": ["https://www.docker.com/get-started", "https://github.com/features/actions"],
            "skills_comparison": [
                { "subject": "Coding", "A": 90, "B": 60, "fullMark": 100 },
                { "subject": "Infrastructure", "A": 20, "B": 90, "fullMark": 100 },
                { "subject": "CI/CD", "A": 30, "B": 95, "fullMark": 100 },
                { "subject": "Monitoring", "A": 15, "B": 85, "fullMark": 100 },
                { "subject": "Automation", "A": 40, "B": 90, "fullMark": 100 }
            ]
        }
    ],
    "FullStackDeveloper": [
        {
            "to": "DevOpsEngineer",
            "match": 75,
            "bridge": "Kubernetes & Terraform",
            "links": ["https://kubernetes.io/", "https://www.terraform.io/"],
            "skills_comparison": [
                { "subject": "App Logic", "A": 95, "B": 40, "fullMark": 100 },
                { "subject": "Orchestration", "A": 20, "B": 95, "fullMark": 100 },
                { "subject": "IaC", "A": 15, "B": 90, "fullMark": 100 },
                { "subject": "Scale/Security", "A": 40, "B": 85, "fullMark": 100 }
            ]
        },
        {
            "to": "MLEngineer",
            "match": 60,
            "bridge": "Python & Machine Learning",
            "links": ["https://scikit-learn.org/", "https://www.tensorflow.org/"],
            "skills_comparison": [
                { "subject": "Web Build", "A": 95, "B": 40, "fullMark": 100 },
                { "subject": "Math/Stats", "A": 25, "B": 90, "fullMark": 100 },
                { "subject": "Data Models", "A": 20, "B": 95, "fullMark": 100 },
                { "subject": "Algorithm", "A": 50, "B": 85, "fullMark": 100 }
            ]
        }
    ],
    "MLEngineer": [
        {
            "to": "DataEngineer",
            "match": 80,
            "bridge": "ETL Pipelines & Spark",
            "links": ["https://spark.apache.org/", "https://airflow.apache.org/"],
            "skills_comparison": [
                { "subject": "Modeling", "A": 95, "B": 40, "fullMark": 100 },
                { "subject": "ETL/Spark", "A": 30, "B": 95, "fullMark": 100 },
                { "subject": "Storage", "A": 50, "B": 90, "fullMark": 100 },
                { "subject": "Pipelining", "A": 40, "B": 90, "fullMark": 100 }
            ]
        },
        { "to": "AIOpsEngineer", "match": 75, "bridge": "MLflow & Deployment" }
    ],
    "CybersecurityEngineer": [
        {
            "to": "DevSecOps",
            "match": 80,
            "bridge": "Automation & CI/CD Security",
            "links": ["https://www.hcltech.com/cloud-native-security", "https://snyk.io/learn/what-is-devsecops/"],
            "skills_comparison": [
                { "subject": "Auditing", "A": 95, "B": 80, "fullMark": 100 },
                { "subject": "Automation", "A": 30, "B": 90, "fullMark": 100 },
                { "subject": "CI/CD Pipe", "A": 20, "B": 95, "fullMark": 100 },
                { "subject": "Cloud Policy", "A": 60, "B": 85, "fullMark": 100 }
            ]
        },
        { "to": "CloudArchitect", "match": 60, "bridge": "AWS/Azure Solutions" }
    ],
    "DevOpsEngineer": [
        {
            "to": "SiteReliabilityEngineer",
            "match": 90,
            "bridge": "Advanced Monitoring",
            "links": ["https://sre.google/", "https://prometheus.io/"],
            "skills_comparison": [
                { "subject": "Deployment", "A": 95, "B": 85, "fullMark": 100 },
                { "subject": "Monitoring", "A": 80, "B": 95, "fullMark": 100 },
                { "subject": "Availability", "A": 70, "B": 90, "fullMark": 100 },
                { "subject": "On-call/Perf", "A": 65, "B": 90, "fullMark": 100 }
            ]
        },
        { "to": "CloudSecurityEngineer", "match": 70, "bridge": "IAM & Encryption" }
    ],
    "BlockchainDeveloper": [
        {
            "to": "FullStackDeveloper",
            "match": 75,
            "bridge": "Traditional Databases",
            "links": ["https://www.postgresql.org/", "https://www.mongodb.com/"],
            "skills_comparison": [
                { "subject": "Contracts", "A": 95, "B": 10, "fullMark": 100 },
                { "subject": "Web Dev", "A": 40, "B": 95, "fullMark": 100 },
                { "subject": "SQL/NoSQL", "A": 20, "B": 90, "fullMark": 100 },
                { "subject": "Auth/Security", "A": 85, "B": 80, "fullMark": 100 }
            ]
        },
        { "to": "CybersecurityEngineer", "match": 65, "bridge": "Smart Contract Auditing" }
    ],
    "Database": [
        {
            "to": "DataEngineer",
            "match": 85,
            "bridge": "Big Data Tools (Hadoop)",
            "links": ["https://hadoop.apache.org/", "https://www.snowflake.com/"],
            "skills_comparison": [
                { "subject": "SQL/Design", "A": 95, "B": 80, "fullMark": 100 },
                { "subject": "Big Data", "A": 20, "B": 95, "fullMark": 100 },
                { "subject": "Spark/Scala", "A": 15, "B": 90, "fullMark": 100 },
                { "subject": "ETL Pipes", "A": 40, "B": 90, "fullMark": 100 }
            ]
        },
        { "to": "BackendDeveloper", "match": 70, "bridge": "API Development (Node/Python)" }
    ],
    "MobileAppDeveloper": [
        {
            "to": "FullStackDeveloper",
            "match": 80,
            "bridge": "Node.js & Databases",
            "links": ["https://nodejs.org/", "https://www.mongodb.com/"],
            "skills_comparison": [
                { "subject": "Client Code", "A": 95, "B": 90, "fullMark": 100 },
                { "subject": "Server Side", "A": 15, "B": 95, "fullMark": 100 },
                { "subject": "DB Design", "A": 10, "B": 90, "fullMark": 100 },
                { "subject": "REST/Graph", "A": 60, "B": 90, "fullMark": 100 }
            ]
        },
        { "to": "FrontendDeveloper", "match": 85, "bridge": "Next.js & Web Optimization" }
    ]
};