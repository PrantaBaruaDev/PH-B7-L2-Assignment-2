# B7A2

## Assignment: DevPulse – Assignment Requirements Specification
### Name: Pranta Barua
### Batch: L2B7

## Example API usage
1️⃣ All issues
```bash
GET /api/issues
```
2️⃣ Newest first
```bash
GET /api/issues?sort=newest
```
3️⃣ Filter by type
```bash
GET /api/issues?type=bug
```
4️⃣ Filter by status
```bash
GET /api/issues?status=open
```
5️⃣ Combined
```bash
GET /api/issues?type=bug&status=open&sort=oldest
```