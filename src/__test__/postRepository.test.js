import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import Post from '../models/post.model.js';
import postRepository from '../repositories/post.repository.js';

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

// Mock the Post model and its methods
jest.mock('../models/post.model.js');

describe('Post Repository Tests', () => {
  // Sample data for tests
  const testPostId = '507f1f77bcf86cd799439011';
  const testAuthor = 'testuser';
  const mockPost = {
    _id: testPostId,
    title: 'Test Post',
    content: 'This is a test post content',
    author: testAuthor,
    tags: ['test', 'unit'],
    likes: 0,
    comments: [],
    dateCreated: new Date(),
    id: testPostId // Mongoose typically adds this via toJSON transform
  };

  const mockUpdatedPost = {
    ...mockPost,
    likes: 1
  };

  const mockPostWithComment = {
    ...mockPost,
    comments: [{
      user: 'commenter',
      message: 'Test comment',
      dateCreated: expect.any(Date),
      likes: 0
    }]
  };

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  // Tests for createPost method
    describe('createPost', () => {
        test('should create a post and return the saved post data', async () => {
            const postData = {
                title: 'Test Post',
                content: 'This is a test post content',
                author: testAuthor,
                tags: ['test', 'unit']
            };

            // Мокаем save у экземпляра Post
            const saveMock = jest.spyOn(Post.prototype, 'save').mockResolvedValue(mockPost);

            const result = await postRepository.createPost(postData);

            expect(result).toEqual(mockPost);

            saveMock.mockRestore(); // чтобы не повлиять на другие тесты
        });


        test('should throw an error if save fails', async () => {
            const errorMessage = 'Database error';

            // Мокаем метод save у экземпляра Post, чтобы он выбрасывал ошибку
            const saveMock = jest.spyOn(Post.prototype, 'save').mockRejectedValue(new Error(errorMessage));

            const postData = {
                title: 'Test Post',
                content: 'This is a test post content',
                author: testAuthor,
                tags: ['test', 'unit']
            };

            await expect(postRepository.createPost(postData)).rejects.toThrow(errorMessage);

            saveMock.mockRestore();
        });
    });

        // Tests for findPostById method
  describe('findPostById', () => {
    test('should return a post when a valid ID is provided', async () => {
      // Mock the Post.findById method
      Post.findById = jest.fn().mockResolvedValue(mockPost);

      const result = await postRepository.findPostById(testPostId);

      expect(Post.findById).toHaveBeenCalledWith(testPostId);
      expect(result).toEqual(mockPost);
    });

    test('should return null when post is not found', async () => {
      // Mock the Post.findById method to return null
      Post.findById = jest.fn().mockResolvedValue(null);

      const result = await postRepository.findPostById(testPostId);

      expect(Post.findById).toHaveBeenCalledWith(testPostId);
      expect(result).toBeNull();
    });

    test('should throw an error if findById fails', async () => {
      // Mock the Post.findById method to throw an error
      const errorMessage = 'Database error';
      Post.findById = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(postRepository.findPostById(testPostId)).rejects.toThrow(errorMessage);
    });
  });

  // Tests for deletePost method
  describe('deletePost', () => {
    test('should delete a post and return the deleted post data', async () => {
      // Mock the Post.findByIdAndDelete method
      Post.findByIdAndDelete = jest.fn().mockResolvedValue(mockPost);

      const result = await postRepository.deletePost(testPostId);

      expect(Post.findByIdAndDelete).toHaveBeenCalledWith(testPostId);
      expect(result).toEqual(mockPost);
    });

    test('should return null when post is not found', async () => {
      // Mock the Post.findByIdAndDelete method to return null
      Post.findByIdAndDelete = jest.fn().mockResolvedValue(null);

      const result = await postRepository.deletePost(testPostId);

      expect(Post.findByIdAndDelete).toHaveBeenCalledWith(testPostId);
      expect(result).toBeNull();
    });

    test('should throw an error if findByIdAndDelete fails', async () => {
      // Mock the Post.findByIdAndDelete method to throw an error
      const errorMessage = 'Database error';
      Post.findByIdAndDelete = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(postRepository.deletePost(testPostId)).rejects.toThrow(errorMessage);
    });
  });

  // Tests for addLike method
  describe('addLike', () => {
    test('should increment likes and return the updated post', async () => {
      // Mock the Post.findByIdAndUpdate method
      Post.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedPost);

      const result = await postRepository.addLike(testPostId);

      expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
        testPostId,
        { $inc: { likes: 1 } },
        { new: true }
      );
      expect(result).toEqual(mockUpdatedPost);
      expect(result.likes).toBe(1);
    });

    test('should return null when post is not found', async () => {
      // Mock the Post.findByIdAndUpdate method to return null
      Post.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const result = await postRepository.addLike(testPostId);

      expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
        testPostId,
        { $inc: { likes: 1 } },
        { new: true }
      );
      expect(result).toBeNull();
    });

    test('should throw an error if findByIdAndUpdate fails', async () => {
      // Mock the Post.findByIdAndUpdate method to throw an error
      const errorMessage = 'Database error';
      Post.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(postRepository.addLike(testPostId)).rejects.toThrow(errorMessage);
    });
  });

  // Tests for getPostsByAuthor method
  describe('getPostsByAuthor', () => {
    test('should return posts by a specific author', async () => {
      // Mock the Post.find method
      const mockPosts = [mockPost, { ...mockPost, _id: 'another-id', id: 'another-id' }];
      Post.find = jest.fn().mockResolvedValue(mockPosts);

      const result = await postRepository.getPostsByAuthor(testAuthor);

      expect(Post.find).toHaveBeenCalledWith({ author: testAuthor });
      expect(result).toEqual(mockPosts);
      expect(result.length).toBe(2);
    });

    test('should return empty array when no posts are found', async () => {
      // Mock the Post.find method to return empty array
      Post.find = jest.fn().mockResolvedValue([]);

      const result = await postRepository.getPostsByAuthor(testAuthor);

      expect(Post.find).toHaveBeenCalledWith({ author: testAuthor });
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    test('should throw an error if find fails', async () => {
      // Mock the Post.find method to throw an error
      const errorMessage = 'Database error';
      Post.find = jest.fn().mockRejectedValue(new Error(errorMessage));

      await expect(postRepository.getPostsByAuthor(testAuthor)).rejects.toThrow(errorMessage);
    });
  });

  // Tests for addComment method
  describe('addComment', () => {
    test('should add a comment to a post and return the updated post', async () => {
      // Mock the Post.findByIdAndUpdate method
      Post.findByIdAndUpdate = jest.fn().mockResolvedValue(mockPostWithComment);

      const commenter = 'commenter';
      const message = 'Test comment';
      const result = await postRepository.addComment(testPostId, commenter, message);

      expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
        testPostId,
        {
          $push: {
            comments: {
              user: commenter,
              message,
              dateCreated: expect.any(Date),
              likes: 0
            }
          }
        },
        { new: true }
      );
      expect(result).toEqual(mockPostWithComment);
      expect(result.comments.length).toBe(1);
      expect(result.comments[0].user).toBe(commenter);
      expect(result.comments[0].message).toBe(message);
    });

    test('should return null when post is not found', async () => {
      // Mock the Post.findByIdAndUpdate method to return null
      Post.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const commenter = 'commenter';
      const message = 'Test comment';
      const result = await postRepository.addComment(testPostId, commenter, message);

      expect(Post.findByIdAndUpdate).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    test('should throw an error if findByIdAndUpdate fails', async () => {
      // Mock the Post.findByIdAndUpdate method to throw an error
      const errorMessage = 'Database error';
      Post.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error(errorMessage));

      const commenter = 'commenter';
      const message = 'Test comment';
      await expect(postRepository.addComment(testPostId, commenter, message)).rejects.toThrow(errorMessage);
    });
  });

  // Tests for getPostByTag method
  describe('getPostByTag', () => {
    test('should return posts with specific tags', async () => {
      // Mock the Post.find method
      const mockPosts = [mockPost, { ...mockPost, _id: 'another-id', id: 'another-id' }];
      Post.find = jest.fn().mockResolvedValue(mockPosts);

      const tagsString = 'test,unit';
      const result = await postRepository.getPostByTag(tagsString);

      expect(Post.find).toHaveBeenCalled();
      // We can't directly compare the regex objects, so we check that find was called
      expect(result).toEqual(mockPosts);
      expect(result.length).toBe(2);
    });

    test('should return empty array when no posts with tags are found', async () => {
      // Mock the Post.find method to return empty array
      Post.find = jest.fn().mockResolvedValue([]);

      const tagsString = 'nonexistent';
      const result = await postRepository.getPostByTag(tagsString);

      expect(Post.find).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    test('should throw an error if find fails', async () => {
      // Mock the Post.find method to throw an error
      const errorMessage = 'Database error';
      Post.find = jest.fn().mockRejectedValue(new Error(errorMessage));

      const tagsString = 'test,unit';
      await expect(postRepository.getPostByTag(tagsString)).rejects.toThrow(errorMessage);
    });
  });

  // Tests for getPostsByPeriod method
  describe('getPostsByPeriod', () => {
    test('should return posts within a specific date range', async () => {
      // Mock the Post.find method
      const mockPosts = [mockPost, { ...mockPost, _id: 'another-id', id: 'another-id' }];
      Post.find = jest.fn().mockResolvedValue(mockPosts);

      const dateFrom = '2023-01-01';
      const dateTo = '2023-12-31';
      const result = await postRepository.getPostsByPeriod(dateFrom, dateTo);

      expect(Post.find).toHaveBeenCalledWith({
        dateCreated: {
          $gte: expect.any(Date),
          $lte: expect.any(Date)
        }
      });
      expect(result).toEqual(mockPosts);
      expect(result.length).toBe(2);
    });

    test('should return empty array when no posts within period are found', async () => {
      // Mock the Post.find method to return empty array
      Post.find = jest.fn().mockResolvedValue([]);

      const dateFrom = '2023-01-01';
      const dateTo = '2023-12-31';
      const result = await postRepository.getPostsByPeriod(dateFrom, dateTo);

      expect(Post.find).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    test('should throw an error if find fails', async () => {
      // Mock the Post.find method to throw an error
      const errorMessage = 'Database error';
      Post.find = jest.fn().mockRejectedValue(new Error(errorMessage));

      const dateFrom = '2023-01-01';
      const dateTo = '2023-12-31';
      await expect(postRepository.getPostsByPeriod(dateFrom, dateTo)).rejects.toThrow(errorMessage);
    });
  });

  // Tests for updatePost method
  describe('updatePost', () => {
    test('should update a post and return the updated post data', async () => {
      // Mock the Post.findByIdAndUpdate method
      const updatedData = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      const mockUpdatedPost = {
        ...mockPost,
        ...updatedData
      };
      Post.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedPost);

      const result = await postRepository.updatePost(testPostId, updatedData);

      expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(testPostId, updatedData, { new: true });
      expect(result).toEqual(mockUpdatedPost);
      expect(result.title).toBe(updatedData.title);
      expect(result.content).toBe(updatedData.content);
    });

    test('should return null when post is not found', async () => {
      // Mock the Post.findByIdAndUpdate method to return null
      Post.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      const updatedData = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      const result = await postRepository.updatePost(testPostId, updatedData);

      expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(testPostId, updatedData, { new: true });
      expect(result).toBeNull();
    });

    test('should throw an error if findByIdAndUpdate fails', async () => {
      // Mock the Post.findByIdAndUpdate method to throw an error
      const errorMessage = 'Database error';
      Post.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error(errorMessage));

      const updatedData = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      await expect(postRepository.updatePost(testPostId, updatedData)).rejects.toThrow(errorMessage);
    });
  });
});
