const _ = require('lodash');

function enhanceUpdatedBy() {
  return function enhance(db, hooks, settings) {
    const { utils } = settings;
    _.each(db, (model) => {
      if (utils.isModel(model) && _.has(utils.getRawAttributes(model), 'updatedBy')) {
        const name = utils.getName(model);

        hooks[name].beforeCreate.push((instance, options) => {
          instance.updatedBy = options.user.id;
        });

        hooks[name].beforeBulkCreate.push((instances, options) => {
          _.each(instances, (instance) => { instance.updatedBy = options.user.id; });
        });

        hooks[name].beforeUpdate.push((instance, options) => {
          instance.updatedBy = options.user.id;
        });

        hooks[name].beforeBulkUpdate.push((options) => {
          options.fields.push('updatedBy');
          options.attributes.updatedBy = options.user.id;
        });
      }
    });
  }
}
module.exports = enhanceUpdatedBy;
