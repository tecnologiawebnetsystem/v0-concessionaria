export const swaggerSpec = {
  openapi: "3.0.3",
  info: {
    title: "Nacional Veiculos API",
    description: `
## API da Concessionaria Nacional Veiculos

Esta API permite gerenciar todos os recursos da concessionaria, incluindo:
- **Autenticacao** - Login, registro e gerenciamento de sessao
- **Veiculos** - CRUD completo de veiculos, busca e filtros
- **Propostas** - Gerenciamento de propostas de compra
- **Test Drives** - Agendamento e gerenciamento de test drives
- **Avaliacoes** - Avaliacao de veiculos para compra/troca
- **Contatos** - Mensagens e consultas dos clientes
- **Blog** - Posts e categorias do blog
- **Administracao** - Gestao de marcas, categorias, banners e configuracoes

### Autenticacao
A API usa autenticacao baseada em cookies HTTP-only. Apos o login, um token JWT e armazenado em cookie seguro.

### Codigos de Status
- \`200\` - Sucesso
- \`201\` - Criado com sucesso
- \`400\` - Requisicao invalida
- \`401\` - Nao autenticado
- \`403\` - Sem permissao
- \`404\` - Nao encontrado
- \`500\` - Erro interno do servidor
    `,
    version: "1.0.0",
    contact: {
      name: "Suporte Tecnico",
      email: "suporte@nacionalveiculos.com.br",
      url: "https://nacionalveiculos.com.br"
    },
    license: {
      name: "Proprietaria",
      url: "https://nacionalveiculos.com.br/termos"
    }
  },
  servers: [
    {
      url: "/api",
      description: "Servidor de Producao"
    }
  ],
  tags: [
    { name: "Autenticacao", description: "Endpoints de autenticacao e sessao" },
    { name: "Veiculos", description: "Gerenciamento de veiculos" },
    { name: "Propostas", description: "Propostas de compra de veiculos" },
    { name: "Test Drives", description: "Agendamento de test drives" },
    { name: "Avaliacoes", description: "Avaliacao de veiculos para compra/troca" },
    { name: "Contatos", description: "Mensagens e consultas" },
    { name: "Blog", description: "Posts e categorias do blog" },
    { name: "Marcas", description: "Marcas de veiculos" },
    { name: "Categorias", description: "Categorias de veiculos" },
    { name: "Banners", description: "Banners promocionais" },
    { name: "Admin", description: "Endpoints administrativos" }
  ],
  paths: {
    // ==================== AUTENTICACAO ====================
    "/auth/register": {
      post: {
        tags: ["Autenticacao"],
        summary: "Registrar novo usuario",
        description: "Cria uma nova conta de usuario no sistema",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "email", "password"],
                properties: {
                  name: { type: "string", example: "Joao Silva" },
                  email: { type: "string", format: "email", example: "joao@email.com" },
                  password: { type: "string", minLength: 6, example: "senha123" },
                  phone: { type: "string", example: "(11) 99999-9999" }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Usuario criado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          },
          "400": {
            description: "Email ja cadastrado ou dados invalidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          }
        }
      }
    },
    "/auth/login": {
      post: {
        tags: ["Autenticacao"],
        summary: "Fazer login",
        description: "Autentica o usuario e retorna um token JWT em cookie HTTP-only",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["email", "password"],
                properties: {
                  email: { type: "string", format: "email", example: "admin@nacionalveiculos.com.br" },
                  password: { type: "string", example: "admin123" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Login realizado com sucesso",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AuthResponse" }
              }
            }
          },
          "401": {
            description: "Credenciais invalidas",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          }
        }
      }
    },
    "/auth/logout": {
      post: {
        tags: ["Autenticacao"],
        summary: "Fazer logout",
        description: "Encerra a sessao do usuario e remove o cookie de autenticacao",
        responses: {
          "200": {
            description: "Logout realizado com sucesso",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Logout realizado com sucesso" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/auth/me": {
      get: {
        tags: ["Autenticacao"],
        summary: "Obter usuario atual",
        description: "Retorna os dados do usuario autenticado",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Dados do usuario",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/User" }
              }
            }
          },
          "401": {
            description: "Nao autenticado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          }
        }
      }
    },

    // ==================== VEICULOS ====================
    "/admin/vehicles": {
      get: {
        tags: ["Veiculos"],
        summary: "Listar veiculos",
        description: "Retorna lista paginada de veiculos com filtros opcionais",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "page", in: "query", schema: { type: "integer", default: 1 }, description: "Pagina atual" },
          { name: "limit", in: "query", schema: { type: "integer", default: 20 }, description: "Itens por pagina" },
          { name: "search", in: "query", schema: { type: "string" }, description: "Busca por nome/modelo" },
          { name: "brand_id", in: "query", schema: { type: "string", format: "uuid" }, description: "Filtrar por marca" },
          { name: "category_id", in: "query", schema: { type: "string", format: "uuid" }, description: "Filtrar por categoria" },
          { name: "status", in: "query", schema: { type: "string", enum: ["available", "sold", "reserved"] }, description: "Status do veiculo" },
          { name: "min_price", in: "query", schema: { type: "number" }, description: "Preco minimo" },
          { name: "max_price", in: "query", schema: { type: "number" }, description: "Preco maximo" },
          { name: "min_year", in: "query", schema: { type: "integer" }, description: "Ano minimo" },
          { name: "max_year", in: "query", schema: { type: "integer" }, description: "Ano maximo" }
        ],
        responses: {
          "200": {
            description: "Lista de veiculos",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    vehicles: {
                      type: "array",
                      items: { $ref: "#/components/schemas/Vehicle" }
                    },
                    total: { type: "integer" },
                    page: { type: "integer" },
                    totalPages: { type: "integer" }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Veiculos"],
        summary: "Criar veiculo",
        description: "Adiciona um novo veiculo ao catalogo",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VehicleInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Veiculo criado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Vehicle" }
              }
            }
          },
          "400": {
            description: "Dados invalidos",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          }
        }
      }
    },
    "/admin/vehicles/{id}": {
      get: {
        tags: ["Veiculos"],
        summary: "Obter veiculo",
        description: "Retorna os detalhes de um veiculo especifico",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" }, description: "ID do veiculo" }
        ],
        responses: {
          "200": {
            description: "Detalhes do veiculo",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Vehicle" }
              }
            }
          },
          "404": {
            description: "Veiculo nao encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Error" }
              }
            }
          }
        }
      },
      put: {
        tags: ["Veiculos"],
        summary: "Atualizar veiculo",
        description: "Atualiza os dados de um veiculo existente",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" }, description: "ID do veiculo" }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/VehicleInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Veiculo atualizado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Vehicle" }
              }
            }
          }
        }
      },
      delete: {
        tags: ["Veiculos"],
        summary: "Excluir veiculo",
        description: "Remove um veiculo do catalogo",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" }, description: "ID do veiculo" }
        ],
        responses: {
          "200": {
            description: "Veiculo excluido",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string", example: "Veiculo excluido com sucesso" }
                  }
                }
              }
            }
          }
        }
      }
    },

    // ==================== PROPOSTAS ====================
    "/proposals": {
      get: {
        tags: ["Propostas"],
        summary: "Listar propostas",
        description: "Retorna lista de propostas do usuario autenticado ou todas (admin)",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["pending", "analyzing", "approved", "rejected", "completed"] } }
        ],
        responses: {
          "200": {
            description: "Lista de propostas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Proposal" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Propostas"],
        summary: "Criar proposta",
        description: "Envia uma nova proposta de compra para um veiculo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ProposalInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Proposta criada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Proposal" }
              }
            }
          }
        }
      }
    },
    "/admin/proposals": {
      get: {
        tags: ["Propostas", "Admin"],
        summary: "Listar todas propostas (Admin)",
        description: "Retorna todas as propostas do sistema",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "status", in: "query", schema: { type: "string" } },
          { name: "page", in: "query", schema: { type: "integer" } },
          { name: "limit", in: "query", schema: { type: "integer" } }
        ],
        responses: {
          "200": {
            description: "Lista de propostas",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    proposals: { type: "array", items: { $ref: "#/components/schemas/Proposal" } },
                    total: { type: "integer" }
                  }
                }
              }
            }
          }
        }
      },
      patch: {
        tags: ["Propostas", "Admin"],
        summary: "Atualizar status da proposta",
        description: "Atualiza o status de uma proposta",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "status"],
                properties: {
                  id: { type: "integer" },
                  status: { type: "string", enum: ["pending", "analyzing", "approved", "rejected", "completed"] },
                  notes: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Proposta atualizada"
          }
        }
      }
    },

    // ==================== TEST DRIVES ====================
    "/test-drives": {
      get: {
        tags: ["Test Drives"],
        summary: "Listar test drives",
        description: "Retorna lista de test drives agendados",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Lista de test drives",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/TestDrive" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Test Drives"],
        summary: "Agendar test drive",
        description: "Agenda um novo test drive para um veiculo",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/TestDriveInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Test drive agendado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TestDrive" }
              }
            }
          }
        }
      }
    },
    "/admin/test-drives": {
      get: {
        tags: ["Test Drives", "Admin"],
        summary: "Listar todos test drives (Admin)",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Lista de test drives"
          }
        }
      },
      patch: {
        tags: ["Test Drives", "Admin"],
        summary: "Atualizar status do test drive",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["id", "status"],
                properties: {
                  id: { type: "integer" },
                  status: { type: "string", enum: ["pending", "confirmed", "completed", "cancelled"] },
                  notes: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Test drive atualizado"
          }
        }
      }
    },

    // ==================== AVALIACOES ====================
    "/evaluations": {
      post: {
        tags: ["Avaliacoes"],
        summary: "Solicitar avaliacao",
        description: "Envia uma solicitacao de avaliacao de veiculo para venda/troca",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/EvaluationInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Avaliacao solicitada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Evaluation" }
              }
            }
          }
        }
      }
    },
    "/admin/evaluations": {
      get: {
        tags: ["Avaliacoes", "Admin"],
        summary: "Listar avaliacoes (Admin)",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Lista de avaliacoes"
          }
        }
      },
      patch: {
        tags: ["Avaliacoes", "Admin"],
        summary: "Atualizar avaliacao",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  id: { type: "integer" },
                  status: { type: "string" },
                  estimated_value: { type: "number" },
                  notes: { type: "string" }
                }
              }
            }
          }
        },
        responses: {
          "200": {
            description: "Avaliacao atualizada"
          }
        }
      }
    },

    // ==================== CONTATOS ====================
    "/inquiries": {
      post: {
        tags: ["Contatos"],
        summary: "Enviar mensagem",
        description: "Envia uma mensagem/consulta para a concessionaria",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/InquiryInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Mensagem enviada"
          }
        }
      }
    },

    // ==================== BLOG ====================
    "/admin/blog": {
      get: {
        tags: ["Blog"],
        summary: "Listar posts",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "status", in: "query", schema: { type: "string", enum: ["draft", "published", "archived"] } }
        ],
        responses: {
          "200": {
            description: "Lista de posts",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/BlogPost" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Blog"],
        summary: "Criar post",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BlogPostInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Post criado"
          }
        }
      }
    },
    "/admin/blog/{id}": {
      get: {
        tags: ["Blog"],
        summary: "Obter post",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          "200": {
            description: "Detalhes do post"
          }
        }
      },
      put: {
        tags: ["Blog"],
        summary: "Atualizar post",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BlogPostInput" }
            }
          }
        },
        responses: {
          "200": {
            description: "Post atualizado"
          }
        }
      },
      delete: {
        tags: ["Blog"],
        summary: "Excluir post",
        security: [{ cookieAuth: [] }],
        parameters: [
          { name: "id", in: "path", required: true, schema: { type: "string", format: "uuid" } }
        ],
        responses: {
          "200": {
            description: "Post excluido"
          }
        }
      }
    },

    // ==================== MARCAS ====================
    "/admin/brands": {
      get: {
        tags: ["Marcas"],
        summary: "Listar marcas",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Lista de marcas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Brand" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Marcas"],
        summary: "Criar marca",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BrandInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Marca criada"
          }
        }
      }
    },

    // ==================== CATEGORIAS ====================
    "/admin/categories": {
      get: {
        tags: ["Categorias"],
        summary: "Listar categorias",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Lista de categorias",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Category" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Categorias"],
        summary: "Criar categoria",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/CategoryInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Categoria criada"
          }
        }
      }
    },

    // ==================== BANNERS ====================
    "/admin/banners": {
      get: {
        tags: ["Banners"],
        summary: "Listar banners",
        security: [{ cookieAuth: [] }],
        responses: {
          "200": {
            description: "Lista de banners",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Banner" }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ["Banners"],
        summary: "Criar banner",
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/BannerInput" }
            }
          }
        },
        responses: {
          "201": {
            description: "Banner criado"
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "auth-token",
        description: "Token JWT armazenado em cookie HTTP-only apos login"
      }
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          error: { type: "string", example: "Mensagem de erro" }
        }
      },
      AuthResponse: {
        type: "object",
        properties: {
          message: { type: "string", example: "Login realizado com sucesso" },
          user: { $ref: "#/components/schemas/User" }
        }
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Joao Silva" },
          email: { type: "string", format: "email", example: "joao@email.com" },
          phone: { type: "string", example: "(11) 99999-9999" },
          role: { type: "string", enum: ["user", "seller", "admin", "super_admin"], example: "user" },
          avatar_url: { type: "string", nullable: true },
          is_active: { type: "boolean", example: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" }
        }
      },
      Vehicle: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string", example: "Honda Civic EXL 2.0" },
          slug: { type: "string", example: "honda-civic-exl-2-0" },
          model: { type: "string", example: "Civic" },
          year: { type: "integer", example: 2023 },
          price: { type: "number", example: 145000 },
          mileage: { type: "integer", example: 25000 },
          color: { type: "string", example: "Preto" },
          fuel_type: { type: "string", enum: ["flex", "gasoline", "diesel", "electric", "hybrid"], example: "flex" },
          transmission: { type: "string", enum: ["manual", "automatic", "cvt"], example: "automatic" },
          engine: { type: "string", example: "2.0" },
          description: { type: "string" },
          brand_id: { type: "string", format: "uuid" },
          brand_name: { type: "string", example: "Honda" },
          category_id: { type: "string", format: "uuid" },
          category_name: { type: "string", example: "Sedan" },
          status: { type: "string", enum: ["available", "sold", "reserved"], example: "available" },
          is_featured: { type: "boolean", example: false },
          is_new: { type: "boolean", example: false },
          published: { type: "boolean", example: true },
          features: { type: "array", items: { type: "string" } },
          specifications: { type: "object" },
          images: { type: "array", items: { $ref: "#/components/schemas/VehicleImage" } },
          views_count: { type: "integer" },
          inquiries_count: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" }
        }
      },
      VehicleInput: {
        type: "object",
        required: ["name", "model", "year", "price", "brand_id", "category_id"],
        properties: {
          name: { type: "string" },
          model: { type: "string" },
          year: { type: "integer" },
          price: { type: "number" },
          mileage: { type: "integer" },
          color: { type: "string" },
          fuel_type: { type: "string" },
          transmission: { type: "string" },
          engine: { type: "string" },
          description: { type: "string" },
          brand_id: { type: "string", format: "uuid" },
          category_id: { type: "string", format: "uuid" },
          status: { type: "string" },
          is_featured: { type: "boolean" },
          is_new: { type: "boolean" },
          published: { type: "boolean" },
          features: { type: "array", items: { type: "string" } },
          specifications: { type: "object" },
          images: { type: "array", items: { type: "string" } }
        }
      },
      VehicleImage: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          url: { type: "string" },
          alt_text: { type: "string" },
          is_primary: { type: "boolean" },
          display_order: { type: "integer" }
        }
      },
      Proposal: {
        type: "object",
        properties: {
          id: { type: "integer" },
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          cpf: { type: "string" },
          vehicle_name: { type: "string" },
          vehicle_slug: { type: "string" },
          vehicle_price: { type: "number" },
          proposed_price: { type: "number" },
          payment_method: { type: "string", enum: ["cash", "financing", "consortium"] },
          message: { type: "string" },
          has_trade_in: { type: "boolean" },
          trade_in_brand: { type: "string", nullable: true },
          trade_in_model: { type: "string", nullable: true },
          trade_in_year: { type: "string", nullable: true },
          trade_in_mileage: { type: "string", nullable: true },
          status: { type: "string", enum: ["pending", "analyzing", "approved", "rejected", "completed"] },
          notes: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" }
        }
      },
      ProposalInput: {
        type: "object",
        required: ["name", "email", "phone", "cpf", "vehicle_name", "vehicle_slug", "vehicle_price", "proposed_price", "payment_method"],
        properties: {
          name: { type: "string", example: "Maria Santos" },
          email: { type: "string", example: "maria@email.com" },
          phone: { type: "string", example: "(11) 98888-7777" },
          cpf: { type: "string", example: "123.456.789-00" },
          vehicle_name: { type: "string", example: "Honda Civic EXL 2.0" },
          vehicle_slug: { type: "string", example: "honda-civic-exl-2-0" },
          vehicle_price: { type: "number", example: 145000 },
          proposed_price: { type: "number", example: 140000 },
          payment_method: { type: "string", enum: ["cash", "financing", "consortium"] },
          message: { type: "string" },
          has_trade_in: { type: "boolean" },
          trade_in_brand: { type: "string" },
          trade_in_model: { type: "string" },
          trade_in_year: { type: "string" },
          trade_in_mileage: { type: "string" }
        }
      },
      TestDrive: {
        type: "object",
        properties: {
          id: { type: "integer" },
          customer_name: { type: "string" },
          customer_email: { type: "string" },
          customer_phone: { type: "string" },
          vehicle_id: { type: "integer" },
          preferred_date: { type: "string", format: "date" },
          preferred_time: { type: "string" },
          message: { type: "string" },
          status: { type: "string", enum: ["pending", "confirmed", "completed", "cancelled"] },
          notes: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" }
        }
      },
      TestDriveInput: {
        type: "object",
        required: ["customer_name", "customer_email", "customer_phone", "vehicle_id", "preferred_date", "preferred_time"],
        properties: {
          customer_name: { type: "string" },
          customer_email: { type: "string" },
          customer_phone: { type: "string" },
          vehicle_id: { type: "integer" },
          preferred_date: { type: "string", format: "date" },
          preferred_time: { type: "string" },
          message: { type: "string" }
        }
      },
      Evaluation: {
        type: "object",
        properties: {
          id: { type: "integer" },
          customer_name: { type: "string" },
          customer_email: { type: "string" },
          customer_phone: { type: "string" },
          brand: { type: "string" },
          model: { type: "string" },
          version: { type: "string" },
          year: { type: "string" },
          mileage: { type: "integer" },
          color: { type: "string" },
          fuel_type: { type: "string" },
          transmission: { type: "string" },
          condition: { type: "string" },
          city: { type: "string" },
          message: { type: "string" },
          status: { type: "string" },
          estimated_value: { type: "number", nullable: true },
          notes: { type: "string", nullable: true },
          created_at: { type: "string", format: "date-time" }
        }
      },
      EvaluationInput: {
        type: "object",
        required: ["customer_name", "customer_email", "customer_phone", "brand", "model", "year", "mileage"],
        properties: {
          customer_name: { type: "string" },
          customer_email: { type: "string" },
          customer_phone: { type: "string" },
          brand: { type: "string" },
          model: { type: "string" },
          version: { type: "string" },
          year: { type: "string" },
          mileage: { type: "integer" },
          color: { type: "string" },
          fuel_type: { type: "string" },
          transmission: { type: "string" },
          condition: { type: "string" },
          city: { type: "string" },
          message: { type: "string" }
        }
      },
      InquiryInput: {
        type: "object",
        required: ["name", "email", "phone", "message"],
        properties: {
          name: { type: "string" },
          email: { type: "string" },
          phone: { type: "string" },
          message: { type: "string" },
          type: { type: "string", enum: ["general", "vehicle", "financing", "trade_in"] },
          vehicle_id: { type: "string", format: "uuid", nullable: true }
        }
      },
      BlogPost: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          slug: { type: "string" },
          excerpt: { type: "string" },
          content: { type: "string" },
          featured_image: { type: "string" },
          status: { type: "string", enum: ["draft", "published", "archived"] },
          is_featured: { type: "boolean" },
          views_count: { type: "integer" },
          author_id: { type: "string", format: "uuid" },
          meta_title: { type: "string" },
          meta_description: { type: "string" },
          meta_keywords: { type: "string" },
          published_at: { type: "string", format: "date-time", nullable: true },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" }
        }
      },
      BlogPostInput: {
        type: "object",
        required: ["title", "content"],
        properties: {
          title: { type: "string" },
          excerpt: { type: "string" },
          content: { type: "string" },
          featured_image: { type: "string" },
          status: { type: "string" },
          is_featured: { type: "boolean" },
          categories: { type: "array", items: { type: "string", format: "uuid" } },
          meta_title: { type: "string" },
          meta_description: { type: "string" },
          meta_keywords: { type: "string" }
        }
      },
      Brand: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          slug: { type: "string" },
          logo_url: { type: "string" },
          description: { type: "string" },
          display_order: { type: "integer" },
          is_active: { type: "boolean" },
          created_at: { type: "string", format: "date-time" }
        }
      },
      BrandInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          logo_url: { type: "string" },
          description: { type: "string" },
          display_order: { type: "integer" },
          is_active: { type: "boolean" }
        }
      },
      Category: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          slug: { type: "string" },
          description: { type: "string" },
          icon: { type: "string" },
          display_order: { type: "integer" },
          is_active: { type: "boolean" },
          created_at: { type: "string", format: "date-time" }
        }
      },
      CategoryInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          icon: { type: "string" },
          display_order: { type: "integer" },
          is_active: { type: "boolean" }
        }
      },
      Banner: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          title: { type: "string" },
          subtitle: { type: "string" },
          image_url: { type: "string" },
          mobile_image_url: { type: "string" },
          link_url: { type: "string" },
          link_text: { type: "string" },
          position: { type: "string" },
          display_order: { type: "integer" },
          is_active: { type: "boolean" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          created_at: { type: "string", format: "date-time" }
        }
      },
      BannerInput: {
        type: "object",
        required: ["title", "image_url"],
        properties: {
          title: { type: "string" },
          subtitle: { type: "string" },
          image_url: { type: "string" },
          mobile_image_url: { type: "string" },
          link_url: { type: "string" },
          link_text: { type: "string" },
          position: { type: "string" },
          display_order: { type: "integer" },
          is_active: { type: "boolean" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" }
        }
      }
    }
  }
}
