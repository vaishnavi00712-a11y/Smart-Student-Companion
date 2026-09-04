export interface VivaQuestion {
  id: number;
  question: string;
  category: 'Core Concepts' | 'FastAPI & Python' | 'MongoDB & Database' | 'Academic Logic';
  answer: string;
  keyPoints: string[];
}

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    question: "Why did you use Python for this backend?",
    category: "FastAPI & Python",
    answer: "Python is clear, readable, and developer-friendly. It has a rich ecosystem for web development and data analytics. Since academic management involves calculating percentages, grade distributions, and attendance predictions, Python's clean mathematical syntax and robust libraries make it an ideal choice for this module.",
    keyPoints: ["Clean syntax", "Built-in mathematical support", "Fast prototyping", "Huge community"]
  },
  {
    id: 2,
    question: "Why did you choose FastAPI instead of Django or Flask?",
    category: "FastAPI & Python",
    answer: "FastAPI was chosen because it is high-performance, asynchronous natively (using ASGI), provides automatic interactive Swagger documentation (/docs), and enforces strict data validation using Pydantic. Flask requires many third-party plugins for validation and docs, while Django is too heavy for a dedicated microservice backend.",
    keyPoints: ["Automatic Swagger UI docs", "Built-in Pydantic validation", "High speed & async support", "Type hinting"]
  },
  {
    id: 3,
    question: "What is an API?",
    category: "Core Concepts",
    answer: "An API (Application Programming Interface) is a set of rules and protocols that allows two different software programs to communicate. In our project, our FastAPI backend exposes endpoints so that the React frontend can fetch and save student academic data without knowing the internal database structure.",
    keyPoints: ["Software intermediary", "Bridge between Frontend and Backend", "Standardized data exchange format (JSON)"]
  },
  {
    id: 4,
    question: "What is a REST API?",
    category: "Core Concepts",
    answer: "REST stands for Representational State Transfer. A REST API is an architectural style that uses standard HTTP methods (GET, POST, PUT, DELETE) to perform operations on resources identified by URIs, and exchanges data typically in JSON format. It is stateless, meaning each request contains all necessary information.",
    keyPoints: ["Uses HTTP methods", "Stateless communication", "Resource-based URLs", "Standard JSON payloads"]
  },
  {
    id: 5,
    question: "What is MongoDB and why use it here?",
    category: "MongoDB & Database",
    answer: "MongoDB is a NoSQL, document-oriented database that stores records as flexible, JSON-like BSON documents. It is schema-flexible, scales easily, and maps naturally to JavaScript and Python objects. Student assignments, attendance, and marks can be stored as intuitive document records.",
    keyPoints: ["NoSQL document database", "JSON/BSON format", "Flexible schema", "Fast reads & writes"]
  },
  {
    id: 6,
    question: "How does FastAPI connect to MongoDB?",
    category: "MongoDB & Database",
    answer: "FastAPI connects to MongoDB using 'Motor', which is the official asynchronous Python driver for MongoDB. We read the connection string securely from the .env file using python-dotenv, instantiate AsyncIOMotorClient, and access collections asynchronously using 'await'.",
    keyPoints: ["Motor async driver", "AsyncIOMotorClient", "Non-blocking I/O", "Connection URL from .env"]
  },
  {
    id: 7,
    question: "What does CRUD stand for, and where is it used in your project?",
    category: "Core Concepts",
    answer: "CRUD stands for Create, Read, Update, and Delete. In our Assignment Management module: POST /api/assignments creates a task, GET /api/assignments/{student_id} reads tasks, PUT /api/assignments/{id} updates tasks, and DELETE /api/assignments/{id} deletes a task.",
    keyPoints: ["Create (POST)", "Read (GET)", "Update (PUT)", "Delete (DELETE)"]
  },
  {
    id: 8,
    question: "What is Pydantic and what role does it play?",
    category: "FastAPI & Python",
    answer: "Pydantic is a data parsing and validation library based on Python type hints. It automatically validates incoming JSON payloads. If a student sends negative marks or missing fields, Pydantic immediately rejects the request with a 422 Unprocessable Entity or 400 Bad Request before database access occurs.",
    keyPoints: ["Data parsing & validation", "Type hinting enforcement", "Automatic error responses", "Data sanitization"]
  },
  {
    id: 9,
    question: "What is CORS and why is it needed?",
    category: "Core Concepts",
    answer: "CORS stands for Cross-Origin Resource Sharing. Browsers have a security mechanism called the Same-Origin Policy that prevents a frontend on 'http://localhost:3000' from accessing a backend on 'http://localhost:8000'. By adding CORSMiddleware in FastAPI, we explicitly whitelist our React frontend origin.",
    keyPoints: ["Security mechanism in browsers", "Allows cross-origin HTTP requests", "Configured via CORSMiddleware", "Restricted to trusted domains"]
  },
  {
    id: 10,
    question: "What is JSON?",
    category: "Core Concepts",
    answer: "JSON (JavaScript Object Notation) is a lightweight, human-readable data interchange format. It uses key-value pairs and arrays. FastAPI automatically converts Python dictionaries into JSON strings when returning HTTP responses, and converts incoming JSON into Pydantic models.",
    keyPoints: ["Key-value text format", "Language-independent", "Lightweight data exchange", "Native to web browsers"]
  },
  {
    id: 11,
    question: "How is the attendance percentage calculated?",
    category: "Academic Logic",
    answer: "The backend calculates it using the formula: (attended_classes / total_classes) * 100, rounded to 2 decimal places. If total_classes is 0, it safely handles division-by-zero by returning 100.0%.",
    keyPoints: ["Formula: (Attended / Total) * 100", "Division by zero guard", "Rounded to 2 decimals"]
  },
  {
    id: 12,
    question: "How does attendance prediction work mathematically?",
    category: "Academic Logic",
    answer: "If a student has attendance below 75%, we calculate the minimum number of consecutive upcoming classes (x) they must attend: (Attended + x) / (Total + x) >= 0.75. Solving for x yields: x = ceil((75*Total - 100*Attended) / 25) = ceil(3*Total - 4*Attended).",
    keyPoints: ["Equation: (A + x)/(T + x) >= 0.75", "Formula: x = ceil(3T - 4A)", "Consecutive classes without absence", "Answers exact recovery target"]
  },
  {
    id: 13,
    question: "How are marks calculated in your backend?",
    category: "Academic Logic",
    answer: "The student provides internal marks and external marks. The backend automatically computes: total_marks = internal + external, and percentage = (total_marks / max_marks) * 100. The frontend never calculates the total, ensuring integrity.",
    keyPoints: ["Internal + External sum", "Percentage against maximum possible marks", "Computed server-side"]
  },
  {
    id: 14,
    question: "How is the grade calculated?",
    category: "Academic Logic",
    answer: "We implemented a modular Python function 'calculate_grade(percentage)' with a configurable grading scale: >=90% is A+, 80-89% is A, 70-79% is B+, 60-69% is B, 50-59% is C, 40-49% is D, and below 40% is F.",
    keyPoints: ["Modular lookup function", "Configurable scale in backend", "Standard college letter grades"]
  },
  {
    id: 15,
    question: "What happens when invalid data is sent to an endpoint?",
    category: "FastAPI & Python",
    answer: "FastAPI and Pydantic intercept the request during validation. It immediately halts execution and returns an HTTP status code (400 or 422) with a structured JSON error detailing which field was invalid, protecting the database from corrupted records.",
    keyPoints: ["Early interception", "HTTP 400 or 422 status code", "Descriptive JSON error message", "Database protection"]
  },
  {
    id: 16,
    question: "How does React communicate with this Python backend?",
    category: "Core Concepts",
    answer: "React uses the browser's native 'fetch()' API or Axios to make asynchronous HTTP calls (e.g. fetch('http://localhost:8000/api/assignments/student123')). FastAPI processes the request, queries MongoDB, and responds with JSON, which React converts to state and renders in components.",
    keyPoints: ["HTTP client (fetch or Axios)", "Asynchronous promises (async/await)", "JSON serialization & deserialization", "React state update"]
  },
  {
    id: 17,
    question: "What is an HTTP POST request?",
    category: "Core Concepts",
    answer: "An HTTP POST request is a method used to send data to the server to create a new resource. The payload is sent inside the HTTP request body in JSON format, unlike GET where parameters are attached to the URL.",
    keyPoints: ["Creates new resource", "Sends data in request body", "Not cached by browsers", "Used for submitting assignments, marks, attendance"]
  },
  {
    id: 18,
    question: "What is the difference between GET and POST?",
    category: "Core Concepts",
    answer: "GET requests data from a specified resource without altering server state; parameters are sent in the query string. POST submits data to be processed and saved into the database; parameters are sent securely in the request body and have no length restrictions.",
    keyPoints: ["GET: Read-only, idempotent, query params", "POST: Creates data, request body, modifies state"]
  },
  {
    id: 19,
    question: "Why should credentials and connection strings be stored in .env?",
    category: "Core Concepts",
    answer: "Storing credentials like MongoDB URLs and database passwords in a .env file keeps sensitive secrets out of source code. When pushing to GitHub, .env is ignored via .gitignore, preventing credential leaks and allowing different environments (development vs production) without modifying code.",
    keyPoints: ["Security compliance", "Prevents credential leaks on GitHub", "Separates config from code", "Supports dev/prod environment switching"]
  },
  {
    id: 20,
    question: "How can authentication (JWT or Firebase) be integrated later?",
    category: "Core Concepts",
    answer: "FastAPI has built-in dependency injection ('Depends'). When the authentication team finishes their JWT or Firebase Auth module, we can create an 'auth_guard' dependency that extracts the Bearer token from the HTTP Authorization header and injects the authenticated student_id into our route handlers.",
    keyPoints: ["FastAPI Depends() injection", "Bearer token in Authorization header", "JWT / Firebase token verification", "Zero disruption to existing route logic"]
  }
];
