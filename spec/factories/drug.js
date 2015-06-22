var Factory = require('rosie').Factory;
Factory.define('drug')
  .sequence('guid', id => `${id}`)
  .sequence('name', id => `app name ${id}`)
  .attr('space_guid', null);
