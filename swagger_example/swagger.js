
module.exports = {
  openapi: '3.0.1',
  info: {
    version: '0.0.1',
    title: 'swagger 적용해보기.',
    description: 'example API',
    termsOfService: 'http://api_url/terms/',
    contact: {
      name: 'delryn',
      email: 'hidelryn@gmail.com',
      url: 'https://hidelryn@github.io'
    },
    license: {
      name: 'Apache 2.0',
      url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
    }
  },
  servers: [
    {
      url: 'http://localhost:3000/',
      description: 'Local server'
    },
    {
      url: 'https://api_url_testing',
      description: 'Testing server'
    },
    {
      url: 'https://api_url_production',
      description: 'Production server'
    }
  ],
  security: [
    {
      ApiKeyAuth: []
    }
  ],
  tags: [
    {
      name: 'test operations'
    }
  ],
  paths: {
    '/getUser': {
      get: {
        tags: ['test operations'],
        description: '유저 데이터 불러오기',
        operationId: 'getUser',
        parameters: [
          {
            name: 'id',
            in: 'query',
            "schema": {
              "$ref": "#/components/schemas/userid"
            },
            required: true
          },
        ],
        responses: {
          '200': {
            description: '유저 데이터 불러오기',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                }
              }
            }
          },
          '400': {
            description: '파라미터가 생략 돠었음',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: 'id가 생략 되었음',
                  internal_code: 'missing_parameters'
                }
              }
            }
          }
        }
      },
    },
    "/createUser": {
      post: {
        tags: ['test operations'],
        description: '유저 데이터 생성',
        operationId: 'createUser',
        parameters: [
          {
            "name": "name",
            "in": "body",
            "description": "유저 이름",
            "schema": {
              "$ref": "#/components/schemas/username"
            },
            required: true
          },
          {
            "name": "age",
            "in": "body",
            "description": "유저 나이",
            "schema": {
              "$ref": "#/components/schemas/userage"
            },
            required: true
          }
        ],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/reqUser'
              },
              required: true,
            }
          },
        },
        responses: {
          '200': {
            description: '유저 생성 완료',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/User'
                },
              }
            }
          },
          '400': {
            description: '파라미터가 생략 되었음',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Error'
                },
                example: {
                  message: '이름 또는 나이가 생략 되었다',
                  internal_code: 'invalid_parameters'
                }
              }
            }
          }
        }
      },
    },
  },
  components: {
    schemas: {
      userid: {
        type: 'string',
        description: '유저 고유 아이디',
        example: 'qjrkqnek23nvie'
      },
      username: {
        type: 'string',
        description: '유저 이름',
        example: 'delryn'
      },
      userage: {
        type: 'integer',
        description: '유저 나이',
        example: 33,
      },
      reqUser: {
        type: 'object',
        properties: {
          name: {
            $ref: '#/components/schemas/username'
          },
          age: {
            $ref: '#/components/schemas/userage'
          }
        }
      },
      User: {
        type: 'object',
        properties: {
          id: {
            $ref: '#/components/schemas/userid'
          },
          name: {
            $ref: '#/components/schemas/username'
          },
          age: {
            $ref: '#/components/schemas/userage'
          }
        }
      },
      // Users: {
      //   type: 'object',
      //   properties: {
      //     users: {
      //       type: 'array',
      //       items: {
      //         $ref: '#/components/schemas/User'
      //       }
      //     }
      //   }
      // },
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string'
          },
          internal_code: {
            type: 'string'
          }
        }
      }
    },
  }
};