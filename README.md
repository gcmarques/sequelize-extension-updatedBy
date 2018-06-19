# sequelize-extension-updatedBy

[![Build Status](https://travis-ci.org/gcmarques/sequelize-extension-updatedBy.svg?branch=master)](https://travis-ci.org/gcmarques/sequelize-extension-updatedBy)
[![codecov](https://codecov.io/gh/gcmarques/sequelize-extension-updatedBy/branch/master/graph/badge.svg)](https://codecov.io/gh/gcmarques/sequelize-extension-updatedBy)
![GitHub license](https://img.shields.io/github/license/gcmarques/sequelize-extension-updatedBy.svg)

### Installation
```bash
$ npm install --save sequelize-extension-updatedBy
```

### Usage

This library uses [sequelize-extension](https://www.npmjs.com/package/sequelize-extension) to extend sequelize models. If a model has a `updatedBy` field, this extension will automatically set `updatedBy` to `options.user.id` when an instance is updated.
```javascript
const Sequelize = require('sequelize');
const extendSequelize = require('sequelize-extension');
const enhanceUpdatedBy = require('sequelize-extension-updatedBy');

const sequelize = new Sequelize(...);

const Task = sequelize.define('task', {
  name: Sequelize.STRING(255),
});

extendSequelize([Task], {
  updatedBy: enhanceUpdatedBy(),
});

const task1 = await Task.create({...}, { user: { id: 2 } });
console.log(task1.updatedBy);
// 2

const task2 = await Task.create({...});
console.log(task2.updatedBy);
// 1 <- default userId

await Task.bulkCreate([
  {...},
  {...},
], { user: { id: 3 } });
// All created tasks will have updatedBy === 3

task1.name = 'New name';
await task1.save();
console.log(task1.updatedBy);
// 1

await Task.update(
  {...}, // values
  {
    where: {...},
    user: { id: 4 },
  },
);
// All updated tasks will have updatedBy === 4
```

### Other Extensions
[sequelize-extension-tracking](https://www.npmjs.com/package/sequelize-extension-tracking) - Automatically track sequelize instance updates.\
[sequelize-extension-createdby](https://www.npmjs.com/package/sequelize-extension-createdby) - Automatically set `createdBy` with `options.user.id` option.\
[sequelize-extension-deletedby](https://www.npmjs.com/package/sequelize-extension-deletedby) - Automatically set `deletedBy` with `options.user.id` option.\
[sequelize-extension-graphql](https://www.npmjs.com/package/sequelize-extension-graphql) - Create GraphQL schema based on sequelize models.