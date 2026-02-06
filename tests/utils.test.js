/**
 * Tests for utility functions
 * These functions are extracted from app.js for better testability
 */

const { formatFileSize, formatDate } = require('../public/utils.js');

describe('Utility Functions', () => {
  describe('formatFileSize', () => {
    test('should format 0 bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    test('should format bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    test('should format KB correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(2048)).toBe('2 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    test('should format MB correctly', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(5242880)).toBe('5 MB');
    });

    test('should format GB correctly', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });

    test('should handle large file sizes', () => {
      expect(formatFileSize(2147483648)).toBe('2 GB');
    });
  });

  describe('formatDate', () => {
    test('should format date correctly', () => {
      const dateString = '2024-01-15T10:30:00.000Z';
      const formatted = formatDate(dateString);
      
      // Check that it contains expected parts
      expect(formatted).toMatch(/\d{4}/); // Year
      expect(formatted).toMatch(/Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec/); // Month
      expect(formatted).toMatch(/\d{1,2}/); // Day
    });

    test('should handle different date formats', () => {
      const date1 = '2024-12-25T00:00:00.000Z';
      const date2 = '2023-06-15T15:45:30.000Z';
      
      expect(formatDate(date1)).toBeTruthy();
      expect(formatDate(date2)).toBeTruthy();
    });
  });
});

