# Deployment Rules for CodeArena

Whenever any code changes are made to the codebase, after completing the work and validating builds and tests:
1. Commit and push the changes to `origin/main` on GitHub:
   ```bash
   git push origin main
   ```
2. Trigger the Render Deploy Hooks:
   - **CodeArena Web (Frontend)**:
     `https://api.render.com/deploy/srv-db3jge59fdbs73e326u0?key=89Mhbw8NbB8`
     ```bash
     curl -X POST "https://api.render.com/deploy/srv-db3jge59fdbs73e326u0?key=89Mhbw8NbB8"
     ```
   - **CodeArena API (Backend)**:
     `https://api.render.com/deploy/srv-db3j7cd9fdbs73e1vaa0?key=gdbh9G1PLF8`
     ```bash
     curl -X POST "https://api.render.com/deploy/srv-db3j7cd9fdbs73e1vaa0?key=gdbh9G1PLF8"
     ```
3. Verify production health and uptime after deployment completes.
