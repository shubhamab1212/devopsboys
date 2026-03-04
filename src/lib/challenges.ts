export interface Bug {
  line: number
  description: string
  fix: string
  keywords: string[]
}

export interface Challenge {
  id: string
  title: string
  code: string
  bugs: Bug[]
  hint: string
  explanation: string
}

export const DOCKERFILE_CHALLENGES: Record<"easy" | "medium" | "hard", Challenge[]> = {
  easy: [
    {
      id: "df-e1",
      title: "Node.js Express API",
      code: `FROM node:latest
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "server.js"]`,
      bugs: [{
        line: 1,
        description: "Using ':latest' tag makes builds unpredictable — a future Node.js major version could break your app silently.",
        fix: "Pin to a specific version like 'node:20-alpine'",
        keywords: ["latest", "tag", "pin", "version", "unpredictable", "specific"]
      }],
      hint: "Look at the base image tag — is it reproducible?",
      explanation: "Using ':latest' means your image changes whenever the upstream updates, breaking reproducible builds and causing unexpected failures in production."
    },
    {
      id: "df-e2",
      title: "Python Flask Application",
      code: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "app.py"]`,
      bugs: [{
        line: 7,
        description: "Running the app with 'python app.py' means it starts with PID 1 but doesn't handle OS signals (SIGTERM). Container won't shut down gracefully.",
        fix: "Use 'CMD [\"gunicorn\", \"app:app\"]' or add 'exec' wrapper, or use a proper WSGI server",
        keywords: ["signal", "sigterm", "pid", "gunicorn", "graceful", "shutdown", "wsgi"]
      }],
      hint: "How does this container handle shutdown signals?",
      explanation: "Python started directly as PID 1 doesn't forward OS signals, meaning 'docker stop' will forcefully kill it after timeout instead of graceful shutdown."
    },
    {
      id: "df-e3",
      title: "Nginx Static Site",
      code: `FROM nginx:1.25-alpine
COPY ./dist /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]`,
      bugs: [{
        line: 3,
        description: "Nginx by default listens on port 80, but EXPOSE declares 8080. The EXPOSE port doesn't match what nginx actually listens on.",
        fix: "Change EXPOSE to 80, or add a custom nginx.conf that listens on 8080",
        keywords: ["port", "expose", "80", "8080", "mismatch", "listen", "nginx"]
      }],
      hint: "What port does nginx actually listen on by default?",
      explanation: "EXPOSE is documentation — the real issue is the port mismatch. If your orchestrator (K8s, ECS) routes traffic to 8080, nginx won't receive it because it's listening on 80."
    },
    {
      id: "df-e4",
      title: "Java Spring Boot Service",
      code: `FROM openjdk:17-jdk
WORKDIR /app
COPY target/app.jar .
EXPOSE 8080
CMD ["java", "-jar", "app.jar"]`,
      bugs: [{
        line: 1,
        description: "Using 'openjdk:17-jdk' includes the full JDK (compiler, tools) in production. The JRE-only image is ~200MB smaller and has a smaller attack surface.",
        fix: "Use 'eclipse-temurin:17-jre-alpine' for production — JRE only, no compiler",
        keywords: ["jdk", "jre", "size", "production", "compiler", "image size", "attack surface"]
      }],
      hint: "Do you need the Java compiler in production?",
      explanation: "Including the full JDK in production images bloats image size and increases the attack surface with unnecessary tools. Always use JRE-only images for running Java apps."
    },
    {
      id: "df-e5",
      title: "Go Web Server",
      code: `FROM golang:1.22-alpine AS builder
WORKDIR /app
COPY . .
RUN go build -o server .

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/server .
EXPOSE 8080
USER root
CMD ["./server"]`,
      bugs: [{
        line: 10,
        description: "Running the container as root is a critical security risk. If the process is compromised, the attacker has root access to the container.",
        fix: "Replace 'USER root' with 'RUN adduser -D appuser && USER appuser'",
        keywords: ["root", "user", "security", "privilege", "non-root", "appuser"]
      }],
      hint: "What user is the process running as?",
      explanation: "Running containers as root violates the principle of least privilege. A compromised root container can escape to the host more easily and access sensitive files."
    },
  ],
  medium: [
    {
      id: "df-m1",
      title: "React Build Pipeline",
      code: `FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80`,
      bugs: [{
        line: 4,
        description: "'COPY . .' is placed before 'RUN npm install', so every source code change invalidates the npm install cache layer. This makes every build re-download all packages.",
        fix: "Copy package.json first, run npm install, then copy source: COPY package*.json ./ → RUN npm install → COPY . .",
        keywords: ["cache", "layer", "package.json", "invalidate", "order", "copy", "install"]
      }],
      hint: "Are Docker layers cached efficiently here?",
      explanation: "Docker caches layers. Copying all files before npm install means any file change triggers a full reinstall. Always copy dependency manifests first, install, then copy source code."
    },
    {
      id: "df-m2",
      title: "Database Migration Service",
      code: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
ENV DATABASE_URL=postgres://admin:secretpass123@db:5432/mydb
ENV SECRET_KEY=mysupersecretkey
CMD ["python", "migrate.py"]`,
      bugs: [{
        line: 6,
        description: "Hardcoding secrets in ENV instructions bakes them into the image layers permanently. Anyone with access to the image can see the database password via 'docker history'.",
        fix: "Remove ENV secrets. Pass them at runtime with 'docker run -e DATABASE_URL=...' or use Docker secrets / a secrets manager",
        keywords: ["secret", "password", "env", "hardcode", "history", "credentials", "sensitive"]
      }],
      hint: "Can you extract secrets from this image without running it?",
      explanation: "ENV values are stored in image metadata and visible via 'docker history --no-trunc'. Never bake credentials into images — use runtime environment variables or secrets management."
    },
    {
      id: "df-m3",
      title: "Node.js Microservice",
      code: `FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3000
CMD ["node", "index.js"]`,
      bugs: [{
        line: 4,
        description: "'npm install' installs both production and dev dependencies. In production you want only prod deps to keep the image small and reduce attack surface.",
        fix: "Use 'RUN npm ci --only=production' or 'RUN npm install --omit=dev'",
        keywords: ["dev", "devdependencies", "production", "ci", "omit", "only", "dependencies"]
      }],
      hint: "Are test frameworks and dev tools needed in the production image?",
      explanation: "Dev dependencies (jest, eslint, typescript, etc.) can double your node_modules size. In production you only need runtime dependencies — use --only=production flag."
    },
    {
      id: "df-m4",
      title: "Ruby on Rails App",
      code: `FROM ruby:3.2-alpine
RUN apk add --update build-base postgresql-dev
WORKDIR /app
COPY Gemfile* ./
RUN bundle install
COPY . .
EXPOSE 3000
CMD ["rails", "server", "-b", "0.0.0.0"]`,
      bugs: [{
        line: 2,
        description: "'apk add --update' doesn't clean up the apk cache. This leaves cached package data in the image layer, increasing image size unnecessarily.",
        fix: "Add '&& rm -rf /var/cache/apk/*' at the end: RUN apk add --update build-base postgresql-dev && rm -rf /var/cache/apk/*",
        keywords: ["cache", "apk", "clean", "size", "rm", "var/cache", "layer"]
      }],
      hint: "Is the package manager cache cleaned up after installation?",
      explanation: "Package manager caches (apt, apk, yum) left in image layers permanently increase image size. Always clean up in the same RUN instruction to avoid adding a new layer."
    },
    {
      id: "df-m5",
      title: "FastAPI Service with Health Check",
      code: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]`,
      bugs: [{
        line: 7,
        description: "No HEALTHCHECK instruction is defined. Without it, Docker and orchestrators like Kubernetes can't detect if the app is actually responding — only if the process is running.",
        fix: "Add: HEALTHCHECK --interval=30s --timeout=5s --retries=3 CMD curl -f http://localhost:8000/health || exit 1",
        keywords: ["healthcheck", "health", "check", "probe", "liveness", "readiness", "running"]
      }],
      hint: "How does the orchestrator know if this service is actually healthy?",
      explanation: "Without HEALTHCHECK, a container is considered 'healthy' as long as the process runs — even if the app is stuck in an infinite loop or returning 500 errors."
    },
  ],
  hard: [
    {
      id: "df-h1",
      title: "Multi-Stage Rust Build",
      code: `FROM rust:1.77-alpine AS builder
RUN apk add --no-cache musl-dev
WORKDIR /app
COPY . .
RUN cargo build --release

FROM alpine:3.19
WORKDIR /app
COPY --from=builder /app/target/debug/myapp .
RUN adduser -D appuser
USER appuser
EXPOSE 8080
CMD ["./myapp"]`,
      bugs: [{
        line: 9,
        description: "The multi-stage build compiles in --release mode but copies from 'target/debug/' instead of 'target/release/'. The debug binary is 5-10x larger and much slower.",
        fix: "Change COPY path to: COPY --from=builder /app/target/release/myapp .",
        keywords: ["debug", "release", "target", "path", "binary", "multi-stage", "optimize"]
      }],
      hint: "Does the copy path match the build mode?",
      explanation: "This is a classic mistake: using --release flag but copying from the debug directory. The resulting binary is unoptimized, larger, and completely defeats the purpose of a release build."
    },
    {
      id: "df-h2",
      title: "Node.js with Build Arguments",
      code: `FROM node:20-alpine
ARG NODE_ENV=production
ARG API_KEY
ENV NODE_ENV=$NODE_ENV
ENV API_KEY=$API_KEY
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
CMD ["node", "server.js"]`,
      bugs: [{
        line: 5,
        description: "Build ARGs passed into ENV become permanent image metadata. The API_KEY is now baked into every image layer and visible via 'docker history'. Build args are meant for build-time, not runtime secrets.",
        fix: "Remove 'ENV API_KEY=$API_KEY'. Pass the API key at runtime with 'docker run -e API_KEY=...' instead",
        keywords: ["arg", "env", "secret", "build", "runtime", "history", "baked", "metadata"]
      }],
      hint: "What happens to build arguments when they're converted to ENV?",
      explanation: "ARGs converted to ENVs persist in image layers. Use ARGs only for build-time configuration (not secrets). Pass runtime secrets via environment variables at container startup."
    },
    {
      id: "df-h3",
      title: "Python ML Service",
      code: `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN apt-get update && apt-get install -y gcc python3-dev
RUN pip install --no-cache-dir -r requirements.txt
RUN apt-get remove -y gcc python3-dev
COPY . .
CMD ["python", "serve.py"]`,
      bugs: [{
        line: 6,
        description: "Removing packages in a separate RUN instruction doesn't reduce image size. Each RUN creates a new layer — the previous layer (with gcc installed) still exists and is included in the final image.",
        fix: "Combine install, build, and remove in ONE RUN: RUN apt-get update && apt-get install -y gcc python3-dev && pip install --no-cache-dir -r requirements.txt && apt-get remove -y gcc python3-dev && apt-get autoremove -y && rm -rf /var/lib/apt/lists/*",
        keywords: ["layer", "run", "remove", "size", "combine", "one", "separate", "apt"]
      }],
      hint: "Does removing packages in a later RUN actually reduce the image size?",
      explanation: "Docker layers are additive and immutable. Removing files in a new RUN layer doesn't remove them from the previous layer — they still exist in the image. Combine install + use + cleanup in a single RUN."
    },
  ],
}

export const KUBERNETES_CHALLENGES: Record<"easy" | "medium" | "hard", Challenge[]> = {
  easy: [
    {
      id: "k8s-e1",
      title: "Nginx Deployment",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: nginx
        image: nginx:1.25`,
      bugs: [{
        line: 13,
        description: "The selector 'matchLabels: app: web' doesn't match the pod template label 'app: frontend'. The Deployment can't find its own pods, so it will create pods endlessly.",
        fix: "Change pod template label to 'app: web' to match the selector, or change selector to match 'app: frontend'",
        keywords: ["selector", "label", "match", "matchlabels", "mismatch", "template", "frontend", "web"]
      }],
      hint: "Does the selector match the pod template labels?",
      explanation: "Deployment selectors must exactly match pod template labels. A mismatch causes the Deployment controller to never find its pods, leading to infinite pod creation and a broken deployment."
    },
    {
      id: "k8s-e2",
      title: "Redis Service",
      code: `apiVersion: v1
kind: Service
metadata:
  name: redis-service
spec:
  selector:
    app: redis
  ports:
  - port: 6379
    targetPort: 6380
  type: ClusterIP`,
      bugs: [{
        line: 10,
        description: "The Service's targetPort (6380) doesn't match Redis's actual port (6379). Traffic sent to the service will fail because it's forwarded to the wrong port on the pod.",
        fix: "Change targetPort to 6379 to match the actual Redis container port",
        keywords: ["targetport", "port", "6379", "6380", "mismatch", "forward", "redis"]
      }],
      hint: "Does the service forward traffic to the right port on the pod?",
      explanation: "targetPort is the port on the container, while port is the service's exposed port. If targetPort doesn't match the container's listening port, all connections will be refused."
    },
    {
      id: "k8s-e3",
      title: "Web App Deployment",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
spec:
  replicas: 1
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
      - name: webapp
        image: myapp:latest
        ports:
        - containerPort: 8080`,
      bugs: [{
        line: 16,
        description: "Using ':latest' tag in Kubernetes means pods on different nodes may pull different image versions. Also, 'imagePullPolicy' defaults to 'Always' with latest, causing unnecessary pulls and potential inconsistency.",
        fix: "Pin to a specific digest or tag like 'myapp:v1.2.3' and set imagePullPolicy: IfNotPresent",
        keywords: ["latest", "tag", "pin", "version", "digest", "imagepullpolicy", "inconsistency"]
      }],
      hint: "Is the image version pinned for consistent deployments?",
      explanation: "In Kubernetes clusters with multiple nodes, using ':latest' can result in different nodes running different versions of your app — a nightmare to debug in production."
    },
    {
      id: "k8s-e4",
      title: "API Deployment without Limits",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: api:v2.1.0
        ports:
        - containerPort: 3000`,
      bugs: [{
        line: 17,
        description: "No resource requests or limits are defined. Without limits, a single pod can consume all node CPU/memory, starving other pods. Without requests, the scheduler can't make optimal placement decisions.",
        fix: "Add resources block: resources: { requests: { cpu: '100m', memory: '128Mi' }, limits: { cpu: '500m', memory: '512Mi' } }",
        keywords: ["resource", "limit", "request", "cpu", "memory", "throttle", "oom", "scheduler"]
      }],
      hint: "What stops this pod from consuming all node resources?",
      explanation: "Without resource limits, a memory leak or traffic spike can OOM-kill other pods on the node. Without requests, Kubernetes can't schedule pods efficiently or make eviction decisions."
    },
  ],
  medium: [
    {
      id: "k8s-m1",
      title: "Production API Deployment",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: prod-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: prod-api
  template:
    metadata:
      labels:
        app: prod-api
    spec:
      containers:
      - name: api
        image: api:v3.0.0
        resources:
          requests:
            cpu: "250m"
            memory: "256Mi"
          limits:
            cpu: "1000m"
            memory: "512Mi"
        ports:
        - containerPort: 8080`,
      bugs: [{
        line: 24,
        description: "No liveness or readiness probes are configured. Kubernetes won't know if the app is actually serving traffic (readiness) or stuck in a deadlock (liveness). Traffic will be sent to pods that aren't ready.",
        fix: "Add livenessProbe and readinessProbe blocks with httpGet to /health endpoint",
        keywords: ["liveness", "readiness", "probe", "health", "check", "stuck", "deadlock", "ready"]
      }],
      hint: "How does Kubernetes know if this pod is actually ready to serve traffic?",
      explanation: "Without probes, Kubernetes routes traffic to pods immediately after container start, even if the app is still initializing. Liveness probes restart stuck containers; readiness probes remove unhealthy pods from load balancing."
    },
    {
      id: "k8s-m2",
      title: "Stateful Database Deployment",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15
        env:
        - name: POSTGRES_PASSWORD
          value: "superSecret123"
        volumeMounts:
        - name: data
          mountPath: /var/lib/postgresql/data
      volumes:
      - name: data
        emptyDir: {}`,
      bugs: [{
        line: 18,
        description: "The POSTGRES_PASSWORD is hardcoded as a plain value. This is visible to anyone who can 'kubectl get pod -o yaml' and is stored in etcd unencrypted.",
        fix: "Create a Kubernetes Secret and reference it: env: - name: POSTGRES_PASSWORD valueFrom: secretKeyRef: name: postgres-secret key: password",
        keywords: ["secret", "password", "hardcode", "plain", "yaml", "etcd", "secretkeyref", "valueFrom"]
      }],
      hint: "Is the database password stored securely?",
      explanation: "Plain text passwords in pod specs are stored in etcd and visible to anyone with kubectl access. Use Kubernetes Secrets (or an external secret manager) to store sensitive values."
    },
    {
      id: "k8s-m3",
      title: "Microservice with RBAC",
      code: `apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-service-account
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: app-role
rules:
- apiGroups: ["*"]
  resources: ["*"]
  verbs: ["*"]
---
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: app-binding
subjects:
- kind: ServiceAccount
  name: app-service-account
roleRef:
  kind: ClusterRole
  name: app-role
  apiGroup: rbac.authorization.k8s.io`,
      bugs: [{
        line: 11,
        description: "The ClusterRole grants wildcard permissions ('*') on all API groups, all resources, and all verbs — essentially cluster admin. This violates the principle of least privilege.",
        fix: "Restrict to only needed permissions, e.g.: apiGroups: [\"\"] resources: [\"configmaps\"] verbs: [\"get\", \"list\"]",
        keywords: ["wildcard", "rbac", "least privilege", "clusterrole", "permission", "admin", "all", "verbs"]
      }],
      hint: "How much access does this service account have?",
      explanation: "Wildcard RBAC permissions give a compromised pod full cluster access. If exploited, an attacker can read all secrets, delete deployments, or escape to the host. Always use minimal permissions."
    },
    {
      id: "k8s-m4",
      title: "Rolling Update Deployment",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 3
      maxSurge: 0
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: frontend:v2.0.0`,
      bugs: [{
        line: 9,
        description: "maxUnavailable: 3 with maxSurge: 0 means ALL replicas can be taken down simultaneously before new ones come up. This causes complete downtime during rolling updates.",
        fix: "Use maxUnavailable: 1 and maxSurge: 1 for zero-downtime rolling updates",
        keywords: ["maxunavailable", "maxsurge", "rolling", "downtime", "zero-downtime", "replicas", "update"]
      }],
      hint: "During an update, how many pods could be down at the same time?",
      explanation: "With maxUnavailable equal to the replica count, the entire service goes down during updates. For zero-downtime, set maxUnavailable: 0 or 1 so at least some pods always serve traffic."
    },
  ],
  hard: [
    {
      id: "k8s-h1",
      title: "HPA-Managed Deployment",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: api
spec:
  replicas: 5
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: api:v1.5.0
        resources:
          requests:
            cpu: "200m"
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70`,
      bugs: [{
        line: 5,
        description: "Having both a hardcoded 'replicas: 5' in the Deployment AND an HPA causes a conflict. When the HPA scales down (e.g., to 2), the Deployment controller will scale back up to 5, causing a fight.",
        fix: "Remove 'replicas' from the Deployment spec when using HPA, or let HPA manage it exclusively",
        keywords: ["replicas", "hpa", "conflict", "autoscaler", "fight", "scale", "horizontal"]
      }],
      hint: "Who controls the replica count — the Deployment or the HPA?",
      explanation: "When HPA and Deployment both try to control replicas, they fight each other. The Deployment resets to its hardcoded value, preventing HPA from scaling down. Remove replicas from Deployment when using HPA."
    },
    {
      id: "k8s-h2",
      title: "ConfigMap Volume Mount",
      code: `apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  app.conf: |
    server_port=8080
    log_level=info
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: myapp
  template:
    metadata:
      labels:
        app: myapp
    spec:
      containers:
      - name: app
        image: myapp:v1.0.0
        volumeMounts:
        - name: config
          mountPath: /etc/app/app.conf
      volumes:
      - name: config
        configMap:
          name: app-config`,
      bugs: [{
        line: 27,
        description: "Mounting a ConfigMap to a file path (/etc/app/app.conf) without 'subPath' will mount the entire ConfigMap as a directory at that path, replacing any existing files in /etc/app/. The app.conf file won't be accessible as expected.",
        fix: "Add 'subPath: app.conf' to the volumeMount: volumeMounts: - name: config mountPath: /etc/app/app.conf subPath: app.conf",
        keywords: ["subpath", "mount", "configmap", "directory", "file", "replace", "overwrite"]
      }],
      hint: "When mounting a ConfigMap to a specific file path, what happens to the directory?",
      explanation: "Without subPath, Kubernetes mounts the entire ConfigMap as a directory, replacing all files in the mount path. This breaks existing files in that directory and is a common misconfiguration."
    },
    {
      id: "k8s-h3",
      title: "PodDisruptionBudget Setup",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: critical-service
spec:
  replicas: 3
  selector:
    matchLabels:
      app: critical
  template:
    metadata:
      labels:
        app: critical
    spec:
      containers:
      - name: app
        image: critical-app:v2.0.0
---
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: critical-pdb
spec:
  minAvailable: 3
  selector:
    matchLabels:
      app: critical`,
      bugs: [{
        line: 22,
        description: "minAvailable: 3 equals the total replica count of 3. This means zero pods can ever be voluntarily disrupted, blocking node drains, cluster upgrades, and rolling updates completely.",
        fix: "Use 'minAvailable: 2' (or 'maxUnavailable: 1') to allow at least one pod to be disrupted while maintaining HA",
        keywords: ["minavailable", "disruption", "budget", "pdb", "drain", "upgrade", "block", "replicas"]
      }],
      hint: "If minAvailable equals replica count, what happens during a node drain?",
      explanation: "A PDB with minAvailable equal to replicas prevents all voluntary disruptions (node drains, kubectl drain for upgrades). This can block cluster maintenance indefinitely and is a critical operational mistake."
    },
  ],
}

export function getRandomChallenge(
  type: "dockerfile" | "kubernetes",
  difficulty: "easy" | "medium" | "hard"
): Challenge {
  const bank = type === "dockerfile" ? DOCKERFILE_CHALLENGES : KUBERNETES_CHALLENGES
  const pool = bank[difficulty]
  return pool[Math.floor(Math.random() * pool.length)]
}

export function validateAnswer(userAnswer: string, challenge: Challenge): {
  correct: boolean
  partial: boolean
  score: number
  feedback: string
} {
  const answer = userAnswer.toLowerCase()
  const allKeywords = challenge.bugs.flatMap(b => b.keywords)
  const matchedKeywords = allKeywords.filter(kw => answer.includes(kw.toLowerCase()))
  const matchRatio = matchedKeywords.length / allKeywords.length

  // Check per-bug matches
  const bugMatches = challenge.bugs.map(bug => {
    const matched = bug.keywords.filter(kw => answer.includes(kw.toLowerCase()))
    return matched.length / bug.keywords.length
  })

  const allBugsFound = bugMatches.every(r => r >= 0.3)
  const anyBugFound = bugMatches.some(r => r >= 0.3)

  if (allBugsFound && matchRatio >= 0.3) {
    const score = Math.min(100, Math.round(40 + matchRatio * 60))
    return {
      correct: true,
      partial: false,
      score,
      feedback: `Correct! You identified the issue. ${challenge.bugs[0].description} Fix: ${challenge.bugs[0].fix}`
    }
  }

  if (anyBugFound || matchRatio >= 0.2) {
    return {
      correct: false,
      partial: true,
      score: 40,
      feedback: `Partially correct — you're on the right track! The main issue: ${challenge.bugs[0].description}`
    }
  }

  return {
    correct: false,
    partial: false,
    score: 0,
    feedback: `Not quite. ${challenge.hint} — ${challenge.bugs[0].description}`
  }
}
