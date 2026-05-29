# LS-Inventory API Documentation

Base URL: `/api`

## Auth
- `POST /auth/login`
  - Body: `{ "username": "admin", "password": "..." }`
  - Response: scaffold login confirmation
- `POST /auth/logout`

## Devices
- `GET /devices`
- `GET /devices/:id`
- `POST /devices`
  - Body example:
    ```json
    {
      "invCode": "INV-0001",
      "unitId": "01",
      "optionalField": "00",
      "make": "Shure",
      "model": "SM58",
      "category": "Microphone"
    }
    ```
- `PUT /devices/:id`
- `DELETE /devices/:id`

## Projects
- `GET /projects`
- `GET /projects/:id`
- `POST /projects`
- `PUT /projects/:id`

## Packsheets
- `POST /packsheets`
- `GET /packsheets/:id`
- `GET /packsheets/:id/pdf`
- `POST /packsheets/:id/checkoff`

## Maintenance
- `GET /maintenance`
- `POST /maintenance`

> TODO: Add final request/response schemas and error contract once implementation stabilizes.
