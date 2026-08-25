---
name: deploy-docker-production
description: Build and run a versioned production Docker image for a Next.js app safely. Use when building an image, running with an env file, checking image/container conflicts, or validating a local Docker deployment without hard-coding the project name.
metadata:
  version: "3.0.0"
---

# Docker Next.js Production Deploy

## Purpose

Build and run the current Next.js project as a versioned Docker image using safe, repeatable defaults.

Do not hard-code the project name. Resolve values from the current repository unless the user explicitly provides them.

## Resolve Configuration

Determine these values before building:

```text
PROJECT_NAME=<resolved project name>
IMAGE_NAME=<resolved image name>
IMAGE_VERSION=<resolved version>
IMAGE_TAG=${IMAGE_NAME}:${IMAGE_VERSION}
CONTAINER_NAME=<resolved container name>
ENV_FILE=<resolved env file>
HOST_PORT=<resolved host port>
CONTAINER_PORT=<resolved container port>
```

Resolution rules:

1. Use a user-provided image name when available.
2. Otherwise, use the `name` field from `package.json`.
3. If no package name exists, use the current directory name.
4. Normalize the image name:
   - lowercase
   - replace spaces and underscores with hyphens
   - remove invalid Docker image-name characters
5. Use a user-provided version; otherwise default to `1.0.0`.
6. Use a user-provided container name; otherwise use the normalized image name.
7. Use a user-provided env file; otherwise default to `.env.production`.
8. Use user-provided ports; otherwise:
   - `HOST_PORT=4000`
   - `CONTAINER_PORT=3000`

Example:

```text
PROJECT_NAME=nextjs-skill-app-workshop
IMAGE_NAME=nextjs-skill-app-workshop
IMAGE_VERSION=1.0.0
IMAGE_TAG=nextjs-skill-app-workshop:1.0.0
CONTAINER_NAME=nextjs-skill-app-workshop
ENV_FILE=.env.production
HOST_PORT=4000
CONTAINER_PORT=3000
```

## Safety Rules

Before building or running:

- Confirm the current directory is the project root.
- Require `Dockerfile`.
- Require the selected env file.
- Confirm Docker is installed and the daemon is running.
- Check whether the requested image tag already exists.
- Check whether the requested container name already exists.
- Check whether the host port is already in use.
- Never print secrets from env files.
- Do not use `latest` unless explicitly requested.
- Do not rebuild an existing image tag without explicit confirmation.
- Do not stop, remove, or replace an existing container without explicit confirmation.
- Do not run destructive cleanup commands such as:
  - `docker system prune`
  - `docker image prune`
  - `docker volume prune`

Stop safely when a required precondition fails.

## Workflow

### 1. Preflight

```bash
pwd

test -f package.json \
  && echo "OK: package.json found" \
  || echo "WARN: package.json not found"

test -f Dockerfile \
  && echo "OK: Dockerfile found" \
  || echo "ERROR: Dockerfile not found"

test -f "$ENV_FILE" \
  && echo "OK: env file found: $ENV_FILE" \
  || echo "ERROR: env file not found: $ENV_FILE"

docker --version

docker info >/dev/null 2>&1 \
  && echo "OK: Docker daemon is running" \
  || echo "ERROR: Docker daemon is not running"
```

If `Dockerfile`, env file, or Docker daemon is unavailable, stop and report the blocking issue.

Do not create a placeholder env file unless the user asks.

### 2. Resolve Project Name

Read the package name when available:

```bash
node -p "require('./package.json').name"
```

Fallback:

```bash
basename "$PWD"
```

Normalize the resolved name to lowercase kebab-case before using it as an image or container name.

Examples:

```text
My Next App -> my-next-app
nextjs_skill_app -> nextjs-skill-app
```

### 3. Check Image Tag

```bash
docker image inspect "$IMAGE_TAG" >/dev/null 2>&1 \
  && echo "EXISTS: $IMAGE_TAG" \
  || echo "AVAILABLE: $IMAGE_TAG"
```

List existing versions:

```bash
docker images "$IMAGE_NAME" \
  --format "table {{.Repository}}\t{{.Tag}}\t{{.ID}}\t{{.CreatedSince}}\t{{.Size}}"
```

If the requested image tag already exists:

- do not rebuild automatically
- report the existing tag
- suggest the next patch version, such as `1.0.1`
- rebuild the same tag only after explicit confirmation

### 4. Check Container Name

```bash
docker ps -a \
  --filter "name=^/${CONTAINER_NAME}$" \
  --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"
```

If the container exists:

- do not run another container with the same name
- report its current status
- ask whether to use another name or explicitly replace it
- do not remove it automatically

### 5. Check Host Port

Check whether the host port is already in use.

macOS/Linux:

```bash
lsof -i :"$HOST_PORT"
```

Alternative:

```bash
docker ps --format "table {{.Names}}\t{{.Ports}}"
```

If the port is occupied, report the conflict and do not change the port unless the user requests it.

### 6. Build Image

If the image tag is available:

```bash
docker build -t "$IMAGE_TAG" .
```

Verify:

```bash
docker image inspect "$IMAGE_TAG" >/dev/null \
  && echo "OK: image built successfully: $IMAGE_TAG" \
  || echo "ERROR: image not found after build: $IMAGE_TAG"
```

Do not continue to `docker run` if the build fails.

### 7. Run Container

If the image exists and the container name and host port are available:

```bash
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart=unless-stopped \
  --env-file "$ENV_FILE" \
  -p "${HOST_PORT}:${CONTAINER_PORT}" \
  "$IMAGE_TAG"
```

Use `--restart=unless-stopped` by default for a local production-style deployment.

If the user explicitly requires `always`, use:

```bash
--restart=always
```

## Post-run Validation

Validate the running container:

```bash
docker ps \
  --filter "name=^/${CONTAINER_NAME}$" \
  --format "table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}"

docker logs --tail=80 "$CONTAINER_NAME"

curl -I "http://localhost:${HOST_PORT}"
```

Validation passes when:

- container status is `Up`
- expected port mapping exists
- logs contain no fatal startup errors
- the HTTP endpoint responds

Valid HTTP responses include:

```text
200
301
302
307
308
```

If `curl` fails, inspect container status and logs before suggesting a fix.

## Failure Handling

### Image Tag Exists

```text
Image tag already exists locally:
<IMAGE_TAG>

Recommended:
- Use a new patch version such as 1.0.1
- Or explicitly confirm rebuilding the same tag
```

### Container Exists

```text
Container already exists:
<CONTAINER_NAME>

Choose another container name or explicitly confirm replacing it.
```

### Port Conflict

Report:

```text
Host port is already in use:
<HOST_PORT>

Choose another HOST_PORT or stop the conflicting process/container explicitly.
```

Do not stop the conflicting process automatically.

### Env File Missing

```text
Env file not found:
<ENV_FILE>

Cannot run the container with --env-file until this file exists.
```

Do not print, infer, or generate secrets.

### Docker Daemon Unavailable

```text
Docker is installed but the daemon is not running.

Start Docker Desktop or Docker Engine and run the preflight checks again.
```

### Build Failure

Report the relevant build error and stop.

Do not run a stale image unless the user explicitly asks to use an existing image.

## Final Response

When complete, report:

```text
Result:
- Project: <PROJECT_NAME>
- Image: <IMAGE_TAG>
- Container: <CONTAINER_NAME>
- Env file: <ENV_FILE>
- URL: http://localhost:<HOST_PORT>
- Restart policy: unless-stopped
- Validation: passed | failed

Commands used:
<important commands>

Notes:
<warnings, conflicts, or follow-up actions>
```

If the workflow stops because of an existing image tag, missing env file, existing container, Docker failure, build failure, or port conflict, clearly report the blocker and the safest next action.
