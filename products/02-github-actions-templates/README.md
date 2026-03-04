# GitHub Actions Templates Pack
### by DevOpsBoys — devopsboys.com

10 production-tested workflow files. Copy → paste → ship.

---

## Templates Included

| # | File | What it does |
|---|---|---|
| 01 | `ci-node.yml` | Node.js CI — install, lint, test |
| 02 | `ci-python.yml` | Python CI — pip, flake8, pytest |
| 03 | `ci-go.yml` | Go CI — build, vet, test |
| 04 | `docker-build-push.yml` | Build + push Docker image to GHCR |
| 05 | `deploy-kubernetes.yml` | Rolling deploy to Kubernetes |
| 06 | `pr-checks.yml` | PR gate — lint + test + size check |
| 07 | `multi-env-deploy.yml` | Deploy to dev → staging → prod |
| 08 | `scheduled-job.yml` | Cron job workflow |
| 09 | `release-tag.yml` | Auto-release on git tag |
| 10 | `security-scan.yml` | Trivy container vulnerability scan |

## How to Use
1. Copy the workflow file to `.github/workflows/` in your repo
2. Update the env vars at the top of each file
3. Add required secrets to GitHub → Settings → Secrets
4. Push — the workflow runs automatically

## Resources
- Full tutorial: devopsboys.com/blog/github-actions-cicd-pipeline-tutorial
- GitOps next steps: devopsboys.com/blog/argocd-vs-flux-vs-jenkins-gitops-comparison
