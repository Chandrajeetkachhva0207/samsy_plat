                    FRONTEND
                       │
                       ▼
                HTTP / HTTPS
                       │
                       ▼
              ┌─────────────────┐
              │  EXPRESS SERVER  │
              └────────┬────────┘
                       │
             ┌─────────┴─────────┐
             │                   │
             ▼                   ▼
        PUBLIC APIs         ADMIN APIs
                                 │
                                 ▼
                         JWT Authentication
                                 │
                                 ▼
                         Admin Authorization
                                 │
             ┌───────────────────┴──────────────────┐
             │                                      │
             ▼                                      ▼
       Controllers                            File Uploads
             │                                  │       │
             ▼                                  ▼       ▼
          Models                             Images    PDFs
             │
             ▼
          MongoDB
             │
             ▼
          Response
             │
             ▼
          FRONTEND