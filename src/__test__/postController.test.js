import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { jest, test, describe, expect, beforeEach } from '@jest/globals';
import errorHandler from '../middlewares/error.middleware.js';

// Dynamic mocking for ESM modules
await jest.unstable_mockModule('../services/post.service.js', () => ({
  default: {
    createPost: jest.fn(),
    getPostById: jest.fn(),
    deletePost: jest.fn(),
    addLike: jest.fn(),
    getPostsByAuthor: jest.fn(),
    addComment: jest.fn(),
    getPostByTag: jest.fn(),
    getPostsByPeriod: jest.fn(),
    updatePost: jest.fn()
  }
}));

// Import the mocked modules after they've been mocked
const { default: postService } = await import('../services/post.service.js');
const { default: postRoutes } = await import('../routes/post.routes.js');
import Post from '../models/post.model.js';

// Mock mongoose to prevent actual DB connections
jest.mock('mongoose', () => {
  const originalModule = jest.requireActual('mongoose');
  return {
    ...originalModule,
    connect: jest.fn().mockResolvedValue({}),
    connection: {
      close: jest.fn().mockResolvedValue(true)
    }
  };
});

// Mock the Post model methods
jest.mock('../models/post.model.js');

// Create a test app
const app = express();
app.use(express.json());
app.use('/forum', postRoutes);
app.use(errorHandler);

describe('Post Controller Integration Tests', () => {
  // Sample data for tests
  const testAuthor = 'testuser';
  const testPostId = '507f1f77bcf86cd799439011';
  const validPostData = {
    title: 'Test Post',
    content: 'This is a test post content',
    tags: ['test', 'integration']
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Tests for POST /post/:author route
  describe('POST /post/:author', () => {
    test('should create a post with valid data and return 201', async () => {
      // Mock the postService.createPost method
      const mockSavedPost = {
        id: testPostId,
        title: validPostData.title,
        content: validPostData.content,
        author: testAuthor,
        tags: validPostData.tags,
        likes: 0,
        comments: [],
        dateCreated: new Date().toISOString()
      };

      postService.createPost.mockResolvedValue(mockSavedPost);

      const response = await request(app)
        .post(`/forum/post/${testAuthor}`)
        .send(validPostData)
        .expect('Content-Type', /json/)
        .expect(201);

      expect(response.body).toEqual(mockSavedPost);
      expect(postService.createPost).toHaveBeenCalledWith(testAuthor, validPostData);
    });

    test('should return 400 when title is missing', async () => {
      const invalidData = {
        content: 'This is a test post content',
        tags: ['test', 'integration']
      };

      const response = await request(app)
        .post(`/forum/post/${testAuthor}`)
        .send(invalidData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('code', 400);
      expect(response.body).toHaveProperty('status', 'Bad request');
    });

    test('should return 400 when content is missing', async () => {
      const invalidData = {
        title: 'Test Post',
        tags: ['test', 'integration']
      };

      const response = await request(app)
        .post(`/forum/post/${testAuthor}`)
        .send(invalidData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message');
      expect(response.body).toHaveProperty('code', 400);
      expect(response.body).toHaveProperty('status', 'Bad request');
    });

    test('should handle server error during post creation', async () => {
      // Mock the postService.createPost method to throw an error
      postService.createPost.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post(`/forum/post/${testAuthor}`)
        .send(validPostData)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
      expect(response.body).toHaveProperty('code', 500);
      expect(response.body).toHaveProperty('status', 'Internal server error');
    });
  });

  // Tests for PATCH /post/:id/like route
  describe('PATCH /post/:id/like', () => {
    test('should increment likes and return updated post', async () => {
      // Mock the postService.addLike method
      const mockUpdatedPost = {
        id: testPostId,
        title: 'Test Post',
        content: 'This is a test post content',
        author: testAuthor,
        tags: ['test', 'integration'],
        likes: 1, // Incremented likes
        comments: [],
        dateCreated: new Date().toISOString()
      };

      postService.addLike.mockResolvedValue(mockUpdatedPost);

      const response = await request(app)
        .patch(`/forum/post/${testPostId}/like`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedPost);
      expect(postService.addLike).toHaveBeenCalledWith(testPostId);
    });

    test('should return 400 when post is not found', async () => {
      // Mock the postService.addLike method to throw an error with a specific message
      postService.addLike.mockRejectedValue(new Error(`Post with id ${testPostId} not found`));

      const response = await request(app)
        .patch(`/forum/post/${testPostId}/like`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message', `Post with id ${testPostId} not found`);
      expect(response.body).toHaveProperty('code', 404);
      expect(response.body).toHaveProperty('status', 'not found');
    });

    test('should handle server error during like operation', async () => {
      // Mock the postService.addLike method to throw an error
      postService.addLike.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .patch(`/forum/post/${testPostId}/like`)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
      expect(response.body).toHaveProperty('code', 500);
      expect(response.body).toHaveProperty('status', 'Internal server error');
    });

    test('should return 500 for invalid post ID format', async () => {
      const invalidId = 'invalid-id';

      // Mock postService.addLike to throw a CastError for invalid ID
      postService.addLike.mockRejectedValue(
        new mongoose.Error.CastError('ObjectId', invalidId, 'id')
      );

      const response = await request(app)
        .patch(`/forum/post/${invalidId}/like`)
        .expect('Content-Type', /json/)
        .expect(500); // The error middleware will catch this as a 500

      expect(response.body).toHaveProperty('code', 500);
      expect(response.body).toHaveProperty('status', 'Internal server error');
    });
  });

  // Tests for GET /post/:id route
  describe('GET /post/:id', () => {
    test('should return a post when it exists', async () => {
      // Mock the postService.getPostById method
      const mockPost = {
        id: testPostId,
        title: 'Test Post',
        content: 'This is a test post content',
        author: testAuthor,
        tags: ['test', 'integration'],
        likes: 0,
        comments: [],
        dateCreated: new Date().toISOString()
      };

      postService.getPostById.mockResolvedValue(mockPost);

      const response = await request(app)
        .get(`/forum/post/${testPostId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockPost);
      expect(postService.getPostById).toHaveBeenCalledWith(testPostId);
    });

    test('should return 400 when post is not found', async () => {
      // Mock the postService.getPostById method to throw an error with a specific message
      postService.getPostById.mockRejectedValue(new Error(`Post with id ${testPostId} not found`));

      const response = await request(app)
        .get(`/forum/post/${testPostId}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message', `Post with id ${testPostId} not found`);
      expect(response.body).toHaveProperty('code', 404);
      expect(response.body).toHaveProperty('status', 'not found');
    });

    test('should handle server error', async () => {
      // Mock the postService.getPostById method to throw an error
      postService.getPostById.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get(`/forum/post/${testPostId}`)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
      expect(response.body).toHaveProperty('code', 500);
      expect(response.body).toHaveProperty('status', 'Internal server error');
    });
  });

  // Tests for DELETE /post/:id route
  describe('DELETE /post/:id', () => {
    test('should delete a post and return it', async () => {
      // Mock the postService.deletePost method
      const mockDeletedPost = {
        id: testPostId,
        title: 'Test Post',
        content: 'This is a test post content',
        author: testAuthor,
        tags: ['test', 'integration'],
        likes: 0,
        comments: [],
        dateCreated: new Date().toISOString()
      };

      postService.deletePost.mockResolvedValue(mockDeletedPost);

      const response = await request(app)
        .delete(`/forum/post/${testPostId}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockDeletedPost);
      expect(postService.deletePost).toHaveBeenCalledWith(testPostId);
    });

    test('should return 400 when post is not found', async () => {
      // Mock the postService.deletePost method to throw an error with a specific message
      postService.deletePost.mockRejectedValue(new Error(`Post with id ${testPostId} not found`));

      const response = await request(app)
        .delete(`/forum/post/${testPostId}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message', `Post with id ${testPostId} not found`);
      expect(response.body).toHaveProperty('code', 404);
      expect(response.body).toHaveProperty('status', 'not found');
    });

    test('should handle server error', async () => {
      // Mock the postService.deletePost method to throw an error
      postService.deletePost.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .delete(`/forum/post/${testPostId}`)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
      expect(response.body).toHaveProperty('code', 500);
      expect(response.body).toHaveProperty('status', 'Internal server error');
    });
  });

  // Tests for GET /posts/author/:author route
  describe('GET /posts/author/:author', () => {
    test('should return posts by author', async () => {
      // Mock the postService.getPostsByAuthor method
      const mockPosts = [
        {
          id: testPostId,
          title: 'Test Post 1',
          content: 'This is test post 1',
          author: testAuthor,
          tags: ['test'],
          likes: 0,
          comments: [],
          dateCreated: new Date().toISOString()
        },
        {
          id: 'another-id',
          title: 'Test Post 2',
          content: 'This is test post 2',
          author: testAuthor,
          tags: ['test'],
          likes: 0,
          comments: [],
          dateCreated: new Date().toISOString()
        }
      ];

      postService.getPostsByAuthor.mockResolvedValue(mockPosts);

      const response = await request(app)
        .get(`/forum/posts/author/${testAuthor}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockPosts);
      expect(postService.getPostsByAuthor).toHaveBeenCalledWith(testAuthor);
    });

    test('should return 400 when no posts are found', async () => {
      // Mock the postService.getPostsByAuthor method to throw an error with a specific message
      const errorMessage = `Posts not found for author ${testAuthor}`;
      postService.getPostsByAuthor.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .get(`/forum/posts/author/${testAuthor}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message', errorMessage);
      expect(response.body).toHaveProperty('code', 404);
      expect(response.body).toHaveProperty('status', 'not found');
    });

    test('should handle server error', async () => {
      // Mock the postService.getPostsByAuthor method to throw an error
      postService.getPostsByAuthor.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get(`/forum/posts/author/${testAuthor}`)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
      expect(response.body).toHaveProperty('code', 500);
      expect(response.body).toHaveProperty('status', 'Internal server error');
    });
  });

  // Tests for PATCH /post/:id/comment/:commenter route
  describe('PATCH /post/:id/comment/:commenter', () => {
    test('should add a comment to a post', async () => {
      // Mock the postService.addComment method
      const commenter = 'commenter';
      const message = 'Test comment';
      const mockUpdatedPost = {
        id: testPostId,
        title: 'Test Post',
        content: 'This is a test post content',
        author: testAuthor,
        tags: ['test', 'integration'],
        likes: 0,
        comments: [{
          user: commenter,
          message: message,
          dateCreated: new Date().toISOString(),
          likes: 0
        }],
        dateCreated: new Date().toISOString()
      };

      postService.addComment.mockResolvedValue(mockUpdatedPost);

      const response = await request(app)
        .patch(`/forum/post/${testPostId}/comment/${commenter}`)
        .send({ message })
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedPost);
      expect(postService.addComment).toHaveBeenCalledWith(testPostId, commenter, message);
    });

    test('should return 400 when post is not found', async () => {
      // Mock the postService.addComment method to throw an error with a specific message
      const commenter = 'commenter';
      postService.addComment.mockRejectedValue(new Error(`Post with id ${testPostId} not found`));

      const response = await request(app)
        .patch(`/forum/post/${testPostId}/comment/${commenter}`)
        .send({ message: 'Test comment' })
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message', `Post with id ${testPostId} not found`);
      expect(response.body).toHaveProperty('code', 404);
      expect(response.body).toHaveProperty('status', 'not found');
    });

    test('should handle server error', async () => {
      // Mock the postService.addComment method to throw an error
      const commenter = 'commenter';
      postService.addComment.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .patch(`/forum/post/${testPostId}/comment/${commenter}`)
        .send({ message: 'Test comment' })
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
      expect(response.body).toHaveProperty('code', 500);
      expect(response.body).toHaveProperty('status', 'Internal server error');
    });
  });

  // Tests for GET /posts/tags route
  describe('GET /posts/tags', () => {
    test('should return posts with specific tags', async () => {
      // Mock the postService.getPostByTag method
      const mockPosts = [
        {
          id: testPostId,
          title: 'Test Post 1',
          content: 'This is test post 1',
          author: testAuthor,
          tags: ['test', 'javascript'],
          likes: 0,
          comments: [],
          dateCreated: new Date().toISOString()
        },
        {
          id: 'another-id',
          title: 'Test Post 2',
          content: 'This is test post 2',
          author: 'another-author',
          tags: ['test', 'nodejs'],
          likes: 0,
          comments: [],
          dateCreated: new Date().toISOString()
        }
      ];

      postService.getPostByTag.mockResolvedValue(mockPosts);

      const response = await request(app)
        .get('/forum/posts/tags?values=test,javascript')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockPosts);
      expect(postService.getPostByTag).toHaveBeenCalledWith('test,javascript');
    });

    test('should return 400 when no posts with tags are found', async () => {
      // Mock the postService.getPostByTag method to throw an error with a specific message
      const errorMessage = 'Posts with tags: nonexistent not found';
      postService.getPostByTag.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .get('/forum/posts/tags?values=nonexistent')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message', errorMessage);
      expect(response.body).toHaveProperty('code', 404);
      expect(response.body).toHaveProperty('status', 'not found');
    });

    test('should handle server error', async () => {
      // Mock the postService.getPostByTag method to throw an error
      postService.getPostByTag.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/forum/posts/tags?values=test')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
      expect(response.body).toHaveProperty('code', 500);
      expect(response.body).toHaveProperty('status', 'Internal server error');
    });
  });

  // Tests for GET /posts/period route
  describe('GET /posts/period', () => {
    test('should return posts within a specific date range', async () => {
      // Mock the postService.getPostsByPeriod method
      const mockPosts = [
        {
          id: testPostId,
          title: 'Test Post 1',
          content: 'This is test post 1',
          author: testAuthor,
          tags: ['test'],
          likes: 0,
          comments: [],
          dateCreated: new Date('2023-01-15').toISOString()
        },
        {
          id: 'another-id',
          title: 'Test Post 2',
          content: 'This is test post 2',
          author: 'another-author',
          tags: ['test'],
          likes: 0,
          comments: [],
          dateCreated: new Date('2023-01-20').toISOString()
        }
      ];

      postService.getPostsByPeriod.mockResolvedValue(mockPosts);

      const dateFrom = '2023-01-01';
      const dateTo = '2023-01-31';
      const response = await request(app)
        .get(`/forum/posts/period?dateFrom=${dateFrom}&dateTo=${dateTo}`)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockPosts);
      expect(postService.getPostsByPeriod).toHaveBeenCalledWith(dateFrom, dateTo);
    });

    test('should return 400 when no posts within period are found', async () => {
      // Mock the postService.getPostsByPeriod method to throw an error with a specific message
      const dateFrom = '2023-01-01';
      const dateTo = '2023-01-31';
      const errorMessage = `Posts between ${dateFrom} and ${dateTo} not found`;
      postService.getPostsByPeriod.mockRejectedValue(new Error(errorMessage));

      const response = await request(app)
        .get(`/forum/posts/period?dateFrom=${dateFrom}&dateTo=${dateTo}`)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message', errorMessage);
      expect(response.body).toHaveProperty('code', 404);
      expect(response.body).toHaveProperty('status', 'not found');
    });

    test('should handle server error', async () => {
      // Mock the postService.getPostsByPeriod method to throw an error
      postService.getPostsByPeriod.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/forum/posts/period?dateFrom=2023-01-01&dateTo=2023-01-31')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
      expect(response.body).toHaveProperty('code', 500);
      expect(response.body).toHaveProperty('status', 'Internal server error');
    });
  });

  // Tests for PATCH /post/:id route
  describe('PATCH /post/:id', () => {
    test('should update a post and return the updated post', async () => {
      // Mock the postService.updatePost method
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      const mockUpdatedPost = {
        id: testPostId,
        title: updateData.title,
        content: updateData.content,
        author: testAuthor,
        tags: ['test', 'integration'],
        likes: 0,
        comments: [],
        dateCreated: new Date().toISOString()
      };

      postService.updatePost.mockResolvedValue(mockUpdatedPost);

      const response = await request(app)
        .patch(`/forum/post/${testPostId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(mockUpdatedPost);
      expect(postService.updatePost).toHaveBeenCalledWith(testPostId, updateData);
    });

    test('should return 400 when post is not found', async () => {
      // Mock the postService.updatePost method to throw an error with a specific message
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      postService.updatePost.mockRejectedValue(new Error(`Post with id ${testPostId} not found`));

      const response = await request(app)
        .patch(`/forum/post/${testPostId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('message', `Post with id ${testPostId} not found`);
      expect(response.body).toHaveProperty('code', 404);
      expect(response.body).toHaveProperty('status', 'not found');
    });

    test('should handle server error', async () => {
      // Mock the postService.updatePost method to throw an error
      const updateData = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      postService.updatePost.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .patch(`/forum/post/${testPostId}`)
        .send(updateData)
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('message', 'Database error');
      expect(response.body).toHaveProperty('code', 500);
      expect(response.body).toHaveProperty('status', 'Internal server error');
    });
  });
});
