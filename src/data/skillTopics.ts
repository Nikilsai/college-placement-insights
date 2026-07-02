// 10-level topic ladders for each seed skill (keyed by skill_set_id).
// Levels 1-3 fundamentals, 4-7 intermediate, 8-10 advanced/applied.

export interface SkillTopicLevel {
  level_number: number;
  topic: string;
}

export const SKILL_TOPICS: Record<number, SkillTopicLevel[]> = {
  // Data Structures & Algorithms
  1: [
    { level_number: 1, topic: "Arrays, strings and time/space complexity basics" },
    { level_number: 2, topic: "Linked lists, stacks and queues" },
    { level_number: 3, topic: "Recursion and basic sorting/searching" },
    { level_number: 4, topic: "Hash maps, sets and two-pointer patterns" },
    { level_number: 5, topic: "Trees, BSTs and traversals" },
    { level_number: 6, topic: "Heaps, priority queues and greedy techniques" },
    { level_number: 7, topic: "Graphs: BFS, DFS and shortest paths" },
    { level_number: 8, topic: "Dynamic programming patterns" },
    { level_number: 9, topic: "Advanced graphs, tries and segment trees" },
    { level_number: 10, topic: "Optimization, contest-level problem solving" },
  ],
  // Object-Oriented Programming
  2: [
    { level_number: 1, topic: "Classes, objects and encapsulation" },
    { level_number: 2, topic: "Constructors, methods and access modifiers" },
    { level_number: 3, topic: "Inheritance and composition" },
    { level_number: 4, topic: "Polymorphism and interfaces/abstract classes" },
    { level_number: 5, topic: "SOLID principles" },
    { level_number: 6, topic: "Common design patterns (factory, singleton)" },
    { level_number: 7, topic: "Behavioral and structural patterns" },
    { level_number: 8, topic: "Clean code and refactoring at scale" },
    { level_number: 9, topic: "Domain-driven design fundamentals" },
    { level_number: 10, topic: "Architecting large OOP systems" },
  ],
  // SQL & Databases
  3: [
    { level_number: 1, topic: "SELECT, WHERE and basic filtering" },
    { level_number: 2, topic: "Joins, grouping and aggregations" },
    { level_number: 3, topic: "Subqueries and set operations" },
    { level_number: 4, topic: "Normalization and schema design" },
    { level_number: 5, topic: "Indexes and query performance basics" },
    { level_number: 6, topic: "Transactions, ACID and isolation levels" },
    { level_number: 7, topic: "Window functions and CTEs" },
    { level_number: 8, topic: "Query optimization and execution plans" },
    { level_number: 9, topic: "Partitioning, sharding and replication" },
    { level_number: 10, topic: "Distributed data and NoSQL trade-offs" },
  ],
  // Cloud Fundamentals (AWS/Azure)
  4: [
    { level_number: 1, topic: "Cloud models: IaaS, PaaS, SaaS" },
    { level_number: 2, topic: "Compute, storage and networking basics" },
    { level_number: 3, topic: "IAM, roles and access control" },
    { level_number: 4, topic: "Managed databases and object storage" },
    { level_number: 5, topic: "Serverless functions and containers" },
    { level_number: 6, topic: "Load balancing and auto-scaling" },
    { level_number: 7, topic: "Infrastructure as code (Terraform/CloudFormation)" },
    { level_number: 8, topic: "Monitoring, cost optimization and security" },
    { level_number: 9, topic: "Multi-region, high-availability architectures" },
    { level_number: 10, topic: "Cloud-native and well-architected design" },
  ],
  // Operating Systems
  5: [
    { level_number: 1, topic: "Processes, threads and the OS role" },
    { level_number: 2, topic: "CPU scheduling algorithms" },
    { level_number: 3, topic: "Memory management and paging" },
    { level_number: 4, topic: "Concurrency, mutexes and semaphores" },
    { level_number: 5, topic: "Deadlocks: detection and avoidance" },
    { level_number: 6, topic: "Virtual memory and demand paging" },
    { level_number: 7, topic: "File systems and I/O" },
    { level_number: 8, topic: "Inter-process communication" },
    { level_number: 9, topic: "Kernel internals and system calls" },
    { level_number: 10, topic: "Performance tuning and real-time OS" },
  ],
  // Computer Networks
  6: [
    { level_number: 1, topic: "OSI and TCP/IP models" },
    { level_number: 2, topic: "IP addressing and subnetting" },
    { level_number: 3, topic: "TCP vs UDP and ports" },
    { level_number: 4, topic: "DNS, DHCP and NAT" },
    { level_number: 5, topic: "HTTP/HTTPS and the request lifecycle" },
    { level_number: 6, topic: "Routing and switching basics" },
    { level_number: 7, topic: "Network security and TLS" },
    { level_number: 8, topic: "Load balancing and CDNs" },
    { level_number: 9, topic: "Congestion control and QoS" },
    { level_number: 10, topic: "Designing scalable network topologies" },
  ],
  // Aptitude & Logical Reasoning
  7: [
    { level_number: 1, topic: "Number systems and arithmetic basics" },
    { level_number: 2, topic: "Percentages, ratios and averages" },
    { level_number: 3, topic: "Profit, loss and interest" },
    { level_number: 4, topic: "Time, speed, distance and work" },
    { level_number: 5, topic: "Permutations, combinations and probability" },
    { level_number: 6, topic: "Series, sequences and pattern recognition" },
    { level_number: 7, topic: "Logical deductions and syllogisms" },
    { level_number: 8, topic: "Data interpretation and sufficiency" },
    { level_number: 9, topic: "Timed multi-topic problem solving" },
    { level_number: 10, topic: "Advanced puzzles and speed strategies" },
  ],
  // Communication & Behavioral
  8: [
    { level_number: 1, topic: "Clear verbal and written basics" },
    { level_number: 2, topic: "Active listening and email etiquette" },
    { level_number: 3, topic: "Structuring your self-introduction" },
    { level_number: 4, topic: "Body language and presence" },
    { level_number: 5, topic: "STAR method for behavioral answers" },
    { level_number: 6, topic: "Handling HR and situational questions" },
    { level_number: 7, topic: "Group discussion strategies" },
    { level_number: 8, topic: "Presentations and storytelling" },
    { level_number: 9, topic: "Conflict resolution and persuasion" },
    { level_number: 10, topic: "Executive communication and negotiation" },
  ],
  // Web Development Basics
  9: [
    { level_number: 1, topic: "HTML structure and semantics" },
    { level_number: 2, topic: "CSS layout, flexbox and grid" },
    { level_number: 3, topic: "JavaScript fundamentals" },
    { level_number: 4, topic: "DOM manipulation and events" },
    { level_number: 5, topic: "Fetch, APIs and async/await" },
    { level_number: 6, topic: "Intro to a framework (React basics)" },
    { level_number: 7, topic: "State management and components" },
    { level_number: 8, topic: "Routing and forms" },
    { level_number: 9, topic: "Build tools and deployment" },
    { level_number: 10, topic: "Performance and accessibility" },
  ],
  // System Design (Intro)
  10: [
    { level_number: 1, topic: "Client-server model and requirements" },
    { level_number: 2, topic: "Latency, throughput and bottlenecks" },
    { level_number: 3, topic: "Vertical vs horizontal scaling" },
    { level_number: 4, topic: "Caching strategies" },
    { level_number: 5, topic: "Databases: SQL vs NoSQL choices" },
    { level_number: 6, topic: "Load balancers and API gateways" },
    { level_number: 7, topic: "Message queues and async processing" },
    { level_number: 8, topic: "Consistency, availability and CAP" },
    { level_number: 9, topic: "Designing common systems (URL shortener, feed)" },
    { level_number: 10, topic: "Trade-off driven end-to-end design" },
  ],
  // Git & Version Control
  11: [
    { level_number: 1, topic: "Repos, commits and staging" },
    { level_number: 2, topic: "Branches and merging" },
    { level_number: 3, topic: "Remotes, push and pull" },
    { level_number: 4, topic: "Pull requests and code review" },
    { level_number: 5, topic: "Resolving merge conflicts" },
    { level_number: 6, topic: "Rebasing and interactive history" },
    { level_number: 7, topic: "Tags, releases and stashing" },
    { level_number: 8, topic: "Branching strategies (GitFlow, trunk)" },
    { level_number: 9, topic: "Hooks and CI integration" },
    { level_number: 10, topic: "Advanced recovery and monorepo workflows" },
  ],
  // Generative AI Basics
  12: [
    { level_number: 1, topic: "What is generative AI and LLMs" },
    { level_number: 2, topic: "Tokens, prompts and completions" },
    { level_number: 3, topic: "Prompt engineering fundamentals" },
    { level_number: 4, topic: "Embeddings and semantic search" },
    { level_number: 5, topic: "Retrieval-augmented generation (RAG)" },
    { level_number: 6, topic: "Function/tool calling basics" },
    { level_number: 7, topic: "Evaluation and reducing hallucination" },
    { level_number: 8, topic: "Fine-tuning vs prompting trade-offs" },
    { level_number: 9, topic: "Agents and multi-step workflows" },
    { level_number: 10, topic: "Responsible AI and production deployment" },
  ],
};
