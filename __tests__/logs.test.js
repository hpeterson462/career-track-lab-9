const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Log = require('../lib/models/log');
const Recipe = require('../lib/models/recipe');

describe('log-lab routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a log when a recipe is used', async () => {
    await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));
    return request(app)
      .post('/api/v1/logs')
      .send({
        recipe_id: '1',
        date_of_event: '9/22/20',
        notes: 'Great!',
        rating: 'Five stars'
      })
      .then(res => {
        expect(res.body).toEqual({
          recipe_id: '1',
          date_of_event: '9/22/20',
          notes: 'Great!',
          rating: 'Five stars'
        });
      });
  });

  it('gets all logs', async () => {
    const logs = await Promise.all([
      {
        date_of_event: '9/22/20',
        notes: 'Great!',
        rating: 'Five stars'
      },
      {
        date_of_event: '10/31/20',
        notes: 'Spooky!',
        rating: 'Five stars'
      },
      {
        date_of_event: '12/12/20',
        notes: 'Happy!',
        rating: 'Five stars'
      }
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

});