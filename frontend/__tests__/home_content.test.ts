import { heroImages, technologyItems } from '../src/data/home-content';

describe('Home Content Data', () => {
  it('should have hero images', () => {
    expect(heroImages.length).toBeGreaterThan(0);
    heroImages.forEach((img) => {
      expect(img.src).toBeDefined();
      expect(img.alt).toBeDefined();
    });
  });

  it('should have 7 technology categories', () => {
    expect(technologyItems.length).toBe(7);
  });

  it('should have valid structure for technology items', () => {
    technologyItems.forEach((item) => {
      expect(item.id).toBeDefined();
      expect(item.title).toBeDefined();
      expect(item.images.length).toBeGreaterThan(0);
      item.images.forEach((img) => {
        expect(img.src).toBeDefined();
        expect(img.tag).toBeDefined();
        expect(img.alt).toBeDefined();
      });
    });
  });
});
