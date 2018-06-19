const extendSequelize = require('sequelize-extension');
const connection = require('../helpers/connection');
const dropAll = require('../helpers/dropAll');
const enhanceUpdatedBy = require('../../');

describe('enhancers', () => {
  let sequelize;
  let db;

  const reset = async () => {
    await dropAll(sequelize);
    db = {};
    db.user = sequelize.define('user', {
      username: sequelize.Sequelize.STRING(255),
      updatedBy: sequelize.Sequelize.INTEGER,
    });
    await sequelize.sync();
  };

  before(async () => {
    sequelize = connection();
    await reset();
    extendSequelize(db, {
      updatedBy: enhanceUpdatedBy(),
    });
  });

  after(async () => {
    sequelize.close();
  });

  describe('-> updatedBy:', () => {
    it('should add updatedBy when updating instances', async () => {
      const user = await db.user.create({
        username: 'test1',
      });
      user.username += '-changed';
      await user.save({
        user: { id: 2 },
      });
      expect(user.updatedBy).to.be.equal(2);
    });

    it('should add default updatedBy when updating instances without user', async () => {
      const user = await db.user.create({
        username: 'test2',
      });
      user.username += '-changed';
      await user.save();
      expect(user.updatedBy).to.be.equal(1);
    });

    it('should add updatedBy when bulk updating instances', async () => {
      await db.user.update({
        username: 'bulk-update',
      }, {
        where: { id: { ne: null } },
        user: { id: 2 },
      });
      const users = await db.user.findAll();
      users.forEach((user) => {
        expect(user.updatedBy).to.be.equal(2);
      });
    });

    it('should add default updatedBy when bulk updating instances without user', async () => {
      await db.user.update({
        username: 'bulk-update',
      }, {
        where: { id: { ne: null } },
      });
      const users = await db.user.findAll();
      users.forEach((user) => {
        expect(user.updatedBy).to.be.equal(1);
      });
    });
  });
});
