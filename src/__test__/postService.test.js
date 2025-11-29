import {beforeEach, describe, expect, jest, test} from '@jest/globals';

// Dynamic mocking for ESM modules
await jest.unstable_mockModule('../repositories/post.repository.js', () => ({
  default: {
    createPost: jest.fn(),
    findPostById: jest.fn(),
    deletePost: jest.fn(),
    addLike: jest.fn(),
    getPostsByAuthor: jest.fn(),
    addComment: jest.fn(),
    getPostByTag: jest.fn(),
    getPostsByPeriod: jest.fn(),
    updatePost: jest.fn()
  }
}));

// Import the mocked module after it's been mocked
const { default: postRepository } = await import('../repositories/post.repository.js');
const { default: postService } = await import('../services/post.service.js');

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

describe('Post Service Tests', () => {
  // Sample data for tests
  const testPostId = '507f1f77bcf86cd799439011';
  const testAuthor = 'testuser';
  const mockPost = {
    id: testPostId,
    title: 'Test Post',
    content: 'This is a test post content',
    author: testAuthor,
    tags: ['test', 'unit'],
    likes: 0,
    comments: [],
    dateCreated: new Date()
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
    jest.clearAllMocks();

  });

  // Tests for createPost method
  describe('createPost', () => {
    test('should create a post and return the created post data', async () => {
      // Mock the postRepository.createPost method
      postRepository.createPost.mockResolvedValue(mockPost);

      const postData = {
        title: 'Test Post',
        content: 'This is a test post content',
        tags: ['test', 'unit']
      };

      const result = await postService.createPost(testAuthor, postData);

      expect(postRepository.createPost).toHaveBeenCalledWith({ ...postData, author: testAuthor });
      expect(result).toEqual(mockPost);
    });

    test('should throw an error if repository throws an error', async () => {
      // Mock the postRepository.createPost method to throw an error
      const errorMessage = 'Database error';
      postRepository.createPost.mockRejectedValue(new Error(errorMessage));

      const postData = {
        title: 'Test Post',
        content: 'This is a test post content',
        tags: ['test', 'unit']
      };

      await expect(postService.createPost(testAuthor, postData)).rejects.toThrow(errorMessage);
      expect(postRepository.createPost).toHaveBeenCalledWith({ ...postData, author: testAuthor });
    });
  });

  // Tests for getPostById method
  describe('getPostById', () => {
    test('should return a post when a valid ID is provided', async () => {
      // Mock the postRepository.findPostById method
      postRepository.findPostById.mockResolvedValue(mockPost);

      const result = await postService.getPostById(testPostId);

      expect(postRepository.findPostById).toHaveBeenCalledWith(testPostId);
      expect(result).toEqual(mockPost);
    });

    test('should throw an error when post is not found', async () => {
      // Mock the postRepository.findPostById method to return null
      postRepository.findPostById.mockResolvedValue(null);

      await expect(postService.getPostById(testPostId)).rejects.toThrow(`Post with id ${testPostId} not found`);
      expect(postRepository.findPostById).toHaveBeenCalledWith(testPostId);
    });

    test('should throw an error if repository throws an error', async () => {
      // Mock the postRepository.findPostById method to throw an error
      const errorMessage = 'Database error';
      postRepository.findPostById.mockRejectedValue(new Error(errorMessage));

      await expect(postService.getPostById(testPostId)).rejects.toThrow(errorMessage);
      expect(postRepository.findPostById).toHaveBeenCalledWith(testPostId);
    });
  });

  // Tests for deletePost method
  describe('deletePost', () => {
    test('should delete a post and return the deleted post data', async () => {
      // Mock the postRepository.deletePost method
      postRepository.deletePost.mockResolvedValue(mockPost);

      const result = await postService.deletePost(testPostId);

      expect(postRepository.deletePost).toHaveBeenCalledWith(testPostId);
      expect(result).toEqual(mockPost);
    });

    test('should throw an error when post is not found', async () => {
      // Mock the postRepository.deletePost method to return null
      postRepository.deletePost.mockResolvedValue(null);

      await expect(postService.deletePost(testPostId)).rejects.toThrow(`Post with id ${testPostId} not found`);
      expect(postRepository.deletePost).toHaveBeenCalledWith(testPostId);
    });

    test('should throw an error if repository throws an error', async () => {
      // Mock the postRepository.deletePost method to throw an error
      const errorMessage = 'Database error';
      postRepository.deletePost.mockRejectedValue(new Error(errorMessage));

      await expect(postService.deletePost(testPostId)).rejects.toThrow(errorMessage);
      expect(postRepository.deletePost).toHaveBeenCalledWith(testPostId);
    });
  });

  // Tests for addLike method
  describe('addLike', () => {
    test('should increment likes and return the updated post', async () => {
      // Mock the postRepository.addLike method
      postRepository.addLike.mockResolvedValue(mockUpdatedPost);

      const result = await postService.addLike(testPostId);

      expect(postRepository.addLike).toHaveBeenCalledWith(testPostId);
      expect(result).toEqual(mockUpdatedPost);
      expect(result.likes).toBe(1);
    });

    test('should throw an error when post is not found', async () => {
      // Mock the postRepository.addLike method to return null
      postRepository.addLike.mockResolvedValue(null);

      await expect(postService.addLike(testPostId)).rejects.toThrow(`Post with id ${testPostId} not found`);
      expect(postRepository.addLike).toHaveBeenCalledWith(testPostId);
    });

    test('should throw an error if repository throws an error', async () => {
      // Mock the postRepository.addLike method to throw an error
      const errorMessage = 'Database error';
      postRepository.addLike.mockRejectedValue(new Error(errorMessage));

      await expect(postService.addLike(testPostId)).rejects.toThrow(errorMessage);
      expect(postRepository.addLike).toHaveBeenCalledWith(testPostId);
    });
  });

  // Tests for getPostsByAuthor method
  describe('getPostsByAuthor', () => {
    test('should return posts by a specific author', async () => {
      // Mock the postRepository.getPostsByAuthor method
      const mockPosts = [mockPost, { ...mockPost, id: 'another-id' }];
      postRepository.getPostsByAuthor.mockResolvedValue(mockPosts);

      const result = await postService.getPostsByAuthor(testAuthor);

      expect(postRepository.getPostsByAuthor).toHaveBeenCalledWith(testAuthor);
      expect(result).toEqual(mockPosts);
      expect(result.length).toBe(2);
    });

    test('should throw an error when no posts are found', async () => {
      // Mock the postRepository.getPostsByAuthor method to return empty array
      postRepository.getPostsByAuthor.mockResolvedValue([]);

      await expect(postService.getPostsByAuthor(testAuthor)).rejects.toThrow(`No posts found for author ${testAuthor}`);
      expect(postRepository.getPostsByAuthor).toHaveBeenCalledWith(testAuthor);
    });

    test('should throw an error if repository throws an error', async () => {
      // Mock the postRepository.getPostsByAuthor method to throw an error
      const errorMessage = 'Database error';
      postRepository.getPostsByAuthor.mockRejectedValue(new Error(errorMessage));

      await expect(postService.getPostsByAuthor(testAuthor)).rejects.toThrow(errorMessage);
      expect(postRepository.getPostsByAuthor).toHaveBeenCalledWith(testAuthor);
    });
  });

  // Tests for addComment method
  describe('addComment', () => {
    test('should add a comment to a post and return the updated post', async () => {
      // Mock the postRepository.addComment method
      postRepository.addComment.mockResolvedValue(mockPostWithComment);

      const commenter = 'commenter';
      const message = 'Test comment';
      const result = await postService.addComment(testPostId, commenter, message);

      expect(postRepository.addComment).toHaveBeenCalledWith(testPostId, commenter, message);
      expect(result).toEqual(mockPostWithComment);
      expect(result.comments.length).toBe(1);
      expect(result.comments[0].user).toBe(commenter);
      expect(result.comments[0].message).toBe(message);
    });

    test('should throw an error when post is not found', async () => {
      // Mock the postRepository.addComment method to return null
      postRepository.addComment.mockResolvedValue(null);

      const commenter = 'commenter';
      const message = 'Test comment';
      await expect(postService.addComment(testPostId, commenter, message)).rejects.toThrow(`Post with id ${testPostId} not found`);
      expect(postRepository.addComment).toHaveBeenCalledWith(testPostId, commenter, message);
    });

    test('should throw an error if repository throws an error', async () => {
      // Mock the postRepository.addComment method to throw an error
      const errorMessage = 'Database error';
      postRepository.addComment.mockRejectedValue(new Error(errorMessage));

      const commenter = 'commenter';
      const message = 'Test comment';
      await expect(postService.addComment(testPostId, commenter, message)).rejects.toThrow(errorMessage);
      expect(postRepository.addComment).toHaveBeenCalledWith(testPostId, commenter, message);
    });
  });

  // Tests for getPostByTag method
  describe('getPostByTag', () => {
    test('should return posts with specific tags', async () => {
      // Mock the postRepository.getPostByTag method
      const mockPosts = [mockPost, { ...mockPost, id: 'another-id' }];
      postRepository.getPostByTag.mockResolvedValue(mockPosts);

      const tagsString = 'test,unit';
      const result = await postService.getPostByTag(tagsString);

      expect(postRepository.getPostByTag).toHaveBeenCalledWith(tagsString);
      expect(result).toEqual(mockPosts);
      expect(result.length).toBe(2);
    });

    test('should throw an error when no posts with tags are found', async () => {
      // Mock the postRepository.getPostByTag method to return empty array
      postRepository.getPostByTag.mockResolvedValue([]);

      const tagsString = 'nonexistent';
      await expect(postService.getPostByTag(tagsString)).rejects.toThrow(`No posts found with tags: ${tagsString}`);
      expect(postRepository.getPostByTag).toHaveBeenCalledWith(tagsString);
    });

    test('should throw an error if repository throws an error', async () => {
      // Mock the postRepository.getPostByTag method to throw an error
      const errorMessage = 'Database error';
      postRepository.getPostByTag.mockRejectedValue(new Error(errorMessage));

      const tagsString = 'test,unit';
      await expect(postService.getPostByTag(tagsString)).rejects.toThrow(errorMessage);
      expect(postRepository.getPostByTag).toHaveBeenCalledWith(tagsString);
    });
  });

  // Tests for getPostsByPeriod method
  describe('getPostsByPeriod', () => {
    test('should return posts within a specific date range', async () => {
      // Mock the postRepository.getPostsByPeriod method
      const mockPosts = [mockPost, { ...mockPost, id: 'another-id' }];
      postRepository.getPostsByPeriod.mockResolvedValue(mockPosts);

      const dateFrom = '2023-01-01';
      const dateTo = '2023-12-31';
      const result = await postService.getPostsByPeriod(dateFrom, dateTo);

      expect(postRepository.getPostsByPeriod).toHaveBeenCalledWith(dateFrom, dateTo);
      expect(result).toEqual(mockPosts);
      expect(result.length).toBe(2);
    });

    test('should throw an error when no posts within period are found', async () => {
      // Mock the postRepository.getPostsByPeriod method to return empty array
      postRepository.getPostsByPeriod.mockResolvedValue([]);

      const dateFrom = '2023-01-01';
      const dateTo = '2023-12-31';
      await expect(postService.getPostsByPeriod(dateFrom, dateTo)).rejects.toThrow(`No posts found between ${dateFrom} and ${dateTo}`);
      expect(postRepository.getPostsByPeriod).toHaveBeenCalledWith(dateFrom, dateTo);
    });

    test('should throw an error if repository throws an error', async () => {
      // Mock the postRepository.getPostsByPeriod method to throw an error
      const errorMessage = 'Database error';
      postRepository.getPostsByPeriod.mockRejectedValue(new Error(errorMessage));

      const dateFrom = '2023-01-01';
      const dateTo = '2023-12-31';
      await expect(postService.getPostsByPeriod(dateFrom, dateTo)).rejects.toThrow(errorMessage);
      expect(postRepository.getPostsByPeriod).toHaveBeenCalledWith(dateFrom, dateTo);
    });
  });

  // Tests for updatePost method
  describe('updatePost', () => {
    test('should update a post and return the updated post data', async () => {
      // Mock the postRepository.updatePost method
      const updatedData = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      const mockUpdatedPost = {
        ...mockPost,
        ...updatedData
      };
      postRepository.updatePost.mockResolvedValue(mockUpdatedPost);

      const result = await postService.updatePost(testPostId, updatedData);

      expect(postRepository.updatePost).toHaveBeenCalledWith(testPostId, updatedData);
      expect(result).toEqual(mockUpdatedPost);
      expect(result.title).toBe(updatedData.title);
      expect(result.content).toBe(updatedData.content);
    });

    test('should throw an error when post is not found', async () => {
      // Mock the postRepository.updatePost method to return null
      postRepository.updatePost.mockResolvedValue(null);

      const updatedData = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      await expect(postService.updatePost(testPostId, updatedData)).rejects.toThrow(`Post with id ${testPostId} not found`);
      expect(postRepository.updatePost).toHaveBeenCalledWith(testPostId, updatedData);
    });

    test('should throw an error if repository throws an error', async () => {
      // Mock the postRepository.updatePost method to throw an error
      const errorMessage = 'Database error';
      postRepository.updatePost.mockRejectedValue(new Error(errorMessage));

      const updatedData = {
        title: 'Updated Title',
        content: 'Updated content'
      };
      await expect(postService.updatePost(testPostId, updatedData)).rejects.toThrow(errorMessage);
      expect(postRepository.updatePost).toHaveBeenCalledWith(testPostId, updatedData);
    });
  });
});
