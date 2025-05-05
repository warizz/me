---
title: "REST API Design, Development & Management"
by: "Rajeev Sakhuja"
tldr: "Faster, flashier, and fun with big quality-of-life improvements — might be GOTY."
date: "2025-04-14"
rating: 0
publish: true
tags:
  - course
  - backend
---

![The course cover](/posts/2025-0412-udemy-rest-api-design-development-management.webp)

[Link to the course](https://ascend.udemy.com/course/rest-api/learn/lecture/6092320#overview)

## What I Learned from This Course

- **REST Architecture Constraints**: REST is based on six architectural constraints that ensure scalability, performance, and simplicity:
  - **Client-Server**: Separates the client and server concerns, improving portability and scalability.
  - **Stateless**: Each request contains all the information the server needs; no session is stored server-side.
  - **Cacheable**: Responses must indicate whether they are cacheable to improve performance.
  - **Uniform Interface**: Simplifies architecture by having a consistent way to interact with resources.
  - **Layered System**: Allows intermediaries (like proxies and gateways) to enhance scalability and security.
  - **Code on Demand (optional)**: Allows servers to deliver executable code (like JavaScript) to clients.

- **Richardson Maturity Model**: A framework for measuring the level of RESTfulness in an API. It helps evaluate how well an API aligns with REST principles by dividing it into four levels:
  - **Level 0** – *The Swamp of POX*: Uses a single endpoint and HTTP as a transport protocol only, often with XML or JSON payloads. No use of REST concepts.
  - **Level 1** – *Resources*: Introduces distinct URIs for individual resources but still uses a single HTTP method (usually POST).
  - **Level 2** – *HTTP Verbs*: Incorporates proper use of HTTP methods (GET, POST, PUT, DELETE, etc.) for each resource URI, following RESTful interaction.
  - **Level 3** – *Hypermedia Controls (HATEOAS)*: Adds hypermedia links to responses, guiding clients on available actions, making the API more discoverable and self-explanatory.

- **Naming Conventions**:
  1. Name resources using plural nouns (e.g., `/users`, `/products`).
  2. Use verbs for actions (e.g., `/users/login`).

- **API Caching Directives**:
  - `private` / `public`
  - `no-store` / `no-cache`
  - Use of `ETag` for efficient caching and conditional requests.

- **Authentication**:
  - Although the course covered basic authentication, I’ve never used it in practice. From the start of my work, token-based authentication has been the standard.

- **API Management Tools**:
  - I just learned about API management platforms like Apigee, which help manage, secure, and monitor APIs efficiently.