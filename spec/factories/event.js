var Factory = require('rosie').Factory;
Factory.define('event')
  .sequence('guid', id => `${id}`)
  .sequence('name', id => `app name ${id}`)
  .attr('space_guid', null);
