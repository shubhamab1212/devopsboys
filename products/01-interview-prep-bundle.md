# DevOps Interview Prep Bundle 2026
### by DevOpsBoys — devopsboys.com

---

# SECTION 1: DOCKER

## Basics

**Q: What is Docker and why do we use it?**
Docker is a platform that packages applications and their dependencies into lightweight, portable containers. Unlike VMs, containers share the host OS kernel — making them faster to start and less resource-heavy. We use Docker because it eliminates "works on my machine" problems and makes deployments consistent across dev, staging, and production.

**Q: What is the difference between a Docker image and a container?**
An image is a read-only blueprint — it contains the app code, runtime, libraries, and config. A container is a running instance of an image. You can run multiple containers from the same image. Think of an image as a class and a container as an object in OOP.

**Q: What is a Dockerfile?**
A Dockerfile is a text file with instructions to build a Docker image. Each instruction (FROM, RUN, COPY, CMD, etc.) creates a new layer in the image. Docker caches layers, so unchanged layers are reused in subsequent builds.

**Q: Explain Docker layers and caching.**
Every instruction in a Dockerfile creates a layer. Layers are cached — if nothing changes above a certain instruction, Docker reuses the cached layer. Best practice: put frequently changing instructions (COPY source code) at the bottom, and rarely changing ones (RUN apt-get install) at the top to maximize cache hits.

**Q: What is the difference between CMD and ENTRYPOINT?**
- CMD provides default arguments for the container — can be overridden at runtime.
- ENTRYPOINT sets the fixed executable — harder to override.
- Together: ENTRYPOINT defines the command, CMD defines default arguments. E.g., `ENTRYPOINT ["python"]` and `CMD ["app.py"]`.

**Q: What is a multi-stage build in Docker?**
Multi-stage builds use multiple FROM statements in one Dockerfile. The first stage compiles/builds the app; the final stage copies only the build output — resulting in a much smaller production image without build tools. Critical for security and performance.

**Q: How does Docker networking work?**
Docker provides several network drivers:
- bridge (default) — containers communicate via a virtual bridge network
- host — container shares host network namespace
- none — no networking
- overlay — multi-host networking for Swarm/Kubernetes
Containers on the same bridge network can talk by container name.

**Q: What is Docker Compose?**
Docker Compose is a tool for defining and running multi-container applications using a YAML file (docker-compose.yml). It manages service dependencies, networking, and volumes. Ideal for local development environments.

**Q: What is the difference between COPY and ADD in Dockerfile?**
COPY is preferred — it simply copies files from host to container. ADD has extra features: it can extract tar archives and fetch URLs. Use COPY unless you specifically need ADD's extra features.

**Q: How do you reduce Docker image size?**
- Use minimal base images (alpine, distroless, slim)
- Multi-stage builds
- Combine RUN commands with && to reduce layers
- Use .dockerignore to exclude unnecessary files
- Remove cache after package installs (rm -rf /var/cache/apt)

---

## Docker Security

**Q: Why should containers not run as root?**
Running as root inside a container is a security risk. If the container is compromised, the attacker has root access to the container and potentially the host. Always use `USER` in Dockerfile to run as a non-root user.

**Q: What is a Docker content trust?**
Docker Content Trust (DCT) uses digital signatures to verify image authenticity and integrity. When enabled, Docker only pulls and runs signed images. Set DOCKER_CONTENT_TRUST=1 to enable it.

**Q: What are Docker secrets?**
Docker secrets are a mechanism to securely store sensitive data (passwords, API keys, TLS certificates) and make them available to containers. Secrets are encrypted at rest and in transit. Available in Docker Swarm and Kubernetes.

---

# SECTION 2: KUBERNETES

## Architecture

**Q: Explain Kubernetes architecture.**
Kubernetes has a control plane and worker nodes.
- Control plane: API Server, etcd, Scheduler, Controller Manager
- Worker nodes: kubelet, kube-proxy, container runtime
The API Server is the central hub — all components talk through it. etcd stores cluster state. The Scheduler assigns pods to nodes. The Controller Manager runs control loops (ReplicaSet, Deployment, etc.).

**Q: What is a Pod?**
A Pod is the smallest deployable unit in Kubernetes. It can contain one or more containers that share the same network namespace and storage. Containers in a pod communicate via localhost. Pods are ephemeral — they can be created, destroyed, and replaced.

**Q: What is the difference between a Deployment and a StatefulSet?**
- Deployment: for stateless apps. Pods are interchangeable, can be scaled up/down freely. Pod names are random.
- StatefulSet: for stateful apps (databases). Pods have stable, predictable names and persistent storage. Scaling and updates happen in order.

**Q: What is a Service in Kubernetes?**
A Service is an abstraction that provides a stable network endpoint to a group of Pods. Since pod IPs change, Services give a consistent IP and DNS name. Types: ClusterIP (internal), NodePort (external via node), LoadBalancer (cloud LB), ExternalName.

**Q: What is a ConfigMap and a Secret?**
- ConfigMap: stores non-sensitive configuration (env vars, config files)
- Secret: stores sensitive data (passwords, tokens) — base64 encoded, can be encrypted at rest
Both can be mounted as volumes or injected as env vars into pods.

**Q: What is an Ingress?**
Ingress is an API object that manages external HTTP/HTTPS access to services. An Ingress Controller (nginx, traefik, AWS ALB) watches for Ingress resources and configures routing rules. Supports path-based and host-based routing, TLS termination.

**Q: What is a Namespace?**
Namespaces provide logical isolation within a cluster. Resources in different namespaces are isolated. Used for multi-team or multi-environment setups. Default namespaces: default, kube-system, kube-public.

**Q: Explain Kubernetes RBAC.**
RBAC (Role-Based Access Control) controls who can do what in a cluster.
- Role: permissions within a namespace
- ClusterRole: permissions cluster-wide
- RoleBinding: binds a Role to a user/group/service account
- ClusterRoleBinding: binds a ClusterRole cluster-wide

**Q: What is a PersistentVolume and PersistentVolumeClaim?**
- PV: a piece of storage provisioned by admin (or dynamically by StorageClass)
- PVC: a request for storage by a user/pod. Kubernetes binds PVC to a matching PV.
StorageClass enables dynamic provisioning — PVs are created on demand.

**Q: What happens when a node goes down?**
The node controller marks the node as NotReady. After a timeout (default 5 min), pods on that node are evicted and rescheduled on healthy nodes. Pod Disruption Budgets (PDB) can limit how many pods are taken down simultaneously.

---

## Kubernetes Troubleshooting

**Q: A pod is stuck in CrashLoopBackOff — how do you debug it?**
1. `kubectl describe pod <pod>` — check Events section for errors
2. `kubectl logs <pod> --previous` — get logs from the crashed container
3. Check: wrong image, missing env vars, failed health checks, OOM kill, wrong command

**Q: A pod is Pending — what are the possible causes?**
- Insufficient CPU/memory on all nodes
- No node matches pod's nodeSelector/affinity
- PVC not bound
- Image pull issue (check Events)
- Taints not tolerated

**Q: How do you do a zero-downtime deployment in Kubernetes?**
Use Deployment with RollingUpdate strategy. Set maxUnavailable: 0 and maxSurge: 1. Kubernetes will bring up new pods before taking down old ones. Configure readiness probes so traffic only routes to ready pods.

---

# SECTION 3: AWS

**Q: What is the difference between IAM Role and IAM User?**
- IAM User: long-term credentials for a person or application. Has access keys.
- IAM Role: temporary credentials assumed by AWS services, EC2 instances, Lambda functions, or cross-account access. No long-term keys. Always prefer roles over users for AWS resources.

**Q: Explain S3 storage classes.**
- Standard: frequent access, high durability
- Standard-IA: infrequent access, lower cost
- Glacier: archival, retrieval takes minutes to hours
- Glacier Deep Archive: lowest cost, retrieval 12+ hours
Choose based on access frequency and retrieval time requirements.

**Q: What is AWS EKS?**
EKS (Elastic Kubernetes Service) is AWS's managed Kubernetes. AWS manages the control plane (API server, etcd) — you manage worker nodes (EC2 or Fargate). Integrates with IAM, VPC, ALB, ECR, CloudWatch.

**Q: What is the difference between Security Group and NACL?**
- Security Group: stateful, instance-level firewall. Return traffic is automatically allowed.
- NACL: stateless, subnet-level firewall. Must explicitly allow inbound and outbound.
Security Groups are used most commonly. NACLs add subnet-level protection.

**Q: What is a VPC?**
Virtual Private Cloud — your isolated network in AWS. You define IP ranges (CIDR), subnets (public/private), route tables, internet gateways. Public subnets have internet access; private subnets don't (use NAT gateway for outbound).

**Q: What is AWS Lambda?**
Lambda is serverless compute — run code without managing servers. You pay per invocation and execution time. Max 15 min runtime. Integrates with S3, API Gateway, SQS, DynamoDB. Best for event-driven, short-lived tasks.

**Q: Explain CloudWatch vs CloudTrail.**
- CloudWatch: metrics, logs, alarms, dashboards. Monitors what's happening now.
- CloudTrail: audit log of all API calls. Tracks who did what and when. Critical for security and compliance.

---

# SECTION 4: CI/CD

**Q: What is the difference between CI and CD?**
- CI (Continuous Integration): automatically build and test code on every commit. Catch bugs early.
- CD (Continuous Delivery): automatically deploy to staging after CI passes. Production deploy is manual trigger.
- CD (Continuous Deployment): automatically deploy to production after CI passes. No manual step.

**Q: What is GitOps?**
GitOps is a practice where the desired state of infrastructure and apps is declared in Git. An automated agent (ArgoCD, Flux) continuously reconciles the actual state with Git. Benefits: audit trail, easy rollback, consistent deployments.

**Q: What is the difference between ArgoCD and Flux?**
Both are GitOps tools for Kubernetes.
- ArgoCD: UI-first, strong visualization, supports multiple clusters from one control plane
- Flux: CLI-first, lighter weight, better for fully automated "no-touch" pipelines
See devopsboys.com/blog/argocd-vs-flux-vs-jenkins-gitops-comparison for a full comparison.

**Q: How do you handle secrets in a CI/CD pipeline?**
Never hardcode secrets in code or YAML. Use:
- GitHub Actions Secrets / environment secrets
- Vault for dynamic secrets
- AWS Secrets Manager / Parameter Store
- Sealed Secrets for Kubernetes
Rotate secrets regularly and audit access.

**Q: What is a blue-green deployment?**
Run two identical environments (blue = current, green = new). Deploy new version to green, test it, then switch traffic from blue to green. Instant rollback by switching back to blue. Zero downtime but requires double infrastructure.

**Q: What is a canary deployment?**
Gradually shift traffic from old to new version. Start with 5%, monitor errors/latency, increase to 20%, 50%, 100%. Rollback by shifting traffic back. Reduces blast radius of bad deployments.

---

# SECTION 5: DEVOPS CONCEPTS

**Q: What is Infrastructure as Code (IaC)?**
IaC means managing infrastructure through code instead of manual processes. Benefits: version control, repeatability, peer review, automated provisioning. Tools: Terraform, Pulumi, AWS CDK, CloudFormation.

**Q: What is the 12-factor app methodology?**
12 principles for building scalable, maintainable SaaS apps. Key factors: store config in environment, stateless processes, treat logs as streams, one codebase per app, dev/prod parity. Designed for cloud-native applications.

**Q: What is observability?**
Observability is the ability to understand internal system state from external outputs. Three pillars:
- Metrics: numerical measurements over time (CPU, error rate, latency)
- Logs: timestamped event records
- Traces: end-to-end request paths across services

**Q: What is the difference between monitoring and observability?**
Monitoring tells you when something is wrong (alerting on known failure modes). Observability lets you understand why something is wrong — even for unknown failure modes. Observability is a superset of monitoring.

**Q: Explain SLI, SLO, and SLA.**
- SLI (Service Level Indicator): a metric (e.g., 99.5% requests succeed)
- SLO (Service Level Objective): target for an SLI (e.g., 99.9% uptime)
- SLA (Service Level Agreement): contract with customers — breach means penalties

---

# SECTION 6: SYSTEM DESIGN (Senior Roles)

**Q: Design a CI/CD pipeline for a microservices app on Kubernetes.**
Answer framework:
1. Developer pushes to feature branch 
2. GitHub Actions: lint + unit tests run on PR
3. Merge to main: build Docker image, tag with git SHA, push to registry
4. Staging deploy: ArgoCD detects image change, deploys to staging namespace
5. Integration tests run against staging
6. Manual approval gate for production
7. Production deploy: canary → 100%
8. Monitoring: alerts on error rate, latency spikes

**Q: How would you handle a production outage?**
1. Declare incident, set up a war room
2. Identify blast radius — who is affected
3. Check recent deployments/changes
4. Roll back if a recent change caused it
5. Gather metrics, logs, traces
6. Fix root cause or apply workaround
7. Post-incident review — blameless, focus on systems not people

---

*Good luck! — DevOpsBoys (devopsboys.com)*
